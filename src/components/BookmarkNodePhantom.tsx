import React from 'react';
import { List, ListItemButton } from '@mui/material';
import { useBookmark } from './BookmarkContext';
import { BookmarkNodeIcon } from './BookmarkNodeIcon';
import { BookmarkNodeLabel } from './BookmarkNodeLabel';
import { useDnd } from './DndContext';

export const BookmarkNodePhantom: React.FC = () => {
  const dnd = useDnd();
  const bookmark = useBookmark();
  if (!dnd?.start || !dnd?.pos) {
    return <></>;
  }
  const node = bookmark.map[dnd.start.bkId];
  if (!node) {
    return <></>;
  }
  const left = dnd.start.rect.left + dnd.pos.diff.x;
  const top = dnd.start.rect.top + dnd.pos.diff.y;
  return (
    <List
      sx={{
        p: 0,
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        cursor: 'move',
      }}
    >
      <ListItemButton sx={{ p: 0 }} disabled={true}>
        <BookmarkNodeIcon node={node} open={false} />
        <BookmarkNodeLabel node={node} />
      </ListItemButton>
    </List>
  );
};
