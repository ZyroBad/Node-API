import express from 'express'
import { randomUUID } from 'crypto'

const app = express()
const PORT = 3002
    // Middleware para parsear JSON
app.use(express.json())

// Base de datos en memoria
let libros = [{
        id: randomUUID(),
        titulo: "Cien años de soledad",
        autor: "Gabriel García Márquez",
        año: 1967,
        genero: "Realismo mágico",
        isbn: "978-84-376-0494-7"
    },
    {
        id: randomUUID(),
        titulo: "El amor en los tiempos del cólera",
        autor: "Gabriel García Márquez",
        año: 1985,
        genero: "Novela romántica",
        isbn: "978-84-376-0495-4"
    },
    {
        id: randomUUID(),
        titulo: "Rayuela",
        autor: "Julio Cortázar",
        año: 1963,
        genero: "Novela experimental",
        isbn: "978-84-376-0496-1"
    },
    {
        id: randomUUID(),
        titulo: "Ficciones",
        autor: "Jorge Luis Borges",
        año: 1944,
        genero: "Cuento fantástico",
        isbn: "978-84-376-0497-8"
    }
]

// ENDPOINTS 

// GET /libros - Listar todos los libros 
app.get('/libros', (req, res) => {
    const { genero } = req.query

    let resultado = [...libros]

    if (genero) {
        resultado = resultado.filter(libro =>
            libro.genero.toLowerCase().includes(genero.toLowerCase())
        )
    }

    res.status(200).json({
        ok: true,
        data: resultado,
        total: resultado.length
    })
})

// GET /libros/:id - Obtener un libro por ID
app.get('/libros/:id', (req, res) => {
    const { id } = req.params
    const libro = libros.find(l => l.id === id)

    if (!libro) {
        return res.status(404).json({
            ok: false,
            error: `Libro con ID ${id} no encontrado`
        })
    }

    res.status(200).json({
        ok: true,
        data: libro
    })
})

// POST /libros - Crear un nuevo libro
app.post('/libros', (req, res) => {
    const { titulo, autor, año, genero, isbn } = req.body

    // Validar campos obligatorios
    if (!titulo || !autor || !año || !genero) {
        return res.status(400).json({
            ok: false,
            error: 'Faltan campos obligatorios: titulo, autor, año, genero'
        })
    }

    // Validar que año sea un número
    if (typeof año !== 'number' || año < 0 || año > new Date().getFullYear()) {
        return res.status(400).json({
            ok: false,
            error: 'El año debe ser un número válido'
        })
    }

    const nuevoLibro = {
        id: randomUUID(),
        titulo,
        autor,
        año,
        genero,
        isbn: isbn || null
    }

    libros.push(nuevoLibro)

    res.status(201).json({
        ok: true,
        data: nuevoLibro
    })
})

// PUT /libros/:id - Actualizar un libro COMPLETO
app.put('/libros/:id', (req, res) => {
    const { id } = req.params
    const { titulo, autor, año, genero, isbn } = req.body
    const index = libros.findIndex(l => l.id === id)

    if (index === -1) {
        return res.status(404).json({
            ok: false,
            error: `Libro con ID ${id} no encontrado`
        })
    }

    // Validar campos obligatorios
    if (!titulo || !autor || !año || !genero) {
        return res.status(400).json({
            ok: false,
            error: 'Faltan campos obligatorios: titulo, autor, año, genero'
        })
    }

    // Validar que año sea un número
    if (typeof año !== 'number' || año < 0 || año > new Date().getFullYear()) {
        return res.status(400).json({
            ok: false,
            error: 'El año debe ser un número válido'
        })
    }

    libros[index] = {
        ...libros[index],
        titulo,
        autor,
        año,
        genero,
        isbn: isbn || null
    }

    res.status(200).json({
        ok: true,
        data: libros[index]
    })
})

// PATCH /libros/:id - Actualizar PARCIALMENTE un libro
app.patch('/libros/:id', (req, res) => {
    const { id } = req.params
    const updates = req.body
    const index = libros.findIndex(l => l.id === id)

    if (index === -1) {
        return res.status(404).json({
            ok: false,
            error: `Libro con ID ${id} no encontrado`
        })
    }

    // Actualizar solo los campos que vienen en el body
    libros[index] = {
        ...libros[index],
        ...updates
    }

    res.status(200).json({
        ok: true,
        data: libros[index]
    })
})

// DELETE /libros/:id - Eliminar un libro
app.delete('/libros/:id', (req, res) => {
    const { id } = req.params
    const index = libros.findIndex(l => l.id === id)

    if (index === -1) {
        return res.status(404).json({
            ok: false,
            error: `Libro con ID ${id} no encontrado`
        })
    }

    const libroEliminado = libros[index]
    libros.splice(index, 1)

    res.status(200).json({
        ok: true,
        data: libroEliminado,
        mensaje: 'Libro eliminado correctamente'
    })
})

// Ruta 404 para endpoints no existentes
app.use((req, res) => {
    res.status(404).json({
        ok: false,
        error: 'Ruta no encontrada',
        ruta: req.url,
        metodo: req.method
    })
})

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`API de Libros corriendo en http://localhost:${PORT}`)
    console.log(`Endpoints disponibles:`)
    console.log(`  GET    /libros`)
    console.log(`  GET    /libros/:id`)
    console.log(`  POST   /libros`)
    console.log(`  PUT    /libros/:id`)
    console.log(`  PATCH  /libros/:id`)
    console.log(`  DELETE /libros/:id`)
})