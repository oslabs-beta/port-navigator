
import {NetworkInfo, ContainerInfo} from '../../interfaces/interfaces'
import {useState} from 'react'
function Form(props:{ 
    allNetworks: NetworkInfo[] | [],
    info:ContainerInfo;
    handleClick: (networkName:string, containerName:string)=> void  
}){

    const[networkName, setnetworkName] = useState<string>('')

return ( 
<div style={{ color: 'white', fontWeight:'bold',marginLeft:'10%', marginTop:'20%'}}>
          
          <form className='form' onSubmit={()=>props.handleClick(networkName, props.info.Name)}>  
           <span style={{fontSize:'20px'}}>Connect {props.info.Name} to </span>
           <select className='form-select' value={networkName} onChange={(e)=> setnetworkName(e.target.value)} >
           { props.allNetworks.map((network)=> (
             <option 
             value={network.Name} key={network.Name} >
               {network.Name} 
             </option>
           ))}       
           </select>
           <span> network?</span>

           <button className='form-button'>Connect</button>
           
          </form> 
          
         </div>
);

}

export default Form;
// style={{margin:'auto', display:'flex', alignItems:'center', marginTop:'50px'}}