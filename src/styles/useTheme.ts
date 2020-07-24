import React from 'react';
import defaultTheme from './defaultTheme';

export default function useTheme() {
  const theme = defaultTheme;

  if (process.env.NODE_ENV !== 'production') {
    React.useDebugValue(theme);
  }

  return theme;
}
