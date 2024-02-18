import React, { createContext, useContext, useEffect, useState } from 'react';
import { BookmarkTreeNode } from '../types';

type BookmarkMap = Record<string, BookmarkTreeNode>;
type BookmarkContextType = {
  tree: BookmarkTreeNode[];
  map: BookmarkMap;
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
    <BookmarkContext.Provider value={{ tree, map }}>
      {children}
    </BookmarkContext.Provider>
  );
};
