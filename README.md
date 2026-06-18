# EMI Calculator

Interactive EMI calculator built with React, Vite, Redux Toolkit, and Context API.

## Local URL

Development server:

```text
https://emi-calculator-bice-five.vercel.app/
```

## Vercel Settings

Use these settings if Vercel asks for them:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

This repository also includes `vercel.json`, so Vercel can detect the build command and output directory automatically.

## Run Project

```bash
npm install
npm run dev
```

## Build Project

```bash
npm run build
```

## Code Structure

```text
emi-calculator/
├── App.jsx
├── index.html
├── main.jsx
├── package.json
├── vercel.json
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

## Main Files

`main.jsx` initializes React, Redux, theme context, and global styles.

`App.jsx` contains the calculator layout, derived calculations, comparison tools, and CSV export.

`store/emiSlice.js` stores calculator input state and reducers.

`context/ThemeContext.jsx` manages theme and compact view preferences.

`utils/emiCalculator.js` contains EMI, amortization, affordability, and formatting helpers.
