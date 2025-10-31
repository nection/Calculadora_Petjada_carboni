// server.js - Servidor web per a Carbon-IQ Strategic Analyzer

const express = require('express');
const path = require('path');

const app = express();

// Definim el port d'execució. Si el port 3001 està ocupat, canvia'l aquí.
const PORT = process.env.PORT || 3001;

// Li diem a Express que serveixi tots els arxius de la carpeta actual.
app.use(express.static(path.join(__dirname)));

// Assegurem que la ruta principal serveixi el nostre index.html.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Posem el servidor en marxa.
app.listen(PORT, () => {
  console.log(`🚀 Carbon-IQ Analyzer funcionant al port ${PORT}`);
});