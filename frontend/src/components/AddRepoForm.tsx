'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface AddRepoFormProps {
  onSubmit: (repoPath: string) => Promise<void>;
  isLoading?: boolean;
}

export const AddRepoForm: React.FC<AddRepoFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [repoPath, setRepoPath] = useState('');
  const [error, setError] = useState('');

  const validateRepoPath = (path: string) => {
    const repoPathRegex = /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/;
    return repoPathRegex.test(path);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedPath = repoPath.trim();
    
    if (!trimmedPath) {
      setError('Repository path is required');
      return;
    }
    
    if (!validateRepoPath(trimmedPath)) {
      setError('Please enter a valid repository path (e.g., facebook/react)');
      return;
    }
    
    setError('');
    
    try {
      await onSubmit(trimmedPath);
      setRepoPath(''); // Clear form on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add repository');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepoPath(e.target.value);
    if (error) {
      setError(''); // Clear error when user starts typing
    }
  };

  return (
    <Card className="bg-gray-50 border-gray-300">
      <CardHeader className="bg-white">
        <h3 className="text-lg font-semibold text-gray-900">Add GitHub Repository</h3>
        <p className="text-base text-gray-700">
          Enter the repository path in the format: owner/repository-name
        </p>
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            Repository data will be fetched from GitHub in the background and appear shortly after adding.
          </p>
        </div>
      </CardHeader>
      <CardContent className="bg-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Repository Path"
            placeholder="e.g., facebook/react"
            value={repoPath}
            onChange={handleInputChange}
            error={error}
            disabled={isLoading}
          />
          
          <div className="text-base text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
            <p className="mb-2 font-semibold text-gray-800">Examples:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>facebook/react</li>
              <li>vercel/next.js</li>
              <li>microsoft/typescript</li>
            </ul>
          </div>
          
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={!repoPath.trim()}
          >
            {isLoading ? 'Adding Repository...' : 'Add Repository'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
