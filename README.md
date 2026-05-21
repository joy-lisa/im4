<img width="1536" height="1024" alt="komponentenplan-im4" src="https://github.com/user-attachments/assets/0842efd2-b5b2-412f-8f84-37f2dcdf8292" />
# im4 - Monster-Scanner 🌙

➡️ bei der Chat Gpt-Anfrage bezüglich der Datenbank: erwähnen, dass wir es mit PDO machen

## Kurzbeschreibung des Projekts

* **Modul:** Interaktive Medien 4 an der Fachhochschule Graubünden (FS26)  
* **Themenfeld:** IoT-Applikation zum Thema Eltern mit kleinen Kindern  
* **Name des Projekts:** Monster-Scanner  
* **Team Physical Computing:** Janna Stutz und Alissa Tritten  
* **Team WebApp:** Alina Gerber und Joy Zimmermann

#### Welches Problem im Alltag von Eltern mit kleinen Kindern wird gelöst?

Viele Kinder haben Angst vor Monstern unter dem Bett, dies ist nicht nur eine grosse Belastung für die Kinder selbst sondern auch für die Eltern bedeutet das mehr Care-Arbeit und schlaflose Nächte - der Monster-Scanner löst genau dieses Problem.

#### Was ist der „Sinn und Zweck“ des Systems?

* Care-Arbeit kann vermindert werden
* Eltern können durchschlafen
* Ängste werden auf effektive Weise beruhigt
* das Selbstbewusstsein der Kinder wird gestärkt

Es muss wirklich überprüft werden, dass keine Monster da sind und dann brauchen die Kinder eine visuelle Bestätigung. Die Eltern sollen informiert werden, sobald Bewegung unter dem Bett festgestellt wurde.

\[*Bilder / GIFs (optional)*\]

### UX & Konzeption
*In diesem Teil werden die gemeinsamen Schritte aus der UX-Abgabe dokumentiert, damit sich hier alles vollständig an einem Ort befindet (betrifft WebApp und Physical Computing)*

#### 🎨 Design

Wir haben bei der Erstellung des Design versucht eine Mischung einem schlichten Design, sowie etwas kindlichen Elementen zu machen. Das heisst so, dass es für die Eltern, sowie für die Kinder ansprechend designt ist.

Anhand des AB-Testings haben wir herausgefunden, dass dies bei den Eltern mit kleinen Kindern sehr gut ankommt, da es sich ja dabei um ein App handelt, welches für das Sicherheitsgefühl der Kinder sorgt.

