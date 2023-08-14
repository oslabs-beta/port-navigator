// ---- imports go here ----
import ContainerDisplay from './ContainerDisplay';
import type {
  ContainerInfo,
  NetworkInfo,
  setContainers,
  setNetworks,
} from '../interfaces/interfaces';
import { RemoveNetwork, HideContainers } from '../functions/functions';

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

  // return
  //TODO: can we refactor to not have four different returns?
  if (!props.network.Containers?.length && props.id) {
    return (
      // a div containing the bridge name and the array displaying each container
      <div id={`${props.id}`} className='network'>
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
              <p className='connectedCount'>
                {props.network.Containers?.length}
              </p>
            </div>
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
          <button
            className='deleteNetworkButton'
            onClick={e => RemoveNetwork(props.network, props.setNetworks, e)}>
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
  } else if (!props.network.Containers?.length && !props.id) {
    return (
      // a div containing the bridge name and the array displaying each container
      <div id={`${props.networkIndex}`} className='network'>
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
              <p className='connectedCount'>
                {props.network.Containers?.length}
              </p>
            </div>

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
          <button
            className='deleteNetworkButton'
            onClick={e => RemoveNetwork(props.network, props.setNetworks, e)}>
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
  }
  if (typeof props.network.Containers?.length === 'number' && props.id) {
    return (
      // a div containing the bridge name and the array displaying each container
      <div id={`${props.id}`} className='network'>
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
              <p className='connectedCount'>
                {props.network.Containers?.length}
              </p>
            </div>
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
          <button
            className='deleteNetworkButton'
            onClick={e => RemoveNetwork(props.network, props.setNetworks, e)}>
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
  } else {
    return (
      // a div containing the bridge name and the array displaying each container
      <div id={`${props.networkIndex}`} className='network'>
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
              <p className='connectedCount'>
                {props.network.Containers?.length}
              </p>
            </div>
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
          <button
            className='deleteNetworkButton'
            onClick={e => RemoveNetwork(props.network, props.setNetworks, e)}>
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
  }
};

// ---- exports go here ----
export default Network;
