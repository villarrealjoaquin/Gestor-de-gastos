import { expenses } from "@/constants";
import { formatCurrency } from "@/helpers";
import type { Transaction, TransactionType } from "@/models";
import clsx from "clsx";
import { useRef, useState } from "react";
import { Loader, ModalTransaction } from "..";
import { toast } from "sonner";

interface Props {
  transactionList: Transaction[];
  transactionType: TransactionType;
  updateTransactionState: (newState: Transaction[]) => void;
}

const ACTIONS = {
  DELETE: 'delete',
  UPDATE: 'update',
} as const;

type ActionType = typeof ACTIONS[keyof typeof ACTIONS];

export default function TransactionList({
  transactionList,
  transactionType,
  updateTransactionState,
}: Props) {
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
  const [newAmount, setNewAmount] = useState(0);
  const [showActions, setShowActions] = useState(true);
  const modalOption = useRef<HTMLDialogElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleSelectTransaction = (fuente: string) => {
    modalOption.current?.showModal();
    setSelectedTransaction(fuente);
    setSelectedAction(null);
  };

  const confirmDeleteTransaction = () => {
    const updatedTransactionList = transactionList.filter(
      transaction => transaction.fuente !== selectedTransaction
    );
    updateTransactionState(updatedTransactionList);
    cancelDeleteTransaction();
    toast.success('se elimino la transaccion correctamente!');
  };

  const selectActionFromModal = (action: ActionType) => {
    setSelectedAction(action);
    setShowActions(false);
  };

  const updateTransactionFromModal = () => {
    const modifyTransaction = transactionList.map((transaction) =>
      transaction.fuente === selectedTransaction
        ? { ...transaction, amount: newAmount }
        : transaction
    );

    updateTransactionState(modifyTransaction);
    cancelDeleteTransaction();
    toast.success('se modifico el monto correctamente!');
  };

  const cancelDeleteTransaction = () => {
    modalOption.current?.close();
    setShowActions(true);
    setSelectedTransaction(null);
    setNewAmount(0);
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
            <tbody>
              {transactionList.map((item) => (
                <tr key={item.fuente} className="flex justify-between items-center border-b border-gray-500">
                  <td className="py-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={clsx('w-5 h-5 rounded-full')}
                        style={{ backgroundColor: `${item.color}` }}
                      ></div>
                      <p className="text-white">{item.fuente}</p>
                    </div>
                  </td>
                  <td className={clsx('py-2 text-right', transactionType === expenses ? 'text-red-500' : 'text-green-500')}>
                    <div className="flex justify-center items-center gap-3 animated">
                      <p>{formatCurrency(item.amount)}</p>
                      <button className="text-white text-lg" onClick={() => handleSelectTransaction(item.fuente)}>...</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <article className="flex flex-col justify-center items-center h-[200px]">
          <Loader />
          <p className="font-bold mt-4">Todavía no hay {transactionType === expenses ? 'gastos' : 'ingresos'}</p>
        </article>
      )}

      <ModalTransaction ModalRef={modalOption}>
        <form className="flex flex-col gap-4 m-auto" onSubmit={handleSubmit}>
          <h3 className="font-bold text-lg text-center my-3">Gestionar Transacción</h3>

          {showActions && (
            <>
              <h4 className="text-center font-bold">Que accion te gustaria tomar?</h4>
              <div className="flex justify-center gap-4">
                <button className="btn" onClick={cancelDeleteTransaction}>
                  cancelar
                </button>
                <button className="btn" onClick={() => selectActionFromModal(ACTIONS.UPDATE)}>
                  Actualizar Monto
                </button>
                <button className="btn btn-error" onClick={() => selectActionFromModal(ACTIONS.DELETE)}>
                  Eliminar Transacción
                </button>
              </div>
            </>
          )}

          {selectedAction === ACTIONS.DELETE && (
            <>
              <label>¿Estás seguro de eliminar esta transacción?</label>
              <div className="flex gap-2 m-auto">
                <button className="btn" onClick={cancelDeleteTransaction}>
                  Cancelar
                </button>
                <button className="btn btn-error" onClick={confirmDeleteTransaction}>
                  Eliminar
                </button>
              </div>
            </>
          )}

          {selectedAction === ACTIONS.UPDATE && (
            <>
              <label htmlFor="amount">Monto:</label>
              <input
                type="number"
                id="amount"
                className="input input-ghost w-full max-w-xs input-bordered"
                placeholder="Nuevo monto"
                onChange={(e) => setNewAmount(Number(e.target.value))}
              />

              <div className="flex gap-2 m-auto">
                <button className="btn" onClick={cancelDeleteTransaction}>
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={updateTransactionFromModal}>
                  actualizar
                </button>
              </div>
            </>
          )}

        </form>
      </ModalTransaction>
    </section>
  );
}
