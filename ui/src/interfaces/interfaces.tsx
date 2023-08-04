interface ContainerInfo {
  Name: string;
  Id: string;
  Image: string;
  State: string;
  Networks: string | [string];
  Ports?: PortItem;
}
interface PortItem {
  IP: string;
  PrivatePort: number;
  PublicPort: number;
  Type: string;
}

interface BridgeInfo {
  Driver: string;
  Name: string;
  ID: string;
}

export type { ContainerInfo, PortItem, BridgeInfo };