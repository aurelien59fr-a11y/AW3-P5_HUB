/* ============================================================
   app.js — AW3 Ploeg 5 Bradford Dashboard
   Contient : CSS (injecté dans <head>) + tout le JS
============================================================ */

// Injecter le CSS dynamiquement
(function(){
  var style = document.createElement('style');
  style.textContent = `
:root{--bg:#0f1117;--bg2:rgba(23,27,37,.84);--bg3:rgba(30,36,54,.84);--bd:rgba(255,255,255,0.07);--bd2:rgba(255,255,255,0.13);--tx:#e8eaf0;--tx2:#8b90a4;--tx3:#555c72;--blue:#3b82f6;--green:#10b981;--amber:#f59e0b;--red:#ef4444;--orange:#f97316;--fn:'Inter',sans-serif;--mo:'JetBrains Mono',monospace;--r:8px}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{overflow-x:hidden;max-width:100vw}
body{background-color:#05070c;background-image:linear-gradient(rgba(5,7,12,.5),rgba(5,7,12,.5)),url('icons/splash-pc.jpg?v=1');background-size:cover,cover;background-position:center,center;background-repeat:no-repeat,no-repeat;background-attachment:fixed,fixed;color:var(--tx);font-family:var(--fn);min-height:100vh;line-height:1.5;font-size:14px}
@media (max-width:768px){body{background-image:linear-gradient(rgba(5,7,12,.5),rgba(5,7,12,.5)),url('icons/splash-mobile.jpg?v=1');background-attachment:scroll,scroll}}

.topbar{display:flex;align-items:center;gap:16px;padding:0 24px;height:56px;background:var(--bg2);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--bd);position:sticky;top:0;z-index:100}
.logo{display:flex;align-items:center;gap:10px;font-size:15px;font-weight:600;letter-spacing:-.02em}
.logo-dot{width:28px;height:28px;border-radius:8px;object-fit:cover;display:block}
.logo-sub{font-size:12px;color:var(--tx3);font-weight:400}
.topbar-r{margin-left:auto;display:flex;align-items:center;gap:10px}
.badge{font-size:11px;padding:3px 10px;border-radius:20px;background:rgba(59,130,246,.15);color:var(--blue);border:1px solid rgba(59,130,246,.25);font-weight:500}
.chip{font-size:11px;color:var(--tx3);font-family:var(--mo)}
.tbtn{display:flex;align-items:center;gap:6px;padding:5px 12px;border-radius:var(--r);border:1px solid var(--bd2);background:none;color:var(--tx2);font-family:var(--fn);font-size:12px;font-weight:500;cursor:pointer;transition:all .15s;white-space:nowrap}
.tbtn:hover{background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);color:var(--tx)}
.save-lbl{font-size:11px;color:var(--tx3);font-family:var(--mo)}
.tabs{display:flex;flex-wrap:nowrap;background:var(--bg2);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--bd);padding:0 24px;overflow-x:auto;overflow-y:hidden;scroll-behavior:smooth;scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;scrollbar-width:thin;scrollbar-color:var(--bd2) transparent;cursor:grab;user-select:none}
.tabs.is-dragging{cursor:grabbing;scroll-behavior:auto;scroll-snap-type:none}
.tabs::-webkit-scrollbar{height:4px}
.tabs::-webkit-scrollbar-track{background:transparent}
.tabs::-webkit-scrollbar-thumb{background:var(--bd2);border-radius:99px}
.tabs::-webkit-scrollbar-thumb:hover{background:var(--tx3)}
.tab{flex:0 0 auto;scroll-snap-align:center;padding:0 20px;height:48px;background:none;border:none;color:var(--tx2);cursor:pointer;font-size:13px;font-family:var(--fn);font-weight:500;border-bottom:2px solid transparent;white-space:nowrap;transition:color .15s,border-color .15s;display:flex;align-items:center;gap:7px}
.tab:hover{color:var(--tx)}
.tab.on{color:var(--blue);border-bottom-color:var(--blue)}
.content{padding:28px 24px;flex:1}
.pane{display:none}
.pane.on{display:block;animation:fi .18s ease}
@keyframes fi{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
.sh{display:flex;align-items:baseline;gap:12px;margin-bottom:20px}
.st{font-size:18px;font-weight:600;letter-spacing:-.02em}
.ss{font-size:12px;color:var(--tx3)}
.kgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px}
.kcard{background:var(--bg2);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--bd);border-radius:12px;padding:16px 20px;position:relative;overflow:hidden}
.kcard::before{content:'';position:absolute;top:0;left:0;right:0;height:2px}
.kcard.bl::before{background:var(--blue)}.kcard.gn::before{background:var(--green)}.kcard.am::before{background:var(--amber)}.kcard.rd::before{background:var(--red)}
.klbl{font-size:11px;color:var(--tx3);font-weight:500;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px}
.kval{font-size:28px;font-weight:600;font-family:var(--mo);letter-spacing:-.03em;line-height:1;margin-bottom:4px}
.kcard.bl .kval{color:var(--blue)}.kcard.gn .kval{color:var(--green)}.kcard.am .kval{color:var(--amber)}.kcard.rd .kval{color:var(--red)}
.kmeta{font-size:11px;color:var(--tx3)}
.cc{background:var(--bg2);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--bd);border-radius:12px;padding:20px 24px;margin-bottom:20px}
.cch{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
.cct{font-size:14px;font-weight:600}
.two{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.cw{position:relative;width:100%}
.lgd{display:flex;gap:16px;flex-wrap:wrap}
.li{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--tx2)}
.ld{width:8px;height:8px;border-radius:50%}
.bt{width:100%;border-collapse:collapse}
.bt th{padding:10px 14px;text-align:left;font-size:11px;font-weight:500;color:var(--tx3);text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid var(--bd);white-space:nowrap}
.bt th:not(:first-child){text-align:right}
.bt td{padding:12px 14px;border-bottom:1px solid var(--bd);font-size:13px;vertical-align:middle}
.bt td:not(:first-child){text-align:right}
.bt tr:hover td{background:rgba(255,255,255,.02)}
.sbw{display:flex;align-items:center;gap:10px;justify-content:flex-end}
.sbt{width:80px;height:4px;background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-radius:2px;overflow:hidden}
.sbf{height:100%;border-radius:2px}
.sv{font-family:var(--mo);font-size:13px;font-weight:500;min-width:38px;text-align:right}
.pill{display:inline-flex;align-items:center;font-size:11px;font-weight:500;padding:3px 9px;border-radius:20px;white-space:nowrap}
.pill.ok{background:rgba(16,185,129,.12);color:var(--green)}
.pill.wn{background:rgba(245,158,11,.15);color:var(--amber)}
.pill.al{background:rgba(249,115,22,.15);color:var(--orange)}
.pill.cr{background:rgba(239,68,68,.15);color:var(--red)}
.sr td{background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)!important;color:var(--tx3);font-size:10px;text-transform:uppercase;letter-spacing:.08em;font-weight:600;padding:5px 14px}
.ptb{display:flex;align-items:center;gap:12px;margin-bottom:20px;flex-wrap:wrap}
.ytabs{display:flex;gap:4px}
.ytab{padding:5px 14px;border-radius:var(--r);border:1px solid var(--bd);background:none;font-size:12px;font-family:var(--fn);color:var(--tx2);cursor:pointer;font-weight:500;transition:all .15s}
.ytab.on{background:var(--blue);color:#fff;border-color:var(--blue)}
.pscroll{overflow-x:auto;border-radius:12px;border:1px solid var(--bd);background:var(--bg2);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
.ptable{border-collapse:collapse;font-size:12px;min-width:900px;width:100%}
.ptable th{padding:8px 10px;background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);color:var(--tx3);font-weight:500;font-size:10px;text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid var(--bd);white-space:nowrap;text-align:center}
.ptable th.nc{text-align:left;min-width:160px}
.ptable td{padding:5px 4px;border-bottom:1px solid var(--bd);text-align:center;white-space:nowrap}
.ptable td.nc{text-align:left;padding-left:14px;font-weight:500;color:var(--tx);position:sticky;left:0;background:var(--bg2);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);z-index:1;border-right:1px solid var(--bd)}
.ptable tr:hover td{background:rgba(255,255,255,.025)}
.ptable tr:hover td.nc{background:#1e2436}
.sp{display:inline-block;font-size:10px;font-weight:500;padding:2px 7px;border-radius:4px;font-family:var(--mo);cursor:pointer;transition:opacity .1s}
.sp:hover{opacity:.75}
.s-tl{background:rgba(99,102,241,.25);color:#a5b4fc;font-weight:700}
.s-coord{background:rgba(59,130,246,.18);color:#7eb3ff}
.s-31{background:rgba(16,185,129,.18);color:#5eddb7}
.s-33{background:rgba(45,212,191,.18);color:#5eeee3}
.s-35{background:rgba(167,139,250,.18);color:#c4adff}
.s-ex{background:rgba(107,114,128,.2);color:#9ca3af}
.s-pr{background:rgba(249,115,22,.18);color:#fda96a}
.s-lb{background:rgba(6,182,212,.18);color:#67e8f9}
.s-bt{background:rgba(236,72,153,.18);color:#f39dd4}
.s-cl{background:rgba(96,165,250,.18);color:#94c8ff}
.s-ip{background:rgba(52,211,153,.18);color:#7eefc9}
.s-bk{background:rgba(139,92,246,.18);color:#c4adff}
.s-zk{background:rgba(239,68,68,.18);color:#ff9090}
.s-vl{background:rgba(245,158,11,.18);color:#fcd26a}
.s-rc{background:rgba(245,158,11,.18);color:#fcd26a}
.s-aw1{background:rgba(239,68,68,.18);color:#fca5a5;font-weight:700}
.s-aw2{background:rgba(168,85,247,.18);color:#d8b4fe;font-weight:700}
.s-kt{background:rgba(168,131,89,.25);color:#e8c9a0;font-weight:700}.s-kr{background:rgba(132,204,22,.18);color:#bef264}
.s-em{background:rgba(255,255,255,.04);color:var(--tx3)}
.td-on{background:rgba(59,130,246,.18)!important;color:#7eb3ff!important}
.td-td{background:rgba(59,130,246,.07)!important}
.td-dot{width:5px;height:5px;border-radius:50%;background:var(--blue);margin:3px auto 0}
.lgbar{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}
.lch{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--tx2)}
#no-today{display:none;align-items:center;gap:8px;margin-top:12px;padding:10px 14px;background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.25);border-radius:8px;font-size:12px;color:var(--tx2)}
.popup{position:fixed;z-index:1000;background:var(--bg2);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--bd2);border-radius:10px;padding:8px;min-width:165px;box-shadow:0 8px 32px rgba(0,0,0,.5);display:none;max-height:min(70vh,420px);overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}
.ptit{font-size:10px;color:var(--tx3);font-weight:600;text-transform:uppercase;letter-spacing:.06em;padding:4px 6px 8px;border-bottom:1px solid var(--bd);margin-bottom:6px}
.popt{display:flex;align-items:center;gap:8px;padding:5px 6px;border-radius:6px;cursor:pointer;font-size:12px;color:var(--tx);transition:background .1s}
.popt:hover{background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
.popt .sp{font-size:10px;font-family:var(--mo);font-weight:500;padding:2px 6px;border-radius:4px;min-width:60px;text-align:center}
.pcancel{margin-top:6px;border-top:1px solid var(--bd);padding-top:6px;font-size:11px;color:var(--tx3);text-align:center;padding-bottom:2px;cursor:pointer}
.pcancel:hover{color:var(--tx)}
.toast{position:fixed;bottom:24px;right:24px;z-index:2000;background:var(--bg2);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--bd2);border-radius:10px;padding:12px 18px;font-size:13px;color:var(--tx);display:flex;align-items:center;gap:10px;box-shadow:0 8px 24px rgba(0,0,0,.5);animation:ti .2s ease;pointer-events:none}
@keyframes ti{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.tdot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.agrid{display:flex;flex-direction:column;gap:8px}
.arow{display:grid;grid-template-columns:180px 100px 100px 60px 1fr 100px;gap:12px;align-items:center;background:var(--bg2);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--bd);border-radius:var(--r);padding:12px 16px;min-width:640px}
.an{font-weight:500;font-size:13px}
.ad{font-size:12px;color:var(--tx2);font-family:var(--mo)}
.aj{font-family:var(--mo);font-size:13px;font-weight:500;color:var(--amber)}
.ab{height:4px;background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-radius:2px;overflow:hidden}
.abf{height:100%;background:var(--amber);border-radius:2px}
.ay{font-size:11px;color:var(--tx3);text-align:right}
.aflt{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}
.fb{padding:5px 12px;border-radius:20px;border:1px solid var(--bd);background:none;font-size:11px;font-family:var(--fn);color:var(--tx2);cursor:pointer;font-weight:500;transition:all .15s}
.fb.on{background:rgba(59,130,246,.15);color:var(--blue);border-color:rgba(59,130,246,.4)}
.ahdr{display:grid;grid-template-columns:180px 100px 100px 60px 1fr 100px;gap:12px;padding:0 16px 8px;min-width:640px}
.ascroll{overflow-x:auto}
.ahdr span{font-size:10px;color:var(--tx3);text-transform:uppercase;letter-spacing:.06em;font-weight:500}
.empty{text-align:center;padding:48px 0;color:var(--tx3);font-size:13px}
.pbtn{display:flex;align-items:center;gap:7px;padding:7px 16px;border-radius:var(--r);border:1px solid var(--bd2);background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);color:var(--tx);font-family:var(--fn);font-size:12px;font-weight:500;cursor:pointer;transition:background .15s}
.pbtn:hover{background:#2a3050}
::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-radius:3px}
.login-screen{position:fixed;inset:0;background:var(--bg);display:flex;align-items:center;justify-content:center;z-index:9999}
.login-box{background:var(--bg2);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--bd2);border-radius:16px;padding:40px 36px;width:360px;display:flex;flex-direction:column;gap:20px}
.login-logo{display:flex;align-items:center;gap:12px;margin-bottom:4px}
.login-logo .dot{width:36px;height:36px;border-radius:10px;object-fit:cover;display:block}
.login-title{font-size:18px;font-weight:600;letter-spacing:-.02em;color:var(--tx)}
.login-sub{font-size:12px;color:var(--tx3)}
.li-field{display:flex;flex-direction:column;gap:6px}
.li-label{font-size:11px;color:var(--tx3);font-weight:500;text-transform:uppercase;letter-spacing:.06em}
.li-input{background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--bd2);border-radius:8px;padding:10px 14px;font-size:13px;color:var(--tx);font-family:var(--fn);outline:none;transition:border-color .15s}
.li-input:focus{border-color:var(--blue)}
.li-btn{background:var(--blue);color:#fff;border:none;border-radius:8px;padding:11px;font-size:14px;font-weight:600;font-family:var(--fn);cursor:pointer;transition:background .15s}
.li-btn:hover{background:#2563eb}
.li-btn:disabled{background:#374151;cursor:not-allowed}
.li-err{font-size:12px;color:var(--red);min-height:16px;text-align:center}
#app-screen{flex-direction:column;min-height:100vh}
.sp-extra{display:inline-flex;align-items:center;justify-content:center;min-width:24px;padding:3px 8px;border-radius:6px;border:1px dashed var(--bd2);background:rgba(255,255,255,.03);color:var(--tx2);font-size:11px;cursor:pointer;white-space:nowrap}
.sp-extra:hover{border-color:var(--blue);color:var(--tx)}
.sp-extra.empty{color:var(--tx3)}
.sp-extra.filled{border:1px solid rgba(59,130,246,.5);background:rgba(59,130,246,.16);color:#7eb3ff;font-weight:600}
.sp-nett{display:inline-flex;align-items:center;justify-content:center;min-width:32px;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;transition:background .15s}
.sp-nett-empty{border:1px dashed var(--bd2);background:rgba(255,255,255,.03);color:var(--tx3)}
.sp-nett-empty:hover{border-color:var(--blue);color:var(--tx)}
.sp-nett-oui{background:rgba(16,185,129,.18);color:#10b981;border:1px solid rgba(16,185,129,.4)}
.sp-nett-non{background:rgba(239,68,68,.12);color:#ef4444;border:1px solid rgba(239,68,68,.3)}
.sp-note-dot{display:inline-flex;align-items:center;justify-content:center;min-width:24px;max-width:56px;padding:3px 7px;border-radius:6px;border:1px dashed var(--bd2);background:rgba(255,255,255,.03);color:var(--tx3);font-size:10px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sp-note-dot:hover{border-color:var(--amber);color:var(--tx)}
.sp-note-dot.filled{border:1px solid rgba(245,158,11,.5);background:rgba(245,158,11,.14);color:#f4c17a;font-weight:600}
.notes-panel{display:flex;flex-direction:column;gap:8px;margin-top:14px}
.notes-panel-title{font-size:11px;color:var(--tx3);text-transform:uppercase;letter-spacing:.06em}
.note-card{display:flex;flex-direction:column;gap:6px;background:var(--bg2);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--bd2);border-left:3px solid var(--amber);border-radius:8px;padding:10px 12px;cursor:pointer;transition:background .1s}
.note-card:hover{background:#1e2436}
.note-card-row{display:flex;gap:10px;align-items:flex-start}
.note-card-date{flex:none;font-family:var(--mo);font-size:11px;font-weight:700;color:var(--amber);min-width:40px;padding-top:2px}
.note-card-txt{flex:1;min-width:0;font-size:13px;color:var(--tx1);white-space:pre-wrap;word-break:break-word;line-height:1.4}
.note-translate-row{display:flex;gap:6px;flex:none}
.note-translate-btn{display:flex;align-items:center;justify-content:center;width:28px;height:20px;border-radius:4px;border:1px solid var(--bd2);background:rgba(255,255,255,.04);cursor:pointer;padding:0}
.note-translate-btn:hover{border-color:var(--blue)}
.note-translate-btn:disabled{opacity:.6;cursor:default}
.note-translation{display:none;gap:6px;align-items:flex-start;margin-top:2px;padding-top:8px;border-top:1px dashed var(--bd2);font-size:13px;color:var(--tx2);white-space:pre-wrap;word-break:break-word}
.note-translation .ntr-flag{flex:none;margin-top:2px}
@media (max-width:768px){
  .notes-panel{margin-top:10px}
  .note-card{padding:10px}
  .note-card-txt{font-size:13.5px}
}

/* ===== Responsive mobile ===== */
@media (max-width: 768px){
  .topbar{padding:0 12px;gap:8px;height:auto;min-height:56px;flex-wrap:wrap;padding-top:8px;padding-bottom:8px}
  .logo{font-size:13px;gap:8px}
  .logo-sub{font-size:11px}
  .topbar-r{gap:6px;flex-wrap:wrap;margin-left:0;width:100%;justify-content:flex-start}
  .chip{display:none}
  .tabs{padding:0 8px}
  main, .content, .wrap{padding:12px!important}
  .kgrid{grid-template-columns:repeat(2,1fr);gap:8px}
  .two{grid-template-columns:1fr;gap:12px}
  .ptable{min-width:700px}
}
@media (max-width: 480px){
  .kgrid{grid-template-columns:1fr;gap:8px}
  .login-logo .dot, .logo-dot{width:44px;height:44px}
}
/* ===== Barre d onglets defilante ===== */
.tabs-wrap{position:relative}
.tabs-wrap::before,.tabs-wrap::after{content:'';position:absolute;top:0;bottom:0;width:34px;pointer-events:none;opacity:0;transition:opacity .18s ease;z-index:3}
.tabs-wrap::before{left:0;background:linear-gradient(90deg,var(--bg2) 10%,rgba(0,0,0,0))}
.tabs-wrap::after{right:0;background:linear-gradient(270deg,var(--bg2) 10%,rgba(0,0,0,0))}
.tabs-wrap.can-l::before{opacity:1}
.tabs-wrap.can-r::after{opacity:1}
.tabs-nav{position:absolute;top:50%;transform:translateY(-50%);z-index:4;width:26px;height:26px;border-radius:99px;border:1px solid var(--bd2);background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);color:var(--tx2);cursor:pointer;display:none;align-items:center;justify-content:center;font-size:13px;line-height:1;padding:0}
.tabs-nav:hover{color:var(--tx);border-color:var(--blue)}
.tabs-nav.l{left:2px}
.tabs-nav.r{right:2px}
.tabs-wrap.can-l .tabs-nav.l{display:flex}
.tabs-wrap.can-r .tabs-nav.r{display:flex}

/* ===== Grille KPI a 5 cartes (onglet NCP) ===== */
.kcard.pu::before{background:#8b5cf6}
.kcard.pu .kval{color:#8b5cf6}
.kcard.pk::before{background:#ec4899}
.kcard.pk .kval{color:#ec4899}
.kgrid5{grid-template-columns:repeat(5,1fr)}
@media (max-width:1200px){.kgrid5{grid-template-columns:repeat(3,1fr)}}
@media (max-width:768px){.kgrid5{grid-template-columns:repeat(2,1fr)}}
@media (max-width:480px){.kgrid5{grid-template-columns:1fr}}
.kgrid6{grid-template-columns:repeat(6,1fr)}
@media (max-width:1400px){.kgrid6{grid-template-columns:repeat(3,1fr)}}
@media (max-width:768px){.kgrid6{grid-template-columns:repeat(2,1fr)}}
@media (max-width:480px){.kgrid6{grid-template-columns:1fr}}

/* ===== Selecteur de periode NCP ===== */
.ncp-date-input{padding:6px 10px;border-radius:var(--r);border:1px solid var(--bd2);background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);color:var(--tx);font-family:var(--fn);font-size:12px;color-scheme:dark}
.ncp-date-input:focus{outline:none;border-color:var(--blue)}
.ncp-preset-btn{padding:6px 12px;border-radius:99px;border:1px solid var(--bd2);background:none;color:var(--tx2);font-family:var(--fn);font-size:12px;cursor:pointer;transition:all .15s}
.ncp-preset-btn:hover{border-color:var(--blue);color:var(--tx)}
.ncp-preset-btn.on{background:var(--blue);border-color:var(--blue);color:#fff}

/* ===== Onglet Recrutement ===== */
#pane-recrutement .rec-subnav{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap}
#pane-recrutement .rec-subtab{padding:6px 16px;border-radius:var(--r);border:1px solid var(--bd);background:none;color:var(--tx2);font-family:var(--fn);font-size:12.5px;font-weight:600;cursor:pointer;transition:all .15s}
#pane-recrutement .rec-subtab.on{background:var(--blue);color:#fff;border-color:var(--blue)}
#pane-recrutement .rec-section{display:none}
#pane-recrutement .rec-section.on{display:block;animation:fi .18s ease}
#pane-recrutement label{display:block;font-size:11px;font-weight:600;color:var(--tx3);text-transform:uppercase;letter-spacing:.05em;margin:14px 0 6px}
#pane-recrutement label:first-child{margin-top:0}
#pane-recrutement input[type=text],#pane-recrutement input[type=date],#pane-recrutement textarea,#pane-recrutement select{width:100%;border:1px solid var(--bd2);border-radius:var(--r);padding:10px 11px;font-size:13.5px;font-family:var(--fn);color:var(--tx);background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
#pane-recrutement textarea{resize:vertical;min-height:56px}
#pane-recrutement select{color-scheme:dark}
#pane-recrutement .rec-axe{border-top:1px solid var(--bd);padding-top:14px;margin-top:14px}
#pane-recrutement .rec-axe:first-of-type{border-top:none;margin-top:0;padding-top:0}
#pane-recrutement .rec-axe-titre{font-weight:700;font-size:14px;margin-bottom:2px;color:var(--tx)}
#pane-recrutement .rec-axe-question{font-size:12.5px;color:var(--tx2);margin-bottom:10px;line-height:1.45}
#pane-recrutement .rec-toggle-reperes{background:none;border:none;color:var(--blue);font-size:11.5px;font-weight:600;padding:0;margin-bottom:10px;cursor:pointer;text-decoration:underline}
#pane-recrutement .rec-reperes{background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--bd);border-radius:8px;padding:10px 11px;margin-bottom:12px}
#pane-recrutement .rec-repere{display:flex;gap:9px;align-items:flex-start;font-size:12px;line-height:1.4;color:var(--tx2);margin-bottom:8px}
#pane-recrutement .rec-repere:last-child{margin-bottom:0}
#pane-recrutement .rec-repere-n{flex-shrink:0;width:20px;height:20px;border-radius:5px;color:#fff;font-weight:700;font-size:11px;display:flex;align-items:center;justify-content:center}
#pane-recrutement .rec-repere-n.rec-s1{background:var(--red)}
#pane-recrutement .rec-repere-n.rec-s3{background:var(--amber);color:#111}
#pane-recrutement .rec-repere-n.rec-s4{background:var(--green)}
#pane-recrutement .rec-scale{display:flex;gap:6px}
#pane-recrutement .rec-scale button{flex:1;padding:10px 0;border-radius:var(--r);border:1.5px solid var(--bd2);background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);font-weight:700;font-size:14px;color:var(--tx2);cursor:pointer}
#pane-recrutement .rec-scale button.sel{background:var(--blue);border-color:var(--blue);color:#fff}
#pane-recrutement .rec-scale-labels{display:flex;justify-content:space-between;font-size:10px;color:var(--tx3);margin-top:5px}
#pane-recrutement .rec-axe-note{margin-top:10px}
#pane-recrutement .rec-axe-note-label{font-size:11px;font-weight:600;color:var(--tx3);text-transform:uppercase;letter-spacing:.05em;margin:10px 0 5px}
#pane-recrutement .rec-btn{display:inline-flex;align-items:center;justify-content:center;background:var(--blue);color:#fff;border:none;padding:11px 16px;border-radius:var(--r);font-weight:600;font-size:13.5px;cursor:pointer;width:100%;font-family:var(--fn)}
#pane-recrutement .rec-btn.rec-rouge{background:var(--red)}
#pane-recrutement .rec-row{display:flex;gap:10px}
#pane-recrutement .rec-row>*{flex:1}
#pane-recrutement .rec-liste-item-wrap{display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--bd)}
#pane-recrutement .rec-liste-item-wrap:last-child{border-bottom:none}
#pane-recrutement .rec-liste-item{display:flex;justify-content:space-between;align-items:center;padding:13px 4px;cursor:pointer;flex:1}
#pane-recrutement .rec-liste-item .rec-nom{font-weight:700;font-size:14.5px;color:var(--tx)}
#pane-recrutement .rec-liste-item .rec-meta{font-size:11.5px;color:var(--tx3);margin-top:2px}
#pane-recrutement .rec-btn-suppr-mini{background:none;border:none;color:var(--tx3);font-size:16px;cursor:pointer;padding:8px;line-height:1}
#pane-recrutement .rec-btn-suppr-mini:hover{color:var(--red)}
#pane-recrutement .rec-empty{text-align:center;padding:40px 20px;color:var(--tx3)}
#pane-recrutement .rec-empty .rec-signe{font-size:32px;margin-bottom:8px}
#pane-recrutement .rec-verdict-choix{display:flex;gap:8px;flex-wrap:wrap}
#pane-recrutement .rec-verdict-choix button{flex:1;min-width:100px;padding:10px 6px;border-radius:var(--r);border:1.5px solid var(--bd2);background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);font-weight:600;font-size:12px;cursor:pointer;color:var(--tx2);font-family:var(--fn)}
#pane-recrutement .rec-verdict-choix button.sel-bon{background:var(--green);border-color:var(--green);color:#fff}
#pane-recrutement .rec-verdict-choix button.sel-creuser{background:var(--amber);border-color:var(--amber);color:#111}
#pane-recrutement .rec-verdict-choix button.sel-incompatible{background:var(--red);border-color:var(--red);color:#fff}
#pane-recrutement .rec-cc-item{display:flex;align-items:center;gap:10px;padding:9px 10px;border:1px solid var(--bd);border-radius:var(--r);background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);margin-bottom:8px}
#pane-recrutement .rec-cc-item input{width:16px;height:16px}
#pane-recrutement .rec-cc-item span{font-size:13px;font-weight:500;color:var(--tx)}
#pane-recrutement .rec-score-cell{font-weight:700;text-align:center;border-radius:5px;color:#fff;padding:2px 8px;display:inline-block;min-width:20px}
#pane-recrutement .rec-s1,#pane-recrutement .rec-s2{background:var(--red)}
#pane-recrutement .rec-s3{background:var(--amber);color:#111}
#pane-recrutement .rec-s4,#pane-recrutement .rec-s5{background:var(--green)}
#pane-recrutement .pill.rec-encours{background:rgba(139,146,164,.15);color:var(--tx2)}
#pane-recrutement .rec-mode-entretien-btn{display:flex;align-items:center;justify-content:center;gap:8px;background:#8b5cf6;color:#fff;border:none;border-radius:var(--r);padding:13px;font-weight:600;font-size:14px;cursor:pointer;width:100%;margin-bottom:16px;font-family:var(--fn)}
#pane-recrutement .rec-hidden{display:none!important}
.rec-io-overlay{position:fixed;inset:0;background:var(--bg);z-index:9997;display:flex;flex-direction:column}
.rec-io-overlay.rec-hidden{display:none!important}
.rec-io-top{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;background:var(--bg2);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);color:var(--tx);border-bottom:1px solid var(--bd);flex-shrink:0}
.rec-io-close{background:none;border:none;color:var(--tx);font-size:20px;cursor:pointer;padding:2px 6px}
.rec-io-progress{font-weight:700;font-size:12px;color:var(--blue);letter-spacing:.04em}
.rec-io-body{flex:1;overflow-y:auto;padding:22px 18px;max-width:640px;margin:0 auto;width:100%}
.rec-io-nav{display:flex;gap:10px;padding:14px 18px;border-top:1px solid var(--bd);background:var(--bg2);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);flex-shrink:0}
.rec-io-nav button:disabled{opacity:.4;cursor:default}
.rec-io-question-titre{font-size:19px;font-weight:700;margin-bottom:10px;line-height:1.25;color:var(--tx)}
.rec-io-question-txt{font-size:14px;color:var(--tx2);line-height:1.5;margin-bottom:16px}
.rec-io-body .rec-scale button{font-size:18px;padding:15px 0}
.rec-io-body label{display:block;font-size:11px;font-weight:600;color:var(--tx3);text-transform:uppercase;letter-spacing:.05em;margin-top:18px;margin-bottom:6px}
.rec-io-body textarea{width:100%;border:1px solid var(--bd2);border-radius:var(--r);padding:10px 11px;font-size:13.5px;font-family:var(--fn);color:var(--tx);background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);resize:vertical;min-height:56px}

/* ===== Ecran de demarrage (splash) ===== */
#splash-screen{
  position:fixed; inset:0; z-index:99999; display:flex; flex-direction:column; justify-content:flex-end; align-items:center;
  padding:0 0 48px; background:#05070c url('icons/splash-pc.jpg?v=1') no-repeat center/cover;
  transition:opacity .5s ease; opacity:1;
}
#splash-screen::before{
  content:''; position:absolute; inset:0;
  background:linear-gradient(180deg, rgba(5,7,12,.15) 0%, rgba(5,7,12,.35) 55%, rgba(5,7,12,.82) 100%);
}
@media (max-width:768px){ #splash-screen{background-image:url('icons/splash-mobile.jpg?v=1')} }
#splash-screen.splash-hide{opacity:0; pointer-events:none}
.splash-badge{
  position:absolute; top:22px; left:22px; z-index:1; display:flex; align-items:center; gap:9px;
  font-family:var(--fn); font-size:11.5px; font-weight:600; color:rgba(255,255,255,.8); letter-spacing:.02em;
}
.splash-badge img{width:22px;height:22px;border-radius:6px}
.splash-loader{position:relative; z-index:1; display:flex; flex-direction:column; align-items:center; gap:12px}
.splash-spinner{
  width:30px; height:30px; border-radius:50%;
  border:3px solid rgba(59,130,246,.2); border-top-color:var(--blue);
  animation:splash-spin .8s linear infinite;
}
@keyframes splash-spin{to{transform:rotate(360deg)}}
.splash-txt{font-family:var(--mo); font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:rgba(255,255,255,.75)}

/* ===== Navigation mobile (barre du bas) ===== */
.mobile-nav{display:none}
.mobile-menu-sheet{display:none}
@media (max-width:768px){
  .content{padding-bottom:90px!important}
  .mobile-nav{
    display:flex; position:fixed; left:0; right:0; bottom:0; z-index:500;
    padding:6px 4px calc(14px + env(safe-area-inset-bottom,0px)); gap:2px;
    background:rgba(23,27,37,.92); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
    border-top:1px solid var(--bd);
  }
  .mnav-item{
    flex:1; display:flex; flex-direction:column; align-items:center; gap:3px;
    padding:6px 2px 2px; color:var(--tx3); background:none; border:none; font-family:var(--fn);
    position:relative; cursor:pointer;
  }
  .mnav-item svg{width:19px;height:19px}
  .mnav-item .mnav-lbl{font-size:9.5px;font-weight:600;letter-spacing:-.005em}
  .mnav-item.on{color:var(--blue)}
  .mnav-item .mnav-bar{position:absolute;top:-6px;width:22px;height:3px;border-radius:99px;background:var(--blue);opacity:0}
  .mnav-item.on .mnav-bar{opacity:1}
  .mnav-item .mnav-dot{position:absolute;top:2px;right:calc(50% - 16px);width:7px;height:7px;border-radius:50%;background:var(--red);border:2px solid var(--bg2)}

  .mobile-menu-sheet{position:fixed;inset:0;z-index:600;display:none}
  .mobile-menu-sheet.on{display:block}
  .mms-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.6)}
  .mms-panel{
    position:absolute; left:0; right:0; bottom:0; max-height:72vh; overflow-y:auto;
    background:var(--bg2);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px); border-top:1px solid var(--bd); border-radius:20px 20px 0 0;
    padding:10px 8px calc(18px + env(safe-area-inset-bottom,0px));
  }
  .mms-handle{width:36px;height:4px;border-radius:99px;background:var(--bd2);margin:6px auto 14px}
  .mms-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--tx3);padding:0 12px 8px}
  .mms-item{
    display:flex; align-items:center; gap:12px; width:100%; padding:12px; border:none; background:none;
    color:var(--tx); font-family:var(--fn); font-size:14px; font-weight:600; text-align:left; border-radius:12px; cursor:pointer;
  }
  .mms-item:active{background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
  .mms-item.on{background:rgba(59,130,246,.12);color:var(--blue)}
  .mms-item svg{width:19px;height:19px;flex-shrink:0;color:var(--tx2)}
  .mms-item.on svg{color:var(--blue)}
}
@media (min-width:769px){
  .mobile-nav, .mobile-menu-sheet{display:none!important}
}

`;
  document.head.appendChild(style);
})();

