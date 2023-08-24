import { ContainerInfo } from '../../interfaces/interfaces';
import { NetworkInfo } from '../../interfaces/interfaces';
import { useState, SyntheticEvent } from 'react';
import { useAppStore } from '../../store';

function AddContainer(props: {
  network: NetworkInfo;
  containerList: ContainerInfo[] | [];
  closeAddContainerForm: Function;
}) {
  const [containerName, setContainerName] = useState<string>('');

  const { ddClient, incForce } = useAppStore(store => {
    return {
      ddClient: store.ddClient,
      networks: store.networks,
      setNetworks: store.setNetworks,
      incForce: store.incForce,
    };
  });

  const AddContainer = async (
    e: SyntheticEvent<EventTarget>,
    closeAddContainerForm: Function,
    network: NetworkInfo,
    containerName: string,
  ) => {
    e.preventDefault();
    let alreadyAdded = false;
    if (network.Containers?.includes(containerName)) alreadyAdded = true;

    const commandArr = [];
    commandArr.push(network.Name);
    commandArr.push(containerName);

    if (alreadyAdded) {
      ddClient.desktopUI.toast.warning(
        `Container ${containerName} is already assigned to the network ${network.Name}!`,
      );
    } else {
      const result = await ddClient.docker.cli.exec('inspect', [containerName]);
      const containerInfo: any = result.parseJsonObject();

      // check if container is connected to none or host
      if (containerInfo[0].NetworkSettings.Networks.none) {
        await ddClient.docker.cli.exec('network disconnect', [
          'none',
          containerName,
        ]);
      }
      await ddClient.docker.cli.exec(`network connect`, commandArr);
      //rerend networks with updated info
      incForce();
    }
    closeAddContainerForm();
  };

  return (
    <div className='form-container'>
      <form className='form'>
        <span>
          Connect {' '}
          <select
            className='form-select'
            value={containerName}
            onChange={e => setContainerName(e.target.value)}>
            {props.containerList.map(container => (
              <option value={container.Name} key={container.Name}>
                {container.Name}
              </option>
            ))}
          </select>{' '}
          <span>container to the</span> <hr />{' '}
          <strong className='strongContainer'>{props.network.Name}</strong> 
          <hr /> <span>network</span>
        </span>
        <button
          className='form-button'
          onClick={e => {
            AddContainer(
              e,
              props.closeAddContainerForm,
              props.network,
              containerName,
            );
          }}>
          Connect
        </button>
      </form>
    </div>
  );
}

export default AddContainer;
