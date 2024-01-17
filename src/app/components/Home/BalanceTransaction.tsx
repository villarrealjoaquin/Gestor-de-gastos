import { formatCurrency } from "@/helpers";
import type { TransactionType } from "@/models";

interface Props {
  transactionType: TransactionType;
  balance: number;
}

export default function BalanceTransaction({ transactionType, balance }: Props) {
  return (
    <section>
      <div className="font-bold flex items-center justify-center text-center gap-2 mt-2 animated" key={transactionType}>
        <p className="text-center">Mis {transactionType}:</p>
        <span className="text-center">{formatCurrency(balance)} ARS</span>
      </div>
    </section>
  );
}
