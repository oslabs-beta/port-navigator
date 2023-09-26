import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ContainerInfo, NetworkInfo, graphData } from '../interfaces/interfaces';
import { useAppStore } from '../store';

import * as am5 from "@amcharts/amcharts5";
import * as am5flow from "@amcharts/amcharts5/flow";


const ArcPage = (props: {
  networks: NetworkInfo[] | [];
  containers: ContainerInfo[] | [];
}) => {

  const location = useLocation();

  const { ddClient } = useAppStore(store => {
    return { ddClient: store.ddClient };
  });

  useEffect(() => {
    try{

    am5.array.each(am5.registry.rootElements, function(root) {
      if (root.dom.id === "chartdiv" || "chartdiv2" || "chartdiv3" || "chartdiv4") {
        root.dispose();
      }
    });

  const root2 = am5.Root.new("chartdiv2"); 

  
  // Create series
  const series2 = root2.container.children.push(
    am5flow.ArcDiagram.new(root2, {
      sourceIdField: "from",
      targetIdField: "to",
      valueField: "value",
      orientation: "horizontal",
      tooltipText: "{name}",
      tooltipPosition: "pointer",
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

   props.networks.forEach(network => {
     if (network.Containers?.length) {
       network.Containers.forEach(container => graphData.push( { from: network.Name, to: container, value: 3 } ) )
     }
     graphData.push({ from: "Host", to: network.Name, value: 3 })
    })
   

  // Set data
  series2.data.setAll(graphData);

  series2.nodes.labels.template.setAll({
    fill: am5.color(0xffffff),
    rotation: 90,
    centerX: am5.percent(2),
    fontWeight: "600",
    oversizedBehavior: "truncate",
    maxHeight: 154,
    shadowColor: am5.color(0x000000),
    shadowBlur: 5,
    shadowOffsetX: -2,
    shadowOffsetY: 2,
  });

  series2.links.template.setAll({
    strokeStyle: "gradient",
    strokeWidth: 3,
    strokeOpacity: 0.6,
    // tooltipHTML: "{from}:{to}"
  });


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