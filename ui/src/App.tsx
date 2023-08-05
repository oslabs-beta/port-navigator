import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import type { ContainerInfo, NetworkInfo } from './interfaces/interfaces';
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
  //declaring ddClient to interact with Docker Desktop
  const ddClient = useDockerDesktopClient();
  //declaring state
  const [containers, setContainers] = useState<ContainerInfo[] | []>([]);
  const [networks, setNetworks] = useState<NetworkInfo[] | []>([]);

  useEffect(() => {
    //async function to obtain container and bridge info
    const getDockerInfo = async (): Promise<void> => {
      // obtain list of all networks on Docker Desktop
      const result = await ddClient.docker.cli.exec('network ls', [
        '--format',
        '"{{json .}}"',
      ]);
      //parsing list of networks
      const networks = result.parseJsonLines();

      //formatting newNetworks to only contain relevant info from networks
      const newNetworks = networks.map((el) => {
        const network: NetworkInfo = {
          Driver: el.Driver,
          Name: el.Name,
          ID: el.ID,
        };
        return network;
      });
      //setting bridges as new networks
      setNetworks(newNetworks);
      // console.log('bridges', bridges);

      // const result2 = await ddClient.docker.cli.exec(
      //   'network inspect containerwatch_containerwatch-desktop-extension_default',
      //   ['--format', '"{{json .}}"'],
      // );
      // const dockerNetworks2 = result2.parseJsonLines();
      // console.log('containerwatch: ', dockerNetworks2);

      // obtain list of all containers on Docker Desktop
      const dockerContainers: [] | unknown =
        await ddClient.docker.listContainers();
      if (Array.isArray(dockerContainers)) {
        const newContainers = dockerContainers.map((el) => {
          const newEl: ContainerInfo = {
            Name: el.Names[0],
            Id: el.Id,
            Image: el.Image,
            State: el.Status,
            Networks: el.HostConfig.NetworkMode,
          };
          if (el.Ports.length !== 0) {
            newEl.Ports = {
              IP: el.Ports[0].IP,
              PrivatePort: el.Ports[0].PrivatePort,
              PublicPort: el.Ports[0].PublicPort,
              Type: el.Ports[0].Type,
            };
          }

          return newEl;
        });
        console.log('newContainers: ', newContainers);
        setContainers(newContainers);
      }
    };

    getDockerInfo();
  }, [ddClient.docker]);
  return (
    <Routes>
      <Route
        path="/"
        element={<NetworksPage networks={networks} containers={containers} />}
      />
      <Route path="/containers" element={<ContainersPage />} />
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
