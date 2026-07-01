const formatter = new Intl.NumberFormat('es-PY', {
  maximumFractionDigits: 0,
  useGrouping: true,
});

export function formatCurrency(amount) {
  return `Gs. ${formatter.format(amount)}`;
}
