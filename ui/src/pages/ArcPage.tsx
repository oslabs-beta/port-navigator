import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import { ContainerInfo, NetworkInfo, graphData } from '../interfaces/interfaces';
import { useAppStore } from '../store';

import * as am5 from "@amcharts/amcharts5";
import * as am5flow from "@amcharts/amcharts5/flow";


const ArcPage = (props: {
  networks: NetworkInfo[] | [];
  containers: ContainerInfo[] | [];
}) => {
  // const nav = useNavigate();
  const location = useLocation();

  const { ddClient } = useAppStore(store => {
    return { ddClient: store.ddClient };
  });

  useEffect(() => {
    try{

    am5.array.each(am5.registry.rootElements, function(root) {
      if (root.dom.id === "chartdiv" || "chartdiv2") {
        root.dispose();
      }
    });

  const root2 = am5.Root.new("chartdiv2"); 

  
  // Create series
  const series2 = root2.container.children.push(
    am5flow.Sankey.new(root2, {
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

      // const response = await ddClient.docker.cli.exec('stats', [
      //   '--no-stream',
      //   '--format',
      //   '"{{ json . }}"',
      // ]);
      
      // console.log('response: ', response);
      // const resParsed: any = response.parseJsonLines();
      // console.log('resParsed: ', resParsed);
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
   

  // Set data
  series2.data.setAll(graphData);
  
  
  series2.nodes.rectangles.template.setAll({
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
  


  series2.nodes.labels.template.setAll({
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

  
  series2.links.template.setAll({
    tooltipText: '{to}',
    tooltipY: am5.percent(55),
    controlPointDistance: 0.15,
  })

  //remove logo
  root2._logo?.dispose();

  } catch (error) {
    console.error("An error occurred during diagram rendering:", error);
  }

}, [location.pathname, props.networks, props.containers, ddClient.docker.cli]);


  return (
    <div id="chartdiv2" ></div>
  );

  
}

export default ArcPage;