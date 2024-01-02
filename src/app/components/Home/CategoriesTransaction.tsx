import { Transaction } from "@/models";
import { ItemList } from "..";

interface Props {
  transactionList: Transaction[];
}

export default function CategoriesTransaction({ transactionList }: Props) {
  return (
    <>
      <section className='overflow-y-auto w-[90%] h-14 text-center sm:w-[550px] sm:h-12 md:w-[750px]'>
        {transactionList.length > 0 ? (
          <ItemList
            list={transactionList}
            className='flex gap-3 items-center text-center'
            renderList={(item) => (
              <article className='flex'>
                <button
                  key={item.fuente}
                  className='btn font-bold text-white no-animation'
                  style={{ backgroundColor: item.color }}
                >
                  {item.category}
                </button>
              </article>
            )}
            extractId={(item) => item.fuente}
          />
        ) : (
          <article className='flex items-center h-12'>
            <p className='text-[.75rem] sm:text-sm text-center font-bold'>Empieza creando tus categorías y registrando tus transacciones para llevar un mejor control de tus gastos.</p>
          </article>
        )}
      </section>
    </>
  )
}