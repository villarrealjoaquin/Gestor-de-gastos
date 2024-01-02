export interface Transaction {
  fuente: string;
  amount: number;
  color: string;
  type: string;
  category: string;
}

export interface Categories {
  category: string;
  color: string;
}

export interface DataSetTransaction {
  data: Transaction[];
  setData: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

export type TransactionType = 'gastos' | 'ingresos';

export type DataTupla = [Transaction[], React.Dispatch<React.SetStateAction<Transaction[]>>] 