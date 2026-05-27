# IM IV FS26 - Monster-Scanner 🌙

➡️ bei der Chat Gpt-Anfrage bezüglich der Datenbank: erwähnen, dass wir es mit PDO machen

## Kurzbeschreibung des Projekts

* **Modul:** Interaktive Medien 4 an der Fachhochschule Graubünden (FS26)  
* **Themenfeld:** IoT-Applikation zum Thema Eltern mit kleinen Kindern  
* **Name des Projekts:** Monster-Scanner  
* **Team Physical Computing:** Janna Stutz und Alissa Tritten  
* **Team WebApp:** Alina Gerber und Joy Zimmermann

#### Welches Problem im Alltag von Eltern mit kleinen Kindern wird gelöst?

Viele Kinder haben Angst vor Monstern unter dem Bett, dies ist nicht nur eine grosse Belastung für die Kinder selbst sondern auch für die Eltern bedeutet das mehr Care-Arbeit und schlaflose Nächte. Der Monster-Scanner löst genau dieses Problem.

#### Was ist der „Sinn und Zweck“ des Systems?

* Care-Arbeit kann vermindert werden
* Eltern können durchschlafen
* Ängste werden auf effektive Weise beruhigt
* das Selbstbewusstsein der Kinder wird gestärkt

#### Wie funktioniert das Ganze?

Falls das Kind denkt, etwas könnte unter dem Bett sein, drückt es einen Button im Bett. Mittels Sensor, der unter dem Bett angebracht ist, wird überprüft, ob ein Monster da ist. Nach einigen Sekunden bekommt das Kind ene visuelle Bestätigung mittels grünem Licht. Falls wirklich eine Bewegung festgestellt wurde, erhalten die Eltern eine Push-Nachricht auf dem Handy mit der Aufforderung das Kinderzimmer aufzusuchen. 
Somit müssen Eltern erst dann aktiv werden, wenn es wirklich nötig ist.

<img height="200" alt="Bild_Knopf" src="https://github.com/user-attachments/assets/c47b1175-4c6b-4c99-93a2-d4d82284f05a" />
<img height="200" alt="Bild_Sensor" src="https://github.com/user-attachments/assets/fe17fdb9-a21c-47d2-a811-5a513c48288b" />
<img height="200" alt="Bild_Pus-Nachricht" src="https://github.com/user-attachments/assets/2c405d8a-11f4-4bce-8960-df4cb2bb72c2" />

### UX & Konzeption

#### 🎨 Design

Wir haben bei der Erstellung des Designs versucht, kindliche Elemente in einem schlichten Design darzustellen. Das heisst so, dass es für die Eltern, sowie für die Kinder ansprechend gestaltet ist. Somit kann die App auch problemlso den Kindern gezeigt werden, welche die Funktionen der App mit wenigen Erklärungen der Eltern verstehen. Da wir drei verschiedene Designs ausgetestet haben, war für uns auch schnell klar, in welche Richtung wir in der Gestaltung gehen wollen. 

Anhand des AB-Testings haben wir herausgefunden, dass die App bei Eltern mit kleinen Kindern gut ankommt, da es sich um eine Anwendung handelt, welche für das Sicherheitsgefühl der Kinder sorgt und die Eltern entlasten soll. Mögliche Änderungswünsche der Testpersonen sind als Kommentare in unserer Figma-Datei ersichtlich.

