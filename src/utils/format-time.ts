/**
 * Get time format in hh:mm (24 hours)
 * @param dateTime Date object
 * @returns
 */
export const formatTime = (dateTime: Date | string) => {
  let dT;

  // Handle case where input is a time string ("HH:MM")
  if (typeof dateTime === "string" && dateTime.includes(":")) {
    const [hours, minutes] = dateTime.split(":").map(Number);
    dT = new Date();
    dT.setHours(hours, minutes, 0, 0); // Set hours and minutes correctly
  } else {
    dT = new Date(dateTime);
  }

  // Validate the date object
  if (isNaN(dT.getTime())) {
    console.error("Invalid date:", dateTime);
    return "Invalid Time";
  }

  let hour = dT.getHours();
  const min = dT.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12; // Convert 0 -> 12
  const strHour = hour < 10 ? "0" + hour : hour;
  const strMin = min < 10 ? "0" + min : min;

  return `${strHour}:${strMin}${ampm}`;
};
