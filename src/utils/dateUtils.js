

const convertToISOFormat = (inputDate)=>{
  const [day, month, year] = inputDate.split('/');
  return  `${year}-${month}-${day}T00:00:00Z`;
}
const parseDdMmYyyy =(dateString)=>{
  const originalDate = new Date(dateString);
  // const day = originalDate.getDate();
  // const month = originalDate.getMonth() + 1;
  // const year = originalDate.getFullYear() % 100;
  var year = originalDate.getFullYear();
  var month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
  var day = originalDate.getDate().toString().padStart(2, '0');
  return `${day}/${month}/${year}`;
}
const parseDdMmYy =(dateString)=>{
  const originalDate = new Date(dateString);
  const day = originalDate.getDate();
  const month = originalDate.getMonth() + 1;
  const year = originalDate.getFullYear() % 100;
  return `${day}/${month}/${year}`;
}
const formattedYearMonthDay = (_date) => {
  if (_date === null || _date === undefined || _date === '') {
    return null;
  }
  var originalDate = new Date(_date);
  var year = originalDate.getFullYear();
  var month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
  var day = originalDate.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const parseDdMmYyWithTimeAndSeconds = (dateString) => {
  const originalDate = new Date(dateString);
  const day = originalDate.getDate();
  const month = originalDate.getMonth() + 1;
  const year = originalDate.getFullYear() % 100;
  const hours = originalDate.getHours();
  const minutes = originalDate.getMinutes();
  const seconds = originalDate.getSeconds();

  // Padding single digit day, month, hours, minutes, and seconds with a leading zero
  const paddedDay = String(day).padStart(2, '0');
  const paddedMonth = String(month).padStart(2, '0');
  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  return `${paddedDay}/${paddedMonth}/${year} ${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}



export default { parseDdMmYyyy,parseDdMmYy, parseDdMmYyWithTimeAndSeconds,formattedYearMonthDay ,convertToISOFormat}
