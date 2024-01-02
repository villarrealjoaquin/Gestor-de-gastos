import { expenses, income } from "@/constants";
import { TransactionType } from "@/models";

interface Props {
  handleTransactionTypeToggle: (transaction: TransactionType) => void;
  transactionType: TransactionType;
}

export default function ToggleButtonTransaction({ handleTransactionTypeToggle, transactionType }: Props) {
  return (
    <>
      <section className='flex gap-3 my-2'>
        <button
          className="btn"
          onClick={() => handleTransactionTypeToggle(expenses)}
          disabled={transactionType === expenses}
        >
          Gastos
        </button>
        <button
          className='btn'
          onClick={() => handleTransactionTypeToggle(income)}
          disabled={transactionType === income}
        >
          Ingresos
        </button>
      </section>
    </>
  )
}