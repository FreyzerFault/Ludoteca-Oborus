import { useState, useEffect } from 'react'

const DYNALIST_TOKEN =
  'l7dl26lYweqlODqqDvT8FF7LtmnyIA9Qj2VHZ-Z0dzR6Ga86MSLmWB7eeKKm3FYVk_L_KAOUQp7wjpFDAU8Gv2fUfTaeMHoAAsBzBcHvKDHo4HSxQVjqzdOi-pLHBOIO'
const DYNALIST_MANUALES_DOC_ID = '3jmCEHKZDYVFIikY2Feo1L7f'
const URL_API_DYNALIST = `https://dynalist.io/api/v1/doc/read`
const URL_MANUALES = `${URL_API_DYNALIST}?token=${DYNALIST_TOKEN}&file_id=${DYNALIST_MANUALES_DOC_ID}`

export function useManuales() {
  const [manuales, setManuales] = useState([])

  useEffect(() => {
    fetchPage(URL_MANUALES)
      .then((document) => console.log(document))
      .catch((err) => console.log(err))
    // setManuales()
  }, [])

  return { manuales }
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    xhr.setRequestHeader('Content-Type', 'application/json')

    xhr.onload = function () {
      if (xhr.status === 200) {
        console.log(xhr)
        resolve(xhr.responseText)
      } else {
        reject(new Error(`Request failed. Status: ${xhr.status}`))
      }
    }
    xhr.onerror = function () {
      reject(new Error('Request failed.'))
    }
    xhr.send()
  })
}
