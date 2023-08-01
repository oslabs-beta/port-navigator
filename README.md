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

## Hot relaoding

1. navigate to ui folder
2. npm run dev
3. While server is running, in a separate termianal run:

docker extension dev ui-source ctri17g/port-navigator http://localhost:3000