* **Figma:** [Hier gehts zum Figma](https://www.figma.com/design/6s5t7Cb0NK4FvaAhdiKhcd/IM-4-%E2%80%93-App-Konzeption?node-id=78-325&t=XFWmMQKEByA0oNdQ-1)
* **User Flow \+ Screen Flow** (Screenshot aus Figma)  
* ggf. weitere Ergänzungen
* *Welche Features waren angedacht?*

* *Welche Features wurden nicht umgesetzt? (Warum)*

Wir haben uns zu Beginn noch überlegt, ob wir noch einen Schichtplan ergänzen, wo sich die Eltern eintragen können, wann sie an der Reihe sind aufzustehen, wenn der Alarm los geht. Eine weitere Funktion wäre ein Switch gewesen, welcher zum Zug käme, wenn man mehr als 1 Kind hat. Das man zwei Homebildschirme hat (je einen pro Kind). 

Diese zwei Features haben wir nicht umgesetzt, da wir nur einen Buzzer haben und darum unser Konzept auf ein Kind beschränkt ist. Beim Schichtplan hätte es sehr viele Eventualitäten geben können wenn noch andere Personen "Nachtschicht" hätten oder mehr als zwei Personen zuständig sind. Das war in der Umsetzung dann etwas sehr kompliziert.

### Setup

#### 🏁 Unsere WebApp

Der Monster-Scanner kann unter dem folgenden Link aufgerufen werden:

[Link zur Webapp](https://im4.lisa-joy.ch)

* **Video-Dokumentation:** [Link zum Video auf Youtube](http://link.zum.video) 

#### Installationsanleitung WebApp

***verständliche** Schritt-für-Schritt-Anleitung für Aussenstehende, um das Projekt zu klonen und auf einem eigenen Server zu installieren*

1. *Was benötige ich an Infrastruktur?*  
2. *Was muss ich auf meinem Webserver installieren?*  
3. *Wie kann ich die Datenbank importieren?*  
4. *Wo muss ich die DB-Credentials eintragen?*  
5. *…*  
6. *Wie nehme ich das physische Artefakt in Betrieb?*

#### Bauanleitung Physical Computing

* ***Was muss ich wie bauen, verbinden, installieren?***  

**Komponentenplan** 
bild
 
**Steckplan** 
bild

 
* noch einfügen:echte bilder von steckplatte

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

**Projektstruktur / Code-Struktur:** \[*Hinweis: Der Code selbst muss im Repository liegen und im Kopfbereich jeder Datei eine kurze Zusammenfassung enthalten.*\]  

Der Code befindet sich vollständig im Repository. Jede Datei enthält im Kopfbereich eine kurze Beschreibung ihrer Funktion.

Hier folgt eine kurze Beschreibung vom Aufbau und Inhalt der Code-Struktur:
* **monster_scanner.ino**
  WLAN-Verbindung vom Microcontroller, gesamte Sensorsteuerung inklusive Buzzer-Betätigung, LED-Animationen, Bewegungserkennung, JSON-Erstellung, HTTP-POST-Requests
* **load.php**
  Empfang der JSON-Daten, Verarbeitung der POST-Requests, Speicherung in der Datenbank
* **config.php**
  Datenbank-Zugangsdaten, PDO-Verbindung zur MySQL-Datenbank
* **Weiterer code von Web-App Gruppe ab hier**
* usw
* noch mehr Code
* immer mit kurzer inhaltlicher Beschreibung
* alle Codes hihi


**Datenschnittstelle zwischen Physical Computing und WebApp:**

Die Kommunikation zwischen Physical Computing und WebApp erfolgt über HTTP-POST-Requests im JSON-Format. Der Datenfluss sieht wie folgt aus:

ESP32 →  WLAN → HTTP POST Request → load.php → MySQL-Datenbank → WebApp 
(@webapp gruppe: hier noch genauer schreiben wie der datenfluss von webapp auf DB zugreift, mit php usw)

* **🗄️ Datenbank**

wir haben die Datenbank auf Hostpoint gemacht. Hier findest du die Datenbankplanung: [Klick hier](https://github.com/joy-lisa/im4/blob/main/Datenbankplanung.pdf)
* **ERM:** \[*Erklärung und Schaubild*\] 
* **🔑👤 Authentifizierung für Monster-Scanner**

Hier passiert die Anmeldung auf unsere App. 

Standardmässig bleibt die Session aktiv, solange der Browser offen ist und endet mit dem Schliessen des Browsers. Wenn die Session ca. 24 Minuten inaktiv ist endet die Session und der User wird ausgeloggt.

Wir haben uns bewusst gegen eine präzise Zeitbegrenzung entschieden, weil in unserem Fall die Zeitspanne passend ist und das auch zu einer guten User Experience führt

Seiten, die man nur eingeloggt besuchen kann sind die index.hmtl- und das konto.html-Seite. Ausgeloggt kann man die Startseite (start.html), sowie die Login- (login.html) und Registrierungseite (register.html) besuchen.

## Known bugs

* Was funktioniert noch nicht einwandfrei?  
* Was ist uns aufgefallen bei der Entwicklung?  
* Was könnte noch verbessert werden?

## Umsetzungsprozess

* **Reflexion / Erfahrung / Lernfortschritt:** *Was haben wir gelernt? Würden wir es nochmal genauso machen? Was war gut, was war schlecht?*  
* **Herausforderungen & Lösungen:** \[*Verworfene Ansätze, Fehler, Umplanungen*\]  
* **KI-Einsatz:** *Dokumentation der verwendeten KI-Tools und deren Nutzen (KI ist nicht verboten)*  
* **Fazit:** …


- Beinhaltet die Konfigurationsdatei für die Datenbankverbindung.
- Beinhaltet die Datei `database.sql`, die die `users` Tabelle erstellt.
- Beinhaltet die Datei `config.php`, die die Konfiguration des Backends enthält.


