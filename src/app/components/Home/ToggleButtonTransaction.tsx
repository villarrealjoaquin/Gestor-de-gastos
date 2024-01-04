import { expenses, income } from "@/constants";
import type { TransactionType } from "@/models";

interface Props {
  onHandleTransactionTypeToggle: (transaction: TransactionType) => void;
  transactionType: TransactionType;
}

export default function ToggleButtonTransaction({ onHandleTransactionTypeToggle, transactionType }: Props) {
  return (
    <>
      <section className='flex gap-3 my-2'>
        <button
          className="btn"
          onClick={() => onHandleTransactionTypeToggle(expenses)}
          disabled={transactionType === expenses}
        >
          Gastos
        </button>
        <button
          className='btn'
          onClick={() => onHandleTransactionTypeToggle(income)}
          disabled={transactionType === income}
        >
          Ingresos
        </button>
      </section>
    </>
  )
}