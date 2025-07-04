const axios = require('axios');

async function obtenerDatos(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const htmlContent = response.data;
    const bootstrapLine = htmlContent.split('\n').find(line => line.trim().startsWith('App.bootstrapData'));
    if (!bootstrapLine) {
      throw new Error("No se pudo encontrar 'App.bootstrapData'. La estructura de la página pudo haber cambiado.");
    }
    const jsonString = bootstrapLine.substring(bootstrapLine.indexOf('(') + 1, bootstrapLine.lastIndexOf(')'));
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('❌ Error al obtener los datos:', error.message);
    throw error; // Re-lanzamos el error para que el llamador lo maneje
  }
}

module.exports = { obtenerDatos };