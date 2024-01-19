export const capitalizeString = (chain?: string): string | undefined => {
  if (!chain) return;

  if (chain.length <= 1) return chain.toUpperCase();

  if (chain.includes(" ")) {
    return chain.split(" ").map(capitalizeString).join(" ");
  }

  return chain[0].toUpperCase() + chain.slice(1).toLocaleLowerCase();
};
