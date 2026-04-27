\# Pruebas de la API - Postman



\*\*Nombre:\*\* Sebastián Lemus

\*\*Carnet:\*\* 241155



\---



\## Endpoints probados



\### 1. GET /libros - Listar todos los libros



!\[GET libros](screenshots/get-libros.png)



\*\*Respuesta esperada:\*\* Status 200, array de libros



\---



\### 2. GET /libros?genero=realismo - Filtrar por género



!\[Filtro por género](screenshots/filtro-genero.png)



\*\*Respuesta esperada:\*\* Status 200, libros del género "Realismo mágico"



\---



\### 3. GET /libros/:id - Obtener libro por ID



!\[GET libro por ID](screenshots/get-libros-id.png)



\*\*Respuesta esperada:\*\* Status 200, objeto del libro



\---



\### 4. POST /libros - Crear un nuevo libro



!\[POST crear libro](screenshots/post-libros.png)



\*\*Body:\*\*

```json

{

&#x20;   "titulo": "Pedro Páramo",

&#x20;   "autor": "Juan Rulfo",

&#x20;   "año": 1955,

&#x20;   "genero": "Realismo mágico",

&#x20;   "isbn": "978-84-376-0498-5"

}

