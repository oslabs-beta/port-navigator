import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Button from '@mui/material/Button';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Stack, TextField, Typography } from '@mui/material';

import NetworksPage from './pages/NetworksPage.jsx';
import ContainersPage from './pages/ContainersPage.jsx';

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App() {
  // const [response, setResponse] = useState('');
  const ddClient = useDockerDesktopClient();
  // const [containers, setContainers] = useState([]);
  // const [bridges, setBridges] = useState([]);

  // const getDockerInfo = async () => {
  //obtain list of all containers on Docker Desktop
  // type Container = {
  //   Id: String,
  //   Names: [],
  //   Ports: [{
  //     IP: String,
  //     PrivatePort: Number,
  //     PublicPort: Number,
  //     Type: String
  //   }],
  //   State: String
  // }
  // const containers: Container[] = await ddClient.docker.listContainers();
  // console.log('containers: ', containers);
  // const newContainerArr = containers.map(el => {
  //   const newEl = {id: el.Id, Image: el.Image, IpAddress: el.NetworkSettings.Networks.}
  //   })
  // };
  // getDockerInfo();

  // const fetchAndDisplayResponse = async () => {
  //   const result = await ddClient.extension.vm?.service?.get('/hello');
  //   setResponse(JSON.stringify(result));
  // };

  return (
    <Routes>
      <Route path='/' element={<NetworksPage />} />
      <Route path='/containers' element={<ContainersPage />} />
    </Routes>
  );
}

// ! example extension test code
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
