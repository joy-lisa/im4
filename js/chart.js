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
    // LÜCKEN FÜLLEN (JEDEN TAG VOM 24.05. BIS 20.06. GENERIEREN)
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
                yAxisID: 'y',       // Für ältere Chart.js Versionen als Fallback
                yAxisIDs: ['y', 'yRight'] // Teilt die Daten direkt mit beiden Achsen
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    type: 'linear',
                    beginAtZero: true,
                    // WICHTIG: Die Skala MUSS angezeigt werden!
                    display: true,
                    position: 'left',
                    min: 0,
                    ticks: {
                        stepSize: 1,
                    }
                },
                // yRight: {
                //     type: 'linear',
                //     position: 'right',
                //     min: 0,
                //     beginAtZero: true,

                //     display: true,
                //     ticks: {
                //         stepSize: 1,
                //     },
                //     grid: {
                //         // Verhindert, dass sich die horizontalen Linien verdoppeln 
                //         // oder pixelig überlagern
                //         drawOnChartArea: false
                //     }
                // },
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


            // animation: {
            //     onComplete: function () {
            //         const scrollContainer = document.querySelector('.chart-scroll-container');
            //         if (scrollContainer) {
            //             scrollContainer.scrollLeft = scrollContainer.scrollWidth;
            //         }
            //     }
            // }
        }

    });
}

//     const scrollContainer = document.querySelector('.chart-overflow-container');
//     if (scrollContainer) {
//         scrollContainer.scrollLeft = scrollContainer.scrollWidth;
//     }
// }

// async function loadChart(buzzerId = 1) {
//     const response = await fetch(`api/get_chart_data.php?buzzer_ID=${buzzerId}`);
//     const dbData = await response.json();

//     //Kontrolle
//     console.log("Daten aus der Datenbank:", dbData);

//     if (dbData.error) {
//         console.error("Fehler beim Laden der Chart-Daten:", dbData.error);
//         return;
//     }

//     // =========================================================================
//     // TREND ANZEIGEN & FÄRBEN
//     // =========================================================================
//     const trendDiv = document.getElementById("trendValue");
//     if (trendDiv && dbData.trend) {
//         trendDiv.textContent = dbData.trend.text;

//         if (dbData.trend.prozent > 0) {
//             trendDiv.style.color = "#FF5C34";
//         } else if (dbData.trend.prozent < 0) {
//             trendDiv.style.color = "#AEB8A0";
//         } else {
//             trendDiv.style.color = "#351E28";
//         }
//     }

//     // =========================================================================
//     // CHARTERSTELLUNG AN NEUES FORMAT ANPASSEN
//     // =========================================================================
//     const chartArray = dbData.chart_data || dbData.chartData;

//     if (!chartArray || !Array.isArray(chartArray)) {
//         console.error("chartData wurde im JSON-Objekt nicht oder nicht als Array gefunden.", dbData);
//         return;
//     }

//     // =========================================================================
//     // NEU: LÜCKEN FÜLLEN (JEDEN TAG VOM 24.05. BIS 20.06. GENERIEREN)
//     // =========================================================================
//     const labels = [];
//     const values = [];

//     // Start- und Enddatum für deine Achse festlegen
//     const startDate = new Date("2026-05-24");
//     const endDate = new Date("2026-06-20");

//     // Schleife läuft Tag für Tag durch das Kalenderblatt
//     for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {

//         // Datum sauber formattieren wie in der DB (Format: YYYY-MM-DD)
//         const aktuellesDatumStr = d.toISOString().split('T')[0];

//         // Schauen, ob PHP für diesen Tag Daten geliefert hat
//         // (PHP schickt das Datum meistens im Feld 'x')
//         const gefundenerEintrag = chartArray.find(item => item.x === aktuellesDatumStr);

//         // Das Datum kommt immer auf die X-Achse (gekürzt auf DD.MM. für schönere Optik)
//         const tag = d.getDate().toString().padStart(2, '0');
//         const monat = (d.getMonth() + 1).toString().padStart(2, '0');
//         labels.push(`${tag}.${monat}.`);

//         if (gefundenerEintrag) {
//             // Wenn am Tag Alarme da waren -> echten Y-Wert nehmen
//             values.push(gefundenerEintrag.y);
//         } else {
//             // Wenn Funkstille war -> eine harte 0 eintragen!
//             values.push(0);
//         }
//     }
//     // =========================================================================

