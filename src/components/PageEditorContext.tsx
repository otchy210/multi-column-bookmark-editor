import React, { createContext, useContext, useRef, useState } from 'react';
import { useBookmark } from './BookmarkContext';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

type OpenFunctionProps = { bkId?: string; parentBkId?: string };
type PageEditorContextType = {
  open: (props: OpenFunctionProps) => void;
};

const PageEditorContext = createContext<PageEditorContextType | undefined>(
  undefined
);

export const usePageEditor = () => {
  const context = useContext(PageEditorContext);
  if (!context) {
    throw new Error('PageEditorContext is undefined.');
  }
  return context;
};

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    console.debug(e);
    return false;
  }
};

type PageEditorProviderProps = {
  children: React.ReactNode;
};
export const PageEditorProvider = ({ children }: PageEditorProviderProps) => {
  const [opened, setOpened] = useState(false);
  const [title, setTitle] = useState('');
  const [buttonLabel, setButtonLabel] = useState('');
  const [defaultTitle, setDefaultTitle] = useState('');
  const [defaultUrl, setDefaultUrl] = useState('');
  const [bkId, setBkId] = useState<string | undefined>(undefined);
  const [parentBkId, setParentBkId] = useState<string | undefined>(undefined);
  const [titleErrorMessage, setTitleErrorMessage] = useState('');
  const [urlErrorMessage, setUrlErrorMessage] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const bookmark = useBookmark();

  const open = ({ bkId, parentBkId }: OpenFunctionProps) => {
    if (!bkId && !parentBkId) {
      throw new Error('Either bkId or parentBkId is required.');
    }
    setOpened(true);
    setBkId(bkId);
    setParentBkId(parentBkId);
    if (bkId) {
      setTitle('Edit page');
      setButtonLabel('Save');
      const bk = bookmark.map[bkId];
      if (!bk.url) {
        throw new Error(`{id: ${bk.id}, title: ${bk.title}} is not a page.`);
      }
      setDefaultTitle(bk.title);
      setDefaultUrl(bk.url);
    } else {
      setTitle('Add new page');
      setButtonLabel('Add');
    }
  };

  const handleClose = () => {
    setOpened(false);
    setTitle('');
    setButtonLabel('');
    setDefaultTitle('');
    setDefaultUrl('');
    setBkId(undefined);
    setParentBkId(undefined);
    setBkId('');
    setParentBkId('');
    setTitleErrorMessage('');
    setUrlErrorMessage('');
  };

  const validate = () => {
    if (!titleRef.current || !urlRef.current) {
      return false;
    }
    let hasError = false;
    const title = titleRef.current.querySelector('input')?.value;
    if (!title || title.trim().length === 0) {
      hasError = true;
      setTitleErrorMessage('Page title is required.');
    }
    const url = urlRef.current.querySelector('input')?.value;
    if (!url || url.trim().length == 0) {
      hasError = true;
      setUrlErrorMessage('URL is required.');
    } else if (!isValidUrl(url)) {
      hasError = true;
      setUrlErrorMessage('URL is invalid.');
    }
    if (hasError || !title || !url) {
      return false;
    }
    return { title, url };
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = validate();
    if (!values) {
      return;
    }
    const { title, url } = values;
    if (bkId) {
      bookmark.update(bkId, title, url);
    } else if (parentBkId) {
      bookmark.create(parentBkId, title, url);
    }
    handleClose();
  };

  return (
    <PageEditorContext.Provider value={{ open }}>
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
              defaultValue={defaultTitle}
              error={!!titleErrorMessage}
              helperText={titleErrorMessage}
            />
            <TextField
              required
              margin="dense"
              label="url"
              ref={urlRef}
              fullWidth
              defaultValue={defaultUrl}
              error={!!urlErrorMessage}
              helperText={urlErrorMessage}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">{buttonLabel}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageEditorContext.Provider>
  );
};
