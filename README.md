# Enunciado

## Crea una aplicación para buscar juegos de mesa

API a usar: - [Board Game Atlas API](https://www.boardgameatlas.com/api/docs) Consigue la API Key en la propia página web registrando tu email.

Client-ID: WnTK7L9hmX o JLBr5npPhV

URL Búsqueda: [Search](https://api.boardgameatlas.com/api/search?limit=1&ids=LvcBJmB8US&name=Catan&fields=name,description&fuzzy_match=true&client_id=JLBr5npPhV)
URL Imagen: [Imagen](https://api.boardgameatlas.com/api/game/images?game_id=LvcBJmB8US&limit=20&client_id=WnTK7L9hmX)

Requerimientos:

✅ Necesita mostrar un input para buscar el juego y un botón para buscar.

- Lista los juegos y muestra el título, año y portada.

- Que el formulario funcione

- Haz que las películas se muestren en un grid RESPONSIVE.

- Hacer el fetching de datos a la API

Primera iteración:

- Evitar que se haga la misma búsqueda dos veces seguidas.

- Haz que la búsqueda se haga automáticamente al escribir.

- Evita que se haga la búsqueda continuamente al escribir (debounce)
