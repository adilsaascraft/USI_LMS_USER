export function parseWebinarDate(
  date: string, // DD/MM/YYYY
  time: string // hh:mm AM/PM
) {
  const [day, month, year] = date.split('/').map(Number)

  let [timePart, meridian] = time.split(' ')
  let [hours, minutes] = timePart.split(':').map(Number)

  if (meridian === 'PM' && hours !== 12) hours += 12
  if (meridian === 'AM' && hours === 12) hours = 0

  return new Date(year, month - 1, day, hours, minutes, 0)
}
