'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { GitHubRepo } from '@/types';
import { apiService } from '@/lib/api';
import { Header } from '@/components/Header';
import { RepoCard } from '@/components/RepoCard';
import { AddRepoForm } from '@/components/AddRepoForm';

export default function DashboardPage() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingRepo, setIsAddingRepo] = useState(false);
  const [updatingRepos, setUpdatingRepos] = useState<Set<string>>(new Set());
  const [deletingRepos, setDeletingRepos] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const reposRef = useRef<GitHubRepo[]>([]);
  const router = useRouter();

  useEffect(() => {
    reposRef.current = repos;
  }, [repos]);

  useEffect(() => {
    if (!apiService.isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    const email = apiService.getCurrentUserEmail();
    setUserEmail(email);
    
    loadRepos();
  }, [router]);

  // Set up auto-refresh interval when component mounts
  useEffect(() => {
    const interval = setInterval(() => {
      // Use the current repos ref to check if any are still processing
      const currentRepos = reposRef.current;
      const hasProcessingRepos = currentRepos.some(repo => !repo.url || !repo.createdAt);
      
      if (hasProcessingRepos) {
        loadRepos(false); // Don't show loading spinner for auto-refresh
      } else if (currentRepos.length > 0) {
        // All repos are fully loaded, stop the interval
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 5000); // Check every 5 seconds
    
    intervalRef.current = interval;
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []); // Only run once on mount

  const loadRepos = async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      setError('');
      const reposData = await apiService.getRepos();
      setRepos(reposData);
    } catch (err) {
      setError('Failed to load repositories. Please try again.');
      console.error('Failed to load repos:', err);
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  const handleAddRepo = async (repoPath: string) => {
    setIsAddingRepo(true);
    try {
      const updatedRepos = await apiService.addRepo({ path: repoPath });
      setRepos(updatedRepos);
      
      const hasProcessingRepos = updatedRepos.some(repo => !repo.url || !repo.createdAt);
      if (hasProcessingRepos && !intervalRef.current) {
        const interval = setInterval(() => {
          const currentRepos = reposRef.current;
          const stillProcessing = currentRepos.some(repo => !repo.url || !repo.createdAt);
          
          if (stillProcessing) {
            loadRepos(false);
          } else if (currentRepos.length > 0) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        }, 5000);
        
        intervalRef.current = interval;
      }
    } catch (err) {
      throw err; // Re-throw to let AddRepoForm handle the error
    } finally {
      setIsAddingRepo(false);
    }
  };

  const handleUpdateRepo = async (owner: string, name: string) => {
    const repoKey = `${owner}/${name}`;
    setUpdatingRepos(prev => new Set(prev).add(repoKey));
    try {
      const updatedRepos = await apiService.updateRepo(owner, name);
      setRepos(updatedRepos);
    } catch (err) {
      console.error('Failed to update repo:', err);
      setError('Failed to update repository. Please try again.');
    } finally {
      setUpdatingRepos(prev => {
        const newSet = new Set(prev);
        newSet.delete(repoKey);
        return newSet;
      });
    }
  };

  const handleDeleteRepo = async (owner: string, name: string) => {
    const repoKey = `${owner}/${name}`;
    setDeletingRepos(prev => new Set(prev).add(repoKey));
    try {
      await apiService.deleteRepo(owner, name);
      setRepos(prev => prev.filter(repo => `${repo.owner}/${repo.name}` !== repoKey));
    } catch (err) {
      console.error('Failed to delete repo:', err);
      setError('Failed to delete repository. Please try again.');
    } finally {
      setDeletingRepos(prev => {
        const newSet = new Set(prev);
        newSet.delete(repoKey);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header userEmail={userEmail} />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-lg font-medium text-gray-700">Loading repositories...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userEmail={userEmail} />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              GitHub Repositories
            </h2>
            <p className="text-lg text-gray-700">
              Manage your GitHub project repositories
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
              <div className="flex items-start justify-between">
                <p className="text-base font-medium">{error}</p>
                <button
                  onClick={() => setError('')}
                  className="text-red-600 hover:text-red-800 font-bold text-lg ml-4"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <AddRepoForm 
                onSubmit={handleAddRepo}
                isLoading={isAddingRepo}
              />
            </div>

            <div className="lg:col-span-2">
              {repos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📁</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No repositories yet
                  </h3>
                  <p className="text-base text-gray-700">
                    Add your first GitHub repository to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        Your Repositories ({repos.length})
                      </h3>
                      {repos.some(repo => !repo.url || !repo.createdAt) && (
                        <div className="flex items-center text-base font-medium text-blue-700">
                          <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => loadRepos(true)}
                      className="text-blue-600 hover:text-blue-800 text-base font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      Refresh All
                    </button>
                  </div>
                  
                  <div className="grid gap-4">
                    {repos.map((repo) => {
                      const repoKey = `${repo.owner}/${repo.name}`;
                      return (
                        <RepoCard
                          key={repoKey}
                          repo={repo}
                          onUpdate={handleUpdateRepo}
                          onDelete={handleDeleteRepo}
                          isUpdating={updatingRepos.has(repoKey)}
                          isDeleting={deletingRepos.has(repoKey)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
