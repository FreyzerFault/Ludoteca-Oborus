import X2JS from 'x2js/xml2json'

// X2JS Convierte XML a JSON
export function xml2Json(xml) {
  const x2js = new X2JS()
  return x2js.xml_str2json(xml)
}
