// Numero de Ocurrencias de un Substring
export function countOcurrencies(main_str, sub_str) {
  main_str += ''
  sub_str += ''

  if (sub_str.length <= 0) {
    return main_str.length + 1
  }

  const subStr = sub_str.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return (main_str.match(new RegExp(subStr, 'gi')) || []).length
}
