import type { TransactionType } from "@/models"
import { ModalTransaction } from "..";
import clsx from "clsx";
import { useRef } from "react";

interface Props {
  transactionType: TransactionType;
  category: string;
  error: string;
  amount: number | null;
  transactionsCategories: string[];
  onHandleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onHandleCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onHandleCategoryCreation: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onHandleTransactionSave: (ref: React.RefObject<HTMLDialogElement>) => void;
}

export default function TransactionSection({
  transactionType,
  category,
  amount,
  transactionsCategories,
  error,
  onHandleAmountChange,
  onHandleCategoryCreation,
  onHandleTransactionSave,
  onHandleCategoryChange,
}: Props) {
  const myModalCategoryRef = useRef<HTMLDialogElement>(null);
  const myModalCreateCategoryRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <section className="bg-[#151515] w-[90%] sm:w-[550px] md:w-[750px] py-1 px-2 rounded-lg">
        <article className="flex flex-col items-center justify-between gap-3 p-2 w-full sm:flex-row">
          <h2 className='mx-2 font-bold text-[.9rem] animated' key={transactionType}>Mis {transactionType}</h2>
          <article className='flex gap-3 flex-col sm:flex-row'>
            <button
              className='btn font-bold'
              onClick={() => myModalCreateCategoryRef.current?.showModal()}
              disabled={transactionsCategories?.length === 0}
            >
              Categorias
            </button>
            <button
              className='btn font-bold'
              onClick={() => myModalCategoryRef.current?.showModal()}
            >
              Crear +
            </button>
          </article>
        </article>
      </section>

      <ModalTransaction ModalRef={myModalCategoryRef}>
        <h3 className="font-bold text-lg text-center my-3">Agregar {transactionType}</h3>
        <form className='flex flex-col gap-4 m-auto' onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="monto">Monto:</label>
          <input
            type="number"
            className="input input-ghost w-full max-w-xs input-bordered"
            value={amount !== null ? amount.toString() : ''}
            placeholder="ej: 10"
            onChange={onHandleAmountChange}
          />
          <label>Crear categoria: </label>
          <input
            type="text"
            placeholder='ej: alquiler'
            className="input input-ghost w-full max-w-xs input-bordered"
            value={category}
            onChange={onHandleCategoryCreation}
          />
          {error && <p className="text-[red] text-sm">{error}</p>}
          <article className="modal-action flex justify-center items-center">
            <button type="button" className="btn" onClick={() => myModalCategoryRef.current?.close()}>Cancelar</button>
            <button type="button" className="btn btn-primary" onClick={() => onHandleTransactionSave(myModalCategoryRef)}>Guardar</button>
          </article>
        </form>
      </ModalTransaction>

      <ModalTransaction ModalRef={myModalCreateCategoryRef}>
        <h3 className="font-bold text-lg text-center my-3">Agregar {transactionType}</h3>
        <form className='flex flex-col gap-4 m-auto' onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="number">Monto:</label>
          <input
            id="monto"
            type="number"
            placeholder="ej: 10"
            value={amount !== null ? amount.toString() : ''}
            className="input input-ghost w-full max-w-xs input-bordered"
            onChange={onHandleAmountChange}
          />
          {error && <p className="text-[red] text-sm">{error}</p>}
          <label htmlFor="categories">Categoría: </label>
          <select
            id="categories"
            onChange={onHandleCategoryChange}
            className={clsx('select select-ghost w-full max-w-x sselect-bordered', transactionsCategories?.length < 1 && 'opacity-50 cursor-not-allowed')}
            disabled={transactionsCategories?.length < 1}
            value={category}
          >
            <option>Selecciona una categoria</option>
            {transactionsCategories?.map((category, i) => (
              <option key={`${i} - ${category}`}>{category}</option>
            ))}
          </select>
          <article className="modal-action flex justify-center items-center">
            <button type="button" className="btn" onClick={() => myModalCreateCategoryRef.current?.close()}>Cancelar</button>
            <button type="button" className="btn btn-primary" onClick={() => onHandleTransactionSave(myModalCreateCategoryRef)}>Guardar</button>
          </article>
        </form>
      </ModalTransaction>
    </>
  )
}