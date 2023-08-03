import React from 'react';
import { ContainerInfo, PortItem } from '../interfaces/interfaces';

//Component to display Containers

const ContainerDisplay: React.FC<{ info: ContainerInfo }> = props => {
  return (
    <div>
      <div id={props.info.Name} className='container'>
        {/* Display container information*/}
        <p>Name: {props.info.Name}</p>
        <p>ContainerID: {props.info.Id}</p>
        <p>Image: {props.info.Image}</p>
        <p>Activity: {props.info.State}</p>
        <p>Network: {props.info.Networks}</p>
        <ul>
          {/* Display list of information from Ports*/}
          <li>IP: {props.info.Ports.IP} </li>
          <li> PrivatePort: {props.info.Ports.PrivatePort} </li>
          <li> PublicPort: {props.info.Ports.PublicPort} </li>
          <li>Type: {props.info.Ports.Type} </li>
        </ul>
      </div>
    </div>
  );
};

export default ContainerDisplay;
