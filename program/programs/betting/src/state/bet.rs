use anchor_lang::prelude::*;

#[account]
pub struct Bet {
    pub bettor: Pubkey,
    pub event_id: u64,
    pub outcome_index: u8,
    pub amount: u64,
    pub potential_payout: u64,
    pub claimed: bool,
    pub timestamp: i64,
    pub bump: u8,
}

impl Bet {
    pub const LEN: usize = 8 + // discriminator
        32 + // bettor
        8 +  // event_id
        1 +  // outcome_index
        8 +  // amount
        8 +  // potential_payout
        1 +  // claimed
        8 +  // timestamp
        1;   // bump
}
