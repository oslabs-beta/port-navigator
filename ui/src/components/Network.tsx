// ---- imports go here ----
import {useState} from 'react'
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
}) => {
  const [Loading, isLoading] = useState<Boolean>(false)
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
          isLoading={isLoading}
        />
      );
      // push the newContainer into the bridgeContainerDisplay
      networkContainerDisplay.push(newContainer);
    }
  });
  // TO DO: extract the bridge name from the bridge props
  // console.log('network: ', props.network);
  // console.log('networkContainerDisplay: ', networkContainerDisplay);
  if (networkContainerDisplay[0]) {
    // console.log(
    //   'networkContainerDisplay[0].props.info.Name: ',
    //   networkContainerDisplay[0].props.info.Name
    // );
  }
  // const bridgeName: string = bridgeContainerDisplay[0].props.info.name;
  const networkName = props.network.Name;
  // return
  return (
    // a div containing the bridge name and the array displaying each container
    <div id={`${props.networkIndex}`} className='network'>
      <div className='networkContainer'>
    { Loading?  (<p className= 'Loader'>Disconnecting...</p>):(
      <>
        <div className='networkLabel'>
          <strong>Name: </strong>
          {networkName}
        </div>
        <hr />
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
        className='deleteNetworkButton'
        onClick={() => RemoveNetwork(props.network.Name, props.setNetworks)}>
          x
        </button>
      <div
      id={`${props.networkIndex}ContainersContainer`}
      className='containersContainer'>
        {networkContainerDisplay}
        </div>
        </>
      )}
      </div>
      </div>
      
  );
};

// ---- exports go here ----
export default Network;
