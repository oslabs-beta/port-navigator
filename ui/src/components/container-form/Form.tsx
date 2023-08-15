import { ContainerInfo } from '../../interfaces/interfaces';
import { useState } from 'react';
import { ConnectContainer } from '../../functions/functions';
import { useAppStore } from '../../store';

function Form(props: { info: ContainerInfo; formClose: Function }) {
  //State used to record which network the user chooses
  const [networkName, setnetworkName] = useState<string>('');
  const { networks } = useAppStore(store => store);

  return (
    <div className='form-container'>
      <form
        className='form'
        // Invoking our function to connect container to network from an Event Listener
        onSubmit={e => {
          ConnectContainer(props.info.Name, networkName, e);
          props.formClose();
        }}>
        {/* Container name */}
        <span>
          Connect <hr /> <span className='formLabel'>{props.info.Name}</span>{' '}
          <hr /> Container to a Network:
        </span>
        <select
          className='form-select'
          value={networkName}
          //   Recording the user input for network
          onChange={e => setnetworkName(e.target.value)}>
          {/* Iterating through all exisisting networks and displaying them as options for SELECT element */}
          {networks.map(network => (
            <option value={network.Name} key={network.Name}>
              {network.Name}
            </option>
          ))}
        </select>
        {/* <span> network?</span> */}

        <button className='form-button'>Connect</button>
      </form>
    </div>
  );
}

export default Form;
