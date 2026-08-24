use anchor_lang::prelude::*;
use crate::state::{BettingEvent, EventStatus};
use crate::errors::BettingError;

#[derive(Accounts)]
#[instruction(event_id: u64)]
pub struct CloseEvent<'info> {
    #[account(
        mut,
        seeds = [b"event", event_id.to_le_bytes().as_ref()],
        bump = event.bump,
        has_one = authority @ BettingError::Unauthorized
    )]
    pub event: Account<'info, BettingEvent>,
    
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<CloseEvent>, _event_id: u64) -> Result<()> {
    let event = &mut ctx.accounts.event;
    
    require!(
        event.status == EventStatus::Open,
        BettingError::EventClosed
    );
    
    event.status = EventStatus::Closed;
    
    msg!("Event {} closed for betting", event.event_id);
    
    Ok(())
}
