import { TransactionType } from "@/models";

interface Props {
  transactionType: TransactionType;
  balance: number;
}

export default function BalanceTransaction({ transactionType, balance }: Props) {
  return (
    <>
      <section className="font-bold mt-2">
        Mis {transactionType}: <span>$ {balance} </span>
      </section>
    </>
  )
}