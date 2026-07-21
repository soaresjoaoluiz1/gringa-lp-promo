/* ============================================================
   GRINGA — Body Splash LP
   FAQ accordion + Menu mobile + Tracking (Meta Pixel + GA4)
   ============================================================ */

(function(){
  'use strict';

  /* ==================== CONFIG ==================== */
  /* Plugar quando tiver os IDs. Vazio = não dispara. */
  var META_PIXEL_ID = '';
  var GA4_ID = '';
  /* Toda fragrância (botão "Escolher X") leva pra esse checkout.
     Pode ser Kiwify, Hotmart, Shopify, etc.
     Use os params ?frag=aqua etc pra saber qual fragrância escolheram. */
  var CHECKOUT_URL = '#';
  /* ================================================ */

  /* ============= MENU MOBILE ============= */
  var hamb = document.getElementById('hamb');
  var menuMob = document.getElementById('menu-mob');
  if(hamb && menuMob){
    hamb.addEventListener('click', function(){
      var open = menuMob.hidden;
      menuMob.hidden = !open;
      hamb.setAttribute('aria-expanded', String(open));
      hamb.classList.toggle('is-open', open);
    });
    /* Fecha ao clicar em qualquer link interno */
    menuMob.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        menuMob.hidden = true;
        hamb.setAttribute('aria-expanded', 'false');
        hamb.classList.remove('is-open');
      });
    });
  }

  /* ============= FAQ ACCORDION ============= */
  document.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click', function(){
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var answerId = btn.getAttribute('aria-controls');
      var answer = document.getElementById(answerId);
      btn.setAttribute('aria-expanded', String(!expanded));
      if(answer){ answer.hidden = expanded; }
    });
  });

  /* ============= CTA CLICKS (todos os data-cta) ============= */
  /* Redireciona pra checkout + tracking */
  document.querySelectorAll('[data-cta]').forEach(function(el){
    el.addEventListener('click', function(e){
      var ctaName = el.getAttribute('data-cta') || 'generic';
      var frag = el.getAttribute('data-frag') || '';

      /* Pixel: dispara ViewContent (fragrância específica) ou InitiateCheckout (genérico) */
      if(window.fbq){
        if(frag){
          fbq('track', 'ViewContent', {
            content_name: 'Body Splash ' + frag.charAt(0).toUpperCase() + frag.slice(1),
            content_category: 'Fragrância',
            content_ids: [frag],
            content_type: 'product'
          });
        }
        fbq('track', 'InitiateCheckout', {
          content_name: 'Body Splash Gringa',
          content_category: 'Body Splash',
          source: ctaName,
          frag: frag || 'undefined'
        });
      }

      /* GA4: dispara select_item ou begin_checkout */
      if(window.gtag){
        if(frag){
          gtag('event', 'select_item', {
            item_list_name: 'fragrancias',
            items: [{ item_id: frag, item_name: 'Body Splash ' + frag, item_category: 'fragrância' }]
          });
        }
        gtag('event', 'begin_checkout', {
          source: ctaName,
          frag: frag || 'undefined'
        });
      }

      /* Redireciona pro checkout (se já tiver URL) */
      if(CHECKOUT_URL && CHECKOUT_URL !== '#'){
        e.preventDefault();
        var url = CHECKOUT_URL;
        if(frag){ url += (url.indexOf('?') > -1 ? '&' : '?') + 'frag=' + encodeURIComponent(frag); }
        window.location.href = url;
      }
      /* Se CHECKOUT_URL ainda for '#', o link nativo vai funcionar (ancora #fragrancias) */
    });
  });

  /* ============= PIXEL META + GA4 INIT ============= */
  function fbqInit(){
    if(!META_PIXEL_ID || window._grFbqDone) return;
    window._grFbqDone = true;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', META_PIXEL_ID);
    fbq('track', 'PageView');
  }
  function gtagInit(){
    if(!GA4_ID || window._grGaDone) return;
    window._grGaDone = true;
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA4_ID);
  }
  fbqInit(); gtagInit();

  /* ============= SMOOTH SCROLL extra (ancoras só) ============= */
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(function(a){
    a.addEventListener('click', function(e){
      var target = document.querySelector(a.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        /* Atualiza hash sem forçar salto */
        if(history.pushState){ history.pushState(null, '', a.getAttribute('href')); }
      }
    });
  });

  /* ============= MOTION — anima elementos ao entrar no viewport ============= */
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reducedMotion && 'IntersectionObserver' in window){
    var animEls = document.querySelectorAll('[data-animate]');
    if(animEls.length){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
      animEls.forEach(function(el){ io.observe(el); });
    }
  } else {
    /* Fallback: mostra tudo sem animar */
    document.querySelectorAll('[data-animate]').forEach(function(el){ el.classList.add('is-visible'); });
  }

  /* ============= HEADER shadow ao scrollar ============= */
  var header = document.querySelector('.header-v2');
  if(header){
    var onScroll = function(){
      if(window.scrollY > 8){ header.classList.add('is-scrolled'); }
      else { header.classList.remove('is-scrolled'); }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

})();
