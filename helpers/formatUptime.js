module.exports = (time) => {
  console.log(time);
  let unit = 'second';
  let uptime;

  if (time > 60) {
    uptime = time / 60;
    unit = 'minute';
  }

  if (uptime > 60) {
    uptime /= 60;
    unit = 'hour';
  }

  if (uptime !== 1) {
    unit += 's';
  }

  uptime = `${uptime} ${unit}`;
  console.log(uptime);
  return uptime;
};
