FROM nginx:alpine3.18

WORKDIR /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

RUN apk update && \
    apk add --no-cache nodejs npm

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]