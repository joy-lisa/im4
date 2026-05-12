## im4 - Monster Scanner

--> bei der Chat Gpt-Anfrage bezüglich der Datenbank: erwähnen, dass wir es mit PDO machen

Das ist unser Figma: 
https://www.figma.com/design/6s5t7Cb0NK4FvaAhdiKhcd/IM-4-%E2%80%93-App-Konzeption?node-id=1402-201&t=XFWmMQKEByA0oNdQ-1

# 🔑👤 Authentifizierung für Monster-Scanner

Hier passiert die Anmeldung auf unsere App. 

Standardmässig bleibt die Session aktiv, solange der Browser offen ist und endet mit dem Schliessen des Browsers. Wenn die Session ca. 24 Minuten inaktiv ist endet die Session und der User wird ausgeloggt.

Wir haben uns bewusst gegen eine präzise Zeitbegrenzung entschieden, weil in unserem Fall die Zeitspanne passend ist und das auch zu einer guten User Experience führt

Seiten, die man nur eingeloggt besuchen kann sind die index.hmtl- und das konto.html-Seite. Ausgeloggt kann man die Startseite (start.html), sowie die Login- (login.html) und Registrierungseite (register.html) besuchen.

# 🏁 Unsere Website

Du kannst den Monster-Scanner unter der folgendem Link:

[https://im4.lisa-joy.ch]

# 🗄️ Datenbank

- wir haben die Datenbank auf Hostpoint gemacht.
- Hier findest du die Datenbankplanung:https://github.com/joy-lisa/im4/blob/e23317e88c35619695ed21b4ff20466ba2c2c5fb/Datenbank-Planung.pdf


### 4. FTP Connect

- Erstelle eine neue FTP Verbindung mit dem SFTP Plugin gemäss [Anleitung im MMP 101](https://github.com/Interaktive-Medien/101-MMP/blob/main/resources/sftp.md).

# 📁 Struktur

## 🎨 Frontend

### root (Basis-Verzeichnis)

- beinhaltet alle HTML-Dateien des Frontends.
- beinhaltet die `.gitignore` Datei, welche die Dateien und Verzeichnisse ausblendet, die nicht auf GitHub hochgeladen werden sollen.

### js

- beinhaltet alle JavaScript-Dateien des Frontends.

### css

- beinhaltet alle CSS-Dateien des Frontends.

## 🤖 Backend

### api

- Beinhaltet alle API-Endpunkte des Backends.
- Diese Dateien werden von `JavaScript` aufgerufen und geben eine Antwort an `JavaScript` zurück.

### system

- Beinhaltet die Konfigurationsdatei für die Datenbankverbindung.
- Beinhaltet die Datei `database.sql`, die die `users` Tabelle erstellt.
- Beinhaltet die Datei `config.php`, die die Konfiguration des Backends enthält.
