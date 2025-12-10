// Инициализация базового скрипта TikTok Pixel (без загрузки конкретного пикселя)
export const initTikTokPixel = () => {
  if (typeof window !== 'undefined' && !window.ttq) {
    !(function (w, d, t) {
      var ttq = (w[t] = w[t] || []);
      ttq.methods = [
        'track',
        'page',
        'track',
        'identify',
        'instances',
        'debug',
        'on',
        'off',
        'once',
        'ready',
        'alias',
        'group',
        'enableCookie',
        'disableCookie',
      ];
      ttq.setAndDefer = function (t, e) {
        t[e] = function () {
          t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
        };
      };
      for (var i = 0; i < ttq.methods.length; i++)
        ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function (t) {
        for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++)
          ttq.setAndDefer(e, ttq.methods[n]);
        return e;
      };
      ttq.load = function (e, n) {
        var i = 'https://analytics.tiktok.com/i18n/pixel/events.js';
        (ttq._i = ttq._i || {}),
          (ttq._i[e] = []),
          (ttq._i[e]._u = i),
          (ttq._t = ttq._t || {}),
          (ttq._t[e] = +new Date()),
          (ttq._o = ttq._o || {}),
          (ttq._o[e] = n || {});
        var o = document.createElement('script');
        (o.type = 'text/javascript'),
          (o.async = !0),
          (o.src = i + '?sdkid=' + e + '&lib=' + t);
        var a = document.getElementsByTagName('script')[0];
        a.parentNode.insertBefore(o, a);
      };
      w.TiktokAnalyticsObject = t;
    })(window, document, 'ttq');
  }
};

// Универсальная функция для загрузки пикселей на landing страницах
export const loadTikTokPixels = (pixelIds) => {
  if (typeof window === 'undefined') return;
  
  // Инициализируем базовый скрипт
  initTikTokPixel();
  
  // Функция для загрузки пикселей
  const loadPixels = () => {
    if (window.ttq && Array.isArray(pixelIds)) {
      pixelIds.forEach((pixelId) => {
        if (pixelId) {
          window.ttq.load(pixelId);
        }
      });
      window.ttq.page();
    } else if (window.ttq) {
      // Если передан не массив, а один пиксель
      window.ttq.load(pixelIds);
      window.ttq.page();
    } else {
      // Повторяем попытку через небольшую задержку
      setTimeout(loadPixels, 100);
    }
  };
  
  loadPixels();
};

export const loadTikTokPixel = (pixelId) => {
  if (typeof window !== 'undefined') {
    // Инициализируем базовый скрипт, если еще не инициализирован
    initTikTokPixel();
    
    !(function (w, d, t) {
      var ttq = (w[t] = w[t] || []);
      ttq.methods = [
        'track',
        'page',
        'track',
        'identify',
        'instances',
        'debug',
        'on',
        'off',
        'once',
        'ready',
        'alias',
        'group',
        'enableCookie',
        'disableCookie',
      ];
      ttq.setAndDefer = function (t, e) {
        t[e] = function () {
          t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
        };
      };
      for (var i = 0; i < ttq.methods.length; i++)
        ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function (t) {
        for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++)
          ttq.setAndDefer(e, ttq.methods[n]);
        return e;
      };
      ttq.load = function (e, n) {
        var i = 'https://analytics.tiktok.com/i18n/pixel/events.js';
        (ttq._i = ttq._i || {}),
          (ttq._i[e] = []),
          (ttq._i[e]._u = i),
          (ttq._t = ttq._t || {}),
          (ttq._t[e] = +new Date()),
          (ttq._o = ttq._o || {}),
          (ttq._o[e] = n || {});
        var o = document.createElement('script');
        (o.type = 'text/javascript'),
          (o.async = !0),
          (o.src = i + '?sdkid=' + e + '&lib=' + t);
        var a = document.getElementsByTagName('script')[0];
        a.parentNode.insertBefore(o, a);
      };
      w.TiktokAnalyticsObject = t;
      ttq.load(pixelId);
      ttq.page();
    })(window, document, 'ttq');
  }
};
