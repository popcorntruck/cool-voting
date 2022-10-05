import React from "react";
import { Button } from "./ui/Button";
import { ModalController } from "./ui/ModalController";
import { Spinner } from "./ui/Spinner";

interface ConfirmModalProps {
  isOpen: boolean;
  requestClose: () => void;
  onClickConfirm: () => void;
  confirmButtonLoading?: boolean;

  title: string;
  description: string;
}

export const ConfirmModal: React.FC<
  React.PropsWithChildren<ConfirmModalProps>
> = ({
  isOpen,
  requestClose,
  onClickConfirm,
  confirmButtonLoading = false,
  title,
  description,
}) => {
  return (
    <ModalController open={isOpen} onClose={() => requestClose()}>
      <h4>{title}</h4>

      <p>{description}</p>

      <div className="flex space-x-2 mt-1">
        <Button className="p-3 px-6" onClick={() => requestClose()}>
          No
        </Button>
        <Button
          color="transparent"
          className="bg-red-500 hover:bg-red-600 p-3 px-6"
          onClick={() => {
            onClickConfirm();
          }}
          disabled={confirmButtonLoading}
        >
          {confirmButtonLoading ? <Spinner size="4" /> : "Yes"}
        </Button>
      </div>
    </ModalController>
  );
};
