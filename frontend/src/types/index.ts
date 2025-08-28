export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface GitHubRepo {
  owner: string;
  name: string;
  url?: string;
  starsCount?: number;
  forksCount?: number;
  issuesCount?: number;
  createdAt?: string; // ISO date string
  isProcessing?: boolean; // Indicates if repo data is still being fetched
}

export interface ReposResponse {
  repos: GitHubRepo[];
}

export interface AddRepoRequest {
  path: string; // e.g., "facebook/react"
}
