// ─── RIVAL v0.4 — MINIMALIST ──────────────────────────────────────────────────
// Flat, confident, restrained. No glass, no gradients, no glow.
// Typography + spacing + color discipline carry the design.
// Same reducer / state shape — drop-in replacement
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useReducer, useMemo, useRef } from "react";

/* ─── FONTS ───────────────────────────────────────────────────────────────── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Anton&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap');
  `}</style>
);

/* ─── DESIGN TOKENS ──────────────────────────────────────────────────────── */
const Tokens = () => (
  <style>{`
    /* ───── DARK ───── pure neutral grays, no warmth. Acid green is the only accent. */
    :root, [data-theme="dark"] {
      --bg:#0A0A0A; --bg1:#141414; --bg2:#1C1C1C; --bg3:#262626;
      --line:#262626; --line2:#333333; --muted:#525252; --sub:#737373;
      --body:#A3A3A3; --text:#FAFAFA; --white:#FFFFFF;
      --yes:#A3E635; --yes-d:#A3E63514; --yes-g:#A3E63540;
      --no:#EF4444; --no-d:#EF444414;
      --gold:#F59E0B; --gold-d:#F59E0B14;
      --ink:#0A0A0A;
    }
    /* ───── LIGHT ───── pure paper white, neutral grays. Same accents, deeper. */
    [data-theme="light"] {
      --bg:#FAFAFA; --bg1:#FFFFFF; --bg2:#F5F5F5; --bg3:#E5E5E5;
      --line:#E5E5E5; --line2:#D4D4D4; --muted:#A3A3A3; --sub:#737373;
      --body:#404040; --text:#0A0A0A; --white:#0A0A0A;
      --yes:#3F8E0F; --yes-d:#3F8E0F12; --yes-g:#3F8E0F33;
      --no:#DC2626; --no-d:#DC262612;
      --gold:#B45309; --gold-d:#B4530912;
      --ink:#FAFAFA;
    }

    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    html,body,#root{
      height:100%;background:var(--bg);color:var(--text);
      font-family:'Geist',-apple-system,sans-serif;
      -webkit-font-smoothing:antialiased;
      overscroll-behavior:none;
    }
    ::-webkit-scrollbar{display:none;} *{scrollbar-width:none;}

    .display{font-family:'Anton',sans-serif;letter-spacing:-0.01em;}
    .head{font-family:'Bricolage Grotesque',sans-serif;letter-spacing:-0.025em;}
    .mono{font-family:'Geist Mono',monospace;font-feature-settings:"ss01","ss02";}

    /* ─── LAYOUT ──────────────────────────────────────────────────────────── */
    .app{
      height:100vh;display:flex;flex-direction:column;
      max-width:520px;margin:0 auto;background:var(--bg);
      position:relative;overflow:hidden;
    }
    .topbar{
      height:56px;padding:0 18px;
      display:flex;align-items:center;justify-content:space-between;
      border-bottom:1px solid var(--line);
      background:var(--bg);
      position:relative;z-index:10;flex-shrink:0;
    }
    .content{flex:1;overflow-y:auto;overflow-x:hidden;padding-bottom:76px;}
    .page{padding:20px 18px 28px;}

    /* ─── LOGO ────────────────────────────────────────────────────────────── */
    .logo{display:flex;align-items:center;gap:8px;}
    .logo-dot{width:6px;height:6px;border-radius:50%;background:var(--yes);}
    .logo-wd{
      font-family:'Anton',sans-serif;font-size:22px;letter-spacing:-0.02em;
      color:var(--text);text-transform:uppercase;line-height:1;
    }

    /* ─── LIVE TICKER (flat strip, no float) ─────────────────────────────── */
    .ticker-wrap{
      height:32px;border-bottom:1px solid var(--line);
      overflow:hidden;background:var(--bg1);flex-shrink:0;
    }
    .ticker-track{
      display:flex;gap:32px;align-items:center;height:100%;
      animation:ticker-scroll 30s linear infinite;
      white-space:nowrap;padding-left:18px;
    }
    @keyframes ticker-scroll{from{transform:translateX(0);}to{transform:translateX(-50%);}}
    .ticker-item{display:flex;align-items:center;gap:8px;font-size:11px;color:var(--sub);font-family:'Geist Mono',monospace;}
    .ticker-dot{width:5px;height:5px;border-radius:50%;background:var(--yes);}
    .ticker-dot.no{background:var(--no);}
    .ticker-dot.gold{background:var(--gold);}
    .ticker-name{color:var(--text);font-weight:600;font-family:'Geist',sans-serif;}

    /* ─── BOTTOM NAV — flat, no ─────────────────────────────────────── */
    .bottomnav{
      position:absolute;bottom:0;left:0;right:0;
      height:64px;
      background:var(--bg);border-top:1px solid var(--line);
      display:flex;justify-content:space-around;align-items:stretch;
      z-index:50;
    }
    .nav-btn{
      flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
      gap:3px;background:none;border:none;cursor:pointer;color:var(--muted);
      padding:8px 4px;font-family:'Geist',sans-serif;
      transition:color 0.15s;position:relative;
      -webkit-tap-highlight-color:transparent;
    }
    .nav-btn.on{color:var(--text);}
    .nav-btn.on .nav-svg{color:var(--yes);}
    .nav-svg{width:22px;height:22px;}
    .nav-label{font-size:10px;font-weight:500;letter-spacing:0.02em;}
    .nav-cta{
      width:48px;height:48px;border-radius:50%;
      background:var(--yes);color:var(--ink);
      display:flex;align-items:center;justify-content:center;border:none;cursor:pointer;
      font-size:24px;font-weight:300;line-height:1;
      margin-top:-12px;align-self:center;
      transition:transform 0.15s;
      -webkit-tap-highlight-color:transparent;
    }
    .nav-cta:active{transform:scale(0.92);}
    .nav-badge{
      position:absolute;top:6px;right:24%;background:var(--no);color:#fff;
      font-size:9px;font-weight:700;min-width:14px;height:14px;border-radius:7px;
      display:flex;align-items:center;justify-content:center;padding:0 3px;
      font-family:'Geist Mono',monospace;
    }

    /* ─── AVATARS ─────────────────────────────────────────────────────────── */
    .av{
      border-radius:50%;display:flex;align-items:center;justify-content:center;
      font-weight:700;flex-shrink:0;
      font-family:'Bricolage Grotesque',sans-serif;letter-spacing:-0.02em;
    }
    .av-sm{width:24px;height:24px;font-size:10px;}
    .av-md{width:36px;height:36px;font-size:13px;}
    .av-lg{width:48px;height:48px;font-size:17px;}
    .av-xl{width:72px;height:72px;font-size:24px;}

    /* ─── BUTTONS ─────────────────────────────────────────────────────────── */
    .btn{
      display:inline-flex;align-items:center;justify-content:center;gap:6px;
      border:none;cursor:pointer;
      font-family:'Geist',sans-serif;font-weight:600;
      border-radius:10px;transition:all 0.12s;white-space:nowrap;
      -webkit-tap-highlight-color:transparent;
    }
    .btn:active:not(:disabled){transform:scale(0.97);}
    .btn:disabled{opacity:0.35;cursor:not-allowed;}
    .btn-pri{
      background:var(--yes);color:var(--ink);
      padding:14px 22px;font-size:14px;
    }
    .btn-pri:hover:not(:disabled){filter:brightness(0.95);}
    .btn-ghost{
      background:transparent;color:var(--text);
      border:1px solid var(--line2);
      padding:12px 18px;font-size:13px;
    }
    .btn-ghost:hover:not(:disabled){background:var(--bg2);}
    .btn-yes{background:var(--yes-d);color:var(--yes);border:1px solid var(--yes-g);padding:12px 18px;font-size:13px;}
    .btn-yes:hover:not(:disabled){background:var(--yes);color:var(--ink);border-color:var(--yes);}
    .btn-no{background:var(--no-d);color:var(--no);border:1px solid var(--no-d);padding:12px 18px;font-size:13px;}
    .btn-no:hover:not(:disabled){background:var(--no);color:#fff;border-color:var(--no);}
    .btn-gold{background:var(--gold-d);color:var(--gold);border:1px solid var(--gold-d);padding:12px 18px;font-size:13px;}
    .btn-gold:hover:not(:disabled){background:var(--gold);color:var(--ink);}
    .btn-danger{background:var(--no);color:#fff;padding:12px 18px;font-size:13px;}
    .btn-danger:hover:not(:disabled){filter:brightness(1.1);}
    .btn-sm{padding:8px 14px;font-size:12px;border-radius:8px;}
    .btn-xs{padding:5px 10px;font-size:11px;border-radius:6px;}
    .btn-full{width:100%;}

    /* ─── BET CARD ────────────────────────────────────────────────────────── */
    .bet{
      background:var(--bg1);border:1px solid var(--line);
      border-radius:14px;padding:16px;
      transition:border-color 0.12s;
    }
    .bet:hover{border-color:var(--line2);}
    .bet-row{display:flex;align-items:center;gap:10px;margin-bottom:10px;}
    .bet-who{flex:1;min-width:0;}
    .bet-who-n{font-size:13px;font-weight:600;color:var(--text);display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
    .bet-who-t{font-size:11px;color:var(--sub);font-family:'Geist Mono',monospace;}
    .bet-q{font-family:'Bricolage Grotesque',sans-serif;font-size:17px;font-weight:600;line-height:1.2;letter-spacing:-0.02em;margin-bottom:6px;color:var(--text);}
    .bet-side{font-size:12px;color:var(--sub);margin-bottom:12px;}
    .bet-side strong{color:var(--body);font-weight:500;}

    /* ─── HERO BET CARD ───────────────────────────────────────────────────── */
    .hero{
      background:var(--bg1);border:1px solid var(--line);
      border-radius:16px;padding:20px;
      position:relative;
    }
    .hero-meta{display:flex;align-items:center;gap:10px;margin-bottom:14px;}
    .hero-q{font-family:'Bricolage Grotesque',sans-serif;font-size:26px;font-weight:700;line-height:1.1;letter-spacing:-0.03em;margin-bottom:14px;color:var(--text);}
    .hero-side{font-size:13px;color:var(--sub);margin-bottom:18px;}
    .hero-side strong{color:var(--text);font-weight:600;}

    /* YES/NO bar — flat, no glow */
    .yn{height:6px;border-radius:99px;overflow:hidden;background:var(--bg3);display:flex;margin:14px 0 8px;}
    .yn-y{height:100%;background:var(--yes);transition:width 0.4s ease;}
    .yn-n{height:100%;background:var(--no);transition:width 0.4s ease;}
    .yn-pcts{display:flex;justify-content:space-between;font-family:'Geist Mono',monospace;font-size:11px;font-weight:600;}
    .yn-pcts .y{color:var(--yes);}
    .yn-pcts .n{color:var(--no);}

    /* Stakes row */
    .stakes{display:grid;grid-template-columns:1fr 1px 1fr;gap:14px;margin-top:16px;padding-top:16px;border-top:1px solid var(--line);}
    .stakes-div{background:var(--line);height:100%;}
    .stake-l{font-size:9px;color:var(--sub);font-family:'Geist Mono',monospace;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px;}
    .stake-v{font-family:'Anton',sans-serif;font-size:26px;letter-spacing:-0.01em;line-height:1;color:var(--text);}
    .stake-v.gold{color:var(--gold);}
    .stake-v.green{color:var(--yes);}

    /* Odds chip */
    .odds{font-family:'Geist Mono',monospace;font-size:13px;font-weight:600;padding:4px 10px;border-radius:6px;flex-shrink:0;}
    .odds.pos{background:var(--yes-d);color:var(--yes);}
    .odds.neg{background:var(--no-d);color:var(--no);}

    /* Tags */
    .tag{display:inline-flex;align-items:center;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:600;letter-spacing:0.02em;font-family:'Geist Mono',monospace;}
    .t-live{background:var(--yes);color:var(--ink);}
    .t-live::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--ink);margin-right:5px;animation:pulse-dot 1.5s infinite;}
    @keyframes pulse-dot{0%,100%{opacity:1;}50%{opacity:0.4;}}
    .t-matched{background:var(--gold-d);color:var(--gold);}
    .t-won{background:var(--yes-d);color:var(--yes);}
    .t-lost{background:var(--no-d);color:var(--no);}
    .t-cat{background:var(--bg2);color:var(--sub);border:1px solid var(--line);}

    /* ─── INPUTS ─────────────────────────────────────────────────────────── */
    input,select,textarea{
      width:100%;
      background:var(--bg1);
      border:1px solid var(--line);
      color:var(--text);
      border-radius:10px;padding:13px 14px;
      font-family:'Geist',sans-serif;font-size:15px;
      outline:none;transition:border-color 0.12s;
      -webkit-appearance:none;
    }
    input:focus,select:focus{border-color:var(--text);}
    input::placeholder{color:var(--muted);}
    label{
      display:block;font-size:10px;font-weight:600;color:var(--sub);
      letter-spacing:0.08em;text-transform:uppercase;margin-bottom:6px;
      font-family:'Geist Mono',monospace;
    }
    .fg{margin-bottom:16px;}
    .err{
      font-size:11px;color:var(--no);margin-top:6px;
      padding:8px 10px;background:var(--no-d);border-radius:8px;
    }

    /* ─── SECTION HEAD ────────────────────────────────────────────────────── */
    .sec{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;padding-top:8px;}
    .sec-t{
      font-family:'Anton',sans-serif;font-size:13px;
      letter-spacing:0.04em;text-transform:uppercase;color:var(--text);
    }
    .sec-s{font-size:11px;color:var(--sub);font-family:'Geist Mono',monospace;}

    /* ─── PAGE TITLE ──────────────────────────────────────────────────────── */
    .pt-eyebrow{font-family:'Geist Mono',monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--sub);margin-bottom:6px;}
    .pt{font-family:'Anton',sans-serif;font-size:42px;line-height:0.95;letter-spacing:-0.02em;text-transform:uppercase;color:var(--text);margin-bottom:8px;}
    .pt-sub{font-size:13px;color:var(--sub);margin-bottom:20px;}

    /* ─── STAT CARDS ──────────────────────────────────────────────────────── */
    .stats-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:18px;}
    .stat{background:var(--bg1);border:1px solid var(--line);border-radius:12px;padding:14px 16px;}
    .stat-h{font-size:10px;color:var(--sub);font-family:'Geist Mono',monospace;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:6px;}
    .stat-n{font-family:'Anton',sans-serif;font-size:28px;line-height:1;letter-spacing:-0.01em;}

    /* ─── EMPTY STATES ────────────────────────────────────────────────────── */
    .empty{text-align:center;padding:48px 24px;}
    .empty-icon{
      font-family:'Anton',sans-serif;font-size:48px;letter-spacing:-0.02em;
      color:var(--bg3);line-height:0.85;margin-bottom:16px;text-transform:uppercase;
    }
    .empty-t{font-family:'Bricolage Grotesque',sans-serif;font-size:18px;font-weight:700;letter-spacing:-0.02em;margin-bottom:6px;}
    .empty-s{font-size:13px;color:var(--sub);}

    /* ─── TOASTS ──────────────────────────────────────────────────────────── */
    .toasts{
      position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
      z-index:300;display:flex;flex-direction:column;gap:8px;
      width:calc(100% - 36px);max-width:480px;pointer-events:none;
    }
    .toast{
      background:var(--bg1);border:1px solid var(--line2);
      border-radius:12px;padding:12px 14px;
      display:flex;gap:10px;align-items:flex-start;
      pointer-events:auto;cursor:pointer;
    }
    @keyframes toast-in{from{transform:translateY(20px);opacity:0;}to{transform:translateY(0);opacity:1;}}
    .toast{animation:toast-in 0.25s ease;}
    .toast-bar{width:3px;align-self:stretch;border-radius:2px;flex-shrink:0;}
    .toast-msg{font-size:13px;color:var(--text);font-weight:500;flex:1;}
    .toast-sub{font-size:11px;color:var(--sub);margin-top:2px;}

    /* ─── OVERLAYS / SHEETS — flat scrim, no blur ─────────────────────────── */
    .overlay{
      position:fixed;inset:0;background:rgba(0,0,0,0.6);
      display:flex;align-items:flex-end;justify-content:center;z-index:200;
    }
    [data-theme="light"] .overlay{background:rgba(0,0,0,0.3);}
    @keyframes sheet-up{from{transform:translateY(100%);}to{transform:translateY(0);}}
    .sheet{
      width:100%;max-width:520px;
      background:var(--bg);
      border-radius:20px 20px 0 0;
      border-top:1px solid var(--line2);
      padding:8px 18px 32px;
      max-height:92vh;overflow-y:auto;
      animation:sheet-up 0.3s ease;
    }
    .sheet-handle{width:36px;height:4px;background:var(--line2);border-radius:99px;margin:8px auto 18px;}
    .sheet-t{font-family:'Anton',sans-serif;font-size:24px;letter-spacing:-0.01em;text-transform:uppercase;margin-bottom:4px;}

    /* ─── ANIMATION UTIL ──────────────────────────────────────────────────── */
    @keyframes fade-up{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
    .au{animation:fade-up 0.3s ease both;}
    .au1{animation:fade-up 0.3s 0.04s ease both;}
    .au2{animation:fade-up 0.3s 0.08s ease both;}
    .au3{animation:fade-up 0.3s 0.12s ease both;}
    .au4{animation:fade-up 0.3s 0.16s ease both;}

    /* ─── USER SWITCHER ───────────────────────────────────────────────────── */
    .switcher{
      display:flex;align-items:center;gap:8px;
      padding:5px 12px 5px 5px;
      background:var(--bg1);border:1px solid var(--line);border-radius:99px;
      cursor:pointer;-webkit-tap-highlight-color:transparent;
    }
    .switcher-name{font-size:12px;font-weight:600;color:var(--text);}
    .sw-menu{
      position:absolute;top:calc(100% + 8px);right:0;z-index:60;
      background:var(--bg1);border:1px solid var(--line2);border-radius:12px;
      padding:6px;min-width:200px;
      box-shadow:0 8px 24px rgba(0,0,0,0.3);
    }
    [data-theme="light"] .sw-menu{box-shadow:0 8px 24px rgba(0,0,0,0.08);}
    .sw-row{
      display:flex;align-items:center;gap:10px;padding:8px 10px;
      border-radius:8px;cursor:pointer;transition:background 0.1s;
    }
    .sw-row:hover{background:var(--bg2);}
    .sw-row.on{background:var(--yes-d);}

    /* Theme toggle */
    .theme-toggle{
      width:34px;height:34px;border-radius:50%;
      background:var(--bg1);border:1px solid var(--line);
      cursor:pointer;color:var(--text);font-size:14px;
      display:flex;align-items:center;justify-content:center;
      -webkit-tap-highlight-color:transparent;
    }

    /* Apple Wallet pass — kept dark, this is the brand */
    .pass{
      width:100%;max-width:340px;border-radius:18px;
      background:#0A0A0A;overflow:hidden;
      border:1px solid #262626;
      font-family:'Geist',sans-serif;margin:0 auto;
    }
    .pass-strip{height:4px;background:linear-gradient(90deg,#A3E635 0%,#A3E635 50%,#EF4444 50%,#EF4444 100%);}
    .pass-head{padding:18px 22px 14px;display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid #262626;}
    .pass-logo{font-family:'Anton',sans-serif;font-size:18px;letter-spacing:-0.01em;color:#FAFAFA;text-transform:uppercase;}
    .pass-body{padding:18px 22px 8px;}
    .pass-l{font-size:9px;color:#737373;letter-spacing:0.12em;text-transform:uppercase;font-family:'Geist Mono',monospace;margin-bottom:4px;}
    .pass-v{font-size:15px;color:#FAFAFA;font-weight:600;}
    .pass-q{font-family:'Bricolage Grotesque',sans-serif;font-size:20px;line-height:1.15;letter-spacing:-0.025em;color:#FAFAFA;font-weight:700;margin-bottom:18px;}
    .pass-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
    .pass-qr{margin:14px 22px 18px;background:#141414;border-radius:12px;padding:16px;display:flex;flex-direction:column;align-items:center;gap:10px;border:1px solid #262626;}
    .pass-qr img{width:140px;height:140px;border-radius:8px;}
    .pass-scan{font-size:9px;color:#737373;letter-spacing:0.1em;text-transform:uppercase;font-family:'Geist Mono',monospace;text-align:center;}
    .atw{display:inline-flex;align-items:center;gap:10px;background:#000;color:#fff;border:none;border-radius:10px;padding:12px 22px;font-family:-apple-system,'SF Pro Display',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:transform 0.12s;}
    .atw:active{transform:scale(0.96);}

    /* tabs */
    .tabs{
      display:flex;gap:2px;padding:3px;
      background:var(--bg2);border:1px solid var(--line);
      border-radius:10px;margin-bottom:18px;
    }
    .tab{
      flex:1;padding:9px 4px;border:none;border-radius:7px;cursor:pointer;
      font-family:'Geist',sans-serif;font-size:12px;font-weight:600;
      background:transparent;color:var(--sub);transition:all 0.12s;
      text-transform:capitalize;-webkit-tap-highlight-color:transparent;
    }
    .tab.on{background:var(--bg);color:var(--text);}
    [data-theme="light"] .tab.on{background:var(--bg1);box-shadow:0 1px 2px rgba(0,0,0,0.06);}
    .tab-ct{margin-left:4px;opacity:0.5;font-size:10px;font-family:'Geist Mono',monospace;}

    /* room invite code */
    .invite{
      background:var(--bg1);border:1px dashed var(--gold);
      border-radius:12px;padding:14px 16px;
      display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;
    }
    .invite-l{font-size:9px;color:var(--gold);font-family:'Geist Mono',monospace;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:4px;}
    .invite-c{font-family:'Anton',sans-serif;font-size:24px;color:var(--gold);letter-spacing:0.08em;line-height:1;}

    @keyframes nfc-ring{0%{transform:scale(1);opacity:0.5;}100%{transform:scale(1.5);opacity:0;}}
    .nfc-ring{position:absolute;border-radius:50%;border:1.5px solid var(--gold);animation:nfc-ring 2s ease-out infinite;}

    /* Wallet hero — flat */
    .wallet-hero{
      background:var(--bg1);border:1px solid var(--line);
      border-radius:16px;padding:24px;
    }
    .wallet-num{
      font-family:'Anton',sans-serif;font-size:56px;line-height:0.9;
      letter-spacing:-0.025em;color:var(--text);
    }
    .wallet-cur{font-family:'Geist Mono',monospace;font-size:12px;color:var(--sub);margin-top:6px;letter-spacing:0.04em;}

    /* nav icons */
    .ico{stroke:currentColor;stroke-width:1.6;fill:none;stroke-linecap:round;stroke-linejoin:round;color:inherit;}

    /* ─── CONFIDENCE SLIDER ───────────────────────────────────────────────── */
    .slider-row{position:relative;padding:8px 0;}
    .slider{
      -webkit-appearance:none;appearance:none;
      width:100%;height:6px;border-radius:99px;outline:none;
      background:linear-gradient(90deg, var(--no) 0%, var(--gold) 50%, var(--yes) 100%);
      cursor:grab;padding:0;border:none;
    }
    .slider:active{cursor:grabbing;}
    .slider::-webkit-slider-thumb{
      -webkit-appearance:none;appearance:none;
      width:24px;height:24px;border-radius:50%;
      background:var(--text);cursor:grab;border:3px solid var(--bg);
      box-shadow:0 0 0 1px var(--text);
      transition:transform 0.12s;
    }
    .slider::-webkit-slider-thumb:active{transform:scale(1.15);}
    .slider::-moz-range-thumb{
      width:24px;height:24px;border-radius:50%;background:var(--text);
      cursor:grab;border:3px solid var(--bg);
    }
    .slider-labels{
      display:flex;justify-content:space-between;
      font-family:'Geist Mono',monospace;font-size:10px;color:var(--sub);
      letter-spacing:0.04em;text-transform:uppercase;margin-top:10px;
    }
    .slider-labels span:first-child{color:var(--no);}
    .slider-labels span:last-child{color:var(--yes);}

    .conf-display{display:flex;align-items:baseline;justify-content:center;gap:6px;margin-bottom:10px;}
    .conf-num{font-family:'Anton',sans-serif;font-size:56px;line-height:0.9;letter-spacing:-0.025em;transition:color 0.2s;}
    .conf-pct{font-family:'Geist Mono',monospace;font-size:16px;font-weight:600;color:var(--sub);}
    .conf-word{text-align:center;font-family:'Bricolage Grotesque',sans-serif;font-size:14px;font-weight:600;color:var(--sub);margin-bottom:18px;letter-spacing:-0.01em;}

    /* Outcome preview */
    .outcome-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;}
    .outcome-card{
      background:var(--bg1);border:1px solid var(--line);
      border-radius:12px;padding:14px;
    }
    .outcome-card.win{border-color:var(--yes-g);}
    .outcome-card.lose{border-color:var(--no-d);}
    .outcome-label{font-family:'Geist Mono',monospace;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px;}
    .outcome-card.win .outcome-label{color:var(--yes);}
    .outcome-card.lose .outcome-label{color:var(--no);}
    .outcome-amount{font-family:'Anton',sans-serif;font-size:28px;line-height:1;letter-spacing:-0.02em;}
    .outcome-card.win .outcome-amount{color:var(--yes);}
    .outcome-card.lose .outcome-amount{color:var(--no);}
    .outcome-sub{font-family:'Geist Mono',monospace;font-size:10px;color:var(--sub);margin-top:6px;letter-spacing:0.04em;}

    /* Wager chips */
    .chip-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;}
    .chip{
      padding:8px 14px;border-radius:8px;cursor:pointer;
      background:var(--bg1);border:1px solid var(--line);
      color:var(--body);font-family:'Geist Mono',monospace;font-size:13px;font-weight:600;
      transition:all 0.12s;-webkit-tap-highlight-color:transparent;
    }
    .chip:hover{border-color:var(--line2);}
    .chip.on{background:var(--text);color:var(--bg);border-color:var(--text);}
    [data-theme="light"] .chip.on{background:var(--text);color:var(--bg1);}

    /* Deposit method cards */
    .pay-grid{display:flex;flex-direction:column;gap:8px;margin-bottom:14px;}
    .pay-card{
      display:flex;align-items:center;gap:12px;
      background:var(--bg1);border:1px solid var(--line);
      border-radius:12px;padding:14px 16px;cursor:pointer;
      transition:border-color 0.12s;text-align:left;
      font-family:'Geist',sans-serif;
      -webkit-tap-highlight-color:transparent;
    }
    .pay-card:hover{border-color:var(--line2);}
    .pay-card.on{border-color:var(--yes);background:var(--yes-d);}
    .pay-icon{
      width:40px;height:40px;border-radius:10px;flex-shrink:0;
      display:flex;align-items:center;justify-content:center;
      font-family:'Anton',sans-serif;font-size:14px;letter-spacing:-0.02em;
    }
    .pay-info{flex:1;min-width:0;}
    .pay-name{font-size:13px;font-weight:600;color:var(--text);}
    .pay-desc{font-size:10px;color:var(--sub);font-family:'Geist Mono',monospace;margin-top:2px;letter-spacing:0.02em;}
    .pay-fee{font-size:10px;color:var(--gold);font-family:'Geist Mono',monospace;font-weight:600;}
    .pay-check{width:20px;height:20px;border-radius:50%;border:1.5px solid var(--line2);flex-shrink:0;display:flex;align-items:center;justify-content:center;}
    .pay-card.on .pay-check{background:var(--yes);border-color:var(--yes);color:var(--ink);}
    .pay-card.on .pay-check::after{content:'✓';font-size:12px;font-weight:700;}

    /* Section divider */
    .div-label{
      display:flex;align-items:center;gap:10px;margin:18px 0 10px;
      font-family:'Geist Mono',monospace;font-size:10px;letter-spacing:0.1em;
      text-transform:uppercase;color:var(--sub);
    }
    .div-label::before, .div-label::after{
      content:'';flex:1;height:1px;background:var(--line);
    }

    /* ─── ACCOUNT PAGE ────────────────────────────────────────────────────── */
    .account-card{
      background:var(--bg1);border:1px solid var(--line);
      border-radius:16px;padding:20px;margin-bottom:14px;
    }
    .account-row{
      display:flex;align-items:center;justify-content:space-between;
      padding:14px 0;border-top:1px solid var(--line);
    }
    .account-row:first-child{border-top:none;padding-top:0;}
    .account-row-l{font-size:13px;color:var(--text);font-weight:500;}
    .account-row-s{font-size:11px;color:var(--sub);margin-top:2px;}
    .account-list{
      background:var(--bg1);border:1px solid var(--line);
      border-radius:12px;margin-bottom:14px;
      overflow:hidden;
    }
    .account-item{
      display:flex;align-items:center;gap:12px;padding:12px 14px;
      border-top:1px solid var(--line);
    }
    .account-item:first-child{border-top:none;}
    .danger-zone{
      background:var(--bg1);border:1px solid var(--no-d);
      border-radius:12px;padding:16px;margin-top:14px;
    }
  `}</style>
);

