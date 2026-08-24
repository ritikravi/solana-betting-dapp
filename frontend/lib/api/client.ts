const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Events
  async getEvents(params?: {
    status?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    return this.request<any>(`/events?${queryParams.toString()}`);
  }

  async getEvent(eventId: number) {
    return this.request<any>(`/events/${eventId}`);
  }

  async getEventStats(eventId: number) {
    return this.request<any>(`/events/${eventId}/stats`);
  }

  // Bets
  async getBets(params?: {
    eventId?: number;
    bettor?: string;
    claimed?: boolean;
    limit?: number;
    offset?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.eventId) queryParams.append('eventId', params.eventId.toString());
    if (params?.bettor) queryParams.append('bettor', params.bettor);
    if (params?.claimed !== undefined) queryParams.append('claimed', params.claimed.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    return this.request<any>(`/bets?${queryParams.toString()}`);
  }

  async getUserBets(wallet: string, params?: { limit?: number; offset?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    return this.request<any>(`/bets/user/${wallet}?${queryParams.toString()}`);
  }

  async getBetByTx(signature: string) {
    return this.request<any>(`/bets/tx/${signature}`);
  }

  // Stats
  async getPlatformStats() {
    return this.request<any>('/stats/platform');
  }

  async getCategoryStats() {
    return this.request<any>('/stats/categories');
  }

  async getLeaderboard(limit?: number) {
    const queryParams = limit ? `?limit=${limit}` : '';
    return this.request<any>(`/stats/leaderboard${queryParams}`);
  }

  // Indexer
  async syncTransaction(signature: string) {
    return this.request<any>(`/indexer/sync/${signature}`, {
      method: 'POST',
    });
  }

  async getIndexerStatus() {
    return this.request<any>('/indexer/status');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
