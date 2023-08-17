import {
  ContainerInfo,
  setContainers,
  setNetworks,
} from '../../interfaces/interfaces';
import { NetworkInfo } from '../../interfaces/interfaces';
import { useState } from 'react';
import { AddContainer } from '../../functions/functions';

function Form(props: {
  network: NetworkInfo;
  containerList: ContainerInfo[] | [];
  closeAddContainerForm: Function;
  setContainers: setContainers;
  setNetworks: setNetworks;
}) {
  const [containerName, setContainerName] = useState<string>('');
  console.log('containerList', props.containerList);
  console.log('network info', props.network);

  return (
    <div className="form-container">
      <form className="form">
        <span>
          Connect <hr />{' '}
          <select
            className="form-select"
            value={containerName}
            onChange={(e) => setContainerName(e.target.value)}
          >
            {props.containerList.map((container) => (
              <option value={container.Name} key={container.Name}>
                {container.Name}
              </option>
            ))}
          </select>{' '}
          <hr /> <span>container to the</span> <hr />{' '}
          <span>{props.network.Name}</span> <hr /> <span>network</span>
        </span>
        <button
          className="form-button"
          onClick={(e) => {
            AddContainer(
              e,
              props.closeAddContainerForm,
              props.network,
              containerName,
              props.setContainers,
              props.setNetworks
            );
          }}
        >
          Connect
        </button>
      </form>
    </div>
  );
}

export default Form;
