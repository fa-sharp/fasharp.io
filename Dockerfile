# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.12.2

FROM node:${NODE_VERSION}-slim as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

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
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prod=false

# Copy application code
COPY . .

# Build application
RUN --mount=type=cache,id=astro,target=/app/node_modules/.astro pnpm run build

# Remove development dependencies
RUN pnpm prune --prod


# Final stage for app image
FROM node:${NODE_VERSION}-slim as run
WORKDIR /app
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/migrations ./migrations
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist .
ENV NODE_ENV=production

CMD ["server/entry.mjs"]