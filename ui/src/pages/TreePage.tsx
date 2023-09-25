import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ContainerInfo, NetworkInfo, treeProps } from '../interfaces/interfaces';
import { useAppStore } from '../store';

import * as am5 from "@amcharts/amcharts5";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";


const TreePage = (props: {
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

  const root4 = am5.Root.new("chartdiv4"); 

  root4.container.children.push(
    am5.Container.new(root4, {
      width: am5.percent(100),
      height: am5.percent(100),
    })
  );
  
  // Create series
  const series4 = root4.container.children.push(
    am5hierarchy.Tree.new(root4, {
      valueField: "value",
      categoryField: "name",
      childDataField: "children",
      paddingTop: 140,
      paddingBottom: 120,
      paddingLeft: 60,
      paddingRight: 60,
    })
  );

  series4.circles.template.setAll({
    radius: 40,
  });
  
  series4.outerCircles.template.setAll({
    radius: 45,
  });

  series4.nodes.template.set("tooltipText", "{category}");

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

    const treeProps: treeProps[] = [];
    
    const hostObj: treeProps = { name: "Host", value: 9, children: []};

    props.networks.forEach(network => {
      let childObj: treeProps = {name: network.Name, value: 6, children: []};
      if (network.Containers?.length) {
            network.Containers.forEach(container => childObj.children?.push( { name: container, value: 3, children: []} ))
            
        hostObj.children?.push(childObj);
      } else {
        hostObj.children?.push({name: network.Name, value: 5.5, children: []})
      }
    })

    treeProps.push(hostObj);
    
    console.log('treeProps: ', treeProps);

  // Set data
  series4.data.setAll(treeProps);

  series4.labels.template.setAll({
    fontWeight: "600",
    oversizedBehavior: "truncate",
    minScale: 0.05,
  });

  series4.links.template.setAll({
    strokeWidth: 3,
    strokeOpacity: 0.6,
  });


  //remove logo
  root4._logo?.dispose();

  } catch (error) {
    console.error("An error occurred during diagram rendering:", error);
  }

}, [location.pathname, props.networks, props.containers, ddClient.docker.cli]);


  return (
    <div id="chartdiv4" ></div>
  );

  
}

export default TreePage;