# StudentHub - Aplikacioni për Studentë

Një aplikacion celular për studentë për të menaxhuar oraret, ndjekur notat/mungesat dhe marr njoftime.

## Karakteristikat

- **Menaxhimi i Orarit**: Shiko dhe menaxho oraret javore të mësimit
- **Notat & Mungesat**: Ndiq performancën akademike dhe prezencën
- **Njoftimet**: Njoftime në kohë reale brenda aplikacionit

## Teknologjitë

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + JSON database

## Si të Filloni

### 1. Fillo Backend-in
```bash
cd backend
npm install
npm start
```
Backend funksionon në http://localhost:3001

### 2. Fillo Frontend-in
```bash
cd frontend
npm install
npm run dev
```
Frontend funksionon në http://localhost:5173

### 3. Hap Aplikacionin
Hap http://localhost:5173 në shfletuesin tënd (më së miri shikohet në celular ose me viewport celular)

## API Endpoints

| Metoda | Endpoint | Përshkrimi |
|--------|----------|-------------|
| GET | /api/schedule | Merr të gjitha orët |
| POST | /api/schedule | Shto orë të re |
| PUT | /api/schedule/:id | Përditëso orën |
| DELETE | /api/schedule/:id | Fshij orën |
| GET | /api/grades | Merr të gjitha notat |
| POST | /api/grades | Shto notë të re |
| DELETE | /api/grades/:id | Fshij notën |
| GET | /api/absences | Merr të gjitha mungesat |
| POST | /api/absences | Shto mungesë |
| DELETE | /api/absences/:id | Fshij mungesën |
| GET | /api/notifications | Merr të gjitha njoftimet |
| POST | /api/notifications | Krijo njoftim |
| PUT | /api/notifications/:id/read | Shëno si të lexuar |
| GET | /api/notifications/stream | SSE stream për përditësime në kohë reale |
| GET | /api/stats | Merr statistikat |
