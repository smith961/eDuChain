// ===== Leaderboard Module =====
module educhain::leaderboard;
    
    use sui::vec_map::{Self, VecMap};
    
    

    public struct Leaderboard has key {
        id: UID,
        top_learners_xp: VecMap<address, u64>,
        top_creators_earnings: VecMap<address, u64>,
        season: u64,
        last_updated: u64,
    }

    public struct LeaderboardUpdate has copy, drop {
        season: u64,
        top_learner: address,
        top_learner_xp: u64,
        top_creator: address,
        top_creator_earnings: u64,
    }

    public entry fun create_leaderboard(ctx: &mut TxContext) {
        let leaderboard = Leaderboard {
            id: object::new(ctx),
            top_learners_xp: vec_map::empty(),
            top_creators_earnings: vec_map::empty(),
            season: 1,
            last_updated: tx_context::epoch(ctx),
        };
        
        transfer::share_object(leaderboard);
    }

    public entry fun update_learner_score(
        leaderboard: &mut Leaderboard,
        user: address,
        total_xp: u64,
    ) {
        if (vec_map::contains(&leaderboard.top_learners_xp, &user)) {
            let current_xp = vec_map::get_mut(&mut leaderboard.top_learners_xp, &user);
            *current_xp = total_xp;
        } else {
            vec_map::insert(&mut leaderboard.top_learners_xp, user, total_xp);
        };
    }

    public fun get_top_learners(leaderboard: &Leaderboard, limit: u64): vector<address> {
        // Simplified - in production, implement proper sorting
        let (users, _scores) = vec_map::into_keys_values(leaderboard.top_learners_xp);
        let result = vector::empty<address>();
        let i = 0;
        let len = vector::length(&users);
        let actual_limit = if (limit < len) { limit } else { len };
        
        while (i < actual_limit) {
            vector::push_back(&mut result, *vector::borrow(&users, i));
            i = i + 1;
        };
        
        result
    }
