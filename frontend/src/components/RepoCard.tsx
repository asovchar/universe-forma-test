'use client';

import React from 'react';
import { GitHubRepo } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface RepoCardProps {
  repo: GitHubRepo;
  onUpdate: (owner: string, name: string) => void;
  onDelete: (owner: string, name: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export const RepoCard: React.FC<RepoCardProps> = ({
  repo,
  onUpdate,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Processing...';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatNumber = (num?: number) => {
    const isFullyLoaded = repo.url && repo.createdAt;
    if (num === undefined) {
      return isFullyLoaded ? '0' : '...';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {repo.owner}/{repo.name}
              </h3>
              {repo.url ? (
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              ) : (
                <div className="w-4 h-4 flex items-center justify-center">
                  <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            
            {(!repo.url || !repo.createdAt) && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center text-base font-medium text-blue-800">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Fetching repository data from GitHub...
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  ⭐ {formatNumber(repo.starsCount)}
                </div>
                <div className="text-sm font-medium text-gray-700">Stars</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  🍴 {formatNumber(repo.forksCount)}
                </div>
                <div className="text-sm font-medium text-gray-700">Forks</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  🐛 {formatNumber(repo.issuesCount)}
                </div>
                <div className="text-sm font-medium text-gray-700">Issues</div>
              </div>
              
              <div className="text-center">
                <div className="text-base font-bold text-gray-800">
                  📅 {formatDate(repo.createdAt)}
                </div>
                <div className="text-sm font-medium text-gray-700">Created</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 pt-4 border-t border-gray-200">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onUpdate(repo.owner, repo.name)}
            isLoading={isUpdating}
            disabled={isDeleting}
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </Button>
          
          <Button
            size="sm"
            variant="danger"
            onClick={() => onDelete(repo.owner, repo.name)}
            isLoading={isDeleting}
            disabled={isUpdating}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
