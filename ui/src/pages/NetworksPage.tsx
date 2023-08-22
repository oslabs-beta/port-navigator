import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import Network from '../components/Network';
import NetworkForm from '../components/NetworkForm';
import FormModal from '../components/container-form/FormModal';
import { ContainerInfo, NetworkInfo } from '../interfaces/interfaces';
import comp from '../../../assets/computer-icon.png';

const NetworksPage = (props: {
  networks: NetworkInfo[] | [];
  containers: ContainerInfo[] | [];
}) => {
  const nav = useNavigate();
  const networkEl: JSX.Element[] = [];
  const hostNone: JSX.Element[] = [];
  const defaultBridge: JSX.Element[] = [];

  //function to display 'Add Network' popup
  // const showAddNetworkForm = () => {
  //   const addNetworkForm = document.getElementById('addNetworkForm');
  //   if (addNetworkForm !== null) {
  //     addNetworkForm.style.display = 'flex';
  //   }
  // };

  const [displayAddNetworkForm, setDisplayAddNetworkForm] = useState(false);

  const closeAddNetworkForm = () => {
    setDisplayAddNetworkForm(false);
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
          onClick={() => nav('Visualizer')}>
          Visualizer
        </button>
      </div>
      <div className='addNetworkButtonContainer'>
        <button
          className='addNetworkButton'
          onClick={() => setDisplayAddNetworkForm(true)}>
          Add Network
        </button>
        {createPortal(
          <FormModal open={displayAddNetworkForm} onClose={closeAddNetworkForm}>
            <NetworkForm closeAddNetworkForm={closeAddNetworkForm} />
          </FormModal>,
          document.body,
        )}
      </div>
      <div className='hostContainer'>
        <img className='comp' src={comp} alt="computer-icon" />
      </div>
      <div className='networksContainer'>{networkEl}</div>
    </div>
  );
};

export default NetworksPage;
