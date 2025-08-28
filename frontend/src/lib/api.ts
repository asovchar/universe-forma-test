import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  GitHubRepo, 
  ReposResponse,
  AddRepoRequest
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000';
const API_VERSION = '/api/v1';

class ApiService {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  }

  private setAuthToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('authToken', token);
  }

  private setUserEmail(email: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('userEmail', email);
  }

  private getUserEmail(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('userEmail');
  }

  private removeAuthToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}${API_VERSION}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle empty responses (like DELETE)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T;
      }

      const data = await response.json();

      if (!response.ok) {
        // Handle different error response formats
        const errorMessage = data.message || data.error || data.details || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    this.setAuthToken(response.accessToken);
    this.setUserEmail(credentials.email);
    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    this.setAuthToken(response.accessToken);
    this.setUserEmail(userData.email);
    return response;
  }

  async logout(): Promise<void> {
    this.removeAuthToken();
  }

  async getRepos(): Promise<GitHubRepo[]> {
    const response = await this.makeRequest<ReposResponse>('/user/repos');
    return response.repos;
  }

  async addRepo(repoData: AddRepoRequest): Promise<GitHubRepo[]> {
    const response = await this.makeRequest<ReposResponse>('/user/repos', {
      method: 'POST',
      body: JSON.stringify(repoData),
    });
    return response.repos;
  }

  async updateRepo(owner: string, name: string): Promise<GitHubRepo[]> {
    const repoPath = encodeURIComponent(`${owner}/${name}`);
    const response = await this.makeRequest<ReposResponse>(`/user/repos/${repoPath}/refresh`, {
      method: 'POST',
    });
    return response.repos;
  }

  async deleteRepo(owner: string, name: string): Promise<void> {
    const repoPath = encodeURIComponent(`${owner}/${name}`);
    await this.makeRequest(`/user/repos/${repoPath}`, {
      method: 'DELETE',
    });
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  getCurrentUserEmail(): string | null {
    return this.getUserEmail();
  }
}

export const apiService = new ApiService();