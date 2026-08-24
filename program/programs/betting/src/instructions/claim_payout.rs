use anchor_lang::prelude::*;
use crate::state::{BettingEvent, Bet, EventStatus};
use crate::errors::BettingError;

#[derive(Accounts)]
#[instruction(event_id: u64)]
pub struct ClaimPayout<'info> {
    #[account(
        seeds = [b"event", event_id.to_le_bytes().as_ref()],
        bump = event.bump
    )]
    pub event: Account<'info, BettingEvent>,
    
    #[account(
        mut,
        seeds = [
            b"bet",
            event_id.to_le_bytes().as_ref(),
            bettor.key().as_ref(),
            // Note: We'd need the bet index here, simplified for MVP
        ],
        bump = bet.bump,
        has_one = bettor @ BettingError::Unauthorized
    )]
    pub bet: Account<'info, Bet>,
    
    #[account(mut)]
    pub bettor: Signer<'info>,
    
    /// CHECK: PDA vault holding event funds
    #[account(
        mut,
        seeds = [b"vault", event_id.to_le_bytes().as_ref()],
        bump
    )]
    pub vault: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<ClaimPayout>, event_id: u64) -> Result<()> {
    let event = &ctx.accounts.event;
    let bet = &mut ctx.accounts.bet;
    
    // Validation
    require!(
        event.status == EventStatus::Resolved,
        BettingError::EventNotResolved
    );
    
    require!(
        !bet.claimed,
        BettingError::PayoutAlreadyClaimed
    );
    
    let winning_outcome = event.winning_outcome
        .ok_or(BettingError::EventNotResolved)?;
    
    require!(
        bet.outcome_index == winning_outcome,
        BettingError::BetNotWinner
    );
    
    // Transfer payout from vault to bettor
    let vault_lamports = ctx.accounts.vault.lamports();
    let payout = bet.potential_payout.min(vault_lamports);
    
    **ctx.accounts.vault.try_borrow_mut_lamports()? -= payout;
    **ctx.accounts.bettor.try_borrow_mut_lamports()? += payout;
    
    bet.claimed = true;
    
    msg!(
        "Payout claimed: {} SOL for event {}",
        payout as f64 / 1_000_000_000.0,
        event_id
    );
    
    Ok(())
}
