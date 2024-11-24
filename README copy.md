instal SSL

#

sudo apt update
sudo apt install certbot python3-certbot-nginx

#

sudo certbot --nginx

sudo certbot certonly --webroot -w /bartech -d technobar.by -d laptop1.technobar.by -d tv1.technobar.by -d phone2.technobar.by -d laptop2.technobar.by -d tv2.technobar.by -d phone.technobar.by

docker-compose run --rm certbot certonly --webroot -w /var/www/certbot -d technobar.by -d laptop1.technobar.by -d tv1.technobar.by -d phone2.technobar.by -d laptop2.technobar.by -d tv2.technobar.by -d phone.technobar.by
