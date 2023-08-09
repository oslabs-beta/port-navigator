import { useNavigate } from 'react-router-dom';
import Network from '../components/Network';
import {
  ContainerInfo,
  NetworkInfo,
  setContainers,
  setNetworks,
} from '../interfaces/interfaces';

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
      />
        );
      }
      else if (network.Name === 'bridge') {
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
          />
          );
        } 
        else {
          networkEl.push(
            <Network
            key={`network${i}`}
            networkIndex={networkIndex}
            network={network}
            containers={props.containers}
            setContainers={props.setContainers}
            setNetworks={props.setNetworks}
            allNetworks={props.networks}
            />
            );
          }
        });
        
        networkEl.push(...hostNone);
        networkEl.unshift(...defaultBridge);
        
        return (
          <div className="mainContainer">
      <div className="buttonContainer">
        <button
          className="button"
          title="Containers"
          onClick={() => nav('containers')}
        >
          Containers
        </button>
      </div>
      <div className="hostContainer">
        <h1>Host</h1>
      </div>
      <div className="networksContainer">{networkEl}</div>
    </div>
  );
};

export default NetworksPage;
