#include <WiFi.h>
#include <HTTPClient.h>
#include <Adafruit_NeoPixel.h>

// WLAN
const char* ssid = "lisa joy <3";
const char* pass = "123456789";

// PHP-Datei
String serverURL = "https://im4.lisa-joy.ch/api/load.php";

// Ultraschallsensor
const int trigPin = 12;
const int echoPin = 13;

#define SOUND_SPEED 0.034

long duration;
float scan1;
float scan2;

// Button / Buzzer
const int buttonPin = 10;
int buttonState = 0;
int prev_buttonState = 0;

// Buzzer-ID für Datenbank
int buzzer_ID = 1;

// Bewegung / Monster
int bewegung = 0;

// LED-Ring
#define LED_PIN 2
#define NUM_PIXELS 12

Adafruit_NeoPixel strip(NUM_PIXELS, LED_PIN, NEO_GRB + NEO_KHZ800);
int currentPixel = 0;

// Builtin LED
const int led = BUILTIN_LED;

void setup() {
  Serial.begin(115200);
  delay(1000);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  pinMode(buttonPin, INPUT_PULLDOWN);

  pinMode(led, OUTPUT);
  digitalWrite(led, 0);

  strip.begin();
  strip.setBrightness(50);
  strip.clear();
  strip.show();

  connectWiFi();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WLAN verloren. Verbinde neu...");
    connectWiFi();
  }

  buttonState = digitalRead(buttonPin);

  if (buttonState == prev_buttonState) {
    return;
  }

  prev_buttonState = buttonState;

  if (buttonState == 1) {

  Serial.println("");
  Serial.println(".....");
  Serial.println("");

    Serial.println("Button gedrückt → starte 2 Scans");
    
    digitalWrite(led, 1);

    // SCAN 1
    ledAnimationStep();
    scan1 = measureDistance();

    Serial.print("Scan 1 - Distanz: ");
    Serial.print(scan1);
    Serial.println(" cm");

    // Während der Wartezeit dreht der LED-Ring
    for (int i = 0; i < 60; i++) {
      ledAnimationStep();
      delay(80);
    }

    // SCAN 2
    scan2 = measureDistance();

    Serial.print("Scan 2 - Distanz: ");
    Serial.print(scan2);
    Serial.println(" cm");

    Serial.println("2 Scans fertig");

    // Bewegung vergleichen
    if (abs(scan1 - scan2) > 3) {
      bewegung = 1;
      Serial.println("BEWEGUNG ERKANNT");
    } else {
      bewegung = 0;
      Serial.println("KEINE BEWEGUNG");
    }

    // Während dem Senden kurz weiterdrehen
    ledAnimationStep();

    bool gespeichert = sendToPHP(scan1, scan2, bewegung, buzzer_ID);

    if (gespeichert == true) {
      ledAllesGruen();
      Serial.println("Daten gespeichert → Ring komplett grün");
    } else {
      ledAllesRot();
      Serial.println("Speichern fehlgeschlagen → Ring rot");
    }

    digitalWrite(led, 0);

    delay(10000);

    strip.clear();
    strip.show();
  }
}

float measureDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH);

  float distance = duration * SOUND_SPEED / 2;

  return distance;
}

bool sendToPHP(float scan1, float scan2, int bewegung, int buzzer_ID) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    http.begin(serverURL);
    http.addHeader("Content-Type", "application/json");

    String jsonData = "{";
    jsonData += "\"scan1\":" + String(scan1) + ",";
    jsonData += "\"scan2\":" + String(scan2) + ",";
    jsonData += "\"bewegung\":" + String(bewegung) + ",";
    jsonData += "\"buzzer_ID\":" + String(buzzer_ID);
    jsonData += "}";

    Serial.print("Sende JSON an PHP: ");
    Serial.println(jsonData);

    int httpResponseCode = http.POST(jsonData);

    Serial.print("Antwortcode: ");
    Serial.println(httpResponseCode);

    String response = http.getString();
    Serial.println("Antwort von PHP:");
    Serial.println(response);

    http.end();

    if (httpResponseCode == 200) {
      return true;
    } else {
      return false;
    }

  } else {
    Serial.println("WLAN nicht verbunden");
    return false;
  }
}

void ledAnimationStep() {
  strip.clear();

  strip.setPixelColor(currentPixel, strip.Color(0, 255, 0));

  strip.show();

  currentPixel++;

  if (currentPixel >= NUM_PIXELS) {
    currentPixel = 0;
  }
}

void ledAllesGruen() {
  for (int i = 0; i < NUM_PIXELS; i++) {
    strip.setPixelColor(i, strip.Color(0, 255, 0));
  }

  strip.show();
}

void ledAllesRot() {
  for (int i = 0; i < NUM_PIXELS; i++) {
    strip.setPixelColor(i, strip.Color(255, 0, 0));
  }

  strip.show();
}

void connectWiFi() {
  Serial.print("Verbinde mit WLAN: ");
  Serial.println(ssid);

  WiFi.begin(ssid, pass);

  int attempts = 0;

  while (WiFi.status() != WL_CONNECTED && attempts < 40) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("");
    Serial.println("WLAN verbunden!");
    Serial.print("IP-Adresse: ");
    Serial.println(WiFi.localIP());

  } else {
    Serial.println("");
    Serial.println("WLAN Verbindung fehlgeschlagen!");
  }
}