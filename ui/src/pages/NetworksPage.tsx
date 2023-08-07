// import React from 'react';
import { useNavigate } from 'react-router-dom';
// import ContainerDisplay from '../components/ContainerDisplay';
import Network from '../components/Network';
import {
  ContainerInfo,
  NetworkInfo,
  setContainers,
  setNetworks,
} from '../interfaces/interfaces';
// import { StoreContext } from '../dataStore';

const NetworksPage = (props: {
  networks: NetworkInfo[] | [];
  containers: ContainerInfo[] | [];
  setContainers: setContainers;
  setNetworks: setNetworks;
}) => {
  const nav = useNavigate();
  const networkEl: JSX.Element[] = [];
  props.networks.forEach((network, i: number) => {
    const networkIndex: String = `network${i}`;
    networkEl.push(
      <Network
        key={`network${i}`}
        networkIndex={networkIndex}
        network={network}
        containers={props.containers}
        setContainers={props.setContainers}
        setNetworks={props.setNetworks}
      />,
    );
  });
  return (
    <div className='mainContainer'>
      <div className='buttonContainer'>
        <button
          className='button'
          title='Containers'
          onClick={() => nav('containers')}>
          Containers
        </button>
      </div>
      <div className='hostContainer'>
        <h1>Host</h1>
      </div>
      <div className='networksContainer'>{networkEl}</div>
    </div>
  );
};

export default NetworksPage;

// const nav = useNavigate();
// const { host, setHost, bridges, setBridges, containers, setContainers } =
//   useContext(StoreContext);
