import { ReactNode } from "react";

interface Props {
  ModalRef: React.RefObject<HTMLDialogElement>;
  children: ReactNode;
}

export default function ModalTransaction({ ModalRef, children }: Props) {
  return (
    <>
      <dialog className='modal' ref={ModalRef}>
        <div className="modal-box flex flex-col">
          {children}
        </div>
      </dialog>
    </>
  )
}