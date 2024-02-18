import React, { useState } from 'react';
import { BookmarkTreeNode } from '../types';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useColumnContext } from './ColumnContext';
type Props = {
  node: BookmarkTreeNode;
  indent?: number;
};

export default function BookmarkNode({ node, indent = 0 }: Props) {
  const [open, setOpen] = useState(false);
  const columnContext = useColumnContext();
  const dndId = `${columnContext.index}-${node.id}`;
  const isFolder = !node.url;
  const children: BookmarkTreeNode[] = node.children ?? [];
  const hasChildren = children.length > 0;
  const handleClick = () => {
    setOpen(hasChildren && !open);
  };
  return (
    <>
      <ListItemButton
        data-bk-id={node.id}
        onClick={handleClick}
        sx={{ ml: indent * 2, p: 0 }}
      >
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
        {hasChildren && (open ? <ExpandLess /> : <ExpandMore />)}
      </ListItemButton>
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((node) => {
              return (
                <BookmarkNode node={node} indent={indent + 1} key={node.id} />
              );
            })}
          </List>
        </Collapse>
      )}
    </>
  );
}
