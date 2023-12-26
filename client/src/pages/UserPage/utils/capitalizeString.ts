export const capitalizeString = (chain: string) => {
  return chain[0].toUpperCase() + chain.slice(1).toLocaleLowerCase();
};
