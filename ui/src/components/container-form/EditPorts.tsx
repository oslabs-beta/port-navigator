import { ContainerInfo } from '../../interfaces/interfaces';
import { useState } from 'react';
import Checkbox from './Checkbox';
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

  const [newPublicPort, setNewPublicPort] = useState(props.publicPorts[0]);
  const [exposed, setExposed] = useState(false);
  const privatePort = props.privatePorts[0];

  const handleExposed = () => {
    setExposed(!exposed);
  };

  const changePorts = async () => {
    const commands = ['-d', `--name ${props.info.Name}`, props.info.Image];
    if (newIp !== props.IPv4Address)
      commands.push(`--network ${props.network} --ip ${newIp}`);
    if (exposed) commands.unshift(`--expose ${privatePort}`);
    if (newPublicPort)
      commands.unshift(`-p ${newPublicPort}:${privatePort}/${props.portType}`);

    await ddClient.docker.cli.exec('stop', [props.info.Name]);
    await ddClient.docker.cli.exec('rm', [props.info.Name]);
    await ddClient.docker.cli.exec('run', commands);
    incForce();
  };

  return (
    <div className='form-container'>
      <ul className='editPortInfo'>
        {/* Display list of information from Ports*/}
        <strong>IPv4 Address: </strong>
        <Checkbox state={newIp} setState={setNewIp} />
        <hr />
        <input type='checkbox' onChange={() => handleExposed()} />
        <strong>Exposed Container Ports: {privatePort}?</strong>
        <hr />
        <strong>Public Host Port: </strong>
        <Checkbox state={newPublicPort} setState={setNewPublicPort} />
        <hr />
        <li>
          <strong>Type: </strong>
          <br /> {props.portType}
        </li>
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