//     const chartElement = document.getElementById('monsterChart');
//     if (!chartElement) {
//         console.error("Das Canvas-Element 'monsterChart' wurde im HTML nicht gefunden.");
//         return;
//     }

//     const ctx = chartElement.getContext('2d');

//     new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: labels, // Nutzt die aufgefüllten Tage
//             datasets: [{
//                 label: 'Buzzer-Aktivierungen',
//                 data: values, // Nutzt die aufgefüllten Werte inklusive der Nullen
//                 borderColor: '#FF5C34',
//                 backgroundColor: '#FF5C3480',
//                 borderWidth: 2,
//                 tension: 0.3
//             }]
//         },

//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             scales: {
//                 y: {
//                     beginAtZero: true,
//                     ticks: {
//                         stepSize: 1,
//                         display: false // Spalte ausblenden, da sie links feststeht!
//                     },
//                     grid: {
//                         drawTicks: false // Keine kleinen Striche anzeigen
//                     }
//                 },
//                 x: {
//                     ticks: {
//                         maxRotation: 0,
//                         minRotation: 0
//                     }
//                 }
//             },
//             plugins: {
//                 legend: { display: false }
//             }
//         }
//     });

//     // Automatisch nach ganz rechts scrollen zum aktuellsten Datum
//     const scrollContainer = document.querySelector('.chart-overflow-container');
//     if (scrollContainer) {
//         scrollContainer.scrollLeft = scrollContainer.scrollWidth;
//     }
// }

// async function loadChart(buzzerId = 1) {
//     const response = await fetch(`api/get_chart_data.php?buzzer_ID=${buzzerId}`);
//     const dbData = await response.json();

//     //Kontrolle
//     console.log("Daten aus der Datenbank:", dbData);

//     if (dbData.error) {
//         console.error("Fehler beim Laden der Chart-Daten:", dbData.error);
//         return;
//     }

//     // =========================================================================
//     // TREND ANZEIGEN & FÄRBEN
//     // =========================================================================
//     // Wir suchen das Div in Trend-Kärtchen (vorausgesetzt es hat ein Element mit id="trendValue")
//     const trendDiv = document.getElementById("trendValue");
//     if (trendDiv && dbData.trend) {
//         trendDiv.textContent = dbData.trend.text;

//         // Schick einfärben: Weniger Auslösungen = Ruhiger (Grün), Mehr = Unruhiger (Rot)
//         if (dbData.trend.prozent > 0) {
//             trendDiv.style.color = "#FF5C34";
//         } else if (dbData.trend.prozent < 0) {
//             trendDiv.style.color = "#AEB8A0";
//         } else {
//             trendDiv.style.color = "#351E28";
//         }
//     }

//     // =========================================================================
//     // CHARTERSTELLUNG AN NEUES FORMAT ANPASSEN
//     // =========================================================================
//     // HIER: Sicherstellen, dass wir den richtigen Namen aus PHP nehmen (unterstützt beide Schreibweisen)
//     const chartArray = dbData.chart_data || dbData.chartData;

//     // Diese Prüfung MUSS vor dem .map() kommen!
//     if (!chartArray || !Array.isArray(chartArray)) {
//         console.error("chartData wurde im JSON-Objekt nicht oder nicht als Array gefunden.", dbData);
//         return; // Verhindert den Absturz des restlichen Skripts!
//     }

//     // Jetzt ist es sicher zu mappen
//     const labels = chartArray.map(item => item.x);
//     const values = chartArray.map(item => item.y);

//     const chartElement = document.getElementById('monsterChart');
//     if (!chartElement) {
//         console.error("Das Canvas-Element 'monsterChart' wurde im HTML nicht gefunden.");
//         return;
//     }

//     const ctx = chartElement.getContext('2d');

//     new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: labels,
//             datasets: [{
//                 label: 'Buzzer-Aktivierungen',
//                 data: values,
//                 borderColor: '#FF5C34',
//                 backgroundColor: '#FF5C3480', // 50% Transparenz
//                 borderWidth: 2,
//                 tension: 0.3
//             }]
//         },

//         options: {
//             responsive: true,
//             scales: {
//                 y: {
//                     beginAtZero: true,
//                     ticks: {
//                         stepSize: 1,
//                     }
//                 }
//             },
//             maintainAspectRatio: false, // Erlaubt uns, die Höhe per CSS zu steuern
//             plugins: {
//                 legend: {
//                     display: false // Versteckt die Legende oben, spart wertvollen Platz auf dem Handy
//                 }
//             }
//         }

//     });
// }