/* ─── CONSTANTS / HELPERS ────────────────────────────────────────────────── */
const SPORTS = ["Any","NFL","NBA","UFC","MLB","NHL","Soccer","Pop Culture","Work","Custom"];
const BASE_URL = typeof window !== "undefined" ? window.location.origin : "https://rival.app";

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
const genCode = () => { const c="ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; return Array.from({length:8},()=>c[Math.floor(Math.random()*c.length)]).join(""); };
const fmtUSD = n => {
  const num = typeof n === "number" ? n : parseFloat(n);
  if (!isFinite(num)) return "0.00";
  return num.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
};
const fmtOdds = n => n > 0 ? `+${n}` : `${n}`;
const toWin = (w,o) => { const ww=parseFloat(w),oo=parseFloat(o); if(isNaN(ww)||isNaN(oo)||ww<=0) return 0; return oo>0 ? ww*oo/100 : ww*100/Math.abs(oo); };
const impliedYes = o => { const oo=parseInt(o); if(isNaN(oo)) return 50; return oo>0 ? (100/(oo+100)*100) : (Math.abs(oo)/(Math.abs(oo)+100)*100); };
const fmtTime = s => { if(s<=0) return "Expired"; const h=Math.floor(s/3600), m=Math.floor((s%3600)/60); if(h>0) return `${h}h ${m}m`; return m>0?`${m}m`:`${s}s`; };
const initials = name => (name||"?").split(" ").map(p=>p[0]||"").join("").slice(0,2).toUpperCase() || "?";
const avColor = name => { const pal=["#C5FF3D","#FF3D7F","#FFB800","#5EE3FF","#B27DFF","#FF8A3D","#3DFFCD","#FFEB3D"]; const safe=name||"?"; let h=0; for(const c of safe) h=(h*31+c.charCodeAt(0))&0xffffffff; return pal[Math.abs(h)%pal.length]; };

/* Safe user lookup — if a user ID resolves to nothing (deleted account),
   returns a placeholder so .name and .balance never crash. */
const DELETED_USER = {id:"_deleted_",name:"(deleted)",balance:0,isYou:false,maxWager:null,_deleted:true};
const safeUser = (users,id) => (id && users[id]) ? users[id] : DELETED_USER;

/* ─── SETTLEMENT RESOLVER ──────────────────────────────────────────────────
   Pure function. Takes the current state, a bet, a decision, votes, and a
   resolution type. Returns the new state with payouts/refunds applied and
   notifications fanned out. No house fees — keeps Rival legal in 50 states. */
function resolveSettlement(s, b, decision, votes, resolutionType){
  const participants=[b.createdBy,b.acceptedBy].filter(Boolean);
  const wagerEach=b.wager; // Each participant staked this amount
  const newUsers={...s.users};
  let outcomeText="";
  let outcomeUserId=null; // For UI: who "won" if anyone

  if(decision==="forfeit"){
    // Mutual forfeit: both stakes returned, no winner, no fee
    participants.forEach(uid=>{
      if(newUsers[uid]) newUsers[uid]={...newUsers[uid],balance:newUsers[uid].balance+wagerEach};
    });
    outcomeText="Bet forfeited · stakes returned to all participants";
  } else if(decision==="split"){
    // Mutual split: each gets their stake back (equivalent to forfeit at 1:1 odds,
    // but semantically different — "we agree it was a tie"). No fee.
    participants.forEach(uid=>{
      if(newUsers[uid]) newUsers[uid]={...newUsers[uid],balance:newUsers[uid].balance+wagerEach};
    });
    outcomeText="Bet split · everyone got their stake back";
  } else {
    // Winner-takes-all: decision is a userId
    const winner=newUsers[decision];
    if(!winner) return s; // Winner deleted — shouldn't happen but safe
    // Pot = everyone's wager. Winner gets the total pot.
    const totalPot=wagerEach*participants.length;
    newUsers[decision]={...winner,balance:winner.balance+totalPot};
    outcomeUserId=decision;
    outcomeText=`${winner.name} won $${totalPot.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
  }

  // Fan out notifications
  const newNotifs=participants.map(uid=>{
    const isWinner=uid===outcomeUserId;
    return {
      id:genId(),uid,type:"bet_settled",betId:b.id,
      title:decision==="forfeit"?"Bet forfeited":decision==="split"?"Bet split":isWinner?"You won!":"Bet settled",
      body:outcomeText,
      createdAt:Date.now(),read:false
    };
  });

  return {
    ...s,
    users:newUsers,
    bets:{...s.bets,[b.id]:{
      ...b,
      status:"settled",
      winner:outcomeUserId,
      decision,
      resolutionType,
      votes,
      settledAt:Date.now()
    }},
    notifications:[...(s.notifications||[]),...newNotifs]
  };
}

const validateOdds = v => { const n=parseInt(v); if(isNaN(n)) return "Enter a number (e.g. -110 or +175)"; if(n===0) return "Odds can't be zero"; if(n>0&&n<100) return "Positive odds must be ≥ +100"; if(n<0&&n>-100) return "Negative odds must be ≤ -100"; if(Math.abs(n)>9999) return "Max ±9999"; return null; };
const validateWager = (v,bal) => { const n=parseFloat(v); if(isNaN(n)||n<=0) return "Enter a valid amount"; if(n<0.01) return "Minimum $0.01"; if(n>bal) return `Not enough (have $${fmtUSD(bal)})`; if(n>50000) return "Maximum $50,000"; return null; };

/* Convert confidence % (1–99) to American odds.
   At 50% → +100/-100 (even money).
   Below 50% → positive odds (underdog, bigger payout).
   Above 50% → negative odds (favorite, smaller payout).
   We clamp to ±10000 to keep payouts sane at the extremes. */
const confidenceToOdds = pct => {
  const p = Math.max(1, Math.min(99, pct)) / 100;
  if (p === 0.5) return 100;
  const o = p > 0.5 ? -Math.round((p / (1 - p)) * 100) : Math.round(((1 - p) / p) * 100);
  return Math.max(-10000, Math.min(10000, o));
};
const oddsToConfidence = o => Math.round(impliedYes(o));

/* ─── TEST USERS ─────────────────────────────────────────────────────────── */
const TEST_USERS = [
  {id:"u1",name:"You",balance:1000,isYou:true,maxWager:null},
  {id:"u2",name:"Alex",balance:800,isYou:false,maxWager:null},
  {id:"u3",name:"Jordan",balance:500,isYou:false,maxWager:null},
  {id:"u4",name:"Sam",balance:1200,isYou:false,maxWager:null},
];

/* ─── INITIAL STATE ──────────────────────────────────────────────────────── */
const INIT = {
  uid:"u1",
  users:TEST_USERS.reduce((a,u)=>({...a,[u.id]:{...u}}),{}),
  rooms:{
    "DEMOROOM":{id:"DEMOROOM",code:"DEMOROOM",name:"Demo Room",sport:"Any",createdBy:"u1",members:["u1","u2","u3"],maxMembers:10,createdAt:Date.now()-3600000}
  },
  bets:{
    "demo-1":{id:"demo-1",roomId:"DEMOROOM",createdBy:"u2",title:"He orders pizza for lunch",category:"Work",side:"Will order pizza",odds:150,wager:20,status:"open",acceptedBy:null,winner:null,lockedOdds:null,createdAt:Date.now()-1800000,expiresAt:Date.now()+7200000},
    "demo-2":{id:"demo-2",roomId:"DEMOROOM",createdBy:"u3",title:"Meeting gets cancelled today",category:"Work",side:"Gets cancelled",odds:-130,wager:50,status:"open",acceptedBy:null,winner:null,lockedOdds:null,createdAt:Date.now()-900000,expiresAt:Date.now()+3600000},
    "demo-3":{id:"demo-3",roomId:"DEMOROOM",createdBy:"u4",title:"She texts back in 30 min",category:"Pop Culture",side:"Yes, under 30",odds:200,wager:75,status:"matched",acceptedBy:"u1",lockedOdds:200,winner:null,votes:{},createdAt:Date.now()-600000,expiresAt:Date.now()+5400000},
    "demo-4":{id:"demo-4",roomId:"DEMOROOM",createdBy:"u2",title:"Lakers cover the spread tonight",category:"NBA",side:"Yes, Lakers cover",odds:-110,wager:30,status:"pending_settlement",acceptedBy:"u1",lockedOdds:-110,winner:null,votes:{},autoProposal:null,settlementStartedAt:Date.now()-300000,createdAt:Date.now()-7200000,expiresAt:Date.now()-300000},
  },
  toasts:[],
  notifications:[
    {id:"notif-seed-1",uid:"u1",type:"settlement_pending",betId:"demo-4",title:"Time to settle",body:"The Lakers/spread bet expired — vote on who won.",createdAt:Date.now()-300000,read:false},
  ],
  shareBetId:null,
  settleBetId:null,
  incomingBetId:null,
  profileOpen:false,
  page:"home",
  roomId:null,
};

/* ─── REDUCER ────────────────────────────────────────────────────────────── */
function reducer(s,a){
  switch(a.type){
    case "SET_UID": return {...s,uid:a.uid};
    case "NAV": return {...s,page:a.page,roomId:a.roomId||null};
    case "CREATE_ROOM": return {...s,rooms:{...s.rooms,[a.room.id]:a.room}};
    case "JOIN_ROOM":{
      const r=s.rooms[a.roomId];
      if(!r||r.members.includes(a.uid)||r.members.length>=r.maxMembers) return s;
      return {...s,rooms:{...s.rooms,[a.roomId]:{...r,members:[...r.members,a.uid]}}};
    }
    case "CREATE_BET":{
      const u=s.users[a.bet.createdBy];
      if(u.balance<a.bet.wager) return s;
      return {...s,bets:{...s.bets,[a.bet.id]:a.bet},users:{...s.users,[a.bet.createdBy]:{...u,balance:u.balance-a.bet.wager}}};
    }
    case "ACCEPT_BET":{
      const b=s.bets[a.betId], u=s.users[a.uid];
      if(!b||b.status!=="open"||b.createdBy===a.uid||u.balance<b.wager||Date.now()>b.expiresAt) return s;
      return {...s,bets:{...s.bets,[a.betId]:{...b,status:"matched",acceptedBy:a.uid,lockedOdds:b.odds,lockedAt:Date.now()}},users:{...s.users,[a.uid]:{...u,balance:u.balance-b.wager}},incomingBetId:null};
    }
    case "SETTLE_BET":{
      // LEGACY — kept for backward compat. New flow uses VOTE_SETTLEMENT.
      const b=s.bets[a.betId];
      if(!b||b.status!=="matched") return s;
      const winner=s.users[a.winnerId];
      if(!winner) return s;
      const payout=b.wager+toWin(b.wager,b.lockedOdds||b.odds);
      return {...s,bets:{...s.bets,[a.betId]:{...b,status:"settled",winner:a.winnerId}},users:{...s.users,[a.winnerId]:{...winner,balance:winner.balance+payout}}};
    }
    case "ENTER_SETTLEMENT":{
      // Move a matched bet into pending_settlement state, clear any prior votes
      const b=s.bets[a.betId];
      if(!b||b.status!=="matched") return s;
      const participants=[b.createdBy,b.acceptedBy].filter(Boolean);
      // Auto-propose from sports API result, if provided
      const autoPropose=a.autoWinnerId && participants.includes(a.autoWinnerId) ? a.autoWinnerId : null;
      const newNotifs=participants.map(uid=>({
        id:genId(),uid,type:"settlement_pending",betId:a.betId,
        title:autoPropose?"Time to confirm the result":"Time to settle",
        body:autoPropose
          ? `Live result says ${s.users[autoPropose]?.name||"someone"} won. Confirm to settle.`
          : `Bet expired — vote on who won.`,
        createdAt:Date.now(),read:false
      }));
      return {
        ...s,
        bets:{...s.bets,[a.betId]:{
          ...b,
          status:"pending_settlement",
          votes:{},
          autoProposal:autoPropose,
          settlementStartedAt:Date.now()
        }},
        notifications:[...(s.notifications||[]),...newNotifs]
      };
    }
    case "VOTE_SETTLEMENT":{
      // User casts their vote. Choices: a userId (winner), "forfeit", "split"
      const b=s.bets[a.betId];
      if(!b||b.status!=="pending_settlement"&&b.status!=="disputed") return s;
      const participants=[b.createdBy,b.acceptedBy].filter(Boolean);
      if(!participants.includes(a.uid)) return s; // Only participants can vote
      // Validate vote value
      if(a.vote!=="forfeit"&&a.vote!=="split"&&!participants.includes(a.vote)) return s;

      const newVotes={...(b.votes||{}),[a.uid]:a.vote};
      const allVoted=participants.every(p=>newVotes[p]!==undefined);

      // If not everyone voted yet, just record and notify others
      if(!allVoted){
        const otherParticipants=participants.filter(p=>p!==a.uid);
        const voterName=s.users[a.uid]?.name||"Someone";
        const notifs=otherParticipants.map(uid=>({
          id:genId(),uid,type:"vote_cast",betId:a.betId,
          title:`${voterName} voted`,
          body:`Waiting for your vote to settle the bet.`,
          createdAt:Date.now(),read:false
        }));
        return {
          ...s,
          bets:{...s.bets,[a.betId]:{...b,votes:newVotes}},
          notifications:[...(s.notifications||[]),...notifs]
        };
      }

      // Everyone voted — determine outcome
      const voteValues=participants.map(p=>newVotes[p]);
      const allSame=voteValues.every(v=>v===voteValues[0]);

      if(allSame){
        const decision=voteValues[0];
        return resolveSettlement(s,b,decision,newVotes,"unanimous");
      }

      // Disagreement: 3+ person bet → check for strict majority on a single winner
      if(participants.length>=3){
        const tally={};
        voteValues.forEach(v=>{tally[v]=(tally[v]||0)+1;});
        const sorted=Object.entries(tally).sort((a,b)=>b[1]-a[1]);
        const [topChoice,topCount]=sorted[0];
        const secondCount=sorted[1]?.[1]||0;
        if(topCount>participants.length/2 && topCount>secondCount){
          return resolveSettlement(s,b,topChoice,newVotes,"majority");
        }
      }

      // No resolution → disputed
      const disputeNotifs=participants.map(uid=>({
        id:genId(),uid,type:"bet_disputed",betId:a.betId,
        title:"Bet is disputed",
        body:participants.length===2
          ? "You disagreed. Revote, agree to split or forfeit, or escalate."
          : "No clear majority. Revote or escalate.",
        createdAt:Date.now(),read:false
      }));
      return {
        ...s,
        bets:{...s.bets,[a.betId]:{...b,votes:newVotes,status:"disputed"}},
        notifications:[...(s.notifications||[]),...disputeNotifs]
      };
    }
    case "RESET_VOTES":{
      // For disputed bets — clear votes and re-enter pending_settlement so they can try again
      const b=s.bets[a.betId];
      if(!b||b.status!=="disputed") return s;
      const participants=[b.createdBy,b.acceptedBy].filter(Boolean);
      if(!participants.includes(a.uid)) return s;
      const notifs=participants.map(uid=>({
        id:genId(),uid,type:"votes_reset",betId:a.betId,
        title:"Votes reset",
        body:`${s.users[a.uid]?.name||"Someone"} reset the votes. Try again.`,
        createdAt:Date.now(),read:false
      }));
      return {
        ...s,
        bets:{...s.bets,[a.betId]:{...b,votes:{},status:"pending_settlement"}},
        notifications:[...(s.notifications||[]),...notifs]
      };
    }
    case "MARK_NOTIFICATION_READ":{
      return {
        ...s,
        notifications:(s.notifications||[]).map(n=>n.id===a.id?{...n,read:true}:n)
      };
    }
    case "MARK_ALL_NOTIFICATIONS_READ":{
      return {
        ...s,
        notifications:(s.notifications||[]).map(n=>n.uid===a.uid?{...n,read:true}:n)
      };
    }
    case "CLEAR_NOTIFICATIONS":{
      return {
        ...s,
        notifications:(s.notifications||[]).filter(n=>n.uid!==a.uid)
      };
    }
    case "CANCEL_BET":{
      const b=s.bets[a.betId];
      if(!b||b.status!=="open"||b.createdBy!==a.uid) return s;
      return {...s,bets:{...s.bets,[a.betId]:{...b,status:"cancelled"}},users:{...s.users,[a.uid]:{...s.users[a.uid],balance:s.users[a.uid].balance+b.wager}}};
    }
    case "DEPOSIT":{
      if(a.amount<=0||a.amount>10000) return s;
      return {...s,users:{...s.users,[a.uid]:{...s.users[a.uid],balance:s.users[a.uid].balance+a.amount}}};
    }
    case "SET_SHARE": return {...s,shareBetId:a.betId};
    case "SET_SETTLE": return {...s,settleBetId:a.betId};
    case "SET_INCOMING": return {...s,incomingBetId:a.betId};
    case "TOAST_ADD": return {...s,toasts:[...s.toasts.slice(-3),a.t]};
    case "TOAST_DEL": return {...s,toasts:s.toasts.filter(t=>t.id!==a.id)};
    case "SET_PROFILE_OPEN": return {...s,profileOpen:a.open};
    case "CREATE_USER":{
      const name=(a.name||"").trim();
      if(!name||name.length>20) return s;
      // No duplicate names (case-insensitive)
      if(Object.values(s.users).some(u=>u.name.toLowerCase()===name.toLowerCase())) return s;
      const newId=`u${Date.now().toString(36)}${Math.random().toString(36).slice(2,5)}`;
      const balance=Math.max(0,Math.min(10000,a.balance ?? 1000));
      return {...s,users:{...s.users,[newId]:{id:newId,name,balance,isYou:false,maxWager:null}}};
    }
    case "UPDATE_USER_NAME":{
      const u=s.users[a.uid];
      const name=(a.name||"").trim();
      if(!u||!name||name.length>20) return s;
      // No duplicate names (excluding the user being renamed)
      if(Object.values(s.users).some(usr=>usr.id!==a.uid&&usr.name.toLowerCase()===name.toLowerCase())) return s;
      return {...s,users:{...s.users,[a.uid]:{...u,name}}};
    }
    case "DELETE_USER":{
      // Can't delete the last account
      if(Object.keys(s.users).length<=1) return s;
      const target=s.users[a.uid];
      if(!target) return s;

      // Cancel and refund any OPEN bets the user created
      // (Open = no opponent yet, safe to refund the creator's stake)
      // Matched bets stay matched — the opponent has funds locked too,
      // so we leave them for settlement. The opponent will see "(deleted)" as creator.
      const updatedBets={};
      let refund=0;
      for(const [bid,b] of Object.entries(s.bets)){
        if(b.createdBy===a.uid && b.status==="open"){
          updatedBets[bid]={...b,status:"cancelled"};
          refund+=b.wager;
        }else{
          updatedBets[bid]=b;
        }
      }

      // Remove user from all room memberships (rooms persist)
      const updatedRooms={};
      for(const [rid,r] of Object.entries(s.rooms)){
        if(r.members.includes(a.uid)){
          updatedRooms[rid]={...r,members:r.members.filter(m=>m!==a.uid)};
        }else{
          updatedRooms[rid]=r;
        }
      }

      // If deleting current user, switch to another first
      let newUid=s.uid;
      if(a.uid===s.uid){
        newUid=Object.keys(s.users).find(id=>id!==a.uid);
      }
      const newUsers={...s.users};
      delete newUsers[a.uid];

      return {
        ...s,
        users:newUsers,
        bets:updatedBets,
        rooms:updatedRooms,
        uid:newUid,
      };
    }
    case "SET_MAX_WAGER":{
      const u=s.users[a.uid];
      if(!u) return s;
      // null = no limit; otherwise must be a positive number ≤ 50000
      const max=a.max===null?null:Math.max(1,Math.min(50000,parseFloat(a.max)||1));
      return {...s,users:{...s.users,[a.uid]:{...u,maxWager:max}}};
    }
    default: return s;
  }
}

const addToast=(d,msg,type="info",sub)=>d({type:"TOAST_ADD",t:{id:genId(),msg,type,sub}});

/* ─── HOOKS ──────────────────────────────────────────────────────────────── */
function useCountdown(expiresAt){
  const [t,setT]=useState(()=>Math.max(0,Math.floor((expiresAt-Date.now())/1000)));
  useEffect(()=>{
    const id=setInterval(()=>setT(Math.max(0,Math.floor((expiresAt-Date.now())/1000))),1000);
    return ()=>clearInterval(id);
  },[expiresAt]);
  return t;
}

// Scroll-driven shrink for the tab bar (iOS 26 signature behavior)
function useScrollShrink(ref){
  const [shrunk,setShrunk]=useState(false);
  useEffect(()=>{
    if(!ref.current) return;
    const el=ref.current;
    let lastY=0;
    const onScroll=()=>{
      const y=el.scrollTop;
      // Shrink when scrolling down past 50px; expand when at top or scrolling up significantly
      if(y>50 && y>lastY+4) setShrunk(true);
      else if(y<30 || y<lastY-8) setShrunk(false);
      lastY=y;
    };
    el.addEventListener("scroll",onScroll,{passive:true});
    return()=>el.removeEventListener("scroll",onScroll);
  },[ref]);
  return shrunk;
}

/* ─── SETTLEMENT EXPIRY CHECKER ─────────────────────────────────────────────
   Polls every 30s for matched bets whose expiresAt has passed and moves them
   to pending_settlement. In production, replace polling with a server cron
   job + WebSocket push so it works even when no clients are connected. */
function useSettlementChecker(state, dispatch){
  useEffect(()=>{
    const check=()=>{
      const now=Date.now();
      Object.values(state.bets).forEach(b=>{
        if(b.status==="matched" && b.expiresAt < now){
          dispatch({type:"ENTER_SETTLEMENT",betId:b.id});
        }
      });
    };
    check();
    const id=setInterval(check,30000);
    return()=>clearInterval(id);
  },[state.bets,dispatch]);
}

/* ─── BROWSER PUSH NOTIFICATION ─────────────────────────────────────────────
   Fires a system notification when a new notification arrives AND the app is
   in the background. Falls back gracefully if Notification API unavailable or
   permission not granted. On iOS, requires PWA install + iOS 16.4+. */
function useBrowserNotifications(state, uid){
  const lastSeenRef=useRef(new Set());
  useEffect(()=>{
    if(typeof window==="undefined"||!("Notification" in window)) return;
    const myNotifs=(state.notifications||[]).filter(n=>n.uid===uid);
    myNotifs.forEach(n=>{
      if(lastSeenRef.current.has(n.id)) return;
      lastSeenRef.current.add(n.id);
      // Only fire system notification if document is hidden
      if(document.visibilityState==="hidden" && Notification.permission==="granted"){
        try{
          new Notification(n.title,{
            body:n.body,
            tag:`rival-${n.betId||n.id}`,
          });
        }catch(e){/* iOS Safari can throw */}
      }
    });
  },[state.notifications,uid]);
}

/* ─── AVATAR ─────────────────────────────────────────────────────────────── */
function Avatar({name,size="md"}){
  const c=avColor(name);
  return (
    <div className={`av av-${size}`} style={{background:c+"22",color:c,boxShadow:`0 0 0 1.5px ${c}44, 0 0 12px ${c}33`}}>
      {initials(name)}
    </div>
  );
}

/* ─── NAV ICONS ──────────────────────────────────────────────────────────── */
const Icons = {
  home:    <svg className="ico nav-svg" viewBox="0 0 24 24"><path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2v-9z"/></svg>,
  rooms:   <svg className="ico nav-svg" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M14 14c1.2-.5 2.4-.5 3.5 0 1.5.7 2.5 2.1 2.5 4"/></svg>,
  markets: <svg className="ico nav-svg" viewBox="0 0 24 24"><path d="M3 17l5-5 4 4 8-9"/><path d="M14 7h6v6"/></svg>,
  wallet:  <svg className="ico nav-svg" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18"/><circle cx="17" cy="15" r="1.2" fill="currentColor"/></svg>,
  account: <svg className="ico nav-svg" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>,
};

/* ─── TOP BAR (Liquid Glass capsule) ──────────────────────────────────────── */
function TopBar({state,dispatch,theme,setTheme}){
  return (
    <div className="topbar">
      <div className="logo">
        <span className="logo-dot"/>
        <span className="logo-wd">Rival</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,position:"relative",zIndex:2}}>
        <NotificationBell state={state} dispatch={dispatch}/>
        <button className="theme-toggle" onClick={()=>setTheme(t=>t==="dark"?"light":"dark")}>
          {theme==="dark"?"☀":"☾"}
        </button>
        <UserSwitcher state={state} dispatch={dispatch}/>
      </div>
    </div>
  );
}

/* ─── NOTIFICATION BELL ──────────────────────────────────────────────────── */
function NotificationBell({state,dispatch}){
  const [open,setOpen]=useState(false);
  const [permState,setPermState]=useState(()=>{
    if(typeof window==="undefined"||!("Notification" in window)) return "unsupported";
    return Notification.permission;
  });
  const ref=useRef(null);
  const {uid,notifications=[],bets}=state;

  const myNotifs=notifications.filter(n=>n.uid===uid).sort((a,b)=>b.createdAt-a.createdAt);
  const unreadCount=myNotifs.filter(n=>!n.read).length;

  useEffect(()=>{
    const fn=e=>{if(ref.current&&!ref.current.contains(e.target)) setOpen(false);};
    document.addEventListener("mousedown",fn);
    return()=>document.removeEventListener("mousedown",fn);
  },[]);

  const requestPerm=async()=>{
    if(typeof window==="undefined"||!("Notification" in window)) return;
    try{
      const result=await Notification.requestPermission();
      setPermState(result);
      if(result==="granted"){
        addToast(dispatch,"Notifications enabled","success","You'll be alerted when bets need attention");
      }
    }catch(e){/* iOS Safari throws sometimes */}
  };

  const handleNotifClick=n=>{
    dispatch({type:"MARK_NOTIFICATION_READ",id:n.id});
    if(n.betId && bets[n.betId]){
      // Jump to the relevant bet
      if(n.type==="settlement_pending"||n.type==="bet_disputed"||n.type==="vote_cast"||n.type==="votes_reset"){
        dispatch({type:"SET_SETTLE",betId:n.betId});
      }
    }
    setOpen(false);
  };

  const timeAgo=ts=>{
    const m=Math.floor((Date.now()-ts)/60000);
    if(m<1) return "now";
    if(m<60) return `${m}m`;
    const h=Math.floor(m/60);
    if(h<24) return `${h}h`;
    return `${Math.floor(h/24)}d`;
  };

  return (
    <div ref={ref} style={{position:"relative"}}>
      <button onClick={()=>setOpen(!open)} className="theme-toggle" title="Notifications" style={{position:"relative"}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.7 21a2 2 0 0 1-3.4 0"/>
        </svg>
        {unreadCount>0 && (
          <span style={{
            position:"absolute",top:-3,right:-3,
            background:"var(--no)",color:"#fff",
            fontSize:9,fontWeight:700,
            minWidth:16,height:16,borderRadius:8,
            display:"flex",alignItems:"center",justifyContent:"center",
            padding:"0 4px",
            fontFamily:"'Geist Mono',monospace",
            border:"2px solid var(--bg)"
          }}>{unreadCount>9?"9+":unreadCount}</span>
        )}
      </button>
      {open && (
        <div className="sw-menu" style={{minWidth:300,maxWidth:340,maxHeight:420,overflowY:"auto",padding:0}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",borderBottom:"1px solid var(--line)"}}>
            <div style={{fontSize:13,fontWeight:700}}>Notifications</div>
            {myNotifs.length>0 && (
              <button onClick={()=>dispatch({type:"MARK_ALL_NOTIFICATIONS_READ",uid})} style={{background:"none",border:"none",cursor:"pointer",color:"var(--sub)",fontSize:10,fontFamily:"'Geist Mono',monospace",letterSpacing:"0.06em",textTransform:"uppercase"}}>
                Mark all read
              </button>
            )}
          </div>

          {/* Permission prompt for browser notifications */}
          {permState==="default" && (
            <div style={{padding:"12px 14px",borderBottom:"1px solid var(--line)",background:"var(--yes-d)"}}>
              <div style={{fontSize:12,fontWeight:600,marginBottom:4}}>Enable push notifications</div>
              <div style={{fontSize:11,color:"var(--sub)",marginBottom:8,lineHeight:1.5}}>Get notified when bets need your attention, even when the app is closed.</div>
              <button className="btn btn-pri btn-xs btn-full" onClick={requestPerm}>Enable</button>
            </div>
          )}
          {permState==="denied" && (
            <div style={{padding:"10px 14px",borderBottom:"1px solid var(--line)",fontSize:11,color:"var(--sub)",lineHeight:1.5}}>
              Push notifications blocked. Enable in browser settings to get alerts when the app is closed.
            </div>
          )}

          {myNotifs.length===0 ? (
            <div style={{padding:"24px 14px",textAlign:"center"}}>
              <div style={{fontSize:13,color:"var(--sub)"}}>Nothing yet</div>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>You'll see bet activity here</div>
            </div>
          ) : (
            myNotifs.slice(0,30).map(n=>(
              <div key={n.id} onClick={()=>handleNotifClick(n)}
                style={{padding:"12px 14px",borderBottom:"1px solid var(--line)",cursor:"pointer",background:n.read?"transparent":"var(--bg2)",transition:"background 0.1s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                  <div style={{fontSize:12,fontWeight:600,color:"var(--text)",flex:1}}>{n.title}</div>
                  <div style={{fontSize:10,color:"var(--muted)",fontFamily:"'Geist Mono',monospace",flexShrink:0}}>{timeAgo(n.createdAt)}</div>
                </div>
                <div style={{fontSize:11,color:"var(--sub)",marginTop:3,lineHeight:1.4}}>{n.body}</div>
                {!n.read && (
                  <div style={{width:6,height:6,borderRadius:"50%",background:"var(--yes)",position:"absolute",left:6,marginTop:-12}}/>
                )}
              </div>
            ))
          )}
          {myNotifs.length>0 && (
            <div style={{padding:"8px 14px",textAlign:"center"}}>
              <button onClick={()=>{dispatch({type:"CLEAR_NOTIFICATIONS",uid});setOpen(false);}}
                style={{background:"none",border:"none",cursor:"pointer",color:"var(--sub)",fontSize:10,fontFamily:"'Geist Mono',monospace",letterSpacing:"0.06em",textTransform:"uppercase",padding:"4px 8px"}}>
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── USER SWITCHER ──────────────────────────────────────────────────────── */
function UserSwitcher({state,dispatch}){
  const [open,setOpen]=useState(false);
  const [newMode,setNewMode]=useState(false);
  const [newName,setNewName]=useState("");
  const [newErr,setNewErr]=useState("");
  const ref=useRef(null);
  const {uid,users}=state;
  const me=users[uid];
  useEffect(()=>{
    const fn=e=>{if(ref.current&&!ref.current.contains(e.target)){setOpen(false);setNewMode(false);}};
    document.addEventListener("mousedown",fn);
    return ()=>document.removeEventListener("mousedown",fn);
  },[]);
  const handleCreate=()=>{
    setNewErr("");
    const name=newName.trim();
    if(!name){setNewErr("Name required");return;}
    if(name.length>20){setNewErr("Max 20 characters");return;}
    if(Object.values(users).some(u=>u.name.toLowerCase()===name.toLowerCase())){setNewErr("Name already in use");return;}
    dispatch({type:"CREATE_USER",name,balance:1000});
    addToast(dispatch,`Account "${name}" created`,"success","$1,000 starting balance");
    setNewName("");setNewMode(false);
  };
  return (
    <div ref={ref} style={{position:"relative"}}>
      <div className="switcher" onClick={()=>setOpen(!open)}>
        <Avatar name={me.name} size="sm"/>
        <span className="switcher-name">{me.name.split(" ")[0]}</span>
      </div>
      {open && (
        <div className="sw-menu">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px 8px 12px"}}>
            <div style={{fontSize:9,color:"var(--muted)",fontFamily:"'Geist Mono',monospace",letterSpacing:"0.1em",textTransform:"uppercase"}}>Switch</div>
            <button onClick={()=>{dispatch({type:"NAV",page:"account"});setOpen(false);}} title="Manage accounts"
              style={{background:"none",border:"none",cursor:"pointer",color:"var(--sub)",fontSize:10,fontFamily:"'Geist Mono',monospace",letterSpacing:"0.06em",textTransform:"uppercase",padding:"2px 4px"}}>
              Manage →
            </button>
          </div>
          {Object.values(users).map(u=>(
            <div key={u.id} className={`sw-row ${u.id===uid?"on":""}`} onClick={()=>{dispatch({type:"SET_UID",uid:u.id});setOpen(false);}}>
              <Avatar name={u.name} size="sm"/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.name}</div>
                <div className="mono" style={{fontSize:10,color:"var(--sub)"}}>${fmtUSD(u.balance)}</div>
              </div>
              {u.id===uid && <span style={{color:"var(--yes)",fontSize:14}}>✓</span>}
            </div>
          ))}
          {!newMode ? (
            <div className="sw-row" onClick={()=>setNewMode(true)} style={{borderTop:"1px solid var(--line)",marginTop:4,paddingTop:10}}>
              <div style={{width:24,height:24,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--yes-d)",color:"var(--yes)",fontSize:14,fontWeight:300,boxShadow:"0 0 0 1.5px var(--yes-g)"}}>+</div>
              <div style={{flex:1,fontSize:12,fontWeight:600,color:"var(--yes)"}}>New account</div>
            </div>
          ) : (
            <div style={{padding:"10px 8px 4px",borderTop:"1px solid var(--line)",marginTop:4,position:"relative",zIndex:2}}>
              <input autoFocus value={newName} onChange={e=>{setNewName(e.target.value);setNewErr("");}}
                placeholder="Account name" maxLength={20}
                onKeyDown={e=>{if(e.key==="Enter")handleCreate();if(e.key==="Escape"){setNewMode(false);setNewName("");setNewErr("");}}}
                style={{padding:"10px 12px",fontSize:13,marginBottom:6}}/>
              {newErr && <div className="err" style={{marginBottom:6}}>{newErr}</div>}
              <div style={{display:"flex",gap:6}}>
                <button className="btn btn-ghost btn-xs btn-full" onClick={()=>{setNewMode(false);setNewName("");setNewErr("");}}>Cancel</button>
                <button className="btn btn-pri btn-xs btn-full" onClick={handleCreate} disabled={!newName.trim()}>Create</button>
              </div>
              <div style={{fontSize:9,color:"var(--muted)",fontFamily:"'Geist Mono',monospace",marginTop:8,letterSpacing:"0.06em"}}>Starts at $1,000 USDC · alpha test</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── SPENDING LIMIT CARD — per-bet wager cap ────────────────────────────── */
function SpendingLimitCard({me,dispatch}){
  const [editing,setEditing]=useState(false);
  const [input,setInput]=useState(me.maxWager ?? 100);
  const [err,setErr]=useState("");
  const hasLimit = me.maxWager !== null && me.maxWager !== undefined;

  const save=()=>{
    setErr("");
    const n=parseFloat(input);
    if(isNaN(n) || n<1){setErr("Minimum $1");return;}
    if(n>50000){setErr("Maximum $50,000");return;}
    dispatch({type:"SET_MAX_WAGER",uid:me.id,max:n});
    addToast(dispatch,`Cap set to $${fmtUSD(n)} per bet`,"success","Applies to every new bet you create");
    setEditing(false);
  };

  const remove=()=>{
    dispatch({type:"SET_MAX_WAGER",uid:me.id,max:null});
    addToast(dispatch,"Spending cap removed","info");
    setEditing(false);
  };

  return (
    <div style={{background:"rgba(255,184,0,0.06)",backdropFilter:"blur(20px)",borderRadius:18,padding:18,marginBottom:14,boxShadow:"0 1px 0 inset rgba(255,184,0,0.2), 0 0 0 0.5px rgba(255,184,0,0.25)"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <div>
          <div className="sec-t" style={{color:"var(--gold)"}}>Per-bet spending cap</div>
          <div style={{fontSize:11,color:"var(--sub)",marginTop:3,lineHeight:1.5}}>Stops you betting more than X on any single bet</div>
        </div>
        {!editing && (
          hasLimit ? (
            <div style={{textAlign:"right"}}>
              <div className="mono" style={{fontSize:20,fontWeight:700,color:"var(--gold)"}}>${fmtUSD(me.maxWager)}</div>
              <div style={{fontSize:10,color:"var(--sub)",fontFamily:"'Geist Mono',monospace",letterSpacing:"0.04em"}}>per bet</div>
            </div>
          ) : (
            <div style={{fontSize:11,color:"var(--muted)",fontFamily:"'Geist Mono',monospace"}}>No limit</div>
          )
        )}
      </div>

      {!editing ? (
        <div style={{display:"flex",gap:8,marginTop:10}}>
          <button className="btn btn-ghost btn-sm btn-full" onClick={()=>{setInput(me.maxWager ?? 100);setEditing(true);}}>
            {hasLimit ? "Change cap" : "Set a cap"}
          </button>
          {hasLimit && (
            <button className="btn btn-ghost btn-sm" onClick={remove}>Remove</button>
          )}
        </div>
      ) : (
        <div style={{marginTop:10}}>
          <input
            type="number"
            inputMode="decimal"
            autoFocus
            value={input}
            onChange={e=>{setInput(e.target.value);setErr("");}}
            placeholder="100"
            style={{fontSize:24,fontFamily:"'Anton',sans-serif",textAlign:"center",color:"var(--gold)",letterSpacing:"-0.01em",marginBottom:8}}
            onKeyDown={e=>{if(e.key==="Enter")save();if(e.key==="Escape")setEditing(false);}}
          />
          {err && <div className="err" style={{marginBottom:8}}>{err}</div>}
          <div className="chip-row" style={{marginBottom:10}}>
            {[10,25,50,100,250,500].map(v=>(
              <button key={v} className={`chip ${parseFloat(input)===v?"on":""}`} onClick={()=>setInput(v)}>${v}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:6}}>
            <button className="btn btn-ghost btn-full" onClick={()=>setEditing(false)}>Cancel</button>
            <button className="btn btn-pri btn-full" onClick={save}>Save cap</button>
          </div>
        </div>
      )}

      <div style={{marginTop:12,fontSize:10,color:"var(--sub)",fontFamily:"'Geist Mono',monospace",lineHeight:1.5,letterSpacing:"0.03em"}}>
        Hard limit · respected on every bet · change anytime
      </div>
    </div>
  );
}

/* ─── PROFILE SHEET ──────────────────────────────────────────────────────── */
function ProfileSheet({state,dispatch}){
  const {uid,users,bets}=state;
  const me=users[uid];
  const [editingName,setEditingName]=useState(false);
  const [nameInput,setNameInput]=useState(me.name);
  const [nameErr,setNameErr]=useState("");
  const [confirmDelete,setConfirmDelete]=useState(null); // userId being confirmed
  const [createMode,setCreateMode]=useState(false);
  const [newName,setNewName]=useState("");
  const [newErr,setNewErr]=useState("");
  const close=()=>{dispatch({type:"SET_PROFILE_OPEN",open:false});setConfirmDelete(null);setCreateMode(false);};

  const handleRename=()=>{
    setNameErr("");
    const name=nameInput.trim();
    if(!name){setNameErr("Name required");return;}
    if(name.length>20){setNameErr("Max 20 characters");return;}
    if(name===me.name){setEditingName(false);return;}
    if(Object.values(users).some(u=>u.id!==uid&&u.name.toLowerCase()===name.toLowerCase())){setNameErr("Name already in use");return;}
    dispatch({type:"UPDATE_USER_NAME",uid,name});
    addToast(dispatch,"Name updated","success");
    setEditingName(false);
  };

  const handleCreate=()=>{
    setNewErr("");
    const name=newName.trim();
    if(!name){setNewErr("Name required");return;}
    if(name.length>20){setNewErr("Max 20 characters");return;}
    if(Object.values(users).some(u=>u.name.toLowerCase()===name.toLowerCase())){setNewErr("Name already in use");return;}
    dispatch({type:"CREATE_USER",name,balance:1000});
    addToast(dispatch,`Account "${name}" created`,"success","$1,000 starting balance");
    setNewName("");setCreateMode(false);
  };

  const userHasActiveBets=u_id=>Object.values(bets).some(b=>
    (b.createdBy===u_id||b.acceptedBy===u_id)&&(b.status==="open"||b.status==="matched")
  );

  const handleDelete=(targetId)=>{
    const target=users[targetId];
    if(!target) return;
    if(Object.keys(users).length<=1){addToast(dispatch,"Can't delete the only account","error");return;}
    if(userHasActiveBets(targetId)){addToast(dispatch,"Resolve active bets first","error","Cancel or settle bets before deleting");return;}
    const wasSelf=targetId===uid;
    dispatch({type:"DELETE_USER",uid:targetId});
    addToast(dispatch,`Account "${target.name}" deleted`,"info",wasSelf?"Switched to next account":undefined);
    setConfirmDelete(null);
  };

  const otherUsers=Object.values(users).filter(u=>u.id!==uid);
  const myActiveBets=Object.values(bets).filter(b=>(b.createdBy===uid||b.acceptedBy===uid)&&(b.status==="open"||b.status==="matched")).length;

  return (
    <div className="overlay" onClick={close}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="sheet-handle"/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18,padding:"0 4px",position:"relative",zIndex:2}}>
          <div>
            <div className="pt-eyebrow">Settings</div>
            <div className="sheet-t">Profile</div>
          </div>
          <button onClick={close} style={{background:"rgba(255,255,255,0.08)",backdropFilter:"blur(20px)",border:"none",width:36,height:36,borderRadius:99,cursor:"pointer",color:"var(--text)",fontSize:18,boxShadow:"0 1px 0 inset rgba(255,255,255,0.18), 0 0 0 0.5px rgba(255,255,255,0.12)"}}>×</button>
        </div>

        <div style={{position:"relative",zIndex:2}}>
          {/* Current user card */}
          <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",borderRadius:18,padding:18,marginBottom:14,boxShadow:"0 1px 0 inset rgba(255,255,255,0.1), 0 0 0 0.5px rgba(255,255,255,0.1)"}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
              <Avatar name={me.name} size="lg"/>
              <div style={{flex:1,minWidth:0}}>
                {!editingName ? (
                  <>
                    <div className="head" style={{fontSize:18,fontWeight:700,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{me.name}</div>
                    <div style={{fontSize:11,color:"var(--sub)",fontFamily:"'Geist Mono',monospace",letterSpacing:"0.04em"}}>Active account</div>
                  </>
                ) : (
                  <>
                    <input autoFocus value={nameInput} onChange={e=>{setNameInput(e.target.value);setNameErr("");}}
                      maxLength={20}
                      onKeyDown={e=>{if(e.key==="Enter")handleRename();if(e.key==="Escape"){setEditingName(false);setNameInput(me.name);setNameErr("");}}}
                      style={{padding:"8px 12px",fontSize:14,fontWeight:600}}/>
                    {nameErr && <div className="err" style={{marginTop:6,marginBottom:0}}>{nameErr}</div>}
                  </>
                )}
              </div>
              {!editingName ? (
                <button className="btn btn-ghost btn-xs" onClick={()=>{setNameInput(me.name);setEditingName(true);}}>Edit</button>
              ) : (
                <div style={{display:"flex",gap:4}}>
                  <button className="btn btn-ghost btn-xs" onClick={()=>{setEditingName(false);setNameInput(me.name);setNameErr("");}}>×</button>
                  <button className="btn btn-pri btn-xs" onClick={handleRename}>Save</button>
                </div>
              )}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",paddingTop:14,borderTop:"1px solid rgba(255,255,255,0.08)"}}>
              <div>
                <div className="stake-l">Balance</div>
                <div className="mono" style={{fontSize:16,fontWeight:600,color:"var(--gold)"}}>${fmtUSD(me.balance)}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div className="stake-l">Active bets</div>
                <div className="mono" style={{fontSize:16,fontWeight:600}}>{myActiveBets}</div>
              </div>
            </div>
          </div>

          {/* SPENDING LIMIT — responsible-gambling primitive */}
          <SpendingLimitCard me={me} dispatch={dispatch}/>

          {/* Switch account */}
          {otherUsers.length>0 && (
            <>
              <div className="sec" style={{marginTop:6}}>
                <div className="sec-t">Other accounts</div>
                <div className="sec-s">{otherUsers.length}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
                {otherUsers.map(u=>{
                  const isConfirming=confirmDelete===u.id;
                  const hasActive=userHasActiveBets(u.id);
                  return (
                    <div key={u.id} style={{background:"rgba(255,255,255,0.03)",backdropFilter:"blur(10px)",borderRadius:14,padding:"10px 12px",boxShadow:"0 0 0 0.5px rgba(255,255,255,0.08)"}}>
                      {!isConfirming ? (
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <Avatar name={u.name} size="md"/>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.name}</div>
                            <div className="mono" style={{fontSize:10,color:"var(--sub)"}}>${fmtUSD(u.balance)}{hasActive&&<span style={{color:"var(--gold)",marginLeft:6}}>· locked bets</span>}</div>
                          </div>
                          <button className="btn btn-ghost btn-xs" onClick={()=>{dispatch({type:"SET_UID",uid:u.id});close();}}>Switch</button>
                          <button onClick={()=>setConfirmDelete(u.id)} title={hasActive?"User has active bets":"Delete account"} disabled={hasActive}
                            style={{background:hasActive?"transparent":"rgba(255,61,127,0.1)",border:"none",width:30,height:30,borderRadius:99,cursor:hasActive?"not-allowed":"pointer",color:hasActive?"var(--muted)":"var(--no)",display:"flex",alignItems:"center",justifyContent:"center",opacity:hasActive?0.4:1}}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div style={{fontSize:13,fontWeight:600,marginBottom:4,color:"var(--no)"}}>Delete "{u.name}"?</div>
                          <div style={{fontSize:11,color:"var(--sub)",marginBottom:10,lineHeight:1.5}}>${fmtUSD(u.balance)} balance will be lost. This can't be undone.</div>
                          <div style={{display:"flex",gap:6}}>
                            <button className="btn btn-ghost btn-xs btn-full" onClick={()=>setConfirmDelete(null)}>Cancel</button>
                            <button className="btn btn-xs btn-full" onClick={()=>handleDelete(u.id)} style={{background:"var(--no)",color:"#fff"}}>Delete</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Create new */}
          {!createMode ? (
            <button className="btn btn-ghost btn-full" onClick={()=>setCreateMode(true)} style={{marginBottom:14}}>+ New account</button>
          ) : (
            <div style={{background:"rgba(197,255,61,0.06)",backdropFilter:"blur(20px)",borderRadius:14,padding:14,marginBottom:14,boxShadow:"0 1px 0 inset rgba(197,255,61,0.2), 0 0 0 0.5px rgba(197,255,61,0.25)"}}>
              <div className="sec-t" style={{marginBottom:10,color:"var(--yes)"}}>New account</div>
              <input autoFocus value={newName} onChange={e=>{setNewName(e.target.value);setNewErr("");}} placeholder="Account name" maxLength={20}
                onKeyDown={e=>{if(e.key==="Enter")handleCreate();if(e.key==="Escape"){setCreateMode(false);setNewName("");setNewErr("");}}}
                style={{marginBottom:8}}/>
              {newErr && <div className="err" style={{marginBottom:8}}>{newErr}</div>}
              <div style={{display:"flex",gap:6}}>
                <button className="btn btn-ghost btn-full" onClick={()=>{setCreateMode(false);setNewName("");setNewErr("");}}>Cancel</button>
                <button className="btn btn-pri btn-full" onClick={handleCreate} disabled={!newName.trim()}>Create</button>
              </div>
              <div style={{fontSize:10,color:"var(--sub)",fontFamily:"'Geist Mono',monospace",marginTop:8,lineHeight:1.5}}>$1,000 USDC starting balance · alpha simulation only · no real funds involved</div>
            </div>
          )}

          {/* Danger zone: delete current account */}
          <div className="sec" style={{marginTop:8}}>
            <div className="sec-t" style={{color:"var(--no)"}}>Danger zone</div>
          </div>
          {confirmDelete===uid ? (
            <div style={{background:"rgba(255,61,127,0.08)",backdropFilter:"blur(20px)",borderRadius:14,padding:14,boxShadow:"0 1px 0 inset rgba(255,61,127,0.25), 0 0 0 0.5px rgba(255,61,127,0.3)"}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:6,color:"var(--no)"}}>Delete this account?</div>
              <div style={{fontSize:12,color:"var(--sub)",marginBottom:12,lineHeight:1.5}}>"{me.name}" and ${fmtUSD(me.balance)} balance will be deleted. You'll switch to another account. This can't be undone.</div>
              <div style={{display:"flex",gap:8}}>
                <button className="btn btn-ghost btn-full" onClick={()=>setConfirmDelete(null)}>Cancel</button>
                <button className="btn btn-full" onClick={()=>handleDelete(uid)} style={{background:"var(--no)",color:"#fff",padding:"12px 18px",fontSize:13,fontWeight:600,borderRadius:99}}>Yes, delete</button>
              </div>
            </div>
          ) : (
            <button onClick={()=>setConfirmDelete(uid)} disabled={Object.keys(users).length<=1||myActiveBets>0}
              style={{width:"100%",background:"rgba(255,61,127,0.08)",border:"none",borderRadius:99,padding:"14px 22px",cursor:Object.keys(users).length<=1||myActiveBets>0?"not-allowed":"pointer",color:"var(--no)",fontFamily:"'Geist',sans-serif",fontSize:13,fontWeight:600,boxShadow:"0 1px 0 inset rgba(255,61,127,0.2), 0 0 0 0.5px rgba(255,61,127,0.25)",opacity:Object.keys(users).length<=1||myActiveBets>0?0.4:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
              Delete this account
            </button>
          )}
          {myActiveBets>0 && (
            <div style={{fontSize:11,color:"var(--gold)",marginTop:8,padding:"8px 12px",background:"var(--gold-d)",borderRadius:10,lineHeight:1.5,boxShadow:"0 0 0 0.5px rgba(255,184,0,0.25)"}}>
              You have {myActiveBets} active bet{myActiveBets>1?"s":""}. Cancel or settle them before deleting this account — funds are locked in escrow.
            </div>
          )}
          {Object.keys(users).length<=1 && (
            <div style={{fontSize:11,color:"var(--sub)",marginTop:8,padding:"8px 12px",background:"var(--bg2)",borderRadius:10,lineHeight:1.5}}>
              You can't delete the only account. Create another first if you want to remove this one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── LIVE TICKER (glass pill) ───────────────────────────────────────────── */
function LiveTicker({bets,users}){
  const items=useMemo(()=>{
    const recent=Object.values(bets).sort((a,b)=>b.createdAt-a.createdAt).slice(0,8);
    return recent.map(b=>{
      const u=safeUser(users,b.createdBy);
      let action="opened", dotClass="";
      if(b.status==="matched"){action="matched";dotClass="gold";}
      if(b.status==="settled"){action="settled";}
      return {id:b.id,user:u.name,action,amount:b.wager,dotClass};
    });
  },[bets,users]);
  if(items.length===0) return null;
  const looped=[...items,...items];
  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {looped.map((it,i)=>(
          <div key={i} className="ticker-item">
            <span className={`ticker-dot ${it.dotClass}`}/>
            <span className="ticker-name">{it.user}</span>
            <span>{it.action}</span>
            <span style={{color:"var(--gold)"}}>${fmtUSD(it.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── BET CARD ───────────────────────────────────────────────────────────── */
function BetCard({bet,state,dispatch}){
  const {uid,users}=state;
  const creator=safeUser(users,bet.createdBy);
  const acceptor=bet.acceptedBy?safeUser(users,bet.acceptedBy):null;
  const me=users[uid];
  const isCreator=bet.createdBy===uid;
  const isAcceptor=bet.acceptedBy===uid;
  const canAccept=bet.status==="open"&&!isCreator&&me.balance>=bet.wager&&Date.now()<bet.expiresAt;
  const canSettle=(bet.status==="matched"||bet.status==="pending_settlement"||bet.status==="disputed")&&(isCreator||isAcceptor);
  const myVote=(bet.votes||{})[uid];
  const isPending=bet.status==="pending_settlement"||bet.status==="disputed";
  const secs=useCountdown(bet.expiresAt);
  const yp=impliedYes(bet.odds);

  const statusTag=useMemo(()=>{
    if(bet.status==="open") return <span className="tag t-live">LIVE</span>;
    if(bet.status==="matched") return <span className="tag t-matched">MATCHED</span>;
    if(bet.status==="pending_settlement") return <span className="tag" style={{background:"var(--gold)",color:"var(--ink)"}}>SETTLE NOW</span>;
    if(bet.status==="disputed") return <span className="tag" style={{background:"var(--no)",color:"#fff"}}>DISPUTED</span>;
    if(bet.status==="settled"){
      if(bet.decision==="forfeit") return <span className="tag t-cat">FORFEIT</span>;
      if(bet.decision==="split") return <span className="tag t-cat">SPLIT</span>;
      return bet.winner===uid
        ? <span className="tag t-won">+${fmtUSD(bet.wager*([bet.createdBy,bet.acceptedBy].filter(Boolean).length-1))}</span>
        : <span className="tag t-lost">-${fmtUSD(bet.wager)}</span>;
    }
    return <span className="tag t-cat">{bet.status}</span>;
  },[bet.status,bet.winner,bet.decision,bet.wager,bet.createdBy,bet.acceptedBy,uid]);

  const timeAgo=(()=>{
    const d=Math.floor((Date.now()-bet.createdAt)/60000);
    if(d<1) return "just now";
    if(d<60) return `${d}m ago`;
    return `${Math.floor(d/60)}h ago`;
  })();

  return (
    <div className="bet" style={{opacity:bet.status==="cancelled"||bet.status==="expired"?0.5:1}}>
      <div className="bet-row">
        <Avatar name={creator.name} size="md"/>
        <div className="bet-who">
          <div className="bet-who-n">
            {creator.name}{isCreator && <span style={{fontSize:10,color:"var(--sub)",fontWeight:400}}>(you)</span>}
            {acceptor && <>
              <span style={{color:"var(--muted)",margin:"0 4px"}}>×</span>
              <span style={{color:"var(--gold)"}}>{acceptor.name}</span>
            </>}
          </div>
          <div className="bet-who-t">{timeAgo}{bet.status==="open"&&secs>0&&<> · expires {fmtTime(secs)}</>}</div>
        </div>
        {statusTag}
      </div>

      <div className="bet-q">{bet.title}</div>
      <div className="bet-side"><strong>{creator.name.split(" ")[0]}'s side:</strong> {bet.side}</div>

      <div style={{display:"flex",alignItems:"center",gap:12,margin:"12px 0"}}>
        <div style={{flex:1}}>
          <div className="yn"><div className="yn-y" style={{width:`${yp}%`}}/><div className="yn-n" style={{width:`${100-yp}%`}}/></div>
          <div className="yn-pcts"><span className="y">{yp.toFixed(0)}%</span><span className="n">{(100-yp).toFixed(0)}%</span></div>
        </div>
        <span className={`odds ${bet.odds>0?"pos":"neg"}`}>{fmtOdds(bet.odds)}</span>
      </div>

      <div style={{display:"flex",alignItems:"center",gap:14,paddingTop:12,borderTop:"1px solid var(--line)"}}>
        <div>
          <div className="stake-l">Stake</div>
          <div className="mono" style={{fontSize:15,fontWeight:600,color:"var(--gold)"}}>${fmtUSD(bet.wager)}</div>
        </div>
        <div style={{color:"var(--muted)",fontSize:14}}>→</div>
        <div>
          <div className="stake-l">Win</div>
          <div className="mono" style={{fontSize:15,fontWeight:600,color:"var(--yes)"}}>+${fmtUSD(bet.wager)}</div>
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:8,flexWrap:"wrap",justifyContent:"flex-end"}}>
          {bet.status==="open"&&Date.now()<bet.expiresAt && <>
            {canAccept && <button className="btn btn-yes btn-sm" onClick={()=>{dispatch({type:"ACCEPT_BET",betId:bet.id,uid});addToast(dispatch,"Bet accepted","success",`$${fmtUSD(bet.wager)} locked`);}}>Take it</button>}
            {isCreator && <button className="btn btn-gold btn-sm" onClick={()=>dispatch({type:"SET_SHARE",betId:bet.id})}>Share</button>}
            {!canAccept && !isCreator && me.balance<bet.wager && <span style={{fontSize:11,color:"var(--no)"}}>Low balance</span>}
          </>}
        </div>
      </div>

      {bet.status==="open"&&isCreator&&Date.now()<bet.expiresAt && (
        <button className="btn btn-ghost btn-xs" style={{marginTop:10}} onClick={()=>{dispatch({type:"CANCEL_BET",betId:bet.id,uid});addToast(dispatch,"Bet cancelled","info",`$${fmtUSD(bet.wager)} returned`);}}>Cancel</button>
      )}

      {canSettle && (
        <div style={{marginTop:12,padding:"12px 14px",background:isPending?"var(--gold-d)":"var(--bg2)",borderRadius:12,border:`1px solid ${isPending?"var(--gold-d)":"var(--line)"}`}}>
          <div style={{fontSize:10,color:isPending?"var(--gold)":"var(--sub)",fontWeight:700,marginBottom:8,fontFamily:"'Geist Mono',monospace",letterSpacing:"0.08em",textTransform:"uppercase"}}>
            {bet.status==="disputed"?"Disputed · revote needed":isPending?"Time to settle":"Settle early?"}
          </div>
          {myVote && bet.status==="pending_settlement" && (
            <div style={{fontSize:11,color:"var(--sub)",marginBottom:8}}>
              You voted: <strong style={{color:"var(--text)"}}>{myVote==="forfeit"?"Forfeit":myVote==="split"?"Split":safeUser(users,myVote).name}</strong> · waiting for others
            </div>
          )}
          <button className="btn btn-pri btn-sm btn-full" onClick={()=>dispatch({type:"SET_SETTLE",betId:bet.id})}>
            {myVote?"Change vote":isPending?"Vote on outcome":"Settle now"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── HERO BET ───────────────────────────────────────────────────────────── */
function HeroBet({bet,state,dispatch}){
  const {uid,users}=state;
  const creator=safeUser(users,bet.createdBy);
  const acceptor=bet.acceptedBy?safeUser(users,bet.acceptedBy):null;
  const me=users[uid];
  const isCreator=bet.createdBy===uid;
  const canAccept=bet.status==="open"&&!isCreator&&me.balance>=bet.wager&&Date.now()<bet.expiresAt;
  const secs=useCountdown(bet.expiresAt);
  const yp=impliedYes(bet.odds);
  return (
    <div className="hero">
      <div className="hero-meta">
        <Avatar name={creator.name} size="lg"/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
            <span style={{fontWeight:700,fontSize:14}}>{creator.name}</span>
            {acceptor && <>
              <span style={{color:"var(--muted)"}}>×</span>
              <Avatar name={acceptor.name} size="sm"/>
              <span style={{fontWeight:600,fontSize:13,color:"var(--gold)"}}>{acceptor.name}</span>
            </>}
          </div>
          <div className="bet-who-t">{bet.status==="open" && secs>0 ? `Closes in ${fmtTime(secs)}` : bet.status==="matched" ? "Matched · awaiting outcome" : "Live now"}</div>
        </div>
        {bet.status==="open" ? <span className="tag t-live">LIVE</span> : <span className="tag t-matched">MATCHED</span>}
      </div>

      <div className="hero-q">{bet.title}</div>
      <div className="hero-side"><strong>{creator.name.split(" ")[0]}</strong> takes: {bet.side}</div>

      <div className="yn"><div className="yn-y" style={{width:`${yp}%`}}/><div className="yn-n" style={{width:`${100-yp}%`}}/></div>
      <div className="yn-pcts"><span className="y">{yp.toFixed(0)}% YES</span><span className="n">{(100-yp).toFixed(0)}% NO</span></div>

      <div className="stakes">
        <div>
          <div className="stake-l">Stake</div>
          <div className="stake-v gold">${fmtUSD(bet.wager)}</div>
        </div>
        <div className="stakes-div"/>
        <div>
          <div className="stake-l">To win</div>
          <div className="stake-v green">+${fmtUSD(bet.wager)}</div>
        </div>
      </div>

      <div style={{display:"flex",gap:8,marginTop:16}}>
        {bet.status==="open" && canAccept && (
          <button className="btn btn-pri btn-full" onClick={()=>{dispatch({type:"ACCEPT_BET",betId:bet.id,uid});addToast(dispatch,"You're in","success",`$${fmtUSD(bet.wager)} locked`);}}>
            Take the {fmtOdds(bet.odds)} · ${fmtUSD(bet.wager)}
          </button>
        )}
        {bet.status==="open" && isCreator && (
          <button className="btn btn-gold btn-full" onClick={()=>dispatch({type:"SET_SHARE",betId:bet.id})}>
            Share to find a taker
          </button>
        )}
        {bet.status==="matched" && <button className="btn btn-ghost btn-full" disabled>Matched · waiting for outcome</button>}
        {bet.status==="open" && !canAccept && !isCreator && me.balance<bet.wager && (
          <button className="btn btn-ghost btn-full" disabled>Insufficient balance</button>
        )}
      </div>
    </div>
  );
}

/* ─── HOME PAGE ──────────────────────────────────────────────────────────── */
function HomePage({state,dispatch}){
  const {uid,users,bets,rooms}=state;
  const me=users[uid];
  const all=Object.values(bets);
  const live=all.filter(b=>b.status==="open"||b.status==="matched").sort((a,b)=>b.createdAt-a.createdAt);
  const heroBet=live[0];
  const otherBets=live.slice(1,5);
  const myRooms=Object.values(rooms).filter(r=>r.members.includes(uid));

  return (
    <div className="page">
      <div className="au">
        <div className="pt-eyebrow">Welcome back</div>
        <h1 className="pt">{me.name.split(" ")[0]}</h1>
        <p className="pt-sub">{myRooms.length} rooms · {live.length} live bets in your network</p>
      </div>

      {heroBet && (
        <div className="au1" style={{marginBottom:18}}>
          <div className="sec"><div className="sec-t">Top of feed</div><div className="sec-s">freshest bet</div></div>
          <HeroBet bet={heroBet} state={state} dispatch={dispatch}/>
        </div>
      )}

      <div className="sec au2"><div className="sec-t">Feed</div><div className="sec-s">{otherBets.length} more</div></div>

      {otherBets.length===0 ? (
        <div className="empty au3">
          <div className="empty-icon">NO BETS</div>
          <div className="empty-t">Be the one to start it</div>
          <div className="empty-s">Tap + to create a bet — any topic, any stake</div>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {otherBets.map((b,i)=>(<div key={b.id} className={`au${Math.min(i+2,4)}`}><BetCard bet={b} state={state} dispatch={dispatch}/></div>))}
        </div>
      )}
    </div>
  );
}

/* ─── ROOMS PAGE ─────────────────────────────────────────────────────────── */
function RoomsPage({state,dispatch}){
  const {uid,users,rooms,bets}=state;
  const [view,setView]=useState("list");
  const [activeId,setActiveId]=useState(null);
  const [mode,setMode]=useState(null);
  const [roomName,setRoomName]=useState("");
  const [sport,setSport]=useState("Any");
  const [joinCode,setJoinCode]=useState("");
  const [joinErr,setJoinErr]=useState("");

  const myRooms=Object.values(rooms).filter(r=>r.members.includes(uid));

  const handleCreate=()=>{
    if(!roomName.trim()) return;
    const code=genCode();
    dispatch({type:"CREATE_ROOM",room:{id:code,code,name:roomName.trim(),sport,createdBy:uid,members:[uid],maxMembers:10,createdAt:Date.now()}});
    addToast(dispatch,"Room created","success",`Code: ${code}`);
    setRoomName("");setMode(null);
  };
  const handleJoin=()=>{
    setJoinErr("");
    const code=joinCode.trim().toUpperCase();
    const r=Object.values(rooms).find(r=>r.code===code);
    if(!r){setJoinErr("Room not found");return;}
    if(r.members.includes(uid)){setJoinErr("You're already in");return;}
    if(r.members.length>=r.maxMembers){setJoinErr("Room is full");return;}
    dispatch({type:"JOIN_ROOM",roomId:r.id,uid});
    addToast(dispatch,`Joined ${r.name}`,"success");
    setJoinCode("");setMode(null);
  };

  if(view==="room"&&activeId){
    const r=rooms[activeId];
    if(!r){setView("list");return null;}
    const roomBets=Object.values(bets).filter(b=>b.roomId===activeId);
    return (
      <div className="page">
        <button className="btn btn-ghost btn-sm" onClick={()=>setView("list")} style={{marginBottom:16}}>← Rooms</button>
        <div className="pt-eyebrow">{r.sport}</div>
        <h1 className="pt" style={{fontSize:38}}>{r.name}</h1>

        <div className="invite">
          <div style={{position:"relative",zIndex:2}}>
            <div className="invite-l">Invite code</div>
            <div className="invite-c">{r.code}</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={()=>{navigator.clipboard?.writeText(r.code);addToast(dispatch,"Copied","success");}}>Copy</button>
        </div>

        <div className="stats-grid">
          <div className="stat"><div className="stat-h">Members</div><div className="stat-n">{r.members.length}<span style={{fontSize:14,color:"var(--sub)"}}>/{r.maxMembers}</span></div></div>
          <div className="stat"><div className="stat-h">Open bets</div><div className="stat-n" style={{color:"var(--yes)"}}>{roomBets.filter(b=>b.status==="open").length}</div></div>
        </div>

        <div className="sec"><div className="sec-t">Members</div></div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20}}>
          {r.members.map(mid=>{
            const u=safeUser(users,mid);
            return (
              <div key={mid} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px 8px 8px",background:"var(--bg1)",borderRadius:99,border:"1px solid var(--line)"}}>
                <Avatar name={u.name} size="sm"/>
                <span style={{fontSize:12,fontWeight:600}}>{u.name}{mid===uid?" · you":""}</span>
              </div>
            );
          })}
        </div>

        <div className="sec">
          <div className="sec-t">Bets in room</div>
          <button className="btn btn-pri btn-sm" onClick={()=>dispatch({type:"NAV",page:"create",roomId:activeId})}>+ Bet</button>
        </div>

        {roomBets.length===0 ? (
          <div className="empty"><div className="empty-icon">QUIET</div><div className="empty-t">Room is empty</div><div className="empty-s">Break the silence</div></div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {roomBets.map(b=><BetCard key={b.id} bet={b} state={state} dispatch={dispatch}/>)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="page">
      <div className="au">
        <div className="pt-eyebrow">Private</div>
        <h1 className="pt">Rooms</h1>
        <p className="pt-sub">Invite-only · zero rake · any crypto</p>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:18}} className="au1">
        <button className="btn btn-pri btn-full" onClick={()=>setMode(mode==="create"?null:"create")}>+ Create</button>
        <button className="btn btn-ghost btn-full" onClick={()=>setMode(mode==="join"?null:"join")}>Join code</button>
      </div>

      {mode==="create" && (
        <div className="au" style={{background:"var(--bg1)",border:"1px solid var(--line)",borderRadius:18,padding:18,marginBottom:16}}>
          <div className="sec-t" style={{marginBottom:14}}>New room</div>
          <div className="fg"><label>Room name</label><input value={roomName} onChange={e=>setRoomName(e.target.value)} placeholder="Sunday Gridiron" maxLength={40} onKeyDown={e=>e.key==="Enter"&&handleCreate()}/></div>
          <div className="fg"><label>Category</label><select value={sport} onChange={e=>setSport(e.target.value)}>{SPORTS.map(s=><option key={s}>{s}</option>)}</select></div>
          <button className="btn btn-pri btn-full" onClick={handleCreate} disabled={!roomName.trim()}>Create</button>
        </div>
      )}

      {mode==="join" && (
        <div className="au" style={{background:"var(--bg1)",border:"1px solid var(--line)",borderRadius:18,padding:18,marginBottom:16}}>
          <div className="sec-t" style={{marginBottom:14}}>Join with code</div>
          <div className="fg">
            <label>Code</label>
            <input className="mono" value={joinCode} onChange={e=>{setJoinCode(e.target.value.toUpperCase());setJoinErr("");}} placeholder="DEMOROOM" maxLength={8} style={{letterSpacing:"0.16em",fontSize:18,textAlign:"center",fontFamily:"'Anton',sans-serif"}} onKeyDown={e=>e.key==="Enter"&&handleJoin()}/>
            {joinErr && <div className="err">{joinErr}</div>}
          </div>
          <button className="btn btn-pri btn-full" onClick={handleJoin} disabled={joinCode.length<4}>Join room</button>
          <div style={{marginTop:10,fontSize:10,color:"var(--sub)",padding:"8px 12px",background:"var(--bg2)",borderRadius:10,fontFamily:"'Geist Mono',monospace"}}>Test code: <span style={{color:"var(--gold)"}}>DEMOROOM</span></div>
        </div>
      )}

      {myRooms.length===0 && !mode ? (
        <div className="empty au2"><div className="empty-icon">EMPTY</div><div className="empty-t">No rooms yet</div><div className="empty-s">Create one or join with a code</div></div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {myRooms.map((r,i)=>{
            const rb=Object.values(bets).filter(b=>b.roomId===r.id);
            const oc=rb.filter(b=>b.status==="open").length;
            return (
              <div key={r.id} className={`au${Math.min(i+1,4)}`} style={{background:"var(--bg1)",border:"1px solid var(--line)",borderRadius:18,padding:16,cursor:"pointer"}} onClick={()=>{setActiveId(r.id);setView("room");}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="head" style={{fontSize:18,fontWeight:700,marginBottom:4}}>{r.name}</div>
                    <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                      <span className="tag t-cat">{r.sport}</span>
                      <span className="mono" style={{fontSize:10,color:"var(--muted)"}}>{r.code}</span>
                      <span style={{fontSize:11,color:"var(--sub)"}}>· {r.members.length} members</span>
                    </div>
                  </div>
                  {oc>0 && <div style={{textAlign:"center",marginLeft:12}}>
                    <div className="display" style={{fontSize:24,color:"var(--yes)",lineHeight:1,textShadow:"0 0 8px var(--yes-g)"}}>{oc}</div>
                    <div style={{fontSize:9,color:"var(--sub)",fontFamily:"'Geist Mono',monospace",letterSpacing:"0.08em",textTransform:"uppercase"}}>open</div>
                  </div>}
                  <span style={{color:"var(--muted)",fontSize:20,marginLeft:8}}>›</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── CREATE PAGE (slider-driven, beginner-friendly) ─────────────────────── */
function CreatePage({state,dispatch,prefillRoom}){
  const {uid,users,rooms}=state;
  const me=users[uid];
  const myRooms=Object.values(rooms).filter(r=>r.members.includes(uid));
  const [title,setTitle]=useState("");
  const [side,setSide]=useState("");
  const [cat,setCat]=useState("Any");
  const [confidence,setConfidence]=useState(50); // 1–99, slider value
  const [wager,setWager]=useState(20);
  const [roomId,setRoomId]=useState(prefillRoom||(myRooms[0]?.id||""));
  const [hours,setHours]=useState("24");
  const [done,setDone]=useState(null);

  // Effective max wager: user-set cap, balance, or $50K platform max — whichever is lowest
  const effectiveMax = Math.min(
    me.maxWager ?? Infinity,
    me.balance,
    50000
  );

  // Auto-trim wager if user cap or balance drops below current selection
  useEffect(()=>{
    if(wager > effectiveMax) setWager(Math.max(1, Math.floor(effectiveMax)));
  },[effectiveMax,wager]);

  const odds = confidenceToOdds(confidence);
  const toWinAmt = toWin(wager, odds);
  const maxLoss = wager; // In American odds, you can never lose more than your stake

  // What words to use for the confidence level — speaks to feel, not math
  const confidenceWord = useMemo(()=>{
    if (confidence <= 10) return "Very unlikely · big payout";
    if (confidence <= 25) return "Long shot";
    if (confidence <= 40) return "Underdog pick";
    if (confidence <= 55) return "Coin flip-ish";
    if (confidence <= 70) return "Favored";
    if (confidence <= 85) return "Strongly favored";
    return "Near-certain · small payout";
  },[confidence]);

  // Color for the confidence number — slides green→yellow→red as confidence drops
  const confColor = useMemo(()=>{
    if (confidence >= 60) return "var(--yes)";
    if (confidence >= 40) return "var(--gold)";
    return "var(--no)";
  },[confidence]);

  // Specific error messages so user knows exactly what's wrong
  const validationError = useMemo(()=>{
    if (!title.trim()) return null; // Don't yell before they've started typing
    if (title.trim().length < 4) return "Make the bet a bit more descriptive";
    if (!side.trim()) return null;
    if (myRooms.length === 0) return "Create or join a room first";
    if (wager < 1) return "Minimum wager is $1";
    if (wager > me.balance) return `Not enough balance (have $${fmtUSD(me.balance)})`;
    if (me.maxWager != null && wager > me.maxWager) return `Above your per-bet cap of $${fmtUSD(me.maxWager)}`;
    return null;
  },[title,side,wager,me.balance,me.maxWager,myRooms.length]);

  const canSubmit = title.trim().length >= 4 && side.trim().length >= 1 && wager >= 1 && wager <= effectiveMax && myRooms.length > 0 && !validationError;

  const submit=()=>{
    if(!canSubmit) return;
    const bet={
      id:genId(),
      roomId,
      createdBy:uid,
      title:title.trim(),
      category:cat,
      side:side.trim(),
      odds:odds,
      wager:wager,
      status:"open",
      acceptedBy:null,
      winner:null,
      lockedOdds:null,
      createdAt:Date.now(),
      expiresAt:Date.now()+parseInt(hours)*3600000
    };
    dispatch({type:"CREATE_BET",bet});
    // Confirm the dispatch worked by checking if it appears in next render
    addToast(dispatch,"Bet is live","success",`$${fmtUSD(wager)} locked in escrow`);
    setDone(bet);
  };

  if(done) return (
    <div className="page" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"60vh"}}>
      <div className="au" style={{textAlign:"center",maxWidth:340}}>
        <div className="display" style={{fontSize:96,color:"var(--yes)",letterSpacing:"-0.02em",lineHeight:0.9,marginBottom:14,textShadow:"0 0 60px var(--yes)"}}>LIVE</div>
        <div className="head" style={{fontSize:20,fontWeight:700,marginBottom:8}}>Your bet is in the wild</div>
        <div style={{fontSize:13,color:"var(--sub)",marginBottom:24}}>${fmtUSD(done.wager)} locked in escrow. Now find a taker.</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <button className="btn btn-pri btn-full" onClick={()=>dispatch({type:"SET_SHARE",betId:done.id})}>Share this bet</button>
          <button className="btn btn-ghost btn-full" onClick={()=>{setDone(null);setTitle("");setSide("");setWager(20);setConfidence(50);}}>Make another</button>
          <button className="btn btn-ghost btn-full" onClick={()=>dispatch({type:"NAV",page:"home"})}>Back to feed</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="au">
        <div className="pt-eyebrow">Stake the world</div>
        <h1 className="pt">New bet</h1>
        <p className="pt-sub">Any topic. Settles in USDC.</p>
      </div>

      {/* THE BET */}
      <div className="fg au1">
        <label>The bet</label>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="He orders pizza for lunch" maxLength={120} style={{fontSize:17,fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:600}}/>
      </div>

      <div className="fg au2">
        <label>Your side</label>
        <input value={side} onChange={e=>setSide(e.target.value)} placeholder="Will order pizza" maxLength={80}/>
      </div>

      <div className="au3" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div className="fg"><label>Category</label><select value={cat} onChange={e=>setCat(e.target.value)}>{SPORTS.map(s=><option key={s}>{s}</option>)}</select></div>
        <div className="fg"><label>Expires in</label><select value={hours} onChange={e=>setHours(e.target.value)}>{["1","2","6","12","24","48","72"].map(h=><option key={h} value={h}>{h}h</option>)}</select></div>
      </div>

      <div className="div-label au3">Confidence</div>

      {/* CONFIDENCE SLIDER — replaces the cryptic American odds input */}
      <div className="au3" style={{background:"var(--bg1)",border:"1px solid var(--line)",borderRadius:18,padding:"20px 18px 16px",marginBottom:18}}>
        <div className="conf-display">
          <div className="conf-num" style={{color:confColor}}>{confidence}</div>
          <div className="conf-pct">% sure</div>
        </div>
        <div className="conf-word">{confidenceWord}</div>
        <div className="slider-row">
          <input
            type="range"
            min="1"
            max="99"
            value={confidence}
            onChange={e=>setConfidence(parseInt(e.target.value))}
            className="slider"
          />
        </div>
        <div className="slider-labels">
          <span>Long shot</span>
          <span style={{color:"var(--sub)"}}>Coin flip</span>
          <span>Lock</span>
        </div>
        <div style={{fontSize:10,color:"var(--muted)",fontFamily:"'Geist Mono',monospace",textAlign:"center",marginTop:14,letterSpacing:"0.04em"}}>
          Equivalent odds: {fmtOdds(odds)}
        </div>
      </div>

      <div className="div-label au4">Stake</div>

      {/* WAGER CHIPS + custom input */}
      <div className="au4" style={{background:"var(--bg1)",border:"1px solid var(--line)",borderRadius:18,padding:"18px",marginBottom:14}}>
        <div style={{textAlign:"center",marginBottom:14}}>
          <div className="display" style={{fontSize:54,color:"var(--gold)",letterSpacing:"-0.025em",lineHeight:0.9}}>${fmtUSD(wager)}</div>
          <div style={{fontSize:11,color:"var(--sub)",fontFamily:"'Geist Mono',monospace",marginTop:6,letterSpacing:"0.06em",textTransform:"uppercase"}}>You risk this if you lose</div>
        </div>

        <div className="chip-row">
          {[5,10,20,50,100,250].filter(v=>v<=effectiveMax).map(v=>(
            <button key={v} className={`chip ${wager===v?"on":""}`} onClick={()=>setWager(v)}>${v}</button>
          ))}
        </div>

        <input
          type="number"
          inputMode="decimal"
          value={wager}
          onChange={e=>{
            const v=parseFloat(e.target.value);
            if(isNaN(v)) setWager(0);
            else setWager(Math.min(effectiveMax, Math.max(0, v)));
          }}
          placeholder="Custom amount"
          style={{marginTop:10,fontSize:15,textAlign:"center",fontFamily:"'Geist Mono',monospace",fontWeight:600}}
        />

        <div style={{marginTop:10,fontSize:10,color:"var(--sub)",fontFamily:"'Geist Mono',monospace",lineHeight:1.5,letterSpacing:"0.04em"}}>
          Balance: ${fmtUSD(me.balance)}
          {me.maxWager != null && <> · Per-bet cap: ${fmtUSD(me.maxWager)}</>}
        </div>
      </div>

      {/* OUTCOME PREVIEW — equal-stakes model: both stake same, winner takes pot */}
      <div className="outcome-row au4">
        <div className="outcome-card win">
          <div className="outcome-label">If you win</div>
          <div className="outcome-amount">+${fmtUSD(wager)}</div>
          <div className="outcome-sub">Opponent's stake comes to you</div>
        </div>
        <div className="outcome-card lose">
          <div className="outcome-label">If you lose</div>
          <div className="outcome-amount">-${fmtUSD(maxLoss)}</div>
          <div className="outcome-sub">Your stake goes to opponent</div>
        </div>
      </div>

      {/* ROOM SELECTOR */}
      {myRooms.length === 0 ? (
        <div style={{padding:"14px 16px",background:"var(--no-d)",borderRadius:14,marginBottom:14,boxShadow:"0 0 0 0.5px rgba(255,61,127,0.3)"}}>
          <div style={{fontSize:12,color:"var(--no)",fontWeight:600,marginBottom:4}}>No rooms yet</div>
          <div style={{fontSize:11,color:"var(--sub)",lineHeight:1.5,marginBottom:10}}>Bets live inside rooms. Create one or join with a code first.</div>
          <button className="btn btn-no btn-sm btn-full" onClick={()=>dispatch({type:"NAV",page:"rooms"})}>Go to rooms</button>
        </div>
      ) : (
        <div className="fg au4"><label>Room</label><select value={roomId} onChange={e=>setRoomId(e.target.value)}>{myRooms.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
      )}

      {/* Validation feedback — explicit, never silent */}
      {validationError && <div className="err au4" style={{marginBottom:14,fontSize:12,padding:"10px 14px",borderRadius:12}}>{validationError}</div>}

      {/* SUMMARY */}
      {canSubmit && (
        <div className="au4" style={{background:"var(--bg1)",border:"1px solid var(--line)",borderRadius:16,padding:"14px 16px",marginBottom:14}}>
          {[
            ["Locking in escrow",`$${fmtUSD(wager)}`,"var(--gold)"],
            ["Could win",`+$${fmtUSD(wager)}`,"var(--yes)"],
            ["Balance after lock",`$${fmtUSD(me.balance-wager)}`,null]
          ].map(([k,v,c])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"4px 0"}}>
              <span style={{color:"var(--sub)"}}>{k}</span>
              <span className="mono" style={{fontWeight:600,color:c||"var(--text)"}}>{v}</span>
            </div>
          ))}
        </div>
      )}

      <button className="btn btn-pri btn-full au4" onClick={submit} disabled={!canSubmit} style={{padding:"16px 22px",fontSize:15}}>
        {!title.trim() ? "Type the bet to continue" :
         !side.trim() ? "Add your side" :
         myRooms.length === 0 ? "Need a room first" :
         canSubmit ? `Lock $${fmtUSD(wager)} · Make it real` :
         "Fill the bet"}
      </button>
    </div>
  );
}

/* ─── MARKETS PAGE ───────────────────────────────────────────────────────── */
function MarketsPage({state,dispatch}){
  const {bets,uid}=state;
  const [filter,setFilter]=useState("all");
  const all=Object.values(bets);
  const filtered=all.filter(b=>{
    if(filter==="open") return b.status==="open";
    if(filter==="matched") return b.status==="matched";
    if(filter==="mine") return b.createdBy===uid||b.acceptedBy===uid;
    return b.status!=="cancelled";
  }).sort((a,b)=>b.createdAt-a.createdAt);
  const tabs=[
    {id:"all",label:"All",ct:all.filter(b=>b.status!=="cancelled").length},
    {id:"open",label:"Open",ct:all.filter(b=>b.status==="open").length},
    {id:"matched",label:"Matched",ct:all.filter(b=>b.status==="matched").length},
    {id:"mine",label:"Mine",ct:all.filter(b=>b.createdBy===uid||b.acceptedBy===uid).length},
  ];
  return (
    <div className="page">
      <div className="au">
        <div className="pt-eyebrow">All live</div>
        <h1 className="pt">Markets</h1>
        <p className="pt-sub">Every bet you can act on</p>
      </div>
      <div className="tabs au1">
        {tabs.map(t=>(<button key={t.id} className={`tab ${filter===t.id?"on":""}`} onClick={()=>setFilter(t.id)}>{t.label}{t.ct>0 && <span className="tab-ct">{t.ct}</span>}</button>))}
      </div>
      {filtered.length===0 ? (
        <div className="empty au2"><div className="empty-icon">QUIET</div><div className="empty-t">Nothing here yet</div><div className="empty-s">Try a different filter</div></div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {filtered.map((b,i)=>(<div key={b.id} className={`au${Math.min(i,4)}`}><BetCard bet={b} state={state} dispatch={dispatch}/></div>))}
        </div>
      )}
    </div>
  );
}

/* ─── DEPOSIT FLOW — method selector + asset selector ────────────────────── */
function DepositFlow({state,dispatch,amount,setAmount,amtErr,setAmtErr,doDeposit}){
  const {uid}=state;
  // Method: how the money enters (apple pay, card, crypto wallet)
  const [method,setMethod]=useState("apple"); // apple | card | crypto | wallet
  // For crypto method: which asset they're sending (auto-converts to USDC)
  const [asset,setAsset]=useState("USDC");

  // Fees by method — realistic to MoonPay/Coinbase/Stripe rates
  const methods=[
    {id:"apple", icon:"", iconColor:"#000", iconBg:"#fff", name:"Apple Pay", desc:"Instant · Face ID", fee:"3.5% + $0.30"},
    {id:"card", icon:"$", iconColor:"#1A1F71", iconBg:"#fff", name:"Credit / Debit card", desc:"Visa, Mastercard, Amex", fee:"3.9% + $0.30"},
    {id:"crypto", icon:"₿", iconColor:"#F7931A", iconBg:"#fff", name:"Crypto from external wallet", desc:"BTC · ETH · SOL · USDC · USDT", fee:"~0.5% spread"},
    {id:"wallet", icon:"M", iconColor:"#fff", iconBg:"#0052FF", name:"Connect a wallet", desc:"MetaMask · Phantom · Coinbase", fee:"Network gas only"},
  ];

  // Crypto assets (when method = crypto)
  const assets=[
    {id:"USDC", symbol:"USDC", name:"USD Coin", desc:"1:1 instant · no slippage", color:"#2775CA"},
    {id:"USDT", symbol:"USDT", name:"Tether", desc:"1:1 instant", color:"#26A17B"},
    {id:"BTC", symbol:"BTC", name:"Bitcoin", desc:"~10 min confirmation · auto-swaps to USDC", color:"#F7931A"},
    {id:"ETH", symbol:"ETH", name:"Ethereum", desc:"~30s · auto-swaps to USDC", color:"#627EEA"},
    {id:"SOL", symbol:"SOL", name:"Solana", desc:"~5s · auto-swaps to USDC", color:"#9945FF"},
    {id:"MATIC", symbol:"MATIC", name:"Polygon", desc:"~5s · auto-swaps to USDC", color:"#8247E5"},
  ];

  const selectedMethod=methods.find(m=>m.id===method);
  const selectedAsset=assets.find(a=>a.id===asset);

  const onDeposit=()=>{
    // Validate amount and confirm before calling doDeposit
    setAmtErr("");
    const n=parseFloat(amount);
    if(isNaN(n)||n<=0){setAmtErr("Enter a valid amount");return;}
    if(n>10000){setAmtErr("Max $10,000 per deposit");return;}
    if(n<1){setAmtErr("Minimum $1");return;}
    doDeposit();
  };

  return (
    <div className="au" style={{background:"var(--bg1)",border:"1px solid var(--line)",borderRadius:18,padding:18}}>
      <div className="sec-t" style={{marginBottom:6}}>Add funds</div>
      <div style={{fontSize:12,color:"var(--sub)",marginBottom:18}}>Everything settles to USDC in your Rival wallet</div>

      {/* AMOUNT */}
      <div className="fg">
        <label>Amount</label>
        <input
          className="mono"
          inputMode="decimal"
          value={amount}
          onChange={e=>setAmount(e.target.value)}
          placeholder="100"
          style={{fontSize:36,fontFamily:"'Anton',sans-serif",fontWeight:400,letterSpacing:"-0.01em",color:"var(--gold)",textAlign:"center"}}
          onKeyDown={e=>e.key==="Enter"&&onDeposit()}
        />
        {amtErr && <div className="err">{amtErr}</div>}
      </div>

      <div className="chip-row" style={{marginBottom:18}}>
        {["10","50","100","500","1000"].map(v=>(
          <button key={v} className={`chip ${amount===v?"on":""}`} onClick={()=>setAmount(v)}>${v}</button>
        ))}
      </div>

      {/* PAYMENT METHOD */}
      <div className="div-label">Pay with</div>
      <div className="pay-grid">
        {methods.map(m=>(
          <button key={m.id} className={`pay-card ${method===m.id?"on":""}`} onClick={()=>setMethod(m.id)}>
            <div className="pay-icon" style={{background:m.iconBg,color:m.iconColor}}>
              {m.id==="apple" ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill={m.iconColor}><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              ) : m.id==="card" ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={m.iconColor} strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
              ) : m.id==="crypto" ? (
                <span style={{fontSize:20,fontWeight:700,color:m.iconColor}}>₿</span>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={m.iconColor} strokeWidth="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
              )}
            </div>
            <div className="pay-info">
              <div className="pay-name">{m.name}</div>
              <div className="pay-desc">{m.desc}</div>
            </div>
            <div style={{textAlign:"right",marginRight:8}}>
              <div className="pay-fee">{m.fee}</div>
            </div>
            <div className="pay-check"/>
          </button>
        ))}
      </div>

      {/* ASSET SELECTOR — only shows when crypto method picked */}
      {method==="crypto" && (
        <>
          <div className="div-label">Which crypto?</div>
          <div className="pay-grid">
            {assets.map(a=>(
              <button key={a.id} className={`pay-card ${asset===a.id?"on":""}`} onClick={()=>setAsset(a.id)}>
                <div className="pay-icon" style={{background:a.color+"22",color:a.color,fontFamily:"'Geist Mono',monospace",fontSize:11,fontWeight:700,letterSpacing:"-0.02em"}}>
                  {a.symbol}
                </div>
                <div className="pay-info">
                  <div className="pay-name">{a.name}</div>
                  <div className="pay-desc">{a.desc}</div>
                </div>
                <div className="pay-check"/>
              </button>
            ))}
          </div>
        </>
      )}

      {/* WALLET CONNECTOR — only when wallet method picked */}
      {method==="wallet" && (
        <div style={{padding:"14px 16px",background:"var(--bg2)",borderRadius:14,marginBottom:14,fontSize:12,color:"var(--sub)",lineHeight:1.6}}>
          Production: opens WalletConnect modal · scan QR with MetaMask / Phantom / Coinbase Wallet → sign a single message to link · withdraw and deposit any time, no custody by Rival.
        </div>
      )}

      {/* SUMMARY OF WHAT'S HAPPENING */}
      {amount && parseFloat(amount)>0 && (
        <div style={{background:"var(--bg2)",borderRadius:14,padding:"14px 16px",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:13}}>
            <span style={{color:"var(--sub)"}}>You pay</span>
            <span className="mono" style={{fontWeight:600}}>${fmtUSD(parseFloat(amount))}</span>
          </div>
          {method==="crypto" && selectedAsset.id!=="USDC" && (
            <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:13}}>
              <span style={{color:"var(--sub)"}}>Sending</span>
              <span className="mono" style={{fontWeight:600}}>{selectedAsset.symbol}</span>
            </div>
          )}
          <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:13}}>
            <span style={{color:"var(--sub)"}}>Via</span>
            <span style={{fontWeight:600}}>{selectedMethod.name}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0 0",fontSize:14,borderTop:"1px solid var(--line)",marginTop:6,paddingTop:10}}>
            <span style={{color:"var(--sub)"}}>You receive</span>
            <span className="mono" style={{fontWeight:700,color:"var(--yes)"}}>${fmtUSD(parseFloat(amount))} USDC</span>
          </div>
        </div>
      )}

      <button className="btn btn-pri btn-full" onClick={onDeposit}>
        {method==="apple" ? `Pay $${amount||"0"} with Apple Pay` :
         method==="card" ? `Charge $${amount||"0"} to card` :
         method==="crypto" ? `Send ${asset} ($${amount||"0"})` :
         `Connect wallet and deposit $${amount||"0"}`}
      </button>

      <div style={{marginTop:14,fontSize:10,color:"var(--sub)",padding:"10px 12px",background:"var(--bg2)",borderRadius:10,fontFamily:"'Geist Mono',monospace",lineHeight:1.6,letterSpacing:"0.03em"}}>
        ALPHA: simulated · no real funds move<br/>
        PROD: MoonPay (fiat→crypto) · Coinbase Onramp (apple/card) · WalletConnect v2<br/>
        Chainalysis AML on all deposits · Persona KYC over $3,000
      </div>
    </div>
  );
}

/* ─── ACCOUNT PAGE ───────────────────────────────────────────────────────── */
function AccountPage({state,dispatch}){
  const {uid,users,bets}=state;
  const me=users[uid];

  // Combined tabs: wallet / settings
  const [tab,setTab]=useState("wallet"); // wallet | settings

  // Deposit state (when in wallet tab)
  const [amount,setAmount]=useState("100");
  const [amtErr,setAmtErr]=useState("");
  const [walletTab,setWalletTab]=useState("overview"); // overview | deposit | history

  // Profile state (when in settings tab)
  const [editingName,setEditingName]=useState(false);
  const [nameInput,setNameInput]=useState(me.name);
  const [nameErr,setNameErr]=useState("");
  const [confirmDelete,setConfirmDelete]=useState(null);
  const [createMode,setCreateMode]=useState(false);
  const [newName,setNewName]=useState("");
  const [newErr,setNewErr]=useState("");

  // Wallet computations
  const mine=Object.values(bets).filter(b=>b.createdBy===uid||b.acceptedBy===uid);
  const locked=mine.filter(b=>b.status==="open"||b.status==="matched").reduce((s,b)=>s+b.wager,0);
  const settled=mine.filter(b=>b.status==="settled");
  const won=settled.filter(b=>b.winner===uid);
  const lost=settled.filter(b=>b.winner!==uid);
  const pnl=won.reduce((s,b)=>s+toWin(b.wager,b.lockedOdds||b.odds),0)-lost.reduce((s,b)=>s+b.wager,0);
  const winRate=settled.length>0?(won.length/settled.length*100):0;

  const doDeposit=()=>{
    setAmtErr("");
    const n=parseFloat(amount);
    if(isNaN(n)||n<=0){setAmtErr("Enter a valid amount");return;}
    if(n>10000){setAmtErr("Max $10,000 per deposit");return;}
    if(n<1){setAmtErr("Minimum $1");return;}
    dispatch({type:"DEPOSIT",uid,amount:n});
    addToast(dispatch,`Deposited $${fmtUSD(n)}`,"success","Alpha: simulated");
    setAmount("100");
  };

  // Profile handlers
  const handleRename=()=>{
    setNameErr("");
    const name=nameInput.trim();
    if(!name){setNameErr("Name required");return;}
    if(name.length>20){setNameErr("Max 20 characters");return;}
    if(name===me.name){setEditingName(false);return;}
    if(Object.values(users).some(u=>u.id!==uid&&u.name.toLowerCase()===name.toLowerCase())){setNameErr("Name already in use");return;}
    dispatch({type:"UPDATE_USER_NAME",uid,name});
    addToast(dispatch,"Name updated","success");
    setEditingName(false);
  };

  const handleCreate=()=>{
    setNewErr("");
    const name=newName.trim();
    if(!name){setNewErr("Name required");return;}
    if(name.length>20){setNewErr("Max 20 characters");return;}
    if(Object.values(users).some(u=>u.name.toLowerCase()===name.toLowerCase())){setNewErr("Name already in use");return;}
    dispatch({type:"CREATE_USER",name,balance:1000});
    addToast(dispatch,`Account "${name}" created`,"success","$1,000 starting balance");
    setNewName("");setCreateMode(false);
  };

  const userHasMatchedBets=u_id=>Object.values(bets).some(b=>
    (b.createdBy===u_id||b.acceptedBy===u_id)&&b.status==="matched"
  );
  const userHasOpenBets=u_id=>Object.values(bets).some(b=>
    b.createdBy===u_id&&b.status==="open"
  );

  const handleDelete=(targetId)=>{
    const target=users[targetId];
    if(!target) return;
    if(Object.keys(users).length<=1){addToast(dispatch,"Can't delete the only account","error");return;}
    if(userHasMatchedBets(targetId)){addToast(dispatch,"Settle matched bets first","error","Opponents have funds locked");return;}
    const openCount=Object.values(bets).filter(b=>b.createdBy===targetId&&b.status==="open").length;
    const wasSelf=targetId===uid;
    dispatch({type:"DELETE_USER",uid:targetId});
    const sub = openCount>0
      ? `${openCount} open bet${openCount>1?"s":""} cancelled · funds refunded`
      : (wasSelf?"Switched to next account":undefined);
    addToast(dispatch,`"${target.name}" deleted`,"info",sub);
    setConfirmDelete(null);
  };

  const otherUsers=Object.values(users).filter(u=>u.id!==uid);
  const myMatchedBets=mine.filter(b=>b.status==="matched").length;
  const myActiveBets=mine.filter(b=>b.status==="open"||b.status==="matched").length;

  return (
    <div className="page">
      <div className="au">
        <div className="pt-eyebrow">Account</div>
        <h1 className="pt">{me.name}</h1>
        <p className="pt-sub">{me.balance>0?`$${fmtUSD(me.balance)} available · ${myActiveBets} active`:`${myActiveBets} active bet${myActiveBets!==1?"s":""}`}</p>
      </div>

      {/* Tab switcher: wallet vs settings */}
      <div className="tabs au1">
        <button className={`tab ${tab==="wallet"?"on":""}`} onClick={()=>setTab("wallet")}>Wallet</button>
        <button className={`tab ${tab==="settings"?"on":""}`} onClick={()=>setTab("settings")}>Settings</button>
      </div>

      {tab==="wallet" && (
        <>
          {/* Wallet hero */}
          <div className="wallet-hero au2" style={{marginBottom:14}}>
            <div className="stake-l">Available balance</div>
            <div className="wallet-num">${fmtUSD(me.balance)}</div>
            <div className="wallet-cur">USDC · 1 USDC = $1.00</div>
            <div style={{display:"flex",gap:18,marginTop:18,paddingTop:16,borderTop:"1px solid var(--line)"}}>
              <div><div className="stake-l">Locked</div><div className="mono" style={{fontSize:15,color:"var(--gold)",fontWeight:600}}>${fmtUSD(locked)}</div></div>
              <div><div className="stake-l">P&L</div><div className="mono" style={{fontSize:15,color:pnl>=0?"var(--yes)":"var(--no)",fontWeight:600}}>{pnl>=0?"+":"-"}${fmtUSD(Math.abs(pnl))}</div></div>
              <div><div className="stake-l">Win rate</div><div className="mono" style={{fontSize:15,fontWeight:600}}>{settled.length>0?`${winRate.toFixed(0)}%`:"—"}</div></div>
            </div>
          </div>

          {/* Sub-tabs: overview / deposit / history */}
          <div className="tabs au3">
            {["overview","deposit","history"].map(t=>(
              <button key={t} className={`tab ${walletTab===t?"on":""}`} onClick={()=>setWalletTab(t)}>{t}</button>
            ))}
          </div>

          {walletTab==="overview" && (
            <div className="au stats-grid">
              {[{l:"Total bets",v:mine.length},{l:"Open/Matched",v:`${mine.filter(b=>b.status==="open").length}/${mine.filter(b=>b.status==="matched").length}`},{l:"Wins",v:won.length,c:"var(--yes)"},{l:"Losses",v:lost.length,c:"var(--no)"}].map((s,i)=>(
                <div key={i} className="stat"><div className="stat-h">{s.l}</div><div className="stat-n" style={{color:s.c||"var(--text)"}}>{s.v}</div></div>
              ))}
            </div>
          )}

          {walletTab==="deposit" && (
            <DepositFlow state={state} dispatch={dispatch} amount={amount} setAmount={setAmount} amtErr={amtErr} setAmtErr={setAmtErr} doDeposit={doDeposit}/>
          )}

          {walletTab==="history" && (
            <div className="au">
              {mine.length===0 ? (
                <div className="empty"><div className="empty-icon">EMPTY</div><div className="empty-t">No transactions</div></div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {mine.sort((a,b)=>b.createdAt-a.createdAt).map(b=>{
                    const isW=b.status==="settled"&&b.winner===uid;
                    const isL=b.status==="settled"&&b.winner!==uid;
                    const pv=isW?toWin(b.wager,b.lockedOdds||b.odds):isL?-b.wager:null;
                    return (
                      <div key={b.id} style={{background:"var(--bg1)",border:"1px solid var(--line)",borderRadius:10,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13,fontWeight:600,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.title}</div>
                          <div style={{display:"flex",gap:8,alignItems:"center"}}>
                            <span className={`tag ${b.status==="open"?"t-live":b.status==="matched"?"t-matched":isW?"t-won":isL?"t-lost":"t-cat"}`}>{b.status}</span>
                            <span className="mono" style={{fontSize:11,color:"var(--sub)"}}>${fmtUSD(b.wager)}</span>
                          </div>
                        </div>
                        {pv!==null && <div className="mono" style={{fontSize:15,fontWeight:600,color:pv>=0?"var(--yes)":"var(--no)"}}>{pv>=0?"+":"-"}${fmtUSD(Math.abs(pv))}</div>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {tab==="settings" && (
        <>
          {/* PROFILE CARD */}
          <div className="account-card au2">
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
              <Avatar name={me.name} size="xl"/>
              <div style={{flex:1,minWidth:0}}>
                {!editingName ? (
                  <>
                    <div className="head" style={{fontSize:20,fontWeight:700,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{me.name}</div>
                    <div style={{fontSize:11,color:"var(--sub)",fontFamily:"'Geist Mono',monospace",letterSpacing:"0.04em"}}>Active account</div>
                  </>
                ) : (
                  <>
                    <input autoFocus value={nameInput} onChange={e=>{setNameInput(e.target.value);setNameErr("");}}
                      maxLength={20}
                      onKeyDown={e=>{if(e.key==="Enter")handleRename();if(e.key==="Escape"){setEditingName(false);setNameInput(me.name);setNameErr("");}}}
                      style={{padding:"10px 12px",fontSize:15,fontWeight:600}}/>
                    {nameErr && <div className="err" style={{marginTop:6,marginBottom:0}}>{nameErr}</div>}
                  </>
                )}
              </div>
              {!editingName ? (
                <button className="btn btn-ghost btn-sm" onClick={()=>{setNameInput(me.name);setEditingName(true);}}>Rename</button>
              ) : (
                <div style={{display:"flex",gap:6}}>
                  <button className="btn btn-ghost btn-xs" onClick={()=>{setEditingName(false);setNameInput(me.name);setNameErr("");}}>Cancel</button>
                  <button className="btn btn-pri btn-xs" onClick={handleRename}>Save</button>
                </div>
              )}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",paddingTop:16,borderTop:"1px solid var(--line)"}}>
              <div>
                <div className="stake-l">Balance</div>
                <div className="mono" style={{fontSize:17,fontWeight:600,color:"var(--gold)"}}>${fmtUSD(me.balance)}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div className="stake-l">Active bets</div>
                <div className="mono" style={{fontSize:17,fontWeight:600}}>{myActiveBets}</div>
              </div>
            </div>
          </div>

          {/* SPENDING LIMIT */}
          <SpendingLimitCard me={me} dispatch={dispatch}/>

          {/* SWITCH ACCOUNT */}
          {otherUsers.length>0 && (
            <>
              <div className="sec au3" style={{marginTop:18}}>
                <div className="sec-t">Switch accounts</div>
                <div className="sec-s">{otherUsers.length}</div>
              </div>
              <div className="account-list au3">
                {otherUsers.map(u=>{
                  const isConfirming=confirmDelete===u.id;
                  const hasMatched=userHasMatchedBets(u.id);
                  const hasOpen=userHasOpenBets(u.id);
                  if (isConfirming) {
                    const openCt=Object.values(bets).filter(b=>b.createdBy===u.id&&b.status==="open").length;
                    return (
                      <div key={u.id} className="account-item" style={{flexDirection:"column",alignItems:"stretch",gap:10}}>
                        <div>
                          <div style={{fontSize:13,fontWeight:600,marginBottom:4,color:"var(--no)"}}>Delete "{u.name}"?</div>
                          <div style={{fontSize:11,color:"var(--sub)",lineHeight:1.5}}>${fmtUSD(u.balance)} balance will be lost.{openCt>0&&` ${openCt} open bet${openCt>1?"s":""} will be cancelled and refunded.`} This can't be undone.</div>
                        </div>
                        <div style={{display:"flex",gap:8}}>
                          <button className="btn btn-ghost btn-sm btn-full" onClick={()=>setConfirmDelete(null)}>Cancel</button>
                          <button className="btn btn-danger btn-sm btn-full" onClick={()=>handleDelete(u.id)}>Delete</button>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={u.id} className="account-item">
                      <Avatar name={u.name} size="md"/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.name}</div>
                        <div className="mono" style={{fontSize:11,color:"var(--sub)"}}>${fmtUSD(u.balance)}{hasMatched&&<span style={{color:"var(--gold)",marginLeft:6}}>· matched bets</span>}{!hasMatched&&hasOpen&&<span style={{color:"var(--sub)",marginLeft:6}}>· {Object.values(bets).filter(b=>b.createdBy===u.id&&b.status==="open").length} open</span>}</div>
                      </div>
                      <button className="btn btn-ghost btn-xs" onClick={()=>dispatch({type:"SET_UID",uid:u.id})}>Switch</button>
                      <button onClick={()=>setConfirmDelete(u.id)} title={hasMatched?"Settle matched bets first":"Delete"} disabled={hasMatched}
                        style={{background:"transparent",border:"none",width:30,height:30,borderRadius:8,cursor:hasMatched?"not-allowed":"pointer",color:hasMatched?"var(--muted)":"var(--no)",display:"flex",alignItems:"center",justifyContent:"center",opacity:hasMatched?0.3:1,padding:0}}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* CREATE NEW */}
          {!createMode ? (
            <button className="btn btn-ghost btn-full au3" style={{marginBottom:18}} onClick={()=>setCreateMode(true)}>+ New account</button>
          ) : (
            <div className="account-card au3" style={{padding:16,borderColor:"var(--yes-g)"}}>
              <div className="sec-t" style={{marginBottom:10,color:"var(--yes)"}}>New account</div>
              <input autoFocus value={newName} onChange={e=>{setNewName(e.target.value);setNewErr("");}} placeholder="Account name" maxLength={20}
                onKeyDown={e=>{if(e.key==="Enter")handleCreate();if(e.key==="Escape"){setCreateMode(false);setNewName("");setNewErr("");}}}
                style={{marginBottom:8}}/>
              {newErr && <div className="err" style={{marginBottom:8}}>{newErr}</div>}
              <div style={{display:"flex",gap:6}}>
                <button className="btn btn-ghost btn-full" onClick={()=>{setCreateMode(false);setNewName("");setNewErr("");}}>Cancel</button>
                <button className="btn btn-pri btn-full" onClick={handleCreate} disabled={!newName.trim()}>Create</button>
              </div>
              <div style={{fontSize:10,color:"var(--sub)",fontFamily:"'Geist Mono',monospace",marginTop:8,lineHeight:1.5}}>$1,000 USDC starting balance · alpha simulation</div>
            </div>
          )}

          {/* DANGER ZONE */}
          <div className="sec au4" style={{marginTop:8}}>
            <div className="sec-t" style={{color:"var(--no)"}}>Danger zone</div>
          </div>
          {confirmDelete===uid ? (
            <div className="danger-zone au4">
              <div style={{fontSize:14,fontWeight:700,marginBottom:6,color:"var(--no)"}}>Delete this account?</div>
              <div style={{fontSize:12,color:"var(--sub)",marginBottom:14,lineHeight:1.5}}>"{me.name}" and ${fmtUSD(me.balance)} balance will be deleted. You'll switch to another account. This can't be undone.</div>
              <div style={{display:"flex",gap:8}}>
                <button className="btn btn-ghost btn-full" onClick={()=>setConfirmDelete(null)}>Cancel</button>
                <button className="btn btn-danger btn-full" onClick={()=>handleDelete(uid)}>Yes, delete</button>
              </div>
            </div>
          ) : (
            <button onClick={()=>setConfirmDelete(uid)} disabled={Object.keys(users).length<=1||myMatchedBets>0} className="btn btn-no btn-full au4">
              Delete this account
            </button>
          )}
          {myMatchedBets>0 && (
            <div style={{fontSize:11,color:"var(--gold)",marginTop:8,padding:"10px 12px",background:"var(--gold-d)",borderRadius:10,lineHeight:1.5,border:"1px solid var(--gold-d)"}}>
              You have {myMatchedBets} matched bet{myMatchedBets>1?"s":""}. Settle them before deleting — your opponent has funds locked.
            </div>
          )}
          {myMatchedBets===0 && myActiveBets>0 && (
            <div style={{fontSize:11,color:"var(--sub)",marginTop:8,padding:"10px 12px",background:"var(--bg2)",borderRadius:10,lineHeight:1.5}}>
              You have {myActiveBets} open bet{myActiveBets>1?"s":""}. Deleting will cancel them and refund your stakes.
            </div>
          )}
          {Object.keys(users).length<=1 && (
            <div style={{fontSize:11,color:"var(--sub)",marginTop:8,padding:"10px 12px",background:"var(--bg2)",borderRadius:10,lineHeight:1.5}}>
              You can't delete the only account. Create another first.
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─── WALLET PAGE (legacy — superseded by AccountPage) ───────────────────── */
function WalletPage({state,dispatch}){
  const {uid,users,bets}=state;
  const me=users[uid];
  const [amount,setAmount]=useState("100");
  const [amtErr,setAmtErr]=useState("");
  const [tab,setTab]=useState("overview");
  const mine=Object.values(bets).filter(b=>b.createdBy===uid||b.acceptedBy===uid);
  const locked=mine.filter(b=>b.status==="open"||b.status==="matched").reduce((s,b)=>s+b.wager,0);
  const settled=mine.filter(b=>b.status==="settled");
  const won=settled.filter(b=>b.winner===uid);
  const lost=settled.filter(b=>b.winner!==uid);
  const pnl=won.reduce((s,b)=>s+toWin(b.wager,b.lockedOdds||b.odds),0)-lost.reduce((s,b)=>s+b.wager,0);
  const winRate=settled.length>0?(won.length/settled.length*100):0;

  const doDeposit=()=>{
    setAmtErr("");
    const n=parseFloat(amount);
    if(isNaN(n)||n<=0){setAmtErr("Enter a valid amount");return;}
    if(n>10000){setAmtErr("Max $10,000 per deposit");return;}
    if(n<1){setAmtErr("Minimum $1");return;}
    dispatch({type:"DEPOSIT",uid,amount:n});
    addToast(dispatch,`Deposited $${fmtUSD(n)}`,"success","Alpha: simulated");
    setAmount("100");
  };

  return (
    <div className="page">
      <div className="au">
        <div className="pt-eyebrow">Your capital</div>
        <h1 className="pt">Wallet</h1>
      </div>

      <div className="wallet-hero au1" style={{marginBottom:18}}>
        <div style={{position:"relative",zIndex:2}}>
          <div className="stake-l">Available</div>
          <div className="wallet-num">${fmtUSD(me.balance)}</div>
          <div className="wallet-cur">USDC · 1 USDC = $1.00</div>
          <div style={{display:"flex",gap:16,marginTop:18,paddingTop:16,borderTop:"1px solid var(--line)"}}>
            <div><div className="stake-l">Locked</div><div className="mono" style={{fontSize:15,color:"var(--gold)",fontWeight:600}}>${fmtUSD(locked)}</div></div>
            <div><div className="stake-l">P&L</div><div className="mono" style={{fontSize:15,color:pnl>=0?"var(--yes)":"var(--no)",fontWeight:600}}>{pnl>=0?"+":"-"}${fmtUSD(Math.abs(pnl))}</div></div>
            <div><div className="stake-l">Win rate</div><div className="mono" style={{fontSize:15,fontWeight:600}}>{settled.length>0?`${winRate.toFixed(0)}%`:"—"}</div></div>
          </div>
        </div>
      </div>

      <div className="tabs au2">
        {["overview","deposit","history"].map(t=>(<button key={t} className={`tab ${tab===t?"on":""}`} onClick={()=>setTab(t)}>{t}</button>))}
      </div>

      {tab==="overview" && (
        <div className="au stats-grid">
          {[{l:"Total bets",v:mine.length},{l:"Open/Matched",v:`${mine.filter(b=>b.status==="open").length}/${mine.filter(b=>b.status==="matched").length}`},{l:"Wins",v:won.length,c:"var(--yes)"},{l:"Losses",v:lost.length,c:"var(--no)"}].map((s,i)=>(
            <div key={i} className="stat"><div className="stat-h">{s.l}</div><div className="stat-n" style={{color:s.c||"var(--text)"}}>{s.v}</div></div>
          ))}
        </div>
      )}

      {tab==="deposit" && (
        <DepositFlow state={state} dispatch={dispatch} amount={amount} setAmount={setAmount} amtErr={amtErr} setAmtErr={setAmtErr} doDeposit={doDeposit}/>
      )}

      {tab==="history" && (
        <div className="au">
          {mine.length===0 ? (
            <div className="empty"><div className="empty-icon">EMPTY</div><div className="empty-t">No transactions</div></div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {mine.sort((a,b)=>b.createdAt-a.createdAt).map(b=>{
                const isW=b.status==="settled"&&b.winner===uid;
                const isL=b.status==="settled"&&b.winner!==uid;
                const pv=isW?toWin(b.wager,b.lockedOdds||b.odds):isL?-b.wager:null;
                return (
                  <div key={b.id} style={{background:"var(--bg1)",border:"1px solid var(--line)",borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:600,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.title}</div>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <span className={`tag ${b.status==="open"?"t-live":b.status==="matched"?"t-matched":isW?"t-won":isL?"t-lost":"t-cat"}`}>{b.status}</span>
                        <span className="mono" style={{fontSize:11,color:"var(--sub)"}}>${fmtUSD(b.wager)}</span>
                      </div>
                    </div>
                    {pv!==null && <div className="mono" style={{fontSize:15,fontWeight:600,color:pv>=0?"var(--yes)":"var(--no)"}}>{pv>=0?"+":"-"}${fmtUSD(Math.abs(pv))}</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── SHARE SHEET ────────────────────────────────────────────────────────── */
function ShareSheet({bet,users,dispatch}){
  const [tab,setTab]=useState("wallet");
  const [nfcState,setNfcState]=useState("idle");
  const nfcRef=useRef(null);
  const joinUrl=`${BASE_URL}?bet=${bet.id}&action=accept`;
  const qrUrl=`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(joinUrl)}&bgcolor=05050A&color=EAEAF2&margin=10&format=png`;
  const nfcSupported=typeof window!=="undefined"&&"NDEFReader" in window;
  const close=()=>dispatch({type:"SET_SHARE",betId:null});
  const yp=impliedYes(bet.odds);

  const handleShare=async()=>{
    const data={title:`Rival bet: ${bet.title}`,text:`Take my bet — $${fmtUSD(bet.wager)} · ${fmtOdds(bet.odds)}`,url:joinUrl};
    if(navigator.canShare?.(data)) await navigator.share(data).catch(()=>{});
    else{navigator.clipboard?.writeText(joinUrl);addToast(dispatch,"Link copied","success");}
  };

  const handleNFC=async()=>{
    if(!nfcSupported){setTab("qr");return;}
    setNfcState("writing");
    try{
      const ndef=new window.NDEFReader();
      nfcRef.current=ndef;
      await ndef.write({records:[{recordType:"url",data:joinUrl}]});
      setNfcState("ready");
    }catch(e){setNfcState("error");setTab("qr");}
  };

  useEffect(()=>{
    if(tab==="nfc") handleNFC();
    return()=>{try{nfcRef.current?.abort?.();}catch(_){}};
  },[tab]);

  return (
    <div className="overlay" onClick={close}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="sheet-handle"/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18,padding:"0 4px",position:"relative",zIndex:2}}>
          <div>
            <div className="sheet-t">Share bet</div>
            <div style={{fontSize:12,color:"var(--sub)"}}>Friend taps it · funds lock instantly</div>
          </div>
          <button onClick={close} style={{background:"rgba(255,255,255,0.08)",backdropFilter:"blur(20px)",border:"none",width:36,height:36,borderRadius:99,cursor:"pointer",color:"var(--text)",fontSize:18,boxShadow:"0 1px 0 inset rgba(255,255,255,0.18), 0 0 0 0.5px rgba(255,255,255,0.12)"}}>×</button>
        </div>

        <div className="tabs" style={{position:"relative",zIndex:2}}>
          {[{id:"wallet",l:"Wallet"},{id:"qr",l:"QR"},{id:"nfc",l:"NFC"},{id:"link",l:"Link"}].map(t=>(
            <button key={t.id} className={`tab ${tab===t.id?"on":""}`} onClick={()=>setTab(t.id)}>{t.l}</button>
          ))}
        </div>

        <div style={{position:"relative",zIndex:2}}>
        {tab==="wallet" && (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:18}}>
            <div className="pass">
              <div className="pass-strip"/>
              <div className="pass-head">
                <div>
                  <div className="pass-logo">Rival</div>
                  <div className="pass-l" style={{marginTop:4}}>Private Bet</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div className="pass-l">Status</div>
                  <div style={{fontSize:11,color:"#C5FF3D",fontWeight:600,letterSpacing:"0.04em"}}>{bet.status==="open"?"OPEN":bet.status.toUpperCase()}</div>
                </div>
              </div>
              <div className="pass-body">
                <div className="pass-l">The bet</div>
                <div className="pass-q">{bet.title}</div>
                <div className="pass-grid">
                  <div><div className="pass-l">Wager</div><div className="pass-v">${fmtUSD(bet.wager)} USDC</div></div>
                  <div><div className="pass-l">Odds</div><div className="pass-v" style={{color:bet.odds>0?"#C5FF3D":"#FF3D7F"}}>{fmtOdds(bet.odds)}</div></div>
                  <div><div className="pass-l">Side</div><div className="pass-v" style={{fontSize:13}}>{bet.side}</div></div>
                  <div><div className="pass-l">To win</div><div className="pass-v" style={{color:"#C5FF3D"}}>+${fmtUSD(bet.wager)}</div></div>
                </div>
                <div style={{marginTop:14}}>
                  <div style={{height:5,background:"#1D1D22",borderRadius:99,overflow:"hidden",display:"flex"}}>
                    <div style={{width:`${yp}%`,background:"#C5FF3D",boxShadow:"0 0 8px #C5FF3D88"}}/>
                    <div style={{flex:1,background:"#FF3D7F"}}/>
                  </div>
                </div>
              </div>
              <div className="pass-qr"><img src={qrUrl} alt="Scan to accept"/><div className="pass-scan">Scan with Camera to accept</div></div>
            </div>
            <div style={{textAlign:"center",padding:"0 12px"}}>
              <div style={{fontSize:12,color:"var(--sub)",marginBottom:14,lineHeight:1.6}}>Adds to Apple Wallet. Shows like a boarding pass — native notifications when matched and settled.</div>
              <button className="atw" onClick={()=>alert("Alpha: in production this downloads a .pkpass file.\n\niOS Safari → Save to Wallet automatically.\nAndroid → Opens in Google Wallet.")}>
                <svg width="22" height="16" viewBox="0 0 20 14" fill="none"><rect width="20" height="14" rx="3" fill="#1C1C1E"/><path d="M10 3L12 7H8L10 3Z" fill="#C5FF3D"/><path d="M6 7H14V10C14 10.55 13.55 11 13 11H7C6.45 11 6 10.55 6 10V7Z" fill="#C5FF3D"/><rect x="4" y="5" width="2" height="5" rx="1" fill="#FFB800"/><rect x="14" y="5" width="2" height="5" rx="1" fill="#FF3D7F"/></svg>
                Add to Wallet
              </button>
            </div>
          </div>
        )}

        {tab==="qr" && (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:18}}>
            <div style={{background:"#05050A",borderRadius:18,padding:18,boxShadow:"0 0 0 0.5px rgba(255,255,255,0.1), 0 12px 32px rgba(0,0,0,0.4)"}}>
              <img src={qrUrl} alt="Scan to join" style={{width:200,height:200,borderRadius:8,display:"block"}}/>
            </div>
            <div style={{textAlign:"center"}}>
              <div className="head" style={{fontSize:18,fontWeight:700,marginBottom:4}}>Friend scans this</div>
              <div style={{fontSize:12,color:"var(--sub)",lineHeight:1.6}}>Camera · iPhone or Android<br/>Opens Rival with the accept dialog</div>
            </div>
            <div style={{display:"flex",gap:8,width:"100%"}}>
              <button className="btn btn-ghost btn-full" onClick={handleShare}>Share</button>
              <button className="btn btn-pri btn-full" onClick={()=>{navigator.clipboard?.writeText(joinUrl);addToast(dispatch,"Copied","success");}}>Copy link</button>
            </div>
          </div>
        )}

        {tab==="nfc" && (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:24,padding:"12px 0"}}>
            <div style={{position:"relative",width:200,height:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
              {nfcState==="ready"&&[80,110,140,170].map((s,i)=>(<div key={s} className="nfc-ring" style={{width:s,height:s,animationDelay:`${i*0.3}s`}}/>))}
              <div style={{width:88,height:88,borderRadius:"50%",background:"var(--gold-d)",backdropFilter:"blur(20px)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",zIndex:1,boxShadow:`0 1px 0 inset rgba(255,184,0,0.4), 0 0 0 1.5px ${nfcState==="ready"?"var(--gold)":"var(--line2)"}, 0 0 24px ${nfcState==="ready"?"rgba(255,184,0,0.4)":"transparent"}`}}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h0"/></svg>
              </div>
            </div>
            <div style={{textAlign:"center"}}>
              <div className="head" style={{fontSize:18,fontWeight:700,color:nfcState==="ready"?"var(--gold)":"var(--text)",marginBottom:6}}>
                {nfcState==="idle"&&"Activating NFC…"}
                {nfcState==="writing"&&"Writing bet URL…"}
                {nfcState==="ready"&&"Hold phones together"}
                {nfcState==="error"&&"NFC unavailable"}
              </div>
              <div style={{fontSize:12,color:"var(--sub)",lineHeight:1.6,maxWidth:280}}>{nfcState==="ready"?"Their Chrome opens the bet automatically":"Web NFC works on Android Chrome · iPhone use Wallet or QR"}</div>
            </div>
          </div>
        )}

        {tab==="link" && (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",borderRadius:12,padding:"12px 14px",fontFamily:"'Geist Mono',monospace",fontSize:11,color:"var(--sub)",wordBreak:"break-all",lineHeight:1.6,boxShadow:"0 0 0 0.5px rgba(255,255,255,0.1)"}}>{joinUrl}</div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn btn-ghost btn-full" onClick={handleShare}>Share via OS</button>
              <button className="btn btn-pri btn-full" onClick={()=>{navigator.clipboard?.writeText(joinUrl);addToast(dispatch,"Link copied","success");}}>Copy</button>
            </div>
            <div style={{padding:"12px 14px",background:"rgba(255,255,255,0.04)",borderRadius:12,fontSize:12,color:"var(--sub)",lineHeight:1.6,boxShadow:"0 0 0 0.5px rgba(255,255,255,0.08)"}}>
              <strong style={{color:"var(--body)"}}>Works everywhere:</strong> iMessage, WhatsApp, Discord, email, Slack, IG DM.
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

/* ─── SETTLE SHEET ───────────────────────────────────────────────────────────
   The new settlement UI. Replaces the old inline "who won" buttons.
   Each participant picks: a winner, forfeit, or split.
   Resolution math happens in the reducer (resolveSettlement function above). */
function SettleSheet({betId,state,dispatch}){
  const {users,bets,uid}=state;
  const bet=bets[betId];
  if(!bet) return null;
  const participants=[bet.createdBy,bet.acceptedBy].filter(Boolean);
  const isParticipant=participants.includes(uid);
  const creator=safeUser(users,bet.createdBy);
  const acceptor=bet.acceptedBy?safeUser(users,bet.acceptedBy):null;
  const myVote=(bet.votes||{})[uid];
  const close=()=>dispatch({type:"SET_SETTLE",betId:null});
  const [selected,setSelected]=useState(myVote||null);
  const totalPot=bet.wager*participants.length;
  const isDisputed=bet.status==="disputed";

  // Build vote tally for showing what others picked
  const tally=useMemo(()=>{
    const t={};
    participants.forEach(p=>{
      const v=(bet.votes||{})[p];
      if(v) t[v]=(t[v]||0)+1;
    });
    return t;
  },[bet.votes,participants]);

  const submit=()=>{
    if(!selected) return;
    dispatch({type:"VOTE_SETTLEMENT",betId,uid,vote:selected});
    addToast(dispatch,"Vote recorded","success","Waiting for the other side");
    close();
  };

  const requestReset=()=>{
    dispatch({type:"RESET_VOTES",betId,uid});
    addToast(dispatch,"Votes reset","info","Everyone can vote again");
    close();
  };

  const voteOptions=[
    ...participants.map(pid=>({
      id:pid,
      type:"winner",
      label:safeUser(users,pid).name+(pid===uid?" (you)":""),
      desc:`Winner takes the pot: $${fmtUSD(totalPot)}`,
      color:"var(--yes)"
    })),
    {
      id:"split",
      type:"split",
      label:"Split it",
      desc:"Everyone gets their stake back. No winner, no loser.",
      color:"var(--gold)"
    },
    {
      id:"forfeit",
      type:"forfeit",
      label:"Forfeit · no contest",
      desc:"Cancel the result. Everyone gets their stake back.",
      color:"var(--sub)"
    }
  ];

  return (
    <div className="overlay" onClick={close}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="sheet-handle"/>
        <div style={{padding:"0 4px"}}>
          <div className="pt-eyebrow" style={{color:isDisputed?"var(--no)":"var(--gold)"}}>
            {isDisputed?"Disputed · revote":"Settlement"}
          </div>
          <div className="sheet-t" style={{marginBottom:8}}>{isDisputed?"You disagreed":"Who won?"}</div>
          <div className="hero-q" style={{fontSize:20,marginBottom:8}}>{bet.title}</div>
          <div style={{fontSize:13,color:"var(--sub)",marginBottom:18}}>
            <strong style={{color:"var(--text)"}}>{creator.name}</strong>'s side: {bet.side}
          </div>

          {/* Pot summary */}
          <div style={{background:"var(--bg1)",border:"1px solid var(--line)",borderRadius:12,padding:"12px 14px",marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div className="stake-l">Total pot</div>
              <div className="mono" style={{fontSize:20,fontWeight:700,color:"var(--gold)"}}>${fmtUSD(totalPot)}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div className="stake-l">Voted</div>
              <div className="mono" style={{fontSize:14,fontWeight:600}}>{Object.keys(bet.votes||{}).length} / {participants.length}</div>
            </div>
          </div>

          {/* Auto-proposal banner */}
          {bet.autoProposal && (
            <div style={{background:"var(--yes-d)",border:"1px solid var(--yes-g)",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
              <div style={{fontSize:10,color:"var(--yes)",fontFamily:"'Geist Mono',monospace",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>Live result</div>
              <div style={{fontSize:13,color:"var(--text)"}}>
                Sports data says <strong>{safeUser(users,bet.autoProposal).name}</strong> won. Confirm to settle.
              </div>
            </div>
          )}

          {!isParticipant ? (
            <div className="err" style={{marginBottom:14}}>Only the bet participants can vote.</div>
          ) : (
            <>
              <div className="div-label">Your vote</div>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
                {voteOptions.map(opt=>{
                  const isSelected=selected===opt.id;
                  const voteCount=tally[opt.id]||0;
                  return (
                    <button key={opt.id} className={`pay-card ${isSelected?"on":""}`} onClick={()=>setSelected(opt.id)} style={{textAlign:"left"}}>
                      {opt.type==="winner" ? (
                        <Avatar name={safeUser(users,opt.id).name} size="md"/>
                      ) : (
                        <div className="pay-icon" style={{background:opt.color+"22",color:opt.color}}>
                          {opt.type==="split"?"½":"×"}
                        </div>
                      )}
                      <div className="pay-info">
                        <div className="pay-name">{opt.label}</div>
                        <div className="pay-desc">{opt.desc}</div>
                      </div>
                      {voteCount>0 && (
                        <div style={{fontFamily:"'Geist Mono',monospace",fontSize:10,color:"var(--sub)",marginRight:8,letterSpacing:"0.04em"}}>
                          {voteCount} vote{voteCount>1?"s":""}
                        </div>
                      )}
                      <div className="pay-check"/>
                    </button>
                  );
                })}
              </div>

              {isDisputed && (
                <button className="btn btn-ghost btn-full" onClick={requestReset} style={{marginBottom:8}}>
                  Reset all votes
                </button>
              )}

              <button
                className="btn btn-pri btn-full"
                onClick={submit}
                disabled={!selected||selected===myVote}
                style={{padding:"14px 22px",fontSize:14}}
              >
                {selected===myVote?"Vote already recorded":selected?"Submit vote":"Pick an option"}
              </button>

              <div style={{marginTop:14,fontSize:11,color:"var(--sub)",lineHeight:1.6,padding:"10px 12px",background:"var(--bg2)",borderRadius:10}}>
                {participants.length===2
                  ? "Both of you must agree. If you disagree, you can revote, agree to split or forfeit, or escalate to dispute."
                  : `Majority wins (${Math.floor(participants.length/2)+1} of ${participants.length}). No clear majority → bet is disputed.`}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


function IncomingBetModal({betId,state,dispatch}){
  const {users,bets,uid}=state;
  const bet=bets[betId];
  if(!bet) return null;
  const creator=safeUser(users,bet.createdBy);
  const me=users[uid];
  const canAccept=bet.status==="open"&&bet.createdBy!==uid&&me.balance>=bet.wager&&Date.now()<bet.expiresAt;
  const wagerErr=bet.status!=="open"?"This bet is no longer open":me.balance<bet.wager?`Insufficient balance (have $${fmtUSD(me.balance)})`:null;
  const yp=impliedYes(bet.odds);
  const accept=()=>{dispatch({type:"ACCEPT_BET",betId,uid});addToast(dispatch,"You're in","success",`$${fmtUSD(bet.wager)} locked`);};
  return (
    <div className="overlay">
      <div className="sheet">
        <div className="sheet-handle"/>
        <div style={{padding:"0 4px",position:"relative",zIndex:2}}>
          <div className="pt-eyebrow" style={{color:"var(--gold)"}}>Tap to bet · invite</div>
          <div className="sheet-t" style={{marginBottom:18}}>Challenge incoming</div>

          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
            <Avatar name={creator.name} size="lg"/>
            <div>
              <div style={{fontWeight:700,fontSize:15}}>{creator.name}</div>
              <div style={{fontSize:12,color:"var(--sub)"}}>sent you a bet</div>
            </div>
          </div>

          <div className="hero-q" style={{fontSize:24,marginBottom:8}}>{bet.title}</div>
          <div style={{fontSize:13,color:"var(--sub)",marginBottom:16}}><strong style={{color:"var(--text)"}}>{creator.name.split(" ")[0]}</strong> takes: {bet.side}</div>

          <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",borderRadius:16,padding:"14px 16px",marginBottom:16,boxShadow:"0 1px 0 inset rgba(255,255,255,0.1), 0 0 0 0.5px rgba(255,255,255,0.1)"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div>
                <div className="stake-l">If you accept</div>
                <div className="display" style={{fontSize:30,color:"var(--gold)",textShadow:"0 0 12px var(--gold-d)"}}>${fmtUSD(bet.wager)}</div>
              </div>
              <span className={`odds ${bet.odds>0?"pos":"neg"}`}>{fmtOdds(bet.odds)}</span>
            </div>
            <div className="yn"><div className="yn-y" style={{width:`${yp}%`}}/><div className="yn-n" style={{width:`${100-yp}%`}}/></div>
            <div className="yn-pcts"><span className="y">{yp.toFixed(0)}% YES</span><span className="n">{(100-yp).toFixed(0)}% NO</span></div>
            <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",justifyContent:"space-between",fontSize:13}}>
              <span style={{color:"var(--sub)"}}>You could win</span>
              <span className="mono" style={{color:"var(--yes)",fontWeight:600}}>+${fmtUSD(bet.wager)}</span>
            </div>
          </div>

          {wagerErr && <div className="err" style={{marginBottom:14}}>{wagerErr}</div>}

          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-ghost btn-full" onClick={()=>dispatch({type:"SET_INCOMING",betId:null})}>Decline</button>
            <button className="btn btn-pri btn-full" onClick={accept} disabled={!canAccept}>Accept · ${fmtUSD(bet.wager)}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── TOASTS (Liquid Glass alerts) ───────────────────────────────────────── */
function Toasts({toasts,dispatch}){
  useEffect(()=>{
    toasts.forEach(t=>{const id=setTimeout(()=>dispatch({type:"TOAST_DEL",id:t.id}),t.dur||3600);return()=>clearTimeout(id);});
  },[toasts]);
  const cols={success:"var(--yes)",error:"var(--no)",info:"var(--text)",warn:"var(--gold)"};
  return (
    <div className="toasts">
      {toasts.map(t=>(
        <div key={t.id} className="toast" onClick={()=>dispatch({type:"TOAST_DEL",id:t.id})}>
          <div className="toast-bar" style={{background:cols[t.type||"info"],color:cols[t.type||"info"]}}/>
          <div style={{flex:1,position:"relative",zIndex:2}}>
            <div className="toast-msg">{t.msg}</div>
            {t.sub && <div className="toast-sub">{t.sub}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── BOTTOM NAV ──────────────────────────────────────────────────────────── */
function BottomNav({state,dispatch}){
  const {page,bets,uid}=state;
  const openForMe=Object.values(bets).filter(b=>b.status==="open"&&b.createdBy!==uid&&Date.now()<b.expiresAt).length;
  return (
    <div className="bottomnav">
      <button className={`nav-btn ${page==="home"?"on":""}`} onClick={()=>dispatch({type:"NAV",page:"home"})}>
        {Icons.home}<span className="nav-label">Home</span>
      </button>
      <button className={`nav-btn ${page==="rooms"?"on":""}`} onClick={()=>dispatch({type:"NAV",page:"rooms"})}>
        {Icons.rooms}<span className="nav-label">Rooms</span>
      </button>
      <button className="nav-cta" onClick={()=>dispatch({type:"NAV",page:"create"})}>+</button>
      <button className={`nav-btn ${page==="bets"?"on":""}`} onClick={()=>dispatch({type:"NAV",page:"bets"})}>
        {Icons.markets}<span className="nav-label">Markets</span>
        {openForMe>0 && <span className="nav-badge">{openForMe}</span>}
      </button>
      <button className={`nav-btn ${page==="account"?"on":""}`} onClick={()=>dispatch({type:"NAV",page:"account"})}>
        {Icons.account}<span className="nav-label">Account</span>
      </button>
    </div>
  );
}

/* ─── ROOT APP ───────────────────────────────────────────────────────────── */
export default function App(){
  const [state,dispatch]=useReducer(reducer,INIT);
  const [theme,setTheme]=useState(()=>{
    try{return window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light";}
    catch(e){return "dark";}
  });
  const contentRef=useRef(null);

  // Auto-detect bets that have expired and move them to pending_settlement
  useSettlementChecker(state, dispatch);

  // Fire system notifications when document is in the background
  useBrowserNotifications(state, state.uid);

  useEffect(()=>{document.documentElement.setAttribute("data-theme",theme);},[theme]);

  useEffect(()=>{
    const mq=window.matchMedia("(prefers-color-scheme:dark)");
    const fn=e=>setTheme(e.matches?"dark":"light");
    mq.addEventListener("change",fn);
    return()=>mq.removeEventListener("change",fn);
  },[]);

  useEffect(()=>{
    const p=new URLSearchParams(window.location.search);
    const betId=p.get("bet");
    const action=p.get("action");
    if(betId && action==="accept"){
      dispatch({type:"SET_INCOMING",betId});
      window.history.replaceState({},"",window.location.pathname);
    }
  },[]);

  // Reset scroll position on page change
  useEffect(()=>{
    if(contentRef.current) contentRef.current.scrollTop=0;
  },[state.page]);

  const screen=useMemo(()=>{
    switch(state.page){
      case "home":   return <HomePage    state={state} dispatch={dispatch}/>;
      case "rooms":  return <RoomsPage   state={state} dispatch={dispatch}/>;
      case "create": return <CreatePage  state={state} dispatch={dispatch} prefillRoom={state.roomId}/>;
      case "bets":   return <MarketsPage state={state} dispatch={dispatch}/>;
      case "account":return <AccountPage state={state} dispatch={dispatch}/>;
      case "wallet": return <AccountPage state={state} dispatch={dispatch}/>;
      default:       return <HomePage    state={state} dispatch={dispatch}/>;
    }
  },[state]);

  return (
    <>
      <FontLoader/><Tokens/>
      <div className="app">
        <TopBar state={state} dispatch={dispatch} theme={theme} setTheme={setTheme}/>
        <LiveTicker bets={state.bets} users={state.users}/>
        <div className="content" ref={contentRef}>{screen}</div>
        <BottomNav state={state} dispatch={dispatch}/>
      </div>

      {state.shareBetId && state.bets[state.shareBetId] && (
        <ShareSheet bet={state.bets[state.shareBetId]} users={state.users} dispatch={dispatch}/>
      )}
      {state.settleBetId && state.bets[state.settleBetId] && (
        <SettleSheet betId={state.settleBetId} state={state} dispatch={dispatch}/>
      )}
      {state.incomingBetId && (
        <IncomingBetModal betId={state.incomingBetId} state={state} dispatch={dispatch}/>
      )}
      <Toasts toasts={state.toasts} dispatch={dispatch}/>
    </>
  );
}
