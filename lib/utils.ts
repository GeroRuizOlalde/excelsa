/**
 * Utilidades de precisión para Excelsa
 */

// 1. Redondeo contable a 2 decimales exactos
export const roundMoney = (amount: number | string): number => {
  const val = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(val)) return 0;
  return Math.round((val + Number.EPSILON) * 100) / 100;
};

// 2. Formateador de moneda oficial (Peso Argentino)
export const formatARS = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// 3. Sumar un array de valores con precisión
export const sumMoney = (items: number[]): number => {
  return items.reduce((acc, curr) => roundMoney(acc + curr), 0);
};