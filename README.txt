Mare Tank App – Update (AdBlue aus PDF, keine KW5 Anzeige)

Was wurde gemacht:
1) AdBlue-Preise aus der KW5 PDF übernommen und in prices.json eingetragen (kein Live, sondern fester Stand).
2) stations.geo.json erweitert:
   - address (ohne Öffnungszeiten)
   - hours (Öffnungszeiten automatisch aus der Adresse extrahiert)
   - provider + name bleiben erhalten (Name steht wieder davor)
3) app.js Layout geändert wie von dir gewünscht:
   - Tankstellenname oben
   - Adresse + Öffnungszeiten darunter
   - Entfernung
   - Diesel + AdBlue
   - Navigation Button
   - KEIN "Stand: KW5" mehr irgendwo.

Hinweis:
Wenn bei einzelnen Stationen AdBlue fehlt ("—"), dann steht in der PDF kein AdBlue-Wert für diese Station.

Upload in GitHub Repo (Mare-Tank-App):
- stations.geo.json ersetzen
- prices.json ersetzen
- app.js ersetzen
- optional: Inhalt von style_patch.css ans Ende deiner style.css kopieren
Danach: Seite neu laden (Strg+F5 / Handy Cache leeren)
