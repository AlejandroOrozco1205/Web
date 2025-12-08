console.log("Cargando servidor...");

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
    res.json({ msg: 'Servidor funcionando!' });
});

// Conectar a Mongo
connectDB(process.env.MONGO_URI);

// Rutas
console.log("Cargando rutas...");
app.use('/api/auth', require('./src/routes/auth'));
console.log("Ruta /api/auth registrada correctamente");
app.use('/api/notas', require('./src/routes/notas'));
app.use('/api/usuarios', require('./src/routes/usuarios'));

// 404
app.use((req, res) => res.status(404).json({ msg: 'Endpoint not found' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
