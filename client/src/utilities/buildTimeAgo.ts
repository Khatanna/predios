export const buildTimeAgo = (timeAgo: string | number): string => {
  const currentTime = new Date().getTime();
  const differenceInSeconds = Math.floor(
    (currentTime - Number(timeAgo)) / 1000,
  );

  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

  if (differenceInSeconds < 60) {
    return rtf.format(-differenceInSeconds, "second");
  }

  const differenceInMinutes = Math.floor(differenceInSeconds / 60);
  if (differenceInMinutes < 60) {
    return rtf.format(-differenceInMinutes, "minute");
  }

  const differenceInHours = Math.floor(differenceInMinutes / 60);
  if (differenceInHours < 24) {
    return rtf.format(-differenceInHours, "hour");
  }

  const differenceInDays = Math.floor(differenceInHours / 24);
  if (differenceInDays < 7) {
    return rtf.format(-differenceInDays, "day");
  }

  const differenceInWeeks = Math.floor(differenceInDays / 7);
  return rtf.format(-differenceInWeeks, "week");
};
