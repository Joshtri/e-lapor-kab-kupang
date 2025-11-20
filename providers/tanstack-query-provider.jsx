"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PropTypes from 'prop-types';

export default function TanstackQueryProvider({ children }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

TanstackQueryProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
