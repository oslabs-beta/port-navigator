import { ContainerInfo } from '../../interfaces/interfaces';
import { useState, SyntheticEvent } from 'react';
import { useAppStore } from '../../store';

function Form(props: { info: ContainerInfo; formClose: Function }) {
  //State used to record which network the user chooses
  const [networkName, setnetworkName] = useState<string>('');
  const { ddClient, networks, incForce } = useAppStore(store => {
    return {
      ddClient: store.ddClient,
      networks: store.networks,
      incForce: store.incForce,
    };
  });

  const ConnectContainer = async (
    containerName: string,
    networkName: string,
    e: SyntheticEvent<EventTarget>,
    alias?: string,
    ip?: string,
  ): Promise<void> => {
    e.preventDefault();
    console.log('alias: ', alias);
    console.log('ip: ', ip);

    //gets container info to check if network connection already exists
    const result = await ddClient.docker.cli.exec('inspect', [containerName]);
    const containerInfo: any = result.parseJsonObject();

    //TODO: check if container is connected to none or host
    //if network connection doesn't exist, make the connection
    if (!containerInfo[0].NetworkSettings.Networks[networkName]) {
      await ddClient.docker.cli.exec('network connect', [
        networkName,
        containerName,
      ]);
      incForce();
      //rerend networks with updated info
      //if connection already exists, display warning message
    } else {
      ddClient.desktopUI.toast.warning(
        `Container ${containerName} is already assigned to the networkS ${networkName}!`,
      );
    }
  };

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
