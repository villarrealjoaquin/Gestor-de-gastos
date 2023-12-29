'use client';

import { useEffect, useRef, useState } from 'react';
import gastos from '../mock/gastos.json';
import ingresos from '../mock/ingresos.json';
import { Graphic, TransactionsList } from './components';
// import Categories from '../mock/categories.json';
import type { Data } from '@/models';

type Transaction = 'gastos' | 'ingresos';

const initialState = {
  datasets: [{
    data: [],
    backgroundColor: [],
  }]
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const expenses = 'gastos';
const income = 'ingresos';

export default function Home() {
  const [data, setData] = useState<Data>(initialState);
  const [transactionType, setTransactionType] = useState<Transaction>(expenses);
  const [balance, setBalance] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const myModalRef = useRef<HTMLDialogElement>(null);

  const calculatePercentages = () => {
    const buffer: number[] = [];
    const backgroundColors: string[] = [];
    const total = ingresos.ingresos.reduce((acc, curr) => {
      return acc += curr.monto;
    }, 0);

    setBalance(total);

    ingresos.ingresos.forEach(i => {
      const percentage = (i.monto / total) * 100;
      buffer.push(percentage);
      backgroundColors.push(getRandomColor());
    });

    setData(prevData => ({
      datasets: [{
        ...prevData.datasets[0],
        data: buffer,
        backgroundColor: backgroundColors,
      }],
    }));
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  }

  const handleSaveModalClick = () => {
    const updatedCategories = [...categories, category]
    setCategories(updatedCategories);
    myModalRef.current?.close();
  }

  const handleTransactionTypeToggle  = (transaction: Transaction) => {
    setTransactionType(transaction);
  }

  useEffect(() => {
    calculatePercentages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex flex-col gap-3 items-center min-h-screen justify-center">
      <h1 className='text-2xl font-bold'>Mi gestor de gastos</h1>
      <Graphic data={data} />
      <section className='font-bold'  >
        Mi Balance: <span>{balance}$</span>
      </section>

      <section className="bg-[#151515] w-[750px] py-1 px-2 rounded-lg">
        <article className="flex items-center justify-between gap-3 p-2">
          <h3 className='mx-2'>Mis categorias:</h3>
          <button className='btn' onClick={() => myModalRef.current?.showModal()}>Crear +</button>
        </article>
      </section>

      <dialog className='modal' ref={myModalRef}>
        <div className="modal-box flex flex-col ">
          <h3 className="font-bold text-lg text-center my-3">Agregar Gasto o Ingreso</h3>
          <form className='flex flex-col gap-4' >
            <label>Tipo</label>
            <select
              className="select select-ghost w-full max-w-xs"
              name=''
              onChange={handleCategoryChange }
              defaultValue={undefined}
            >
              <option disabled>Select the type</option>
              <option>Gasto</option>
              <option>Ingreso</option>
            </select>

            <label>Monto:</label>
            <input type="text" placeholder="" className="input input-ghost w-full max-w-xs" />

            <label htmlFor="categoria">Categoría:</label>
            <select
              className="select select-ghost w-full max-w-xs"
              defaultValue={undefined}
            >
              <option disabled>Select a category</option>
              <option>Svelte</option>
              <option>Vue</option>
              <option>React</option>
            </select>

            <article className="modal-action flex justify-center items-center">
              <button type="button" className="btn" onClick={() => myModalRef.current?.close()}>Cancelar</button>
              <button type="button" className="btn" onClick={handleSaveModalClick }>Guardar</button>
            </article>

          </form>
        </div>
      </dialog>

      <section className='overflow-y-auto'>
        <article>
          <ul className='flex gap-3 w-[750px] '>
            {categories.map((category) => (
              <li key={category}>
                <button className='btn'>{category}</button>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className='w-[750px]'>
        {
          transactionType === expenses
            ?
            <TransactionsList
              list={gastos.gastos}
              renderList={(gastos) => (
                <li key={gastos.categoria} className='flex justify-between gap-3'>
                  <p>{gastos.categoria}</p>
                  <p>{gastos.monto}$</p>
                </li>
              )}
            />
            :
            <TransactionsList
              list={ingresos.ingresos}
              renderList={(ingresos) => (
                <li key={ingresos.fuente} className='flex justify-between gap-3'>
                  <p>{ingresos.fuente}</p>
                  <p>{ingresos.monto}$</p>
                </li>
              )}
            />
        }


        {/* <ul className=''>
          {
            toggle === expenses
              ? gastos.gastos.map((g, i) => (
                <li key={i} className='flex justify-between gap-3'>
                  <p>{g.categoria}</p>
                  <p>{g.monto}$</p>
                </li>
              ))
              : ingresos.ingresos.map((g, i) => (
                <li key={i} className='flex justify-between gap-3'>
                  <p>{g.fuente}</p>
                  <p>{g.monto}$</p>
                </li>
              ))}
        </ul> */}
      </section>

      <section className='flex gap-3'>
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

    </main>
  )
}
