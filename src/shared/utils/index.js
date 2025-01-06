export const loadTikTokPixel = (pixelId) => {
  if (typeof window !== 'undefined') {
    !(function (w, d, t) {
      w.TiktokAnalyticsObject = t;
      var ttq = (w[t] = w[t] || []);
      ttq.methods = [
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
      for (var i = 0; i < ttq.methods.length; i++) {
        ttq.setAndDefer(ttq, ttq.methods[i]);
      }
      ttq.instance = function (t) {
        for (var e = ttq._i[ttq._i.length - 1]; e; ) return e;
      };
      ttq.load = function (e, t) {
        ttq._i = ttq._i || [];
        ttq._i.push(t || {});
        ttq._load =
          ttq._load ||
          function (e) {
            for (var t = 0; t < ttq._i.length; t++) ttq._i[t](e);
          };
        ttq._load(e);
      };
      ttq.load(pixelId);
      ttq.page();
    })(window, document, 'ttq');
  }
};
