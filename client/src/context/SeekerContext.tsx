import { createContext, useEffect, useState } from "react"

interface SeekerContext {
  isModalOpen: boolean;
  closeModal: () => void;
  openModal: () => void;
}

export const SeekerContext = createContext<SeekerContext>({
  isModalOpen: false,
  closeModal() {
  },
  openModal() {
  },
});

export const SeekerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
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
  }, [isModalOpen]);

  return <SeekerContext.Provider value={{
    isModalOpen,
    closeModal() {
      setIsModalOpen(false)
    },
    openModal() {
      setIsModalOpen(true)
    },
  }}>
    {children}
  </SeekerContext.Provider>
}
