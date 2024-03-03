import React, { useRef, useState } from 'react';
import { Global, css } from '@emotion/react';
import { Box, Grid, IconButton, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { DndProvider } from '../../components/DndContext';
import { BookmarkProvider } from '../../components/BookmarkContext';
import { BookmarkNodePhantom } from '../../components/BookmarkNodePhantom';
import { BookmarkColumn } from '../../components/BookmarkColumn';
import { FolderEditorProvider } from '../../components/FolderEditorContext';
import { RemoveDialogContextProvider } from '../../components/RemoveDialogContext';
import { PageEditorProvider } from '../../components/PageEditorContext';

const MIN_COLUMNS = 2;
const MAX_COLUMNS = 4;

export const Options: React.FC = () => {
  const [columns, setColumns] = useState(2);
  const dndRootRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <Global
        styles={css`
          body {
            margin: 0;
          }
        `}
      />
      <BookmarkProvider>
        <DndProvider dndRootRef={dndRootRef}>
          <RemoveDialogContextProvider>
            <FolderEditorProvider>
              <PageEditorProvider>
                <BookmarkNodePhantom />
                <Stack direction="row">
                  <Grid container spacing={1} padding={1} ref={dndRootRef}>
                    {Array(columns)
                      .fill('')
                      .map((v, i) => {
                        return (
                          <Grid item xs={12 / columns} key={i}>
                            <BookmarkColumn />
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
              </PageEditorProvider>
            </FolderEditorProvider>
          </RemoveDialogContextProvider>
        </DndProvider>
      </BookmarkProvider>
    </>
  );
};
