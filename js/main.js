/* ============================================
   学歴アカデミー - メインJS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initHamburgerMenu();
  initTop10Table();
  initGroupCards();
});

/* --- ハンバーガーメニュー開閉 --- */
function initHamburgerMenu() {
  var hamburger = document.getElementById("hamburger");
  var mobileMenu = document.getElementById("mobile-menu");

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    // bodyスクロール制御
    document.body.style.overflow = mobileMenu.classList.contains("active") ? "hidden" : "";
  });

  // メニュー内リンククリックで閉じる
  var links = mobileMenu.querySelectorAll("a");
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
    });
  });
}

/* --- 偏差値バッジクラス取得 --- */
function getHensachiBadgeClass(hensachi) {
  if (hensachi >= 67.5) return "badge-70";
  if (hensachi >= 60) return "badge-60";
  if (hensachi >= 52.5) return "badge-50";
  return "badge-40";
}

/* --- ランクメダル表示 --- */
function getRankDisplay(rank) {
  var medals = { 1: "\uD83E\uDD47", 2: "\uD83E\uDD48", 3: "\uD83E\uDD49" };
  return medals[rank] || rank;
}

/* --- TOP10テーブル生成 --- */
function initTop10Table() {
  var tableBody = document.getElementById("top10-body");
  if (!tableBody || typeof UNIVERSITY_DATA === "undefined") return;

  // 偏差値+就職力スコアの総合で降順ソート
  var sorted = UNIVERSITY_DATA.slice()
    .sort(function (a, b) {
      var scoreA = a.hensachi + a.jobScore;
      var scoreB = b.hensachi + b.jobScore;
      return scoreB - scoreA;
    })
    .slice(0, 10);

  var html = "";
  sorted.forEach(function (uni, i) {
    var rank = i + 1;
    var badgeClass = getHensachiBadgeClass(uni.hensachi);
    var groupName = "";
    if (typeof GROUPS !== "undefined" && GROUPS[uni.group]) {
      groupName = GROUPS[uni.group].name;
    }

    html +=
      '<tr>' +
        '<td class="rank rank-' + rank + '" data-label="順位">' + getRankDisplay(rank) + '</td>' +
        '<td data-label="大学名"><strong>' + escapeHtml(uni.name) + '</strong></td>' +
        '<td data-label="大学群"><span class="text-sm text-light">' + escapeHtml(groupName) + '</span></td>' +
        '<td data-label="偏差値"><span class="badge ' + badgeClass + '">' + uni.hensachi.toFixed(1) + '</span></td>' +
        '<td data-label="就職力">' +
          '<div class="bar-chart-track" style="height:20px;">' +
            '<div class="bar-chart-fill" style="width:' + uni.jobScore + '%;"><span class="bar-chart-value">' + uni.jobScore + '</span></div>' +
          '</div>' +
        '</td>' +
      '</tr>';
  });

  tableBody.innerHTML = html;
}

/* --- 大学群カード生成 --- */
function initGroupCards() {
  var container = document.getElementById("group-cards");
  if (!container || typeof GROUPS === "undefined") return;

  var html = "";
  var keys = Object.keys(GROUPS);
  keys.forEach(function (key) {
    var group = GROUPS[key];

    // 該当大学数を取得
    var uniCount = 0;
    if (typeof UNIVERSITY_DATA !== "undefined") {
      uniCount = UNIVERSITY_DATA.filter(function (u) {
        return u.group === key;
      }).length;
    }

    html +=
      '<div class="card group-card" style="border-left-color:' + group.color + ';" data-group="' + key + '">' +
        '<div class="card-subtitle">' + escapeHtml(group.hensachiRange) + '</div>' +
        '<div class="card-title">' + escapeHtml(group.name) + '</div>' +
        '<p class="card-text">' + escapeHtml(group.description) + '</p>' +
        '<span class="text-sm text-light">' + uniCount + '校収録</span>' +
        '<a href="#" class="card-link">詳しく見る &rarr;</a>' +
      '</div>';
  });

  container.innerHTML = html;
}

/* --- ユーティリティ: HTMLエスケープ --- */
function escapeHtml(str) {
  if (!str) return "";
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* --- ユーティリティ: スムーズスクロール --- */
function smoothScrollTo(targetId) {
  var el = document.getElementById(targetId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* --- ユーティリティ: 数値フォーマット --- */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
