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
body{background:var(--bg);color:var(--tx);font-family:var(--fn);min-height:100vh;line-height:1.5;font-size:14px}
.topbar{display:flex;align-items:center;gap:16px;padding:0 24px;height:56px;background:var(--bg2);border-bottom:1px solid var(--bd);position:sticky;top:0;z-index:100}
.logo{display:flex;align-items:center;gap:10px;font-size:15px;font-weight:600;letter-spacing:-.02em}
.logo-dot{width:28px;height:28px;border-radius:8px;background:var(--blue);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff}
.logo-sub{font-size:12px;color:var(--tx3);font-weight:400}
.topbar-r{margin-left:auto;display:flex;align-items:center;gap:10px}
.badge{font-size:11px;padding:3px 10px;border-radius:20px;background:rgba(59,130,246,.15);color:var(--blue);border:1px solid rgba(59,130,246,.25);font-weight:500}
.chip{font-size:11px;color:var(--tx3);font-family:var(--mo)}
.tbtn{display:flex;align-items:center;gap:6px;padding:5px 12px;border-radius:var(--r);border:1px solid var(--bd2);background:none;color:var(--tx2);font-family:var(--fn);font-size:12px;font-weight:500;cursor:pointer;transition:all .15s;white-space:nowrap}
.tbtn:hover{background:var(--bg3);color:var(--tx)}
.save-lbl{font-size:11px;color:var(--tx3);font-family:var(--mo)}
.tabs{display:flex;background:var(--bg2);border-bottom:1px solid var(--bd);padding:0 24px;overflow-x:auto}
.tab{padding:0 20px;height:48px;background:none;border:none;color:var(--tx2);cursor:pointer;font-size:13px;font-family:var(--fn);font-weight:500;border-bottom:2px solid transparent;white-space:nowrap;transition:color .15s,border-color .15s;display:flex;align-items:center;gap:7px}
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
.s-em{background:rgba(255,255,255,.04);color:var(--tx3)}
.td-on{background:rgba(59,130,246,.18)!important;color:#7eb3ff!important}
.td-td{background:rgba(59,130,246,.07)!important}
.td-dot{width:5px;height:5px;border-radius:50%;background:var(--blue);margin:3px auto 0}
.lgbar{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}
.lch{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--tx2)}
#no-today{display:none;align-items:center;gap:8px;margin-top:12px;padding:10px 14px;background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.25);border-radius:8px;font-size:12px;color:var(--tx2)}
.popup{position:fixed;z-index:1000;background:var(--bg2);border:1px solid var(--bd2);border-radius:10px;padding:8px;min-width:165px;box-shadow:0 8px 32px rgba(0,0,0,.5);display:none}
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
.arow{display:grid;grid-template-columns:180px 100px 100px 60px 1fr 100px;gap:12px;align-items:center;background:var(--bg2);border:1px solid var(--bd);border-radius:var(--r);padding:12px 16px}
.an{font-weight:500;font-size:13px}
.ad{font-size:12px;color:var(--tx2);font-family:var(--mo)}
.aj{font-family:var(--mo);font-size:13px;font-weight:500;color:var(--amber)}
.ab{height:4px;background:var(--bg3);border-radius:2px;overflow:hidden}
.abf{height:100%;background:var(--amber);border-radius:2px}
.ay{font-size:11px;color:var(--tx3);text-align:right}
.aflt{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}
.fb{padding:5px 12px;border-radius:20px;border:1px solid var(--bd);background:none;font-size:11px;font-family:var(--fn);color:var(--tx2);cursor:pointer;font-weight:500;transition:all .15s}
.fb.on{background:rgba(59,130,246,.15);color:var(--blue);border-color:rgba(59,130,246,.4)}
.ahdr{display:grid;grid-template-columns:180px 100px 100px 60px 1fr 100px;gap:12px;padding:0 16px 8px}
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
.login-logo .dot{width:36px;height:36px;border-radius:10px;background:var(--blue);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:#fff}
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
];

var currentUser=null,db=null,isSyncing=false,curYear='2026',curMonth=null,activePill=null,popup=null;
var BD_COMMENTS={};
var BD_PREV_STATUS={};
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
];

