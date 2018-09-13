FROM node:9

#RUN npm install -g webpack webpack-cli ts-loader

WORKDIR /usr/src/app
COPY . /usr/src/app/

RUN yarn

ENV NODE_ENV=production
ENV PORT=3000
CMD ./start
EXPOSE 3000