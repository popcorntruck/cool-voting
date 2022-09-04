import React, { Fragment } from "react";
import { ModalController } from "./ui/ModalController";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiPlus, FiMinusCircle } from "react-icons/fi";

import dynamic from "next/dynamic";
import { createPollValidator } from "../shared/createPollValidator";
import { trpc } from "../utils/trpc";

interface PollModalProps {
  isOpen: boolean;
  requestClose: () => void;
}

const PollModalInner: React.FC<React.PropsWithChildren<PollModalProps>> = ({
  isOpen,
  requestClose,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createPollValidator),
    defaultValues: {
      question: "",
      options: [{ option: "" }, { option: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
    rules: {
      minLength: 2,
      maxLength: 4,
    },
  });

  const tctx = trpc.proxy.useContext();
  const { mutate, isLoading } = trpc.proxy.poll.create.useMutation({
    onSuccess: () => {
      tctx.poll.getMyPolls.refetch();

      reset();
      requestClose();
    },
  });

  return (
    <ModalController open={isOpen} onClose={() => requestClose()}>
      <h4>Create Poll</h4>

      <form
        className="mt-2"
        onSubmit={handleSubmit((d) => {
          mutate(d);
        })}
      >
        <div className="flex flex-col">
          <Input placeholder="Poll Question" {...register("question")} />
          <p className="text-red-400">{errors.question?.message?.toString()}</p>

          <div className="border-b border-zinc-700 mt-2 mb-1" />

          <div className="mt-1 flex flex-col ">
            <div className="flex justify-between">
              <p className="bold text-base">Options</p>
              <button
                onClick={() => {
                  if (fields.length >= 4) return;
                  append({
                    option: "",
                  });
                }}
                type="button"
              >
                <FiPlus size={24} />
              </button>
            </div>
            <div className="flex flex-col space-y-2 mt-1">
              {fields.map((field, index) => (
                <Fragment key={field.id}>
                  <div key={field.id} className="flex space-x-2 items-center">
                    <Input
                      key={field.id} // important to include key with field's id
                      placeholder={`Option ${index + 1}`}
                      {...register(`options.${index}.option`, {
                        required: true,
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (fields.length >= 3) {
                          remove(index);
                        }
                      }}
                    >
                      <FiMinusCircle size={24} />
                    </button>
                  </div>

                  {"options" in errors &&
                    errors.options![index] !== undefined && (
                      <p className="text-red-400">
                        {errors.options![index]?.option?.message}
                      </p>
                    )}
                </Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 flex space-x-2">
          <Button
            className="p-3 px-5"
            onClick={() => {
              reset();
              requestClose();
            }}
          >
            Cancel
          </Button>
          <Button
            color="secondary"
            className="px-5 p-3"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </ModalController>
  );
};

export const PollModal = dynamic(Promise.resolve(PollModalInner), {
  ssr: false,
});
