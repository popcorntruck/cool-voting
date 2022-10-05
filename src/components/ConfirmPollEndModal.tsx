import React from "react";
import { Button } from "./ui/Button";
import { ModalController } from "./ui/ModalController";
import { Spinner } from "./ui/Spinner";

interface ConfirmPollEndModalProps {
  isOpen: boolean;
  requestClose: () => void;

  onClickConfirm: () => void;

  confirmButtonLoading: boolean;
}

export const ConfirmPollEndModal: React.FC<
  React.PropsWithChildren<ConfirmPollEndModalProps>
> = ({ isOpen, requestClose, onClickConfirm, confirmButtonLoading }) => {
  return (
    <ModalController open={isOpen} onClose={() => requestClose()}>
      <h4>End Poll</h4>

      <p>Are you sure you want to end this poll?</p>

      <div className="flex space-x-2 mt-1">
        <Button
          color="transparent"
          className="bg-zinc-700 hover:bg-zinc-600 p-3 px-6"
          onClick={() => requestClose()}
        >
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
