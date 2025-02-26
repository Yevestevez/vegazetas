import express from 'express'
import cors from 'cors'


const server = express()

server.get('/', (req, res) => {
    res.send('Hello API')
})

const PORT = 8080
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})