use anchor_lang::prelude::*;

#[account]
pub struct Platform {
    pub authority: Pubkey,
    pub total_events: u64,
    pub total_bets: u64,
    pub total_volume: u64,
    pub bump: u8,
}

impl Platform {
    pub const LEN: usize = 8 + // discriminator
        32 + // authority
        8 +  // total_events
        8 +  // total_bets
        8 +  // total_volume
        1;   // bump
}
