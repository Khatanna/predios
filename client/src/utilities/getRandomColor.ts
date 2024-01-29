export const getRandomColor = (): string => {
  const [r, g, b] = [
    Math.random() * 255,
    Math.random() * 255,
    Math.random() * 255,
  ];

  return `rgb(${r}, ${g}, ${b})`;
};
