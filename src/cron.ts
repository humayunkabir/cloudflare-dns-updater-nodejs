import { CronJob } from 'cron';
import { initDNSUpdater } from './utils';

const cronTime = Bun.env.CRON_TIME;

if (cronTime) {
  CronJob.from({
    cronTime,
    onTick: initDNSUpdater,
    waitForCompletion: true,
    start: true,
    timeZone: 'Asia/Dhaka',
  });
} else {
  console.log('Specify CRON_TIME in .env file');
}
