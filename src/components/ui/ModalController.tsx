import React, { Children, Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { AiOutlinePlus } from "react-icons/ai";

type ModalControllerProps = React.PropsWithChildren<
  Parameters<typeof Dialog>[0]
>;

export const ModalController: React.FC<ModalControllerProps> = ({
  open,
  onClose,
  children,
}) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose} open={open}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity backdrop-filter backdrop-blur-[2px]" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-zinc-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                <div className={`flex flex-col w-full p-5`}>
                  <div className={`flex justify-end absolute right-3 top-3`}>
                    <button
                      className={`p-1 text-primary-100`}
                      onClick={(e) => onClose(true)}
                      data-testid="close-modal"
                    >
                      <AiOutlinePlus
                        className={`transform rotate-45`}
                        size={24}
                      />
                    </button>
                  </div>
                  <div tabIndex={-1} className={`focus:outline-none`}>
                    {children}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
