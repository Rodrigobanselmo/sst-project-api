export function formatCnae(cnaeStr: string) {
  if (!cnaeStr) return cnaeStr;

  const cleaned = ('' + cnaeStr).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{4})(\d{1})(\d{2})$/);
  if (match) {
    return match[1] + '-' + match[2] + '/' + match[3];
  }
  return cnaeStr;
}
