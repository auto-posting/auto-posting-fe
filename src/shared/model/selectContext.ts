import { createContext } from 'react';

export interface SelectContext {
  isToggle: boolean;
  toggle: () => void;
}

export const SelectContext = createContext<SelectContext | undefined>(undefined);
