import {
  NetworkInfo,
  ContainerInfo,
  setContainers,
  setNetworks,
} from '../../interfaces/interfaces';
import { useState } from 'react';
import { ConnectContainer } from '../../functions/functions';
function Form(props: {
  allNetworks: NetworkInfo[] | [];
  info: ContainerInfo;
  setContainers: setContainers;
  setNetworks: setNetworks;
}) {
  //State used to record which network the user chooses
  const [networkName, setnetworkName] = useState<string>('');

  return (
    <div className="form-container">
      <form
        className="form"
        // Invoking our function to connect container to network from an Event Listener
        onSubmit={(e) =>
          ConnectContainer(
            props.info.Name,
            networkName,
            props.setContainers,
            props.setNetworks,
            e
          )
        }
      >
        {/* Container name */}
        <span>Connect {props.info.Name} to </span>
        <select
          className="form-select"
          value={networkName}
          //   Recording the user input for network
          onChange={(e) => setnetworkName(e.target.value)}
        >
          {/* Iterating through all exisisting networks and displaying them as options for SELECT element */}
          {props.allNetworks.map((network) => (
            <option value={network.Name} key={network.Name}>
              {network.Name}
            </option>
          ))}
        </select>
        <span> network?</span>

        <button className="form-button">Connect</button>
      </form>
    </div>
  );
}

export default Form;
