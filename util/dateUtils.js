// util/dateUtils.js

const COMPANY_TIMEZONE = "Asia/Kolkata";

exports.getWeekRange = () => {
  // Current date in IST
  const nowIST = new Date(
    new Date().toLocaleString("en-US", { timeZone: COMPANY_TIMEZONE })
  );

  const day = nowIST.getDay(); // 0=Sun, 1=Mon
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(nowIST);
  monday.setDate(nowIST.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { monday, sunday };
};
