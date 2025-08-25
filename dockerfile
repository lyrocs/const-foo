FROM node:current-alpine3.22

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
    else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && yarn install; \
    fi

COPY . .

EXPOSE 3000

CMD npm run start