var H2025={"01/01": "17h-05h", "04/01": "05h-17h", "05/01": "05h-17h", "11/01": "17h-05h", "12/01": "17h-05h", "18/01": "05h-17h", "19/01": "05h-17h", "25/01": "17h-05h", "26/01": "17h-05h", "01/02": "05h-17h", "02/02": "05h-17h", "08/02": "17h-05h", "09/02": "17h-05h", "15/02": "05h-17h", "16/02": "05h-17h", "22/02": "17h-05h", "23/02": "17h-05h", "01/03": "05h-17h", "02/03": "05h-17h", "08/03": "17h-05h", "09/03": "17h-05h", "15/03": "05h-17h", "16/03": "05h-17h", "22/03": "17h-05h", "23/03": "17h-05h", "29/03": "05h-17h", "30/03": "05h-17h", "05/04": "17h-05h", "06/04": "17h-05h", "12/04": "05h-17h", "13/04": "05h-17h", "19/04": "17h-05h", "20/04": "17h-05h", "21/04": "17h-05h", "26/04": "05h-17h", "27/04": "05h-17h", "01/05": "17h-05h", "02/05": "17h-05h", "03/05": "17h-05h", "04/05": "17h-05h", "10/05": "05h-17h", "11/05": "05h-17h", "17/05": "17h-05h", "18/05": "17h-05h", "24/05": "05h-17h", "25/05": "05h-17h", "29/05": "17h-05h", "30/05": "17h-05h", "31/05": "17h-05h", "01/06": "17h-05h", "07/06": "05h-17h", "08/06": "05h-17h", "09/06": "05h-17h", "14/06": "17h-05h", "15/06": "17h-05h", "21/06": "05h-17h", "22/06": "05h-17h", "28/06": "17h-05h", "29/06": "17h-05h", "05/07": "05h-17h", "06/07": "05h-17h", "12/07": "17h-05h", "13/07": "17h-05h", "19/07": "05h-17h", "20/07": "05h-17h", "21/07": "05h-17h", "26/07": "17h-05h", "27/07": "17h-05h", "02/08": "05h-17h", "03/08": "05h-17h", "09/08": "17h-05h", "10/08": "17h-05h", "15/08": "05h-17h", "16/08": "05h-17h", "17/08": "05h-17h", "23/08": "17h-05h", "24/08": "17h-05h", "30/08": "05h-17h", "31/08": "05h-17h", "06/09": "17h-05h", "07/09": "17h-05h", "13/09": "05h-17h", "14/09": "05h-17h", "20/09": "17h-05h", "21/09": "17h-05h", "27/09": "05h-17h", "28/09": "05h-17h", "04/10": "17h-05h", "05/10": "17h-05h", "11/10": "05h-17h", "12/10": "05h-17h", "18/10": "17h-05h", "19/10": "17h-05h", "25/10": "05h-17h", "26/10": "05h-17h", "01/11": "17h-05h", "02/11": "17h-05h", "08/11": "05h-17h", "09/11": "05h-17h", "10/11": "05h-17h", "11/11": "05h-17h", "15/11": "17h-05h", "16/11": "17h-05h", "22/11": "05h-17h", "23/11": "05h-17h", "29/11": "17h-05h", "30/11": "17h-05h", "06/12": "05h-17h", "07/12": "05h-17h", "13/12": "17h-05h", "14/12": "17h-05h", "20/12": "05h-17h", "21/12": "05h-17h", "25/12": "17h-05h", "26/12": "17h-05h", "27/12": "17h-05h", "28/12": "17h-05h"};
var H2026={"01/01": "05h-17h", "02/01": "05h-17h", "03/01": "05h-17h", "04/01": "05h-17h", "10/01": "17h-05h", "11/01": "17h-05h", "17/01": "05h-17h", "18/01": "05h-17h", "24/01": "17h-05h", "25/01": "17h-05h", "31/01": "05h-17h", "01/02": "05h-17h", "07/02": "17h-05h", "08/02": "17h-05h", "14/02": "05h-17h", "15/02": "05h-17h", "21/02": "17h-05h", "22/02": "17h-05h", "28/02": "05h-17h", "01/03": "05h-17h", "07/03": "17h-05h", "08/03": "17h-05h", "14/03": "05h-17h", "15/03": "05h-17h", "21/03": "17h-05h", "22/03": "17h-05h", "28/03": "05h-17h", "29/03": "05h-17h", "04/04": "17h-05h", "05/04": "17h-05h", "06/04": "17h-05h", "11/04": "05h-17h", "12/04": "05h-17h", "18/04": "17h-05h", "19/04": "17h-05h", "25/04": "05h-17h", "26/04": "05h-17h", "01/05": "17h-05h", "02/05": "17h-05h", "03/05": "17h-05h", "09/05": "05h-17h", "10/05": "05h-17h", "14/05": "17h-05h", "15/05": "17h-05h", "16/05": "17h-05h", "17/05": "17h-05h", "23/05": "05h-17h", "24/05": "05h-17h", "25/05": "05h-17h", "30/05": "17h-05h", "31/05": "17h-05h", "06/06": "05h-17h", "07/06": "05h-17h", "13/06": "17h-05h", "14/06": "17h-05h", "20/06": "05h-17h", "21/06": "05h-17h", "27/06": "17h-05h", "28/06": "17h-05h", "04/07": "05h-17h", "05/07": "05h-17h", "11/07": "17h-05h", "12/07": "17h-05h", "18/07": "05h-17h", "19/07": "05h-17h", "20/07": "05h-17h", "21/07": "05h-17h", "25/07": "17h-05h", "26/07": "17h-05h", "01/08": "05h-17h", "02/08": "05h-17h", "08/08": "17h-05h", "09/08": "17h-05h", "15/08": "05h-17h", "16/08": "05h-17h", "22/08": "17h-05h", "23/08": "17h-05h", "29/08": "05h-17h", "30/08": "05h-17h", "05/09": "17h-05h", "06/09": "17h-05h", "12/09": "05h-17h", "13/09": "05h-17h", "19/09": "17h-05h", "20/09": "17h-05h", "26/09": "05h-17h", "27/09": "05h-17h", "03/10": "17h-05h", "04/10": "17h-05h", "10/10": "05h-17h", "11/10": "05h-17h", "17/10": "17h-05h", "18/10": "17h-05h", "24/10": "05h-17h", "25/10": "05h-17h", "31/10": "17h-05h", "01/11": "17h-05h", "07/11": "05h-17h", "08/11": "05h-17h", "11/11": "17h-05h", "14/11": "05h-17h", "15/11": "05h-17h", "21/11": "17h-05h", "22/11": "17h-05h", "28/11": "05h-17h", "29/11": "05h-17h", "05/12": "17h-05h", "06/12": "17h-05h", "12/12": "05h-17h", "13/12": "05h-17h", "19/12": "17h-05h", "20/12": "17h-05h", "25/12": "05h-17h", "26/12": "05h-17h", "27/12": "05h-17h"};
var H2027={"01/01": "17h-05h", "02/01": "17h-05h", "03/01": "17h-05h", "09/01": "05h-17h", "10/01": "05h-17h", "16/01": "17h-05h", "17/01": "17h-05h", "23/01": "05h-17h", "24/01": "05h-17h", "30/01": "17h-05h", "31/01": "17h-05h", "06/02": "05h-17h", "07/02": "05h-17h", "13/02": "17h-05h", "14/02": "17h-05h", "20/02": "05h-17h", "21/02": "05h-17h", "27/02": "17h-05h", "28/02": "17h-05h", "06/03": "05h-17h", "07/03": "05h-17h", "13/03": "17h-05h", "14/03": "17h-05h", "20/03": "05h-17h", "21/03": "05h-17h", "27/03": "17h-05h", "28/03": "17h-05h", "03/04": "05h-17h", "04/04": "05h-17h", "05/04": "05h-17h", "10/04": "17h-05h", "11/04": "17h-05h", "17/04": "05h-17h", "18/04": "05h-17h", "24/04": "17h-05h", "25/04": "17h-05h", "01/05": "05h-17h", "02/05": "05h-17h", "08/05": "17h-05h", "09/05": "17h-05h", "13/05": "05h-17h", "14/05": "05h-17h", "15/05": "05h-17h", "16/05": "05h-17h", "22/05": "17h-05h", "23/05": "17h-05h", "24/05": "17h-05h", "29/05": "05h-17h", "30/05": "05h-17h", "05/06": "17h-05h", "06/06": "17h-05h", "12/06": "05h-17h", "13/06": "05h-17h", "19/06": "17h-05h", "20/06": "17h-05h", "26/06": "05h-17h", "27/06": "05h-17h", "03/07": "17h-05h", "04/07": "17h-05h", "10/07": "05h-17h", "11/07": "05h-17h", "17/07": "17h-05h", "18/07": "17h-05h", "21/07": "05h-17h", "24/07": "17h-05h", "25/07": "17h-05h", "31/07": "05h-17h", "01/08": "05h-17h", "07/08": "17h-05h", "08/08": "17h-05h", "14/08": "05h-17h", "15/08": "05h-17h", "21/08": "17h-05h", "22/08": "17h-05h", "28/08": "05h-17h", "29/08": "05h-17h", "04/09": "17h-05h", "05/09": "17h-05h", "11/09": "05h-17h", "12/09": "05h-17h", "18/09": "17h-05h", "19/09": "17h-05h", "25/09": "05h-17h", "26/09": "05h-17h", "02/10": "17h-05h", "03/10": "17h-05h", "09/10": "05h-17h", "10/10": "05h-17h", "16/10": "17h-05h", "17/10": "17h-05h", "23/10": "05h-17h", "24/10": "05h-17h", "30/10": "17h-05h", "31/10": "17h-05h", "01/11": "17h-05h", "06/11": "05h-17h", "07/11": "05h-17h", "11/11": "17h-05h", "12/11": "17h-05h", "13/11": "17h-05h", "14/11": "17h-05h", "20/11": "05h-17h", "21/11": "05h-17h", "27/11": "17h-05h", "28/11": "17h-05h", "04/12": "05h-17h", "05/12": "05h-17h", "11/12": "17h-05h", "12/12": "17h-05h", "18/12": "05h-17h", "19/12": "05h-17h", "25/12": "17h-05h", "26/12": "17h-05h"};
var OPTS={TL:['TL','ziek','verlof','recup'],INPAK:['coordinateur','31/32','33/34','35/36','extra','Labo','AW1','AW2','ziek','verlof','recup'],Prod:['Prod','Labo','ziek','verlof','recup'],Unit:['Batter','Cleaning','Inpak','Bulk','AW1','AW2','ziek','verlof','recup']};
var ABS=[{n:'Nicolas Fettu',a:'04/01/2025',b:'05/01/2025',d:2,y:'2025'},{n:'Nicolas Fettu',a:'26/04/2025',b:'27/04/2025',d:2,y:'2025'},{n:'Nicolas Fettu',a:'22/11/2025',b:'22/11/2025',d:1,y:'2025'},{n:'Mohamed Lalaoui',a:'29/11/2025',b:'30/11/2025',d:2,y:'2025'},{n:'Ramazani Abdulhassan',a:'28/06/2025',b:'29/06/2025',d:2,y:'2025'},{n:'Halima Laadi',a:'07/06/2025',b:'08/06/2025',d:2,y:'2025'},{n:'Halima Laadi',a:'13/09/2025',b:'14/09/2025',d:2,y:'2025'},{n:'Halima Laadi',a:'14/12/2025',b:'14/12/2025',d:1,y:'2025'},{n:'Balan Marius',a:'13/12/2025',b:'14/12/2025',d:2,y:'2025'},{n:'Lyse Musik',a:'14/12/2025',b:'14/12/2025',d:1,y:'2025'},{n:'Max Secember',a:'26/04/2025',b:'27/04/2025',d:2,y:'2025'},{n:'Monir Salmi',a:'08/02/2025',b:'09/02/2025',d:2,y:'2025'},{n:'Anthony Raimondi',a:'15/11/2025',b:'23/11/2025',d:4,y:'2025'},{n:'Nicolas Fettu',a:'07/02/2026',b:'08/02/2026',d:2,y:'2026'},{n:'Julien Demuyter',a:'11/01/2026',b:'11/01/2026',d:1,y:'2026'},{n:'Julien Demuyter',a:'22/03/2026',b:'22/03/2026',d:1,y:'2026'},{n:'Julien Demuyter',a:'25/04/2026',b:'26/04/2026',d:2,y:'2026'},{n:'Mohamed Lalaoui',a:'14/03/2026',b:'22/03/2026',d:4,y:'2026'},{n:'Mohamed Lalaoui',a:'11/04/2026',b:'19/04/2026',d:4,y:'2026'},{n:'Ramazani Abdulhassan',a:'14/02/2026',b:'15/02/2026',d:2,y:'2026'},{n:'Halima Laadi',a:'11/04/2026',b:'12/04/2026',d:2,y:'2026'},{n:'Hakkim Akkouh',a:'27/06/2026',b:'28/06/2026',d:2,y:'2026'},{n:'Anthony Raimondi',a:'17/01/2026',b:'18/01/2026',d:2,y:'2026'},{n:'Anthony Raimondi',a:'28/02/2026',b:'01/03/2026',d:2,y:'2026'},{n:'Anthony Raimondi',a:'28/03/2026',b:'29/03/2026',d:2,y:'2026'},{n:'Lachen Baraik',a:'31/01/2026',b:'15/02/2026',d:6,y:'2026'}];
var BD=[{n:'Aurelien Turchi',D:0,S:0,sc:0,T:[0,0,0,0]},{n:'Nicolas Fettu',D:3,S:2,sc:12,T:[0,0,1,0]},{n:'Julien Demuyter',D:4,S:3,sc:36,T:[0,0,0,0]},{n:'Mohamed Lalaoui',D:10,S:3,sc:90,T:[0,0,2,0]},{n:'Ramazani Abdulhassan',D:4,S:2,sc:16,T:[0,0,0,2]},{n:'Halima Laadi',D:5,S:3,sc:45,T:[0,0,0,0]},{n:'Hakkim Akkouh',D:2,S:1,sc:2,T:[0,0,0,0]},{n:'Balan Marius',D:2,S:1,sc:2,T:[0,0,0,0]},{n:'Lyse Musik',D:1,S:1,sc:1,T:[0,0,0,0]},{n:'Max Secember',D:0,S:0,sc:0,T:[0,0,0,0]},{n:'Larissa Fratutescu',D:0,S:0,sc:0,T:[0,0,0,0]},{n:'Monir Salmi',D:0,S:0,sc:0,T:[0,0,0,0]},{n:'Anthony Raimondi',D:10,S:4,sc:160,T:[0,0,0,0]},{n:'Brahim Akdim',D:0,S:0,sc:0,T:[0,0,0,0]},{n:'Lachen Baraik',D:6,S:1,sc:6,T:[0,0,0,0]}];
function scColor(s){return s<=50?'#10b981':s<=200?'#f59e0b':s<=500?'#f97316':'#ef4444';}
function scSt(s){return s<=50?{l:'OK',c:'ok'}:s<=200?{l:'A surveiller',c:'wn'}:s<=500?{l:'Preoccupant',c:'al'}:{l:'Critique',c:'cr'};}
function sCls(v){var m={'TL':'tl','coordinateur':'coord','31/32':'31','33/34':'33','35/36':'35','extra':'ex','Prod':'pr','Labo':'lb','Batter':'bt','Cleaning':'cl','Inpak':'ip','Bulk':'bk','ziek':'zk','verlof':'vl','recup':'rc','AW1':'aw1','AW2':'aw2'};return 's-'+(m[v]||'em');}
function sLbl(v){var m={'coordinateur':'COORD','TL':'TL'};return m[v]||v||'-';}
function todayStr(){var n=new Date();return String(n.getDate()).padStart(2,'0')+'/'+String(n.getMonth()+1).padStart(2,'0');}
function allDates(){return(curYear==='2027'?WEEKS27:curYear==='2026'?WEEKS26:WEEKS25).reduce(function(a,w){return a.concat(w.d);},[]);}
function toast(msg,col){var t=document.createElement('div');t.className='toast';t.innerHTML='<div class="tdot" style="background:'+col+'"></div>'+msg;document.body.appendChild(t);setTimeout(function(){t.style.opacity='0';t.style.transition='opacity .3s';setTimeout(function(){t.remove();},300);},2500);}
document.querySelectorAll('.tab').forEach(function(b){b.addEventListener('click',function(){document.querySelectorAll('.tab').forEach(function(x){x.classList.remove('on');});document.querySelectorAll('.pane').forEach(function(x){x.classList.remove('on');});b.classList.add('on');document.getElementById('pane-'+b.dataset.tab).classList.add('on');});});
function initFirebase(app){db=firebase.database(app);db.ref('planning/shifts2026').on('value',function(snap){if(isSyncing)return;var data=snap.val();if(!data)return;var changed=false;SHIFTS26.forEach(function(emp){if(data[emp.n]&&data[emp.n].length){emp.s=data[emp.n];changed=true;}});if(changed){buildPT();recalc();buildBT();updKPI();refreshCharts();}updSlbl(new Date().toISOString());});
  db.ref('planning/shifts2027').on('value',function(snap){if(isSyncing)return;var data=snap.val();if(!data)return;SHIFTS27.forEach(function(emp){if(data[emp.n]&&data[emp.n].length)emp.s=data[emp.n];});if(curYear==='2027')buildPT();});db.ref('planning/shifts2025').on('value',function(snap){if(isSyncing)return;var data=snap.val();if(!data)return;SHIFTS25.forEach(function(emp){if(data[emp.n]&&data[emp.n].length)emp.s=data[emp.n];});});if(currentUser&&currentUser.role==='admin'){db.ref('planning/absences').on('value',function(snap){if(isSyncing)return;var data=snap.val();if(!data)return;var arr=Array.isArray(data)?data:Object.values(data);ABS.splice(0,ABS.length);arr.forEach(function(a){if(a)ABS.push(a);});buildAbs(document.querySelector('.fb.on')?document.querySelector('.fb.on').dataset.f:'all');updAbsLbl();recalc();buildBT();updKPI();refreshCharts();});}db.ref('.info/connected').on('value',function(snap){var el=document.getElementById('conn-status');if(!el)return;if(snap.val()){el.textContent='En ligne';el.style.color='var(--green)';}else{el.textContent='Hors ligne';el.style.color='var(--amber)';}});
  db.ref('bradford/comments').on('value',function(snap){var data=snap.val();if(!data)return;BD_COMMENTS={};Object.keys(data).forEach(function(k){BD_COMMENTS[k]=data[k];});buildBT();});
  db.ref('bradford/import_ts').on('value',function(snap){var v=snap.val();var el=document.getElementById('protime-last-import');if(el&&v)el.textContent='Dernier import : '+new Date(v).toLocaleString('fr-BE');});}
