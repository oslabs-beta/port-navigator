// ---- imports go here ----
import React from 'react';

// TO DO: typing will need to be more specific here once the exact contents of bridge and container are known
const bridge = (props: { bridge: [{}]; container: [{}] }) => {
  // declare a variable, bridgeContainerDisplay, and assign it the value of an empty array
  const bridgeContainerDisplay = [{}];
  // for each of the container objects passed down in the containerDisplay through props
  // TO DO: more specific typing on current container
  props.container.forEach((currentContainer: {}) => {
    // declare a variable, newContainer, and assign it the value of a container component passing down the currentContainer object as props
    const newContainer = <Container props={currentContainer} />;
    // push the newContainer into the bridgeContainerDisplay
    bridgeContainerDisplay.push(newContainer);
  });
  // TO DO: extract the bridge name from the bridge props
  const bridgeName: string = 'unknown';
  // return
  return (
    // a div containing the bridge name and the array displaying each container
    <div id={bridgeName} className="bridge">
      <div className="bridgeName">
        <strong>Name: </strong>
        {bridgeName}
      </div>
      <div>{bridgeContainerDisplay}</div>
    </div>
  );
};

// ---- exports go here ----
export default bridge;
