export interface Transaction {
  fuente: string;
  monto: number;
  color: string;
  categories: string[];
  type: string;
}

export interface Categories {
  category: string;
  color: string;
}

export interface DataSetTransaction {
  data: Transaction[];
  setData: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

export type DataTupla = [Transaction[], React.Dispatch<React.SetStateAction<Transaction[]>>] 