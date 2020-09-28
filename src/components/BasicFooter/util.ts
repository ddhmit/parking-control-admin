import moment from 'moment';
export function formatFooterTime(date: string) {
  return moment(date).format('YYYY-MM-DD');
}
