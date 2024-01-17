export const capitalizeString = (chain?: string): string | undefined => {
  if (!chain || chain.length < 2) return;

  if (chain.includes(' ')) {
    return chain.split(' ').map(capitalizeString).join(' ');
  }

  return chain[0].toUpperCase() + chain.slice(1).toLocaleLowerCase();
};
