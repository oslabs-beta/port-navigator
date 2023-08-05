import { DockerDesktopClient } from '@docker/extension-api-client-types/dist/v1';

import type {
  ContainerInfo,
  NetworkInfo,
  setContainers,
  setNetworks,
} from '../interfaces/interfaces';

//obtain basic network info
const getNetworks = async (
  ddClient: DockerDesktopClient,
  setNetworks: setNetworks,
): Promise<void> => {
  // obtain list of all networks on Docker Desktop
  const result = await ddClient.docker.cli.exec('network ls', [
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
  //setting bridges as new networks
  setNetworks(newNetworks);
  // console.log('bridges', bridges);
};

//obtains a list of all containers
const getAllContainers = async (
  ddClient: DockerDesktopClient,
  setContainers: setContainers,
): Promise<void> => {
  // obtain list of all containers on Docker Desktop
  const dockerContainers: [] | unknown = await ddClient.docker.listContainers();
  if (Array.isArray(dockerContainers)) {
    const newContainers = dockerContainers.map(el => {
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
const getMoreNetworkInfo = async (
  ddClient: DockerDesktopClient,
  networks: NetworkInfo[],
  setNetworks: setNetworks,
) => {
  const newNetworks = [...networks];
  console.log('newNetworks: ', newNetworks);
  for (let i = 0; i < newNetworks.length; i++) {
    const result = await ddClient.docker.cli.exec(
      `network inspect ${newNetworks[i].Name}`,
      ['--format', '"{{json .}}"'],
    );
    const moreInfo: any = result.parseJsonLines()[0];
    const newNetwork: NetworkInfo = {
      ...newNetworks[i],
      Containers: moreInfo.Containers,
      Gateway: moreInfo.IPAM.Config.length
        ? moreInfo.IPAM.Config[0].Gateway
        : null,
      Subnet: moreInfo.IPAM.Config.length
        ? moreInfo.IPAM.Config[0].Subnet
        : null,
      Scope: moreInfo.Scope,
    };
    newNetworks[i] = newNetwork;
  }
  console.log('networks: ', newNetworks);
  setNetworks(newNetworks);
};
export { getNetworks, getAllContainers, getMoreNetworkInfo };

/* future functionality

* additional info on each network
*/
