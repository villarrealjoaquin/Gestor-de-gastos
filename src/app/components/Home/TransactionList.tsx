import { expenses } from "@/constants";
import type { Transaction, TransactionType } from "@/models";
import clsx from "clsx";
import { useRef, useState } from "react";
import { Loader, ModalTransaction } from "..";

interface Props {
  transactionList: Transaction[];
  transactionType: TransactionType;
  updateTransactionState: (newState: Transaction[]) => void;
}

export default function TransactionList({ transactionList, transactionType, updateTransactionState }: Props) {
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const modalOption = useRef<HTMLDialogElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleSelectTransaction = (fuente: string) => {
    modalOption.current?.showModal();
    setSelectedTransaction(fuente);
  };

  const confirmDeleteTransaction = () => {
    const transactionListIndex = transactionList.findIndex(
      transaction => transaction.fuente === selectedTransaction
    );

    if (transactionListIndex === -1) return;
    const deleteTransaction = transactionList.splice(0, transactionListIndex);
    updateTransactionState(deleteTransaction);
    cancelDeleteTransaction();
  };

  const cancelDeleteTransaction = () => {
    modalOption.current?.close();
    setSelectedTransaction(null);
  };

  return (
    <section className="bg-[#151515] w-[90%] sm:w-[550px] md:w-[750px] h-[225px] p-4 rounded-lg overflow-hidden">
      {transactionList.length > 0 ? (
        <section className="w-full overflow-y-auto h-[220px]">
          <table className="min-w-full table">
            <thead className="flex justify-between w-full sticky top-0 bg-[#151515]">
              <tr className="w-full">
                <th className="py-2">Fuente</th>
                <th className="py-2 text-right flex-grow">{transactionType === expenses ? 'Gastos' : 'Ingresos'}</th>
              </tr>
            </thead>
            <tbody className="">
              {transactionList.map((item) => (
                <tr key={item.fuente} className="flex justify-between items-center border-b border-gray-500">
                  <td className="py-2">
                    <div className="flex items-center gap-3">
                      <div
                        className='w-5 h-5 rounded-full'
                        style={{ backgroundColor: `${item.color}` }}
                      ></div>
                      <p className="text-white">{item.fuente}</p>
                    </div>
                  </td>
                  <td className={clsx('py-2 text-right', transactionType === expenses ? 'text-red-500' : 'text-green-500')}>
                    <div className="flex justify-center items-center gap-3">
                      <p>{item.amount} $</p>
                      <button className="text-white text-lg" onClick={() => handleSelectTransaction(item.fuente)}>...</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <article className="flex flex-col items-center">
          <Loader />
          <p className="font-bold mt-4">Todavía no hay {transactionType === expenses ? 'gastos' : 'ingresos'}</p>
        </article>
      )}

      <ModalTransaction ModalRef={modalOption}>
        <form className="flex flex-col gap-4 m-auto" onSubmit={handleSubmit}>
          <h3 className="font-bold text-lg text-center my-3">Gestionar Transacción</h3>

          <label htmlFor="amount">Monto:</label>
          <input
            type="number"
            id="amount"
            className="input input-ghost w-full max-w-xs input-bordered"
            placeholder="Nuevo monto"
          />

          <label htmlFor="category">Categoría:</label>
          <select
            id="category"
            className="select select-ghost w-full max-w-xs select-bordered"
          >
            <option value="">Selecciona una categoría</option>
          </select>

          <label>¿Estás seguro de eliminar esta transacción?</label>

          <article className="modal-action flex justify-center items-center">
            <button className="btn" onClick={cancelDeleteTransaction}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={() => { }}>
              Actualizar
            </button>
            <button className="btn btn-error" onClick={confirmDeleteTransaction}>
              Eliminar
            </button>
          </article>
        </form>
      </ModalTransaction>
    </section>
  );
}
