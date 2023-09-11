# Development Tools

CTRI-G Docker Desktop Extension (Adrian, Brandon, Clayton, Wes)

### To build the extension image

```
docker build --tag=portnavigator/port-navigator:latest .
```

### To install the extension

```
docker extension install portnavigator/port-navigator:latest
```

### To update the extension

```
docker extension update portnavigator/port-navigator:latest
```

### Enable front-end debug mode

```
docker extension dev debug portnavigator/port-navigator
```

## Hot reloading

1. navigate to ui folder
2. npm start
3. While server is running, in a separate termianal run:

```
docker extension dev ui-source portnavigator/port-navigator http://localhost:3000
```

### Disable debug mode, hot reloading, etc.

```
docker extension dev reset portnavigator/port-navigator
```

### Prepare a Buildx

```
docker buildx create --name=buildx-multi-arch --driver=docker-container --driver-opt=network=host
```

### Build for Validation Testing

```
docker buildx build --builder=buildx-multi-arch --platform=linux/amd64,linux/arm64 --build-arg TAG=1.0.3 --tag=portnavigator/port-navigator:1.0.3 .
```

### Build & Push Extension to DockerHub

```
docker buildx build --push --builder=buildx-multi-arch --platform=linux/amd64,linux/arm64 --build-arg TAG=1.0.3 --tag=portnavigator/port-navigator:1.0.3 .
```

# CLI commands to know

### prune networks

https://docs.docker.com/engine/reference/commandline/network_prune/

```
docker network prune [OPTIONS]
```

--filter Provide filter values (e.g. until=<timestamp>)

--force , -f Do not prompt for confirmation

### create a new network

https://docs.docker.com/engine/reference/commandline/network_create/

```
docker network create [OPTIONS] <network name>
```

--attachable Enable manual container attachment

--aux-address Auxiliary IPv4 or IPv6 addresses used by Network driver ?

--config-from The network from which to copy the configuration ?

--config-only Create a configuration only network

--driver , -d bridge Driver to manage the Network

--gateway IPv4 or IPv6 Gateway for the master subnet

--ingress Create swarm routing-mesh network --internal Restrict external access
to the network

--ip-range Allocate container ip from a sub-range

--ipam-driver IP Address Management Driver ?

--ipam-opt Set IPAM driver specific options --ipv6 Enable IPv6 networking ?

--label Set metadata on a network

--opt , -o Set driver specific options

--scope Control the network’s scope

--subnet Subnet in CIDR format that represents a network segment

### remove a network

https://docs.docker.com/engine/reference/commandline/network_rm/

```
docker network rm <network name>
```

### connect a container to a network

https://docs.docker.com/engine/reference/commandline/network_connect/

```
docker network connect [OPTIONS] <network name> <container name>
```

--alias Add network-scoped alias for the container ?

--driver-opt driver options for the network

-ip IPv4 address (e.g., 172.30.100.104)

--ip6 IPv6 address (e.g., 2001:db8::33)

--link Add link to another container

--link-local-ip Add a link-local address for the container

### disconnect a container from a network

https://docs.docker.com/engine/reference/commandline/network_disconnect/

```
docker network disconnect [OPTIONS] <network name> <container name>
```

--force , -f Force the container to disconnect from a network

### run a container

https://docs.docker.com/engine/reference/commandline/run/

```
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
```

--expose Expose a port or a range of ports

--ip IPv4 address (e.g., 172.30.100.104) specify an ip address for the container
you are connecting to

--ip6 IPv6 address (e.g., 2001:db8::33)

--name Assign a name to the container

--network Connect a container to a network

--network-alias Add network-scoped alias for the container

--publish , -p Publish a container’s port(s) to the host publish and allow
connection to host
