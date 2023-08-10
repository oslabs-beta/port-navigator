import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import {
  ContainerInfo,
  setContainers,
  setNetworks,
  NetworkInfo,
} from '../interfaces/interfaces';
import {  DisconnectContainer } from '../functions/functions';

import FormModal from './container-form/FormModal';
import Form from './container-form/Form';

//Component to display Container
const ContainerDisplay: React.FC<{
  id: string;
  info: ContainerInfo;
  network: string;
  setContainers: setContainers;
  setNetworks: setNetworks;
  allNetworks: NetworkInfo[] | [];
}> = props => {

  // State determining if our FormModal should be displayed or not
  const [isOpen, setIsOpen] = useState<Boolean>(false);

  //onClick functionality to close our FormModal.
  function formClose() {
    setIsOpen(false);
  }

  //if the Ports object exist within our props
  if (props.info.Ports) {
    // return container information including Ports info.

    return (
      <div id={props.id} className='container'>
        {/* Display container information*/}
        <div className='containerInfoContainer'>
          <div className='containerInfo withPorts'>
            <p>
              {' '}
              <strong>Name: </strong>
              <br /> {props.info.Name}
            </p>
          <hr />
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
      </div>
          <div className='containerButtons'>
            <button
              className='innerButton'
              onClick={() =>
                DisconnectContainer(
                  props.info.Name,
                  props.network,
                  props.setContainers,
                  props.setNetworks,
                )
              }>
              Disconnect
            </button>
            <button className='innerButton' onClick={() => setIsOpen(true)}>
              Connect
            </button>

            {/* Display for form modal */}
            {createPortal(
            <FormModal open={isOpen} onClose={formClose}>
              {/* Calling Form component function as child of FormModal */}
              <Form
                allNetworks={props.allNetworks}
                info={props.info}
                setContainers={props.setContainers}
                setNetworks={props.setNetworks}
              />
            </FormModal>,
           document.body
          )}
          </div>
      </div>
    );
  }
  //else return container information without Ports info
  return (
    <div id={props.id} className='container'>
      {/* Display container information*/}
      <div className='containerInfo noPorts'>
        <p>
          {' '}
          <strong>Name: </strong>
          <br /> {props.info.Name}
        </p>
        <hr />
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
        <div className='containerButtons'>
          <button
            className='innerButton'
            onClick={() =>
              DisconnectContainer(
                props.info.Name,
                props.network,
                props.setContainers,
                props.setNetworks,
              )
            }>
            Disconnect
          </button>
          <button className='innerButton' onClick={() => setIsOpen(true)}>Connect</button>
          {createPortal(
          <FormModal open={isOpen} onClose={formClose}>
            <Form
              allNetworks={props.allNetworks}
              info={props.info}
              setContainers={props.setContainers}
              setNetworks={props.setNetworks}
            />
            </FormModal>,
            document.body
          )}
        </div>
    </div>
  );
};

export default ContainerDisplay;
