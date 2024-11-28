sudo certbot certonly --manual --preferred-challenges dns -d tv1.cvirko-vadim.ru

sudo certbot certonly --manual --preferred-challenges dns -d tv1.cvirko-vadim.ru

sudo certbot certonly --standalone -d tv1.cvirko-vadim.ru

sudo certbot --nginx -d cvirko-vadim.ru -d "\*.cvirko-vadim.ru"

sudo certbot certonly --manual --preferred-challenges dns -d cvirko-vadim.ru -d "\*.cvirko-vadim.ru"
