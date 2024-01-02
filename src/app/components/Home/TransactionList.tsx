import { expenses } from "@/constants";
import { ItemList, Loader } from "..";
import { Transaction, TransactionType } from "@/models";
import clsx from "clsx";

interface Props {
  transactionList: Transaction[];
  transactionType: TransactionType;
}

export default function TransactionList({ transactionList, transactionType }: Props) {
  return (
    <>
      <section className="bg-[#151515] w-[90%] sm:w-[550px] md:w-[750px] h-[200px]">
        {transactionList.length > 0
          ? <div className="rounded-lg p-4">
            <ItemList
              list={transactionList}
              renderList={(item) => (
                <article className="flex justify-between items-center border-b border-gray-500 py-2">
                  <div className='flex justify-center items-center gap-3'>
                    <div className={`w-[15px] h-[15px] rounded-full`} style={{ backgroundColor: `${item.color}` }}>
                    </div>
                    <p className="text-white text-center">{item.fuente}</p>
                  </div>
                  <p className={clsx('text-', transactionType === expenses ? 'red' : 'green', '-500')}>{item.amount} $</p>
                </article>
              )}
              extractId={(item) => item.fuente}
            />
          </div>
          : (
            <article className='flex flex-col justify-center items-center'>
              <Loader />
              <p className='font-bold'>Todavia no hay {transactionType}</p>
            </article>
          )}
      </section>
    </>
  )
}