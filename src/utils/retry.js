export class RetryError extends Error {}

import { delay } from './time'

// Si el Error es de tipo RetryError, volvemos a repetir la funcion de forma recursiva cada x segundos
// Pero se limita el numero de peticiones para no saturar la API y que no me baneen
export async function retry(
  functionToRetry,
  { tryCount, maxTries, cooldownInSeconds }
) {
  if (tryCount >= maxTries) {
    throw new Error(
      'Maximo de peticiones alcanzado. No se han obtenido resultados o el servidor de BGG esta caido'
    )
  }

  // Antes de reintentarlo espera un cooldown
  if (tryCount > 0) {
    console.log('Retrying...', tryCount)
    await delay(cooldownInSeconds)
  }

  tryCount++

  return functionToRetry().catch((e) => {
    if (e instanceof RetryError) {
      return retry(functionToRetry, { tryCount, maxTries, cooldownInSeconds })
    }
    throw e
  })
}
