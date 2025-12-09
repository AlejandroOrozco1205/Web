console.log("Cargando servidor...");
 
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');
 
const app = express();
 
connectDB(process.env.MONGO_URI);
 
app.use(cors());
app.use(express.json());
 
console.log("Cargando rutas...");
 
app.use('/api/auth', require('./src/routes/auth'));
console.log("Ruta /api/auth registrada correctamente");
 
app.use('/api/notas', require('./src/routes/notas'));
app.use('/api/usuarios', require('./src/routes/usuarios'));
 
const frontendPath = path.join(__dirname, 'frontend');
 
app.use(express.static(frontendPath));
 
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'home.html'));
});
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
