import React from 'react';
import {
  ContainerInfo,
  setContainers,
  setNetworks,
} from '../interfaces/interfaces';
import { ConnectContainer, DisconnectContainer } from '../functions/functions';

//Component to display Container
const ContainerDisplay: React.FC<{
  id: string;
  info: ContainerInfo;
  network: string;
  setContainers: setContainers;
  setNetworks: setNetworks;
}> = props => {
  //if the Ports object exist within our props
  if (props.info.Ports) {
    // return container information including Ports info.

    return (
      <div id={props.id} className='container'>
        {/* Display container information*/}
        <div className='containerInfo'>
          <p>
            {' '}
            <strong>Name: </strong>
            <br /> {props.info.Name}
          </p>
          <hr />
          <p>
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
          <div className='containerButtons'>
            <button
              className='button'
              onClick={() =>
                ConnectContainer(
                  props.info.Name,
                  'bridge',
                  props.setContainers,
                  props.setNetworks,
                )
              }>
              Connect
            </button>
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
          </div>
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
    );
  }
  //else return container information without Ports info
  return (
    <div id={props.id} className='container'>
      {/* Display container information*/}
      <div className='containerInfo'>
        <p>
          {' '}
          <strong>Name: </strong>
          <br /> {props.info.Name}
        </p>
        <hr />
        <p>
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
        <div className='containerButtons'>
          <button
            className='button'
            onClick={() =>
              ConnectContainer(
                props.info.Name,
                'bridge',
                props.setContainers,
                props.setNetworks,
              )
            }>
            Connect
          </button>
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
        </div>
      </div>
    </div>
  );
};

export default ContainerDisplay;
