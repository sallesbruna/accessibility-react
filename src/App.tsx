import { useRef, useState } from 'react';
import { PulseModal } from './components/PulseModal';
import './index.css';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const openButtonRef = useRef<HTMLElement>(null); // ← AQUI MESMO

return (
  <div className="container">
    <button
      ref={openButtonRef}
      onClick={() => setIsOpen(true)}
      className="open-button"
    >
      The Good Stuff
    </button>

    <PulseModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      returnFocusRef={openButtonRef}
    />
  </div>
);
}

export default App;
