interface Props<T> {
  list: T[];
  renderList: (list: T) => React.ReactNode;
}

export default function TransactionsList<T>({ list, renderList }: Props<T>) {
  return (
    <>
      <ul>
        {list.map(renderList)}
      </ul>
    </>
  )
}