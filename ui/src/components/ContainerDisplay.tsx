import React, {useState} from 'react';

import {
  ContainerInfo,
  setContainers,
  setNetworks,
  NetworkInfo
} from '../interfaces/interfaces';
import { DisconnectContainer } from '../functions/functions';
import Modal from './container-form/FormModal'
import Form from './container-form/Form'

//Component to display Container
const ContainerDisplay: React.FC<{
  id: string;
  info: ContainerInfo;
  network: string;
  setContainers: setContainers;
  setNetworks: setNetworks;
  allNetworks: NetworkInfo[] | [];
}> = props => {
  const [isOpen, setIsOpen] = useState<Boolean>(false)
  
  // const[networkOption, setNetworkOption] = useState<string| null>('')
  
  

console.log('network', props.allNetworks[0].Name)


function formClose(){

  setIsOpen(false)
}

function handleClick(networkName:string, containerName:string){
   
   console.log(containerName)
   console.log(networkName)

   return;

}

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
            {/* <button className= 'button' onClick={() => ConnectContainers(props.info.Name) } >Connect</button>  */}
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
          <div className='containerButtons'>  
        <button className='innerButton' onClick={()=> setIsOpen(true)}>Connect</button>
        <Modal open={isOpen} onClose={formClose} >

          <Form handleClick={handleClick} allNetworks={props.allNetworks} info={props.info}/>
        {/* <div style={{ color: 'white', fontWeight:'bold',marginLeft:'10%', marginTop:'20%'}}> */}
          
           {/* <form >  
            <span style={{fontSize:'20px'}}>Connect {props.info.Name} to </span>
            <select style={{width:'100px', padding:'3px', color:'white',fontWeight: 'bold',fontSize:'20px',background: 'linear-gradient(to top left, rgb(46, 87, 120), rgb(47, 54, 71))'}}>
            { props.allNetworks.map((network)=> (
              <option 
              value={network.Name} key={network.Name} >
                {network.Name} 
              </option>
            ))}
          
            </select>

            <span style={{fontSize:'20px'}}>  network?</span>

            <button className='innerButton' style={{margin:'auto', display:'flex', alignItems:'center', marginTop:'50px'}}>Connect</button>
            
           </form> 
           
          </div> */}
            
        </Modal>
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
          {/* <button className= 'button' onClick={ () => ConnectContainers(props.info.Name)}>Connect</button> */}
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
        <div className='containerButtons'> 
        <button onClick={()=> setIsOpen(true)}>Connect</button>
        <Modal open={isOpen} onClose={formClose}>

        <Form handleClick={handleClick} allNetworks={props.allNetworks} info={props.info}/>
        {/* <div style={{ color: 'white', fontWeight:'bold', margin: 'auto', width:'50%', zIndex:1005}}>
          
          <form>  
           <span>Container name:</span>
           <input value={props.info.Name} />
           <select>
           { props.allNetworks.map((network)=> (
             <option 
             value='Hello there my friend' key={network.Name} >
             </option>
           ))}
           </select>

           
          </form> 
         
         </div>
           
          <p>Hello</p> */}
        </Modal>
         </div>
      </div>
    </div>
  );
};

export default ContainerDisplay;
