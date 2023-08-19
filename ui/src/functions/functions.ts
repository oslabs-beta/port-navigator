import { createDockerDesktopClient } from '@docker/extension-api-client';
import { BaseSyntheticEvent, SyntheticEvent } from 'react';
// import { ExecOptions } from '@docker/extension-api-client-types/dist/v1';
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

    setContainers(newContainers);
  }
};

const AddNetwork = async (
  networkName: string,
  networks: NetworkInfo[],
  setNetworks: setNetworks,
  gateway: string,
  subnetworksInput: string,
  ipRange: string,
  setNetworkName: Function,
  setGateway: Function,
  setSubnet: Function,
  setIpRange: Function,
  setDisabled: Function,
) => {
  const ddClient = useDockerDesktopClient();
  let exists = false;
  for (const network of networks) {
    if (network.Name === networkName) exists = true;
  }
  if (!exists) {
    const commandArr = [networkName];
    commandArr.push(`--subnet=${subnetworksInput}`);
    commandArr.push(`--gateway=${gateway}`);
    commandArr.push(`--ip-range=${ipRange}`);
    // commandArr.push(networkName);
    await ddClient.docker.cli.exec('network create', commandArr);
    GetNetworks(setNetworks);
  } else {
    ddClient.desktopUI.toast.error(
      `The ${networkName} network already exists!`,
    );
  }
  hideAddNetworkForm(
    setNetworkName,
    setGateway,
    setSubnet,
    setIpRange,
    setDisabled,
  );
};

//removes an empty network when button is clicked
const RemoveNetwork = async (
  network: NetworkInfo,
  setNetworks: setNetworks,
  e: BaseSyntheticEvent<any>,
): Promise<void> => {
  //TODO: maybe allowing e.Default will refresh page and we can remove GetNetworks()?
  e.preventDefault();

  //? if Disconnecting.... feature fails, it's probably because the divs got shifted around
  //selects network element that is being deleted
  const parentNetwork = await e.nativeEvent.path[1].childNodes[0];

  const ddClient = useDockerDesktopClient();
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
    //change network name to Disconnecting during deletion
    parentNetwork.innerText = 'Disconnecting...';

    //removes network only if no containers exist on it
    await ddClient.docker.cli.exec('network rm', [network.Name]);
    await GetNetworks(setNetworks);
    ddClient.desktopUI.toast.success('Successfully deleted Network!');
  }
};

const AddContainer = async (
  e: SyntheticEvent<EventTarget>,
  closeAddContainerForm: Function,
  network: NetworkInfo,
  containerName: string,
  setContainers: setContainers,
  setNetworks: setNetworks,
) => {
  e.preventDefault();
  const ddClient = useDockerDesktopClient();
  let alreadyAdded = false;
  if (network.Containers?.includes(containerName)) alreadyAdded = true;

  const commandArr: string[] = [];
  commandArr.push(network.Name);
  commandArr.push(containerName);

  if (alreadyAdded) {
    ddClient.desktopUI.toast.warning(
      `Container ${containerName} is already assigned to the network ${network.Name}!`,
    );
  } else {
    await ddClient.docker.cli.exec(`network connect`, commandArr);
    //rerend networks with updated info
    await GetNetworks(setNetworks);
    await GetAllContainers(setContainers);
  }
  closeAddContainerForm();
};

const ConnectContainer = async (
  containerName: string,
  networkName: string,
  setContainers: setContainers,
  setNetworks: setNetworks,
  e: SyntheticEvent<EventTarget>,
  alias?: string,
  ip?: string,
): Promise<void> => {
  e.preventDefault();
  const ddClient = useDockerDesktopClient();
  console.log('ip: ', ip);
  console.log('alias: ', alias);

  //gets container info to check if network connection already exists

  const result = await ddClient.docker.cli.exec('inspect', [containerName]);
  const containerInfo: any = result.parseJsonObject();

  // check if container is connected to none or host
  if (containerInfo[0].NetworkSettings.Networks.none) {
    await ddClient.docker.cli.exec('network disconnect', [
      'none',
      containerName,
    ]);
  }

  //if network connection doesn't exist, make the connection
  if (!containerInfo[0].NetworkSettings.Networks[networkName]) {
    await ddClient.docker.cli.exec('network connect', [
      networkName,
      containerName,
    ]);
    //rerend networks with updated info
    await GetNetworks(setNetworks);
    await GetAllContainers(setContainers);
    //if connection already exists, display warning message
  } else {
    ddClient.desktopUI.toast.warning(
      `Container ${containerName} is already assigned to the network ${networkName}!`,
    );
  }
};

//disconnects a container from given network when button is clicked
const DisconnectContainer = async (
  containerName: string,
  networkName: string,
  setContainers: setContainers,
  setNetworks: setNetworks,
  e: BaseSyntheticEvent<any>,
): Promise<void> => {
  const ddClient = useDockerDesktopClient();
  let connected = true;
  e.preventDefault();

  //? if Disconnecting.... feature fails, it's probably because the divs got shifted around
  //select parent container element
  const parentContainer = await e.nativeEvent.path[2];
  //overwrite child divs and replace with Disconnecting...
  parentContainer.innerText = `Disconnecting... ${containerName}`;

  //disconnect container from Container
  await ddClient.docker.cli.exec('network disconnect', [
    networkName,
    containerName,
  ]);

  //inspect container to find other network connections
  const result = await ddClient.docker.cli.exec('inspect', [containerName]);
  const containerInfo: any = result.parseJsonObject();
  const networks = containerInfo[0].NetworkSettings.Networks;

  //if no other connections exist, set connected to false
  if (!Object.keys(networks).length) connected = false;

  //TODO: if conneceted to none, remove first then connect to other network
  //assign container to 'none' network if no network connections still exist
  if (!connected) {
    await ddClient.docker.cli.exec('network connect', ['none', containerName]);
  }
  //rerend networks with updated info
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

const showAddNetworkForm = () => {
  const addNetworkForm = document.getElementById('addNetworkForm');
  if (addNetworkForm !== null) {
    addNetworkForm.style.display = 'flex';
  }
};

const hideAddNetworkForm = (
  setNetworkName: Function,
  setGateway: Function,
  setSubnet: Function,
  setIpRange: Function,
  setDisabled: Function,
) => {
  const addNetworkForm = document.getElementById('addNetworkForm');
  if (addNetworkForm !== null) {
    setNetworkName('');
    setGateway(['']);
    setSubnet('');
    setIpRange('');
    setDisabled(true);
    addNetworkForm.style.display = 'none';
  }
  // const gatewayFormInput = document.getElementById('addGatewayFormInput');
  //
  // // if (gatewayFormInput)
  // if (gatewayFormInput) {
  //
  //   gatewayFormInput.setAttribute('value', '');
  // }
};

export {
  GetNetworks,
  GetAllContainers,
  AddNetwork,
  RemoveNetwork,
  ConnectContainer,
  DisconnectContainer,
  HideContainers,
  showAddNetworkForm,
  hideAddNetworkForm,
  AddContainer,
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

* run a container
? https://docs.docker.com/engine/reference/commandline/run/
 docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
--expose	Expose a port or a range of ports
--ip		IPv4 address (e.g., 172.30.100.104)
--ip6		IPv6 address (e.g., 2001:db8::33)
--name		Assign a name to the container
--network		Connect a container to a network
--network-alias		Add network-scoped alias for the container
--publish , -p		Publish a container’s port(s) to the host
*/
