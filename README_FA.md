# 🌸 نرگس (Narcic) — راهنمای فارسی

## درباره پروژه

نرگس یک پنل مدیریت پروکسی بر بستر Cloudflare Workers است که بدون نیاز به سرور شخصی کار می‌کند.

## نصب گام‌به‌گام

### گام اول: D1 Database
- وارد داشبورد Cloudflare شوید
- مسیر: Storage & databases → D1 SQLite Database
- دیتابیس جدید با نام `narcic-db` بسازید

### گام دوم: Worker
- مسیر: Compute → Workers & Pages → Create application
- Hello World را انتخاب کنید و Deploy کنید
- کد `_worker.js` را در ادیتور جایگزین و دوباره Deploy کنید

### گام سوم: اتصال دیتابیس
- Settings → Bindings → Add binding
- Variable Name: `NARCIC_DB`
- D1 database: `narcic-db`

### گام چهارم: ورود
- آدرس: `https://worker-name.workers.dev/sync/dash`
- رمز اولیه: `admin`

## تغییر رمز عبور
پس از ورود، از تب تنظیمات رمز عبور را تغییر دهید.
