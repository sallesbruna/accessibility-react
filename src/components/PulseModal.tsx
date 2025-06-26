import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './PulseModal.module.css';

// 🟢 AQUI: atualiza a tipagem
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  returnFocusRef: React.RefObject<HTMLElement | null>; // aqui!
}

export const PulseModal = ({ isOpen, onClose, returnFocusRef }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

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
            <h2 id="modal-title" className={styles.title}>Quero acesso antecipado</h2>
            <p id="modal-description" className={styles.description}>No spam. Just secret experiences.</p>
          <form className={styles.form} onSubmit={(e) => {
              e.preventDefault();
              // Lógica de envio aqui
            }}>
              <label htmlFor="email" className={styles.srOnly}>Seu e-mail</label>
              <input
                ref={firstInputRef}
                id="email"
                type="email"
                placeholder="Email"
                className={styles.input}
                required
              />
              <button type="submit" className={styles.button}>
                Inscrever-se
              </button>
            </form>
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