export function insertTextAtSelection(
  text: string,
  insertion: string,
  selectionStart: number,
  selectionEnd: number,
): string {
  return text.slice(0, selectionStart) + insertion + text.slice(selectionEnd)
}
