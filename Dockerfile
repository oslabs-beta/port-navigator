FROM --platform=$BUILDPLATFORM node:18.9-alpine3.16 AS client-builder
WORKDIR /ui
# cache packages in layer
COPY ui/package.json /ui/package.json
COPY ui/package-lock.json /ui/package-lock.json
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
# install
COPY ui /ui
RUN npm run build

FROM --platform=$BUILDPLATFORM node:18.9-alpine3.16
LABEL org.opencontainers.image.title="PortNavigator" \
    org.opencontainers.image.description="Networking Tool for network visualization and configurations. " \
    org.opencontainers.image.vendor="PortNavigator" \
    com.docker.desktop.extension.api.version="1.0.1" \
    com.docker.desktop.extension.icon="https://res.cloudinary.com/dbinuhocd/image/upload/v1690916975/PortNavigatorLarge_qijsks.png" \
    com.docker.extension.screenshots='[{"alt":"Home Page", "url":"assets/HomePage.JPG"}, {"alt":"AddNetwork", "url":"assets/AddNetwork.jpg"}, {"alt":"EditPorts", "url":"assets/EditPorts.JPG"},{"alt":"Visualization","url":"assets/Sankey.jpg"}]' \
    com.docker.extension.detailed-description="PortNavigator supports users with Docker networking configurations through a Docker Desktop GUI that enables modification of gateways, subnets, IP addresses, and container port mappings. The GUI also minimizes the need for command line interactions and provides visualizations of existing networks and containers. " \
    com.docker.extension.publisher-url="https://portnavigatornet.firebaseapp.com/" \
    com.docker.extension.additional-urls='[{"title":"GitHub", "url":"https://github.com/oslabs-beta/port-navigator"}]' \
    com.docker.extension.changelog="Minor cleanup" \
    com.docker.extension.categories="utility-tools, networking"

COPY metadata.json .
COPY assets/PortNavigator.svg .
COPY --from=client-builder /ui/dist ui
