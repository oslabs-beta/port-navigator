// import React from 'react';
import { useNavigate } from 'react-router-dom';
// import ContainerDisplay from '../components/ContainerDisplay';
import Network from '../components/Network';
import { ContainerInfo, NetworkInfo } from '../interfaces/interfaces';
// import { StoreContext } from '../dataStore';

const NetworksPage = (props: {
  networks: NetworkInfo[] | [];
  containers: ContainerInfo[] | [];
}) => {
  const nav = useNavigate();
  const networkEl: JSX.Element[] = [];
  props.networks.forEach((network, i: number) => {
    let networkIndex: String = `network${i}`;
    networkEl.push(
      <Network
        networkIndex={networkIndex}
        network={network}
        containers={props.containers}
      />
    );
  });
  return (
    <div className="networksContainer">
      <div className="pageButtonContainer">
        <button
          className="containersButton"
          title="Containers"
          onClick={() => nav('containers')}
        ></button>
      </div>
      <div className="hostContainer">
        <h1>Host</h1>
        {networkEl}
        {/* Bridges in specific order? */}
      </div>
      {/* <div className="bridgeContainer">
        <Bridge></Bridge>
      </div> */}
    </div>
  );
};

export default NetworksPage;

// const nav = useNavigate();
// const { host, setHost, bridges, setBridges, containers, setContainers } =
//   useContext(StoreContext);
