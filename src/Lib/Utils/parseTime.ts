import moment from 'moment';

export function parseTime(time: number, format: 1 | 2 = 1, ms = true) {
  let parsedTime = undefined;
  if (!ms) time *= 1000;
  if (format === 1) {
    if (time > 36e5)
      parsedTime = moment(time).format('h [h], mm [m, and] ss [s]');
    else parsedTime = moment(time).format('mm [m and] ss [s]');
  } else {
    parsedTime = moment(time).format('hh:mm:ss');
  }
  if (format !== 1 && parsedTime.length === 2) parsedTime = `00:${parsedTime}`;
  return parsedTime;
}
