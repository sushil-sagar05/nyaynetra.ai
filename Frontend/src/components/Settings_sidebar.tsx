'use client';
import React from 'react';
import { User, Settings, Shield, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SettingsSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

function SettingsSidebar({ activeTab, setActiveTab }: SettingsSidebarProps) {
  const tabs = [
    { 
      label: 'Account Settings', 
      icon: <User className="w-4 h-4" />,
      description: 'Manage your account details'
    },
    { 
      label: 'Preferences', 
      icon: <Settings className="w-4 h-4" />,
      description: 'Customize your experience'
    },
    { 
      label: 'Privacy', 
      icon: <Shield className="w-4 h-4" />,
      description: 'Privacy and security settings'
    },
    { 
      label: 'Help', 
      icon: <HelpCircle className="w-4 h-4" />,
      description: 'Get support and help'
    },
  ];

  return (
    <div className="space-y-2">
      {tabs.map((tab) => (
        <Button
          key={tab.label}
          variant={activeTab === tab.label ? "default" : "ghost"}
          className={`w-full justify-start gap-3 p-4 h-auto ${
            activeTab === tab.label 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          onClick={() => setActiveTab(tab.label)}
        >
          <div className={activeTab === tab.label ? 'text-white' : 'text-gray-500 dark:text-gray-400'}>
            {tab.icon}
          </div>
          <div className="flex-1 text-left">
            <div className={`font-medium ${activeTab === tab.label ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              {tab.label}
            </div>
            <div className={`text-sm ${activeTab === tab.label ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
              {tab.description}
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
}

export default SettingsSidebar;
