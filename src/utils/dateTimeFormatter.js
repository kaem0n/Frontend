import dateFormatter from './dateFormatter'
import timeFormatter from './timeFormatter'

const dateTimeFormatter = (dateTime, dateFormat, timeFormat) => {
  const split = dateTime.split('T')
  const date = split[0]
  const time = split[1]
  return (
    dateFormatter(date, dateFormat) + ' · ' + timeFormatter(time, timeFormat)
  )
}

export default dateTimeFormatter