function save(){if(!db)return;isSyncing=true;var d26={};SHIFTS26.forEach(function(e){d26[e.n]=e.s;});var d25={};SHIFTS25.forEach(function(e){d25[e.n]=e.s;});var upd={};upd['planning/shifts2026']=d26;upd['planning/shifts2025']=d25;upd['planning/absences']=ABS;upd['planning/lastUpdate']={at:new Date().toISOString(),by:currentUser?currentUser.email:'anonyme'};db.ref().update(upd).then(function(){isSyncing=false;updSlbl(new Date().toISOString());}).catch(function(err){isSyncing=false;toast('Erreur: '+err.message,'#ef4444');});}
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
  document.getElementById('k-crm').textContent=cr.length>0?'Score > 500 urgent':'Score > 500 aucun';
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
      alerts.push('<b>'+e.n.split(' ')[0]+'</b> est passé de <i>'+prev+'</i> à <i>'+curr+'</i>');
    }
    BD_PREV_STATUS[e.n]=curr;
  });
  alertEl.innerHTML=alerts.length?'<div style="background:#f59e0b22;border:1px solid #f59e0b55;border-radius:8px;padding:10px 14px;font-size:13px;color:#f59e0b;margin-bottom:12px">⚠ '+alerts.join(' &nbsp;·&nbsp; ')+'</div>':'';
}
var chB,chT,chJ;
function initCharts(){var s=[].concat(BD).sort(function(a,b){return b.sc-a.sc;});chB=new Chart(document.getElementById('cBrad'),{type:'bar',data:{labels:s.map(function(e){return e.n.split(' ')[0];}),datasets:[{data:s.map(function(e){return e.sc;}),backgroundColor:s.map(function(e){return scColor(e.sc)+'bb';}),borderColor:s.map(function(e){return scColor(e.sc);}),borderWidth:1,borderRadius:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#555c72',font:{size:11}}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#555c72',font:{size:11}},beginAtZero:true}}}});var tr={'Q1 2025':0,'Q2 2025':0,'Q3 2025':0,'Q4 2025':0,'Q1 2026':0,'Q2 2026':0};ABS.forEach(function(a){var p=a.a.split('/');var k='Q'+Math.ceil(Number(p[1])/3)+' '+p[2];if(tr[k]!==undefined)tr[k]+=a.d;});chT=new Chart(document.getElementById('cTrim'),{type:'line',data:{labels:Object.keys(tr),datasets:[{data:Object.values(tr),borderColor:'#3b82f6',backgroundColor:'rgba(59,130,246,.08)',borderWidth:2,pointBackgroundColor:'#3b82f6',pointRadius:5,fill:true,tension:.3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#555c72',font:{size:11}}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#555c72',font:{size:11}},beginAtZero:true}}}});var jj=[].concat(BD).filter(function(e){return e.D>0;}).sort(function(a,b){return b.D-a.D;});chJ=new Chart(document.getElementById('cJour'),{type:'bar',data:{labels:jj.map(function(e){return e.n.split(' ').pop();}),datasets:[{data:jj.map(function(e){return e.D;}),backgroundColor:jj.map(function(e){return scColor(e.sc)+'99';}),borderColor:jj.map(function(e){return scColor(e.sc);}),borderWidth:1,borderRadius:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#555c72',font:{size:11}}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#555c72',font:{size:11}},beginAtZero:true}}}});}
function refreshCharts(){var s=[].concat(BD).sort(function(a,b){return b.sc-a.sc;});chB.data.labels=s.map(function(e){return e.n.split(' ')[0];});chB.data.datasets[0].data=s.map(function(e){return e.sc;});chB.data.datasets[0].backgroundColor=s.map(function(e){return scColor(e.sc)+'bb';});chB.data.datasets[0].borderColor=s.map(function(e){return scColor(e.sc);});chB.update();var jj=[].concat(BD).filter(function(e){return e.D>0;}).sort(function(a,b){return b.D-a.D;});chJ.data.labels=jj.map(function(e){return e.n.split(' ').pop();});chJ.data.datasets[0].data=jj.map(function(e){return e.D;});chJ.data.datasets[0].backgroundColor=jj.map(function(e){return scColor(e.sc)+'99';});chJ.data.datasets[0].borderColor=jj.map(function(e){return scColor(e.sc);});chJ.update();}
function buildBT(){
  if(currentUser && currentUser.role !== 'admin') return;
  var tbl=document.getElementById('btable');
  var mx=Math.max.apply(null,BD.map(function(e){return e.sc;}));if(mx<1)mx=1;
  var h='<thead><tr><th>Employe</th><th>Role</th><th>Jours</th><th>Periodes</th><th>Score</th><th>Statut</th><th style="width:36px"></th></tr></thead><tbody>';
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
      h+='<td><b style="font-size:13px;cursor:pointer;text-decoration:none" onclick="openBradfordPanel(\''+e.n.replace(/'/g,"\\'")+'\')" title="Voir historique">'+e.n+' <span style="font-size:10px;color:var(--blue);opacity:.6">&#9432;</span></b></td>';
      h+='<td style="color:var(--tx3);font-size:12px">'+(emp?emp.r:'')+'</td>';
      h+='<td><span style="font-family:var(--mo)">'+e.D+'</span></td>';
      h+='<td><span style="font-family:var(--mo)">'+e.S+'</span></td>';
      h+='<td><div class="sbw"><div class="sbt"><div class="sbf" style="width:'+pct+'%;background:'+col+'"></div></div><span class="sv" style="color:'+col+'">'+e.sc+'</span></div></td>';
      h+='<td><span class="pill '+st.c+'">'+st.l+'</span></td>';
      h+='<td style="text-align:center"><span style="cursor:pointer" onclick="openComment(\''+e.n.replace(/'/g,"\\'")+'\')" title="Commentaire">'+cmIcon+'</span></td>';
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
    +'<div style="font-weight:700;font-size:15px;margin-bottom:4px">Commentaire — '+name+'</div>'
    +(cm.date?'<div style="font-size:11px;color:var(--tx3);margin-bottom:12px">Derniere modif : '+cm.date+(cm.author?' par '+cm.author:'')+'</div>':'<div style="margin-bottom:12px"></div>')
    +'<textarea id="cm-txt" style="width:100%;height:110px;background:var(--bg3);border:1px solid var(--bd2);border-radius:8px;color:var(--tx1);font-family:var(--fn);font-size:13px;padding:10px;resize:vertical">'+prev+'</textarea>'
    +'<div style="display:flex;gap:10px;margin-top:14px;justify-content:flex-end">'
    +'<button onclick="document.getElementById(\'cm-popup\').remove()" style="padding:8px 16px;border-radius:var(--r);border:1px solid var(--bd2);background:none;color:var(--tx2);font-family:var(--fn);cursor:pointer">Annuler</button>'
    +'<button onclick="saveComment(\''+name.replace(/'/g,"\\'")+'\')" style="padding:8px 16px;border-radius:var(--r);border:none;background:var(--blue);color:#fff;font-family:var(--fn);font-weight:600;cursor:pointer">Enregistrer</button>'
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
  toast(txt?'Commentaire enregistre':'Commentaire supprime','#10b981');
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
      +'<div style="font-size:11px;color:var(--tx3)">'+a.d+' jour'+(a.d>1?'s':'')+'</div></div>'
      +'<span style="font-size:11px;padding:2px 8px;border-radius:99px;background:#ef444422;color:#ef4444;border:1px solid #ef444455">Episode</span>'
      +'</div>';
  }).join(''):'<div style="color:var(--tx3);font-size:13px;padding:20px 0;text-align:center">Aucun episode maladie dans les 365 derniers jours</div>';

  d.innerHTML='<div style="padding:20px;border-bottom:1px solid var(--bd2);display:flex;justify-content:space-between;align-items:center">'
    +'<div><div style="font-weight:700;font-size:16px">'+name+'</div><span class="pill '+st.c+'" style="margin-top:4px;display:inline-block">'+st.l+'</span></div>'
    +'<button onclick="this.closest(\'div[style*=fixed]\').remove()" style="background:none;border:none;color:var(--tx3);font-size:22px;cursor:pointer;line-height:1">&times;</button>'
    +'</div>'
    +'<div style="padding:16px 20px;display:flex;gap:20px;border-bottom:1px solid var(--bd2)">'
    +'<div style="text-align:center"><div style="font-size:26px;font-weight:700;color:'+col+'">'+e.sc+'</div><div style="font-size:11px;color:var(--tx3)">Score</div></div>'
    +'<div style="text-align:center"><div style="font-size:26px;font-weight:700;color:var(--tx1)">'+e.S+'</div><div style="font-size:11px;color:var(--tx3)">Episodes</div></div>'
    +'<div style="text-align:center"><div style="font-size:26px;font-weight:700;color:var(--tx1)">'+e.D+'</div><div style="font-size:11px;color:var(--tx3)">Jours</div></div>'
    +'</div>'
    +'<div style="padding:16px 20px;border-bottom:1px solid var(--bd2)">'
    +'<div style="font-size:12px;font-weight:600;color:var(--tx3);margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em">Commentaire</div>'
    +'<div style="font-size:13px;color:var(--tx1);cursor:pointer;padding:8px;border-radius:8px;background:var(--bg3);min-height:36px" onclick="openComment(\''+name.replace(/'/g,"\\'")+'\')">'+( cm&&cm.text?cm.text:'<span style="color:var(--tx3)">Cliquer pour ajouter un commentaire...</span>')+'</div>'
    +(cm&&cm.date?'<div style="font-size:10px;color:var(--tx3);margin-top:4px">'+cm.date+(cm.author?' · '+cm.author:'')+'</div>':'')
    +'</div>'
    +'<div style="padding:16px 20px;flex:1;overflow-y:auto">'
    +'<div style="font-size:12px;font-weight:600;color:var(--tx3);margin-bottom:12px;text-transform:uppercase;letter-spacing:.05em">Historique episodes (365j)</div>'
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
      if(dd>=d0&&dd<=d1){abs30.push({name:a.n,date:fmtDDMM(day),type:a.t});}
    });
  });
  // Grouper par date
  var byDate={};
  abs30.forEach(function(x){if(!byDate[x.date])byDate[x.date]=[];byDate[x.date].push({name:x.name.split(' ')[0],type:x.type});});
  var daysWithAbs=days.filter(function(d){return byDate[fmtDDMM(d)]&&byDate[fmtDDMM(d)].length;});
  if(!daysWithAbs.length){el.innerHTML='<div style="color:var(--tx3);font-size:13px;padding:12px 0">Aucune absence prevue dans les 30 prochains jours</div>';return;}
  var MOIS=['jan','fev','mars','avr','mai','juin','juil','aout','sep','oct','nov','dec'];
  var h=daysWithAbs.map(function(d){
    var k=fmtDDMM(d);
    var entries=byDate[k];
    var dow=['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'][d.getDay()];
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
  var MOIS=['Janvier','Fevrier','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Decembre'];
  var mlbl=document.getElementById('month-label');
  if(mlbl) mlbl.textContent=curMonth!==null?MOIS[curMonth]:'Tous';
  document.getElementById('plan-title').textContent='Planning '+curYear+(curMonth!==null?' — '+MOIS[curMonth]:'');
  var tbl=document.getElementById('ptable');var td=todayStr();var allFull=allDates();
  // Les indices dans emp.s[] sont toujours relatifs a allFull (toute l'annee).
  // On construit une liste de {ddmm, realIdx} pour que la vue mois utilise
  // le bon index meme quand on filtre sur un sous-ensemble de colonnes.
  var allWithIdx=allFull.map(function(d,i){return {d:d,i:i};});
  var filtered=curMonth!==null?allWithIdx.filter(function(x){var m=parseInt(x.d.split('/')[1],10)-1;return m===curMonth;}):allWithIdx;
  var all=filtered.map(function(x){return x.d;});
  var ti=all.indexOf(td);var h='<thead><tr><th class="nc">Employe</th>';filtered.forEach(function(x,col){
  var d=x.d;
  var parts=d.split('/');
  var dt=new Date(Date.UTC(parseInt(curYear),parseInt(parts[1])-1,parseInt(parts[0])));
  var days=['Di','Lu','Ma','Me','Je','Ve','Sa'];
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
});h+='</tr></thead><tbody>';['TL','INPAK','Prod','Unit'].forEach(function(g){var emps=(curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25).filter(function(e){var f=EMP.find(function(x){return x.n===e.n;});return f&&f.g===g;});if(!emps.length)return;h+='<tr class="sr"><td colspan="'+(all.length+1)+'">'+g+'</td></tr>';emps.forEach(function(emp){h+='<tr><td class="nc">'+emp.n+'</td>';filtered.forEach(function(x,col){var sv=emp.s[x.i]||'';var isBdToday=(function(){
      var bd=EMP.find(function(e){return e.n===emp.n;});
      if(!bd||!bd.birthday) return false;
      var parts=bd.birthday.split('-');
      var bm=parseInt(parts[1],10),bday=parseInt(parts[2],10);
      var parts2=x.d.split('/');
      return parseInt(parts2[0],10)===bday&&parseInt(parts2[1],10)===bm;
    })();
    h+='<td class="'+(col===ti?'td-td':'')+'">'
      +'<span class="sp '+(sv?sCls(sv):'s-em')+'" data-n="'+emp.n+'" data-i="'+x.i+'" data-s="'+sv+'">'+(sv?sLbl(sv):'-')+'</span>'
      +(isBdToday?'<span style="font-size:10px;margin-left:2px" title="Anniversaire de '+emp.n.split(' ')[0]+'">⭐</span>':'')
      +'</td>';});h+='</tr>';});});h+='</tbody>';tbl.innerHTML=h;tbl.querySelectorAll('.sp[data-n]').forEach(function(p){p.addEventListener('click',function(e){e.stopPropagation();openPopup(p);});});var ntd=document.getElementById('no-today');if(ti===-1){ntd.style.display='flex';}else{ntd.style.display='none';requestAnimationFrame(function(){var sc=document.querySelector('.pscroll');var ths=document.querySelectorAll('.ptable thead tr th');var targetTh=ths[ti+1];if(targetTh&&sc){var scRect=sc.getBoundingClientRect();var thRect=targetTh.getBoundingClientRect();sc.scrollTo({left:sc.scrollLeft+(thRect.left-scRect.left)-sc.clientWidth/2+thRect.width/2,behavior:'smooth'});}});}}
function openPopup(pill){activePill=pill;popup=document.getElementById('popup');var nm=pill.dataset.n;var emp=EMP.find(function(e){return e.n===nm;});var opts=OPTS[emp?emp.g:'INPAK']||[];var cur=pill.dataset.s;var h='<div class="ptit">'+nm.split(' ')[0]+'</div>';opts.forEach(function(o){h+='<div class="popt" data-v="'+o+'"><span class="sp '+sCls(o)+'" style="'+(o===cur?'outline:1.5px solid #3b82f6':'')+'">'+sLbl(o)+'</span><span style="font-size:11px;color:var(--tx2)">'+(o==='ziek'?'Maladie':o==='verlof'?'Conge':o==='recup'?'Recuperation':o==='TL'?'Present':o==='AW1'?'Vers AW1':o==='AW2'?'Vers AW2':o)+'</span></div>';});h+='<div class="pcancel">Annuler</div>';popup.innerHTML=h;
var r=pill.getBoundingClientRect();
var left=r.left+window.scrollX;
if(left+180>window.innerWidth-8) left=window.innerWidth-188;
popup.style.left=left+'px';
popup.style.visibility='hidden';
popup.style.display='block';
var popupHeight=popup.offsetHeight;
popup.style.visibility='visible';
var spaceBelow=window.innerHeight-r.bottom;
var top;
if(spaceBelow>=popupHeight+8){
  top=r.bottom+window.scrollY+4;
}else{
  top=r.top+window.scrollY-popupHeight-4;
  if(top<window.scrollY+4) top=window.scrollY+4;
}
popup.style.top=top+'px';
popup.querySelectorAll('.popt').forEach(function(o){o.addEventListener('click',function(){applyShift(o.dataset.v);});});popup.querySelector('.pcancel').addEventListener('click',closePopup);}
function closePopup(){if(popup)popup.style.display='none';activePill=null;}
document.addEventListener('click',function(e){if(popup&&!popup.contains(e.target))closePopup();});
function canEdit(){if(!currentUser){toast('Non connecte','#ef4444');return false;}if(currentUser.role==='admin'||currentUser.role==='subchef'){return true;}toast('Acces non autorise','#ef4444');return false;}
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
      ABS.push({n:nm,a:fd,b:fd,d:1,y:curYear,t:'ziek'});
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
  if(el) el.textContent=ABS.length+' absences 2025-2026';
}
function buildAbs(f){var grid=document.getElementById('agrid');var ziekOnly=ABS.filter(function(a){return a.t==='ziek';});var mx=Math.max.apply(null,ziekOnly.map(function(a){return a.d;}));if(mx<1)mx=1;var list=[].concat(ziekOnly);if(f&&f!=='all')list=list.filter(function(a){return a.y===f||a.n===f;});list.sort(function(a,b){return b.d-a.d;});
grid.innerHTML=list.map(function(a){var pct=Math.round(a.d/mx*100);return '<div class="arow"><div class="an">'+a.n+'</div><div class="ad">'+a.a+'</div><div class="ad">'+a.b+'</div><div class="aj">'+a.d+'j</div><div class="ab"><div class="abf" style="width:'+pct+'%;background:#ef4444"></div></div><div class="ay">'+a.y+'</div></div>';}).join('')||'<div class="empty">Aucune absence maladie</div>';}
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
function doPrint(fromIdx,toIdx){var all=allDates();if(fromIdx===undefined)fromIdx=0;if(toIdx===undefined)toIdx=all.length-1;var selDates=all.slice(fromIdx,toIdx+1);var SC={'TL':{bg:'#eef2ff',c:'#3730a3',b:'#c7d2fe'},'coordinateur':{bg:'#e8f0fe',c:'#1a56db',b:'#93c5fd'},'31/32':{bg:'#d1fae5',c:'#065f46',b:'#6ee7b7'},'33/34':{bg:'#ccfbf1',c:'#0f766e',b:'#5eead4'},'35/36':{bg:'#ede9fe',c:'#5b21b6',b:'#c4b5fd'},'extra':{bg:'#f3f4f6',c:'#374151',b:'#d1d5db'},'Prod':{bg:'#fff7ed',c:'#9a3412',b:'#fdba74'},'Labo':{bg:'#ecfeff',c:'#0e7490',b:'#67e8f9'},'Batter':{bg:'#fdf2f8',c:'#831843',b:'#f0abfc'},'Cleaning':{bg:'#eff6ff',c:'#1e40af',b:'#93c5fd'},'Inpak':{bg:'#ecfdf5',c:'#065f46',b:'#6ee7b7'},'Bulk':{bg:'#f5f3ff',c:'#4c1d95',b:'#c4b5fd'},'ziek':{bg:'#fff1f2',c:'#9f1239',b:'#fca5a5'},'verlof':{bg:'#fffbeb',c:'#92400e',b:'#fcd34d'},'AW1':{bg:'#fef2f2',c:'#991b1b',b:'#fca5a5'},'AW2':{bg:'#faf5ff',c:'#6b21a8',b:'#d8b4fe'}};var nb=selDates.length;var fs=nb<=6?14:nb<=8?13:nb<=10?12:nb<=14?11:nb<=18?10:9;var tb='';['TL','INPAK','Prod','Unit'].forEach(function(g){var em=(curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25).filter(function(e){var f=EMP.find(function(x){return x.n===e.n;});return f&&f.g===g;});if(!em.length)return;tb+='<tr style="background:#1e293b"><td colspan="'+(selDates.length+1)+'" style="color:#fff;font-size:8px;font-weight:700;text-transform:uppercase;padding:3px 6px">'+g+'</td></tr>';em.forEach(function(emp){tb+='<tr><td style="text-align:left;padding-left:6px;font-weight:600;font-size:'+(fs-1)+'px;border-right:2px solid #d1d5db;background:#fafafa;width:130px">'+emp.n+'</td>';selDates.forEach(function(d,i){var si=fromIdx+i;var s=emp.s[si]||'';var c=SC[s]||{bg:'#f9fafb',c:'#6b7280',b:'#e5e7eb'};tb+='<td style="padding:2px;text-align:center;border:.5px solid #e5e7eb">'+(s?'<span style="background:'+c.bg+';color:'+c.c+';border:1px solid '+c.b+';padding:2px 5px;border-radius:3px;font-size:'+fs+'px;font-weight:600">'+sLbl(s)+'</span>':'')+'</td>';});tb+='</tr>';});});var w=window.open('','_blank');w.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Planning '+curYear+'</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Inter,Arial,sans-serif;font-size:'+fs+'px;color:#111;background:#fff;padding:10mm}table{width:100%;border-collapse:collapse;table-layout:fixed}th{background:#f3f4f6;font-size:'+(fs-1)+'px;font-weight:600;padding:4px 2px;text-align:center;border:.5px solid #e5e7eb}.pbtn{position:fixed;top:14px;right:14px;background:#1e293b;color:#fff;border:none;border-radius:6px;padding:7px 16px;font-size:12px;cursor:pointer}@media print{.pbtn{display:none}@page{size:A3 landscape;margin:8mm}}</style></head><body>');w.document.write('<button class="pbtn" onclick="window.print()">Imprimer</button>');w.document.write('<div style="display:flex;justify-content:space-between;border-bottom:1.5px solid #111;padding-bottom:8px;margin-bottom:10px"><div><div style="font-size:16px;font-weight:700">Planning '+curYear+' - AW3 Ploeg 5</div><div style="font-size:10px;color:#555">Week-ends, feries et ponts</div></div><div style="font-size:10px;color:#555">'+new Date().toLocaleDateString('fr-BE',{day:'2-digit',month:'long',year:'numeric'})+'</div></div>');w.document.write('<table><thead><tr><th style="text-align:left;padding-left:6px;width:130px">Operateur</th>'+selDates.map(function(d){return '<th>'+d+'</th>';}).join('')+'</tr></thead><tbody>'+tb+'</tbody></table>');w.document.write('</body></html>');w.document.close();w.focus();}
function applyRole(role){
  var isAdmin = role === 'admin';
  var isSubchef = role === 'subchef';

  // Badge role
  var badge = document.getElementById('role-badge');
  if(badge){
    if(isAdmin){
      badge.textContent='Admin';
      badge.style.background='rgba(16,185,129,.15)';
      badge.style.color='var(--green)';
      badge.style.borderColor='rgba(16,185,129,.3)';
    } else {
      badge.textContent='Sous-chef';
      badge.style.background='rgba(59,130,246,.15)';
      badge.style.color='var(--blue)';
      badge.style.borderColor='rgba(59,130,246,.3)';
    }
  }

  // Onglet Admin — admin seulement
  var adminTab = document.getElementById('tab-admin-btn');
  if(adminTab) adminTab.style.display = isAdmin ? 'flex' : 'none';

  // Email dans panneau admin
  var ae = document.getElementById('admin-email-display');
  if(ae && currentUser) ae.textContent = currentUser.email;

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
  if(currentUser.role==='admin'||currentUser.role==='subchef') return true;
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
      +'<button onclick="editEmp('+i+')" style="padding:3px 10px;border-radius:6px;border:1px solid var(--bd2);background:none;color:var(--tx2);font-size:11px;cursor:pointer;font-family:var(--fn);margin-right:4px">Modifier</button>'
      +'<button onclick="deactivateEmp('+i+')" style="padding:3px 10px;border-radius:6px;border:1px solid rgba(239,68,68,.3);background:none;color:var(--red);font-size:11px;cursor:pointer;font-family:var(--fn)">Retirer</button>'
      +'</td></tr>';
  }).join('');
}

function showAddEmp(){
  editingEmpId = null;
  document.getElementById('emp-modal-title').textContent = 'Ajouter un employe';
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
  document.getElementById('emp-modal-title').textContent = 'Modifier ' + e.n;
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
  if(!name){ err.textContent = 'Le nom est obligatoire.'; return; }
  if(!role){ err.textContent = 'Le role est obligatoire.'; return; }
  if(!db){ err.textContent = 'Firebase non connecte.'; return; }

  var id = editingEmpId || name.toLowerCase().replace(/[^a-z0-9]/g,'_').replace(/__+/g,'_');
  var order = editingEmpId ? (EMP.find(function(e){return e.id===editingEmpId;})||{}).order||99 : EMP.length;

  var bday = document.getElementById('emp-birthday')?document.getElementById('emp-birthday').value:'';
  var empData = {name:name, group:group, role:role, active:true, order:order};
  if(bday) empData.birthday = bday;
  document.getElementById('emp-save-btn').disabled = true;
  document.getElementById('emp-save-btn').textContent = 'Enregistrement...';

  db.ref('employees/'+id).set(empData).then(function(){
    // Mettre a jour EMP local
    var existing = EMP.findIndex(function(e){return (e.id||e.n.toLowerCase().replace(/[^a-z0-9]/g,'_').replace(/__+/g,'_'))===id;});
    if(existing !== -1){
      EMP[existing] = {n:name, g:group, r:role, id:id};
      if(bday) EMP[existing].birthday = bday;
    } else {
      var newEmp = {n:name, g:group, r:role, id:id};
      if(bday) newEmp.birthday = bday;
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
    toast(name + ' enregistre !', '#10b981');
    document.getElementById('emp-save-btn').disabled = false;
    document.getElementById('emp-save-btn').textContent = 'Enregistrer';
  }).catch(function(e){
    err.textContent = 'Erreur: ' + e.message;
    document.getElementById('emp-save-btn').disabled = false;
    document.getElementById('emp-save-btn').textContent = 'Enregistrer';
  });
}

function deactivateEmp(idx){
  var e = EMP[parseInt(idx)];
  if(!e) return;
  if(!confirm("Retirer " + e.n + " de l'equipe ? Son historique Bradford sera conserve.")) return;
  var id = e.id || e.n.toLowerCase().replace(/[^a-z0-9]/g,'_').replace(/__+/g,'_');
  if(!db){ toast('Firebase non connecte','#ef4444'); return; }
  db.ref('employees/'+id+'/active').set(false).then(function(){
    EMP.splice(parseInt(idx), 1);
    SHIFTS26.splice(SHIFTS26.findIndex(function(s){return s.n===e.n;}), 1);
    SHIFTS25.splice(SHIFTS25.findIndex(function(s){return s.n===e.n;}), 1);
    SHIFTS27.splice(SHIFTS27.findIndex(function(s){return s.n===e.n;}), 1);
    buildEmpTable();
    buildPT();
    buildBT();
    updKPI();
    toast(e.n + " retire de l'equipe", '#f59e0b');
  }).catch(function(err){ toast('Erreur: '+err.message,'#ef4444'); });
}

function doLogin(){var email=document.getElementById('li-email').value.trim();var pass=document.getElementById('li-pass').value;var btn=document.getElementById('li-btn');var err=document.getElementById('li-err');if(!email||!pass){err.textContent='Remplis tous les champs.';return;}btn.textContent='Connexion...';btn.disabled=true;err.textContent='';firebase.auth().signInWithEmailAndPassword(email,pass).catch(function(e){err.textContent=e.code==='auth/wrong-password'||e.code==='auth/user-not-found'?'Email ou mot de passe incorrect.':'Erreur: '+e.message;btn.textContent='Se connecter';btn.disabled=false;});}
function doLogout(){firebase.auth().signOut();}
window.addEventListener('load',function(){
  document.getElementById('dchip').textContent=new Date().toLocaleDateString('fr-BE',{weekday:'short',day:'2-digit',month:'short',year:'numeric'});
  var cfg={apiKey:"AIzaSyAexVCEfVxmShZ-m7xFAVfk9AzReBi2WTQ",authDomain:"aw3-p5-hub.firebaseapp.com",databaseURL:"https://aw3-p5-hub-default-rtdb.europe-west1.firebasedatabase.app",projectId:"aw3-p5-hub",storageBucket:"aw3-p5-hub.firebasestorage.app",messagingSenderId:"685884843934",appId:"1:685884843934:web:ab8f7b8e362959f1ab988f"};
  var app;try{app=firebase.apps.length?firebase.apps[0]:firebase.initializeApp(cfg);}catch(e){app=firebase.app();}
  firebase.auth(app).onAuthStateChanged(function(user){
    if(user){currentUser=user;document.getElementById('user-email').textContent=user.email;document.getElementById('login-screen').style.display='none';document.getElementById('app-screen').style.display='flex';firebase.database(app).ref('users/'+user.uid+'/role').once('value').then(function(snap){var role=snap.val()||'subchef';currentUser.role=role;applyRole(role);initFirebase(app);startApp();}).catch(function(){currentUser.role='subchef';applyRole('subchef');initFirebase(app);startApp();});}
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

      ABS.push({n:dashName, a:dateA, b:dateB, d:p.count, y:p.lastYear, t:p.value});
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
        recalc();updKPI();initCharts();buildBT();buildPT();buildAbs('all');updAbsLbl();buildMiniCal();buildTodayAbs();buildBirthdayNotif();buildBirthdayCal();
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
          if(e&&e.active!==false)empArr.push({n:e.name,g:e.group,r:e.role,id:k,order:e.order||99});
        });
        empArr.sort(function(a,b){return a.order-b.order;});
        if(empArr.length>0){
          EMP.splice(0,EMP.length);
          empArr.forEach(function(e){EMP.push({n:e.n,g:e.g,r:e.r,id:e.id});});
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
    if(currentUser && currentUser.role === 'admin'){
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
    recalc();updKPI();initCharts();buildBT();buildPT();buildAbs('all');updAbsLbl();buildEmpTable();buildMiniCal();buildTodayAbs();buildBirthdayNotif();buildBirthdayCal();
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
  var MOIS=['janvier','fevrier','mars','avril','mai','juin','juillet','aout','septembre','octobre','novembre','decembre'];
  var dow=['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'][now.getDay()];
  if(title) title.textContent='Absents aujourd\'hui \u2014 '+dow+' '+now.getDate()+' '+MOIS[now.getMonth()];
  if(!absToday.length){el.innerHTML='<div style="color:var(--tx3);font-size:13px;padding:12px 0;text-align:center">Tout le monde est present \u2705</div>';return;}
  el.innerHTML=absToday.map(function(a){
    var tc=a.t==='ziek'?'#ef4444':a.t==='verlof'?'#3b82f6':'#10b981';
    var tl=a.t==='ziek'?'Maladie':a.t==='verlof'?'Conge':'Recup';
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
    +'<div><div style="font-weight:700;font-size:14px;color:#fbbf24">Joyeux anniversaire !</div>'
    +'<div style="font-size:13px;color:var(--tx2)">'
    +bdToday.map(function(b){
      var age = new Date().getFullYear()-b.year;
      return '<b>'+b.n.split(' ')[0]+'</b> fête ses '+age+' ans aujourd\'hui 🎉';
    }).join(' &nbsp;·&nbsp; ')
    +'</div></div>';
}

function buildBirthdayCal(){
  var el = document.getElementById('birthday-cal');
  if(!el) return;
  var now = new Date();
  var bdAll = getBirthdays();
  if(!bdAll.length){
    el.innerHTML='<div style="color:var(--tx3);font-size:13px;padding:12px 0;text-align:center">Aucune date de naissance enregistrée — ajoutez-les dans Admin > Employés</div>';
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

  var MOIS=['jan','fév','mars','avr','mai','juin','juil','août','sep','oct','nov','déc'];
  var DOW=['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];

  el.innerHTML = upcoming.map(function(b){
    var isToday = b.daysUntil === 0;
    var isSoon = b.daysUntil <= 7;
    var workDay = nextWorkDay(b.next);
    var workInfo = '';
    if(workDay && workDay.offset > 0){
      workInfo = '<span style="font-size:10px;color:var(--tx3);margin-left:6px">→ fêté le '+DOW[workDay.date.getDay()]+' '+workDay.date.getDate()+' '+MOIS[workDay.date.getMonth()]+'</span>';
    }
    var bg = isToday?'rgba(251,191,36,.15)':isSoon?'rgba(59,130,246,.07)':'';
    var border = isToday?'border-left:3px solid #fbbf24':'border-left:3px solid transparent';
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:9px 8px;border-bottom:1px solid var(--bd2);'+border+';background:'+bg+'">'
      +'<div style="display:flex;align-items:center;gap:10px">'
      +(isToday?'<span style="font-size:18px">🎂</span>':'<span style="font-size:16px">🎁</span>')
      +'<div>'
      +'<div style="font-size:13px;font-weight:600;color:var(--tx1)">'+b.n.split(' ')[0]+'<span style="font-weight:400;color:var(--tx3);font-size:12px"> '+b.n.split(' ').slice(1).join(' ')+'</span></div>'
      +'<div style="font-size:11px;color:var(--tx3)">'+b.day+' '+MOIS[b.month-1]+' &mdash; '+b.age+' ans'+workInfo+'</div>'
      +'</div></div>'
      +'<div style="text-align:right">'
      +(isToday?'<span style="font-size:12px;font-weight:700;color:#fbbf24">Aujourd\'hui !</span>'
               :'<span style="font-size:12px;font-weight:600;color:'+(isSoon?'var(--blue)':'var(--tx3)')+'">dans '+b.daysUntil+'j</span>')
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
function loadBirthdaysFromFirebase(){
  if(!db) return;
  db.ref('employees').once('value').then(function(snap){
    var data = snap.val();
    if(!data) return;
    Object.keys(data).forEach(function(id){
      var emp = data[id];
      if(!emp.birthday) return;
      var found = EMP.find(function(e){return e.n===emp.name;});
      if(found) found.birthday = emp.birthday;
    });
    buildBirthdayNotif();
    buildBirthdayCal();
    buildPT(); // refresh planning avec étoiles
  });
}

