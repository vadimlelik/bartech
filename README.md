sudo certbot certonly --manual --preferred-challenges dns -d tv1.cvirko-vadim.ru

sudo certbot certonly --manual --preferred-challenges dns -d tv1.cvirko-vadim.ru

sudo certbot certonly --standalone -d tv1.cvirko-vadim.ru

sudo certbot --nginx -d cvirko-vadim.ru -d "\*.cvirko-vadim.ru"

sudo certbot certonly --manual --preferred-challenges dns -d cvirko-vadim.ru -d "\*.cvirko-vadim.ru"

1. Зайдите в панель управления DNS вашего провайдера
   Войдите в аккаунт вашего регистратора домена или в панель управления DNS, где вы зарегистрировали домен cvirko-vadim.ru. Это может быть GoDaddy, Namecheap, DigitalOcean, или другой провайдер.

2. Перейдите в раздел управления DNS
   Найдите раздел, где можно управлять записями DNS. Обычно это называется DNS Management или DNS Zone Editor.

3. Создайте новую TXT-запись
   Добавьте новую TXT-запись с такими параметрами:

Имя (Host): \_acme-challenge.cvirko-vadim.ru
Тип записи: TXT
Значение (Text): E2P3yPzEkt9kqT3hxWBrFzOR273STJk4LeXOOxvvoSs
