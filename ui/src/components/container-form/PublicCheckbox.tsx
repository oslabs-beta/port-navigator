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
      <div className='publishedPortsContainer'>
        <span className='publishedPortsLabelContainer'>
          <label htmlFor='publicPort'>{props.publicPorts[props.index]}</label>
          <button
            name='publicPort'
            className='publicPort'
            onClick={_e => removePublish()}>
            <p>Remove</p> 
          </button>
        </span>
      </div>
    </li>
  );
};

export default PublicCheckbox;
