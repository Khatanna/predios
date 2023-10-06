import { create } from 'zustand';
import { SubDirectory } from '../../SubDirectoryPage/models/types';

interface State {
  subdirectories: Pick<SubDirectory, 'name'>[]
  previousSubdirectories: Pick<SubDirectory, 'name'>[]
}

interface Actions {
  setSubdirectories: (subdirectories: Pick<SubDirectory, 'name'>[]) => void
  addSubdirectory: (subdirectory: Pick<SubDirectory, 'name'>) => void
  deleteSubdirectory: (data: { name: string }) => void
  updateSubdirectory: (data: { currentName: string, newName: string }) => void
  rollback: () => void
}

const initialState: State = {
  subdirectories: [],
  previousSubdirectories: []
}

export const useSubdirectoryStore = create<State & Actions>((set) => ({
  ...initialState,
  setSubdirectories(subdirectories) {
    set({ subdirectories, previousSubdirectories: subdirectories })
  },
  addSubdirectory(subdirectory) {
    set(s => ({ subdirectories: [...s.subdirectories, subdirectory], previousSubdirectories: s.subdirectories }))
  },
  updateSubdirectory({ currentName, newName }) {
    set(s => ({ subdirectories: s.subdirectories.map(subdirectory => subdirectory.name === currentName ? { name: newName } : subdirectory) }))
  },
  deleteSubdirectory({ name }) {
    set(s => ({
      subdirectories: s.subdirectories.filter(subdirectory => subdirectory.name !== name)
    }))
  },
  rollback() {
    set(s => ({
      subdirectories: s.previousSubdirectories,
      previousSubdirectories: []
    }))
  },
}))