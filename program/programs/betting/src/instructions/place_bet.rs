use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};
use crate::state::{Platform, BettingEvent, Bet};
use crate::errors::BettingError;

#[derive(Accounts)]
#[instruction(event_id: u64)]
pub struct PlaceBet<'info> {
    #[account(
        mut,
        seeds = [b"platform"],
        bump = platform.bump
    )]
    pub platform: Account<'info, Platform>,
    
    #[account(
        mut,
        seeds = [b"event", event_id.to_le_bytes().as_ref()],
        bump = event.bump
    )]
    pub event: Account<'info, BettingEvent>,
    
    #[account(
        init,
        payer = bettor,
        space = Bet::LEN,
        seeds = [
            b"bet",
            event_id.to_le_bytes().as_ref(),
            bettor.key().as_ref(),
            &platform.total_bets.to_le_bytes()
        ],
        bump
    )]
    pub bet: Account<'info, Bet>,
    
    #[account(mut)]
    pub bettor: Signer<'info>,
    
    /// CHECK: PDA to hold event funds
    #[account(
        mut,
        seeds = [b"vault", event_id.to_le_bytes().as_ref()],
        bump
    )]
    pub vault: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<PlaceBet>,
    event_id: u64,
    outcome_index: u8,
    amount: u64,
) -> Result<()> {
    let event = &ctx.accounts.event;
    let current_time = Clock::get()?.unix_timestamp;
    
    // Validation
    require!(amount > 0, BettingError::InvalidBetAmount);
    require!(
        event.can_bet(current_time),
        BettingError::EventNotOpen
    );
    require!(
        (outcome_index as usize) < event.outcomes.len(),
        BettingError::InvalidOutcome
    );
    
    // Transfer SOL from bettor to vault
    transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.bettor.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
            },
        ),
        amount,
    )?;
    
    // Calculate potential payout (simple 1.8x multiplier for MVP)
    let potential_payout = amount
        .checked_mul(180)
        .ok_or(BettingError::ArithmeticOverflow)?
        .checked_div(100)
        .ok_or(BettingError::ArithmeticOverflow)?;
    
    // Update bet account
    let bet = &mut ctx.accounts.bet;
    bet.bettor = ctx.accounts.bettor.key();
    bet.event_id = event_id;
    bet.outcome_index = outcome_index;
    bet.amount = amount;
    bet.potential_payout = potential_payout;
    bet.claimed = false;
    bet.timestamp = current_time;
    bet.bump = ctx.bumps.bet;
    
    // Update event
    let event = &mut ctx.accounts.event;
    event.total_pool = event.total_pool
        .checked_add(amount)
        .ok_or(BettingError::ArithmeticOverflow)?;
    event.total_bets = event.total_bets
        .checked_add(1)
        .ok_or(BettingError::ArithmeticOverflow)?;
    event.outcome_pools[outcome_index as usize] = event.outcome_pools[outcome_index as usize]
        .checked_add(amount)
        .ok_or(BettingError::ArithmeticOverflow)?;
    
    // Update platform
    let platform = &mut ctx.accounts.platform;
    platform.total_bets = platform.total_bets
        .checked_add(1)
        .ok_or(BettingError::ArithmeticOverflow)?;
    platform.total_volume = platform.total_volume
        .checked_add(amount)
        .ok_or(BettingError::ArithmeticOverflow)?;
    
    msg!(
        "Bet placed: {} SOL on outcome {} for event {}",
        amount as f64 / 1_000_000_000.0,
        outcome_index,
        event_id
    );
    
    Ok(())
}
