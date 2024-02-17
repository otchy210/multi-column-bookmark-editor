import React, { useEffect, useState } from 'react';
import BookmarkPane from '../../components/BookmarkPane';
import { Global, css } from '@emotion/react';
import { BookmarkTreeNode } from '../../types';

const Options: React.FC = () => {
  const [tree, setTree] = useState<BookmarkTreeNode[]>([]);
  const resetTree = async () => {
      const root = await chrome.bookmarks.getTree();
      if (root[0]?.children) {
        setTree(root[0].children);
      }
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
    }
  }, []);
  return (
    <>
      <Global
        styles={css`
          body {
            margin: 0;
          }
        `}
      />
      <BookmarkPane tree={tree} />
    </>
  );
};

export default Options;
