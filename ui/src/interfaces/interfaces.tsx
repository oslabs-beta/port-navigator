interface ContainerInfo {
  Name: string;
  Id: string;
  Image: string;
  State: string;
  Networks: string | [string];
  Ports: PortItem;
}
interface PortItem {
  IP: string;
  PrivatePort: number;
  PublicPort: number;
  Type: string;
}

interface BridgeInfo {
  Alias: string | null;
  Gateway: string;
  IPAddress: string;
  MacAddress: string;
}

export type { ContainerInfo, PortItem, BridgeInfo };
