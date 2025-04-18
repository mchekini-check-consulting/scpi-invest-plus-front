FROM nginx
COPY conf/default.conf /etc/nginx/conf.d/default.conf
COPY dist/scpi-invest-plus-front/browser /usr/share/nginx/html
