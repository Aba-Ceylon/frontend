"use client";

import Modal from "@/components/ui/Modal";
import FeedbackForm from "@/features/feedback/FeedbackForm";

interface FeedbackModalProps {
  onClose: () => void;
}

export default function FeedbackModal({ onClose }: FeedbackModalProps) {
  return (
    <Modal isOpen onClose={onClose} maxWidth="max-w-4xl">
      <FeedbackForm />
    </Modal>
  );
}
