use anchor_lang::prelude::*;
use crate::state::Platform;

#[derive(Accounts)]
pub struct InitializePlatform<'info> {
    #[account(
        init,
        payer = authority,
        space = Platform::LEN,
        seeds = [b"platform"],
        bump
    )]
    pub platform: Account<'info, Platform>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitializePlatform>) -> Result<()> {
    let platform = &mut ctx.accounts.platform;
    
    platform.authority = ctx.accounts.authority.key();
    platform.total_events = 0;
    platform.total_bets = 0;
    platform.total_volume = 0;
    platform.bump = ctx.bumps.platform;
    
    msg!("Platform initialized with authority: {}", platform.authority);
    
    Ok(())
}
