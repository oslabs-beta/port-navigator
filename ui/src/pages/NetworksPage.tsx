import { useNavigate } from 'react-router-dom';
import Network from '../components/Network';
import NetworkForm from '../components/NetworkForm';
import { ContainerInfo, NetworkInfo } from '../interfaces/interfaces';

const NetworksPage = (props: {
  networks: NetworkInfo[] | [];
  containers: ContainerInfo[] | [];
}) => {
  const nav = useNavigate();
  const networkEl: JSX.Element[] = [];
  const hostNone: JSX.Element[] = [];
  const defaultBridge: JSX.Element[] = [];

  const showAddNetworkForm = () => {
    const addNetworkForm = document.getElementById('addNetworkForm');
    if (addNetworkForm !== null) {
      addNetworkForm.style.display = 'flex';
    }
  };

  props.networks.forEach((network, i: number) => {
    const networkIndex: String = `network${i}`;
    if (network.Name === 'host' || network.Name === 'none') {
      hostNone.push(
        <Network
          key={`network${i}`}
          networkIndex={networkIndex}
          network={network}
          containers={props.containers}
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
          allNetworks={props.networks}
        />,
      );
    }
  });

  networkEl.push(...hostNone);
  networkEl.unshift(...defaultBridge);

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
      <NetworkForm />
    </div>
  );
};

export default NetworksPage;
