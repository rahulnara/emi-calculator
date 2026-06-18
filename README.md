# EMI Calculator

Interactive EMI calculator built with React, Vite, Redux Toolkit, and Context API.

## Local URL

Development server:

```text
http://127.0.0.1:5173/
```

## Features

- EMI calculation with loan amount, interest rate, tenure, fees, and insurance.
- Redux-powered calculator state.
- Context-powered theme and compact view settings.
- Prepayment planner with interest and month savings.
- Rate comparison calculator.
- Floating-rate shock calculator.
- Affordability calculator.
- Payment split chart and repayment trend chart.
- Monthly and yearly amortization schedule.
- CSV export for repayment schedule.
- Responsive layout with light and dark themes.

## Run Project

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build production files:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Code Structure

```text
emi-calculator/
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── styles.css
    ├── components/
    │   ├── BarChart.jsx
    │   ├── DonutChart.jsx
    │   ├── InputControl.jsx
    │   └── SummaryCard.jsx
    ├── context/
    │   └── ThemeContext.jsx
    ├── store/
    │   ├── emiSlice.js
    │   └── store.js
    └── utils/
        └── emiCalculator.js
```

## File Responsibilities

`src/main.jsx`  
Bootstraps React, Redux Provider, ThemeProvider, and global styles.

`src/App.jsx`  
Main page layout and calculator workflow. Connects Redux state to UI, builds derived calculations, and handles CSV export.

`src/store/store.js`  
Creates the Redux store.

`src/store/emiSlice.js`  
Stores all calculator inputs and reducers for updating fields, resetting values, and applying presets.

`src/context/ThemeContext.jsx`  
Manages light/dark theme and compact view preference with localStorage.

`src/utils/emiCalculator.js`  
Contains optimized calculation helpers for EMI, amortization schedule, yearly summaries, affordability, and formatting.

`src/components/InputControl.jsx`  
Reusable range plus number input control.

`src/components/SummaryCard.jsx`  
Reusable metric card for EMI, interest, total outflow, and payoff date.

`src/components/DonutChart.jsx`  
CSS-based payment split chart for principal, interest, and fees.

`src/components/BarChart.jsx`  
CSS-based repayment trend chart.

`src/styles.css`  
Responsive UI styling, themes, layout, cards, charts, tables, and form spacing.

## Repository

This project is a separate git repository at:

```text
/Applications/MAMP/htdocs/react-projects/emi-calculator
```
