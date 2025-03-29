
import React from 'react';
import TestDetailHeader from './TestDetailHeader';

const TestLoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      <TestDetailHeader isLoading={true} />
      <div className="h-64 w-full rounded-lg bg-secondary/30 animate-pulse"></div>
    </div>
  );
};

export default TestLoadingSkeleton;
