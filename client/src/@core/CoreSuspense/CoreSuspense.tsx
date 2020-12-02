import React, { ReactChild } from 'react';
import { CoreLoading } from '@core';

/**
 * React Suspense defaults
 * For to Avoid Repetition
 */
interface Props {
  loadingProps?: any;
  delay: number;
  children: ReactChild;
}

function CoreSuspense({ loadingProps, delay = 0, children }: Props) {
  return (
    <React.Suspense fallback={<CoreLoading {...loadingProps} />}>
      {children}
    </React.Suspense>
  );
}

export default CoreSuspense;
