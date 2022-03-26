export const msToTime = (ms: number): string => { // https://stackoverflow.com/a/19700358
  const
    days = Math.floor(ms / 86400000), // 24*60*60*1000
    daysms = ms % 86400000, // 24*60*60*1000
    hours = Math.floor(daysms / 3600000), // 60*60*1000
    hoursms = ms % 3600000, // 60*60*1000
    minutes = Math.floor(hoursms / 60000), // 60*1000
    minutesms = ms % 60000, // 60*1000
    sec = Math.floor(minutesms / 1000);

  let str = "";
  if (days) str = `${str + days}d`;
  if (hours) str = `${str + hours}h`;
  if (minutes) str = `${str + minutes}m`;
  if (sec) str = `${str + sec}s`;

  return str || "0s";
};
