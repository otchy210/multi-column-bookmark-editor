import React, { useState } from 'react';
import { BookmarkNodeModel } from '../types';
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
type Props = {
  model: BookmarkNodeModel;
  indent?: number;
};

export default function BookmarkNode({ model, indent = 0 }: Props) {
  const [open, setOpen] = useState(false);
  const isFolder = model.type == 'FOLDER';
  const nodes: BookmarkNodeModel[] = model.nodes ?? [];
  const hasNodes = nodes.length > 0;
  const handleClick = () => {
    setOpen(hasNodes && !open);
  };
  return (
    <>
      <ListItemButton onClick={handleClick} sx={{ ml: indent * 2, p: 0 }}>
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
          primary={`${model.label}${isFolder ? ` (${nodes.length})` : ''}`}
          sx={{
            pl: 1,
            '> span': {
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
          }}
        />
        {hasNodes && (open ? <ExpandLess /> : <ExpandMore />)}
      </ListItemButton>
      {hasNodes && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {nodes.map((node) => {
              return <BookmarkNode model={node} indent={indent + 1} />;
            })}
          </List>
        </Collapse>
      )}
    </>
  );
}
