import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContainerInfo, NetworkInfo, graphData } from '../interfaces/interfaces';
import { useAppStore } from '../store';
// import NetworksPage from './pages/NetworksPage';
import * as am5 from "@amcharts/amcharts5";
import * as am5flow from "@amcharts/amcharts5/flow";


const VisualizerPage = (props: {
  networks: NetworkInfo[] | [];
  containers: ContainerInfo[] | [];
}) => {
  const nav = useNavigate();

  const { ddClient } = useAppStore(store => {
    return { ddClient: store.ddClient };
  });

  useEffect(() => {

  const root = am5.Root.new("chartdiv"); 

  
  // Create series
  const series = root.container.children.push(
    am5flow.Sankey.new(root, {
      sourceIdField: "from",
      targetIdField: "to",
      valueField: "value",
      nodeWidth: 30,
      orientation: "vertical"
    })
    );
    // if (series.logo) {
      //   series.logo.disabled = true;
      // }

    async function getTrafficInfo() {

      const response = await ddClient.docker.cli.exec('stats', [
        '--no-stream',
        '--format',
        '"{{ json . }}"',
      ]);
      
      console.log('response: ', response);
      const resParsed: any = response.parseJsonLines();
      console.log('resParsed: ', resParsed);
    }

    getTrafficInfo();
      //create an object, loop through networks array, at each network - loop through containers array, set 'from' property to network & 'to' property to container, push new object into a graphData array ('value' property can be fixed to a shared value, or we can base the value on the traffic with that specific network connection)
    const graphData: graphData = [];
    /*
    props.networks.name;
    props.networks.Containers (an array of strings)
    */
   props.networks.forEach(network => {
     if (network.Containers?.length) {
       network.Containers.forEach(container => graphData.push( { from: network.Name, to: container, value: 3 } ) )
     }
     graphData.push({ from: "Host", to: network.Name, value: 3 })
    })
   

    console.log('props.networks: ', props.networks);
    console.log('props.containers: ', props.containers);

  // Set data
 series.data.setAll(graphData);
  
  series.nodes.rectangles.template.setAll({
    fillOpacity: 0.5,
    stroke: am5.color(0x000000),
    strokeWidth: 1,
    cornerRadiusTL: 4,
    cornerRadiusTR: 4,
    cornerRadiusBL: 4,
    cornerRadiusBR: 4
  });
  
  series.nodes.labels.template.setAll({
    x: am5.percent(50),
    centerX: am5.percent(50),
    textAlign: "center",
    
  });  

  // series.nodes.get("colors").set("step", 2);
  // return () => {
  //   series.dispose();
  // };

});

  return (
    <div className='mainContainer'>
    <div className='buttonContainer'>
      <button
        className='button'
        onClick={() => nav('/')}>
        Networks
      </button>
    </div>
    <div id="chartdiv" ></div>
  </div>
  );
};

export default VisualizerPage;