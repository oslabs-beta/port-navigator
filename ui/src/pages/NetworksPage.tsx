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

  //function to display 'Add Network' popup
  const showAddNetworkForm = () => {
    const addNetworkForm = document.getElementById('addNetworkForm');
    if (addNetworkForm !== null) {
      addNetworkForm.style.display = 'flex';
    }
  };

  //iterates through networks and creates a container for each
  props.networks.forEach((network, i: number) => {
    const newEl = (
      <Network
        key={`network${i}`}
        networkIndex={i}
        network={network}
        containers={props.containers}
        id={
          network.Driver !== 'bridge' || network.Name === 'bridge'
            ? 'defaultNetwork'
            : 'userNetwork'
        }
        allNetworks={props.networks}
      />
    );
    //pushes new element into specified array
    if (network.Name === 'host' || network.Name === 'none') {
      hostNone.push(newEl);
    } else if (network.Name === 'bridge') {
      defaultBridge.push(newEl);
    } else {
      networkEl.push(newEl);
    }
  });

  //combine arrays in desired order
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
