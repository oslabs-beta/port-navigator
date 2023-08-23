import { SetStateAction, Dispatch } from 'react';

const PublicCheckbox = (props: {
  index: number;
  privatePorts: string[];
  setPrivatePorts: Dispatch<SetStateAction<string[]>>;
  publicPorts: string[];
  setPublicPorts: Dispatch<SetStateAction<string[]>>;
}) => {
  const removePublish = () => {
    const newPrivatePort = props.publicPorts[props.index].split(':');
    console.log('newPrivatePort: ', newPrivatePort);
    props.setPrivatePorts([...props.privatePorts, newPrivatePort[1]].sort());
    const newPublicPorts = props.publicPorts;
    newPublicPorts.splice(props.index, 1);
    props.setPublicPorts(newPublicPorts);
  };

  return (
    <li>
      <div>
        <label htmlFor='publicPort'>{props.publicPorts[props.index]}</label>
        <button name='publicPort' onClick={_e => removePublish()}>
          X
        </button>
      </div>
    </li>
  );
};

export default PublicCheckbox;
