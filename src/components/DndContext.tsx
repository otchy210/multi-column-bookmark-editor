import React, { createContext, useContext, useEffect, useState } from 'react';
import { useBookmark } from './BookmarkContext';

type DndElementContextType = {
  elem: HTMLElement;
  bkId: string;
  rect: DOMRect;
};
type DndCursorPosType = {
  start: { x: number; y: number };
  diff: { x: number; y: number };
};
type DndContextType = {
  start?: DndElementContextType;
  end?: DndElementContextType;
  pos?: DndCursorPosType;
};

const DndContext = createContext<DndContextType | undefined>(undefined);

export const useDnd = () => {
  const context = useContext(DndContext);
  if (context == undefined) {
    throw new Error('DndContext is undefined.');
  }
  return context;
};

const getDndElementContext = (e: Event): DndElementContextType | undefined => {
  if (!e.target) {
    return undefined;
  }
  let current = e.target as HTMLElement;
  while (current && current.tagName != 'BODY') {
    const bkId = current.dataset['bkId'];
    if (bkId) {
      const rect = current.getBoundingClientRect();
      return { elem: current, bkId, rect };
    }
    if (!current.parentElement) {
      return undefined;
    }
    current = current.parentElement;
  }
  return undefined;
};

type DndProviderProps = {
  dndRootRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
};

export const DndProvider = ({ dndRootRef, children }: DndProviderProps) => {
  const [start, setStart] = useState<DndElementContextType | undefined>(
    undefined
  );
  const [end, setEnd] = useState<DndElementContextType | undefined>(undefined);
  const [pos, setPos] = useState<DndCursorPosType | undefined>(undefined);
  const bookmark = useBookmark();
  useEffect(() => {
    const mouseDownHandler = (e: MouseEvent) => {
      if (start) {
        return;
      }
      const newStart = getDndElementContext(e);
      if (!newStart) {
        return;
      }
      const x = e.pageX;
      const y = e.pageY;
      setStart(newStart);
      setPos({ start: { x, y }, diff: { x: 0, y: 0 } });
    };
    const mouseMoveHandler = (e: MouseEvent) => {
      if (!start || !pos) {
        return;
      }
      const newPos = {
        ...pos,
        diff: { x: e.pageX - pos.start.x, y: e.pageY - pos.start.y },
      };
      setPos(newPos);
    };
    const mouseUpHandler = (e: MouseEvent) => {
      if (start) {
        const end = getDndElementContext(e);
        if (end && start.bkId != end.bkId) {
          setEnd(end);
          const s = bookmark.map[start.bkId];
          const e = bookmark.map[end.bkId];
          console.log({ start, end, s, e });
        }
      }
      setStart(undefined);
      setEnd(undefined);
      setPos(undefined);
    };
    dndRootRef.current?.addEventListener('mousedown', mouseDownHandler);
    dndRootRef.current?.addEventListener('mousemove', mouseMoveHandler);
    dndRootRef.current?.addEventListener('mouseup', mouseUpHandler);
    return () => {
      dndRootRef.current?.removeEventListener('mousedown', mouseDownHandler);
      dndRootRef.current?.removeEventListener('mousemove', mouseMoveHandler);
      dndRootRef.current?.removeEventListener('mouseup', mouseUpHandler);
    };
  }, [start, end, pos, bookmark]);
  return (
    <DndContext.Provider value={{ start, end, pos }}>
      {children}
    </DndContext.Provider>
  );
};
