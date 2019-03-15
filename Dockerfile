FROM tesseractshadow/tesseract4re:latest

WORKDIR /app

COPY . .

ARG BUILD_TIME
ENV BUILD_TIME=${BUILD_TIME}

RUN apt-get update
RUN apt-get install -y curl git gnupg make
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
RUN apt-get install -y nodejs

RUN npm i --production

EXPOSE 1120

CMD ["node", "."]
