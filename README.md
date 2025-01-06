sudo certbot certonly --manual --preferred-challenges dns -d tv1.technobar.by

sudo certbot certonly --manual --preferred-challenges dns -d tv1.technobar.by

sudo certbot certonly --standalone -d tv1.technobar.by

sudo certbot --nginx -d technobar.by -d "\*.technobar.by"

sudo certbot certonly --manual --preferred-challenges dns -d technobar.by -d "\*.technobar.by"

1. Зайдите в панель управления DNS вашего провайдера
   Войдите в аккаунт вашего регистратора домена или в панель управления DNS, где вы зарегистрировали домен technobar.by. Это может быть GoDaddy, Namecheap, DigitalOcean, или другой провайдер.

2. Перейдите в раздел управления DNS
   Найдите раздел, где можно управлять записями DNS. Обычно это называется DNS Management или DNS Zone Editor.

3. Создайте новую TXT-запись
   Добавьте новую TXT-запись с такими параметрами:

Имя (Host): \_acme-challenge.technobar.by
Тип записи: TXT
Значение (Text): E2P3yPzEkt9kqT3hxWBrFzOR273STJk4LeXOOxvvoSs
