<div align="center">

# 🌸 Narcic (نرگس)

**پنل پروکسی معکوس بدون سرور بر بستر Cloudflare**

[![Version](https://img.shields.io/badge/version-1.0.0-7c6fff?style=flat-square)]([https://github.com/narcic/narcic](https://github.com/valid7996/narcic/releases/tag/Narcic))
[![License](https://img.shields.io/badge/license-MIT-00e5b0?style=flat-square)](LICENSE)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=flat-square&logo=cloudflare)](https://workers.cloudflare.com)

</div>

---

## معرفی

**Narcic (نرگس)** یک راهکار توزیع ترافیک و پروکسی معکوس بدون سرور (Serverless) در بستر Cloudflare است. بدون نیاز به VPS شخصی، با استفاده از معماری لبه Cloudflare و پایگاه داده SQLite D1، ترافیک کاربران به صورت ایمن هدایت می‌شود.

## ✨ ویژگی‌ها

- 🔐 پشتیبانی از **VLESS، Trojan، Shadowsocks**
- 🌍 سابسکریپشن هوشمند با تشخیص خودکار کلاینت (Clash، Sing-Box، Shadowrocket و ...)
- 👥 مدیریت کاربران با محدودیت حجم و انقضای خودکار
- 🤖 یکپارچه‌سازی با ربات تلگرام
- 🔄 پشتیبانی از کلاستر چندتایی (Slave Nodes)
- 💾 ذخیره‌سازی با Cloudflare D1 (SQLite)
- 🛡️ مبهم‌سازی (Obfuscation) داخلی کدها

## 🚀 نصب سریع

### پیش‌نیازها
- حساب Cloudflare (رایگان)
- دامنه متصل به Cloudflare (اختیاری)

### مرحله ۱ — ساخت D1 Database
1. وارد [dash.cloudflare.com](https://dash.cloudflare.com) شوید
2. از منو: **Storage & databases → D1 SQLite Database**
3. روی **Create Database** کلیک کنید
4. نام: `narcic-db` را وارد کنید

### مرحله ۲ — ساخت Worker
1. از منو: **Compute → Workers & Pages → Create application**
2. گزینه **Start with Hello World** را انتخاب کنید
3. یک نام برای Worker انتخاب کرده و **Deploy** کنید
4. وارد ادیتور آنلاین شوید و محتوای `_worker.js` را جایگزین کنید
5. دوباره **Deploy** کنید

### مرحله ۳ — اتصال D1 به Worker
1. در داشبورد Worker: **Settings → Bindings → Add binding**
2. نوع: **D1 database**
3. Variable Name: `NARCIC_DB`
4. Database: `narcic-db`
5. **Save** کنید

### مرحله ۴ — ورود اولیه
آدرس پنل:
```
https://your-worker.workers.dev/sync/dash
```
رمز عبور اولیه: `admin`

> ⚠️ **مهم:** بلافاصله پس از ورود، رمز عبور را از بخش تنظیمات تغییر دهید.

## 📁 ساختار فایل‌ها

```
narcic/
├── _worker.js      # کد اصلی Cloudflare Worker
├── index.html      # مستندات و ابزار obfuscator
├── wrangler.toml   # تنظیمات Wrangler CLI
├── singbox.json    # قالب Sing-Box
├── vtwo.json       # قالب V2Ray
├── setup.sh        # اسکریپت نصب خودکار
└── version         # نسخه جاری
```

## 🔧 استفاده با Wrangler CLI

```bash
# نصب Wrangler
npm install -g wrangler

# لاگین
wrangler login

# ساخت D1
wrangler d1 create narcic-db

# آدرس ID را در wrangler.toml جایگزین کنید
# سپس دپلوی:
wrangler deploy
```

## 📡 پروتوکل‌های پشتیبانی‌شده

| پروتوکل | Transport | TLS |
|---------|-----------|-----|
| VLESS | WS / gRPC / TCP | ✅ |
| Trojan | WS / gRPC / TCP | ✅ |
| Shadowsocks | - | اختیاری |

## 📖 مستندات کامل

فایل `index.html` را در مرورگر باز کنید یا به صفحه مستندات پروژه مراجعه نمایید.

## 📄 لایسنس

MIT License — آزاد برای استفاده شخصی و تجاری

---

<div align="center">
ساخته شده با ❤️ برای کاربران فارسی‌زبان
</div>
