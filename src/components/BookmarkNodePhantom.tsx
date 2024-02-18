import React from 'react';
import { List, ListItemButton } from '@mui/material';
import { useBookmark } from './BookmarkContext';
import { BookmarkNodeIcon } from './BookmarkNodeIcon';
import { BookmarkNodeLabel } from './BookmarkNodeLabel';
import { useDnd } from './DndContext';

export const BookmarkNodePhantom: React.FC = () => {
  const dnd = useDnd();
  const bookmark = useBookmark();
  if (!dnd?.start) {
    return <></>;
  }
  const node = bookmark.map[dnd.start.bkId];
  if (!node) {
    return <></>;
  }
  return (
    <List sx={{ p: 0, position: 'fixed' }}>
      <ListItemButton sx={{ p: 0 }} disabled={true}>
        <BookmarkNodeIcon node={node} open={false} />
        <BookmarkNodeLabel node={node} />
      </ListItemButton>
    </List>
  );
};
