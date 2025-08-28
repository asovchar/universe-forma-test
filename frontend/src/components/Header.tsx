'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { apiService } from '@/lib/api';

interface HeaderProps {
  userEmail?: string | null;
}

export const Header: React.FC<HeaderProps> = ({ userEmail }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiService.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/login');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              GitHub Project Manager
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {userEmail && (
              <span className="text-sm text-gray-600">
                Welcome, {userEmail}
              </span>
            )}
            
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
