# 🚀 راهنمای راه‌اندازی ورکر کلودفلر با بستر KV (Cloudflare Workers KV)

برای بهبود کارایی، پایداری بالا، افزونگی کامل (High Availability) و همچنین مخفی‌سازی و دور زدن فیلترینگ، می‌توانید از سیستم **Cloudflare Workers KV** استفاده فرمایید. با این مکانیزم، لینک‌های اشتراک در ذخیره‌ساز جهانی کلودفلر (با نام انتخابی **استخدام NG**) ذخیره شده و بدون وارد کردن فشار به سرور اصلی یا نیاز به آنلاین بودن آن، با سرعت نور بارگذاری خواهند شد.

---

## 🛠️ مراحل ساخت و پیکربندی KV در کلودفلر (قدم به قدم)

1. وارد **[داشبورد کلودفلر](https://dash.cloudflare.com)** شوید.
2. از منوی سمت چپ به مسیر **Workers & Pages** بروید.
3. بر روی زیرمتن **KV** کلیک کنید.
4. دکمه‌ی سمت راست **Create Namespace** را بزنید.
5. نام Namespace را دقیقاً وارد کنید:
   * **اسم KV:** `استخدام NG`
6. دکمه‌ی **Add** یا **Save** را کلیک نموده تا فضا ساخته شود.

### 🔗 متصل کردن KV به Worker:
1. به صفحه مدیریت **Worker** ساخته شده خود در کلودفلر بروید.
2. دکمه یا تب **Settings** را از منوی بالا انتخاب کنید.
3. وارد بخش **Variables and Secrets** (یا **Bindings**) شوید.
4. به پایین اسکرول کنید تا به کادر **KV Namespace Bindings** برسید و روی **Add binding** کلیک کنید.
5. فیلدها را به شکل زیر پر کنید:
   * **Variable Name (متغیر کد):** `ESTEKHDAM_NG`
   * **KV Namespace:** فضای ساخته شده در مرحله قبل یعنی `استخدام NG` را انتخاب کنید.
6. در پایان دکمه‌ی **Deploy** یا **Save** را فشار دهید تا تغییرات متغیر در لایه ورکر اعمال گردد.

---

## 💻 کد کامل و ارتقا یافته ورکر کلودفلر (پیشرفته + کش فعال KV)

کد زیر را کپی کرده و در بخش **Edit code** ورکر کلودفلر قرار دهید:

```javascript
// آدرس پنل اشتراک شما در لایه کلودران یا هاست
const BACKEND_URL = "https://ais-pre-73qrncgcbkck2mt4o5mupl-220596817889.europe-west1.run.app";

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // بررسی درخواست‌های مربوط به ساب‌اسکریپشن v2ray یا WireGuard
  const v2rayMatch = path.match(/^\/sub\/v2ray\/([a-zA-Z0-9-_\s]+)/) || path.match(/^\/api\/sub\/v2ray\/([a-zA-Z0-9-_\s]+)/);
  const wgMatch = path.match(/^\/sub\/wg\/([a-zA-Z0-9-_\s]+)/) || path.match(/^\/api\/sub\/wg\/([a-zA-Z0-9-_\s]+)/);

  if (v2rayMatch) {
    const slug = v2rayMatch[1];
    return fetchSubContent("v2ray", slug);
  }

  if (wgMatch) {
    const slug = wgMatch[1];
    return fetchSubContent("wg", slug);
  }

  // در غیر این صورت، سایر درخواست‌ها به پنل وب فورارد یا لود می‌شوند
  return fetch(BACKEND_URL + path + url.search, {
    method: request.method,
    headers: request.headers,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined
  });
}

async function fetchSubContent(type, slug) {
  const cacheKey = `${type}_${slug}`;
  
  // ۱. بررسی وجود کانفیگ کش‌شده در Cloudflare KV (اسم فضای استخدام NG)
  if (typeof ESTEKHDAM_NG !== "undefined") {
    try {
      const cachedData = await ESTEKHDAM_NG.get(cacheKey);
      if (cachedData) {
        // بازخوانی اطلاعات پارس شده از KV
        const item = JSON.parse(cachedData);
        return deliverPayload(item.payload, type, slug, item.quota, item.title, item.interval);
      }
    } catch (err) {
      console.error("KV Read Error:", err);
    }
  }

  // ۲. در صورتی که در KV نبود یا منقضی بود، از بک‌اند پرسیده می‌شود
  const targetSubUrl = `${BACKEND_URL}/api/sub/${type}/${slug}`;
  
  try {
    const response = await fetch(targetSubUrl, {
      headers: {
        "User-Agent": "v2rayNG/1.8.5 (Android; Mobile)"
      }
    });

    if (!response.ok) {
       return new Response(`Error: Subscription not found or inactive. (Status ${response.status})`, {
         status: response.status,
         headers: { "Content-Type": "text/plain; charset=utf-8" }
       });
    }

    const payload = await response.text();
    
    // استخراج هدرهای سهمیه و دیتابیس
    const quota = response.headers.get("Subscription-Userinfo") || "upload=0; download=0; total=1208925819614; expire=0";
    const interval = response.headers.get("Profile-Update-Interval") || "1";
    const title = response.headers.get("Profile-Title") || encodeURIComponent(`sub_${slug}`);

    // ۳. ذخیره‌سازی پاسخ در Cloudflare KV جهت مراجعات بعدی با بازه انقضا (مثلاً ۱ ساعت)
    if (typeof ESTEKHDAM_NG !== "undefined") {
      try {
        const storePayload = {
          payload,
          quota,
          interval,
          title,
          cachedAt: Date.now()
        };
        // کش سازی به مدت ۲ ساعت در فضای استخدام NG
        await ESTEKHDAM_NG.put(cacheKey, JSON.stringify(storePayload), { expirationTtl: 7200 });
      } catch (kvErr) {
        console.error("KV Write Error:", kvErr);
      }
    }

    return deliverPayload(payload, type, slug, quota, title, interval);

  } catch (err) {
    return new Response(`Connection Error: ${err.message}`, {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }
}

// تابع هماهنگ‌سازی پاسخ نهایی
function deliverPayload(payload, type, slug, quota, title, interval) {
  const headers = new Headers();
  headers.set("Content-Type", "text/plain; charset=utf-8");
  headers.set("Access-Control-Allow-Origin", "*");
  
  if (quota) headers.set("Subscription-Userinfo", quota);
  if (interval) headers.set("Profile-Update-Interval", interval);
  if (title) headers.set("Profile-Title", title);

  if (type === "wg") {
    headers.set("Content-Disposition", `attachment; filename="${slug}.conf"`);
  } else {
    headers.set("Content-Disposition", `attachment; filename="subscription_${slug}.txt"`);
  }

  return new Response(payload, {
    status: 200,
    headers: headers
  });
}
```

---

## 🔗 نحوه استفاده و فراخوانی لینک‌ها با استفاده از ورکر کلودفلر

پس از راه‌اندازی موفق ورکر، می‌توانید لینک‌های اشتراک کلاینت‌های خود را بدون لو رفتن دامنه یا سرور اصلی به شکل زیر وارد نرم‌افزارهای خود (مثل v2rayNG یا WireGuard) کنید:

* **لینک ساب v2rayNG کلودفلر (کش پایدار استخدام NG):**
  `https://your-worker-sub.workers.dev/sub/v2ray/SLUG_ID`

* **لینک کانفیگ WireGuard کلودفلر (کش پایدار استخدام NG):**
  `https://your-worker-sub.workers.dev/sub/wg/SLUG_ID`

*(به جای `your-worker-sub.workers.dev` آدرس ورکر خود را قرار دهید).*
