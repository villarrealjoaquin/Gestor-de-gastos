'use client';

import { useEffect, useState } from 'react';
import gastos from '../mock/gastos.json';
import ingresos from '../mock/ingresos.json';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

export interface Data {
  datasets: Dataset[];
}

export interface Dataset {
  data: number[];
  backgroundColor: string[];
}

ChartJS.register(ArcElement, Tooltip, Legend);

const initialState = {
  datasets: [{
    data: [],
    backgroundColor: [],
  }]
}

const options = {
  responsive: true,
}

export default function Home() {
  const [data, setData] = useState<Data>(initialState);
  const [toggle, setToggle] = useState<Boolean>(false);
  const [balance, setBalance] = useState<number>(0);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const calculatePorcentaje = () => {
    const buffer: number[] = [];
    const backgroundColors: string[] = [];
    const total = ingresos.ingresos.reduce((acc, curr) => {
      return acc += curr.monto;
    }, 0);

    setBalance(total);

    ingresos.ingresos.forEach(i => {
      const percentage = (i.monto / total) * 100;
      buffer.push(percentage);
      backgroundColors.push(getRandomColor())
    })

    setData(prevData => ({
      datasets: [{
        ...prevData.datasets[0],
        data: buffer,
        backgroundColor: backgroundColors,
      }]
    }));
  }

  const handleToggleClick = () => {
    setToggle(!toggle);
  }

  useEffect(() => {
    calculatePorcentaje();
  }, []);

  return (
    <main className="flex flex-col gap-3 items-center min-h-screen justify-center">
      <h1 className='text-2xl'>Mi gestor de gastos</h1>
      <article className='w-[350px] h-[350px]'>
        <Pie
          data={data}
          options={options}
        />
      </article>

      <section>
        Mi Balance: <span>{balance}</span>
      </section>

      <section className="bg-[#151515] w-[40%] py-1 px-2">
        <article className="flex items-center justify-between gap-3 p-2">
          <h3>Mis categorias:</h3>
          <button className="font-bold bg-[gray] py-1 px-3 rounded-full">Crear categoria +</button>
        </article>
      </section>

      <section className='w-[40%]'>
        <ul className='h-56'>
          {
            toggle
              ? gastos.gastos.map((g, i) => (
                <li key={i} className='flex justify-between'>
                  <p>{g.categoria}</p>
                  <p>{g.monto}$</p>
                </li>
              ))
              : ingresos.ingresos.map((g, i) => (
                <li key={i} className='flex justify-between'>
                  <p>{g.fuente}</p>
                  <p>{g.monto}$</p>
                </li>
              ))}
        </ul>
      </section>

      <section className='flex gap-3'>
        <button
          className='bg-[violet] py-1 px-3 rounded-full'
          onClick={handleToggleClick}
        >
          Gastos
        </button>
        <button
          className='bg-[violet] py-1 px-3 rounded-full'
          onClick={handleToggleClick}
        >
          Ingresos
        </button>
      </section>
    </main>
  )
}
