// ---- imports go here ----
import ContainerDisplay from './ContainerDisplay';
import type { ContainerInfo, NetworkInfo } from '../interfaces/interfaces';
import { BaseSyntheticEvent } from 'react';
import { useAppStore } from '../store';

const Network = (props: {
  network: NetworkInfo;
  networkIndex: String;
  containers: ContainerInfo[] | [];
  id?: String;
  allNetworks: NetworkInfo[] | [];
}) => {
  //importing ddClient for use in functions
  const ddClient = useAppStore(store => store.ddClient);

  //removes an empty network when button is clicked
  const RemoveNetwork = async (e: BaseSyntheticEvent<any>): Promise<void> => {
    //TODO: maybe allowing e.Default will refresh page and we can remove GetNetworks()?
    e.preventDefault();
    console.log('e: ', e);
    //? if Disconnecting.... feature fails, it's probably because the divs got shifted around
    //selects network element that is being deleted
    const parentNetwork = await e.nativeEvent.path[2];
    console.log('parentNetwork: ', parentNetwork);
    if (
      props.network.Name === 'bridge' ||
      props.network.Name === 'host' ||
      props.network.Name === 'none'
    ) {
      ddClient.desktopUI.toast.error(
        `You can't delete the ${props.network.Name} network!`,
      );
    } else if (props.network.Containers?.length !== 0) {
      ddClient.desktopUI.toast.error(
        `You can't delete a Network that has Containers attached to it!`,
      );
    } else {
      //change network name to Disconnecting during deletion
      parentNetwork.innerText = `Disconnecting... ${props.network}`;
      setTimeout(() => parentNetwork.remove(), 1000);

      //removes network only if no containers exist on it
      await ddClient.docker.cli.exec('network rm', [props.network.Name]);
      ddClient.desktopUI.toast.success('Successfully deleted Network!');
    }
  };

  //hides containers that appear on networks
  const HideContainers = (containerID: string, buttonId: string) => {
    const divToHide: HTMLElement | null = document.getElementById(containerID);
    const showHideButton: HTMLElement | null =
      document.getElementById(buttonId);
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

  // declare a variable, bridgeContainerDisplay, and assign it the value of an empty array
  const networkContainerDisplay: JSX.Element[] = [];
  // for each of the container objects passed down in the containerDisplay through props
  // TO DO: more specific typing on current container
  props.containers.forEach((currentContainer: ContainerInfo, i: number) => {
    // declare a variable, newContainer, and assign it the value of a container component passing down the currentContainer object as props
    if (props.network.Containers?.includes(currentContainer.Name)) {
      const newContainer = (
        <ContainerDisplay
          id={`${props.networkIndex}_container${i}`}
          key={`${props.networkIndex}_container${i}`}
          info={currentContainer}
          network={props.network.Name}
        />
      );
      // push the newContainer into the bridgeContainerDisplay
      networkContainerDisplay.push(newContainer);
    }
  });

  // const bridgeName: string = bridgeContainerDisplay[0].props.info.name;
  const networkName = props.network.Name;
  console.log('props.network: ', props.network);
  console.log('networkName: ', networkName);

  let passedId = true;
  let passedContainers = true;

  if (!props.network.Containers?.length) passedContainers = false;
  if (!props.id) passedId = false;

  let showContainersButton = (
    <button
      className='innerButton'
      id={`${props.networkIndex}ShowHideNetworksButton`}
      onClick={() =>
        HideContainers(
          `${props.networkIndex}ContainersContainer`,
          `${props.networkIndex}ShowHideNetworksButton`,
        )
      }>
      Show Containers
    </button>
  );

  if (!passedContainers) showContainersButton = <div></div>;

  return (
    // a div containing the bridge name and the array displaying each container
    <div
      id={passedId ? `${props.id}` : `${props.networkIndex}`}
      className='network'>
      <div className='networkContainer'>
        <div className='networkLabel'>
          <strong>Network: </strong>
          {networkName}
        </div>
        <hr />
        <div className='containerNetworkFeatures'>
          <div className='connectedContainerContainer'>
            <p className='connectedText'>
              Connected
              <br />
              Containers
            </p>
            <p className='divider'>|</p>
            <p className='connectedCount'>{props.network.Containers?.length}</p>
          </div>
          {showContainersButton}
          <button
            className='innerButton'
            id={`${props.networkIndex}ShowHideNetworksButton`}
            onClick={() =>
              HideContainers(
                `${props.networkIndex}ContainersContainer`,
                `${props.networkIndex}ShowHideNetworksButton`,
              )
            }>
            Add Container
          </button>
        </div>
        <button className='deleteNetworkButton' onClick={e => RemoveNetwork(e)}>
          x
        </button>
      </div>
      <div
        id={`${props.networkIndex}ContainersContainer`}
        className='containersContainer'>
        {networkContainerDisplay}
      </div>
    </div>
  );
};

// ---- exports go here ----
export default Network;
