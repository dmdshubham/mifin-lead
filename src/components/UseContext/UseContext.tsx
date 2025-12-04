import React, { createContext } from "react";

export const SidebarState = createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export const mobileSidebar = createContext<{
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
} | null>(null);
