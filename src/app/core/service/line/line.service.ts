
export function lineTypes(isMobile: boolean = false): Array<LineType> {

  if (isMobile) {
    return [LineType.top, LineType.subscriptions];
  }

  return [LineType.top, LineType.subscriptions, LineType.my, LineType.bookmarks];
}

export enum LineType {
  top = 'top',
  my = 'my',
  bookmarks = 'bookmarks',
  subscriptions = 'subscriptions',
}
