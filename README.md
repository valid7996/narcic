# استخدام NG - پنل یکپارچه مدیریت اشتراک v2ray و WireGuard
# Estekhdam NG - Unified Subscription Management Panel

یک پنل تحت وب توزیع‌پذیر و مدرن برای مدیریت هوشمند کلاینت‌ها و لینک‌های ساب‌اسکریپشن همراه با سیستم انحصاری کش لایه کلودفلر (Cloudflare Workers KV) و امنیت دو لایه (ادمین ارشد + دسترسی ناظر).

A highly scalable, modern web-based dashboard designed to manage client subscriptions for V2Ray and WireGuard with a native Cloudflare Workers KV caching mechanism and two-tier authentication (Master Admin + Viewer Passcode).

---

## 🌐 زبان‌ها / Languages
- [English (#english-documentation)](#english-documentation)
- [فارسی (#راهنمای-فارسی)](#راهنمای-فارسی)

---

# English Documentation

This project enables real-time distribution and editing of subscription links with an ultra-fast Edge network caching architecture. Backed by Express on Node.js and a Tailwind-styled React single-page dashboard.

## ✨ Key Features
- **Dynamic Subscriptions:** Generates and maintains clean, client-ready payload headers (`Subscription-Userinfo`, `Profile-Title`, etc.) for applications like v2rayNG, Streisand, and WireGuard.
- **Dual-Tier Passcode Protection:** 
  - **Master Admin (`3528`):** Unlocks all management buttons, enabling adding, editing, and deleting configurations securely.
  - **Regular Visitors/Staff:** Can set and enter their own custom passcodes to view the dashboard and clone links, keeping editing features locked.
- **Cloudflare Edge Cache Integration:** Powered by Workers KV namespace bindings to prevent back-end resource fatigue and bypass IP screening seamlessly.

## 🚀 Step-by-Step GitHub Import & Cloudflare Deployment

### 1. Pushing the Source Code to GitHub
Ensure you have the [GitHub CLI](https://cli.github.com/) or Git client installed locally:
```bash
# Initialize git repository
git init

# Add remote repository URL
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Stage and commit your files
git add .
git commit -m "feat: implement dual-tier password validation and cloudflare integration"

# Push to your default branch
git branch -M main
git push -u origin main
```

### 2. Back-end Installation (Docker or Cloud Run)
The application runs as a Node.js full-stack system. To run locally:
```bash
npm install
npm run build
npm start
```
*Port `3000` is exposed as the primary incoming ingress.*

### 3. Edge Delivery via Cloudflare Workers (High Availability)
This project is pre-configured for global Cloudflare Workers delivery.
1. Create a KV namespace on Cloudflare named `استخدام NG` via **Workers & Pages > KV**.
2. Bind the variable `ESTEKHDAM_NG` to the created namespace.
3. Deploy the Edge script. You can review full instructions in [CLOUDFLARE_WORKER.md](./CLOUDFLARE_WORKER.md) and configuration parameters in [wrangler.json](./wrangler.json).

---

# راهنمای فارسی

این پروژه یک پنل قدرتمند متمرکز به زبان تایپ‌اسکریپت (React/Vite و Express) است که مدیریت و انتشار ساب‌اسکریپشن کلاینت‌های شبکه نظیر v2rayNG و وایرگارد را فرآیندی بی‌دردسر، فوق‌العاده امن و بهینه‌سازی شده در سطح لبه کلودفلر (Edge CDN) می‌کند.

## ✨ ویژگی‌های برجسته
- **سهمیه و هدرهای استاندارد:** تولید هدرهای بهینه نظیر `Subscription-Userinfo` جهت نمایش ترافیک و تاریخ مصرف در نرم‌افزارهای کلاینت.
- **احراز هویت دو لایه‌ی پویا:**
  - **مدیریت ارشد ادمین (رمز عبور `3528`):** با وارد کردن این رمز، دکمه‌های ثبت، ذخیره و حذف برای شما آشکار شده و می‌توانید تغییرات دلخواه را در بانک اطلاعاتی اعمال کنید.
  - **کاربران معمولی / ناظران:** در اولین ورود رمز عبور اختصاصی خود را بر روی دیتابیس تعیین می‌کنند تا فقط بتوانند لینک‌ها را مشاهده و کپی کنند.
- **کش پایدار کلودفلر (Workers KV):** همگام‌ساز لایه لبه کلودفلر تا کاربر شما بدون تاثیر مانیتورینگ یا قطعی سرور اصلی، ساب دسترسی را مستقیماً از کلودفلر با آپ‌تایم ۱۰۰٪ دریافت کند.

## 🚀 راهنمای گام به گام انتقال به گیت‌هاب و راه‌اندازی کلودفلر

### ۱. آپلود و انتقال سورس کد به گیت‌هاب شخصی
برای انتقال کد به مخزن خود در گیت‌هاب، دستورات زیر را در پوشه پروژه اجرا کنید:
```bash
# مقداردهی اولیه ریپازیتوری
git init

# متصل کردن به مخزن گیت‌هاب شما
git remote add origin https://github.com/نام_کاربری_شما/نام_ریپازیتوری_شما.git

# کامیونیت کردن فایل‌ها
git add .
git commit -m "feat: پیاده‌سازی قفل دوگانه ۳۵۲۸ و کش پایدار استخدام NG"

# ارسال سورس به شاخه اصلی دایرکتوری گیت‌هاب
git branch -M main
git push -u origin main
```

### ۲. راه‌اندازی سرور بک‌اند (Node.js یا Docker)
برای اجرای سریع این سورس در لایه سرور، دستورات زیر را در هاست یا داکر ایمپورت نمایید:
```bash
npm install
npm run build
npm start
```
*آدرس اصلی ترجیحی روی پورت `3000` تنظیم شده است.*

### ۳. راه‌اندازی ورکر کلودفلر (فوق‌العاده مهم برای پایداری ۱۰۰٪)
1. در داشبورد کلودفلر وارد منوی **Workers & Pages > KV** شده و یک فضای ذخیره‌سازی با نام دقیق `استخدام NG` بسازید.
2. آن را در ورکر خود با نام متغیر `ESTEKHDAM_NG` به صورت **Binding** ست کنید.
3. کد قرار گرفته در فایل [CLOUDFLARE_WORKER.md](./CLOUDFLARE_WORKER.md) را کپی کرده و در ورکر کلودفلر مستقر (Deploy) فرمایید. تنظیمات نمونه نیز در فایل [wrangler.json](./wrangler.json) موجود است.

---

### 🛡️ نکات ایمنی و مدیریتی
* همواره آدرس سرور اصلی لود شده در داخل لایه ورکر کلودفلر (`BACKEND_URL`) را مخفی نگه دارید تا از حملات تکذیب سرویس جلوگیری شود.
* رمز عبور پیش‌فرض ارشد سیستم برابر با **`3528`** است که هرگونه تعویض یا ویرایش دیتابیس بدون داشتن هدر بر پایه‌ی آن متوقف خواهد شد.
