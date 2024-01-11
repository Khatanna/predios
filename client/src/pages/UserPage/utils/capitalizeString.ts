export const capitalizeString = (chain?: string) => {
  if (!chain || chain.length < 2) return;
  return chain[0].toUpperCase() + chain.slice(1).toLocaleLowerCase();
};
