# 🥉 SGH x Mastercard Hackathon 2025 – III. miejsce

Autorzy - Jan Ancuta, Maciej Ciesielski, Adam Sulik, Michał Zagajewski

<img width="1469" alt="image" src="https://github.com/user-attachments/assets/d868719c-3bd2-4e88-b1eb-4661aecede42" />

## 📦 OOH Delivery Coverage Visualizer (Frontend)

Frontendowa aplikacja webowa stworzona podczas **SGH x Mastercard Hackathon 2025**, służąca do interaktywnej analizy pokrycia usług OOH delivery (Out-of-Home) w Polsce. Projekt umożliwia identyfikację tzw. "białych plam" – obszarów o wysokim potencjale rynkowym, które są niedostatecznie pokryte przez paczkomaty, punkty PUDO i inne formy odbioru przesyłek.

## 🚀 Funkcje

- 🌐 Interaktywna mapa z siatką heksagonalną prezentująca analizowane obszary
- 📊 Ocena potencjału lokalizacji na podstawie modelu popytu i podaży
- 📍 Wizualizacja punktów odbioru przesyłek (np. InPost, Allegro, Orlen)
- 🧠 Integracja z algorytmem Python (API) do przetwarzania danych i scoringu lokalizacji
- 🔍 Szczegóły obszaru: populacja, liczba budynków, firm, parkingów, szkół itd.

## 🛠️ Stack technologiczny

- **Frontend:** React.js, H3 Uber, Deck.gl, React-Map-Gl, TypeScript, Tailwind CSS
- **Backend (oddzielne repo):** Python, FastAPI, Pandas, GeoPandas
- **Dane:** InPost API, GUS, OpenStreetMap, Eurostat

## 🧩 Architektura

```
Frontend (React)  <-->  Backend API (Python)  <-->  Modele scoringowe + dane geoprzestrzenne
```

## 🧠 Zespół

Projekt został stworzony w 8h przez czteroosobowy zespół jako odpowiedź na wyzwanie analizy infrastruktury OOH delivery w Polsce. Projekt zdobył III miejsce w hackathonie SGH x Mastercard 2025.
