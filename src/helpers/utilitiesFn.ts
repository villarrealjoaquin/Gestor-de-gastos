import { DataTupla, Transaction } from "@/models";

export const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  };
  return color;
};

export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });
};

export const addNewTransaction = (dataSet: DataTupla, transaction: Transaction) => {
  const [state, setState] = dataSet;
  const newTransaction = [...state, transaction];
  setState(newTransaction);
};

export const formatCurrentAndSetNumber = (newAmount: number) => {
  const formatAmount = formatCurrency(newAmount);
  const cleanedAmount = formatAmount.replace(/[^0-9.-]+/g, '');
  return parseFloat(cleanedAmount);
};