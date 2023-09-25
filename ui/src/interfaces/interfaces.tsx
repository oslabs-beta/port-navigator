interface ContainerInfo {
  Name: string;
  Id: string;
  Image: string;
  State: string;
  Networks: string | [string];
  Ports: PortItem[];
}

interface NetworkContainerInfo {
  Name: string;
  IPv4Address: string;
}

interface PortItem {
  IP?: string;
  PrivatePort?: string;
  PublicPort?: string;
  Type?: string;
}

interface NetworkInfo {
  Driver: string;
  Name: string;
  ID: string;
  Containers?: string[];
  IPv4Address?: string[];
  Gateway?: string;
  Subnet?: string;
  Scope?: string;
}


interface forceProps {
  name: string;
  value?: number;
  children?: forceProps[];
}

interface treeProps {
  name: string;
  value?: number;
  children?: treeProps[];
}

interface nodeData {
  from: string;
  to: string;
  value: number;
}

interface graphData extends Array<nodeData> {}

type setNetworks = React.Dispatch<React.SetStateAction<[] | NetworkInfo[]>>;

type setContainers = React.Dispatch<React.SetStateAction<[] | ContainerInfo[]>>;

export type {
  ContainerInfo,
  PortItem,
  NetworkInfo,
  setNetworks,
  setContainers,
  NetworkContainerInfo,
  graphData,
  forceProps,
  treeProps
};
