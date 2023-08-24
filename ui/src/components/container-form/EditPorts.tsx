import { ContainerInfo } from '../../interfaces/interfaces';
import { useState } from 'react';
import PrivateCheckbox from './PrivateCheckbox';
import PublicCheckbox from './PublicCheckbox';
// import Checkbox from './Checkbox';

import { useAppStore } from '../../store';

function EditPorts(props: {
  info: ContainerInfo;
  portsClose: Function;
  network: string;
  publicPorts: string[];
  privatePorts: string[];
  portType: Set<string>;
  IPv4Address: string;
}) {
  //State used to record which network the user chooses
  const { ddClient, incForce } = useAppStore(store => {
    return {
      ddClient: store.ddClient,
      incForce: store.incForce,
    };
  });
  // const [newIp, setNewIp] = useState(props.IPv4Address);

  const [newPublicPorts, setNewPublicPorts] = useState(props.publicPorts);
  const [newPrivatePorts, setNewPrivatePorts] = useState(props.privatePorts);

  const publicPortElements = newPublicPorts.map((port, i) => {
    return (
      <PublicCheckbox
        key={port}
        privatePorts={newPrivatePorts}
        setPrivatePorts={setNewPrivatePorts}
        publicPorts={newPublicPorts}
        setPublicPorts={setNewPublicPorts}
        index={i}
      />
    );
  });

  const privatePortElements = newPrivatePorts.map((port, i) => {
    return (
      <PrivateCheckbox
        key={port}
        privatePorts={newPrivatePorts}
        setPrivatePorts={setNewPrivatePorts}
        publicPorts={newPublicPorts}
        setPublicPorts={setNewPublicPorts}
        index={i}
      />
    );
  });

  // const handleExposed = () => {
  //   setExposed(!exposed);
  // };

  const changePorts = async () => {
    const commands = ['-d', `--name ${props.info.Name}`, props.info.Image];
    commands.unshift(`--network ${props.network}`);
    // if (newIp !== props.IPv4Address) commands.unshift(`--ip ${newIp}`);
    if (newPublicPorts.length)
      newPublicPorts.forEach(port => {
        commands.unshift(`-p ${port}`);
      });
    if (newPrivatePorts.length === 1)
      commands.unshift(`--expose ${newPrivatePorts[0]}`);
    else if (newPrivatePorts.length > 1)
      commands.unshift(
        `--expose ${newPrivatePorts[0]}-${
          newPrivatePorts[newPrivatePorts.length - 1]
        }`,
      );

    await ddClient.docker.cli.exec('stop', [props.info.Name]);
    await ddClient.docker.cli.exec('rm', [props.info.Name]);
    await ddClient.docker.cli.exec('run', commands);
    incForce();
  };

  return (
    <div className='portEdit'>
      <ul className='form-container'>
        <li>
          <strong>Type: </strong>
          {props.portType}
        </li>
        <hr className='formhr' />
        <li>
          <strong>IPv4 Address: </strong>
          {props.IPv4Address}
        </li>
        
        {/* <Checkbox state={newIp} setState={setNewIp} /> */}
        <hr className='formhr' />
        <strong className='pubport' >Published Ports: </strong>
        <p className='pubportP' >( Host Port : Container Port ) </p>
        {publicPortElements}
        <hr className='formhr' />
        <strong>Private Ports: </strong>
        {privatePortElements}
      </ul>
      <p>
        WARNING! By clicking 'Submit' this container will restart and be
        disconnected from all other networks excluding this one
      </p>
      <button
        className='innerButton editButton'
        onClick={() => {
          changePorts();
          props.portsClose();
        }}>
        Submit
      </button>
    </div>
  );
}

export default EditPorts;
