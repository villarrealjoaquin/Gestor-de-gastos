import { Coin } from ".";

export default function Coins() {
  return (
    <>
      <article>
        <div className="flex justify-center">
          <Coin />
        </div>
        <div className="flex gap-3">
          <Coin />
          <Coin />
        </div>
      </article>
    </>
  )
}