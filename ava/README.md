# AVA — AI Assessment Demo

Unabhängiger Demonstrationsprototyp von Sven Preuß. Keine offizielle Anwendung von Deyan7 und kein Produkt für Personalentscheidungen. Die ursprünglichen Projektdateien lagen bei der Erstellung nicht vor. Die Aufgaben sind nach der bereitgestellten Beschreibung und dem Screenshot neu formuliert; der Agenten-Trace ist simuliert.

## Start

Voraussetzung: Python 3 oder ein anderer statischer Webserver. Im Projektordner `python3 -m http.server 8000` ausführen und http://localhost:8000/ öffnen. JavaScript-Module erfordern HTTP; `file://` ist nicht unterstützt. Alternativ `npm start`. Tests: `npm test` (Node.js 20+). Kein npm-Paket und kein Build notwendig.

## Funktionen

Vier frei navigierbare Aufgaben, lokale Zwischenspeicherung, Wiederaufnahme im selben Browser, Änderung, Fortschritt, bestätigtes Zurücksetzen und JSON-Export. Die fünf Technik-Einschätzungen werden nicht als richtig oder falsch gewertet. Eine freiwillige Reflexion über KI-Nutzung ist möglich. Es gibt kein Backend, keine Anmeldung, keine Telemetrie und keine Modellaufrufe. Der lokale Speicher kann gelöscht oder blockiert werden; er ist keine Sicherung und wird nicht zwischen Geräten synchronisiert. Exportdateien enthalten alle Eingaben.

## Evaluation und Grenzen

Die getrennte Datei `src/evaluation.js` enthält versionierte, deterministische Stichworthinweise. Sie bewertet weder fachliche Richtigkeit noch Begründung, Gleichwertigkeit, Fairness oder Kompetenz. Negative Aussagen können Treffer erzeugen, gleichwertige Formulierungen übersehen werden. Alle offenen Antworten sind für menschliche Prüfung markiert. Kein Score und keine Entscheidungsempfehlung. Der Prototyp ist keine validierte Eignungsdiagnostik. Der Dialog ist ebenfalls statisch; AVA ist kein Sprachmodell.

## Veröffentlichung auf GitHub Pages

1. Neues öffentliches Repository `ava-ai-assessment-prototype` auf GitHub erstellen, zunächst ohne README oder .gitignore.
2. Im Projektordner: `git init -b main`, `git add .`, `git commit -m "Initial AVA demo"`.
3. `git remote add origin https://github.com/<BENUTZERNAME>/ava-ai-assessment-prototype.git` und `git push -u origin main` (GitHub-Authentifizierung erforderlich).
4. Im Repository unter **Settings → Pages → Build and deployment** die Quelle **Deploy from a branch** und `main` / `/ (root)` wählen und speichern.
5. Den in Pages angezeigten Link nach erfolgreichem Deployment öffnen; Aufgaben, Neuladen und Export prüfen. Relative Pfade unterstützen den Repository-Unterpfad. Bei Updates erneut pushen.

Der Workflow `.github/workflows/test.yml` prüft die Evaluationslogik automatisch bei Push und Pull Request. Das Einschalten von Pages geschieht separat in den Repository-Einstellungen.

## Ausbauziel

Die vorgeschlagene Architektur mit Next.js/TypeScript/Tailwind, FastAPI, PostgreSQL, einem anbieteroffenen LLM-Gateway, Langfuse/OpenTelemetry und Playwright ist ein Zukunftskonzept, kein Bestandteil dieser statischen Demo. Echte Modellaufrufe benötigen ein gesondert betriebenes Backend, sichere Schlüsselspeicherung, Zugriffsschutz, validierte Ausgabeformate, Fehlerbehandlung und kontrollierte Datenverarbeitung; GitHub Pages stellt kein Backend bereit. Vor Bewerbungsanwendungen sind Datenschutz, anwendbare Anforderungen des EU AI Act, effektive menschliche Kontrolle und Fairness gesondert zu prüfen. Fachleute müssen Rubriken, repräsentative Referenzdaten, unabhängige Testdaten und Bewertungsqualität validieren.
