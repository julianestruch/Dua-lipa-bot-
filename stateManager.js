const fs = require('fs').promises;
const path = require('path');

const stateFilePath = path.join(__dirname, 'state.json');

async function cargarEstado() {
  try {
    const data = await fs.readFile(stateFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Si el archivo no existe, lo creamos con un estado inicial
      return { sectoresNotificados: [] };
    }
    throw error;
  }
}

async function guardarEstado(estado) {
  await fs.writeFile(stateFilePath, JSON.stringify(estado, null, 2), 'utf8');
}

module.exports = { cargarEstado, guardarEstado };
