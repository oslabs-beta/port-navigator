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
    com.docker.desktop.extension.api.version=">=0.3.4" \
    com.docker.desktop.extension.icon="https://res.cloudinary.com/dbinuhocd/image/upload/v1690916975/PortNavigatorLarge_qijsks.png" \
    com.docker.extension.screenshots='[{"alt":"Home Page", "url":"https://res.cloudinary.com/dbinuhocd/image/upload/v1693008684/HomePage_kziq3d.jpg"}, {"alt":"AddNetwork", "url":"https://res.cloudinary.com/dbinuhocd/image/upload/v1693008684/AddNetwork_bjqmtd.jpg"}, {"alt":"EditPorts", "url":"https://res.cloudinary.com/dbinuhocd/image/upload/v1693008684/EditPorts_di3izu.jpg"},{"alt":"Visualization","url":"https://res.cloudinary.com/dbinuhocd/image/upload/v1693008684/Sankey_z9kuol.jpg"}]' \
    com.docker.extension.detailed-description="PortNavigator supports users with Docker networking configurations through a Docker Desktop GUI that enables modification of gateways, subnets, IP addresses, and container port mappings. The GUI also minimizes the need for command line interactions and provides visualizations of existing networks and containers. " \
    com.docker.extension.publisher-url="https://portnavigatornet.firebaseapp.com/" \
    com.docker.extension.additional-urls='[{"title":"GitHub", "url":"https://github.com/oslabs-beta/port-navigator"}]' \
    com.docker.extension.changelog="Marketplace Images" \
    com.docker.extension.categories="utility-tools, networking"

COPY metadata.json .
COPY assets/PortNavigator.svg .
COPY --from=client-builder /ui/dist ui
