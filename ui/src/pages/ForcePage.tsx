import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ContainerInfo, NetworkInfo, forceProps } from '../interfaces/interfaces';
import { useAppStore } from '../store';

import * as am5 from "@amcharts/amcharts5";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";


const ForcePage = (props: {
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
      if (root.dom.id === "chartdiv" || "chartdiv2" || "chartdiv3") {
        root.dispose();
      }
    });

  const root3 = am5.Root.new("chartdiv3"); 

  
  // Create series
  const series3 = root3.container.children.push(
    am5hierarchy.ForceDirected.new(root3, {
      valueField: "value",
      categoryField: "name",
      childDataField: "children",
      minRadius: 20,
      maxRadius: am5.percent(15),
      nodePadding: 20,

    })
  );

  series3.nodes.template.set("tooltipText", "{category}");

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

    const forceProps: forceProps[] = [];
    
    const hostObj: forceProps = { name: "Host", value: 9, children: []};

    props.networks.forEach(network => {
      let childObj: forceProps = {name: network.Name, value: 6, children: []};
      if (network.Containers?.length) {
            network.Containers.forEach(container => childObj.children?.push( { name: container, value: 3, children: []} ))
            
        hostObj.children?.push(childObj);
      } else {
        hostObj.children?.push({name: network.Name, value: 6, children: []})
      }
    })

    forceProps.push(hostObj);
    
    console.log('forceProps: ', forceProps);

  // Set data
  series3.data.setAll(forceProps);

  series3.labels.template.setAll({
    fontWeight: "600",
    oversizedBehavior: "fit",
    minScale: 0.05,
    // fontSize: 6
  });

  series3.links.template.setAll({
    strokeWidth: 3,
    strokeOpacity: 0.6,
  });


  //remove logo
  root3._logo?.dispose();

  } catch (error) {
    console.error("An error occurred during diagram rendering:", error);
  }

}, [location.pathname, props.networks, props.containers, ddClient.docker.cli]);


  return (
    <div id="chartdiv3" ></div>
  );

  
}

export default ForcePage;