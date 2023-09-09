import React, { useState, useRef, BaseSyntheticEvent } from 'react';
import { createPortal } from 'react-dom';

import { ContainerInfo, NetworkInfo } from '../interfaces/interfaces';
import { useAppStore } from '../store';
import FormModal from './container-form/FormModal';
import ConnectContainer from './container-form/ConnectContainer';
import EditPorts from './container-form/EditPorts';

//Component to display Container
const ContainerDisplay: React.FC<{
  id: string;
  info: ContainerInfo;
  network: NetworkInfo;
  containerIndex: number;
}> = props => {
  // State determining if our FormModal should be displayed or not
  const [isOpen, setIsOpen] = useState<Boolean>(false);
  const [editPorts, setEditPorts] = useState<Boolean>(false);
  const { ddClient, incForce } = useAppStore(store => {
    return { ddClient: store.ddClient, incForce: store.incForce };
  });

  //establish useRef variable
  const container = useRef<HTMLDivElement>(null);

  //onClick functionality to close our FormModal.
  function formClose() {
    setIsOpen(false);
  }

  function portsClose() {
    setEditPorts(false);
  }

  //disconnects a container from given network when button is clicked
  const DisconnectContainer = async (
    containerName: string,
    networkName: string,
    e: BaseSyntheticEvent<any>,
  ): Promise<void> => {
    let connected = true;
    e.preventDefault();

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

  const privatePortArray: string[] = [];
  const publicPortArray: string[] = [];
  const portType: Set<string> = new Set();
  props.info.Ports.forEach(port => {
    if (port.PublicPort)
      publicPortArray.push(port.PublicPort + ':' + port.PrivatePort);
    else if (port.PrivatePort) privatePortArray.push(port.PrivatePort);
    if (port.Type) portType.add(port.Type);
  });
  let privatePortArrayStr = '';
  privatePortArray.sort().forEach((port, i) => {
    i === privatePortArray.length - 1
      ? (privatePortArrayStr += port)
      : (privatePortArrayStr += `${port}, `);
  });

  let publicPortArrayStr = '';
  publicPortArray.sort().forEach((port, i) => {
    i === publicPortArray.length - 1
      ? (publicPortArrayStr += port)
      : (publicPortArrayStr += `${port}, `);
  });

  return (
    <div id={props.id} className='container' ref={container}>
      {/* Display container information*/}
      <div className='containerHeader'>
        <p>
          {' '}
          <strong>Container: </strong>
          <span /> {props.info.Name}
        </p>
      </div>
      <div className='containerInfoContainer'>
        <div
          className={
            passedPorts ? 'containerInfo withPorts' : 'containerInfo noPorts'
          }>
          <hr className='tophr'/>
          <p className='clipText'>
            <strong>ContainerID: </strong>
            <br /> {props.info.Id}
          </p>
          <hr />
          <p className='clipText'>
            <strong>Image: </strong>
            <br /> {props.info.Image}
          </p>
          <hr />
          <p>
            <strong>Activity: </strong>
            <br /> {props.info.State}
          </p>
          <hr className='bottomhr'/>
        </div>
        <ul className='portInfo'>
        <li>
              <strong>Type: </strong> {portType}
          </li>
          {/* Display list of information from Ports*/}
          <hr />
          <li>
            <strong>IPv4Address: </strong>
            {props.network.IPv4Address ? (
              props.network.IPv4Address[props.containerIndex]
            ) : (
              <em>null</em>
            )}
          </li>
          <hr />
          <li>
            <strong>Published Ports: </strong>
            {publicPortArrayStr.length ? publicPortArrayStr : <em>null</em>}
          </li>
          <hr />
          <li>
            <strong>Private Ports: </strong>
            {privatePortArrayStr.length ? privatePortArrayStr : <em>null</em>}
          </li>
          <li>
            <button className='innerButton editButton' onClick={() => setEditPorts(true)}>
              <p>Edit Ports</p> 
            </button>

            {/* Display for form modal */}
            {createPortal(
              <FormModal open={editPorts} onClose={portsClose}>
                {/* Calling Form component function as child of FormModal */}
                <EditPorts
                  info={props.info}
                  portsClose={portsClose}
                  network={props.network.Name}
                  publicPorts={publicPortArray}
                  privatePorts={privatePortArray}
                  portType={portType}
                  IPv4Address={
                    props.network.IPv4Address
                      ? props.network.IPv4Address[props.containerIndex]
                      : 'null'
                  }
                />
              </FormModal>,
              document.body,
            )}
          </li>
        </ul>
      </div>
      <div className='footerContainer'>

        <div className='containerButtons'>
          {props.network.Name !== 'none' ? (
            <button
              className='innerButton'
              onClick={e =>
                DisconnectContainer(props.info.Name, props.network.Name, e)
              }>
              Disconnect
            </button>
          ) : null}
          <button className='innerButton netconnect' onClick={() => setIsOpen(true)}>
          Connect to Networks
          </button>

          {/* Display for form modal */}
          {createPortal(
            <FormModal open={isOpen} onClose={formClose}>
              {/* Calling Form component function as child of FormModal */}
              <ConnectContainer info={props.info} formClose={formClose} />
            </FormModal>,
            document.body,
          )}
        </div>
      </div>
    </div>
  );
};

export default ContainerDisplay;
