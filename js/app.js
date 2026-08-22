/* ============================================================
   app.js — AW3 Ploeg 5 Bradford Dashboard
   Contient : CSS (injecté dans <head>) + tout le JS
============================================================ */

// Injecter le CSS dynamiquement
(function(){
  var style = document.createElement('style');
  style.textContent = `
:root{--bg:#0f1117;--bg2:#171b25;--bg3:#1e2436;--bd:rgba(255,255,255,0.07);--bd2:rgba(255,255,255,0.13);--tx:#e8eaf0;--tx2:#8b90a4;--tx3:#555c72;--blue:#3b82f6;--green:#10b981;--amber:#f59e0b;--red:#ef4444;--orange:#f97316;--fn:'Inter',sans-serif;--mo:'JetBrains Mono',monospace;--r:8px}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{overflow-x:hidden;max-width:100vw}
body{background:var(--bg);color:var(--tx);font-family:var(--fn);min-height:100vh;line-height:1.5;font-size:14px}
.topbar{display:flex;align-items:center;gap:16px;padding:0 24px;height:56px;background:var(--bg2);border-bottom:1px solid var(--bd);position:sticky;top:0;z-index:100}
.logo{display:flex;align-items:center;gap:10px;font-size:15px;font-weight:600;letter-spacing:-.02em}
.logo-dot{width:28px;height:28px;border-radius:8px;object-fit:cover;display:block}
.logo-sub{font-size:12px;color:var(--tx3);font-weight:400}
.topbar-r{margin-left:auto;display:flex;align-items:center;gap:10px}
.badge{font-size:11px;padding:3px 10px;border-radius:20px;background:rgba(59,130,246,.15);color:var(--blue);border:1px solid rgba(59,130,246,.25);font-weight:500}
.chip{font-size:11px;color:var(--tx3);font-family:var(--mo)}
.tbtn{display:flex;align-items:center;gap:6px;padding:5px 12px;border-radius:var(--r);border:1px solid var(--bd2);background:none;color:var(--tx2);font-family:var(--fn);font-size:12px;font-weight:500;cursor:pointer;transition:all .15s;white-space:nowrap}
.tbtn:hover{background:var(--bg3);color:var(--tx)}
.save-lbl{font-size:11px;color:var(--tx3);font-family:var(--mo)}
.tabs{display:flex;flex-wrap:nowrap;background:var(--bg2);border-bottom:1px solid var(--bd);padding:0 24px;overflow-x:auto;overflow-y:hidden;scroll-behavior:smooth;scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;scrollbar-width:thin;scrollbar-color:var(--bd2) transparent;cursor:grab;user-select:none}
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
.kcard{background:var(--bg2);border:1px solid var(--bd);border-radius:12px;padding:16px 20px;position:relative;overflow:hidden}
.kcard::before{content:'';position:absolute;top:0;left:0;right:0;height:2px}
.kcard.bl::before{background:var(--blue)}.kcard.gn::before{background:var(--green)}.kcard.am::before{background:var(--amber)}.kcard.rd::before{background:var(--red)}
.klbl{font-size:11px;color:var(--tx3);font-weight:500;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px}
.kval{font-size:28px;font-weight:600;font-family:var(--mo);letter-spacing:-.03em;line-height:1;margin-bottom:4px}
.kcard.bl .kval{color:var(--blue)}.kcard.gn .kval{color:var(--green)}.kcard.am .kval{color:var(--amber)}.kcard.rd .kval{color:var(--red)}
.kmeta{font-size:11px;color:var(--tx3)}
.cc{background:var(--bg2);border:1px solid var(--bd);border-radius:12px;padding:20px 24px;margin-bottom:20px}
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
.sbt{width:80px;height:4px;background:var(--bg3);border-radius:2px;overflow:hidden}
.sbf{height:100%;border-radius:2px}
.sv{font-family:var(--mo);font-size:13px;font-weight:500;min-width:38px;text-align:right}
.pill{display:inline-flex;align-items:center;font-size:11px;font-weight:500;padding:3px 9px;border-radius:20px;white-space:nowrap}
.pill.ok{background:rgba(16,185,129,.12);color:var(--green)}
.pill.wn{background:rgba(245,158,11,.15);color:var(--amber)}
.pill.al{background:rgba(249,115,22,.15);color:var(--orange)}
.pill.cr{background:rgba(239,68,68,.15);color:var(--red)}
.sr td{background:var(--bg3)!important;color:var(--tx3);font-size:10px;text-transform:uppercase;letter-spacing:.08em;font-weight:600;padding:5px 14px}
.ptb{display:flex;align-items:center;gap:12px;margin-bottom:20px;flex-wrap:wrap}
.ytabs{display:flex;gap:4px}
.ytab{padding:5px 14px;border-radius:var(--r);border:1px solid var(--bd);background:none;font-size:12px;font-family:var(--fn);color:var(--tx2);cursor:pointer;font-weight:500;transition:all .15s}
.ytab.on{background:var(--blue);color:#fff;border-color:var(--blue)}
.pscroll{overflow-x:auto;border-radius:12px;border:1px solid var(--bd)}
.ptable{border-collapse:collapse;font-size:12px;min-width:900px;width:100%}
.ptable th{padding:8px 10px;background:var(--bg3);color:var(--tx3);font-weight:500;font-size:10px;text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid var(--bd);white-space:nowrap;text-align:center}
.ptable th.nc{text-align:left;min-width:160px}
.ptable td{padding:5px 4px;border-bottom:1px solid var(--bd);text-align:center;white-space:nowrap}
.ptable td.nc{text-align:left;padding-left:14px;font-weight:500;color:var(--tx);position:sticky;left:0;background:var(--bg2);z-index:1;border-right:1px solid var(--bd)}
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
.popup{position:fixed;z-index:1000;background:var(--bg2);border:1px solid var(--bd2);border-radius:10px;padding:8px;min-width:165px;box-shadow:0 8px 32px rgba(0,0,0,.5);display:none;max-height:min(70vh,420px);overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}
.ptit{font-size:10px;color:var(--tx3);font-weight:600;text-transform:uppercase;letter-spacing:.06em;padding:4px 6px 8px;border-bottom:1px solid var(--bd);margin-bottom:6px}
.popt{display:flex;align-items:center;gap:8px;padding:5px 6px;border-radius:6px;cursor:pointer;font-size:12px;color:var(--tx);transition:background .1s}
.popt:hover{background:var(--bg3)}
.popt .sp{font-size:10px;font-family:var(--mo);font-weight:500;padding:2px 6px;border-radius:4px;min-width:60px;text-align:center}
.pcancel{margin-top:6px;border-top:1px solid var(--bd);padding-top:6px;font-size:11px;color:var(--tx3);text-align:center;padding-bottom:2px;cursor:pointer}
.pcancel:hover{color:var(--tx)}
.toast{position:fixed;bottom:24px;right:24px;z-index:2000;background:var(--bg2);border:1px solid var(--bd2);border-radius:10px;padding:12px 18px;font-size:13px;color:var(--tx);display:flex;align-items:center;gap:10px;box-shadow:0 8px 24px rgba(0,0,0,.5);animation:ti .2s ease;pointer-events:none}
@keyframes ti{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.tdot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.agrid{display:flex;flex-direction:column;gap:8px}
.arow{display:grid;grid-template-columns:180px 100px 100px 60px 1fr 100px;gap:12px;align-items:center;background:var(--bg2);border:1px solid var(--bd);border-radius:var(--r);padding:12px 16px;min-width:640px}
.an{font-weight:500;font-size:13px}
.ad{font-size:12px;color:var(--tx2);font-family:var(--mo)}
.aj{font-family:var(--mo);font-size:13px;font-weight:500;color:var(--amber)}
.ab{height:4px;background:var(--bg3);border-radius:2px;overflow:hidden}
.abf{height:100%;background:var(--amber);border-radius:2px}
.ay{font-size:11px;color:var(--tx3);text-align:right}
.aflt{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}
.fb{padding:5px 12px;border-radius:20px;border:1px solid var(--bd);background:none;font-size:11px;font-family:var(--fn);color:var(--tx2);cursor:pointer;font-weight:500;transition:all .15s}
.fb.on{background:rgba(59,130,246,.15);color:var(--blue);border-color:rgba(59,130,246,.4)}
.ahdr{display:grid;grid-template-columns:180px 100px 100px 60px 1fr 100px;gap:12px;padding:0 16px 8px;min-width:640px}
.ascroll{overflow-x:auto}
.ahdr span{font-size:10px;color:var(--tx3);text-transform:uppercase;letter-spacing:.06em;font-weight:500}
.empty{text-align:center;padding:48px 0;color:var(--tx3);font-size:13px}
.pbtn{display:flex;align-items:center;gap:7px;padding:7px 16px;border-radius:var(--r);border:1px solid var(--bd2);background:var(--bg3);color:var(--tx);font-family:var(--fn);font-size:12px;font-weight:500;cursor:pointer;transition:background .15s}
.pbtn:hover{background:#2a3050}
::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--bg3);border-radius:3px}
.login-screen{position:fixed;inset:0;background:var(--bg);display:flex;align-items:center;justify-content:center;z-index:9999}
.login-box{background:var(--bg2);border:1px solid var(--bd2);border-radius:16px;padding:40px 36px;width:360px;display:flex;flex-direction:column;gap:20px}
.login-logo{display:flex;align-items:center;gap:12px;margin-bottom:4px}
.login-logo .dot{width:36px;height:36px;border-radius:10px;object-fit:cover;display:block}
.login-title{font-size:18px;font-weight:600;letter-spacing:-.02em;color:var(--tx)}
.login-sub{font-size:12px;color:var(--tx3)}
.li-field{display:flex;flex-direction:column;gap:6px}
.li-label{font-size:11px;color:var(--tx3);font-weight:500;text-transform:uppercase;letter-spacing:.06em}
.li-input{background:var(--bg3);border:1px solid var(--bd2);border-radius:8px;padding:10px 14px;font-size:13px;color:var(--tx);font-family:var(--fn);outline:none;transition:border-color .15s}
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
.note-card{display:flex;flex-direction:column;gap:6px;background:var(--bg2);border:1px solid var(--bd2);border-left:3px solid var(--amber);border-radius:8px;padding:10px 12px;cursor:pointer;transition:background .1s}
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
.tabs-nav{position:absolute;top:50%;transform:translateY(-50%);z-index:4;width:26px;height:26px;border-radius:99px;border:1px solid var(--bd2);background:var(--bg3);color:var(--tx2);cursor:pointer;display:none;align-items:center;justify-content:center;font-size:13px;line-height:1;padding:0}
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
.ncp-date-input{padding:6px 10px;border-radius:var(--r);border:1px solid var(--bd2);background:var(--bg3);color:var(--tx);font-family:var(--fn);font-size:12px;color-scheme:dark}
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
#pane-recrutement input[type=text],#pane-recrutement input[type=date],#pane-recrutement textarea,#pane-recrutement select{width:100%;border:1px solid var(--bd2);border-radius:var(--r);padding:10px 11px;font-size:13.5px;font-family:var(--fn);color:var(--tx);background:var(--bg3)}
#pane-recrutement textarea{resize:vertical;min-height:56px}
#pane-recrutement select{color-scheme:dark}
#pane-recrutement .rec-axe{border-top:1px solid var(--bd);padding-top:14px;margin-top:14px}
#pane-recrutement .rec-axe:first-of-type{border-top:none;margin-top:0;padding-top:0}
#pane-recrutement .rec-axe-titre{font-weight:700;font-size:14px;margin-bottom:2px;color:var(--tx)}
#pane-recrutement .rec-axe-question{font-size:12.5px;color:var(--tx2);margin-bottom:10px;line-height:1.45}
#pane-recrutement .rec-toggle-reperes{background:none;border:none;color:var(--blue);font-size:11.5px;font-weight:600;padding:0;margin-bottom:10px;cursor:pointer;text-decoration:underline}
#pane-recrutement .rec-reperes{background:var(--bg3);border:1px solid var(--bd);border-radius:8px;padding:10px 11px;margin-bottom:12px}
#pane-recrutement .rec-repere{display:flex;gap:9px;align-items:flex-start;font-size:12px;line-height:1.4;color:var(--tx2);margin-bottom:8px}
#pane-recrutement .rec-repere:last-child{margin-bottom:0}
#pane-recrutement .rec-repere-n{flex-shrink:0;width:20px;height:20px;border-radius:5px;color:#fff;font-weight:700;font-size:11px;display:flex;align-items:center;justify-content:center}
#pane-recrutement .rec-repere-n.rec-s1{background:var(--red)}
#pane-recrutement .rec-repere-n.rec-s3{background:var(--amber);color:#111}
#pane-recrutement .rec-repere-n.rec-s4{background:var(--green)}
#pane-recrutement .rec-scale{display:flex;gap:6px}
#pane-recrutement .rec-scale button{flex:1;padding:10px 0;border-radius:var(--r);border:1.5px solid var(--bd2);background:var(--bg3);font-weight:700;font-size:14px;color:var(--tx2);cursor:pointer}
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
#pane-recrutement .rec-verdict-choix button{flex:1;min-width:100px;padding:10px 6px;border-radius:var(--r);border:1.5px solid var(--bd2);background:var(--bg3);font-weight:600;font-size:12px;cursor:pointer;color:var(--tx2);font-family:var(--fn)}
#pane-recrutement .rec-verdict-choix button.sel-bon{background:var(--green);border-color:var(--green);color:#fff}
#pane-recrutement .rec-verdict-choix button.sel-creuser{background:var(--amber);border-color:var(--amber);color:#111}
#pane-recrutement .rec-verdict-choix button.sel-incompatible{background:var(--red);border-color:var(--red);color:#fff}
#pane-recrutement .rec-cc-item{display:flex;align-items:center;gap:10px;padding:9px 10px;border:1px solid var(--bd);border-radius:var(--r);background:var(--bg3);margin-bottom:8px}
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
.rec-io-top{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;background:var(--bg2);color:var(--tx);border-bottom:1px solid var(--bd);flex-shrink:0}
.rec-io-close{background:none;border:none;color:var(--tx);font-size:20px;cursor:pointer;padding:2px 6px}
.rec-io-progress{font-weight:700;font-size:12px;color:var(--blue);letter-spacing:.04em}
.rec-io-body{flex:1;overflow-y:auto;padding:22px 18px;max-width:640px;margin:0 auto;width:100%}
.rec-io-nav{display:flex;gap:10px;padding:14px 18px;border-top:1px solid var(--bd);background:var(--bg2);flex-shrink:0}
.rec-io-nav button:disabled{opacity:.4;cursor:default}
.rec-io-question-titre{font-size:19px;font-weight:700;margin-bottom:10px;line-height:1.25;color:var(--tx)}
.rec-io-question-txt{font-size:14px;color:var(--tx2);line-height:1.5;margin-bottom:16px}
.rec-io-body .rec-scale button{font-size:18px;padding:15px 0}
.rec-io-body label{display:block;font-size:11px;font-weight:600;color:var(--tx3);text-transform:uppercase;letter-spacing:.05em;margin-top:18px;margin-bottom:6px}
.rec-io-body textarea{width:100%;border:1px solid var(--bd2);border-radius:var(--r);padding:10px 11px;font-size:13.5px;font-family:var(--fn);color:var(--tx);background:var(--bg3);resize:vertical;min-height:56px}

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

var currentUser=null,db=null,isSyncing=false,curYear='2026',curMonth=null,activePill=null,popup=null;
var BD_COMMENTS={};
var EXTRA_HIST=[]; // historique des noms deja utilises pour le personnel extra (autocompletion)

// ===== i18n =====
// Etape 1 : squelette + chrome partage (login/topbar/nav) + onglet Planning.
// Les autres onglets restent a traduire au fur et a mesure (cle absente = repli automatique sur le francais).
var I18N={
  fr:{
    login_email:'Email', login_password:'Mot de passe', login_btn:'Se connecter',
    login_forgot:'Mot de passe oublié ?', login_autoconnect:'Tu resteras connecté automatiquement',
    topbar_connecting:'Connexion...', topbar_logout:'Déconnexion',
    tab_ov:'Vue d’ensemble', tab_br:'Bradford', tab_pl:'Planning', tab_ab:'Absences',
    tab_pt:'Pointages', tab_arrets:'Arrêts Inpak', tab_cmp2:'Comparaison', tab_admin:'Admin',
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
    ov_today_prefix:'Absents aujourd’hui', ov_today_allpresent:'Tout le monde est present ✅',
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
    arr_subtitle:'Lignes 31 a 36 — arrets avec raison et micro-arrets',
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
    br_history_title:'Historique episodes (365j)',
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
    espace_ncp_note:'Limité aux créneaux où l’appartenance à l’équipe P5 est identifiable (week-ends).',
    espace_ncp_banner:'👏 {n} sur {total} détecté(s) directement par toi pendant ton poste — c’est beaucoup mieux que découvert plus tard !',
    espace_ncp_direct:'👍 Vu directement par toi', espace_ncp_late:'🔎 Découvert après coup (labo)',
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
    login_forgot:'Wachtwoord vergeten?', login_autoconnect:'Je blijft automatisch aangemeld',
    topbar_connecting:'Verbinden...', topbar_logout:'Afmelden',
    tab_ov:'Overzicht', tab_br:'Bradford', tab_pl:'Planning', tab_ab:'Afwezigheden',
    tab_pt:'Tijdsregistraties', tab_arrets:'Inpak Stilstanden', tab_cmp2:'Vergelijking', tab_admin:'Admin',
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
    ov_today_prefix:'Afwezig vandaag', ov_today_allpresent:'Iedereen is aanwezig ✅',
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
    arr_subtitle:'Lijnen 31 tot 36 — stilstanden met reden en micro-stilstanden',
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
    br_history_title:'Geschiedenis episodes (365d)',
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
    espace_ncp_note:'Beperkt tot de tijdstippen waarop het behoren tot het P5-team identificeerbaar is (weekends).',
    espace_ncp_banner:'👏 {n} van {total} rechtstreeks door jou opgemerkt tijdens je shift — dat is veel beter dan later ontdekt!',
    espace_ncp_direct:'👍 Rechtstreeks door jou opgemerkt', espace_ncp_late:'🔎 Later ontdekt (labo)',
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
    login_forgot:'Forgot password?', login_autoconnect:'You will stay automatically logged in',
    topbar_connecting:'Connecting...', topbar_logout:'Log out',
    tab_ov:'Overview', tab_br:'Bradford', tab_pl:'Planning', tab_ab:'Absences',
    tab_pt:'Time tracking', tab_arrets:'Inpak Stops', tab_cmp2:'Comparison', tab_admin:'Admin',
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
    ov_today_prefix:'Absent today', ov_today_allpresent:'Everyone is present ✅',
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
    arr_subtitle:'Lines 31 to 36 — stops with reason and micro-stops',
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
    br_history_title:'Episode history (365d)',
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
    espace_ncp_note:'Limited to time slots where P5 team membership is identifiable (weekends).',
    espace_ncp_banner:'👏 {n} of {total} detected directly by you during your shift — that’s much better than being found later!',
    espace_ncp_direct:'👍 Spotted directly by you', espace_ncp_late:'🔎 Found later (lab)',
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
var CMP2_MOIS_I18N={
  fr:['Jan','Fev','Mar','Avr','Mai','Jun','Jul','Aou','Sep','Oct','Nov','Dec'],
  nl:['Jan','Feb','Mrt','Apr','Mei','Jun','Jul','Aug','Sep','Okt','Nov','Dec'],
  en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
};
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
}
function toggleLang(){setLang(LANG_ORDER[(LANG_ORDER.indexOf(LANG)+1)%LANG_ORDER.length]);}
var BD_PREV_STATUS={};
var ACCOUNTS={};
var FORMATIONS=[];
var formationEditId=null;
var canEditFormations=false;

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
var H2026={"01/01": "05h-17h", "02/01": "05h-17h", "03/01": "05h-17h", "04/01": "05h-17h", "10/01": "17h-05h", "11/01": "17h-05h", "17/01": "05h-17h", "18/01": "05h-17h", "24/01": "17h-05h", "25/01": "17h-05h", "31/01": "05h-17h", "01/02": "05h-17h", "07/02": "17h-05h", "08/02": "17h-05h", "14/02": "05h-17h", "15/02": "05h-17h", "21/02": "17h-05h", "22/02": "17h-05h", "28/02": "05h-17h", "01/03": "05h-17h", "07/03": "17h-05h", "08/03": "17h-05h", "14/03": "05h-17h", "15/03": "05h-17h", "21/03": "17h-05h", "22/03": "17h-05h", "28/03": "05h-17h", "29/03": "05h-17h", "04/04": "17h-05h", "05/04": "17h-05h", "06/04": "17h-05h", "11/04": "05h-17h", "12/04": "05h-17h", "18/04": "17h-05h", "19/04": "17h-05h", "25/04": "05h-17h", "26/04": "05h-17h", "01/05": "17h-05h", "02/05": "17h-05h", "03/05": "17h-05h", "09/05": "05h-17h", "10/05": "05h-17h", "14/05": "17h-05h", "15/05": "17h-05h", "16/05": "17h-05h", "17/05": "17h-05h", "23/05": "05h-17h", "24/05": "05h-17h", "25/05": "05h-17h", "30/05": "17h-05h", "31/05": "17h-05h", "06/06": "05h-17h", "07/06": "05h-17h", "13/06": "17h-05h", "14/06": "17h-05h", "20/06": "05h-17h", "21/06": "05h-17h", "27/06": "17h-05h", "28/06": "17h-05h", "04/07": "05h-17h", "05/07": "05h-17h", "11/07": "17h-05h", "12/07": "17h-05h", "18/07": "05h-17h", "19/07": "05h-17h", "20/07": "05h-17h", "21/07": "05h-17h", "25/07": "17h-05h", "26/07": "17h-05h", "01/08": "05h-17h", "02/08": "05h-17h", "08/08": "17h-05h", "09/08": "17h-05h", "15/08": "05h-17h", "16/08": "05h-17h", "22/08": "17h-05h", "23/08": "17h-05h", "29/08": "05h-17h", "30/08": "05h-17h", "05/09": "17h-05h", "06/09": "17h-05h", "12/09": "05h-17h", "13/09": "05h-17h", "19/09": "17h-05h", "20/09": "17h-05h", "26/09": "05h-17h", "27/09": "05h-17h", "03/10": "17h-05h", "04/10": "17h-05h", "10/10": "05h-17h", "11/10": "05h-17h", "17/10": "17h-05h", "18/10": "17h-05h", "24/10": "05h-17h", "25/10": "05h-17h", "31/10": "17h-05h", "01/11": "17h-05h", "07/11": "05h-17h", "08/11": "05h-17h", "11/11": "17h-05h", "14/11": "05h-17h", "15/11": "05h-17h", "21/11": "17h-05h", "22/11": "17h-05h", "28/11": "05h-17h", "29/11": "05h-17h", "05/12": "17h-05h", "06/12": "17h-05h", "12/12": "05h-17h", "13/12": "05h-17h", "19/12": "17h-05h", "20/12": "17h-05h", "25/12": "05h-17h", "26/12": "05h-17h", "27/12": "05h-17h"};
var H2027={"01/01": "17h-05h", "02/01": "17h-05h", "03/01": "17h-05h", "09/01": "05h-17h", "10/01": "05h-17h", "16/01": "17h-05h", "17/01": "17h-05h", "23/01": "05h-17h", "24/01": "05h-17h", "30/01": "17h-05h", "31/01": "17h-05h", "06/02": "05h-17h", "07/02": "05h-17h", "13/02": "17h-05h", "14/02": "17h-05h", "20/02": "05h-17h", "21/02": "05h-17h", "27/02": "17h-05h", "28/02": "17h-05h", "06/03": "05h-17h", "07/03": "05h-17h", "13/03": "17h-05h", "14/03": "17h-05h", "20/03": "05h-17h", "21/03": "05h-17h", "27/03": "17h-05h", "28/03": "17h-05h", "03/04": "05h-17h", "04/04": "05h-17h", "05/04": "05h-17h", "10/04": "17h-05h", "11/04": "17h-05h", "17/04": "05h-17h", "18/04": "05h-17h", "24/04": "17h-05h", "25/04": "17h-05h", "01/05": "05h-17h", "02/05": "05h-17h", "08/05": "17h-05h", "09/05": "17h-05h", "13/05": "05h-17h", "14/05": "05h-17h", "15/05": "05h-17h", "16/05": "05h-17h", "22/05": "17h-05h", "23/05": "17h-05h", "24/05": "17h-05h", "29/05": "05h-17h", "30/05": "05h-17h", "05/06": "17h-05h", "06/06": "17h-05h", "12/06": "05h-17h", "13/06": "05h-17h", "19/06": "17h-05h", "20/06": "17h-05h", "26/06": "05h-17h", "27/06": "05h-17h", "03/07": "17h-05h", "04/07": "17h-05h", "10/07": "05h-17h", "11/07": "05h-17h", "17/07": "17h-05h", "18/07": "17h-05h", "21/07": "05h-17h", "24/07": "17h-05h", "25/07": "17h-05h", "31/07": "05h-17h", "01/08": "05h-17h", "07/08": "17h-05h", "08/08": "17h-05h", "14/08": "05h-17h", "15/08": "05h-17h", "21/08": "17h-05h", "22/08": "17h-05h", "28/08": "05h-17h", "29/08": "05h-17h", "04/09": "17h-05h", "05/09": "17h-05h", "11/09": "05h-17h", "12/09": "05h-17h", "18/09": "17h-05h", "19/09": "17h-05h", "25/09": "05h-17h", "26/09": "05h-17h", "02/10": "17h-05h", "03/10": "17h-05h", "09/10": "05h-17h", "10/10": "05h-17h", "16/10": "17h-05h", "17/10": "17h-05h", "23/10": "05h-17h", "24/10": "05h-17h", "30/10": "17h-05h", "31/10": "17h-05h", "01/11": "17h-05h", "06/11": "05h-17h", "07/11": "05h-17h", "11/11": "17h-05h", "12/11": "17h-05h", "13/11": "17h-05h", "14/11": "17h-05h", "20/11": "05h-17h", "21/11": "05h-17h", "27/11": "17h-05h", "28/11": "17h-05h", "04/12": "05h-17h", "05/12": "05h-17h", "11/12": "17h-05h", "12/12": "17h-05h", "18/12": "05h-17h", "19/12": "05h-17h", "25/12": "17h-05h", "26/12": "17h-05h"};
var OPTS={TL:['TL','ziek','verlof','recup'],INPAK:['coordinateur','31/32','33/34','35/36','extra','Labo','Karton','Batter','Kruiden','AW1','AW2','ziek','verlof','recup'],Prod:['Prod','Labo','Karton','ziek','verlof','recup'],Unit:['Batter','Cleaning','Inpak','Bulk','Karton','Kruiden','AW1','AW2','ziek','verlof','recup']};
var ABS=[{n:'Nicolas Fettu',a:'04/01/2025',b:'05/01/2025',d:2,y:'2025'},{n:'Nicolas Fettu',a:'26/04/2025',b:'27/04/2025',d:2,y:'2025'},{n:'Nicolas Fettu',a:'22/11/2025',b:'22/11/2025',d:1,y:'2025'},{n:'Mohamed Lalaoui',a:'29/11/2025',b:'30/11/2025',d:2,y:'2025'},{n:'Ramazani Abdulhassan',a:'28/06/2025',b:'29/06/2025',d:2,y:'2025'},{n:'Halima Laadi',a:'07/06/2025',b:'08/06/2025',d:2,y:'2025'},{n:'Halima Laadi',a:'13/09/2025',b:'14/09/2025',d:2,y:'2025'},{n:'Halima Laadi',a:'14/12/2025',b:'14/12/2025',d:1,y:'2025'},{n:'Balan Marius',a:'13/12/2025',b:'14/12/2025',d:2,y:'2025'},{n:'Lyse Musik',a:'14/12/2025',b:'14/12/2025',d:1,y:'2025'},{n:'Max Secember',a:'26/04/2025',b:'27/04/2025',d:2,y:'2025'},{n:'Monir Salmi',a:'08/02/2025',b:'09/02/2025',d:2,y:'2025'},{n:'Anthony Raimondi',a:'15/11/2025',b:'23/11/2025',d:4,y:'2025'},{n:'Nicolas Fettu',a:'07/02/2026',b:'08/02/2026',d:2,y:'2026'},{n:'Julien Demuyter',a:'11/01/2026',b:'11/01/2026',d:1,y:'2026'},{n:'Julien Demuyter',a:'22/03/2026',b:'22/03/2026',d:1,y:'2026'},{n:'Julien Demuyter',a:'25/04/2026',b:'26/04/2026',d:2,y:'2026'},{n:'Mohamed Lalaoui',a:'14/03/2026',b:'22/03/2026',d:4,y:'2026'},{n:'Mohamed Lalaoui',a:'11/04/2026',b:'19/04/2026',d:4,y:'2026'},{n:'Ramazani Abdulhassan',a:'14/02/2026',b:'15/02/2026',d:2,y:'2026'},{n:'Halima Laadi',a:'11/04/2026',b:'12/04/2026',d:2,y:'2026'},{n:'Hakkim Akkouh',a:'27/06/2026',b:'28/06/2026',d:2,y:'2026'},{n:'Anthony Raimondi',a:'17/01/2026',b:'18/01/2026',d:2,y:'2026'},{n:'Anthony Raimondi',a:'28/02/2026',b:'01/03/2026',d:2,y:'2026'},{n:'Anthony Raimondi',a:'28/03/2026',b:'29/03/2026',d:2,y:'2026'},{n:'Lachen Baraik',a:'31/01/2026',b:'15/02/2026',d:6,y:'2026'}];
var BD=[{n:'Aurelien Turchi',D:0,S:0,sc:0,T:[0,0,0,0]},{n:'Nicolas Fettu',D:3,S:2,sc:12,T:[0,0,1,0]},{n:'Julien Demuyter',D:4,S:3,sc:36,T:[0,0,0,0]},{n:'Mohamed Lalaoui',D:10,S:3,sc:90,T:[0,0,2,0]},{n:'Ramazani Abdulhassan',D:4,S:2,sc:16,T:[0,0,0,2]},{n:'Halima Laadi',D:5,S:3,sc:45,T:[0,0,0,0]},{n:'Hakkim Akkouh',D:2,S:1,sc:2,T:[0,0,0,0]},{n:'Balan Marius',D:2,S:1,sc:2,T:[0,0,0,0]},{n:'Lyse Musik',D:1,S:1,sc:1,T:[0,0,0,0]},{n:'Max Secember',D:0,S:0,sc:0,T:[0,0,0,0]},{n:'Larissa Fratutescu',D:0,S:0,sc:0,T:[0,0,0,0]},{n:'Monir Salmi',D:0,S:0,sc:0,T:[0,0,0,0]},{n:'Anthony Raimondi',D:10,S:4,sc:160,T:[0,0,0,0]},{n:'Brahim Akdim',D:0,S:0,sc:0,T:[0,0,0,0]},{n:'Lachen Baraik',D:6,S:1,sc:6,T:[0,0,0,0]}];
function scColor(s){return s<=50?'#10b981':s<=200?'#f59e0b':s<=500?'#f97316':'#ef4444';}
function scSt(s){return s<=50?{l:t('status_ok'),c:'ok'}:s<=200?{l:t('status_wn'),c:'wn'}:s<=500?{l:t('status_al'),c:'al'}:{l:t('status_cr'),c:'cr'};}
function sCls(v){var m={'TL':'tl','coordinateur':'coord','31/32':'31','33/34':'33','35/36':'35','extra':'ex','Prod':'pr','Labo':'lb','Batter':'bt','Cleaning':'cl','Inpak':'ip','Bulk':'bk','ziek':'zk','verlof':'vl','recup':'rc','AW1':'aw1','AW2':'aw2','Karton':'kt','Kruiden':'kr'};return 's-'+(m[v]||'em');}
function sLbl(v){var m={'coordinateur':'COORD','TL':'TL'};return m[v]||v||'-';}
function todayStr(){var n=new Date();return String(n.getDate()).padStart(2,'0')+'/'+String(n.getMonth()+1).padStart(2,'0');}
function allDates(){return(curYear==='2027'?WEEKS27:curYear==='2026'?WEEKS26:WEEKS25).reduce(function(a,w){return a.concat(w.d);},[]);}
function toast(msg,col){var t=document.createElement('div');t.className='toast';t.innerHTML='<div class="tdot" style="background:'+col+'"></div>'+msg;document.body.appendChild(t);setTimeout(function(){t.style.opacity='0';t.style.transition='opacity .3s';setTimeout(function(){t.remove();},300);},2500);}
document.querySelectorAll('.tab').forEach(function(b){b.addEventListener('click',function(){document.querySelectorAll('.tab').forEach(function(x){x.classList.remove('on');});document.querySelectorAll('.pane').forEach(function(x){x.classList.remove('on');});b.classList.add('on');document.getElementById('pane-'+b.dataset.tab).classList.add('on');
  if(b.dataset.tab === 'cmp2' && typeof buildComparaisonTab === 'function') buildComparaisonTab();
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

function initFirebase(app){db=firebase.database(app);db.ref('planning/shifts2026').on('value',function(snap){if(isSyncing)return;var data=snap.val();if(!data)return;var changed=false;SHIFTS26.forEach(function(emp){if(data[emp.n]&&data[emp.n].length){emp.s=data[emp.n];changed=true;}});if(changed){buildPT();recalc();buildBT();updKPI();refreshCharts();}updSlbl(new Date().toISOString());});
  db.ref('planning/shifts2027').on('value',function(snap){if(isSyncing)return;var data=snap.val();if(!data)return;SHIFTS27.forEach(function(emp){if(data[emp.n]&&data[emp.n].length)emp.s=data[emp.n];});if(curYear==='2027')buildPT();});db.ref('planning/shifts2025').on('value',function(snap){if(isSyncing)return;var data=snap.val();if(!data)return;SHIFTS25.forEach(function(emp){if(data[emp.n]&&data[emp.n].length)emp.s=data[emp.n];});});if(currentUser&&(currentUser.role==='admin'||currentUser.role==='visiteur')){db.ref('planning/absences').on('value',function(snap){if(isSyncing)return;var data=snap.val();if(!data)return;var arr=Array.isArray(data)?data:Object.values(data);ABS.splice(0,ABS.length);arr.forEach(function(a){if(a)ABS.push(a);});buildAbs(document.querySelector('.fb.on')?document.querySelector('.fb.on').dataset.f:'all');updAbsLbl();recalc();buildBT();updKPI();refreshCharts();});}db.ref('planning/extraHistorique').on('value',function(snap){var data=snap.val();if(Array.isArray(data)){EXTRA_HIST=data.filter(Boolean);}});
  db.ref('.info/connected').on('value',function(snap){var el=document.getElementById('conn-status');if(!el)return;if(snap.val()){el.textContent='En ligne';el.style.color='var(--green)';}else{el.textContent='Hors ligne';el.style.color='var(--amber)';}});
  db.ref('bradford/comments').on('value',function(snap){var data=snap.val();if(!data)return;BD_COMMENTS={};Object.keys(data).forEach(function(k){BD_COMMENTS[k]=data[k];});buildBT();});
  db.ref('bradford/import_ts').on('value',function(snap){var v=snap.val();var el=document.getElementById('protime-last-import');if(el&&v)el.textContent='Dernier import : '+new Date(v).toLocaleString('fr-BE');});}
function save(){if(!db)return;isSyncing=true;var d26={};SHIFTS26.forEach(function(e){d26[e.n]=e.s;});var d25={};SHIFTS25.forEach(function(e){d25[e.n]=e.s;});var upd={};upd['planning/shifts2026']=d26;upd['planning/shifts2025']=d25;upd['planning/absences']=ABS;upd['planning/extraHistorique']=EXTRA_HIST;upd['planning/lastUpdate']={at:new Date().toISOString(),by:currentUser?currentUser.email:'anonyme'};db.ref().update(upd).then(function(){isSyncing=false;updSlbl(new Date().toISOString());}).catch(function(err){isSyncing=false;toast('Erreur: '+err.message,'#ef4444');});}
function updSlbl(iso){var el=document.getElementById('slbl');if(!el)return;var d=new Date(iso),now=new Date(),dm=Math.round((now-d)/60000);el.textContent=dm<1?'Synchronise':'Sync il y a '+dm+' min';el.style.color='var(--green)';}
function recalc(){
  var now=new Date(),cut=new Date(now);cut.setFullYear(cut.getFullYear()-1);
  function pFR(s){var p=s.split('/');return new Date(Number(p[2]),Number(p[1])-1,Number(p[0]));}
  function addDays(d,n){var r=new Date(d);r.setDate(r.getDate()+n);return r;}

  // 1) Regrouper, par personne, uniquement les absences maladie (t==='ziek')
  //    qui tombent dans la fenetre glissante des 365 derniers jours.
  var byPerson={};
  EMP.forEach(function(e){byPerson[e.n]=[];});
  ABS.forEach(function(a){
    if(a.t!=='ziek') return; // seules les maladies comptent pour Bradford (legacy sans t = ignore, pas de supposition)
    var deb=pFR(a.a),fin=pFR(a.b);
    if(fin<cut||deb>now) return; // hors fenetre 365 jours
    if(!byPerson[a.n]) return;
    byPerson[a.n].push({deb:deb,fin:fin,d:a.d});
  });

  // 2) Pour chaque personne, fusionner les intervalles maladie qui se
  //    touchent ou ne sont separes que par un week-end (samedi+dimanche),
  //    afin qu'un vendredi malade + lundi malade ne forment qu'un seul episode.
  function mergeEpisodes(intervals){
    if(!intervals.length) return {S:0,D:0};
    intervals.sort(function(a,b){return a.deb-b.deb;});
    var episodes=[];
    var cur={deb:intervals[0].deb, fin:intervals[0].fin, days:intervals[0].d};
    for(var i=1;i<intervals.length;i++){
      var iv=intervals[i];
      var gapStart=addDays(cur.fin,1);
      var bridgesWeekend=true;
      var d=new Date(gapStart);
      while(d<=addDays(iv.deb,-1)){
        var dow=d.getDay(); // 0=dimanche, 6=samedi
        if(dow!==0&&dow!==6){bridgesWeekend=false;break;}
        d=addDays(d,1);
      }
      if(iv.deb<=addDays(cur.fin,1) || bridgesWeekend){
        // chevauchement, contigu, ou separe uniquement par un week-end : meme episode
        if(iv.fin>cur.fin) cur.fin=iv.fin;
        cur.days+=iv.d;
      } else {
        episodes.push(cur);
        cur={deb:iv.deb, fin:iv.fin, days:iv.d};
      }
    }
    episodes.push(cur);
    var totalD=0;
    episodes.forEach(function(ep){totalD+=ep.days;});
    return {S:episodes.length, D:totalD};
  }

  var results={};
  Object.keys(byPerson).forEach(function(name){
    results[name]=mergeEpisodes(byPerson[name]);
  });

  // 3) Appliquer le resultat : Bradford = S^2 * D
  BD.forEach(function(e){
    var r=results[e.n]||{S:0,D:0};
    e.S=r.S; e.D=r.D; e.sc=e.S*e.S*e.D;
  });
}
function updKPI(){
  var ok=BD.filter(function(e){return e.sc<=50;}).length;
  var wn=BD.filter(function(e){return e.sc>50&&e.sc<=500;});
  var cr=BD.filter(function(e){return e.sc>500;});
  document.getElementById('k-ok').textContent=ok;
  document.getElementById('k-okp').textContent=Math.round(ok/BD.length*100)+'% OK';
  document.getElementById('k-wn').textContent=wn.length;
  document.getElementById('k-cr').textContent=cr.length;
  document.getElementById('k-crm').textContent=cr.length>0?t('ov_crm_urgent'):t('ov_crm_none');
  function chip(e,color){var fn=e.n.split(' ')[0];return '<span onclick="goToBradford(\''+e.n.replace(/'/g,"\\'")+'\')" style="cursor:pointer;font-size:12px;padding:3px 9px;border-radius:99px;background:'+color+'22;color:'+color+';border:1px solid '+color+'55;white-space:nowrap">'+fn+'</span>';}
  document.getElementById('k-wn-names').innerHTML=wn.map(function(e){return chip(e,'#f59e0b');}).join('');
  document.getElementById('k-cr-names').innerHTML=cr.map(function(e){return chip(e,'#ef4444');}).join('');
  // Détection franchissement de seuil
  var alertEl=document.getElementById('k-alerts');
  if(!alertEl) return;
  var alerts=[];
  BD.forEach(function(e){
    var prev=BD_PREV_STATUS[e.n];
    var curr=scSt(e.sc).l;
    if(prev&&prev!==curr&&e.sc>50){
      alerts.push('<b>'+e.n.split(' ')[0]+'</b>'+t('ov_alert_from')+'<i>'+prev+'</i>'+t('ov_alert_to')+'<i>'+curr+'</i>');
    }
    BD_PREV_STATUS[e.n]=curr;
  });
  alertEl.innerHTML=alerts.length?'<div style="background:#f59e0b22;border:1px solid #f59e0b55;border-radius:8px;padding:10px 14px;font-size:13px;color:#f59e0b;margin-bottom:12px">⚠ '+alerts.join(' &nbsp;·&nbsp; ')+'</div>':'';
  applyOverviewAccess();
}
var chB,chT,chJ;
function initCharts(){var s=[].concat(BD).sort(function(a,b){return b.sc-a.sc;});chB=new Chart(document.getElementById('cBrad'),{type:'bar',data:{labels:s.map(function(e){return e.n.split(' ')[0];}),datasets:[{data:s.map(function(e){return e.sc;}),backgroundColor:s.map(function(e){return scColor(e.sc)+'bb';}),borderColor:s.map(function(e){return scColor(e.sc);}),borderWidth:1,borderRadius:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#555c72',font:{size:11}}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#555c72',font:{size:11}},beginAtZero:true}}}});var tr={'Q1 2025':0,'Q2 2025':0,'Q3 2025':0,'Q4 2025':0,'Q1 2026':0,'Q2 2026':0};ABS.forEach(function(a){var p=a.a.split('/');var k='Q'+Math.ceil(Number(p[1])/3)+' '+p[2];if(tr[k]!==undefined)tr[k]+=a.d;});chT=new Chart(document.getElementById('cTrim'),{type:'line',data:{labels:Object.keys(tr),datasets:[{data:Object.values(tr),borderColor:'#3b82f6',backgroundColor:'rgba(59,130,246,.08)',borderWidth:2,pointBackgroundColor:'#3b82f6',pointRadius:5,fill:true,tension:.3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#555c72',font:{size:11}}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#555c72',font:{size:11}},beginAtZero:true}}}});var jj=[].concat(BD).filter(function(e){return e.D>0;}).sort(function(a,b){return b.D-a.D;});chJ=new Chart(document.getElementById('cJour'),{type:'bar',data:{labels:jj.map(function(e){return e.n.split(' ').pop();}),datasets:[{data:jj.map(function(e){return e.D;}),backgroundColor:jj.map(function(e){return scColor(e.sc)+'99';}),borderColor:jj.map(function(e){return scColor(e.sc);}),borderWidth:1,borderRadius:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#555c72',font:{size:11}}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#555c72',font:{size:11}},beginAtZero:true}}}});}
function refreshCharts(){if(!chB||!chT||!chJ)return;var s=[].concat(BD).sort(function(a,b){return b.sc-a.sc;});chB.data.labels=s.map(function(e){return e.n.split(' ')[0];});chB.data.datasets[0].data=s.map(function(e){return e.sc;});chB.data.datasets[0].backgroundColor=s.map(function(e){return scColor(e.sc)+'bb';});chB.data.datasets[0].borderColor=s.map(function(e){return scColor(e.sc);});chB.update();var jj=[].concat(BD).filter(function(e){return e.D>0;}).sort(function(a,b){return b.D-a.D;});chJ.data.labels=jj.map(function(e){return e.n.split(' ').pop();});chJ.data.datasets[0].data=jj.map(function(e){return e.D;});chJ.data.datasets[0].backgroundColor=jj.map(function(e){return scColor(e.sc)+'99';});chJ.data.datasets[0].borderColor=jj.map(function(e){return scColor(e.sc);});chJ.update();}
function buildBT(){
  if(currentUser && currentUser.role !== 'admin') return;
  var tbl=document.getElementById('btable');
  var mx=Math.max.apply(null,BD.map(function(e){return e.sc;}));if(mx<1)mx=1;
  var h='<thead><tr><th>'+t('ab_col_emp')+'</th><th>'+t('br_col_role')+'</th><th>'+t('ab_col_days')+'</th><th>'+t('br_col_periods')+'</th><th>Score</th><th>'+t('br_col_status')+'</th><th style="width:36px"></th></tr></thead><tbody>';
  ['TL','INPAK','Prod','Unit'].forEach(function(g){
    var em=BD.filter(function(e){var f=EMP.find(function(x){return x.n===e.n;});return f&&f.g===g;});
    if(!em.length)return;
    h+='<tr class="sr"><td colspan="7">'+g+'</td></tr>';
    em.forEach(function(e){
      var emp=EMP.find(function(x){return x.n===e.n;});
      var st=scSt(e.sc),col=scColor(e.sc),pct=Math.round(e.sc/mx*100);
      var cm=BD_COMMENTS[e.n];
      var cmIcon=cm&&cm.text?'<span style="color:#f59e0b;font-size:15px" title="'+cm.text.replace(/"/g,"&quot;")+'">&#9997;</span>':'<span style="color:var(--tx3);font-size:15px">&#9998;</span>';
      h+='<tr id="bdrow-'+e.n.replace(/\s+/g,'-')+'">';
      h+='<td><b style="font-size:13px;cursor:pointer;text-decoration:none" onclick="openBradfordPanel(\''+e.n.replace(/'/g,"\\'")+'\')" title="'+t('br_tooltip_history')+'">'+e.n+' <span style="font-size:10px;color:var(--blue);opacity:.6">&#9432;</span></b></td>';
      h+='<td style="color:var(--tx3);font-size:12px">'+(emp?emp.r:'')+'</td>';
      h+='<td><span style="font-family:var(--mo)">'+e.D+'</span></td>';
      h+='<td><span style="font-family:var(--mo)">'+e.S+'</span></td>';
      h+='<td><div class="sbw"><div class="sbt"><div class="sbf" style="width:'+pct+'%;background:'+col+'"></div></div><span class="sv" style="color:'+col+'">'+e.sc+'</span></div></td>';
      h+='<td><span class="pill '+st.c+'">'+st.l+'</span></td>';
      h+='<td style="text-align:center"><span style="cursor:pointer" onclick="openComment(\''+e.n.replace(/'/g,"\\'")+'\')" title="'+t('br_tooltip_comment')+'">'+cmIcon+'</span></td>';
      h+='</tr>';
    });
  });
  tbl.innerHTML=h+'</tbody>';
}

function openComment(name){
  var cm=BD_COMMENTS[name]||{text:'',date:'',author:''};
  var prev=cm.text||'';
  var d=document.createElement('div');
  d.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center';
  d.id='cm-popup';d.innerHTML='<div style="background:var(--bg2);border:1px solid var(--bd2);border-radius:12px;padding:24px;width:420px;max-width:95vw">'
    +'<div style="font-weight:700;font-size:15px;margin-bottom:4px">'+t('br_comment_prefix')+name+'</div>'
    +(cm.date?'<div style="font-size:11px;color:var(--tx3);margin-bottom:12px">'+t('br_comment_last_mod')+cm.date+(cm.author?t('br_comment_by')+cm.author:'')+'</div>':'<div style="margin-bottom:12px"></div>')
    +'<textarea id="cm-txt" style="width:100%;height:110px;background:var(--bg3);border:1px solid var(--bd2);border-radius:8px;color:var(--tx1);font-family:var(--fn);font-size:13px;padding:10px;resize:vertical">'+prev+'</textarea>'
    +'<div style="display:flex;gap:10px;margin-top:14px;justify-content:flex-end">'
    +'<button onclick="document.getElementById(\'cm-popup\').remove()" style="padding:8px 16px;border-radius:var(--r);border:1px solid var(--bd2);background:none;color:var(--tx2);font-family:var(--fn);cursor:pointer">'+t('modal_cancel')+'</button>'
    +'<button onclick="saveComment(\''+name.replace(/'/g,"\\'")+'\')" style="padding:8px 16px;border-radius:var(--r);border:none;background:var(--blue);color:#fff;font-family:var(--fn);font-weight:600;cursor:pointer">'+t('btn_save')+'</button>'
    +'</div></div>';
  document.body.appendChild(d);
  d.addEventListener('click',function(e){if(e.target===d)d.remove();});
  document.getElementById('cm-txt').focus();
}

function saveComment(name){
  var txt=document.getElementById('cm-txt').value.trim();
  var now=new Date().toLocaleString('fr-BE');
  var author=currentUser?currentUser.name||currentUser.email||'':'';
  BD_COMMENTS[name]={text:txt,date:now,author:author};
  if(db) db.ref('bradford/comments/'+name.replace(/[.#$/\[\]]/g,'_')).set(BD_COMMENTS[name]);
  var cmPop=document.getElementById('cm-popup');if(cmPop)cmPop.remove();
  buildBT();
  toast(txt?t('br_comment_saved'):t('br_comment_deleted'),'#10b981');
}

function openBradfordPanel(name){
  var e=BD.find(function(x){return x.n===name;});
  if(!e) return;
  var col=scColor(e.sc);
  var st=scSt(e.sc);
  // Récupérer les épisodes de cette personne triés par date
  var eps=ABS.filter(function(a){return a.n===name&&a.t==='ziek';});
  eps.sort(function(a,b){
    function pFR(s){var p=s.split('/');return new Date(Number(p[2]),Number(p[1])-1,Number(p[0]));}
    return pFR(b.a)-pFR(a.a);
  });
  var cm=BD_COMMENTS[name];
  var d=document.createElement('div');
  d.style.cssText='position:fixed;top:0;right:0;bottom:0;width:380px;max-width:95vw;background:var(--bg2);border-left:1px solid var(--bd2);z-index:9998;display:flex;flex-direction:column;box-shadow:-8px 0 32px rgba(0,0,0,.4)';
  var epsHtml=eps.length?eps.map(function(a){
    var same=a.a===a.b;
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--bd2)">'
      +'<div><div style="font-size:13px;font-weight:600;color:var(--tx1)">'+(same?a.a:a.a+' → '+a.b)+'</div>'
      +'<div style="font-size:11px;color:var(--tx3)">'+a.d+(a.d>1?t('br_days_suffix_n'):t('br_days_suffix_1'))+'</div></div>'
      +'<span style="font-size:11px;padding:2px 8px;border-radius:99px;background:#ef444422;color:#ef4444;border:1px solid #ef444455">'+t('br_episode_badge')+'</span>'
      +'</div>';
  }).join(''):'<div style="color:var(--tx3);font-size:13px;padding:20px 0;text-align:center">'+t('br_no_episode')+'</div>';

  d.innerHTML='<div style="padding:20px;border-bottom:1px solid var(--bd2);display:flex;justify-content:space-between;align-items:center">'
    +'<div><div style="font-weight:700;font-size:16px">'+name+'</div><span class="pill '+st.c+'" style="margin-top:4px;display:inline-block">'+st.l+'</span></div>'
    +'<button onclick="this.closest(\'div[style*=fixed]\').remove()" style="background:none;border:none;color:var(--tx3);font-size:22px;cursor:pointer;line-height:1">&times;</button>'
    +'</div>'
    +'<div style="padding:16px 20px;display:flex;gap:20px;border-bottom:1px solid var(--bd2)">'
    +'<div style="text-align:center"><div style="font-size:26px;font-weight:700;color:'+col+'">'+e.sc+'</div><div style="font-size:11px;color:var(--tx3)">'+t('br_stat_score')+'</div></div>'
    +'<div style="text-align:center"><div style="font-size:26px;font-weight:700;color:var(--tx1)">'+e.S+'</div><div style="font-size:11px;color:var(--tx3)">'+t('br_stat_episodes')+'</div></div>'
    +'<div style="text-align:center"><div style="font-size:26px;font-weight:700;color:var(--tx1)">'+e.D+'</div><div style="font-size:11px;color:var(--tx3)">'+t('br_stat_days')+'</div></div>'
    +'</div>'
    +'<div style="padding:16px 20px;border-bottom:1px solid var(--bd2)">'
    +'<div style="font-size:12px;font-weight:600;color:var(--tx3);margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em">'+t('br_comment_label')+'</div>'
    +'<div style="font-size:13px;color:var(--tx1);cursor:pointer;padding:8px;border-radius:8px;background:var(--bg3);min-height:36px" onclick="openComment(\''+name.replace(/'/g,"\\'")+'\')">'+( cm&&cm.text?cm.text:'<span style="color:var(--tx3)">'+t('br_comment_placeholder')+'</span>')+'</div>'
    +(cm&&cm.date?'<div style="font-size:10px;color:var(--tx3);margin-top:4px">'+cm.date+(cm.author?' · '+cm.author:'')+'</div>':'')
    +'</div>'
    +'<div style="padding:16px 20px;flex:1;overflow-y:auto">'
    +'<div style="font-size:12px;font-weight:600;color:var(--tx3);margin-bottom:12px;text-transform:uppercase;letter-spacing:.05em">'+t('br_history_title')+'</div>'
    +epsHtml
    +'</div>';
  document.body.appendChild(d);
}

// --- Navigation mois planning ---
function prevMonth(){
  var weeks=curYear==='2027'?WEEKS27:curYear==='2026'?WEEKS26:WEEKS25;
  var all=weeks.reduce(function(a,w){return a.concat(w.d);},[]);
  var months=[...new Set(all.map(function(d){return parseInt(d.split('/')[1],10)-1;}))].sort(function(a,b){return a-b;});
  if(curMonth===null){curMonth=months[months.length-1];}
  else{var idx=months.indexOf(curMonth);curMonth=idx>0?months[idx-1]:null;}
  buildPT();
}
function nextMonth(){
  var weeks=curYear==='2027'?WEEKS27:curYear==='2026'?WEEKS26:WEEKS25;
  var all=weeks.reduce(function(a,w){return a.concat(w.d);},[]);
  var months=[...new Set(all.map(function(d){return parseInt(d.split('/')[1],10)-1;}))].sort(function(a,b){return a-b;});
  if(curMonth===null){curMonth=months[0];}
  else{var idx=months.indexOf(curMonth);curMonth=idx<months.length-1?months[idx+1]:null;}
  buildPT();
}

// --- Export CSV Bradford ---
function exportBradfordCSV(){
  var rows=[['Nom','Role','Jours maladie','Episodes','Score Bradford','Statut']];
  BD.forEach(function(e){
    var emp=EMP.find(function(x){return x.n===e.n;});
    rows.push([e.n,emp?emp.r:'',e.D,e.S,e.sc,scSt(e.sc).l]);
  });
  var csv=rows.map(function(r){return r.map(function(v){return '"'+String(v).replace(/"/g,'""')+'"';}).join(';');}).join('\r\n');
  var blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'});
  var a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='bradford_'+new Date().toISOString().slice(0,10)+'.csv';
  a.click();
}

// --- Mini calendrier 30 prochains jours ---
function buildMiniCal(){
  var el=document.getElementById('mini-cal');if(!el)return;
  var now=new Date();
  var days=[];
  for(var i=0;i<30;i++){var d=new Date(now);d.setDate(d.getDate()+i);days.push(d);}
  function fmtDDMM(d){return String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0');}
  function fmtFull(d){return fmtDDMM(d)+'/'+d.getFullYear();}
  // Trouver les absences ziek dans cette plage
  var abs30=[];
  ABS.filter(function(a){return a.t==='ziek'||a.t==='verlof'||a.t==='recup';}).forEach(function(a){
    function pFR(s){var p=s.split('/');return new Date(Number(p[2]),Number(p[1])-1,Number(p[0]));}
    var deb=pFR(a.a),fin=pFR(a.b);
    days.forEach(function(day){
      var dd=new Date(day);dd.setHours(0,0,0,0);
      var d0=new Date(deb);d0.setHours(0,0,0,0);
      var d1=new Date(fin);d1.setHours(0,0,0,0);
      if(dd>=d0&&dd<=d1){abs30.push({name:a.n,date:fmtDDMM(day),type:a.t,ts:a.ts||0});}
    });
  });
  // Grouper par date, en ne gardant qu'une entree par personne (la plus
  // recemment importee) si plusieurs types d'absence se chevauchent ce jour-la.
  var byDate={};
  abs30.forEach(function(x){
    if(!byDate[x.date])byDate[x.date]={};
    var short=x.name.split(' ')[0];
    var existing=byDate[x.date][short];
    if(!existing||x.ts>=existing.ts){ byDate[x.date][short]={name:short,type:x.type,ts:x.ts}; }
  });
  var daysWithAbs=days.filter(function(d){var e=byDate[fmtDDMM(d)];return e&&Object.keys(e).length;});
  if(!daysWithAbs.length){el.innerHTML='<div style="color:var(--tx3);font-size:13px;padding:12px 0">'+t('ov_next30_none')+'</div>';return;}
  var MOIS=MOIS_ABBR_I18N[LANG]||MOIS_ABBR_I18N.fr;
  var h=daysWithAbs.map(function(d){
    var k=fmtDDMM(d);
    var entries=Object.values(byDate[k]);
    var dow=(DOW_ABBR_I18N[LANG]||DOW_ABBR_I18N.fr)[d.getDay()];
    return '<div style="display:flex;align-items:center;gap:12px;padding:7px 0;border-bottom:1px solid var(--bd2)">'
      +'<div style="min-width:70px;font-size:12px;color:var(--tx3)">'+dow+' '+d.getDate()+' '+MOIS[d.getMonth()]+'</div>'
      +'<div style="display:flex;flex-wrap:wrap;gap:5px">'+entries.map(function(x){
        var col=x.type==='ziek'?'#ef4444':x.type==='verlof'?'#3b82f6':'#10b981';
        return '<span style="font-size:11px;padding:2px 7px;border-radius:99px;background:'+col+'22;color:'+col+';border:1px solid '+col+'44">'+x.name+'</span>';
      }).join('')+'</div>'
      +'</div>';
  }).join('');
  el.innerHTML=h;
}

// --- Détection semaines manquantes après import ---
function detectMissingWeeks(importedData){
  if(!importedData||!importedData.employees||!importedData.employees.length) return;
  var allDates=importedData.employees.reduce(function(acc,emp){
    emp.days.forEach(function(d){if(acc.indexOf(d.date)===-1)acc.push(d.date);});
    return acc;
  },[]).sort();
  if(!allDates.length) return;
  // Trouver les gaps de plus de 9 jours (une semaine manquante = ~7j)
  var gaps=[];
  for(var i=1;i<allDates.length;i++){
    var a=new Date(allDates[i-1]),b=new Date(allDates[i]);
    var diff=(b-a)/(1000*60*60*24);
    if(diff>9) gaps.push({from:allDates[i-1],to:allDates[i],days:Math.round(diff)});
  }
  if(gaps.length){
    var msg='⚠ '+gaps.length+' semaine(s) potentiellement manquante(s) :\n'+gaps.map(function(g){return g.from+' → '+g.to+' ('+g.days+'j)';}).join('\n');
    toast(msg,'#f59e0b');
    console.warn('[Protime] Semaines manquantes détectées :',gaps);
  }
}

function goToBradford(name){
  var brTab = document.querySelector('.tab[data-tab="br"]');
  if(brTab) brTab.click();
  setTimeout(function(){
    var row = document.getElementById('bdrow-'+name.replace(/\s+/g,'-'));
    if(!row) return;
    row.scrollIntoView({behavior:'smooth', block:'center'});
    row.style.transition='background .3s';
    var orig = row.style.background;
    row.style.background='rgba(245,158,11,.25)';
    setTimeout(function(){row.style.background=orig;},1800);
  },100);
}
function buildPT(){
  // Navigation mois
  var MOIS=MOIS_I18N[LANG]||MOIS_I18N.fr;
  var mlbl=document.getElementById('month-label');
  if(mlbl) mlbl.textContent=curMonth!==null?MOIS[curMonth]:t('plan_all');
  document.getElementById('plan-title').textContent='Planning '+curYear+(curMonth!==null?' — '+MOIS[curMonth]:'');
  var tbl=document.getElementById('ptable');var td=todayStr();var allFull=allDates();
  // Les indices dans emp.s[] sont toujours relatifs a allFull (toute l'annee).
  // On construit une liste de {ddmm, realIdx} pour que la vue mois utilise
  // le bon index meme quand on filtre sur un sous-ensemble de colonnes.
  var allWithIdx=allFull.map(function(d,i){return {d:d,i:i};});
  var filtered=curMonth!==null?allWithIdx.filter(function(x){var m=parseInt(x.d.split('/')[1],10)-1;return m===curMonth;}):allWithIdx;
  LAST_FILTERED_DATES=filtered;
  var noteEntries=[];
  var all=filtered.map(function(x){return x.d;});
  var ti=all.indexOf(td);var h='<thead><tr><th class="nc">Employe</th>';filtered.forEach(function(x,col){
  var d=x.d;
  var parts=d.split('/');
  var dt=new Date(Date.UTC(parseInt(curYear),parseInt(parts[1])-1,parseInt(parts[0])));
  var days=DOW_ABBR_I18N[LANG]||DOW_ABBR_I18N.fr;
  var dayLbl=days[dt.getUTCDay()];
  var isT=(col===ti);
  var hMap=curYear==='2027'?H2027:curYear==='2026'?H2026:H2025;
  var hor=hMap[d]||'';
  var horColor=hor==='05h-17h'?'#5eddb7':'#fda96a';
  h+='<th class="'+(isT?'td-on':'')+'" style="min-width:42px">'
    +(isT?'<div class="td-dot"></div>':'')
    +'<div style="font-size:9px;opacity:.8;color:'+(isT?'#7eb3ff':'var(--tx3)')+'">'+dayLbl+'</div>'
    +d
    +(hor?'<div style="font-size:8px;font-weight:600;color:'+horColor+';margin-top:1px">'+hor+'</div>':'')
    +'</th>';
});h+='</tr></thead><tbody>';['TL','INPAK','Prod','Unit','EXTRA'].forEach(function(g){var shiftsArr=(curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25);var emps;if(g==='EXTRA'){emps=shiftsArr.filter(function(e){return e.g==='EXTRA';});}else{emps=shiftsArr.filter(function(e){var f=EMP.find(function(x){return x.n===e.n;});return f&&f.g===g;});}if(!emps.length)return;h+='<tr class="sr"><td colspan="'+(all.length+1)+'">'+(g==='EXTRA'?t('plan_section_extra'):g)+'</td></tr>';emps.forEach(function(emp){var isExtra=emp.g==='EXTRA';h+='<tr><td class="nc"'+(emp.n==='Note'?' style="cursor:pointer" onclick="toggleNotesPanelManual()" title="Cliquer pour voir toutes les notes"':'')+'>'+rowLabel(emp.n)+'</td>';filtered.forEach(function(x,col){var sv=emp.s[x.i]||'';var isBdToday=(function(){
      var bd=EMP.find(function(e){return e.n===emp.n;});
      if(!bd||!bd.birthday) return false;
      var parts=bd.birthday.split('-');
      var bm=parseInt(parts[1],10),bday=parseInt(parts[2],10);
      var parts2=x.d.split('/');
      return parseInt(parts2[0],10)===bday&&parseInt(parts2[1],10)===bm;
    })();
    if(isExtra){
      var isNett=emp.n==='Nettoyeur externe';
      var isNote=emp.n==='Note';
      if(isNett){
        var nCls=sv==='Oui'?'sp-nett-oui':sv==='Non'?'sp-nett-non':'sp-nett-empty';
        var nLbl=sv==='Oui'?'Oui':sv==='Non'?'Non':'+';
        h+='<td class="'+(col===ti?'td-td':'')+'">'
          +'<span class="sp-nett '+nCls+'" data-n="'+emp.n+'" data-i="'+x.i+'" data-s="'+sv+'">'+nLbl+'</span>'
          +'</td>';
      } else if(isNote){
      if(sv)noteEntries.push({d:x.d,i:x.i,txt:sv});
      var noteEsc=escHtml(sv);
      var noteLbl=sv?escHtml(noteBadgeLabel(sv)):'+';
      h+='<td class="'+(col===ti?'td-td':'')+'">'
        +'<span class="sp-note-dot'+(sv?' filled':'')+'" data-n="'+emp.n+'" data-i="'+x.i+'" data-s="'+noteEsc+'" title="'+noteEsc+'">'+noteLbl+'</span>'
        +'</td>';
      } else {
      var list=parseExtraList(sv);
      var esc=(sv||'').replace(/"/g,'&quot;');
      var lbl=extraBadgeLabel(list);
      var ttl=list.length?list.map(function(w){return w.n+(w.p?' ('+w.p+')':'');}).join(', ').replace(/"/g,'&quot;'):'';
      h+='<td class="'+(col===ti?'td-td':'')+'">'
        +'<span class="sp-extra'+(list.length?' filled':' empty')+'" data-n="'+emp.n+'" data-i="'+x.i+'" data-s="'+esc+'" title="'+ttl+'">'+lbl+'</span>'
        +'</td>';
      }
    } else {
    h+='<td class="'+(col===ti?'td-td':'')+'">'
      +'<span class="sp '+(sv?sCls(sv):'s-em')+'" data-n="'+emp.n+'" data-i="'+x.i+'" data-s="'+sv+'">'+(sv?sLbl(sv):'-')+'</span>'
      +(isBdToday?'<span style="font-size:10px;margin-left:2px" title="Anniversaire de '+emp.n.split(' ')[0]+'">⭐</span>':'')
      +'</td>';
    }});h+='</tr>';});});h+='</tbody>';tbl.innerHTML=h;tbl.querySelectorAll('.sp[data-n]').forEach(function(p){p.addEventListener('click',function(e){e.stopPropagation();openPopup(p);});});tbl.querySelectorAll('.sp-extra').forEach(function(p){p.addEventListener('click',function(e){e.stopPropagation();openExtraEdit(p);});});tbl.querySelectorAll('.sp-nett').forEach(function(p){p.addEventListener('click',function(e){e.stopPropagation();toggleNettoyeur(p);});});tbl.querySelectorAll('.sp-note-dot').forEach(function(p){p.addEventListener('click',function(e){e.stopPropagation();openNoteEdit(p);});});window.__allNoteEntries = noteEntries;
(function(){
  var todayD = new Date(); todayD.setHours(0,0,0,0);
  var upcoming = noteEntries.filter(function(en){
    var mdd = (en.d||'').split('/'); var dd=parseInt(mdd[0],10), mm=parseInt(mdd[1],10);
    if(isNaN(dd)||isNaN(mm)) return true;
    var edt = new Date((parseInt(curYear,10)||new Date().getFullYear()), mm-1, dd); edt.setHours(0,0,0,0);
    return edt >= todayD;
  });
  renderNotesPanel(window.__notesPanelForced ? window.__allNoteEntries : upcoming);
})();var ntd=document.getElementById('no-today');if(ti===-1){ntd.style.display='flex';}else{ntd.style.display='none';requestAnimationFrame(function(){var sc=document.querySelector('.pscroll');var ths=document.querySelectorAll('.ptable thead tr th');var targetTh=ths[ti+1];if(targetTh&&sc){var scRect=sc.getBoundingClientRect();var thRect=targetTh.getBoundingClientRect();sc.scrollTo({left:sc.scrollLeft+(thRect.left-scRect.left)-sc.clientWidth/2+thRect.width/2,behavior:'smooth'});}});}}
function rowLabel(n){
  if(n==='Commentaire')return t('plan_row_extra_staff');
  if(n==='Nettoyeur externe')return t('plan_row_ext_cleaner');
  if(n==='Note')return t('plan_row_note');
  return n;
}
function escHtml(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
var NOTE_EDIT_CTX=null; // {nm,i}
var LAST_FILTERED_DATES=null; // {d,i}[] des colonnes actuellement affichees, pour rafraichir le panneau de notes sans reconstruire tout le tableau
function noteBadgeLabel(txt){
  if(!txt)return '+';
  var oneLine=txt.replace(/\s+/g,' ').trim();
  return oneLine.length>9?oneLine.slice(0,9)+'…':oneLine;
}
function currentNoteRow(){
  var shifts=curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25;
  return shifts.find(function(e){return e.n==='Note';});
}
function renderNotesPanel(entries){
  var panel=document.getElementById('notes-panel');
  if(!panel)return;
  if(!entries||!entries.length){panel.style.display='none';panel.innerHTML='';return;}
  panel.style.display='flex';
  panel.innerHTML='<div class="notes-panel-title">'+t('plan_notes_panel_title')+'</div>'
    +entries.map(function(e){
      return '<div class="note-card" data-n="Note" data-i="'+e.i+'">'
        +'<div class="note-card-row">'
        +'<div class="note-card-date">'+e.d+'</div>'
        +'<div class="note-card-txt">'+escHtml(e.txt).replace(/\n/g,'<br>')+'</div>'
        +'<div class="note-translate-row">'
        +'<button type="button" class="note-translate-btn" data-i="'+e.i+'" data-target="nl" title="'+t('note_translate_nl')+'">'+(LANG_FLAG_SVG.nl||'')+'</button>'
        +'<button type="button" class="note-translate-btn" data-i="'+e.i+'" data-target="en" title="'+t('note_translate_en')+'">'+(LANG_FLAG_SVG.en||'')+'</button>'
        +'</div>'
        +'</div>'
        +'<div class="note-translation" id="note-tr-'+e.i+'"></div>'
        +'</div>';
    }).join('');
  panel.querySelectorAll('.note-card').forEach(function(c){
    c.addEventListener('click',function(){openNoteEditFor(c.dataset.n,parseInt(c.dataset.i));});
  });
  panel.querySelectorAll('.note-translate-btn').forEach(function(btn){
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      translateNoteEntry(parseInt(btn.dataset.i),btn.dataset.target,btn);
    });
  });
}
var NOTE_TRANSLATE_CACHE={}; // 'texte|langue-cible' -> texte traduit (evite de re-appeler l'API)
function translateNoteEntry(i,target,btn){
  var row=currentNoteRow();if(!row)return;
  var txt=(row.s[i]||'').trim();if(!txt)return;
  var box=document.getElementById('note-tr-'+i);
  if(!box)return;
  var cacheKey=txt+'|'+target;
  if(NOTE_TRANSLATE_CACHE[cacheKey]){
    showNoteTranslation(box,target,NOTE_TRANSLATE_CACHE[cacheKey]);
    return;
  }
  var prevHTML=btn.innerHTML;
  btn.disabled=true;
  btn.innerHTML='<span style="font-size:10px;color:var(--tx3)">…</span>';
  fetch('https://api.mymemory.translated.net/get?q='+encodeURIComponent(txt)+'&langpair=fr|'+target)
    .then(function(r){return r.json();})
    .then(function(data){
      var out=data&&data.responseData&&data.responseData.translatedText?data.responseData.translatedText:null;
      if(!out)throw new Error('empty translation');
      NOTE_TRANSLATE_CACHE[cacheKey]=out;
      showNoteTranslation(box,target,out);
      btn.innerHTML=prevHTML;btn.disabled=false;
    })
    .catch(function(){
      toast(t('note_translate_error'),'#ef4444');
      btn.innerHTML=prevHTML;btn.disabled=false;
    });
}
function showNoteTranslation(box,target,text){
  box.style.display='flex';
  box.innerHTML='<span class="ntr-flag">'+(LANG_FLAG_SVG[target]||'')+'</span><span>'+escHtml(text)+'</span>';
}
function refreshNotesPanel(){
  if(!LAST_FILTERED_DATES)return;
  var row=currentNoteRow();if(!row)return;
  var entries=[];
  LAST_FILTERED_DATES.forEach(function(x){var txt=row.s[x.i]||'';if(txt)entries.push({d:x.d,i:x.i,txt:txt});});
  renderNotesPanel(entries);
}
function openNoteEdit(span){
  openNoteEditFor(span.dataset.n,parseInt(span.dataset.i));
}
function openNoteEditFor(nm,i){
  if(!canEdit())return;
  NOTE_EDIT_CTX={nm:nm,i:i};
  var shifts=curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25;
  var row=shifts.find(function(e){return e.n===nm;});
  if(!row)return;
  var cur=row.s[i]||'';
  var d=document.createElement('div');
  d.id='note-popup';
  d.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center';
  d.innerHTML='<div style="background:var(--bg2);border:1px solid var(--bd2);border-radius:12px;padding:24px;width:380px;max-width:95vw">'
    +'<div style="font-weight:700;font-size:15px;margin-bottom:2px">'+t('note_modal_title')+'</div>'
    +'<div style="font-size:11px;color:var(--tx3);margin-bottom:14px">'+(allDates()[i]||'')+t('note_modal_hint')+'</div>'
    +'<textarea id="note-txt" placeholder="'+t('note_placeholder')+'" style="width:100%;height:90px;background:var(--bg3);border:1px solid var(--bd2);border-radius:8px;color:var(--tx1);font-family:var(--fn);font-size:13px;padding:10px;resize:vertical">'+escHtml(cur)+'</textarea>'
    +'<div style="display:flex;justify-content:space-between;margin-top:16px">'
    +'<button id="note-del-btn" style="padding:8px 14px;border-radius:var(--r);border:1px solid var(--bd2);background:none;color:#ef4444;font-family:var(--fn);font-size:12px;cursor:pointer">'+t('note_del_btn')+'</button>'
    +'<div style="display:flex;gap:8px">'
    +'<button id="note-close-btn" style="padding:8px 16px;border-radius:var(--r);border:1px solid var(--bd2);background:none;color:var(--tx2);font-family:var(--fn);font-size:13px;cursor:pointer">'+t('note_close_btn')+'</button>'
    +'<button id="note-save-btn" style="padding:8px 16px;border-radius:var(--r);border:none;background:var(--blue);color:#fff;font-family:var(--fn);font-weight:600;font-size:13px;cursor:pointer">'+t('note_save_btn')+'</button>'
    +'</div></div></div>';
  document.body.appendChild(d);
  d.addEventListener('click',function(e){if(e.target===d)d.remove();});
  document.getElementById('note-close-btn').addEventListener('click',function(){d.remove();});
  document.getElementById('note-save-btn').addEventListener('click',function(){noteSave(document.getElementById('note-txt').value);d.remove();});
  document.getElementById('note-del-btn').addEventListener('click',function(){noteSave('');d.remove();});
  document.getElementById('note-txt').focus();
}
function noteSave(txt){
  var ctx=NOTE_EDIT_CTX;if(!ctx)return;
  var shifts=curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25;
  var row=shifts.find(function(e){return e.n===ctx.nm;});
  if(!row)return;
  while(row.s.length<=ctx.i)row.s.push('');
  row.s[ctx.i]=(txt||'').trim();
  updateNoteCell(ctx.nm,ctx.i);
  refreshNotesPanel();
  save();
}
function updateNoteCell(nm,i){
  var shifts=curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25;
  var row=shifts.find(function(e){return e.n===nm;});
  var txt=row.s[i]||'';
  var esc=escHtml(txt);
  var lbl=txt?escHtml(noteBadgeLabel(txt)):'+';
  document.querySelectorAll('.sp-note-dot[data-n="'+nm+'"][data-i="'+i+'"]').forEach(function(p){
    p.dataset.s=esc;
    p.title=esc;
    p.innerHTML=lbl;
    p.className='sp-note-dot'+(txt?' filled':'');
  });
}
function toggleNettoyeur(span){
  if(!canEdit())return;
  var nm=span.dataset.n,i=parseInt(span.dataset.i),cur=span.dataset.s||'';
  var next=cur===''?'Oui':cur==='Oui'?'Non':'';
  var shifts=curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25;
  var row=shifts.find(function(e){return e.n===nm;});
  if(!row)return;
  while(row.s.length<=i)row.s.push('');
  row.s[i]=next;
  document.querySelectorAll('.sp-nett[data-n="'+nm+'"][data-i="'+i+'"]').forEach(function(p){
    p.dataset.s=next;
    p.textContent=next==='Oui'?'Oui':next==='Non'?'Non':'+';
    p.className='sp-nett '+(next==='Oui'?'sp-nett-oui':next==='Non'?'sp-nett-non':'sp-nett-empty');
  });
  save();
}
function parseExtraList(sv){
  if(!sv)return[];
  try{var l=JSON.parse(sv);return Array.isArray(l)?l.filter(function(w){return w&&w.n;}):[];}
  catch(e){
    // Compat retro : anciennes cases en texte libre -> converties en une entree sans poste
    return sv.trim()?[{n:sv.trim(),p:''}]:[];
  }
}
function stringifyExtraList(list){return list.length?JSON.stringify(list):'';}
function extraBadgeLabel(list){
  if(!list.length)return '+';
  var first=list[0].n.split(' ')[0];
  return list.length===1?first:(first+' +'+(list.length-1));
}
function extraSaveHist(nom){
  if(!nom)return;
  if(EXTRA_HIST.indexOf(nom)===-1){EXTRA_HIST.push(nom);EXTRA_HIST.sort();}
}
var EXTRA_EDIT_CTX=null; // {nm, i}
var EXTRA_EDIT_IDX=-1; // index en cours de modification dans la liste, -1 = mode ajout
function openExtraEdit(span){
  if(!canEdit())return;
  var nm=span.dataset.n,i=parseInt(span.dataset.i);
  EXTRA_EDIT_CTX={nm:nm,i:i};
  EXTRA_EDIT_IDX=-1;
  var shifts=curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25;
  var row=shifts.find(function(e){return e.n===nm;});
  if(!row)return;
  var d=document.createElement('div');
  d.id='extra-popup';
  d.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center';
  d.innerHTML='<div style="background:var(--bg2);border:1px solid var(--bd2);border-radius:12px;padding:24px;width:380px;max-width:95vw">'
    +'<div style="font-weight:700;font-size:15px;margin-bottom:2px">'+t('extra_modal_title')+'</div>'
    +'<div style="font-size:11px;color:var(--tx3);margin-bottom:14px">'+(allDates()[i]||'')+'</div>'
    +'<div id="extra-list" style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px"></div>'
    +'<div style="display:flex;gap:6px">'
    +'<input id="extra-nom" list="extra-hist" placeholder="'+t('extra_name_ph')+'" style="flex:1;min-width:0;background:var(--bg3);border:1px solid var(--bd2);border-radius:8px;color:var(--tx1);font-family:var(--fn);font-size:13px;padding:8px 10px">'
    +'<datalist id="extra-hist">'+EXTRA_HIST.map(function(h){return '<option value="'+h.replace(/"/g,'&quot;')+'">';}).join('')+'</datalist>'
    +'<select id="extra-poste" style="background:var(--bg3);border:1px solid var(--bd2);border-radius:8px;color:var(--tx1);font-family:var(--fn);font-size:13px;padding:8px 6px">'
    +OPTS.INPAK.map(function(o){return '<option value="'+o+'">'+sLbl(o)+'</option>';}).join('')
    +'</select>'
    +'</div>'
    +'<div style="display:flex;gap:6px;margin-top:8px">'
    +'<button id="extra-add-btn" style="flex:1;padding:8px;border-radius:var(--r);border:1px dashed var(--bd2);background:none;color:var(--tx2);font-family:var(--fn);font-size:12px;cursor:pointer">'+t('extra_add_btn')+'</button>'
    +'<button id="extra-cancel-btn" style="display:none;padding:8px 12px;border-radius:var(--r);border:1px solid var(--bd2);background:none;color:var(--tx3);font-family:var(--fn);font-size:12px;cursor:pointer">'+t('extra_cancel_btn')+'</button>'
    +'</div>'
    +'<div style="display:flex;justify-content:flex-end;margin-top:16px">'
    +'<button id="extra-close-btn" style="padding:8px 16px;border-radius:var(--r);border:none;background:var(--blue);color:#fff;font-family:var(--fn);font-weight:600;cursor:pointer">'+t('extra_close_btn')+'</button>'
    +'</div></div>';
  document.body.appendChild(d);
  d.addEventListener('click',function(e){if(e.target===d)d.remove();});
  document.getElementById('extra-add-btn').addEventListener('click',extraAddWorker);
  document.getElementById('extra-cancel-btn').addEventListener('click',extraCancelEdit);
  document.getElementById('extra-close-btn').addEventListener('click',function(){d.remove();});
  renderExtraList();
  document.getElementById('extra-nom').focus();
}
function renderExtraList(){
  var ctx=EXTRA_EDIT_CTX;if(!ctx)return;
  var shifts=curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25;
  var row=shifts.find(function(e){return e.n===ctx.nm;});
  var list=parseExtraList(row.s[ctx.i]);
  var box=document.getElementById('extra-list');if(!box)return;
  box.innerHTML=list.length?list.map(function(w,idx){
    var isEditing=(idx===EXTRA_EDIT_IDX);
    return '<div style="display:flex;align-items:center;justify-content:space-between;background:var(--bg3);border:1px solid '+(isEditing?'var(--blue)':'var(--bd2)')+';border-radius:8px;padding:6px 10px">'
      +'<span style="font-size:13px;color:var(--tx1)">'+w.n+(w.p?' <span style="color:var(--tx3);font-size:11px">('+sLbl(w.p)+')</span>':'')+'</span>'
      +'<span style="display:flex;gap:10px">'
      +'<span data-idx="'+idx+'" class="extra-edit" title="'+t('extra_edit_title')+'" style="cursor:pointer;color:var(--tx3);font-size:13px;line-height:1;padding:0 2px">&#9998;</span>'
      +'<span data-idx="'+idx+'" class="extra-rm" title="'+t('extra_remove_title')+'" style="cursor:pointer;color:var(--tx3);font-size:16px;line-height:1;padding:0 2px">&times;</span>'
      +'</span>'
      +'</div>';
  }).join(''):'<div style="font-size:12px;color:var(--tx3);font-style:italic;text-align:center;padding:8px 0">'+t('extra_empty_day')+'</div>';
  box.querySelectorAll('.extra-rm').forEach(function(btn){
    btn.addEventListener('click',function(){extraRemoveWorker(parseInt(btn.dataset.idx));});
  });
  box.querySelectorAll('.extra-edit').forEach(function(btn){
    btn.addEventListener('click',function(){extraStartEdit(parseInt(btn.dataset.idx));});
  });
}
function extraStartEdit(idx){
  var ctx=EXTRA_EDIT_CTX;if(!ctx)return;
  var shifts=curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25;
  var row=shifts.find(function(e){return e.n===ctx.nm;});
  var list=parseExtraList(row.s[ctx.i]);
  var w=list[idx];if(!w)return;
  EXTRA_EDIT_IDX=idx;
  var nomEl=document.getElementById('extra-nom'),posteEl=document.getElementById('extra-poste'),btn=document.getElementById('extra-add-btn'),cancelEl=document.getElementById('extra-cancel-btn');
  nomEl.value=w.n;
  if(w.p)posteEl.value=w.p;
  if(btn)btn.textContent=t('extra_save_btn');
  if(cancelEl)cancelEl.style.display='inline-block';
  renderExtraList();
  nomEl.focus();
}
function extraCancelEdit(){
  EXTRA_EDIT_IDX=-1;
  var nomEl=document.getElementById('extra-nom'),btn=document.getElementById('extra-add-btn'),cancelEl=document.getElementById('extra-cancel-btn');
  if(nomEl)nomEl.value='';
  if(btn)btn.textContent=t('extra_add_btn');
  if(cancelEl)cancelEl.style.display='none';
  renderExtraList();
}
function extraAddWorker(){
  var ctx=EXTRA_EDIT_CTX;if(!ctx)return;
  var nomEl=document.getElementById('extra-nom'),posteEl=document.getElementById('extra-poste');
  var nom=nomEl.value.trim();
  if(!nom){nomEl.focus();return;}
  var shifts=curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25;
  var row=shifts.find(function(e){return e.n===ctx.nm;});
  while(row.s.length<=ctx.i)row.s.push('');
  var list=parseExtraList(row.s[ctx.i]);
  if(EXTRA_EDIT_IDX>=0&&EXTRA_EDIT_IDX<list.length){
    list[EXTRA_EDIT_IDX]={n:nom,p:posteEl.value};
  } else {
    list.push({n:nom,p:posteEl.value});
  }
  row.s[ctx.i]=stringifyExtraList(list);
  extraSaveHist(nom);
  updateExtraBadge(ctx.nm,ctx.i);
  extraCancelEdit();
  nomEl.focus();
  save();
}
function extraRemoveWorker(idx){
  var ctx=EXTRA_EDIT_CTX;if(!ctx)return;
  var shifts=curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25;
  var row=shifts.find(function(e){return e.n===ctx.nm;});
  var list=parseExtraList(row.s[ctx.i]);
  list.splice(idx,1);
  row.s[ctx.i]=stringifyExtraList(list);
  updateExtraBadge(ctx.nm,ctx.i);
  if(EXTRA_EDIT_IDX===idx){extraCancelEdit();}else{renderExtraList();}
  save();
}
function updateExtraBadge(nm,i){
  var shifts=curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25;
  var row=shifts.find(function(e){return e.n===nm;});
  var sv=row.s[i]||'';
  var list=parseExtraList(sv);
  var esc=sv.replace(/"/g,'&quot;');
  var lbl=extraBadgeLabel(list);
  var ttl=list.length?list.map(function(w){return w.n+(w.p?' ('+w.p+')':'');}).join(', ').replace(/"/g,'&quot;'):'';
  document.querySelectorAll('.sp-extra[data-n="'+nm+'"][data-i="'+i+'"]').forEach(function(p){
    p.dataset.s=esc;p.title=ttl;
    p.innerHTML=lbl;
    p.className='sp-extra'+(list.length?' filled':' empty');
  });
}
function openPopup(pill){activePill=pill;popup=document.getElementById('popup');if(popup&&popup.parentNode!==document.body)document.body.appendChild(popup);var nm=pill.dataset.n;var emp=EMP.find(function(e){return e.n===nm;});var opts=OPTS[emp?emp.g:'INPAK']||[];var cur=pill.dataset.s;var h='<div class="ptit">'+nm.split(' ')[0]+'</div>';opts.forEach(function(o){h+='<div class="popt" data-v="'+o+'"><span class="sp '+sCls(o)+'" style="'+(o===cur?'outline:1.5px solid #3b82f6':'')+'">'+sLbl(o)+'</span><span style="font-size:11px;color:var(--tx2)">'+(o==='ziek'?'Maladie':o==='verlof'?'Conge':o==='recup'?'Recuperation':o==='TL'?'Present':o==='AW1'?'Vers AW1':o==='AW2'?'Vers AW2':o)+'</span></div>';});h+='<div class="pcancel">Annuler</div>';popup.innerHTML=h;
var r=pill.getBoundingClientRect();
// IMPORTANT : #popup est en position:fixed (repere = fenetre visible),
// donc ses coordonnees ne doivent JAMAIS inclure window.scrollX/scrollY.
// Les ajouter (comme avant) decalait le menu de tout le defilement de la
// page, le poussant hors ecran des qu'on scrollait dans le tableau.
var left=r.left;
if(left+180>window.innerWidth-8) left=window.innerWidth-188;
if(left<8) left=8;
popup.style.left=left+'px';
popup.style.visibility='hidden';
popup.style.display='block';
var popupHeight=popup.offsetHeight; // deja plafonne par max-height en CSS
popup.style.visibility='visible';
var marge=8;
var spaceBelow=window.innerHeight-r.bottom-marge;
var spaceAbove=r.top-marge;
var top;
if(spaceBelow>=popupHeight){
  top=r.bottom+4;
}else if(spaceAbove>=popupHeight){
  top=r.top-popupHeight-4;
}else if(spaceBelow>=spaceAbove){
  // Ni en dessous ni au-dessus il n'y a la place pour tout afficher :
  // on colle en bas de l'ecran visible, le popup reste scrollable (voir CSS .popup).
  top=window.innerHeight-popupHeight-marge;
  if(top<r.bottom+4) top=r.bottom+4;
}else{
  top=marge;
}
popup.style.top=top+'px';
popup.querySelectorAll('.popt').forEach(function(o){o.addEventListener('click',function(){applyShift(o.dataset.v);});});popup.querySelector('.pcancel').addEventListener('click',closePopup);}
function closePopup(){if(popup)popup.style.display='none';activePill=null;}
document.addEventListener('click',function(e){if(popup&&!popup.contains(e.target))closePopup();});
function canEdit(){if(!currentUser){toast('Non connecte','#ef4444');return false;}if(currentUser.role==='admin'||currentUser.role==='subchef'||currentUser.editPlanning){return true;}toast('Acces non autorise','#ef4444');return false;}
function applyShift(nv){
  if(!activePill)return;
  if(!canEdit())return;
  var nm=activePill.dataset.n,i=parseInt(activePill.dataset.i),old=activePill.dataset.s;
  closePopup();
  var shifts=curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25;
  var emp=shifts.find(function(e){return e.n===nm;});
  if(!emp)return;
  while(emp.s.length<=i)emp.s.push('');
  emp.s[i]=nv;
  document.querySelectorAll('.sp[data-n="'+nm+'"][data-i="'+i+'"]').forEach(function(p){
    p.className='sp '+(nv?sCls(nv):'s-em');p.textContent=nv?sLbl(nv):'-';p.dataset.s=nv;
  });
  var all=allDates(),dateStr=all[i];

  // --- AUTOMATISME Lyse -> Larissa ---
  if(nm==='Lyse Musik'){
    var larissa=shifts.find(function(e){return e.n==='Larissa Fratutescu';});
    if(larissa){
      while(larissa.s.length<=i)larissa.s.push('');
      var wasAbs=(old==='ziek'||old==='verlof');
      var isAbs=(nv==='ziek'||nv==='verlof');
      var newLarissa=null;
      if(!wasAbs&&isAbs){ newLarissa='Labo'; toast('Larissa automatiquement en Labo','#06b6d4'); }
      else if(wasAbs&&!isAbs){ newLarissa='Prod'; toast('Larissa automatiquement en Prod','#10b981'); }
      if(newLarissa){
        larissa.s[i]=newLarissa;
        document.querySelectorAll('.sp[data-n="Larissa Fratutescu"][data-i="'+i+'"]').forEach(function(p){
          p.className='sp '+sCls(newLarissa);p.textContent=sLbl(newLarissa);p.dataset.s=newLarissa;
        });
      }
    }
  }

  if(nv==='ziek'&&old!=='ziek'){
    var fd=dateStr+'/'+curYear;
    if(!ABS.find(function(a){return a.n===nm&&a.a===fd&&a.d===1;})){
      ABS.push({n:nm,a:fd,b:fd,d:1,y:curYear,t:'ziek',ts:Date.now()});
      buildAbs(document.querySelector('.fb.on').dataset.f);updAbsLbl();
    }
    recalc();buildBT();updKPI();refreshCharts();save();
    var bd=BD.find(function(e){return e.n===nm;});
    toast(nm.split(' ')[0]+' malade - Bradford: '+(bd?bd.sc:0),scColor(bd?bd.sc:0));
  } else if(old==='ziek'&&nv!=='ziek'){
    var fd2=dateStr+'/'+curYear;
    for(var k=ABS.length-1;k>=0;k--){if(ABS[k].n===nm&&ABS[k].a===fd2&&ABS[k].d===1){ABS.splice(k,1);break;}}
    buildAbs(document.querySelector('.fb.on').dataset.f);updAbsLbl();
    recalc();buildBT();updKPI();refreshCharts();save();
    toast(nm.split(' ')[0]+' -> '+sLbl(nv),'#10b981');
  } else {
    save();toast(nm.split(' ')[0]+' -> '+sLbl(nv),'#3b82f6');
  }
}
function updAbsLbl(){
  if(currentUser && currentUser.role !== 'admin') return;
  var el=document.getElementById('abs-lbl');
  if(el) el.textContent=ABS.length+t('ab_count_suffix');
}
function buildAbs(f){var grid=document.getElementById('agrid');var ziekOnly=ABS.filter(function(a){return a.t==='ziek';});var mx=Math.max.apply(null,ziekOnly.map(function(a){return a.d;}));if(mx<1)mx=1;var list=[].concat(ziekOnly);if(f&&f!=='all')list=list.filter(function(a){return a.y===f||a.n===f;});list.sort(function(a,b){return b.d-a.d;});
grid.innerHTML=list.map(function(a){var pct=Math.round(a.d/mx*100);return '<div class="arow"><div class="an">'+a.n+'</div><div class="ad">'+a.a+'</div><div class="ad">'+a.b+'</div><div class="aj">'+a.d+'j</div><div class="ab"><div class="abf" style="width:'+pct+'%;background:#ef4444"></div></div><div class="ay">'+a.y+'</div></div>';}).join('')||'<div class="empty">'+t('ab_empty')+'</div>';}
document.querySelectorAll('.fb').forEach(function(b){b.addEventListener('click',function(){document.querySelectorAll('.fb').forEach(function(x){x.classList.remove('on');});b.classList.add('on');buildAbs(b.dataset.f);});});
document.querySelectorAll('.ytab').forEach(function(b){b.addEventListener('click',function(){document.querySelectorAll('.ytab').forEach(function(x){x.classList.remove('on');});b.classList.add('on');curYear=b.dataset.yr;curMonth=null;buildPT();});});
function goToday(){
  var td=todayStr();
  var now=new Date();
  curMonth=now.getMonth(); // se positionner sur le mois actuel
  var all=allDates();
  var ti=all.indexOf(td);
  buildPT(); // rebuild avec le bon mois d'abord
  // Si aujourd'hui est un jour planifie -> scroll direct
  if(ti!==-1){
    setTimeout(function(){
      var sc=document.querySelector('.pscroll');
      var ths=document.querySelectorAll('.ptable thead tr th');
      // Dans la vue mois, chercher la colonne par data-i
      var targetTh=document.querySelector('.ptable thead tr th.td-on');
      if(!targetTh) targetTh=ths[1]; // fallback
      if(targetTh&&sc){
        var scRect=sc.getBoundingClientRect();
        var thRect=targetTh.getBoundingClientRect();
        sc.scrollTo({left:sc.scrollLeft+(thRect.left-scRect.left)-sc.clientWidth/2+thRect.width/2,behavior:'smooth'});
      }
    },50);
    toast('Positionne sur le '+td,'#3b82f6');
    return;
  }
  // Aujourd'hui est un jour de repos -> trouver le prochain shift
  var now=new Date();
  var todayMs=now.getTime();
  var nextDate=null;var nextIdx=-1;var nextYr=curYear;
  // Chercher dans l'annee courante d'abord
  var yr=parseInt(curYear);
  for(var i=0;i<all.length;i++){
    var parts2=all[i].split('/');
    var d2=new Date(Date.UTC(yr,parseInt(parts2[1])-1,parseInt(parts2[0])));
    if(d2.getTime()>todayMs){nextDate=all[i];nextIdx=i;break;}
  }
  // Si pas trouvé dans l'année courante, chercher dans l'année suivante
  if(!nextDate){
    var nextYear=String(yr+1);
    var nextWeeks=nextYear==='2027'?WEEKS27:null;
    if(nextWeeks){
      var nextAll=nextWeeks.reduce(function(a,w){return a.concat(w.d);},[]);
      for(var j=0;j<nextAll.length;j++){
        var parts3=nextAll[j].split('/');
        var d3=new Date(Date.UTC(yr+1,parseInt(parts3[1])-1,parseInt(parts3[0])));
        if(d3.getTime()>todayMs){
          // Switcher vers l'année suivante
          document.querySelectorAll('.ytab').forEach(function(b){b.classList.remove('on');});
          var nextBtn=document.querySelector('.ytab[data-yr="'+nextYear+'"]');
          if(nextBtn){nextBtn.classList.add('on');curYear=nextYear;buildPT();}
          setTimeout(function(){goToday();},150);return;
        }
      }
    }
  }
  if(nextDate){
    var sc2=document.querySelector('.pscroll');
    var ths2=document.querySelectorAll('.ptable thead tr th');
    var targetTh2=ths2[nextIdx+1];
    if(targetTh2&&sc2){
      var scRect2=sc2.getBoundingClientRect();
      var thRect2=targetTh2.getBoundingClientRect();
      sc2.scrollTo({left:sc2.scrollLeft+(thRect2.left-scRect2.left)-sc2.clientWidth/2+thRect2.width/2,behavior:'smooth'});
    }
    toast("Repos aujourd'hui - prochain shift: "+nextDate,'#f59e0b');
  } else {
    toast("Aucun shift planifie",'#f59e0b');
  }
}

function openPrintModal(){var all=allDates();if(!all.length)return;var overlay=document.createElement('div');overlay.id='print-overlay';overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:500;display:flex;align-items:center;justify-content:center';var dateOpts=all.map(function(d,i){return '<option value="'+i+'">'+d+'</option>';}).join('');overlay.innerHTML='<div style="background:#1e2436;border:1px solid rgba(255,255,255,.13);border-radius:14px;padding:28px 32px;min-width:360px;box-shadow:0 24px 60px rgba(0,0,0,.6)"><div style="font-size:16px;font-weight:600;margin-bottom:20px;color:#e8eaf0">Imprimer le planning</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px"><div><label style="font-size:11px;color:#8b90a4;display:block;margin-bottom:6px">Du</label><select id="pFrom" style="width:100%;background:#0f1117;color:#e8eaf0;border:1px solid rgba(255,255,255,.13);border-radius:8px;padding:8px 10px;font-size:12px">'+dateOpts+'</select></div><div><label style="font-size:11px;color:#8b90a4;display:block;margin-bottom:6px">Au</label><select id="pTo" style="width:100%;background:#0f1117;color:#e8eaf0;border:1px solid rgba(255,255,255,.13);border-radius:8px;padding:8px 10px;font-size:12px">'+dateOpts+'</select></div></div><div id="print-preview" style="font-size:11px;color:#555c72;margin-bottom:20px;padding:8px 12px;background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.2);border-radius:8px"></div><div style="display:flex;gap:10px;justify-content:flex-end"><button onclick="closePrintModal()" style="padding:8px 18px;border-radius:8px;border:1px solid rgba(255,255,255,.13);background:none;color:#8b90a4;font-family:Inter,sans-serif;font-size:13px;cursor:pointer">Annuler</button><button onclick="confirmPrint()" style="padding:8px 18px;border-radius:8px;border:none;background:#3b82f6;color:#fff;font-family:Inter,sans-serif;font-size:13px;font-weight:500;cursor:pointer">Imprimer</button></div></div>';document.body.appendChild(overlay);overlay.addEventListener('click',function(e){if(e.target===overlay)closePrintModal();});var td=todayStr(),ti=all.indexOf(td);if(ti!==-1)document.getElementById('pFrom').selectedIndex=ti;document.getElementById('pTo').selectedIndex=all.length-1;function updPrev(){var f=parseInt(document.getElementById('pFrom').value);var t=parseInt(document.getElementById('pTo').value);if(t<f){document.getElementById('pTo').selectedIndex=f;t=f;}document.getElementById('print-preview').textContent=(t-f+1)+' colonnes : '+all[f]+' -> '+all[t];}document.getElementById('pFrom').addEventListener('change',updPrev);document.getElementById('pTo').addEventListener('change',updPrev);updPrev();}
function closePrintModal(){var o=document.getElementById('print-overlay');if(o)o.remove();}
function confirmPrint(){var f=parseInt(document.getElementById('pFrom').value);var t=parseInt(document.getElementById('pTo').value);if(t<f)t=f;closePrintModal();doPrint(f,t);}
function doPrint(fromIdx,toIdx){var all=allDates();if(fromIdx===undefined)fromIdx=0;if(toIdx===undefined)toIdx=all.length-1;var selDates=all.slice(fromIdx,toIdx+1);var SC={'TL':{bg:'#eef2ff',c:'#3730a3',b:'#c7d2fe'},'coordinateur':{bg:'#e8f0fe',c:'#1a56db',b:'#93c5fd'},'31/32':{bg:'#d1fae5',c:'#065f46',b:'#6ee7b7'},'33/34':{bg:'#ccfbf1',c:'#0f766e',b:'#5eead4'},'35/36':{bg:'#ede9fe',c:'#5b21b6',b:'#c4b5fd'},'extra':{bg:'#f3f4f6',c:'#374151',b:'#d1d5db'},'Prod':{bg:'#fff7ed',c:'#9a3412',b:'#fdba74'},'Labo':{bg:'#ecfeff',c:'#0e7490',b:'#67e8f9'},'Batter':{bg:'#fdf2f8',c:'#831843',b:'#f0abfc'},'Cleaning':{bg:'#eff6ff',c:'#1e40af',b:'#93c5fd'},'Inpak':{bg:'#ecfdf5',c:'#065f46',b:'#6ee7b7'},'Bulk':{bg:'#f5f3ff',c:'#4c1d95',b:'#c4b5fd'},'ziek':{bg:'#fff1f2',c:'#9f1239',b:'#fca5a5'},'verlof':{bg:'#fffbeb',c:'#92400e',b:'#fcd34d'},'recup':{bg:'#fffbeb',c:'#92400e',b:'#fcd34d'},'AW1':{bg:'#fef2f2',c:'#991b1b',b:'#fca5a5'},'AW2':{bg:'#faf5ff',c:'#6b21a8',b:'#d8b4fe'},'Karton':{bg:'#fdf3e7',c:'#7c4a20',b:'#e3c19a'}};
  // Calcule pour chaque colonne : est-ce un weekend, et si oui l'horaire (05h-17h ou 17h-05h)
  var infoJour=selDates.map(function(d){
    var parts=d.split('/');var iso=curYear+'-'+parts[1]+'-'+parts[0];
    var dt=new Date(iso+'T00:00:00');var dow=dt.getDay();var weekend=(dow===0||dow===6);
    var horaire='';
    if(weekend){var bloc=(equipeWeekend(iso,'05h-17h')==='P5')?'05h-17h':'17h-05h';horaire=bloc;}
    return {weekend:weekend,horaire:horaire};
  });
  var nb=selDates.length;var fs=nb<=6?18:nb<=8?17:nb<=10?15:nb<=14?13:nb<=18?12:11;var nameFs=15;var tb='';var rowIdx=0;['TL','INPAK','Prod','Unit'].forEach(function(g){var em=(curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25).filter(function(e){var f=EMP.find(function(x){return x.n===e.n;});return f&&f.g===g;});if(!em.length)return;tb+='<tr style="background:#1e293b"><td colspan="'+(selDates.length+1)+'" style="color:#fff;font-size:9px;font-weight:700;text-transform:uppercase;padding:4px 6px">'+g+'</td></tr>';em.forEach(function(emp){var impaire=(rowIdx++ % 2 === 1);var nameBg=impaire?'#eef1f5':'#fafafa';tb+='<tr><td style="text-align:left;padding-left:8px;font-weight:700;font-size:'+nameFs+'px;border-right:2px solid #d1d5db;background:'+nameBg+';width:150px">'+emp.n+'</td>';selDates.forEach(function(d,i){var si=fromIdx+i;var s=emp.s[si]||'';var c=SC[s]||{bg:'#f9fafb',c:'#6b7280',b:'#e5e7eb'};var wkBg=infoJour[i].weekend?(impaire?'#dbeafe':'#eff6ff'):(impaire?'#f4f6f8':'#fff');tb+='<td style="padding:4px 2px;text-align:center;border:.5px solid #e5e7eb;background:'+wkBg+'">'+(s?'<span style="display:inline-block;background:'+c.bg+';color:'+c.c+';border:1.5px solid '+c.b+';padding:5px 10px;border-radius:4px;font-size:'+fs+'px;font-weight:700;white-space:nowrap">'+sLbl(s)+'</span>':'')+'</td>';});tb+='</tr>';});});var w=window.open('','_blank');w.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Planning '+curYear+'</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Inter,Arial,sans-serif;font-size:'+fs+'px;color:#111;background:#fff;padding:6mm}table{width:100%;border-collapse:collapse;table-layout:fixed}th{background:#f3f4f6;font-size:'+fs+'px;font-weight:700;padding:6px 2px;text-align:center;border:.5px solid #e5e7eb}th.wk{background:#bfdbfe}th .h{display:block;font-size:'+(fs-3)+'px;font-weight:600;color:#1e40af;margin-top:2px}.pbtn{position:fixed;top:14px;right:14px;background:#1e293b;color:#fff;border:none;border-radius:6px;padding:7px 16px;font-size:12px;cursor:pointer}@media print{.pbtn{display:none}@page{size:A4 landscape;margin:6mm}}</style></head><body>');w.document.write('<button class="pbtn" onclick="window.print()">Imprimer</button>');w.document.write('<div style="text-align:center;font-size:34px;font-weight:800;letter-spacing:3px;color:#111;margin-bottom:6px">AW3 P5</div>');
w.document.write('<div style="display:flex;justify-content:space-between;border-bottom:1.5px solid #111;padding-bottom:8px;margin-bottom:10px"><div><div style="font-size:16px;font-weight:700">Planning '+curYear+' - AW3 Ploeg 5</div><div style="font-size:10px;color:#555">Week-ends, feries et ponts — bande bleue = weekend, horaire indique sous la date</div></div><div style="font-size:10px;color:#555">'+new Date().toLocaleDateString('fr-BE',{day:'2-digit',month:'long',year:'numeric'})+'</div></div>');w.document.write('<table><thead><tr><th style="text-align:left;padding-left:8px;width:150px">Operateur</th>'+selDates.map(function(d,i){return '<th'+(infoJour[i].weekend?' class="wk"':'')+'>'+d+(infoJour[i].horaire?'<span class="h">'+infoJour[i].horaire+'</span>':'')+'</th>';}).join('')+'</tr></thead><tbody>'+tb+'</tbody></table>');w.document.write('</body></html>');w.document.close();w.focus();}
function applyRole(role){
  var isAdmin = role === 'admin';
  var isSubchef = role === 'subchef';
  var isVisiteur = role === 'visiteur';
  var isEmploye = role === 'employe';

  // Toujours repartir d'un etat "tout visible" avant d'appliquer les
  // restrictions du role courant — indispensable si on change de compte
  // (ex: visiteur -> admin) sans recharger completement la page.
  document.querySelectorAll('[onclick*="openImportPointages"], [onclick*="openImportArretsModal"], [onclick*="markAllPtDone"], [onclick*="nettoyerDoublonsArrets"]').forEach(function(el){
    el.style.display = '';
  });
  ['ov','br','ab'].forEach(function(tab){
    var btn = document.querySelector('.tab[data-tab="'+tab+'"]');
    if(btn) btn.style.display = 'flex';
  });

  // Employe — acces limite a Planning + Formations
  if(isEmploye){
    ['ov','br','ab'].forEach(function(tab){
      var btn = document.querySelector('.tab[data-tab="'+tab+'"]');
      if(btn) btn.style.display = 'none';
    });
    var activeTabBtn = document.querySelector('.tab.on');
    if(activeTabBtn && activeTabBtn.dataset.tab !== 'pl' && activeTabBtn.dataset.tab !== 'formations'){
      var plBtn = document.querySelector('.tab[data-tab="pl"]');
      if(plBtn) plBtn.click();
    }
  }

  // Badge role
  var badge = document.getElementById('role-badge');
  if(badge){
    if(isAdmin){
      badge.textContent='Admin';
      badge.style.background='rgba(16,185,129,.15)';
      badge.style.color='var(--green)';
      badge.style.borderColor='rgba(16,185,129,.3)';
    } else if(isVisiteur){
      badge.textContent='Visiteur (lecture seule)';
      badge.style.background='rgba(139,146,164,.15)';
      badge.style.color='var(--tx2)';
      badge.style.borderColor='rgba(139,146,164,.3)';
    } else if(isEmploye){
      badge.textContent='Employé';
      badge.style.background='rgba(249,115,22,.15)';
      badge.style.color='var(--orange)';
      badge.style.borderColor='rgba(249,115,22,.3)';
    } else {
      badge.textContent='Sous-chef';
      badge.style.background='rgba(59,130,246,.15)';
      badge.style.color='var(--blue)';
      badge.style.borderColor='rgba(59,130,246,.3)';
    }
  }

  // Onglet Admin — admin seulement (jamais visiteur ni sous-chef)
  var adminTab = document.getElementById('tab-admin-btn');
  if(adminTab) adminTab.style.display = isAdmin ? 'flex' : 'none';
  // Pointages et Arrets Inpak — admin ET visiteur (lecture), pas sous-chef
  var ptTab = document.getElementById('tab-pt-btn');
  if(ptTab) ptTab.style.display = (isAdmin || isVisiteur) ? 'flex' : 'none';
  var arretsTab = document.getElementById('tab-arrets-btn');
  if(arretsTab) arretsTab.style.display = (isAdmin || isVisiteur) ? 'flex' : 'none';
  var cmp2Tab = document.getElementById('tab-cmp2-btn');
  if(cmp2Tab) cmp2Tab.style.display = (isAdmin || isVisiteur) ? 'flex' : 'none';
  var ncpTab = document.getElementById('tab-ncp-btn');
  if(ncpTab) ncpTab.style.display = (isAdmin || isVisiteur) ? 'flex' : 'none';
  var recTab = document.getElementById('tab-recrutement-btn');
  if(recTab) recTab.style.display = isAdmin ? 'flex' : 'none';
  canEditFormations = isAdmin || isSubchef;
  var formAddBtn = document.getElementById('form-btn-add');
  if(formAddBtn) formAddBtn.style.display = canEditFormations ? 'inline-flex' : 'none';

  // Acces personnalise par onglet (defini par l'admin dans Comptes employes)
  if(!isAdmin && role !== 'subchef' && currentUser && currentUser.tabs){
    var tCfg = currentUser.tabs;
    ['ov','br','pl','ab','formations','pt','arrets','ncp','recrutement','espace'].forEach(function(t){
      var tBtn = document.querySelector('.tab[data-tab="'+t+'"]');
      var visible = (t === 'espace') ? (tCfg[t] !== false) : !!tCfg[t];
      if(tBtn) tBtn.style.display = visible ? 'flex' : 'none';
    });
    var badge2 = document.getElementById('role-badge');
    if(badge2){
      badge2.textContent='Accès personnalisé';
      badge2.style.background='rgba(249,115,22,.15)';
      badge2.style.color='var(--orange)';
      badge2.style.borderColor='rgba(249,115,22,.3)';
    }
    var activeTabBtn2 = document.querySelector('.tab.on');
    if(activeTabBtn2 && !tCfg[activeTabBtn2.dataset.tab]){
      var order2 = ['pl','espace','ov','formations','br','ab','pt','arrets','ncp','recrutement'];
      var firstOk = null;
      for(var i2=0;i2<order2.length;i2++){ if(tCfg[order2[i2]]){ firstOk = order2[i2]; break; } }
      var firstBtn = firstOk && document.querySelector('.tab[data-tab="'+firstOk+'"]');
      if(firstBtn) firstBtn.click();
    }
  }


  // Email dans panneau admin
  var ae = document.getElementById('admin-email-display');
  if(ae && currentUser) ae.textContent = currentUser.email;

  // Visiteur : acces en lecture a tout (sauf Admin), aucune ecriture possible
  // (bloque aussi cote regles Firebase, donc double securite — meme si un
  // bouton d'ecriture restait visible quelque part, Firebase refuserait).
  if(isVisiteur){
    document.querySelectorAll('.tab[data-tab="admin"]').forEach(function(b){ b.style.display = 'none'; });

    // Masquer les boutons d'action principaux, pour une experience propre
    document.querySelectorAll('[onclick*="openImportPointages"], [onclick*="openImportArretsModal"], [onclick*="markAllPtDone"], [onclick*="nettoyerDoublonsArrets"]').forEach(function(el){
      el.style.display = 'none';
    });

    document.addEventListener('click', function(e){
      var tab = e.target.closest('.tab');
      if(tab && tab.dataset.tab === 'admin'){
        e.stopImmediatePropagation();
        e.preventDefault();
        toast('Acces non autorise (compte visiteur)', '#ef4444');
      }
    }, true);

    return;
  }

  // Sous-chef : accès Planning uniquement
  if(!isAdmin){
    // Masquer les onglets non autorisés
    ['ov','br','ab'].forEach(function(tab){
      var btn = document.querySelector('.tab[data-tab="'+tab+'"]');
      if(btn) btn.style.display = 'none';
    });

    // Forcer l'onglet Planning actif au démarrage
    setTimeout(function(){
      document.querySelectorAll('.tab').forEach(function(b){b.classList.remove('on');});
      document.querySelectorAll('.pane').forEach(function(p){p.classList.remove('on');});
      var plTab = document.querySelector('.tab[data-tab="pl"]');
      var plPane = document.getElementById('pane-pl');
      if(plTab) plTab.classList.add('on');
      if(plPane) plPane.classList.add('on');
    }, 100);

    // Intercepter les clics directs sur les panes interdits
    document.addEventListener('click', function(e){
      var tab = e.target.closest('.tab');
      if(tab && ['ov','br','ab','admin'].indexOf(tab.dataset.tab) !== -1){
        e.stopImmediatePropagation();
        e.preventDefault();
        toast('Acces non autorise', '#ef4444');
      }
    }, true);

    // Sous-chef PEUT modifier le planning (ziek/verlof/postes)
    // Aucun blocage sur applyShift
  }
}

// Verification centralisee des droits
function canEdit(){
  if(!currentUser){toast('Non connecte','#ef4444');return false;}
  // Admin et sous-chef peuvent modifier le planning
  if(currentUser.role==='admin'||currentUser.role==='subchef'||currentUser.editPlanning) return true;
  toast('Acces non autorise','#ef4444');
  return false;
}

// Verification pour les actions admin uniquement
function isAdmin(){
  return currentUser && currentUser.role === 'admin';
}
// ---- GESTION EMPLOYES ----
var editingEmpId = null;

function buildEmpTable(){
  var tbody = document.getElementById('empTbody');
  if(!tbody) return;
  var grpColors = {TL:'rgba(99,102,241,.2)',INPAK:'rgba(59,130,246,.15)',Prod:'rgba(249,115,22,.15)',Unit:'rgba(16,185,129,.15)'};
  var grpText = {TL:'#a5b4fc',INPAK:'#7eb3ff',Prod:'#fda96a',Unit:'#5eddb7'};
  tbody.innerHTML = EMP.map(function(e,i){
    var bg = grpColors[e.g]||'rgba(255,255,255,.05)';
    var col = grpText[e.g]||'var(--tx2)';
    return '<tr>'
      +'<td style="padding:10px 12px;font-size:13px;font-weight:500;border-bottom:1px solid var(--bd)">'+e.n+'</td>'
      +'<td style="padding:10px 12px;border-bottom:1px solid var(--bd)"><span style="font-size:11px;font-weight:500;padding:2px 8px;border-radius:20px;background:'+bg+';color:'+col+'">'+e.g+'</span></td>'
      +'<td style="padding:10px 12px;font-size:12px;color:var(--tx2);border-bottom:1px solid var(--bd)">'+e.r+'</td>'
      +'<td style="padding:10px 12px;text-align:center;border-bottom:1px solid var(--bd)">'
      +'<button onclick="editEmp('+i+')" style="padding:3px 10px;border-radius:6px;border:1px solid var(--bd2);background:none;color:var(--tx2);font-size:11px;cursor:pointer;font-family:var(--fn);margin-right:4px">'+t('adm_btn_edit')+'</button>'
      +'<button onclick="deactivateEmp('+i+')" style="padding:3px 10px;border-radius:6px;border:1px solid rgba(239,68,68,.3);background:none;color:var(--red);font-size:11px;cursor:pointer;font-family:var(--fn)">'+t('adm_btn_remove')+'</button>'
      +'</td></tr>';
  }).join('');
}

function showAddEmp(){
  editingEmpId = null;
  document.getElementById('emp-modal-title').textContent = t('adm_emp_modal_add_title');
  document.getElementById('emp-name').value = '';
  document.getElementById('emp-group').value = 'INPAK';
  document.getElementById('emp-role').value = '';
  document.getElementById('emp-modal-err').textContent = '';
  document.getElementById('emp-modal').style.display = 'flex';
}

function editEmp(idx){
  var e = EMP[parseInt(idx)];
  if(!e) return;
  editingEmpId = e.id || e.n.toLowerCase().replace(/[^a-z0-9]/g,'_').replace(/__+/g,'_');
  document.getElementById('emp-modal-title').textContent = t('adm_emp_modal_edit_prefix') + e.n;
  document.getElementById('emp-name').value = e.n;
  document.getElementById('emp-group').value = e.g;
  document.getElementById('emp-role').value = e.r;
  var bdEl = document.getElementById('emp-birthday');
  if(bdEl) bdEl.value = e.birthday || '';
  document.getElementById('emp-modal-err').textContent = '';
  document.getElementById('emp-modal').style.display = 'flex';
}

function closeEmpModal(){
  document.getElementById('emp-modal').style.display = 'none';
  editingEmpId = null;
}

function saveEmp(){
  var name = document.getElementById('emp-name').value.trim();
  var group = document.getElementById('emp-group').value;
  var role = document.getElementById('emp-role').value.trim();
  var err = document.getElementById('emp-modal-err');
  if(!name){ err.textContent = t('adm_err_name_required'); return; }
  if(!role){ err.textContent = t('adm_err_role_required'); return; }
  if(!db){ err.textContent = t('adm_err_firebase_disconnected'); return; }

  var id = editingEmpId || name.toLowerCase().replace(/[^a-z0-9]/g,'_').replace(/__+/g,'_');
  var order = editingEmpId ? (EMP.find(function(e){return e.id===editingEmpId;})||{}).order||99 : EMP.length;

  var bday = document.getElementById('emp-birthday')?document.getElementById('emp-birthday').value:'';
  var empData = {name:name, group:group, role:role, active:true, order:order};
  empData.birthday = bday || '';
  document.getElementById('emp-save-btn').disabled = true;
  document.getElementById('emp-save-btn').textContent = t('adm_saving');

  db.ref('employees/'+id).set(empData).then(function(){
    // Mettre a jour EMP local
    var existing = EMP.findIndex(function(e){return (e.id||e.n.toLowerCase().replace(/[^a-z0-9]/g,'_').replace(/__+/g,'_'))===id;});
    if(existing !== -1){
      EMP[existing] = {n:name, g:group, r:role, id:id, birthday: bday || ''};
    } else {
      var newEmp = {n:name, g:group, r:role, id:id, birthday: bday || ''};
      EMP.push(newEmp);
      // Ajouter dans SHIFTS26 et SHIFTS25
      var nbDates26 = WEEKS26.reduce(function(a,w){return a+w.d.length;},0);
      var nbDates25 = WEEKS25.reduce(function(a,w){return a+w.d.length;},0);
      var nbDates27 = WEEKS27.reduce(function(a,w){return a+w.d.length;},0);
      SHIFTS26.push({n:name, g:group, s:new Array(nbDates26).fill('')});
      SHIFTS25.push({n:name, g:group, s:new Array(nbDates25).fill('')});
      SHIFTS27.push({n:name, g:group, s:new Array(nbDates27).fill('')});
    }
    closeEmpModal();
    buildEmpTable();
    buildPT();
    buildBT();
    buildBirthdayNotif();
    buildBirthdayCal();
    toast(name + t('adm_toast_saved_suffix'), '#10b981');
    document.getElementById('emp-save-btn').disabled = false;
    document.getElementById('emp-save-btn').textContent = t('btn_save');
  }).catch(function(e){
    err.textContent = t('err_generic_prefix') + e.message;
    document.getElementById('emp-save-btn').disabled = false;
    document.getElementById('emp-save-btn').textContent = t('btn_save');
  });
}

function deactivateEmp(idx){
  var e = EMP[parseInt(idx)];
  if(!e) return;
  if(!confirm(t('adm_confirm_remove1') + e.n + t('adm_confirm_remove2'))) return;
  var id = e.id || e.n.toLowerCase().replace(/[^a-z0-9]/g,'_').replace(/__+/g,'_');
  if(!db){ toast(t('adm_err_firebase_disconnected'),'#ef4444'); return; }
  db.ref('employees/'+id+'/active').set(false).then(function(){
    EMP.splice(parseInt(idx), 1);
    SHIFTS26.splice(SHIFTS26.findIndex(function(s){return s.n===e.n;}), 1);
    SHIFTS25.splice(SHIFTS25.findIndex(function(s){return s.n===e.n;}), 1);
    SHIFTS27.splice(SHIFTS27.findIndex(function(s){return s.n===e.n;}), 1);
    buildEmpTable();
    buildPT();
    buildBT();
    updKPI();
    toast(e.n + t('adm_toast_removed_suffix'), '#f59e0b');
  }).catch(function(err){ toast(t('err_generic_prefix')+err.message,'#ef4444'); });
}

function doLogin(){var email=document.getElementById('li-email').value.trim();var pass=document.getElementById('li-pass').value;var btn=document.getElementById('li-btn');var err=document.getElementById('li-err');if(!email||!pass){err.textContent='Remplis tous les champs.';return;}btn.textContent=t('topbar_connecting');btn.disabled=true;err.textContent='';firebase.auth().signInWithEmailAndPassword(email,pass).catch(function(e){err.textContent=e.code==='auth/wrong-password'||e.code==='auth/user-not-found'?'Email ou mot de passe incorrect.':'Erreur: '+e.message;btn.textContent=t('login_btn');btn.disabled=false;});}
function doForgotPassword(){
  var email=document.getElementById('li-email').value.trim();
  var err=document.getElementById('li-err');
  if(!email){ err.style.color='#ef4444'; err.textContent='Renseigne ton email dans le champ ci-dessus, puis clique a nouveau sur "Mot de passe oublie ?".'; return; }
  err.style.color='var(--tx3)'; err.textContent='Envoi en cours...';
  firebase.auth().sendPasswordResetEmail(email).then(function(){
    err.style.color='#10b981';
    err.textContent='Email envoye a '+email+' (verifie aussi tes spams).';
  }).catch(function(e){
    err.style.color='#ef4444';
    err.textContent = e.code==='auth/user-not-found' ? 'Aucun compte avec cet email.' : 'Erreur: '+e.message;
  });
}
function doLogout(){firebase.auth().signOut();}
window.addEventListener('load',function(){
  applyI18n();
  document.getElementById('dchip').textContent=new Date().toLocaleDateString('fr-BE',{weekday:'short',day:'2-digit',month:'short',year:'numeric'});
  var cfg={apiKey:"AIzaSyAexVCEfVxmShZ-m7xFAVfk9AzReBi2WTQ",authDomain:"aw3-p5-hub.firebaseapp.com",databaseURL:"https://aw3-p5-hub-default-rtdb.europe-west1.firebasedatabase.app",projectId:"aw3-p5-hub",storageBucket:"aw3-p5-hub.firebasestorage.app",messagingSenderId:"685884843934",appId:"1:685884843934:web:ab8f7b8e362959f1ab988f"};
  var app;try{app=firebase.apps.length?firebase.apps[0]:firebase.initializeApp(cfg);}catch(e){app=firebase.app();}
  firebase.auth(app).onAuthStateChanged(function(user){
    if(user){currentUser=user;document.getElementById('user-email').textContent=user.email;document.getElementById('login-screen').style.display='none';document.getElementById('app-screen').style.display='flex';firebase.database(app).ref('users/'+user.uid).once('value').then(function(snap){var uRec=snap.val()||{};var role=uRec.role||'subchef';console.log('[DIAGNOSTIC] UID connecte :', user.uid, '| donnees lues depuis Firebase :', JSON.stringify(uRec), '| role applique :', role);currentUser.role=role;currentUser.tabs=uRec.tabs||null;currentUser.editPlanning=!!uRec.editPlanning;applyRole(role);initFirebase(app);startApp();loadBirthdaysFromFirebase();}).catch(function(e){console.error('[DIAGNOSTIC] Erreur de lecture du role :', e);currentUser.role='subchef';applyRole('subchef');initFirebase(app);startApp();loadBirthdaysFromFirebase();});}
    else{document.getElementById('login-screen').style.display='flex';document.getElementById('app-screen').style.display='none';}
  });
});

// ---- IMPORT PROTIME ----
// Table de correspondance personReference Protime -> nom exact dans EMP/SHIFTS.
// A completer/corriger au fil des imports si Protime ajoute des personnes
// ou si une orthographe ne correspond pas.
var PROTIME_PERSON_MAP = {
  118959: "Aurelien Turchi",
  133788: "Ramazani Abdulhassan",
  152746: "Anthony Raimondi",
  131719: "Brahim Akdim",
  140059: "Hakkim Akkouh",
  131713: "Halima Laadi",
  111217: "Julien Demuyter",
  116256: "Lachen Baraik",
  130245: "Larissa Fratutescu",
  126491: "Lyse Musik",
  120965: "Balan Marius",
  91855:  "Max Secember",
  156883: "Mohamed Lalaoui",
  101076: "Monir Salmi",
  125602: "Nicolas Fettu"
};

var protimeImportData = null;

function parseProtimeJson(){
  var raw = document.getElementById('protime-paste').value.trim();
  if(!raw){ toast('Colle d\'abord le JSON depuis Protime','#f59e0b'); return null; }
  try{
    return JSON.parse(raw);
  }catch(e){
    toast('JSON invalide - recopie depuis la console Protime','#ef4444');
    return null;
  }
}

// Convertit une date Protime "2026-07-04" vers le format dashboard "04/07"
function protimeDateToDDMM(isoDate){
  var parts = isoDate.split('-');
  return parts[2] + '/' + parts[1];
}

// Determine l'annee dashboard (2025/2026/2027) a partir d'une date ISO
function protimeDateToYear(isoDate){
  return isoDate.split('-')[0];
}

function previewProtimeImport(){
  var data = parseProtimeJson();
  if(!data || !data.employees){
    toast('Structure JSON inattendue (champ employees manquant)','#ef4444');
    return;
  }

  var matched = 0, unmatched = [], totalDays = 0, changedDays = 0;
  var unmappedShortLabels = [];

  data.employees.forEach(function(emp){
    var dashName = PROTIME_PERSON_MAP[emp.personReference];
    if(!dashName){
      unmatched.push(emp.firstName + ' ' + emp.lastName + ' (ref ' + emp.personReference + ')');
      return;
    }
    matched++;
    emp.days.forEach(function(d){
      totalDays++;
      if(d.value !== null) changedDays++;
      if(d.source === 'absence_unknown' && unmappedShortLabels.indexOf(d.raw) === -1){
        unmappedShortLabels.push(d.raw);
      }
    });
  });

  var html = '<div><b style="color:var(--green)">' + matched + '</b> employes reconnus sur ' + data.employees.length + '</div>';
  html += '<div style="margin-top:4px"><b>' + changedDays + '</b> jours avec une donnee a appliquer sur ' + totalDays + ' jours lus</div>';
  if(unmatched.length){
    html += '<div style="margin-top:8px;color:var(--red)">Non reconnus : ' + unmatched.join(', ') + '</div>';
  }
  if(unmappedShortLabels.length){
    html += '<div style="margin-top:8px;color:var(--amber)">Codes absence inconnus : ' + unmappedShortLabels.join(', ') + ' (ignores pour l\'instant)</div>';
  }

  var prev = document.getElementById('protime-preview');
  prev.style.display = 'block';
  prev.innerHTML = html;

  protimeImportData = data;
  var btn = document.getElementById('protime-apply-btn');
  if(matched > 0){
    btn.disabled = false;
    btn.style.opacity = '1';
  }
}

function purgeAllProtimeAbsences(){
  if(!canEdit()) return;
  if(!confirm("Cette action va supprimer TOUTES les absences importées depuis Protime (ziek, verlof, recup). Les postes du planning ne sont pas touchés. Relance ensuite un import Protime complet pour tout reconstituer proprement. Continuer ?")) return;
  var before = ABS.length;
  for(var k=ABS.length-1;k>=0;k--){
    var t=ABS[k].t;
    if(t==='ziek'||t==='verlof'||t==='recup'||!t) ABS.splice(k,1);
  }
  var removed = before - ABS.length;
  recalc(); buildBT(); updKPI(); refreshCharts();
  if(document.querySelector('.fb.on')) buildAbs(document.querySelector('.fb.on').dataset.f);
  updAbsLbl(); buildMiniCal(); save();
  toast(removed + ' absences supprimées — relance maintenant l\'import Protime', '#f59e0b');
}

function purgeUntypedAbsences(){
  if(!canEdit()){ return; }
  if(!confirm("Cette action va supprimer toutes les absences sans type connu (ziek/verlof/recup), c'est-a-dire les entrees importees avant la mise a jour du systeme. Elles n'apparaissent plus correctement dans Bradford de toute facon. Relance un import Protime juste apres pour tout reconstituer avec le bon type. Continuer ?")) return;

  var before = ABS.length;
  for(var k=ABS.length-1;k>=0;k--){
    if(!ABS[k].t){ ABS.splice(k,1); }
  }
  var removed = before - ABS.length;

  recalc(); buildBT(); updKPI(); refreshCharts();
  if(document.querySelector('.fb.on')) buildAbs(document.querySelector('.fb.on').dataset.f);
  updAbsLbl();
  save();

  toast(removed + ' entrees sans type supprimees - relance maintenant un import Protime propre', '#f59e0b');
}

function purgeProtimeAbsences(){
  if(!canEdit()){ return; }
  if(!confirm("Cette action va supprimer toutes les absences enregistrees comme des periodes d'un seul jour (le symptome du bug d'import precedent). Les vraies absences manuelles d'un seul jour seront aussi supprimees, mais tu pourras relancer un import Protime propre juste apres pour tout reconstituer correctement avec les periodes regroupees. Continuer ?")) return;

  var before = ABS.length;
  for(var k=ABS.length-1;k>=0;k--){
    if(ABS[k].d===1){ ABS.splice(k,1); }
  }
  var removed = before - ABS.length;

  recalc(); buildBT(); updKPI(); refreshCharts();
  if(document.querySelector('.fb.on')) buildAbs(document.querySelector('.fb.on').dataset.f);
  updAbsLbl();
  save();

  toast(removed + ' entrees d\'un jour supprimees - relance maintenant un import Protime propre', '#f59e0b');
}

function applyProtimeImport(){
  if(!protimeImportData){ toast('Clique d\'abord sur Verifier','#f59e0b'); return; }
  if(!canEdit()){ return; }

  var applied = 0;
  var ALLOWED_VALUES = ['ziek','verlof','recup'];

  protimeImportData.employees.forEach(function(emp){
    var dashName = PROTIME_PERSON_MAP[emp.personReference];
    if(!dashName) return;

    // Etape 1 : appliquer chaque jour au planning (SHIFTS), comme avant.
    // On retient au passage la liste ordonnee des jours d'absence par
    // personne, pour pouvoir ensuite les regrouper en periodes.
    var absenceDays = []; // {date: 'YYYY-MM-DD', value, ddmm, year}

    emp.days.forEach(function(d){
      if(d.value === null) return; // jour de repos ou code inconnu, on ne touche pas
      if(ALLOWED_VALUES.indexOf(d.value) === -1) return; // garde-fou : on ne touche jamais a un poste (31/32 etc.)

      var year = protimeDateToYear(d.date);
      var ddmm = protimeDateToDDMM(d.date);
      var shifts = year==='2027' ? SHIFTS27 : year==='2026' ? SHIFTS26 : SHIFTS25;
      var weeks = year==='2027' ? WEEKS27 : year==='2026' ? WEEKS26 : WEEKS25;
      var allDatesYear = weeks.reduce(function(a,w){return a.concat(w.d);},[]);
      var dayIdx = allDatesYear.indexOf(ddmm);
      if(dayIdx === -1) return; // date hors planning (ex: 24/12, 31/12 exclus)

      var empShifts = shifts.find(function(e){return e.n===dashName;});
      if(!empShifts) return;

      while(empShifts.s.length <= dayIdx) empShifts.s.push('');
      empShifts.s[dayIdx] = d.value;
      applied++;

      absenceDays.push({date:d.date, value:d.value, ddmm:ddmm, year:year});
    });

    // Etape 2 : regrouper les jours d'absence de meme type en periodes.
    // IMPORTANT : le planning Agristo ne contient que certains jours (ex: sam+lun),
    // donc un arret continu de 9 jours calendrier peut n'avoir que 4 entrees dans
    // absenceDays (22/03, 28/03...). On considere deux entrees comme appartenant
    // au MEME episode si le gap entre elles ne contient aucun jour present dans
    // le planning Agristo (= jours non travailles, donc l'absence couvre bien
    // tout l'intervalle).
    if(!absenceDays.length) return;

    absenceDays.sort(function(a,b){return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;});

    // Construire un Set de toutes les dates du planning annee courante pour test rapide
    var allPlannedDates2025 = WEEKS25.reduce(function(a,w){return a.concat(w.d);},[]);
    var allPlannedDates2026 = WEEKS26.reduce(function(a,w){return a.concat(w.d);},[]);
    var allPlannedDates2027 = WEEKS27.reduce(function(a,w){return a.concat(w.d);},[]);
    function isPlannedDay(isoDate){
      var dt = new Date(isoDate);
      var dd = String(dt.getDate()).padStart(2,'0');
      var mm = String(dt.getMonth()+1).padStart(2,'0');
      var ddmm = dd+'/'+mm;
      var yr = String(dt.getFullYear());
      var arr = yr==='2027'?allPlannedDates2027:yr==='2026'?allPlannedDates2026:allPlannedDates2025;
      return arr.indexOf(ddmm) !== -1;
    }
    function gapContainsWorkDay(isoA, isoB){
      // Retourne true si au moins un jour planifie existe ENTRE isoA et isoB (exclus)
      var d = new Date(isoA); d.setDate(d.getDate()+1);
      var end = new Date(isoB);
      while(d < end){
        if(isPlannedDay(d.toISOString().slice(0,10))) return true;
        d.setDate(d.getDate()+1);
      }
      return false;
    }

    var periods = [];
    var cur = null;
    absenceDays.forEach(function(d){
      if(cur && cur.value===d.value && !gapContainsWorkDay(cur.lastISO, d.date)){
        // Meme type + pas de jour travaille entre les deux -> meme episode
        cur.lastISO = d.date; cur.lastDDMM = d.ddmm; cur.lastYear = d.year; cur.count++;
      } else {
        if(cur) periods.push(cur);
        cur = {value:d.value, firstISO:d.date, firstDDMM:d.ddmm, firstYear:d.year, lastISO:d.date, lastDDMM:d.ddmm, lastYear:d.year, count:1};
      }
    });
    if(cur) periods.push(cur);

    // Etape 3 : pour chaque periode regroupee, retirer toute ancienne
    // entree ABS de cette personne qui chevauche les memes dates (pour
    // eviter les doublons en cas de re-import), puis ajouter une seule
    // entree couvrant la periode entiere.
    periods.forEach(function(p){
      var dateA = p.firstDDMM + '/' + p.firstYear;
      var dateB = p.lastDDMM + '/' + p.lastYear;

      for(var k=ABS.length-1;k>=0;k--){
        if(ABS[k].n===dashName && ABS[k].a===dateA && ABS[k].b===dateB){ ABS.splice(k,1); }
      }

      ABS.push({n:dashName, a:dateA, b:dateB, d:p.count, y:p.lastYear, t:p.value, ts:Date.now()});
    });
  });

  recalc(); buildBT(); updKPI(); refreshCharts(); buildPT();
  if(document.querySelector('.fb.on')) buildAbs(document.querySelector('.fb.on').dataset.f);
  updAbsLbl();
  save();

  var nowTs=new Date().toISOString();
  if(db) db.ref('bradford/import_ts').set(nowTs);
  document.getElementById('protime-status').textContent = applied + ' jours importes le ' + new Date().toLocaleString('fr-BE');
  document.getElementById('protime-status').style.color = 'var(--green)';
  detectMissingWeeks(protimeImportData);
  buildMiniCal();
  document.getElementById('protime-paste').value = '';
  document.getElementById('protime-preview').style.display = 'none';
  document.getElementById('protime-apply-btn').disabled = true;
  document.getElementById('protime-apply-btn').style.opacity = '.5';
  protimeImportData = null;

  toast(applied + ' jours mis a jour depuis Protime', '#10b981');
}

function migrLog(msg,col){
  var log=document.getElementById('migr-log');
  if(!log)return;
  log.style.display='block';
  var line=document.createElement('div');
  var icon=col==='#10b981'?'✓':col==='#ef4444'?'✗':col==='#f59e0b'?'⚠':'→';
  line.innerHTML='<span style="color:'+col+'">'+icon+'</span> '+msg;
  log.appendChild(line);
  log.scrollTop=log.scrollHeight;
}
function migrProg(pct){
  var bar=document.getElementById('migr-bar');
  var prog=document.getElementById('migr-prog');
  if(prog)prog.style.display='block';
  if(bar)bar.style.width=pct+'%';
}

function runMigration(){
  if(!db){toast('Firebase non connecte','#ef4444');return;}
  var btn=document.getElementById('migr-btn');
  var status=document.getElementById('migr-status');
  btn.disabled=true;btn.textContent='Migration en cours...';
  migrLog('Debut de la migration...','#3b82f6');
  migrProg(5);

  // Construire les objets shifts
  var d26={},d25={};
  SHIFTS26.forEach(function(e){d26[e.n]=e.s;});
  SHIFTS25.forEach(function(e){d25[e.n]=e.s;});

  // Construire les employes pour Firebase
  var empData={};
  EMP.forEach(function(e,idx){
    var id=e.n.toLowerCase().replace(/[^a-z0-9]/g,'_').replace(/__+/g,'_');
    empData[id]={name:e.n,group:e.g,role:e.r,active:true,order:idx};
  });

  var updates={};
  var d27m={};SHIFTS27.forEach(function(e){d27m[e.n]=e.s;});
  updates['planning/shifts2026']=d26;
  updates['planning/shifts2025']=d25;
  updates['planning/shifts2027']=d27m;
  updates['planning/absences']=ABS;
  updates['employees']=empData;
  updates['planning/lastUpdate']={
    at:new Date().toISOString(),
    by:currentUser?currentUser.email:'admin',
    version:'3.0-migration'
  };

  migrLog('Ecriture de '+Object.keys(d26).length+' employes (2026)...','#8b90a4');
  migrProg(30);

  db.ref().update(updates).then(function(){
    migrProg(100);
    migrLog('Shifts 2026 OK ('+Object.keys(d26).length+' employes)','#10b981');
    migrLog('Shifts 2025 OK ('+Object.keys(d25).length+' employes)','#10b981');
    migrLog('Absences OK ('+ABS.length+' entrees)','#10b981');
    migrLog('Migration terminee avec succes !','#10b981');
    if(status)status.textContent='Effectuee le '+new Date().toLocaleDateString('fr-BE');
    if(status)status.style.color='var(--green)';
    btn.textContent='Migration effectuee ✓';
    btn.style.background='var(--green)';
    toast('Migration Firebase reussie !','#10b981');
  }).catch(function(err){
    migrLog('ERREUR: '+err.message,'#ef4444');
    btn.disabled=false;btn.textContent='Reessayer';
    toast('Erreur migration: '+err.message,'#ef4444');
  });
}

function startApp(){
  if(db){
    var loaded={s26:false,s25:false,s27:false,abs:false,emp:false};
    function tryBuild(){
      if(loaded.s26&&loaded.s25&&loaded.s27&&loaded.abs&&loaded.emp){
        recalc();updKPI();initCharts();buildBT();buildPT();buildAbs('all');updAbsLbl();buildMiniCal();buildTodayAbs();buildBirthdayNotif();buildBirthdayCal();loadPointages();loadArretsInpak();loadNCPData();
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
        loaded.abs=true;tryBuild();
      }).catch(function(){loaded.abs=true;tryBuild();});
    } else {
      // Sous-chef : pas besoin des absences
      loaded.abs=true;tryBuild();
    }
  } else {
    recalc();updKPI();initCharts();buildBT();buildPT();buildAbs('all');updAbsLbl();buildEmpTable();buildMiniCal();buildTodayAbs();buildBirthdayNotif();buildBirthdayCal();loadPointages();loadArretsInpak();loadNCPData();
  }
}



// ============================================================
// NOUVELLES FONCTIONS
// ============================================================

function calcTrend(name){
  var now=new Date();
  var cut90=new Date(now);cut90.setDate(cut90.getDate()-90);
  var cut180=new Date(now);cut180.setDate(cut180.getDate()-180);
  function pFR(s){var p=s.split('/');return new Date(Number(p[2]),Number(p[1])-1,Number(p[0]));}
  function addDays(d,n){var r=new Date(d);r.setDate(r.getDate()+n);return r;}
  function calcScore(eps){
    if(!eps.length) return 0;
    eps.sort(function(a,b){return a.deb-b.deb;});
    var merged=[],cur={deb:eps[0].deb,fin:eps[0].fin,days:eps[0].d};
    for(var i=1;i<eps.length;i++){
      var iv=eps[i];var gap=true;var d=new Date(cur.fin);d.setDate(d.getDate()+1);
      while(d<iv.deb){var dow=d.getDay();if(dow!==0&&dow!==6){gap=false;break;}d.setDate(d.getDate()+1);}
      if(iv.deb<=addDays(cur.fin,1)||gap){if(iv.fin>cur.fin)cur.fin=iv.fin;cur.days+=iv.d;}
      else{merged.push(cur);cur={deb:iv.deb,fin:iv.fin,days:iv.d};}
    }
    merged.push(cur);
    var D=0;merged.forEach(function(ep){D+=ep.days;});
    return merged.length*merged.length*D;
  }
  var recent=[],older=[];
  ABS.filter(function(a){return a.n===name&&a.t==='ziek';}).forEach(function(a){
    function p2(s){var p=s.split('/');return new Date(Number(p[2]),Number(p[1])-1,Number(p[0]));}
    var deb=p2(a.a),fin=p2(a.b);
    if(fin>=cut90&&deb<=now) recent.push({deb:deb,fin:fin,d:a.d});
    else if(fin>=cut180&&deb<cut90) older.push({deb:deb,fin:fin,d:a.d});
  });
  var s1=calcScore(recent),s2=calcScore(older);
  if(s1===0&&s2===0) return 'stable';
  if(s1<s2) return 'down';
  if(s1>s2) return 'up';
  return 'stable';
}
function trendHtml(trend){
  if(trend==='down') return '<span style="color:#10b981;font-size:12px;font-weight:700">&#8595; Mieux</span>';
  if(trend==='up') return '<span style="color:#ef4444;font-size:12px;font-weight:700">&#8593; Hausse</span>';
  return '<span style="color:var(--tx3);font-size:12px">&#8212; Stable</span>';
}
function calcSaisons(name){
  function pFR(s){var p=s.split('/');return new Date(Number(p[2]),Number(p[1])-1,Number(p[0]));}
  var s={Hiver:0,Printemps:0,Ete:0,Automne:0};
  ABS.filter(function(a){return a.n===name&&a.t==='ziek';}).forEach(function(a){
    var m=pFR(a.a).getMonth();
    if(m===11||m<=1) s.Hiver+=a.d;
    else if(m<=4) s.Printemps+=a.d;
    else if(m<=7) s.Ete+=a.d;
    else s.Automne+=a.d;
  });
  return s;
}
function getCommentHistory(name){
  var cm=BD_COMMENTS[name];
  if(!cm||!cm.history||!cm.history.length) return '';
  var html='<div style="margin-top:12px"><div style="font-size:11px;font-weight:600;color:var(--tx3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Historique</div>';
  cm.history.slice(0,5).forEach(function(h){
    html+='<div style="font-size:12px;padding:6px 8px;border-radius:6px;background:var(--bg3);margin-bottom:4px">';
    html+='<div style="color:var(--tx2)">'+(h.text||'')+'</div>';
    html+='<div style="font-size:10px;color:var(--tx3);margin-top:2px">'+(h.date||'')+(h.author?' · '+h.author:'')+'</div></div>';
  });
  return html+'</div>';
}
function marquerDiscute(name){
  var now=new Date().toLocaleString('fr-BE');
  var author=currentUser?currentUser.email||'':'';
  if(!BD_COMMENTS[name]) BD_COMMENTS[name]={text:'',date:'',author:'',history:[]};
  if(!BD_COMMENTS[name].history) BD_COMMENTS[name].history=[];
  BD_COMMENTS[name].history.unshift({text:'[Entretien effectue]',date:now,author:author});
  if(!BD_COMMENTS[name].text){BD_COMMENTS[name].text='[Entretien effectue]';BD_COMMENTS[name].date=now;BD_COMMENTS[name].author=author;}
  if(db) db.ref('bradford/comments/'+name.replace(/[.#$\/\[\]]/g,'_')).set(BD_COMMENTS[name]);
  var panel=document.getElementById('bradford-panel');
  if(panel) panel.remove();
  openBradfordPanel(name);
  toast('Entretien marque pour '+name.split(' ')[0],'#10b981');
}
function buildTodayAbs(){
  var el=document.getElementById('today-abs');
  var title=document.getElementById('today-abs-title');
  if(!el) return;
  var now=new Date(),today=todayStr(),yr=String(now.getFullYear());
  function pFR(s){var p=s.split('/');return new Date(Number(p[2]),Number(p[1])-1,Number(p[0]));}
  var absToday=[];
  ABS.forEach(function(a){
    var deb=pFR(a.a),fin=pFR(a.b),td=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    if(deb<=td&&fin>=td) absToday.push(a);
  });
  var shifts=yr==='2027'?SHIFTS27:yr==='2026'?SHIFTS26:SHIFTS25;
  var weeks=yr==='2027'?WEEKS27:yr==='2026'?WEEKS26:WEEKS25;
  var allD=weeks.reduce(function(a,w){return a.concat(w.d);},[]);
  var ti=allD.indexOf(today);
  if(ti!==-1) shifts.forEach(function(emp){
    var sv=emp.s[ti]||'';
    if((sv==='verlof'||sv==='recup')&&!absToday.find(function(a){return a.n===emp.n;}))
      absToday.push({n:emp.n,t:sv,a:today+'/'+yr,b:today+'/'+yr,d:1});
  });
  var MOIS=MOIS_I18N[LANG]||MOIS_I18N.fr;
  var dow=(DOW_FULL_I18N[LANG]||DOW_FULL_I18N.fr)[now.getDay()];
  if(title) title.textContent=t('ov_today_prefix')+' \u2014 '+dow+' '+now.getDate()+' '+MOIS[now.getMonth()];
  if(!absToday.length){el.innerHTML='<div style="color:var(--tx3);font-size:13px;padding:12px 0;text-align:center">'+t('ov_today_allpresent')+'</div>';return;}
  el.innerHTML=absToday.map(function(a){
    var tc=a.t==='ziek'?'#ef4444':a.t==='verlof'?'#3b82f6':'#10b981';
    var tl=a.t==='ziek'?t('legend_ziek'):a.t==='verlof'?t('legend_verlof'):t('legend_recup');
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bd2)"><div style="font-size:13px;font-weight:600;color:var(--tx1)">'+a.n+'</div><span style="font-size:11px;padding:2px 9px;border-radius:99px;background:'+tc+'22;color:'+tc+';border:1px solid '+tc+'44">'+tl+'</span></div>';
  }).join('');
}
function calcStatsTrimestreNvsN1(){
  var now=new Date(),yr=now.getFullYear();
  function pFR(s){var p=s.split('/');return new Date(Number(p[2]),Number(p[1])-1,Number(p[0]));}
  var stats={N:{Q1:0,Q2:0,Q3:0,Q4:0},N1:{Q1:0,Q2:0,Q3:0,Q4:0}};
  ABS.filter(function(a){return a.t==='ziek';}).forEach(function(a){
    var deb=pFR(a.a),y=deb.getFullYear(),m=deb.getMonth();
    var q=m<3?'Q1':m<6?'Q2':m<9?'Q3':'Q4';
    if(y===yr) stats.N[q]+=a.d; else if(y===yr-1) stats.N1[q]+=a.d;
  });
  return {stats:stats,yr:yr};
}
function exportBradfordExcel(){
  if(typeof JSZip==='undefined'){toast('JSZip non charge','#ef4444');return;}
  function scSty(sc){return sc===0?7:sc<=50?3:sc<=200?4:sc<=500?5:6;}
  function stLbl(sc){return sc===0?'Parfait':sc<=50?'OK':sc<=200?'A surveiller':sc<=500?'Preoccupant':'Critique';}
  var str=[],sm={};
  function si(s){s=String(s);if(sm[s]===undefined){sm[s]=str.length;str.push(s);}return sm[s];}
  function cell(r,col,v,s){var ref=String.fromCharCode(65+col)+r;if(typeof v==='number')return '<c r="'+ref+'" s="'+s+'"><v>'+v+'</v></c>';return '<c r="'+ref+'" t="s" s="'+s+'"><v>'+si(v)+'</v></c>';}
  var styles='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="3"><font><sz val="11"/><name val="Calibri"/></font><font><sz val="11"/><name val="Calibri"/><b/><color rgb="FFFFFFFF"/></font><font><sz val="11"/><name val="Calibri"/><b/><color rgb="FF1E3A5F"/></font></fonts><fills count="10"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1E3A5F"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1E40AF"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD1FAE5"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFEF3C7"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFED7AA"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFEE2E2"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD1FAE5"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF8FAFC"/></patternFill></fill></fills><borders count="2"><border><left/><right/><top/><bottom/></border><border><left style="thin"><color rgb="FFE2E8F0"/></left><right style="thin"><color rgb="FFE2E8F0"/></right><top style="thin"><color rgb="FFE2E8F0"/></top><bottom style="thin"><color rgb="FFE2E8F0"/></bottom></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="11"><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0"><alignment horizontal="left" vertical="center"/></xf><xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="1" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1"><alignment horizontal="left" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="4" borderId="1" xfId="0" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="5" borderId="1" xfId="0" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="6" borderId="1" xfId="0" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="1" fillId="7" borderId="1" xfId="0" applyFont="1" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="8" borderId="1" xfId="0" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="9" borderId="1" xfId="0" applyFill="1"><alignment horizontal="left" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0"><alignment horizontal="center" vertical="center"/></xf></cellXfs></styleSheet>';
  var rows=[],r=1;
  rows.push('<row r="'+r+'" ht="20">'+cell(r,0,'Bradford Dashboard - AW3 Ploeg 5',1)+'</row>');r++;
  rows.push('<row r="'+r+'">'+cell(r,0,new Date().toLocaleDateString('fr-BE'),0)+'</row>');r++;
  rows.push('<row r="'+r+'"></row>');r++;
  rows.push('<row r="'+r+'" ht="18">'+cell(r,0,'Employe',1)+cell(r,1,'Groupe',1)+cell(r,2,'Role',1)+cell(r,3,'Jours',1)+cell(r,4,'Episodes',1)+cell(r,5,'Score',1)+cell(r,6,'Statut',1)+cell(r,7,'Tendance',1)+'</row>');r++;
  ['TL','INPAK','Prod','Unit'].forEach(function(g){
    var em=BD.filter(function(e){var f=EMP.find(function(x){return x.n===e.n;});return f&&f.g===g;});
    if(!em.length)return;
    rows.push('<row r="'+r+'">'+cell(r,0,g,2)+cell(r,1,'',2)+cell(r,2,'',2)+cell(r,3,'',2)+cell(r,4,'',2)+cell(r,5,'',2)+cell(r,6,'',2)+cell(r,7,'',2)+'</row>');r++;
    em.forEach(function(e,idx){
      var emp=EMP.find(function(x){return x.n===e.n;});var ss=scSty(e.sc);
      var tr=calcTrend(e.n),tl=tr==='down'?'En amelioration':tr==='up'?'En hausse':'Stable';
      rows.push('<row r="'+r+'">'+cell(r,0,e.n+(e.sc===0?' *':''),idx%2?9:0)+cell(r,1,g,10)+cell(r,2,emp?emp.r:'',idx%2?9:0)+cell(r,3,e.D,10)+cell(r,4,e.S,10)+cell(r,5,e.sc,ss)+cell(r,6,stLbl(e.sc),ss)+cell(r,7,tl,10)+'</row>');r++;
    });
  });
  var sheet='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetFormatPr defaultRowHeight="15"/><cols><col min="1" max="1" width="28" customWidth="1"/><col min="2" max="2" width="10" customWidth="1"/><col min="3" max="3" width="18" customWidth="1"/><col min="4" max="8" width="12" customWidth="1"/></cols><sheetData>'+rows.join('')+'</sheetData></worksheet>';
  var sst='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="'+str.length+'" uniqueCount="'+str.length+'">'+str.map(function(s){return '<si><t xml:space="preserve">'+s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</t></si>';}).join('')+'</sst>';
  var wb='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Bradford" sheetId="1" r:id="rId1"/></sheets></workbook>';
  var wbR='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>';
  var pR='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';
  var ct='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>';
  var zip=new JSZip();zip.file('[Content_Types].xml',ct);zip.file('_rels/.rels',pR);zip.file('xl/workbook.xml',wb);zip.file('xl/_rels/workbook.xml.rels',wbR);zip.file('xl/styles.xml',styles);zip.file('xl/sharedStrings.xml',sst);zip.file('xl/worksheets/sheet1.xml',sheet);
  zip.generateAsync({type:'blob',mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}).then(function(blob){var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Bradford_'+new Date().toISOString().slice(0,10)+'.xlsx';a.click();toast('Export Excel genere','#10b981');});
}
function genererRapportExcel(){
  if(typeof JSZip==='undefined'){toast('JSZip non charge','#ef4444');return;}
  var mois=parseInt(document.getElementById('rapport-mois').value);
  var annee=parseInt(document.getElementById('rapport-annee').value);
  var MN=['Janvier','Fevrier','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Decembre'];
  var nomMois=MN[mois];
  function pFR(s){var p=s.split('/');return new Date(Number(p[2]),Number(p[1])-1,Number(p[0]));}
  function scSty(sc){return sc===0?7:sc<=50?3:sc<=200?4:sc<=500?5:6;}
  function stLbl(sc){return sc===0?'Parfait':sc<=50?'OK':sc<=200?'A surveiller':sc<=500?'Preoccupant':'Critique';}
  var str=[],sm={};
  function si(s){s=String(s);if(sm[s]===undefined){sm[s]=str.length;str.push(s);}return sm[s];}
  function cell(r,col,v,s){var ref=String.fromCharCode(65+col)+r;if(typeof v==='number')return '<c r="'+ref+'" s="'+s+'"><v>'+v+'</v></c>';return '<c r="'+ref+'" t="s" s="'+s+'"><v>'+si(String(v))+'</v></c>';}
  var styles='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="3"><font><sz val="11"/><name val="Calibri"/></font><font><sz val="11"/><name val="Calibri"/><b/><color rgb="FFFFFFFF"/></font><font><sz val="14"/><name val="Calibri"/><b/><color rgb="FF1E3A5F"/></font></fonts><fills count="10"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1E3A5F"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1E40AF"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD1FAE5"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFEF3C7"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFED7AA"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFEE2E2"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD1FAE5"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF8FAFC"/></patternFill></fill></fills><borders count="2"><border><left/><right/><top/><bottom/></border><border><left style="thin"><color rgb="FFE2E8F0"/></left><right style="thin"><color rgb="FFE2E8F0"/></right><top style="thin"><color rgb="FFE2E8F0"/></top><bottom style="thin"><color rgb="FFE2E8F0"/></bottom></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="11"><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0"><alignment horizontal="left" vertical="center"/></xf><xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="1" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1"><alignment horizontal="left" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="4" borderId="1" xfId="0" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="5" borderId="1" xfId="0" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="6" borderId="1" xfId="0" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="1" fillId="7" borderId="1" xfId="0" applyFont="1" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="8" borderId="1" xfId="0" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="9" borderId="1" xfId="0" applyFill="1"><alignment horizontal="left" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0"><alignment horizontal="center" vertical="center"/></xf></cellXfs></styleSheet>';
  var r1=[],r=1;
  r1.push('<row r="'+r+'" ht="20">'+cell(r,0,'Bradford Dashboard AW3 Ploeg 5',1)+'</row>');r++;
  r1.push('<row r="'+r+'">'+cell(r,0,'Rapport '+nomMois+' '+annee,0)+'</row>');r++;
  r1.push('<row r="'+r+'"></row>');r++;
  r1.push('<row r="'+r+'" ht="18">'+cell(r,0,'Employe',1)+cell(r,1,'Groupe',1)+cell(r,2,'Role',1)+cell(r,3,'Jours',1)+cell(r,4,'Episodes',1)+cell(r,5,'Score',1)+cell(r,6,'Statut',1)+'</row>');r++;
  ['TL','INPAK','Prod','Unit'].forEach(function(g){
    var em=BD.filter(function(e){var f=EMP.find(function(x){return x.n===e.n;});return f&&f.g===g;});
    if(!em.length)return;
    r1.push('<row r="'+r+'">'+cell(r,0,g,2)+cell(r,1,'',2)+cell(r,2,'',2)+cell(r,3,'',2)+cell(r,4,'',2)+cell(r,5,'',2)+cell(r,6,'',2)+'</row>');r++;
    em.forEach(function(e,idx){var emp=EMP.find(function(x){return x.n===e.n;});var ss=scSty(e.sc);r1.push('<row r="'+r+'">'+cell(r,0,e.n+(e.sc===0?' *':''),idx%2?9:0)+cell(r,1,g,10)+cell(r,2,emp?emp.r:'',idx%2?9:0)+cell(r,3,e.D,10)+cell(r,4,e.S,10)+cell(r,5,e.sc,ss)+cell(r,6,stLbl(e.sc),ss)+'</row>');r++;});
  });
  var absM=ABS.filter(function(a){var d=pFR(a.a);return d.getMonth()===mois&&d.getFullYear()===annee&&a.t==='ziek';});
  absM.sort(function(a,b){return pFR(a.a)-pFR(b.a);});
  var r2=[],rx=1,tJ=0;
  r2.push('<row r="'+rx+'" ht="20">'+cell(rx,0,'Absences Maladie - '+nomMois+' '+annee,1)+'</row>');rx++;
  r2.push('<row r="'+rx+'"></row>');rx++;
  r2.push('<row r="'+rx+'" ht="18">'+cell(rx,0,'Employe',1)+cell(rx,1,'Debut',1)+cell(rx,2,'Fin',1)+cell(rx,3,'Jours',1)+'</row>');rx++;
  absM.forEach(function(a,idx){tJ+=a.d;r2.push('<row r="'+rx+'">'+cell(rx,0,a.n,idx%2?9:0)+cell(rx,1,a.a,10)+cell(rx,2,a.b,10)+cell(rx,3,a.d,6)+'</row>');rx++;});
  if(absM.length)r2.push('<row r="'+rx+'">'+cell(rx,0,'TOTAL',1)+cell(rx,1,'',1)+cell(rx,2,'',1)+cell(rx,3,tJ,1)+'</row>');
  else r2.push('<row r="'+rx+'">'+cell(rx,0,'Aucune absence ce mois',3)+'</row>');
  var res=calcStatsTrimestreNvsN1(),stats=res.stats,yr=res.yr;
  var r3=[],ry=1;
  r3.push('<row r="'+ry+'" ht="20">'+cell(ry,0,'Statistiques '+yr+' vs '+(yr-1),1)+'</row>');ry++;
  r3.push('<row r="'+ry+'"></row>');ry++;
  r3.push('<row r="'+ry+'" ht="18">'+cell(ry,0,'Trimestre',1)+cell(ry,1,''+yr,1)+cell(ry,2,''+(yr-1),1)+cell(ry,3,'Evolution',1)+'</row>');ry++;
  var tN=0,tN1=0;
  ['Q1','Q2','Q3','Q4'].forEach(function(q,i){var n=stats.N[q],n1=stats.N1[q];tN+=n;tN1+=n1;var pct=n1===0?'N/A':(n>n1?'+':'')+Math.round((n-n1)/(n1||1)*100)+'%';r3.push('<row r="'+ry+'">'+cell(ry,0,['T1 Jan-Mar','T2 Avr-Jun','T3 Jul-Sep','T4 Oct-Dec'][i],i%2?9:0)+cell(ry,1,n,10)+cell(ry,2,n1,10)+cell(ry,3,pct,n>n1?6:3)+'</row>');ry++;});
  r3.push('<row r="'+ry+'">'+cell(ry,0,'TOTAL',1)+cell(ry,1,tN,1)+cell(ry,2,tN1,1)+cell(ry,3,(tN>tN1?'+':'')+Math.round((tN-tN1)/(tN1||1)*100)+'%',tN>tN1?6:3)+'</row>');
  function mkSh(rows,cols){return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetFormatPr defaultRowHeight="15"/>'+cols+'<sheetData>'+rows.join('')+'</sheetData></worksheet>';}
  var sh1=mkSh(r1,'<cols><col min="1" max="1" width="28" customWidth="1"/><col min="2" max="2" width="10" customWidth="1"/><col min="3" max="3" width="18" customWidth="1"/><col min="4" max="7" width="12" customWidth="1"/></cols>');
  var sh2=mkSh(r2,'<cols><col min="1" max="1" width="28" customWidth="1"/><col min="2" max="3" width="14" customWidth="1"/><col min="4" max="4" width="10" customWidth="1"/></cols>');
  var sh3=mkSh(r3,'<cols><col min="1" max="1" width="24" customWidth="1"/><col min="2" max="4" width="14" customWidth="1"/></cols>');
  var sst='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="'+str.length+'" uniqueCount="'+str.length+'">'+str.map(function(s){return '<si><t xml:space="preserve">'+s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</t></si>';}).join('')+'</sst>';
  var wb='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Bradford" sheetId="1" r:id="rId1"/><sheet name="Absences '+nomMois+'" sheetId="2" r:id="rId2"/><sheet name="Statistiques" sheetId="3" r:id="rId3"/></sheets></workbook>';
  var wbR='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet3.xml"/><Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/><Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>';
  var pR='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';
  var ct='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet3.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>';
  var zip=new JSZip();zip.file('[Content_Types].xml',ct);zip.file('_rels/.rels',pR);zip.file('xl/workbook.xml',wb);zip.file('xl/_rels/workbook.xml.rels',wbR);zip.file('xl/styles.xml',styles);zip.file('xl/sharedStrings.xml',sst);zip.file('xl/worksheets/sheet1.xml',sh1);zip.file('xl/worksheets/sheet2.xml',sh2);zip.file('xl/worksheets/sheet3.xml',sh3);
  zip.generateAsync({type:'blob',mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}).then(function(blob){var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Bradford_AW3P5_'+nomMois+'_'+annee+'.xlsx';a.click();toast('Rapport Excel : '+nomMois+' '+annee,'#10b981');});
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
function testFirebaseConnection(){
  var el = document.getElementById('fb-test-results');
  if(!el) return;
  if(!db){
    el.innerHTML = '<div style="color:#ef4444">✗ Aucune connexion Firebase (db non initialise)</div>';
    return;
  }
  el.innerHTML = '<div style="color:var(--tx3)">Test en cours…</div>';

  var paths = [
    {label: 'Lecture users', ref: 'users', mode: 'read'},
    {label: 'Lecture employees', ref: 'employees', mode: 'read'},
    {label: 'Lecture planning/shifts2026', ref: 'planning/shifts2026', mode: 'read'},
    {label: 'Lecture planning/absences', ref: 'planning/absences', mode: 'read'},
    {label: 'Lecture pointages', ref: 'pointages', mode: 'read'},
    {label: 'Ecriture pointages (test)', ref: 'pointages/_test_connexion', mode: 'write'},
    {label: 'Connexion temps reel (.info/connected)', ref: '.info/connected', mode: 'realtime'}
  ];

  var results = paths.map(function(p){ return {label: p.label, status: 'pending'}; });

  function render(){
    el.innerHTML = results.map(function(r){
      var icon = r.status === 'pending' ? '<span style="color:var(--tx3)">…</span>'
        : r.status === 'ok' ? '<span style="color:#10b981">✓</span>'
        : '<span style="color:#ef4444">✗</span>';
      var extra = r.error ? ' <span style="color:#ef4444;font-size:11px">(' + r.error + ')</span>' : '';
      return '<div>' + icon + ' ' + r.label + extra + '</div>';
    }).join('');
  }
  render();

  paths.forEach(function(p, idx){
    if(p.mode === 'read'){
      db.ref(p.ref).once('value').then(function(){
        results[idx].status = 'ok'; render();
      }).catch(function(e){
        results[idx].status = 'error'; results[idx].error = e.message; render();
      });
    } else if(p.mode === 'write'){
      db.ref(p.ref).set({ts: Date.now(), by: currentUser?currentUser.email:'test'}).then(function(){
        return db.ref(p.ref).remove();
      }).then(function(){
        results[idx].status = 'ok'; render();
      }).catch(function(e){
        results[idx].status = 'error'; results[idx].error = e.message; render();
      });
    } else if(p.mode === 'realtime'){
      db.ref(p.ref).once('value').then(function(snap){
        results[idx].status = snap.val() ? 'ok' : 'error';
        if(!snap.val()) results[idx].error = 'hors ligne';
        render();
      }).catch(function(e){
        results[idx].status = 'error'; results[idx].error = e.message; render();
      });
    }
  });
}



// ============================================================
// POINTAGES — Données, import, affichage, commentaires
// ============================================================

var PT_DATA = {}; // {clé: {nom, date, type, detail, statut, commentaire, ts}}

// Charger depuis Firebase au démarrage
function pointageEcartAvantShift(a){
if(!a || a.type !== 'pointage' || a.sousType !== 'Entrée' || !a.heure) return false;
var p = String(a.heure).split(':');
var mins = parseInt(p[0],10)*60 + parseInt(p[1],10);
if(isNaN(mins)) return false;
var starts = [5*60, 13*60, 17*60, 21*60];
for(var i=0;i<starts.length;i++){
var delta = starts[i] - mins;
if(delta >= 0 && delta <= 20) return true;
}
return false;
}
function loadPointages(){
  if(!db) return;
  db.ref('pointages').on('value', function(snap){
    var data = snap.val();
    PT_DATA = data || {};
    buildPT2();
    updPointagesBanner();
  }, function(error){
    console.error('[Pointages] Erreur de lecture Firebase :', error);
    toast('Pointages : accès Firebase refusé (' + error.message + ')', '#ef4444');
  });
}

// Générer une clé unique pour une anomalie
// Rapproche un nom Protime ("Abdulhassan Ramazani") avec un nom du
// dashboard ("Ramazani Abdulhassan") — l'ordre prenom/nom differe entre
// les deux systemes, donc on compare les mots un par un, peu importe l'ordre.
function matchNomProtime(nomProtime){
  var motsProtime = nomProtime.toLowerCase().split(/\s+/).sort().join(' ');
  var trouve = EMP.find(function(e){
    var motsEmp = e.n.toLowerCase().split(/\s+/).sort().join(' ');
    return motsEmp === motsProtime;
  });
  return trouve ? trouve.n : null;
}

// Classe une absence Protime en ziek/verlof/recup a partir du titre/detail/groupe
function classifierTypeAbsence(titre, detail, groupe){
  var texte = ((titre||'') + ' ' + (detail||'') + ' ' + (groupe||'')).toLowerCase();
  if(/ziek|maladie|sick/.test(texte)) return 'ziek';
  if(/recup|compensation/.test(texte)) return 'recup';
  if(/verlof|cong|vacation|vakantie/.test(texte)) return 'verlof';
  return null; // type inconnu : on ignore plutot que de deviner
}

// ==============================================================
// Formatage des dates -- toujours a la francaise (JJ/MM/AAAA)
// ==============================================================
// dFR() est tolerante : elle accepte une date ISO (2026-08-05), une date
// ISO horodatee (2026-08-05T14:30 ou 2026-08-05 14:30) et laisse passer
// telle quelle toute valeur qui n est pas une date ISO.
function dFR(v){
  if(v === undefined || v === null || v === '') return '-';
  var s = String(v);
  var m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(m) return m[3] + '/' + m[2] + '/' + m[1];
  var mh = s.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}:\d{2})/);
  if(mh) return mh[3] + '/' + mh[2] + '/' + mh[1] + ' ' + mh[4];
  return s;
}

// AAAA-MM -> 'aout 2026' (libelle court pour les axes de graphiques)
var MOIS_COURTS_FR = ['janv.','fevr.','mars','avr.','mai','juin','juil.','aout','sept.','oct.','nov.','dec.'];
function moisFR(ym){
  var m = String(ym).match(/^(\d{4})-(\d{2})$/);
  if(!m) return String(ym);
  return MOIS_COURTS_FR[parseInt(m[2], 10) - 1] + ' ' + m[1];
}

// Conservee pour compatibilite : delegue desormais a dFR()
function dateISOtoFR(iso){
  return dFR(iso);
}

// Trouve l'index (dans WEEKS/SHIFTS de l'annee correspondante) d'une date ISO
function indexPourDate(dateISO){
  var parts = dateISO.split('-');
  var year = parts[0], ddmm = parts[2] + '/' + parts[1];
  var weeks = year==='2027'?WEEKS27:year==='2026'?WEEKS26:WEEKS25;
  if(!weeks) return { idx: -1, year: year };
  var allD = weeks.reduce(function(a,w){ return a.concat(w.d); }, []);
  return { idx: allD.indexOf(ddmm), year: year };
}

// Importe les absences Protime : remplit directement les cases du planning
// (ziek/verlof/recup) et regroupe en periodes pour le tableau ABS (Bradford)
function importerAbsencesProtime(absences){
  var parPersonneType = {}; // "nom|type" -> [dateISO, ...]
  var casesRemplies = 0, nomsNonTrouves = {}, typesInconnus = 0;

  absences.forEach(function(a){
    var nomDashboard = matchNomProtime(a.nom);
    if(!nomDashboard){ nomsNonTrouves[a.nom] = true; return; }
    var type = classifierTypeAbsence(a.titre, a.detail, a.groupe);
    if(!type){ typesInconnus++; return; }

    // Remplir directement la case du planning ce jour-la
    var pos = indexPourDate(a.date);
    if(pos.idx !== -1){
      var shiftsAnnee = pos.year==='2027'?SHIFTS27:pos.year==='2026'?SHIFTS26:SHIFTS25;
      var empShift = shiftsAnnee.find(function(e){ return e.n === nomDashboard; });
      if(empShift){ empShift.s[pos.idx] = type; casesRemplies++; }
    }

    var cle = nomDashboard + '|' + type;
    if(!parPersonneType[cle]) parPersonneType[cle] = [];
    parPersonneType[cle].push(a.date);
  });

  // Regrouper les dates consecutives en periodes pour le tableau ABS
  var nouvellesAbs = [];
  Object.keys(parPersonneType).forEach(function(cle){
    var parts = cle.split('|');
    var nom = parts[0], type = parts[1];
    var dates = parPersonneType[cle].slice().sort();
    var i = 0;
    while(i < dates.length){
      var debut = dates[i];
      var fin = debut;
      while(i + 1 < dates.length){
        var d1 = new Date(fin + 'T00:00:00');
        var d2 = new Date(dates[i+1] + 'T00:00:00');
        if((d2 - d1) / 86400000 <= 3){ fin = dates[i+1]; i++; } // tolere les jours non-travailles entre 2 jours de planning
        else break;
      }
      var nbJours = Math.round((new Date(fin+'T00:00:00') - new Date(debut+'T00:00:00')) / 86400000) + 1;
      nouvellesAbs.push({ n: nom, a: dateISOtoFR(debut), b: dateISOtoFR(fin), d: nbJours, y: debut.slice(0,4), t: type, ts: Date.now() });
      i++;
    }
  });

  // Fusionner avec l'existant : on remplace les periodes qui se recoupent
  // exactement (meme personne+type+debut), on ajoute le reste.
  nouvellesAbs.forEach(function(nouvelle){
    var idxExistant = ABS.findIndex(function(old){ return old.n === nouvelle.n && old.t === nouvelle.t && old.a === nouvelle.a; });
    if(idxExistant !== -1) ABS[idxExistant] = nouvelle;
    else ABS.push(nouvelle);
  });

  return {
    casesRemplies: casesRemplies,
    periodesCreees: nouvellesAbs.length,
    nomsNonTrouves: Object.keys(nomsNonTrouves),
    typesInconnus: typesInconnus
  };
}

function ptKey(nom, date, type, heure){
  return (nom + '_' + date + '_' + type + '_' + heure)
    .replace(/[.#$\/\[\]\s]/g, '-');
}

// Ouvrir le modal d'import
function openImportPointages(){
  document.getElementById('pt-import-txt').value = '';
  document.getElementById('pt-import-err').textContent = '';
  document.getElementById('pt-import-modal').style.display = 'flex';
}

// Importer les données depuis le JSON Protime
function importerPointages(){
  var raw = document.getElementById('pt-import-txt').value.trim();
  var err = document.getElementById('pt-import-err');
  if(!raw){ err.textContent = 'Colle le JSON ici.'; return; }

  var data;
  try { data = JSON.parse(raw); }
  catch(e){ err.textContent = 'JSON invalide : ' + e.message; return; }

  if(!data || (!data.retards && !data.pointages && !data.anomaliesPointage && !data.absences)){
    err.textContent = 'Format non reconnu. Utilise exportEnrichiJSON() dans la console Protime.'; return;
  }

  var ajoutes = 0, doublons = 0;
  var updates = {};

  // Traiter retards
  var retards = data.retards || [];
  retards.forEach(function(a){
    var k = ptKey(a.nom, a.date, 'retard', a.heure);
    if(PT_DATA[k]){ doublons++; return; }
    updates[k] = {
      nom: a.nom, date: a.date, type: 'retard',
      detail: 'Arrivée ' + a.heure + ' (prévu ' + a.heureDebut + ') → ' + a.retardMin + ' min',
      retardMin: a.retardMin, heureDebut: a.heureDebut, heure: a.heure,
      statut: 'open', commentaire: '', ts: Date.now()
    };
    ajoutes++;
  });

  // Traiter anomalies pointage
  var anomalies = data.pointages || data.anomaliesPointage || [];
  anomalies.forEach(function(a){
    var k = ptKey(a.nom, a.date, a.type || 'pointage', a.pointeuse || a.heure);
    if(PT_DATA[k]){ doublons++; return; }
    updates[k] = {
      nom: a.nom, date: a.date, type: 'pointage',
      sousType: a.type || '',
      detail: (a.type || '') + ' : pointeuse ' + (a.pointeuse||'') + ' / tourniquet ' + (a.tourniquet||'') + ' = ' + a.ecart + ' min',
      ecart: a.ecart, heure: a.pointeuse || a.heure,
      statut: 'open', commentaire: '', ts: Date.now()
    };
    ajoutes++;
  });

  // Traiter absences (ziek/verlof/recup) : remplit le planning directement
  var resultatAbsences = null;
  if(data.absences && data.absences.length){
    resultatAbsences = importerAbsencesProtime(data.absences);
  }

  if(!ajoutes && !doublons && !resultatAbsences){
    err.textContent = 'Aucune anomalie ni absence trouvée dans ce JSON.'; return;
  }

  // Sauvegarder dans Firebase
  if(!db){
    err.textContent = 'Connexion Firebase non disponible. Recharge la page et réessaie.';
    return;
  }

  var toutesLesEcritures = Promise.resolve();
  if(Object.keys(updates).length){
    toutesLesEcritures = toutesLesEcritures.then(function(){ return db.ref('pointages').update(updates); });
  }
  if(resultatAbsences){
    var updPlanning = {};
    var d26 = {}; SHIFTS26.forEach(function(e){ d26[e.n] = e.s; });
    var d25 = {}; SHIFTS25.forEach(function(e){ d25[e.n] = e.s; });
    var d27 = {}; SHIFTS27.forEach(function(e){ d27[e.n] = e.s; });
    updPlanning['planning/shifts2026'] = d26;
    updPlanning['planning/shifts2025'] = d25;
    updPlanning['planning/shifts2027'] = d27;
    updPlanning['planning/absences'] = ABS;
    toutesLesEcritures = toutesLesEcritures.then(function(){ return db.ref().update(updPlanning); });
  }

  toutesLesEcritures.then(function(){
    document.getElementById('pt-import-modal').style.display = 'none';
    var msg = ajoutes + ' anomalie(s) importée(s)' + (doublons ? ' · ' + doublons + ' doublon(s) ignoré(s)' : '');
    if(resultatAbsences){
      msg += ' · ' + resultatAbsences.casesRemplies + ' jour(s) d\'absence rempli(s) (' + resultatAbsences.periodesCreees + ' periode(s))';
      if(resultatAbsences.nomsNonTrouves.length){
        console.warn('[Absences Protime] Noms non reconnus (verifie l\'orthographe) :', resultatAbsences.nomsNonTrouves);
        msg += ' · ' + resultatAbsences.nomsNonTrouves.length + ' nom(s) non reconnu(s), voir console';
      }
      if(resultatAbsences.typesInconnus){
        msg += ' · ' + resultatAbsences.typesInconnus + ' type(s) d\'absence non reconnu(s)';
      }
    }
    toast(msg, '#10b981');
  }).catch(function(e){
    console.error('[Pointages] Erreur import Firebase :', e);
    err.textContent = 'Erreur Firebase : ' + e.message;
  });
}

// Construire le tableau pointages
function buildPT2(){
  var tbody = document.getElementById('pt-tbody');
  if(!tbody) return;

  try{
    var filterPerson = document.getElementById('pt-filter-person') ? document.getElementById('pt-filter-person').value : 'all';
    var filterType   = document.getElementById('pt-filter-type')   ? document.getElementById('pt-filter-type').value   : 'all';
    var filterStatus = document.getElementById('pt-filter-status') ? document.getElementById('pt-filter-status').value : 'all';

    // Remplir le filtre personnes
    var selPerson = document.getElementById('pt-filter-person');
    if(selPerson && selPerson.options.length <= 1){
      var noms = [...new Set(Object.values(PT_DATA).map(function(a){return a.nom;}))].sort();
      noms.forEach(function(n){
        var opt = document.createElement('option');
        opt.value = n; opt.textContent = n;
        selPerson.appendChild(opt);
      });
    }

    // Filtrer et trier
    var rows = Object.entries(PT_DATA).filter(function(entry){
      var a = entry[1];
      if(filterPerson !== 'all' && a.nom !== filterPerson) return false;
      if(filterType !== 'all' && a.type !== filterType) return false;
      if(filterStatus !== 'all' && a.statut !== filterStatus) return false;
if(pointageEcartAvantShift(a)) return false;
      return true;
    }).sort(function(a, b){
      // Trier : non traités d'abord, puis par date décroissante
      if(a[1].statut !== b[1].statut) return a[1].statut === 'open' ? -1 : 1;
      return (b[1].date||'').localeCompare(a[1].date||'');
    });

    if(!rows.length){
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--tx3);padding:20px">'+t('pt_empty')+'</td></tr>';
      updPointagesBanner();
      return;
    }

    tbody.innerHTML = rows.map(function(entry){
      var k = entry[0], a = entry[1];
      var isOpen = a.statut === 'open';
      var typeCol = a.type === 'retard' ? '#f59e0b' : '#ef4444';
      var typeLabel = a.type === 'retard' ? t('pt_type_retard') : t('pt_type_tourniquet');
      var statutBadge = isOpen
        ? '<span style="font-size:11px;padding:2px 8px;border-radius:99px;background:#ef444422;color:#ef4444;border:1px solid #ef444455">'+t('pt_status_open')+'</span>'
        : '<span style="font-size:11px;padding:2px 8px;border-radius:99px;background:#10b98122;color:#10b981;border:1px solid #10b98155">'+t('pt_status_done')+'</span>';
      var cmIcon = a.commentaire
        ? '<span style="color:#f59e0b;font-size:14px" title="' + a.commentaire.replace(/"/g,'&quot;') + '">&#9997;</span>'
        : '<span style="color:var(--tx3);font-size:14px">&#9998;</span>';
      // Garde-fou : anomalie pointage matinale (00h-05h59) SANS mention (J+1)
      // = pattern du bug de comparaison avec le tourniquet de la veille sur shift de nuit
      var isSuspect = false;
      if(a.type === 'pointage' && a.heure){
        var hh = parseInt((a.heure+'').split(':')[0], 10);
        if(!isNaN(hh) && hh >= 0 && hh < 6 && a.detail && a.detail.indexOf('(J+1)') === -1){
          isSuspect = true;
        }
      }
      var suspectIcon = isSuspect
        ? '<span style="color:#f59e0b;font-size:13px;margin-left:6px;cursor:help" title="'+t('pt_suspect_tooltip')+'">&#9888;</span>'
        : '';
      return '<tr style="' + (isOpen ? '' : 'opacity:.6') + '">'
        + '<td><b style="font-size:13px">' + a.nom + '</b></td>'
        + '<td style="font-family:var(--mo);font-size:12px">' + dFR(a.date) + '</td>'
        + '<td><span style="font-size:12px;font-weight:600;color:' + typeCol + '">' + typeLabel + '</span></td>'
        + '<td style="font-size:12px;color:var(--tx2)">' + a.detail + suspectIcon + '</td>'
        + '<td>' + statutBadge + '</td>'
        + '<td style="text-align:center"><span style="cursor:pointer" onclick="openPtComment(\'' + k + '\')">' + cmIcon + '</span></td>'
        + '</tr>';
    }).join('');

    updPointagesBanner();
  } catch(e){
    console.error('[Pointages] Erreur de rendu buildPT2 :', e);
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#ef4444;padding:20px">'+t('pt_render_error') + e.message + '</td></tr>';
  }
}

// Bannière alertes non traitées
function updPointagesBanner(){
  var banner = document.getElementById('pt-alerts-banner');
  var text = document.getElementById('pt-alerts-text');
  if(!banner || !text) return;
  var open = Object.values(PT_DATA).filter(function(a){return a.statut === 'open' && !pointageEcartAvantShift(a);});
  var retards = open.filter(function(a){return a.type === 'retard';}).length;
  var ptgs = open.filter(function(a){return a.type === 'pointage';}).length;
  var suspects = open.filter(function(a){
    if(a.type !== 'pointage' || !a.heure) return false;
    var hh = parseInt((a.heure+'').split(':')[0], 10);
    return !isNaN(hh) && hh >= 0 && hh < 6 && a.detail && a.detail.indexOf('(J+1)') === -1;
  }).length;
  if(!open.length){ banner.style.display = 'none'; return; }
  banner.style.display = 'flex';
  var msg = open.length + t('pt_banner_open_suffix');
  if(retards) msg += ' · ' + retards + t('pt_banner_retards');
  if(ptgs) msg += ' · ' + ptgs + t('pt_banner_tourniquet');
  if(suspects) msg += ' · <span style="color:#f59e0b">⚠ ' + suspects + t('pt_banner_suspect') + '</span>';
  text.innerHTML = msg;
}

// Marquer en masse comme traité (respecte les filtres actifs : personne / type)
function markAllPtDone(){
  try{
    console.log('[markAllPtDone] Déclenché. PT_DATA contient', Object.keys(PT_DATA).length, 'entrée(s).');

    var filterPerson = document.getElementById('pt-filter-person') ? document.getElementById('pt-filter-person').value : 'all';
    var filterType   = document.getElementById('pt-filter-type')   ? document.getElementById('pt-filter-type').value   : 'all';

    var toMark = Object.entries(PT_DATA).filter(function(entry){
      var a = entry[1];
      if(a.statut !== 'open') return false;
      if(filterPerson !== 'all' && a.nom !== filterPerson) return false;
      if(filterType !== 'all' && a.type !== filterType) return false;
      return true;
    });

    console.log('[markAllPtDone]', toMark.length, 'anomalie(s) à marquer.');

    if(!toMark.length){
      toast(t('pt_none_open_filtered'), '#f59e0b');
      return;
    }

    var label = (filterPerson !== 'all' ? filterPerson : t('pt_everyone'))
      + (filterType !== 'all' ? ' · ' + (filterType === 'retard' ? t('pt_opt_retards').toLowerCase() : t('pt_opt_anomalies_tourniquet').toLowerCase()) : '');
    var ok = window.confirm(t('pt_confirm_mark1') + toMark.length + t('pt_confirm_mark2') + label + t('pt_confirm_mark3'));
    console.log('[markAllPtDone] confirm() a renvoyé :', ok);
    if(!ok) return;

    var updates = {};
    var now = new Date().toLocaleString('fr-BE');
    var auteur = currentUser ? currentUser.email : '';
    var pushPromises = [];
    toMark.forEach(function(entry){
      var k = entry[0];
      updates['pointages/' + k + '/statut'] = 'done';
      if(!entry[1].commentaire){
        updates['pointages/' + k + '/commentaire'] = 'Traité en masse';
        if(db){
          pushPromises.push(db.ref('pointages/' + k + '/historique').push({
            texte: 'Traité en masse', date: now, auteur: auteur
          }));
        }
      }
    });

    if(!db){
      toast(t('pt_firebase_unavailable'), '#ef4444');
      return;
    }

    Promise.all([db.ref().update(updates)].concat(pushPromises)).then(function(){
      console.log('[markAllPtDone] Mise à jour Firebase réussie.');
      toast(toMark.length + t('pt_marked_done_suffix'), '#10b981');
    }).catch(function(e){
      console.error('[markAllPtDone] Erreur Firebase :', e);
      toast(t('pt_firebase_error_prefix') + e.message, '#ef4444');
    });
  } catch(e){
    console.error('[markAllPtDone] Erreur inattendue :', e);
    toast(t('pt_generic_error_prefix') + e.message, '#ef4444');
  }
}

// Ouvrir popup commentaire pointage
function openPtComment(key){
  var a = PT_DATA[key];
  if(!a) return;
  var hist = a.historique ? Object.keys(a.historique).sort().map(function(k){ return a.historique[k]; }) : [];
  var histHtml = hist.length
    ? hist.slice().reverse().map(function(h){
        return '<div style="padding:8px 10px;background:var(--bg3);border-radius:8px;margin-bottom:6px">'
          + '<div style="font-size:11px;color:var(--tx3);margin-bottom:3px">' + (h.date||'') + (h.auteur?' · '+h.auteur:'') + '</div>'
          + '<div style="font-size:13px;color:var(--tx1);white-space:pre-wrap">' + (h.texte||'').replace(/</g,'&lt;') + '</div>'
          + '</div>';
      }).join('')
    : '<div style="font-size:12px;color:var(--tx3);font-style:italic">Aucun commentaire pour le moment</div>';
  var d = document.createElement('div');
  d.id = 'pt-comment-popup';
  d.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center';
  d.innerHTML = '<div style="background:var(--bg2);border:1px solid var(--bd2);border-radius:12px;padding:24px;width:440px;max-width:95vw;max-height:85vh;display:flex;flex-direction:column">'
    + '<div style="font-weight:700;font-size:15px;margin-bottom:4px">' + a.nom + '</div>'
    + '<div style="font-size:12px;color:var(--tx3);margin-bottom:4px">' + dFR(a.date) + ' — ' + a.detail + '</div>'
    + '<div style="display:flex;gap:8px;margin-bottom:14px">'
    + '<button onclick="setPtStatut(\'' + key + '\',\'open\')" id="btn-open" style="padding:5px 12px;border-radius:var(--r);border:1px solid #ef4444;background:' + (a.statut==='open'?'#ef4444':'none') + ';color:' + (a.statut==='open'?'#fff':'#ef4444') + ';font-family:var(--fn);font-size:12px;cursor:pointer">Non traité</button>'
    + '<button onclick="setPtStatut(\'' + key + '\',\'done\')" id="btn-done" style="padding:5px 12px;border-radius:var(--r);border:1px solid #10b981;background:' + (a.statut==='done'?'#10b981':'none') + ';color:' + (a.statut==='done'?'#fff':'#10b981') + ';font-family:var(--fn);font-size:12px;cursor:pointer">Traité ✓</button>'
    + '</div>'
    + '<div style="font-size:11px;color:var(--tx3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Historique</div>'
    + '<div style="overflow-y:auto;max-height:200px;margin-bottom:14px">' + histHtml + '</div>'
    + '<div style="font-size:11px;color:var(--tx3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Ajouter un commentaire</div>'
    + '<textarea id="pt-cm-txt" placeholder="Ecrire un nouveau commentaire..." style="width:100%;height:70px;background:var(--bg3);border:1px solid var(--bd2);border-radius:8px;color:var(--tx1);font-family:var(--fn);font-size:13px;padding:10px;resize:vertical"></textarea>'
    + '<div style="display:flex;gap:10px;margin-top:14px;justify-content:flex-end">'
    + '<button onclick="document.getElementById(\'pt-comment-popup\').remove()" style="padding:8px 16px;border-radius:var(--r);border:1px solid var(--bd2);background:none;color:var(--tx2);font-family:var(--fn);cursor:pointer">Fermer</button>'
    + '<button onclick="savePtComment(\'' + key + '\')" style="padding:8px 16px;border-radius:var(--r);border:none;background:var(--blue);color:#fff;font-family:var(--fn);font-weight:600;cursor:pointer">Enregistrer</button>'
    + '</div></div>';
  document.body.appendChild(d);
  d.addEventListener('click', function(e){ if(e.target===d) d.remove(); });
  document.getElementById('pt-cm-txt').focus();
}

function setPtStatut(key, statut){
  if(PT_DATA[key]) PT_DATA[key].statut = statut;
  // Mettre à jour les boutons visuellement
  var btnOpen = document.getElementById('btn-open');
  var btnDone = document.getElementById('btn-done');
  if(btnOpen){
    btnOpen.style.background = statut==='open'?'#ef4444':'none';
    btnOpen.style.color = statut==='open'?'#fff':'#ef4444';
  }
  if(btnDone){
    btnDone.style.background = statut==='done'?'#10b981':'none';
    btnDone.style.color = statut==='done'?'#fff':'#10b981';
  }
}

function savePtComment(key){
  var txt = document.getElementById('pt-cm-txt').value.trim();
  var statut = PT_DATA[key] ? PT_DATA[key].statut : 'open';
  var updates = {};
  updates['pointages/' + key + '/statut'] = statut;
  if(!db) return;
  var chain = db.ref().update(updates);
  if(txt){
    var entry = {
      texte: txt,
      date: new Date().toLocaleString('fr-BE'),
      auteur: currentUser ? currentUser.email : ''
    };
    chain = chain.then(function(){
      return db.ref('pointages/' + key + '/historique').push(entry);
    }).then(function(){
      // Garder 'commentaire' à jour avec le dernier texte pour l'aperçu rapide dans le tableau
      return db.ref('pointages/' + key + '/commentaire').set(txt);
    });
  }
  chain.then(function(){
    document.getElementById('pt-comment-popup').remove();
    toast(txt ? 'Commentaire ajouté' : 'Statut mis à jour', '#10b981');
  }).catch(function(e){
    toast('Erreur : ' + e.message, '#ef4444');
  });
}

// ============================================================
// ARRETS INPAK — donnees simples : arrets avec raison + micro-arrets
// venant du script grafana_arrets_inpak.js
// ============================================================

// --- Rotation des equipes AW3 ---
// Semaine (lun-ven) : P1/P2 alternent 05h-13h / 13h-21h selon la parite
// de semaine, P3 fixe la nuit 21h-05h.
// Weekend (sam-dim) : P4/P5 alternent 05h-17h / 17h-05h selon la parite.
function getISOWeek(date){
  var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function equipeSemaine(dateStr, bloc){
  if(bloc === '21h-05h') return 'P3';
  var semaineImpaire = getISOWeek(new Date(dateStr + 'T00:00:00')) % 2 === 1;
  if(bloc === '05h-13h') return semaineImpaire ? 'P1' : 'P2';
  return semaineImpaire ? 'P2' : 'P1'; // bloc 13h-21h
}

function equipeWeekend(dateStr, bloc){
  var semaineImpaire = getISOWeek(new Date(dateStr + 'T00:00:00')) % 2 === 1;
  if(bloc === '05h-17h') return semaineImpaire ? 'P5' : 'P4';
  return semaineImpaire ? 'P4' : 'P5'; // bloc 17h-05h
}

// Renvoie l'equipe (P1 a P5) qui travaillait a une date/heure donnee.
// Lie une ligne d'arret a son groupe de planning (31/32, 33/34, 35/36),
// puis retrouve qui etait affecte a ce groupe ce jour-la — pour repondre
// a "c'est l'arret de qui ?"
function getGroupePourLigne(ligne){
  var l = String(ligne);
  if(l === '31' || l === '32') return '31/32';
  if(l === '33' || l === '34') return '33/34';
  if(l === '35' || l === '36') return '35/36';
  return null;
}

function getOperateur(dateISO, heureISO, ligne){
  var groupe = getGroupePourLigne(ligne);
  if(!groupe) return null;

  // Le weekend, deux equipes (P4/P5) se partagent la meme journee sur
  // 2 blocs (05h-17h / 17h-05h). Cette dashboard ne suit que P5 — si
  // l'heure de l'arret tombe dans le bloc couvert par P4 cette
  // semaine-la, on ne connait pas l'operateur (personne d'autre suivi ici).
  var d = new Date(dateISO + 'T00:00:00');
  var dow = d.getDay();
  var estWeekend = (dow === 0 || dow === 6);
  if(estWeekend && heureISO){
    var equipeArret = getEquipe(dateISO, heureISO);
    if(equipeArret !== 'P5') return null;
  }

  var parts = dateISO.split('-'); // YYYY-MM-DD
  var year = parts[0], mm = parts[1], dd = parts[2];
  var ddmm = dd + '/' + mm;
  var weeks = year==='2027'?WEEKS27:year==='2026'?WEEKS26:WEEKS25;
  var shifts = year==='2027'?SHIFTS27:year==='2026'?SHIFTS26:SHIFTS25;
  if(!weeks || !shifts) return null;
  var allD = weeks.reduce(function(a,w){ return a.concat(w.d); }, []);
  var idx = allD.indexOf(ddmm);
  if(idx === -1) return null;
  var noms = shifts.filter(function(e){ return e.s[idx] === groupe; }).map(function(e){ return e.n; });
  return noms.length ? noms.join(', ') : null;
}

function getEquipe(dateStr, heureStr){
  var d = new Date(dateStr + 'T00:00:00');
  var dow = d.getDay(); // 0=dim,6=sam
  var estWeekend = (dow === 0 || dow === 6);
  var hh = parseInt(heureStr.split(':')[0], 10);

  if(hh >= 5){
    if(estWeekend) return equipeWeekend(dateStr, hh < 17 ? '05h-17h' : '17h-05h');
    if(hh < 13) return equipeSemaine(dateStr, '05h-13h');
    if(hh < 21) return equipeSemaine(dateStr, '13h-21h');
    return equipeSemaine(dateStr, '21h-05h');
  }
  // hh < 5 : appartient a la nuit demarree la veille
  var veille = new Date(d); veille.setDate(veille.getDate() - 1);
  var veilleDow = veille.getDay();
  var veilleStr = veille.toISOString().slice(0,10);
  var veilleEstWeekend = (veilleDow === 0 || veilleDow === 6);
  if(veilleEstWeekend) return equipeWeekend(veilleStr, '17h-05h');
  return equipeSemaine(veilleStr, '21h-05h');
}

var ARRETS_DATA = {};
var _arretsComparOpChart = null;
var ARRETS_LIGNE_FILTRE = 'all';
var ARRETS_EQUIPE_FILTRE = 'all'; // 'all' ou 'P1'..'P5'
var ARRETS_DATE_FILTRE = '';      // '' ou 'YYYY-MM-DD'
var ARRETS_DATE_FIN_FILTRE = '';  // '' ou 'YYYY-MM-DD' (fourchette)
var ARRETS_HEURE_FILTRE = '';     // '' ou 'HH:MM'
var ARRETS_RAISON_FILTRE = 'all'; // 'all' ou une raison precise

function loadArretsInpak(){
  if(!db) return;
  db.ref('arrets_inpak').on('value', function(snap){
    ARRETS_DATA = snap.val() || {};
    buildArretsInpak();
    if(typeof buildComparaisonTab === 'function') buildComparaisonTab();
  }, function(error){
    console.error('[Arrets Inpak] Erreur de lecture Firebase :', error);
  });
}

function openImportArretsModal(){
  document.getElementById('arrets-import-modal').style.display = 'flex';
  document.getElementById('arrets-import-err').textContent = '';
}

function importerArretsInpak(){
  var err = document.getElementById('arrets-import-err');
  err.textContent = '';
  var raw = document.getElementById('arrets-import-txt').value.trim();
  if(!raw){ err.textContent = 'Colle le JSON genere par le script.'; return; }

  var parsed;
  try { parsed = JSON.parse(raw); }
  catch(e){ err.textContent = 'JSON invalide : ' + e.message; return; }

  if(!parsed.avecRaison && !parsed.microstops){
    err.textContent = 'Format inattendu (cles "avecRaison"/"microstops" manquantes).';
    return;
  }

  var now = new Date().toLocaleString('fr-BE');
  var auteur = currentUser ? currentUser.email : '';
  var entries = [];

  (parsed.avecRaison || []).forEach(function(a){
    if(!a.ligne || !a.date || !a.heure) return;
    var key = ptKey('arret-' + a.ligne, a.date, 'raison', a.heure);
    entries.push([key, { ligne: a.ligne, date: a.date, heure: a.heure, raison: a.raison || '', duree: (a.duree != null ? a.duree : null), type: 'avec_raison', auteur: auteur, ts: Date.now(), importeLe: now }]);
  });
  (parsed.microstops || []).forEach(function(a){
    if(!a.ligne || !a.date || a.nombre == null) return;
    var key = ptKey('arret-' + a.ligne, a.date, 'micro', '00-00');
    entries.push([key, { ligne: a.ligne, date: a.date, nombre: a.nombre, type: 'microstop', auteur: auteur, ts: Date.now(), importeLe: now }]);
  });

  if(!entries.length){ err.textContent = 'Aucune ligne valide trouvee dans le JSON.'; return; }
  if(!db){ err.textContent = 'Connexion Firebase non disponible.'; return; }

  var TAILLE_LOT = 100;
  var lots = [];
  for(var i = 0; i < entries.length; i += TAILLE_LOT) lots.push(entries.slice(i, i + TAILLE_LOT));

  err.style.color = '#3b82f6';
  err.textContent = 'Import en cours… 0 / ' + entries.length;
  var fait = 0;

  function envoyerLot(idx){
    if(idx >= lots.length){
      document.getElementById('arrets-import-modal').style.display = 'none';
      document.getElementById('arrets-import-txt').value = '';
      err.style.color = '#ef4444';
      err.textContent = '';
      toast(entries.length + ' arret(s) importe(s)', '#10b981');
      return;
    }
    var updates = {};
    lots[idx].forEach(function(e){ updates['arrets_inpak/' + e[0]] = e[1]; });
    db.ref().update(updates).then(function(){
      fait += lots[idx].length;
      err.textContent = 'Import en cours… ' + fait + ' / ' + entries.length;
      envoyerLot(idx + 1);
    }).catch(function(e){
      if(e.message && e.message.indexOf('WRITE_TOO_BIG') !== -1 && lots[idx].length > 5){
        console.warn('[Arrets Inpak] Lot trop gros, decoupe en deux et reessaie...');
        var moitie = Math.ceil(lots[idx].length / 2);
        var lotA = lots[idx].slice(0, moitie);
        var lotB = lots[idx].slice(moitie);
        lots.splice(idx, 1, lotA, lotB);
        envoyerLot(idx);
        return;
      }
      console.error('[Arrets Inpak] Erreur import lot ' + idx + ' :', e);
      err.style.color = '#ef4444';
      err.textContent = 'Erreur Firebase (lot ' + (idx+1) + '/' + lots.length + ') : ' + e.message;
    });
  }
  envoyerLot(0);
}

function filtrerArretsRaison(){
  ARRETS_RAISON_FILTRE = document.getElementById('arrets-raison-select').value || 'all';
  buildArretsInpak();
  if(typeof buildComparaisonTab === 'function') buildComparaisonTab();
}

var ARRETS_OPERATEURS_FILTRE = {}; // {} = tous, sinon {nom: true, ...} = seulement ceux-la

function toggleArretsOperateur(nom){
  if(nom === 'all'){
    ARRETS_OPERATEURS_FILTRE = {};
  } else {
    if(ARRETS_OPERATEURS_FILTRE[nom]) delete ARRETS_OPERATEURS_FILTRE[nom];
    else ARRETS_OPERATEURS_FILTRE[nom] = true;
  }
  document.querySelectorAll('.arrets-operateur-btn').forEach(function(b){
    var nomBtn = b.dataset.operateur;
    var actif = nomBtn === 'all' ? (Object.keys(ARRETS_OPERATEURS_FILTRE).length === 0) : !!ARRETS_OPERATEURS_FILTRE[nomBtn];
    b.style.background = actif ? 'var(--blue)' : 'none';
    b.style.color = actif ? '#fff' : 'var(--tx2)';
    b.style.borderColor = actif ? 'var(--blue)' : 'var(--bd2)';
  });
  buildArretsInpak();
}

function peuplerOperateursFiltre(){
  var wrap = document.getElementById('arrets-filtre-operateur');
  if(!wrap || wrap.dataset.rempli === LANG) return; // reconstruire seulement si la langue a change
  var operateurs = EMP.filter(function(e){ return e.g === 'INPAK'; }).map(function(e){ return e.n; });
  var html = '<button class="arrets-operateur-btn" data-operateur="all" onclick="toggleArretsOperateur(\'all\')" style="padding:6px 14px;border-radius:99px;border:1px solid var(--blue);background:var(--blue);color:#fff;font-family:var(--fn);font-size:12px;font-weight:600;cursor:pointer">' + t('ncp_tous') + '</button>';
  html += operateurs.map(function(nom){
    return '<button class="arrets-operateur-btn" data-operateur="' + nom.replace(/"/g,'&quot;') + '" onclick="toggleArretsOperateur(\'' + nom.replace(/'/g,"\\'") + '\')" style="padding:6px 14px;border-radius:99px;border:1px solid var(--bd2);background:none;color:var(--tx2);font-family:var(--fn);font-size:12px;cursor:pointer">' + nom + '</button>';
  }).join('');
  wrap.innerHTML = html;
  wrap.dataset.rempli = LANG;
}

function peuplerRaisonsSelect(){
  var sel = document.getElementById('arrets-raison-select');
  if(!sel) return;
  var raisons = {};
  Object.values(ARRETS_DATA).forEach(function(a){
    if(a.type === 'avec_raison' && a.raison) raisons[a.raison] = true;
  });
  var liste = Object.keys(raisons).sort();
  var precedent = sel.value;
  sel.innerHTML = '<option value="all">' + t('arr_all_reasons') + '</option>' + liste.map(function(r){
    return '<option value="' + r.replace(/"/g,'&quot;') + '">' + r + '</option>';
  }).join('');
  if(liste.indexOf(precedent) !== -1) sel.value = precedent;
}

function filtrerArretsLigne(ligne){
  ARRETS_LIGNE_FILTRE = ligne;
  document.querySelectorAll('.arrets-ligne-btn').forEach(function(b){
    var actif = b.dataset.ligne === ligne;
    b.classList.toggle('on', actif);
    b.style.background = actif ? 'var(--blue)' : 'none';
    b.style.color = actif ? '#fff' : 'var(--tx2)';
    b.style.borderColor = actif ? 'var(--blue)' : 'var(--bd2)';
  });
  buildArretsInpak();
  if(typeof buildComparaisonTab === 'function') buildComparaisonTab();
}

var COULEURS_EQUIPE = { P1:'#8b5cf6', P2:'#06b6d4', P3:'#3b82f6', P4:'#f59e0b', P5:'#10b981' };

function filtrerArretsEquipe(equipe){
  ARRETS_EQUIPE_FILTRE = equipe;
  document.querySelectorAll('.arrets-equipe-btn').forEach(function(b){
    var actif = b.dataset.equipe === equipe;
    var coul = COULEURS_EQUIPE[b.dataset.equipe] || 'var(--blue)';
    b.classList.toggle('on', actif);
    b.style.background = actif ? coul : 'none';
    b.style.color = actif ? '#fff' : coul;
    b.style.borderColor = coul;
  });
  buildArretsInpak();
  if(typeof buildComparaisonTab === 'function') buildComparaisonTab();
}

function rechercherArrets(){
  ARRETS_DATE_FILTRE = document.getElementById('arrets-recherche-date').value || '';
  ARRETS_DATE_FIN_FILTRE = document.getElementById('arrets-recherche-date-fin').value || '';
  ARRETS_HEURE_FILTRE = ARRETS_DATE_FIN_FILTRE ? '' : (document.getElementById('arrets-recherche-heure').value || '');
  buildArretsInpak();
  if(typeof buildComparaisonTab === 'function') buildComparaisonTab();
}

function reinitialiserRechercheArrets(){
  document.getElementById('arrets-recherche-date').value = '';
  document.getElementById('arrets-recherche-date-fin').value = '';
  document.getElementById('arrets-recherche-heure').value = '';
  ARRETS_DATE_FILTRE = '';
  ARRETS_DATE_FIN_FILTRE = '';
  ARRETS_HEURE_FILTRE = '';
  buildArretsInpak();
  if(typeof buildComparaisonTab === 'function') buildComparaisonTab();
}

// Renvoie vrai si l'heure (HH:MM) est dans les +/- 30 min de la reference
function dansFenetreHeure(heure, reference){
  var toMin = function(h){ var p = h.split(':'); return parseInt(p[0],10)*60 + parseInt(p[1],10); };
  var diff = Math.abs(toMin(heure) - toMin(reference));
  return diff <= 30;
}

function toggleMicrostopsDetail(){
  var wrap = document.getElementById('arrets-micro-wrap');
  var toggle = document.getElementById('arrets-micro-toggle');
  if(!wrap) return;
  var visible = wrap.style.display !== 'none';
  wrap.style.display = visible ? 'none' : 'block';
  if(toggle) toggle.innerHTML = visible ? '&#9660; '+t('arr_micro_show') : '&#9650; '+t('arr_micro_hide');
}

// Retire les doublons deja presents dans Firebase (crees par l'ancienne
// cle aleatoire). Regroupe par ligne+date+heure(+type), ne garde que la
// version la plus recente (ts le plus grand), supprime le reste.
// Montre les doublons detectes SANS rien supprimer — pour verifier avant
// d'agir, et pour pouvoir envoyer un exemple concret si besoin.
function diagnostiquerDoublonsArrets(){
  var legacy = [];
  Object.keys(ARRETS_DATA).forEach(function(key){
    var a = ARRETS_DATA[key];
    if(a.type === 'microstop' && a.nombre == null) legacy.push({ key: key, a: a });
  });

  var groupes = {};
  Object.keys(ARRETS_DATA).forEach(function(key){
    if(legacy.some(function(l){ return l.key === key; })) return;
    var a = ARRETS_DATA[key];
    var ligneNorm = String(a.ligne || '').trim();
    var dateNorm = String(a.date || '').trim();
    var heureNorm = String(a.heure || '').trim();
    var k = a.type + '|' + ligneNorm + '|' + dateNorm + '|' + heureNorm;
    if(!groupes[k]) groupes[k] = [];
    groupes[k].push({ key: key, a: a });
  });

  var doublons = Object.keys(groupes).filter(function(k){ return groupes[k].length > 1; });

  var wrap = document.getElementById('arrets-diag-wrap');
  if(!wrap) return;

  if(!legacy.length && !doublons.length){
    wrap.innerHTML = '<div style="color:#10b981;font-size:13px;padding:12px">✓ Aucun doublon ni entree obsolete detectee.</div>';
    wrap.style.display = 'block';
    return;
  }

  var html = '<div style="font-size:13px;color:var(--tx2);margin-bottom:10px">'
    + legacy.length + ' entree(s) au format obsolete, ' + doublons.length + ' groupe(s) en double (aperçu des 10 premiers de chaque) :</div>';

  if(legacy.length){
    html += '<div style="font-weight:600;font-size:12px;color:var(--tx1);margin:10px 0 6px">Micro-arrets format obsolete :</div>';
    html += legacy.slice(0, 10).map(function(l){
      return '<div style="font-family:var(--mo);font-size:11px;color:var(--tx3);padding:4px 0;border-bottom:1px solid var(--bd2)">' + JSON.stringify(l.a) + '</div>';
    }).join('');
  }

  if(doublons.length){
    html += '<div style="font-weight:600;font-size:12px;color:var(--tx1);margin:10px 0 6px">Groupes en double :</div>';
    html += doublons.slice(0, 10).map(function(k){
      var entries = groupes[k];
      return '<div style="margin-bottom:8px;padding:8px;background:var(--bg3);border-radius:6px">'
        + '<div style="font-size:11px;color:var(--tx3);margin-bottom:4px">' + entries.length + ' exemplaires — cle: ' + k + '</div>'
        + entries.map(function(e){ return '<div style="font-family:var(--mo);font-size:11px;color:var(--tx2)">' + JSON.stringify(e.a) + '</div>'; }).join('')
        + '</div>';
    }).join('');
  }

  wrap.innerHTML = html;
  wrap.style.display = 'block';
  console.log('[Diagnostic doublons] Format obsolete:', legacy);
  console.log('[Diagnostic doublons] Groupes en double:', doublons.map(function(k){ return { cle: k, entrees: groupes[k] }; }));
}

function nettoyerDoublonsArrets(){
  if(!db){ toast(t('pt_firebase_unavailable'), '#ef4444'); return; }

  var aSupprimer = [];

  // 1. Micro-arrets au format obsolete (avant l'agregation par jour) :
  // ils ont un champ "heure" mais pas de champ "nombre" — reliquats des
  // tout premiers tests, remplaces depuis par le format agrege.
  Object.keys(ARRETS_DATA).forEach(function(key){
    var a = ARRETS_DATA[key];
    if(a.type === 'microstop' && a.nombre == null){
      aSupprimer.push(key);
    }
  });

  // 2. Doublons classiques (meme ligne+date+heure+type, cree par l'ancienne
  // cle aleatoire, ou par de petites variations d'espace/type entre deux
  // imports) — on ignore les entrees deja marquees ci-dessus. Normalisation
  // stricte (trim + casse) pour ne rater aucune variante.
  var groupes = {};
  Object.keys(ARRETS_DATA).forEach(function(key){
    if(aSupprimer.indexOf(key) !== -1) return;
    var a = ARRETS_DATA[key];
    var ligneNorm = String(a.ligne || '').trim();
    var dateNorm = String(a.date || '').trim();
    var heureNorm = String(a.heure || '').trim();
    var k = a.type + '|' + ligneNorm + '|' + dateNorm + '|' + heureNorm;
    if(!groupes[k]) groupes[k] = [];
    groupes[k].push({ key: key, ts: a.ts || 0 });
  });

  Object.keys(groupes).forEach(function(k){
    var entries = groupes[k];
    if(entries.length <= 1) return;
    entries.sort(function(a, b){ return b.ts - a.ts; }); // le plus recent en premier
    for(var i = 1; i < entries.length; i++) aSupprimer.push(entries[i].key);
  });

  if(!aSupprimer.length){ toast(t('arr_toast_no_duplicates'), '#10b981'); return; }
  if(!confirm(t('arr_confirm_delete1') + aSupprimer.length + t('arr_confirm_delete2'))) return;

  var TAILLE_LOT = 100;
  var lots = [];
  for(var i = 0; i < aSupprimer.length; i += TAILLE_LOT) lots.push(aSupprimer.slice(i, i + TAILLE_LOT));

  var fait = 0;
  toast(t('arr_toast_deleting1') + aSupprimer.length + t('arr_toast_deleting2'), '#3b82f6');
  console.log('[Nettoyage doublons] ' + lots.length + ' lot(s) a traiter');

  function envoyerLot(idx){
    if(idx >= lots.length){
      toast(aSupprimer.length + t('arr_toast_deleted_suffix'), '#10b981');
      console.log('[Nettoyage doublons] Termine :', aSupprimer.length, 'doublon(s) supprime(s)');
      return;
    }
    var updates = {};
    lots[idx].forEach(function(key){ updates['arrets_inpak/' + key] = null; });
    db.ref().update(updates).then(function(){
      fait += lots[idx].length;
      console.log('[Nettoyage doublons] ' + fait + ' / ' + aSupprimer.length);
      envoyerLot(idx + 1);
    }).catch(function(e){
      if(e.message && e.message.indexOf('WRITE_TOO_BIG') !== -1 && lots[idx].length > 5){
        console.warn('[Nettoyage doublons] Lot trop gros, decoupe en deux et reessaie...');
        var moitie = Math.ceil(lots[idx].length / 2);
        var lotA = lots[idx].slice(0, moitie);
        var lotB = lots[idx].slice(moitie);
        lots.splice(idx, 1, lotA, lotB);
        envoyerLot(idx);
        return;
      }
      toast(t('arr_toast_error_lot1') + (idx+1) + t('arr_toast_error_lot2') + lots.length + t('arr_toast_error_lot3') + e.message, '#ef4444');
      console.error('[Nettoyage doublons] Erreur lot ' + idx, e);
    });
  }
  envoyerLot(0);
}

// ============================================================
// ONGLET COMPARAISON — equipes (P1-P5) et operateurs, pour une raison
// et une ligne donnees. Etat independant de l'onglet Arrets Inpak.
// ============================================================
var CMP2_LIGNE_FILTRE = 'all';
var CMP2_EQUIPE_OP_FILTRE = 'all';
var _cmp2EquipeChart = null;
var _cmp2EvolutionChart = null;
var _cmp2OperateurChart = null;

function filtrerCmp2Ligne(ligne){
  CMP2_LIGNE_FILTRE = ligne;
  document.querySelectorAll('.cmp2-ligne-btn').forEach(function(b){
    var actif = b.dataset.ligne === ligne;
    b.classList.toggle('on', actif);
    b.style.background = actif ? 'var(--blue)' : 'none';
    b.style.color = actif ? '#fff' : 'var(--tx2)';
    b.style.borderColor = actif ? 'var(--blue)' : 'var(--bd2)';
  });
  buildComparaisonTab();
}

function filtrerCmp2EquipeOp(equipe){
  CMP2_EQUIPE_OP_FILTRE = equipe;
  document.querySelectorAll('.cmp2-equipe-op-btn').forEach(function(b){
    var nomBtn = b.dataset.equipe;
    var coul = nomBtn === 'all' ? 'var(--blue)' : (COULEURS_EQUIPE[nomBtn] || 'var(--blue)');
    var actif = nomBtn === equipe;
    b.classList.toggle('on', actif);
    b.style.background = actif ? coul : 'none';
    b.style.color = actif ? '#fff' : coul;
  });
  buildComparaisonTab();
}

function peuplerCmp2RaisonsSelect(){
  var sel = document.getElementById('cmp2-raison-select');
  if(!sel) return;
  var raisons = {};
  Object.values(ARRETS_DATA).forEach(function(a){
    if(a.type === 'avec_raison' && a.raison) raisons[a.raison] = true;
  });
  var liste = Object.keys(raisons).sort();
  var precedent = sel.value;
  sel.innerHTML = '<option value="all">' + t('arr_all_reasons') + '</option>' + liste.map(function(r){
    return '<option value="' + r.replace(/"/g,'&quot;') + '">' + r + '</option>';
  }).join('');
  if(liste.indexOf(precedent) !== -1) sel.value = precedent;
}

function buildComparaisonTab(){
  var raison = ARRETS_RAISON_FILTRE;
  var dateDebut = ARRETS_DATE_FILTRE;
  var dateFin = ARRETS_DATE_FIN_FILTRE;

  var arrets = Object.values(ARRETS_DATA).filter(function(a){ return a.type === 'avec_raison'; });
  if(ARRETS_LIGNE_FILTRE !== 'all') arrets = arrets.filter(function(a){ return a.ligne === ARRETS_LIGNE_FILTRE; });
  if(ARRETS_EQUIPE_FILTRE !== 'all') arrets = arrets.filter(function(a){ return getEquipe(a.date, a.heure) === ARRETS_EQUIPE_FILTRE; });
  if(raison !== 'all') arrets = arrets.filter(function(a){ return a.raison === raison; });
  if(dateDebut) arrets = arrets.filter(function(a){ return a.date >= dateDebut; });
  if(dateFin) arrets = arrets.filter(function(a){ return a.date <= dateFin; });

var wrapResume = document.getElementById('cmp2-resume-wrap');
  if(wrapResume){
    if(!arrets.length){
      wrapResume.style.display = 'none';
    } else {
      var totalMin = arrets.reduce(function(s, a){ return s + (a.duree || 0); }, 0);
      var h = Math.floor(totalMin / 60), m = totalMin % 60;
      wrapResume.style.display = 'block';
      wrapResume.innerHTML = '<b>' + arrets.length + '</b>' + t('cmp_resume_occ_suffix') + (raison !== 'all' ? t('cmp_resume_of') + raison + '"' : '') + t('cmp_resume_total') + '<b>' + h + 'h' + String(m).padStart(2,'0') + '</b>';
    }
  }

  // --- Evolution mois par mois, une courbe par equipe (P1 a P5) ---
  var ctxEvo = document.getElementById('cmp2EvolutionChart');
  if(ctxEvo && typeof Chart !== 'undefined'){
    // parMoisEquipe[mois][equipe] = {total, n}
    var parMoisEquipe = {};
    var tousLesMois = {};
    arrets.forEach(function(a){
      var mois = a.date.slice(0, 7); // YYYY-MM
      tousLesMois[mois] = true;
      var eq = getEquipe(a.date, a.heure);
      if(!parMoisEquipe[mois]) parMoisEquipe[mois] = {};
      if(!parMoisEquipe[mois][eq]) parMoisEquipe[mois][eq] = { total: 0, n: 0 };
      parMoisEquipe[mois][eq].total += (a.duree || 0);
      parMoisEquipe[mois][eq].n++;
    });
    var moisTries = Object.keys(tousLesMois).sort();
    if(_cmp2EvolutionChart){ _cmp2EvolutionChart.destroy(); _cmp2EvolutionChart = null; }
    if(moisTries.length){
      var labelsMois = moisTries.map(function(m){
        var p = m.split('-');
        var noms = CMP2_MOIS_I18N[LANG]||CMP2_MOIS_I18N.fr;
        return noms[parseInt(p[1],10) - 1] + ' ' + p[0].slice(2);
      });
      var datasets = ['P1','P2','P3','P4','P5'].map(function(eq){
        var data = moisTries.map(function(m){
          var c = parMoisEquipe[m] && parMoisEquipe[m][eq];
          return c ? Math.round(c.total / c.n) : null;
        });
        var occ = moisTries.map(function(m){
          var c = parMoisEquipe[m] && parMoisEquipe[m][eq];
          return c ? c.n : 0;
        });
        return {
          label: eq === 'P5' ? t('arr_p5_moi') : eq,
          data: data,
          borderColor: COULEURS_EQUIPE[eq],
          backgroundColor: COULEURS_EQUIPE[eq],
          fill: false,
          tension: 0.25,
          pointRadius: 4,
          spanGaps: true,
          _occurrences: occ
        };
      });
      _cmp2EvolutionChart = new Chart(ctxEvo, {
        type: 'line',
        data: { labels: labelsMois, datasets: datasets },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: true, labels: { color: '#8b90a4' } },
            tooltip: {
              callbacks: {
                afterLabel: function(c){
                  var occ = c.dataset._occurrences[c.dataIndex];
                  return occ + t('cmp_month_occurrences');
                }
              }
            }
          },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' } },
            y: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' }, title: { display: true, text: 'minutes', color: '#8b90a4' } }
          }
        }
      });
    }
  }

  // --- Comparaison par equipe ---
  var ctxEq = document.getElementById('cmp2EquipeChart');
  if(ctxEq && typeof Chart !== 'undefined'){
    var parEquipe = { P1: {total:0,n:0}, P2: {total:0,n:0}, P3: {total:0,n:0}, P4: {total:0,n:0}, P5: {total:0,n:0} };
    arrets.forEach(function(a){
      var eq = getEquipe(a.date, a.heure);
      if(!parEquipe[eq]) return;
      parEquipe[eq].total += (a.duree || 0);
      parEquipe[eq].n++;
    });
    var equipes = ['P1','P2','P3','P4','P5'].filter(function(e){ return parEquipe[e].n > 0; });
    if(_cmp2EquipeChart){ _cmp2EquipeChart.destroy(); _cmp2EquipeChart = null; }
    if(equipes.length){
      var moyEq = equipes.map(function(e){ return Math.round(parEquipe[e].total / parEquipe[e].n); });
      var nEq = equipes.map(function(e){ return parEquipe[e].n; });
      _cmp2EquipeChart = new Chart(ctxEq, {
        type: 'bar',
        data: { labels: equipes.map(function(e){ return e === 'P5' ? t('arr_p5_moi') : e; }), datasets: [{ data: moyEq, backgroundColor: equipes.map(function(e){ return COULEURS_EQUIPE[e]; }) }] },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { callbacks: { afterLabel: function(c){ return nEq[c.dataIndex] + t('cmp_resume_occ_suffix'); } } } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#8b90a4' } },
            y: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' }, title: { display: true, text: 'minutes', color: '#8b90a4' } }
          }
        }
      });
    }
  }

  // --- Comparaison par operateur, filtree par equipe si choisie ---
  var ctxOp = document.getElementById('cmp2OperateurChart');
  if(ctxOp && typeof Chart !== 'undefined'){
    var arretsOp = arrets;
    if(CMP2_EQUIPE_OP_FILTRE !== 'all'){
      arretsOp = arretsOp.filter(function(a){ return getEquipe(a.date, a.heure) === CMP2_EQUIPE_OP_FILTRE; });
    }
    var parOp2 = {};
    arretsOp.forEach(function(a){
      var op = getOperateur(a.date, a.heure, a.ligne);
      if(!op) return;
      op.split(', ').forEach(function(n){
        if(!parOp2[n]) parOp2[n] = { total: 0, n: 0 };
        parOp2[n].total += (a.duree || 0);
        parOp2[n].n++;
      });
    });
    var noms2 = Object.keys(parOp2).sort(function(x, y){ return (parOp2[y].total/parOp2[y].n) - (parOp2[x].total/parOp2[x].n); });
    if(_cmp2OperateurChart){ _cmp2OperateurChart.destroy(); _cmp2OperateurChart = null; }
    if(noms2.length){
      var moyOp = noms2.map(function(n){ return Math.round(parOp2[n].total / parOp2[n].n); });
      var nOp = noms2.map(function(n){ return parOp2[n].n; });
      _cmp2OperateurChart = new Chart(ctxOp, {
        type: 'bar',
        data: { labels: noms2, datasets: [{ data: moyOp, backgroundColor: '#3b82f6' }] },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { callbacks: { afterLabel: function(c){ return nOp[c.dataIndex] + t('cmp_resume_occ_suffix'); } } } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#8b90a4' } },
            y: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' }, title: { display: true, text: 'minutes', color: '#8b90a4' } }
          }
        }
      });
    }
  }
}

function buildArretsInpak(){
  var tousLesArrets = Object.values(ARRETS_DATA);
  var filtre = ARRETS_LIGNE_FILTRE;
  var arrets = tousLesArrets.filter(function(a){ return filtre === 'all' || a.ligne === filtre; });

  var avecRaison = arrets.filter(function(a){ return a.type === 'avec_raison'; });
  var microstops = arrets.filter(function(a){ return a.type === 'microstop'; });

  // Filtre equipe — uniquement sur "avec raison" (les microstops sont
  // agreges par jour et n'ont pas d'heure precise, donc pas d'equipe possible)
  if(ARRETS_EQUIPE_FILTRE !== 'all'){
    avecRaison = avecRaison.filter(function(a){ return getEquipe(a.date, a.heure) === ARRETS_EQUIPE_FILTRE; });
  }

  // Recherche precise date/heure, ou fourchette de dates
  if(ARRETS_DATE_FILTRE){
    if(ARRETS_DATE_FIN_FILTRE){
      avecRaison = avecRaison.filter(function(a){ return a.date >= ARRETS_DATE_FILTRE && a.date <= ARRETS_DATE_FIN_FILTRE; });
      microstops = microstops.filter(function(a){ return a.date >= ARRETS_DATE_FILTRE && a.date <= ARRETS_DATE_FIN_FILTRE; });
    } else {
      avecRaison = avecRaison.filter(function(a){ return a.date === ARRETS_DATE_FILTRE; });
      microstops = microstops.filter(function(a){ return a.date === ARRETS_DATE_FILTRE; });
      if(ARRETS_HEURE_FILTRE){
        avecRaison = avecRaison.filter(function(a){ return dansFenetreHeure(a.heure, ARRETS_HEURE_FILTRE); });
      }
    }
  }

  peuplerRaisonsSelect();
  peuplerOperateursFiltre();

  // Filtre par raison precise (ex: "combien de temps a pris le grand
  // nettoyage sur toute l'annee ?") — applique AVANT le filtre operateur,
  // pour que la comparaison par operateur montre toujours tout le monde.
  if(ARRETS_RAISON_FILTRE !== 'all'){
    avecRaison = avecRaison.filter(function(a){ return a.raison === ARRETS_RAISON_FILTRE; });
  }

  var wrapRaisonResume = document.getElementById('arrets-raison-resume-wrap');
  if(wrapRaisonResume){
    if(ARRETS_RAISON_FILTRE === 'all'){
      wrapRaisonResume.style.display = 'none';
    } else {
      var totalMin = avecRaison.reduce(function(s, a){ return s + (a.duree || 0); }, 0);
      var h = Math.floor(totalMin / 60), m = totalMin % 60;
      wrapRaisonResume.style.display = 'block';
      wrapRaisonResume.innerHTML = '<b>' + avecRaison.length + '</b> occurrence(s) de "' + ARRETS_RAISON_FILTRE + '" — temps total : <b>' + h + 'h' + String(m).padStart(2,'0') + '</b> (' + totalMin + ' min)';
    }
  }

  // --- Comparaison par operateur (moyenne de duree), pour la raison
  // selectionnee — calculee AVANT le filtre operateur, pour comparer tout
  // le monde meme si un ou plusieurs operateurs sont selectionnes ailleurs.
  var wrapComparOp = document.getElementById('arrets-compar-op-wrap');
  if(wrapComparOp){
    if(ARRETS_RAISON_FILTRE === 'all'){
      wrapComparOp.style.display = 'none';
      if(_arretsComparOpChart){ _arretsComparOpChart.destroy(); _arretsComparOpChart = null; }
    } else {
      var parOp = {};
      avecRaison.forEach(function(a){
        var op = getOperateur(a.date, a.heure, a.ligne) || 'Inconnu';
        op.split(', ').forEach(function(n){
          if(!parOp[n]) parOp[n] = { total: 0, n: 0 };
          parOp[n].total += (a.duree || 0);
          parOp[n].n++;
        });
      });
      var noms = Object.keys(parOp).sort(function(x, y){ return (parOp[y].total/parOp[y].n) - (parOp[x].total/parOp[x].n); });
      if(noms.length && typeof Chart !== 'undefined'){
        wrapComparOp.style.display = 'block';
        var moyennes = noms.map(function(n){ return Math.round(parOp[n].total / parOp[n].n); });
        var occurrences = noms.map(function(n){ return parOp[n].n; });
        var ctx = document.getElementById('arretsComparOpChart');
        if(_arretsComparOpChart) _arretsComparOpChart.destroy();
        _arretsComparOpChart = new Chart(ctx, {
          type: 'bar',
          data: { labels: noms, datasets: [{ label: 'Duree moyenne (min)', data: moyennes, backgroundColor: '#3b82f6' }] },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { callbacks: { afterLabel: function(c){ return occurrences[c.dataIndex] + ' occurrence(s)'; } } }
            },
            scales: {
              x: { grid: { display: false }, ticks: { color: '#8b90a4' } },
              y: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' }, title: { display: true, text: 'minutes', color: '#8b90a4' } }
            }
          }
        });
      } else {
        wrapComparOp.style.display = 'none';
      }
    }
  }

  // Filtre par operateur(s) selectionne(s) — croise avec le planning,
  // applique APRES le calcul de comparaison ci-dessus.
  if(Object.keys(ARRETS_OPERATEURS_FILTRE).length){
    var matchOp = function(a){
      var op = getOperateur(a.date, a.heure, a.ligne);
      if(!op) return false;
      return op.split(', ').some(function(n){ return ARRETS_OPERATEURS_FILTRE[n]; });
    };
    avecRaison = avecRaison.filter(matchOp);
    microstops = microstops.filter(matchOp);
  }

  // --- Resume frequence par ligne ---
  var wrapResume = document.getElementById('arrets-resume-wrap');
  if(wrapResume){
    var parLigne = {};
    tousLesArrets.forEach(function(a){
      if(!parLigne[a.ligne]) parLigne[a.ligne] = { raison: 0, micro: 0 };
      if(a.type === 'avec_raison') parLigne[a.ligne].raison++;
      else parLigne[a.ligne].micro += (a.nombre || 0);
    });
    var lignes = Object.keys(parLigne).sort();
    if(!lignes.length){
      wrapResume.innerHTML = '<div style="color:var(--tx3);font-size:13px;padding:12px">'+t('arr_no_data')+'</div>';
    } else {
      wrapResume.innerHTML = '<table style="width:100%;border-collapse:collapse">'
        + '<thead><tr style="text-align:left;font-size:11px;color:var(--tx3);text-transform:uppercase;letter-spacing:.05em">'
        + '<th style="padding:8px">'+t('arr_col_ligne')+'</th><th style="padding:8px">'+t('arr_col_with_reason')+'</th><th style="padding:8px">'+t('arr_col_micro')+'</th></tr></thead><tbody>'
        + lignes.map(function(l){
            return '<tr><td style="padding:8px;font-weight:600">Line ' + l + '</td>'
              + '<td style="padding:8px;color:#ef4444">' + parLigne[l].raison + '</td>'
              + '<td style="padding:8px;color:#f59e0b">' + parLigne[l].micro + '</td></tr>';
          }).join('')
        + '</tbody></table>';
    }
  }

  // --- Arrets avec raison ---
  var wrapRaison = document.getElementById('arrets-raison-wrap');
  var countRaison = document.getElementById('arrets-raison-count');
  if(countRaison) countRaison.textContent = '(' + avecRaison.length + ')';
  if(wrapRaison){
    avecRaison.sort(function(x, y){ return (y.date + y.heure).localeCompare(x.date + x.heure); });
    if(!avecRaison.length){
      wrapRaison.innerHTML = '<div style="color:var(--tx3);font-size:13px;padding:12px">'+t('arr_none_with_reason')+'</div>';
    } else {
      var LIMITE = 200;
      var tronque = avecRaison.length > LIMITE;
      var affiches = avecRaison.slice(0, LIMITE);
      var html = '<table style="width:100%;border-collapse:collapse">'
        + '<thead><tr style="text-align:left;font-size:11px;color:var(--tx3);text-transform:uppercase;letter-spacing:.05em">'
        + '<th style="padding:8px">'+t('arr_col_date')+'</th><th style="padding:8px">'+t('arr_col_heure')+'</th><th style="padding:8px">'+t('arr_col_duree')+'</th><th style="padding:8px">'+t('arr_col_ligne')+'</th><th style="padding:8px">'+t('ov_kcard_team')+'</th><th style="padding:8px">'+t('col_operator')+'</th><th style="padding:8px">'+t('arr_col_raison')+'</th></tr></thead><tbody>';
      html += affiches.map(function(a){
        var eq = getEquipe(a.date, a.heure);
        var coul = COULEURS_EQUIPE[eq] || 'var(--tx2)';
        var dureeTxt = (a.duree != null) ? a.duree + ' min' : '-';
        var operateur = getOperateur(a.date, a.heure, a.ligne) || '-';
        return '<tr>'
          + '<td style="padding:8px;font-family:var(--mo);font-size:12px">' + dFR(a.date) + '</td>'
          + '<td style="padding:8px;font-family:var(--mo);font-size:12px">' + a.heure + '</td>'
          + '<td style="padding:8px;font-family:var(--mo);font-size:12px;color:var(--tx1)">' + dureeTxt + '</td>'
          + '<td style="padding:8px;font-size:12px;font-weight:600">Line ' + a.ligne + '</td>'
          + '<td style="padding:8px;font-size:12px;font-weight:600;color:' + coul + '">' + eq + '</td>'
          + '<td style="padding:8px;font-size:12px;color:var(--tx1)">' + operateur + '</td>'
          + '<td style="padding:8px;font-size:13px;color:#ef4444">' + a.raison + '</td>'
          + '</tr>';
      }).join('');
      html += '</tbody></table>';
      if(tronque) html += '<div style="text-align:center;color:var(--tx3);padding:10px;font-size:12px">'+t('arr_limited_to1') + LIMITE + t('arr_limited_to2') + avecRaison.length + t('arr_limited_to3')+'</div>';
      wrapRaison.innerHTML = html;
    }
  }

  // --- Micro-arrets ---
  var wrapMicro = document.getElementById('arrets-micro-wrap');
  var countMicro = document.getElementById('arrets-micro-count');
  var totalMicro = microstops.reduce(function(s, a){ return s + (a.nombre || 0); }, 0);
  if(countMicro) countMicro.textContent = '(' + totalMicro + t('arr_micro_count_sep') + microstops.length + t('arr_micro_count_days');
  if(wrapMicro){
    microstops.sort(function(x, y){ return y.date.localeCompare(x.date) || (y.nombre - x.nombre); });
    if(!microstops.length){
      wrapMicro.innerHTML = '<div style="color:var(--tx3);font-size:13px;padding:12px">'+t('arr_micro_none')+'</div>';
    } else {
      var LIMITE2 = 200;
      var tronque2 = microstops.length > LIMITE2;
      var affiches2 = microstops.slice(0, LIMITE2);
      var html2 = '<table style="width:100%;border-collapse:collapse">'
        + '<thead><tr style="text-align:left;font-size:11px;color:var(--tx3);text-transform:uppercase;letter-spacing:.05em">'
        + '<th style="padding:8px">'+t('arr_col_date')+'</th><th style="padding:8px">'+t('arr_col_ligne')+'</th><th style="padding:8px">'+t('arr_micro_col_number')+'</th></tr></thead><tbody>';
      html2 += affiches2.map(function(a){
        return '<tr>'
          + '<td style="padding:8px;font-family:var(--mo);font-size:12px">' + dFR(a.date) + '</td>'
          + '<td style="padding:8px;font-size:12px;font-weight:600">Line ' + a.ligne + '</td>'
          + '<td style="padding:8px;font-size:13px;color:#f59e0b">' + a.nombre + '</td>'
          + '</tr>';
      }).join('');
      html2 += '</tbody></table>';
      if(tronque2) html2 += '<div style="text-align:center;color:var(--tx3);padding:10px;font-size:12px">'+t('arr_limited_days1') + LIMITE2 + t('arr_limited_days2') + microstops.length + t('arr_limited_days3')+'</div>';
      wrapMicro.innerHTML = html2;
    }
  }
}
/* ============================================================
   NCP QUALITE — Inpak + Production, AW1/AW2/AW3
   Donnees preparees hors-ligne (extraction PDF Outlook), importees
   ici en JSON puis stockees dans Firebase sous ncp_data/
============================================================ */

var NCP_DATA = [];
var NCP_FILTRE_UNITE = 'all';
var NCP_FILTRE_DECOTE = false;
var NCP_FILTRE_TYPE = 'all';
var NCP_FILTRE_EQUIPE = 'all';
var NCP_FILTRE_DEBUT = '';
var NCP_FILTRE_FIN = '';
var NCP_PRESET_ACTIF = 'all';
var _ncpEvolutionChart = null, _ncpCausesChart = null, _ncpTonnageChart = null, _ncpLignesChart = null, _ncpProduitsChart = null;

// ============================================================
// MON ESPACE — vue individuelle par employe (pointages, absences,
// NCP le concernant). Un employe normal ne voit que sa propre fiche ;
// seul l'admin peut choisir un autre employe via le selecteur.
// ============================================================
function normNomEspace(s){
  return (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().split(/\s+/).filter(Boolean).sort().join(' ');
}

function monEspaceTrouverEmpActuel(){
  if(!currentUser) return null;
  var myId = Object.keys(ACCOUNTS).find(function(id){ return ACCOUNTS[id] && ACCOUNTS[id].uid === currentUser.uid; });
  return myId ? EMP.find(function(e){ return e.id === myId; }) : null;
}

function monEspaceToggle(hdr){
var wrap2 = hdr.parentElement;
var body = wrap2 ? wrap2.querySelector('.me-body') : null;
var arrow = hdr.querySelector('.me-arrow');
if(!body) return;
var isOpen = body.style.display !== 'none';
body.style.display = isOpen ? 'none' : 'block';
if(arrow) arrow.textContent = isOpen ? '▸' : '▾';
}

function buildMonEspace(){
var wrap = document.getElementById('espace-content');
if(!wrap) return;
var isAdminView = currentUser && currentUser.role === 'admin';
var picker = document.getElementById('espace-picker-wrap');
var emp = null;

if(isAdminView){
if(picker) picker.style.display = 'block';
var sel = document.getElementById('espace-emp-select');
if(sel && sel.dataset.rempli !== LANG){
var options = EMP.filter(function(e){ return e.id; }).slice().sort(function(a,b){ return a.n.localeCompare(b.n); });
sel.innerHTML = '<option value="">' + t('espace_select_placeholder') + '</option>' + options.map(function(e){
return '<option value="'+e.id+'">'+e.n+'</option>';
}).join('');
sel.dataset.rempli = LANG;
}
var chosenId = sel ? sel.value : '';
emp = chosenId ? EMP.find(function(e){ return e.id === chosenId; }) : null;
} else {
if(picker) picker.style.display = 'none';
emp = monEspaceTrouverEmpActuel();
}

if(!emp){
wrap.innerHTML = isAdminView
? '<div class="cc"><div style="padding:20px;color:var(--tx3);text-align:center">' + t('espace_choose_prompt') + '</div></div>'
: '<div class="cc"><div style="padding:20px;color:var(--tx3);text-align:center">' + t('espace_no_fiche') + '</div></div>';
return;
}

var cible = normNomEspace(emp.n);

var ptEntries = Object.values(PT_DATA || {}).filter(function(a){ return normNomEspace(a.nom) === cible; });
ptEntries.sort(function(a,b){ return (b.date+(b.heure||'')).localeCompare(a.date+(a.heure||'')); });
var retards = ptEntries.filter(function(a){ return a.type === 'retard'; });
var ecarts = ptEntries.filter(function(a){ return a.type === 'pointage' && a.ecart && !pointageEcartAvantShift(a); });

var absEntries = Object.values(ABS || {}).filter(function(a){ return normNomEspace(a.n) === cible; });
absEntries.sort(function(a,b){
function keyAbs(x){ var p=(x.a||'').split('/'); return p.length===3 ? p[2]+p[1]+p[0] : (x.a||''); }
return keyAbs(b).localeCompare(keyAbs(a));
});

var ncpEntries = Object.values(NCP_DATA || {}).filter(function(n){
if(n.type_ncp !== 'Inpak' || !n.ligne) return false;
var ligneNum = String(n.ligne).replace(/^L0*/,'').replace(/^L/,'');
if(typeof getOperateur !== 'function') return false;
var op = getOperateur(n.date_fichier, n.created_heure, ligneNum);
if(!op) return false;
return op.split(', ').indexOf(emp.n) !== -1;
});
ncpEntries.sort(function(a,b){ return (b.date_fichier+(b.created_heure||'')).localeCompare(a.date_fichier+(a.created_heure||'')); });
var ncpDirectCount = ncpEntries.filter(function(n){ return typeof ncpHorsShift!=='function' || !ncpHorsShift(n); }).length;

var todayEspace = new Date(); todayEspace.setHours(0,0,0,0);
var formEntries = (typeof FORMATIONS !== 'undefined' ? FORMATIONS : []).filter(function(f){
var emps = f.employes || [];
if(!emps.length) return true;
return emps.some(function(idOrName){ return idOrName === emp.id || normNomEspace(idOrName) === cible; });
});
var formAvenir = formEntries.filter(function(f){ return new Date(f.date+'T00:00:00') >= todayEspace; });
var formPassees = formEntries.filter(function(f){ return new Date(f.date+'T00:00:00') < todayEspace; });
formAvenir.sort(function(a,b){ return (a.date+(a.heureDebut||'')).localeCompare(b.date+(b.heureDebut||'')); });
formPassees.sort(function(a,b){ return (b.date+(b.heureDebut||'')).localeCompare(a.date+(a.heureDebut||'')); });
var formSorted = formAvenir.concat(formPassees);

var bd = (typeof BD !== 'undefined' ? BD : []).find(function(b){ return normNomEspace(b.n) === cible; });

var TYPE_ABS_LABEL = {recup:t('espace_type_recup'), ziek:t('espace_type_ziek'), verlof:t('espace_type_verlof')};
var TYPE_ABS_PILL = {recup:'ok', ziek:'cr', verlof:'wn'};

var titreHtml = isAdminView ? '<div style="margin-bottom:16px;font-size:13px;color:var(--tx2)">' + t('espace_of') + ' <b>'+emp.n+'</b></div>' : '';

var html = titreHtml;

var initiales = emp.n.split(' ').map(function(w){ return w[0]||''; }).join('').slice(0,2).toUpperCase();
var scoreVal = bd ? bd.sc : 0;
var scCoul = typeof scColor==='function' ? scColor(scoreVal) : '#10b981';
var scInfo = typeof scSt==='function' ? scSt(scoreVal) : {l:'OK', c:'ok'};
var msgPositif = scoreVal<=50 ? t('espace_msg_ok') : scoreVal<=200 ? t('espace_msg_wn') : scoreVal<=500 ? t('espace_msg_al') : t('espace_msg_cr');
var tendanceHtml = '';
if(bd && bd.T && bd.T.length===4){
var recentT = bd.T[2]+bd.T[3], ancienT = bd.T[0]+bd.T[1];
if(recentT < ancienT) tendanceHtml = '<span class="pill ok" style="margin-left:8px">' + t('espace_trend_down') + '</span>';
else if(recentT > ancienT) tendanceHtml = '<span class="pill wn" style="margin-left:8px">' + t('espace_trend_up') + '</span>';
else tendanceHtml = '<span class="pill" style="margin-left:8px;background:var(--bg3);color:var(--tx2)">' + t('espace_trend_stable') + '</span>';
}

html += '<div class="cc" style="margin-bottom:16px;background:linear-gradient(135deg,var(--bg3),var(--bg2))">'
+ '<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">'
+ '<div style="width:52px;height:52px;border-radius:50%;background:var(--blue);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:#fff;flex:none">'+initiales+'</div>'
+ '<div style="flex:1;min-width:200px">'
+ '<div style="font-size:17px;font-weight:700">'+emp.n+'</div>'
+ '<div style="font-size:12px;color:var(--tx2);margin-top:3px">'+msgPositif+'</div>'
+ '</div>'
+ '<div style="text-align:center">'
+ '<div style="font-size:11px;color:var(--tx3);margin-bottom:4px">' + t('espace_score_bradford') + '</div>'
+ '<div style="font-size:24px;font-weight:700;color:'+scCoul+'">'+scoreVal+'</div>'
+ '<span class="pill '+scInfo.c+'">'+scInfo.l+'</span>'+tendanceHtml
+ '</div>'
+ '</div>'
+ (bd ? '<div style="display:flex;gap:24px;margin-top:14px;padding-top:14px;border-top:1px solid var(--bd)">'
+ '<div><div style="font-size:18px;font-weight:700">'+bd.D+'</div><div style="font-size:11px;color:var(--tx3)">' + t('espace_days_absence') + '</div></div>'
+ '<div><div style="font-size:18px;font-weight:700">'+bd.S+'</div><div style="font-size:11px;color:var(--tx3)">' + t('espace_periods') + '</div></div>'
+ '</div>' : '')
+ '</div>';

function meSection(icon, titre, count, bodyHtml){
return '<div class="cc" style="margin-bottom:16px">'
+ '<div class="cch" style="cursor:pointer" onclick="monEspaceToggle(this)"><div class="cct" style="display:flex;align-items:center;justify-content:space-between"><span>'+icon+' '+titre+' (' + count + ')</span><span class="me-arrow" style="color:var(--tx3);font-size:12px">▸</span></div></div>'
+ '<div class="me-body" style="display:none;margin-top:10px">' + bodyHtml + '</div>'
+ '</div>';
}

var formBody;
if(!formSorted.length){
formBody = '<div style="color:var(--tx3);font-size:13px;padding:8px 0">' + t('espace_no_formation') + '</div>';
} else {
formBody = formSorted.slice(0,100).map(function(f){
var estAvenir = new Date(f.date+'T00:00:00') >= todayEspace;
var badge = estAvenir ? '<span class="pill ok">' + t('espace_form_upcoming') + '</span>' : '<span style="font-size:11px;color:var(--tx3)">' + t('espace_form_past') + '</span>';
return '<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;background:var(--bg3);margin-bottom:6px;flex-wrap:wrap">'
+ '<div style="font-family:var(--mo);font-size:12px;color:var(--tx2);white-space:nowrap">'+dFR(f.date)+'</div>'
+ '<div style="font-size:13px;color:var(--tx1);flex:1;min-width:120px"><b>'+(f.titre||t('espace_sec_formations'))+'</b>'+(f.heureDebut?' · '+f.heureDebut+(f.heureFin?'-'+f.heureFin:''):'')+(f.lieu?' · '+f.lieu:'')+'</div>'
+ badge
+ '</div>';
}).join('');
}
html += meSection('🎓', t('espace_sec_formations'), formSorted.length, formBody);

var retardsBody;
if(!retards.length){
retardsBody = '<div style="color:var(--green);font-size:13px;padding:8px 0">' + t('espace_no_retard') + '</div>';
} else {
retardsBody = retards.slice(0,100).map(function(a){
return '<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;background:var(--bg3);margin-bottom:6px;flex-wrap:wrap">'
+ '<div style="font-family:var(--mo);font-size:12px;color:var(--tx2);white-space:nowrap">'+dFR(a.date)+'</div>'
+ '<span class="pill cr">'+(a.detail||((a.retardMin||0)+' min'))+'</span>'
+ '</div>';
}).join('');
}
html += meSection('🕐', t('espace_sec_retards'), retards.length, retardsBody);

var ecartsBody;
if(!ecarts.length){
ecartsBody = '<div style="color:var(--green);font-size:13px;padding:8px 0">' + t('espace_no_ecart') + '</div>';
} else {
ecartsBody = ecarts.slice(0,100).map(function(a){
return '<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;background:var(--bg3);margin-bottom:6px;flex-wrap:wrap">'
+ '<div style="font-family:var(--mo);font-size:12px;color:var(--tx2);white-space:nowrap">'+dFR(a.date)+'</div>'
+ '<div style="font-size:13px;color:var(--tx1)">'+(a.detail||((a.ecart||0)+' min'))+'</div>'
+ '</div>';
}).join('');
}
html += meSection('⏱️', t('espace_sec_ecarts'), ecarts.length, ecartsBody);

var absBody;
if(!absEntries.length){
absBody = '<div style="color:var(--green);font-size:13px;padding:8px 0">' + t('espace_no_absence') + '</div>';
} else {
absBody = absEntries.slice(0,100).map(function(a){
var lbl = TYPE_ABS_LABEL[a.t] || a.t;
var pillCls = TYPE_ABS_PILL[a.t] || 'wn';
return '<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;background:var(--bg3);margin-bottom:6px;flex-wrap:wrap">'
+ '<div style="font-family:var(--mo);font-size:12px;color:var(--tx2);white-space:nowrap">'+a.a+(a.b && a.b!==a.a ? ' au '+a.b : '')+'</div>'
+ '<span class="pill '+pillCls+'">'+lbl+'</span>'
+ '<div style="margin-left:auto;font-size:11px;color:var(--tx3)">'+(a.d||'')+' ' + t('espace_days_suffix') + '</div>'
+ '</div>';
}).join('');
}
html += meSection('🏥', t('espace_sec_absences'), absEntries.length, absBody);

var ncpBody;
var ncpNote = '<div style="font-size:11px;color:var(--tx3);margin-bottom:10px">' + t('espace_ncp_note') + '</div>';
if(!ncpEntries.length){
ncpBody = ncpNote + '<div style="color:var(--green);font-size:13px;padding:8px 0">' + t('espace_no_ncp') + '</div>';
} else {
var ncpBanniere = ncpDirectCount > 0
? '<div style="background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.25);border-radius:8px;padding:8px 12px;margin-bottom:10px;font-size:12px;color:var(--green)">' + t('espace_ncp_banner').replace('{n}', ncpDirectCount).replace('{total}', ncpEntries.length) + '</div>'
: '';
var ncpRows = ncpEntries.slice(0,100).map(function(n){
var direct = typeof ncpHorsShift!=='function' || !ncpHorsShift(n);
var badge = direct
? '<span class="pill ok">' + t('espace_ncp_direct') + '</span>'
: '<span class="pill" style="background:rgba(59,130,246,.12);color:var(--blue)">' + t('espace_ncp_late') + '</span>';
return '<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;background:var(--bg3);margin-bottom:6px;flex-wrap:wrap">'
+ '<div style="font-family:var(--mo);font-size:12px;color:var(--tx2);white-space:nowrap">'+dFR(n.date_fichier)+' '+(n.created_heure||'')+'</div>'
+ '<div style="font-size:12px;font-weight:600">'+(n.ligne||'-')+'</div>'
+ '<div style="font-size:13px;color:var(--tx1);flex:1;min-width:120px">'+(n.description||n.code_produit||'-')+'</div>'
+ badge
+ '</div>';
}).join('');
ncpBody = ncpNote + ncpBanniere + ncpRows;
}
html += meSection('🔧', t('espace_sec_ncp'), ncpEntries.length, ncpBody);

wrap.innerHTML = html;
}
function loadNCPData(){
  if(!db) return;
  db.ref('ncp_data').on('value', function(snap){
    var data = snap.val() || {};
    NCP_DATA = Object.keys(data).map(function(k){ return data[k]; }); NCP_DATA.forEach(function(r){ var p = String(r.created_on || '').split('/'); var iso = (p.length === 3) ? (p[2] + '-' + ('0' + p[1]).slice(-2) + '-' + ('0' + p[0]).slice(-2)) : null; r.date_fichier = r.created_date_iso || null; r.heure_fiable = !!(iso && iso === r.date_fichier); if(iso) r.created_date_iso = iso; var VL = (r.unite === 'AW1') ? [1,2,3,4,5,6,7,8,9,10,11,12] : (r.unite === 'AW2') ? [21,22,23,24,25,26] : (r.unite === 'AW3') ? [31,32,33,34,35,36] : [1,2,3,4,5,6,7,8,9,10,11,12,21,22,23,24,25,26,31,32,33,34,35,36]; var nl = null; if(r.ligne){ var mn = /(\d{1,3})/.exec(String(r.ligne)); if(mn && VL.indexOf(parseInt(mn[1],10)) !== -1){ nl = parseInt(mn[1],10); } } if(nl === null){ var rex = /\b(?:L|G|LIGNE|LIJN|LINE)\s*\.?\s*0?(\d{1,2})\b/gi, mx; while((mx = rex.exec(String(r.description || ''))) !== null){ var vv = parseInt(mx[1],10); if(VL.indexOf(vv) !== -1){ nl = vv; r.ligne_source = 'texte_description'; break; } } } if(nl !== null){ r.ligne = 'L' + ('0' + nl).slice(-2); r.ligne_type = (r.type_ncp === 'Production') ? 'unite_production' : 'cause_directe'; } else { r.ligne = null; r.ligne_source = null; r.ligne_type = null; } r.lignes_multiples = ncpLignesCitees(r); }); NCP_DATA = ncpEclaterLignes(NCP_DATA);
    buildNCPTab();
  }, function(error){
    console.warn('[NCP] Erreur chargement:', error);
  });
}

function ncpLignesValides(u){ if(u === 'AW1') return [1,2,3,4,5,6,7,8,9,10,11,12]; if(u === 'AW2') return [21,22,23,24,25,26]; if(u === 'AW3') return [31,32,33,34,35,36]; return [1,2,3,4,5,6,7,8,9,10,11,12,21,22,23,24,25,26,31,32,33,34,35,36]; } function ncpLignesCitees(r){ if(r.type_ncp === 'Production') return []; var V = ncpLignesValides(r.unite || ''); var rex = /\b(?:L|G|LIGNE|LIJN|LINE)\s*\.?\s*0?(\d{1,2})\b/gi, m, vus = []; while((m = rex.exec(String(r.description || ''))) !== null){ var v = parseInt(m[1],10); if(V.indexOf(v) !== -1 && vus.indexOf(v) === -1) vus.push(v); } return vus.map(function(v){ return 'L' + ('0' + v).slice(-2); }); } function ncpEclaterLignes(list){ var out = []; list.forEach(function(r){ var lg = r.lignes_multiples || []; if(lg.length < 2){ out.push(r); return; } lg.forEach(function(l){ var c = {}; for(var k in r){ c[k] = r[k]; } c.ligne = l; c.ligne_type = 'cause_directe'; c.ligne_source = 'multi_lignes'; c.ncp_partage = lg.length; c.total_pallets = (Number(r.total_pallets) || 0) / lg.length; c.total_tonnes = (Number(r.total_tonnes) || 0) / lg.length; c.total_kg = (Number(r.total_kg) || 0) / lg.length; out.push(c); }); }); return out; } var NCP_VUE = []; function ncpNomCle(w){ return String(w||'').trim().toLowerCase().replace(/\s+/g,' '); } function ncpNomAff(w){ return ncpNomCle(w).replace(/(^|[- ])([a-zà-ÿ])/g, function(m,a,b){ return a + b.toUpperCase(); }); } function closeNCPList(){ var m = document.getElementById('ncp-list-modal'); if(m) m.style.display = 'none'; } function ncpRendreListe(titre, rows){ var h = ''; if(!rows.length){ h = '<div style="font-size:12px;color:var(--tx3)">Aucun NCP</div>'; } else { h = '<table class="bt" style="width:100%"><thead><tr><th>Numero</th><th>Date</th><th>Unite</th><th>Ligne</th><th>Type</th><th>Declarant</th><th>Client</th><th>Palettes</th><th>Tonnage</th><th>Description</th></tr></thead><tbody>'; rows.forEach(function(r){ h += '<tr style="cursor:pointer" onclick="ncpDetail(\'' + r.notification + '\')"><td style="color:#fff;font-weight:600">' + ncpEsc(r.notification) + '</td><td>' + ncpEsc(r.created_on || r.created_date_iso || '-') + '</td><td>' + ncpEsc(r.unite || '-') + '</td><td>' + ncpEsc(r.ligne || '-') + '</td><td>' + ncpEsc(r.type_ncp || '-') + '</td><td>' + ncpEsc(ncpNomAff(r.reporter)) + '</td><td>' + ncpEsc(r.famille_produit || '-') + '</td><td>' + (Number(r.total_pallets) || 0).toFixed(1) + '</td><td>' + (Number(r.total_tonnes) || 0).toFixed(2) + '</td><td style="max-width:320px;font-size:11px;color:var(--tx3)">' + ncpEsc(String(r.description || '').slice(0, 110)) + '</td></tr>'; }); h += '</tbody></table>'; } var tEl = document.getElementById('ncp-list-title'); if(tEl) tEl.textContent = titre + ' (' + rows.length + ')'; var bEl = document.getElementById('ncp-list-body'); if(bEl) bEl.innerHTML = h; var mEl = document.getElementById('ncp-list-modal'); if(mEl) mEl.style.display = 'flex'; } function ncpListeDeclarant(cle){ var rows = (NCP_VUE || []).filter(function(r){ return ncpNomCle(r.reporter) === cle; }); ncpRendreListe('NCP declares par ' + ncpNomAff(cle), rows); } function ncpKpiListe(k){ var rows = (NCP_VUE || []).slice(); var t = 'Total NCP'; if(k === 'inpak'){ rows = rows.filter(function(r){ return r.type_ncp === 'Inpak'; }); t = 'NCP Inpak'; } else if(k === 'prod'){ rows = rows.filter(function(r){ return r.type_ncp === 'Production'; }); t = 'NCP Production'; } else if(k === 'nonclasse'){ rows = rows.filter(ncpEstNonClasse); t = 'NCP non classes'; } else if(k === 'tonnes'){ rows = rows.filter(function(r){ return (Number(r.total_tonnes) || 0) > 0; }).sort(function(a, b){ return (Number(b.total_tonnes) || 0) - (Number(a.total_tonnes) || 0); }); t = 'NCP avec tonnage bloque'; } else if(k === 'debloque'){
    rows = rows.filter(ncpEstDebloquee).sort(function(x, y){
      return (Number(y.total_tonnes) || 0) - (Number(x.total_tonnes) || 0);
    });
    t = 'NCP debloques (liberes par la qualite)';
  } ncpRendreListe(t, rows); } function ncpBindKpi(){ var p = [['ncp-k-total','total'],['ncp-k-inpak','inpak'],['ncp-k-prod','prod'],
         ['ncp-k-tonnes','tonnes'],['ncp-k-debloque','debloque']]; p.forEach(function(x){ var el = document.getElementById(x[0]); var c = el ? el.parentNode : null; if(!c || c.getAttribute('data-kpibound')) return; c.setAttribute('data-kpibound','1'); c.style.cursor = 'pointer'; c.title = 'Cliquer pour voir les NCP concernes'; c.addEventListener('click', function(){ ncpKpiListe(x[1]); }); }); } function ncpBuildDeclarants(rows){ ncpBindKpi(); var box = document.getElementById('ncp-declarants'); if(!box) return; var m = {}; rows.forEach(function(r){ if(!ncpEstNonClasse(r)) return; var k = ncpNomCle(r.reporter); if(!m[k]) m[k] = { n: 0, t: 0, u: {}, sem: 0, we: 0 }; m[k].n++; m[k].t += (Number(r.total_tonnes) || 0); if(r.unite) m[k].u[r.unite] = 1; if(r.created_date_iso){ var j = new Date(r.created_date_iso + 'T12:00:00').getDay(); if(j === 0 || j === 6) m[k].we++; else m[k].sem++; } }); var a = Object.keys(m).map(function(k){ return [k, m[k]]; }).sort(function(x, y){ return y[1].n - x[1].n; }); var tot = 0; a.forEach(function(x){ tot += x[1].n; }); var cnt = document.getElementById('ncp-decl-count'); var rat = 0; rows.forEach(function(r){ if(ncpEstNonClasse(r) && ncpBakorderLien(r)) rat++; }); if(cnt) cnt.textContent = '(' + a.length + ' personnes, ' + tot + ' NCP, dont ' + rat + ' rattachables a une equipe via un bakorder partage)'; if(!a.length){ box.innerHTML = '<div style="font-size:12px;color:var(--tx3)">Aucun NCP non classe sur cette periode.</div>'; return; } var h = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:8px">'; a.forEach(function(x){ var v = x[1]; var un = Object.keys(v.u).sort().join(' '); h += '<div onclick="ncpListeDeclarant(\'' + x[0] + '\')" style="cursor:pointer;border:1px solid var(--bd);border-radius:10px;padding:10px 12px;display:flex;align-items:center;justify-content:space-between;gap:10px"><div><div style="font-size:13px;font-weight:600;color:#fff">' + ncpEsc(ncpNomAff(x[0])) + '</div><div style="font-size:10px;color:var(--tx3);margin-top:3px">' + (un || 'unite inconnue') + ' - ' + v.t.toFixed(1) + ' t - semaine ' + v.sem + ' / weekend ' + v.we + '</div></div><div style="font-size:18px;font-weight:700;color:#a78bfa">' + v.n + '</div></div>'; }); h += '</div>'; box.innerHTML = h; } function ncpEstNonClasse(r){ var w = String(r.reporter || ''); return !!w && !/INPAK_WB|PLOEGCH_WB|AW_EXP/i.test(w); } // Operateur(s) INPAK affecte(s) a la ligne au moment du NCP -- reutilise
// la meme logique que les Arrets Inpak (SHIFTS + groupes de lignes).
// Uniquement pertinent pour les NCP de type "Inpak" (lignes 31 a 36).
function ncpOperateurs(r){
  if(r.type_ncp !== 'Inpak') return null;
  var _hi = ncpHeureInfo(r);
  if(!_hi.heure) return null;
  var dateISO = _hi.date_iso || r.created_date_iso;
  if(!dateISO) return null;
  var ligneNum = String(r.ligne || '').replace(/[^0-9]/g, '');
  if(!ligneNum) return null;
  return getOperateur(dateISO, _hi.heure, ligneNum);
}
function ncpEsc(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function ncpToggleDeCote(notif){
  if(!db){ toast('Connexion Firebase non disponible', '#ef4444'); return; }
  var r = NCP_DATA.find(function(x){ return String(x.notification) === String(notif); });
  if(!r) return;
  var nouveauEtat = !r.de_cote;
  db.ref('ncp_data/' + notif + '/de_cote').set(nouveauEtat || null).then(function(){
    r.de_cote = nouveauEtat;
    toast(nouveauEtat ? 'Mis de cote' : 'Retire des mis de cote', '#3b82f6');
    ncpDetail(notif);
    if(document.getElementById('ncp-tbody')) buildNCPTab();
  }).catch(function(e){ toast('Erreur : ' + e.message, '#ef4444'); });
}

function ncpOpenComment(notif){
  var r = NCP_DATA.find(function(x){ return String(x.notification) === String(notif); });
  if(!r) return;
  var prev = r.commentaire_perso || '';
  var d = document.createElement('div');
  d.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:99999;display:flex;align-items:center;justify-content:center';
  d.id = 'ncp-cm-popup';
  d.innerHTML = '<div style="background:var(--bg2);border:1px solid var(--bd2);border-radius:12px;padding:24px;width:420px;max-width:95vw">'
    + '<div style="font-weight:700;font-size:15px;margin-bottom:4px">Note perso &mdash; NCP ' + ncpEsc(notif) + '</div>'
    + (r.commentaire_date ? '<div style="font-size:11px;color:var(--tx3);margin-bottom:12px">Derniere modif : ' + ncpEsc(r.commentaire_date) + (r.commentaire_par ? ' par ' + ncpEsc(r.commentaire_par) : '') + '</div>' : '<div style="margin-bottom:12px"></div>')
    + '<textarea id="ncp-cm-txt" style="width:100%;height:110px;background:var(--bg3);border:1px solid var(--bd2);border-radius:8px;color:var(--tx1);font-family:var(--fn);font-size:13px;padding:10px;resize:vertical">' + ncpEsc(prev) + '</textarea>'
    + '<div style="display:flex;gap:10px;margin-top:14px;justify-content:flex-end">'
    + '<button onclick="document.getElementById(\'ncp-cm-popup\').remove()" style="padding:8px 16px;border-radius:var(--r);border:1px solid var(--bd2);background:none;color:var(--tx2);font-family:var(--fn);cursor:pointer">Annuler</button>'
    + '<button onclick="ncpSaveComment(\'' + notif + '\')" style="padding:8px 16px;border-radius:var(--r);border:none;background:var(--blue);color:#fff;font-family:var(--fn);font-weight:600;cursor:pointer">Enregistrer</button>'
    + '</div></div>';
  document.body.appendChild(d);
  d.addEventListener('click', function(e){ if(e.target === d) d.remove(); });
  document.getElementById('ncp-cm-txt').focus();
}

function ncpSaveComment(notif){
  if(!db){ toast('Connexion Firebase non disponible', '#ef4444'); return; }
  var txt = document.getElementById('ncp-cm-txt').value.trim();
  var r = NCP_DATA.find(function(x){ return String(x.notification) === String(notif); });
  var qui = currentUser ? (currentUser.name || currentUser.email || '?') : '?';
  var quand = new Date().toLocaleDateString('fr-BE');
  var maj = txt
    ? { commentaire_perso: txt, commentaire_par: qui, commentaire_date: quand }
    : { commentaire_perso: null, commentaire_par: null, commentaire_date: null };
  db.ref('ncp_data/' + notif).update(maj).then(function(){
    if(r){ r.commentaire_perso = maj.commentaire_perso; r.commentaire_par = maj.commentaire_par; r.commentaire_date = maj.commentaire_date; }
    var p = document.getElementById('ncp-cm-popup'); if(p) p.remove();
    toast(txt ? 'Commentaire enregistre' : 'Commentaire supprime', '#10b981');
    ncpDetail(notif);
  }).catch(function(e){ toast('Erreur : ' + e.message, '#ef4444'); });
}
function ncpToggleControle(notif){
  if(!db){ toast('Connexion Firebase non disponible', '#ef4444'); return; }
  var r = NCP_DATA.find(function(x){ return String(x.notification) === String(notif); });
  if(!r) return;
  var nouveauEtat = !r.controle_perso;
  var chemin = 'ncp_data/' + notif;
  var qui = currentUser ? (currentUser.name || currentUser.email || '?') : '?';
  var quand = new Date().toLocaleDateString('fr-BE');
  var maj = nouveauEtat
    ? { controle_perso: true, controle_par: qui, controle_date: quand }
    : { controle_perso: null, controle_par: null, controle_date: null };
  db.ref(chemin).update(maj).then(function(){
    r.controle_perso = nouveauEtat; r.controle_par = maj.controle_par; r.controle_date = maj.controle_date;
    toast(nouveauEtat ? 'Marque comme controle' : 'Controle retire', '#10b981');
    ncpDetail(notif);
  }).catch(function(e){ toast('Erreur : ' + e.message, '#ef4444'); });
}

// Traduction a la demande (bouton) via l'API gratuite MyMemory (pas de cle,
// limite ~500 caracteres par requete, ~5000 caract/jour en anonyme -- largement
// suffisant pour un usage manuel fiche par fiche).
function ncpTraduireTexte(txt){
  if(!txt || !txt.trim()) return Promise.resolve(txt);
  var morceaux = [];
  var reste = txt;
  while(reste.length > 480){
    var coupe = reste.lastIndexOf('\n', 480);
    if(coupe < 50) coupe = 480;
    morceaux.push(reste.slice(0, coupe));
    reste = reste.slice(coupe);
  }
  morceaux.push(reste);
  return Promise.all(morceaux.map(function(m){
    if(!m.trim()) return m;
    var url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(m) + '&langpair=autodetect|fr';
    return fetch(url).then(function(r){ return r.json(); }).then(function(d){
      var t = d && d.responseData && d.responseData.translatedText;
      return t || m;
    }).catch(function(){ return m; });
  })).then(function(parts){ return parts.join(''); });
}

function ncpTraduire(){
  var body = document.getElementById('ncp-detail-body');
  if(!body) return;
  var btn = document.getElementById('ncp-traduire-btn');
  if(btn){ btn.disabled = true; btn.textContent = '\u23f3 Traduction...'; }
  var blocs = body.querySelectorAll('.ncp-tr');
  var taches = [];
  blocs.forEach(function(el){
    if(el.getAttribute('data-original') === null){
      el.setAttribute('data-original', el.textContent);
    }
    var original = el.getAttribute('data-original');
    taches.push(ncpTraduireTexte(original).then(function(trad){ el.textContent = trad; }));
  });
  Promise.all(taches).then(function(){
    if(btn){
      btn.disabled = false;
      btn.innerHTML = '&#8617; Original';
      btn.onclick = ncpRevenirOriginal;
    }
  });
}

function ncpRevenirOriginal(){
  var body = document.getElementById('ncp-detail-body');
  if(!body) return;
  body.querySelectorAll('.ncp-tr').forEach(function(el){
    var o = el.getAttribute('data-original');
    if(o !== null) el.textContent = o;
  });
  var btn = document.getElementById('ncp-traduire-btn');
  if(btn){ btn.innerHTML = '&#127760; Traduire'; btn.onclick = ncpTraduire; }
} function openImportNCPModal(){
  document.getElementById('ncp-import-modal').style.display = 'flex';
}

function ncpInitClicks(){ var tb = document.getElementById('ncp-tbody'); if(!tb || tb.getAttribute('data-clickbound')) return; tb.setAttribute('data-clickbound','1'); tb.style.cursor = 'pointer'; tb.addEventListener('click', function(e){ var tr = (e.target && e.target.closest) ? e.target.closest('tr') : null; if(!tr || !tr.cells || !tr.cells[0]) return; var c = tr.getAttribute('data-notif') || ''; if(!c){ var mm = tr.cells[0].textContent.match(/\d{6,}/); c = mm ? mm[0] : ''; } if(c && c !== '-') ncpDetail(c); }); } function closeNCPDetail(){ var m = document.getElementById('ncp-detail-modal'); if(m) m.style.display = 'none'; } function ncpDetail(notif){ var r = null, i; for(i = 0; i < NCP_DATA.length; i++){ if(String(NCP_DATA[i].notification) === String(notif)){ r = NCP_DATA[i]; break; } } if(!r) return; var f = [['Numero', r.notification], ['Date de creation', r.created_on + (ncpJour(r.created_on) ? ' (' + ncpJour(r.created_on) + ')' : '')], ['Heure fiche', r.created_heure], ['Unite', r.unite], ['Ligne', r.ligne], ['Operateur(s) INPAK', ncpOperateurs(r) || (r.type_ncp === 'Inpak' ? 'non identifie' : '-')], ['Type', r.type_ncp], ['Source de l heure', ncpLibelleSrc(r)], ['Bakorder', ncpBakorder(r) || '-'], ['Production rattachable', (ncpBakorderLien(r) || ['-']).join(' | ')], ['Declarant', r.reporter], ['Statut', r.status], ['Code produit', r.code_produit], ['Client', r.famille_produit], ['Palettes', (Number(r.total_pallets) || 0).toFixed(1)], ['Tonnage', (Number(r.total_tonnes) || 0).toFixed(2) + ' t'], ['Priorite', r.priority], ['Site', r.plant], ['Responsable', r.person_responsible], ['Fichier PDF', r.fichier]]; var h = '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:6px"><div class="ncp-tr" style="font-size:16px;font-weight:600">' + ncpEsc(r.description) + '</div><div style="display:flex;gap:6px;flex-shrink:0;flex-wrap:wrap;justify-content:flex-end">'
  + '<button id="ncp-decote-btn" onclick="ncpToggleDeCote(\'' + r.notification + '\')" style="padding:5px 12px;border-radius:99px;border:1px solid ' + (r.de_cote ? 'var(--blue)' : 'var(--bd2)') + ';background:' + (r.de_cote ? 'rgba(59,130,246,.12)' : 'none') + ';color:' + (r.de_cote ? 'var(--blue)' : 'var(--tx2)') + ';font-family:var(--fn);font-size:11px;cursor:pointer;white-space:nowrap">' + (r.de_cote ? '&#128204; De cote' : '&#128204; Mettre de cote') + '</button>'
  + '<button id="ncp-comment-btn" onclick="ncpOpenComment(\'' + r.notification + '\')" style="padding:5px 12px;border-radius:99px;border:1px solid ' + (r.commentaire_perso ? 'var(--amber)' : 'var(--bd2)') + ';background:' + (r.commentaire_perso ? 'rgba(245,158,11,.12)' : 'none') + ';color:' + (r.commentaire_perso ? 'var(--amber)' : 'var(--tx2)') + ';font-family:var(--fn);font-size:11px;cursor:pointer;white-space:nowrap">&#9998; ' + (r.commentaire_perso ? 'Commentaire' : 'Commenter') + '</button>'
  + '<button id="ncp-controle-btn" onclick="ncpToggleControle(\'' + r.notification + '\')" style="padding:5px 12px;border-radius:99px;border:1px solid ' + (r.controle_perso ? 'var(--green)' : 'var(--bd2)') + ';background:' + (r.controle_perso ? 'rgba(16,185,129,.12)' : 'none') + ';color:' + (r.controle_perso ? 'var(--green)' : 'var(--tx2)') + ';font-family:var(--fn);font-size:11px;cursor:pointer;white-space:nowrap">' + (r.controle_perso ? '&#10003; Controle' : '&#9711; Marquer controle') + '</button>'
  + '<button id="ncp-traduire-btn" onclick="ncpTraduire()" style="padding:5px 12px;border-radius:99px;border:1px solid var(--bd2);background:none;color:var(--tx2);font-family:var(--fn);font-size:11px;cursor:pointer;white-space:nowrap">&#127760; Traduire</button>'
  + '</div></div>';
if(r.controle_perso) h += '<div style="font-size:11px;color:var(--green);margin-bottom:6px">&#10003; Controle par ' + ncpEsc(r.controle_par || '?') + ' le ' + ncpEsc(r.controle_date || '?') + '</div>';
if(r.commentaire_perso) h += '<div style="font-size:12px;color:var(--tx1);background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.25);border-radius:8px;padding:8px 10px;margin-bottom:10px;white-space:pre-wrap"><span style="color:var(--amber);font-weight:600">&#9998; Note perso</span> (' + ncpEsc(r.commentaire_par || '?') + ', ' + ncpEsc(r.commentaire_date || '?') + ') :<br>' + ncpEsc(r.commentaire_perso) + '</div>';
if(r.ncp_partage) h += '<div style="font-size:12px;color:var(--amber);margin-bottom:10px">Fiche repartie sur ' + r.ncp_partage + ' lignes : palettes et tonnage divises</div>'; h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 18px;margin-bottom:16px">'; f.forEach(function(c){ h += '<div style="display:flex;justify-content:space-between;gap:10px;border-bottom:1px solid var(--bd);padding:3px 0"><span style="font-size:11px;color:var(--tx3)">' + c[0] + '</span><span style="font-size:12px;text-align:right">' + ncpEsc(c[1] || '-') + '</span></div>'; });
  var auto = (function(){ var save = r.equipe_override; r.equipe_override = null; var v = ncpGetEquipe(r); r.equipe_override = save; return v; })();
  var equipes5 = ['P1','P2','P3','P4','P5'];
  h += '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid var(--bd);padding:3px 0">'
    + '<span style="font-size:11px;color:var(--tx3)">Equipe' + (r.equipe_override ? ' <span style="color:var(--amber)" title="Corrigee manuellement, deduction auto : ' + (auto || 'non deduite') + '">(corrigee)</span>' : '') + '</span>'
    + '<select onchange="ncpSetEquipeOverride(\'' + r.notification + '\', this.value===\'auto\'?null:this.value)" style="font-size:12px;background:var(--bg3);color:var(--tx1);border:1px solid var(--bd2);border-radius:6px;padding:2px 6px">'
    + '<option value="auto"' + (!r.equipe_override ? ' selected' : '') + '>Auto (' + (auto || 'non deduite') + ')</option>'
    + equipes5.map(function(e){ return '<option value="' + e + '"' + (r.equipe_override === e ? ' selected' : '') + '>' + e + '</option>'; }).join('')
    + '</select></div>';
  h += '</div>'; var bloc = function(t, v){ if(Array.isArray(v)) v = v.join(' | '); return v ? '<div style="margin-bottom:12px"><div style="font-size:11px;color:var(--tx3);text-transform:uppercase;margin-bottom:4px">' + t + '</div><div class="ncp-tr" style="font-size:12px;white-space:pre-wrap">' + ncpEsc(v) + '</div></div>' : ''; }; h += bloc('Probleme', r.problems) + bloc('Mesures', r.measures) + bloc('Toutes les mesures', r.toutes_mesures) + bloc('Info palettes', r.ncp_extra_info); var hist = r.historique_actions || []; if(hist.length){ h += '<div style="font-size:11px;color:var(--tx3);text-transform:uppercase;margin-bottom:6px">Historique (' + hist.length + ' version(s))</div>'; hist.forEach(function(v){ h += '<div style="border-left:2px solid var(--bd2);padding-left:10px;margin-bottom:10px"><div style="font-size:11px;color:var(--tx3);font-family:var(--mo)">' + ncpEsc(v.date_version) + (ncpJour(v.date_version) ? ' (' + ncpJour(v.date_version) + ')' : '') + '</div><div class="ncp-tr" style="font-size:12px;white-space:pre-wrap">' + ncpEsc(v.detail) + '</div></div>'; }); } var deg = r.degustationsLiees || []; if(deg.length){ h += '<div style="font-size:11px;color:var(--tx3);text-transform:uppercase;margin-bottom:6px;margin-top:14px">Degustations liees (' + deg.length + ')</div>'; deg.forEach(function(d){ var dt = d.dateProduction ? (new Date(d.dateProduction).toLocaleString('fr-BE') + ' (' + ncpJour(d.dateProduction) + ')') : '-'; h += '<div style="border-left:2px solid var(--blue);padding-left:10px;margin-bottom:10px">' + '<div style="font-size:11px;color:var(--tx3);font-family:var(--mo)">' + ncpEsc(dt) + ' &middot; ' + ncpEsc(d.ligne || '-') + (d.employe ? ' &middot; ' + ncpEsc(d.employe) : '') + '</div>' + '<div style="font-size:12px">' + ncpEsc(d.produit || '-') + (d.bakorder ? ' (bakorder ' + ncpEsc(d.bakorder) + ')' : '') + '</div>' + (d.remarque ? '<div style="font-size:12px;color:var(--tx2);white-space:pre-wrap">' + ncpEsc(d.remarque) + '</div>' : '') + (d.actionEffectuee ? '<div style="font-size:12px;color:var(--amber);white-space:pre-wrap">&#8594; ' + ncpEsc(d.actionEffectuee) + '</div>' : '') + '</div>'; }); } var body = document.getElementById('ncp-detail-body'); if(body) body.innerHTML = h; var md = document.getElementById('ncp-detail-modal'); if(md) md.style.display = 'flex'; } function importerNCP(){
  var txt = document.getElementById('ncp-import-txt').value.trim();
  var errEl = document.getElementById('ncp-import-err');
  errEl.textContent = '';
  if(!txt){ errEl.textContent = 'Colle le JSON avant d\'importer.'; return; }
  var arr;
  try {
    arr = JSON.parse(txt);
    if(!Array.isArray(arr)) throw new Error('Le JSON doit etre un tableau (liste de NCP).');
  } catch(e){
    errEl.textContent = 'JSON invalide : ' + e.message;
    return;
  }
  // Deduplication par numero de notification : si le meme NCP apparait
  // plusieurs fois (ex: exports qui se chevauchent), on garde la version
  // la plus complete (le plus de versions/historique), pas juste la derniere.
  var parNotif = {};
  var doublonsTrouves = 0;
  arr.forEach(function(r){
    var notif = r.notification;
    if(!notif) return;
    if(parNotif[notif]){
      doublonsTrouves++;
      var existant = parNotif[notif];
      var existantScore = existant.nb_versions || 1;
      var nouveauScore = r.nb_versions || 1;
      if(nouveauScore >= existantScore) parNotif[notif] = r;
    } else {
      parNotif[notif] = r;
    }
  });
  var obj = {};
  Object.keys(parNotif).forEach(function(notif){
    var key = notif.toString().replace(/[.#$/\[\]]/g, '_');
    obj[key] = parNotif[notif];
  });
  if(!db){ errEl.textContent = 'Pas de connexion Firebase.'; return; }
  db.ref('ncp_data').set(obj).then(function(){
    document.getElementById('ncp-import-modal').style.display = 'none';
    document.getElementById('ncp-import-txt').value = '';
    var msg = Object.keys(obj).length + ' NCP importes';
    if(doublonsTrouves > 0) msg += ' (' + doublonsTrouves + ' doublons fusionnes)';
    toast(msg, '#10b981');
  }).catch(function(err){
    errEl.textContent = 'Erreur Firebase : ' + err.message;
  });
}

function filtrerNCPUnite(u){
  NCP_FILTRE_UNITE = u;
  document.querySelectorAll('.ncp-unite-btn').forEach(function(b){
    var on = b.dataset.unite === u;
    b.classList.toggle('on', on);
    b.style.background = on ? 'var(--blue)' : 'none';
    b.style.color = on ? '#fff' : 'var(--tx2)';
    b.style.borderColor = on ? 'var(--blue)' : 'var(--bd2)';
  });
  buildNCPTab();
}

function filtrerNCPType(ty){
  NCP_FILTRE_TYPE = ty;
  document.querySelectorAll('.ncp-type-btn').forEach(function(b){
    var on = b.dataset.type === ty;
    var couleur = ty === 'Inpak' ? 'var(--amber)' : ty === 'Production' ? 'var(--red)' : 'var(--blue)';
    b.classList.toggle('on', on);
    b.style.background = on ? (b.dataset.type === 'all' ? 'var(--blue)' : couleur) : 'none';
    b.style.color = on ? '#fff' : (b.dataset.type === 'all' ? 'var(--tx2)' : couleur);
  });
  buildNCPTab();
}

function filtrerNCPEquipe(e){
  NCP_FILTRE_EQUIPE = e;
  document.querySelectorAll('.ncp-equipe-btn').forEach(function(b){
    var on = b.dataset.equipe === e;
    var couleur = b.dataset.equipe === 'all' ? 'var(--blue)' : COULEURS_EQUIPE[b.dataset.equipe];
    b.classList.toggle('on', on);
    b.style.background = on ? couleur : 'none';
    b.style.color = on ? '#fff' : couleur;
  });
  buildNCPTab();
}

// --- Selection d une periode (dates libres ou raccourcis) ---
function ncpISO(dt){
  return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
}

// Jour de la semaine a partir d'une date "DD/MM/YYYY" ou "YYYY-MM-DD".
// Ajoute pour eviter toute confusion/erreur de calcul manuel du jour.
var NCP_JOURS = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
function ncpJour(dateStr){
  if(!dateStr) return '';
  var iso;
  if(/^\d{4}-\d{2}-\d{2}/.test(dateStr)) iso = dateStr.slice(0,10);
  else { var p = dateStr.split('/'); if(p.length !== 3) return ''; iso = p[2] + '-' + p[1] + '-' + p[0]; }
  var d = new Date(iso + 'T00:00:00');
  if(isNaN(d.getTime())) return '';
  return NCP_JOURS[d.getDay()];
}

function majNCPPresets(){
  document.querySelectorAll('.ncp-preset-btn').forEach(function(b){
    b.classList.toggle('on', b.dataset.preset === NCP_PRESET_ACTIF);
  });
}

function filtrerNCPDates(){
  var eD = document.getElementById('ncp-date-debut');
  var eF = document.getElementById('ncp-date-fin');
  NCP_FILTRE_DEBUT = eD ? eD.value : '';
  NCP_FILTRE_FIN = eF ? eF.value : '';
  // Si les deux bornes sont inversees, on les remet dans l ordre
  if(NCP_FILTRE_DEBUT && NCP_FILTRE_FIN && NCP_FILTRE_DEBUT > NCP_FILTRE_FIN){
    var tmp = NCP_FILTRE_DEBUT;
    NCP_FILTRE_DEBUT = NCP_FILTRE_FIN;
    NCP_FILTRE_FIN = tmp;
    if(eD) eD.value = NCP_FILTRE_DEBUT;
    if(eF) eF.value = NCP_FILTRE_FIN;
  }
  NCP_PRESET_ACTIF = (!NCP_FILTRE_DEBUT && !NCP_FILTRE_FIN) ? 'all' : 'perso';
  majNCPPresets();
  buildNCPTab();
}

function ncpPresetPeriode(cle){
  NCP_PRESET_ACTIF = cle;
  var auj = new Date();
  var debut = '', fin = '';
  if(cle !== 'all'){
    fin = ncpISO(auj);
    var d;
    if(cle === 'mois'){
      d = new Date(auj.getFullYear(), auj.getMonth(), 1);
    } else if(cle === 'annee'){
      d = new Date(auj.getFullYear(), 0, 1);
    } else {
      d = new Date(auj.getTime());
      d.setDate(d.getDate() - parseInt(cle, 10));
    }
    debut = ncpISO(d);
  }
  NCP_FILTRE_DEBUT = debut;
  NCP_FILTRE_FIN = fin;
  var eD = document.getElementById('ncp-date-debut'); if(eD) eD.value = debut;
  var eF = document.getElementById('ncp-date-fin'); if(eF) eF.value = fin;
  majNCPPresets();
  buildNCPTab();
}

var _ncpFamillesChart = null; var NCP_FAMILLES = [['Soudure / etancheite', /lasna|langsnaad|dwarsnaad|sealing|seal|niet dicht|lek|naad/i], ['Codage / impression', /coder|codering|gedrukt|geprint|print|etiket|label|sticker|datum|mhd|barcode|ean/i], ['Corps etranger', /vreemd|metaal|plastic|hout|glas|insect|haar|steen/i], ['Emballage / carton', /karton|omdo|doos|doz|zak|verpakking|folie|pallet|palet/i], ['Aspect produit', /zwart|grauw|kleur|colour|vet|defect|stootblauw|kruiden|snit|snijpositie|lengte|producteigen|oorzaak product|ingredi|olie|dosage|fractie|gamma|calibr|structuur|smaak|geur|agtron|droge stof|vochtgehalte|ffa\b|polaire|zuurgraad|peroxide/i], ['Poids / quantite', /gewicht|aantal|te weinig|te veel|stuks/i], ['Temperature / froid', /temp|vriezer|frigo|ontdooid|t°/i], ['Process / panne', /storing|productie andere reden|machine|panne|opstart|stilstand/i], ['Stock / logistique', /stock|magazijn|retour|levering|transport/i], ['Controle / test', /standaardtest|test|controle|monster|staal/i]]; function ncpFamille(lib){ var s = String(lib || ''); for(var i = 0; i < NCP_FAMILLES.length; i++){ if(NCP_FAMILLES[i][1].test(s)) return NCP_FAMILLES[i][0]; } return 'Autre'; } var NCP_RECHERCHE = ''; var NCP_TOUT = false; var _ncpRechTimer = null; function ncpRecherche(){ var e = document.getElementById('ncp-recherche'); NCP_RECHERCHE = e ? e.value.trim().toLowerCase() : ''; if(_ncpRechTimer) clearTimeout(_ncpRechTimer); _ncpRechTimer = setTimeout(buildNCPTab, 260); } function ncpToggleFiltreDecote(){
  NCP_FILTRE_DECOTE = !NCP_FILTRE_DECOTE;
  var b = document.getElementById('ncp-btn-decote');
  if(b){
    b.textContent = (NCP_FILTRE_DECOTE ? '\u2713 ' : '') + '\ud83d\udccc Mis de cote';
    b.style.borderColor = NCP_FILTRE_DECOTE ? 'var(--blue)' : 'var(--bd2)';
    b.style.color = NCP_FILTRE_DECOTE ? 'var(--blue)' : 'var(--tx2)';
    b.style.background = NCP_FILTRE_DECOTE ? 'rgba(59,130,246,.12)' : 'none';
  }
  buildNCPTab();
}
function ncpInjecterBoutonDecote(){
  if(document.getElementById('ncp-btn-decote')) return;
  var ref = document.getElementById('ncp-btn-tout');
  if(!ref || !ref.parentNode) return;
  var b = document.createElement('button');
  b.id = 'ncp-btn-decote';
  b.textContent = '\ud83d\udccc Mis de cote';
  b.style.cssText = 'padding:6px 14px;border-radius:var(--r);border:1px solid var(--bd2);background:none;color:var(--tx2);font-family:var(--fn);font-size:12px;cursor:pointer;margin-left:8px';
  b.onclick = ncpToggleFiltreDecote;
  ref.parentNode.insertBefore(b, ref.nextSibling);
}
function ncpToggleTout(){ NCP_TOUT = !NCP_TOUT; var b = document.getElementById('ncp-btn-tout'); if(b) b.textContent = NCP_TOUT ? 'Limiter a 200' : 'Tout afficher'; buildNCPTab(); } function ncpBakorder(r){ if(r._bo !== undefined) return r._bo; var t = [r.description, r.ncp_extra_info, r.measures, r.toutes_mesures, JSON.stringify(r.historique_actions || '')].join(' '); var m = String(t).match(/(?:bakorder|ordre|order)[^0-9]{0,20}(\d{6,8})/i); r._bo = m ? m[1] : null; return r._bo; } function ncpBakorderLien(r){ var bo = ncpBakorder(r); if(!bo) return null; var out = []; NCP_DATA.forEach(function(x){ if(x === r || ncpBakorder(x) !== bo || ncpEstNonClasse(x)) return; var eq = ncpGetEquipe(x); if(eq && out.length < 4) out.push(eq + ' (NCP ' + x.notification + ' du ' + x.created_on + ')'); }); return out.length ? out : null; } function ncpTexteRecherche(r){ if(!r._srch) r._srch = [r.notification, r.created_on, r.unite, r.ligne, r.type_ncp, r.code_produit, r.famille_produit, r.reporter, r.status, r.description, r.problems, ncpBakorder(r)].join(' ').toLowerCase(); return r._srch; } function ncpExportCSV(){ var rows = NCP_VUE || []; var NL = String.fromCharCode(13, 10); var head = ['Numero','Date','Heure','Source heure','Unite','Ligne','Equipe','Type','Bakorder','Produit','Client','Palettes','Tonnage','Statut','Declarant','Motifs','Description']; var q = function(v){ return '"' + String(v == null ? '' : v).replace(/"/g, '""').replace(/\s+/g, ' ') + '"'; }; var lignes = [head.map(q).join(';')]; rows.forEach(function(r){ var hi = ncpHeureInfo(r); lignes.push([r.notification, r.created_on, hi.heure || '', hi.src || '', r.unite, r.ligne, ncpGetEquipe(r) || '', r.type_ncp, ncpBakorder(r) || '', r.code_produit, r.famille_produit, (Number(r.total_pallets) || 0).toFixed(1), (Number(r.total_tonnes) || 0).toFixed(2), r.status, r.reporter, r.problems, r.description].map(q).join(';')); }); var blob = new Blob([String.fromCharCode(65279) + lignes.join(NL)], { type: 'text/csv;charset=utf-8' }); var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'NCP_export_' + new Date().toISOString().slice(0, 10) + '.csv'; document.body.appendChild(a); a.click(); document.body.removeChild(a); } var _ncpDelaiChart = null; var NCP_RECUR = []; function ncpParseFR(s){ var m = String(s || '').match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); return m ? new Date(+m[3], +m[2] - 1, +m[1]) : null; } function ncpDelai(r){ var c = ncpParseFR(r.created_on); var h = r.historique_actions || []; var last = null; for(var i = 0; i < h.length; i++){ var d = ncpParseFR(h[i].date_version); if(d && (!last || d > last)) last = d; } if(!c || !last) return null; var j = Math.round((last - c) / 86400000); return j < 0 ? null : j; } function ncpEstSoldee(r){ return String(r.status || '').toLowerCase().indexOf('vrijgave') >= 0; } function ncpBuildRecurrences(rows){ var box = document.getElementById('ncp-recurrences'); if(!box) return; var m = {}; rows.forEach(function(r){ if(!r.problems) return; var vus = {}; String(r.problems).split('|').forEach(function(p){ var lib = p.trim(); if(!lib) return; var fa = ncpFamille(lib); if(vus[fa]) return; vus[fa] = 1; var k = (r.famille_produit || '?') + ' ' + (r.code_produit || '?') + ' > ' + fa; if(!m[k]) m[k] = { n: 0, t: 0, ids: {} }; m[k].n++; m[k].t += (Number(r.total_tonnes) || 0); m[k].ids[String(r.notification)] = 1; }); }); NCP_RECUR = Object.keys(m).filter(function(k){ return m[k].n >= 3; }).sort(function(x, y){ return m[y].n - m[x].n; }).slice(0, 18).map(function(k){ return { k: k, n: m[k].n, t: m[k].t, ids: Object.keys(m[k].ids) }; }); if(!NCP_RECUR.length){ box.innerHTML = '<div style="font-size:12px;color:var(--tx3)">Aucune recurrence (3 fois ou plus) sur cette selection.</div>'; return; } var h = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:8px">'; NCP_RECUR.forEach(function(x, i){ h += '<div onclick="ncpListeRecurrence(' + i + ')" style="cursor:pointer;border:1px solid var(--bd);border-radius:10px;padding:10px 12px;display:flex;align-items:center;justify-content:space-between;gap:10px"><div><div style="font-size:12px;font-weight:600;color:#fff">' + ncpEsc(x.k) + '</div><div style="font-size:10px;color:var(--tx3);margin-top:3px">' + x.t.toFixed(1) + ' t bloquees au total</div></div><div style="font-size:18px;font-weight:700;color:var(--amber)">' + x.n + '</div></div>'; }); h += '</div>'; box.innerHTML = h; } function ncpListeRecurrence(i){ var x = NCP_RECUR[i]; if(!x) return; var rows = (NCP_VUE || []).filter(function(r){ return x.ids.indexOf(String(r.notification)) >= 0; }); ncpRendreListe('Recurrence : ' + x.k, rows); } function ncpHeureTexte(r){ var t = String([r.description, r.ncp_extra_info].join(' ')); var m = t.match(/\b([01]?\d|2[0-3])[:uh]([0-5]\d)\b/); if(!m) return null; return ('0' + m[1]).slice(-2) + ':' + m[2]; }
function ncpHeureLocale(dp){                       // ISO -> { date, heure } heure d'usine
  var d = new Date(dp);
  if(isNaN(d.getTime())) return null;
  var p = new Intl.DateTimeFormat('fr-BE',{timeZone:'Europe/Brussels',year:'numeric',
          month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(d);
  var g = function(k){ return p.find(function(x){ return x.type === k; }).value; };
  return { date: g('year')+'-'+g('month')+'-'+g('day'),
           heure: (g('hour') === '24' ? '00' : g('hour'))+':'+g('minute') };
}
function ncpHeureDegustation(r){
  var deg = r.degustationsLiees || [];
  if(!deg.length) return null;
  var wanted = r.created_date_iso, match = null;
  for(var i = 0; i < deg.length; i++){
    var loc = deg[i].dateProduction ? ncpHeureLocale(deg[i].dateProduction) : null;
    if(!loc) continue;
    if(!match) match = loc;
    if(wanted && loc.date === wanted){ match = loc; break; }
  }
  if(!match) return null;
  return { heure: match.heure, date_iso: match.date };
}
function ncpHeureInfo(r){
  if(!r.created_date_iso) return { heure: null, src: null, date_iso: null };
  // Priorite : 1) heure reelle d'une degustation liee (vrai horodatage systeme)
  //            2) heure ecrite dans le texte du NCP (le moment reel du defaut, tel que decrit)
  //            3) heure de la fiche, seulement si aucune des deux precedentes n'existe
  //               (c'est souvent juste l'heure de saisie papier, pas celle du defaut)
  var dg = ncpHeureDegustation(r);
  if(dg) return { heure: dg.heure, src: 'degustation', date_iso: dg.date_iso };
  var h = ncpHeureTexte(r);
  if(h) return { heure: h, src: 'texte', date_iso: r.created_date_iso };
  if(r.created_heure && r.heure_fiable !== false) return { heure: r.created_heure, src: 'fiche', date_iso: r.created_date_iso };
  return { heure: null, src: null, date_iso: null };
}
var NCP_SEUIL_PART = 0.15;       // part de temps mini pour retenir une equipe secondaire
var NCP_MAX_PLAGE_TEXTE_H = 6;   // au-dela, deux heures citees ne sont pas une plage
var NCP_EQM_CACHE = new WeakMap();

function ncpHeuresTexteToutes(r){                  // toutes les heures citees, dans l'ordre
  var t = String([r.description, r.ncp_extra_info].join(' '));
  var re = /\b([01]?\d|2[0-3])[:uh.]([0-5]\d)\b/g, m, out = [];
  while((m = re.exec(t)) !== null){
    var v = ('0'+m[1]).slice(-2)+':'+m[2];
    if(out.indexOf(v) < 0) out.push(v);
  }
  return out;
}

function ncpFenetre(r){                            // fenetre debut -> fin du defaut
  var mins = function(hh){ return (+hh.slice(0,2))*60 + (+hh.slice(3,5)); };
  var locs = (r.degustationsLiees || []).map(function(d){
    return d.dateProduction ? ncpHeureLocale(d.dateProduction) : null;
  }).filter(Boolean).sort(function(x,y){
    return (x.date+x.heure) < (y.date+y.heure) ? -1 : 1;
  });
  if(locs.length){
    var lA = locs[0], lB = locs[locs.length-1];
    var dur = (new Date(lB.date+'T'+lB.heure+':00') - new Date(lA.date+'T'+lA.heure+':00'))/60000;
    return { dateDebut:lA.date, heureDebut:lA.heure, dateFin:lB.date, heureFin:lB.heure,
             duree:dur, src:(dur > 0 ? 'degustation-plage' : 'degustation'), n:locs.length };
  }
  var hs = ncpHeuresTexteToutes(r);
  if(hs.length && r.created_date_iso){
    var h1 = hs[0], h2 = hs[hs.length-1];
    var span = mins(h2) - mins(h1); if(span < 0) span += 1440;
    if(hs.length > 1 && span > 0 && span <= NCP_MAX_PLAGE_TEXTE_H*60){
      var fin = mins(h2) < mins(h1)
        ? new Date(new Date(r.created_date_iso+'T00:00:00').getTime()+86400000).toISOString().slice(0,10)
        : r.created_date_iso;
      return { dateDebut:r.created_date_iso, heureDebut:h1, dateFin:fin, heureFin:h2,
               duree:span, src:'texte-plage', n:hs.length };
    }
    return { dateDebut:r.created_date_iso, heureDebut:h1, dateFin:r.created_date_iso,
             heureFin:h1, duree:0, src:'texte', n:1 };
  }
  if(r.created_date_iso && r.created_heure)
    return { dateDebut:r.created_date_iso, heureDebut:r.created_heure, dateFin:r.created_date_iso,
             heureFin:r.created_heure, duree:0, src:'fiche', n:1 };
  return null;
}

function ncpEquipesMulti(r){        // { principale, equipes:[{equipe,minutes,part}], multi, src }
  if(r.equipe_override)
    return { equipes:[{equipe:r.equipe_override,minutes:0,part:1}], toutes:[],
             principale:r.equipe_override, multi:false, src:'manuel', duree:0 };
  if(NCP_EQM_CACHE.has(r)) return NCP_EQM_CACHE.get(r);
  var res;
  if(ncpEstNonClasse(r)) res = { equipes:[], toutes:[], principale:null, multi:false, src:'declarant' };
  else {
    var f = ncpFenetre(r);
    if(!f) res = { equipes:[], toutes:[], principale:null, multi:false, src:null };
    else {
      var start = new Date(f.dateDebut+'T'+f.heureDebut+':00');
      var end   = new Date(f.dateFin  +'T'+f.heureFin  +':00');
      if(end < start) end = new Date(end.getTime()+86400000);
      var span = Math.min((end-start)/60000, 24*60), pas = 5, acc = {}, tot = 0;
      for(var m = 0; m <= span; m += pas){
        var cur = new Date(start.getTime()+m*60000);
        var iso = cur.getFullYear()+'-'+('0'+(cur.getMonth()+1)).slice(-2)+'-'+('0'+cur.getDate()).slice(-2);
        var hh  = ('0'+cur.getHours()).slice(-2)+':'+('0'+cur.getMinutes()).slice(-2);
        var eq  = getEquipe(iso, hh);
        if(eq){ acc[eq] = (acc[eq] || 0) + pas; tot += pas; }
        if(span === 0) break;
      }
      var list = Object.keys(acc).map(function(k){
        return { equipe:k, minutes:acc[k], part: tot ? acc[k]/tot : 0 };
      }).sort(function(x,y){ return y.part - x.part; });
      var keep = list.filter(function(x){ return x.part >= NCP_SEUIL_PART; });
      if(!keep.length && list.length) keep = [list[0]];
      res = { equipes:keep, toutes:list, principale: keep.length ? keep[0].equipe : null,
              multi: keep.length > 1, src:f.src, duree:f.duree };
    }
  }
  NCP_EQM_CACHE.set(r, res);
  return res;
}

function ncpConcerneEquipe(r, eq){
  return ncpEquipesMulti(r).equipes.some(function(x){ return x.equipe === eq; });
}
function ncpTonnagePondere(r, eq){                 // tonnage au pro-rata du temps
  var x = ncpEquipesMulti(r).equipes.find(function(e){ return e.equipe === eq; });
  return x ? (Number(r.total_tonnes) || 0) * x.part : 0;
}
function ncpEtiquetteMulti(r){                     // "+P2" a coller derriere l'equipe
  var mm = ncpEquipesMulti(r);
  if(!mm.multi) return '';
  return ' <span style="color:#8b5cf6;font-size:11px" title="NCP a cheval sur plusieurs postes : '
    + mm.equipes.map(function(e){ return e.equipe+' '+Math.round(e.part*100)+'%'; }).join(' + ')
    + ' (source : '+mm.src+')">+'
    + mm.equipes.slice(1).map(function(e){ return e.equipe; }).join('/') + '</span>';
}
function ncpEstDebloquee(r){ return ncpEstSoldee(r); }
function ncpBadgeSrc(r){ var i = ncpHeureInfo(r); if(i.src === 'degustation') return ' <span title="Heure reelle prise sur la degustation liee (la plus fiable)" style="color:#10b981">&#9679;</span>'; if(i.src === 'fiche') return ''; if(i.src === 'texte') return ' <span title="Heure du defaut lue dans le texte du NCP (prioritaire sur l heure de la fiche)" style="color:var(--amber)">~</span>'; return ' <span title="Aucune heure exploitable : equipe non deduite" style="color:var(--tx3)">*</span>'; } function ncpLibelleSrc(r){ var i = ncpHeureInfo(r); if(i.src === 'degustation') return 'heure reelle de la degustation liee (' + i.heure + ') - la plus fiable'; if(i.src === 'texte') return 'heure ecrite dans le texte du NCP (' + i.heure + ') - prioritaire sur la fiche'; if(i.src === 'fiche') return 'heure de la fiche (' + i.heure + ')'; return 'aucune heure exploitable'; } function ncpMajCouverture(rows){ var el = document.getElementById('ncp-couverture'); if(!el) return; var d = 0, f = 0, x = 0, n = 0, pl = 0, mu = 0;
  rows.forEach(function(r){
    var m = ncpEquipesMulti(r);
    if(m.src === 'declarant'){ n++; return; }
    if(!m.principale) return;
    if(m.src === 'degustation' || m.src === 'degustation-plage') d++;
    else if(m.src === 'texte-plage'){ x++; pl++; }
    else if(m.src === 'texte') x++;
    else if(m.src === 'fiche') f++;
    if(m.multi) mu++;
  });
  var tot = rows.length, att = d + f + x;
  el.innerHTML = '<br>' + t('ncp_couverture_text')
    .replace('{att}', att).replace('{tot}', tot)
    .replace('{pct}', tot ? Math.round(att/tot*100) : 0)
    .replace('{d}', d).replace('{x}', x).replace('{pl}', pl)
    .replace('{f}', f).replace('{mu}', mu).replace('{n}', n);
  } function ncpGetEquipe(r){
  if(r.equipe_override) return r.equipe_override;
  if(ncpEstNonClasse(r)) return null; var _hi = ncpHeureInfo(r); if(!_hi.heure) return null;
  return getEquipe(_hi.date_iso || r.created_date_iso, _hi.heure);
}
function ncpSetEquipeOverride(notif, valeur){
  if(!db){ toast('Connexion Firebase non disponible', '#ef4444'); return; }
  var r = NCP_DATA.find(function(x){ return String(x.notification) === String(notif); });
  var chemin = 'ncp_data/' + notif + '/equipe_override';
  var ecrire = valeur ? db.ref(chemin).set(valeur) : db.ref(chemin).remove();
  ecrire.then(function(){
    if(r) r.equipe_override = valeur || null;
    toast(valeur ? ('Equipe forcee a ' + valeur) : 'Retour a la deduction automatique', '#10b981');
    ncpDetail(notif);
  }).catch(function(e){ toast('Erreur : ' + e.message, '#ef4444'); });
}

function buildNCPTab(){
  ncpInjecterBoutonDecote();
  var emptyState = document.getElementById('ncp-empty-state');
  var contentWrap = document.getElementById('ncp-content-wrap');
  if(!NCP_DATA || NCP_DATA.length === 0){
    if(emptyState) emptyState.style.display = 'block';
    if(contentWrap) contentWrap.style.display = 'none';
    return;
  }
  if(emptyState) emptyState.style.display = 'none';
  if(contentWrap) contentWrap.style.display = 'block';

  var filtres = NCP_DATA.filter(function(r){
    if(NCP_FILTRE_DECOTE && !r.de_cote) return false;
    if(NCP_FILTRE_UNITE !== 'all' && r.unite !== NCP_FILTRE_UNITE) return false;
    if(NCP_FILTRE_TYPE !== 'all' && r.type_ncp !== NCP_FILTRE_TYPE) return false;
    if(NCP_FILTRE_EQUIPE !== 'all' && !ncpConcerneEquipe(r, NCP_FILTRE_EQUIPE)) return false;
    if(NCP_FILTRE_DEBUT && (!r.created_date_iso || r.created_date_iso < NCP_FILTRE_DEBUT)) return false;
    if(NCP_FILTRE_FIN && (!r.created_date_iso || r.created_date_iso > NCP_FILTRE_FIN)) return false; if(NCP_RECHERCHE && ncpTexteRecherche(r).indexOf(NCP_RECHERCHE) < 0) return false;
    return true;
  });

  // Filtres actifs mais aucun resultat : message clair plutot que des graphiques vides
  if(filtres.length === 0){
    ['ncp-k-total','ncp-k-inpak','ncp-k-prod','ncp-k-tonnes','ncp-k-debloque','ncp-k-sl-inpak','ncp-k-sl-prod'].forEach(function(id){
      var el = document.getElementById(id); if(el) el.textContent = '0';
    });
    var elPer = document.getElementById('ncp-k-periode'); if(elPer) elPer.textContent = '-';
    [_ncpEvolutionChart, _ncpCausesChart, _ncpTonnageChart, _ncpLignesChart, _ncpProduitsChart].forEach(function(c){ if(c) c.destroy(); });
    _ncpEvolutionChart = _ncpCausesChart = _ncpTonnageChart = _ncpLignesChart = _ncpProduitsChart = null;
    var tbody0 = document.getElementById('ncp-tbody');
    if(tbody0) tbody0.innerHTML = '<tr><td colspan="12" style="text-align:center;color:var(--tx3);padding:24px;font-size:13px">'+t('ncp_no_match')+'</td></tr>';
    NCP_VUE = []; ncpBuildDeclarants([]); var countEl0 = document.getElementById('ncp-liste-count'); if(countEl0) countEl0.textContent = '(0)';
    return;
  }

  NCP_VUE = filtres; ncpMajCouverture(filtres); // --- KPI ---
  // Client "BLK" = bulk interne / surproduction, pas un vrai defaut client :
  // exclu des totaux/KPI/graphiques, mais reste visible dans la liste ci-dessous.
  var filtresKPI = filtres.filter(function(r){ return r.famille_produit !== 'BLK'; });
  var total = filtresKPI.length;
  var nInpak = filtresKPI.filter(function(r){ return r.type_ncp === 'Inpak'; }).length;
  var nProd = filtresKPI.filter(function(r){ return r.type_ncp === 'Production'; }).length;
  var tonnes = filtresKPI.reduce(function(s, r){ return s + (r.total_tonnes || 0); }, 0);
  var elTotal = document.getElementById('ncp-k-total'); if(elTotal) elTotal.textContent = total;
  var elInpak = document.getElementById('ncp-k-inpak'); if(elInpak) elInpak.textContent = nInpak;
  var elInpakPct = document.getElementById('ncp-k-inpak-pct'); if(elInpakPct) elInpakPct.textContent = total ? Math.round(nInpak/total*100) + '%' : '-';
  var elProd = document.getElementById('ncp-k-prod'); if(elProd) elProd.textContent = nProd;
  var elProdPct = document.getElementById('ncp-k-prod-pct'); if(elProdPct) elProdPct.textContent = total ? Math.round(nProd/total*100) + '%' : '-';
  var elTonnes = document.getElementById('ncp-k-tonnes'); if(elTonnes) elTonnes.textContent = Math.round(tonnes) + ' t';
  // NCP encore ouvertes : tout ce qui n a pas ete libere par la qualite
  var nNonClasses = filtresKPI.filter(ncpEstNonClasse).length;
  var nOuvertes = nNonClasses;
  var elOuv = document.getElementById('ncp-k-ouvertes'); if(elOuv) elOuv.textContent = nOuvertes;
  var elClo = document.getElementById('ncp-k-cloture-pct');
  if(elClo) elClo.textContent = total ? (Math.round(nNonClasses / total * 100) + '% du total, a attribuer') : '-';
  var nDebloque = filtresKPI.filter(ncpEstDebloquee);
  var tDebloque = nDebloque.reduce(function(s, r){ return s + (Number(r.total_tonnes) || 0); }, 0);
  var elDeb = document.getElementById('ncp-k-debloque');
  if(elDeb) elDeb.textContent = nDebloque.length;
  var elDebM = document.getElementById('ncp-k-debloque-meta');
  if(elDebM) elDebM.textContent = Math.round(tDebloque) + ' t liberees - '
    + (total ? Math.round(nDebloque.length / total * 100) : 0) + '% des fiches';
  var elPeriode = document.getElementById('ncp-k-periode');
  if(elPeriode && filtresKPI.length){
    var dates = filtresKPI.map(function(r){ return r.created_date_iso; }).filter(Boolean).sort();
    if(dates.length) elPeriode.textContent = dFR(dates[0]) + ' au ' + dFR(dates[dates.length-1]);
  }

  // --- Evolution mensuelle ---
  var ctxEvo = document.getElementById('ncpEvolutionChart');
  if(ctxEvo && typeof Chart !== 'undefined'){
    var parMois = {};
    filtresKPI.forEach(function(r){
      if(!r.created_date_iso) return;
      var mois = r.created_date_iso.slice(0,7);
      parMois[mois] = (parMois[mois] || 0) + 1;
    });
    var moisTries = Object.keys(parMois).sort();
    var moisActuel = new Date().toISOString().slice(0, 7);
    var moisEnCours = moisTries.length > 0 && moisTries[moisTries.length - 1] === moisActuel;
    if(_ncpEvolutionChart){ _ncpEvolutionChart.destroy(); _ncpEvolutionChart = null; }
    _ncpEvolutionChart = new Chart(ctxEvo, {
      type: 'line',
      data: { labels: moisTries.map(moisFR), datasets: [{
        data: moisTries.map(function(m){ return parMois[m]; }),
        borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.1)', fill: true, tension: .3, pointRadius: 3,
        // Le mois en cours n est pas termine : on le trace en pointilles
        segment: { borderDash: function(ctx){ return (moisEnCours && ctx.p1DataIndex === moisTries.length - 1) ? [5, 4] : undefined; } }
      }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false }, ticks: { color: '#8b90a4' } }, y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' } } } }
    });
  }

  // --- Top 10 des causes reelles (Pareto) ---
  // Remplace l ancien graphique 'Comparaison par equipe' : celui-ci comparait
  // les equipes sur l heure de creation de la fiche qualite, pas sur l heure
  // reelle du defaut, ce qui penalisait mecaniquement les equipes de journee.
  var ctxCa = document.getElementById('ncpCausesChart');
  if(ctxCa && typeof Chart !== 'undefined'){
    var parCause = {};
    filtresKPI.forEach(function(r){
      if(!r.problems) return;
      String(r.problems).split('|').forEach(function(p){
        var lib = p.trim();
        if(!lib) return;
        parCause[lib] = (parCause[lib] || 0) + 1;
      });
    });
    var causes = Object.keys(parCause).sort(function(x, y){ return parCause[y] - parCause[x]; });
    var topCauses = causes.slice(0, 10);
    if(_ncpCausesChart){ _ncpCausesChart.destroy(); _ncpCausesChart = null; }
    if(topCauses.length){
      var totalCauses = causes.reduce(function(s, k){ return s + parCause[k]; }, 0);
      var cumul = 0;
      var cumulPct = topCauses.map(function(c){ cumul += parCause[c]; return Math.round(cumul / totalCauses * 100); });
      _ncpCausesChart = new Chart(ctxCa, {
        data: {
          labels: topCauses.map(function(c){ return c.length > 24 ? c.slice(0, 23) + '\u2026' : c; }),
          datasets: [
            { type: 'bar', data: topCauses.map(function(c){ return parCause[c]; }), backgroundColor: '#8b5cf6', borderRadius: 4, order: 2 },
            { type: 'line', data: cumulPct, borderColor: '#f59e0b', backgroundColor: 'transparent', borderWidth: 2, pointRadius: 2, pointBackgroundColor: '#f59e0b', tension: .25, yAxisID: 'y2', order: 1 }
          ]
        },
        options: { responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false },
            tooltip: { callbacks: {
              title: function(items){ return topCauses[items[0].dataIndex]; },
              label: function(c){ return c.datasetIndex === 1 ? ('Cumul : ' + c.parsed.y + '%') : (c.parsed.y + ' NCP'); }
            } } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#8b90a4', font: { size: 9 }, maxRotation: 55, minRotation: 40, autoSkip: false } },
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4', precision: 0 } },
            y2: { position: 'right', beginAtZero: true, max: 100, grid: { display: false }, ticks: { color: '#f59e0b', font: { size: 10 }, callback: function(v){ return v + '%'; } } }
          } }
      });
    }
  }

  var ctxFa = document.getElementById('ncpFamillesChart'); if(ctxFa && typeof Chart !== 'undefined'){ var parFam = {}; var totFam = 0; filtresKPI.forEach(function(r){ if(!r.problems) return; String(r.problems).split('|').forEach(function(p){ var lib = p.trim(); if(!lib) return; var fa = ncpFamille(lib); parFam[fa] = (parFam[fa] || 0) + 1; totFam++; }); }); var fams = Object.keys(parFam).sort(function(a, b){ return parFam[b] - parFam[a]; }); if(_ncpFamillesChart){ _ncpFamillesChart.destroy(); _ncpFamillesChart = null; } if(fams.length){ var cumF = 0; var cumFPct = fams.map(function(f){ cumF += parFam[f]; return Math.round(cumF / totFam * 100); }); _ncpFamillesChart = new Chart(ctxFa, { data: { labels: fams, datasets: [ { type: 'bar', data: fams.map(function(f){ return parFam[f]; }), backgroundColor: '#3b82f6', borderRadius: 4, order: 2 }, { type: 'line', data: cumFPct, borderColor: '#f59e0b', backgroundColor: 'transparent', borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#f59e0b', tension: .25, yAxisID: 'y2', order: 1 } ] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(c){ return c.datasetIndex === 1 ? ('cumul ' + c.parsed.y + '%') : (c.parsed.y + ' mentions, ' + Math.round(c.parsed.y / totFam * 100) + '% du total'); } } } }, scales: { x: { grid: { display: false }, ticks: { color: '#8b90a4', maxRotation: 40, minRotation: 40, font: { size: 10 } } }, y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' } }, y2: { position: 'right', beginAtZero: true, max: 100, grid: { display: false }, ticks: { color: '#f59e0b', callback: function(v){ return v + '%'; } } } } } }); } }   var ctxDe = document.getElementById('ncpDelaiChart'); if(ctxDe && typeof Chart !== 'undefined'){ var seaux = [0, 0, 0, 0, 0]; var nMes = 0, somme = 0, sup7 = 0, nonSoldees = 0; filtresKPI.forEach(function(r){ if(!ncpEstSoldee(r)) nonSoldees++; var j = ncpDelai(r); if(j === null) return; nMes++; somme += j; if(j > 7) sup7++; if(j <= 2) seaux[0]++; else if(j <= 7) seaux[1]++; else if(j <= 14) seaux[2]++; else if(j <= 30) seaux[3]++; else seaux[4]++; }); var elInfo = document.getElementById('ncp-delai-info'); if(elInfo) elInfo.textContent = 'Jours entre la creation et la derniere mise a jour de la fiche. Moyenne ' + (nMes ? (somme / nMes).toFixed(1) : '-') + ' j sur ' + nMes + ' fiches, ' + sup7 + ' au-dela de 7 jours. ' + nonSoldees + ' fiches ne sont pas encore liberees par la qualite.'; if(_ncpDelaiChart){ _ncpDelaiChart.destroy(); _ncpDelaiChart = null; } _ncpDelaiChart = new Chart(ctxDe, { type: 'bar', data: { labels: ['0-2 j', '3-7 j', '8-14 j', '15-30 j', 'plus de 30 j'], datasets: [{ data: seaux, backgroundColor: ['#10b981', '#34d399', '#f59e0b', '#f97316', '#ef4444'], borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#8b90a4' } }, y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' } } } } }); }   // --- Tonnage bloque par client ---
  // Remplace l ancien donut 'Repartition par unite' : trois parts quasi egales
  // n apportaient aucune information exploitable.
  var ctxTo = document.getElementById('ncpTonnageChart');
  if(ctxTo && typeof Chart !== 'undefined'){
    var parFam = {};
    filtresKPI.forEach(function(r){
      var t = parseFloat(r.total_tonnes) || 0;
      if(t <= 0) return;
      var fam = r.famille_produit || 'Inconnu';
      parFam[fam] = (parFam[fam] || 0) + t;
    });
    var topFam = Object.keys(parFam).sort(function(x, y){ return parFam[y] - parFam[x]; }).slice(0, 10);
    if(_ncpTonnageChart){ _ncpTonnageChart.destroy(); _ncpTonnageChart = null; }
    if(topFam.length){
      _ncpTonnageChart = new Chart(ctxTo, {
        type: 'bar',
        data: { labels: topFam, datasets: [{ data: topFam.map(function(f){ return Math.round(parFam[f]); }), backgroundColor: '#10b981', borderRadius: 4 }] },
        options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(c){ return c.parsed.x + ' t bloquees'; } } } },
          scales: {
            x: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' } },
            y: { grid: { display: false }, ticks: { color: '#8b90a4', font: { size: 11 } } }
          } }
      });
    }
  }

  // --- Top lignes (cause directe uniquement, exclut les consequences Production) ---
  var ctxLi = document.getElementById('ncpLignesChart');
  if(ctxLi && typeof Chart !== 'undefined'){
    var parLigne = {};
    filtresKPI.forEach(function(r){
      if(!r.ligne || r.ligne_type !== 'cause_directe') return;
      parLigne[r.ligne] = (parLigne[r.ligne] || 0) + 1;
    });
    var topLignes = Object.keys(parLigne).sort(function(a,b){ return parLigne[b]-parLigne[a]; }).slice(0,10);
    if(_ncpLignesChart){ _ncpLignesChart.destroy(); _ncpLignesChart = null; }
    if(topLignes.length){
      _ncpLignesChart = new Chart(ctxLi, {
        type: 'bar',
        data: { labels: topLignes, datasets: [{ data: topLignes.map(function(l){ return parLigne[l]; }), backgroundColor: '#3b82f6', borderRadius: 4 }] },
        options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
          scales: { x: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' } }, y: { grid: { display: false }, ticks: { color: '#8b90a4' } } } }
      });
    }
  }

  // --- Top produits ---
  var ctxPr = document.getElementById('ncpProduitsChart');
  if(ctxPr && typeof Chart !== 'undefined'){
    var parProduit = {};
    filtresKPI.forEach(function(r){
      if(!r.code_produit) return;
      parProduit[r.code_produit] = (parProduit[r.code_produit] || 0) + 1;
    });
    var topProduits = Object.keys(parProduit).sort(function(a,b){ return parProduit[b]-parProduit[a]; }).slice(0,10);
    if(_ncpProduitsChart){ _ncpProduitsChart.destroy(); _ncpProduitsChart = null; }
    if(topProduits.length){
      _ncpProduitsChart = new Chart(ctxPr, {
        type: 'bar',
        data: { labels: topProduits, datasets: [{ data: topProduits.map(function(p){ return parProduit[p]; }), backgroundColor: '#f97316', borderRadius: 4 }] },
        options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
          scales: { x: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' } }, y: { grid: { display: false }, ticks: { color: '#8b90a4' } } } }
      });
    }
  }

  // --- Table (200 plus recents) ---
  var tbody = document.getElementById('ncp-tbody');
  ncpInitClicks(); ncpBuildDeclarants(filtresKPI); ncpBuildRecurrences(filtresKPI); var countEl = document.getElementById('ncp-liste-count');
  if(countEl) countEl.textContent = '(' + filtres.length + ')';
  if(tbody){
    var tries = filtres.slice().sort(function(a,b){ return (b.created_date_iso||'').localeCompare(a.created_date_iso||''); });
    var LIMITE = 200;
    LIMITE = NCP_TOUT ? 999999 : 200; var tronque = tries.length > LIMITE;
    var affiches = tries.slice(0, LIMITE);
    tbody.innerHTML = affiches.map(function(r){
      var eq = ncpGetEquipe(r);
      var typeColor = r.type_ncp === 'Inpak' ? 'var(--amber)' : 'var(--red)';
      var autreDeclarant = ncpEstNonClasse(r);
      return '<tr>'
        + '<td style="font-family:var(--mo);font-size:11px;color:var(--tx);font-weight:600">' + (r.de_cote ? '<span title="Mis de cote" style="color:var(--blue);margin-right:5px;vertical-align:middle">&#128204;</span>' : '') + (r.commentaire_perso ? '<span title="' + ncpEsc(r.commentaire_perso) + '" style="color:var(--amber);margin-right:5px;vertical-align:middle">&#9998;</span>' : '') + (r.controle_perso ? '<span title="Controle par ' + ncpEsc(r.controle_par || '?') + ' le ' + ncpEsc(r.controle_date || '?') + '" style="color:var(--green);margin-right:5px;vertical-align:middle">&#10003;</span>' : '') + (autreDeclarant ? '<span title="Bloque par une personne autre qu\'Inpak ou Production (' + ncpEsc(ncpNomAff(r.reporter)) + ')" style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#a78bfa;margin-right:6px;vertical-align:middle"></span>' : '') + (r.notification || '-') + '</td>' + '<td style="font-family:var(--mo);font-size:12px">' + dFR(r.created_date_iso) + '<span style="color:var(--tx3);font-size:10px"> (' + ncpJour(r.created_date_iso) + ')</span>' + ncpBadgeSrc(r) + '</td>'
        + '<td>' + (r.unite || '-') + '</td>'
        + '<td>' + (eq || '-') + ncpEtiquetteMulti(r) + '</td>'
        + '<td style="color:' + typeColor + ';font-weight:600">' + r.type_ncp + '</td>'
        + '<td>' + (r.ligne || '-') + (r.ligne_type === 'consequence_blocage_aval' ? ' <span style="color:var(--tx3);font-size:10px">(consequence)</span>' : '') + (r.type_ncp === 'Inpak' && ncpOperateurs(r) ? '<br><span style="color:var(--tx3);font-size:10px">&#128100; ' + ncpEsc(ncpOperateurs(r)) + '</span>' : '') + '</td>'
        + '<td style="font-family:var(--mo);font-size:11px;color:var(--tx3)">' + (ncpBakorder(r) || '-') + '</td>' + '<td>' + (r.code_produit || '-') + '</td>' + '<td style="font-family:var(--mo);font-size:12px;text-align:right">' + (Number(r.total_pallets) || 0) + '</td>' + '<td style="font-family:var(--mo);font-size:12px;text-align:right">' + (Number(r.total_tonnes) || 0).toFixed(2) + ' t</td>'
        + '<td style="font-size:12px;color:var(--tx3)">' + (r.status || '-') + '</td>'
        + '<td style="font-size:12px">' + (r.description || '-') + '</td>'
        + '</tr>';
    }).join('');
    if(tronque){
      tbody.innerHTML += '<tr><td colspan="12" style="text-align:center;color:var(--tx3);padding:10px;font-size:12px">'+t('ncp_truncated').replace('{n}',LIMITE).replace('{total}',tries.length)+'</td></tr>';
    }
  }
}


// ============================================================
// ONGLET RECRUTEMENT — Évaluation mentalité candidats
// Ajouté le 07/08 — stockage Firebase (recrutement/candidats), admin only
// ============================================================
(function(){

var AXES = [
  {key:"securite", titre:"1. Sécurité des personnes et de soi-même", q:"Racontez une situation où respecter une consigne de sécurité vous a fait perdre du temps ou gêné la cadence. Qu'avez-vous fait ?",
    a1:"Contourne la règle si personne ne regarde, minimise le risque (\u00ab ça arrive jamais \u00bb).",
    a3:"Respecte les règles pour lui-même mais ne dit rien si un collègue prend un risque.",
    a5:"Respecte systématiquement, et alerte/rappelle la règle à un collègue en danger — exemple concret vécu."},
  {key:"rigueur", titre:"2. Sécurité alimentaire", q:"Un collègue saute une étape d'hygiène par gain de temps, sans conséquence visible. Vous réagissez comment ?",
    a1:"Relativise (\u00ab si ça se voit pas, c'est pas grave \u00bb).",
    a3:"Suit les règles lui-même mais n'intervient pas face aux autres.",
    a5:"Rappelle la règle avec tact, exemple vécu de vigilance réelle."},
  {key:"fiabilite", titre:"3. Fiabilité / ponctualité", q:"Le travail est en horaires postés/tournants. Racontez une période où votre rythme de vie a été bousculé par le travail — comment vous avez géré ?",
    a1:"Aucun exemple concret, minimise ou nie tout problème passé (\u00ab jamais en retard \u00bb sans contexte).",
    a3:"Reconnaît des difficultés passées, quelques ajustements ponctuels mais pas de vraie méthode.",
    a5:"Exemple précis d'organisation proactive (garde, sommeil, trajet géré à l'avance), stabilité dans la durée."},
  {key:"equipe", titre:"4. Esprit d'équipe", q:"Un collègue est clairement en difficulté sur sa cadence et ça ralentit toute la ligne. Vous faites quoi ?",
    a1:"\u00ab C'est pas mon problème \u00bb, indifférence, ou dénonciation agressive.",
    a3:"Aide si on le lui demande mais n'anticipe pas de lui-même.",
    a5:"Aide spontanée, remonte l'info intelligemment, exemple concret d'entraide vécue."},
  {key:"feedback", titre:"5. Réaction à l'erreur / au feedback", q:"Racontez la dernière fois qu'un responsable vous a fait une remarque. Réaction sur le moment, et après ?",
    a1:"Rejette systématiquement la faute sur les autres, sur la défensive, rancunier.",
    a3:"Accepte en surface (\u00ab ok \u00bb) mais sans changement observable derrière.",
    a5:"Reconnaît, explique concrètement ce qu'il/elle a changé après."},
  {key:"stress", titre:"6. Gestion du stress / cadence", q:"Décrivez une journée où tout s'enchaînait mal (retard, panne, sous-effectif). Comment vous avez tenu ?",
    a1:"Dramatise excessivement, ou nie totalement avoir été stressé (peu crédible).",
    a3:"Tient le coup, reconnaît la difficulté mais sans stratégie claire.",
    a5:"Reste factuel, cherche des solutions, exemple concret de sang-froid."},
  {key:"hierarchie", titre:"7. Rapport à la hiérarchie", q:"Qu'attendez-vous d'un chef d'équipe ? Qu'est-ce qui vous déplaît chez un mauvais manager ?",
    a1:"Attentes floues, vision très rigide/soumise, ou au contraire rejet de toute autorité.",
    a3:"Attentes basiques (\u00ab qu'on me dise ce que je dois faire \u00bb).",
    a5:"Attentes claires et matures (communication, reconnaissance) cohérentes avec un vrai collectif."},
  {key:"motivation", titre:"8. Motivation réelle", q:"Pourquoi ce poste, et pourquoi maintenant ? Qu'est-ce que vous cherchez concrètement ?",
    a1:"Réponse évasive, ou en décalage avec le poste (cherche du calme/solo alors que c'est un poste d'équipe en cadence).",
    a3:"Motivation basique (salaire, proximité) sans lien avec le collectif.",
    a5:"Motivation cohérente avec l'équipe et le rythme, réponse honnête et réfléchie."}
];

var QUESTIONNAIRE_I18N = {
  fr: {
    title: "Grille d'entretien — Sécurité, fiabilité & mentalité",
    subtitle: "Merci de répondre en donnant des exemples concrets vécus.",
    nameLabel: "Nom du candidat :",
    dateLabel: "Date :",
    axes: [
      {titre:"1. Sécurité des personnes et de soi-même", q:"Racontez une situation où respecter une consigne de sécurité vous a fait perdre du temps ou gêné la cadence. Qu'avez-vous fait ?"},
      {titre:"2. Sécurité alimentaire", q:"Un collègue saute une étape d'hygiène par gain de temps, sans conséquence visible. Vous réagissez comment ?"},
      {titre:"3. Fiabilité / ponctualité", q:"Le travail est en horaires postés/tournants. Racontez une période où votre rythme de vie a été bousculé par le travail — comment vous avez géré ?"},
      {titre:"4. Esprit d'équipe", q:"Un collègue est clairement en difficulté sur sa cadence et ça ralentit toute la ligne. Vous faites quoi ?"},
      {titre:"5. Réaction à l'erreur / au feedback", q:"Racontez la dernière fois qu'un responsable vous a fait une remarque. Réaction sur le moment, et après ?"},
      {titre:"6. Gestion du stress / cadence", q:"Décrivez une journée où tout s'enchaînait mal (retard, panne, sous-effectif). Comment vous avez tenu ?"},
      {titre:"7. Rapport à la hiérarchie", q:"Qu'attendez-vous d'un chef d'équipe ? Qu'est-ce qui vous déplaît chez un mauvais manager ?"},
      {titre:"8. Motivation réelle", q:"Pourquoi ce poste, et pourquoi maintenant ? Qu'est-ce que vous cherchez concrètement ?"}
    ]
  },
  nl: {
    title: "Interviewgrid — Veiligheid, betrouwbaarheid & mentaliteit",
    subtitle: "Gelieve te antwoorden met concrete, zelf beleefde voorbeelden.",
    nameLabel: "Naam van de kandidaat:",
    dateLabel: "Datum:",
    axes: [
      {titre:"1. Veiligheid van personen en van uzelf", q:"Vertel over een situatie waarin het naleven van een veiligheidsvoorschrift u tijd deed verliezen of het tempo hinderde. Wat heeft u gedaan?"},
      {titre:"2. Voedselveiligheid", q:"Een collega slaat een hygiënestap over om tijd te winnen, zonder zichtbaar gevolg. Hoe reageert u?"},
      {titre:"3. Betrouwbaarheid / stiptheid", q:"Het werk gebeurt in wisselende ploegendiensten. Vertel over een periode waarin uw levensritme verstoord werd door het werk — hoe heeft u dat aangepakt?"},
      {titre:"4. Teamgeest", q:"Een collega heeft duidelijk moeite met het tempo en dat vertraagt de hele lijn. Wat doet u?"},
      {titre:"5. Reactie op fouten / feedback", q:"Vertel over de laatste keer dat een leidinggevende opmerkingen maakte over uw werk. Hoe reageerde u op dat moment, en nadien?"},
      {titre:"6. Omgaan met stress / werktempo", q:"Beschrijf een dag waarop alles fout liep (vertraging, panne, onderbezetting). Hoe hield u vol?"},
      {titre:"7. Verhouding met leidinggevenden", q:"Wat verwacht u van een ploegleider? Wat stoort u aan een slechte manager?"},
      {titre:"8. Echte motivatie", q:"Waarom deze functie, en waarom nu? Wat zoekt u concreet?"}
    ]
  },
  en: {
    title: "Interview grid — Safety, reliability & mindset",
    subtitle: "Please answer with concrete examples from your own experience.",
    nameLabel: "Candidate name:",
    dateLabel: "Date:",
    axes: [
      {titre:"1. Safety of others and yourself", q:"Tell me about a time when following a safety rule cost you time or slowed down the pace. What did you do?"},
      {titre:"2. Food safety", q:"A colleague skips a hygiene step to save time, with no visible consequence. How do you react?"},
      {titre:"3. Reliability / punctuality", q:"The job involves rotating shift work. Tell me about a time your routine was disrupted by your work schedule — how did you handle it?"},
      {titre:"4. Team spirit", q:"A colleague is clearly struggling to keep up the pace and it's slowing down the whole line. What do you do?"},
      {titre:"5. Reaction to mistakes / feedback", q:"Tell me about the last time a supervisor gave you feedback on your work. How did you react in the moment, and afterward?"},
      {titre:"6. Handling stress / pace", q:"Describe a day when everything went wrong (delays, breakdown, understaffing). How did you cope?"},
      {titre:"7. Relationship with management", q:"What do you expect from a team leader? What bothers you about a bad manager?"},
      {titre:"8. Real motivation", q:"Why this job, and why now? What are you actually looking for?"}
    ]
  }
};

var candidats = [];
var editId = null;
var currentScores = {};
var currentNotes = {};
var currentVerdict = null;
var radarChart = null;
var interviewIndex = 0;
var initialized = false;
var listenerAttached = false;

function $(id){ return document.getElementById(id); }

function recToast(msg, col){
  if(typeof toast === 'function') toast(msg, col || '#3b82f6');
}

function firebaseAvailable(){
  return typeof db !== 'undefined' && db;
}

function attacherListenerCandidats(){
  if(listenerAttached) return;
  if(!firebaseAvailable()) return;
  listenerAttached = true;
  db.ref('recrutement/candidats').on('value', function(snap){
    var data = snap.val() || {};
    candidats = Object.keys(data).map(function(k){ return data[k]; });
    candidats.sort(function(a,b){ return (a.id||'').localeCompare(b.id||''); });
    renderListe();
    renderCompareChecklist();
  }, function(err){
    console.warn('[Recrutement] Erreur lecture Firebase:', err);
    recToast('Accès refusé aux données recrutement', '#ef4444');
  });
}

function sauvegarderCandidat(data){
  if(!firebaseAvailable()){ recToast('Firebase non disponible', '#ef4444'); return Promise.reject(new Error('no-db')); }
  return db.ref('recrutement/candidats/'+data.id).set(data);
}

function supprimerCandidatFB(id){
  if(!firebaseAvailable()) return Promise.reject(new Error('no-db'));
  return db.ref('recrutement/candidats/'+id).remove();
}

var AXES_POIDS = { securite: 2.5, rigueur: 2.5, fiabilite: 1.5, equipe: 1, feedback: 1, stress: 1, hierarchie: 0.75, motivation: 1 }; var AXES_CRITIQUES = ['securite', 'rigueur']; var _recDistribChart = null, _recPredChart = null, _recFunnelChart = null, _recMoisChart = null; function recVal(id){ var e = document.getElementById(id); return e ? String(e.value || '').trim() : ''; } function recSet(id, v){ var e = document.getElementById(id); if(e) e.value = v || ''; } function recScorePondere(c){ var s = c.scores || {}; var num = 0, den = 0; Object.keys(AXES_POIDS).forEach(function(k){ if(s[k]){ num += s[k] * AXES_POIDS[k]; den += AXES_POIDS[k]; } }); return den ? (num / den) : null; } function recAlerte(c){ var s = c.scores || {}; for(var i = 0; i < AXES_CRITIQUES.length; i++){ if(s[AXES_CRITIQUES[i]] && s[AXES_CRITIQUES[i]] <= 2) return AXES_CRITIQUES[i]; } return null; } function recLibelleAxe(k){ for(var i = 0; i < AXES.length; i++){ if(AXES[i].key === k) return AXES[i].titre.replace(/^[0-9]+\. /, ''); } return k; } function recIssueLabel(v){ return recT(v === 'non_retenu' ? 'non retenu' : v === 'embauche' ? 'embauche' : v === 'confirme' ? 'confirme apres essai' : v === 'parti' ? 'parti pendant l essai' : 'en cours'); } function recCouleurNote(n){ return n <= 2 ? '#ef4444' : n === 3 ? '#f59e0b' : n === 4 ? '#34d399' : '#10b981'; } function recBarres(c){ var s = c.scores || {}; var h = '<div style="display:flex;gap:3px;margin-top:6px">'; AXES.forEach(function(a){ var n = s[a.key] || 0; h += '<div title="' + a.titre.replace(/"/g, '') + ' : ' + (n || '-') + '/5" style="width:24px;height:6px;border-radius:3px;background:' + (n ? recCouleurNote(n) : 'var(--bd2)') + '"></div>'; }); return h + '</div>'; } function recSauverBrouillon(){ try { localStorage.setItem('rec_brouillon', JSON.stringify({ id: editId, nom: recVal('rec-f-nom'), scores: currentScores, notes: currentNotes, verdict: currentVerdict, ts: Date.now() })); } catch(e){} } function recEffacerBrouillon(){ try { localStorage.removeItem('rec_brouillon'); } catch(e){} } function recRestaurerBrouillon(){ var b = null; try { b = JSON.parse(localStorage.getItem('rec_brouillon') || 'null'); } catch(e){} if(!b || !b.scores || !Object.keys(b.scores).length) return; if(!confirm(recT('Un entretien non enregistre a ete retrouve') + (b.nom ? ' (' + b.nom + ')' : '') + recT('. Le reprendre ?'))){ recEffacerBrouillon(); return; } editId = b.id || null; currentScores = b.scores || {}; currentNotes = b.notes || {}; currentVerdict = b.verdict || null; recSet('rec-f-nom', b.nom); syncFormulaireDepuisState(); } function recRemplirEmployes(){ var sel = document.getElementById('rec-f-empid'); if(!sel || sel.getAttribute('data-fill')) return; sel.setAttribute('data-fill', '1'); var h = '<option value="">-</option>'; (window.EMP || []).forEach(function(e){ if(e.id) h += '<option value="' + e.id + '">' + e.n + '</option>'; }); sel.innerHTML = h; } function recBradford(c){ if(!c.empId) return null; var emp = (window.EMP || []).filter(function(e){ return e.id === c.empId; })[0]; if(!emp) return null; var b = (window.BD || []).filter(function(x){ return x.n === emp.n; })[0]; return (b && typeof b.sc === 'number') ? b.sc : null; } function verdictLabel(v){
  return recT(v==='bon' ? 'Bon fit' : v==='creuser' ? 'À creuser' : v==='incompatible' ? 'Incompatible' : 'En cours');
}
function verdictPillClass(v){
  return v==='bon' ? 'ok' : v==='creuser' ? 'wn' : v==='incompatible' ? 'cr' : 'rec-encours';
}

// ---------- Sous-navigation (Candidats / Entretien / Analyse) ----------
function goToSubnav(name){
  document.querySelectorAll('#pane-recrutement .rec-subtab').forEach(function(b){
    b.classList.toggle('on', b.dataset.recsub === name);
  });
  document.querySelectorAll('#pane-recrutement .rec-section').forEach(function(s){
    s.classList.toggle('on', s.id === 'rec-tab-'+name);
  });
}
var REC_LBL_NL = { 'Candidats': 'Kandidaten', '+ Entretien': '+ Gesprek', 'Analyse': 'Analyse', 'Candidats évalués': 'Beoordeelde kandidaten', 'Identité': 'Identiteit', 'Nom du candidat': 'Naam kandidaat', 'Date de l\'entretien': 'Datum gesprek', 'Poste vise': 'Functie', 'Unite': 'Unit', 'Regime horaire': 'Uurregeling', 'Evaluateur': 'Beoordelaar', 'Suite donnee': 'Resultaat', 'Employe lie (suivi a 12 mois)': 'Gelinkte medewerker', 'Annuler': 'Annuleren', 'Enregistrer': 'Opslaan', 'Verdict global de compatibilité': 'Algemeen besluit', 'Vérification des références — assiduité': 'Referentiecheck aanwezigheid', 'Comparer des candidats': 'Kandidaten vergelijken', 'Détail des scores': 'Detail van de scores', 'Distribution des notes par axe': 'Spreiding van de scores per as', 'Prediction contre realite': 'Voorspelling tegenover realiteit', 'Entonnoir de recrutement': 'Wervingsfunnel', 'Entretiens par mois': 'Gesprekken per maand', 'Grille d’évaluation': 'Evaluatieraster', 'Questionnaire imprimable (candidat)': 'Printbare vragenlijst (kandidaat)', 'Mode entretien (plein écran)': 'Gespreksmodus (volledig scherm)' , "Voir les rep\u00e8res de notation": "Bekijk de scoringsrichtlijnen", "Masquer les rep\u00e8res": "Verberg de richtlijnen", "Alerte": "Waarschuwing", "Excellent": "Uitstekend", "Exemple concret donn\u00e9 (optionnel)": "Concreet gegeven voorbeeld (optioneel)", "Bon fit": "Goede match", "\u00c0 creuser": "Nader te bekijken", "Incompatible": "Niet compatibel", "En cours": "Lopend", "non retenu": "niet weerhouden", "embauche": "aangeworven", "confirme apres essai": "bevestigd na proefperiode", "parti pendant l essai": "vertrokken tijdens proefperiode", "en cours": "lopend", "Crit\u00e8re": "Criterium", "Pr\u00e9c\u00e9dent": "Vorige", "Ajoute au moins 2 candidats pour comparer.": "Voeg minstens 2 kandidaten toe om te vergelijken.", "Aucun candidat pour l'instant.": "Nog geen kandidaat.", "Lance un entretien pour commencer.": "Start een gesprek om te beginnen.", "Exporter PDF": "PDF exporteren", "Supprimer": "Verwijderen", "Exporter (JSON)": "Exporteren (JSON)", "Importer": "Importeren", "Point \u00e0 v\u00e9rifier en p\u00e9riode d'essai": "Aandachtspunt tijdens de proefperiode", "Statut de la v\u00e9rification": "Status van de controle", "Notes (optionnel)": "Notities (optioneel)", "Pas encore v\u00e9rifi\u00e9": "Nog niet gecontroleerd", "Contact\u00e9e \u2014 retour positif sur l'assiduit\u00e9": "Gecontacteerd — positieve feedback over aanwezigheid", "Contact\u00e9e \u2014 point d'attention signal\u00e9": "Gecontacteerd — aandachtspunt gemeld", "Ancien employeur injoignable / refus": "Vorige werkgever onbereikbaar / weigering", "Candidat supprim\u00e9": "Kandidaat verwijderd", "Fichier t\u00e9l\u00e9charg\u00e9 \u2014 ouvre-le pour imprimer": "Bestand gedownload — open het om af te drukken", "Impossible de g\u00e9n\u00e9rer le fichier": "Kan het bestand niet genereren", "Entretien enregistr\u00e9": "Gesprek opgeslagen", "Erreur lors de l\u2019enregistrement": "Fout bij het opslaan", "Ajoute un nom": "Voeg een naam toe", "Export t\u00e9l\u00e9charg\u00e9": "Export gedownload", "Erreur export": "Fout bij export", "Fichier invalide": "Ongeldig bestand", "Rien de nouveau \u00e0 importer": "Niets nieuws om te importeren", "Import r\u00e9ussi": "Import geslaagd", "Erreur import": "Importfout", "Renseigne le verdict pour terminer": "Vul het besluit in om af te ronden", "Supprimer l\u2019entretien de": "Verwijder het gesprek met", "? Cette action est irr\u00e9versible.": "? Deze actie is onomkeerbaar.", "Une fiche existe deja pour": "Er bestaat al een fiche voor", "(entretien du": "(gesprek van", "). Creer une seconde fiche quand meme ?": "). Toch een tweede fiche aanmaken?", "Note eliminatoire (1 ou 2) sur": "Uitsluitende score (1 of 2) op", ". En agroalimentaire ce critere ne se compense pas par les autres. Enregistrer quand meme en Bon fit ?": ". In de voedingsindustrie wordt dit criterium niet gecompenseerd door de andere. Toch opslaan als Goede match?", "Le verdict \u00ab Bon fit \u00bb semble en d\u00e9calage avec des scores plut\u00f4t bas sur certains crit\u00e8res. Enregistrer quand m\u00eame ?": "Het besluit \"Goede match\" lijkt niet overeen te komen met eerder lage scores op bepaalde criteria. Toch opslaan?", "Le verdict \u00ab Incompatible \u00bb semble en d\u00e9calage avec des scores plut\u00f4t hauts. Enregistrer quand m\u00eame ?": "Het besluit \"Niet compatibel\" lijkt niet overeen te komen met eerder hoge scores. Toch opslaan?", "nouveau(x) candidat(s) trouv\u00e9(s). Les ajouter ?": "nieuwe kandida(a)t(en) gevonden. Toevoegen?", "Un entretien non enregistre a ete retrouve": "Er is een niet-opgeslagen gesprek teruggevonden", ". Le reprendre ?": ". Hervatten?", "Terminer": "Voltooien", "Suivant": "Volgende", "Ce que le candidat a r\u00e9pondu concr\u00e8tement...": "Wat de kandidaat concreet heeft geantwoord...", "Note eliminatoire sur": "Uitsluitende score op", "ALERTE SECURITE": "VEILIGHEIDSWAARSCHUWING", "Point d\u2019attention assiduit\u00e9": "Aandachtspunt aanwezigheid", "Uniquement les questions, sans les rep\u00e8res de notation. T\u00e9l\u00e9charge un fichier \u00e0 ouvrir puis imprimer depuis ton navigateur.": "Alleen de vragen, zonder de scoringsrichtlijnen. Download een bestand om te openen en af te drukken vanuit je browser.", "\u00c0 renseigner apr\u00e8s contact avec l'ancien employeur, pas une question pos\u00e9e directement au candidat.": "In te vullen na contact met de vorige werkgever, geen vraag die rechtstreeks aan de kandidaat wordt gesteld.", "Sur tous les candidats evalues. Un axe ou tout le monde a la meme note ne discrimine rien et doit etre reformule.": "Over alle beoordeelde kandidaten. Een as waarop iedereen dezelfde score heeft, onderscheidt niets en moet worden herschreven.", "Evalues, juges bon fit, embauches, puis confirmes apres la periode d essai.": "Beoordeeld, als goede match beoordeeld, aangeworven, en vervolgens bevestigd na de proefperiode.", "Charge d entretiens sur les 12 derniers mois.": "Aantal gesprekken over de laatste 12 maanden." };
var REC_LBL_EN = { 'Candidats': 'Candidates', '+ Entretien': '+ Interview', 'Analyse': 'Analysis', 'Candidats évalués': 'Assessed candidates', 'Identité': 'Identity', 'Nom du candidat': 'Candidate name', 'Date de l\'entretien': 'Interview date', 'Poste vise': 'Target position', 'Unite': 'Unit', 'Regime horaire': 'Shift schedule', 'Evaluateur': 'Assessor', 'Suite donnee': 'Outcome', 'Employe lie (suivi a 12 mois)': 'Linked employee', 'Annuler': 'Cancel', 'Enregistrer': 'Save', 'Verdict global de compatibilité': 'Overall fit verdict', 'Vérification des références — assiduité': 'Reference check — attendance', 'Comparer des candidats': 'Compare candidates', 'Détail des scores': 'Score detail', 'Distribution des notes par axe': 'Score distribution per axis', 'Prediction contre realite': 'Prediction vs reality', 'Entonnoir de recrutement': 'Recruitment funnel', 'Entretiens par mois': 'Interviews per month', 'Grille d’évaluation': 'Assessment grid', 'Questionnaire imprimable (candidat)': 'Printable questionnaire (candidate)', 'Mode entretien (plein écran)': 'Interview mode (full screen)' , "Voir les rep\u00e8res de notation": "View scoring guidelines", "Masquer les rep\u00e8res": "Hide guidelines", "Alerte": "Alert", "Excellent": "Excellent", "Exemple concret donn\u00e9 (optionnel)": "Concrete example given (optional)", "Bon fit": "Good fit", "\u00c0 creuser": "To dig into", "Incompatible": "Incompatible", "En cours": "In progress", "non retenu": "not selected", "embauche": "hired", "confirme apres essai": "confirmed after trial", "parti pendant l essai": "left during trial", "en cours": "in progress", "Crit\u00e8re": "Criterion", "Pr\u00e9c\u00e9dent": "Previous", "Ajoute au moins 2 candidats pour comparer.": "Add at least 2 candidates to compare.", "Aucun candidat pour l'instant.": "No candidate yet.", "Lance un entretien pour commencer.": "Start an interview to begin.", "Exporter PDF": "Export PDF", "Supprimer": "Delete", "Exporter (JSON)": "Export (JSON)", "Importer": "Import", "Point \u00e0 v\u00e9rifier en p\u00e9riode d'essai": "Point to verify during trial period", "Statut de la v\u00e9rification": "Verification status", "Notes (optionnel)": "Notes (optional)", "Pas encore v\u00e9rifi\u00e9": "Not yet verified", "Contact\u00e9e \u2014 retour positif sur l'assiduit\u00e9": "Contacted — positive feedback on attendance", "Contact\u00e9e \u2014 point d'attention signal\u00e9": "Contacted — concern flagged", "Ancien employeur injoignable / refus": "Previous employer unreachable / refused", "Candidat supprim\u00e9": "Candidate deleted", "Fichier t\u00e9l\u00e9charg\u00e9 \u2014 ouvre-le pour imprimer": "File downloaded — open it to print", "Impossible de g\u00e9n\u00e9rer le fichier": "Unable to generate the file", "Entretien enregistr\u00e9": "Interview saved", "Erreur lors de l\u2019enregistrement": "Error while saving", "Ajoute un nom": "Add a name", "Export t\u00e9l\u00e9charg\u00e9": "Export downloaded", "Erreur export": "Export error", "Fichier invalide": "Invalid file", "Rien de nouveau \u00e0 importer": "Nothing new to import", "Import r\u00e9ussi": "Import successful", "Erreur import": "Import error", "Renseigne le verdict pour terminer": "Fill in the verdict to finish", "Supprimer l\u2019entretien de": "Delete the interview with", "? Cette action est irr\u00e9versible.": "? This action cannot be undone.", "Une fiche existe deja pour": "A record already exists for", "(entretien du": "(interview from", "). Creer une seconde fiche quand meme ?": "). Create a second record anyway?", "Note eliminatoire (1 ou 2) sur": "Disqualifying score (1 or 2) on", ". En agroalimentaire ce critere ne se compense pas par les autres. Enregistrer quand meme en Bon fit ?": ". In food manufacturing this criterion cannot be offset by others. Save as Good fit anyway?", "Le verdict \u00ab Bon fit \u00bb semble en d\u00e9calage avec des scores plut\u00f4t bas sur certains crit\u00e8res. Enregistrer quand m\u00eame ?": "The \"Good fit\" verdict seems inconsistent with rather low scores on some criteria. Save anyway?", "Le verdict \u00ab Incompatible \u00bb semble en d\u00e9calage avec des scores plut\u00f4t hauts. Enregistrer quand m\u00eame ?": "The \"Incompatible\" verdict seems inconsistent with rather high scores. Save anyway?", "nouveau(x) candidat(s) trouv\u00e9(s). Les ajouter ?": "new candidate(s) found. Add them?", "Un entretien non enregistre a ete retrouve": "An unsaved interview was found", ". Le reprendre ?": ". Resume it?", "Terminer": "Finish", "Suivant": "Next", "Ce que le candidat a r\u00e9pondu concr\u00e8tement...": "What the candidate concretely answered...", "Note eliminatoire sur": "Disqualifying score on", "ALERTE SECURITE": "SAFETY ALERT", "Point d\u2019attention assiduit\u00e9": "Attendance concern", "Uniquement les questions, sans les rep\u00e8res de notation. T\u00e9l\u00e9charge un fichier \u00e0 ouvrir puis imprimer depuis ton navigateur.": "Questions only, without the scoring guidelines. Download a file to open and print from your browser.", "\u00c0 renseigner apr\u00e8s contact avec l'ancien employeur, pas une question pos\u00e9e directement au candidat.": "To fill in after contacting the previous employer, not a question asked directly to the candidate.", "Sur tous les candidats evalues. Un axe ou tout le monde a la meme note ne discrimine rien et doit etre reformule.": "Across all assessed candidates. An axis where everyone has the same score discriminates nothing and should be reworded.", "Evalues, juges bon fit, embauches, puis confirmes apres la periode d essai.": "Assessed, judged good fit, hired, then confirmed after the trial period.", "Charge d entretiens sur les 12 derniers mois.": "Interview load over the last 12 months." };
function recTexteFR(el){ if(!el.getAttribute('data-fr')) el.setAttribute('data-fr', el.textContent.trim()); return el.getAttribute('data-fr'); }
function recT(fr){ var l = (typeof LANG !== 'undefined' ? LANG : 'fr'); var m = l === 'nl' ? REC_LBL_NL : (l === 'en' ? REC_LBL_EN : null); return (m && m[fr]) ? m[fr] : fr; }
window.recAppliquerLangue = function(){
  var pane = document.getElementById('pane-recrutement'); if(!pane) return;
  var l = (typeof LANG !== 'undefined' ? LANG : 'fr');
  var recLbl = l === 'nl' ? REC_LBL_NL : (l === 'en' ? REC_LBL_EN : null);
  pane.querySelectorAll('.cct, label, .rec-subtab, .rec-empty-line, .rec-hint, #rec-f-ref-statut option, #rec-btn-annuler, #rec-btn-enregistrer, #rec-btn-mode-entretien, #rec-btn-pdf, #rec-btn-supprimer, #rec-btn-export-json, #rec-btn-import-json, #rec-io-prev, #rec-verdict-choix button').forEach(function(el){
    var fr = recTexteFR(el);
    var m2 = fr.match(/^([^\p{L}]*)(.*)$/u);
    var prefix = m2 ? m2[1] : '', core = m2 ? m2[2] : fr;
    var translated = (recLbl && recLbl[core]) ? recLbl[core] : core;
    el.textContent = prefix + translated;
  });
  var qi = QUESTIONNAIRE_I18N[l] || QUESTIONNAIRE_I18N.fr;
  if(qi && qi.axes){
    pane.querySelectorAll('.rec-axe').forEach(function(div, i){
      if(!qi.axes[i]) return;
      var tEl = div.querySelector('.rec-axe-titre');
      var qEl = div.querySelector('.rec-axe-question');
      if(tEl) tEl.textContent = qi.axes[i].titre;
      if(qEl) qEl.textContent = qi.axes[i].q;
    });
  }
  if(typeof renderListe === 'function' && document.getElementById('rec-liste-items')) renderListe();
  if(typeof renderAnalyse === 'function' && document.getElementById('rec-radar')) renderAnalyse();
}; function initSubnav(){
  document.querySelectorAll('#pane-recrutement .rec-subtab').forEach(function(btn){
    btn.addEventListener('click', function(){ goToSubnav(btn.dataset.recsub); });
  });
}

// ---------- Grille d'axes ----------
function buildAxes(){
  var c = $('rec-axes-container');
  if(!c) return;
  c.innerHTML = '<div class="cch"><div class="cct">'+recT('Grille d\u2019évaluation')+'</div></div>';
  AXES.forEach(function(axe){
    var div = document.createElement('div');
    div.className = 'rec-axe';
    div.innerHTML =
      '<div class="rec-axe-titre">'+axe.titre+'</div>'+
      '<div class="rec-axe-question">'+axe.q+'</div>'+
      '<button type="button" class="rec-toggle-reperes">'+recT('Voir les repères de notation')+' \u25be</button>'+
      '<div class="rec-reperes rec-hidden">'+
        '<div class="rec-repere"><span class="rec-repere-n rec-s1">1</span>'+axe.a1+'</div>'+
        '<div class="rec-repere"><span class="rec-repere-n rec-s3">3</span>'+axe.a3+'</div>'+
        '<div class="rec-repere"><span class="rec-repere-n rec-s4">5</span>'+axe.a5+'</div>'+
      '</div>'+
      '<div class="rec-scale" data-axe="'+axe.key+'">'+
        [1,2,3,4,5].map(function(n){ return '<button type="button" data-n="'+n+'">'+n+'</button>'; }).join('')+
      '</div>'+
      '<div class="rec-scale-labels"><span>'+recT('Alerte')+'</span><span>'+recT('Excellent')+'</span></div>'+
      '<div class="rec-axe-note-label">'+recT('Exemple concret donné (optionnel)')+'</div>'+
      '<textarea class="rec-axe-note" data-axe="'+axe.key+'" placeholder="'+recT('Ce que le candidat a répondu concrètement...')+'"></textarea>';
    c.appendChild(div);
  });
  c.querySelectorAll('.rec-toggle-reperes').forEach(function(t){
    t.addEventListener('click', function(){
      var rep = t.nextElementSibling;
      rep.classList.toggle('rec-hidden');
      t.textContent = rep.classList.contains('rec-hidden') ? (recT('Voir les repères de notation')+' \u25be') : (recT('Masquer les repères')+' \u25b4');
    });
  });
  c.querySelectorAll('.rec-scale').forEach(function(scale){
    scale.querySelectorAll('button').forEach(function(b){
      b.addEventListener('click', function(){
        scale.querySelectorAll('button').forEach(function(x){ x.classList.remove('sel'); });
        b.classList.add('sel');
        currentScores[scale.dataset.axe] = parseInt(b.dataset.n, 10); recSauverBrouillon();
      });
    });
  });
  c.querySelectorAll('.rec-axe-note').forEach(function(t){
    t.addEventListener('input', function(){ currentNotes[t.dataset.axe] = t.value; recSauverBrouillon(); });
  });
}

// ---------- Formulaire ----------
function resetFormulaire(){
  editId = null;
  currentScores = {};
  currentNotes = {};
  currentVerdict = null;
  $('rec-f-nom').value = '';
  $('rec-f-date').value = new Date().toISOString().slice(0,10);
  $('rec-f-suivi').value = '';
  $('rec-f-ref-statut').value = '';
  $('rec-f-ref-notes').value = '';  ['rec-f-poste','rec-f-unite','rec-f-shift','rec-f-evaluateur','rec-f-issue','rec-f-empid'].forEach(function(id){ recSet(id, ''); });
  document.querySelectorAll('#pane-recrutement .rec-scale button').forEach(function(b){ b.classList.remove('sel'); });
  document.querySelectorAll('#pane-recrutement .rec-verdict-choix button').forEach(function(b){ b.className=''; });
  document.querySelectorAll('#pane-recrutement .rec-axe-note').forEach(function(t){ t.value=''; });
  $('rec-edit-actions').style.display = 'none';
}

function ouvrirCandidat(id){
  var c = candidats.filter(function(x){ return x.id===id; })[0];
  if(!c) return;
  resetFormulaire();
  editId = c.id;
  currentScores = Object.assign({}, c.scores || {});
  currentNotes = Object.assign({}, c.notes || {});
  currentVerdict = c.verdict;
  $('rec-f-nom').value = c.nom;
  $('rec-f-date').value = c.date;
  $('rec-f-suivi').value = c.suivi || '';
  $('rec-f-ref-statut').value = (c.reference && c.reference.statut) || '';
  $('rec-f-ref-notes').value = (c.reference && c.reference.notes) || '';  recRemplirEmployes(); recSet('rec-f-poste', c.poste); recSet('rec-f-unite', c.unite); recSet('rec-f-shift', c.shift); recSet('rec-f-evaluateur', c.evaluateur); recSet('rec-f-issue', c.issue); recSet('rec-f-empid', c.empId);
  document.querySelectorAll('#pane-recrutement .rec-scale').forEach(function(scale){
    var val = currentScores[scale.dataset.axe];
    scale.querySelectorAll('button').forEach(function(b){
      b.classList.toggle('sel', parseInt(b.dataset.n,10)===val);
    });
  });
  document.querySelectorAll('#pane-recrutement .rec-axe-note').forEach(function(t){
    t.value = currentNotes[t.dataset.axe] || '';
  });
  if(currentVerdict){
    var btn = document.querySelector('#pane-recrutement .rec-verdict-choix button[data-v="'+currentVerdict+'"]');
    if(btn) btn.classList.add('sel-'+currentVerdict);
  }
  $('rec-edit-actions').style.display = 'flex';
  goToSubnav('formulaire');
}

// ---------- Liste ----------
function renderListe(){
  var wrap = $('rec-liste-items');
  var vide = $('rec-liste-vide');
  if(!wrap || !vide) return;
  wrap.innerHTML = '';
  if(!candidats.length){ vide.style.display='block'; return; }
  vide.style.display='none';
  candidats.slice().reverse().forEach(function(c){
    var vals = Object.keys(c.scores||{}).map(function(k){ return c.scores[k]; });
    var moyenne = vals.length ? (vals.reduce(function(a,b){return a+b;},0)/vals.length).toFixed(1) : '-';
    var outer = document.createElement('div');
    outer.className = 'rec-liste-item-wrap';
    var div = document.createElement('div');
    div.className = 'rec-liste-item';
    div.innerHTML =
      '<div style="flex:1"><div class="rec-nom">'+c.nom+(recAlerte(c) ? ' <span title="'+recT('Note eliminatoire sur')+' '+recLibelleAxe(recAlerte(c))+'" style="color:#ef4444;font-size:11px;font-weight:700">&#9888; '+recT('ALERTE SECURITE')+'</span>' : '')+'</div><div class="rec-meta">'+c.date+' &middot; pondere '+(recScorePondere(c)!==null?recScorePondere(c).toFixed(1):'-')+'/5 &middot; brut '+moyenne+'/5'+(c.poste?' &middot; '+c.poste:'')+(c.unite?' '+c.unite:'')+' &middot; '+recIssueLabel(c.issue)+'</div>'+recBarres(c)+'</div>'+
      '<div style="display:flex;align-items:center;gap:6px">'+
      (c.reference && c.reference.statut==='surveiller' ? '<span title="'+recT('Point d\u2019attention assiduité')+'" style="font-size:14px">\u26a0\ufe0f</span>' : '')+
      '<span class="pill '+verdictPillClass(c.verdict)+'">'+verdictLabel(c.verdict)+'</span>'+
      '</div>';
    div.addEventListener('click', function(){ ouvrirCandidat(c.id); });
    var del = document.createElement('button');
    del.className = 'rec-btn-suppr-mini';
    del.textContent = '\ud83d\uddd1';
    del.addEventListener('click', function(e){
      e.stopPropagation();
      if(confirm(recT('Supprimer l\u2019entretien de')+' '+c.nom+' '+recT('? Cette action est irréversible.'))){
        supprimerCandidatFB(c.id).then(function(){ recToast(recT('Candidat supprimé'), '#ef4444'); });
      }
    });
    outer.appendChild(div);
    outer.appendChild(del);
    wrap.appendChild(outer);
  });
}

// ---------- Impression (téléchargement HTML autonome) ----------
function enveloppeImprimable(titre, corps){
  return '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>'+titre+'</title><style>'+
    'body{font-family:Arial,Helvetica,sans-serif;color:#111;max-width:760px;margin:30px auto;padding:0 16px}'+
    'h1{font-size:21px;margin-bottom:2px}.pa-meta{font-size:12.5px;color:#555;margin-bottom:18px}'+
    '.pa-verdict{font-size:14px;font-weight:bold;margin-bottom:14px}.pa-field{font-size:13.5px;margin-bottom:10px}'+
    'table{width:100%;border-collapse:collapse;margin-bottom:16px}'+
    'th,td{border:1px solid #ccc;padding:7px 9px;text-align:left;font-size:12.5px;vertical-align:top}th{background:#f0f0f0}'+
    '.q-block{margin-bottom:22px;page-break-inside:avoid}.q-num{font-weight:bold;font-size:14px;margin-bottom:4px}'+
    '.q-text{font-size:12.5px;color:#333;margin-bottom:8px;line-height:1.45}.q-box{border:1px solid #999;border-radius:4px;height:78px}'+
    '.print-hint{background:#FFF6DD;border:1px solid #F0D98C;border-radius:8px;padding:10px 14px;font-size:12.5px;margin-bottom:22px;color:#5a4a1a}'+
    '@media print{.print-hint{display:none}}'+
    '</style></head><body>'+
    '<div class="print-hint">Ouvre le menu de ton navigateur puis choisis <strong>Imprimer</strong> ou <strong>Enregistrer en PDF</strong>.</div>'+
    corps+'</body></html>';
}
function telechargerHTML(filename, htmlContent){
  try{
    var blob = new Blob([htmlContent], {type:'text/html'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    recToast('Fichier téléchargé — ouvre-le pour imprimer', '#10b981');
  }catch(e){
    recToast('Impossible de générer le fichier', '#ef4444');
  }
}
function exporterFichePDF(){
  if(!editId) return;
  var c = candidats.filter(function(x){ return x.id===editId; })[0];
  if(!c) return;
  var rows = AXES.map(function(a){
    var score = (c.scores && c.scores[a.key]) ? c.scores[a.key] : '-';
    var note = (c.notes && c.notes[a.key]) ? c.notes[a.key] : '';
    return '<tr><td>'+a.titre+'</td><td style="text-align:center">'+score+'/5</td><td>'+note+'</td></tr>';
  }).join('');
  var refLabels = {positif:"Retour positif sur l'assiduité", surveiller:"Point d'attention signalé", injoignable:"Ancien employeur injoignable / refus"};
  var refLabel = (c.reference && c.reference.statut) ? refLabels[c.reference.statut] : 'Non vérifié';
  var corps =
    '<h1>Évaluation mentalité — '+c.nom+'</h1>'+
    '<div class="pa-meta">Entretien du '+c.date+' &middot; Ploeg 5 — AW3</div>'+
    '<div class="pa-verdict">Verdict global : '+verdictLabel(c.verdict)+'</div>'+
    '<table><tr><th>Critère</th><th>Score</th><th>Exemple concret / notes</th></tr>'+rows+'</table>'+
    '<div style="margin-bottom:10px"><strong>Vérification référence — assiduité :</strong> '+refLabel+(c.reference && c.reference.notes ? '<br>'+c.reference.notes : '')+'</div>'+
    (c.suivi ? '<div><strong>Point à vérifier en période d\u2019essai :</strong><br>'+c.suivi+'</div>' : '');
  var html = enveloppeImprimable('Fiche — '+c.nom, corps);
  var nomFichier = 'fiche-'+c.nom.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')+'.html';
  telechargerHTML(nomFichier, html);
}
function imprimerQuestionnaire(lang){
  var t = QUESTIONNAIRE_I18N[lang];
  var blocks = t.axes.map(function(a){
    return '<div class="q-block"><div class="q-num">'+a.titre+'</div><div class="q-text">'+a.q+'</div><div class="q-box"></div></div>';
  }).join('');
  var corps =
    '<h1>'+t.title+'</h1><div class="pa-meta">'+t.subtitle+'</div>'+
    '<div class="pa-field">'+t.nameLabel+' ____________________________________</div>'+
    '<div class="pa-field">'+t.dateLabel+' ____________________________________</div>'+
    '<div style="margin-top:14px">'+blocks+'</div>';
  var html = enveloppeImprimable(t.title, corps);
  telechargerHTML('questionnaire-candidat-'+lang+'.html', html);
}

// ---------- Mode entretien plein écran ----------
function syncFormulaireDepuisState(){
  document.querySelectorAll('#rec-axes-container .rec-scale').forEach(function(scale){
    var key = scale.dataset.axe;
    scale.querySelectorAll('button').forEach(function(b){
      b.classList.toggle('sel', parseInt(b.dataset.n,10)===currentScores[key]);
    });
  });
  document.querySelectorAll('#rec-axes-container .rec-axe-note').forEach(function(t){
    t.value = currentNotes[t.dataset.axe] || '';
  });
}
function openInterviewStep(){
  var axe = AXES[interviewIndex];
  var body = $('rec-io-body');
  var noteVal = currentNotes[axe.key] || '';
  body.innerHTML =
    '<div class="rec-io-question-titre">'+axe.titre+'</div>'+
    '<div class="rec-io-question-txt">'+axe.q+'</div>'+
    '<button type="button" class="rec-toggle-reperes" id="rec-io-toggle-reperes">'+recT('Voir les repères de notation')+' \u25be</button>'+
    '<div class="rec-reperes rec-hidden" id="rec-io-reperes">'+
      '<div class="rec-repere"><span class="rec-repere-n rec-s1">1</span>'+axe.a1+'</div>'+
      '<div class="rec-repere"><span class="rec-repere-n rec-s3">3</span>'+axe.a3+'</div>'+
      '<div class="rec-repere"><span class="rec-repere-n rec-s4">5</span>'+axe.a5+'</div>'+
    '</div>'+
    '<div class="rec-scale" data-axe="'+axe.key+'" id="rec-io-scale">'+
      [1,2,3,4,5].map(function(n){ return '<button type="button" data-n="'+n+'" class="'+(currentScores[axe.key]===n?'sel':'')+'">'+n+'</button>'; }).join('')+
    '</div>'+
    '<div class="rec-scale-labels"><span>'+recT('Alerte')+'</span><span>'+recT('Excellent')+'</span></div>'+
    '<label>'+recT('Exemple concret donné (optionnel)')+'</label>'+
    '<textarea id="rec-io-note" placeholder="'+recT('Ce que le candidat a répondu concrètement...')+'">'+noteVal+'</textarea>';
  $('rec-io-progress').textContent = (interviewIndex+1)+' / '+AXES.length;
  $('rec-io-toggle-reperes').addEventListener('click', function(){ $('rec-io-reperes').classList.toggle('rec-hidden'); var hid = $('rec-io-reperes').classList.contains('rec-hidden'); $('rec-io-toggle-reperes').textContent = (hid?recT('Voir les repères de notation'):recT('Masquer les repères')) + ' ' + (hid?'\u25be':'\u25b4'); });
  $('rec-io-scale').querySelectorAll('button').forEach(function(b){
    b.addEventListener('click', function(){
      $('rec-io-scale').querySelectorAll('button').forEach(function(x){ x.classList.remove('sel'); });
      b.classList.add('sel');
      currentScores[axe.key] = parseInt(b.dataset.n,10);
    });
  });
  $('rec-io-note').addEventListener('input', function(e){ currentNotes[axe.key] = e.target.value; });
  $('rec-io-prev').disabled = (interviewIndex===0);
  $('rec-io-next').textContent = (interviewIndex===AXES.length-1) ? (recT('Terminer')+' \u2713') : (recT('Suivant')+' \u25b8');
}

// ---------- Analyse (radar) ----------
var COULEURS = ['#10b981','#f59e0b','#ef4444','#8b5cf6','#3b82f6'];
function renderCompareChecklist(){ recBuildGraphiques();
  var wrap = $('rec-compare-checklist');
  if(!wrap) return;
  wrap.innerHTML = '';
  candidats.forEach(function(c){
    var div = document.createElement('label');
    div.className = 'rec-cc-item';
    div.innerHTML = '<input type="checkbox" value="'+c.id+'" class="rec-cc-check"><span>'+c.nom+'</span>';
    wrap.appendChild(div);
  });
  wrap.querySelectorAll('.rec-cc-check').forEach(function(chk){
    chk.addEventListener('change', renderAnalyse);
  });
  var checks = wrap.querySelectorAll('.rec-cc-check');
  if(checks.length){
    checks[checks.length-1].checked = true;
    if(checks.length>1) checks[checks.length-2].checked = true;
  }
  renderAnalyse();
}
function recBuildGraphiques(){ if(typeof Chart === 'undefined') return; var all = candidats || []; var cd = document.getElementById('rec-distrib'); if(cd){ var ds = AXES.map(function(a){ var arr = [0, 0, 0, 0, 0]; all.forEach(function(c){ var n = (c.scores || {})[a.key]; if(n) arr[n - 1]++; }); return arr; }); var sets = [1, 2, 3, 4, 5].map(function(n, i){ return { label: n + '/5', data: AXES.map(function(a, j){ return ds[j][i]; }), backgroundColor: recCouleurNote(n), stack: 's' }; }); if(_recDistribChart){ _recDistribChart.destroy(); } _recDistribChart = new Chart(cd, { type: 'bar', data: { labels: AXES.map(function(a){ return a.titre.replace(/^[0-9]+\. /, '').slice(0, 18); }), datasets: sets }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#8b90a4', boxWidth: 10, font: { size: 10 } } } }, scales: { x: { stacked: true, grid: { display: false }, ticks: { color: '#8b90a4', maxRotation: 45, minRotation: 45, font: { size: 9 } } }, y: { stacked: true, beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4', precision: 0 } } } } }); } var cp = document.getElementById('rec-pred'); if(cp){ var pts = []; all.forEach(function(c){ var x = recScorePondere(c); var y = recBradford(c); if(x !== null && y !== null) pts.push({ x: Number(x.toFixed(2)), y: y, nom: c.nom }); }); var info = document.getElementById('rec-pred-info'); if(info) info.textContent = pts.length ? (pts.length + ' candidat(s) relie(s) a un employe. Score pondere de l entretien en X, score Bradford actuel en Y : un nuage qui descend vers la droite valide la grille.') : 'Aucun candidat relie a un employe pour le moment. Renseigne le champ Employe lie sur une fiche embauchee pour alimenter ce graphique.'; if(_recPredChart){ _recPredChart.destroy(); } _recPredChart = new Chart(cp, { type: 'scatter', data: { datasets: [{ data: pts, backgroundColor: '#3b82f6', pointRadius: 6 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(ctx){ var p = ctx.raw; return p.nom + ' : entretien ' + p.x + '/5, Bradford ' + p.y; } } } }, scales: { x: { min: 1, max: 5, title: { display: true, text: 'Score entretien pondere', color: '#8b90a4' }, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' } }, y: { beginAtZero: true, title: { display: true, text: 'Score Bradford', color: '#8b90a4' }, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' } } } } }); } var cf = document.getElementById('rec-funnel'); if(cf){ var nEv = all.length; var nBon = all.filter(function(c){ return c.verdict === 'bon'; }).length; var nEmb = all.filter(function(c){ return c.issue === 'embauche' || c.issue === 'confirme'; }).length; var nCon = all.filter(function(c){ return c.issue === 'confirme'; }).length; if(_recFunnelChart){ _recFunnelChart.destroy(); } _recFunnelChart = new Chart(cf, { type: 'bar', data: { labels: ['Evalues', 'Bon fit', 'Embauches', 'Confirmes'], datasets: [{ data: [nEv, nBon, nEmb, nCon], backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'], borderRadius: 4 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4', precision: 0 } }, y: { grid: { display: false }, ticks: { color: '#8b90a4' } } } } }); } var cm = document.getElementById('rec-mois'); if(cm){ var mois = [], cnt = []; var d0 = new Date(); for(var k = 11; k >= 0; k--){ var dd = new Date(d0.getFullYear(), d0.getMonth() - k, 1); mois.push(dd.getFullYear() + '-' + ('0' + (dd.getMonth() + 1)).slice(-2)); cnt.push(0); } all.forEach(function(c){ var i = mois.indexOf(String(c.date || '').slice(0, 7)); if(i >= 0) cnt[i]++; }); if(_recMoisChart){ _recMoisChart.destroy(); } _recMoisChart = new Chart(cm, { type: 'bar', data: { labels: mois, datasets: [{ data: cnt, backgroundColor: '#8b5cf6', borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#8b90a4', font: { size: 9 } } }, y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4', precision: 0 } } } } }); } } function renderAnalyse(){ recRemplirEmployes(); recBuildGraphiques();
  var checked = document.querySelectorAll('#pane-recrutement .rec-cc-check:checked');
  var ids = Array.prototype.map.call(checked, function(c){ return c.value; });
  var selected = candidats.filter(function(c){ return ids.indexOf(c.id) !== -1; });
  var canvas = $('rec-radar');
  var vide = $('rec-analyse-vide');
  var tableauCard = $('rec-tableau-card');
  if(!canvas || !vide || !tableauCard) return;

  if(!selected.length){
    vide.style.display = 'block';
    canvas.style.display = 'none';
    tableauCard.style.display = 'none';
    if(radarChart){ radarChart.destroy(); radarChart = null; }
    return;
  }
  vide.style.display = 'none';
  canvas.style.display = 'block';
  tableauCard.style.display = 'block';

  var labels = AXES.map(function(a){ return a.titre.replace(/^[0-9]+\. /,''); });
  var datasets = selected.map(function(c,i){
    return {
      label: c.nom,
      data: AXES.map(function(a){ return (c.scores && c.scores[a.key]) ? c.scores[a.key] : 0; }),
      borderColor: COULEURS[i % COULEURS.length],
      backgroundColor: COULEURS[i % COULEURS.length]+'33',
      borderWidth: 2,
      pointBackgroundColor: COULEURS[i % COULEURS.length]
    };
  });

  if(candidats.length > 1){ var moyRef = AXES.map(function(a){ var n = 0, s = 0; candidats.forEach(function(c){ var v = (c.scores || {})[a.key]; if(v){ s += v; n++; } }); return n ? Number((s / n).toFixed(2)) : 0; }); datasets.push({ label: 'Moyenne de tous les candidats', data: moyRef, borderColor: 'rgba(255,255,255,.4)', backgroundColor: 'rgba(255,255,255,.05)', borderWidth: 1, borderDash: [5, 4], pointRadius: 2, pointBackgroundColor: 'rgba(255,255,255,.5)' }); }  if(radarChart) radarChart.destroy();
  if(typeof Chart !== 'undefined'){
    radarChart = new Chart(canvas, {
      type: 'radar',
      data: { labels: labels, datasets: datasets },
      options: {
        scales: { r: { min:0, max:5, ticks:{ stepSize:1, color:'#8b90a4', backdropColor:'transparent' }, pointLabels:{ font:{ size:10 }, color:'#8b90a4' }, grid:{ color:'rgba(255,255,255,.08)' }, angleLines:{ color:'rgba(255,255,255,.08)' } } },
        plugins: { legend: { position:'bottom', labels:{ boxWidth:12, font:{ size:11 }, color:'#e8eaf0' } } },
        maintainAspectRatio:false
      }
    });
  }

  var table = $('rec-tableau-scores');
  var html = '<thead><tr><th>'+recT('Critère')+'</th>'+selected.map(function(c){ return '<th>'+c.nom+'</th>'; }).join('')+'</tr></thead><tbody>';
  AXES.forEach(function(a){
    html += '<tr><td>'+a.titre.replace(/^[0-9]+\. /,'')+'</td>';
    selected.forEach(function(c){
      var v = c.scores && c.scores[a.key];
      html += v ? '<td><span class="rec-score-cell rec-s'+v+'">'+v+'</span></td>' : '<td>-</td>';
    });
    html += '</tr>';
  });
  html += '</tbody>';
  table.innerHTML = html;
}

// ---------- Attache des écouteurs (une seule fois) ----------
function attachListenersOnce(){
  document.querySelectorAll('#pane-recrutement .rec-verdict-choix button').forEach(function(b){
    b.addEventListener('click', function(){
      document.querySelectorAll('#pane-recrutement .rec-verdict-choix button').forEach(function(x){ x.className=''; });
      currentVerdict = b.dataset.v;
      b.classList.add('sel-'+b.dataset.v);
    });
  });

  $('rec-btn-annuler').addEventListener('click', function(){
    resetFormulaire();
    goToSubnav('liste');
  });

  $('rec-btn-enregistrer').addEventListener('click', function(){
    var nom = $('rec-f-nom').value.trim();
    if(!nom){ recToast(recT('Ajoute un nom'), '#ef4444'); return; }    var dbl = candidats.filter(function(x){ return x.id !== editId && String(x.nom || '').trim().toLowerCase() === nom.toLowerCase(); }); if(dbl.length && !confirm(recT('Une fiche existe deja pour') + ' ' + nom + ' ' + recT('(entretien du') + ' ' + dbl[0].date + recT('). Creer une seconde fiche quand meme ?'))) return;

    var scoresArr = Object.keys(currentScores).map(function(k){ return currentScores[k]; });
    var moyenne = scoresArr.length ? scoresArr.reduce(function(a,b){return a+b;},0)/scoresArr.length : null;
    var nbBas = scoresArr.filter(function(s){ return s<=2; }).length;
    var alerteK = recAlerte({ scores: currentScores }); if(alerteK && currentVerdict === 'bon' && !confirm(recT('Note eliminatoire (1 ou 2) sur') + ' ' + recLibelleAxe(alerteK) + recT('. En agroalimentaire ce critere ne se compense pas par les autres. Enregistrer quand meme en Bon fit ?'))) return;    if(currentVerdict==='bon' && moyenne!==null && (moyenne<3 || nbBas>=2)){
      if(!confirm(recT('Le verdict \u00ab Bon fit \u00bb semble en décalage avec des scores plutôt bas sur certains critères. Enregistrer quand même ?'))) return;
    }
    if(currentVerdict==='incompatible' && moyenne!==null && moyenne>=4){
      if(!confirm(recT('Le verdict \u00ab Incompatible \u00bb semble en décalage avec des scores plutôt hauts. Enregistrer quand même ?'))) return;
    }

    var data = {
      id: editId || (Date.now()+''),
      nom: nom,
      date: $('rec-f-date').value || new Date().toISOString().slice(0,10),
      scores: Object.assign({}, currentScores),
      notes: Object.assign({}, currentNotes),
      verdict: currentVerdict,
      suivi: $('rec-f-suivi').value.trim(), poste: recVal('rec-f-poste'), unite: recVal('rec-f-unite'), shift: recVal('rec-f-shift'), evaluateur: recVal('rec-f-evaluateur'), issue: recVal('rec-f-issue'), empId: recVal('rec-f-empid'), pondere: recScorePondere({ scores: currentScores }),
      reference: {
        statut: $('rec-f-ref-statut').value,
        notes: $('rec-f-ref-notes').value.trim()
      }
    };

    sauvegarderCandidat(data).then(function(){ recEffacerBrouillon();
      recToast(recT('Entretien enregistré'), '#10b981');
      resetFormulaire();
      goToSubnav('liste');
    }).catch(function(err){
      console.error('[Recrutement] Erreur sauvegarde:', err);
      recToast(recT('Erreur lors de l\u2019enregistrement'), '#ef4444');
    });
  });

  $('rec-btn-supprimer').addEventListener('click', function(){
    if(!editId) return;
    var c = candidats.filter(function(x){ return x.id===editId; })[0];
    if(!c) return;
    if(confirm(recT('Supprimer l\u2019entretien de')+' '+c.nom+' '+recT('? Cette action est irréversible.'))){
      supprimerCandidatFB(editId).then(function(){
        resetFormulaire();
        goToSubnav('liste');
        recToast(recT('Candidat supprimé'), '#ef4444');
      });
    }
  });

  $('rec-btn-export-json').addEventListener('click', function(){
    var json = JSON.stringify(candidats, null, 2);
    try{
      var blob = new Blob([json], {type:'application/json'});
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'candidats-recrutement-aw3.json';
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      recToast(recT('Export téléchargé'), '#10b981');
    }catch(e){
      recToast(recT('Erreur export'), '#ef4444');
    }
  });

  $('rec-btn-import-json').addEventListener('click', function(){ $('rec-file-import').click(); });
  $('rec-file-import').addEventListener('change', function(e){
    var file = e.target.files[0];
    if(!file) return;
    file.text().then(function(text){
      var imported;
      try{ imported = JSON.parse(text); }catch(err){ recToast(recT('Fichier invalide'), '#ef4444'); return; }
      if(!Array.isArray(imported)){ recToast(recT('Fichier invalide'), '#ef4444'); return; }
      var nouveaux = imported.filter(function(c){
        return c && c.id && !candidats.some(function(x){ return x.id===c.id; });
      });
      if(!nouveaux.length){ recToast(recT('Rien de nouveau à importer'), '#f59e0b'); return; }
      if(confirm(nouveaux.length+' '+recT('nouveau(x) candidat(s) trouvé(s). Les ajouter ?'))){
        var updates = {};
        nouveaux.forEach(function(c){ updates[c.id] = c; });
        db.ref('recrutement/candidats').update(updates).then(function(){
          recToast(recT('Import réussi'), '#10b981');
        }).catch(function(){ recToast(recT('Erreur import'), '#ef4444'); });
      }
    });
    e.target.value = '';
  });

  $('rec-btn-pdf').addEventListener('click', exporterFichePDF);
  $('rec-btn-print-fr').addEventListener('click', function(){ imprimerQuestionnaire('fr'); });
  $('rec-btn-print-nl').addEventListener('click', function(){ imprimerQuestionnaire('nl'); });
  $('rec-btn-print-en').addEventListener('click', function(){ imprimerQuestionnaire('en'); });

  $('rec-btn-mode-entretien').addEventListener('click', function(){
    interviewIndex = 0;
    openInterviewStep();
    $('rec-io-overlay').classList.remove('rec-hidden');
  });
  $('rec-io-close').addEventListener('click', function(){
    $('rec-io-overlay').classList.add('rec-hidden');
    syncFormulaireDepuisState();
  });
  $('rec-io-prev').addEventListener('click', function(){
    if(interviewIndex>0){ interviewIndex--; openInterviewStep(); }
  });
  $('rec-io-next').addEventListener('click', function(){
    if(interviewIndex < AXES.length-1){
      interviewIndex++; openInterviewStep();
    } else {
      $('rec-io-overlay').classList.add('rec-hidden');
      syncFormulaireDepuisState();
      recToast(recT('Renseigne le verdict pour terminer'), '#f59e0b');
      var vc = $('rec-verdict-choix');
      if(vc) vc.scrollIntoView({behavior:'smooth', block:'center'});
    }
  });
}

function initRecrutementUI(){
  if(initialized) return;
  initialized = true;
  buildAxes();
  initSubnav();
  attachListenersOnce(); recRemplirEmployes(); window.recAppliquerLangue(); setTimeout(recRestaurerBrouillon, 900);
  $('rec-f-date').value = new Date().toISOString().slice(0,10);
}

// Hook global appelé au clic sur l'onglet "Recrutement"
window.buildRecrutementTab = function(){
  initRecrutementUI();
  attacherListenerCandidats();
};

})();


/* ==================== NCP : tuiles KPI exclusives ====================
   Total = Inpak + Production + Sans controle labo Inpak + Sans controle labo Prod
   Un NCP n apparait que dans une seule tuile.
   ==================================================================== */
var NCP_ACTIONS_RESTANTES = /strippen|dierenvoeding|kwaliteit|stickeren|ompakken|overstapelen|metaaldetector|vergisting|speciale bestemming|tape|bid|bulken|onderneem actie/i;

function ncpMesures(r){
  return String(r.toutes_mesures || r.measures || '').split(/[|,]/).map(function(s){ return s.trim(); }).filter(Boolean);
}

/* Debloque = Vrijgave explicite ET aucune action restante derriere
   (Dierenvoeding, Strippen, Ompakken... restent bloques) */
function ncpEstDebloque(r){
  var m = ncpMesures(r);
  if(!m.some(function(x){ return /^vrijgave$/i.test(x); })) return false;
  return !m.some(function(x){ return NCP_ACTIONS_RESTANTES.test(x); });
}

/* Bloc de shift couvrant un instant donne (miroir de getEquipe)
   Semaine : 05h-13h / 13h-21h / 21h-05h   -   Week-end : 05h-17h / 17h-05h */
function ncpBlocShift(dateISO, heure){
  if(!dateISO || !heure) return null;
  var hh = parseInt(String(heure).split(':')[0], 10);
  if(isNaN(hh)) return null;
  var d = new Date(dateISO + 'T00:00:00');
  if(isNaN(d.getTime())) return null;
  var jour = function(x){ return x.getFullYear()+'-'+('0'+(x.getMonth()+1)).slice(-2)+'-'+('0'+x.getDate()).slice(-2); };
  var mk = function(ds, h){ return new Date(ds + 'T' + ('0'+h).slice(-2) + ':00:00'); };
  var dow = d.getDay(), we = (dow === 0 || dow === 6);
  if(hh >= 5){
    if(we){
      if(hh < 17) return { d: mk(dateISO,5), f: mk(dateISO,17), b: '05h-17h' };
      return { d: mk(dateISO,17), f: mk(jour(new Date(d.getTime()+86400000)),5), b: '17h-05h' };
    }
    if(hh < 13) return { d: mk(dateISO,5),  f: mk(dateISO,13), b: '05h-13h' };
    if(hh < 21) return { d: mk(dateISO,13), f: mk(dateISO,21), b: '13h-21h' };
    return { d: mk(dateISO,21), f: mk(jour(new Date(d.getTime()+86400000)),5), b: '21h-05h' };
  }
  var v = new Date(d.getTime() - 86400000), vs = jour(v), vdow = v.getDay();
  if(vdow === 0 || vdow === 6) return { d: mk(vs,17), f: mk(dateISO,5), b: '17h-05h' };
  return { d: mk(vs,21), f: mk(dateISO,5), b: '21h-05h' };
}

/* Hors shift = la fiche a ete creee en dehors du bloc horaire du shift
   concerne par le defaut (heure reelle du defaut via ncpHeureInfo). */
function ncpHorsShift(r){
  if(!r.created_date_iso || !r.created_heure) return false;
  var hi = ncpHeureInfo(r);
  if(!hi || !hi.heure) return false;
  var bloc = ncpBlocShift(hi.date_iso || r.created_date_iso, hi.heure);
  if(!bloc) return false;
  var crea = new Date(r.created_date_iso + 'T' + r.created_heure + ':00');
  if(isNaN(crea.getTime())) return false;
  return crea < bloc.d || crea >= bloc.f;
}

function ncpSansLabo(r){ return ncpHorsShift(r); }
function ncpSansLaboInpak(r){ return ncpHorsShift(r) && r.type_ncp === 'Inpak'; }
function ncpSansLaboProd(r){ return ncpHorsShift(r) && r.type_ncp === 'Production'; }


/* Meme base que les KPI existants : NCP_VUE sans les BLK */
function ncpBaseKPI(){
  return (NCP_VUE || []).filter(function(r){ return r.famille_produit !== 'BLK'; });
}

var NCP_KPI_MAP = {
  'ncp-k-total':'total', 'ncp-k-inpak':'inpak', 'ncp-k-prod':'prod',
  'ncp-k-tonnes':'tonnes', 'ncp-k-debloque':'debloque',
  'ncp-k-sl-inpak':'slinpak', 'ncp-k-sl-prod':'slprod'
};

function ncpBindTuiles(){
  var g = document.querySelector('#ncp-content-wrap .kgrid');
  if(!g) return;
  if(!g.getAttribute('data-kpideleg')){
    g.setAttribute('data-kpideleg','1');
    g.addEventListener('click', function(ev){
      var card = ev.target.closest ? ev.target.closest('.kcard') : null;
      if(!card) return;
      var v = card.querySelector('.kval');
      if(!v || !NCP_KPI_MAP[v.id]) return;
      ev.stopPropagation();
      ncpKpiListe(NCP_KPI_MAP[v.id]);
    }, true);
  }
  Array.prototype.forEach.call(g.querySelectorAll('.kcard'), function(c){
    var v = c.querySelector('.kval');
    if(v && NCP_KPI_MAP[v.id]){ c.style.cursor = 'pointer'; c.title = 'Cliquer pour voir la liste'; }
  });
}

function ncpMajTuilesExtra(){
  function set(id, v){ var e = document.getElementById(id); if(e) e.textContent = v; }
  var b = ncpBaseKPI(), tot = b.length;
  var deb = 0, i = 0, p = 0, si = 0, sp = 0;
  b.forEach(function(r){
    if(ncpEstDebloque(r)) deb++;
    var t = r.type_ncp;
    if(ncpSansLabo(r)){ if(t === 'Inpak') si++; else if(t === 'Production') sp++; }
    else              { if(t === 'Inpak') i++;  else if(t === 'Production') p++;  }
  });
  function pct(n){ return tot ? Math.round(n / tot * 100) + '% du total' : '-'; }
  set('ncp-k-inpak', i);      set('ncp-k-inpak-pct', pct(i));
  set('ncp-k-prod', p);       set('ncp-k-prod-pct', pct(p));
  set('ncp-k-debloque', deb); set('ncp-k-debloque-pct', pct(deb));
  set('ncp-k-sl-inpak', si);  set('ncp-k-sl-inpak-pct', pct(si) + ' - a controler');
  set('ncp-k-sl-prod', sp);   set('ncp-k-sl-prod-pct', pct(sp) + ' - a controler');
  ncpBindTuiles();
}

(function(){
  var _kpi = ncpKpiListe;
  ncpKpiListe = function(k){
    var b = ncpBaseKPI();
    if(k === 'debloque') return ncpRendreListe('NCP debloques', b.filter(ncpEstDebloque));
    if(k === 'inpak')    return ncpRendreListe('NCP Inpak (dans le shift)', b.filter(function(r){ return r.type_ncp === 'Inpak' && !ncpSansLabo(r); }));
    if(k === 'prod')     return ncpRendreListe('NCP Production (dans le shift)', b.filter(function(r){ return r.type_ncp === 'Production' && !ncpSansLabo(r); }));
    if(k === 'slinpak')  return ncpRendreListe('NCP hors shift - Inpak', b.filter(ncpSansLaboInpak));
    if(k === 'slprod')   return ncpRendreListe('NCP hors shift - Production', b.filter(ncpSansLaboProd));
    return _kpi.call(this, k);
  };
  var _build = buildNCPTab;
  buildNCPTab = function(){
    var out = _build.apply(this, arguments);
    try { ncpMajTuilesExtra(); } catch(e){ console.warn('tuiles NCP', e); }
    return out;
  };
})();

function fmtDateFormation(iso){
  if(!iso) return '-';
  var p = iso.split('-'); if(p.length!==3) return iso;
  var mois=['janv.','fevr.','mars','avr.','mai','juin','juil.','aout','sept.','oct.','nov.','dec.'];
  return parseInt(p[2],10)+' '+mois[parseInt(p[1],10)-1];
}
function formationEmployesLabel(f){
  var ids = f.employes || [];
  if(!ids.length) return t('formations_all_team');
  return ids.map(function(idOrName){
    var e = EMP.find(function(x){ return x.id===idOrName || x.n===idOrName; });
    return e ? e.n : idOrName;
  }).join(', ');
}
function buildFormationsListe(){
  var elAvenir = document.getElementById('form-liste-avenir');
  var elPassees = document.getElementById('form-liste-passees');
  if(!elAvenir || !elPassees) return;
  var today = new Date(); today.setHours(0,0,0,0);
  var avenir=[], passees=[];
  FORMATIONS.forEach(function(f){
    var d = new Date(f.date+'T00:00:00');
    if(d>=today) avenir.push(f); else passees.push(f);
  });
  avenir.sort(function(a,b){ return (a.date+(a.heureDebut||'')).localeCompare(b.date+(b.heureDebut||'')); });
  passees.sort(function(a,b){ return (b.date+(b.heureDebut||'')).localeCompare(a.date+(a.heureDebut||'')); });
  function carte(f){
    var badges = (f.employes||[]).map(function(idOrName){
      var e = EMP.find(function(x){ return x.id===idOrName || x.n===idOrName; });
      var nom = e ? e.n : idOrName;
      return '<span class="pill ok" style="margin:2px 4px 2px 0">'+nom+'</span>';
    }).join('');
    var clickAttr = canEditFormations ? ' onclick="openFormationModal(\''+f.id+'\')" style="cursor:pointer"' : '';
    return '<div class="note-card"'+clickAttr+' style="border-left-color:var(--blue)">'
      +'<div class="note-card-row"><div class="note-card-date">'+fmtDateFormation(f.date)+'</div>'
      +'<div class="note-card-txt"><b>'+(f.titre||'Formation')+'</b>'
      +(f.heureDebut?' &middot; '+f.heureDebut+(f.heureFin?'-'+f.heureFin:''):'')
      +(f.lieu?' &middot; '+f.lieu:'')
      +'<div style="margin-top:6px">'+(badges||"<span style='color:var(--tx3)'>"+t('formations_all_team')+"</span>")+'</div>'
      +(f.notes?'<div style="margin-top:6px;color:var(--tx2);font-size:12px">'+f.notes+'</div>':'')
      +'</div></div></div>';
  }
  elAvenir.innerHTML = avenir.length ? avenir.map(carte).join('') : '<div class="empty">'+t('formations_empty_upcoming')+'</div>';
  elPassees.innerHTML = passees.length ? passees.map(carte).join('') : '<div class="empty">'+t('formations_empty_past')+'</div>';
}
function buildMiniCalFormations(){
  var el = document.getElementById('mini-cal-formations');
  if(!el) return;
  var today = new Date(); today.setHours(0,0,0,0);
  var limite = new Date(today); limite.setDate(limite.getDate()+30);
  var upcoming = FORMATIONS.filter(function(f){
    var d = new Date(f.date+'T00:00:00');
    return d>=today && d<=limite;
  }).sort(function(a,b){ return (a.date+(a.heureDebut||'')).localeCompare(b.date+(b.heureDebut||'')); });
  if(!upcoming.length){ el.innerHTML = '<div class="empty">'+t('formations_empty_30d')+'</div>'; return; }
  el.innerHTML = upcoming.map(function(f){
    var noms = formationEmployesLabel(f);
    return '<div style="display:flex;align-items:center;gap:12px;padding:10px 4px;border-bottom:1px solid var(--bd)">'
      +'<div style="font-family:var(--mo);font-size:12px;font-weight:700;color:var(--blue);min-width:70px">'+fmtDateFormation(f.date)+'</div>'
      +'<div style="flex:1"><div style="font-size:13px;font-weight:500">'+(f.titre||'Formation')+(f.heureDebut?' &middot; '+f.heureDebut:'')+'</div>'
      +'<div style="font-size:11px;color:var(--tx3)">'+noms+'</div></div>'
      +'</div>';
  }).join('');
}
function checkFormationNotif(){
  var el = document.getElementById('formation-notif');
  if(!el) return;
  var today = new Date(); today.setHours(0,0,0,0);
  var seuil = new Date(today); seuil.setDate(seuil.getDate()+3);
  var proches = FORMATIONS.filter(function(f){
    var d = new Date(f.date+'T00:00:00');
    return d>=today && d<=seuil;
  });
  if(!proches.length){ el.style.display='none'; el.innerHTML=''; return; }
  el.style.display='flex';
  el.innerHTML = '<div style="font-size:22px">&#127891;</div><div style="flex:1"><div style="font-weight:600;margin-bottom:4px">'+(proches.length>1?t('formations_notif_plural'):t('formations_notif_singular'))+'</div><div style="font-size:12px;color:var(--tx2)">'
    + proches.map(function(f){ return fmtDateFormation(f.date)+' : '+(f.titre||'Formation')+' &mdash; '+formationEmployesLabel(f); }).join('<br>')
    + '</div></div>';
}
function openFormationModal(id){
  var modal = document.getElementById('formation-modal');
  if(!modal) return;
  formationEditId = id || null;
  var f = id ? FORMATIONS.find(function(x){ return x.id===id; }) : null;
  document.getElementById('formation-modal-title').textContent = f ? t('formations_modal_title_edit') : t('formations_modal_title_new');
  document.getElementById('form-f-titre').value = f ? (f.titre||'') : '';
  document.getElementById('form-f-date').value = f ? (f.date||'') : '';
  document.getElementById('form-f-heure-debut').value = f ? (f.heureDebut||'') : '';
  document.getElementById('form-f-heure-fin').value = f ? (f.heureFin||'') : '';
  document.getElementById('form-f-lieu').value = f ? (f.lieu||'') : '';
  document.getElementById('form-f-notes').value = f ? (f.notes||'') : '';
  document.getElementById('formation-modal-err').textContent = '';
  var selectedIds = f ? (f.employes||[]) : [];
  var wrap = document.getElementById('form-f-employes');
  wrap.innerHTML = EMP.map(function(e){
    var val = e.id || e.n;
    var checked = selectedIds.indexOf(val)>=0 ? 'checked' : '';
    return '<label style="display:flex;align-items:center;gap:6px;padding:5px 10px;border:1px solid var(--bd2);border-radius:20px;font-size:12px;cursor:pointer;background:var(--bg3)">'
      +'<input type="checkbox" class="form-f-emp-cb" value="'+String(val).replace(/"/g,'&quot;')+'" '+checked+' style="width:14px;height:14px">'+e.n+'</label>';
  }).join('');
  document.getElementById('form-btn-delete').style.display = f ? 'inline-block' : 'none';
  modal.style.display = 'flex';
}
function closeFormationModal(){
  var modal = document.getElementById('formation-modal');
  if(modal) modal.style.display = 'none';
  formationEditId = null;
}
function saveFormation(){
  var titre = document.getElementById('form-f-titre').value.trim();
  var date = document.getElementById('form-f-date').value;
  var heureDebut = document.getElementById('form-f-heure-debut').value;
  var heureFin = document.getElementById('form-f-heure-fin').value;
  var lieu = document.getElementById('form-f-lieu').value.trim();
  var notes = document.getElementById('form-f-notes').value.trim();
  var errEl = document.getElementById('formation-modal-err');
  if(!titre){ errEl.textContent = t('formations_err_titre'); return; }
  if(!date){ errEl.textContent = t('formations_err_date'); return; }
  var employes = Array.prototype.slice.call(document.querySelectorAll('.form-f-emp-cb:checked')).map(function(cb){ return cb.value; });
  var payload = { titre:titre, date:date, heureDebut:heureDebut||'', heureFin:heureFin||'', lieu:lieu||'', notes:notes||'', employes:employes, statut:'planifiee', creeLe:new Date().toISOString() };
  var ref = formationEditId ? db.ref('formations/'+formationEditId) : db.ref('formations').push();
  ref.update(payload).then(function(){
    toast(t('formations_toast_saved'), '#3b82f6');
    closeFormationModal();
  }).catch(function(e){
    errEl.textContent = t('formations_err_generic') + e.message;
  });
}
function deleteFormation(){
  if(!formationEditId) return;
  if(!confirm(t('formations_confirm_delete'))) return;
  db.ref('formations/'+formationEditId).remove().then(function(){
    toast(t('formations_toast_deleted'), '#ef4444');
    closeFormationModal();
  });
}


function posteVersPermissions(poste){
  if(poste === 'Team Leader') return {role:'admin', tabs:null, editPlanning:false};
  if(poste === 'Coordinateur') return {role:'custom', tabs:{ov:true,br:true,pl:true,ab:true,formations:true,pt:false,arrets:true,ncp:true,recrutement:false,espace:true}, editPlanning:true};
  return {role:'custom', tabs:{ov:false,br:false,pl:true,ab:false,formations:true,pt:false,arrets:false,ncp:false,recrutement:false,espace:true}, editPlanning:false};
}

var ALL_TABS = ['ov','br','pl','ab','formations','pt','arrets','ncp','recrutement','espace'];
var TAB_LABELS = {ov:'Vue d\'ensemble', br:'Bradford', pl:'Planning', ab:'Absences', formations:'Formations', pt:'Pointages', arrets:'Arrêts Inpak', ncp:'NCP Qualité', recrutement:'Recrutement', espace:'Mon espace'};

function genLoginInterne(nomComplet){
  var parts = (nomComplet||'').trim().split(/\s+/);
  var prenom = parts[0] || '';
  var nom = parts.slice(1).join(' ') || prenom;
  function strip(s){
    return (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z]/g,'');
  }
  var p = strip(prenom), n = strip(nom);
  var email = (p||'x')+'.'+(n||'x')+'@aw3p5.local';
  var pass = (p.charAt(0)||'x')+(p.charAt(p.length-1)||'x')+(n.charAt(0)||'x')+(n.charAt(n.length-1)||'x')+'2026';
  return {email: email, password: pass};
}

function buildComptesEmpListe(){
  var cont = document.getElementById('comptes-emp-liste');
  if(!cont) return;
  var items = EMP.filter(function(e){ return e.id; });
  if(!items.length){ cont.innerHTML = '<div style="color:var(--tx2);padding:12px">'+t('comptes_emp_empty')+'</div>'; return; }
  cont.innerHTML = items.map(function(e){
    var acc = ACCOUNTS[e.id];
    var perm = posteVersPermissions(e.r);
    var rowId = 'cpt-'+e.id;
    if(acc){
      var accLabel = acc.role === 'admin' ? t('role_admin') : (acc.role === 'subchef' ? t('role_subchef') : t('role_custom'));
      return '<div class="cc" style="margin-bottom:8px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px">'
        +'<div><div style="font-weight:600">'+e.n+'</div><div style="font-size:12px;color:var(--tx2)">'+e.r+' &middot; '+accLabel+'</div></div>'
        +'<div style="display:flex;align-items:center;gap:8px"><span style="font-size:12px;color:var(--green)">&#9679; '+t('comptes_actif')+'</span><span style="font-size:11px;color:var(--tx3);font-family:var(--mo)">'+acc.email+'</span>'
        +'<button onclick="toggleAccesEdit(\''+e.id+'\')" style="padding:4px 10px;border-radius:6px;border:1px solid var(--bd);background:transparent;color:var(--tx2);font-size:11px;cursor:pointer">'+t('comptes_btn_modif_acces')+'</button>'
        +'</div>'
        +'</div>'
        +'<div id="acc-edit-'+e.id+'" style="display:none;margin:-4px 0 8px;padding:12px 16px;background:rgba(255,255,255,.03);border-radius:8px"></div>';
    }
    var tabsHtml = ALL_TABS.map(function(tk){
      var checked = perm.tabs && perm.tabs[tk] ? ' checked' : '';
      return '<label style="display:inline-flex;align-items:center;gap:4px;font-size:11px;color:var(--tx2);margin-right:10px;margin-bottom:4px"><input type="checkbox" id="'+rowId+'-tab-'+tk+'"'+checked+' style="accent-color:var(--blue)">'+t('tab_'+tk)+'</label>';
    }).join('');
    return '<div class="cc" style="margin-bottom:8px;padding:12px 16px" id="'+rowId+'">'
      +'<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px">'
      +'<div><div style="font-weight:600">'+e.n+'</div><div style="font-size:12px;color:var(--tx2)">'+e.r+'</div></div>'
      +'<div style="display:flex;align-items:center;gap:8px">'
      +'<select id="'+rowId+'-role" onchange="toggleComptePermPanel(\''+e.id+'\')" style="background:var(--bg3);color:var(--tx);border:1px solid var(--bd2);border-radius:6px;padding:4px 8px;font-size:12px">'
      +'<option value="custom"'+(perm.role==='custom'?' selected':'')+'>'+t('role_custom')+'</option>'
      +'<option value="subchef"'+(perm.role==='subchef'?' selected':'')+'>'+t('role_subchef')+'</option>'
      +'<option value="admin"'+(perm.role==='admin'?' selected':'')+'>'+t('role_admin')+'</option>'
      +'</select>'
      +'<button onclick="creerCompteEmployeUI(\''+e.id+'\')" style="padding:5px 12px;border-radius:6px;border:1px solid var(--bd2);background:var(--bg3);color:var(--tx);font-size:12px;cursor:pointer">'+t('comptes_btn_creer')+'</button>'
      +'</div></div>'
      +'<div id="'+rowId+'-permpanel" style="display:'+(perm.role==='custom'?'block':'none')+';padding-top:8px;border-top:1px solid var(--bd)">'
      +'<div style="margin-bottom:6px">'+tabsHtml+'</div>'
      +'<label style="display:inline-flex;align-items:center;gap:4px;font-size:11px;color:var(--tx2)"><input type="checkbox" id="'+rowId+'-editplanning"'+(perm.editPlanning?' checked':'')+' style="accent-color:var(--blue)">'+t('comptes_edit_planning')+'</label>'
      +'</div>'
      +'</div>';
  }).join('');
}

function toggleComptePermPanel(empId){
  var sel = document.getElementById('cpt-'+empId+'-role');
  var panel = document.getElementById('cpt-'+empId+'-permpanel');
  if(!sel || !panel) return;
  panel.style.display = sel.value === 'custom' ? 'block' : 'none';
}

function creerCompteEmployeUI(empId){
  var emp = EMP.find(function(e){ return e.id === empId; });
  if(!emp) return;
  var rowId = 'cpt-'+empId;
  var sel = document.getElementById(rowId+'-role');
  var role = sel ? sel.value : 'custom';
  var tabs = null, editPlanning = false;
  if(role === 'custom'){
    tabs = {};
    ALL_TABS.forEach(function(t){
      var cb = document.getElementById(rowId+'-tab-'+t);
      tabs[t] = !!(cb && cb.checked);
    });
    var epCb = document.getElementById(rowId+'-editplanning');
    editPlanning = !!(epCb && epCb.checked);
  }
  var login = genLoginInterne(emp.n);
  var recap = t('comptes_confirm_creer')+emp.n+' ?\n\n'+t('comptes_confirm_email')+login.email+'\n'+t('comptes_confirm_pass')+login.password+'\n'+t('comptes_confirm_role')+(role==='admin'?t('role_admin'):(role==='subchef'?t('role_subchef'):t('role_custom')));
  if(role === 'custom'){
    recap += '\n'+t('comptes_confirm_onglets')+ALL_TABS.filter(function(tt){return tabs[tt];}).map(function(tt){return t('tab_'+tt);}).join(', ');
    recap += '\n'+t('comptes_confirm_planning')+(editPlanning?t('comptes_oui'):t('comptes_non'));
  }
  if(!confirm(recap)) return;
  creerCompteEmploye(emp, role, login, tabs, editPlanning).then(function(res){
    toast(t('comptes_toast_cree')+emp.n, '#10b981');
    alert(t('comptes_alert_cree')+res.email+t('comptes_alert_pass')+res.password+t('comptes_alert_communique')+emp.n+'.');
  }).catch(function(err){
    console.error('[COMPTES] Erreur creation compte :', err);
    toast(t('comptes_toast_err_creation')+(err && err.message ? err.message : err), '#ef4444');
  });
}

function creerCompteEmploye(emp, role, login, tabs, editPlanning){
  login = login || genLoginInterne(emp.n);
  var secApp;
  try{ secApp = firebase.app('Secondary'); }
  catch(e){ secApp = firebase.initializeApp(firebase.app().options, 'Secondary'); }
  var secAuth = secApp.auth();
  return secAuth.createUserWithEmailAndPassword(login.email, login.password).then(function(cred){
    var uid = cred.user.uid;
    return secAuth.signOut().then(function(){
      var rec = {
        role: role,
        email: login.email,
        employeId: emp.id,
        nom: emp.n,
        createdAt: Date.now()
      };
      if(role === 'custom'){
        rec.tabs = tabs || {};
        rec.editPlanning = !!editPlanning;
      }
      return db.ref('users/'+uid).set(rec);
    }).then(function(){
      return db.ref('employees/'+emp.id+'/accountUid').set(uid);
    }).then(function(){
      return {email: login.email, password: login.password, uid: uid};
    });
  });
}


function toggleAccesEdit(empId){
  var box = document.getElementById('acc-edit-'+empId);
  if(!box) return;
  if(box.style.display !== 'none'){ box.style.display='none'; box.innerHTML=''; return; }
  var acc = ACCOUNTS[empId];
  if(!acc || !acc.uid){ return; }
  box.style.display = 'block';
  box.innerHTML = '<div style="color:var(--tx2);font-size:12px">Chargement...</div>';
  db.ref('users/'+acc.uid).once('value').then(function(snap){
    var u = snap.val() || {};
    var role = u.role || 'custom';
    var tabs = u.tabs || {};
    var editPlanning = !!u.editPlanning;
    var selHtml = '<select id="acc-edit-role-'+empId+'" style="padding:6px 10px;border-radius:6px;background:var(--bg2);border:1px solid var(--bd);color:var(--tx1);font-size:12px;margin-bottom:10px">'
      +'<option value="custom"'+(role==='custom'?' selected':'')+'>'+t('role_custom')+'</option>'
      +'<option value="subchef"'+(role==='subchef'?' selected':'')+'>'+t('role_subchef')+'</option>'
      +'<option value="admin"'+(role==='admin'?' selected':'')+'>'+t('role_admin')+'</option>'
      +'</select>';
    var tabsHtml = ALL_TABS.map(function(tk){
      var checked = tabs[tk] ? ' checked' : '';
      return '<label style="display:inline-flex;align-items:center;gap:4px;font-size:11px;margin:0 10px 6px 0"><input type="checkbox" id="acc-edit-tab-'+empId+'-'+tk+'"'+checked+' style="accent-color:var(--blue)">'+t('tab_'+tk)+'</label>';
    }).join('');
    var editPlanHtml = '<label style="display:inline-flex;align-items:center;gap:4px;font-size:11px;margin:8px 0"><input type="checkbox" id="acc-edit-editplanning-'+empId+'"'+(editPlanning?' checked':'')+' style="accent-color:var(--blue)"> '+t('comptes_edit_planning')+'</label>';
    box.innerHTML = selHtml
      +'<div style="margin-bottom:6px">'+tabsHtml+'</div>'
      +editPlanHtml
      +'<div style="margin-top:8px;display:flex;gap:8px">'
      +'<button onclick="enregistrerAccesEmploye(\''+empId+'\')" style="padding:6px 14px;border-radius:6px;border:none;background:var(--blue);color:#fff;font-size:12px;cursor:pointer">Enregistrer</button>'
      +'<button onclick="toggleAccesEdit(\''+empId+'\')" style="padding:6px 14px;border-radius:6px;border:1px solid var(--bd);background:transparent;color:var(--tx2);font-size:12px;cursor:pointer">Annuler</button>'
      +'</div>';
  });
}

function enregistrerAccesEmploye(empId){
  var acc = ACCOUNTS[empId];
  if(!acc || !acc.uid) return;
  var roleSel = document.getElementById('acc-edit-role-'+empId);
  if(!roleSel) return;
  var role = roleSel.value;
  var upd = {role: role};
  if(role === 'custom'){
    var tabs = {};
    ALL_TABS.forEach(function(t){
      var cb = document.getElementById('acc-edit-tab-'+empId+'-'+t);
      if(cb && cb.checked) tabs[t] = true;
    });
    var editCb = document.getElementById('acc-edit-editplanning-'+empId);
    upd.tabs = tabs;
    upd.editPlanning = !!(editCb && editCb.checked);
  } else {
    upd.tabs = null;
    upd.editPlanning = null;
  }
  db.ref('users/'+acc.uid).update(upd).then(function(){
    alert('Accès mis à jour.');
    var box = document.getElementById('acc-edit-'+empId);
    if(box){ box.style.display='none'; box.innerHTML=''; }
    acc.role = role;
  }).catch(function(e){
    alert('Erreur: '+e.message);
  });
}

function toggleNotesPanelManual(){
  window.__notesPanelForced = !window.__notesPanelForced;
  var list;
  if(window.__notesPanelForced){
    list = window.__allNoteEntries||[];
  } else {
    var todayD = new Date(); todayD.setHours(0,0,0,0);
    list = (window.__allNoteEntries||[]).filter(function(en){
      var mdd = (en.d||'').split('/'); var dd=parseInt(mdd[0],10), mm=parseInt(mdd[1],10);
      if(isNaN(dd)||isNaN(mm)) return true;
      var edt = new Date((parseInt(curYear,10)||new Date().getFullYear()), mm-1, dd); edt.setHours(0,0,0,0);
      return edt >= todayD;
    });
  }
  renderNotesPanel(list);
}


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
