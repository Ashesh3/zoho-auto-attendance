import { DateTime } from "luxon";

export const log = (severity: string, message: string, tzone = "local") => {
  const time = DateTime.now().setZone(tzone)
  console.log(`[${time.setLocale('en-gb').toLocaleString(DateTime.DATE_SHORT)}, ${time.toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET)}] (${severity}) ${message}`);
};

export const generateCronExpression = (time: string, excludedDays: string[]) => {
  const [hour, minute] = time.split(":");

  const dayMap = {
    sunday: "0",
    monday: "1",
    tuesday: "2",
    wednesday: "3",
    thursday: "4",
    friday: "5",
    saturday: "6",
  };

  const allDays = Object.keys(dayMap).map((day) => dayMap[day as keyof typeof dayMap]);

  const includedDays = allDays.filter((day) => !excludedDays.includes(Object.keys(dayMap).find((key) => dayMap[key as keyof typeof dayMap] === day) ?? ""));

  const cronExp = `${minute} ${hour} * * ${includedDays.join(",")}`;

  return cronExp;
};
