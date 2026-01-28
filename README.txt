Fix: fehlende AdBlue-Werte (KW5 PDF) + Öffnungszeiten ergänzt

Warum fehlte AdBlue?
- Einige AdBlue-Werte im PDF sind > 0.9 (z.B. 1.038, 1.023). Die alte Logik hat das fälschlich als Diesel erkannt.
- Neue Logik nutzt Spaltenpositionen im PDF (Diesel-Spalten vs AdBlue-Spalten).

Was wurde gemacht:
1) prices.json neu erzeugt: Diesel/AdBlue exakt aus KW5 PDF nach Spaltenposition.
   - Mikulov (AdBlue 1.023) ist jetzt drin
   - Andiesen 13 (AdBlue 1.038) ist jetzt drin
   - Hartheim (AdBlue 0.657) ist jetzt drin
   - Wals/Debant/Bruck/Wolfsberg/Leoben/... bleiben ohne AdBlue, weil im PDF '-' steht (kein Wert).
2) Öffnungszeiten ergänzt:
   - Neuenburg: 00.00-24.00
   - Hartheim: 00.00-24.00

Upload in GitHub:
- prices.json ersetzen
- stations.geo.json ersetzen
- app.js bleibt gleich (optional ersetzen)
Danach: Strg+F5 / Handy Cache leeren.
