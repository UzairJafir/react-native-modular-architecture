import React, { createContext, useState } from 'react';

// Context creation
export const AppContext = createContext<any>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'Dark' | 'Light'>('Dark');
  const [token] = useState<string>('sample_secret_token_123');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'Dark' ? 'Light' : 'Dark'));
  };

  return (
    <AppContext.Provider value={{ theme, token, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
};