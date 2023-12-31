interface Props<T> {
  list: T[];
  renderList: (list: T) => React.ReactNode;
  extractId: (list: T) => string;
  className?: string;
}

export default function TransactionsList<T>({
  renderList,
  extractId,
  list,
  className,
}: Props<T>) {
  return (
    <ul className={className}>
      {list.map((item, i) => (
        <li key={`${i} - ${extractId(item)}`}>
          {renderList(item)}
        </li>
      ))}
    </ul>
  )
}