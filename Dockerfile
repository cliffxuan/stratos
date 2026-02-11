FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html /usr/share/nginx/html/index.html
ENV PORT=8000
EXPOSE $PORT
CMD ["nginx", "-g", "daemon off;"]
