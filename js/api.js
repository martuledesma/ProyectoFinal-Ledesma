// js/api.js
const URL_JSON = './data/viajes.json';

async function obtenerViajes() {
    try {
        const response = await fetch(URL_JSON);
        if (!response.ok) throw new Error("Error en la conexión");
        const datos = await response.json();
        return datos;
    } catch (error) {
        console.error("Error grave:", error);
        return null;
    }
}