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
import { BookmarkTreeNode } from '../types';

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
  const [node, setNode] = useState<BookmarkTreeNode | undefined>(undefined);
  const bookmark = useBookmark();

  const open = ({ bkId }: OpenFunctionProps) => {
    setOpened(true);
    const bk = bookmark.map[bkId];
    setNode(bk);
  };
  const handleClose = () => {
    setOpened(false);
    setNode(undefined);
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (node) {
      if (node.url) {
        bookmark.remove(node.id);
      } else {
        bookmark.removeTree(node.id);
      }
    }
    handleClose();
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
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Removal confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to remove "{node?.title}"?
            <br />
            {!node?.url &&
              'You are about to remove all pages and subfolders inside it.'}
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
