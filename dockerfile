FROM node:lts-alpine3.22 AS build_stage

WORKDIR /app

COPY package*.json ./

RUN npm ci 

COPY . .

RUN npm run build

FROM nginx:alpine AS prod_stage

RUN adduser -D -H -u 1001 -s /sbin/nologin webuser

RUN mkdir -p /app/www

COPY --from=build_stage /app/dist /app/www

COPY nginx.conf /etc/nginx/templates/default.conf.template
RUN dos2unix /etc/nginx/templates/default.conf.template
RUN dos2unix /etc/nginx/conf.d/default.conf

COPY /src/env/env.sh /docker-entrypoint.d/env.sh

# Set Correct owership and permissions
RUN chown -R webuser:webuser /app/www && \
    chmod -R 755 /app/www && \
    chown -R webuser:webuser /etc/nginx/templates && \
    chmod -R 755 /etc/nginx/templates && \
    chown -R webuser:webuser /var/cache/nginx && \
    chown -R webuser:webuser /var/log/nginx && \
    chown -R webuser:webuser /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R webuser:webuser /docker-entrypoint.d && \
    chmod -R 755 /docker-entrypoint.d && \
    dos2unix /docker-entrypoint.d/env.sh && \
    chmod +x /docker-entrypoint.d/env.sh && \
    chown -R webuser:webuser /var/run/nginx.pid && \
    chmod -R 777 /etc/nginx/conf.d

EXPOSE 8086

# Tell nginx's template processing which variables to replace
ENV NGINX_ENVSUBST_TEMPLATE_DIR=/etc/nginx/templates
ENV NGINX_ENVSUBST_TEMPLATE_SUFFIX=.template
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/conf.d

#Switch to non root-user
USER webuser

ENTRYPOINT [ "/docker-entrypoint.sh" ]
CMD ["nginx", "-g", "daemon off;"]