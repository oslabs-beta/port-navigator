 import React from 'react';

 interface ContainerInfo{
     Name: string
     Id: string
     Activity: string
     Image: string
     State: string
     IpAddress: string[]
    }
    
    
    //Component to display Containers
    
const ContainerDisplay:React.FC<{info:ContainerInfo}>= (props)=>{

interface PortItem {
    IP: string;
    PrivatePort: number;
    PublicPort: number;
    Type: string;
 }


return(
<div >
 <div id = {props.info.Name} className='container'>
    {/* Display container name, id and if it is running or not */}
   <p>Name: props.info.Name</p>
   <p>Image: props.info.Image</p>
   <p>Activity: {props.info.State}</p>
   <p>containerId: {props.info.Id}</p>
   <ul>  
    {/* Iterate through Ports object and list out necessary information */}
     {props.info.IpAddress.map( (item: PortItem, index:number) => (
    <li key={index}>

       <p>IP: {item.IP} </p>
       <p>PrivatePort: {item.PrivatePort}</p>
       <p>PublicPort: {item.PublicPort}</p>
       <p>Type: {item.Type}</p>

     </li>
    )
   )
  }
    </ul>
   </div>    
  </div>
 )
}

export default ContainerDisplay;