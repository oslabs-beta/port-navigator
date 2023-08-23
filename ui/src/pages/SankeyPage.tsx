import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { ContainerInfo, NetworkInfo, graphData } from '../interfaces/interfaces';
import { useAppStore } from '../store';

import * as am5 from "@amcharts/amcharts5";
import * as am5flow from "@amcharts/amcharts5/flow";


const VisualizerPage = (props: {
  networks: NetworkInfo[] | [];
  containers: ContainerInfo[] | [];
}) => {
  // const nav = useNavigate();

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
      orientation: "vertical",
      nodeAlign: "center",
      maskContent: true,
      opacity: 1,
      linkTension: 0.4
      // nodePadding: 25,

    })
  );

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
    fillOpacity: 1,
    stroke: am5.color(0x000000),
    strokeWidth: 1,
    cornerRadiusTL: 4,
    cornerRadiusTR: 4,
    cornerRadiusBL: 4,
    cornerRadiusBR: 4,
    tooltipY: am5.percent(-25),
    tooltipText: '{name}',
    
  });
  


  series.nodes.labels.template.setAll({
    x: am5.percent(50),
    centerX: am5.percent(50),
    centerY: am5.percent(18),
    textAlign: "center",
    fill: am5.color(0xffffff),
    fontWeight: "600",
    oversizedBehavior: "truncate",
    maxWidth: 75,
    scale: 0.85,

  });  

  
  series.links.template.setAll({
    tooltipText: '{to}',
    tooltipY: am5.percent(55),
    controlPointDistance: 0.15,
  })

  //remove logo
  root._logo?.dispose();

});

  return (
    <div id="chartdiv" ></div>
  );
};

export default VisualizerPage;