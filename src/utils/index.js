const moment = require('moment')
const HTTP_CODE = require('./http-code')

function isNothing(arg) {
  return (arg === null || arg === undefined)
}

function isSomething(arg) {
  return !isNothing(arg)
}

function safeProp(obj, propsFormat, alt = null) {
  if (!obj) return alt
  const props = propsFormat.split('.')
  let curVal = obj
  for (let i = 0; i < props.length; i++) {
    if (isSomething(curVal[props[i]])) {
      curVal = curVal[props[i]]
    } else {
      return alt
    }
  }
  return curVal
}

function statusText(statusCode) {
  if (statusCode) {
    return HTTP_CODE[String(statusCode)]
  } else {
    return 'Invalid Status Code'
  }
}

function statusColor(statusCode) {
  if (!statusCode || statusCode < 200) {
    return '#2d8cf0'
  } else if (statusCode >= 200 && statusCode < 400) {
    return '#19be6b'
  } else if (statusCode >= 400 && statusCode < 500) {
    return '#ff9900'
  } else {
    return '#ed3f14'
  }
}

function cleanReverse(arr) {
  return arr.slice().reverse()
}

function formatTime(time) {
  let nowTime = moment()
  let testTime = moment(time)
  let detaSeconds = (Date.parse(nowTime) - Date.parse(testTime)) / 1000.0
  let detaMinutes = detaSeconds / 60.0
  let detaHours = detaMinutes / 60.0
  let detaDays = detaHours / 24.0
  if (nowTime.year() !== testTime.year()) { // 不是一年的
      return testTime.format('YYYY-MM-DD')
  } else if (~~detaDays >= 1) { // 超过一天
      return testTime.format('MM-DD')
  } else if (~~detaHours >= 1) { // 超过一小时
      return `${~~detaHours}小时前`
  } else if (~~detaMinutes >= 1) { // 超过一分钟
      return `${~~detaMinutes}分钟前`
  } else {
      return '刚刚'
  }
}

module.exports = {
  isNothing,
  isSomething,
  safeProp,
  cleanReverse,
  statusText,
  statusColor,
}
