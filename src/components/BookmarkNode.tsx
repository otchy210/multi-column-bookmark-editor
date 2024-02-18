import React, { useState } from 'react';
import { BookmarkTreeNode } from '../types';
import { Collapse, List, ListItemButton } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { BookmarkNodeIcon } from './BookmarkNodeIcon';
import { BookmarkNodeLabel } from './BookmarkNodeLabel';

type Props = {
  node: BookmarkTreeNode;
  indent?: number;
};

export const BookmarkNode: React.FC<Props> = ({ node, indent = 0 }: Props) => {
  const [open, setOpen] = useState(false);
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
        disableRipple={!!node.url}
      >
        <BookmarkNodeIcon node={node} open={open} />
        <BookmarkNodeLabel node={node} />
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
};
