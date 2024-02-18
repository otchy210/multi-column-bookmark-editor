import React from 'react';
import { Box, List, Paper } from '@mui/material';
import { useBookmark } from './BookmarkContext';
import { BookmarkNode } from './BookmarkNode';

export const BookmarkColumn: React.FC = () => {
  const bookmark = useBookmark();
  return (
    <Box>
      <Paper
        sx={{
          p: 1,
          height: 'calc(100vh - 32px)',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <List sx={{ p: 0 }}>
          {bookmark.tree.map((node) => (
            <BookmarkNode node={node} key={node.id} />
          ))}
        </List>
      </Paper>
    </Box>
  );
};
