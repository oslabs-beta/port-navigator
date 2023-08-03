import React from 'react';
import { useNavigate } from 'react-router-dom';
import ContainerDisplay from '../components/ContainerDisplay';
import Bridge from '../components/Bridge';
import { ContainerInfo, PortItem, BridgeInfo } from '../interfaces/interfaces';
// import { StoreContext } from '../dataStore';

const NetworksPage = (props: {
  bridges: {};
  containers: ContainerInfo[] | [];
}) => {
  const nav = useNavigate();

  return (
    <div className='networksContainer'>
      <div className='pageButtonContainer'>
        <button
          className='containersButton'
          title='Containers'
          onClick={() => nav('containers')}></button>
      </div>
      <div className='hostContainer'>
        <h1>Host</h1>
      </div>
      //Bridges in specific order?
    </div>
  );
};

export default NetworksPage;

// const nav = useNavigate();
// const { host, setHost, bridges, setBridges, containers, setContainers } =
//   useContext(StoreContext);
