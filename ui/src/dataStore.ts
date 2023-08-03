import { createContext, useState, FunctionComponent } from 'react';

export const StoreContext = createContext('null');

export default ({ children }) => {
  const [host, setHost] = useState({});
  const [bridges, setBridges] = useState([]);
  const [containers, setContainers] = useState([]);

  const store = {
    host,
    setHost,
    bridges,
    setBridges,
    containers,
    setContainers,
  };

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};
