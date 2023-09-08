import { create, StateCreator } from 'zustand';
// import { immer } from 'zustand/middleware/immer';
import { devtools, persist } from 'zustand/middleware';
import { TableColumn } from 'react-data-table-component';
import { User } from '../pages/User/models/types';
import { StateCell } from '../components/StateCell';
import { DropdownMenu } from '../pages/User/components/DropdownMenu';
import serialize from 'serialize-javascript';

interface State {
  columns: TableColumn<User>[]
  columnFunctions: Record<string, string>;
}

interface Actions {
  setOrder: (newOrder: TableColumn<User>[]) => void;
}

const middlewares = (f: StateCreator<State & Actions>) => devtools(persist(f, { name: 'orderColumn' }));

const initialState: State = {

  columnFunctions: {}
}

export const useColumnOrder = create(middlewares((set) => ({
  ...initialState,
  setOrder(newOrder) {
    // const serializeFunction = serialize(newOrder.filter(c => typeof c === 'function'))
    console.log(newOrder)
    console.log(newOrder.flatMap(c => {
      for (const item in c) {
        if (typeof c[item] === 'function') {
          return c[item];
        }
      }
      return []
    }).map(serialize))
    // console.log(serializeFunction);
    // set(() => ({
    //   columns: newOrder
    // }))
  },
})))
