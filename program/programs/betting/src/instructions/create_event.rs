use anchor_lang::prelude::*;
use crate::state::{Platform, BettingEvent, EventStatus};
use crate::errors::BettingError;

#[derive(Accounts)]
#[instruction(event_id: u64)]
pub struct CreateEvent<'info> {
    #[account(
        mut,
        seeds = [b"platform"],
        bump = platform.bump,
        has_one = authority @ BettingError::Unauthorized
    )]
    pub platform: Account<'info, Platform>,
    
    #[account(
        init,
        payer = authority,
        space = BettingEvent::space(2), // Default to 2 outcomes for now
        seeds = [b"event", event_id.to_le_bytes().as_ref()],
        bump
    )]
    pub event: Account<'info, BettingEvent>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreateEvent>,
    event_id: u64,
    title: String,
    description: String,
    category: String,
    outcomes: Vec<String>,
    start_time: i64,
    close_time: i64,
) -> Result<()> {
    // Validation
    require!(
        title.len() <= BettingEvent::MAX_TITLE_LEN,
        BettingError::TitleTooLong
    );
    require!(
        description.len() <= BettingEvent::MAX_DESC_LEN,
        BettingError::DescriptionTooLong
    );
    require!(
        category.len() <= BettingEvent::MAX_CATEGORY_LEN,
        BettingError::CategoryTooLong
    );
    require!(
        outcomes.len() >= 2 && outcomes.len() <= BettingEvent::MAX_OUTCOMES,
        BettingError::TooManyOutcomes
    );
    
    for outcome in &outcomes {
        require!(
            outcome.len() <= BettingEvent::MAX_OUTCOME_LEN,
            BettingError::OutcomeTooLong
        );
    }
    
    let current_time = Clock::get()?.unix_timestamp;
    require!(
        start_time >= current_time && close_time > start_time,
        BettingError::InvalidTimeRange
    );
    
    let event = &mut ctx.accounts.event;
    let platform = &mut ctx.accounts.platform;
    
    event.event_id = event_id;
    event.authority = ctx.accounts.authority.key();
    event.title = title;
    event.description = description;
    event.category = category;
    event.outcomes = outcomes.clone();
    event.outcome_pools = vec![0; outcomes.len()];
    event.status = EventStatus::Open;
    event.start_time = start_time;
    event.close_time = close_time;
    event.winning_outcome = None;
    event.total_pool = 0;
    event.total_bets = 0;
    event.bump = ctx.bumps.event;
    
    platform.total_events = platform.total_events
        .checked_add(1)
        .ok_or(BettingError::ArithmeticOverflow)?;
    
    msg!("Event created: {} (ID: {})", event.title, event_id);
    
    Ok(())
}
