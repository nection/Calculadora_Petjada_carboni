const express = require('express');
const path = require('path');

const app = express();
const port = 3002;

app.use(express.json());
app.use(express.static(__dirname));

// =============================================================================
// BASES DE DADES DE FACTORS DE CÀLCUL
// =============================================================================

const emissionFactors = {
    naturalGas: { name: "Gas Natural", value: 0.202, unit: 'kgCO₂e/kWh', source: 'MITECO - Guía para el cálculo de la huella de carbono' },
    diesel: { name: "Dièsel", value: 2.68, unit: 'kgCO₂e/litre', source: 'MITECO - Guía para el cálculo de la huella de carbono' },
    petrol: { name: "Gasolina", value: 2.31, unit: 'kgCO₂e/litre', source: 'MITECO - Guía para el cálculo de la huella de carbono' },
    refrigerants: { name: "Gasos Refrigerants (HFC-134a)", value: 1430, unit: 'kgCO₂e/kg', source: 'IPCC AR4 - GWP Values' },
    electricity: { name: "Mix Elèctric (Península)", value: 0.14, unit: 'kgCO₂e/kWh', source: 'REDEIA - Informe del Sistema Eléctrico 2023' },
    flights: { name: "Viatges en Avió", value: 0.15, unit: 'kgCO₂e/km', source: 'DEFRA - Emission Factors (Referència internacional)' },
    waste: { name: "Residus a l'Abocador", value: 0.6, unit: 'kgCO₂e/kg', source: 'MITECO - Guía para el cálculo de la huella de carbono' }
};

const benchmarkFactors = {
    tech: { name: "Tecnologia / Serveis", tco2PerEmployee: 2.5 },
    manufacturing: { name: "Manufactura Lleugera", tco2PerEmployee: 8.0 },
    retail: { name: "Comerç / Retail", tco2PerEmployee: 3.5 },
    hospitality: { name: "Hostaleria / Restauració", tco2PerEmployee: 4.5 }
};

const equivalencyFactors = {
    car: 4600, // kg CO2e per cotxe de passatgers per any (Font: EPA)
    home: 4500, // kg CO2e per llar per any (consum elèctric) (Font: EPA)
    tree: 21 // kg CO2 absorbit per un arbre madur per any (Font: EPA)
};


// =============================================================================
// ENDPOINTS DE L'API
// =============================================================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/get-emission-factors', (req, res) => {
    res.json(emissionFactors);
});

app.post('/calculate-detailed', (req, res) => {
    try {
        const data = req.body;

        const sourceKg = {
            'Combustibles (Gas Natural)': data.naturalGas * emissionFactors.naturalGas.value,
            'Combustibles (Flota)': (data.diesel * emissionFactors.diesel.value) + (data.petrol * emissionFactors.petrol.value),
            'Emissions Fugitives': data.refrigerants * emissionFactors.refrigerants.value,
            'Electricitat': data.electricity * emissionFactors.electricity.value,
            'Viatges de Negoci': data.flights * emissionFactors.flights.value,
            'Gestió de Residus': data.waste * emissionFactors.waste.value
        };

        const scopeBreakdown = {
            scope1: (sourceKg['Combustibles (Gas Natural)'] + sourceKg['Combustibles (Flota)'] + sourceKg['Emissions Fugitives']) / 1000,
            scope2: sourceKg['Electricitat'] / 1000,
            scope3: (sourceKg['Viatges de Negoci'] + sourceKg['Gestió de Residus']) / 1000
        };

        const totalFootprint = scopeBreakdown.scope1 + scopeBreakdown.scope2 + scopeBreakdown.scope3;
        const totalFootprintKg = totalFootprint * 1000;

        const sourceBreakdown = Object.entries(sourceKg)
            .filter(([, value]) => value > 0)
            .reduce((obj, [key, value]) => {
                obj[key] = value / 1000;
                return obj;
            }, {});

        const benchmark = {
            employees: data.employees,
            industry: benchmarkFactors[data.industry]?.name || 'Desconegut',
            average: (benchmarkFactors[data.industry]?.tco2PerEmployee || 0) * data.employees
        };
        
        const equivalencies = {
            cars: totalFootprintKg / equivalencyFactors.car,
            homes: totalFootprintKg / equivalencyFactors.home,
            trees: totalFootprintKg / equivalencyFactors.tree
        };

        const recommendations = generateRecommendations(sourceBreakdown, totalFootprint);
        
        const results = {
            totalFootprint,
            scopeBreakdown,
            sourceBreakdown,
            benchmark,
            equivalencies,
            recommendations
        };
        
        res.json(results);

    } catch (error) {
        console.error('Error en el càlcul:', error);
        res.status(500).json({ message: "Error intern del servidor durant el càlcul." });
    }
});

function generateRecommendations(sourceBreakdown, totalFootprint) {
    if (totalFootprint === 0) return [{ title: "Comença a mesurar!", description: "Introdueix dades per obtenir recomanacions."}];
    
    const recommendationsMap = new Map();
    const sortedSources = Object.entries(sourceBreakdown).sort(([, a], [, b]) => b - a);
    
    for (const [source, value] of sortedSources) {
        if (recommendationsMap.size >= 3) break;
        const percentage = (value / totalFootprint) * 100;

        if (source === 'Electricitat' && percentage > 10) {
            recommendationsMap.set('Electricitat', { title: "Optimitza el teu Consum Elèctric", description: `L'electricitat representa un ${percentage.toFixed(0)}% de la teva petjada. Canvia a un proveïdor 100% renovable i realitza una auditoria energètica.` });
        }
        if (source === 'Combustibles (Flota)' && percentage > 10) {
             recommendationsMap.set('Flota', { title: "Electrifica la Teva Flota", description: `Els combustibles de la teva flota són un ${percentage.toFixed(0)}% del total. Planifica una transició gradual a vehicles elèctrics i optimitza les rutes de transport.` });
        }
        if (source === 'Viatges de Negoci' && percentage > 10) {
            recommendationsMap.set('Viatges', { title: "Reavalua els Viatges de Negoci", description: `L'aviació (${percentage.toFixed(0)}%) té un alt impacte. Fomenta les reunions virtuals i prioritza el tren per a distàncies mitjanes.` });
        }
    }
    
    if (recommendationsMap.size < 3) {
        recommendationsMap.set('General', { title: "Implica els teus Empleats", description: "Crea un 'Equip Verd' i llança iniciatives de formació i sensibilització sobre estalvi energètic i reducció de residus a l'oficina." });
    }

    return Array.from(recommendationsMap.values());
}

app.listen(port, () => {
    console.log(`🚀 Servidor Carbon-IQ Pro funcionant a http://localhost:${port}`);
});