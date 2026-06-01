export const timeExecuter = <T extends Array<unknown>>(
  callback: (...args: T) => void,
  timeout: number,
) => {
  let lastRunningTime: number = 0;
  return (...args: T) => {
    if (lastRunningTime + timeout <= Date.now()) {
      lastRunningTime = Date.now();
      callback(...args);
    }
  };
};
