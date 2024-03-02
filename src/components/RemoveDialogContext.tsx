import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React, { createContext, useContext, useState } from 'react';
import { useBookmark } from './BookmarkContext';

type OpenFunctionProps = {
  bkId: string;
};
type RemoveDialogContextType = {
  open: (props: OpenFunctionProps) => void;
};

const RemoveDialogContext = createContext<RemoveDialogContextType | undefined>(
  undefined
);

export const useRemoveDialog = () => {
  const context = useContext(RemoveDialogContext);
  if (!context) {
    throw new Error('RemoveDialogContext is undefined');
  }
  return context;
};

type RemoveDialogContextProviderProps = {
  children: React.ReactNode;
};
export const RemoveDialogContextProvider = ({
  children,
}: RemoveDialogContextProviderProps) => {
  const [opened, setOpened] = useState(false);
  const [bkId, setBkId] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState('');
  const bookmark = useBookmark();

  const open = ({ bkId }: OpenFunctionProps) => {
    setOpened(true);
    setBkId(bkId);
    const bk = bookmark.map[bkId];
    setTitle(bk.title);
  };
  const handleClose = () => {
    setOpened(false);
    setBkId(undefined);
  };
  return (
    <RemoveDialogContext.Provider value={{ open }}>
      {children}
      <Dialog
        open={opened}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          component: 'form',
          onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            // bookmark.remove
            handleClose();
          },
        }}
      >
        <DialogTitle>Removal confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to remove "{title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" color="error">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </RemoveDialogContext.Provider>
  );
};
