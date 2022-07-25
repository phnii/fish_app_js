module.exports  = {
  ymd: (date) => {
    return date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate()
  },
  ymdhm: (date) => {
    return date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate()
      + ' ' + date.getHours() + ':' + date.getMinutes();
  }
}