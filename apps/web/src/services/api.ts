/**
 * API Service Client for Panchangam, Mutt, Shraddha, Auth, and Admin
 */

const API_BASE = '/api/v1';

export interface UserSession {
  id: string;
  phone: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

class ApiService {
  private token: string | null = null;
  private currentUser: UserSession | null = null;

  constructor() {
    this.token = localStorage.getItem('panchangam_token');
    const userJson = localStorage.getItem('panchangam_user');
    if (userJson) {
      try {
        this.currentUser = JSON.parse(userJson);
      } catch (e) {
        this.currentUser = null;
      }
    }
  }

  public getToken() {
    return this.token;
  }

  public getCurrentUser(): UserSession | null {
    return this.currentUser;
  }

  public setSession(token: string, user: UserSession) {
    this.token = token;
    this.currentUser = user;
    localStorage.setItem('panchangam_token', token);
    localStorage.setItem('panchangam_user', JSON.stringify(user));
  }

  public clearSession() {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem('panchangam_token');
    localStorage.removeItem('panchangam_user');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    if (!res.ok) {
      let errMsg = `Request failed: ${res.statusText}`;
      try {
        const errJson = await res.json();
        if (errJson.error) errMsg = errJson.error;
      } catch (e) {}
      throw new Error(errMsg);
    }

    // Handle empty or attachment responses
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return res.json() as Promise<T>;
    }
    return res.text() as Promise<T>;
  }

  // --- Authentication ---
  public async register(phone: string, name: string, password: string) {
    const data = await this.request<{ token: string; user: UserSession }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ phone, name, password })
    });
    this.setSession(data.token, data.user);
    return data;
  }

  public async login(phone: string, password: string) {
    const data = await this.request<{ token: string; user: UserSession }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password })
    });
    this.setSession(data.token, data.user);
    return data;
  }

  public async getMe() {
    return this.request<UserSession>('/auth/me');
  }

  // --- Locations ---
  public async searchLocations(q: string) {
    return this.request<any[]>(`/locations/search?q=${encodeURIComponent(q)}`);
  }

  public async getFeaturedLocations() {
    return this.request<any[]>('/locations/featured');
  }

  // --- Panchangam ---
  public async getPanchangam(params: {
    date?: string;
    latitude: number;
    longitude: number;
    elevation?: number;
    timezone: string;
    ayanamsha?: string;
    mutt?: string;
    calendarSystem?: string;
  }) {
    const query = new URLSearchParams({
      date: params.date || '',
      latitude: params.latitude.toString(),
      longitude: params.longitude.toString(),
      elevation: (params.elevation !== undefined ? params.elevation : 0).toString(),
      timezone: params.timezone,
      ayanamsha: params.ayanamsha || 'LAHIRI',
      mutt: params.mutt || 'STANDARD',
      calendarSystem: params.calendarSystem || 'CHANDRAMANA_AMANTA'
    });
    return this.request<any>(`/panchangam?${query.toString()}`);
  }

  public async getRealTimePanchangam(params: {
    timestamp?: string;
    latitude: number;
    longitude: number;
    elevation?: number;
    timezone: string;
    ayanamsha?: string;
    mutt?: string;
    calendarSystem?: string;
  }) {
    const query = new URLSearchParams({
      timestamp: params.timestamp || '',
      latitude: params.latitude.toString(),
      longitude: params.longitude.toString(),
      elevation: (params.elevation !== undefined ? params.elevation : 0).toString(),
      timezone: params.timezone,
      ayanamsha: params.ayanamsha || 'LAHIRI',
      mutt: params.mutt || 'STANDARD',
      calendarSystem: params.calendarSystem || 'CHANDRAMANA_AMANTA'
    });
    return this.request<any>(`/panchangam/realtime?${query.toString()}`);
  }


  public async getMonthlyCalendar(params: {
    year: number;
    month: number;
    latitude: number;
    longitude: number;
    timezone: string;
    mutt?: string;
  }) {
    const query = new URLSearchParams({
      year: params.year.toString(),
      month: params.month.toString(),
      latitude: params.latitude.toString(),
      longitude: params.longitude.toString(),
      timezone: params.timezone,
      mutt: params.mutt || 'ADVAITA_SMARTHA'
    });
    return this.request<any>(`/panchangam/calendar?${query.toString()}`);
  }

  // --- Mutt Traditions ---
  public async getMuttList() {
    return this.request<any[]>('/mutt/list');
  }

  public async getMuttComparison(params: {
    date?: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }) {
    const query = new URLSearchParams({
      date: params.date || '',
      latitude: params.latitude.toString(),
      longitude: params.longitude.toString(),
      timezone: params.timezone
    });
    return this.request<any>(`/mutt/compare?${query.toString()}`);
  }

  // --- Public Shraddha ---
  public async calculateShraddha(data: any) {
    return this.request<any>('/shraddha/calculate', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  public async downloadShraddhaICS(data: any) {
    const res = await fetch(`${API_BASE}/shraddha/export-ics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shraddha-${(data.personName || 'ancestor').toLowerCase().replace(/\s+/g, '-')}.ics`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // --- User Shraddha Vault (Authenticated) ---
  public async getUserShraddhaProfiles() {
    return this.request<any[]>('/user/shraddha');
  }

  public async createShraddhaProfile(data: any) {
    return this.request<any>('/user/shraddha', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  public async deleteShraddhaProfile(id: string) {
    return this.request<any>(`/user/shraddha/${id}`, {
      method: 'DELETE'
    });
  }

  public async getUserUpcomingShraddhas() {
    return this.request<any[]>('/user/shraddha/upcoming');
  }

  public async downloadSavedProfileICS(id: string, name: string) {
    const res = await fetch(`${API_BASE}/user/shraddha/${id}/export-ics`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shraddha-${name.toLowerCase().replace(/\s+/g, '-')}.ics`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // --- Admin API ---
  public async getAdminStats() {
    return this.request<any>('/admin/stats');
  }

  public async getAdminUsers() {
    return this.request<any[]>('/admin/users');
  }

  public async getAdminShraddhaRecords() {
    return this.request<any[]>('/admin/shraddha-records');
  }

  public async deleteAdminUser(id: string) {
    return this.request<any>(`/admin/users/${id}`, {
      method: 'DELETE'
    });
  }
}

export const api = new ApiService();
