import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './PulseModal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  returnFocusRef: React.RefObject<HTMLElement | null>;
}

export const PulseModal = ({ isOpen, onClose, returnFocusRef }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<null | { type: 'success' | 'error', message: string }>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.elements.namedItem("email") as HTMLInputElement;

    if (!email.value || !email.value.includes("@")) {
      setFeedback({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    setFeedback({ type: "success", message: "Thanks! You've been subscribed." });
    email.value = "";
  };

  useEffect(() => {
    if (isOpen) {
      const previouslyFocused = document.activeElement as HTMLElement;
      firstInputRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
        if (e.key === 'Tab' && modalRef.current) {
          const focusable = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        (returnFocusRef.current || previouslyFocused)?.focus();
      };
    }
  }, [isOpen, onClose, returnFocusRef]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.backdrop}
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <motion.div
            ref={modalRef}
            className={styles.modal}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <h2 id="modal-title" className={styles.title}>Get early access to the good stuff</h2>
            <p id="modal-description" className={styles.description}>Only the things worth knowing. No spam, ever.</p>

            <form className={styles.form} onSubmit={handleSubmit}>
              <label htmlFor="email" className={styles.srOnly}>Seu e-mail</label>
              <input
                ref={firstInputRef}
                id="email"
                name="email" // essencial para e.currentTarget.elements funcionar
                type="email"
                placeholder="Email"
                className={styles.input}
                required
              />
              <button type="submit" className={styles.button}>
                Count me in
              </button>
            </form>

            {feedback && (
              <div
                className={feedback.type === 'success' ? styles.success : styles.error}
                role="alert"
                aria-live="polite"
              >
                {feedback.message}
              </div>
            )}

            <button
              onClick={onClose}
              aria-label="Close form"
              className={styles.close}
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
