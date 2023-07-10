# Aplicación para Buscar Juegos de Mesa en Oborus

Por ahora es algo simple. Usa la API de BGG para obtener datos de la colección actual de Oborus.

El objetivo es crear un buscador que recoja TODOS los juegos de BGG y permita señalar cuáles pertenecen a la Biblio de Oborus.

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

### Publicar DATOS

Endpoint para hacer peticiones POST o PUT:

https://boardgamegeek.com/geekplay.php

Ejemplos de Código de la comunidad donde se hacen peticiones POST

- [Logear Gameplays en powershell](https://boardgamegeek.com/thread/2987087/wanting-bulk-upload-played-games)
- [Logear Gameplays en powershell](https://github.com/Kickbut101/BGGPlayUpload/blob/96c6c7dba5738f8ee039e35eeb2531e83263a321/BGGPlayUpload2.2.ps1)

---

## API de BGA (Board Game Atlas)

Esta API tiene menos datos que BGG y pero se pueden actualizar los datos de usuario con los de BGG, pero no en el sentido contrario. Es decir, no puedes pasar tus datos de BGA a BGG.

La he usado por comodidad y sencillez. Sus datos están en JSON y mejor estructurados, lo que me facilita la consulta de ello. Pero al final mi objetivo es que todos los datos estén sincronizados con BGG, que es la plataforma principal que usan los socios de Oborus.

[Documentación de la API de BGA (Board Game Atlas)](https://www.boardgameatlas.com/api/docs)

La API pide una API Key, necesaria para TODAS las peticiones. Se añaden como parámetro a las URL (&client_id=\*\*\*\*\*\*\*\*\*\*).

Consigue la API Key en la propia página web registrando tu email.

- URL de la API de BGA:
  [https://api.boardgameatlas.com/api/](https://api.boardgameatlas.com/api/)

- URI Búsqueda de Juego por Nombre (solo 1):
  ["/search?limit=1&name=[Nombre del Juego]&fields=[propiedades del juego (name,description)]&fuzzy_match=true&client_id=..."](https://api.boardgameatlas.com/api/search?limit=1&name=Catan&fields=name,description&fuzzy_match=true&client_id=WnTK7L9hmX)

- URI Búsqueda Juego/s por ID:
  [/search?limit=1&ids=[IDs de los Juegos]&fields=[propiedades del juego (name,description)]&fuzzy_match=true&client_id=...](https://api.boardgameatlas.com/api/search?limit=1&ids=LvcBJmB8US&fields=name,description&fuzzy_match=true&client_id=JLBr5npPhV)

- URI Imagen de BGA
  [images?game_id=[ID del Juego]&limit=20&client_id=...](https://api.boardgameatlas.com/api/game/images?game_id=LvcBJmB8US&limit=20&client_id=WnTK7L9hmX)

---

TODO:

✅ Evitar que se haga la misma búsqueda dos veces seguidas.
✅ Muestra primero la colección Owned

- Usar la [Libreria BGG JS API](https://www.npmjs.com/package/@code-bucket/board-game-geek)

- Haz que la búsqueda se haga automáticamente al escribir.
- Evita que se haga la búsqueda continuamente al escribir (debounce)
- Busca en TODOS los Juegos de BGG y muestra de forma visual los que pertenecen a Oborus
- Deja que el usuario pueda añadir un juego a la biblioteca de Oborus si no está, y que lo elimine si está
