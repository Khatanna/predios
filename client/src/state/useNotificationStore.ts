import { Property } from "../pages/PropertyPage/models/types";
import { User } from "../pages/UserPage/models/types";
import { create } from "zustand";

export type Notification = {
  id: string;
  title: string;
  from: User;
  to: User;
  property: Property;
  fieldName: string;
  read: boolean;
  timeAgo: string;
};

interface State {
  show: boolean
  unreadNotifications: number
}

interface Actions {
  onHide: () => void
  showPanel: () => void
  setUnreadNotifications: (unreadNotifications: number) => void
}

export const useNotificationStore = create<State & Actions>((set) => ({
  show: false,
  unreadNotifications: 0,
  onHide: () => set({ show: false }),
  setUnreadNotifications(unreadNotifications) {
    set({ unreadNotifications });
  },
  showPanel: () => set({ show: true }),
}));