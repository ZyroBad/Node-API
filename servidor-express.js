import express from "express"
import crypto from "crypto"
import fs from "fs/promises"
import path from "path"

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000

const app = express()
app.use(express.json())

function ok(res, data, statusCode = 200) {
  res.status(statusCode).json({ ok: true, data })
}

function fail(res, error, statusCode = 400, extra = {}) {
  res.status(statusCode).json({ ok: false, error, ...extra })
}

const REQUIRED_BOOK_FIELDS = [
  "titulo",
  "autor",
  "genero",
  "anio",
  "paginas",
  "disponible",
]

function missingFields(body, requiredFields) {
  return requiredFields.filter((field) => body?.[field] === undefined)
}

function pickAllowedFields(body, allowedFields) {
  const out = {}
  for (const key of allowedFields) {
    if (body?.[key] !== undefined) out[key] = body[key]
  }
  return out
}

function unknownFields(body, allowedFields) {
  if (!body || typeof body !== "object") return []
  return Object.keys(body).filter((key) => !allowedFields.includes(key))
}

function isValidBookShape(book) {
  if (typeof book.titulo !== "string" || book.titulo.trim() === "") return false
  if (typeof book.autor !== "string" || book.autor.trim() === "") return false
  if (typeof book.genero !== "string" || book.genero.trim() === "") return false
  if (typeof book.anio !== "number" || !Number.isFinite(book.anio)) return false
  if (typeof book.paginas !== "number" || !Number.isFinite(book.paginas)) return false
  if (typeof book.disponible !== "boolean") return false
  return true
}

const libros = [
  {
    id: crypto.randomUUID(),
    titulo: "Cien años de soledad",
    autor: "Gabriel García Márquez",
    genero: "ficcion",
    anio: 1967,
    paginas: 471,
    disponible: true,
  },
  {
    id: crypto.randomUUID(),
    titulo: "El principito",
    autor: "Antoine de Saint-Exupéry",
    genero: "ficcion",
    anio: 1943,
    paginas: 96,
    disponible: true,
  },
  {
    id: crypto.randomUUID(),
    titulo: "Clean Code",
    autor: "Robert C. Martin",
    genero: "programacion",
    anio: 2008,
    paginas: 464,
    disponible: false,
  },
  {
    id: crypto.randomUUID(),
    titulo: "Eloquent JavaScript",
    autor: "Marijn Haverbeke",
    genero: "programacion",
    anio: 2018,
    paginas: 472,
    disponible: true,
  },
]

app.get("/", (req, res) => {
  ok(res, {
    mensaje: "API Express activa",
    endpoints: {
      info: "GET /info",
      student: "GET /api/student",
      libros: {
        list: "GET /api/libros?genero=ficcion",
        get: "GET /api/libros/:id",
        create: "POST /api/libros",
        replace: "PUT /api/libros/:id",
        update: "PATCH /api/libros/:id",
        delete: "DELETE /api/libros/:id",
      },
    },
  })
})

app.get("/info", (req, res) => {
  ok(res, { mensaje: "Ruta de información", status: "ok" })
})

app.get("/api/student", async (req, res) => {
  try {
    const filePath = path.join(process.cwd(), "datos.json")
    const texto = await fs.readFile(filePath, "utf-8")
    const datos = JSON.parse(texto)
    ok(res, datos)
  } catch {
    fail(res, "Error al leer el archivo", 500)
  }
})

app.get("/api/libros", (req, res) => {
  const { genero } = req.query
  if (genero === undefined) {
    ok(res, libros)
    return
  }

  const generoBuscado = String(genero).trim().toLowerCase()
  const filtrados = libros.filter(
    (libro) => libro.genero.trim().toLowerCase() === generoBuscado,
  )
  ok(res, filtrados)
})

app.get("/api/libros/:id", (req, res) => {
  const libro = libros.find((x) => x.id === req.params.id)
  if (!libro) return fail(res, "Recurso no encontrado", 404)
  ok(res, libro)
})

app.post("/api/libros", (req, res) => {
  const extra = unknownFields(req.body, REQUIRED_BOOK_FIELDS)
  if (extra.length > 0) {
    return fail(res, "Campos no permitidos", 400, { campos: extra })
  }

  const faltantes = missingFields(req.body, REQUIRED_BOOK_FIELDS)
  if (faltantes.length > 0) {
    return fail(res, "Faltan campos obligatorios", 400, { faltan: faltantes })
  }

  const draft = pickAllowedFields(req.body, REQUIRED_BOOK_FIELDS)
  if (!isValidBookShape(draft)) {
    return fail(res, "Campos inválidos", 400)
  }

  const nuevo = { id: crypto.randomUUID(), ...draft }
  libros.push(nuevo)
  ok(res, nuevo, 201)
})

app.put("/api/libros/:id", (req, res) => {
  const idx = libros.findIndex((x) => x.id === req.params.id)
  if (idx === -1) return fail(res, "Recurso no encontrado", 404)

  const extra = unknownFields(req.body, REQUIRED_BOOK_FIELDS)
  if (extra.length > 0) {
    return fail(res, "Campos no permitidos", 400, { campos: extra })
  }

  const faltantes = missingFields(req.body, REQUIRED_BOOK_FIELDS)
  if (faltantes.length > 0) {
    return fail(res, "Faltan campos obligatorios", 400, { faltan: faltantes })
  }

  const draft = pickAllowedFields(req.body, REQUIRED_BOOK_FIELDS)
  if (!isValidBookShape(draft)) {
    return fail(res, "Campos inválidos", 400)
  }

  const actualizado = { id: libros[idx].id, ...draft }
  libros[idx] = actualizado
  ok(res, actualizado)
})

app.patch("/api/libros/:id", (req, res) => {
  const idx = libros.findIndex((x) => x.id === req.params.id)
  if (idx === -1) return fail(res, "Recurso no encontrado", 404)

  const extra = unknownFields(req.body, REQUIRED_BOOK_FIELDS)
  if (extra.length > 0) {
    return fail(res, "Campos no permitidos", 400, { campos: extra })
  }

  const patch = pickAllowedFields(req.body, REQUIRED_BOOK_FIELDS)
  if (Object.keys(patch).length === 0) {
    return fail(res, "No se enviaron campos para actualizar", 400)
  }

  const candidato = { ...libros[idx], ...patch }
  const { id: _id, ...sinId } = candidato
  if (!isValidBookShape(sinId)) {
    return fail(res, "Campos inválidos", 400)
  }

  libros[idx] = candidato
  ok(res, candidato)
})

app.delete("/api/libros/:id", (req, res) => {
  const idx = libros.findIndex((x) => x.id === req.params.id)
  if (idx === -1) return fail(res, "Recurso no encontrado", 404)

  const [borrado] = libros.splice(idx, 1)
  ok(res, borrado)
})

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "Ruta no encontrada",
    ruta: req.originalUrl,
    metodo: req.method,
    sugerencia: "Visita / para ver los endpoints disponibles",
  })
})

app.use((err, req, res, next) => {
  fail(res, "Error interno del servidor", 500)
})

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`)
})
