import { useState, SetStateAction, Dispatch } from 'react';

const PrivateCheckbox = (props: {
  index: number;
  privatePorts: string[];
  setPrivatePorts: Dispatch<SetStateAction<string[]>>;
  publicPorts: string[];
  setPublicPorts: Dispatch<SetStateAction<string[]>>;
}) => {
  const [checked, setChecked] = useState(false);
  const [newPort, setNewPort] = useState(props.privatePorts[props.index]);
  const handleCheck = () => {
    setChecked(!checked);
  };

  const handleSetState = (e: string) => {
    setNewPort(e);
  };

  const handlePublish = () => {
    props.setPublicPorts(
      [
        ...props.publicPorts,
        `${newPort}:${props.privatePorts[props.index]}`,
      ].sort(),
    );
    const newPrivatePorts = props.privatePorts;
    newPrivatePorts.splice(props.index, 1);
    props.setPrivatePorts(newPrivatePorts);
    setChecked(!checked);
  };

  return (
    <li className='liPort'>
      <input className='chk' type='checkbox' onChange={handleCheck} checked={checked} />
      {checked ? (
        <div className='publish'>
          <input
            name='publicPort'
            type='text'
            onChange={e => handleSetState(e.target.value)}
            placeholder={'8080'}
          />
          <label htmlFor='publicPort'>: {props.privatePorts[props.index]}</label>
          <button className='innerButton' onClick={_e => handlePublish()}>Publish</button>
        </div>
      ) : (
        props.privatePorts[props.index]
      )}
    </li>
  );
};

export default PrivateCheckbox;
