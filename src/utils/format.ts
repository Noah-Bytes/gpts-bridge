export function getNumConversationsStr(str: string): number | undefined {
  if (str) {
    let result = str.replace('+', '');
    if (result.indexOf('K') > -1) {
      result = result.replace('K', '');
      return +result * 1000;
    }

    if (result.indexOf('M') > -1) {
      result = result.replace('M', '');
      return +result * 1000 * 1000;
    }

    return +result;
  }

  return undefined;
}
