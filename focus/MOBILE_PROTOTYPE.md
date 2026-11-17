# FOCUS Ride Companion – verbundene Fassung

Stand: 18. November 2026 (Europe/Berlin). Unabhängige Bewerbungsstudie von Sven Preuß.

## Funktionierender Kern

- Wetterprognosen automatisch von Open-Meteo, mit aktuellem Wetter und stündlichen Prognosen.
- Drei echte Rundtouren ab dem Startpunkt über BRouter, Radprofil trekking, auf OpenStreetMap. Eine kompakte Alternative und zwei Runden in unterschiedlichen Richtungen. Keine erfundenen Strecken im mobilen Companion.
- Startpunkt zunächst ausdrücklich als Beispielort Tettnang. Orts-/Postleitzahlsuche, optional GPS nach Nutzeraktion. Kein automatischer GPS-Zugriff.
- Routenvergleich nach Fahrzeit, Wetter, Böen, Niederschlag, Tageslicht, amtlichen Warnungen und modellierter Akkureserve. Empfehlungen sind regelbasiert und mit ihren Gründen sichtbar; kein LLM-Dienst wird aufgerufen.
- Wetter an vier Punkten pro Route im jeweiligen Fahrzeitfenster, mit Zeitpuffer. Tageslicht wird anhand von Sonnenaufgang und Sonnenuntergang berechnet.
- Amtliche DWD-Warnungen für Deutschland: Überschneidung von Tourzeit, realem Streckenverlauf, Warnpolygon und Höhenbeschränkungen. Prognosehinweise und amtliche Warntexte sind getrennt dargestellt.
- Keine positive Freigabe bei unbekannter Wetter-/Warnlage. Gewitter, gefrierender Niederschlag, Schnee, starke Böen, kritische Warnlage oder unzureichender Akku können die Empfehlung stoppen. Eine Alternative hebt eine Warnlage nicht auf.
- Automatische Aktualisierung bei geöffneter App alle 15 Minuten und nach Wiederherstellung der Verbindung. Inaktive Tabs fragen nicht fortlaufend ab. Keine Hintergrund-Pushwarnungen.
- Reale Routenübersicht mit OpenStreetMap-Kacheln, sichtbaren Alternativen, GPX-Export und Link zu BRouter. Die Demo-Fahrt bleibt eine gekennzeichnete Wiedergabe, keine Navigation.
- Bikeprofil auf dem Gerät gespeichert; Wetter wird nicht mehr manuell eingestellt. GPS bleibt in der Sitzung. Ein gesuchter Ort wird lokal gespeichert.

## Nachweise

22 automatisierte Prüfungen der Entscheidungslogik: `node --test focus/tests/ride-live.test.cjs`.

Reale API-Antworten für drei Runden bei Tettnang erhalten: 12,925 km / 56 hm, 19,607 km / 247 hm und 21,902 km / 99 hm. Dies ist ein technischer Prüflauf, keine dauerhafte Tour- oder Wetterzusage. Open-Meteo-Batch für sieben unterschiedliche Prognoseorte und aktueller DWD-Feed erfolgreich abgerufen. HTTP 200 und browserfähige CORS-Antworten aller drei Anbieter geprüft.

DOM-Integration mit aufgezeichneten echten API-Antworten geprüft. Ältere 37 Chromium- und axe-Prüfungen gelten ausschließlich für die vorherige Simulationsfassung und werden nicht als Prüfung dieser Erweiterung ausgewiesen.

## Grenzen und Betrieb

Keine Bike-Telemetrie oder Herstellerautorisierung. Akkustand, Kapazität und weitere Bikeangaben sind manuell; der Verbrauch bleibt eine unkalibrierte Modellschätzung. Keine Abbiegehinweise, GPS-Fahrtaufzeichnung oder technischen Diagnosen. Keine automatische Straßensperrungsprüfung oder garantierte Fahrbarkeit. Keine Offlinenavigation und keine App-Store-Veröffentlichung. Amtliche Warnungen außerhalb Deutschlands sind noch nicht integriert.

Die öffentlichen Schnittstellen werden ohne API-Schlüssel aus dem Browser aufgerufen. Der kostenfreie Open-Meteo-Zugang ist für nichtkommerziellen Gebrauch; vor einem kommerziellen FOCUS-Pilot sind Nutzungsbedingungen, Kontingente und ein geeigneter Betriebsvertrag zu klären. BRouter nutzt eine öffentliche Instanz ohne Verfügbarkeitsgarantie. Für skalierenden Betrieb ist ein eigener oder vertraglich abgesicherter Routingdienst nötig. Nach einem Ausfall zeigt die App fehlende Daten statt Ersatzprognosen.

Schwarz-Weiß-Gestaltung, FOCUS-Wortmarke und Markenfoto bleiben aus der bisherigen Bewerbungsstudie erhalten. Roboto Condensed unter SIL OFL; Lizenz in assets/ride-sans-LICENSE.txt.

## Schnittstellen und Herkunft

- https://open-meteo.com/en/docs
- https://open-meteo.com/en/docs/geocoding-api
- https://github.com/abrensch/brouter/blob/master/brouter-server/src/main/java/btools/server/request/ServerHandler.java
- https://brouter.de/brouter-web/
- https://www.dwd.de/warnungen
- https://s3.eu-central-1.amazonaws.com/app-prod-static.warnwetter.de/v16/gemeinde_warnings_v2.json
- https://www.openstreetmap.org/copyright
