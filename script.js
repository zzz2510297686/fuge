const productData = [
  {
    id: "tri-bowl",
    category: "bowl",
    nameZh: "三角碗",
    nameEn: "Tri Bowl",
    summaryZh: "锐角外形与柔和弧面并置，适合前菜、蘸酱和单人份甜点。",
    summaryEn: "A sharp outer silhouette paired with a soft interior curve, made for starters, sauces, and desserts.",
    materialsZh: "纸浆感材质，哑光表面，适合呈现自然、克制的餐桌氛围。",
    materialsEn: "Pulp-like material with a matte surface, suited to a calm and natural table setting.",
    useZh: "前菜、蘸酱、甜点、小份分享菜。",
    useEn: "Starters, sauces, desserts, and small sharing dishes.",
    customZh: "可定制尺寸、颜色、纹理和品牌印刷。",
    customEn: "Custom size, color, texture, and branding print available."
  },
  {
    id: "organic-plate",
    category: "plate",
    nameZh: "不规则圆盘",
    nameEn: "Organic Plate",
    summaryZh: "带有自然起伏的边缘，适合强调菜品层次和桌面构图。",
    summaryEn: "An irregular rim that brings a more natural rhythm to plated food and tabletop composition.",
    materialsZh: "适合高端餐饮与品牌活动的轻量一次性解决方案。",
    materialsEn: "A lightweight disposable solution for premium dining and branded events.",
    useZh: "主菜、拼盘、甜品展示、活动餐桌。",
    useEn: "Main courses, platters, dessert presentation, and event tables.",
    customZh: "适合做品牌定制图案和系列色系。",
    customEn: "Ideal for branded patterns and series colorways."
  },
  {
    id: "hex-bowl",
    category: "bowl",
    nameZh: "六角碗",
    nameEn: "Hex Bowl",
    summaryZh: "轮廓清晰，适合构建更理性的产品语言。",
    summaryEn: "A precise outline that supports a more architectural product language.",
    materialsZh: "适合外卖品牌、酒店客房服务和活动餐饮。",
    materialsEn: "Suited for takeaway brands, hotel room service, and event catering.",
    useZh: "汤品、沙拉、谷物碗、分餐。",
    useEn: "Soup, salad, grain bowls, and portioned servings.",
    customZh: "可加入压纹与品牌字标。",
    customEn: "Embossing and brand wordmark options available."
  },
  {
    id: "square-plate",
    category: "plate",
    nameZh: "方碟",
    nameEn: "Square Plate",
    summaryZh: "几何秩序感强，适合现代餐桌和创意摆盘。",
    summaryEn: "Strong in geometric order, suitable for modern table settings and creative plating.",
    materialsZh: "纸浆质感清晰，适合低调但有记忆点的品牌系统。",
    materialsEn: "Clear pulp texture that supports a restrained yet memorable brand system.",
    useZh: "甜点、主菜、分餐、品牌礼盒配套。",
    useEn: "Desserts, mains, portioned dishes, and gift box sets.",
    customZh: "可做系列套装与不同尺寸组合。",
    customEn: "Series sets and multiple size combinations can be developed."
  },
  {
    id: "oval-plate",
    category: "plate",
    nameZh: "椭圆盘",
    nameEn: "Oval Plate",
    summaryZh: "更柔和的比例，适合长型摆盘和分享型餐食。",
    summaryEn: "A softer proportion, ideal for elongated plating and shared dishes.",
    materialsZh: "能自然衔接侘寂、极简和日常餐桌语境。",
    materialsEn: "Moves naturally between wabi-sabi, minimal, and everyday dining contexts.",
    useZh: "拼盘、鱼类料理、甜点、轻食。",
    useEn: "Platters, fish dishes, desserts, and light meals.",
    customZh: "支持表面纹理和边缘高度调整。",
    customEn: "Surface texture and rim height can be adjusted."
  },
  {
    id: "shallow-bowl",
    category: "bowl",
    nameZh: "浅口碗",
    nameEn: "Shallow Bowl",
    summaryZh: "留白更多，适合突出食材本身的色彩和构图。",
    summaryEn: "Generous negative space to let ingredients and composition lead the scene.",
    materialsZh: "适合沙拉、冷盘与轻食内容展示。",
    materialsEn: "Well suited for salads, cold dishes, and light meals.",
    useZh: "沙拉、冷盘、轻食、甜品。",
    useEn: "Salads, cold dishes, light meals, and desserts.",
    customZh: "适合做品牌主视觉中的代表款。",
    customEn: "A strong candidate for a hero product in the brand system."
  },
  {
    id: "deep-bowl",
    category: "bowl",
    nameZh: "深口碗",
    nameEn: "Deep Bowl",
    summaryZh: "容量更完整，适合汤面、热食和套餐组合。",
    summaryEn: "A fuller capacity for soups, noodles, hot meals, and set combinations.",
    materialsZh: "适合重视出餐效率和质感呈现的场景。",
    materialsEn: "Built for settings that value serving efficiency and presentation quality.",
    useZh: "汤面、热菜、套餐、外卖。",
    useEn: "Soups, hot dishes, meal sets, and takeaway.",
    customZh: "可根据餐饮项目调整容量与轮廓。",
    customEn: "Capacity and silhouette can be tuned to each hospitality project."
  },
  {
    id: "petal-bowl",
    category: "bowl",
    nameZh: "花瓣碗",
    nameEn: "Petal Bowl",
    summaryZh: "边缘带有轻微花瓣感，更适合节日、甜品和仪式感场景。",
    summaryEn: "Petal-like edges bring a softer ceremonial tone to desserts and festive settings.",
    materialsZh: "适合活动定制、礼盒和品牌合作项目。",
    materialsEn: "Suitable for event customization, gift sets, and collaboration projects.",
    useZh: "甜点、前菜、节日套餐、品牌礼盒。",
    useEn: "Desserts, starters, festive menus, and branded gift sets.",
    customZh: "可做系列化造型扩展。",
    customEn: "Can be expanded into a full family of related forms."
  }
];

