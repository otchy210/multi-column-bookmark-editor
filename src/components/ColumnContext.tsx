import React, { createContext, useContext } from 'react';

type ColumnContextType = {
  index: number;
};

const ColumnContext = createContext<ColumnContextType | undefined>(undefined);

export const useColumnContext = () => {
  const context = useContext(ColumnContext);
  if (context == undefined) {
    throw new Error('ColumnContext is undefined.');
  }
  return context;
};

type ColumnContextProviderProps = {
  index: number;
  children: React.ReactNode;
};
export const ColumnContextProvider = ({
  index,
  children,
}: ColumnContextProviderProps) => {
  return (
    <ColumnContext.Provider value={{ index }}>
      {children}
    </ColumnContext.Provider>
  );
};
