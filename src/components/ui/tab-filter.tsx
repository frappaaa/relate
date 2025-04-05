
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface TabOption {
  value: string;
  label: string;
}

interface TabFilterProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  tabs: TabOption[];
  children: React.ReactNode;
  className?: string;
}

const TabFilter: React.FC<TabFilterProps> = ({
  activeTab,
  setActiveTab,
  tabs,
  children,
  className
}) => {
  return (
    <Tabs 
      defaultValue={tabs[0]?.value} 
      value={activeTab} 
      onValueChange={setActiveTab}
      className={className}
    >
      <TabsList className="mb-4">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {children}
    </Tabs>
  );
};

export default TabFilter;
