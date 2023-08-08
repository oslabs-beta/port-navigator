import { createDockerDesktopClient } from '@docker/extension-api-client';
import type {
  ContainerInfo,
  NetworkInfo,
  setContainers,
  setNetworks,
} from '../interfaces/interfaces';

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

// obtain basic network info
const GetNetworks = async (setNetworks: setNetworks): Promise<void> => {
  const ddClient = useDockerDesktopClient();
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
  console.log('newNetworks1: ', newNetworks);
  // iterating through newNetworks to add additional info
  for (let i = 0; i < newNetworks.length; i++) {
    //executing comand line to retrieve additional info
    const result = await ddClient.docker.cli.exec(
      `network inspect ${newNetworks[i].Name}`,
      ['--format', '"{{json .}}"'],
    );
    //parsing additional info
    //TODO: get rid of any!
    const moreInfo: any = result.parseJsonLines()[0];
    //grabbing container names and adding into array
    const networkContainers: any[] = Object.values(moreInfo.Containers);
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
  console.log('newNetworks2: ', newNetworks);
  setNetworks(newNetworks);
};

//obtains a list of all containers
const GetAllContainers = async (
  setContainers: setContainers,
): Promise<void> => {
  const ddClient = useDockerDesktopClient();
  // obtain list of all containers on Docker Desktop
  const dockerContainers: [] | unknown = await ddClient.docker.listContainers();
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
    console.log('newContainers: ', newContainers);
    setContainers(newContainers);
  }
};

//removes an empty network when button is clicked
const RemoveNetwork = async (
  network: NetworkInfo,
  setNetworks: setNetworks,
): Promise<void> => {
  const ddClient = useDockerDesktopClient();
  console.log(network.Containers?.length);
  if (
    network.Name === 'bridge' ||
    network.Name === 'host' ||
    network.Name === 'none'
  ) {
    ddClient.desktopUI.toast.error(
      `You can't delete the ${network.Name} network!`,
    );
  } else if (network.Containers?.length !== 0) {
    ddClient.desktopUI.toast.error(
      `You can't delete a Network that has Containers attached to it!`,
    );
  } else {
    await ddClient.docker.cli.exec('network rm', [network.Name]);
    await GetNetworks(setNetworks);
    ddClient.desktopUI.toast.success('Successfully deleted Network!');
  }
};

//disconnects a container from given network when button is clicked
const DisconnectContainer = async (
  containerName: string,
  networkName: string,
  setContainers: setContainers,
  setNetworks: setNetworks,
): Promise<void> => {
  const ddClient = useDockerDesktopClient();
  await ddClient.docker.cli.exec('network disconnect', [
    networkName,
    containerName,
  ]);
  //TODO: add check that container doesn't have any other connections
  await ddClient.docker.cli.exec('network connect', ['none', containerName]);
  await GetNetworks(setNetworks);
  await GetAllContainers(setContainers);
};

//hides containers that appear on networks
const HideContainers = (containerID: string, buttonId: string) => {
  const divToHide: HTMLElement | null = document.getElementById(containerID);
  const showHideButton: HTMLElement | null = document.getElementById(buttonId);
  if (divToHide !== null && showHideButton !== null) {
    if (divToHide.style.display === 'none') {
      divToHide.style.display = 'grid';
      showHideButton.innerText = 'Hide Containers';
    } else {
      divToHide.style.display = 'none';
      showHideButton.innerText = 'Show Containers';
    }
  }
};

export {
  GetNetworks,
  GetAllContainers,
  RemoveNetwork,
  DisconnectContainer,
  HideContainers,
};

/* future functionality


! CLI commands to know
* prune networks: Remove all unused networks
? https://docs.docker.com/engine/reference/commandline/network_prune/
docker network prune [OPTIONS]
--filter		Provide filter values (e.g. until=<timestamp>)
--force , -f		Do not prompt for confirmation

* create a new network
? https://docs.docker.com/engine/reference/commandline/network_create/
docker network create [OPTIONS] <network name>
*--attachable		Enable manual container attachment
--aux-address		Auxiliary IPv4 or IPv6 addresses used by Network driver
?--config-from		The network from which to copy the configuration
?--config-only		Create a configuration only network
--driver , -d	bridge	Driver to manage the Network
*--gateway		IPv4 or IPv6 Gateway for the master subnet
--ingress		Create swarm routing-mesh network
--internal		Restrict external access to the network
*--ip-range		Allocate container ip from a sub-range
--ipam-driver		IP Address Management Driver
?--ipam-opt		Set IPAM driver specific options
--ipv6		Enable IPv6 networking
?--label		Set metadata on a network
--opt , -o		Set driver specific options
*--scope		Control the network’s scope
*--subnet		Subnet in CIDR format that represents a network segment

* remove a network
? https://docs.docker.com/engine/reference/commandline/network_rm/
docker network rm <network name>

*connect a container to a network
? https://docs.docker.com/engine/reference/commandline/network_connect/
docker network connect [OPTIONS] <network name> <container name>
*--alias		Add network-scoped alias for the container
?--driver-opt		driver options for the network
*--ip		IPv4 address (e.g., 172.30.100.104)
--ip6		IPv6 address (e.g., 2001:db8::33)
--link		Add link to another container
--link-local-ip		Add a link-local address for the container

* disconnect a container from a network
? https://docs.docker.com/engine/reference/commandline/network_disconnect/
docker network disconnect [OPTIONS] <network name> <container name>
--force , -f		Force the container to disconnect from a network
*/
