const timeFormatter = (time, timeFormat) => {
  if (timeFormat === 'H24') return time.slice(0, time.lastIndexOf(':'))
  else if (timeFormat === 'H12') {
    const current = time.slice(0, time.lastIndexOf(':'))
    const hour = parseInt(current.slice(0, current.indexOf(':')))
    if (hour === 0) return current.replace('00', '12') + ' AM'
    else if (hour > 12)
      return current.replace(`${hour}`, `${hour - 12}`) + ' PM'
    else return current + ' AM'
  }
}

export default timeFormatter
