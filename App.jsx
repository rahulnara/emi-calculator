import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BarChart } from "./components/BarChart.jsx";
import { DonutChart } from "./components/DonutChart.jsx";
import { InputControl } from "./components/InputControl.jsx";
import { SummaryCard } from "./components/SummaryCard.jsx";
import { useTheme } from "./context/ThemeContext.jsx";
import { applyPreset, resetCalculator, updateField } from "./store/emiSlice.js";
import {
  buildSchedule,
  calculateAffordability,
  calculateEmi,
  formatCurrency,
  formatNumber,
  getTotalMonths,
  summarizeByYear
} from "./utils/emiCalculator.js";

function App() {
  const state = useSelector((store) => store.emi);
  const dispatch = useDispatch();
  const { theme, compactView, toggleCompactView, toggleTheme } = useTheme();

  const dispatchChange = (field, value) => dispatch(updateField({ field, value }));

  const calculations = useMemo(() => {
    const months = getTotalMonths(state.tenureYears, state.tenureMonths);
    const emi = calculateEmi(state.loanAmount, state.interestRate, months);
    const schedule = buildSchedule({
      principal: state.loanAmount,
      annualRate: state.interestRate,
      months,
      emi,
      prepaymentAmount: state.prepaymentAmount,
      prepaymentFrequency: state.prepaymentFrequency,
      startMonth: state.startMonth,
      startYear: state.startYear
    });
    const yearlyRows = summarizeByYear(schedule.rows);
    const noPrepaySchedule = buildSchedule({
      principal: state.loanAmount,
      annualRate: state.interestRate,
      months,
      emi,
      prepaymentFrequency: "none",
      startMonth: state.startMonth,
      startYear: state.startYear
    });
    const compareMonths = getTotalMonths(state.compareTenureYears);
    const compareEmi = calculateEmi(state.loanAmount, state.compareInterestRate, compareMonths);
    const revisedMonths = Math.max(1, months - state.rateChangeAfterMonths);
    const revisedBalance = schedule.rows[Math.min(state.rateChangeAfterMonths, schedule.rows.length) - 1]?.balance ?? state.loanAmount;
    const revisedEmi = calculateEmi(revisedBalance, state.revisedInterestRate, revisedMonths);
    const fee = (state.loanAmount * state.processingFeeRate) / 100 + state.insuranceCost;
    const eligibleLoan = calculateAffordability({
      monthlyIncome: state.monthlyIncome,
      existingEmi: state.existingEmi,
      eligibleEmiRatio: state.eligibleEmiRatio,
      annualRate: state.interestRate,
      months
    });

    return {
      months,
      emi,
      schedule,
      yearlyRows,
      visibleSchedule: state.scheduleFilter === "monthly" ? schedule.rows.slice(0, 120) : yearlyRows,
      noPrepaySchedule,
      compareEmi,
      revisedEmi,
      fee,
      eligibleLoan,
      interestSaved: Math.max(0, noPrepaySchedule.totalInterest - schedule.totalInterest),
      monthsSaved: Math.max(0, noPrepaySchedule.payoffMonths - schedule.payoffMonths)
    };
  }, [state]);

  const exportCsv = () => {
    const header = ["Month", "EMI", "Principal", "Interest", "Prepayment", "Balance"];
    const rows = calculations.schedule.rows.map((row) => [
      row.label,
      Math.round(row.emi),
      Math.round(row.principal),
      Math.round(row.interest),
      Math.round(row.prepayment),
      Math.round(row.balance)
    ]);
    const csv = [header, ...rows].map((line) => line.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "emi-schedule.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Loan planning workspace</p>
          <h1>EMI Calculator</h1>
          <p className="intro">Plan payments, compare rates, test prepayments, and export an amortization schedule.</p>
        </div>
        <div className="actions">
          <button type="button" onClick={toggleTheme} title="Toggle theme">{theme === "light" ? "Dark" : "Light"}</button>
          <button type="button" onClick={toggleCompactView} title="Toggle density">{compactView ? "Comfort" : "Compact"}</button>
          <button type="button" onClick={() => dispatch(resetCalculator())}>Reset</button>
        </div>
      </section>

      <section className="workspace">
        <aside className="panel controls-panel">
          <div className="preset-row">
            {["home", "car", "personal"].map((preset) => (
              <button type="button" key={preset} onClick={() => dispatch(applyPreset(preset))}>
                {preset}
              </button>
            ))}
          </div>

          <InputControl label="Loan amount" field="loanAmount" min={50000} max={20000000} step={50000} value={state.loanAmount} suffix="" dispatchChange={dispatchChange} />
          <InputControl label="Interest rate" field="interestRate" min={0} max={24} step={0.05} value={state.interestRate} suffix="%" dispatchChange={dispatchChange} />
          <InputControl label="Tenure years" field="tenureYears" min={0} max={30} step={1} value={state.tenureYears} suffix=" yr" dispatchChange={dispatchChange} />
          <InputControl label="Extra months" field="tenureMonths" min={0} max={11} step={1} value={state.tenureMonths} suffix=" mo" dispatchChange={dispatchChange} />
          <InputControl label="Processing fee" field="processingFeeRate" min={0} max={5} step={0.1} value={state.processingFeeRate} suffix="%" dispatchChange={dispatchChange} />
          <InputControl label="Insurance and charges" field="insuranceCost" min={0} max={300000} step={5000} value={state.insuranceCost} suffix="" dispatchChange={dispatchChange} />

          <div className="two-col">
            <label>
              Start month
              <select value={state.startMonth} onChange={(event) => dispatchChange("startMonth", Number(event.target.value))}>
                {Array.from({ length: 12 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>{new Date(2026, index).toLocaleString("en-IN", { month: "short" })}</option>
                ))}
              </select>
            </label>
            <label>
              Start year
              <input type="number" value={state.startYear} min="2020" max="2099" onChange={(event) => dispatchChange("startYear", Number(event.target.value))} />
            </label>
          </div>
        </aside>

        <section className="content">
          <div className="summary-grid">
            <SummaryCard label="Monthly EMI" value={formatCurrency(calculations.emi)} helper={`${calculations.months} months`} tone="primary" />
            <SummaryCard label="Total interest" value={formatCurrency(calculations.schedule.totalInterest)} helper={`${formatNumber((calculations.schedule.totalInterest / state.loanAmount) * 100, 1)}% of principal`} tone="danger" />
            <SummaryCard label="Total outflow" value={formatCurrency(state.loanAmount + calculations.schedule.totalInterest + calculations.fee)} helper="Includes fees and insurance" />
            <SummaryCard label="Payoff date" value={calculations.schedule.rows.at(-1)?.label || "Today"} helper={`${calculations.monthsSaved} months saved`} tone="success" />
          </div>

          <div className="analytics-grid">
            <article className="panel">
              <div className="panel-heading">
                <h2>Payment split</h2>
                <span>{formatCurrency(calculations.fee)} fees</span>
              </div>
              <DonutChart principal={state.loanAmount} interest={calculations.schedule.totalInterest} fees={calculations.fee} />
            </article>

            <article className="panel">
              <div className="panel-heading">
                <h2>Repayment trend</h2>
                <span>First {Math.min(12, calculations.yearlyRows.length)} years</span>
              </div>
              <BarChart rows={calculations.yearlyRows} />
            </article>
          </div>

          <div className="tools-grid">
            <article className="panel">
              <div className="panel-heading">
                <h2>Prepayment planner</h2>
                <span>{formatCurrency(calculations.interestSaved)} saved</span>
              </div>
              <InputControl label="Prepayment amount" field="prepaymentAmount" min={0} max={500000} step={5000} value={state.prepaymentAmount} suffix="" dispatchChange={dispatchChange} />
              <label className="inline-label">
                Frequency
                <select value={state.prepaymentFrequency} onChange={(event) => dispatchChange("prepaymentFrequency", event.target.value)}>
                  <option value="none">None</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="half-yearly">Half yearly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </label>
              <p className="result-line">{calculations.monthsSaved} months faster with {formatCurrency(calculations.schedule.totalPrepayment)} prepaid.</p>
            </article>

            <article className="panel">
              <div className="panel-heading">
                <h2>Rate comparison</h2>
                <span>{formatCurrency(calculations.compareEmi)} EMI</span>
              </div>
              <InputControl label="Compare rate" field="compareInterestRate" min={0} max={24} step={0.05} value={state.compareInterestRate} suffix="%" dispatchChange={dispatchChange} />
              <InputControl label="Compare tenure" field="compareTenureYears" min={1} max={30} step={1} value={state.compareTenureYears} suffix=" yr" dispatchChange={dispatchChange} />
              <p className="result-line">Difference: {formatCurrency(calculations.compareEmi - calculations.emi)} per month.</p>
            </article>

            <article className="panel">
              <div className="panel-heading">
                <h2>Floating rate shock</h2>
                <span>{formatCurrency(calculations.revisedEmi)} revised EMI</span>
              </div>
              <InputControl label="Change after" field="rateChangeAfterMonths" min={1} max={calculations.months} step={1} value={state.rateChangeAfterMonths} suffix=" mo" dispatchChange={dispatchChange} />
              <InputControl label="Revised rate" field="revisedInterestRate" min={0} max={24} step={0.05} value={state.revisedInterestRate} suffix="%" dispatchChange={dispatchChange} />
              <p className="result-line">Impact: {formatCurrency(calculations.revisedEmi - calculations.emi)} per month after change.</p>
            </article>

            <article className="panel">
              <div className="panel-heading">
                <h2>Affordability</h2>
                <span>{formatCurrency(calculations.eligibleLoan)}</span>
              </div>
              <InputControl label="Monthly income" field="monthlyIncome" min={10000} max={1000000} step={5000} value={state.monthlyIncome} suffix="" dispatchChange={dispatchChange} />
              <InputControl label="Existing EMI" field="existingEmi" min={0} max={300000} step={1000} value={state.existingEmi} suffix="" dispatchChange={dispatchChange} />
              <InputControl label="EMI ratio" field="eligibleEmiRatio" min={10} max={70} step={1} value={state.eligibleEmiRatio} suffix="%" dispatchChange={dispatchChange} />
            </article>
          </div>

          <article className="panel table-panel">
            <div className="panel-heading">
              <h2>Amortization schedule</h2>
              <div className="segmented">
                <button type="button" className={state.scheduleFilter === "yearly" ? "active" : ""} onClick={() => dispatchChange("scheduleFilter", "yearly")}>Yearly</button>
                <button type="button" className={state.scheduleFilter === "monthly" ? "active" : ""} onClick={() => dispatchChange("scheduleFilter", "monthly")}>Monthly</button>
                <button type="button" onClick={exportCsv}>CSV</button>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{state.scheduleFilter === "yearly" ? "Year" : "Month"}</th>
                    <th>Payment</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Prepay</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {calculations.visibleSchedule.map((row) => (
                    <tr key={row.year || row.number}>
                      <td>{row.year || row.label}</td>
                      <td>{formatCurrency(row.emi)}</td>
                      <td>{formatCurrency(row.principal)}</td>
                      <td>{formatCurrency(row.interest)}</td>
                      <td>{formatCurrency(row.prepayment)}</td>
                      <td>{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}

export default App;
