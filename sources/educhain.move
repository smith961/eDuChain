// ===== Learning Platform Core Module =====
module educhain::educhain;
    
    use sui::clock::{Self, Clock};
    use sui::event;
    use sui::vec_set::{Self, VecSet};
    
    // ===== Error Constants =====
    const E_PLATFORM_PAUSED: u64 = 7;
    const E_INVALID_SCORE: u64 = 8;
    
    // ===== Capability Objects =====
    public struct AdminCap has key, store {
        id: UID,
    }
    
    public struct CreatorCap has key, store {
        id: UID,
        creator: address,
    }
   
    // ===== Core Objects =====
    public struct LearningPlatform has key {
        id: UID,
        admin: address,
        total_modules: u64,
        total_learners: u64,
        platform_fee_bps: u64, // basis points (100 = 1%)
        treasury: address,
        is_paused: bool,
        version: u64,
    }
   
    public struct LearningModule has key, store {
        id: UID,
        title: String,
        description: String,
        content_hash: String, // IPFS hash
        creator: address,
        price: u64, // in MIST (SUI smallest unit)
        xp_reward: u64,
        nft_tier: u8, // 0=none, 1=bronze, 2=silver, 3=gold
        difficulty: u8, // 1-5
        estimated_duration: u64, // minutes
        is_active: bool,
        created_at: u64,
        total_completions: u64,
        rating_sum: u64,
        rating_count: u64,
    }
    
    public struct UserProfile has key {
        id: UID,
        user_address: address,
        total_xp: u64,
        level: u64,
        completed_modules: VecSet<ID>, // Set of completed module IDs
        achievement_nfts: vector<ID>,
        streak_days: u64,
        last_activity: u64,
        created_at: u64,
        total_spent: u64,
    }
    
    public struct ModuleCompletion has key, store {
        id: UID,
        user: address,
        module_id: ID,
        completion_time: u64,
        score: u8, // 0-100
        time_taken: u64, // minutes
        attempts: u8,
        rating: u8, // 1-5 stars
    }
   
    public struct CompletionProof has key {
        id: UID,
        user: address,
        module_id: ID,
        proof_hash: String,
        timestamp: u64,
        verified: bool,
    }
    
    

    










    // ===== Events =====
     public struct ModuleCreated has copy, drop {
        module_id: ID,
        creator: address,
        title: String,
        price: u64,
        xp_reward: u64,
        timestamp: u64,
    }

    public struct ModuleCompleted has copy, drop {
        user: address,
        module_id: ID,
        xp_earned: u64,
        score: u8,
        completion_time: u64,
        nft_minted: bool,
    }

    public struct LevelUp has copy, drop {
        user: address,
        old_level: u64,
        new_level: u64,
        total_xp: u64,
    }

    public struct PaymentProcessed has copy, drop {
        payer: address,
        module_id: ID,
        amount: u64,
        creator_share: u64,
        platform_fee: u64,
    }

    // ===== Initialization Functions =====
    fun init(ctx: &mut TxContext) {
        // Create admin capability
        let admin_cap = AdminCap {
            id: object::new(ctx),
        };

        // Create the main platform object
        let platform = LearningPlatform {
            id: object::new(ctx),
            admin: tx_context::sender(ctx),
            total_modules: 0,
            total_learners: 0,
            platform_fee_bps: 500, // 5%
            treasury: tx_context::sender(ctx),
            is_paused: false,
            version: 1,
        };

        // Transfer admin capability to deployer
        transfer::transfer(admin_cap, tx_context::sender(ctx));
        // Make platform shared so anyone can interact with it
        transfer::share_object(platform);
    }

    // ===== User Management =====
    public entry fun create_user_profile(
        platform: &mut LearningPlatform,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(!platform.is_paused, E_PLATFORM_PAUSED);
        
        let user_address = tx_context::sender(ctx);
        let current_time = clock::timestamp_ms(clock);
        
        let profile = UserProfile {
            id: object::new(ctx),
            user_address,
            total_xp: 0,
            level: 1,
            completed_modules: vec_set::empty(),
            achievement_nfts: vector::empty(),
            streak_days: 0,
            last_activity: current_time,
            created_at: current_time,
            total_spent: 0,
        };
        
        platform.total_learners = platform.total_learners + 1;
        transfer::transfer(profile, user_address);
    }
    


    // ===== Module Management =====
    public entry fun create_module(
        platform: &mut LearningPlatform,
        title: String,
        description: String,
        content_hash: String,
        price: u64,
        xp_reward: u64,
        nft_tier: u8,
        difficulty: u8,
        estimated_duration: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(!platform.is_paused, E_PLATFORM_PAUSED);
        assert!(difficulty >= 1 && difficulty <= 5, E_INVALID_SCORE);
        assert!(nft_tier <= 3, E_INVALID_SCORE);
        
        let creator = tx_context::sender(ctx);
        let current_time = clock::timestamp_ms(clock);
        
        let moduleObject = LearningModule {
            id: object::new(ctx),
            title,
            description,
            content_hash,
            creator,
            price,
            xp_reward,
            nft_tier,
            difficulty,
            estimated_duration,
            is_active: true,
            created_at: current_time,
            total_completions: 0,
            rating_sum: 0,
            rating_count: 0,
        };
        
        let module_id = object::id(&moduleObject);
        platform.total_modules = platform.total_modules + 1;
        
        // Emit event
        event::emit(ModuleCreated {
            module_id,
            creator,
            title,
            price,
            xp_reward,
            timestamp: current_time,
        });
        
        // Transfer module to creator (they can choose to share it or keep it private)
        transfer::transfer(moduleObject, creator);
    }

    public entry fun share_module(module: LearningModule) {
        transfer::share_object(module);
    }

    // ===== Learning & Completion =====
    public entry fun complete_module(
        platform: &mut LearningPlatform,
        module: &mut LearningModule,
        profile: &mut UserProfile,
        payment: Option<Coin<SUI>>,
        proof_hash: String,
        score: u8,
        time_taken: u64,
        rating: u8,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(!platform.is_paused, E_PLATFORM_PAUSED);
        assert!(module.is_active, E_MODULE_INACTIVE);
        assert!(score <= 100, E_INVALID_SCORE);
        assert!(rating >= 1 && rating <= 5, E_INVALID_SCORE);
        
        let user = tx_context::sender(ctx);
        let module_id = object::id(module);
        let current_time = clock::timestamp_ms(clock);
        
        // Check if already completed
        assert!(!vec_set::contains(&profile.completed_modules, &module_id), E_ALREADY_COMPLETED);
        
        // Handle payment if required
        if (module.price > 0) {
            assert!(option::is_some(&payment), E_INSUFFICIENT_PAYMENT);
            let payment_coin = option::extract(&mut payment);
            let payment_amount = coin::value(&payment_coin);
            assert!(payment_amount >= module.price, E_INSUFFICIENT_PAYMENT);
            
            // Calculate platform fee
            let platform_fee = (module.price * platform.platform_fee_bps) / 10000;
            let creator_share = module.price - platform_fee;
            
            // Split payment
            let platform_fee_coin = coin::split(&mut payment_coin, platform_fee, ctx);
            let creator_coin = coin::split(&mut payment_coin, creator_share, ctx);
            
            // Send payments
            transfer::public_transfer(creator_coin, module.creator);
            transfer::public_transfer(platform_fee_coin, platform.treasury);
            
            // Return any excess
            if (coin::value(&payment_coin) > 0) {
                transfer::public_transfer(payment_coin, user);
            } else {
                coin::destroy_zero(payment_coin);
            };
            
            // Update user spending
            profile.total_spent = profile.total_spent + module.price;
            
            // Emit payment event
            event::emit(PaymentProcessed {
                payer: user,
                module_id,
                amount: payment_amount,
                creator_share,
                platform_fee,
            });
        } else if (option::is_some(&payment)) {
            // Return payment if module is free
            let payment_coin = option::extract(&mut payment);
            transfer::public_transfer(payment_coin, user);
        };
        
        // Create completion proof
        let proof = CompletionProof {
            id: object::new(ctx),
            user,
            module_id,
            proof_hash,
            timestamp: current_time,
            verified: verify_completion(proof_hash, user, module_id),
        };
        
        assert!(proof.verified, E_INVALID_PROOF);
        
        // Create completion record
        let completion = ModuleCompletion {
            id: object::new(ctx),
            user,
            module_id,
            completion_time: current_time,
            score,
            time_taken,
            attempts: 1, // Can be enhanced to track multiple attempts
            rating,
        };
        
        // Update user profile
        vec_set::insert(&mut profile.completed_modules, module_id);
        profile.total_xp = profile.total_xp + module.xp_reward;
        profile.last_activity = current_time;
        
        // Calculate level up
        let old_level = profile.level;
        let new_level = calculate_level(profile.total_xp);
        profile.level = new_level;
        
        // Update streak
        update_streak(profile, current_time);
        
        // Update module stats
        module.total_completions = module.total_completions + 1;
        module.rating_sum = module.rating_sum + (rating as u64);
        module.rating_count = module.rating_count + 1;
        
        // Handle NFT minting
        let nft_minted = if (module.nft_tier > 0) {
            mint_achievement_nft(profile, module_id, module.nft_tier, score, ctx);
            true
        } else {
            false
        };
        
        // Emit events
        event::emit(ModuleCompleted {
            user,
            module_id,
            xp_earned: module.xp_reward,
            score,
            completion_time: current_time,
            nft_minted,
        });
        
        if (new_level > old_level) {
            event::emit(LevelUp {
                user,
                old_level,
                new_level,
                total_xp: profile.total_xp,
            });
        };
        
        // Store completion proof and record
        transfer::transfer(proof, user);
        transfer::transfer(completion, user);
        
        // Destroy empty option
        option::destroy_none(payment);
    }

    // ===== Admin Functions =====
    public entry fun pause_platform(
        _: &AdminCap,
        platform: &mut LearningPlatform,
    ) {
        platform.is_paused = true;
    }

    public entry fun unpause_platform(
        _: &AdminCap,
        platform: &mut LearningPlatform,
    ) {
        platform.is_paused = false;
    }

    public entry fun update_platform_fee(
        _: &AdminCap,
        platform: &mut LearningPlatform,
        new_fee_bps: u64,
    ) {
        assert!(new_fee_bps <= 2000, E_NOT_AUTHORIZED); // Max 20%
        platform.platform_fee_bps = new_fee_bps;
    }

    public entry fun update_treasury(
        _: &AdminCap,
        platform: &mut LearningPlatform,
        new_treasury: address,
    ) {
        platform.treasury = new_treasury;
    }

    // ===== View Functions =====
    public fun get_user_stats(profile: &UserProfile): (u64, u64, u64, u64, u64) {
        (
            profile.total_xp,
            profile.level,
            vec_set::size(&profile.completed_modules),
            profile.streak_days,
            profile.total_spent
        )
    }

    public fun get_module_stats(module: &LearningModule): (u64, u64, u64, u64, u64) {
        let avg_rating = if (module.rating_count > 0) {
            module.rating_sum / module.rating_count
        } else { 0 };
        
        (
            module.price,
            module.xp_reward,
            module.total_completions,
            avg_rating,
            module.difficulty as u64
        )
    }

    public fun get_platform_stats(platform: &LearningPlatform): (u64, u64, u64, bool) {
        (
            platform.total_modules,
            platform.total_learners,
            platform.platform_fee_bps,
            platform.is_paused
        )
    }

    public fun has_completed_module(profile: &UserProfile, module_id: ID): bool {
        vec_set::contains(&profile.completed_modules, &module_id)
    }

    // ===== Helper Functions =====
    fun verify_completion(proof_hash: String, user: address, module_id: ID): bool {
        // Simplified verification - in production, implement oracle-based verification
        // Could integrate with Sui oracles or use commit-reveal schemes
        !string::is_empty(&proof_hash) && user != @0x0
    }

    fun calculate_level(total_xp: u64): u64 {
        // Progressive XP requirements: 1000, 2500, 5000, 8000, 12000, etc.
        if (total_xp < 1000) { 1 }
        else if (total_xp < 3500) { 2 }  // +2500
        else if (total_xp < 8500) { 3 }  // +5000
        else if (total_xp < 16500) { 4 } // +8000
        else if (total_xp < 28500) { 5 } // +12000
        else { 
            // Each level after 5 requires 15000 more XP
            6 + (total_xp - 28500) / 15000
        }
    }

    fun update_streak(profile: &mut UserProfile, current_time: u64) {
        let one_day_ms = 86400000; // milliseconds in a day
        let time_diff = current_time - profile.last_activity;
        
        if (time_diff <= one_day_ms * 2) {
            // Within streak window (allowing for up to 2 days gap)
            profile.streak_days = profile.streak_days + 1;
        } else {
            // Streak broken, start new streak
            profile.streak_days = 1;
        };
    }

    fun mint_achievement_nft(
        profile: &mut UserProfile, 
        module_id: ID, 
        tier: u8, 
        score: u8, 
        ctx: &mut TxContext
    ) {
        // Create unique NFT for this achievement
        let nft = AchievementNFT {
            id: object::new(ctx),
            module_id,
            completion_date: tx_context::epoch(ctx),
            score,
            tier,
            owner: profile.user_address,
        };
        
        let nft_id = object::id(&nft);
        vector::push_back(&mut profile.achievement_nfts, nft_id);
        
        // Transfer NFT to user
        transfer::transfer(nft, profile.user_address);
    }






