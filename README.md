# Laboratorio 4 — API con Express (Parte 2)

## Requisitos

- Node.js
- npm

## Instalación

```bash
npm install
```

## Correr el servidor

```bash
npm start
```

Servidor en `http://localhost:3000`.

## Endpoints

### Informativos

- `GET /` lista endpoints disponibles
- `GET /info` información general
- `GET /api/student` lee `datos.json`

### Recurso: Libros

Estructura (sin `id`): `titulo`, `autor`, `genero`, `anio`, `paginas`, `disponible`.

- `GET /api/libros` lista todos
- `GET /api/libros?genero=ficcion` filtrado por query param `genero`
- `GET /api/libros/:id` obtiene uno
- `POST /api/libros` crea (valida campos obligatorios)
- `PUT /api/libros/:id` reemplaza completo (requiere todos los campos)
- `PATCH /api/libros/:id` actualiza parcial
- `DELETE /api/libros/:id` elimina

## Respuestas JSON

- Éxito: `{ "ok": true, "data": ... }`
- Error: `{ "ok": false, "error": "Mensaje descriptivo" }`

## 404

Cualquier ruta inexistente responde con status `404` y un JSON que incluye `ruta` y `metodo`.

