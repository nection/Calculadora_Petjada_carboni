# Changelog

## 2025-10-31
- **f41abae** – Commit inicial amb la versió completa de l'analitzador estratègic, incloent la SPA `index.html`, backend Express i dependències bloquejades.
- **7e86e94** – Afegit workflow de GitHub Actions per al desplegament automàtic, nou script `deploy.sh` i canvi del port principal de l'aplicació a 3002.

## 2025-11-01
- **1c5d8b6** – Ajustat el workflow de desplegament per utilitzar el port SSH 2244.
- **f4e5903** – Refinat el procés de deploy al workflow amb reordenació dels passos.
- **4d95740** – Test de desplegament final amb secrets verificats i actualització del README.
- **572afb2** – Merge de la branca `main` del repositori remot.
- **abd24ab** – Canvi del mètode d'autenticació del workflow a contrasenya.
- **a0aaf98** – Correcció de la ruta del projecte al workflow de desplegament.
- **d6bc71f** – Afegit `.gitignore` i eliminació de `node_modules` del repositori per reduir volum.
- **2c564fe** – Ocultat el port SSH al workflow utilitzant el secret `SSH_PORT`.
