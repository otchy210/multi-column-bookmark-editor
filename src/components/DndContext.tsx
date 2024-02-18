import React, { createContext, useContext, useEffect, useState } from 'react';
import { BookmarkContextType, useBookmark } from './BookmarkContext';
import { lightBlue } from '@mui/material/colors';

type DndElementContextType = {
  elem: HTMLElement;
  bkId: string;
};
type DndCursorPosType = {
  start: { x: number; y: number };
  diff: { x: number; y: number };
};
type DndContextType = {
  start?: DndElementContextType;
  rect?: DOMRect;
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
      return { elem: current, bkId };
    }
    if (!current.parentElement) {
      return undefined;
    }
    current = current.parentElement;
  }
  return undefined;
};

const isOnUpperHalf = (dndElem: DndElementContextType, e: MouseEvent) => {
  const rect = dndElem.elem.getBoundingClientRect();
  return e.pageY < rect.top + rect.height / 2;
};

const setBorderColor = (
  bookmark: BookmarkContextType,
  dndElem: DndElementContextType,
  e: MouseEvent
) => {
  const bk = bookmark.map[dndElem.bkId];
  if (!bk.url) {
    dndElem.elem.style.borderColor = lightBlue[800];
  } else {
    if (isOnUpperHalf(dndElem, e)) {
      dndElem.elem.style.borderTopColor = lightBlue[800];
      dndElem.elem.style.borderBottomColor = 'transparent';
    } else {
      dndElem.elem.style.borderTopColor = 'transparent';
      dndElem.elem.style.borderBottomColor = lightBlue[800];
    }
  }
};

const resetBorderColor = (dndElem: DndElementContextType) => {
  dndElem.elem.style.borderColor = 'transparent';
};
type DndProviderProps = {
  dndRootRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
};

export const DndProvider = ({ dndRootRef, children }: DndProviderProps) => {
  const [start, setStart] = useState<DndElementContextType | undefined>(
    undefined
  );
  const [rect, setRect] = useState<DOMRect | undefined>(undefined);
  const [hover, setHover] = useState<DndElementContextType | undefined>(
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
      const bk = bookmark.map[newStart.bkId];
      if (bk.parentId == '0') {
        return;
      }
      const x = e.pageX;
      const y = e.pageY;
      setStart(newStart);
      setRect(newStart?.elem.getBoundingClientRect());
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
      const currentHover = getDndElementContext(e);
      if (currentHover && currentHover.bkId != start.bkId) {
        setBorderColor(bookmark, currentHover, e);
      }
      if (currentHover?.elem == hover?.elem) {
        return;
      }
      if (hover) {
        resetBorderColor(hover);
      }
      setHover(currentHover);
    };
    const mouseUpHandler = (e: MouseEvent) => {
      if (start) {
        const end = getDndElementContext(e);
        if (end && start.bkId != end.bkId) {
          resetBorderColor(end);
          setEnd(end);
          const s = bookmark.map[start.bkId];
          const e = bookmark.map[end.bkId];
          console.log({ start, end, s, e });
        }
      }
      setStart(undefined);
      setRect(undefined);
      setHover(undefined);
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
  }, [start, rect, hover, end, pos, bookmark]);
  return (
    <DndContext.Provider value={{ start, rect, end, pos }}>
      {children}
    </DndContext.Provider>
  );
};
