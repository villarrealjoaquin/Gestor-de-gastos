import { TransactionData } from "@/models";

export const expenses = 'gastos';
export const income = 'ingresos';

export const initialState: TransactionData = {
  labels: [],
  datasets: [{
    label: 'Transaccion',
    data: [],
    backgroundColor: [],
    borderColor: "white",
    borderWidth: 2,
    hoverOffset: 4,
  }]
} as const;