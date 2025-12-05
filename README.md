# Calculadora de Petjada de Carboni

Aplicació web en una sola pàgina per calcular la petjada de carboni d'una empresa amb recomanacions accionables. El backend Express exposa un endpoint d'anàlisi detallada i serveix la interfície d'usuari amb els factors d'emissió i equivalències incloses al client.

## Requisits
- Node.js 18+.
- Dependència principal: [Express 5](https://expressjs.com/) (inclosa a `package.json`).

## Execució local
1. Instal·la les dependències:
   ```bash
   npm install
   ```
2. Inicia el servidor principal de l'aplicació (API + SPA) a `http://localhost:3002`:
   ```bash
   node index.js
   ```
3. Opcionalment, hi ha un servidor senzill per servir l'`index.html` al port 3001:
   ```bash
   node server.js
   ```

## Endpoints principals
- `GET /` – Serveix la interfície de la calculadora (SPA).
- `GET /get-emission-factors` – Retorna els factors d'emissió predefinits.
- `POST /calculate-detailed` – Calcula la petjada de carboni per fonts, scopes, equivalències i recomanacions a partir del cos JSON enviat.

## Automatització de desplegament
Hi ha un flux de GitHub Actions (`.github/workflows/deploy.yml`) que actualitza el projecte en un servidor remot mitjançant `appleboy/ssh-action`, instal·la dependències amb `npm ci --production` i reinicia el procés amb `pm2`.