const newsData = [
  {
    date: "2026 / 09",
    titleZh: "品牌系统整理",
    titleEn: "Brand system refresh",
    summaryZh: "把产品、图像和咨询路径统一到同一个更清晰的展示逻辑中。",
    summaryEn: "Bringing products, imagery, and inquiry paths into one clearer presentation system."
  },
  {
    date: "2026 / 09",
    titleZh: "材质与场景研究",
    titleEn: "Material and scene study",
    summaryZh: "围绕纸浆质感、餐桌比例和品牌场景，持续整理更适合展示的组合。",
    summaryEn: "Continuing to refine combinations that suit pulp texture, table proportions, and brand scenes."
  },
  {
    date: "2026 / 09",
    titleZh: "定制咨询方式",
    titleEn: "Inquiry workflow",
    summaryZh: "表单作为主要收集入口，后续可直接接入邮件或客户管理系统。",
    summaryEn: "The form acts as the main inquiry intake, ready to connect to email or CRM later."
  }
];

function currentLang() {
  return document.body.dataset.lang || "zh";
}

function preferReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function safeGet(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // 隐私模式下写入失败不影响页面功能
  }
}

function safeReadJson(key, fallback) {
  try {
    const raw = safeGet(key, null);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

/* ---------- 语言 ---------- */

function setLang(lang) {
  document.body.dataset.lang = lang;
  document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  safeSet("fuge-lang", lang);
  document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
    const active = btn.dataset.langToggle === lang;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
}

function initLanguage() {
  setLang(safeGet("fuge-lang", "zh"));
  document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.langToggle));
  });
}

/* ---------- 图片 ---------- */

// 统一走 assets/img 下的 WebP：800w 给列表，1400w 给高分屏与详情弹层
function productImage(item, sizes) {
  return `<img src="assets/img/${item.id}-800.webp"
    srcset="assets/img/${item.id}-800.webp 800w, assets/img/${item.id}-1400.webp 1400w"
    sizes="${sizes}"
    alt="${item.nameZh} ${item.nameEn}，纸浆一次性餐具"
    loading="lazy" decoding="async">`;
}

const GRID_SIZES = "(max-width: 760px) 46vw, (max-width: 1080px) 30vw, 280px";
const SPECIMEN_SIZES = "(max-width: 760px) 92vw, (max-width: 1080px) 60vw, 45vw";

/* ---------- 首页精选作品 ---------- */

