import { ReactNode } from "react";

export default function GraphicDataContainer({ children }: { children: ReactNode }) {
  return (
    <section className='bg-[#151515] w-[90%] sm:w-[550px] md:w-[750px] rounded-lg flex flex-col justify-center items-center py-5'>
      <header>
        <h1 className='text-2xl font-bold'>Gestor de gastos</h1>
      </header>
      {children}
    </section>
  )
}