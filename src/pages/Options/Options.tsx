import React, { useEffect, useState } from 'react';
import BookmarkPane from '../../components/BookmarkPane';
import { Global, css } from '@emotion/react';
import { BookmarkTreeNode } from '../../types';
import { Box, Grid, IconButton, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const MIN_COLUMNS = 2;
const MAX_COLUMNS = 4;

const Options: React.FC = () => {
  const [columns, setColumns] = useState(2);
  const [tree, setTree] = useState<BookmarkTreeNode[]>([]);
  const resetTree = async () => {
    const root = await chrome.bookmarks.getTree();
    if (root[0]?.children) {
      setTree(root[0].children);
    }
  };
  useEffect(() => {
    resetTree();
    chrome.bookmarks.onCreated.addListener(resetTree);
    chrome.bookmarks.onChanged.addListener(resetTree);
    chrome.bookmarks.onMoved.addListener(resetTree);
    chrome.bookmarks.onRemoved.addListener(resetTree);
    return () => {
      chrome.bookmarks.onCreated.removeListener(resetTree);
      chrome.bookmarks.onChanged.removeListener(resetTree);
      chrome.bookmarks.onMoved.removeListener(resetTree);
      chrome.bookmarks.onRemoved.removeListener(resetTree);
    };
  }, []);
  return (
    <>
      <Global
        styles={css`
          body {
            margin: 0;
          }
        `}
      />
      <Stack direction="row">
        <Grid container spacing={1} padding={1}>
          {Array(columns)
            .fill('')
            .map((v, i) => {
              return (
                <Grid item xs={12 / columns} key={i}>
                  <BookmarkPane tree={tree} />
                </Grid>
              );
            })}
        </Grid>
        <Stack>
          <Box sx={{ mt: 1, mr: 1 }}>
            <IconButton
              disabled={columns == MAX_COLUMNS}
              onClick={() => setColumns(columns + 1)}
            >
              <AddIcon />
            </IconButton>
          </Box>
          <Box sx={{ mt: 1, mr: 1 }}>
            <IconButton
              disabled={columns == MIN_COLUMNS}
              onClick={() => setColumns(columns - 1)}
            >
              <RemoveIcon />
            </IconButton>
          </Box>
        </Stack>
      </Stack>
    </>
  );
};

export default Options;
