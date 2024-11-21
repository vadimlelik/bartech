docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot --agree-tos --email cvi-vadim@yandex.ru -d cvirko-vadim.ru -d phone.cvirko-vadim.ru

docker-compose run --rm certbot certbot certonly --webroot --webroot-path=/var/www/certbot --email cvi-vadim@yandex.ru --agree-tos -d cvirko-vadim.ru -d phone.cvirko-vadim.ru