function renderFeaturedProducts() {
  const host = document.getElementById("featured-products");
  if (!host) return;
  // 四块偏移网格标本块：顺序制造不等面积与错落起点，每块顶部细线维持秩序
  const picks = [productData[3], productData[7], productData[1], productData[5]];
  host.innerHTML = picks.map((item) => `
    <a class="specimen reveal" href="products.html#${item.id}">
      <div class="specimen-top">
        <h3 class="specimen-name">
          <span class="lang-zh">${item.nameZh}</span><span class="lang-en">${item.nameEn}</span>
        </h3>
        <span class="specimen-en">${item.nameEn}</span>
      </div>
      <div class="specimen-media">
        ${productImage(item, SPECIMEN_SIZES)}
        <div class="specimen-tag" aria-hidden="true">
          <span>
            <strong><span class="lang-zh">适用</span><span class="lang-en">Use</span></strong>
            <span class="lang-zh">${item.useZh}</span><span class="lang-en">${item.useEn}</span>
          </span>
          <span>
            <strong><span class="lang-zh">定制</span><span class="lang-en">Custom</span></strong>
            <span class="lang-zh">${item.customZh}</span><span class="lang-en">${item.customEn}</span>
          </span>
        </div>
      </div>
      <div class="specimen-caption">
        <p>
          <span class="lang-zh">${item.summaryZh}</span><span class="lang-en">${item.summaryEn}</span>
        </p>
      </div>
    </a>
  `).join("");
}

/* ---------- 产品列表与详情 ---------- */

function productMarkup(item) {
  return `
    <button class="product-card" type="button" data-product="${item.id}" data-category="${item.category}">
      <div class="card-image">
        ${productImage(item, GRID_SIZES)}
      </div>
      <div class="card-body">
        <h3>
          <span class="lang-zh">${item.nameZh}</span>
          <span class="lang-en">${item.nameEn}</span>
        </h3>
        <p>
          <span class="lang-zh">${item.summaryZh}</span>
          <span class="lang-en">${item.summaryEn}</span>
        </p>
        <div class="meta-row">
          <span class="tag">${item.category === "plate" ? "Plates / 盘类" : "Bowls / 碗类"}</span>
          <span class="tag">
            <span class="lang-zh">查看细节</span>
            <span class="lang-en">View details</span>
          </span>
        </div>
      </div>
    </button>
  `;
}

function findProduct(id) {
  return productData.find((entry) => entry.id === id);
}

function openProductDialog(item) {
  if (!item) return;
  const dialog = document.getElementById("product-dialog");
  if (!dialog || typeof dialog.showModal !== "function") return;

  const image = document.getElementById("dialog-image");
  image.srcset = `assets/img/${item.id}-800.webp 800w, assets/img/${item.id}-1400.webp 1400w`;
  image.src = `assets/img/${item.id}-1400.webp`;
  image.alt = `${item.nameZh} ${item.nameEn}，纸浆一次性餐具`;

  document.getElementById("dialog-title").innerHTML = `
    <span class="lang-zh">${item.nameZh}</span>
    <span class="lang-en">${item.nameEn}</span>
  `;
  document.getElementById("dialog-summary").innerHTML = `
    <span class="lang-zh">${item.summaryZh}</span>
    <span class="lang-en">${item.summaryEn}</span>
  `;
  document.getElementById("dialog-details").innerHTML = `
    <div class="row">
      <strong><span class="lang-zh">适用场景</span><span class="lang-en">Use</span></strong>
      <div><span class="lang-zh">${item.useZh}</span><span class="lang-en">${item.useEn}</span></div>
    </div>
    <div class="row">
      <strong><span class="lang-zh">材质与气质</span><span class="lang-en">Material & tone</span></strong>
      <div><span class="lang-zh">${item.materialsZh}</span><span class="lang-en">${item.materialsEn}</span></div>
    </div>
    <div class="row">
      <strong><span class="lang-zh">定制项</span><span class="lang-en">Customization</span></strong>
      <div><span class="lang-zh">${item.customZh}</span><span class="lang-en">${item.customEn}</span></div>
    </div>
  `;

  dialog.showModal();
  // 让详情可分享：把当前器型写进地址栏，但不触发跳转
  try {
    history.replaceState(null, "", `#${item.id}`);
  } catch {
    // file:// 等环境可能不允许
  }
}

