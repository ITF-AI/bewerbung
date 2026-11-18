import {VERSION,done} from './data.js';
// Presence signals are prompts for human review, never evidence of correctness.
const groups=[
 {label:'Fehleranalyse und Problemlösung',text:a=>a.debug,criteria:[['Ausfall oder Fehler',/timeout|fehler|ausfall|error|fehlgeschlagen/i],['Quellen und Belege',/quelle|beleg|evidence|vertrag|nachweis/i],['Absicherung',/fallback|abbruch|retry|wiederhol|eskalat|prüfung|pruefung|test|freigabe/i]]},
 {label:'Begründete Entscheidung',text:a=>a.reason,criteria:[['Qualität oder Prüfung',/qualität|qualitaet|test|evalu|prüf|pruef|referenz/i],['Abwägung oder Grenzen',/risiko|grenz|nachteil|vorteil|alternativ|vergleich|weil|da |abhängig/i]]},
 {label:'Architektur und Umsetzung',text:a=>a.architecture,criteria:[['Architektur oder Datenfluss',/architektur|frontend|backend|schnittstelle|api|datenfluss/i],['Sicherheit oder Datenschutz',/sicher|datenschutz|zugriff|berechtigung|verschlüssel|privacy/i],['Evaluation oder menschliche Prüfung',/evalu|test|valid|mensch|freigabe|qualität|qualitaet/i]]}
];
export function evaluate(answers){
 return {rubricVersion:VERSION,method:'Regelbasierte Stichwort-Hinweise; keine fachliche Bewertung',humanReviewRequired:true,limitations:'Stichwörter prüfen weder Bedeutung noch Richtigkeit, Negation, Gleichwertigkeit, Schreibstil oder Fairness. Fehlende Treffer sind kein Beleg fehlender Kompetenz.',completion:done(answers),areas:groups.map(g=>({area:g.label,signals:g.criteria.map(([name,re])=>({name,detected:re.test(g.text(answers))})),status:'Menschliche Prüfung erforderlich'})),technologyRatings:{status:'Nicht bewertet',reason:'Alle vier Einschätzungen bleiben ohne Richtig-falsch-Wertung.'}};
}
