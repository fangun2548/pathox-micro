import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '2549gmail';

// State: Public Access Control & Dynamic Tokens
let publicAccessEnabled = true;
let LIVE_TUNNEL_URL = process.env.APP_URL || 'https://vocal-telephony-debian-referenced.trycloudflare.com';

function generateShareToken() {
  return 'ptx_' + crypto.randomBytes(6).toString('hex');
}

let currentShareToken = generateShareToken();
let currentQrDataUrl = '';

function getAppUrl(req) {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, '');
  }
  if (req && req.headers.host) {
    const proto = req.headers['x-forwarded-proto'] || (req.socket?.encrypted ? 'https' : 'http');
    return `${proto}://${req.headers.host}`;
  }
  return LIVE_TUNNEL_URL;
}

async function updateQrCode(req) {
  const baseUrl = getAppUrl(req);
  if (currentShareToken && publicAccessEnabled) {
    const fullUrl = `${baseUrl}/?token=${currentShareToken}`;
    try {
      currentQrDataUrl = await QRCode.toDataURL(fullUrl, {
        width: 260,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
    } catch (e) {
      console.error('Error generating QR code:', e);
    }
  } else {
    currentQrDataUrl = '';
  }
}

// Generate initial QR code
updateQrCode();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

function isLocalhost(req) {
  // If request was routed through Cloudflare Tunnel or an external proxy, treat as external visitor
  if (req.headers['cf-connecting-ip'] || req.headers['cf-ray'] || req.headers['x-forwarded-for']) {
    return false;
  }
  const host = req.headers.host || '';
  if (host.includes('trycloudflare.com')) {
    return false;
  }
  const ip = req.socket.remoteAddress;
  return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
}

function getCookie(req, name) {
  const header = req.headers.cookie;
  if (!header) return null;
  const parts = header.split(';');
  for (const part of parts) {
    const [key, val] = part.trim().split('=');
    if (key === name) return decodeURIComponent(val);
  }
  return null;
}

function isAdmin(req) {
  if (isLocalhost(req)) return true;
  const adminCookie = getCookie(req, 'pathox_admin_session');
  if (adminCookie === 'auth_granted_2549') return true;
  if (req.headers['x-admin-password'] === ADMIN_PASSWORD) return true;
  return false;
}

function isGuestAuthorized(req, urlObj) {
  if (isAdmin(req)) return true; // Host machine or authenticated Admin session is always authorized
  if (!publicAccessEnabled || !currentShareToken) return false;

  // 1. Check query parameter ?token=...
  const queryToken = urlObj.searchParams.get('token');
  if (queryToken && queryToken === currentShareToken) {
    return true;
  }

  // 2. Check Cookie
  const cookieToken = getCookie(req, 'pathox_guest_token');
  if (cookieToken && cookieToken === currentShareToken) {
    return true;
  }

  // 3. Check Referer header (for subresources like css, js, json, images)
  const referer = req.headers.referer;
  if (referer) {
    try {
      const refUrl = new URL(referer);
      if (refUrl.searchParams.get('token') === currentShareToken) {
        return true;
      }
    } catch {}
  }

  return false;
}

const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let reqPath = decodeURI(urlObj.pathname);

  // API: Admin Direct Login (from 403 page or script)
  if (reqPath === '/api/admin-login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      let pass = '';
      try {
        const json = JSON.parse(body);
        pass = json.password;
      } catch {
        const params = new URLSearchParams(body);
        pass = params.get('password') || '';
      }
      if (pass === ADMIN_PASSWORD) {
        res.writeHead(302, {
          'Set-Cookie': 'pathox_admin_session=auth_granted_2549; Path=/; Max-Age=2592000; HttpOnly; SameSite=Lax; Secure',
          'Location': '/'
        });
        res.end();
      } else {
        res.writeHead(401, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<script>alert("รหัสผ่านไม่ถูกต้อง"); window.location.href="/";</script>');
      }
    });
    return;
  }

  // API: Guest Status Heartbeat
  if (reqPath === '/api/guest-status') {
    if (!publicAccessEnabled || !isGuestAuthorized(req, urlObj)) {
      res.writeHead(403, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ active: false, reason: !publicAccessEnabled ? 'killed' : 'revoked' }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ active: true }));
    return;
  }

  // API: Verify Admin Password (2549gmail)
  if (reqPath === '/api/verify-admin') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body || '{}');
          if (data.password === ADMIN_PASSWORD) {
            await updateQrCode(req);
            const baseUrl = getAppUrl(req);
            res.writeHead(200, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Set-Cookie': 'pathox_admin_session=auth_granted_2549; Path=/; HttpOnly; SameSite=Lax; Secure'
            });
            res.end(JSON.stringify({
              success: true,
              authorized: true,
              token: currentShareToken,
              tunnelUrl: baseUrl,
              fullShareUrl: currentShareToken ? `${baseUrl}/?token=${currentShareToken}` : null,
              qrCodeDataUrl: currentQrDataUrl
            }));
          } else {
            res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify({ success: false, error: 'รหัสผ่านไม่ถูกต้อง' }));
          }
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }
  }

  // API: Access Control Endpoint (Toggle, Rotate Token, or Query status)
  if (reqPath === '/api/access-control') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body || '{}');
          // Strict check: if request is external, admin password is REQUIRED
          if (!isLocalhost(req) && data.password !== ADMIN_PASSWORD) {
            res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify({ error: 'Unauthorized: Admin password required' }));
            return;
          }

          // Case A: Rotate Token (Revoke old link & QR and generate fresh one)
          if (data.rotateToken) {
            publicAccessEnabled = true;
            currentShareToken = generateShareToken();
            await updateQrCode();
            console.log(`[TOKEN ROTATED] New Token: ${currentShareToken}`);
            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify({
              success: true,
              enabled: true,
              token: currentShareToken,
              fullShareUrl: `${LIVE_TUNNEL_URL}/?token=${currentShareToken}`,
              qrCodeDataUrl: currentQrDataUrl
            }));
            return;
          }

          // Case B: Kill Switch Toggled
          if (typeof data.enabled === 'boolean') {
            publicAccessEnabled = data.enabled;
            if (publicAccessEnabled) {
              // Always generate a fresh token when re-enabling so old channels cannot be reused!
              currentShareToken = generateShareToken();
              await updateQrCode();
              console.log(`[ACCESS ENABLED] Fresh Token: ${currentShareToken}`);
            } else {
              // Kill Switch: revoke all tokens immediately!
              currentShareToken = null;
              currentQrDataUrl = '';
              console.log(`[KILL SWITCH ACTIVATED] All guest sessions and tokens revoked!`);
            }
          }

          res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({
            success: true,
            enabled: publicAccessEnabled,
            token: currentShareToken,
            fullShareUrl: currentShareToken ? `${LIVE_TUNNEL_URL}/?token=${currentShareToken}` : null,
            qrCodeDataUrl: currentQrDataUrl
          }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    } else {
      const isHost = isLocalhost(req);
      const authorized = isHost || (dataPasswordMatch(req));
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({
        enabled: publicAccessEnabled,
        isHost: isHost,
        fullShareUrl: authorized && currentShareToken ? `${LIVE_TUNNEL_URL}/?token=${currentShareToken}` : undefined,
        qrCodeDataUrl: authorized ? currentQrDataUrl : undefined
      }));
      return;
    }
  }

  // Helper check
  function dataPasswordMatch(r) {
    return r.headers['x-admin-password'] === ADMIN_PASSWORD;
  }

  // --------------------------------------------------------------------------
  // GATEKEEPER: Check Authorization for External Visitors
  // --------------------------------------------------------------------------
  if (!isLocalhost(req)) {
    // 1. If Kill Switch is active (disabled), show Kill Switch blocked page
    if (!publicAccessEnabled) {
      res.writeHead(403, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html lang="th">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Access Suspended · Pathox-Micro</title>
          <style>
            body { background: #080c16; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; text-align: center; }
            .card { background: #0f172a; padding: 40px 30px; border-radius: 24px; border: 1px solid rgba(244, 63, 94, 0.4); max-width: 460px; box-shadow: 0 25px 60px rgba(0,0,0,0.9); }
            .icon { font-size: 3.5rem; margin-bottom: 16px; }
            h2 { margin: 0 0 12px; color: #f43f5e; font-size: 1.5rem; font-weight: 800; }
            p { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; margin: 0 0 20px; }
            .badge { display: inline-block; background: rgba(244,63,94,0.15); border: 1px solid #f43f5e; color: #fb7185; padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="icon">🔒</div>
            <h2>การเข้าถึงถูกระงับ (Access Revoked)</h2>
            <div class="badge">KILL SWITCH ACTIVE</div>
            <p style="margin-top: 16px;">เจ้าของระบบได้ทำการตัดการเชื่อมต่อเรียบร้อยแล้ว ลิงก์และ QR Code เดิมจะไม่สามารถใช้งานได้อีกต่อไป</p>
          </div>
        </body>
        </html>
      `);
      return;
    }

    // 2. If visitor is NOT authorized (missing token, invalid token, or bare link)
    if (!isGuestAuthorized(req, urlObj)) {
      res.writeHead(403, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html lang="th">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>เข้าสู่ระบบ · Pathox-Micro</title>
          <style>
            body { background: #080c16; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; text-align: center; }
            .card { background: #0f172a; padding: 42px 34px; border-radius: 24px; border: 1px solid rgba(56, 189, 248, 0.35); max-width: 440px; width: 100%; box-shadow: 0 25px 60px rgba(0,0,0,0.95); animation: fadeIn 0.3s ease; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
            .icon { font-size: 3.2rem; margin-bottom: 12px; }
            h2 { margin: 0 0 8px; color: #38bdf8; font-size: 1.4rem; font-weight: 800; }
            p { color: #94a3b8; font-size: 0.88rem; line-height: 1.5; margin: 0 0 24px; }
            .badge { display: inline-block; background: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.35); color: #38bdf8; padding: 5px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; margin-bottom: 14px; }
            .login-box { display: flex; gap: 8px; justify-content: center; align-items: center; }
            input[type="password"] { flex: 1; padding: 12px 14px; border-radius: 12px; border: 1px solid #334155; background: #080c16; color: #fff; font-size: 0.95rem; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
            input[type="password"]:focus { border-color: #38bdf8; box-shadow: 0 0 12px rgba(56, 189, 248, 0.25); }
            button[type="submit"] { padding: 12px 22px; border-radius: 12px; border: none; background: #38bdf8; color: #080c16; font-weight: 800; font-size: 0.92rem; cursor: pointer; transition: transform 0.15s, background 0.15s; white-space: nowrap; }
            button[type="submit"]:hover { background: #7dd3fc; transform: translateY(-1px); }
            .note { margin-top: 22px; font-size: 0.78rem; color: #64748b; line-height: 1.5; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="icon">🔐</div>
            <div class="badge">PATHOX-MICRO ACCESS GATE</div>
            <h2>เข้าสู่ระบบเพื่อใช้งาน</h2>
            <p>กรุณากรอกรหัสผ่านเพื่อเข้าใช้งาน หรือเปิดผ่าน QR Code ที่ได้รับอนุญาตจากเจ้าของระบบ</p>
            <form action="/api/admin-login" method="POST">
              <div class="login-box">
                <input type="password" name="password" placeholder="กรอกรหัสผ่าน (Password)..." autofocus required>
                <button type="submit">ปลดล็อก</button>
              </div>
            </form>
            <div class="note">
              🛡️ ระบบล็อกความปลอดภัยมาตรฐาน • สงวนสิทธิ์สำหรับนักศึกษาแพทย์ (NL1 / USMLE)
            </div>
          </div>
        </body>
        </html>
      `);
      return;
    }
  }

  // --------------------------------------------------------------------------
  // Static File Serving
  // --------------------------------------------------------------------------
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(__dirname, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found: ' + reqPath);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const headers = {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    };

    // If query has valid token, set session cookie so visitor stays authorized for the browsing session
    const queryToken = urlObj.searchParams.get('token');
    if (queryToken && queryToken === currentShareToken) {
      headers['Set-Cookie'] = `pathox_guest_token=${currentShareToken}; Path=/; HttpOnly; SameSite=Lax; Secure`;
    }

    res.writeHead(200, headers);
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT} (Bound to 0.0.0.0)`);
  console.log(`Initial Active Share Token: ${currentShareToken}`);
});
