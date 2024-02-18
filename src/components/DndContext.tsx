import React, { createContext, useContext, useEffect, useState } from 'react';

type DndContextType = {
  dragging: boolean;
  setDragging: (dragging: boolean) => void;
};

const DndContext = createContext<DndContextType | undefined>(undefined);

export const useDnd = () => {
  const context = useContext(DndContext);
  if (context == undefined) {
    throw new Error('DndContext is undefined.');
  }
  return context;
};

type DndProviderProps = {
  dndRootRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
};
export const DndProvider = ({ dndRootRef, children }: DndProviderProps) => {
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    const mouseMoveHandler = (e: MouseEvent) => {
      let current = e.target as HTMLElement | null;
      while (current && current?.tagName != 'BODY') {
        const dndId = current.dataset['dndId'];
        if (dndId) {
          console.log(dndId, current);
          break;
        }
        current = current.parentElement;
      }
    };
    dndRootRef.current?.addEventListener('mousemove', mouseMoveHandler);
    return () => {
      dndRootRef.current?.removeEventListener('mousemove', mouseMoveHandler);
    };
  });
  return (
    <DndContext.Provider value={{ dragging, setDragging }}>
      {children}
    </DndContext.Provider>
  );
};
