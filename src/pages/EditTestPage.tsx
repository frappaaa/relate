
import React from 'react';
import { useParams } from 'react-router-dom';
import TestEditLoading from '@/components/test/TestEditLoading';
import TestEditNotFound from '@/components/test/TestEditNotFound';
import TestEditForm from '@/components/test/TestEditForm';
import { useTestData } from '@/hooks/use-test-data';

const EditTestPage: React.FC = () => {
  const { id } = useParams();
  const { isLoading, initialData } = useTestData(id);

  if (isLoading) {
    return <TestEditLoading />;
  }

  if (!initialData) {
    return <TestEditNotFound />;
  }

  return <TestEditForm testId={id!} initialData={initialData} />;
};

export default EditTestPage;
