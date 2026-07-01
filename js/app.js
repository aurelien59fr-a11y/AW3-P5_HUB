/* style.css — AW3 Ploeg 5 Bradford Dashboard */


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
