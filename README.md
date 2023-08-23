<!-- -------- Current README --------- -->

# PortNavigator

<!-- -------- Table of Contents Section --------- -->

<!-- TODO: Will need to link section names by clicking on them on GitHub here -->

## Table of Contents

<ol>
      <br />
    <li><a href="#product-description">About PortNavigator</a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#in-development">In Development</a></li>
    <li><a href="#contributing">Contributing</a></li> 
    <li><a href="#license">License</a></li>
    <li><a href="#authors">Authors</a></li>
    <li><a href="#troubleshooting">Troubleshooting</a></li>
  </ol>

<!-- -------- Product Description Section --------- -->

## Product Description

Tired of struggling with complex Docker network configurations? Meet Port Navigator, your stress-free solution for effortlessly managing container
communication through our user-friendly GUI.

Upon installation, our (extension? application?) provides an instant snapshot of all available networks and their associated containers.Connecting and disconnecting containers from networks is as easy as a few clicks. Need a new network? With Port Navigator, network management tasks such as adding, deleting, and configuration are all simplified within our (extension? application?). No more relying on command line interactions, we've included everything you need to maintain your (network?container?) infrastructure efficiently.We also included a built-in visualization tool that provides a clear, bird's-eye view of your (container? netowrk? )ecosystem.

<!-- -------- Features --------- -->

## Features

<!-- -------- Instructions Section --------- -->

## Instructions

There are two ways to install PortNavigator, both of which are explained below.

### Installation through the Docker Desktop Extension Marketplace

PortNavigator is a published extension of the Docker Desktop Extension Marketplace. To install PortNavigator this way, you can

1. Open the Docker Desktop Application
2. Click 'Add Extensions'
3. Use the search bar to search for 'PortNavigator'
4. Click the 'Install' button

### Installation through the command line

You can also install PortNavigator directly through the command line. To install PortNavigator this way, you can

1. Fork and clone this repository
2. Build the extension image using

<!-- TO DO:  change the commands to not include ctri17g? -->

```
docker build --tag=ctri17g/port-navigator:latest .
```

3. Install the extension using
<!-- TO DO:  change the commands to not include ctri17g? -->

```
docker extension install ctri17g/port-navigator:latest
```

## Installation for development

If you are installing PortNavigator for development purposes, there are some additional commands it may be helpful to use.

1. Fork and clone this repository
2. Build the extension image using

<!-- TO DO:  change the commands to not include ctri17g? -->

```
docker build --tag=ctri17g/port-navigator:latest .
```

3. Install the extension using
<!-- TO DO:  change the commands to not include ctri17g? -->

```
docker extension install ctri17g/port-navigator:latest
```

4. Update the extension using
<!-- TO DO:  change the commands to not include ctri17g? -->

```
docker extension update ctri17g/port-navigator:latest
```

5. Enable front-end debugging mode using
<!-- TO DO:  change the commands to not include ctri17g? -->

```
docker extension dev debug ctri17g/port-navigator
```

6. Enable hot reloading by
   a. Navigating to the UI folder
   b. Running

   ```
   npm start
   ```

   c. In a separate terminal, running
   <!-- TO DO:  change the commands to not include ctri17g? -->

   ```
   docker extension dev ui-source ctri17g/port-navigator http://localhost:3000

   ```

<!-- -------- Technologies Used Section??? --------- -->

<!-- -------- Open Source Information Section --------- -->

<!-- -------- Changelog Section --------- -->

<!-- -------- License Information Section --------- -->

<!-- -------- Contributor Information Section --------- -->

## Contributor Information

<!-- TODO:  Everyone needs to add their links in here -->

Adrian ![add image alt text here](add your picture link here)
[GitHub](add your link to your GitHub profile here)
[LinkedIn](add your link to your LinkedIn profile here)

Brandon ![add image alt text here](add your picture link here)
[GitHub](add your link to your GitHub profile here)
[LinkedIn](add your link to your LinkedIn profile here)

Clayton ![add image alt text here](add your picture link here)
[GitHub](add your link to your GitHub profile here)
[LinkedIn](add your link to your LinkedIn profile here)

Wes ![add image alt text here](add your picture link here)
[GitHub](https://github.com/booksandgames)
[LinkedIn](add your link to your LinkedIn profile here)

<!-- -------- FAQ Section --------- -->

<!-- -------- Previous README --------- -->

# port-navigator

CTRI-G Docker Desktop Extension (Adrian, Brandon, Clayton, Wes)

## To build the extension image

docker build --tag=ctri17g/port-navigator:latest .

## To install the extension

docker extension install ctri17g/port-navigator:latest

## To update the extension

docker extension update ctri17g/port-navigator:latest

## Enable front-end debug mode

docker extension dev debug ctri17g/port-navigator

## Hot reloading

1. navigate to ui folder
2. npm start
3. While server is running, in a separate termianal run:

docker extension dev ui-source ctri17g/port-navigator http://localhost:3000

## Disable debug mode, hot reloading, etc.

docker extension dev reset ctri17g/port-navigator

# CLI commands to know

- prune networks: Remove all unused networks ?
  https://docs.docker.com/engine/reference/commandline/network_prune/ docker
  network prune [OPTIONS] --filter Provide filter values (e.g.
  until=<timestamp>) --force , -f Do not prompt for confirmation

# create a new network

? https://docs.docker.com/engine/reference/commandline/network_create/ docker
network create [OPTIONS] <network name> _--attachable Enable manual container
attachment --aux-address Auxiliary IPv4 or IPv6 addresses used by Network driver
?--config-from The network from which to copy the configuration ?--config-only
Create a configuration only network --driver , -d bridge Driver to manage the
Network _--gateway IPv4 or IPv6 Gateway for the master subnet --ingress Create
swarm routing-mesh network --internal Restrict external access to the network
_--ip-range Allocate container ip from a sub-range --ipam-driver IP Address
Management Driver ?--ipam-opt Set IPAM driver specific options --ipv6 Enable
IPv6 networking ?--label Set metadata on a network --opt , -o Set driver
specific options _--scope Control the network’s scope \*--subnet Subnet in CIDR
format that represents a network segment

## remove a network

? https://docs.docker.com/engine/reference/commandline/network_rm/ docker
network rm <network name>

## connect a container to a network

? https://docs.docker.com/engine/reference/commandline/network_connect/ docker
network connect [OPTIONS] <network name> <container name> _--alias Add
network-scoped alias for the container ?--driver-opt driver options for the
network _--ip IPv4 address (e.g., 172.30.100.104) --ip6 IPv6 address (e.g.,
2001:db8::33) --link Add link to another container --link-local-ip Add a
link-local address for the container

## disconnect a container from a network

? https://docs.docker.com/engine/reference/commandline/network_disconnect/
docker network disconnect [OPTIONS] <network name> <container name> --force , -f
Force the container to disconnect from a network

## run a container

? https://docs.docker.com/engine/reference/commandline/run/ docker run [OPTIONS]
IMAGE [COMMAND] [ARG...] --expose Expose a port or a range of ports --ip IPv4
address (e.g., 172.30.100.104) specify an ip address for the container you are
connecting to --ip6 IPv6 address (e.g., 2001:db8::33) --name Assign a name to
the container --network Connect a container to a network --network-alias Add
network-scoped alias for the container --publish , -p Publish a container’s
port(s) to the host publish and allow connection to host
