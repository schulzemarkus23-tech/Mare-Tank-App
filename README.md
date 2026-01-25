# Tankstellen – Diesel Live (AT + DE)

- Tankstellen ausschließlich aus Excel
- Diesel live:
  - Österreich: E-Control
  - Deutschland: Tankerkönig
- Update alle 30 Minuten (GitHub Actions)
- Navigation über Koordinaten
- Entfernung per Standort

## Setup
1) ZIP entpacken
2) Alles ins Repo-ROOT hochladen
3) Settings -> Pages -> main -> /(root)
4) Settings -> Secrets -> Actions:
   - TANKKOENIG_API_KEY = dein Key
5) Actions -> Diesel Live AT+DE -> Run workflow
