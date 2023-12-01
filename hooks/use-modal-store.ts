import { ServerWithMembersWithProfiles } from "@/types";
import { create } from "zustand";

export type ModalType = "createServer" | "invite";

interface ModalData {
    server?: ServerWithMembersWithProfiles;
}

interface ModalStore {
    type: ModalType | null;
    isOpen: boolean;
    data: ModalData;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    onClose: () => set({ type: null, isOpen: false }),
}));
