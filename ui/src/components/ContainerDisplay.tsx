import React, { useState, useRef, BaseSyntheticEvent } from 'react';
import { createPortal } from 'react-dom';

import { ContainerInfo } from '../interfaces/interfaces';
import { useAppStore } from '../store';
import FormModal from './container-form/FormModal';
import Form from './container-form/ConnectContainer';

//Component to display Container
const ContainerDisplay: React.FC<{
  id: string;
  info: ContainerInfo;
  network: string;
}> = props => {
  // State determining if our FormModal should be displayed or not
  const [isOpen, setIsOpen] = useState<Boolean>(false);
  const { ddClient, incForce } = useAppStore(store => {
    return { ddClient: store.ddClient, incForce: store.incForce };
  });

  //establish useRef variable
  const container = useRef<HTMLDivElement>(null);

  //onClick functionality to close our FormModal.
  function formClose() {
    setIsOpen(false);
  }

  //disconnects a container from given network when button is clicked
  const DisconnectContainer = async (
    containerName: string,
    networkName: string,
    e: BaseSyntheticEvent<any>,
  ): Promise<void> => {
    let connected = true;
    e.preventDefault();
    console.log('e: ', e);
    //overwrite child divs and replace with Disconnecting...
    if (container.current)
      container.current.innerText = `Disconnecting... ${containerName}`;

    //disconnect container from Container
    await ddClient.docker.cli.exec('network disconnect', [
      networkName,
      containerName,
    ]);

    //inspect container to find other network connections
    const result = await ddClient.docker.cli.exec('inspect', [containerName]);
    const containerInfo: any = result.parseJsonObject();
    const networks = containerInfo[0].NetworkSettings.Networks;

    //if no other connections exist, set connected to false
    if (!Object.keys(networks).length) connected = false;

    //TODO: if conneceted to none, remove first then connect to other network
    //assign container to 'none' network if no network connections still exist
    if (!connected) {
      await ddClient.docker.cli.exec('network connect', [
        'none',
        containerName,
      ]);
    }
    incForce();
    //rerend networks with updated info
  };

  let passedPorts = true;
  if (!props.info.Ports) passedPorts = false;

  let portsUnorderedList = <div></div>;

  if (props.info.Ports)
    portsUnorderedList = (
      <ul className='portInfo'>
        {/* Display list of information from Ports*/}
        <li>
          <strong>IP: </strong>
          <br /> {props.info.Ports.IP}{' '}
        </li>
        <hr />
        <li>
          <strong>PrivatePort: </strong>
          <br /> {props.info.Ports.PrivatePort}{' '}
        </li>
        <hr />
        <li>
          <strong>PublicPort: </strong>
          <br /> {props.info.Ports.PublicPort}{' '}
        </li>
        <hr />
        <li>
          <strong>Type: </strong>
          <br /> {props.info.Ports.Type}{' '}
        </li>
      </ul>
    );

  return (
    <div id={props.id} className='container' ref={container}>
      {/* Display container information*/}
      <div className='containerHeader'>
        <p>
          {' '}
          <strong>Container: </strong>
          <span /> {props.info.Name}
        </p>
        <hr />
      </div>
      <div className='containerInfoContainer'>
        <div
          className={
            passedPorts ? 'containerInfo withPorts' : 'containerInfo noPorts'
          }>
          <p className='clipText'>
            <strong>ContainerID: </strong>
            <br /> {props.info.Id}
          </p>
          <hr />
          <p>
            <strong>Image: </strong>
            <br /> {props.info.Image}
          </p>
          <hr />
          <p>
            <strong>Activity: </strong>
            <br /> {props.info.State}
          </p>
        </div>
        {portsUnorderedList}
      </div>
      <div className='footerContainer'>
      <hr className="lastHR" />
      <div className="containerButtons">
        <button
          className='innerButton'
          onClick={e => DisconnectContainer(props.info.Name, props.network, e)}>
          Disconnect
        </button>
        <button className='innerButton' onClick={() => setIsOpen(true)}>
          Connect
        </button>

        {/* Display for form modal */}
        {createPortal(
          <FormModal open={isOpen} onClose={formClose}>
            {/* Calling Form component function as child of FormModal */}
            <Form info={props.info} formClose={formClose} />
          </FormModal>,
          document.body,
        )}
      </div>

      </div>
    </div>
  );
};

export default ContainerDisplay;
