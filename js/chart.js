async function loadChart(buzzerId = 1) { 
    const response = await fetch(`api/get_chart_data.php?buzzer_ID=${buzzerId}`);
    const dbData = await response.json();

    //Kontrolle
    console.log("Daten aus der Datenbank:", dbData);

    if (dbData.error) {
        console.error("Fehler beim Laden der Chart-Daten:", dbData.error);
        return;
    }

    //Daten für Chart.js vorbereiten
    const labels = dbData.map(item => item.x); // x-Werte Datumstempel
    const values = dbData.map(item => item.y); // y-Werte Anzahl Buzzer-Aktivierungen

    const ctx = document.getElementById('monsterChart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Buzzer-Aktivierungen',
                data: values,
                borderColor: '#ffa4d4',
                backgroundColor: 'rgba(255, 164, 212, 0.2)',
                borderWidth: 2,
                tension: 0.3
            }]
        },
        options: {
            scales: {
                y: {beginAtZero: true}
            }
        }
    });
}

loadChart(1);