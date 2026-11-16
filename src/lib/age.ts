/** Fecha de nacimiento de Edgar (AAAA-MM-DD). La edad se calcula sola. */
export const BIRTH_DATE = '2006-11-28'

export function getAge(birth: string = BIRTH_DATE, today: Date = new Date()): number {
  const [y, m, d] = birth.split('-').map(Number)
  let age = today.getFullYear() - y
  const month = today.getMonth() + 1
  if (month < m || (month === m && today.getDate() < d)) age--
  return age
}
