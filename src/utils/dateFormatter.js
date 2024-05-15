const dateFormatter = (date, format) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const dateRef = new Date(date)
  const year = dateRef.getFullYear()
  const month = dateRef.getMonth()
  const day = dateRef.getDate()
  if (format === 'MDY') {
    return `${months[month]} ${day}, ${year}`
  } else if (format === 'DMY') {
    return `${day} ${months[month]} ${year}`
  } else {
    return `${year} ${months[month]} ${day}`
  }
}

export default dateFormatter
