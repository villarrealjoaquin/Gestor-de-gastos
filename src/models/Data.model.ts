export interface TransactionData {
  labels: string[];
  datasets: TransactionDataset[];
}

export interface TransactionDataset {
  data: number[];
  backgroundColor: string[];
  label: string;
  borderColor: string;
  borderWidth: number;
  hoverOffset: number;
}

export interface UpdateData {
  backgroundColors: string[];
  percentages: number[];
  labels: string[];
}