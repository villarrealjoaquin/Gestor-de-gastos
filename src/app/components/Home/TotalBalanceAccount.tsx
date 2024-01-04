import { ReactNode } from "react";

export default function TotalBalanceAccount({ calculateTotalBalance }: { calculateTotalBalance: () => ReactNode }) {
  return (
    <>
      <section className='my-2 text-lg font-bold'>
        {Boolean(calculateTotalBalance()) ? (
          <p className="text-center">Balance general: <span>{calculateTotalBalance()} ARS</span></p>
        ) : (
          <p className="text-center">No hay balance disponible actualmente</p>
        )}
      </section>
    </>
  )
}