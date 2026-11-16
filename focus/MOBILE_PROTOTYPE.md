# Mobiler FOCUS Ride Companion – zweite Fassung

Stand: 17. November 2026. Unabhängige Bewerbungsstudie von Sven Preuß, kein offizielles FOCUS-Produkt.

## Umsetzung

Fünf App-Bereiche: Start, Touren, Karte, Mein Bike und Entdecken. Mobile Oberfläche mit Bottom Navigation, Dialogen für Bikeprofil und Wetter, interaktiver Energierechnung, abspielbarer Demo-Fahrt, Servicevermerken und freiwilliger Interessen-Demo. Die bisherige technische Oberfläche bleibt unter technik-demo.html erhalten.

Schwarz-Weiß-Gestaltung orientiert sich am aktuellen FOCUS-Auftritt. FOCUS-Wortmarke und Markenfoto stammen vom offiziellen Auftritt und dienen der Konzeptdarstellung. Die Schrift Roboto Condensed steht unter SIL Open Font License; Lizenz unter assets/ride-sans-LICENSE.txt. Es wird keine FOCUS-Schriftdatei verteilt.

## Durchgeführte Prüfung

- 37 Browserprüfungen mit Chromium bei 360, 390 und 1440 Pixel Breite.
- Alle fünf App-Bereiche erreichbar, keine horizontale Überbreite.
- Profiländerungen, leerer Akku, simulierte Unwetterwarnung, Demo-Fahrt, Pause, Servicevermerke, Interessenauswahl und Escape für Dialoge geprüft.
- Keine JavaScript-Laufzeitfehler oder fehlgeschlagenen Ressourcenanfragen im Test.
- Automatisierte axe-Prüfung mit WCAG 2 A/AA und 2.1 AA auf allen fünf Bereichen: keine gemeldeten Verstöße nach Korrektur der Textkontraste.
- Mobile Startansicht und Kartenansicht visuell geprüft.

## Grenzen

Chromium-Prüfungen ersetzen keine vollständige manuelle Barrierefreiheitsprüfung und keinen Test in Safari auf einem echten iPhone. Keine echte Wetteranbindung, Bike-Telemetrie, Ortung, Navigation, Diagnose oder Newsletter-Anmeldung. Karte, Fahrt und Wetter bleiben durchgehend als Simulation gekennzeichnet. Die Energieabschätzung ist weiterhin ein unkalibriertes Demonstrationsmodell. Der manifestierte Web-Prototyp verspricht keine Offline-Funktion und ist keine App-Store-App.
