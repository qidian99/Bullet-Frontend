import zhTW from './zh-TW';
import zhCN from './zh-CN';
import enUS from './en-US';

const messages = {
  'zh-TW': zhTW,
  'zh-CN': zhCN,
  'en-US': enUS,
};

let locale = 'zh-CN';

export const formatMessage = ({ id, defaultMessage }) => messages[locale][id] || defaultMessage;
export const FormattedMessage = ({ id, defaultMessage }) => (
  messages[locale][id] || defaultMessage || null
);
export const getLocale = () => locale;
export const setLocale = (loc) => {
  locale = loc;
};
