import { createDockerDesktopClient } from '@docker/extension-api-client';
import { BaseSyntheticEvent, SyntheticEvent } from 'react';
// import { useAppStore } from '../store';

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.

const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

const ConnectContainer = async (
  containerName: string,
  networkName: string,
  e: SyntheticEvent<EventTarget>,
  alias?: string,
  ip?: string,
): Promise<void> => {
  e.preventDefault();
  const ddClient = useDockerDesktopClient();
  console.log('alias: ', alias);
  console.log('ip: ', ip);

  //gets container info to check if network connection already exists

  const result = await ddClient.docker.cli.exec('inspect', [containerName]);
  const containerInfo: any = result.parseJsonObject();

  //TODO: check if container is connected to none or host
  //if network connection doesn't exist, make the connection
  if (!containerInfo[0].NetworkSettings.Networks[networkName]) {
    await ddClient.docker.cli.exec('network connect', [
      networkName,
      containerName,
    ]);

    //rerend networks with updated info
    //if connection already exists, display warning message
  } else {
    ddClient.desktopUI.toast.warning(
      `Container ${containerName} is already assigned to the networkS ${networkName}!`,
    );
  }
};

//disconnects a container from given network when button is clicked
const DisconnectContainer = async (
  containerName: string,
  networkName: string,
  e: BaseSyntheticEvent<any>,
): Promise<void> => {
  const ddClient = useDockerDesktopClient();
  let connected = true;
  e.preventDefault();
  console.log('e: ', e);
  //? if Disconnecting.... feature fails, it's probably because the divs got shifted around
  //select parent container element
  const parentContainer = await e.nativeEvent.path[2];
  //overwrite child divs and replace with Disconnecting...
  parentContainer.innerText = `Disconnecting... ${containerName}`;
  setTimeout(() => parentContainer.remove(), 1000);

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
};

export { ConnectContainer, DisconnectContainer };

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
