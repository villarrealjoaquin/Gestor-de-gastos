import { Transaction } from "@/models";

export const calculateTotal = (dataSet: Transaction[]) => {
  return dataSet.reduce((acc, curr) => acc + curr.amount, 0);
};

export const calculatePercentages = (dataSet: Transaction[], total: number) => {
  return dataSet.map(item => (item.amount / total) * 100);
};

export const mappedColors = (dataSet: Transaction[]) => {
  return dataSet.map(item => item.color);
};

export const mappedLabels = (dataSet: Transaction[]) => {
  return dataSet.map(item => item.fuente);
};

export const processTransactionData = (dataSet: Transaction[], total: number) => {
  const percentages = calculatePercentages(dataSet, total);
  const backgroundColors = mappedColors(dataSet);
  const labels = mappedLabels(dataSet);
  return { percentages, backgroundColors, labels };
};
