// https://stackoverflow.com/a/19700358
// eslint-disable-next-line import/prefer-default-export -- multiple exports can be defined in this file
export function msToHumanShortTime(ms: number): string {
  const days = Math.floor(ms / 86400000);
  const daysMs = ms % 86400000;
  const hours = Math.floor(daysMs / 3600000);
  const hoursMs = daysMs % 3600000;
  const minutes = Math.floor(hoursMs / 60000);
  const minutesMs = hoursMs % 60000;
  const seconds = Math.floor(minutesMs / 1000);

  let str = "";
  if (days) str += `${days}d`;
  if (hours) str += `${hours}h`;
  if (minutes) str += `${minutes}m`;
  if (seconds) str += `${seconds}s`;
  return str || "0s";
}
