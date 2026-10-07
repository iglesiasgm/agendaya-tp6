export const isNonWorkingDay = (
  date: string,
  nonWorkingDays: string[],
): boolean => {
  return nonWorkingDays.includes(date);
};

export const addNonWorkingDay = (
  nonWorkingDays: string[],
  date: string,
): string[] => {
  if (isNonWorkingDay(date, nonWorkingDays)) {
    return nonWorkingDays;
  }

  return [...nonWorkingDays, date];
};
