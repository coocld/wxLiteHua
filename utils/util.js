const formatTime = date => {
  var now = new Date(date * 1000);
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  minute = minute >= 10 ? minute : '0' + minute;
  hour = hour >= 10 ? hour : '0' + hour;
  date = date >= 10 ? date : '0' + date;
  month = month >= 10 ? month : '0' + month;
  return year + "-" + month + "-" + date + "   " + hour + ":" + minute;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}