// ============================================================
// CODE APPLICATIF
// ============================================================

var WEEKS26 = [
  {d:["01/01", "02/01", "03/01", "04/01"]},
  {d:["10/01", "11/01"]},
  {d:["17/01", "18/01"]},
  {d:["24/01", "25/01"]},
  {d:["31/01", "01/02"]},
  {d:["07/02", "08/02"]},
  {d:["14/02", "15/02"]},
  {d:["21/02", "22/02"]},
  {d:["28/02", "01/03"]},
  {d:["07/03", "08/03"]},
  {d:["14/03", "15/03"]},
  {d:["21/03", "22/03"]},
  {d:["28/03", "29/03"]},
  {d:["04/04", "05/04", "06/04"]},
  {d:["11/04", "12/04"]},
  {d:["18/04", "19/04"]},
  {d:["25/04", "26/04"]},
  {d:["01/05", "02/05", "03/05"]},
  {d:["09/05", "10/05"]},
  {d:["14/05", "15/05", "16/05", "17/05"]},
  {d:["23/05", "24/05", "25/05"]},
  {d:["30/05", "31/05"]},
  {d:["06/06", "07/06"]},
  {d:["13/06", "14/06"]},
  {d:["20/06", "21/06"]},
  {d:["27/06", "28/06"]},
  {d:["04/07", "05/07"]},
  {d:["11/07", "12/07"]},
  {d:["18/07", "19/07", "20/07", "21/07"]},
  {d:["25/07", "26/07"]},
  {d:["01/08", "02/08"]},
  {d:["08/08", "09/08"]},
  {d:["15/08", "16/08"]},
  {d:["22/08", "23/08"]},
  {d:["29/08", "30/08"]},
  {d:["05/09", "06/09"]},
  {d:["12/09", "13/09"]},
  {d:["19/09", "20/09"]},
  {d:["26/09", "27/09"]},
  {d:["03/10", "04/10"]},
  {d:["10/10", "11/10"]},
  {d:["17/10", "18/10"]},
  {d:["24/10", "25/10"]},
  {d:["31/10", "01/11"]},
  {d:["07/11", "08/11"]},
  {d:["11/11"]},
  {d:["14/11", "15/11"]},
  {d:["21/11", "22/11"]},
  {d:["28/11", "29/11"]},
  {d:["05/12", "06/12"]},
  {d:["12/12", "13/12"]},
  {d:["19/12", "20/12"]},
  {d:["25/12", "26/12", "27/12"]},
];

var WEEKS25 = [
  {d:["01/01"]},
  {d:["04/01", "05/01"]},
  {d:["11/01", "12/01"]},
  {d:["18/01", "19/01"]},
  {d:["25/01", "26/01"]},
  {d:["01/02", "02/02"]},
  {d:["08/02", "09/02"]},
  {d:["15/02", "16/02"]},
  {d:["22/02", "23/02"]},
  {d:["01/03", "02/03"]},
  {d:["08/03", "09/03"]},
  {d:["15/03", "16/03"]},
  {d:["22/03", "23/03"]},
  {d:["29/03", "30/03"]},
  {d:["05/04", "06/04"]},
  {d:["12/04", "13/04"]},
  {d:["19/04", "20/04", "21/04"]},
  {d:["26/04", "27/04"]},
  {d:["01/05", "02/05", "03/05", "04/05"]},
  {d:["10/05", "11/05"]},
  {d:["17/05", "18/05"]},
  {d:["24/05", "25/05"]},
  {d:["29/05", "30/05", "31/05", "01/06"]},
  {d:["07/06", "08/06", "09/06"]},
  {d:["14/06", "15/06"]},
  {d:["21/06", "22/06"]},
  {d:["28/06", "29/06"]},
  {d:["05/07", "06/07"]},
  {d:["12/07", "13/07"]},
  {d:["19/07", "20/07", "21/07"]},
  {d:["26/07", "27/07"]},
  {d:["02/08", "03/08"]},
  {d:["09/08", "10/08"]},
  {d:["15/08", "16/08", "17/08"]},
  {d:["23/08", "24/08"]},
  {d:["30/08", "31/08"]},
  {d:["06/09", "07/09"]},
  {d:["13/09", "14/09"]},
  {d:["20/09", "21/09"]},
  {d:["27/09", "28/09"]},
  {d:["04/10", "05/10"]},
  {d:["11/10", "12/10"]},
  {d:["18/10", "19/10"]},
  {d:["25/10", "26/10"]},
  {d:["01/11", "02/11"]},
  {d:["08/11", "09/11", "10/11", "11/11"]},
  {d:["15/11", "16/11"]},
  {d:["22/11", "23/11"]},
  {d:["29/11", "30/11"]},
  {d:["06/12", "07/12"]},
  {d:["13/12", "14/12"]},
  {d:["20/12", "21/12"]},
  {d:["25/12", "26/12", "27/12", "28/12"]},
];

var SHIFTS26 = [
  {n:"Aurelien Turchi",g:"TL",s:["TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","verlof","verlof","verlof","verlof","verlof","verlof","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL","TL"]},
  {n:"Nicolas Fettu",g:"INPAK",s:["coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","ziek","ziek","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","verlof","verlof","coordinateur","coordinateur","coordinateur","coordinateur","verlof","verlof","verlof","verlof","verlof","verlof","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur"]},
  {n:"Julien Demuyter",g:"INPAK",s:["coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","ziek","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","ziek","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","ziek","ziek","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","verlof","verlof","verlof","verlof","verlof","verlof","verlof","verlof","verlof","verlof","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur","coordinateur"]},
  {n:"Mohamed Lalaoui",g:"INPAK",s:["35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","ziek","ziek","ziek","ziek","extra","31/32","33/34","extra","35/36","ziek","ziek","ziek","ziek","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","verlof","verlof","verlof","verlof","verlof","verlof","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32"]},
  {n:"Ramazani Abdulhassan",g:"INPAK",s:["extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","ziek","ziek","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","verlof","35/36","33/34","31/32","33/34","extra","35/36","extra","verlof","verlof","verlof","verlof","verlof","verlof","33/34","verlof","35/36","verlof","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34"]},
  {n:"Halima Laadi",g:"INPAK",s:["31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","ziek","ziek","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","verlof","verlof","verlof","verlof","verlof","verlof","verlof","35/36","verlof","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra"]},
  {n:"Hakkim Akkouh",g:"INPAK",s:["33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","extra","extra","ziek","ziek","verlof","verlof","verlof","verlof","verlof","verlof","verlof","verlof","35/36","extra","31/32","33/34","verlof","35/36","verlof","31/32","33/34","verlof","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36"]},
  {n:"Balan Marius",g:"INPAK",s:["extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","verlof","verlof","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","verlof","verlof","verlof","verlof","verlof","verlof","verlof","31/32","33/34","verlof","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra","31/32","33/34","extra","35/36","extra"]},
  {n:"Lyse Musik",g:"INPAK",s:["Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","verlof","verlof","Labo","Labo","Labo","Labo","Labo","Labo","Labo","verlof","verlof","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","verlof","verlof","verlof","verlof","Labo","Labo","Labo","Labo","verlof","verlof","verlof","verlof","verlof","verlof","Labo","Labo","Labo","Labo","Labo","verlof","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo","Labo"]},
  {n:"Max Secember",g:"Prod",s:["Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","verlof","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","verlof","verlof","verlof","verlof","verlof","verlof","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod"]},
  {n:"Larissa Fratutescu",g:"Prod",s:["Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Labo","Labo","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Labo","Labo","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Labo","Labo","Labo","Labo","Prod","Prod","Prod","Prod","verlof","verlof","verlof","verlof","verlof","verlof","Prod","Prod","Prod","Prod","Prod","Labo","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod","Prod"]},
  {n:"Monir Salmi",g:"Unit",s:["Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","verlof","verlof","verlof","verlof","verlof","verlof","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning"]},
  {n:"Anthony Raimondi",g:"Unit",s:["Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","ziek","ziek","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","ziek","ziek","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","ziek","ziek","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","verlof","verlof","verlof","verlof","verlof","verlof","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","verlof","verlof","verlof","verlof","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak","Inpak"]},
  {n:"Brahim Akdim",g:"Unit",s:["Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","verlof","Cleaning","verlof","verlof","verlof","verlof","verlof","verlof","verlof","verlof","Batter","verlof","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter","Cleaning","Batter"]},
  {n:"Lachen Baraik",g:"Unit",s:["Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","ziek","ziek","ziek","ziek","ziek","ziek","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","verlof","verlof","verlof","verlof","verlof","verlof","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk","Bulk"]},
  {n:"Nettoyeur externe",g:"EXTRA",s:[]},
  {n:"Commentaire",g:"EXTRA",s:[]},
  {n:"Note",g:"EXTRA",s:[]},
];

