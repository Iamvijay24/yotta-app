// shared/contexts/LayoutContext.jsx (new file)
import LayoutContext from './LayoutContext.context';

export const LayoutProvider = ({ children, value }) => (
  <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
);
