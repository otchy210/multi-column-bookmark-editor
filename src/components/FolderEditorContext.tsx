import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import React, { createContext, useContext, useState } from 'react';
import { useBookmark } from './BookmarkContext';

type OpenFunctionProps = { bkId?: string; parentBkId?: string };
type FolderEditorContextType = {
  open: (props: OpenFunctionProps) => void;
};

const FolderEditorContext = createContext<FolderEditorContextType | undefined>(
  undefined
);

export const useFolderEditor = () => {
  const context = useContext(FolderEditorContext);
  if (!context) {
    throw new Error('FolderEditorContext is undefined.');
  }
  return context;
};

type FolderEditorProviderProps = {
  children: React.ReactNode;
};
export const FolderEditorProvider = ({
  children,
}: FolderEditorProviderProps) => {
  const [opened, setOpened] = useState(false);
  const [title, setTitle] = useState('');
  const [buttonLabel, setButtonLabel] = useState('');
  const [defaultValue, setDefaultValue] = useState('');
  const bookmark = useBookmark();

  const handleClose = () => {
    setOpened(false);
  };

  const open = ({ bkId, parentBkId }: OpenFunctionProps) => {
    if (!bkId && !parentBkId) {
      throw new Error('Either bkId or parentBkId is required.');
    }
    setOpened(true);
    if (bkId) {
      setTitle('Edit folder');
      setButtonLabel('Save');
      const bk = bookmark.map[bkId];
      setDefaultValue(bk.title);
    } else {
      setTitle('Add new folder');
      setButtonLabel('Add');
    }
  };

  return (
    <FolderEditorContext.Provider value={{ open }}>
      {children}
      <Dialog
        open={opened}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleClose();
          },
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="name"
            fullWidth
            defaultValue={defaultValue}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">{buttonLabel}</Button>
        </DialogActions>
      </Dialog>
    </FolderEditorContext.Provider>
  );
};