**Figma:** [Hier gehts zum Figma](https://www.figma.com/design/6s5t7Cb0NK4FvaAhdiKhcd/IM-4-%E2%80%93-App-Konzeption?node-id=78-325&t=XFWmMQKEByA0oNdQ-1)


**User Flow WebApp:**
<img width="2837" height="1270" alt="Userflow_WebApp" src="https://github.com/user-attachments/assets/d745c373-b7f8-4081-9467-d050f01d22e0" />

**User Flow Physical Computing:**
<img width="2587" height="1102" alt="Userflow_Physical Computing" src="https://github.com/user-attachments/assets/cb48924a-c3cb-4052-819f-fd4a5a1db328" />

#### 🤳Features

**Schichtplan + Switcher**

Zu Beginn waren wir sehr motiviert, tolle Features einzubauen, wie beispielsweise einen Schichtplan, bei dem sich die Eltern eintragen können, wann sie an der Reihe sind aufzustehen, wenn der Alarm los geht. Eine weitere Funktion wäre ein Switch-Button gewesen, welcher zum Zug käme, wenn man mehr als 1 Kind hat. Somit könnte man zwischen zwei Homebildschirmen wechseln (je einer pro Kind). 

Diese zwei Features haben wir aber schliesslich  nicht umgesetzt, da wir nur einen Buzzer haben und unser Konzept auf ein Kind beschränkt ist. Beim Schichtplan hätte es sehr viele Eventualitäten geben können, wenn noch andere Personen (Babysitter:innen) "Nachtschicht" hätten oder mehr als zwei Personen zuständig sind. Das war in der Umsetzung dann etwas sehr kompliziert, warum wir uns von diesen Ideen trennen mussten. 

**Punkte-System**

Eine weitere Idee wäre gewesen, eine Art Punkte-System einzubauen, bei welchem das Kind Sterne sammeln kann. Beispielsweise, wenn das Kind eine Nacht durchschläft, ohne den Buzzer zu betätigen, werden +5 Punkte auf das Sternen-Konto gezählt. Jede weitere Nacht in Folge ohne Buzzer-Betätigung bringt +3 Punkte. Aber wenn dann der Buzzer in einer Nacht wieder gedrückt wird, erfolgen -5 Punkte. Die Eltern könnten dann Ziele/Belohnungen festlegen, wie beispielsweise einen Ausflug in den Zoo bei 50 Punkten. 

Auch diese Idee wurde ziemlich rasch verworfen, da wir uns erst auf die Hauptfunktion der App konzentrieren und uns nicht in unnötigen Features verlieren wollten. Die Ideenfindung hat aber sehr Spass gemacht und hätten wir mehr Zeit gehabt, wären vielleicht noch die eine oder andere Funktion in die Realität umgesetzt worden. 

**Wähle dein Monster**

Da am Ende doch noch ein klein wenig Zeit blieb, haben wir uns entschieden ein Feature in die App einzubauen, bei dem im Profil eines aus fünf verschiedenen Monstern ausgewählt werden kann. Die Idee dahinter ist, dass sich das Kind für ein Monster entscheiden kann, welches die Wache unter em Bett hält und es beschützen wird. Somit wird bereits der erste Kontakt zwischen Kind und Monster geknüpft und es kann aufgezeigt werden, dass es auch liebe Monster gibt, die den Kindern helfen. 

### 🏁Unsere WebApp

Der Monster-Scanner kann unter dem folgenden Link aufgerufen werden:

[Link zur Webapp](https://im4.lisa-joy.ch)

* **Video-Dokumentation:** [Link zum Video auf Youtube](http://link.zum.video) 

#### Installationsanleitung WebApp

*1. Was benötige ich an Infrastruktur?* 

* Webhosting & Domain: Ein aktiver Webspace bei einem Hosting-Anbieter (z. B. Infomaniak oder Hostpoint) inklusive einer eigenen Domain.
* Datenbank: Eine MySQL-Datenbank, die über das Hosting-Panel (z. B. phpMyAdmin) des Anbieters verwaltet wird.
* Versionsverwaltung & Code-Editor: Ein GitHub-Account zum Klonen des Codes sowie Visual Studio Code zur Ansicht und Bearbeitung der Dateien.
* FTP-Programm: Ein Tool wie FileZilla (oder eine entsprechende Erweiterung in Visual Studio Code), um die Dateien vom eigenen Computer auf den Server des Hosting-Anbieters hochzuladen.


*2. Was muss ich auf meinem Webserver installieren?*
 
 * Öffne das GitHub-Repository unseres Projekts.
 * Klone das Projekt mit Git auf deinen lokalen Computer oder lade es als ZIP-Datei herunter und entpacke es.
 * Öffne den Projektordner in Visual Studio Code, um die Dateistruktur vor dir zu haben.
 * Logge dich bei deinem Hosting-Anbieter ein.
 * Erstelle dort eine passende Subdomain oder nutze deine Hauptdomain
 * Verbinde dein FTP-Programm mithilfe der FTP-Zugangsdaten deines Hosters mit deinem Webspace.
 * Lade den Inhalt des Projektordners aus Visual Studio Code in das Zielverzeichnis auf deinen Live-Server hoch. **ACHTUNG!** Die Datei, welche die echten Passwörter und Zugangsdaten zu deiner Live-Datenbank enthält (z. B. config.php) darfst du nicht hochladen!
     
*3. Wie kann ich die Datenbank importieren?*

* Erstelle eine neue MySQL-Datenbank und notiere dir den Datenbanknamen, Benutzernamen sowie das Passwort.
* Öffne phpMyAdmin direkt über dein Hosting-Kundenportal.
* Wähle in der linken Spalte deine neu erstellte, leere Datenbank aus.
* Klicke im oberen Menü auf den Reiter „Importieren“.
* Klicke auf „Datei auswählen“ und lade die im GitHub-Projektordner bereitgestellte SQL-Datei hoch.
* Bestätige den Vorgang ganz unten mit einem Klick auf „Importieren“, um die Tabellenstruktur für den Monster-Scanner und die Benutzerkonten live zu laden.

*4. Wo muss ich die DB-Credentials eintragen?*  

* Öffne die Datei config.php in Visual Studio Code.
* Ersetze die Platzhalter mit den echten Zugangsdaten, die du vorhin bei deinem Webhosting für deine Live-Datenbank erstellt hast
* Speichere die Datei ab und lade diese aktualisierte config.php nun einzig und allein via FTP direkt auf deinen Server hoch. Stelle sicher, dass diese Datei niemals zurück auf GitHub gepusht wird!

*5. WebApp im Browser aufrufen und testen*

* Öffne deinen Browser (Google Chrome).
* Gib deine registrierte Domain oder Subdomain ein.
* Die WebApp ist nun voll einsatzbereit!

*6. Wie nehme ich das physische Artefakt in Betrieb?*

* Der ESP32-C6 Mikrocontroller wird per USB-C Verbindung an den Laptop angeschlossen.
* Auf Arduino schreibt man den Code in einen neuen Sketch und lädt ihn auf den Mikrocontroller.
* Sobald dies erfolgreich geschehen ist (zuerst noch kurz auf dem ESP32-C6 den Reset-Button klicken) kann dann der Buzzer ausgelöst und im Serial Monitor ist zu sehen, ob alles reibungslos klappt.
* Das physische Artefakt wird am Bett so installiert, dass der Sensor auf der Steckplatte inklusive Batterieverbindung unter dem Bett liegt und die Monster-Box mit dem Buzzer und dem verbauten LED-Ring auf dem Nachttisch steht. 
* Nun kann per Buzzer die Messung ausgeführt werden, die Daten werden in die DAtenbank gespeichert und die WebApp aktualisiert.

#### Bauanleitung Physical Computing

Um den Physical Computing Teil nachzubauen, kann man sich an folgenden Abbildungen orientieren. 

Auf dem Komponentenplan sind alle notwendigen Komponenten zu sehen, von Sensoren bis Dateien. Alle Codes sind im Repository zu finden.

Auf dem Steckplan ist zu sehen, wie genau die einzelnen physischen Komponenten ineinander gesteckt und verbunden werden müssen.

**Komponentenplan** 

<img width="1536" height="1024" alt="komponentenplan-im4" src="https://github.com/user-attachments/assets/0842efd2-b5b2-412f-8f84-37f2dcdf8292" />


 
**Steckplan** 

<img width="1920" height="1080" alt="steckplan-im4" src="https://github.com/user-attachments/assets/6a4a2647-f7b3-4a33-910f-8a655c3f1c8e" />

Hier noch Bilder der realen Steckplatte.

<table>
  <tr>
    <td>
      <img width="400" alt="bild-steckplatte-im4" src="https://github.com/user-attachments/assets/7bafc2ba-547c-435e-b57e-6a752c8439ac" />
    </td>
    <td>
      <img width="400" alt="bild-gesamtesprojekt-im4" src="https://github.com/user-attachments/assets/f9e7d1a5-7132-45da-8278-54aeef80ff39" />
    </td>
  </tr>
</table>


## Technische Details

// Hier sollte das Verständnis ersichtlich sein / Wie stehen die Dateien in Beziehung zueinander, Wie reden Die Dateien miteinander, Wie ist der Weg der Daten

**Systemübersicht**

Das System basiert auf einem ESP32-C6-Mikrocontroller, einem Ultraschallsensor (HC-SR04), einem physischen Buzzer/Button sowie einem adressierbaren WS2812B-LED-Ring. Das Projekt kombiniert Physical Computing mit einer WebApp und einer Datenbankanbindung.

Der Ultraschallsensor misst mithilfe von Ultraschallwellen Distanzen unter dem Bett. Sobald der Buzzer gedrückt wird, startet der ESP32 einen zweifachen Scan-Prozess. Die gemessenen Werte werden anschliessend direkt auf dem Mikrocontroller verglichen, um festzustellen, ob sich zwischen den beiden Messungen etwas bewegt hat.

Der LED-Ring dient als visuelles Feedback:

Rotierendes grünes Licht → Scan läuft
Kompletter grüner Ring → Daten erfolgreich in DB gespeichert
Kompletter roter Ring → Fehler beim Speichern in DB

Die Daten werden per WLAN über einen HTTP-POST-Request an eine PHP-Schnittstelle (load.php) gesendet und anschliessend in einer MySQL-Datenbank gespeichert.

**Ablauf der Daten**
* Das Kind drückt den Buzzer am Monster-Gerät
* Der ESP32 startet den Scan-Prozess
* Der Ultraschallsensor misst zweimal die Distanz unter dem Bett
* Der ESP32 berechnet die Differenz direkt auf dem Mikrocontroller
* Bei einer Differenz > 3 cm wird monster_da = 1
* Die Daten werden als JSON über WLAN an load.php gesendet
load.php verarbeitet die Daten serverseitig
* Die Daten werden in der MySQL-Datenbank gespeichert
* Die WebApp liest die Daten aus der Datenbank aus
* Bei monster_da = 1 wird eine Warnung in der WebApp (für die Eltern) angezeigt

**Projektstruktur / Code-Struktur:** 

Der Code befindet sich vollständig im Repository. Jede Datei enthält im Kopfbereich eine kurze Beschreibung ihrer Funktion.

Hier folgt eine kurze Beschreibung vom Aufbau und Inhalt der Code-Struktur:

**Hauptverzeichnis (Frontend-Seiten)**
  
* **index.html**
  Automatischer Einstiegspunkt der Applikation.

* **login.html**
  Benutzeroberfläche für das Anmeldefenster der Applikation.
  
* **register.html**
  Registrierungsformular für Neubenutzer, um ein Eltern-Konto zu erstellen.
  
* **home.html**
  Das zentrale Dashboard für die Eltern, auf dem die Sensor-Aktivitäten und Auswertungen angezeigt werden.
  
* **konto.html**
  Benutzerprofil-Seite zur Verwaltung des Kontos (Haushalt erstellen/beitreten, Passwort ändern).
  
* **protected.html**
  Eine vorgeschaltete Sicherheitsseite, die prüft, ob eine gültige Session aktiv ist, bevor die Inhalte geladen werden.
  
* **sender.html**
  Test-Oberfläche zur manuellen Simulation von Sensor-Daten (hilfreich für Entwicklung und Debugging).

**PHP-Backend-Schnittstellen**

* **config.php**
  Datenbank-Zugangsdaten, PDO-Verbindung zur MySQL-Datenbank

* **load.php**
  Empfang der JSON-Daten, Verarbeitung der POST-Requests, Speicherung in der Datenbank

* **login.php**
  Validierung der Benutzerdaten beim Login und Initiierung der PHP-Session.

* **logout.php**
  Beenden der aktiven Session und sicheres Abmelden des Benutzers.

* **register.php**
  Verarbeitung der Registrierungsdaten und sicheres Speichern neuer Benutzer.

* **protected.php**
  Serverseitige Überprüfung des Login-Status zum Schutz der geschlossenen Bereiche.

* **get_user_info.php**
  Abfrage der Profildaten des aktuell eingeloggten Benutzers aus der Datenbank.

* **update_profile.php**
  Aktualisierung von Profiländerungen (z. B. Name oder E-Mail).

* **change_password.php**
  Schnittstelle zur sicheren Änderung des Benutzerpassworts.

* **create_household.php**
  Generierung und Speicherung eines neuen, einzigartigen Haushalts-Codes.

* **join_household.php**
  Zuordnung eines Benutzers zu einem bereits existierenden Haushalt via Code.

* **get_buzzer_events.php**
  Abfrage der jüngsten Interaktionen (Knopfdrücke) für die Echtzeitanzeige im Dashboard.

* **get_chart_data.php**
  Aufbereitung und Bereitstellung der Sensor-Statistiken für die grafischen Diagramme.

**Frontend-Logik & API-Anbindung**

* **auth.js**
  Kern-Logik für die Authentifizierungsprozesse im Frontend.

* **login.js**
  Validiert die Eingaben der login.html und sendet sie an die Login-API.

* **register.js**
  Steuert den Registrierungsablauf und fängt Fehleingaben ab.

* **home.js**
  Lädt die Live-Daten des Monster-Scanners dynamisch ins Dashboard und steuert die Benutzeroberfläche.

* **chart.js**
  Initialisiert und rendert die visuellen Diagramme (Statistiken) auf der Home-Seite.

* **konto.js**
  Verarbeitet die Interaktionen auf der Profilseite (Passwortänderung, Haushalts-Verwaltung).

* **protected.js**
  Blockiert den Zugriff auf HTML-Seiten, falls kein gültiger Login-Token/Session vorhanden ist.

* **logout.js**
  Löscht die lokalen Session-Daten und triggert das serverseitige Logout.

* **delete_account.js**
  Steuert den Sicherheitsdialog und die API-Anfrage zur endgültigen Löschung eines Kontos.

* **sender.js**
  Logik für die Test-Oberfläche, um Knopfdrücke des Artefakts zu simulieren.


**Hardware-Quellcode**

* **monster_scanner.ino**
  WLAN-Verbindung vom Microcontroller, gesamte Sensorsteuerung inklusive Buzzer-Betätigung, LED-Animationen, Bewegungserkennung, JSON-Erstellung, HTTP-POST-Requests

**Design**

  * **style.css**
  Das gesamte, zentrale Stylesheet der Applikation inklusive aller Layouts, Komponenten-Styles und Media Queries für das responsive Design.


**Datenschnittstelle zwischen Physical Computing und WebApp:**

Die Kommunikation zwischen Physical Computing und WebApp erfolgt über HTTP-POST-Requests im JSON-Format. Der Datenfluss sieht wie folgt aus:

ESP32 →  WLAN → HTTP POST Request → load.php → MySQL-Datenbank → PHP-Schnittstelle (get_buzzer_events.php) → JavaScript (home.js) via Fetch-API  → HTML-Dashboard (home.html)

* **🗄️ Datenbank**

Wir haben die Datenbank auf Hostpoint gemacht. Hier findest du die Datenbankplanung: [Klick hier](https://github.com/joy-lisa/im4/blob/main/Datenbankplanung.pdf)
* **ERM:** \[*Erklärung und Schaubild*\] 
* **🔑👤 Authentifizierung für Monster-Scanner**

Hier passiert die Anmeldung auf unsere App. 

Standardmässig bleibt die Session aktiv, solange der Browser offen ist und endet mit dem Schliessen des Browsers. Wenn die Session ca. 24 Minuten inaktiv ist endet die Session und der User wird ausgeloggt.

Wir haben uns bewusst gegen eine präzise Zeitbegrenzung entschieden, weil in unserem Fall die Zeitspanne passend ist und das auch zu einer guten User Experience führt

Seiten, die man nur eingeloggt besuchen kann sind die home.hmtl- und das konto.html-Seite. Ausgeloggt kann man die Startseite (index.html), sowie die Login- (login.html) und Registrierungseite (register.html) besuchen.

## Known bugs

* Was funktioniert noch nicht einwandfrei?  
* Was ist uns aufgefallen bei der Entwicklung?

Die Entwicklung einer solchen App ist sehr zeitaufwändig und bedingt eine gute Kommunikation innerhalb des Teams. 
    
* Was könnte noch verbessert werden?

Das Design der App könnte an manchen Stellen sicherlich noch überarbeitet/verfeinert werden. Zudem wäre es toll, noch einige Features mehr einzubauen. 

## Umsetzungsprozess

* **Reflexion / Erfahrung / Lernfortschritt:** 
Beim Umsetzungsprozess haben wir sehr viel über das Zusammenspiel von Physical Computing, Datenbank und WebApp gelernt. Besonders spannend war für uns, dass unser physisches Artefakt nicht nur lokal funktioniert, sondern Daten über WLAN an eine Datenbank senden kann. Dadurch haben wir besser verstanden, wie IoT-Systeme aufgebaut sind und wie verschiedene Komponenten miteinander kommunizieren. Wir haben gelernt, wie ein ESP32-C6 mit Sensoren, einem Buzzer und einem LED-Ring verbunden und programmiert wird. Zusätzlich haben wir verstanden, wie Messwerte verarbeitet, als JSON formatiert und über HTTP-POST-Requests an eine PHP-Schnittstelle gesendet werden. Für die Datenbankanbindung haben wir mit PDO gearbeitet, damit die Daten sicher in einer MySQL-Datenbank gespeichert werden können.

Im Bereich WebApp konnten wir unser Know-How im Zusammenspiel mit HTML, JS und PHP vertiefen und uns erneut mit einem coolen Styling per CSS ausleben. Besonders lehrreich war hierbei die Optimierung für verschiedene Bildschirmgrössen mittels CSS Media Queries. Uns wurde rasch bewusst, wie aufwändig es sein kann, wenn der "normale" CSS-Code etwas unübersichtlich und verschachtelt geschrieben ist. Das hat uns viel Zeit und Nerven gekostet. 

* **Herausforderungen & Lösungen:** 
Eine grosse Herausforderung war die Verbindung zwischen dem ESP32 und der Datenbank. Am Anfang war nicht klar, wie die Daten korrekt vom Mikrocontroller an das Backend geschickt werden müssen. Dieses Problem konnten wir lösen, indem wir die Messwerte als JSON strukturiert und an die Datei load.php gesendet haben. Dort werden die Daten verarbeitet und anschliessend mit PDO in der Datenbank gespeichert. Auch die Bewegungserkennung war nicht einfach, da wir definieren mussten, wann wirklich eine Bewegung erkannt wird. Dafür vergleichen wir zwei Messungen des Ultraschallsensors direkt auf dem ESP32. Sobald die Differenz grösser als 3 cm ist, wird monster_da = 1 gesetzt.

Eine weitere Herausforderung war das visuelle Feedback mit dem LED-Ring. Dieser sollte dem Kind klar zeigen, was gerade passiert. Deshalb haben wir verschiedene Zustände programmiert: Ein rotierendes grünes Licht zeigt den laufenden Scan, ein komplett grüner Ring bedeutet, dass die Daten erfolgreich gespeichert wurden, und ein roter Ring zeigt einen Fehler an. Ursprünglich hatten wir noch zusätzliche Features geplant, zum Beispiel einen Schichtplan für Eltern oder eine Funktion für mehrere Kinder. Diese Ideen hätten das System jedoch deutlich komplizierter gemacht. Deshalb haben wir uns bewusst auf einen realistisch umsetzbaren Funktionsumfang konzentriert.

Das Team WebApp hatte erst einige Probleme mit dem Login-Prozess für die App. Der Aufbau der App war zeitintensiv und wir mussten oft sehr lange nach Fehlern im Code suchen. Als das Grundgerüst stand, war die Motivation dann auch wieder höher, nun die Daten des Sensors einzubinden und mittels PHP und JS in die App zu übertragen. Eine der grössten Herausforderungen war das ganze Styling der App. Im Nachhinein würden wir das anders angehen und versuchen alle Seiten einheitlicher zu gestalten. Da wir die Formularelemente anfangs sehr spezifisch für den Login-Prozess gestylt hatten, kam es später bei dem Profil- und Bearbeitungsmodus zu unvorhergesehenen Layout-Konflikten. Felder flogen im Desktop-Modus auseinander, Buttons überlagerten sich und Abstände brachen weg. Durch diese intensive Fehlersuche haben wir gelernt, wie wichtig ein strukturiertes CSS-Konzept und eine saubere Trennung von Layout-Logiken sind. Erst durch die präzise Feinabstimmung von Media Queries konnten wir die App schlussendlich auf ein konsistentes, responsives Desktop- und Mobile-Niveau bringen.


* **KI-Einsatz:** 
KI-Tools haben wir unterstützend eingesetzt, vor allem um technische Abläufe besser zu verstehen, Probleme beim Coding zu lösen und die README zu strukturieren. Besonders hilfreich war KI bei Fragen zur Datenbankanbindung mit PHP und PDO, bei HTTP-POST-Requests sowie beim Debugging einzelner Probleme. Chatgpt hat uns ebenfalls geholfen Codes mit Arduino zu schreiben und Zusammenhänge zu verstehen.

Im Bereich von WebApp haben wir viel mit KI (Gemini) gearbeitet, um uns die weiteren Schritte des Aufbaus der App erklären zu lassen. Uns war wichtig, nie die reinen Code-Zeilen von KI zu übernehmen, sondern stets zu kontrollieren, was wir bereits hatten und was wir noch in unserem Code ergänzen mussten. Dadurch haben wir uns immer jede Code-Zeile durchgelesen und sie versucht, bestmöglichst zu verstehen. Das ist uns teils mehr, teils weniger gelungen. Dabei ist uns einmal mehr aufgefallen, wie wichtig es ist, in der Zusammenarbeit mit KI immer die Kontrolle und den Überblick zu behalten.

* **Fazit:**
Insgesamt sind wir zufrieden mit unserem Projekt. Der Monster-Scanner verbindet ein alltägliches Problem mit einer kreativen technischen Lösung und zeigt, wie Physical Computing und WebApp sinnvoll zusammenspielen können. Besonders schön finden wir, dass das Projekt nicht nur technisch funktioniert, sondern auch emotional einen Nutzen hat. Kinder erhalten durch den Scanner und den LED-Ring ein Gefühl von Sicherheit, während die Eltern entlastet werden können.
Es war ein cooles Gefühl zu sehen, wie aus einer ersten Idee Schritt für Schritt ein funktionierendes System entstanden ist. Das Projekt hat uns nicht nur technisch weitergebracht, sondern auch gezeigt, wie wichtig Teamarbeit, Kommunikation und kreatives Problemlösen bei interaktiven Projekten sind.


- Beinhaltet die Konfigurationsdatei für die Datenbankverbindung.
- Beinhaltet die Datei `database.sql`, die die `users` Tabelle erstellt.
- Beinhaltet die Datei `config.php`, die die Konfiguration des Backends enthält.


