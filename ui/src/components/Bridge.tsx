// ---- imports go here ----
import ContainerDisplay from './ContainerDisplay';
import type { ContainerInfo, BridgeInfo } from '../interfaces/interfaces';

// TO DO: typing will need to be more specific here once the exact contents of bridge and container are known
const Bridge = (props: {
  bridge: BridgeInfo;
  containers: ContainerInfo[] | [];
}) => {
  // declare a variable, bridgeContainerDisplay, and assign it the value of an empty array
  const bridgeContainerDisplay: JSX.Element[] = [];
  // for each of the container objects passed down in the containerDisplay through props
  // TO DO: more specific typing on current container
  props.containers.forEach((currentContainer: ContainerInfo) => {
    // declare a variable, newContainer, and assign it the value of a container component passing down the currentContainer object as props
    const newContainer = <ContainerDisplay info={currentContainer} />;
    // push the newContainer into the bridgeContainerDisplay
    bridgeContainerDisplay.push(newContainer);
  });
  // TO DO: extract the bridge name from the bridge props
  const bridgeName: string = 'unknown';
  // return
  return (
    // a div containing the bridge name and the array displaying each container
    <div id={bridgeName} className='bridge'>
      <div className='bridgeName'>
        <strong>Name: </strong>
        {bridgeName}
      </div>
      <div>{bridgeContainerDisplay}</div>
    </div>
  );
};

// ---- exports go here ----
export default Bridge;
