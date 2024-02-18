import { ListItemText } from '@mui/material';
import React from 'react';
import { BookmarkTreeNode } from '../types';

type Props = {
  node: BookmarkTreeNode;
};

export const BookmarkNodeLabel: React.FC<Props> = ({ node }: Props) => {
  const isFolder = !node.url;
  const children: BookmarkTreeNode[] = node.children ?? [];
  return (
    <ListItemText
      primary={`${node.title}${isFolder ? ` (${children.length})` : ''}`}
      sx={{
        pl: 1,
        '> span': {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
      }}
    />
  );
};
