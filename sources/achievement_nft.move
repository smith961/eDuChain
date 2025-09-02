// ===== Achievement NFT Module =====
module educhain::achievement_nft;
    
    use sui::display;
    use sui::package;
    use sui::vec_set::{Self, VecSet};
    use std::string::{Self, String};

    public struct AchievementNFT has key, store {
        id: UID,
        module_id: ID,
        completion_date: u64,
        score: u8,
        tier: u8, // 1=bronze, 2=silver, 3=gold
        owner: address,
    }

      
    public struct UserProfile has key,store {
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
    


    public struct ACHIEVEMENT_NFT has drop {}

    fun init(otw: ACHIEVEMENT_NFT, ctx: &mut TxContext) {
        let keys = vector[
            string::utf8(b"name"),
            string::utf8(b"description"),
            string::utf8(b"image_url"),
            string::utf8(b"tier"),
            string::utf8(b"score"),
            string::utf8(b"completion_date"),
        ];

        let values = vector[
            string::utf8(b"Learning Achievement NFT"),
            string::utf8(b"Achievement NFT for completing a learning module"),
            string::utf8(b"https://api.learningplatform.sui/nft/{id}"),
            string::utf8(b"{tier}"),
            string::utf8(b"{score}%"),
            string::utf8(b"{completion_date}"),
        ];

        let publisher = package::claim(otw, ctx);
        let display = display::new_with_fields<AchievementNFT>(
            &publisher, keys, values, ctx
        );
        
        display::update_version(&mut display);

        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));
    }

    public fun mint_achievement_nft(
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

    
    
    // View functions for NFT metadata
    public fun get_nft_details(nft: &AchievementNFT): (ID, u64, u8, u8, address) {
        (nft.module_id, nft.completion_date, nft.score, nft.tier, nft.owner)
    }

    public fun get_tier_name(tier: u8): String {
        if (tier == 1) {
            string::utf8(b"Bronze")
        } else if (tier == 2) {
            string::utf8(b"Silver")
        } else if (tier == 3) {
            string::utf8(b"Gold")
        } else {
            string::utf8(b"Unknown")
        }
    }
