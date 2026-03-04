// ============================================
// groups.js - 大学群詳細ページのロジック
// ============================================

(function() {
  'use strict';

  var contentEl = document.getElementById('detailContent');
  var groupKeys = Object.keys(GROUPS);

  // --- ユーティリティ ---
  function getHensachiClass(val) {
    if (val >= 70) return 'hensachi-70';
    if (val >= 60) return 'hensachi-60';
    if (val >= 50) return 'hensachi-50';
    return 'hensachi-40';
  }

  function getBarColor(type) {
    if (type === 'hensachi') return '#2563eb';
    if (type === 'jobScore') return '#16a34a';
    return '#d97706';
  }

  // 上位・下位の大学群を取得
  function getRelatedGroups(currentKey) {
    var idx = groupKeys.indexOf(currentKey);
    var result = { upper: null, lower: null };
    if (idx > 0) {
      result.upper = { key: groupKeys[idx - 1], data: GROUPS[groupKeys[idx - 1]] };
    }
    if (idx < groupKeys.length - 1) {
      result.lower = { key: groupKeys[idx + 1], data: GROUPS[groupKeys[idx + 1]] };
    }
    return result;
  }

  // 学歴フィルターレベルに基づく就職可能業界判定
  function getFilterStatus(groupKey) {
    var group = GROUPS[groupKey];
    var members = UNIVERSITY_DATA.filter(function(u) { return u.group === groupKey; });
    var avgHensachi = 0;
    if (members.length > 0) {
      var sum = members.reduce(function(s, u) { return s + u.hensachi; }, 0);
      avgHensachi = sum / members.length;
    }

    // FILTER_DATA から業界ごとの通過可能性を判定
    return FILTER_DATA.map(function(f) {
      var status;
      if (f.level <= 2) {
        status = 'pass';
      } else if (f.level <= 3) {
        if (avgHensachi >= 60) status = 'pass';
        else if (avgHensachi >= 52.5) status = 'maybe';
        else status = 'hard';
      } else if (f.level <= 4) {
        if (avgHensachi >= 65) status = 'pass';
        else if (avgHensachi >= 60) status = 'maybe';
        else status = 'hard';
      } else {
        if (avgHensachi >= 67.5) status = 'pass';
        else status = 'hard';
      }
      return {
        industry: f.industry,
        status: status,
        note: f.note,
        examples: f.examples
      };
    });
  }

  // --- レンダリング ---
  function renderDetail(groupKey) {
    var g = GROUPS[groupKey];
    if (!g) {
      renderNoGroup();
      return;
    }

    var members = UNIVERSITY_DATA.filter(function(u) { return u.group === groupKey; });
    members.sort(function(a, b) { return b.hensachi - a.hensachi; });

    var avgHensachi = 0;
    var avgJobScore = 0;
    var avgSalary = 0;
    if (members.length > 0) {
      var sumH = 0, sumJ = 0, sumS = 0;
      members.forEach(function(u) { sumH += u.hensachi; sumJ += u.jobScore; sumS += u.salary; });
      avgHensachi = (sumH / members.length).toFixed(1);
      avgJobScore = (sumJ / members.length).toFixed(0);
      avgSalary = Math.round(sumS / members.length);
    }

    // 偏差値の最大値（バーのスケール用）
    var maxHensachi = 75;
    var maxJobScore = 100;

    // フィルターステータス
    var filterStatuses = getFilterStatus(groupKey);

    // 関連大学群
    var related = getRelatedGroups(groupKey);

    // ページタイトル更新
    document.title = g.name + ' | 大学群詳細 | 学歴アカデミー';

    var html = '';

    // --- Hero ---
    html += '<section class="detail-hero" style="background: linear-gradient(135deg, ' + g.color + ' 0%, ' + g.color + 'cc 100%);">';
    html += '  <h1>' + g.name + '</h1>';
    html += '  <p class="detail-fullname">' + g.fullName + '</p>';
    html += '  <div class="detail-hero-stats">';
    html += '    <div class="detail-hero-stat"><div class="label">偏差値レンジ</div><div class="value">' + g.hensachiRange + '</div></div>';
    html += '    <div class="detail-hero-stat"><div class="label">所属大学数</div><div class="value">' + members.length + '校</div></div>';
    html += '    <div class="detail-hero-stat"><div class="label">平均偏差値</div><div class="value">' + avgHensachi + '</div></div>';
    html += '    <div class="detail-hero-stat"><div class="label">平均年収</div><div class="value">' + avgSalary + '万</div></div>';
    html += '  </div>';
    html += '</section>';

    // --- Container ---
    html += '<div class="detail-container">';

    // --- 概要 ---
    html += '<p style="font-size: 1rem; color: #475569; line-height: 1.8; margin-bottom: 2rem; background: #f8fafc; padding: 1.25rem; border-radius: 12px; border-left: 4px solid ' + g.color + ';">' + g.description + '</p>';

    // --- 所属大学カード ---
    html += '<h2 class="section-title">所属大学一覧</h2>';
    html += '<div class="uni-cards">';

    members.forEach(function(u) {
      var hClass = getHensachiClass(u.hensachi);
      var hBarWidth = ((u.hensachi / maxHensachi) * 100).toFixed(1);
      var jBarWidth = ((u.jobScore / maxJobScore) * 100).toFixed(1);

      html += '<div class="uni-card">';
      html += '  <div class="uni-card-header">';
      html += '    <div>';
      html += '      <div class="uni-card-name">' + u.name + '</div>';
      html += '      <div class="uni-card-pref">' + u.pref + ' / ' + u.field + '</div>';
      html += '    </div>';
      html += '    <div class="uni-card-hensachi ' + hClass + '">' + u.hensachi.toFixed(1) + '</div>';
      html += '  </div>';
      html += '  <div class="uni-card-bars">';

      // 偏差値バー
      html += '    <div class="bar-row">';
      html += '      <span class="bar-label">偏差値</span>';
      html += '      <div class="bar-track"><div class="bar-fill" style="width: ' + hBarWidth + '%; background: #2563eb;"></div></div>';
      html += '      <span class="bar-value" style="color: #2563eb;">' + u.hensachi.toFixed(1) + '</span>';
      html += '    </div>';

      // 就職力バー
      html += '    <div class="bar-row">';
      html += '      <span class="bar-label">就職力</span>';
      html += '      <div class="bar-track"><div class="bar-fill" style="width: ' + jBarWidth + '%; background: #16a34a;"></div></div>';
      html += '      <span class="bar-value" style="color: #16a34a;">' + u.jobScore + '</span>';
      html += '    </div>';

      // 平均年収バー
      var salaryBarWidth = ((u.salary / 850) * 100).toFixed(1);
      html += '    <div class="bar-row">';
      html += '      <span class="bar-label">平均年収</span>';
      html += '      <div class="bar-track"><div class="bar-fill" style="width: ' + salaryBarWidth + '%; background: #d97706;"></div></div>';
      html += '      <span class="bar-value" style="color: #d97706;">' + u.salary + '万</span>';
      html += '    </div>';

      html += '  </div>';
      html += '</div>';
    });

    html += '</div>';

    // --- 学歴フィルターセクション ---
    html += '<div class="filter-section">';
    html += '  <h2 class="section-title">学歴フィルター通過率（業界別）</h2>';
    html += '  <div class="filter-info-card">';

    var filterBg, filterColor;
    switch (g.filterLevel) {
      case '最上位': filterBg = '#fef2f2'; filterColor = '#dc2626'; break;
      case '上位':   filterBg = '#fffbeb'; filterColor = '#d97706'; break;
      case '中位':   filterBg = '#eff6ff'; filterColor = '#2563eb'; break;
      default:       filterBg = '#f0fdf4'; filterColor = '#16a34a'; break;
    }
    html += '    <span class="filter-level-badge" style="background: ' + filterBg + '; color: ' + filterColor + ';">学歴フィルターレベル: ' + g.filterLevel + '</span>';

    html += '    <div class="filter-industries">';
    filterStatuses.forEach(function(f) {
      var statusLabel, statusClass;
      if (f.status === 'pass') { statusLabel = '通過'; statusClass = 'status-pass'; }
      else if (f.status === 'maybe') { statusLabel = '可能性あり'; statusClass = 'status-maybe'; }
      else { statusLabel = '困難'; statusClass = 'status-hard'; }

      html += '      <div class="filter-industry-item">';
      html += '        <span class="filter-industry-name">' + f.industry + '</span>';
      html += '        <span class="filter-industry-status ' + statusClass + '">' + statusLabel + '</span>';
      html += '        <span class="filter-industry-note">' + f.note + '</span>';
      html += '      </div>';
    });
    html += '    </div>';
    html += '  </div>';
    html += '</div>';

    // --- 関連大学群 ---
    html += '<div class="related-section">';
    html += '  <h2 class="section-title">関連大学群</h2>';
    html += '  <div class="related-groups">';

    if (related.upper) {
      html += '    <a href="detail.html#' + related.upper.key + '" class="related-group-card">';
      html += '      <div class="related-direction">1ランク上</div>';
      html += '      <div class="related-name" style="color: ' + related.upper.data.color + ';">' + related.upper.data.name + '</div>';
      html += '      <div class="related-range">偏差値: ' + related.upper.data.hensachiRange + '</div>';
      html += '    </a>';
    }

    if (related.lower) {
      html += '    <a href="detail.html#' + related.lower.key + '" class="related-group-card">';
      html += '      <div class="related-direction">1ランク下</div>';
      html += '      <div class="related-name" style="color: ' + related.lower.data.color + ';">' + related.lower.data.name + '</div>';
      html += '      <div class="related-range">偏差値: ' + related.lower.data.hensachiRange + '</div>';
      html += '    </a>';
    }

    if (!related.upper && !related.lower) {
      html += '    <p style="color: #64748b;">関連大学群はありません。</p>';
    }

    html += '  </div>';
    html += '</div>';

    // --- 一覧に戻るリンク ---
    html += '<div style="text-align: center; margin-top: 1rem;">';
    html += '  <a href="index.html" style="display: inline-block; padding: 0.85rem 2.5rem; background: #1e293b; color: #fff; border-radius: 10px; font-weight: 700; text-decoration: none; font-size: 0.95rem; transition: background 0.2s;">大学群一覧に戻る</a>';
    html += '</div>';

    html += '</div>'; // .detail-container

    contentEl.innerHTML = html;
    window.scrollTo(0, 0);
  }

  // --- 大学群未選択時 ---
  function renderNoGroup() {
    document.title = '大学群詳細 | 学歴アカデミー';

    var html = '<div class="detail-container"><div class="no-group">';
    html += '<h2>大学群を選択してください</h2>';
    html += '<p>以下のリンクから大学群を選択すると、詳細情報が表示されます。</p>';
    html += '<div class="no-group-list">';

    groupKeys.forEach(function(key) {
      var g = GROUPS[key];
      html += '<a href="detail.html#' + key + '" class="no-group-link" style="background: ' + g.color + ';">' + g.name + '</a>';
    });

    html += '</div></div></div>';
    contentEl.innerHTML = html;
  }

  // --- ハッシュ変更検知 ---
  function onHashChange() {
    var hash = location.hash.replace('#', '');
    if (hash && GROUPS[hash]) {
      renderDetail(hash);
    } else {
      renderNoGroup();
    }
  }

  window.addEventListener('hashchange', onHashChange);

  // --- ハンバーガーメニュー ---
  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.querySelector('.site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function() {
      siteNav.classList.toggle('open');
      navToggle.classList.toggle('open');
    });
  }

  // --- 初期レンダリング ---
  onHashChange();

})();
