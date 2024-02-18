import { ListItemIcon } from '@mui/material';
import React from 'react';
import { BookmarkTreeNode } from '../types';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';

type Props = {
  node: BookmarkTreeNode;
  open: boolean;
};

export const BookmarkNodeIcon: React.FC<Props> = ({ node, open }: Props) => {
  const isFolder = !node.url;
  return (
    <ListItemIcon sx={{ minWidth: 'auto' }}>
      {isFolder ? (
        open ? (
          <FolderOpenIcon />
        ) : (
          <FolderIcon />
        )
      ) : (
        <BookmarkBorderOutlinedIcon />
      )}
    </ListItemIcon>
  );
};
