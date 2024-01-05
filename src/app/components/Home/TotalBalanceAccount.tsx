import { ReactNode } from "react";

export default function TotalBalanceAccount({ calculateTotalBalance }: { calculateTotalBalance: () => ReactNode }) {
  const total = calculateTotalBalance();

  return (
    <>
      <section className='my-2 text-lg font-bold'>
        {Boolean(total) ? (
          <p className="text-center">Balance general: <span>{total} ARS</span></p>
        ) : (
          <p className="text-center">No hay balance disponible actualmente</p>
        )}
      </section>
    </>
  )
}