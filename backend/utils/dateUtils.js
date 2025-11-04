export const toISTMidnight = (date) => {
  const istOffset = 5.5 * 60 * 60 * 1000;
  const utcDate = new Date(date.getTime() + istOffset);
  return new Date(
    Date.UTC(
      utcDate.getUTCFullYear(),
      utcDate.getUTCMonth(),
      utcDate.getUTCDate()
    )
  );
};
