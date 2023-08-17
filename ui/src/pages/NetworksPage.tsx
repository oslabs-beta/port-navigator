import { useNavigate } from 'react-router-dom';
// import ContainerDisplay from '../components/ContainerDisplay';
// import AddGateway from '../components/AddGateway';
import Network from '../components/Network';
import NetworkForm from '../components/NetworkForm';
import {
  ContainerInfo,
  NetworkInfo,
  setContainers,
  setNetworks,
} from '../interfaces/interfaces';
// import { StoreContext } from '../dataStore';
import { showAddNetworkForm } from '../functions/functions';

const NetworksPage = (props: {
  networks: NetworkInfo[] | [];
  containers: ContainerInfo[] | [];
  setContainers: setContainers;
  setNetworks: setNetworks;
}) => {
  const nav = useNavigate();
  const networkEl: JSX.Element[] = [];
  const hostNone: JSX.Element[] = [];
  const defaultBridge: JSX.Element[] = [];

  props.networks.forEach((network, i: number) => {
    const networkIndex: String = `network${i}`;
    if (network.Name === 'host' || network.Name === 'none') {
      hostNone.push(
        <Network
          key={`network${i}`}
          networkIndex={networkIndex}
          network={network}
          containers={props.containers}
          setContainers={props.setContainers}
          setNetworks={props.setNetworks}
          id={'defaultNetwork'}
          allNetworks={props.networks}
        />,
      );
    } else if (network.Name === 'bridge') {
      defaultBridge.push(
        <Network
          key={`network${i}`}
          networkIndex={networkIndex}
          network={network}
          containers={props.containers}
          setContainers={props.setContainers}
          setNetworks={props.setNetworks}
          allNetworks={props.networks}
          id={'defaultNetwork'}
        />,
      );
    } else {
      networkEl.push(
        <Network
          key={`network${i}`}
          networkIndex={networkIndex}
          network={network}
          containers={props.containers}
          setContainers={props.setContainers}
          setNetworks={props.setNetworks}
          allNetworks={props.networks}
        />,
      );
    }
  });

  networkEl.push(...hostNone);
  networkEl.unshift(...defaultBridge);
  // NOTE: DEAL WITH THESE TYPESCRIPT ANY TYPES IN THE FUTURE

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
      <div className='addNetworkButtonContainer'>
        <button
          className='addNetworkButton'
          onClick={() => showAddNetworkForm()}>
          Add Network
        </button>
      </div>
      <div className='hostContainer'>
        <h1>Host</h1>
      </div>
      <div className='networksContainer'>{networkEl}</div>
      <NetworkForm networks={props.networks} setNetworks={props.setNetworks} />
    </div>
  );
};

export default NetworksPage;

// const nav = useNavigate();
// const { host, setHost, bridges, setBridges, containers, setContainers } =
//   useContext(StoreContext);
