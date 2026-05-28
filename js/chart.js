async function loadChart(buzzerId = 1) {
    const response = await fetch(`api/get_chart_data.php?buzzer_ID=${buzzerId}`);
    const dbData = await response.json();

    //Kontrolle
    console.log("Daten aus der Datenbank:", dbData);

    if (dbData.error) {
        console.error("Fehler beim Laden der Chart-Daten:", dbData.error);
        return;
    }

    // =========================================================================
    // TREND ANZEIGEN & FÄRBEN
    // =========================================================================
    // Wir suchen das Div in Trend-Kärtchen (vorausgesetzt es hat ein Element mit id="trendValue")
    const trendDiv = document.getElementById("trendValue");
    if (trendDiv && dbData.trend) {
        trendDiv.textContent = dbData.trend.text;

        // Schick einfärben: Weniger Auslösungen = Ruhiger (Grün), Mehr = Unruhiger (Rot)
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
    // dbData.chart_data enthält jetzt euer gewohntes Array!
    // =========================================================================
    const chartArray = dbData.chartData;

    if (!chartArray) {
        console.error("chartData wurde im JSON-Objekt nicht gefunden.");
        return;
    }

    const labels = chartArray.map(item => item.x); // x-Werte Datumstempel
    const values = chartArray.map(item => item.y); // y-Werte Anzahl Buzzer-Aktivierungen

    const ctx = document.getElementById('monsterChart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Buzzer-Aktivierungen',
                data: values,
                borderColor: '#FF5C34',
                backgroundColor: '#FF5C3480', // 50% Transparenz
                borderWidth: 2,
                tension: 0.3
            }]
        },

    });
}
