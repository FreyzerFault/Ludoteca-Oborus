import X2JS from 'x2js/xml2json'

// X2JS Convierte XML a JSON
export function xml2Json(xml) {
  // CheckInvalidOcurrencies(xml)
  xml = replaceInvalidText(xml)
  // CheckInvalidOcurrencies(xml)

  const x2js = new X2JS({ escapeMode: true })
  const json = x2js.xml_str2json(xml)
  return json
}

// Reemplaza todos los caracteres codificados, que a la hora de pasarlos por el x2js son invalidos
function replaceInvalidText(text) {
  const validText = text
    .replaceAll('&ndash;', '-')
    .replaceAll('&mdash;', '-')
    .replaceAll('&nbsp;', ' ')
  // .replaceAll('&amp;', '&')
  // .replaceAll('&quot;', '"')
  // .replaceAll('&apos;', "'")
  // .replaceAll('&lt; ', '<')
  // .replaceAll('&gt;', '>')
  // .replaceAll('&ntilde;', 'ñ')
  // .replaceAll('&Ntilde;', 'N')
  // .replaceAll('&aacute;', 'á')
  // .replaceAll('&eacute;', 'é')
  // .replaceAll('&iacute;', 'í')
  // .replaceAll('&oacute;', 'ó')
  // .replaceAll('&uacute;', 'ú')
  // .replaceAll('&Ntilde;', 'N')
  // .replaceAll('&Aacute;', 'Á')
  // .replaceAll('&Eacute;', 'É')
  // .replaceAll('&Iacute;', 'Í')
  // .replaceAll('&Oacute;', 'Ó')
  // .replaceAll('&Uacute;', 'Ú')
  // .replaceAll('&euro;', '€')
  // .replaceAll('&#039;', "'")

  return validText
}

// Para checkear cualquier ocurrencia de caracteres invalidos como '&amp;' , '&aacute;' ...
function CheckInvalidOcurrencies(text) {
  const invalidInitiator = '&'

  let indexes = [],
    i = -1
  while ((i = text.indexOf(invalidInitiator, i + 1)) != -1) {
    indexes.push(i)
  }

  const phrasesOfOcurrencies = indexes.map((index) =>
    text.slice(index - 10, index + 20)
  )
  console.log({ ocurrencias: phrasesOfOcurrencies })
}

// Numero de Ocurrencias de un Substring
function count(main_str, sub_str) {
  main_str += ''
  sub_str += ''

  if (sub_str.length <= 0) {
    return main_str.length + 1
  }

  const subStr = sub_str.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return (main_str.match(new RegExp(subStr, 'gi')) || []).length
}
