import { Box, List, Paper } from '@mui/material';
import React from 'react';
import { BookmarkTreeNode } from '../types';
import BookmarkNode from './BookmarkNode';

type Props = {
  tree: BookmarkTreeNode[];
};

export default function BookmarkPane({ tree }: Props) {
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
          {tree.map((node) => (
            <BookmarkNode node={node} />
          ))}
        </List>
      </Paper>
    </Box>
  );
}