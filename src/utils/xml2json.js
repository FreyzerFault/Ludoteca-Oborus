import X2JS from 'x2js/xml2json'

import {
  unescapeAll,
  unescapeAllAscii,
  unescapeBadAmpersants,
} from './scapeChars'

// X2JS Convierte XML a JSON
export function xml2js(xml) {
  // console.log({ old: xml })

  // &amp; sin espacios adyacentes
  // const ocurrencia = /(?<!\s)&amp;(?!\s)/g

  // &[...]; que no sea &amp;
  // const ocurrencia = /&(?!amp;)(\w+|#[0-9]+);/g

  // &
  // const ocurrencia = '&'

  // &amp;
  // const ocurrencia = '&amp;'

  // OTRO
  // const ocurrencia = /(&amp;quot;|&quot;)/g

  // console.log({
  //   'Ocurrencias de Expresiones Raras ANTES de reemplazar':
  //     CheckInvalidOcurrencies(xml, ocurrencia),
  // })

  xml = cleanXMLText(xml)

  // console.log({
  //   'Ocurrencias de Expresiones Raras DESPUES de reemplazar':
  //     CheckInvalidOcurrencies(xml, ocurrencia),
  // })
  // console.log({ new: xml })

  const x2js = new X2JS({ escapeMode: true })
  const data = x2js.xml_str2json(xml)
  if (!data) throw new Error('Error al parsear XML a Object de JS')

  // console.log('Output:', json)

  return data
}

// TODO Probar cuando no use Vite
// BGG to JSON library:
// import { parseBggXmlApi2ThingResponse } from '@code-bucket/board-game-geek'

// export function xml2JsonThing(xmlData) {
//   const bggResponse = parseBggXmlApi2ThingResponse(xmlData)
//   console.log(bggResponse)
//   return bggResponse
// }

// Reemplaza todos los caracteres codificados, que a la hora de pasarlos por el x2js son invalidos
// Los que esten comentados no son necesarios
function cleanXMLText(text) {
  let validText = text

  // &amp;lt; => &lt;
  validText = unescapeBadAmpersants(text)

  // "              " => " "
  validText = validText.replaceAll(/ +/g, ' ')

  // "&apos;" => "'", "&Igrave;" => Ì, "&szlig;" => 'ß', ...
  validText = unescapeAll(validText)

  // "&#10;" => "\n", "&#xxx" => ...
  validText = unescapeAllAscii(validText)

  return validText
}

// Para checkear cualquier ocurrencia de caracteres invalidos como '&amp;' , '&aacute;' ...
function CheckInvalidOcurrencies(text, invalidExpression = '&') {
  const matches = [...text.matchAll(invalidExpression)]

  const resultado = matches.map((match) => {
    const startIndex = Math.max(match.index - 20, 0)
    const endIndex = Math.min(match.index + match[0].length + 20, text.length)
    return text.slice(startIndex, endIndex)
  })

  return resultado
}
