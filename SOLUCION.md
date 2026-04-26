# Solución - Parte 1: Depuración --- El Servidor Roto

**Universidad del Valle de Guatemala**
**Sistemas y Tecnologías Web**
**Estudiante:** Sebastián Lemus
**Carnet:** 241155
**Fecha:** 21/04/2026

## Resumen

Se identificaron y corrigieron **6 errores** en el archivo `servidor-malo.js`. Los errores abarcaron categorías de sintaxis, asincronía, lógica y protocolo HTTP.

### Error #1: Cannot use import statement outside a module

**Ubicación:** `package.json` (configuración del proyecto)
**Tipo de error:** Sintaxis

**Qué estaba mal:**
El archivo `servidor-malo.js` usaba `import` (ES Modules), pero Node.js por defecto usa CommonJS (`require`). El `package.json` no tenía la configuración necesaria.

**Cómo lo corregí:**
Agregué `"type": "module"` en el `package.json`:

```json
{
  "name": "laboratorio-4",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node servidor-bueno.js"
  }
}
```

### Error #2: Missing ) after argument list

**Ubicación:** Línea 30 del archivo `servidor-malo.js`
**Tipo de error:** Sintaxis

**Qué estaba mal:**
El `server.listen()` no tenía el paréntesis de cierre.

**Cómo lo corregí:**
Se agregó el paréntesis faltante:

```js
server.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
```

### Error #3: Uso incorrecto de async/await

**Ubicación:** Función manejadora del servidor
**Tipo de error:** Asincronía

**Qué estaba mal:**
Se utilizaba `await` fuera de una función `async`.

**Cómo lo corregí:**
Se declaró la función como `async`:

```js
const handler = async (req, res) => {
  const data = await fs.readFile("index.html", "utf-8");
};
```

### Error #4: No se manejaban errores en promesas

**Ubicación:** Lectura de archivos (`fs.readFile`)
**Tipo de error:** Lógica / Manejo de errores

**Qué estaba mal:**
Si el archivo no existía o fallaba la lectura, el servidor se caía.

**Cómo lo corregí:**
Se agregó un bloque `try-catch`:

```js
try {
  const data = await fs.readFile("index.html", "utf-8");
  res.end(data);
} catch (error) {
  res.statusCode = 500;
  res.end("Error interno del servidor");
}
```

### Error #5: Respuesta HTTP sin encabezados

**Ubicación:** Envío de respuesta al cliente
**Tipo de error:** Protocolo HTTP

**Qué estaba mal:**
No se definía el `Content-Type`, lo que podía causar problemas en el navegador.

**Cómo lo corregí:**
Se agregó el encabezado adecuado:

```js
res.writeHead(200, { "Content-Type": "text/html" });
res.end(data);
```

### Error #6: Ruta no manejada correctamente

**Ubicación:** Condicional de rutas (`req.url`)
**Tipo de error:** Lógica

**Qué estaba mal:**
No se manejaban rutas inexistentes, generando respuestas incorrectas o vacías.

**Cómo lo corregí:**
Se agregó manejo de error 404:

```js
if (req.url === "/") {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end("Página principal");
} else {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Ruta no encontrada");
}
```
