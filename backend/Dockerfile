FROM node:10.15-alpine

WORKDIR /usr/src/app

# ENV PATH /node_modules/.bin:$PATH
COPY package*.json ./
RUN npm install
ADD . /usr/src

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ENV NODE_ENV $NODE_ENV

EXPOSE 2000

CMD [ "npm", "run", "start" ]