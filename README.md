# 🌐 Narcic Gateway

<p align="center">
  <img src="https://img.shields.io/badge/Cloudflare-Workers%20%7C%20Pages-f38020?logo=cloudflare&logoColor=white" alt="Cloudflare Workers & Pages"/>
  <img src="https://img.shields.io/badge/protocols-VLESS%20%7C%20Trojan-0078D4" alt="Protocols"/>
  <img src="https://img.shields.io/badge/database-D1-blue?logo=sqlite&logoColor=white" alt="D1 Database"/>
  <img src="https://img.shields.io/badge/bot-Telegram-26A5E4?logo=telegram&logoColor=white" alt="Telegram Bot"/>
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License"/>
</p>

<p align="center">
  ⚡ A single-file, self-hosted VLESS/Trojan subscription gateway that runs entirely on <b>Cloudflare Workers</b> or <b>Cloudflare Pages</b> — no server, no VPS, no maintenance.<br/>
  🤖 Manage everything from a sleek web panel <i>or</i> a Telegram bot.
</p>

<p align="center">
  <b>🌍 Languages:</b> <a href="#-english">🇬🇧 English</a> · <a href="#-فارسی">🇮🇷 فارسی</a> · <a href="#-العربية">🇸🇦 العربية</a>
</p>

---

## ✨ Highlights

| | |
|---|---|
| 🚀 **Zero server** | Runs 100% on Cloudflare's edge — no VPS, no Docker, no uptime worries |
| 🔀 **Multi-protocol** | VLESS & Trojan, output as raw base64, Clash (YAML), Clash JSON, or sing-box JSON |
| 🖥️ **Modern panel** | Windows 11–styled admin dashboard, light & dark mode |
| 🤖 **Telegram bot** | Full remote control via webhook — add users, check status, panic-mode, and more |
| 🔗 **Linked Panels** | Connect multiple deployments together to scale past free-tier limits |
| 🔄 **Self-update** | One-click update straight from your GitHub repo (Workers deployments) |
| 🗃️ **D1-backed** | All settings & usage stats persist in Cloudflare's D1 database |

---

## 🇬🇧 English

### 🚀 [**One-click install →**](https://narcic.tomu0749.workers.dev/sync/dash)
Skip the manual setup entirely — spin up your own Narcic Gateway, fully configured, in under a minute.

### 📦 What is this?

Narcic Gateway is a single-file Cloudflare Worker (`_worker.js`) that:

- Relays VLESS/Trojan traffic over WebSocket using the Workers `cloudflare:sockets` TCP API.
- Generates subscription links in multiple formats: raw base64, Clash (YAML), Clash JSON, and sing-box JSON.
- Includes a web admin panel (light/dark mode) to manage users, ports, clean IPs, NAT64, and naming strategies.
- Includes a Telegram bot (webhook-based, not polling) for remote administration.
- Supports linking multiple deployed nodes/accounts together ("Linked Panels") to spread load across Cloudflare's free-tier request limits.
- Can self-update from a GitHub repository (Workers deployments only — see note below).
- Persists settings and usage data in a Cloudflare D1 database.

### 📋 Requirements

- A Cloudflare account (Free plan works, see request-limit notes below).
- A Cloudflare D1 database.
- (Optional) A Telegram bot token if you want bot-based management.

### 🚀 Deploying on Cloudflare Workers

1. Create a D1 database in the Cloudflare dashboard or via `wrangler d1 create narcic-gateway-db`.
2. Copy the database ID into `wrangler.toml` (included in this repo) under `database_id`.
3. Make sure the D1 binding name is exactly `NC_DB` — the code expects `env.NC_DB`.
4. Deploy:
   ```bash
   npx wrangler deploy
   ```
5. Open the Worker's `*.workers.dev` URL and log in with the default master key `admin`, then **change it immediately** from Settings.

### 📄 Deploying on Cloudflare Pages (Advanced Mode)

Cloudflare Pages automatically switches to "Advanced Mode" and hands full request handling to `_worker.js` when that exact filename sits at the root of your deployed output.

1. Push this repository to GitHub.
2. In the Cloudflare dashboard, create a Pages project connected to the repo (or use direct upload).
3. In the Pages project **Settings → Functions → D1 database bindings**, add a binding named `NC_DB` pointing to your D1 database.
4. In **Settings → Functions → Compatibility Flags**, add `allow_eval_during_startup` for both Production and Preview.
5. Deploy.

