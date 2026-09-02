export function formatMoney(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "$0.00";
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(n).toFixed(2)}`;
}

export function splitEqual(amount, ids) {
  const n = ids.length;
  if (!n) return {};
  const totalCents = Math.round(Number(amount) * 100);
  const baseCents = Math.floor(totalCents / n);
  let remainder = totalCents - baseCents * n;

  const shares = {};
  for (let i = 0; i < ids.length; i++) {
    const extra = remainder > 0 ? 1 : 0;
    if (remainder > 0) remainder -= 1;
    shares[ids[i]] = (baseCents + extra) / 100;
  }
  return shares;
}

export function percentsSumTo100(percents) {
  const values = Object.values(percents).map(Number);
  if (values.length === 0 || values.some((v) => !Number.isFinite(v) || v <= 0)) {
    return false;
  }
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.abs(sum - 100) < 0.01;
}

export function splitByPercent(amount, percents) {
  const entries = Object.entries(percents);
  if (!entries.length) return {};

  const totalCents = Math.round(Number(amount) * 100);
  const shares = {};
  let allocatedCents = 0;

  for (let i = 0; i < entries.length; i++) {
    const [id, pct] = entries[i];
    if (i === entries.length - 1) {
      shares[id] = (totalCents - allocatedCents) / 100;
    } else {
      const shareCents = Math.round((totalCents * Number(pct)) / 100);
      shares[id] = shareCents / 100;
      allocatedCents += shareCents;
    }
  }
  return shares;
}

export function sharesForExpense(expense) {
  if (expense.splitType === "percent" && expense.percents) {
    return splitByPercent(expense.amount, expense.percents);
  }
  return splitEqual(expense.amount, expense.splitWith);
}
