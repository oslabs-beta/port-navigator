import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import {
  ContainerInfo,
  setContainers,
  setNetworks,
  NetworkInfo,
} from '../interfaces/interfaces';
import { DisconnectContainer } from '../functions/functions';

import FormModal from './container-form/FormModal';
import Form from './container-form/ConnectContainer';

//Component to display Container
const ContainerDisplay: React.FC<{
  id: string;
  info: ContainerInfo;
  network: string;
  setContainers: setContainers;
  setNetworks: setNetworks;
  allNetworks: NetworkInfo[] | [];
}> = (props) => {
  // State determining if our FormModal should be displayed or not
  const [isOpen, setIsOpen] = useState<Boolean>(false);

  //onClick functionality to close our FormModal.
  function formClose() {
    setIsOpen(false);
  }

  let passedPorts = true;
  if (!props.info.Ports) passedPorts = false;

  let portsUnorderedList = <div></div>;

  if (props.info.Ports)
    portsUnorderedList = (
      <ul className="portInfo">
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
    <div id={props.id} className="container">
      {/* Display container information*/}
      <div className="containerHeader">
        <p>
          {' '}
          <strong>Container: </strong>
          <span /> {props.info.Name}
        </p>
        <hr />
      </div>
      <div className="containerInfoContainer">
        <div
          className={
            passedPorts ? 'containerInfo withPorts' : 'containerInfo noPorts'
          }
        >
          <p className="clipText">
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
      <hr className="lastHR" />
      <div className="containerButtons">
        <button
          className="innerButton"
          onClick={(e) =>
            DisconnectContainer(
              props.info.Name,
              props.network,
              props.setContainers,
              props.setNetworks,
              e
            )
          }
        >
          Disconnect
        </button>
        <button className="innerButton" onClick={() => setIsOpen(true)}>
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
              formClose={formClose}
            />
          </FormModal>,
          document.body
        )}
      </div>
    </div>
  );
};

export default ContainerDisplay;
