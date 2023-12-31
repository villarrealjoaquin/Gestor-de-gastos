import type { Data } from "@/models/Data.model";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Coins } from ".";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
}

export default function Graphic({ data }: { data: Data }) {
  return (
    <>
      <article className='relative w-[350px] h-[350px] flex justify-center items-center'>
        {data.labels.length > 0
          ? <Doughnut
            data={data}
            options={options}
          />
          : <Coins />}
      </article>
    </>
  )
}