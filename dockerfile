FROM node:lts-alpine3.22 AS build_stage

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

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

# Set Correct owership and permissions
RUN chown -R webuser:webuser /app/www && \
    chmod -R 755 /app/www && \
    chown -R webuser:webuser /etc/nginx/templates && \
    chmod -R 755 /etc/nginx/templates && \
    chown -R webuser:webuser /var/cache/nginx && \
    chown -R webuser:webuser /var/log/nginx && \
    chown -R webuser:webuser /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R webuser:webuser /var/run/nginx.pid && \
    chmod -R 777 /etc/nginx/conf.d

EXPOSE 8086

# Tell nginx's template processing which variables to replace
ENV NGINX_ENVSUBST_TEMPLATE_DIR=/etc/nginx/templates
ENV NGINX_ENVSUBST_TEMPLATE_SUFFIX=.template
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/conf.d
ENV PORT=8086

#Switch to non root-user
USER webuser

CMD ["nginx", "-g", "daemon off;"]