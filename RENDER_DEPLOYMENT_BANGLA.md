# 🚀 Render.com এ Socket.io Server Deploy করার Guide

## 📋 বুঝে নিন Architecture

**গুরুত্বপূর্ণ:** আপনি **দুইটা আলাদা জিনিস** deploy করবেন:

```
┌─────────────────────────────┐         ┌───────────────────────────┐
│   VERCEL                    │         │   RENDER                  │
│                             │         │                           │
│   ✅ Next.js Frontend        │ ◄─────► │   ✅ Socket.io Server      │
│   ✅ Pages/Components        │  WSS    │   ❌ Next.js নেই           │
│   ✅ UI Logic                │         │   (শুধু WebSocket)         │
│                             │         │                           │
└─────────────────────────────┘         └───────────────────────────┘
```

**মনে রাখুন:**

- Vercel = আপনার website/UI
- Render = শুধু real-time server (WebSocket)
- দুইটা একসাথে কাজ করবে

---

## 🔧 Part 1: Render এ Deploy করুন

### Step 1: Render Account তৈরি করুন

1. যান: https://render.com
2. **Sign Up** করুন (GitHub দিয়ে)
3. Dashboard এ যান

### Step 2: New Web Service তৈরি করুন

1. **Dashboard → New → Web Service**
2. **Connect your GitHub repository** select করুন
3. আপনার `codecollab` repo select করুন

### Step 3: Configuration করুন

**Name:** `codecollab-socket-server` (যেকোনো নাম)

**Environment:** `Node`

**Build Command:**

```bash
npm install
```

**Start Command:**

```bash
npm run socket-server
```

**Instance Type:** `Free`

### Step 4: Environment Variables Add করুন

**Add Environment Variable** button এ click করুন:

```
Key: ALLOWED_ORIGIN
Value: https://codecollab-soyeb.vercel.app
```

(আপনার actual Vercel URL দিন)

### Step 5: Deploy করুন!

- **Create Web Service** button এ click করুন
- Deploy শুরু হবে (2-3 মিনিট লাগবে)
- Deploy complete হলে আপনি একটা URL পাবেন:
  ```
  https://codecollab-socket-server.onrender.com
  ```

---

## 🔧 Part 2: Vercel এ Configure করুন

### Step 1: Vercel Dashboard এ যান

1. যান: https://vercel.com/dashboard
2. আপনার `codecollab` project select করুন
3. **Settings → Environment Variables**

### Step 2: Environment Variable Add করুন

```
Name: NEXT_PUBLIC_SOCKET_URL
Value: https://codecollab-socket-server.onrender.com
```

**Apply to:** Production, Preview, Development (সব select করুন)

### Step 3: Redeploy করুন

**Deployments** tab এ যান এবং latest deployment এ **Redeploy** করুন।

---

## ✅ Test করুন

### 1. Socket.io Server Check করুন

Browser এ যান:

```
https://codecollab-socket-server.onrender.com
```

দেখবেন: `"Socket.io server is running"`

### 2. Vercel Site Test করুন

1. আপনার Vercel site এ যান
2. একটা room create করুন
3. Browser DevTools → Network tab দেখুন
4. দেখবেন WebSocket connection হচ্ছে Render URL এ

---

## 🤔 Cron Job কোথায় Set করবেন?

**Render Free Tier Sleep করে** যদি 15 minutes এ কোন request না আসে। এটা prevent করার জন্য:

### Option 1: Render Cron Jobs (Free)

Render dashboard এ:

1. **New → Cron Job**
2. **Schedule:** `*/10 * * * *` (every 10 minutes)
3. **Command:**
   ```bash
   curl https://codecollab-socket-server.onrender.com
   ```

### Option 2: External Cron Service

**UptimeRobot** (Free): https://uptimerobot.com

1. Sign up করুন
2. **Add Monitor**
3. **URL:** `https://codecollab-socket-server.onrender.com`
4. **Interval:** 5 minutes

### Option 3: Vercel Cron (আপনার Next.js app থেকে)

`src/app/api/cron/route.ts` তৈরি করুন:

```typescript
export async function GET() {
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (socketUrl) {
    await fetch(socketUrl);
  }
  return Response.json({ ok: true });
}
```

তারপর `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "*/10 * * * *"
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Error: "404 Not Found" `/socket.io`

✅ Check করুন:

- Render এ deploy successful হয়েছে?
- `NEXT_PUBLIC_SOCKET_URL` Vercel এ set করেছেন?
- Vercel redeploy করেছেন?

### Error: "CORS Error"

✅ Check করুন:

- Render এ `ALLOWED_ORIGIN` environment variable set করেছেন?
- Vercel URL সঠিক দিয়েছেন? (https সহ)

### Server Sleep হয়ে যাচ্ছে

✅ Solution:

- উপরের Cron Job setup করুন
- অথবা Render Paid plan নিন ($7/month)

---

## 💰 Cost Breakdown

### Free Setup:

- **Vercel:** Free (Hobby plan)
- **Render:** Free (750 hours/month)
- **UptimeRobot:** Free (cron এর জন্য)
- **Total:** $0/month 🎉

### Issues with Free:

- প্রথম request এ 30 sec wake up time
- 750 hours/month limit (প্রায় 25 দিন)

### Paid Setup (যদি চান):

- **Render Starter:** $7/month (always on, no sleep)
- **Total:** $7/month

---

## 📝 Summary

1. ✅ **Render এ:** শুধু Socket.io server deploy করেছেন
2. ✅ **Vercel এ:** Next.js frontend আছে + environment variable set করেছেন
3. ✅ **Cron Job:** Server awake রাখার জন্য ping করছে
4. ✅ **Test:** সব কিছু কাজ করছে!

**মনে রাখুন:** দুইটা আলাদা deployment, একসাথে কাজ করছে! 🚀
