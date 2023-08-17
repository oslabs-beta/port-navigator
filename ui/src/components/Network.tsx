// ---- imports go here ----
import ContainerDisplay from './ContainerDisplay';
import type {
  ContainerInfo,
  NetworkInfo,
  setContainers,
  setNetworks,
} from '../interfaces/interfaces';
import { RemoveNetwork, HideContainers } from '../functions/functions';
import FormModal from './container-form/FormModal';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import AddContainer from './container-form/AddContainer';

// TO DO: typing will need to be more specific here once the exact contents of bridge and container are known
const Network = (props: {
  network: NetworkInfo;
  networkIndex: String;
  containers: ContainerInfo[] | [];
  setContainers: setContainers;
  setNetworks: setNetworks;
  id?: String;
  allNetworks: NetworkInfo[] | [];
}) => {
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
          setContainers={props.setContainers}
          setNetworks={props.setNetworks}
          allNetworks={props.allNetworks}
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
      className="innerButton"
      id={`${props.networkIndex}ShowHideNetworksButton`}
      onClick={() =>
        HideContainers(
          `${props.networkIndex}ContainersContainer`,
          `${props.networkIndex}ShowHideNetworksButton`
        )
      }
    >
      Show Containers
    </button>
  );

  if (!passedContainers) showContainersButton = <div></div>;

  const [displayAddContainerForm, setDisplayAddContainerForm] = useState(false);

  const closeAddContainerForm = () => {
    setDisplayAddContainerForm(false);
  };

  return (
    // a div containing the bridge name and the array displaying each container
    <div
      id={passedId ? `${props.id}` : `${props.networkIndex}`}
      className="network"
    >
      <div className="networkContainer">
        <div className="networkLabel">
          <strong>Network: </strong>
          {networkName}
        </div>
        <hr />
        <div className="containerNetworkFeatures">
          <div className="connectedContainerContainer">
            <p className="connectedText">
              Connected
              <br />
              Containers
            </p>
            <p className="divider">|</p>
            <p className="connectedCount">{props.network.Containers?.length}</p>
          </div>
          {showContainersButton}
          <button
            className="innerButton"
            id={`${props.networkIndex}ShowHideNetworksButton`}
            onClick={() => setDisplayAddContainerForm(true)}
          >
            Add Container
          </button>
          {createPortal(
            <FormModal
              open={displayAddContainerForm}
              onClose={closeAddContainerForm}
            >
              <AddContainer
                network={props.network}
                containerList={props.containers}
                setContainers={props.setContainers}
                setNetworks={props.setNetworks}
                closeAddContainerForm={closeAddContainerForm}
              />
            </FormModal>,
            document.body
          )}
        </div>
        <button
          className="deleteNetworkButton"
          onClick={(e) => RemoveNetwork(props.network, props.setNetworks, e)}
        >
          x
        </button>
      </div>
      <div
        id={`${props.networkIndex}ContainersContainer`}
        className="containersContainer"
      >
        {networkContainerDisplay}
      </div>
    </div>
  );
};

// ---- exports go here ----
export default Network;
