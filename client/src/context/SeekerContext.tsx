import { createContext, useEffect, useState } from "react"
import { toast } from "sonner";

interface SeekerContext {
  isModalInputOpen: boolean;
  isModalOpen: boolean;
  isAvailableModal: boolean;
  closeModal: () => void;
  openModal: () => void;
  openModalInput: () => void;
  closeModalInput: () => void;
  setIsAvailableModal: (value: boolean) => void
}

export const SeekerContext = createContext<SeekerContext>({
  isModalInputOpen: false,
  isModalOpen: false,
  isAvailableModal: false,
  closeModal() {
  },
  openModal() {
  },
  setIsAvailableModal() {
  },
  openModalInput() {
  },
  closeModalInput() {
  }
});

export const SeekerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalInputOpen, setIsModalInputOpen] = useState(false);
  const [isAvailableModal, setIsAvailableModal] = useState(true);
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isAvailableModal) return;
      if (e.ctrlKey) {
        if ((e.key === 'b' || e.key === 'B') || (e.key === 'f' || e.key === 'F')) {
          e.preventDefault();
          setIsModalOpen(!isModalOpen);
        }
      }
    }
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isModalOpen, isAvailableModal]);

  return <SeekerContext.Provider value={{
    isModalInputOpen,
    isAvailableModal,
    isModalOpen,
    closeModal() {
      setIsModalOpen(false)
    },
    openModal() {
      setIsModalOpen(true)
    },
    setIsAvailableModal(value) {
      setIsAvailableModal(value)
    },
    openModalInput() {
      setIsModalInputOpen(true)
    },
    closeModalInput() {
      setIsModalInputOpen(false)
    },
  }}>
    {children}
  </SeekerContext.Provider>
}
