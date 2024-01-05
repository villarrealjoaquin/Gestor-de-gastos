import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Coins } from "..";
import type { TransactionData } from "@/models";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
}

export default function Graphic({ data }: { data: TransactionData }) {
  return (
    <>
      <section className='relative w-[280px] h-[280px] flex justify-center items-center sm:w-[350px] sm:h-[320px]'>
        {data.datasets[0].data.length > 0
          ? <Doughnut
            data={data}
            options={options}
          />
          : (
            <article className="flex flex-col justify-center items-center gap-5">
              <Coins />
              <p className="font-bold text-center text-sm w-[80%]">¡Hola! Parece que aún no has comenzado a utilizar la aplicación.</p>
            </article>
          )}
      </section>
    </>
  )
}