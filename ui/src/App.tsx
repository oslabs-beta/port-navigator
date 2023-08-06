import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import type { ContainerInfo, NetworkInfo } from './interfaces/interfaces';
// import Button from '@mui/material/Button';
// import { Stack, TextField, Typography } from '@mui/material';

import NetworksPage from './pages/NetworksPage';
import ContainersPage from './pages/ContainersPage';
import {
  getNetworks,
  getAllContainers,
  getMoreNetworkInfo,
} from './functions/functions';

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App() {
  //declaring ddClient to interact with Docker Desktop
  const ddClient = useDockerDesktopClient();
  //declaring state
  const [containers, setContainers] = useState<ContainerInfo[] | []>([]);
  const [networks, setNetworks] = useState<NetworkInfo[] | []>([]);

  useEffect(() => {
    getAllContainers(ddClient, setContainers);
    getNetworks(ddClient, setNetworks);
    getMoreNetworkInfo(ddClient, networks, setNetworks);
  }, [ddClient]);
  return (
    <Routes>
      <Route
        path='/'
        element={<NetworksPage networks={networks} containers={containers} />}
      />
      <Route path='/containers' element={<ContainersPage />} />
    </Routes>
  );
}
