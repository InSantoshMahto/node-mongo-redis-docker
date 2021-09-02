FROM node:14

# Create app directory
WORKDIR /usr/src

# Install app dependencies
COPY package.json yarn.lock ./

# If you are building your code for production
RUN yarn --frozen-lockfile --production

# Bundle app source
COPY . .

# Set environment
ENV NODE_ENV=production

# Export the port
EXPOSE ${PORT}

# Run default cmd
CMD [ "node", "index.js" ]