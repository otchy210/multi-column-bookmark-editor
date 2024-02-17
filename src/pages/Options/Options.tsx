import React, { useEffect, useState } from 'react';
import BookmarkPane from '../../components/BookmarkPane';
import { Global, css } from '@emotion/react';
import { BookmarkTreeNode } from '../../types';

const Options: React.FC = () => {
  const [tree, setTree] = useState<BookmarkTreeNode[]>([]);
  useEffect(() => {
    (async () => {
      const root = await chrome.bookmarks.getTree();
      if (root[0]?.children) {
        setTree(root[0].children);
      }
    })();
  });
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
