// import React from 'react';
import { useNavigate } from 'react-router-dom';
// import ContainerDisplay from '../components/ContainerDisplay';
import Bridge from '../components/Bridge';
import { ContainerInfo, BridgeInfo } from '../interfaces/interfaces';
// import { StoreContext } from '../dataStore';

const NetworksPage = (props: {
  bridges: BridgeInfo[] | [];
  containers: ContainerInfo[] | [];
}) => {
  const nav = useNavigate();
  const bridgeEl: JSX.Element[] = [];
  props.bridges.forEach(bridge => {
    bridgeEl.push(<Bridge bridge={bridge} containers={props.containers} />);
  });
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
        {bridgeEl}
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
