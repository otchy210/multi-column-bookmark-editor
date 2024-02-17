import React from 'react';
import BookmarkPane from '../../components/BookmarkPane';
import { Global, css } from '@emotion/react';
import { BookmarkNodeModel } from '../../types';

const Options: React.FC = () => {
  const nodes: BookmarkNodeModel[] = [
    {
      type: 'FOLDER',
      label: 'Foldere A',
      nodes: [
        { type: 'BOOKMARK', label: 'bookmark A-1' },
        { type: 'BOOKMARK', label: 'bookmark A-2' },
        { type: 'BOOKMARK', label: 'bookmark A-3' },
        {
          type: 'FOLDER',
          label: 'Folder A-4',
          nodes: [
            {
              type: 'FOLDER',
              label: 'Folder A-4-1',
              nodes: [
                {
                  type: 'FOLDER',
                  label: 'Folder A-4-1-1',
                  nodes: [{ type: 'BOOKMARK', label: 'bookmark A-4-1-1-1' }],
                },
              ],
            },
          ],
        },
      ],
    },
    { type: 'BOOKMARK', label: 'bookmark B' },
    { type: 'BOOKMARK', label: 'bookmark C' },
    { type: 'FOLDER', label: 'Folder D' },
    { type: 'BOOKMARK', label: 'bookmark E-1' },
    { type: 'BOOKMARK', label: 'bookmark E-2' },
    { type: 'BOOKMARK', label: 'bookmark E-3' },
    { type: 'BOOKMARK', label: 'bookmark E-4' },
    { type: 'BOOKMARK', label: 'bookmark E-5' },
    { type: 'BOOKMARK', label: 'bookmark E-6' },
    { type: 'BOOKMARK', label: 'bookmark E-7' },
    { type: 'BOOKMARK', label: 'bookmark E-8' },
    { type: 'BOOKMARK', label: 'bookmark E-9' },
    { type: 'BOOKMARK', label: 'bookmark E-10' },
    { type: 'BOOKMARK', label: 'bookmark E-11' },
    { type: 'BOOKMARK', label: 'bookmark E-12' },
    { type: 'BOOKMARK', label: 'bookmark E-13' },
    {
      type: 'BOOKMARK',
      label: 'loooooooooooooooooong looooooooooooooooong bookmark E-14',
    },
  ];
  return (
    <>
      <Global
        styles={css`
          body {
            margin: 0;
          }
        `}
      />
      <BookmarkPane nodes={nodes} />
    </>
  );
};

export default Options;
