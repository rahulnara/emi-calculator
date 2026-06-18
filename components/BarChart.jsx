import React from "react";
import { formatCurrency } from "../utils/emiCalculator.js";

export function BarChart({ rows }) {
  const visibleRows = rows.slice(0, 12);
  const maxValue = Math.max(...visibleRows.map((row) => row.principal + row.interest + row.prepayment), 1);

  return (
    <div className="bar-chart" aria-label="Year wise repayment chart">
      {visibleRows.map((row) => {
        const principalHeight = `${Math.max(5, (row.principal / maxValue) * 100)}%`;
        const interestHeight = `${Math.max(5, (row.interest / maxValue) * 100)}%`;
        const prepayHeight = `${row.prepayment ? Math.max(4, (row.prepayment / maxValue) * 100) : 0}%`;

        return (
          <div className="bar-column" key={row.year || row.number} title={formatCurrency(row.principal + row.interest + row.prepayment)}>
            <div className="bar-stack">
              <span className="prepay" style={{ height: prepayHeight }} />
              <span className="interest" style={{ height: interestHeight }} />
              <span className="principal" style={{ height: principalHeight }} />
            </div>
            <small>{row.year || row.label}</small>
          </div>
        );
      })}
    </div>
  );
}
