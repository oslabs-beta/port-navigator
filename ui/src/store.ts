import { create } from 'zustand';
import { ContainerInfo, NetworkInfo } from './interfaces/interfaces';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { DockerDesktopClient } from '@docker/extension-api-client-types/dist/v1';

//async functions to set network and container states from ddClient
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

interface AppState {
  ddClient: DockerDesktopClient;
  containers: ContainerInfo[] | [];
  setContainers: (containers: ContainerInfo[] | []) => void;
  networks: NetworkInfo[] | [];
  setNetworks: (networks: NetworkInfo[] | []) => void;
}

export const useAppStore = create<AppState>()(set => {
  const ddClient = useDockerDesktopClient();
  return {
    ddClient,
    containers: [],
    setContainers: (containers: ContainerInfo[] | []) => set({ containers }),
    networks: [],
    setNetworks: (networks: NetworkInfo[] | []) => set({ networks }),
  };
});
