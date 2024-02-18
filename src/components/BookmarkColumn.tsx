import { Box, List, Paper } from '@mui/material';
import React from 'react';
import { BookmarkTreeNode } from '../types';
import BookmarkNode from './BookmarkNode';
import { useBookmark } from './BookmarkContext';

export default function BookmarkColumn() {
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
}
