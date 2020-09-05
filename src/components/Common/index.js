import moment from 'moment';

export { default as MenuCreateForm } from './MenuCreateForm';
export { default as MenuItemTable } from './MenuItemTable';
export { default as RoomCard } from './RoomCard';
export const formatTime = (unixTime) => {
  const time = parseInt(unixTime, 10);
  const minDiff = moment().diff(time, 'minutes');
  if (minDiff < 60) {
    return `${minDiff <= 1 ? 1 : minDiff} minute${minDiff <= 1 ? '' : 's'} ago`;
  }

  const hourDiff = moment().diff(time, 'hours');
  if (hourDiff < 24) {
    return `${hourDiff} hour${hourDiff === 1 ? '' : 's'} ago`;
  }

  const yearDiff = moment().diff(time, 'years');
  if (yearDiff === 0) {
    return moment(time).format('MM-DD HH:mm');
  }

  return moment(time).format('YYYY-MM-DD HH:mm');
};

export { default as CustomModal } from './CustomModal/index';
export { default as DropDownSelect } from './CustomModal/DropDownSelect';
export { default as FormInput } from './CustomModal/FormInput';
