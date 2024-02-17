type BookmarkNodeType = 'FOLDER' | 'BOOKMARK';

type BookmarkNodeModel = {
  type: BookmarkNodeType;
  label: string;
  nodes?: BookmarkNodeModel[];
};

export { BookmarkNodeType, BookmarkNodeModel };
