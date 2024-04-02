const getLocalTimeString = () => {
  const tzoffset = new Date().getTimezoneOffset() * 60000;
  const suffix = new Date().toLocaleTimeString("en-us", { timeZoneName: "short" }).split(" ")[2];
  return new Date(Date.now() - tzoffset).toISOString().slice(0, -1) + suffix;
};

export const log = (severity: string, message: string) => {
  console.log(`[${getLocalTimeString()}] (${severity}) ${message}`);
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
