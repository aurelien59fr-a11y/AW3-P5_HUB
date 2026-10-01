(() => {
  const nom = (el) => (el.getAttribute('aria-label') || el.getAttribute('title') || (el.id && document.querySelector('label[for="' + el.id + '"]') && document.querySelector('label[for="' + el.id + '"]').textContent) || (el.closest('label') && el.closest('label').textContent) || el.getAttribute('placeholder') || '').trim();
  const res = { boutonsSansNom: [], champsSansNom: [], imgSansAlt: 0, lang: document.documentElement.lang };
  document.querySelectorAll('button, [role=button], [onclick]').forEach((b) => {
    if (b.getAttribute('aria-hidden') === 'true') return;
    const txt = (b.textContent || '').replace(/[^\p{L}\p{N}]/gu, '');
    if (!txt && !nom(b)) res.boutonsSansNom.push((b.outerHTML || '').slice(0, 90));
  });
  document.querySelectorAll('input:not([type=hidden]), select, textarea').forEach((i) => { if (!nom(i)) res.champsSansNom.push((i.id || i.name || i.outerHTML.slice(0, 70))); });
  document.querySelectorAll('img').forEach((i) => { if (!i.hasAttribute('alt')) res.imgSansAlt++; });
  res.boutonsSansNom = [...new Set(res.boutonsSansNom)];
  res.liens = [...document.querySelectorAll('label[for]')].map((l) => l.htmlFor + ' <= ' + l.textContent.trim().slice(0, 40));
  return res;
})()
