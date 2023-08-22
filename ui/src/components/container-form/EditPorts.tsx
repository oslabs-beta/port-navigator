import { ContainerInfo } from '../../interfaces/interfaces';
import { useState } from 'react';
import Checkbox from './Checkbox';
import { useAppStore } from '../../store';

function EditPorts(props: {
  info: ContainerInfo;
  portsClose: Function;
  network: string;
}) {
  //State used to record which network the user chooses
  const { ddClient, incForce } = useAppStore(store => {
    return {
      ddClient: store.ddClient,
      incForce: store.incForce,
    };
  });
  const [newIp, setNewIp] = useState(
    props.info.Ports ? props.info?.Ports.IP : 'null',
  );

  const [newPublicPort, setNewPublicPort] = useState(
    props.info.Ports ? props.info.Ports.PublicPort : 'null',
  );
  const [exposed, setExposed] = useState(false);

  const privatePort = props.info.Ports?.PrivatePort;

  const handleExposed = () => {
    setExposed(!exposed);
  };

  const changePorts = async () => {
    const commands = ['-d', `--name ${props.info.Name}`, props.info.Image];
    if (newIp !== props.info.Ports?.IP)
      commands.push(`--network ${props.network} --ip ${newIp}`);
    if (exposed) commands.unshift(`--expose ${privatePort}`);
    if (newPublicPort)
      commands.unshift(
        `-p ${newPublicPort}:${privatePort}/${props.info.Ports?.Type}`,
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
        <strong>IP: </strong>
        <Checkbox state={newIp} setState={setNewIp} />
        <hr />
        <input type='checkbox' onChange={() => handleExposed()} />
        <strong>Expose Private Port {privatePort}?</strong>
        <hr />
        <strong>Public Host Port: </strong>
        <Checkbox state={newPublicPort} setState={setNewPublicPort} />
        <hr />
        <li>
          <strong>Type: </strong>
          <br /> {props.info.Ports ? props.info.Ports.Type : ''}
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
