import React, { createContext, useContext, useEffect, useState } from 'react';
import { BookmarkTreeNode } from '../types';

export type HoverPos = 'TOP' | 'MIDDLE' | 'BOTTOM';

type BookmarkMap = Record<string, BookmarkTreeNode>;
export type BookmarkContextType = {
  tree: BookmarkTreeNode[];
  map: BookmarkMap;
  move: (srcId: string, destId: string, pos: HoverPos) => void;
  create: (parentId: string, title: string, url?: string) => void;
  update: (id: string, title: string, url?: string) => void;
  remove: (id: string) => void;
  removeTree: (id: string) => void;
};

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined
);

export const useBookmark = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('BookmarkContext is undefined.');
  }
  return context;
};

type BookmarkProviderProps = {
  children: React.ReactNode;
};
export const BookmarkProvider = ({ children }: BookmarkProviderProps) => {
  const [tree, setTree] = useState<BookmarkTreeNode[]>([]);
  const [map, setMap] = useState<BookmarkMap>({});
  const probeChildren = (map: BookmarkMap, children: BookmarkTreeNode[]) => {
    for (const child of children) {
      map[child.id] = child;
      if (child.children) {
        probeChildren(map, child.children);
      }
    }
    return map;
  };
  const create = (parentId: string, title: string, url?: string) => {
    chrome.bookmarks.create({ parentId, title, url });
  };
  const update = (id: string, title: string, url?: string) => {
    chrome.bookmarks.update(id, { title, url });
  };
  const move = (srcId: string, destId: string, pos: HoverPos) => {
    switch (pos) {
      case 'TOP':
      case 'BOTTOM':
        const parentId = map[destId].parentId as string;
        const parent = map[parentId];
        const children = parent.children ?? [];
        let index = 0;
        for (; index < children.length; index++) {
          const child = children[index];
          if (child.id == destId) {
            break;
          }
        }
        if (pos == 'BOTTOM') {
          index++;
        }
        chrome.bookmarks.move(srcId, { parentId, index });
        break;
      case 'MIDDLE':
        chrome.bookmarks.move(srcId, { parentId: destId });
        break;
    }
  };
  const remove = (id: string) => {
    chrome.bookmarks.remove(id);
  };
  const removeTree = (id: string) => {
    chrome.bookmarks.removeTree(id);
  };
  const resetTree = async () => {
    const root = await chrome.bookmarks.getTree();
    const children = root[0]?.children;
    if (!children) {
      setTree([]);
      setMap({});
      return;
    }
    setTree(children);
    const map = probeChildren({}, children);
    setMap(map);
  };
  useEffect(() => {
    resetTree();
    chrome.bookmarks.onCreated.addListener(resetTree);
    chrome.bookmarks.onChanged.addListener(resetTree);
    chrome.bookmarks.onMoved.addListener(resetTree);
    chrome.bookmarks.onRemoved.addListener(resetTree);
    return () => {
      chrome.bookmarks.onCreated.removeListener(resetTree);
      chrome.bookmarks.onChanged.removeListener(resetTree);
      chrome.bookmarks.onMoved.removeListener(resetTree);
      chrome.bookmarks.onRemoved.removeListener(resetTree);
    };
  }, []);
  return (
    <BookmarkContext.Provider
      value={{ tree, map, move, create, update, remove, removeTree }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};
