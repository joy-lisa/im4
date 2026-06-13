/* =========================================================================
   BESCHREIBUNG: Frontend-Logik zur Generierung und Steuerung des Statistik-Diagramms.
   FUNKTION: 
   - Ruft via Fetch-API die Trend- und Diagrammdaten von 'get_chart_data.php' ab.
   - Färbt die visuelle Trend-Anzeige dynamisch ein (Rot bei Anstieg, Grün bei Rückgang).
   - Generiert eine rollende 30-Tage-X-Achse basierend auf dem aktuellen Datum.
   - Gleicht die DB-Einträge mit dem Kalender ab und füllt Tage ohne Events automatisch mit einer '0' auf.
   - Initialisiert und rendert ein responsives Liniendiagramm (Chart.js) im Canvas-Element '#monsterChart'.
   ========================================================================= */

async function loadChart(buzzerId = 1) {
    const response = await fetch(`api/get_chart_data.php?buzzer_ID=${buzzerId}`);
    const dbData = await response.json();

    // Kontrolle
    console.log("Daten aus der Datenbank:", dbData);

    if (dbData.error) {
        console.error("Fehler beim Laden der Chart-Daten:", dbData.error);
        return;
    }

    // =========================================================================
    // TREND ANZEIGEN & FÄRBEN
    // =========================================================================
    const trendDiv = document.getElementById("trendValue");
    if (trendDiv && dbData.trend) {
        trendDiv.textContent = dbData.trend.text;

        if (dbData.trend.prozent > 0) {
            trendDiv.style.color = "#FF5C34";
        } else if (dbData.trend.prozent < 0) {
            trendDiv.style.color = "#AEB8A0";
        } else {
            trendDiv.style.color = "#351E28";
        }
    }

    // =========================================================================
    // CHARTERSTELLUNG AN NEUES FORMAT ANPASSEN
    // =========================================================================
    const chartArray = dbData.chart_data || dbData.chartData;

    if (!chartArray || !Array.isArray(chartArray)) {
        console.error("chartData wurde im JSON-Objekt nicht oder nicht als Array gefunden.", dbData);
        return;
    }

    // =========================================================================
    // LÜCKEN FÜLLEN
    // =========================================================================
    const labels = [];
    const values = [];

    // HEUTE als Enddatum festlegen
    const endDate = new Date();

    // STARTDATUM berechnen (Heute minus 30 Tage für ein rollendes Zeitfenster)
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    // Wir setzen die Uhrzeit bei beiden auf 0, um saubere Tages-Vergleiche zu haben
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    // Die Schleife wandert Tag für Tag von vor 30 Tagen bis heute
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {

        // Datum im Format YYYY-MM-DD für den DB-Abgleich bauen
        const jahr = d.getFullYear();
        const monatNum = (d.getMonth() + 1).toString().padStart(2, '0');
        const tagNum = d.getDate().toString().padStart(2, '0');
        const aktuellesDatumStr = `${jahr}-${monatNum}-${tagNum}`;

        // Schauen, ob für diesen Tag Messdaten aus der DB existieren
        const gefundenerEintrag = chartArray.find(item => item.x === aktuellesDatumStr);

        // X-Achsen-Beschriftung für den Chart bauen (z.B. "08.06.")
        labels.push(`${tagNum}.${monatNum}.`);

        // Wert hinzufügen: Entweder den DB-Wert oder eine 0 bei Funkstille
        if (gefundenerEintrag) {
            values.push(gefundenerEintrag.y);
        } else {
            values.push(0);
        }
    }
    // =========================================================================
    // HAUPT-DIAGRAMM ERSTELLEN (SCROLLBAR)
    // =========================================================================
    const chartElement = document.getElementById('monsterChart');
    if (!chartElement) {
        console.error("Das Canvas-Element 'monsterChart' wurde im HTML nicht gefunden.");
        return;
    }

    const ctx = chartElement.getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Buzzer-Aktivierungen',
                data: values,
                borderColor: '#FF5C34',
                backgroundColor: '#FF5C3480',
                borderWidth: 2,
                tension: 0.3,
                yAxisID: 'y',
                yAxisIDs: ['y', 'yRight']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    type: 'linear',
                    beginAtZero: true,
                    display: true,
                    position: 'left',
                    min: 0,
                    ticks: {
                        stepSize: 1,
                    }
                },

                x: {
                    ticks: {
                        maxRotation: 0,
                        minRotation: 0
                    }
                }
            },
            plugins: {
                legend: { display: false }
            },
        }

    });
}