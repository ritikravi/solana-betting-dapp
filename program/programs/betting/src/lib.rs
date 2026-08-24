use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;
pub mod errors;

use instructions::*;

declare_id!("BET1111111111111111111111111111111111111111");

#[program]
pub mod betting {
    use super::*;

    /// Initialize the betting platform
    pub fn initialize_platform(ctx: Context<InitializePlatform>) -> Result<()> {
        instructions::initialize_platform::handler(ctx)
    }

    /// Create a new betting event
    pub fn create_event(
        ctx: Context<CreateEvent>,
        event_id: u64,
        title: String,
        description: String,
        category: String,
        outcomes: Vec<String>,
        start_time: i64,
        close_time: i64,
    ) -> Result<()> {
        instructions::create_event::handler(
            ctx,
            event_id,
            title,
            description,
            category,
            outcomes,
            start_time,
            close_time,
        )
    }

    /// Place a bet on an event
    pub fn place_bet(
        ctx: Context<PlaceBet>,
        event_id: u64,
        outcome_index: u8,
        amount: u64,
    ) -> Result<()> {
        instructions::place_bet::handler(ctx, event_id, outcome_index, amount)
    }

    /// Close an event (stop accepting bets)
    pub fn close_event(ctx: Context<CloseEvent>, event_id: u64) -> Result<()> {
        instructions::close_event::handler(ctx, event_id)
    }

    /// Resolve an event with the winning outcome
    pub fn resolve_event(
        ctx: Context<ResolveEvent>,
        event_id: u64,
        winning_outcome_index: u8,
    ) -> Result<()> {
        instructions::resolve_event::handler(ctx, event_id, winning_outcome_index)
    }

    /// Claim payout for a winning bet
    pub fn claim_payout(ctx: Context<ClaimPayout>, event_id: u64) -> Result<()> {
        instructions::claim_payout::handler(ctx, event_id)
    }
}
