import { ContainerInfo } from '../../interfaces/interfaces';
import { useState } from 'react';
import Checkbox from './Checkbox';
import PrivateCheckbox from './PrivateCheckbox';
import PublicCheckbox from './PublicCheckbox';

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
  const [newIp, setNewIp] = useState(props.IPv4Address);

  const [newPublicPorts, setNewPublicPorts] = useState(props.publicPorts);
  const [exposed, setExposed] = useState(false);
  console.log('setExposed: ', setExposed);
  const [newPrivatePorts, setNewPrivatePorts] = useState(props.privatePorts);

  const publicPortElements = newPublicPorts.map((_port, i) => {
    return (
      <PublicCheckbox
        privatePorts={newPrivatePorts}
        setPrivatePorts={setNewPrivatePorts}
        publicPorts={newPublicPorts}
        setPublicPorts={setNewPublicPorts}
        index={i}
      />
    );
  });

  const privatePortElements = newPrivatePorts.map((_port, i) => {
    return (
      <PrivateCheckbox
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
    if (newIp !== props.IPv4Address)
      commands.push(`--network ${props.network} --ip ${newIp}`);
    if (exposed) commands.unshift(`--expose ${newPrivatePorts}`);
    if (newPublicPorts)
      commands.unshift(
        `-p ${newPublicPorts}:${newPrivatePorts}/${props.portType}`,
      );

    await ddClient.docker.cli.exec('stop', [props.info.Name]);
    await ddClient.docker.cli.exec('rm', [props.info.Name]);
    await ddClient.docker.cli.exec('run', commands);
    incForce();
  };

  return (
    <div className='form-container'>
      <ul className='editPortInfo'>
        {/* Display list of information from Ports*/}
        <li>
          <strong>Type: </strong>
          <br /> {props.portType}
        </li>
        <hr />
        <strong>IPv4 Address: </strong>
        <Checkbox state={newIp} setState={setNewIp} />
        <hr />
        <strong>Published Ports: </strong>
        <p>(Host Port : Container Port) </p>
        {publicPortElements}
        <hr />
        <strong>Private Ports: </strong>
        {privatePortElements}
      </ul>
      <button
        className='innerButton'
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
