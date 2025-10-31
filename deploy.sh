#!/bin/bash
# =================================================================
# SCRIPT DE DESPLEGAMENT AUTOMÀTIC PER A CARBON-IQ STRATEGIC ANALYZER
# Aquest script s'executa al servidor de producció.
# =================================================================

echo "🚀 Iniciant desplegament de Carbon-IQ Strategic Analyzer..."

# 1. Definir la ruta absoluta a la carpeta del projecte al servidor.
#    CANVIA AIXÒ si la teva ruta és diferent.
PROJECT_DIR="/var/www/Calculadora_Petjada_carboni"

# 2. Navega a la carpeta del projecte. Si no existeix, atura l'script.
cd $PROJECT_DIR || { echo "❌ Error: El directori del projecte no existeix a $PROJECT_DIR"; exit 1; }

# 3. Assegura't de ser a la branca principal (main o master).
git checkout main

# 4. Descarta qualsevol canvi local que s'hagi pogut fer manualment al servidor.
git reset --hard HEAD

# 5. Descarrega els últims canvis des del repositori remot de GitHub.
echo "🔄 Descarregant últims canvis des de GitHub..."
git pull origin main

# 6. Dona permisos d'execució al nostre propi script de desplegament.
#    Això és important per si pugem canvis a aquest mateix arxiu.
chmod +x deploy.sh

# 7. Instal·la/actualitza les dependències de Node.js.
echo "📦 Instal·lant dependències..."
npm install

# 8. Reinicia l'aplicació amb PM2 per aplicar els canvis.
#    PM2 ho farà sense temps d'inactivitat (zero-downtime reload).
echo " перезавантаження... Reiniciant l'aplicació 'calculadora-carboni' amb PM2..."
pm2 restart calculadora-carboni

echo "✅ Desplegament de Carbon-IQ Strategic Analyzer completat amb èxit!"