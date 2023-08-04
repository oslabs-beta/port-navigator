// import React from 'react';
import { useNavigate } from 'react-router-dom';
// import ContainerDisplay from '../components/ContainerDisplay';
// import Bridge from '../components/Bridge';
import { ContainerInfo, BridgeInfo } from '../interfaces/interfaces';
// import { StoreContext } from '../dataStore';

const NetworksPage = (props: {
  bridges: BridgeInfo[] | [];
  containers: ContainerInfo[] | [];
}) => {
  const nav = useNavigate();
  // console.log(props);
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
