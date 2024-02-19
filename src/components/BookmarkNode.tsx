import React, { MouseEvent, MouseEventHandler, useState } from 'react';
import { BookmarkTreeNode } from '../types';
import {
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { BookmarkNodeIcon } from './BookmarkNodeIcon';
import { BookmarkNodeLabel } from './BookmarkNodeLabel';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ShieldIcon from '@mui/icons-material/Shield';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DeleteIcon from '@mui/icons-material/Delete';
import { SvgIconComponent } from '@mui/icons-material';
import { useFolderEditor } from './FolderEditorContext';

type Props = {
  node: BookmarkTreeNode;
  indent?: number;
};

type Position = {
  x: number;
  y: number;
};

export const BookmarkNode: React.FC<Props> = ({ node, indent = 0 }: Props) => {
  const [open, setOpen] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState<Position | undefined>(
    undefined
  );
  const { open: openFolderEditor } = useFolderEditor();
  const children: BookmarkTreeNode[] = node.children ?? [];
  const hasChildren = children.length > 0;
  const isTop = node.parentId == '0';
  const isBookmark = node.url;
  const isFolder = !node.url;
  const handleClick = () => {
    setOpen(hasChildren && !open);
  };
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    setContextMenuPos({
      x: e.clientX + 2,
      y: e.clientY + 6,
    });
  };
  const handleContextMenuClose = (e: MouseEvent) => {
    e.stopPropagation();
    setContextMenuPos(undefined);
  };
  const handleOpenNewTab = (e: MouseEvent) => {
    chrome.tabs.create({ url: node.url });
  };
  const handleOpenNewSecretWindow = (e: MouseEvent) => {
    chrome.windows.create({ url: node.url, incognito: true });
  };
  const handleEdit = (e: MouseEvent) => {
    if (isFolder) {
      openFolderEditor({ bkId: node.id });
    }
  };
  const handleAddNewBookmark = (e: MouseEvent) => {};
  const handleAddNewFolder = (e: MouseEvent) => {
    openFolderEditor({ parentBkId: node.id });
  };
  const handleDelete = (e: MouseEvent) => {};
  type BkMenuItemProps = {
    Icon: SvgIconComponent;
    label: string;
    onClick: MouseEventHandler;
  };
  const BkMenuItem: React.FC<BkMenuItemProps> = ({ Icon, label, onClick }) => {
    return (
      <MenuItem
        onClick={(e: MouseEvent) => {
          onClick(e);
          handleContextMenuClose(e);
        }}
        disableRipple
      >
        <ListItemIcon>
          <Icon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{label}</ListItemText>
      </MenuItem>
    );
  };
  return (
    <>
      <ListItemButton
        data-bk-id={node.id}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        sx={{
          ml: indent * 2,
          p: 0,
          border: 'solid 1px transparent',
          mt: '-1px',
        }}
        disableRipple
      >
        <BookmarkNodeIcon node={node} open={open} />
        <BookmarkNodeLabel node={node} />
        {hasChildren && (open ? <ExpandLess /> : <ExpandMore />)}
        <Menu
          open={!!contextMenuPos}
          onClose={handleContextMenuClose}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenuPos
              ? { left: contextMenuPos.x, top: contextMenuPos.y }
              : undefined
          }
          MenuListProps={{ dense: true }}
        >
          {isBookmark && (
            <BkMenuItem
              Icon={OpenInNewIcon}
              label="Open in a new tab"
              onClick={handleOpenNewTab}
            />
          )}
          {isBookmark && (
            <BkMenuItem
              Icon={ShieldIcon}
              label="Open in a secret window"
              onClick={handleOpenNewSecretWindow}
            />
          )}
          {isBookmark && <Divider />}
          {!isTop && (
            <BkMenuItem
              Icon={ModeEditOutlinedIcon}
              label="Edit..."
              onClick={handleEdit}
            />
          )}
          {!isTop && <Divider />}
          {isFolder && (
            <BkMenuItem
              Icon={BookmarkAddOutlinedIcon}
              label="Add new bookmark..."
              onClick={handleAddNewBookmark}
            />
          )}
          {isFolder && (
            <BkMenuItem
              Icon={CreateNewFolderIcon}
              label="Add new folder..."
              onClick={handleAddNewFolder}
            />
          )}
          {isFolder && <Divider />}
          <BkMenuItem Icon={DeleteIcon} label="Delete" onClick={handleDelete} />
        </Menu>
      </ListItemButton>
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((node) => {
              return (
                <BookmarkNode node={node} indent={indent + 1} key={node.id} />
              );
            })}
          </List>
        </Collapse>
      )}
    </>
  );
};
