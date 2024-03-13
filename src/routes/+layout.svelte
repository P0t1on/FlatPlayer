<script>
  import './style.scss';

  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', 'GTM-T8S2ZFFS');
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
  />
  <script
    src="https://raw.githubusercontent.com/LeaVerou/prefixfree/gh-pages/prefixfree.min.js"
  ></script>
</svelte:head>

<noscript>
  <iframe
    title="noscript"
    src="https://www.googletagmanager.com/ns.html?id=GTM-T8S2ZFFS"
    height="0"
    width="0"
    style="display:none;visibility:hidden"
  />
</noscript>
<slot />

<style lang="scss">
  :global(body, html) {
    margin: 0;
    height: 100%;
  }
</style>
