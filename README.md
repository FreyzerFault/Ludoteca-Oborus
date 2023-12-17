# Aplicación para Visualizar la Ludoteca de Oborus

Usa la API de BGG para obtener datos de la colección actual de Oborus, a tiempo real.

Permite hacer búsquedas de Juegos de Mesa en toda la base de datos de BGG, pudiendo filtrar por aquellos en propiedad de Oborus

## API de BGG

[Documentación API BGG](https://boardgamegeek.com/wiki/page/BGG_XML_API2)

[API de BGG "https://api.geekdo.com/xmlapi2/"](https://api.geekdo.com/xmlapi2/)

[Libreria BGG JS API](https://www.npmjs.com/package/@code-bucket/board-game-geek)

## Reenvío de Peticiones

En la mayoría de las peticiones a BGG se devuelven los datos con un tiempo de espera:

- 1º Respuesta: `<message> Your request for this collection has been accepted and will be processed. Please try again later for access. </message>`
- 2º Respuesta: Datos reales

Si llega la 1º Respuesta con un mensaje de que se está procesando, debemos reenviar la petición con delay de 1 segundo hasta que la respuesta sean los datos buscados.

> Tiene un máximo de reintentos de la petición, porque como recomendación para las APIs, se debe evitar mandar peticiones en bucle, lo cual puede banear tu IP.

### Ejemplos de Consultas

- Consulta de Objeto:
  [/thing?id=[ID]](https://api.geekdo.com/xmlapi2/thing?id=110308)

- Consulta de Colección de un Usuario:
  [(/collection?username=[Username])](https://api.geekdo.com/xmlapi2/collection?username=Oborus)

- Consulta de Info de un Usuario:
  [/user?name=[Username]](https://api.geekdo.com/xmlapi2/user?name=Oborus)

- Consulta de Gameplays de un Usuario:
  [/plays?username=[Username]&id=[ID Juego]](https://api.geekdo.com/xmlapi2/plays?username=Oborus&id=110308)

- Búsqueda de Juegos de Mesa:
  [/search?query=[Búsqueda]](https://api.geekdo.com/xmlapi2/search?query=Virus&type=boardgame)

- Búsqueda de **Expansiones** de Juegos de Mesa:
  [/search?query=[Búsqueda]&type=boardgameexpansion](https://api.geekdo.com/xmlapi2/search?query=Virus&type=boardgameexpansion)

TODO:

✅ Evitar que se haga la misma búsqueda dos veces seguidas.
✅ Muestra primero la colección Owned
✅ Haz que la búsqueda se haga automáticamente al escribir.
✅ Evita que se haga la búsqueda continuamente al escribir (debounce)
✅ Busca en TODOS los Juegos de BGG y muestra de forma visual los que pertenecen a Oborus
