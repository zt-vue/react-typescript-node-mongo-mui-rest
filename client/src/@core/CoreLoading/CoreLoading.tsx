import React, { useState } from 'react';
import { Typography, LinearProgress } from '@material-ui/core';
import { useTimeout } from '@core/hooks';

interface Props {
  delay: number;
}
function CoreLoading({ delay = 0 }: Props) {
  const [showLoading, setShowLoading] = useState(!delay);

  useTimeout(() => {
    setShowLoading(true);
  }, delay);

  if (!showLoading) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Typography className="text-20 mb-16" color="textSecondary">
        Loading...
      </Typography>
      <LinearProgress className="w-xs" color="secondary" />
    </div>
  );
}

export default CoreLoading;
