export function replaceLinksWithHtmlTags(text: string): string {
  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

  return text.replace(urlRegex, (match) => {
    return `<a href="${match}">${match}</a>`;
  });
}