var SHIFTS25 = [
  {n:"Aurelien Turchi",g:"TL",s:["TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL"]},
  {n:"Nicolas Fettu",g:"INPAK",s:["coordinateur", "ziek", "ziek", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "ziek", "ziek", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "ziek", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur"]},
  {n:"Julien Demuyter",g:"INPAK",s:["coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur"]},
  {n:"Mohamed Lalaoui",g:"INPAK",s:["35/36", "extra", "31/32", "33/34", "35/36", "extra", "31/32", "33/34", "35/36", "extra", "31/32", "33/34", "35/36", "extra", "31/32", "33/34", "35/36", "33/34", "35/36", "extra", "31/32", "33/34", "35/36", "extra", "31/32", "33/34", "extra", "31/32", "33/34", "35/36", "extra", "31/32", "33/34", "35/36", "extra", "31/32", "33/34", "35/36", "extra", "31/32", "33/34", "35/36", "extra", "31/32", "33/34", "35/36", "extra", "31/32", "33/34", "35/36", "extra", "31/32", "33/34", "35/36", "extra", "31/32", "33/34", "35/36", "extra", "31/32", "33/34", "35/36", "extra", "31/32", "33/34", "35/36", "extra", "31/32", "33/34", "35/36", "extra", "31/32", "33/34", "35/36", "ziek", "ziek", "33/34", "35/36", "extra", "31/32", "33/34", "35/36", "extra", "31/32", "33/34", "35/36"]},
  {n:"Ramazani Abdulhassan",g:"INPAK",s:["extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "ziek", "ziek", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32"]},
  {n:"Halima Laadi",g:"INPAK",s:["31/32", "33/34", "extra", "35/36", "31/32", "33/34", "extra", "35/36", "31/32", "33/34", "extra", "35/36", "31/32", "33/34", "extra", "35/36", "31/32", "35/36", "31/32", "33/34", "extra", "35/36", "31/32", "33/34", "extra", "35/36", "33/34", "ziek", "ziek", "31/32", "33/34", "extra", "35/36", "31/32", "33/34", "extra", "35/36", "31/32", "33/34", "extra", "35/36", "31/32", "33/34", "extra", "35/36", "31/32", "33/34", "extra", "35/36", "31/32", "33/34", "extra", "35/36", "31/32", "33/34", "extra", "35/36", "31/32", "ziek", "ziek", "35/36", "31/32", "33/34", "extra", "35/36", "31/32", "33/34", "extra", "35/36", "31/32", "33/34", "extra", "35/36", "31/32", "33/34", "extra", "35/36", "31/32", "33/34", "ziek", "35/36", "31/32", "33/34", "extra", "35/36", "31/32"]},
  {n:"Hakkim Akkouh",g:"INPAK",s:["33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra"]},
  {n:"Balan Marius",g:"INPAK",s:["extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "33/34", "extra", "35/36", "extra", "31/32", "ziek", "ziek", "35/36", "extra", "31/32", "33/34", "extra", "35/36"]},
  {n:"Lyse Musik",g:"INPAK",s:["Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "ziek", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo"]},
  {n:"Max Secember",g:"Prod",s:["Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "ziek", "ziek", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod"]},
  {n:"Larissa Fratutescu",g:"Prod",s:["Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Labo", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod"]},
  {n:"Monir Salmi",g:"Unit",s:["Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "ziek", "ziek", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter"]},
  {n:"Anthony Raimondi",g:"Unit",s:["Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "ziek", "ziek", "ziek", "ziek", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak"]},
  {n:"Brahim Akdim",g:"Unit",s:["Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning", "Batter", "Cleaning"]},
  {n:"Lachen Baraik",g:"Unit",s:["Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk"]},
  {n:"Nettoyeur externe",g:"EXTRA",s:[]},
  {n:"Commentaire",g:"EXTRA",s:[]},
  {n:"Note",g:"EXTRA",s:[]},
];

var currentUser=null;
 // historique des noms deja utilises pour le personnel extra (autocompletion)

// ===== i18n =====
// Etape 1 : squelette + chrome partage (login/topbar/nav) + onglet Planning.
// Les autres onglets restent a traduire au fur et a mesure (cle absente = repli automatique sur le francais).
var I18N={
  fr:{
    login_email:'Email', login_password:'Mot de passe', login_btn:'Se connecter',
    login_forgot:'Mot de passe oublié ?', login_autoconnect:'Tu resteras connecté automatiquement', splash_loading:'Chargement...',
    topbar_connecting:'Connexion...', topbar_logout:'Déconnexion',
    tab_ov:'Vue d’ensemble', tab_br:'Bradford', tab_pl:'Planning', tab_ab:'Absences',
    tab_pt:'Pointages', tab_arrets:'Arrêts Inpak', tab_cmp2:'Comparaison', tab_admin:'Admin',
    nav_ov:'Accueil', nav_br:'Perf.', nav_pl:'Planning', nav_espace:'Espace', nav_ab:'Absences',
    nav_formations:'Form.', nav_pt:'Point.', nav_arrets:'Arrêts', nav_ncp:'Qualité', nav_recrutement:'Recrut.', nav_admin:'Admin', nav_menu:'Menu',
    plan_subtitle:'Cliquez sur un poste pour modifier', plan_all:'Tous', plan_all_btn:'Tout',
    plan_today:'Aujourd’hui', plan_print:'Imprimer', plan_no_today:'Aujourd’hui n’est pas un jour planifié.',
    legend_tl:'Team Leader', legend_coord:'Coordinateur', legend_aw1:'Equipe AW1', legend_aw2:'Equipe AW2',
    legend_ziek:'Maladie', legend_verlof:'Congé', legend_recup:'Récup',
    status_ok:'OK', status_wn:'A surveiller', status_al:'Preoccupant', status_cr:'Critique', legend_watch_short:'Surveiller',
    ov_title:'Tableau de bord', ov_subtitle:'365 derniers jours • Week-ends + fériés + ponts',
    ov_kcard_team:'Equipe', ov_kmeta_okpct:'OK',
    ov_crm_urgent:'Score > 500 urgent', ov_crm_none:'Score > 500 aucun',
    ov_alert_from:' est passé de ', ov_alert_to:' à ',
    ov_chart_bradford:'Scores Bradford', ov_chart_absences_trim:'Absences par trimestre',
    ov_chart_days_per_emp:'Jours d’absence par employé',
    ov_next30_title:'Absences — 30 prochains jours', ov_next30_none:'Aucune absence prevue dans les 30 prochains jours',
    ov_nextday_prefix:'Absents au prochain jour travaillé', ov_today_prefix:'Absents aujourd’hui', ov_today_allpresent:'Tout le monde est present ✅',
    ov_birthdays_title:'Anniversaires à venir', ov_birthday_happy:'Joyeux anniversaire !',
    ov_birthday_turns1:' fête ses ', ov_birthday_turns2:' ans aujourd’hui 🎉',
    ov_birthday_none:'Aucune date de naissance enregistrée — ajoutez-les dans Admin > Employés',
    ov_birthday_celebrated:'→ fêté le ', ov_birthday_years:'ans',
    ov_birthday_today_label:'Aujourd’hui !', ov_birthday_in_days:'dans ',
    ab_title:'Absences', ab_col_emp:'Employe', ab_col_start:'Debut', ab_col_end:'Fin',
    ab_col_days:'Jours', ab_col_intensity:'Intensite', ab_col_year:'Annee',
    ab_count_suffix:' absences 2025-2026', ab_empty:'Aucune absence maladie',
    modal_cancel:'Annuler', modal_import:'Importer',
    pt_subtitle:'Retards & anomalies tourniquet/pointeuse',
    pt_opt_all_types:'Tous types', pt_opt_retards:'Retards', pt_opt_anomalies_tourniquet:'Anomalies tourniquet',
    pt_opt_all_status:'Tous statuts', pt_opt_open:'Non traités', pt_opt_done:'Traités',
    pt_mark_all_done:'Tout marquer comme traité',
    pt_col_person:'Personne', pt_col_date:'Date', pt_col_type:'Type', pt_col_detail:'Détail', pt_col_status:'Statut',
    pt_type_retard:'⏰ Retard', pt_type_tourniquet:'⚠ Tourniquet',
    pt_status_open:'Non traité', pt_status_done:'Traité',
    pt_suspect_tooltip:'Suspect : heure matinale sans (J+1) — possible confusion avec le tourniquet de la veille (bug shift de nuit)',
    pt_empty:'Aucune anomalie', pt_render_error:'Erreur d’affichage : ',
    pt_banner_open_suffix:' anomalie(s) non traitée(s)', pt_banner_retards:' retard(s)',
    pt_banner_tourniquet:' anomalie(s) tourniquet', pt_banner_suspect:' suspecte(s) (bug nuit)',
    pt_none_open_filtered:'Aucune anomalie non traitée avec ces filtres', pt_everyone:'tout le monde',
    pt_confirm_mark1:'Marquer ', pt_confirm_mark2:' anomalie(s) comme traitée(s) (', pt_confirm_mark3:') ?\nCette action est faite en masse et peut être annulée ligne par ligne ensuite.',
    pt_firebase_unavailable:'Connexion Firebase non disponible',
    pt_marked_done_suffix:' anomalie(s) marquée(s) comme traitée(s)',
    pt_firebase_error_prefix:'Erreur Firebase : ', pt_generic_error_prefix:'Erreur : ',
    pt_modal_title:'Importer pointages Protime',
    arr_subtitle:'Lignes 31 a 36 — arrets avec raison et micro-arrets', eq_multi_hint:'clique plusieurs equipes pour les cumuler',
    tab_bulk:'Bulk & Bijlijn', bulk_subtitle:'Surproduction envoyee en bulkopvang et volumes remballes sur la bij-ligne',
    arr_ca_title:'Analyse des causes',
    arr_ca_hint:'Les 10 familles d\'arrets classees par temps perdu, avec la courbe du cumule : les premieres barres montrent ou se joue l\'essentiel. Clique une ligne du tableau pour deplier le detail de ses raisons. Le classement suit les filtres ligne, equipe et periode ci-dessus.',
    arr_ca_tri_duree:'Heures perdues', arr_ca_tri_nombre:'Nombre d\'arrets',
    arr_ca_th_cat:'Famille', arr_ca_th_raison:'Raison', arr_ca_th_duree:'Temps perdu',
    arr_ca_th_part:'Part', arr_ca_th_cumul:'Cumule', arr_ca_th_nb:'Arrets', arr_ca_th_moy:'Duree moy.',
    arr_ca_clic:'Clique une famille dans le tableau pour voir le detail de ses raisons.',
    arr_ca_filtrer:'Filtrer', arr_ca_heures:'Heures perdues', arr_ca_nombre:'Nombre d\'arrets',
    arr_ca_cumule:'Cumule',
    arr_bulk_title:'Periode analysee', arr_bulk_unit_note:'volumes en tonnes, moyennes en kg/h',
    arr_bulk_empty:'Aucune donnee bulk importee pour le moment.', arr_bulk_empty_per:'Aucun releve sur la periode selectionnee.',
    arr_bulk_total:'Total', arr_bulk_export:'Exporter CSV', arr_bulk_print:'Imprimer',
    arr_bulk_p7:'7 jours', arr_bulk_p30:'30 jours', arr_bulk_p90:'90 jours', arr_bulk_p180:'6 mois', arr_bulk_pannee:'Annee en cours', arr_bulk_pall:'Tout',
    arr_bulk_sur_title:'Surproduction envoyee en bulk',
    arr_bulk_sur_hint:'Produit envoye en bulkopvang faute de place sur ligne. Surproduction et noodafvoer comptes separement. P1-P2-P3 font 40 h/semaine, P4-P5 24 h : la colonne kg/h de poste est la seule comparaison honnete entre equipes. Les journees vont de 05h a 05h, comme les postes.',
    arr_bulk_bij_title:'Bijlijn / Kruiding emballe',
    arr_bulk_bij_hint:'Bulk de surproduction remballe sur la bij-ligne. Ce bulk ne vient pas forcement d\'AW3 ni du jour meme : ces volumes ne se comparent pas a ceux du bloc precedent, c\'est une activite a part.',
    arr_bulk_det_title:'Detail jour par jour',
    arr_bulk_th_eq:'Equipe', arr_bulk_th_std:'Surproduction (t)', arr_bulk_th_urg:'Noodafvoer (t)', arr_bulk_th_tot:'Total bulk (t)',
    arr_bulk_th_bij:'Bijlijn emballe (t)', arr_bulk_th_poste:'H. de poste', arr_bulk_th_act:'Activite',
    arr_bulk_th_moy:'kg / h de poste', arr_bulk_th_day:'Jour', arr_bulk_th_eqs:'Equipes',
    arr_bulk_k_std:'Surproduction', arr_bulk_k_urg:'Noodafvoer', arr_bulk_k_tot:'Total bulk',
    arr_bulk_k_bij:'Bijlijn emballe', arr_bulk_k_activite:'Activite', arr_bulk_k_moy:'Moyenne',
    arr_bulk_s_std:'Surproduction', arr_bulk_s_urg:'Noodafvoer', arr_bulk_s_bij:'Bijlijn emballe',
    arr_bulk_vs_prec:'vs periode precedente', arr_bulk_par_jour:'par jour avec releve',
    arr_bulk_jours:'jours', arr_bulk_equipes:'equipes',
    arr_bulk_h_sur:'h sur', arr_bulk_h_poste:'h de poste',
    arr_bulk_m_prec:'periode de comparaison',
    arr_bulk_m_trous:'jour(s) sans aucun releve sur la periode',
    arr_bulk_m_trous2:'un jour a zero n\'est pas forcement une bonne journee, ce peut etre un import manquant.',
    arr_bulk_m_rec:'Jour le plus charge en bulk', arr_bulk_m_eq:'Filtre equipe actif',
    arr_bulk_m_eq2:'seuls les releves des heures ou la selection etait en poste sont comptes.',
    arr_bulk_popup:'Autorise les fenetres pop-up pour imprimer le tableau.',
    arr_btn_diag:'Diagnostiquer les doublons', arr_btn_clean:'Nettoyer les doublons', arr_btn_import:'Importer Grafana',
    filter_all_fem:'Toutes', arr_p5_moi:'P5 (moi)', col_operator:'Operateur',
    arr_search_title:'Recherche precise', arr_search_from:'Du',
    arr_search_to:'Au (optionnel — laisse vide pour un seul jour)',
    arr_search_hour:'Heure (optionnel, seulement si "Au" est vide)',
    btn_search:'Rechercher', btn_reset:'Reinitialiser',
    arr_search_hint:'Un seul jour : remplis juste "Du" (+ Heure en option, fenetre de 30 min). Fourchette (ex: plusieurs weekends) : remplis "Du" et "Au".',
    arr_freq_title:'Frequence par ligne', arr_with_reason_title:'Arrets avec raison', arr_all_reasons:'Toutes les raisons',
    arr_compare_op_hint:'Duree moyenne par operateur pour cette raison — te permet de comparer',
    arr_micro_title:'Micro-arrets', arr_micro_show:'afficher le detail', arr_micro_hide:'masquer le detail',
    arr_no_data:'Aucune donnee importee — utilise le bouton "Importer Grafana".',
    arr_col_ligne:'Ligne', arr_col_with_reason:'Avec raison', arr_col_micro:'Micro-arrets',
    arr_col_date:'Date', arr_col_heure:'Heure', arr_col_duree:'Duree', arr_col_raison:'Raison',
    arr_none_with_reason:'Aucun arret avec raison sur ce filtre.',
    arr_limited_to1:'Limite aux ', arr_limited_to2:' plus recents (', arr_limited_to3:' au total)',
    arr_micro_none:'Aucun micro-arret sur ce filtre.',
    arr_micro_count_sep:' sur ', arr_micro_count_days:' jour(s))',
    arr_micro_col_number:'Nombre ce jour-la',
    arr_toast_no_duplicates:'Aucun doublon trouve',
    arr_confirm_delete1:'', arr_confirm_delete2:' entree(s) a supprimer (doublons + anciens micro-arrets non agreges). Continuer ? Cette action est irreversible.',
    arr_toast_deleting1:'Suppression de ', arr_toast_deleting2:' doublon(s) en cours…',
    arr_toast_deleted_suffix:' doublon(s) supprime(s)',
    arr_toast_error_lot1:'Erreur au lot ', arr_toast_error_lot2:'/', arr_toast_error_lot3:' : ',
    arr_modal_title:'Importer les arrets Inpak',
    cmp_subtitle:'Compare les equipes (P1 a P5) et les operateurs entre eux',
    cmp_period_to:'Au', cmp_all_lines:'Toutes les lignes',
    cmp_evolution_title:'Evolution mois par mois',
    cmp_evolution_hint:'Duree moyenne par mois, pour voir si ca s’ameliore ou pas dans le temps.',
    cmp_team_title:'Comparaison par equipe (P1 a P5)',
    cmp_team_hint:'Duree moyenne d’arret par equipe, pour la raison et la ligne selectionnees.',
    cmp_op_title:'Comparaison par operateur',
    cmp_op_hint:'Clique une equipe ci-dessus pour ne comparer que ses operateurs (ex: seulement P1 vs P2 en semaine).',
    cmp_all_teams:'Toutes equipes',
    cmp_resume_occ_suffix:' occurrence(s)', cmp_resume_of:' de "', cmp_resume_total:' — temps total : ',
    cmp_month_occurrences:' occurrence(s) ce mois-la',
    br_title:'Score Bradford', br_subtitle:'S² × D — temps réel',
    br_col_role:'Role', br_col_periods:'Periodes', br_col_status:'Statut',
    br_tooltip_history:'Voir historique', br_tooltip_comment:'Commentaire',
    br_comment_prefix:'Commentaire — ', br_comment_last_mod:'Derniere modif : ', br_comment_by:' par ',
    btn_save:'Enregistrer', br_comment_saved:'Commentaire enregistre', br_comment_deleted:'Commentaire supprime',
    br_days_suffix_1:' jour', br_days_suffix_n:' jours', br_episode_badge:'Episode',
    br_no_episode:'Aucun episode maladie dans les 365 derniers jours',
    br_stat_score:'Score', br_stat_episodes:'Episodes', br_stat_days:'Jours',
    br_comment_label:'Commentaire', br_comment_placeholder:'Cliquer pour ajouter un commentaire...',
    br_history_title:'Historique episodes (365j)', br_perso_introuvable:'Impossible de retrouver ton score Bradford (nom non reconnu). Contacte ton administrateur.',
    adm_title:'Administration', adm_subtitle:'Outils reserves a l’admin',
    adm_fb_test_title:'Fiabilite Firebase', adm_fb_test_btn:'Tester la connexion',
    adm_fb_rules_title:'Roles utilisateurs Firebase',
    adm_migration_title:'Migration initiale Firebase', adm_migration_status_none:'Non effectuee',
    adm_migration_btn:'Lancer la migration',
    adm_session_title:'Session active', adm_session_connected_as:'Connecte en tant que : ', adm_session_role:'Role : ',
    adm_excel_report_title:'Rapport mensuel Excel', adm_excel_report_btn:'Generer rapport Excel',
    adm_protime_import_title:'Importer depuis Protime', adm_protime_status_none:'Aucun import',
    adm_btn_check:'Verifier', adm_btn_import_planning:'Importer dans le planning',
    adm_btn_purge_protime:'Purger toutes les absences Protime',
    adm_emp_mgmt_title:'Gestion des employes', adm_btn_add:'+ Ajouter',
    adm_col_name:'Nom', adm_col_group:'Groupe', adm_col_actions:'Actions',
    adm_btn_edit:'Modifier', adm_btn_remove:'Retirer',
    adm_emp_modal_add_title:'Ajouter un employe', adm_emp_modal_edit_prefix:'Modifier ',
    adm_field_fullname:'Nom complet', adm_field_group:'Groupe', adm_field_role:'Role', adm_field_birthday:'Date de naissance',
    adm_placeholder_name:'Prenom Nom', adm_placeholder_role:'ex: Operateur',
    adm_err_name_required:'Le nom est obligatoire.', adm_err_role_required:'Le role est obligatoire.',
    adm_err_firebase_disconnected:'Firebase non connecte.', adm_saving:'Enregistrement...',
    adm_toast_saved_suffix:' enregistre !',
    adm_confirm_remove1:'Retirer ', adm_confirm_remove2:' de l’equipe ? Son historique Bradford sera conserve.',
    adm_toast_removed_suffix:' retire de l’equipe',
    err_generic_prefix:'Erreur: ',
    month_0:'Janvier', month_1:'Fevrier', month_2:'Mars', month_3:'Avril', month_4:'Mai', month_5:'Juin',
    month_6:'Juillet', month_7:'Aout', month_8:'Septembre', month_9:'Octobre', month_10:'Novembre', month_11:'Decembre',
    arr_limited_days1:'Limite aux ', arr_limited_days2:' plus recents jours (', arr_limited_days3:' jours au total)',
    plan_section_extra:'Divers / Extra',
    plan_row_extra_staff:'Personnel extra', plan_row_ext_cleaner:'Nettoyeur externe', plan_row_note:'Note',
    plan_notes_panel_title:'Notes du planning',
    extra_modal_title:'Personnel extra', extra_name_ph:'Nom', extra_add_btn:'+ Ajouter', extra_save_btn:'Enregistrer les modifications',
    extra_cancel_btn:'Annuler', extra_close_btn:'Fermer', extra_edit_title:'Modifier', extra_remove_title:'Supprimer',
    extra_empty_day:'Aucun ajout pour ce jour',
    note_modal_title:'Note visible', note_modal_hint:' — visible directement sur le planning, sans clic',
    note_placeholder:'Ecrire une note visible sur le planning...',
    note_del_btn:'Supprimer', note_close_btn:'Annuler', note_save_btn:'Enregistrer',
    note_translate_nl:'Traduire en néerlandais', note_translate_en:'Traduire en anglais',
    note_translate_error:'Traduction indisponible pour le moment',
    tab_espace:'Mon espace', espace_subtitle:'Tes pointages, tes absences et les NCP qui te concernent',
    espace_select_placeholder:'-- Choisir un employé --', espace_choose_prompt:'Choisis un employé ci-dessus pour voir son espace.',
    espace_no_fiche:'Aucune fiche employé associée à ton compte. Contacte ton Team Leader.', espace_of:'Espace de',
    espace_score_bradford:'SCORE BRADFORD', espace_days_absence:'jours d’absence', espace_periods:'période(s)',
    espace_msg_ok:'Situation excellente, merci pour ton engagement ! 👏', espace_msg_wn:'Ça reste sous contrôle, continue comme ça.',
    espace_msg_al:'Un point à surveiller ensemble.', espace_msg_cr:'Parlons-en ensemble pour t’accompagner.',
    espace_trend_down:'📉 En amélioration', espace_trend_up:'📈 À surveiller', espace_trend_stable:'➡️ Stable',
    espace_sec_formations:'Formations', espace_sec_retards:'Retards', espace_sec_ecarts:'Écarts pointeuse / tourniquet',
    espace_sec_absences:'Absences', espace_sec_ncp:'NCP le concernant',
    espace_no_retard:'✅ Aucun retard — parfait !', espace_no_ecart:'✅ Aucun écart — parfait !',
    espace_no_absence:'✅ Aucune absence enregistrée.', espace_no_ncp:'✅ Aucune NCP identifiée.', espace_no_formation:'Aucune formation enregistrée.',
    espace_ncp_note:'Opérateur précis affiché uniquement quand le planning ligne par ligne existe pour ce jour (week-ends/fériés) ; sinon, seule l’équipe P5 est indiquée. Limité à l’unité AW3.',
    espace_ncp_banner:'👏 {n} sur {total} détecté(s) directement par toi pendant ton poste — c’est beaucoup mieux que découvert plus tard !',
    espace_ncp_direct:'👍 Vu directement par toi', espace_ncp_late:'🔎 Découvert après coup (labo)', espace_ncp_equipe:'🤝 Équipe P5 (opérateur non précisé)',
    espace_form_upcoming:'À venir', espace_form_past:'Passée', espace_days_suffix:'jour(s)',
    espace_type_recup:'Récup',
    espace_type_ziek:'Maladie',
    espace_type_verlof:'Congé',
    tab_formations:'Formations', tab_ncp:'NCP Qualité', tab_recrutement:'Recrutement',
    ov_badge_employees:'employés', ov_formations_upcoming:'Formations à venir',
    espace_emp_label:'Employé',
    formations_subtitle:'Planification et rappels des formations du personnel',
    formations_btn_add:'+ Nouvelle formation', formations_upcoming:'À venir', formations_past:'Passées',
    formations_empty_upcoming:'Aucune formation à venir.', formations_empty_past:'Aucune formation passée.',
    formations_empty_30d:'Aucune formation dans les 30 prochains jours.', formations_all_team:"Toute l'équipe",
    formations_notif_singular:'Formation cette semaine', formations_notif_plural:'Formations cette semaine',
    formations_modal_title_new:'Nouvelle formation', formations_modal_title_edit:'Modifier la formation',
    formations_field_titre:'Titre', formations_field_date:'Date', formations_field_heure_debut:'Heure début',
    formations_field_heure_fin:'Heure fin', formations_field_lieu:'Lieu / formateur (optionnel)',
    formations_field_employes:'Employés concernés', formations_field_notes:'Notes (optionnel)',
    formations_placeholder_titre:'Ex: Formation sécurité incendie', formations_placeholder_lieu:'Ex: Salle de réunion, formateur externe...',
    formations_placeholder_notes:'Détails, matériel à prévoir...', formations_btn_delete:'Supprimer', formations_btn_save:'Enregistrer',
    formations_err_titre:'Le titre est obligatoire.', formations_err_date:'La date est obligatoire.',
    formations_toast_saved:'Formation enregistrée', formations_toast_deleted:'Formation supprimée',
    formations_confirm_delete:'Supprimer cette formation ?', formations_err_generic:'Erreur : ',
    comptes_emp_title:'Comptes employés',
    ncp_subtitle:'Non-conformités Inpak et Production — AW1, AW2, AW3', ncp_btn_import:'⇓ Importer données NCP',
    ncp_empty_title:'Aucune donnée NCP pour le moment',
    ncp_empty_desc:'Clique sur "Importer données NCP" ci-dessus et colle le contenu du fichier NCP_dataset_complet.json pour remplir cet onglet.',
    ncp_kpi_total:'Total NCP', ncp_kpi_prod:'Production', ncp_kpi_tonnes:'Tonnage bloqué', ncp_kpi_tonnes_meta:'total période filtrée',
    ncp_kpi_debloque:'NCP débloqués', ncp_kpi_sl_inpak:'NCP hors shift · Inpak', ncp_kpi_sl_prod:'NCP hors shift · Prod',
    ncp_periode_label:'Période', ncp_preset_tout:'Tout', ncp_preset_mois:'Mois en cours', ncp_preset_30:'30 jours',
    ncp_preset_90:'90 jours', ncp_preset_annee:'Année en cours', ncp_periode_reset_title:'Réinitialiser la période',
    ncp_du:'Du', ncp_au:'au', ncp_unite_label:'Unité', ncp_toutes:'Toutes', ncp_type_label:'Type', ncp_tous:'Tous',
    ncp_equipe_label:'Équipe', ncp_equipe_moi:'P5 (moi)',
    ncp_note1:"Note : l'équipe est déduite de l'heure de la fiche quand celle-ci est fiable, sinon de l'heure du défaut écrite dans le texte (marquée ~ dans la colonne Date).",
    ncp_note2:"Ce filtre sert à explorer les données, il ne constitue pas une comparaison de performance entre équipes.",
    ncp_couverture_text:"Couverture sur cette sélection : {att} fiches sur {tot} avec une équipe ({pct}%), dont {d} sur l'heure réelle de production, {x} sur une heure du texte ({pl} sous forme de plage) et {f} sur la seule heure d'encodage (fiabilité faible). {mu} fiches sont à cheval sur plusieurs postes : équipe principale + secondaire, au pro-rata du temps passé dans chaque poste. {n} non classées (déclarant nominatif).",
    ncp_pct_cloture:"{pct}% du total, à attribuer", ncp_debloque_meta:"{t} t libérées - {pct}% des fiches",
    ncp_pct_total:"{pct}% du total", ncp_pct_sanslabo:"{pct}% du total - à contrôler",
    ncp_tooltip_liste:"Cliquer pour voir la liste", date_range_sep:" au ",
    ncp_tooltip_ncp_concernes:"Cliquer pour voir les NCP concernés", tooltip_voir_notes:"Cliquer pour voir toutes les notes",
    ncp_decl_count:"{n} personnes, {tot} NCP, dont {rat} rattachables à une équipe via un bakorder partagé",
    ncp_decl_aucun:"Aucun NCP non classé sur cette période.", ncp_decl_unite_inconnue:"unité inconnue", ncp_decl_semaine:"semaine {s} / weekend {w}",
    ncp_liste_vide:"Aucun NCP", ncp_col_numero:"Numéro", ncp_col_date:"Date", ncp_col_unite:"Unité", ncp_col_ligne:"Ligne",
    ncp_col_type:"Type", ncp_col_declarant:"Déclarant", ncp_col_client:"Client", ncp_col_palettes:"Palettes", ncp_col_tonnage:"Tonnage", ncp_col_description:"Description",
    ncp_titre_total:"Total NCP", ncp_titre_inpak:"NCP Inpak", ncp_titre_prod:"NCP Production", ncp_titre_nonclasse:"NCP non classées",
    ncp_titre_tonnage:"NCP avec tonnage bloqué", ncp_titre_debloque:"NCP débloquées (libérées par la qualité)", ncp_titre_declare_par:"NCP déclarées par {n}",
    ncp_titre_debloques2:"NCP débloquées", ncp_titre_inpak_shift:"NCP Inpak (dans le shift)", ncp_titre_prod_shift:"NCP Production (dans le shift)",
    ncp_titre_hors_shift_inpak:"NCP hors shift - Inpak", ncp_titre_hors_shift_prod:"NCP hors shift - Production",
    badge_role_admin:'Admin', role_visiteur:'Visiteur (lecture seule)', role_employe:'Employé', role_souschef:'Sous-chef', role_acces_perso:'Accès personnalisé',
    ncp_limiter_200:'Limiter à 200', ncp_tout_afficher:'Tout afficher', ncp_aucune_recurrence:'Aucune récurrence (3 fois ou plus) sur cette sélection.',
    ncp_bloque_au_total:'{t} t bloquées au total', ncp_recurrence_titre:'Récurrence : {k}',
    ncp_delai_info:"Jours entre la création et la dernière mise à jour de la fiche. Moyenne {moy} j sur {n} fiches, {sup7} au-delà de 7 jours. {ns} fiches ne sont pas encore libérées par la qualité.",
    ncp_delai_l1:'0-2 j', ncp_delai_l2:'3-7 j', ncp_delai_l3:'8-14 j', ncp_delai_l4:'15-30 j', ncp_delai_l5:'plus de 30 j',
    ncp_cumul_label:'cumul', ncp_mentions_label:'mentions',
    arr_occurrences_de:'occurrence(s) de "{raison}" — temps total :', arr_min_suffix:'min',
    ncp_chart_evolution:'Évolution mensuelle', ncp_chart_causes:'Top 10 des causes',
    ncp_chart_causes_hint:'Motifs les plus fréquents — la courbe orange donne le cumul en %',
    ncp_chart_tonnage:'Tonnage bloqué par client', ncp_chart_tonnage_hint:'Impact matière réel, en tonnes, par client',
    ncp_chart_familles:'Familles de défauts',
    ncp_chart_familles_hint:"Les 457 motifs distincts regroupés en grandes familles — barres bleues : nombre de mentions, courbe orange : cumul en % sur l'axe de droite",
    ncp_chart_delai:'Délai de traitement', ncp_chart_lignes:'Top 10 lignes touchées',
    ncp_chart_lignes_hint:"Lignes véritablement en cause (NCP Inpak) — exclut les blocages en conséquence d'un problème Production",
    ncp_chart_produits:'Top 10 codes produit touchés', ncp_chart_produits_hint:'Produits les plus souvent impliqués dans un NCP',
    ncp_recurrences_title:'Récurrences à surveiller',
    ncp_recurrences_hint:'Même produit et même famille de défaut revenus au moins 3 fois sur la période filtrée. Clique sur une carte pour voir les NCP concernés.',
    ncp_declarants_title:'NCP déclarés par le personnel de semaine',
    ncp_declarants_hint:'Fiches non classées : déclarant nominatif (labo / qualité de semaine), équipe non attribuable. Clique sur un nom pour voir ses NCP, puis sur une ligne pour le détail du PDF.',
    ncp_liste_title:'Liste des NCP',
    ncp_search_placeholder:'Rechercher : numéro, produit, client, ligne, déclarant, bakorder ou un mot du problème...',
    ncp_btn_tout_afficher:'Tout afficher', ncp_btn_export_csv:'Export CSV',
    ncp_th_numero:'Numéro NCP', ncp_th_date:'Date', ncp_th_unite:'Unité', ncp_th_equipe:'Équipe', ncp_th_type:'Type',
    ncp_th_ligne:'Ligne', ncp_th_bakorder:'Bakorder', ncp_th_produit:'Produit', ncp_th_palettes:'Palettes',
    ncp_th_tonnage:'Tonnage', ncp_th_statut:'Statut', ncp_th_description:'Description',
    ncp_no_match:'Aucun NCP ne correspond à ces filtres.',
    ncp_truncated:'Affichage limité aux {n} plus récents sur {total}',
    rec_subtitle:'Grille d\u2019entretien mentalité — sécurité, fiabilité, motivation',
    modal_close:'Fermer', ncp_detail_title:'Détail du NCP',
    comptes_emp_empty:'Aucun employé Firebase trouvé.', role_admin:'Administrateur', role_subchef:'Sous-chef', role_custom:'Accès personnalisé',
    comptes_actif:'Compte actif', comptes_btn_modif_acces:"Modifier l'accès", comptes_btn_creer:'Créer un compte',
    comptes_edit_planning:'Peut modifier le planning', comptes_btn_enregistrer:'Enregistrer', comptes_btn_annuler:'Annuler',
    comptes_loading:'Chargement...', comptes_confirm_creer:'Créer le compte pour ', comptes_confirm_email:'Email : ',
    comptes_confirm_pass:'Mot de passe : ', comptes_confirm_role:'Rôle : ', comptes_confirm_onglets:'Onglets : ',
    comptes_confirm_planning:'Modifier planning : ', comptes_oui:'Oui', comptes_non:'Non',
    comptes_toast_cree:'Compte créé pour ', comptes_alert_cree:'Compte créé !\n\nEmail : ',
    comptes_alert_pass:'\nMot de passe : ', comptes_alert_communique:'\n\nCommunique ces identifiants à ',
    comptes_toast_err_creation:'Erreur création compte : ', comptes_acces_maj:'Accès mis à jour.', comptes_err_generic:'Erreur: '
  },
  nl:{
    login_email:'E-mail', login_password:'Wachtwoord', login_btn:'Aanmelden',
    login_forgot:'Wachtwoord vergeten?', login_autoconnect:'Je blijft automatisch aangemeld', splash_loading:'Laden...',
    topbar_connecting:'Verbinden...', topbar_logout:'Afmelden',
    tab_ov:'Overzicht', tab_br:'Bradford', tab_pl:'Planning', tab_ab:'Afwezigheden',
    tab_pt:'Tijdsregistraties', tab_arrets:'Inpak Stilstanden', tab_cmp2:'Vergelijking', tab_admin:'Admin',
    nav_ov:'Start', nav_br:'Prest.', nav_pl:'Planning', nav_espace:'Ruimte', nav_ab:'Afwez.',
    nav_formations:'Oplei.', nav_pt:'Uren', nav_arrets:'Stops', nav_ncp:'Kwalit.', nav_recrutement:'Werving', nav_admin:'Admin', nav_menu:'Menu',
    plan_subtitle:'Klik op een post om te wijzigen', plan_all:'Alle', plan_all_btn:'Alles',
    plan_today:'Vandaag', plan_print:'Afdrukken', plan_no_today:'Vandaag is geen geplande dag.',
    legend_tl:'Team Leader', legend_coord:'Coördinator', legend_aw1:'Team AW1', legend_aw2:'Team AW2',
    legend_ziek:'Ziekte', legend_verlof:'Verlof', legend_recup:'Recuperatie',
    status_ok:'OK', status_wn:'Te volgen', status_al:'Zorgwekkend', status_cr:'Kritiek', legend_watch_short:'Te volgen',
    ov_title:'Dashboard', ov_subtitle:'365 laatste dagen • Weekends + feestdagen + brugdagen',
    ov_kcard_team:'Team', ov_kmeta_okpct:'OK',
    ov_crm_urgent:'Score > 500 dringend', ov_crm_none:'Score > 500 geen',
    ov_alert_from:' ging van ', ov_alert_to:' naar ',
    ov_chart_bradford:'Bradford-scores', ov_chart_absences_trim:'Afwezigheden per kwartaal',
    ov_chart_days_per_emp:'Afwezigheidsdagen per medewerker',
    ov_next30_title:'Afwezigheden — volgende 30 dagen', ov_next30_none:'Geen geplande afwezigheid in de volgende 30 dagen',
    ov_nextday_prefix:'Afwezig eerstvolgende werkdag', ov_today_prefix:'Afwezig vandaag', ov_today_allpresent:'Iedereen is aanwezig ✅',
    ov_birthdays_title:'Verjaardagen binnenkort', ov_birthday_happy:'Gefeliciteerd!',
    ov_birthday_turns1:' wordt vandaag ', ov_birthday_turns2:' jaar 🎉',
    ov_birthday_none:'Geen geboortedatums geregistreerd — voeg ze toe in Admin > Medewerkers',
    ov_birthday_celebrated:'→ gevierd op ', ov_birthday_years:'jaar',
    ov_birthday_today_label:'Vandaag!', ov_birthday_in_days:'over ',
    ab_title:'Afwezigheden', ab_col_emp:'Medewerker', ab_col_start:'Start', ab_col_end:'Einde',
    ab_col_days:'Dagen', ab_col_intensity:'Intensiteit', ab_col_year:'Jaar',
    ab_count_suffix:' afwezigheden 2025-2026', ab_empty:'Geen ziekteafwezigheid',
    modal_cancel:'Annuleren', modal_import:'Importeren',
    pt_subtitle:'Laattijdigheden & prikklok-anomalieën',
    pt_opt_all_types:'Alle types', pt_opt_retards:'Laattijdigheden', pt_opt_anomalies_tourniquet:'Prikklok-anomalieën',
    pt_opt_all_status:'Alle statussen', pt_opt_open:'Niet verwerkt', pt_opt_done:'Verwerkt',
    pt_mark_all_done:'Alles als verwerkt markeren',
    pt_col_person:'Persoon', pt_col_date:'Datum', pt_col_type:'Type', pt_col_detail:'Detail', pt_col_status:'Status',
    pt_type_retard:'⏰ Laattijdig', pt_type_tourniquet:'⚠ Prikklok',
    pt_status_open:'Niet verwerkt', pt_status_done:'Verwerkt',
    pt_suspect_tooltip:'Verdacht: vroeg tijdstip zonder (J+1) — mogelijk verward met de prikklok van de avond ervoor (nachtploeg-bug)',
    pt_empty:'Geen anomalie', pt_render_error:'Weergavefout: ',
    pt_banner_open_suffix:' niet-verwerkte anomalie(ën)', pt_banner_retards:' laattijdigheid(en)',
    pt_banner_tourniquet:' prikklok-anomalie(ën)', pt_banner_suspect:' verdacht(e) (nachtbug)',
    pt_none_open_filtered:'Geen niet-verwerkte anomalie met deze filters', pt_everyone:'iedereen',
    pt_confirm_mark1:'Markeer ', pt_confirm_mark2:' anomalie(ën) als verwerkt (', pt_confirm_mark3:') ?\nDeze actie gebeurt in bulk en kan achteraf regel per regel ongedaan worden gemaakt.',
    pt_firebase_unavailable:'Firebase-verbinding niet beschikbaar',
    pt_marked_done_suffix:' anomalie(ën) gemarkeerd als verwerkt',
    pt_firebase_error_prefix:'Firebase-fout: ', pt_generic_error_prefix:'Fout: ',
    pt_modal_title:'Protime-tijdsregistraties importeren',
    arr_subtitle:'Lijnen 31 tot 36 — stilstanden met reden en micro-stilstanden', eq_multi_hint:'klik meerdere ploegen om ze samen te tellen',
    tab_bulk:'Bulk & Bijlijn', bulk_subtitle:'Overproductie naar de bulkopvang en volumes herverpakt op de bijlijn',
    arr_ca_title:'Oorzakenanalyse',
    arr_ca_hint:'De 10 stilstandfamilies gerangschikt op verloren tijd, met de cumulatieve curve : de eerste balken tonen waar het echt om draait. Klik op een rij om de detailredenen open te vouwen. De rangschikking volgt de filters lijn, ploeg en periode hierboven.',
    arr_ca_tri_duree:'Verloren uren', arr_ca_tri_nombre:'Aantal stilstanden',
    arr_ca_th_cat:'Familie', arr_ca_th_raison:'Reden', arr_ca_th_duree:'Verloren tijd',
    arr_ca_th_part:'Aandeel', arr_ca_th_cumul:'Cumulatief', arr_ca_th_nb:'Stilstanden', arr_ca_th_moy:'Gem. duur',
    arr_ca_clic:'Klik op een familie in de tabel om de detailredenen te zien.',
    arr_ca_filtrer:'Filteren', arr_ca_heures:'Verloren uren', arr_ca_nombre:'Aantal stilstanden',
    arr_ca_cumule:'Cumulatief',
    arr_bulk_title:'Geanalyseerde periode', arr_bulk_unit_note:'volumes in ton, gemiddelden in kg/u',
    arr_bulk_empty:'Nog geen bulkgegevens geimporteerd.', arr_bulk_empty_per:'Geen meting in de gekozen periode.',
    arr_bulk_total:'Totaal', arr_bulk_export:'CSV exporteren', arr_bulk_print:'Afdrukken',
    arr_bulk_p7:'7 dagen', arr_bulk_p30:'30 dagen', arr_bulk_p90:'90 dagen', arr_bulk_p180:'6 maanden', arr_bulk_pannee:'Lopend jaar', arr_bulk_pall:'Alles',
    arr_bulk_sur_title:'Overproductie naar bulk',
    arr_bulk_sur_hint:'Product naar de bulkopvang bij plaatsgebrek op lijn. Overproductie en noodafvoer apart geteld. P1-P2-P3 draaien 40 u/week, P4-P5 24 u : de kolom kg/u dienst is de enige eerlijke vergelijking tussen ploegen. Dagen lopen van 05u tot 05u, zoals de diensten.',
    arr_bulk_bij_title:'Bijlijn / Kruiding verpakt',
    arr_bulk_bij_hint:'Bulk overproductie herverpakt op de bijlijn. Die bulk komt niet noodzakelijk van AW3 en ook niet van dezelfde dag : deze volumes zijn niet vergelijkbaar met het vorige blok, het is een aparte activiteit.',
    arr_bulk_det_title:'Detail dag per dag',
    arr_bulk_th_eq:'Ploeg', arr_bulk_th_std:'Overproductie (t)', arr_bulk_th_urg:'Noodafvoer (t)', arr_bulk_th_tot:'Totaal bulk (t)',
    arr_bulk_th_bij:'Bijlijn verpakt (t)', arr_bulk_th_poste:'Uren dienst', arr_bulk_th_act:'Activiteit',
    arr_bulk_th_moy:'kg / u dienst', arr_bulk_th_day:'Dag', arr_bulk_th_eqs:'Ploegen',
    arr_bulk_k_std:'Overproductie', arr_bulk_k_urg:'Noodafvoer', arr_bulk_k_tot:'Totaal bulk',
    arr_bulk_k_bij:'Bijlijn verpakt', arr_bulk_k_activite:'Activiteit', arr_bulk_k_moy:'Gemiddelde',
    arr_bulk_s_std:'Overproductie', arr_bulk_s_urg:'Noodafvoer', arr_bulk_s_bij:'Bijlijn verpakt',
    arr_bulk_vs_prec:'t.o.v. vorige periode', arr_bulk_par_jour:'per dag met meting',
    arr_bulk_jours:'dagen', arr_bulk_equipes:'ploegen',
    arr_bulk_h_sur:'u van', arr_bulk_h_poste:'u dienst',
    arr_bulk_m_prec:'vergelijkingsperiode',
    arr_bulk_m_trous:'dag(en) zonder enige meting in de periode',
    arr_bulk_m_trous2:'een dag op nul is niet noodzakelijk een goede dag, het kan ook een ontbrekende import zijn.',
    arr_bulk_m_rec:'Zwaarste bulkdag', arr_bulk_m_eq:'Actieve ploegfilter',
    arr_bulk_m_eq2:'enkel de metingen van de uren waarop de selectie aan het werk was worden geteld.',
    arr_bulk_popup:'Sta pop-upvensters toe om de tabel af te drukken.',
    arr_btn_diag:'Duplicaten diagnosticeren', arr_btn_clean:'Duplicaten opruimen', arr_btn_import:'Grafana importeren',
    filter_all_fem:'Alle', arr_p5_moi:'P5 (ik)', col_operator:'Operator',
    arr_search_title:'Precieze zoekopdracht', arr_search_from:'Van',
    arr_search_to:'Tot (optioneel — laat leeg voor één dag)',
    arr_search_hour:'Uur (optioneel, enkel als "Tot" leeg is)',
    btn_search:'Zoeken', btn_reset:'Reset',
    arr_search_hint:'Één dag: vul enkel "Van" in (+ optioneel Uur, venster van 30 min). Periode (bv. meerdere weekends): vul "Van" en "Tot" in.',
    arr_freq_title:'Frequentie per lijn', arr_with_reason_title:'Stilstanden met reden', arr_all_reasons:'Alle redenen',
    arr_compare_op_hint:'Gemiddelde duur per operator voor deze reden — laat je vergelijken',
    arr_micro_title:'Micro-stilstanden', arr_micro_show:'detail tonen', arr_micro_hide:'detail verbergen',
    arr_no_data:'Geen gegevens geïmporteerd — gebruik de knop "Grafana importeren".',
    arr_col_ligne:'Lijn', arr_col_with_reason:'Met reden', arr_col_micro:'Micro-stilstanden',
    arr_col_date:'Datum', arr_col_heure:'Uur', arr_col_duree:'Duur', arr_col_raison:'Reden',
    arr_none_with_reason:'Geen stilstand met reden voor dit filter.',
    arr_limited_to1:'Beperkt tot de ', arr_limited_to2:' meest recente (', arr_limited_to3:' in totaal)',
    arr_micro_none:'Geen micro-stilstand voor dit filter.',
    arr_micro_count_sep:' van ', arr_micro_count_days:' dag(en))',
    arr_micro_col_number:'Aantal die dag',
    arr_toast_no_duplicates:'Geen duplicaten gevonden',
    arr_confirm_delete1:'', arr_confirm_delete2:' item(s) te verwijderen (duplicaten + oude niet-geaggregeerde micro-stilstanden). Doorgaan? Deze actie is onomkeerbaar.',
    arr_toast_deleting1:'Bezig met verwijderen van ', arr_toast_deleting2:' duplicaat(en)…',
    arr_toast_deleted_suffix:' duplicaat(en) verwijderd',
    arr_toast_error_lot1:'Fout bij batch ', arr_toast_error_lot2:'/', arr_toast_error_lot3:' : ',
    arr_modal_title:'Inpak-stilstanden importeren',
    cmp_subtitle:'Vergelijk de teams (P1 tot P5) en de operators onderling',
    cmp_period_to:'Tot', cmp_all_lines:'Alle lijnen',
    cmp_evolution_title:'Evolutie maand per maand',
    cmp_evolution_hint:'Gemiddelde duur per maand, om te zien of het verbetert of niet doorheen de tijd.',
    cmp_team_title:'Vergelijking per team (P1 tot P5)',
    cmp_team_hint:'Gemiddelde stilstandsduur per team, voor de geselecteerde reden en lijn.',
    cmp_op_title:'Vergelijking per operator',
    cmp_op_hint:'Klik op een team hierboven om enkel zijn operators te vergelijken (bv. enkel P1 vs P2 doordeweeks).',
    cmp_all_teams:'Alle teams',
    cmp_resume_occ_suffix:' voorval(len)', cmp_resume_of:' van "', cmp_resume_total:' — totale tijd: ',
    cmp_month_occurrences:' voorval(len) die maand',
    br_title:'Bradford-score', br_subtitle:'S² × D — realtime',
    br_col_role:'Rol', br_col_periods:'Periodes', br_col_status:'Status',
    br_tooltip_history:'Geschiedenis bekijken', br_tooltip_comment:'Opmerking',
    br_comment_prefix:'Opmerking — ', br_comment_last_mod:'Laatst gewijzigd: ', br_comment_by:' door ',
    btn_save:'Opslaan', br_comment_saved:'Opmerking opgeslagen', br_comment_deleted:'Opmerking verwijderd',
    br_days_suffix_1:' dag', br_days_suffix_n:' dagen', br_episode_badge:'Episode',
    br_no_episode:'Geen ziekte-episode in de laatste 365 dagen',
    br_stat_score:'Score', br_stat_episodes:'Episodes', br_stat_days:'Dagen',
    br_comment_label:'Opmerking', br_comment_placeholder:'Klik om een opmerking toe te voegen...',
    br_history_title:'Geschiedenis episodes (365d)', br_perso_introuvable:'Kan je Bradford-score niet vinden (naam niet herkend). Neem contact op met je beheerder.',
    adm_title:'Administratie', adm_subtitle:'Tools voorbehouden aan de admin',
    adm_fb_test_title:'Firebase-betrouwbaarheid', adm_fb_test_btn:'Verbinding testen',
    adm_fb_rules_title:'Firebase-gebruikersrollen',
    adm_migration_title:'Initiële Firebase-migratie', adm_migration_status_none:'Niet uitgevoerd',
    adm_migration_btn:'Migratie starten',
    adm_session_title:'Actieve sessie', adm_session_connected_as:'Aangemeld als: ', adm_session_role:'Rol: ',
    adm_excel_report_title:'Maandelijks Excel-rapport', adm_excel_report_btn:'Excel-rapport genereren',
    adm_protime_import_title:'Importeren vanuit Protime', adm_protime_status_none:'Geen import',
    adm_btn_check:'Controleren', adm_btn_import_planning:'Importeren in planning',
    adm_btn_purge_protime:'Alle Protime-afwezigheden wissen',
    adm_emp_mgmt_title:'Medewerkersbeheer', adm_btn_add:'+ Toevoegen',
    adm_col_name:'Naam', adm_col_group:'Groep', adm_col_actions:'Acties',
    adm_btn_edit:'Wijzigen', adm_btn_remove:'Verwijderen',
    adm_emp_modal_add_title:'Medewerker toevoegen', adm_emp_modal_edit_prefix:'Wijzigen ',
    adm_field_fullname:'Volledige naam', adm_field_group:'Groep', adm_field_role:'Rol', adm_field_birthday:'Geboortedatum',
    adm_placeholder_name:'Voornaam Naam', adm_placeholder_role:'bv: Operator',
    adm_err_name_required:'De naam is verplicht.', adm_err_role_required:'De rol is verplicht.',
    adm_err_firebase_disconnected:'Firebase niet verbonden.', adm_saving:'Bezig met opslaan...',
    adm_toast_saved_suffix:' opgeslagen!',
    adm_confirm_remove1:'', adm_confirm_remove2:' uit het team verwijderen? De Bradford-geschiedenis blijft bewaard.',
    adm_toast_removed_suffix:' verwijderd uit het team',
    err_generic_prefix:'Fout: ',
    month_0:'Januari', month_1:'Februari', month_2:'Maart', month_3:'April', month_4:'Mei', month_5:'Juni',
    month_6:'Juli', month_7:'Augustus', month_8:'September', month_9:'Oktober', month_10:'November', month_11:'December',
    arr_limited_days1:'Beperkt tot de ', arr_limited_days2:' meest recente dagen (', arr_limited_days3:' dagen in totaal)',
    plan_section_extra:'Diversen / Extra',
    plan_row_extra_staff:'Extra personeel', plan_row_ext_cleaner:'Externe schoonmaker', plan_row_note:'Notitie',
    plan_notes_panel_title:'Notities van de planning',
    extra_modal_title:'Extra personeel', extra_name_ph:'Naam', extra_add_btn:'+ Toevoegen', extra_save_btn:'Wijzigingen opslaan',
    extra_cancel_btn:'Annuleren', extra_close_btn:'Sluiten', extra_edit_title:'Wijzigen', extra_remove_title:'Verwijderen',
    extra_empty_day:'Niets toegevoegd voor deze dag',
    note_modal_title:'Zichtbare notitie', note_modal_hint:' — rechtstreeks zichtbaar op de planning, geen klik nodig',
    note_placeholder:'Schrijf een notitie die zichtbaar is op de planning...',
    note_del_btn:'Verwijderen', note_close_btn:'Annuleren', note_save_btn:'Opslaan',
    note_translate_nl:'Vertalen naar Nederlands', note_translate_en:'Vertalen naar Engels',
    note_translate_error:'Vertaling momenteel niet beschikbaar',
    tab_espace:'Mijn ruimte', espace_subtitle:'Je tijdsregistraties, afwezigheden en de NCP’s die jou aangaan',
    espace_select_placeholder:'-- Kies een werknemer --', espace_choose_prompt:'Kies hierboven een werknemer om zijn/haar ruimte te bekijken.',
    espace_no_fiche:'Geen werknemersfiche gekoppeld aan je account. Contacteer je Team Leader.', espace_of:'Ruimte van',
    espace_score_bradford:'BRADFORD SCORE', espace_days_absence:'afwezigheidsdagen', espace_periods:'periode(s)',
    espace_msg_ok:'Uitstekende situatie, bedankt voor je inzet! 👏', espace_msg_wn:'Dit blijft onder controle, ga zo door.',
    espace_msg_al:'Een aandachtspunt om samen op te volgen.', espace_msg_cr:'Laten we hier samen over praten om je te begeleiden.',
    espace_trend_down:'📉 Verbetering', espace_trend_up:'📈 Aandacht nodig', espace_trend_stable:'➡️ Stabiel',
    espace_sec_formations:'Opleidingen', espace_sec_retards:'Laattijdigheden', espace_sec_ecarts:'Afwijkingen prikklok / tourniquet',
    espace_sec_absences:'Afwezigheden', espace_sec_ncp:'NCP’s die jou betreffen',
    espace_no_retard:'✅ Geen laattijdigheid — perfect!', espace_no_ecart:'✅ Geen afwijking — perfect!',
    espace_no_absence:'✅ Geen afwezigheid geregistreerd.', espace_no_ncp:'✅ Geen NCP geïdentificeerd.', espace_no_formation:'Geen opleiding geregistreerd.',
    espace_ncp_note:'Exacte operator enkel getoond als de planning per lijn voor die dag bestaat (weekends/feestdagen); anders enkel het P5-team. Beperkt tot AW3.',
    espace_ncp_banner:'👏 {n} van {total} rechtstreeks door jou opgemerkt tijdens je shift — dat is veel beter dan later ontdekt!',
    espace_ncp_direct:'👍 Rechtstreeks door jou opgemerkt', espace_ncp_late:'🔎 Later ontdekt (labo)', espace_ncp_equipe:'🤝 P5-team (operator niet gespecificeerd)',
    espace_form_upcoming:'Binnenkort', espace_form_past:'Voorbij', espace_days_suffix:'dag(en)',
    espace_type_recup:'Recuperatie',
    espace_type_ziek:'Ziekte',
    espace_type_verlof:'Verlof',
    tab_formations:'Opleidingen', tab_ncp:'NCP Kwaliteit', tab_recrutement:'Werving',
    ov_badge_employees:'medewerkers', ov_formations_upcoming:'Binnenkort opleidingen',
    espace_emp_label:'Medewerker',
    formations_subtitle:'Planning en herinneringen voor personeelsopleidingen',
    formations_btn_add:'+ Nieuwe opleiding', formations_upcoming:'Binnenkort', formations_past:'Voorbij',
    formations_empty_upcoming:'Geen geplande opleiding.', formations_empty_past:'Geen afgeronde opleiding.',
    formations_empty_30d:'Geen opleiding in de komende 30 dagen.', formations_all_team:'Heel het team',
    formations_notif_singular:'Opleiding deze week', formations_notif_plural:'Opleidingen deze week',
    formations_modal_title_new:'Nieuwe opleiding', formations_modal_title_edit:'Opleiding wijzigen',
    formations_field_titre:'Titel', formations_field_date:'Datum', formations_field_heure_debut:'Startuur',
    formations_field_heure_fin:'Einduur', formations_field_lieu:'Locatie / lesgever (optioneel)',
    formations_field_employes:'Betrokken medewerkers', formations_field_notes:'Notities (optioneel)',
    formations_placeholder_titre:'Bv: Brandveiligheidsopleiding', formations_placeholder_lieu:'Bv: Vergaderzaal, externe lesgever...',
    formations_placeholder_notes:'Details, benodigd materiaal...', formations_btn_delete:'Verwijderen', formations_btn_save:'Opslaan',
    formations_err_titre:'De titel is verplicht.', formations_err_date:'De datum is verplicht.',
    formations_toast_saved:'Opleiding opgeslagen', formations_toast_deleted:'Opleiding verwijderd',
    formations_confirm_delete:'Deze opleiding verwijderen?', formations_err_generic:'Fout: ',
    comptes_emp_title:'Medewerkersaccounts',
    ncp_subtitle:'Non-conformiteiten Inpak en Productie — AW1, AW2, AW3', ncp_btn_import:'⇓ NCP-gegevens importeren',
    ncp_empty_title:'Nog geen NCP-gegevens',
    ncp_empty_desc:'Klik hierboven op "NCP-gegevens importeren" en plak de inhoud van het bestand NCP_dataset_complet.json om dit tabblad te vullen.',
    ncp_kpi_total:'Totaal NCP', ncp_kpi_prod:'Productie', ncp_kpi_tonnes:'Geblokkeerde tonnage', ncp_kpi_tonnes_meta:'totaal gefilterde periode',
    ncp_kpi_debloque:'Vrijgegeven NCP', ncp_kpi_sl_inpak:'NCP buiten shift · Inpak', ncp_kpi_sl_prod:'NCP buiten shift · Prod',
    ncp_periode_label:'Periode', ncp_preset_tout:'Alles', ncp_preset_mois:'Deze maand', ncp_preset_30:'30 dagen',
    ncp_preset_90:'90 dagen', ncp_preset_annee:'Dit jaar', ncp_periode_reset_title:'Periode resetten',
    ncp_du:'Van', ncp_au:'tot', ncp_unite_label:'Unit', ncp_toutes:'Alle', ncp_type_label:'Type', ncp_tous:'Alle',
    ncp_equipe_label:'Ploeg', ncp_equipe_moi:'P5 (ik)',
    ncp_note1:'Opmerking: het team wordt afgeleid uit het tijdstip van de fiche wanneer dat betrouwbaar is, anders uit het tijdstip van het defect in de tekst (gemarkeerd met ~ in de kolom Datum).',
    ncp_note2:'Dit filter dient om de gegevens te verkennen, het is geen prestatievergelijking tussen teams.',
    ncp_couverture_text:'Dekking voor deze selectie: {att} fiches van {tot} met een team ({pct}%), waarvan {d} op het werkelijke productie-uur, {x} op een uur uit de tekst ({pl} in de vorm van een tijdspanne) en {f} enkel op het registratie-uur (lage betrouwbaarheid). {mu} fiches overlappen meerdere posten: hoofdteam + secundair team, naar rato van de tijd doorgebracht in elke post. {n} niet-geclassificeerd (nominatieve aangever).',
    ncp_pct_cloture:'{pct}% van totaal, toe te wijzen', ncp_debloque_meta:'{t} t vrijgegeven - {pct}% van de fiches',
    ncp_pct_total:'{pct}% van totaal', ncp_pct_sanslabo:'{pct}% van totaal - te controleren',
    ncp_tooltip_liste:'Klikken om de lijst te zien', date_range_sep:' tot ',
    ncp_tooltip_ncp_concernes:'Klikken om de bijbehorende NCP te zien', tooltip_voir_notes:'Klikken om alle notities te zien',
    ncp_decl_count:'{n} personen, {tot} NCP, waarvan {rat} toewijsbaar aan een team via een gedeelde bakorder',
    ncp_decl_aucun:'Geen niet-geclassificeerde NCP voor deze periode.', ncp_decl_unite_inconnue:'onbekende eenheid', ncp_decl_semaine:'week {s} / weekend {w}',
    ncp_liste_vide:'Geen NCP', ncp_col_numero:'Nummer', ncp_col_date:'Datum', ncp_col_unite:'Eenheid', ncp_col_ligne:'Lijn',
    ncp_col_type:'Type', ncp_col_declarant:'Aangever', ncp_col_client:'Klant', ncp_col_palettes:'Pallets', ncp_col_tonnage:'Tonnage', ncp_col_description:'Beschrijving',
    ncp_titre_total:'Totaal NCP', ncp_titre_inpak:'NCP Inpak', ncp_titre_prod:'NCP Productie', ncp_titre_nonclasse:'Niet-geclassificeerde NCP',
    ncp_titre_tonnage:'NCP met geblokkeerde tonnage', ncp_titre_debloque:'Vrijgegeven NCP (vrijgegeven door kwaliteit)', ncp_titre_declare_par:'NCP aangegeven door {n}',
    ncp_titre_debloques2:'Vrijgegeven NCP', ncp_titre_inpak_shift:'NCP Inpak (binnen de shift)', ncp_titre_prod_shift:'NCP Productie (binnen de shift)',
    ncp_titre_hors_shift_inpak:'NCP buiten shift - Inpak', ncp_titre_hors_shift_prod:'NCP buiten shift - Productie',
    badge_role_admin:'Admin', role_visiteur:'Bezoeker (alleen lezen)', role_employe:'Werknemer', role_souschef:'Onderploegbaas', role_acces_perso:'Aangepaste toegang',
    ncp_limiter_200:'Beperken tot 200', ncp_tout_afficher:'Alles tonen', ncp_aucune_recurrence:'Geen herhaling (3 keer of meer) voor deze selectie.',
    ncp_bloque_au_total:'{t} t totaal geblokkeerd', ncp_recurrence_titre:'Herhaling: {k}',
    ncp_delai_info:'Dagen tussen de creatie en de laatste update van de fiche. Gemiddeld {moy} d over {n} fiches, {sup7} boven de 7 dagen. {ns} fiches zijn nog niet vrijgegeven door kwaliteit.',
    ncp_delai_l1:'0-2 d', ncp_delai_l2:'3-7 d', ncp_delai_l3:'8-14 d', ncp_delai_l4:'15-30 d', ncp_delai_l5:'meer dan 30 d',
    ncp_cumul_label:'cumulatief', ncp_mentions_label:'vermeldingen',
    arr_occurrences_de:'keer "{raison}" — totale tijd:', arr_min_suffix:'min',
    ncp_chart_evolution:'Maandelijkse evolutie', ncp_chart_causes:'Top 10 oorzaken',
    ncp_chart_causes_hint:'Meest voorkomende oorzaken — de oranje lijn toont het cumulatief in %',
    ncp_chart_tonnage:'Geblokkeerde tonnage per klant', ncp_chart_tonnage_hint:'Reële materiaalimpact, in ton, per klant',
    ncp_chart_familles:'Defectfamilies',
    ncp_chart_familles_hint:'De 457 unieke oorzaken gegroepeerd in grote families — blauwe balken: aantal vermeldingen, oranje lijn: cumulatief in % op de rechteras',
    ncp_chart_delai:'Verwerkingstijd', ncp_chart_lignes:'Top 10 getroffen lijnen',
    ncp_chart_lignes_hint:'Lijnen die werkelijk oorzaak zijn (NCP Inpak) — sluit blokkades uit als gevolg van een Productieprobleem',
    ncp_chart_produits:'Top 10 getroffen productcodes', ncp_chart_produits_hint:'Producten die het vaakst betrokken zijn bij een NCP',
    ncp_recurrences_title:'Terugkerende gevallen om op te volgen',
    ncp_recurrences_hint:'Zelfde product en zelfde defectfamilie minstens 3 keer teruggekomen in de gefilterde periode. Klik op een kaart om de betrokken NCP te zien.',
    ncp_declarants_title:'NCP gemeld door het weekpersoneel',
    ncp_declarants_hint:'Niet-toegewezen fiches: naam van de melder (labo / weekkwaliteit), team niet toewijsbaar. Klik op een naam om de NCP te zien, en op een lijn voor het PDF-detail.',
    ncp_liste_title:'Lijst van NCP',
    ncp_search_placeholder:'Zoeken: nummer, product, klant, lijn, melder, bakorder of een woord uit het probleem...',
    ncp_btn_tout_afficher:'Alles tonen', ncp_btn_export_csv:'CSV exporteren',
    ncp_th_numero:'NCP-nummer', ncp_th_date:'Datum', ncp_th_unite:'Unit', ncp_th_equipe:'Ploeg', ncp_th_type:'Type',
    ncp_th_ligne:'Lijn', ncp_th_bakorder:'Bakorder', ncp_th_produit:'Product', ncp_th_palettes:'Pallets',
    ncp_th_tonnage:'Tonnage', ncp_th_statut:'Status', ncp_th_description:'Beschrijving',
    ncp_no_match:'Geen NCP komt overeen met deze filters.',
    ncp_truncated:'Weergave beperkt tot de {n} meest recente van {total}',
    rec_subtitle:'Beoordelingsraster mentaliteit — veiligheid, betrouwbaarheid, motivatie',
    modal_close:'Sluiten', ncp_detail_title:'NCP-detail',
    comptes_emp_empty:'Geen Firebase-medewerker gevonden.', role_admin:'Beheerder', role_subchef:'Onderploegbaas', role_custom:'Aangepaste toegang',
    comptes_actif:'Account actief', comptes_btn_modif_acces:'Toegang wijzigen', comptes_btn_creer:'Account aanmaken',
    comptes_edit_planning:'Mag de planning wijzigen', comptes_btn_enregistrer:'Opslaan', comptes_btn_annuler:'Annuleren',
    comptes_loading:'Laden...', comptes_confirm_creer:'Account aanmaken voor ', comptes_confirm_email:'E-mail: ',
    comptes_confirm_pass:'Wachtwoord: ', comptes_confirm_role:'Rol: ', comptes_confirm_onglets:'Tabbladen: ',
    comptes_confirm_planning:'Planning wijzigen: ', comptes_oui:'Ja', comptes_non:'Nee',
    comptes_toast_cree:'Account aangemaakt voor ', comptes_alert_cree:'Account aangemaakt!\n\nE-mail: ',
    comptes_alert_pass:'\nWachtwoord: ', comptes_alert_communique:'\n\nBezorg deze gegevens aan ',
    comptes_toast_err_creation:'Fout bij het aanmaken van het account: ', comptes_acces_maj:'Toegang bijgewerkt.', comptes_err_generic:'Fout: '
  },
  en:{
    login_email:'Email', login_password:'Password', login_btn:'Log in',
    login_forgot:'Forgot password?', login_autoconnect:'You will stay automatically logged in', splash_loading:'Loading...',
    topbar_connecting:'Connecting...', topbar_logout:'Log out',
    tab_ov:'Overview', tab_br:'Bradford', tab_pl:'Planning', tab_ab:'Absences',
    tab_pt:'Time tracking', tab_arrets:'Inpak Stops', tab_cmp2:'Comparison', tab_admin:'Admin',
    nav_ov:'Home', nav_br:'Perf.', nav_pl:'Planning', nav_espace:'Space', nav_ab:'Absences',
    nav_formations:'Train.', nav_pt:'Time', nav_arrets:'Stops', nav_ncp:'Quality', nav_recrutement:'Recruit.', nav_admin:'Admin', nav_menu:'Menu',
    plan_subtitle:'Click on a position to edit', plan_all:'All', plan_all_btn:'All',
    plan_today:'Today', plan_print:'Print', plan_no_today:'Today is not a scheduled day.',
    legend_tl:'Team Leader', legend_coord:'Coordinator', legend_aw1:'Team AW1', legend_aw2:'Team AW2',
    legend_ziek:'Sick leave', legend_verlof:'Leave', legend_recup:'Recovery',
    status_ok:'OK', status_wn:'To watch', status_al:'Concerning', status_cr:'Critical', legend_watch_short:'To watch',
    ov_title:'Dashboard', ov_subtitle:'Last 365 days • Weekends + public holidays + bridge days',
    ov_kcard_team:'Team', ov_kmeta_okpct:'OK',
    ov_crm_urgent:'Score > 500 urgent', ov_crm_none:'Score > 500 none',
    ov_alert_from:' went from ', ov_alert_to:' to ',
    ov_chart_bradford:'Bradford scores', ov_chart_absences_trim:'Absences per quarter',
    ov_chart_days_per_emp:'Absence days per employee',
    ov_next30_title:'Absences — next 30 days', ov_next30_none:'No absence planned in the next 30 days',
    ov_nextday_prefix:'Absent next working day', ov_today_prefix:'Absent today', ov_today_allpresent:'Everyone is present ✅',
    ov_birthdays_title:'Upcoming birthdays', ov_birthday_happy:'Happy birthday!',
    ov_birthday_turns1:' turns ', ov_birthday_turns2:' today 🎉',
    ov_birthday_none:'No birthdates recorded — add them in Admin > Employees',
    ov_birthday_celebrated:'→ celebrated on ', ov_birthday_years:'years',
    ov_birthday_today_label:'Today!', ov_birthday_in_days:'in ',
    ab_title:'Absences', ab_col_emp:'Employee', ab_col_start:'Start', ab_col_end:'End',
    ab_col_days:'Days', ab_col_intensity:'Intensity', ab_col_year:'Year',
    ab_count_suffix:' absences 2025-2026', ab_empty:'No sick leave',
    modal_cancel:'Cancel', modal_import:'Import',
    pt_subtitle:'Lateness & turnstile/clock anomalies',
    pt_opt_all_types:'All types', pt_opt_retards:'Lateness', pt_opt_anomalies_tourniquet:'Turnstile anomalies',
    pt_opt_all_status:'All statuses', pt_opt_open:'Not processed', pt_opt_done:'Processed',
    pt_mark_all_done:'Mark all as processed',
    pt_col_person:'Person', pt_col_date:'Date', pt_col_type:'Type', pt_col_detail:'Detail', pt_col_status:'Status',
    pt_type_retard:'⏰ Late', pt_type_tourniquet:'⚠ Turnstile',
    pt_status_open:'Not processed', pt_status_done:'Processed',
    pt_suspect_tooltip:'Suspect: early time with no (D+1) — possibly confused with the previous evening’s turnstile scan (night shift bug)',
    pt_empty:'No anomaly', pt_render_error:'Display error: ',
    pt_banner_open_suffix:' unprocessed anomaly(ies)', pt_banner_retards:' lateness(es)',
    pt_banner_tourniquet:' turnstile anomaly(ies)', pt_banner_suspect:' suspect(s) (night bug)',
    pt_none_open_filtered:'No unprocessed anomaly with these filters', pt_everyone:'everyone',
    pt_confirm_mark1:'Mark ', pt_confirm_mark2:' anomaly(ies) as processed (', pt_confirm_mark3:') ?\nThis action is done in bulk and can be undone row by row afterwards.',
    pt_firebase_unavailable:'Firebase connection unavailable',
    pt_marked_done_suffix:' anomaly(ies) marked as processed',
    pt_firebase_error_prefix:'Firebase error: ', pt_generic_error_prefix:'Error: ',
    pt_modal_title:'Import Protime time records',
    arr_subtitle:'Lines 31 to 36 — stops with reason and micro-stops', eq_multi_hint:'click several teams to combine them',
    tab_bulk:'Bulk & Bijlijn', bulk_subtitle:'Overproduction sent to the bulkopvang and volumes repacked on the bij-line',
    arr_ca_title:'Root cause analysis',
    arr_ca_hint:'The 10 stop families ranked by time lost, with the cumulative curve : the first bars show where it really matters. Click a row to unfold the detail of its reasons. The ranking follows the line, team and period filters above.',
    arr_ca_tri_duree:'Hours lost', arr_ca_tri_nombre:'Number of stops',
    arr_ca_th_cat:'Family', arr_ca_th_raison:'Reason', arr_ca_th_duree:'Time lost',
    arr_ca_th_part:'Share', arr_ca_th_cumul:'Cumulative', arr_ca_th_nb:'Stops', arr_ca_th_moy:'Avg duration',
    arr_ca_clic:'Click a family in the table to see the detail of its reasons.',
    arr_ca_filtrer:'Filter', arr_ca_heures:'Hours lost', arr_ca_nombre:'Number of stops',
    arr_ca_cumule:'Cumulative',
    arr_bulk_title:'Analysed period', arr_bulk_unit_note:'volumes in tonnes, averages in kg/h',
    arr_bulk_empty:'No bulk data imported yet.', arr_bulk_empty_per:'No reading in the selected period.',
    arr_bulk_total:'Total', arr_bulk_export:'Export CSV', arr_bulk_print:'Print',
    arr_bulk_p7:'7 days', arr_bulk_p30:'30 days', arr_bulk_p90:'90 days', arr_bulk_p180:'6 months', arr_bulk_pannee:'Year to date', arr_bulk_pall:'All',
    arr_bulk_sur_title:'Overproduction sent to bulk',
    arr_bulk_sur_hint:'Product sent to the bulkopvang for lack of room on line. Overproduction and noodafvoer counted separately. P1-P2-P3 work 40 h/week, P4-P5 24 h : the kg/shift hour column is the only fair comparison between teams. Days run from 05h to 05h, like the shifts.',
    arr_bulk_bij_title:'Bijlijn / Kruiding packed',
    arr_bulk_bij_hint:'Overproduction bulk repacked on the bij-line. That bulk does not necessarily come from AW3 nor from the same day : these volumes are not comparable with the block above, it is a separate activity.',
    arr_bulk_det_title:'Day by day detail',
    arr_bulk_th_eq:'Team', arr_bulk_th_std:'Overproduction (t)', arr_bulk_th_urg:'Noodafvoer (t)', arr_bulk_th_tot:'Total bulk (t)',
    arr_bulk_th_bij:'Bijlijn packed (t)', arr_bulk_th_poste:'Shift hours', arr_bulk_th_act:'Activity',
    arr_bulk_th_moy:'kg / shift hour', arr_bulk_th_day:'Day', arr_bulk_th_eqs:'Teams',
    arr_bulk_k_std:'Overproduction', arr_bulk_k_urg:'Noodafvoer', arr_bulk_k_tot:'Total bulk',
    arr_bulk_k_bij:'Bijlijn packed', arr_bulk_k_activite:'Activity', arr_bulk_k_moy:'Average',
    arr_bulk_s_std:'Overproduction', arr_bulk_s_urg:'Noodafvoer', arr_bulk_s_bij:'Bijlijn packed',
    arr_bulk_vs_prec:'vs previous period', arr_bulk_par_jour:'per day with readings',
    arr_bulk_jours:'days', arr_bulk_equipes:'teams',
    arr_bulk_h_sur:'h out of', arr_bulk_h_poste:'shift hours',
    arr_bulk_m_prec:'comparison period',
    arr_bulk_m_trous:'day(s) with no reading at all in the period',
    arr_bulk_m_trous2:'a day at zero is not necessarily a good day, it may simply be a missing import.',
    arr_bulk_m_rec:'Busiest bulk day', arr_bulk_m_eq:'Active team filter',
    arr_bulk_m_eq2:'only readings from hours when the selection was on shift are counted.',
    arr_bulk_popup:'Allow pop-up windows to print the table.',
    arr_btn_diag:'Diagnose duplicates', arr_btn_clean:'Clean up duplicates', arr_btn_import:'Import Grafana',
    filter_all_fem:'All', arr_p5_moi:'P5 (me)', col_operator:'Operator',
    arr_search_title:'Precise search', arr_search_from:'From',
    arr_search_to:'To (optional — leave empty for a single day)',
    arr_search_hour:'Hour (optional, only if "To" is empty)',
    btn_search:'Search', btn_reset:'Reset',
    arr_search_hint:'Single day: just fill in "From" (+ optional Hour, 30 min window). Range (e.g. several weekends): fill in "From" and "To".',
    arr_freq_title:'Frequency per line', arr_with_reason_title:'Stops with reason', arr_all_reasons:'All reasons',
    arr_compare_op_hint:'Average duration per operator for this reason — lets you compare',
    arr_micro_title:'Micro-stops', arr_micro_show:'show detail', arr_micro_hide:'hide detail',
    arr_no_data:'No data imported — use the "Import Grafana" button.',
    arr_col_ligne:'Line', arr_col_with_reason:'With reason', arr_col_micro:'Micro-stops',
    arr_col_date:'Date', arr_col_heure:'Hour', arr_col_duree:'Duration', arr_col_raison:'Reason',
    arr_none_with_reason:'No stop with reason for this filter.',
    arr_limited_to1:'Limited to the ', arr_limited_to2:' most recent (', arr_limited_to3:' in total)',
    arr_micro_none:'No micro-stop for this filter.',
    arr_micro_count_sep:' out of ', arr_micro_count_days:' day(s))',
    arr_micro_col_number:'Count that day',
    arr_toast_no_duplicates:'No duplicates found',
    arr_confirm_delete1:'', arr_confirm_delete2:' item(s) to delete (duplicates + old non-aggregated micro-stops). Continue? This action is irreversible.',
    arr_toast_deleting1:'Deleting ', arr_toast_deleting2:' duplicate(s)…',
    arr_toast_deleted_suffix:' duplicate(s) deleted',
    arr_toast_error_lot1:'Error on batch ', arr_toast_error_lot2:'/', arr_toast_error_lot3:': ',
    arr_modal_title:'Import Inpak stops',
    cmp_subtitle:'Compare the teams (P1 to P5) and operators against each other',
    cmp_period_to:'To', cmp_all_lines:'All lines',
    cmp_evolution_title:'Month-by-month evolution',
    cmp_evolution_hint:'Average duration per month, to see whether it’s improving over time.',
    cmp_team_title:'Comparison by team (P1 to P5)',
    cmp_team_hint:'Average stop duration per team, for the selected reason and line.',
    cmp_op_title:'Comparison by operator',
    cmp_op_hint:'Click a team above to compare only its operators (e.g. only P1 vs P2 on weekdays).',
    cmp_all_teams:'All teams',
    cmp_resume_occ_suffix:' occurrence(s)', cmp_resume_of:' of "', cmp_resume_total:' — total time: ',
    cmp_month_occurrences:' occurrence(s) that month',
    br_title:'Bradford Score', br_subtitle:'S² × D — real time',
    br_col_role:'Role', br_col_periods:'Periods', br_col_status:'Status',
    br_tooltip_history:'View history', br_tooltip_comment:'Comment',
    br_comment_prefix:'Comment — ', br_comment_last_mod:'Last modified: ', br_comment_by:' by ',
    btn_save:'Save', br_comment_saved:'Comment saved', br_comment_deleted:'Comment deleted',
    br_days_suffix_1:' day', br_days_suffix_n:' days', br_episode_badge:'Episode',
    br_no_episode:'No sick episode in the last 365 days',
    br_stat_score:'Score', br_stat_episodes:'Episodes', br_stat_days:'Days',
    br_comment_label:'Comment', br_comment_placeholder:'Click to add a comment...',
    br_history_title:'Episode history (365d)', br_perso_introuvable:'Could not find your Bradford score (name not recognized). Contact your admin.',
    adm_title:'Administration', adm_subtitle:'Tools reserved for admin',
    adm_fb_test_title:'Firebase reliability', adm_fb_test_btn:'Test connection',
    adm_fb_rules_title:'Firebase user roles',
    adm_migration_title:'Initial Firebase migration', adm_migration_status_none:'Not done',
    adm_migration_btn:'Start migration',
    adm_session_title:'Active session', adm_session_connected_as:'Logged in as: ', adm_session_role:'Role: ',
    adm_excel_report_title:'Monthly Excel report', adm_excel_report_btn:'Generate Excel report',
    adm_protime_import_title:'Import from Protime', adm_protime_status_none:'No import',
    adm_btn_check:'Check', adm_btn_import_planning:'Import into planning',
    adm_btn_purge_protime:'Purge all Protime absences',
    adm_emp_mgmt_title:'Employee management', adm_btn_add:'+ Add',
    adm_col_name:'Name', adm_col_group:'Group', adm_col_actions:'Actions',
    adm_btn_edit:'Edit', adm_btn_remove:'Remove',
    adm_emp_modal_add_title:'Add an employee', adm_emp_modal_edit_prefix:'Edit ',
    adm_field_fullname:'Full name', adm_field_group:'Group', adm_field_role:'Role', adm_field_birthday:'Date of birth',
    adm_placeholder_name:'First Last', adm_placeholder_role:'e.g.: Operator',
    adm_err_name_required:'Name is required.', adm_err_role_required:'Role is required.',
    adm_err_firebase_disconnected:'Firebase not connected.', adm_saving:'Saving...',
    adm_toast_saved_suffix:' saved!',
    adm_confirm_remove1:'Remove ', adm_confirm_remove2:' from the team? Their Bradford history will be kept.',
    adm_toast_removed_suffix:' removed from the team',
    err_generic_prefix:'Error: ',
    month_0:'January', month_1:'February', month_2:'March', month_3:'April', month_4:'May', month_5:'June',
    month_6:'July', month_7:'August', month_8:'September', month_9:'October', month_10:'November', month_11:'December',
    arr_limited_days1:'Limited to the ', arr_limited_days2:' most recent days (', arr_limited_days3:' days in total)',
    plan_section_extra:'Miscellaneous / Extra',
    plan_row_extra_staff:'Extra staff', plan_row_ext_cleaner:'External cleaner', plan_row_note:'Note',
    plan_notes_panel_title:'Planning notes',
    extra_modal_title:'Extra staff', extra_name_ph:'Name', extra_add_btn:'+ Add', extra_save_btn:'Save changes',
    extra_cancel_btn:'Cancel', extra_close_btn:'Close', extra_edit_title:'Edit', extra_remove_title:'Remove',
    extra_empty_day:'Nothing added for this day',
    note_modal_title:'Visible note', note_modal_hint:' — visible directly on the planning, no click needed',
    note_placeholder:'Write a note visible on the planning...',
    note_del_btn:'Delete', note_close_btn:'Cancel', note_save_btn:'Save',
    note_translate_nl:'Translate to Dutch', note_translate_en:'Translate to English',
    note_translate_error:'Translation unavailable right now',
    tab_espace:'My space', espace_subtitle:'Your clock-ins, absences and the NCPs that concern you',
    espace_select_placeholder:'-- Choose an employee --', espace_choose_prompt:'Choose an employee above to see their space.',
    espace_no_fiche:'No employee record linked to your account. Contact your Team Leader.', espace_of:'Space of',
    espace_score_bradford:'BRADFORD SCORE', espace_days_absence:'days absent', espace_periods:'period(s)',
    espace_msg_ok:'Excellent situation, thanks for your commitment! 👏', espace_msg_wn:'Still under control, keep it up.',
    espace_msg_al:'A point to watch together.', espace_msg_cr:'Let’s talk about it together to support you.',
    espace_trend_down:'📉 Improving', espace_trend_up:'📈 Needs attention', espace_trend_stable:'➡️ Stable',
    espace_sec_formations:'Trainings', espace_sec_retards:'Late arrivals', espace_sec_ecarts:'Clock / turnstile discrepancies',
    espace_sec_absences:'Absences', espace_sec_ncp:'NCPs concerning you',
    espace_no_retard:'✅ No late arrivals — perfect!', espace_no_ecart:'✅ No discrepancy — perfect!',
    espace_no_absence:'✅ No absence recorded.', espace_no_ncp:'✅ No NCP identified.', espace_no_formation:'No training recorded.',
    espace_ncp_note:'Exact operator shown only when the line-by-line schedule exists for that day (weekends/holidays); otherwise only the P5 team is shown. Limited to AW3.',
    espace_ncp_banner:'👏 {n} of {total} detected directly by you during your shift — that’s much better than being found later!',
    espace_ncp_direct:'👍 Spotted directly by you', espace_ncp_late:'🔎 Found later (lab)', espace_ncp_equipe:'🤝 P5 team (operator not specified)',
    espace_form_upcoming:'Upcoming', espace_form_past:'Past', espace_days_suffix:'day(s)',
    espace_type_recup:'Recovery leave',
    espace_type_ziek:'Sick leave',
    espace_type_verlof:'Leave',
    tab_formations:'Trainings', tab_ncp:'NCP Quality', tab_recrutement:'Recruitment',
    ov_badge_employees:'employees', ov_formations_upcoming:'Upcoming trainings',
    espace_emp_label:'Employee',
    formations_subtitle:'Planning and reminders for staff training',
    formations_btn_add:'+ New training', formations_upcoming:'Upcoming', formations_past:'Past',
    formations_empty_upcoming:'No upcoming training.', formations_empty_past:'No past training.',
    formations_empty_30d:'No training in the next 30 days.', formations_all_team:'Whole team',
    formations_notif_singular:'Training this week', formations_notif_plural:'Trainings this week',
    formations_modal_title_new:'New training', formations_modal_title_edit:'Edit training',
    formations_field_titre:'Title', formations_field_date:'Date', formations_field_heure_debut:'Start time',
    formations_field_heure_fin:'End time', formations_field_lieu:'Location / trainer (optional)',
    formations_field_employes:'Employees involved', formations_field_notes:'Notes (optional)',
    formations_placeholder_titre:'E.g: Fire safety training', formations_placeholder_lieu:'E.g: Meeting room, external trainer...',
    formations_placeholder_notes:'Details, equipment needed...', formations_btn_delete:'Delete', formations_btn_save:'Save',
    formations_err_titre:'Title is required.', formations_err_date:'Date is required.',
    formations_toast_saved:'Training saved', formations_toast_deleted:'Training deleted',
    formations_confirm_delete:'Delete this training?', formations_err_generic:'Error: ',
    comptes_emp_title:'Employee accounts',
    ncp_subtitle:'Inpak and Production non-conformities — AW1, AW2, AW3', ncp_btn_import:'⇓ Import NCP data',
    ncp_empty_title:'No NCP data yet',
    ncp_empty_desc:'Click "Import NCP data" above and paste the content of the NCP_dataset_complet.json file to fill this tab.',
    ncp_kpi_total:'Total NCP', ncp_kpi_prod:'Production', ncp_kpi_tonnes:'Blocked tonnage', ncp_kpi_tonnes_meta:'total filtered period',
    ncp_kpi_debloque:'Released NCP', ncp_kpi_sl_inpak:'NCP outside shift · Inpak', ncp_kpi_sl_prod:'NCP outside shift · Prod',
    ncp_periode_label:'Period', ncp_preset_tout:'All', ncp_preset_mois:'Current month', ncp_preset_30:'30 days',
    ncp_preset_90:'90 days', ncp_preset_annee:'Current year', ncp_periode_reset_title:'Reset period',
    ncp_du:'From', ncp_au:'to', ncp_unite_label:'Unit', ncp_toutes:'All', ncp_type_label:'Type', ncp_tous:'All',
    ncp_equipe_label:'Team', ncp_equipe_moi:'P5 (me)',
    ncp_note1:"Note: the team is inferred from the record's timestamp when reliable, otherwise from the defect time written in the text (marked ~ in the Date column).",
    ncp_note2:'This filter is for exploring the data, not for comparing team performance.',
    ncp_couverture_text:"Coverage for this selection: {att} records out of {tot} with a team ({pct}%), of which {d} on the actual production time, {x} on a time from the text ({pl} as a range) and {f} on the encoding time only (low reliability). {mu} records span multiple posts: primary + secondary team, prorated by time spent in each post. {n} unclassified (named declarant).",
    ncp_pct_cloture:"{pct}% of total, to be assigned", ncp_debloque_meta:"{t} t released - {pct}% of records",
    ncp_pct_total:"{pct}% of total", ncp_pct_sanslabo:"{pct}% of total - to check",
    ncp_tooltip_liste:"Click to see the list", date_range_sep:" to ",
    ncp_tooltip_ncp_concernes:"Click to see the related NCP", tooltip_voir_notes:"Click to see all notes",
    ncp_decl_count:"{n} people, {tot} NCP, of which {rat} attributable to a team via a shared bakorder",
    ncp_decl_aucun:"No unclassified NCP for this period.", ncp_decl_unite_inconnue:"unknown unit", ncp_decl_semaine:"weekday {s} / weekend {w}",
    ncp_liste_vide:"No NCP", ncp_col_numero:"Number", ncp_col_date:"Date", ncp_col_unite:"Unit", ncp_col_ligne:"Line",
    ncp_col_type:"Type", ncp_col_declarant:"Declarant", ncp_col_client:"Client", ncp_col_palettes:"Pallets", ncp_col_tonnage:"Tonnage", ncp_col_description:"Description",
    ncp_titre_total:"Total NCP", ncp_titre_inpak:"NCP Inpak", ncp_titre_prod:"NCP Production", ncp_titre_nonclasse:"Unclassified NCP",
    ncp_titre_tonnage:"NCP with blocked tonnage", ncp_titre_debloque:"Released NCP (released by quality)", ncp_titre_declare_par:"NCP reported by {n}",
    ncp_titre_debloques2:"Released NCP", ncp_titre_inpak_shift:"NCP Inpak (within shift)", ncp_titre_prod_shift:"NCP Production (within shift)",
    ncp_titre_hors_shift_inpak:"NCP outside shift - Inpak", ncp_titre_hors_shift_prod:"NCP outside shift - Production",
    badge_role_admin:'Admin', role_visiteur:'Visitor (read-only)', role_employe:'Employee', role_souschef:'Assistant supervisor', role_acces_perso:'Custom access',
    ncp_limiter_200:'Limit to 200', ncp_tout_afficher:'Show all', ncp_aucune_recurrence:'No recurrence (3 times or more) on this selection.',
    ncp_bloque_au_total:'{t} t blocked in total', ncp_recurrence_titre:'Recurrence: {k}',
    ncp_delai_info:"Days between record creation and last update. Average {moy} d over {n} records, {sup7} beyond 7 days. {ns} records not yet released by quality.",
    ncp_delai_l1:'0-2 d', ncp_delai_l2:'3-7 d', ncp_delai_l3:'8-14 d', ncp_delai_l4:'15-30 d', ncp_delai_l5:'over 30 d',
    ncp_cumul_label:'cumulative', ncp_mentions_label:'mentions',
    arr_occurrences_de:'occurrence(s) of "{raison}" — total time:', arr_min_suffix:'min',
    ncp_chart_evolution:'Monthly evolution', ncp_chart_causes:'Top 10 causes',
    ncp_chart_causes_hint:'Most frequent causes — the orange line shows the cumulative %',
    ncp_chart_tonnage:'Blocked tonnage by customer', ncp_chart_tonnage_hint:'Real material impact, in tonnes, per customer',
    ncp_chart_familles:'Defect families',
    ncp_chart_familles_hint:'The 457 distinct causes grouped into major families — blue bars: number of mentions, orange line: cumulative % on the right axis',
    ncp_chart_delai:'Processing time', ncp_chart_lignes:'Top 10 affected lines',
    ncp_chart_lignes_hint:'Lines genuinely at fault (Inpak NCP) — excludes blocks caused by a Production issue',
    ncp_chart_produits:'Top 10 affected product codes', ncp_chart_produits_hint:'Products most often involved in an NCP',
    ncp_recurrences_title:'Recurrences to watch',
    ncp_recurrences_hint:'Same product and same defect family recurring at least 3 times in the filtered period. Click a card to see the related NCP.',
    ncp_declarants_title:'NCP reported by weekday staff',
    ncp_declarants_hint:'Unclassified records: named reporter (lab / weekday quality), team not attributable. Click a name to see their NCP, then a row for the PDF detail.',
    ncp_liste_title:'List of NCP',
    ncp_search_placeholder:'Search: number, product, customer, line, reporter, bakorder or a word from the issue...',
    ncp_btn_tout_afficher:'Show all', ncp_btn_export_csv:'Export CSV',
    ncp_th_numero:'NCP number', ncp_th_date:'Date', ncp_th_unite:'Unit', ncp_th_equipe:'Team', ncp_th_type:'Type',
    ncp_th_ligne:'Line', ncp_th_bakorder:'Bakorder', ncp_th_produit:'Product', ncp_th_palettes:'Pallets',
    ncp_th_tonnage:'Tonnage', ncp_th_statut:'Status', ncp_th_description:'Description',
    ncp_no_match:'No NCP matches these filters.',
    ncp_truncated:'Display limited to the {n} most recent out of {total}',
    rec_subtitle:'Mindset interview grid — safety, reliability, motivation',
    modal_close:'Close', ncp_detail_title:'NCP detail',
    comptes_emp_empty:'No Firebase employee found.', role_admin:'Administrator', role_subchef:'Sub-chief', role_custom:'Custom access',
    comptes_actif:'Account active', comptes_btn_modif_acces:'Edit access', comptes_btn_creer:'Create an account',
    comptes_edit_planning:'Can edit planning', comptes_btn_enregistrer:'Save', comptes_btn_annuler:'Cancel',
    comptes_loading:'Loading...', comptes_confirm_creer:'Create the account for ', comptes_confirm_email:'Email: ',
    comptes_confirm_pass:'Password: ', comptes_confirm_role:'Role: ', comptes_confirm_onglets:'Tabs: ',
    comptes_confirm_planning:'Edit planning: ', comptes_oui:'Yes', comptes_non:'No',
    comptes_toast_cree:'Account created for ', comptes_alert_cree:'Account created!\n\nEmail: ',
    comptes_alert_pass:'\nPassword: ', comptes_alert_communique:'\n\nShare these credentials with ',
    comptes_toast_err_creation:'Error creating account: ', comptes_acces_maj:'Access updated.', comptes_err_generic:'Error: '
  }
};
var LANG=(function(){try{return localStorage.getItem('lang')||'fr';}catch(e){return 'fr';}})();
var MOIS_I18N={
  fr:['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  nl:['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December'],
  en:['January','February','March','April','May','June','July','August','September','October','November','December']
};
var MOIS_ABBR_I18N={
  fr:['jan','fév','mars','avr','mai','juin','juil','août','sep','oct','nov','déc'],
  nl:['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'],
  en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
};
var DOW_ABBR_I18N={fr:['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'], nl:['Zo','Ma','Di','Wo','Do','Vr','Za'], en:['Sun','Mon','Tue','Wed','Thu','Fri','Sat']};
var DOW_FULL_I18N={fr:['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'], nl:['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'], en:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']};
function t(key){var d=I18N[LANG]||I18N.fr;return d[key]!==undefined?d[key]:(I18N.fr[key]!==undefined?I18N.fr[key]:key);}
var LANG_ORDER=['fr','nl','en'];
var LANG_TITLE={fr:'Français',nl:'Nederlands (Vlaanderen)',en:'English'};
// Drapeaux en SVG inline (fiables sur tous les appareils, contrairement aux emojis drapeaux) :
// NL = toujours le drapeau belge (noir/jaune/rouge), EN = toujours le drapeau d'Angleterre (croix de Saint-Georges).
var LANG_FLAG_SVG={
  fr:'<svg width="20" height="14" viewBox="0 0 3 2" style="display:block;border-radius:2px;overflow:hidden;flex:none"><rect width="1" height="2" fill="#0055A4"/><rect x="1" width="1" height="2" fill="#FFFFFF"/><rect x="2" width="1" height="2" fill="#EF4135"/></svg>',
  nl:'<svg width="20" height="14" viewBox="0 0 3 2" style="display:block;border-radius:2px;overflow:hidden;flex:none"><rect width="1" height="2" fill="#000000"/><rect x="1" width="1" height="2" fill="#FDDA24"/><rect x="2" width="1" height="2" fill="#EF3340"/></svg>',
  en:'<svg width="20" height="14" viewBox="0 0 30 20" style="display:block;border-radius:2px;overflow:hidden;flex:none"><rect width="30" height="20" fill="#FFFFFF"/><rect x="12" width="6" height="20" fill="#CE1124"/><rect y="7" width="30" height="6" fill="#CE1124"/></svg>'
};
function applyI18n(){ try { if(window.recAppliquerLangue) window.recAppliquerLangue(); } catch(e){}
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var k=el.getAttribute('data-i18n');el.textContent=t(k);
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(function(el){
    var k=el.getAttribute('data-i18n-ph');el.placeholder=t(k);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(function(el){
    var k=el.getAttribute('data-i18n-title');el.title=t(k);
  });
  var lb=document.getElementById('lang-toggle');
  if(lb){
    lb.innerHTML=(LANG_FLAG_SVG[LANG]||'')+'<span>'+LANG.toUpperCase()+'</span>';
    var next=LANG_ORDER[(LANG_ORDER.indexOf(LANG)+1)%LANG_ORDER.length];
    lb.title='→ '+(LANG_TITLE[next]||next);
  }
}
function setLang(l){
  LANG=l;
  try{localStorage.setItem('lang',l);}catch(e){}
  applyI18n();
  if(typeof buildPT==='function'&&document.getElementById('ptable'))buildPT();
  if(typeof updKPI==='function'&&document.getElementById('k-ok')&&typeof BD!=='undefined'&&BD.length)updKPI();
  if(typeof buildMiniCal==='function'&&document.getElementById('mini-cal'))buildMiniCal();
  if(typeof buildTodayAbs==='function'&&document.getElementById('today-abs'))buildTodayAbs();
  if(typeof buildBirthdayNotif==='function'&&document.getElementById('birthday-notif'))buildBirthdayNotif();
  if(typeof buildBirthdayCal==='function'&&document.getElementById('birthday-cal'))buildBirthdayCal();
  if(typeof updAbsLbl==='function'&&document.getElementById('abs-lbl'))updAbsLbl();
  if(typeof buildAbs==='function'&&document.getElementById('agrid'))buildAbs(document.querySelector('.fb.on')?document.querySelector('.fb.on').dataset.f:'all');
  if(typeof buildPT2==='function'&&document.getElementById('pt-tbody'))buildPT2();
  if(typeof buildArretsInpak==='function'&&document.getElementById('arrets-resume-wrap'))buildArretsInpak();
  if(typeof buildComparaisonTab==='function'&&document.getElementById('cmp2EvolutionChart'))buildComparaisonTab();
  if(typeof buildMonEspace==='function'&&document.getElementById('espace-content'))buildMonEspace();
  if(typeof buildBT==='function'&&document.getElementById('btable')&&currentUser&&currentUser.role==='admin')buildBT();
  if(typeof buildEmpTable==='function'&&document.getElementById('empTbody'))buildEmpTable();
  if(typeof buildFormationsListe==='function'&&document.getElementById('form-liste-avenir'))buildFormationsListe();
  if(typeof buildMiniCalFormations==='function'&&document.getElementById('mini-cal-formations'))buildMiniCalFormations();
  if(typeof buildNCPTab==='function'&&document.getElementById('ncp-content-wrap')&&NCP_DATA&&NCP_DATA.length)buildNCPTab();
  if(typeof buildComptesEmpListe==='function'&&document.getElementById('comptes-emp-liste'))buildComptesEmpListe();
  if(typeof applyRole==='function'&&currentUser&&currentUser.role)applyRole(currentUser.role);
}
function toggleLang(){setLang(LANG_ORDER[(LANG_ORDER.indexOf(LANG)+1)%LANG_ORDER.length]);}
var ACCOUNTS={};




var EMP=[{n:'Aurelien Turchi',g:'TL',r:'Team Leader'},{n:'Nicolas Fettu',g:'INPAK',r:'Coordinateur'},{n:'Julien Demuyter',g:'INPAK',r:'Coordinateur'},{n:'Mohamed Lalaoui',g:'INPAK',r:'Operateur'},{n:'Ramazani Abdulhassan',g:'INPAK',r:'Operateur'},{n:'Halima Laadi',g:'INPAK',r:'Operateur'},{n:'Hakkim Akkouh',g:'INPAK',r:'Operateur'},{n:'Balan Marius',g:'INPAK',r:'Operateur'},{n:'Lyse Musik',g:'INPAK',r:'Labo'},{n:'Max Secember',g:'Prod',r:'Production'},{n:'Larissa Fratutescu',g:'Prod',r:'Production'},{n:'Monir Salmi',g:'Unit',r:'Batter/Cleaning'},{n:'Anthony Raimondi',g:'Unit',r:'Inpak'},{n:'Brahim Akdim',g:'Unit',r:'Batter/Cleaning'},{n:'Lachen Baraik',g:'Unit',r:'Bulk'}];

var WEEKS27 = [
  {d:["01/01", "02/01", "03/01"]},
  {d:["09/01", "10/01"]},
  {d:["16/01", "17/01"]},
  {d:["23/01", "24/01"]},
  {d:["30/01", "31/01"]},
  {d:["06/02", "07/02"]},
  {d:["13/02", "14/02"]},
  {d:["20/02", "21/02"]},
  {d:["27/02", "28/02"]},
  {d:["06/03", "07/03"]},
  {d:["13/03", "14/03"]},
  {d:["20/03", "21/03"]},
  {d:["27/03", "28/03"]},
  {d:["03/04", "04/04", "05/04"]},
  {d:["10/04", "11/04"]},
  {d:["17/04", "18/04"]},
  {d:["24/04", "25/04"]},
  {d:["01/05", "02/05"]},
  {d:["08/05", "09/05"]},
  {d:["13/05", "14/05", "15/05", "16/05"]},
  {d:["22/05", "23/05", "24/05"]},
  {d:["29/05", "30/05"]},
  {d:["05/06", "06/06"]},
  {d:["12/06", "13/06"]},
  {d:["19/06", "20/06"]},
  {d:["26/06", "27/06"]},
  {d:["03/07", "04/07"]},
  {d:["10/07", "11/07"]},
  {d:["17/07", "18/07"]},
  {d:["21/07"]},
  {d:["24/07", "25/07"]},
  {d:["31/07", "01/08"]},
  {d:["07/08", "08/08"]},
  {d:["14/08", "15/08"]},
  {d:["21/08", "22/08"]},
  {d:["28/08", "29/08"]},
  {d:["04/09", "05/09"]},
  {d:["11/09", "12/09"]},
  {d:["18/09", "19/09"]},
  {d:["25/09", "26/09"]},
  {d:["02/10", "03/10"]},
  {d:["09/10", "10/10"]},
  {d:["16/10", "17/10"]},
  {d:["23/10", "24/10"]},
  {d:["30/10", "31/10", "01/11"]},
  {d:["06/11", "07/11"]},
  {d:["11/11", "12/11", "13/11", "14/11"]},
  {d:["20/11", "21/11"]},
  {d:["27/11", "28/11"]},
  {d:["04/12", "05/12"]},
  {d:["11/12", "12/12"]},
  {d:["18/12", "19/12"]},
  {d:["25/12", "26/12"]},
];

var SHIFTS27 = [
  {n:"Aurelien Turchi",g:"TL",s:["TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL", "TL"]},
  {n:"Nicolas Fettu",g:"INPAK",s:["coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur"]},
  {n:"Julien Demuyter",g:"INPAK",s:["coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur", "coordinateur"]},
  {n:"Mohamed Lalaoui",g:"INPAK",s:["35/36", "35/36", "35/36", "extra", "extra", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "extra", "extra", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "extra", "extra", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "extra", "extra", "extra", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "extra", "extra", "extra", "extra", "33/34", "33/34", "33/34", "33/34", "35/36", "35/36", "35/36", "extra", "extra", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "extra", "extra", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "extra", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "extra", "extra", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "extra", "extra", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "extra", "extra", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "35/36", "extra", "extra", "extra", "extra", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "extra", "extra", "extra", "extra", "33/34", "33/34", "35/36", "35/36"]},
  {n:"Ramazani Abdulhassan",g:"INPAK",s:["extra", "extra", "extra", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "extra", "extra", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "extra", "extra", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "extra", "extra", "35/36", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "extra", "extra", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "extra", "extra", "extra", "extra", "extra", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "extra", "extra", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "extra", "extra", "35/36", "31/32", "31/32", "extra", "extra", "extra", "extra", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "extra", "extra", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "extra", "extra", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "extra", "extra", "extra", "35/36", "35/36", "31/32", "31/32", "31/32", "31/32", "extra", "extra", "extra", "extra", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "extra", "extra"]},
  {n:"Halima Laadi",g:"INPAK",s:["31/32", "31/32", "31/32", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "35/36", "35/36", "31/32", "31/32", "31/32", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "31/32", "31/32", "extra", "33/34", "33/34", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "31/32", "31/32", "31/32", "extra", "extra", "33/34", "33/34", "33/34", "33/34", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "31/32", "31/32"]},
  {n:"Hakkim Akkouh",g:"INPAK",s:["33/34", "33/34", "33/34", "31/32", "31/32", "extra", "extra", "extra", "extra", "33/34", "33/34", "31/32", "31/32", "extra", "extra", "extra", "extra", "33/34", "33/34", "31/32", "31/32", "extra", "extra", "extra", "extra", "33/34", "33/34", "31/32", "31/32", "31/32", "extra", "extra", "extra", "extra", "33/34", "33/34", "31/32", "31/32", "extra", "extra", "extra", "extra", "extra", "extra", "33/34", "33/34", "33/34", "31/32", "31/32", "extra", "extra", "extra", "extra", "33/34", "33/34", "31/32", "31/32", "extra", "extra", "extra", "extra", "33/34", "33/34", "31/32", "extra", "extra", "extra", "extra", "33/34", "33/34", "31/32", "31/32", "extra", "extra", "extra", "extra", "33/34", "33/34", "31/32", "31/32", "extra", "extra", "extra", "extra", "33/34", "33/34", "31/32", "31/32", "extra", "extra", "extra", "extra", "33/34", "33/34", "33/34", "31/32", "31/32", "extra", "extra", "extra", "extra", "extra", "extra", "33/34", "33/34", "31/32", "31/32", "extra", "extra", "extra", "extra", "33/34", "33/34"]},
  {n:"Balan Marius",g:"INPAK",s:["35/36", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "31/32", "31/32", "31/32", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "33/34", "33/34", "33/34", "33/34", "35/36", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "31/32", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "extra", "extra", "33/34", "33/34", "35/36", "35/36", "31/32", "31/32", "extra", "extra", "33/34", "33/34", "35/36", "35/36"]},
  {n:"Lyse Musik",g:"INPAK",s:["Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo", "Labo"]},
  {n:"Max Secember",g:"Prod",s:["Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod"]},
  {n:"Larissa Fratutescu",g:"Prod",s:["Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod", "Prod"]},
  {n:"Monir Salmi",g:"Unit",s:["Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter", "Batter"]},
  {n:"Anthony Raimondi",g:"Unit",s:["Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak", "Inpak"]},
  {n:"Brahim Akdim",g:"Unit",s:["Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning", "Cleaning"]},
  {n:"Lachen Baraik",g:"Unit",s:["Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk", "Bulk"]},
  {n:"Nettoyeur externe",g:"EXTRA",s:[]},
  {n:"Commentaire",g:"EXTRA",s:[]},
  {n:"Note",g:"EXTRA",s:[]},
];

var H2025={"01/01": "17h-05h", "04/01": "05h-17h", "05/01": "05h-17h", "11/01": "17h-05h", "12/01": "17h-05h", "18/01": "05h-17h", "19/01": "05h-17h", "25/01": "17h-05h", "26/01": "17h-05h", "01/02": "05h-17h", "02/02": "05h-17h", "08/02": "17h-05h", "09/02": "17h-05h", "15/02": "05h-17h", "16/02": "05h-17h", "22/02": "17h-05h", "23/02": "17h-05h", "01/03": "05h-17h", "02/03": "05h-17h", "08/03": "17h-05h", "09/03": "17h-05h", "15/03": "05h-17h", "16/03": "05h-17h", "22/03": "17h-05h", "23/03": "17h-05h", "29/03": "05h-17h", "30/03": "05h-17h", "05/04": "17h-05h", "06/04": "17h-05h", "12/04": "05h-17h", "13/04": "05h-17h", "19/04": "17h-05h", "20/04": "17h-05h", "21/04": "17h-05h", "26/04": "05h-17h", "27/04": "05h-17h", "01/05": "17h-05h", "02/05": "17h-05h", "03/05": "17h-05h", "04/05": "17h-05h", "10/05": "05h-17h", "11/05": "05h-17h", "17/05": "17h-05h", "18/05": "17h-05h", "24/05": "05h-17h", "25/05": "05h-17h", "29/05": "17h-05h", "30/05": "17h-05h", "31/05": "17h-05h", "01/06": "17h-05h", "07/06": "05h-17h", "08/06": "05h-17h", "09/06": "05h-17h", "14/06": "17h-05h", "15/06": "17h-05h", "21/06": "05h-17h", "22/06": "05h-17h", "28/06": "17h-05h", "29/06": "17h-05h", "05/07": "05h-17h", "06/07": "05h-17h", "12/07": "17h-05h", "13/07": "17h-05h", "19/07": "05h-17h", "20/07": "05h-17h", "21/07": "05h-17h", "26/07": "17h-05h", "27/07": "17h-05h", "02/08": "05h-17h", "03/08": "05h-17h", "09/08": "17h-05h", "10/08": "17h-05h", "15/08": "05h-17h", "16/08": "05h-17h", "17/08": "05h-17h", "23/08": "17h-05h", "24/08": "17h-05h", "30/08": "05h-17h", "31/08": "05h-17h", "06/09": "17h-05h", "07/09": "17h-05h", "13/09": "05h-17h", "14/09": "05h-17h", "20/09": "17h-05h", "21/09": "17h-05h", "27/09": "05h-17h", "28/09": "05h-17h", "04/10": "17h-05h", "05/10": "17h-05h", "11/10": "05h-17h", "12/10": "05h-17h", "18/10": "17h-05h", "19/10": "17h-05h", "25/10": "05h-17h", "26/10": "05h-17h", "01/11": "17h-05h", "02/11": "17h-05h", "08/11": "05h-17h", "09/11": "05h-17h", "10/11": "05h-17h", "11/11": "05h-17h", "15/11": "17h-05h", "16/11": "17h-05h", "22/11": "05h-17h", "23/11": "05h-17h", "29/11": "17h-05h", "30/11": "17h-05h", "06/12": "05h-17h", "07/12": "05h-17h", "13/12": "17h-05h", "14/12": "17h-05h", "20/12": "05h-17h", "21/12": "05h-17h", "25/12": "17h-05h", "26/12": "17h-05h", "27/12": "17h-05h", "28/12": "17h-05h"};
var H2026={"01/01": "05h-17h", "02/01": "05h-17h", "03/01": "05h-17h", "04/01": "05h-17h", "10/01": "17h-05h", "11/01": "17h-05h", "17/01": "05h-17h", "18/01": "05h-17h", "24/01": "17h-05h", "25/01": "17h-05h", "31/01": "05h-17h", "01/02": "05h-17h", "07/02": "17h-05h", "08/02": "17h-05h", "14/02": "05h-17h", "15/02": "05h-17h", "21/02": "17h-05h", "22/02": "17h-05h", "28/02": "05h-17h", "01/03": "05h-17h", "07/03": "17h-05h", "08/03": "17h-05h", "14/03": "05h-17h", "15/03": "05h-17h", "21/03": "17h-05h", "22/03": "17h-05h", "28/03": "05h-17h", "29/03": "05h-17h", "04/04": "17h-05h", "05/04": "17h-05h", "06/04": "17h-05h", "11/04": "05h-17h", "12/04": "05h-17h", "18/04": "17h-05h", "19/04": "17h-05h", "25/04": "05h-17h", "26/04": "05h-17h", "01/05": "17h-05h", "02/05": "17h-05h", "03/05": "17h-05h", "09/05": "05h-17h", "10/05": "05h-17h", "14/05": "17h-05h", "15/05": "17h-05h", "16/05": "17h-05h", "17/05": "17h-05h", "23/05": "05h-17h", "24/05": "05h-17h", "25/05": "05h-17h", "30/05": "17h-05h", "31/05": "17h-05h", "06/06": "05h-17h", "07/06": "05h-17h", "13/06": "17h-05h", "14/06": "17h-05h", "20/06": "05h-17h", "21/06": "05h-17h", "27/06": "17h-05h", "28/06": "17h-05h", "04/07": "05h-17h", "05/07": "05h-17h", "11/07": "17h-05h", "12/07": "17h-05h", "18/07": "05h-17h", "19/07": "05h-17h", "20/07": "05h-17h", "21/07": "05h-17h", "25/07": "17h-05h", "26/07": "17h-05h", "01/08": "05h-17h", "02/08": "05h-17h", "08/08": "17h-05h", "09/08": "17h-05h", "15/08": "05h-17h", "16/08": "05h-17h", "22/08": "17h-05h", "23/08": "17h-05h", "29/08": "05h-17h", "30/08": "05h-17h", "05/09": "17h-05h", "06/09": "17h-05h", "12/09": "05h-17h", "13/09": "05h-17h", "19/09": "17h-05h", "20/09": "17h-05h", "26/09": "05h-17h", "27/09": "05h-17h", "03/10": "17h-05h", "04/10": "17h-05h", "10/10": "05h-17h", "11/10": "05h-17h", "17/10": "17h-05h", "18/10": "17h-05h", "24/10": "05h-17h", "25/10": "05h-17h", "31/10": "17h-05h", "01/11": "17h-05h", "07/11": "05h-17h", "08/11": "05h-17h", "11/11": "17h-05h", "14/11": "17h-05h", "15/11": "17h-05h", "21/11": "05h-17h", "22/11": "05h-17h", "28/11": "17h-05h", "29/11": "17h-05h", "05/12": "05h-17h", "06/12": "05h-17h", "12/12": "17h-05h", "13/12": "17h-05h", "19/12": "05h-17h", "20/12": "05h-17h", "25/12": "05h-17h", "26/12": "17h-05h", "27/12": "17h-05h"};
var H2027={"01/01": "17h-05h", "02/01": "17h-05h", "03/01": "17h-05h", "09/01": "05h-17h", "10/01": "05h-17h", "16/01": "17h-05h", "17/01": "17h-05h", "23/01": "05h-17h", "24/01": "05h-17h", "30/01": "17h-05h", "31/01": "17h-05h", "06/02": "05h-17h", "07/02": "05h-17h", "13/02": "17h-05h", "14/02": "17h-05h", "20/02": "05h-17h", "21/02": "05h-17h", "27/02": "17h-05h", "28/02": "17h-05h", "06/03": "05h-17h", "07/03": "05h-17h", "13/03": "17h-05h", "14/03": "17h-05h", "20/03": "05h-17h", "21/03": "05h-17h", "27/03": "17h-05h", "28/03": "17h-05h", "03/04": "05h-17h", "04/04": "05h-17h", "05/04": "05h-17h", "10/04": "17h-05h", "11/04": "17h-05h", "17/04": "05h-17h", "18/04": "05h-17h", "24/04": "17h-05h", "25/04": "17h-05h", "01/05": "05h-17h", "02/05": "05h-17h", "08/05": "17h-05h", "09/05": "17h-05h", "13/05": "05h-17h", "14/05": "05h-17h", "15/05": "05h-17h", "16/05": "05h-17h", "22/05": "17h-05h", "23/05": "17h-05h", "24/05": "17h-05h", "29/05": "05h-17h", "30/05": "05h-17h", "05/06": "17h-05h", "06/06": "17h-05h", "12/06": "05h-17h", "13/06": "05h-17h", "19/06": "17h-05h", "20/06": "17h-05h", "26/06": "05h-17h", "27/06": "05h-17h", "03/07": "17h-05h", "04/07": "17h-05h", "10/07": "05h-17h", "11/07": "05h-17h", "17/07": "17h-05h", "18/07": "17h-05h", "21/07": "05h-17h", "24/07": "17h-05h", "25/07": "17h-05h", "31/07": "05h-17h", "01/08": "05h-17h", "07/08": "17h-05h", "08/08": "17h-05h", "14/08": "05h-17h", "15/08": "05h-17h", "21/08": "17h-05h", "22/08": "17h-05h", "28/08": "05h-17h", "29/08": "05h-17h", "04/09": "17h-05h", "05/09": "17h-05h", "11/09": "05h-17h", "12/09": "05h-17h", "18/09": "17h-05h", "19/09": "17h-05h", "25/09": "05h-17h", "26/09": "05h-17h", "02/10": "17h-05h", "03/10": "17h-05h", "09/10": "05h-17h", "10/10": "05h-17h", "16/10": "17h-05h", "17/10": "17h-05h", "23/10": "05h-17h", "24/10": "05h-17h", "30/10": "17h-05h", "31/10": "17h-05h", "01/11": "17h-05h", "06/11": "05h-17h", "07/11": "05h-17h", "11/11": "17h-05h", "12/11": "17h-05h", "13/11": "17h-05h", "14/11": "17h-05h", "20/11": "05h-17h", "21/11": "05h-17h", "27/11": "17h-05h", "28/11": "17h-05h", "04/12": "05h-17h", "05/12": "05h-17h", "11/12": "17h-05h", "12/12": "17h-05h", "18/12": "05h-17h", "19/12": "05h-17h", "25/12": "17h-05h", "26/12": "17h-05h"};

/* Vrai des l'instant ou un instantane de planning/absences a ete recu de
   Firebase. Tant qu'il est faux, ABS ne contient que la valeur de secours
   ci-dessous et save() doit laisser le noeud tranquille : seuls les roles
   admin et visiteur chargent les absences, un sous-chef qui enregistre le
   planning ecraserait sinon l'historique complet. */

var ABS=[{n:'Nicolas Fettu',a:'04/01/2025',b:'05/01/2025',d:2,y:'2025'},{n:'Nicolas Fettu',a:'26/04/2025',b:'27/04/2025',d:2,y:'2025'},{n:'Nicolas Fettu',a:'22/11/2025',b:'22/11/2025',d:1,y:'2025'},{n:'Mohamed Lalaoui',a:'29/11/2025',b:'30/11/2025',d:2,y:'2025'},{n:'Ramazani Abdulhassan',a:'28/06/2025',b:'29/06/2025',d:2,y:'2025'},{n:'Halima Laadi',a:'07/06/2025',b:'08/06/2025',d:2,y:'2025'},{n:'Halima Laadi',a:'13/09/2025',b:'14/09/2025',d:2,y:'2025'},{n:'Halima Laadi',a:'14/12/2025',b:'14/12/2025',d:1,y:'2025'},{n:'Balan Marius',a:'13/12/2025',b:'14/12/2025',d:2,y:'2025'},{n:'Lyse Musik',a:'14/12/2025',b:'14/12/2025',d:1,y:'2025'},{n:'Max Secember',a:'26/04/2025',b:'27/04/2025',d:2,y:'2025'},{n:'Monir Salmi',a:'08/02/2025',b:'09/02/2025',d:2,y:'2025'},{n:'Anthony Raimondi',a:'15/11/2025',b:'23/11/2025',d:4,y:'2025'},{n:'Nicolas Fettu',a:'07/02/2026',b:'08/02/2026',d:2,y:'2026'},{n:'Julien Demuyter',a:'11/01/2026',b:'11/01/2026',d:1,y:'2026'},{n:'Julien Demuyter',a:'22/03/2026',b:'22/03/2026',d:1,y:'2026'},{n:'Julien Demuyter',a:'25/04/2026',b:'26/04/2026',d:2,y:'2026'},{n:'Mohamed Lalaoui',a:'14/03/2026',b:'22/03/2026',d:4,y:'2026'},{n:'Mohamed Lalaoui',a:'11/04/2026',b:'19/04/2026',d:4,y:'2026'},{n:'Ramazani Abdulhassan',a:'14/02/2026',b:'15/02/2026',d:2,y:'2026'},{n:'Halima Laadi',a:'11/04/2026',b:'12/04/2026',d:2,y:'2026'},{n:'Hakkim Akkouh',a:'27/06/2026',b:'28/06/2026',d:2,y:'2026'},{n:'Anthony Raimondi',a:'17/01/2026',b:'18/01/2026',d:2,y:'2026'},{n:'Anthony Raimondi',a:'28/02/2026',b:'01/03/2026',d:2,y:'2026'},{n:'Anthony Raimondi',a:'28/03/2026',b:'29/03/2026',d:2,y:'2026'},{n:'Lachen Baraik',a:'31/01/2026',b:'15/02/2026',d:6,y:'2026'}];
var BD=[{n:'Aurelien Turchi',D:0,S:0,sc:0,T:[0,0,0,0]},{n:'Nicolas Fettu',D:3,S:2,sc:12,T:[0,0,1,0]},{n:'Julien Demuyter',D:4,S:3,sc:36,T:[0,0,0,0]},{n:'Mohamed Lalaoui',D:10,S:3,sc:90,T:[0,0,2,0]},{n:'Ramazani Abdulhassan',D:4,S:2,sc:16,T:[0,0,0,2]},{n:'Halima Laadi',D:5,S:3,sc:45,T:[0,0,0,0]},{n:'Hakkim Akkouh',D:2,S:1,sc:2,T:[0,0,0,0]},{n:'Balan Marius',D:2,S:1,sc:2,T:[0,0,0,0]},{n:'Lyse Musik',D:1,S:1,sc:1,T:[0,0,0,0]},{n:'Max Secember',D:0,S:0,sc:0,T:[0,0,0,0]},{n:'Larissa Fratutescu',D:0,S:0,sc:0,T:[0,0,0,0]},{n:'Monir Salmi',D:0,S:0,sc:0,T:[0,0,0,0]},{n:'Anthony Raimondi',D:10,S:4,sc:160,T:[0,0,0,0]},{n:'Brahim Akdim',D:0,S:0,sc:0,T:[0,0,0,0]},{n:'Lachen Baraik',D:6,S:1,sc:6,T:[0,0,0,0]}];







document.querySelectorAll('.tab').forEach(function(b){b.addEventListener('click',function(){document.querySelectorAll('.tab').forEach(function(x){x.classList.remove('on');});document.querySelectorAll('.pane').forEach(function(x){x.classList.remove('on');});b.classList.add('on');document.getElementById('pane-'+b.dataset.tab).classList.add('on');
  if(b.dataset.tab === 'cmp2' && typeof buildComparaisonTab === 'function') buildComparaisonTab();
  if(b.dataset.tab === 'bulk' && typeof buildBulkSections === 'function') buildBulkSections();
  if(b.dataset.tab === 'ncp' && typeof buildNCPTab === 'function') buildNCPTab();
  if(b.dataset.tab === 'recrutement' && typeof buildRecrutementTab === 'function') buildRecrutementTab();
if(b.dataset.tab === 'espace' && typeof buildMonEspace === 'function') buildMonEspace();
});});

// ==============================================================
// Barre d onglets : defilement horizontal (molette, glisser, tactile)
// ==============================================================
(function(){
  var nav = document.querySelector('nav.tabs');
  if(!nav) return;

  // Enveloppe la barre pour pouvoir afficher les degrades et les fleches
  var wrap = nav.parentElement;
  if(!wrap || !wrap.classList.contains('tabs-wrap')){
    wrap = document.createElement('div');
    wrap.className = 'tabs-wrap';
    nav.parentNode.insertBefore(wrap, nav);
    wrap.appendChild(nav);
  }

  var btnL = document.createElement('button');
  btnL.className = 'tabs-nav l';
  btnL.type = 'button';
  btnL.setAttribute('aria-label', 'Onglets precedents');
  btnL.innerHTML = '&#8249;';
  var btnR = document.createElement('button');
  btnR.className = 'tabs-nav r';
  btnR.type = 'button';
  btnR.setAttribute('aria-label', 'Onglets suivants');
  btnR.innerHTML = '&#8250;';
  wrap.appendChild(btnL);
  wrap.appendChild(btnR);

  function pas(){ return Math.max(140, nav.clientWidth * 0.6); }
  btnL.addEventListener('click', function(){ nav.scrollBy({ left: -pas(), behavior: 'smooth' }); });
  btnR.addEventListener('click', function(){ nav.scrollBy({ left: pas(), behavior: 'smooth' }); });

  // Indicateurs de bord : on sait s il reste des onglets a gauche / a droite
  function majBords(){
    var max = nav.scrollWidth - nav.clientWidth;
    wrap.classList.toggle('can-l', nav.scrollLeft > 4);
    wrap.classList.toggle('can-r', nav.scrollLeft < max - 4);
  }
  nav.addEventListener('scroll', majBords, { passive: true });
  window.addEventListener('resize', majBords);
  if(window.ResizeObserver){ try { new ResizeObserver(majBords).observe(nav); } catch(e){} }

  // Molette verticale -> defilement horizontal
  nav.addEventListener('wheel', function(e){
    if(Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    var max = nav.scrollWidth - nav.clientWidth;
    if(max <= 0) return;
    var next = nav.scrollLeft + e.deltaY;
    if(next < 0) next = 0;
    if(next > max) next = max;
    if(next === nav.scrollLeft) return;
    e.preventDefault();
    nav.scrollLeft = next;
  }, { passive: false });

  // Glisser-deposer (souris, stylet, tactile)
  var drag = false, xDep = 0, sDep = 0, bouge = 0;
  nav.addEventListener('pointerdown', function(e){
    if(e.pointerType === 'mouse' && e.button !== 0) return;
    drag = true; bouge = 0;
    xDep = e.clientX; sDep = nav.scrollLeft;
    nav.classList.add('is-dragging');
  });
  nav.addEventListener('pointermove', function(e){
    if(!drag) return;
    var dx = e.clientX - xDep;
    if(Math.abs(dx) > 3){
      bouge = Math.abs(dx);
      if(nav.setPointerCapture && e.pointerId !== undefined){ try { nav.setPointerCapture(e.pointerId); } catch(err){} }
    }
    nav.scrollLeft = sDep - dx;
  });
  function finDrag(){
    if(!drag) return;
    drag = false;
    nav.classList.remove('is-dragging');
  }
  nav.addEventListener('pointerup', finDrag);
  nav.addEventListener('pointercancel', finDrag);
  nav.addEventListener('pointerleave', finDrag);
  // Un glisser ne doit pas declencher le changement d onglet
  nav.addEventListener('click', function(e){
    if(bouge > 6){ e.stopPropagation(); e.preventDefault(); bouge = 0; }
  }, true);

  // L onglet actif reste toujours visible
  function voirActif(){
    var on = nav.querySelector('.tab.on');
    if(!on) return;
    var gauche = on.offsetLeft;
    var droite = gauche + on.offsetWidth;
    if(gauche < nav.scrollLeft + 30){
      nav.scrollTo({ left: Math.max(0, gauche - 40), behavior: 'smooth' });
    } else if(droite > nav.scrollLeft + nav.clientWidth - 30){
      nav.scrollTo({ left: droite - nav.clientWidth + 40, behavior: 'smooth' });
    }
    majBords();
  }
  nav.addEventListener('click', function(e){
    var b = e.target.closest ? e.target.closest('.tab') : null;
    if(b) setTimeout(voirActif, 60);
  });
  window.voirOngletActif = voirActif;

  // Fleches gauche / droite au clavier
  nav.addEventListener('keydown', function(e){
    if(e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var visibles = [].slice.call(nav.querySelectorAll('.tab')).filter(function(t){ return t.offsetParent !== null; });
    var idx = visibles.indexOf(document.activeElement);
    if(idx === -1) return;
    var suiv = visibles[idx + (e.key === 'ArrowRight' ? 1 : -1)];
    if(suiv){ e.preventDefault(); suiv.focus(); suiv.click(); }
  });

  setTimeout(function(){ majBords(); voirActif(); }, 300);
  setTimeout(majBords, 1200);
})();















// --- Navigation mois planning ---



// --- Export CSV Bradford ---


// --- Mini calendrier 30 prochains jours ---








 // {nm,i}
 // {d,i}[] des colonnes actuellement affichees, pour rafraichir le panneau de notes sans reconstruire tout le tableau



 // 'texte|langue-cible' -> texte traduit (evite de re-appeler l'API)












 // {nm, i}
 // index en cours de modification dans la liste, -1 = mode ajout









document.addEventListener('click',function(e){if(popup&&!popup.contains(e.target))closePopup();});




document.querySelectorAll('.fb').forEach(function(b){b.addEventListener('click',function(){document.querySelectorAll('.fb').forEach(function(x){x.classList.remove('on');});b.classList.add('on');buildAbs(b.dataset.f);});});
document.querySelectorAll('.ytab').forEach(function(b){b.addEventListener('click',function(){document.querySelectorAll('.ytab').forEach(function(x){x.classList.remove('on');});b.classList.add('on');curYear=b.dataset.yr;curMonth=null;buildPT();});});







// Verification centralisee des droits

// Verification pour les actions admin uniquement

// ---- GESTION EMPLOYES ----














window.addEventListener('load',function(){
  applyI18n();
  document.getElementById('dchip').textContent=new Date().toLocaleDateString('fr-BE',{weekday:'short',day:'2-digit',month:'short',year:'numeric'});
  var cfg={apiKey:"AIzaSyAexVCEfVxmShZ-m7xFAVfk9AzReBi2WTQ",authDomain:"aw3-p5-hub.firebaseapp.com",databaseURL:"https://aw3-p5-hub-default-rtdb.europe-west1.firebasedatabase.app",projectId:"aw3-p5-hub",storageBucket:"aw3-p5-hub.firebasestorage.app",messagingSenderId:"685884843934",appId:"1:685884843934:web:ab8f7b8e362959f1ab988f"};
  var app;
  if(typeof firebase==='undefined'){
    console.error('[Firebase] SDK non charge');
    try{var el=document.getElementById('splash-screen');if(el){el.innerHTML='<div style="position:relative;z-index:1;text-align:center;color:#fff;font-family:Inter,sans-serif;padding:0 24px"><div style="font-size:15px;font-weight:600;margin-bottom:8px">Connexion a Firebase impossible</div><div style="font-size:13px;color:rgba(255,255,255,.7);margin-bottom:20px">Verifie ta connexion internet, ou reessaie.</div><button onclick="location.reload()" style="padding:10px 22px;border-radius:8px;border:none;background:#3b82f6;color:#fff;font-family:Inter,sans-serif;font-size:14px;font-weight:600;cursor:pointer">Recharger la page</button></div>';}}catch(e2){}
    return;
  }
  try{app=firebase.apps.length?firebase.apps[0]:firebase.initializeApp(cfg);}catch(e){app=firebase.app();}
  firebase.auth(app).onAuthStateChanged(function(user){
    if(user){currentUser=user;document.getElementById('user-email').textContent=user.email;document.getElementById('login-screen').style.display='none';document.getElementById('app-screen').style.display='flex';firebase.database(app).ref('users/'+user.uid).once('value').then(function(snap){var uRec=snap.val()||{};var role=uRec.role||'subchef';console.log('[DIAGNOSTIC] UID connecte :', user.uid, '| donnees lues depuis Firebase :', JSON.stringify(uRec), '| role applique :', role);currentUser.role=role;currentUser.tabs=uRec.tabs||null;currentUser.editPlanning=!!uRec.editPlanning;currentUser.nom=uRec.nom||null;applyRole(role);initFirebase(app);startApp();loadBirthdaysFromFirebase();}).catch(function(e){console.error('[DIAGNOSTIC] Erreur de lecture du role :', e);currentUser.role='subchef';applyRole('subchef');initFirebase(app);startApp();loadBirthdaysFromFirebase();});}
    else{document.getElementById('login-screen').style.display='flex';document.getElementById('app-screen').style.display='none';}
  });
});








function startApp(){
  if(db){
    var loaded={s26:false,s25:false,s27:false,abs:false,emp:false};
    function tryBuild(){
      if(loaded.s26&&loaded.s25&&loaded.s27&&loaded.abs&&loaded.emp){
        recalc();updKPI();initCharts();buildBT();buildPT();buildAbs('all');updAbsLbl();buildMiniCal();buildTodayAbs();buildBirthdayNotif();buildBirthdayCal();loadPointages();loadArretsInpak();loadBulkData();loadNCPData();
        buildEmpTable();
      }
    }
    // Charger employes depuis Firebase
    db.ref('employees').once('value').then(function(snap){
      var data=snap.val();
      if(data){
        var empArr=[];
        Object.keys(data).forEach(function(k){
          var e=data[k];
          if(e&&e.active!==false)empArr.push({n:e.name,g:e.group,r:e.role,id:k,order:e.order||99,birthday:e.birthday||''});
        });
        empArr.sort(function(a,b){return a.order-b.order;});
        if(empArr.length>0){
          EMP.splice(0,EMP.length);
          empArr.forEach(function(e){EMP.push({n:e.n,g:e.g,r:e.r,id:e.id,birthday:e.birthday||''});});
          // Mettre a jour OPTS depuis Firebase si disponible
        }
      }
      loaded.emp=true;tryBuild();
    }).catch(function(){loaded.emp=true;tryBuild();});
    // Charger shifts 2026
    db.ref('planning/shifts2026').once('value').then(function(snap){
      var data=snap.val();
      if(data){
        SHIFTS26.forEach(function(emp){if(data[emp.n]&&data[emp.n].length)emp.s=data[emp.n];});
        // Ajouter les nouveaux employes Firebase pas encore dans SHIFTS26
        Object.keys(data).forEach(function(nm){
          if(!SHIFTS26.find(function(e){return e.n===nm;})){
            var empInfo=EMP.find(function(e){return e.n===nm;});
            if(empInfo)SHIFTS26.push({n:nm,g:empInfo.g,s:data[nm]});
          }
        });
      }
      loaded.s26=true;tryBuild();
    }).catch(function(){loaded.s26=true;tryBuild();});
    
    // Charger formations depuis Firebase
    db.ref('formations').on('value', function(snap){
      var data = snap.val() || {};
      FORMATIONS = Object.keys(data).map(function(k){ var f = data[k] || {}; f.id = k; return f; });
      FORMATIONS.sort(function(a,b){ return (a.date+(a.heureDebut||'')).localeCompare(b.date+(b.heureDebut||'')); });
      buildFormationsListe();
      buildMiniCalFormations();
      checkFormationNotif();
if(typeof buildMonEspace==='function'&&document.getElementById('espace-content'))buildMonEspace();
    });
  // Charger comptes employes depuis Firebase (admin uniquement, cote regles Firebase)
  if(currentUser && currentUser.role === 'admin'){
    db.ref('users').on('value', function(snap){
      var data = snap.val() || {};
      ACCOUNTS = {};
      Object.keys(data).forEach(function(uid){
        var u = data[uid];
        if(u && u.employeId) ACCOUNTS[u.employeId] = {uid: uid, role: u.role, email: u.email};
      });
      buildComptesEmpListe();
    });
  }
// Charger shifts 2025
    db.ref('planning/shifts2025').once('value').then(function(snap){
      var data=snap.val();
      if(data){
        SHIFTS25.forEach(function(emp){if(data[emp.n]&&data[emp.n].length)emp.s=data[emp.n];});
        Object.keys(data).forEach(function(nm){
          if(!SHIFTS25.find(function(e){return e.n===nm;})){
            var empInfo=EMP.find(function(e){return e.n===nm;});
            if(empInfo)SHIFTS25.push({n:nm,g:empInfo.g,s:data[nm]});
          }
        });
      }
      loaded.s25=true;tryBuild();
    }).catch(function(){loaded.s25=true;tryBuild();});
    // Charger shifts 2027
    db.ref('planning/shifts2027').once('value').then(function(snap){
      var data=snap.val();
      if(data){
        SHIFTS27.forEach(function(emp){if(data[emp.n]&&data[emp.n].length)emp.s=data[emp.n];});
        Object.keys(data).forEach(function(nm){
          if(!SHIFTS27.find(function(e){return e.n===nm;})){
            var empInfo=EMP.find(function(e){return e.n===nm;});
            if(empInfo)SHIFTS27.push({n:nm,g:empInfo.g,s:data[nm]});
          }
        });
      }
      loaded.s27=true;tryBuild();
    }).catch(function(){loaded.s27=true;tryBuild();});
    // Charger absences — admin seulement
    if(currentUser && (currentUser.role === 'admin' || currentUser.role === 'visiteur')){
      db.ref('planning/absences').once('value').then(function(snap){
        var data=snap.val();
        if(data){
          var arr=Array.isArray(data)?data:Object.values(data);
          ABS.splice(0,ABS.length);
          arr.forEach(function(a){if(a)ABS.push(a);});
        }
        /* Instantane recu : ABS reflete desormais le serveur, meme si le
           noeud etait vide. save() peut ecrire ce noeud. */
        ABS_CHARGEES=true;
        loaded.abs=true;tryBuild();
      }).catch(function(){loaded.abs=true;tryBuild();});
    } else {
      // Sous-chef : pas besoin des absences
      loaded.abs=true;tryBuild();
    }
  } else {
    recalc();updKPI();initCharts();buildBT();buildPT();buildAbs('all');updAbsLbl();buildEmpTable();buildMiniCal();buildTodayAbs();buildBirthdayNotif();buildBirthdayCal();loadPointages();loadArretsInpak();loadBulkData();loadNCPData();
  }
}






// ============================================================
// ANNIVERSAIRES
// ============================================================

function getBirthdays(){
  // Retourne la liste des employés avec leur date de naissance
  return EMP.filter(function(e){return e.birthday;}).map(function(e){
    var parts = e.birthday.split('-');
    return {n:e.n, month:parseInt(parts[1],10), day:parseInt(parts[2],10), year:parseInt(parts[0],10), full:e.birthday};
  });
}

function isBirthdayToday(bday){
  var now = new Date();
  return bday.month === now.getMonth()+1 && bday.day === now.getDate();
}

function buildBirthdayNotif(){
  // Bannière si anniversaire aujourd'hui
  var el = document.getElementById('birthday-notif');
  if(!el) return;
  var bdToday = getBirthdays().filter(isBirthdayToday);
  if(!bdToday.length){ el.style.display='none'; return; }
  el.style.display='flex';
  el.innerHTML = '<div style="font-size:20px">🎂</div>'
    +'<div><div style="font-weight:700;font-size:14px;color:#fbbf24">'+t('ov_birthday_happy')+'</div>'
    +'<div style="font-size:13px;color:var(--tx2)">'
    +bdToday.map(function(b){
      var age = new Date().getFullYear()-b.year;
      return '<b>'+b.n.split(' ')[0]+'</b>'+t('ov_birthday_turns1')+age+t('ov_birthday_turns2');
    }).join(' &nbsp;·&nbsp; ')
    +'</div></div>';
}

function buildBirthdayCal(){
  var el = document.getElementById('birthday-cal');
  if(!el) return;
  var now = new Date();
  var bdAll = getBirthdays();
  if(!bdAll.length){
    el.innerHTML='<div style="color:var(--tx3);font-size:13px;padding:12px 0;text-align:center">'+t('ov_birthday_none')+'</div>';
    return;
  }

  // Calculer les 365 prochains jours
  var upcoming = bdAll.map(function(b){
    var thisYear = new Date(now.getFullYear(), b.month-1, b.day);
    var nextYear = new Date(now.getFullYear()+1, b.month-1, b.day);
    var next = thisYear >= now ? thisYear : nextYear;
    var daysUntil = Math.floor((next - now)/(1000*60*60*24));
    var age = next.getFullYear() - b.year;
    return {n:b.n, next:next, daysUntil:daysUntil, age:age, month:b.month, day:b.day};
  }).sort(function(a,b){return a.daysUntil - b.daysUntil;});

  // Trouver le prochain jour de travail (dans WEEKS)
  function nextWorkDay(date){
    var yr = String(date.getFullYear());
    var weeks = yr==='2027'?WEEKS27:yr==='2026'?WEEKS26:WEEKS25;
    var allD = weeks.reduce(function(a,w){return a.concat(w.d);},[]);
    // Chercher à partir de cette date
    for(var offset=0; offset<=7; offset++){
      var d = new Date(date);
      d.setDate(d.getDate()+offset);
      var dd = String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0');
      if(allD.indexOf(dd) !== -1) return {date:d, ddmm:dd, offset:offset};
    }
    return null;
  }

  var MOIS=MOIS_ABBR_I18N[LANG]||MOIS_ABBR_I18N.fr;
  var DOW=DOW_ABBR_I18N[LANG]||DOW_ABBR_I18N.fr;

  el.innerHTML = upcoming.map(function(b){
    var isToday = b.daysUntil === 0;
    var isSoon = b.daysUntil <= 7;
    var workDay = nextWorkDay(b.next);
    var workInfo = '';
    if(workDay && workDay.offset > 0){
      workInfo = '<span style="font-size:10px;color:var(--tx3);margin-left:6px">'+t('ov_birthday_celebrated')+DOW[workDay.date.getDay()]+' '+workDay.date.getDate()+' '+MOIS[workDay.date.getMonth()]+'</span>';
    }
    var bg = isToday?'rgba(251,191,36,.15)':isSoon?'rgba(59,130,246,.07)':'';
    var border = isToday?'border-left:3px solid #fbbf24':'border-left:3px solid transparent';
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:9px 8px;border-bottom:1px solid var(--bd2);'+border+';background:'+bg+'">'
      +'<div style="display:flex;align-items:center;gap:10px">'
      +(isToday?'<span style="font-size:18px">🎂</span>':'<span style="font-size:16px">🎁</span>')
      +'<div>'
      +'<div style="font-size:13px;font-weight:600;color:var(--tx1)">'+b.n.split(' ')[0]+'<span style="font-weight:400;color:var(--tx3);font-size:12px"> '+b.n.split(' ').slice(1).join(' ')+'</span></div>'
      +'<div style="font-size:11px;color:var(--tx3)">'+b.day+' '+MOIS[b.month-1]+' &mdash; '+b.age+' '+t('ov_birthday_years')+workInfo+'</div>'
      +'</div></div>'
      +'<div style="text-align:right">'
      +(isToday?'<span style="font-size:12px;font-weight:700;color:#fbbf24">'+t('ov_birthday_today_label')+'</span>'
               :'<span style="font-size:12px;font-weight:600;color:'+(isSoon?'var(--blue)':'var(--tx3)')+'">'+t('ov_birthday_in_days')+b.daysUntil+'j</span>')
      +'</div>'
      +'</div>';
  }).join('');
}

// Étoile anniversaire sur le planning — appelée dans buildPT
function getBirthdayStarForDate(ddmm, yr){
  var bdAll = getBirthdays();
  var parts = ddmm.split('/');
  var day = parseInt(parts[0],10), month = parseInt(parts[1],10);
  var match = bdAll.filter(function(b){return b.day===day && b.month===month;});
  if(!match.length) return '';
  return ' <span title="Anniversaire : '+match.map(function(b){return b.n.split(' ')[0];}).join(', ')+'">⭐</span>';
}

// Charger les birthdays depuis Firebase dans EMP
// Les dates de naissance sont desormais chargees par le loader principal des
// employes (db.ref('employees')), qui conserve le champ birthday. Cette fonction
// reste appelee juste apres la connexion : elle sert de filet de securite si les
// employes ne sont pas encore charges a ce moment-la.
function loadBirthdaysFromFirebase(){
  if(!db) return;
  db.ref('employees').once('value').then(function(snap){
    var data = snap.val();
    if(!data) return;
    Object.keys(data).forEach(function(id){
      var emp = data[id];
      if(!emp.birthday) return;
      var found = EMP.find(function(e){ return e.n === emp.name; });
      if(found) found.birthday = emp.birthday;
    });
    buildBirthdayNotif();
    buildBirthdayCal();
    buildPT(); // refresh planning avec les etoiles d anniversaire
  });
}

// ============================================================
// Test de fiabilite Firebase (Admin)
// ============================================================


// ============================================================
// POINTAGES — Données, import, affichage, commentaires
// ============================================================

 // {clé: {nom, date, type, detail, statut, commentaire, ts}}







// Ouvrir le modal d'import


// Importer les données depuis le JSON Protime


// Construire le tableau pointages


// Bannière alertes non traitées


// Marquer en masse comme traité (respecte les filtres actifs : personne / type)


// Ouvrir popup commentaire pointage






// ============================================================
// ARRETS INPAK — donnees simples : arrets avec raison + micro-arrets
// venant du script grafana_arrets_inpak.js
// ============================================================

 // {periode, standaard:[], noodafvoer:[], bijlijn1:[], unite}
 // '' ou 'YYYY-MM-DD'
   // '' ou 'YYYY-MM-DD'
var _arretsComparOpChart = null;









/* ================= Surproduction : bulk + bijlijn ================= */
/* Donnees source : bulk_data/{standaard,noodafvoer,bijlijn1} en kg,
   relevees a l'heure. Volumes affiches en tonnes, moyennes en kg/h.
   La repartition par equipe reutilise equipeReelle(jour, heure).
   Le filtre equipe de l'onglet (BULK_EQUIPE_FILTRE) s'applique ici.

   IMPORTANT : les deux sujets sont volontairement independants.
   - standaard + noodafvoer = produit envoye en bulkopvang (perimetre exact
     a confirmer cote Grafana : AW3 seul, ou AW1+AW2+AW3).
   - bijlijn1 = bulk remballe sur la bij-ligne, qui ne vient pas forcement
     d'AW3 ni du jour meme. On ne calcule donc AUCUN ratio entre les deux :
     il serait faux. */


/* Filtre equipe propre a l'onglet Bulk : il etait auparavant partage avec
   l'onglet Arrets, ou vivaient les pastilles. Les deux onglets sont
   maintenant independants. */
   /* [] = toutes les equipes */








/* moyenne rapportee au temps de poste, en kg/h : plus lisible que 0,599 t/h */


/* Journee de production : 05h -> 05h, comme la rotation des equipes.
   Les heures 00h-04h59 appartiennent a la nuit demarree la veille, donc a la
   journee precedente. Sans ca un jour calendaire peut afficher 4 equipes
   (fin de nuit + les 3 postes), ce qui est impossible dans l'atelier. */







/* Heures de poste theoriques : on parcourt chaque heure de la plage et on
   demande a getEquipe qui etait en poste. Donne exactement 40 h/semaine pour
   P1-P2-P3 et 24 h/semaine pour P4-P5, sans rien coder en dur, et suit
   automatiquement la rotation reelle (semaine / week-end). */



/* Agregation : par jour, par equipe, sur une plage et un filtre equipe donnes.
   hBulk / hBij = heures ou l'equipe a effectivement envoye du bulk / emballe.
   hPoste = heures ou elle etait en poste. Le rapport des deux donne le taux
   d'activite, qui rend les 5 equipes comparables malgre 40 h contre 24 h. */


/* ---------- Rendu ---------- */



/* hausseEstBonne : false pour le bulk (plus on envoie en bulk, moins c'est bon). */




/* Indicateurs du bloc "surproduction envoyee en bulk". */


/* Indicateurs du bloc "bijlijn / kruiding emballe". */








/* Cellule "activite" : part du temps de poste ou l'equipe a reellement
   envoye du bulk / emballe. C'est ce qui montre quand ca tourne ou pas. */












/* Rendu maitre : appele au chargement Firebase, au changement de periode
   et au changement du filtre equipe global. */


/* ---------- Actions ---------- */



/* Depuis le 1er janvier de l'annee de la derniere donnee. */










/* Compatibilite : anciens points d'entree. */


















/* ================= Arrets Inpak : referentiel des raisons =================
   Transcrit des feuilles affichees en ligne (10 categories, 43 codes) et
   complete par 3 codes reellement encodes mais absents de la feuille :
   00.03, 04.09 et 06.12.

   Les arrets sont stockes sous la forme "(02.01) Inpak sneller dan aanvoer".
   Le CODE fait foi : c'est lui qui sert de cle de traduction, jamais le
   texte. Les donnees historiques ne sont donc jamais modifiees, et un code
   inconnu retombe proprement sur le libelle neerlandais d'origine.
   Ordre des libelles : [NL, FR, EN]. */





/* "(02.01) Inpak sneller dan aanvoer" -> "02.01" */



/* Libelle traduit, sans le code. Code inconnu : on garde le texte stocke. */

/* Libelle complet affiche : "02.01 - Produit insuffisant ..." */



/* ---------- Analyse des causes : Pareto par categorie, detail au clic ---------- */




/* liste = arrets "avec raison" deja filtres par ligne / equipe / date,
   mais PAS par raison : le Pareto doit toujours montrer toutes les causes. */


/* Depuis le detail : applique le filtre raison global de l'onglet. */






/* ---- Selection multiple d'equipes (onglets Arrets et Bulk) ----
   La selection est un tableau : [] signifie "toutes les equipes".
   Cliquer une pastille l'ajoute ou la retire, "Toutes" remet a zero. */
function equipeDansSel(sel, eq){
  if(!sel || !sel.length) return true;
  return sel.indexOf(eq) !== -1;
}
function basculerEquipe(sel, eq){
  if(eq === 'all') return [];
  var s = (sel || []).slice();
  var i = s.indexOf(eq);
  if(i === -1) s.push(eq); else s.splice(i, 1);
  return s;
}
function selEquipeTexte(sel){
  return (!sel || !sel.length) ? '' : sel.slice().sort().join(', ');
}
function majPastillesEquipe(selecteur, sel){
  document.querySelectorAll(selecteur).forEach(function(b){
    var e = b.dataset.equipe;
    var actif = (e === 'all') ? !(sel && sel.length) : (sel && sel.indexOf(e) !== -1);
    var coul = (e === 'all') ? 'var(--blue)'
             : ((typeof COULEURS_EQUIPE !== 'undefined' && COULEURS_EQUIPE[e]) || 'var(--blue)');
    b.classList.toggle('on', actif);
    b.style.background = actif ? coul : 'none';
    b.style.color = actif ? '#fff' : coul;
    b.style.borderColor = coul;
  });
}

var COULEURS_EQUIPE = { P1:'#8b5cf6', P2:'#06b6d4', P3:'#3b82f6', P4:'#f59e0b', P5:'#10b981' };







// Renvoie vrai si l'heure (HH:MM) est dans les +/- 30 min de la reference




// Retire les doublons deja presents dans Firebase (crees par l'ancienne
// cle aleatoire). Regroupe par ligne+date+heure(+type), ne garde que la
// version la plus recente (ts le plus grand), supprime le reste.
// Montre les doublons detectes SANS rien supprimer — pour verifier avant
// d'agir, et pour pouvoir envoyer un exemple concret si besoin.




// ============================================================
// ONGLET COMPARAISON — equipes (P1-P5) et operateurs, pour une raison
// et une ligne donnees. Etat independant de l'onglet Arrets Inpak.
// ============================================================










/* ============================================================
   NCP QUALITE — Inpak + Production, AW1/AW2/AW3
   Donnees preparees hors-ligne (extraction PDF Outlook), importees
   ici en JSON puis stockees dans Firebase sous ncp_data/
============================================================ */














             // Operateur(s) INPAK affecte(s) a la ligne au moment du NCP -- reutilise
// la meme logique que les Arrets Inpak (SHIFTS + groupes de lignes).
// Uniquement pertinent pour les NCP de type "Inpak" (lignes 31 a 36).









// Traduction a la demande (bouton) via l'API gratuite MyMemory (pas de cle,
// limite ~500 caracteres par requete, ~5000 caract/jour en anonyme -- largement
// suffisant pour un usage manuel fiche par fiche).




 







// --- Selection d une periode (dates libres ou raccourcis) ---


// Jour de la semaine a partir d'une date "DD/MM/YYYY" ou "YYYY-MM-DD".
// Ajoute pour eviter toute confusion/erreur de calcul manuel du jour.









       

            /* Le champ ncp_extra_info contient parfois un fil de mail colle tel quel : en-tetes Van:/Verzonden:/Aan:/CC:/Onderwerp:, signature, telephone, adresse, site. L'heure d'ENVOI du mail n'est PAS l'heure du DEFAUT : sans ce filtre le dashboard retenait par exemple 14:21 (heure d'envoi du mail) au lieu de l'heure reelle, sur 6 fiches. Comme l'heure lue dans le texte est prioritaire sur celle de la fiche, l'equipe attribuee etait fausse. On retire donc ces lignes avant toute lecture d'heure ou de ligne dans le texte libre. */  



       // part de temps mini pour retenir une equipe secondaire
   // au-dela, deux heures citees ne sont pas une plage












   




// ============================================================
// ONGLET RECRUTEMENT — Évaluation mentalité candidats
// Ajouté le 07/08 — stockage Firebase (recrutement/candidats), admin only
// ============================================================


/* ==================== NCP : tuiles KPI exclusives ====================
   Total = Inpak + Production + Sans controle labo Inpak + Sans controle labo Prod
   Un NCP n apparait que dans une seule tuile.
   ==================================================================== */




/* Debloque = Vrijgave explicite ET aucune action restante derriere
   (Dierenvoeding, Strippen, Ompakken... restent bloques) */


/* Bloc de shift couvrant un instant donne (miroir de getEquipe)
   Semaine : 05h-13h / 13h-21h / 21h-05h   -   Week-end : 05h-17h / 17h-05h */


/* Hors shift = la fiche a ete creee en dehors du bloc horaire du shift
   concerne par le defaut (heure reelle du defaut via ncpHeureInfo). */






/* Meme base que les KPI existants : NCP_VUE sans les BLK */























var TAB_LABELS = {ov:'Vue d\'ensemble', br:'Bradford', pl:'Planning', ab:'Absences', formations:'Formations', pt:'Pointages', arrets:'Arrêts Inpak', ncp:'NCP Qualité', recrutement:'Recrutement', espace:'Mon espace'};

















function applyOverviewAccess(){
  var canSeeBradford = !!(currentUser && (currentUser.role==='admin' || currentUser.role==='subchef' || (currentUser.tabs && currentUser.tabs.br)));
  ['k-ok','k-wn','k-cr'].forEach(function(id){
    var el = document.getElementById(id);
    if(el){
      var card = el.closest('.kcard');
      if(card) card.style.display = canSeeBradford ? '' : 'none';
    }
  });
  var bradCanvas = document.getElementById('cBrad');
  if(bradCanvas){
    var chartCard = bradCanvas.closest('.cc');
    if(chartCard) chartCard.style.display = canSeeBradford ? '' : 'none';
  }
  var alertsBox = document.getElementById('k-alerts');
  if(alertsBox && !canSeeBradford) alertsBox.innerHTML = '';
}

/* ============================================================
   NAVIGATION MOBILE — barre du bas + menu "Tout voir"
   Ne duplique aucune logique : reutilise les vrais boutons .tab
   (et donc les vraies regles de visibilite par role/acces perso
   deja appliquees par applyRole()) en simulant un vrai clic dessus.
============================================================ */
var MNAV_ICONS = {
  ov: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V9.5Z"/></svg>',
  br: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  pl: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  espace: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  ab: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  formations: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5Z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></svg>',
  pt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 6.5V12l4 2.2"/></svg>',
  arrets: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16.5" x2="12" y2="16.5"/></svg>',
  ncp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>',
  recrutement: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  admin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82V9a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>'
};
var MNAV_PRIORITY = ['ov','pl','espace','br','ab','ncp','arrets','formations','pt','recrutement','admin'];

function mnavVisibleTabs(){
  return [].slice.call(document.querySelectorAll('.tab[data-tab]')).filter(function(b){
    return b.offsetParent !== null;
  });
}

function buildMobileNav(){
  var nav = document.getElementById('mobile-nav');
  var menuList = document.getElementById('mobile-menu-list');
  if(!nav || !menuList) return;

  var visibles = mnavVisibleTabs();
  var visibleIds = visibles.map(function(b){ return b.dataset.tab; });
  if(!visibleIds.length) return; // rien a construire (avant login / app-screen cache)

  // 4 emplacements principaux, choisis par ordre de priorite parmi les onglets
  // reellement visibles pour le compte connecte (memes regles que applyRole()).
  var primary = MNAV_PRIORITY.filter(function(id){ return visibleIds.indexOf(id) !== -1; }).slice(0, 4);
  // Si moins de 4 onglets prioritaires visibles, on complete avec les autres
  // onglets visibles (cas des acces personnalises tres restreints).
  if(primary.length < 4){
    visibleIds.forEach(function(id){
      if(primary.length < 4 && primary.indexOf(id) === -1) primary.push(id);
    });
  }

  var activeId = (document.querySelector('.tab.on') || {}).dataset ? document.querySelector('.tab.on').dataset.tab : null;

  var activeInPrimary = primary.indexOf(activeId) !== -1;
  var navHtml = primary.map(function(id){
    var on = id === activeId ? ' on' : '';
    return '<button class="mnav-item'+on+'" data-mnav="'+id+'" onclick="mnavGo(\''+id+'\')">'
      + '<span class="mnav-bar"></span>'
      + (MNAV_ICONS[id] || '')
      + '<span class="mnav-lbl">'+t('nav_'+id)+'</span>'
      + '</button>';
  }).join('');
  // 5e emplacement : Menu, toujours present, ouvre la liste complete des
  // onglets visibles (y compris ceux deja epingles au-dessus). S'affiche
  // comme actif quand l'onglet courant n'est pas l'un des 4 epingles, pour
  // qu'il y ait toujours un repere visuel meme depuis un onglet du menu.
  navHtml += '<button class="mnav-item'+(!activeInPrimary && activeId ? ' on' : '')+'" data-mnav="menu" onclick="openMobileMenu()">'
    + '<span class="mnav-bar"></span>' + MNAV_ICONS.menu + '<span class="mnav-lbl">'+t('nav_menu')+'</span></button>';
  nav.innerHTML = navHtml;

  menuList.innerHTML = visibles.map(function(b){
    var id = b.dataset.tab;
    var on = id === activeId ? ' on' : '';
    var lbl = b.querySelector('span[data-i18n]');
    var texte = lbl ? lbl.textContent : (t('tab_'+id) || id);
    return '<button class="mms-item'+on+'" data-mnav="'+id+'" onclick="mnavGo(\''+id+'\')">'
      + (MNAV_ICONS[id] || '') + '<span>'+texte+'</span></button>';
  }).join('');
}

function mnavGo(id){
  var btn = document.querySelector('.tab[data-tab="'+id+'"]');
  if(btn) btn.click();
  closeMobileMenu();
}
function openMobileMenu(){
  var sheet = document.getElementById('mobile-menu-sheet');
  if(sheet) sheet.classList.add('on');
}
function closeMobileMenu(){
  var sheet = document.getElementById('mobile-menu-sheet');
  if(sheet) sheet.classList.remove('on');
}
function updateMobileNavActive(id){
  var matchedPrimary = false;
  document.querySelectorAll('.mnav-item[data-mnav]').forEach(function(el){
    var match = el.dataset.mnav === id;
    if(match) matchedPrimary = true;
    el.classList.toggle('on', match);
  });
  if(!matchedPrimary){
    var menuBtn = document.querySelector('.mnav-item[data-mnav="menu"]');
    if(menuBtn) menuBtn.classList.add('on');
  }
  document.querySelectorAll('.mms-item[data-mnav]').forEach(function(el){
    el.classList.toggle('on', el.dataset.mnav === id);
  });
}
// Ecoute additionnelle sur les vrais boutons d onglets (n interfere pas avec
// le gestionnaire de clic existant) pour garder la barre mobile synchronisee,
// y compris quand un changement d onglet est declenche depuis le code
// (ex: .click() programmatique dans applyRole()).
document.querySelectorAll('.tab[data-tab]').forEach(function(b){
  b.addEventListener('click', function(){ updateMobileNavActive(b.dataset.tab); });
});
// Reconstruit la barre mobile a chaque application des regles de role/acces
// (login, changement de langue via setLang, edition d acces personnalise) —
// donc toujours a jour avec les vraies permissions du compte connecte.
(function(){
  var _applyRoleMnav = applyRole;
  applyRole = function(role){
    var out = _applyRoleMnav.apply(this, arguments);
    try { buildMobileNav(); } catch(e){ console.warn('mobile nav', e); }
    return out;
  };
})();
buildMobileNav();

/* ============================================================
   ECRAN DE DEMARRAGE (splash) — purement cosmetique, independant
   du flux de connexion Firebase : un minimum de temps d'affichage
   (pour eviter un flash trop bref) puis fondu, sans jamais bloquer
   le login si quelque chose se passe mal.
============================================================ */
(function(){
  var SPLASH_MIN_MS = 400;
  var start = new Date().getTime();
  function hideSplash(){
    var el = document.getElementById('splash-screen');
    if(!el || el.dataset.hidden) return;
    el.dataset.hidden = '1';
    var elapsed = new Date().getTime() - start;
    var wait = Math.max(0, SPLASH_MIN_MS - elapsed);
    setTimeout(function(){
      el.classList.add('splash-hide');
      setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); }, 600);
    }, wait);
  }
  if(document.readyState === 'complete'){ hideSplash(); }
  else { window.addEventListener('load', hideSplash); }
  // Filet de securite : si jamais rien ne se declenche (ex: ressource bloquee),
  // on ne laisse jamais le splash recouvrir l'app indefiniment.
  setTimeout(hideSplash, 4000);
})();

/* ==================== NCP : tuile "Fiches a completer" ====================
   Une fiche est dite NON DIRIGEABLE quand la chaine d'attribution ne peut pas
   la router :
     - pas d'unite du tout : ni ligne, ni equipe, ni operateur possibles ;
     - ou fiche Inpak avec une unite mais sans ligne : on sait ou, mais pas sur
       quelle ligne, donc le planning ne peut pas nommer d'operateur.
   Ce sont exactement les deux cas ou une saisie manuelle apporte quelque chose.
   Les fiches Production sans ligne ne sont PAS comptees : la ligne n'y a pas de
   sens, l'unite suffit a les rattacher.
   Bloc ajoute en fin de fichier et branche par enrobage des fonctions
   existantes, pour ne rien modifier de la logique deja en place.
   ========================================================================= */


/* Ecriture d'un override. Le champ est supprime de Firebase quand la valeur est
   vide, ce qui rend la main a la deduction automatique. Le listener temps reel
   sur ncp_data rejoue loadNCPData tout seul : la liste et les tuiles se
   remettent a jour sans rechargement. */





/* La tuile est injectee depuis le JS plutot qu'ecrite dans index.html : meme
   principe que le bouton "Mis de cote", ca evite de toucher au gabarit. */




/* ==================== NCP : tri des listes ====================
   ncpRendreListe affichait les fiches dans l'ordre brut de NCP_DATA, donc
   pele-mele. On enrobe la fonction pour trier AVANT rendu, sans toucher a son
   code : par defaut les plus RECENTES en haut, et un bouton dans l'entete du
   modal bascule sur un tri par PRIORITE (1-Immediate, 2-Urgent, 3-Normal,
   4-Low ; a priorite egale, la plus recente d'abord). Le tri s'applique a
   toutes les listes du dashboard, pas seulement a la tuile "a completer".
   ============================================================== */












/* ==================== NCP : filtre par unite sur les listes ====================
   Ajoute une zone de recherche/filtre (select AW1/AW2/AW3/Toutes) a cote du
   bouton de tri, sur TOUTES les listes NCP (declarant, KPI, tuile a completer,
   etc.). Enrobe ncpRendreListe une nouvelle fois, par dessus le tri deja en
   place, sans toucher a son code. Le filtre repart sur "Toutes" des qu'un titre
   de liste different est ouvert ; il est conserve si on rechange juste le
   filtre sur la meme liste.
   =================================================================================== */










/* ==================== NCP : verrouillage ecriture pour les visiteurs ====================
   Le role "visiteur" (lecture seule) cachait deja les boutons d'import et
   l'onglet Admin, mais pas les actions ecrites depuis l'intérieur d'une fiche
   NCP (Mis de cote, Commenter, Marquer controle, et les corrections manuelles
   unite/ligne/operateur/equipe qu'on a ajoutees). On enrobe ncpDetail : une
   fois la fiche rendue, si le compte connecte est visiteur, on desactive
   uniquement les elements qui declenchent une ecriture Firebase — tout le
   reste (traduire, fermer, degustations liees, historique...) reste
   consultable normalement. Rien n'est modifie dans ncpDetail lui-meme. */

