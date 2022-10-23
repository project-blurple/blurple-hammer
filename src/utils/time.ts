// https://stackoverflow.com/a/19700358
export const msToTime = (ms: number): string => {
  const days = Math.floor(ms / 86400000);
  const daysms = ms % 86400000;
  const hours = Math.floor(daysms / 3600000);
  const hoursms = ms % 3600000;
  const minutes = Math.floor(hoursms / 60000);
  const minutesms = ms % 60000;
  const sec = Math.floor(minutesms / 1000);

  let str = "";
  if (days) str += `${days}d`;
  if (hours) str += `${hours}h`;
  if (minutes) str += `${minutes}m`;
  if (sec) str += `${sec}s`;

  return str || "0s";
};
