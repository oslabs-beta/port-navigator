import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import type { ContainerInfo, BridgeInfo } from './interfaces/interfaces';
// import Button from '@mui/material/Button';
// import { Stack, TextField, Typography } from '@mui/material';

import NetworksPage from './pages/NetworksPage';
import ContainersPage from './pages/ContainersPage';

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App() {
  const ddClient = useDockerDesktopClient();
  const [containers, setContainers] = useState<ContainerInfo[] | []>([]);
  const [bridges, setBridges] = useState({});

  const getDockerInfo = async (): Promise<void> => {
    // obtain list of all containers on Docker Desktop

    const dockerContainers: [] | unknown =
      await ddClient.docker.listContainers();
    console.log('containers: ', dockerContainers);
    if (Array.isArray(dockerContainers)) {
      const newContainers = dockerContainers.map(el => {
        const newEl: ContainerInfo = {
          Name: el.Names[0],
          Id: el.Id,
          Image: el.Image,
          State: el.Status,
          Networks: el.HostConfig.NetworkMode,
          Ports: {
            IP: el.Ports[0].IP,
            PrivatePort: el.Ports[0].PrivatePort,
            PublicPort: el.Ports[0].PublicPort,
            Type: el.Ports[0].Type,
          },
        };
        const networks = el.NetworkSettings.Networks;
        const newBridges: { [key: string]: BridgeInfo } = { ...bridges };
        for (const network of networks) {
          const bridge: BridgeInfo = {
            Alias: network.Aliases,
            Gateway: network.Gateway,
            IPAddress: network.IPAddress,
            MacAddress: network.MacAddress,
          };
          const networkId: string = network.NetworkID;
          newBridges[networkId] = bridge;
          setBridges(newBridges);
        }
        // setBridges(bridges=> {...bridges, bridge});
        return newEl;
      });
      setContainers(newContainers);
    }
  };
  getDockerInfo();

  return (
    <Routes>
      <Route
        path='/'
        element={<NetworksPage bridges={bridges} containers={containers} />}
      />
      <Route path='/containers' element={<ContainersPage />} />
    </Routes>
  );
}

// ! example extension test code
// const [response, setResponse] = useState('');

// const fetchAndDisplayResponse = async () => {
//   const result = await ddClient.extension.vm?.service?.get('/hello');
//   setResponse(JSON.stringify(result));
// };
// <>
//   <Typography variant='h3'>Docker extension demo</Typography>
//   <Typography variant='body1' color='text.secondary' sx={{ mt: 2 }}>
//     This is a basic page rendered with MUI, using Docker's theme. Read the
//     MUI documentation to learn more. Using MUI in a conventional way and
//     avoiding custom styling will help make sure your extension continues to
//     look great as Docker's theme evolves.
//   </Typography>
//   <Typography variant='body1' color='text.secondary' sx={{ mt: 2 }}>
//     Pressing the below button will trigger a request to the backend. Its
//     response will appear in the textarea.
//   </Typography>
//   <Stack direction='row' alignItems='start' spacing={2} sx={{ mt: 4 }}>
//     <Button variant='contained' onClick={fetchAndDisplayResponse}>
//       Call backend
//     </Button>

//     <TextField
//       label='Backend response'
//       sx={{ width: 480 }}
//       disabled
//       multiline
//       variant='outlined'
//       minRows={5}
//       value={response ?? ''}
//     />
//   </Stack>
// </>
