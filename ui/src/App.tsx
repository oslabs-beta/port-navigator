import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import type { ContainerInfo, NetworkInfo } from './interfaces/interfaces';
// import Button from '@mui/material/Button';
// import { Stack, TextField, Typography } from '@mui/material';

import NetworksPage from './pages/NetworksPage';
import ContainersPage from './pages/ContainersPage';
import { GetNetworks, GetAllContainers } from './functions/functions';

export function App() {
  //declaring state
  const [containers, setContainers] = useState<ContainerInfo[] | []>([]);
  const [networks, setNetworks] = useState<NetworkInfo[] | []>([]);
  

  //async functions to set network and container states from ddClient
  useEffect(() => {
    GetNetworks(setNetworks);
    GetAllContainers(setContainers);
  }, []);

  return (
    <Routes>
      <Route
        path='/'
        element={
          <NetworksPage
            networks={networks}
            containers={containers}
            setContainers={setContainers}
            setNetworks={setNetworks}
          />
        }
      />
      <Route path='/containers' element={<ContainersPage />} />
    </Routes>
  );
}
