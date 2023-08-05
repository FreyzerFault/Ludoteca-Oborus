const xmlCaracteresEspeciales = {
  '&ndash;': '–',
  '&mdash;': '—',
  // '&quot;': '"',
  '&ldquo;': '"',
  '&rdquo;': '"',
  '&lsquo;': "'",
  '&rsquo;': "'",
  '&apos;': "'",
  '&sbquo;': '‚',
  '&bdquo;': '„',
  '&prime;': '′',
  '&Prime;': '″',
  '&nbsp;': ' ',
  '&thinsp;': ' ',
  '&ensp;': ' ',
  '&emsp;': ' ',
  '&asymp;': '≈',
  '&ne;': '≠',
  // '&lt;': '<',
  // '&gt;': '>',
  '&le;': '≤',
  '&ge;': '≥',
  '&ntilde;': 'ñ',
  '&Ntilde;': 'Ñ',
  '&acute;': '´',
  '&aacute;': 'á',
  '&eacute;': 'é',
  '&iacute;': 'í',
  '&oacute;': 'ó',
  '&uacute;': 'ú',
  '&Aacute;': 'Á',
  '&Eacute;': 'É',
  '&Iacute;': 'Í',
  '&Oacute;': 'Ó',
  '&Uacute;': 'Ú',
  '&euro;': '€',
  '&pound;': '£',
  '&cent;': '¢',
  '&yen;': '¥',
  '&curren;': '¤',
  '&trade;': '™',
  '&copy;': '©',
  '&reg;': '®',
  '&sect;': '§',
  '&laquo;': '«',
  '&raquo;': '»',
  '&deg;': '°',
  '&plusmn;': '±',
  '&para;': '¶',
  '&brvbar;': '¦',
  '&middot;': '·',
  '&hellip;': '…',
  '&frac12;': '½',
  '&frac14;': '¼',
  '&frac34;': '¾',
  '&sup1;': '¹',
  '&sup2;': '²',
  '&sup3;': '³',
  '&ordm;': 'º',
  '&ordf;': 'ª',
  '&times;': '×',
  '&divide;': '÷',
  '&micro;': 'µ',
  '&eth;': 'ð',
  '&ETH;': 'Ð',
  '&thorn;': 'þ',
  '&THORN;': 'Þ',
  '&dagger;': '†',
  '&Dagger;': '‡',
  '&not;': '¬',
  '&bull;': '•',
  '&macr;': '¯',
  '&iexcl;': '¡',
  '&iquest;': '¿',
  '&grave;': '`',
  '&agrave;': 'à',
  '&egrave;': 'è',
  '&igrave;': 'ì',
  '&ograve;': 'ò',
  '&ugrave;': 'ù',
  '&Agrave;': 'À',
  '&Egrave;': 'È',
  '&Igrave;': 'Ì',
  '&Ograve;': 'Ò',
  '&circ;': '^',
  '&acirc;': 'â',
  '&ecirc;': 'ê',
  '&icirc;': 'î',
  '&ocirc;': 'ô',
  '&ucirc;': 'û',
  '&Acirc;': 'Â',
  '&Ecirc;': 'Ê',
  '&Icirc;': 'Î',
  '&Ocirc;': 'Ô',
  '&Ucirc;': 'Û',
  '&atilde;': 'ã',
  '&otilde;': 'õ',
  '&Atilde;': 'Ã',
  '&Otilde;': 'Õ',
  '&uml;': '¨',
  '&auml;': 'ä',
  '&euml;': 'ë',
  '&iuml;': 'ï',
  '&ouml;': 'ö',
  '&uuml;': 'ü',
  '&Auml;': 'Ä',
  '&Euml;': 'Ë',
  '&Iuml;': 'Ï',
  '&Ouml;': 'Ö',
  '&Uuml;': 'Ü',
  '&AElig;': 'Æ',
  '&aelig;': 'æ',
  '&szlig;': 'ß',
  '&Ccedil;': 'Ç',
  '&ccedil;': 'ç',
  '&cedil;': '¸',
  '&Oslash;': 'Ø',
  '&oslash;': 'ø',
  '&Yacute;': 'Ý',
  '&yacute;': 'ý',
  '&yuml;': 'ÿ',
  '&aring;': 'å',
  // Agrega aquí más caracteres especiales que necesites desescapar
}

// "&apos;" => "'", "&Igrave;" => Ì, "&szlig;" => 'ß', ...
export function unescapeAll(text) {
  return text.replaceAll(/&(?!amp;|quot;|lt;|gt;)(\w+);/g, (match) => {
    if (match === '&quot;')
      console.log(xmlCaracteresEspeciales[match] || `Ø${match.substring(1)}`)
    return xmlCaracteresEspeciales[match] || `Ø${match.substring(1)}`
  })
}

// "&#10;" => "\n", "&#xxx" => ...
export function unescapeAllAscii(text) {
  return text.replace(/&#[0-9]+;/g, (match) => {
    const codigo = match.substring(2, match.length - 1)
    const caracter = String.fromCharCode(parseInt(codigo, 10))
    return caracter
  })
}

// &amp;lt; => &lt;
export function unescapeBadAmpersants(text) {
  // La RegEx busca las cadenas "&amp;lt;", "&amp;ndash;"...
  const pattern = /&amp;([a-zA-Z]+|#\d+|\w+);/g
  const replaceFunc = (match, grupo) => `&${grupo};`

  // &amp;lt; => &lt;
  return text.replaceAll(pattern, replaceFunc)
}
