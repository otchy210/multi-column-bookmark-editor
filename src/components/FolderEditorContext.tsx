import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import React, { createContext, useContext, useRef, useState } from 'react';
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
  const [bkId, setBkId] = useState<string | undefined>(undefined);
  const [parentBkId, setParentBkId] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);
  const bookmark = useBookmark();

  const open = ({ bkId, parentBkId }: OpenFunctionProps) => {
    if (!bkId && !parentBkId) {
      throw new Error('Either bkId or parentBkId is required.');
    }
    setOpened(true);
    setBkId(bkId);
    setParentBkId(parentBkId);
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

  const handleClose = () => {
    setOpened(false);
    setTitle('');
    setButtonLabel('');
    setDefaultValue('');
    setBkId(undefined);
    setParentBkId(undefined);
    setBkId('');
    setParentBkId('');
    setErrorMessage('');
  };

  const validate = () => {
    if (!titleRef.current) {
      return false;
    }
    const title = titleRef.current.querySelector('input')?.value;
    if (!title || title.trim().length === 0) {
      setErrorMessage('Folder title is required.');
      return false;
    }
    return { title };
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = validate();
    if (!values) {
      return;
    }
    const { title } = values;
    if (bkId) {
      bookmark.update(bkId, title);
    } else if (parentBkId) {
      bookmark.create(parentBkId, title);
    }
    handleClose();
  };

  return (
    <FolderEditorContext.Provider value={{ open }}>
      {children}
      <Dialog open={opened} onClose={handleClose} maxWidth="md" fullWidth>
        <form noValidate onSubmit={handleSubmit}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              label="title"
              ref={titleRef}
              fullWidth
              defaultValue={defaultValue}
              error={!!errorMessage}
              helperText={errorMessage}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">{buttonLabel}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </FolderEditorContext.Provider>
  );
};
