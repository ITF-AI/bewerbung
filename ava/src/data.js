export const VERSION='1.0.0';
export const tasks=[
 {title:'Agenten-Debugging',short:'Agenten-Debugging',subtitle:'Fehler erkennen. Ursachen eingrenzen. Risiken absichern.',intro:'Ein Support-Agent soll eine Vertragsfrage beantworten. Analysiere den Ablauf und beschreibe, wie du ihn technisch robuster gestalten würdest.'},
 {title:'Expertenwissen in KI-Systeme übertragen',short:'Expertenwissen',subtitle:'Wissen strukturieren. Qualität messbar machen.',intro:'Ein Unternehmen besitzt 150 beantwortete Fachfragen und möchte neue Anfragen fachlich richtig und nachvollziehbar beantworten. Welcher Ansatz ist für dich der beste Ausgangspunkt? Begründe deine Wahl.'},
 {title:'Einschätzung des KI-Technikstands',short:'Technikstand',subtitle:'Differenziert einschätzen statt raten.',intro:'Wie schätzt du diese fünf Themen ein? Es gibt hier keine automatisch richtige oder falsche Auswahl. Ergänze auf Wunsch deine Begründung oder Unsicherheit.'},
 {title:'KI-Systemarchitektur',short:'Systemarchitektur',subtitle:'Vom Konzept zur überprüfbaren Umsetzung.',intro:'Wie würdest du einen KI-Assistenten für ein Assessment entwickeln? Beschreibe Architektur, Technologien, Sicherheit, Evaluation und Umsetzung.'}
];
export const options=[
 'Prompting: Das Expertenwissen in einem ausführlichen System-Prompt zusammenfassen.',
 'Fine-Tuning: Das Modell mit den vorhandenen Antworten anpassen und anschließend prüfen.',
 'Retrieval: Dokumente aufbereiten, passende Quellen abrufen und Antworten daran ausrichten.',
 'Evaluation zuerst: Referenz- und unabhängige Testdaten erstellen und die Qualität verschiedener Ansätze vergleichen.'
];
export const topics=['Computer-Use-Agenten: Browser und Desktop-Anwendungen bedienen','KI-Coding-Agenten: Softwarefunktionen eigenständig implementieren','Interaction Memory: Aus früheren Interaktionen nutzbares Gedächtnis aufbauen','KI im Rechtsbereich: Verträge, Recherche und Schriftsätze unterstützen','KI im Vertrieb: Recherche, Ansprache und Qualifizierung unterstützen'];
export const levels=['Forschung: vielversprechend, noch nicht breit produktiv einsetzbar','Früh: erste produktive Einsätze in begrenzten Fällen','Etabliert: breit im Einsatz, mit bekannten Grenzen','Gereift: Standardwerkzeug, funktioniert zuverlässig'];
export const empty=()=>({schemaVersion:1,task:0,answers:{debug:'',choice:'',reason:'',ratings:Array(5).fill(''),techReason:'',architecture:'',reflection:''}});
export function done(a){return [!!a.debug.trim(),!!a.choice&&!!a.reason.trim(),a.ratings.length===5&&a.ratings.every(x=>['1','2','3','4'].includes(x)),!!a.architecture.trim()];}