function renderProducts() {
  const host = document.getElementById("product-grid");
  if (!host) return;

  host.innerHTML = productData.map(productMarkup).join("");

  const dialog = document.getElementById("product-dialog");
  // 事件委托：卡片重绘后仍然有效
  host.addEventListener("click", (event) => {
    const card = event.target.closest("[data-product]");
    if (card) openProductDialog(findProduct(card.dataset.product));
  });

  document.getElementById("dialog-close")?.addEventListener("click", () => dialog.close());

  dialog?.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    const inDialog =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;
    if (!inDialog) dialog.close();
  });

  dialog?.addEventListener("close", () => {
    try {
      history.replaceState(null, "", location.pathname + location.search);
    } catch {
      // ignore
    }
  });
}

// 首页作品链接指向 products.html#器型 id —— 直达该件详情
function openFromHash() {
  const id = decodeURIComponent((location.hash || "").replace(/^#/, ""));
  if (!id) return;
  const item = findProduct(id);
  if (!item) return;

  const card = document.querySelector(`[data-product="${id}"]`);
  if (card) {
    // 若当前筛选条件会隐藏它，先重置为「全部」
    if (card.hidden) document.querySelector('[data-filter="all"]')?.click();
    card.scrollIntoView({ block: "center", behavior: preferReducedMotion() ? "auto" : "smooth" });
  }
  window.setTimeout(() => openProductDialog(item), 180);
}

function initFilters() {
  const bar = document.querySelector("[data-filter-bar]");
  if (!bar) return;
  const buttons = Array.from(bar.querySelectorAll("button"));
  const cards = Array.from(document.querySelectorAll("[data-product]"));

  function applyFilter(filter) {
    buttons.forEach((btn) => {
      const active = btn.dataset.filter === filter;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    cards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
  });
  applyFilter("all");
}

/* ---------- 新闻 ---------- */

function renderNews() {
  const host = document.getElementById("news-grid");
  if (!host) return;
  host.innerHTML = newsData.map((item) => `
    <article class="news-card">
      <div class="date">${item.date}</div>
      <h3>
        <span class="lang-zh">${item.titleZh}</span>
        <span class="lang-en">${item.titleEn}</span>
      </h3>
      <p class="summary">
        <span class="lang-zh">${item.summaryZh}</span>
        <span class="lang-en">${item.summaryEn}</span>
      </p>
    </article>
  `).join("");
}

/* ---------- 表单 ---------- */

function setupContactForm() {
  const form = document.querySelector("[data-contact-form]");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  // 换部署环境时只改这两处：data-endpoint 指向自己的接口或第三方表单服务，
  // data-mailto 留空则不显示「改用邮件」的兜底入口。
  const endpoint = form.dataset.endpoint || "/api/inquiry";
  const fallbackMail = form.dataset.mailto || "";
  const submitButton = form.querySelector('button[type="submit"]');
  const submitLabel = submitButton ? submitButton.innerHTML : "";

  function showStatus(kind, zh, en, extraHtml = "") {
    status.className = `status visible ${kind}`;
    status.innerHTML = `<span class="lang-zh">${zh}${extraHtml}</span><span class="lang-en">${en}${extraHtml}</span>`;
    status.setAttribute("tabindex", "-1");
    status.focus({ preventScroll: true });
  }

  function setBusy(busy) {
    if (!submitButton) return;
    submitButton.disabled = busy;
    submitButton.innerHTML = busy
      ? '<span class="lang-zh">提交中…</span><span class="lang-en">Sending…</span>'
      : submitLabel;
  }

  // 网络彻底不通时，至少让客户的文字能一键带进邮件客户端
  function mailtoHref(payload) {
    if (!fallbackMail) return "";
    // 下拉框取可见文字，避免邮件里出现 plates 这种内部值
    const typeSelect = form.querySelector('[name="productType"]');
    const typeLabel = typeSelect?.selectedOptions?.[0]?.textContent?.trim() || payload.productType || "";
    const subject = encodeURIComponent(`官网询盘 · ${payload.name || ""}`);
    const body = encodeURIComponent(
      [
        `姓名：${payload.name || ""}`,
        `公司：${payload.company || ""}`,
        `邮箱：${payload.email || ""}`,
        `微信 / 电话：${payload.contact || ""}`,
        `产品类型：${typeLabel}`,
        `预计数量：${payload.quantity || ""}`,
        `项目时间：${payload.timeline || ""}`,
        `使用场景：${payload.useCase || ""}`,
        "",
        payload.message || "",
      ].join("\n")
    );
    return `mailto:${fallbackMail}?subject=${subject}&body=${body}`;
  }

  // 输入时清掉上一轮的错误标记
  form.addEventListener("input", (event) => {
    event.target.closest(".field")?.classList.remove("invalid");
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitButton?.disabled) return;

    let firstInvalid = null;
    form.querySelectorAll("input, textarea, select").forEach((field) => {
      if (field.type === "hidden") return;
      const ok = field.checkValidity();
      field.closest(".field")?.classList.toggle("invalid", !ok);
      if (!ok && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      showStatus(
        "is-error",
        "有几项需要补充或格式不正确，已用标记指出。",
        "A few fields need attention — they are marked below."
      );
      return;
    }

    const payload = Object.fromEntries(new FormData(form).entries());
    setBusy(true);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        form.reset();
        showStatus(
          "is-success",
          "已收到，我们会在一个工作日内回复。",
          "Received — we'll get back to you within one business day."
        );
        return;
      }

      if (response.status === 429) {
        showStatus(
          "is-error",
          "提交有点频繁，请过几分钟再试。",
          "Too many submissions — please try again in a few minutes."
        );
        return;
      }

      if (response.status === 422) {
        showStatus(
          "is-error",
          "有几项格式不正确，请检查后再提交。",
          "Some fields look incorrect — please review and resend."
        );
        return;
      }

      // 404 / 405 说明这个域名下压根没有接口（纯静态托管），不是网络问题
      if (response.status === 404 || response.status === 405) throw new Error("NO_ENDPOINT");
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      // 提交失败：本机留一份，避免客户白写
      const saved = safeReadJson("fuge-inquiries", []);
      saved.push({ ...payload, submittedAt: new Date().toISOString(), delivered: false });
      safeSet("fuge-inquiries", JSON.stringify(saved));

      const href = mailtoHref(payload);
      const link = href
        ? `<a class="inline-link" href="${href}"><span class="lang-zh">改用邮件发送</span><span class="lang-en">send it by email</span></a>`
        : "";
      const noEndpoint = error instanceof Error && error.message === "NO_ENDPOINT";

      showStatus(
        "is-error",
        noEndpoint
          ? link
            ? "在线表单暂未开通，请"
            : `在线表单暂未开通，请直接写信到 ${fallbackMail || "我们的邮箱"}。`
          : "提交没能送达。请检查网络后重试" + (href ? "，或" : "。"),
        noEndpoint
          ? link
            ? "The online form isn't connected yet — please "
            : `The online form isn't connected yet — please write to ${fallbackMail || "us"} directly.`
          : "The submission didn't go through. Please retry" + (href ? ", or " : "."),
        link
      );
    } finally {
      setBusy(false);
    }
  });
}

/* ---------- 页头 / 导航 ---------- */

function highlightActiveNav() {
  const page = document.body.dataset.page;
  if (!page) return;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    const active = link.dataset.nav === page;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function setupMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  function close() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      close();
      toggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (event.target.closest("#site-nav") || event.target.closest(".menu-toggle")) return;
    close();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) close();
  });
}

/* ---------- 进场动画 ---------- */

function initReveal() {
  const items = Array.from(document.querySelectorAll(".reveal"));
  if (!items.length) return;
  if (preferReducedMotion() || !("IntersectionObserver" in window)) return; // 内容保持默认可见

  document.documentElement.classList.add("js-reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  items.forEach((el) => observer.observe(el));

  // 兜底：1.2s 后仍未触发的元素直接显示，避免内容永久隐形
  setTimeout(() => {
    items.forEach((el) => { if (!el.classList.contains("is-in")) el.classList.add("is-in"); });
  }, 1200);
}

initLanguage();
highlightActiveNav();
setupMenu();
renderFeaturedProducts();
renderProducts();
initFilters();
openFromHash();
renderNews();
setupContactForm();
initReveal();
