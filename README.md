# Перевыпуск сертификата в ручную

<!-- docker compose run --rm --entrypoint "" certbot certonly --webroot -w /var/www certbot --email cvi-vadim@yandex.ru -d cvirko-vadim.ru --agree-tos --force-renewal
docker compose run --rm --entrypoint certbot certonly --webroot -w /var/www --email cvi-vadim@yandex.ru -d cvirko-vadim.ru --agree-tos --force-renewal -->

docker compose run --rm --entrypoint "certbot certonly --webroot -w /var/www/certbot --email test@mail.ru -d cvirko-vadim.ru --agree-tos --force-renewal" certbot

#install docker compose

mkdir -p ~/.docker/cli-plugins

curl -sSL https://github.com/docker/compose/releases/download/v2.11.0/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose

chmod +x ~/.docker/cli-plugins/docker-compose

docker compose version

# Docker Compose version v2.11.0

# This will let you run docker compose in the new form `docker compose .f compose.yaml up`

# References: https://www.rockyourcode.com/how-to-install-docker-compose-v2-on-linux-2021/
