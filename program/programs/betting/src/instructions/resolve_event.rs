use anchor_lang::prelude::*;
use crate::state::{BettingEvent, EventStatus};
use crate::errors::BettingError;

#[derive(Accounts)]
#[instruction(event_id: u64)]
pub struct ResolveEvent<'info> {
    #[account(
        mut,
        seeds = [b"event", event_id.to_le_bytes().as_ref()],
        bump = event.bump,
        has_one = authority @ BettingError::Unauthorized
    )]
    pub event: Account<'info, BettingEvent>,
    
    pub authority: Signer<'info>,
}

pub fn handler(
    ctx: Context<ResolveEvent>,
    _event_id: u64,
    winning_outcome_index: u8,
) -> Result<()> {
    let event = &mut ctx.accounts.event;
    
    require!(
        event.status == EventStatus::Closed || event.status == EventStatus::Open,
        BettingError::EventAlreadyResolved
    );
    
    require!(
        (winning_outcome_index as usize) < event.outcomes.len(),
        BettingError::InvalidOutcome
    );
    
    event.status = EventStatus::Resolved;
    event.winning_outcome = Some(winning_outcome_index);
    
    msg!(
        "Event {} resolved: Winner is outcome {}",
        event.event_id,
        winning_outcome_index
    );
    
    Ok(())
}
