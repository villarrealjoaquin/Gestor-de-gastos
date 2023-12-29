import { Pie } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import type { Data } from "@/models/Data.model";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
}

export default function Graphic({data} :{data: Data}) {
  return (
    <>
      <article className='w-[350px] h-[350px]'>
        <Pie
          data={data}
          options={options}
        />
      </article>
    </>
  )
}