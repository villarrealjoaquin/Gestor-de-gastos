import { TransactionData } from "@/models";

export const expenses = 'gastos';
export const income = 'ingresos';

export const initialState: TransactionData = {
  labels: [],
  datasets: [{
    label: 'Ingresos',
    data: [],
    backgroundColor: [],
    borderColor: "white",
    borderWidth: 2,
    hoverOffset: 4,
  }]
};