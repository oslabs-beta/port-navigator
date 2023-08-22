interface ContainerInfo {
  Name: string;
  Id: string;
  Image: string;
  State: string;
  Networks: string | [string];
  Ports: PortItem | null;
}
interface PortItem {
  IP: string;
  PrivatePort: number;
  PublicPort: number;
  Type: string;
}

interface NetworkInfo {
  Driver: string;
  Name: string;
  ID: string;
  Containers?: string[];
  Gateway?: string;
  Subnet?: string;
  Scope?: string;
}

interface nodeData {
  from: string;
  to: string;
  value: number;
}

interface graphData extends Array<nodeData>{}

type setNetworks = React.Dispatch<React.SetStateAction<[] | NetworkInfo[]>>;

type setContainers = React.Dispatch<React.SetStateAction<[] | ContainerInfo[]>>;

export type {
  ContainerInfo,
  PortItem,
  NetworkInfo,
  setNetworks,
  setContainers,
  graphData
};
