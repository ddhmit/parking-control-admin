import React from 'react';
import { getDvaApp } from 'umi';
import { PageLoading } from '@ant-design/pro-layout';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import ErrorBoundary from '@/components/ErrorBoundary';

const Layout: React.FC = ({ children }) => {
  return (
    <ErrorBoundary>
      <PersistGate persistor={persistStore(getDvaApp()._store)} loading={<PageLoading />}>
        {children}
      </PersistGate>
    </ErrorBoundary>
  );
};

export default Layout;
