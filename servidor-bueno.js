import http from "http"
import fs from "fs/promises"
import path from "path"

const PORT = 3000

const server = http.createServer(async(req, res) => {
    // Ruta raíz
    if (req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/plain" })
        res.end("Servidor activo")
        return
    }

    // Ruta /info
    if (req.url === "/info") {
        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ mensaje: "Ruta de información", status: "ok" }))
        return
    }

    // Ruta /api/student
    if (req.url === "/api/student") {
        try {
            const filePath = path.join(process.cwd(), "datos.json")
            const texto = await fs.readFile(filePath, "utf-8")
            const datos = JSON.parse(texto)

            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ ok: true, data: datos }))
        } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ ok: false, error: "Error al leer el archivo" }))
        }
        return
    }

    // Ruta 404
    res.writeHead(404, { "Content-Type": "application/json" })
    res.end(JSON.stringify({
        ok: false,
        error: "Ruta no encontrada",
        ruta: req.url,
        metodo: req.method
    }))
})

server.listen(PORT, () => {
    console.log("Servidor corriendo en http://localhost:3000")
})