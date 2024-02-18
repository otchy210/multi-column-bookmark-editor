import { Box, List, Paper } from '@mui/material';
import React from 'react';
import { BookmarkTreeNode } from '../types';
import BookmarkNode from './BookmarkNode';
import { ColumnContextProvider } from './ColumnContext';

type Props = {
  index: number;
  tree: BookmarkTreeNode[];
};

export default function BookmarkColumn({ index, tree }: Props) {
  return (
    <ColumnContextProvider index={index}>
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
              <BookmarkNode node={node} key={node.id} />
            ))}
          </List>
        </Paper>
      </Box>
    </ColumnContextProvider>
  );
}
