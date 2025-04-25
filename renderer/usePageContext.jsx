import React from 'react';
import { useContext } from 'react';

const Context = React.createContext(undefined);

export function PageContextProvider({ pageContext, children }) {
  return <Context.Provider value={pageContext}>{children}</Context.Provider>;
}

export function usePageContext() {
  const pageContext = useContext(Context);
  if (!pageContext) throw new Error('usePageContext() must be used within <PageContextProvider>');
  return pageContext;
}
