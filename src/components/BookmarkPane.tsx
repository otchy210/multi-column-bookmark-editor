import { Box, List, Paper } from '@mui/material';
import React from 'react';
import { BookmarkNodeModel } from '../types';
import BookmarkNode from './BookmarkNode';

type Props = {
  nodes: BookmarkNodeModel[];
};

export default function BookmarkPane({ nodes }: Props) {
  return (
    <Box sx={{ p: 1 }}>
      <Paper
        sx={{
          p: 1,
          maxWidth: '480px',
          height: 'calc(100vh - 32px)',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <List sx={{ p: 0 }}>
          {nodes.map((node) => (
            <BookmarkNode model={node} />
          ))}
        </List>
      </Paper>
    </Box>
  );
}
