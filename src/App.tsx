import { useRef, useState } from 'react';
import { PulseModal } from './components/PulseModal';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const openButtonRef = useRef<HTMLElement>(null); // ← AQUI MESMO

  return (
    <>
      <button
        ref={openButtonRef} // ← Passa aqui pro botão
        onClick={() => setIsOpen(true)}
      >
        Quero acesso antecipado
      </button>

      <PulseModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        returnFocusRef={openButtonRef} // ← E passa aqui pro modal
      />
    </>
  );
}

export default App;
