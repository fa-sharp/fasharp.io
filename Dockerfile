# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.12.2
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Astro"

# Astro app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install pnpm
ARG PNPM_VERSION=9.1.4
RUN npm install -g pnpm@$PNPM_VERSION


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY --link package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

# Copy application code
COPY --link . .

# Build application
RUN pnpm run build

# Remove development dependencies
RUN pnpm prune --prod


# Final stage for app image
FROM alpine:latest as static
RUN apk add --update zip
RUN wget https://redbean.dev/redbean-original-2.2.com -O redbean.com
RUN chmod +x redbean.com
RUN sh ./redbean.com --assimilate

COPY --from=build /app/dist /assets
WORKDIR /assets
RUN zip -r /redbean.com *

EXPOSE 80
CMD /redbean.com -vv -p 80

# FROM nginx

# # Copy built application
# COPY --from=build /app/dist /usr/share/nginx/html

# Start the server by default, this can be overwritten at runtime
# EXPOSE 80
# CMD [ "/usr/sbin/nginx", "-g", "daemon off;" ]