> **Important, read before relying on Pages to bypass request limits:** requests to Pages Functions (i.e. anything that runs through `_worker.js`, which is 100% of this app's traffic) count against the same Workers request quota as a normal Worker (100,000 requests/day on the Free plan). Only genuinely static asset requests are unlimited, and this project has no static assets — every request is dynamic. Deploying as Pages instead of Workers does **not** raise your request ceiling. If you need more capacity, upgrade to the Workers Paid plan ($5/month, 10M requests/month) or run multiple independent deployments and connect them with the built-in "Linked Panels" feature.

### ✅ First-run checklist

- [ ] Change the default master key (`admin`) immediately after first login.
- [ ] Set `Cloudflare Account ID`, `API Token`, and `Worker Name` in Settings if you want in-panel self-update (Workers deployments only).
- [ ] Set your Telegram bot token in Settings if you want bot-based management; the webhook is registered automatically.
- [ ] Review the GitHub repo field used for update checks and point it at your own fork if you maintain one.

### 🔄 Notes on the self-update feature

The in-panel "Force Redeploy" / auto-update feature calls the Cloudflare Workers API directly and only works for Workers deployments. On Pages, this feature is automatically disabled with an explanatory message — update Pages deployments by pushing to GitHub (with auto-deploy enabled) or running `wrangler pages deploy`.

### 🔒 Security notes

- Treat the master key and any Cloudflare API tokens as secrets. Do not commit them to the repository.
- Rotate the master key if you ever suspect it has leaked.

---

## 🇮🇷 فارسی

### 🚀 [**نصب خودکار در کمتر از یک دقیقه ⚡**](https://narcic.tomu0749.workers.dev/sync/dash)
بدون هیچ دستور و پیچیدگی‌ای، پنل کامل و آماده‌ی خودتو با یه کلیک بساز.

### 📦 این پروژه چیست؟

Narcic Gateway یک Cloudflare Worker تک‌فایلی (`_worker.js`) است که:

- ترافیک VLESS/Trojan را از طریق WebSocket با استفاده از API سوکت TCP خود Cloudflare Workers (`cloudflare:sockets`) منتقل می‌کند.
- لینک اشتراک را در چند فرمت مختلف تولید می‌کند: base64 خام، Clash (YAML)، Clash JSON و sing-box JSON.
- یک پنل مدیریت تحت‌وب (حالت روشن/تاریک) برای مدیریت کاربران، پورت‌ها، آی‌پی‌های تمیز، NAT64 و استراتژی نام‌گذاری دارد.
- یک ربات تلگرام (مبتنی بر Webhook، نه Polling) برای مدیریت از راه دور دارد.
- امکان اتصال چند نود/اکانت دیپلوی‌شده به هم را دارد ("Linked Panels") تا بار درخواست‌ها بین چند سهمیه‌ی رایگان Cloudflare پخش شود.
- می‌تواند از یک مخزن گیت‌هاب به‌صورت خودکار آپدیت شود (فقط برای دیپلوی روی Workers — توضیح در پایین).
- تنظیمات و آمار مصرف را در یک دیتابیس Cloudflare D1 ذخیره می‌کند.

### 📋 پیش‌نیازها

- یک اکانت Cloudflare (پلن رایگان هم کار می‌کند، به توضیحات محدودیت درخواست در پایین توجه کنید).
- یک دیتابیس Cloudflare D1.
- (اختیاری) توکن ربات تلگرام برای مدیریت از طریق ربات.

### 🚀 دیپلوی روی Cloudflare Workers

1. یک دیتابیس D1 از داشبورد Cloudflare یا با دستور `wrangler d1 create narcic-gateway-db` بسازید.
2. شناسه‌ی دیتابیس را در فایل `wrangler.toml` (که در همین مخزن هست) در قسمت `database_id` قرار دهید.
3. مطمئن شوید نام Binding دقیقاً `NC_DB` باشد؛ کد انتظار دارد `env.NC_DB` وجود داشته باشد.
4. دیپلوی کنید:
   ```bash
   npx wrangler deploy
   ```
5. آدرس `*.workers.dev` ورکر را باز کنید و با کلید اصلی پیش‌فرض `admin` وارد شوید، سپس **بلافاصله از بخش تنظیمات آن را تغییر دهید**.

### 📄 دیپلوی روی Cloudflare Pages (حالت پیشرفته)

وقتی فایلی دقیقاً با نام `_worker.js` در ریشه‌ی خروجی پروژه قرار بگیرد، Cloudflare Pages به‌صورت خودکار وارد «حالت پیشرفته» می‌شود و کنترل کامل درخواست‌ها را به همین فایل می‌سپارد.

1. این مخزن را در گیت‌هاب push کنید.
2. در داشبورد Cloudflare، یک پروژه‌ی Pages متصل به این مخزن بسازید (یا از Direct Upload استفاده کنید).
3. در تنظیمات پروژه‌ی Pages، مسیر **Settings → Functions → D1 database bindings** یک Binding با نام `NC_DB` به همان دیتابیس D1 اضافه کنید.
4. در **Settings → Functions → Compatibility Flags**، مقدار `allow_eval_during_startup` را برای Production و Preview هر دو اضافه کنید.
5. دیپلوی کنید.

> **نکته‌ی مهم، پیش از اتکا به Pages برای دور زدن محدودیت درخواست حتماً بخوانید:** درخواست‌ها به Pages Functions (یعنی هر چیزی که از `_worker.js` رد شود — که ۱۰۰٪ ترافیک این پروژه است) دقیقاً همان سهمیه‌ی درخواست Workers را مصرف می‌کند (۱۰۰ هزار درخواست در روز در پلن رایگان). فقط درخواست به فایل‌های استاتیک واقعی نامحدود است، و این پروژه هیچ فایل استاتیکی ندارد — همه چیز پویا است. دیپلوی روی Pages به‌جای Workers سقف درخواست را بالا **نمی‌برد**. اگر ظرفیت بیشتری لازم دارید، به پلن Workers Paid (۵ دلار در ماه، ۱۰ میلیون درخواست در ماه) ارتقا دهید یا چند دیپلوی مستقل بسازید و با قابلیت "Linked Panels" آن‌ها را به هم وصل کنید.

### ✅ چک‌لیست اولین اجرا

- [ ] بلافاصله بعد از اولین ورود، کلید اصلی پیش‌فرض (`admin`) را تغییر دهید.
- [ ] اگر می‌خواهید آپدیت خودکار از داخل پنل کار کند (فقط برای دیپلوی روی Workers)، `Cloudflare Account ID`، `API Token` و `Worker Name` را در تنظیمات وارد کنید.
- [ ] اگر مدیریت از طریق ربات تلگرام می‌خواهید، توکن ربات را در تنظیمات وارد کنید؛ Webhook به‌صورت خودکار ثبت می‌شود.
- [ ] فیلد مخزن گیت‌هاب مورد استفاده برای بررسی آپدیت را بررسی کنید و در صورت داشتن fork شخصی، آن را به مخزن خودتان اشاره دهید.

### 🔄 نکته درباره‌ی قابلیت آپدیت خودکار

قابلیت «Force Redeploy» / آپدیت خودکار داخل پنل مستقیماً API مخصوص Workers را صدا می‌زند و فقط برای دیپلوی روی Workers کار می‌کند. روی Pages، این قابلیت به‌صورت خودکار غیرفعال می‌شود و پیام توضیحی نشان داده می‌شود؛ برای آپدیت دیپلوی‌های Pages باید به گیت‌هاب push کنید (با فعال بودن Auto Deploy) یا از دستور `wrangler pages deploy` استفاده کنید.

### 🔒 نکات امنیتی

- کلید اصلی و هر توکن API مربوط به Cloudflare را مثل یک راز نگه دارید و هرگز داخل مخزن commit نکنید.
- اگر گمان می‌کنید کلید اصلی لو رفته، فوراً آن را عوض کنید.

---

## 🇸🇦 العربية

### 🚀 [**التثبيت الفوري بنقرة واحدة**](https://narcic.tomu0749.workers.dev/sync/dash)
تجاوز الإعداد اليدوي بالكامل — أنشئ نسختك الخاصة من Narcic Gateway جاهزة تمامًا في أقل من دقيقة.

### 📦 ما هو هذا المشروع؟

Narcic Gateway هو ملف Cloudflare Worker واحد (`_worker.js`) يقوم بما يلي:

- تمرير حركة بيانات VLESS/Trojan عبر WebSocket باستخدام واجهة برمجة مقابس TCP الخاصة بـ Cloudflare Workers (`cloudflare:sockets`).
- توليد روابط الاشتراك بعدة صيغ: base64 الخام، Clash (YAML)، Clash JSON، و sing-box JSON.
- لوحة تحكم ويب (وضع فاتح/داكن) لإدارة المستخدمين، المنافذ، عناوين IP النظيفة، NAT64، واستراتيجيات التسمية.
- بوت تيليجرام (يعمل عبر Webhook وليس Polling) للإدارة عن بُعد.
- إمكانية ربط عدة عُقد/حسابات منشورة معًا ("Linked Panels") لتوزيع الطلبات على عدة حصص مجانية من Cloudflare.
- إمكانية التحديث التلقائي من مستودع GitHub (فقط عند النشر على Workers — راجع الملاحظة أدناه).
- تخزين الإعدادات وبيانات الاستخدام في قاعدة بيانات Cloudflare D1.

### 📋 المتطلبات

- حساب Cloudflare (الخطة المجانية تعمل، راجع ملاحظات حدود الطلبات أدناه).
- قاعدة بيانات Cloudflare D1.
- (اختياري) رمز بوت تيليجرام إذا أردت الإدارة عبر البوت.

### 🚀 النشر على Cloudflare Workers

1. أنشئ قاعدة بيانات D1 من لوحة تحكم Cloudflare أو عبر الأمر `wrangler d1 create narcic-gateway-db`.
2. انسخ معرّف قاعدة البيانات إلى ملف `wrangler.toml` (المرفق في هذا المستودع) في حقل `database_id`.
3. تأكد أن اسم الربط (binding) هو بالضبط `NC_DB`؛ الكود يتوقع وجود `env.NC_DB`.
4. انشر المشروع:
   ```bash
   npx wrangler deploy
   ```
5. افتح رابط `*.workers.dev` الخاص بالـ Worker وسجّل الدخول بالمفتاح الرئيسي الافتراضي `admin`، ثم **غيّره فورًا** من الإعدادات.

### 📄 النشر على Cloudflare Pages (الوضع المتقدم)

عندما يوجد ملف باسم `_worker.js` بالضبط في جذر مخرجات النشر، يقوم Cloudflare Pages تلقائيًا بتفعيل "الوضع المتقدم" ويمنح هذا الملف التحكم الكامل في جميع الطلبات.

1. ارفع هذا المستودع إلى GitHub.
2. من لوحة تحكم Cloudflare، أنشئ مشروع Pages مرتبطًا بالمستودع (أو استخدم الرفع المباشر Direct Upload).
3. في إعدادات مشروع Pages، ضمن **Settings → Functions → D1 database bindings**، أضف ربطًا باسم `NC_DB` يشير إلى نفس قاعدة بيانات D1.
4. في **Settings → Functions → Compatibility Flags**، أضف `allow_eval_during_startup` لكل من Production و Preview.
5. انشر المشروع.

> **ملاحظة مهمة، يرجى قراءتها قبل الاعتماد على Pages لتجاوز حد الطلبات:** الطلبات الموجهة إلى Pages Functions (أي كل ما يمر عبر `_worker.js`، وهو ١٠٠٪ من حركة هذا المشروع) تُحتسب ضمن نفس حصة طلبات Workers (١٠٠,٠٠٠ طلب يوميًا في الخطة المجانية). فقط طلبات الملفات الثابتة الحقيقية غير محدودة، وهذا المشروع لا يحتوي على أي ملفات ثابتة — كل شيء ديناميكي. النشر على Pages بدلاً من Workers **لا يرفع** سقف الطلبات. إذا احتجت لسعة أكبر، قم بالترقية إلى خطة Workers المدفوعة (٥ دولارات شهريًا، ١٠ ملايين طلب شهريًا) أو شغّل عدة نُشرات مستقلة واربطها عبر ميزة "Linked Panels" المدمجة.

### ✅ قائمة فحص أول تشغيل

- [ ] غيّر المفتاح الرئيسي الافتراضي (`admin`) فورًا بعد أول تسجيل دخول.
- [ ] إذا أردت التحديث التلقائي داخل اللوحة (فقط عند النشر على Workers)، أدخل `Cloudflare Account ID` و `API Token` و `Worker Name` في الإعدادات.
- [ ] إذا أردت الإدارة عبر بوت تيليجرام، أدخل رمز البوت في الإعدادات؛ يتم تسجيل الـ Webhook تلقائيًا.
- [ ] راجع حقل مستودع GitHub المستخدم للتحقق من التحديثات، ووجّهه إلى نسختك الخاصة (fork) إذا كانت لديك.

### 🔄 ملاحظة حول ميزة التحديث التلقائي

ميزة "Force Redeploy" / التحديث التلقائي داخل اللوحة تستدعي واجهة برمجة Workers مباشرة وتعمل فقط عند النشر على Workers. عند النشر على Pages، يتم تعطيل هذه الميزة تلقائيًا مع رسالة توضيحية؛ لتحديث نُشرات Pages، ادفع (push) إلى GitHub (مع تفعيل النشر التلقائي) أو استخدم أمر `wrangler pages deploy`.

### 🔒 ملاحظات أمنية

- تعامل مع المفتاح الرئيسي وأي رموز API الخاصة بـ Cloudflare كأسرار، ولا تقم أبدًا برفعها (commit) إلى المستودع.
- إذا شككت في تسرّب المفتاح الرئيسي، غيّره فورًا.
