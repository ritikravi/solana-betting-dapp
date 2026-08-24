use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum EventStatus {
    Created,
    Open,
    Closed,
    Resolved,
    Cancelled,
}

#[account]
pub struct BettingEvent {
    pub event_id: u64,
    pub authority: Pubkey,
    pub title: String,
    pub description: String,
    pub category: String,
    pub outcomes: Vec<String>,
    pub outcome_pools: Vec<u64>,
    pub status: EventStatus,
    pub start_time: i64,
    pub close_time: i64,
    pub winning_outcome: Option<u8>,
    pub total_pool: u64,
    pub total_bets: u64,
    pub bump: u8,
}

impl BettingEvent {
    pub const MAX_TITLE_LEN: usize = 100;
    pub const MAX_DESC_LEN: usize = 500;
    pub const MAX_CATEGORY_LEN: usize = 50;
    pub const MAX_OUTCOME_LEN: usize = 50;
    pub const MAX_OUTCOMES: usize = 10;

    pub fn space(outcomes_count: usize) -> usize {
        8 + // discriminator
        8 + // event_id
        32 + // authority
        4 + Self::MAX_TITLE_LEN + // title
        4 + Self::MAX_DESC_LEN + // description
        4 + Self::MAX_CATEGORY_LEN + // category
        4 + (outcomes_count * (4 + Self::MAX_OUTCOME_LEN)) + // outcomes vec
        4 + (outcomes_count * 8) + // outcome_pools vec
        1 + // status enum
        8 + // start_time
        8 + // close_time
        1 + 1 + // winning_outcome option
        8 + // total_pool
        8 + // total_bets
        1 + // bump
        100 // padding
    }

    pub fn is_active(&self) -> bool {
        self.status == EventStatus::Open
    }

    pub fn can_bet(&self, current_time: i64) -> bool {
        self.status == EventStatus::Open && current_time < self.close_time
    }
}
