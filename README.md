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
* *ergänze: **Komponentenplan** (betrifft Physical Computing, vgl. Slides Kapitel 15): Schaubild enthält*  
  * *die eingesetzten Komponenten*  
  * *die verbundenen Sensoren und Aktoren*  
  * *die Programme (mit Dateinamen)*  
  * *die Kommunikationswege*  
* *ergänze: **Steckplan** (betrifft Physical Computing, vgl. Slides Kapitel 15): generiert z.B. mit Fritzing (empfohlen), Tinkercad, Wokwi*  
  * *beachtet die [Fritzing Parts](https://github.com/Interaktive-Medien/im_physical_computing/tree/main/15_Intro_Projektdoku) extra für euch*  
* *ggf. **Bildmaterial***

## technische Details

// Hier sollte das Verständnis ersichtlich sein / Wie stehen die Dateien in Beziehung zueinander, Wie reden Die Dateien miteinander, Wie ist der Weg der Daten

* **Projektstruktur / Code-Struktur:** \[*Hinweis: Der Code selbst muss im Repository liegen und im Kopfbereich jeder Datei eine kurze Zusammenfassung enthalten.*\]  
* **Datenschnittstelle: \[***zwischen WebApp und Physical Computing*\]
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


