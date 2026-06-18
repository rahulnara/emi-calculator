export function clampNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function getTotalMonths(years, months = 0) {
  return Math.max(1, Math.round(clampNumber(years) * 12 + clampNumber(months)));
}

export function calculateEmi(principal, annualRate, months) {
  const loan = Math.max(0, clampNumber(principal));
  const tenure = Math.max(1, Math.round(clampNumber(months)));
  const monthlyRate = clampNumber(annualRate) / 12 / 100;

  if (monthlyRate === 0) {
    return loan / tenure;
  }

  const factor = Math.pow(1 + monthlyRate, tenure);
  return (loan * monthlyRate * factor) / (factor - 1);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(clampNumber(value));
}

export function formatNumber(value, digits = 0) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }).format(clampNumber(value));
}

function shouldPrepay(month, frequency) {
  if (frequency === "monthly") return true;
  if (frequency === "quarterly") return month % 3 === 0;
  if (frequency === "half-yearly") return month % 6 === 0;
  if (frequency === "yearly") return month % 12 === 0;
  return false;
}

export function buildSchedule({
  principal,
  annualRate,
  months,
  emi,
  prepaymentAmount = 0,
  prepaymentFrequency = "none",
  startMonth,
  startYear
}) {
  const monthlyRate = clampNumber(annualRate) / 12 / 100;
  const rows = [];
  let balance = Math.max(0, clampNumber(principal));
  let month = Math.max(1, Math.round(clampNumber(startMonth, 1)));
  let year = Math.max(1970, Math.round(clampNumber(startYear, new Date().getFullYear())));
  let totalInterest = 0;
  let totalPrepayment = 0;

  for (let index = 1; index <= months && balance > 0.5; index += 1) {
    const interest = balance * monthlyRate;
    const principalPaid = Math.min(Math.max(emi - interest, 0), balance);
    balance -= principalPaid;

    const prepayment =
      balance > 0 && shouldPrepay(index, prepaymentFrequency)
        ? Math.min(clampNumber(prepaymentAmount), balance)
        : 0;

    balance -= prepayment;
    totalInterest += interest;
    totalPrepayment += prepayment;

    rows.push({
      number: index,
      month,
      year,
      label: new Date(year, month - 1).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric"
      }),
      emi,
      interest,
      principal: principalPaid,
      prepayment,
      balance: Math.max(balance, 0)
    });

    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  return {
    rows,
    totalInterest,
    totalPrepayment,
    totalPayment: principal + totalInterest + totalPrepayment,
    payoffMonths: rows.length
  };
}

export function summarizeByYear(rows) {
  const map = new Map();

  rows.forEach((row) => {
    const current = map.get(row.year) || {
      year: row.year,
      emi: 0,
      interest: 0,
      principal: 0,
      prepayment: 0,
      balance: row.balance
    };

    current.emi += row.emi;
    current.interest += row.interest;
    current.principal += row.principal;
    current.prepayment += row.prepayment;
    current.balance = row.balance;
    map.set(row.year, current);
  });

  return Array.from(map.values());
}

export function calculateAffordability({ monthlyIncome, existingEmi, eligibleEmiRatio, annualRate, months }) {
  const usableEmi = Math.max(
    0,
    (clampNumber(monthlyIncome) * clampNumber(eligibleEmiRatio)) / 100 - clampNumber(existingEmi)
  );
  const monthlyRate = clampNumber(annualRate) / 12 / 100;
  const tenure = Math.max(1, clampNumber(months));

  if (monthlyRate === 0) {
    return usableEmi * tenure;
  }

  const factor = Math.pow(1 + monthlyRate, tenure);
  return (usableEmi * (factor - 1)) / (monthlyRate * factor);
}
