export const getCurrDay = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  let hour = today.getHours();

  if (hour < 15) {
    dd--;
  }

  const formattedToday = yyyy + "/" + mm + "/" + dd + " 02:00";
  return formattedToday;
};
