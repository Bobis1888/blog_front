
export function lineTypes(): Array<LineType> {
  return [LineType.top, LineType.my, LineType.bookmarks, LineType.subscriptions];
}

export enum LineType {
  top = 'top',
  my = 'my',
  bookmarks = 'bookmarks',
  subscriptions = 'subscriptions',
}
