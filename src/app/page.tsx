'use client';

import type { Data, DataTupla, Transaction } from '@/models';
import { useEffect, useRef, useState } from 'react';
import { Graphic, TransactionsList } from './components';

type TransactionType = 'gastos' | 'ingresos';

const initialState = {
  labels: [],
  datasets: [{
    label: 'Ingresos',
    data: [],
    backgroundColor: [],
    borderColor: "white",
    borderWidth: 2,
    hoverOffset: 4,
  }]
};

const expenses = 'gastos';
const income = 'ingresos';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const calculateTotal = (dataSet: Transaction[]) => {
  return dataSet.reduce((acc, curr) => acc + curr.monto, 0);
};

const calculatePercentages = (dataSet: Transaction[], total: number) => {
  const percentages = dataSet.map(item => (item.monto / total) * 100);
  const backgroundColors = dataSet.map(item => item.color);
  const labels = dataSet.map(item => item.fuente);
  return { percentages, backgroundColors, labels };
};

const addTransaction = (dataSet: DataTupla, transaction: Transaction) => {
  const [state, setState] = dataSet;
  setState([...state, transaction]);
}

export default function Home() {
  const [data, setData] = useState<Data>(initialState);
  const [expensesData, setExpensesData] = useState<Transaction[]>([]);
  const [incomeData, setIncomeData] = useState<Transaction[]>([]);
  const [transactionType, setTransactionType] = useState<TransactionType>(income);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [transactionsCategories, setTransactionsCategories] = useState<string[]>([]);
  const myModalRef = useRef<HTMLDialogElement>(null);

  const calculateAndSetPercentages = () => {
    let dataSet = transactionType === income ? incomeData : expensesData;
    const total = calculateTotal(dataSet);
    const { percentages, backgroundColors, labels } = calculatePercentages(dataSet, total);

    setBalance(total);
    setData(prevData => ({
      labels,
      datasets: [{
        ...prevData.datasets[0],
        data: percentages,
        backgroundColor: backgroundColors,
      }],
    }));
  };

  const handleSaveModalClick = () => {
    const newColor = getRandomColor();
    const transactionDataSet: DataTupla = transactionType === income
      ? [incomeData, setIncomeData]
      : [expensesData, setExpensesData];

    const newTransaction: Transaction = {
      fuente: category,
      monto: amount,
      color: newColor,
      type: transactionType,
      categories: [category],
    };

    setTransactionsCategories(prevState => [...prevState, category]);
    addTransaction(transactionDataSet, newTransaction);
    myModalRef.current?.close();
  };

  const calculateBalance = () => {
    const incomeTotal = calculateTotal(incomeData);
    const expenseTotal = calculateTotal(expensesData);
    return incomeTotal - expenseTotal;
  }

  const handleTransactionTypeToggle = (transaction: TransactionType) => {
    setTransactionType(transaction);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amountValue = Number(e.target.value);
    setAmount(amountValue);
  };

  const handleCategoryCreation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const categoryValue = e.target.value;
    setCategory(categoryValue);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  useEffect(() => {
    calculateAndSetPercentages();
  }, [incomeData, expensesData, transactionType]);

  return (
    <main className="flex flex-col gap-3 items-center  min-h-screen py-3">
      <div className='bg-[#151515] w-[750px] rounded-lg flex flex-col justify-center items-center py-5'>
        <h1 className='text-2xl font-bold'>Gestor de gastos</h1>
        <section className='flex gap-3 my-2'>
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

        <section className='my-2 text-lg font-bold'>
          <p>Balance general: <span>{calculateBalance()}</span></p>
        </section>

        <Graphic data={data} />

        <section className="font-bold mt-2">
          Mis {transactionType}: <span>{balance} $</span>
        </section>
      </div>

      <section className="bg-[#151515] w-[750px] py-1 px-2 rounded-lg">
        <article className="flex items-center justify-between gap-3 p-2">
          <h3 className='mx-2 font-bold'>Mis {transactionType} :</h3>
          <button className='btn font-bold' onClick={() => myModalRef.current?.showModal()}>Crear +</button>
        </article>
      </section>

      <dialog className='modal' ref={myModalRef}>
        <div className="modal-box flex flex-col">
          <h3 className="font-bold text-lg text-center my-3">Agregar {transactionType}</h3>
          <form className='flex flex-col gap-4' onSubmit={(e) => e.preventDefault()}>
            <label>Monto:</label>
            <input
              type="number"
              placeholder="ej: 10"
              onChange={handleAmountChange}
              className="input input-ghost w-full max-w-xs"
            />
            <label>Crear categoria: </label>
            <input
              type="text"
              placeholder='ej: alquiler'
              className="input input-ghost w-full max-w-xs"
              onChange={handleCategoryCreation}
            />
            <label htmlFor="categoria">Categoría: </label>
            <select
              onChange={handleCategoryChange}
              className="select select-ghost w-full max-w-xs"
              name='category'
            >
              <option>Selecciona una categoria</option>
              {transactionsCategories.map((category, i) => (
                <option key={`${i} - ${category}`}>{category}</option>
              ))}
            </select>

            <article className="modal-action flex justify-center items-center">
              <button type="button" className="btn" onClick={() => myModalRef.current?.close()}>Cancelar</button>
              <button type="button" className="btn" onClick={handleSaveModalClick}>Guardar</button>
            </article>

          </form>
        </div>
      </dialog>

      <section className='overflow-y-auto w-[750px] h-[50px]'>
        <TransactionsList
          list={transactionType === expenses ? expensesData : incomeData}
          className='flex gap-3 items-center text-center'
          renderList={(item) => (
            <div className='flex'>
              <button
                key={item.fuente}
                className='btn font-bold text-white no-animation'
                style={{ backgroundColor: item.color }}
              >
                {item.categories}
              </button>
            </div>
          )}
          extractId={(item) => item.fuente}
        />
      </section>

      <section className="bg-[#151515] w-[750px]">
        <div className="rounded-lg p-4">
          <TransactionsList
            list={transactionType === expenses ? expensesData : incomeData}
            renderList={(item) => (
              <article className="flex justify-between items-center border-b border-gray-500 py-2">
                <div className='flex justify-center items-center gap-3'>
                  <div
                    className={`w-[15px] h-[15px] rounded-full`}
                    style={{ backgroundColor: `${item.color}` }}>
                  </div>
                  <p className="text-white text-center">{item.fuente}</p>
                </div>
                <p className={`text-${transactionType === expenses ? 'red' : 'green'}-500`}>{item.monto} $</p>
              </article>
            )}
            extractId={(item) => item.fuente}
          />
        </div>
      </section>

    </main>
  )
}
