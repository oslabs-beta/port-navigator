import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import type { ContainerInfo, NetworkInfo } from './interfaces/interfaces';

import NetworksPage from './pages/NetworksPage';
import VisualizerPage from './pages/VisualizerPage';
// import SankeyPage from './pages/SankeyPage';
// import ArcPage from './pages/ArcPage';
import { useAppStore } from './store';

export default function App() {
  const { ddClient, networks, containers, setNetworks, setContainers, force } =
    useAppStore(store => {
      return {
        ddClient: store.ddClient,
        networks: store.networks,
        containers: store.containers,
        setNetworks: store.setNetworks,
        setContainers: store.setContainers,
        force: store.force,
      };
    });

  //obtains an array of all networks
  const GetNetworks = async (): Promise<void> => {
    // obtain list of all networks on Docker Desktop
    const result = await ddClient.docker.cli.exec('network ls', [
      '--no-trunc',
      '--format',
      '"{{json .}}"',
    ]);
    //parsing list of networks
    const networks = result.parseJsonLines();

    //formatting newNetworks to only contain relevant info from networks
    const newNetworks = networks.map(el => {
      const network: NetworkInfo = {
        Driver: el.Driver,
        Name: el.Name,
        ID: el.ID,
      };
      return network;
    });

    // iterating through newNetworks to add additional info
    for (let i = 0; i < newNetworks.length; i++) {
      //executing comand line to retrieve additional info
      const result = await ddClient.docker.cli.exec(
        `network inspect ${newNetworks[i].Name}`,
        ['--format', '"{{json .}}"'],
      );

      //parsing additional info
      const moreInfo = result.parseJsonLines()[0];
      //grabbing container names and adding into array
      const networkContainers: NetworkInfo[] = Object.values(
        moreInfo.Containers,
      );
      const containerNames = networkContainers.map(el => el.Name);
      //adding aditional info to network object
      const newNetwork: NetworkInfo = {
        ...newNetworks[i],
        Containers: containerNames,
        Gateway: moreInfo.IPAM.Config.length
          ? moreInfo.IPAM.Config[0].Gateway
          : null,
        Subnet: moreInfo.IPAM.Config.length
          ? moreInfo.IPAM.Config[0].Subnet
          : null,
        Scope: moreInfo.Scope,
      };
      //reassigning new network obj to newNetworks array
      newNetworks[i] = newNetwork;
    }

    setNetworks(newNetworks);
  };

  //obtains an array of all containers
  const GetAllContainers = async (): Promise<void> => {
    // obtain list of all containers on Docker Desktop
    const dockerContainers: [] | unknown =
      await ddClient.docker.listContainers();
    if (Array.isArray(dockerContainers)) {
      const newContainers = dockerContainers.map(el => {
        const newEl: ContainerInfo = {
          Name: el.Names[0].slice(1),
          Id: el.Id,
          Image: el.Image,
          State: el.Status,
          Networks: el.HostConfig.NetworkMode,
          Ports: el.Ports.length
            ? {
                IP: el.Ports[0].IP,
                PrivatePort: el.Ports[0].PrivatePort,
                PublicPort: el.Ports[0].PublicPort,
                Type: el.Ports[0].Type,
              }
            : null,
        };
        return newEl;
      });

      setContainers(newContainers);
    }
  };

  // obtain basic network info
  useEffect(() => {
    GetNetworks();
    GetAllContainers();
  }, [force]);

  return (
    <div className='App'>
      {/* <NetworksPage networks={networks} containers={containers} /> */}
      <Routes>
        <Route
          path='/'
          element={<NetworksPage networks={networks} containers={containers} />}
        />
        <Route path='Visualizer' element={<VisualizerPage networks={networks} containers={containers} />}>
          
        </Route>
      </Routes>
    </div>
  );
}
