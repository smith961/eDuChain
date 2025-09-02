// ===== Achievement NFT Module =====
module educhain::achievement_nft;
    
    use sui::display;
    use sui::package;
    use std::string::{Self, String};

    public struct AchievementNFT has key, store {
        id: UID,
        module_id: ID,
        completion_date: u64,
        score: u8,
        tier: u8, // 1=bronze, 2=silver, 3=gold
        owner: address,
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
