# Anzeige-Fix (Diesel + AdBlue)

## Was ist gefixt?
- AdBlue wird jetzt angezeigt (aus prices.json -> stations[id].adblue)
- Preisformatierung sauber (— wenn fehlt, sonst 3 Nachkommastellen)
- Bessere Darstellung (Adresse + farbige Badges)

## Was du in GitHub ersetzen musst
1) app.js -> ersetzen durch die Datei aus diesem ZIP
2) Optional: style_patch.css in deine style.css kopieren (oder Inhalte am Ende einfügen)

## Prüfen
- /prices.json enthält adblue Werte
- Webseite neu laden (Strg+F5)
