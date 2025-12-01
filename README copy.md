instal SSL

#

sudo apt update
sudo apt install certbot python3-certbot-nginx

#

sudo certbot --nginx

sudo certbot certonly --webroot -w /bartech -d cvirko-vadim.ru -d laptop1.cvirko-vadim.ru -d tv1.cvirko-vadim.ru -d phone2.cvirko-vadim.ru -d laptop2.cvirko-vadim.ru -d tv2.cvirko-vadim.ru -d phone.cvirko-vadim.ru

docker-compose run --rm certbot certonly --webroot -w /var/www/certbot -d cvirko-vadim.ru -d laptop1.cvirko-vadim.ru -d tv1.cvirko-vadim.ru -d phone2.cvirko-vadim.ru -d laptop2.cvirko-vadim.ru -d tv2.cvirko-vadim.ru -d phone.cvirko-vadim.ru

docker-compose run --rm certbot certonly \
 --manual \
 --preferred-challenges dns \
 -d '\*.cvirko-vadim.ru' -d cvirko-vadim.ru \
 --email test@mail.ru \
 --agree-tos \
 --no-eff-email
