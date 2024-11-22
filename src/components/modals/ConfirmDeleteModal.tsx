"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="top-center"
      className="rounded-lg"
    >
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="text-lg font-bold text-center">
              Confirm Delete
            </ModalHeader>
            <ModalBody>
              <p className="text-gray-500 text-left">
                Are you sure you want to delete this file? This action cannot be
                undone.
              </p>
            </ModalBody>
            <ModalFooter className="flex">
              <Button
                color="default"
                variant="light"
                onPress={onCloseModal}
                className="hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                color="danger"
                variant="solid"
                onPress={() => {
                  onConfirm();
                  onCloseModal();
                }}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
