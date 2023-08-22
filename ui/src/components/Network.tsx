// ---- imports go here ----
import ContainerDisplay from './ContainerDisplay';
import type { ContainerInfo, NetworkInfo } from '../interfaces/interfaces';
import { useState, BaseSyntheticEvent } from 'react';
import { useAppStore } from '../store';
import FormModal from './container-form/FormModal';
import { createPortal } from 'react-dom';
import AddContainer from './container-form/AddContainer';

const Network = (props: {
  network: NetworkInfo;
  networkIndex: number;
  containers: ContainerInfo[] | [];
  id?: String;
  allNetworks: NetworkInfo[] | [];
}) => {
  
  //importing ddClient & state for use in functions
  const { ddClient, networks, setNetworks, incForce } = useAppStore(store => {
    return {
      ddClient: store.ddClient,
      networks: store.networks,
      setNetworks: store.setNetworks,
      incForce: store.incForce,
    };
  });

  //removes an empty network when button is clicked
  const RemoveNetwork = async (e: BaseSyntheticEvent<any>): Promise<void> => {
    e.preventDefault();

    //? if Disconnecting.... feature fails, it's probably because the divs got shifted around
    //selects network element that is being deleted
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
      //update name to read "Disconnecting...." until removal completes
      const newNetworks = [...networks];
      newNetworks[props.networkIndex] = {
        ...props.network,
        Name: `Disconnecting ${props.network.Name}....`,
      };
      setNetworks(newNetworks);

      //removes network only if no containers exist on it
      await ddClient.docker.cli.exec('network rm', [props.network.Name]);
      ddClient.desktopUI.toast.success('Successfully deleted Network!');
      incForce();
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
          id={`network${props.networkIndex}_container${i}`}
          key={`network${props.networkIndex}_container${i}`}
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

  if (!props.network.Containers?.length) showContainersButton = <div></div>;

  const [displayAddContainerForm, setDisplayAddContainerForm] = useState(false);

  const closeAddContainerForm = () => {
    setDisplayAddContainerForm(false);
  };

  return (
    // a div containing the bridge name and the array displaying each container
    <div className={props.id ? `${props.id}` : 'userNetwork'}>
      <div className='networkContainer'>
        <div className='networkLabel'>
          <strong>Network: </strong>
          {networkName}
        </div>
        <div className='networkInfo'>
          <div className='Driver'>
            <strong>Driver: </strong>
            {props.network.Driver ? props.network.Driver : 'null'}
          </div>
          <div className='Gateway'>
            <strong>Gateway: </strong>
            {props.network.Gateway ? props.network.Gateway : 'null'}
          </div>
          <div className='Subnet'>
            <strong>Subnet: </strong>
            {props.network.Subnet ? props.network.Subnet : 'null'}
          </div>
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
            onClick={() => setDisplayAddContainerForm(true)}>
            Add Container
          </button>
          {createPortal(
            <FormModal
              open={displayAddContainerForm}
              onClose={closeAddContainerForm}>
              <AddContainer
                network={props.network}
                containerList={props.containers}
                closeAddContainerForm={closeAddContainerForm}
              />
            </FormModal>,
            document.body,
          )}
        </div>
        <button className='deleteNetworkButton' onClick={e => RemoveNetwork(e)}>
          x
        </button>
      </div>
      <div
        id={`${props.networkIndex}ContainersContainer`}
        className='containersContainer'
        style={{ display: 'none' }}>
        {networkContainerDisplay}
      </div>
    </div>
  );
};

// ---- exports go here ----
export default Network;
