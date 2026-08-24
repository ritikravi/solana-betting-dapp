use anchor_lang::prelude::*;

#[error_code]
pub enum BettingError {
    #[msg("Unauthorized action")]
    Unauthorized,
    
    #[msg("Event is not open for betting")]
    EventNotOpen,
    
    #[msg("Event has already closed")]
    EventClosed,
    
    #[msg("Invalid outcome index")]
    InvalidOutcome,
    
    #[msg("Bet amount must be greater than zero")]
    InvalidBetAmount,
    
    #[msg("Event has not been resolved yet")]
    EventNotResolved,
    
    #[msg("Bet is not a winner")]
    BetNotWinner,
    
    #[msg("Payout already claimed")]
    PayoutAlreadyClaimed,
    
    #[msg("Event is already resolved")]
    EventAlreadyResolved,
    
    #[msg("Title too long")]
    TitleTooLong,
    
    #[msg("Description too long")]
    DescriptionTooLong,
    
    #[msg("Category too long")]
    CategoryTooLong,
    
    #[msg("Outcome name too long")]
    OutcomeTooLong,
    
    #[msg("Too many outcomes")]
    TooManyOutcomes,
    
    #[msg("Invalid time range")]
    InvalidTimeRange,
    
    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,
}
