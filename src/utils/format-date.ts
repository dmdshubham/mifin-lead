/**
 * Get time format in dd-MM-yyyy
 * @param dateTime Date object
 * @returns
 */
export const formatdate = (dateTime: Date | string) => {
  const dT = new Date(dateTime);
  const day = dT.getDate();
  const monthIndex = dT.getMonth();
  const year = dT.getFullYear();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const formattedDateStr = day + "-" + months[monthIndex] + "-" + year;
  return formattedDateStr;
  //return dT.getDate() + "-" + (dT.getMonth() + 1) + "-" + dT.getFullYear();
};
