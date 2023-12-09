FROM nginx:alpine3.18

COPY . /usr/share/nginx/html

WORKDIR /usr/share/nginx/html

RUN apk update && \
    apk add --no-cache nodejs npm && \
    npm install --legacy-peer-deps && \
    npm run build && \
    mkdir /vue-vocabulary && \
    mv dist/index.html /vue-vocabulary/ && \
    mv dist/assets /vue-vocabulary/

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]