import { useContext } from 'react';
import LayoutContext from './LayoutContext.context';

export const useLayout = () => useContext(LayoutContext);
