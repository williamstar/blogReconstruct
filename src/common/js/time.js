/* eslint-disable */
export const currentTime = (now) => {
  now = now ? new Date(now) : new Date();
  return `${now.getFullYear()}年${(now.getMonth() + 1)}月${now.getDate()}日 ${(now.getHours() < 10 ? `0${now.getHours()}` : now.getHours())}:${(now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes())}:${(now.getSeconds() < 10 ? `0${now.getSeconds()}` : now.getSeconds())}`;
};
