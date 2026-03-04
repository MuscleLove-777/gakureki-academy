// ============================================
// ranking.js - ランキングページのロジック
// ============================================

(function() {
  'use strict';

  // --- 設定 ---
  const ITEMS_PER_PAGE = 30;
  let currentPage = 1;
  let currentType = 'all';
  let currentRegion = '';
  let currentHensachiRange = '';
  let currentSearch = '';
  let currentSortKey = 'hensachi';
  let currentSortDir = 'desc';
  let filteredData = [];

  // --- DOM要素 ---
  const tbody = document.getElementById('rankingBody');
  const noResults = document.getElementById('noResults');
  const loadMoreWrap = document.getElementById('loadMoreWrap');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const resultCount = document.getElementById('resultCount');
  const regionFilter = document.getElementById('regionFilter');
  const hensachiFilter = document.getElementById('hensachiFilter');
  const searchBox = document.getElementById('searchBox');
  const typeTabs = document.querySelectorAll('.filter-tabs button');
  const sortHeaders = document.querySelectorAll('.ranking-table thead th[data-sort]');

  // --- 偏差値バッジレベル ---
  function getHensachiLevel(val) {
    if (val >= 70) return 'level-70';
    if (val >= 60) return 'level-60';
    if (val >= 50) return 'level-50';
    return 'level-40';
  }

  // --- 就職力バーの色 ---
  function getJobScoreColor(score) {
    if (score >= 90) return '#dc2626';
    if (score >= 80) return '#d97706';
    if (score >= 70) return '#16a34a';
    return '#2563eb';
  }

  // --- 大学群バッジ ---
  function getGroupBadge(groupKey) {
    var group = GROUPS[groupKey];
    if (!group) return '';
    return '<a href="../groups/detail.html#' + groupKey + '" class="group-badge" style="background:' + group.color + '20; color:' + group.color + '; border: 1px solid ' + group.color + '40; text-decoration: none;">' + group.name + '</a>';
  }

  // --- 順位表示 ---
  function getRankClass(rank) {
    if (rank === 1) return 'rank-num top1';
    if (rank === 2) return 'rank-num top2';
    if (rank === 3) return 'rank-num top3';
    return 'rank-num';
  }

  // --- フィルタリング ---
  function filterData() {
    var data = UNIVERSITY_DATA.slice();

    // タイプフィルター
    if (currentType !== 'all') {
      data = data.filter(function(u) { return u.type === currentType; });
    }

    // 地域フィルター
    if (currentRegion) {
      data = data.filter(function(u) { return u.region === currentRegion; });
    }

    // 偏差値範囲フィルター
    if (currentHensachiRange) {
      var parts = currentHensachiRange.split('-');
      var min = parseFloat(parts[0]);
      var max = parseFloat(parts[1]);
      data = data.filter(function(u) { return u.hensachi >= min && u.hensachi < max; });
    }

    // 検索フィルター
    if (currentSearch) {
      var q = currentSearch.toLowerCase();
      data = data.filter(function(u) {
        return u.name.toLowerCase().indexOf(q) !== -1 ||
               u.pref.toLowerCase().indexOf(q) !== -1 ||
               (GROUPS[u.group] && GROUPS[u.group].name.toLowerCase().indexOf(q) !== -1);
      });
    }

    return data;
  }

  // --- ソート ---
  function sortData(data) {
    var key = currentSortKey;
    var dir = currentSortDir === 'asc' ? 1 : -1;

    data.sort(function(a, b) {
      var va, vb;
      if (key === 'name') {
        va = a.name;
        vb = b.name;
        return va.localeCompare(vb, 'ja') * dir;
      }
      if (key === 'group') {
        va = GROUPS[a.group] ? GROUPS[a.group].name : '';
        vb = GROUPS[b.group] ? GROUPS[b.group].name : '';
        return va.localeCompare(vb, 'ja') * dir;
      }
      if (key === 'region') {
        va = a.pref;
        vb = b.pref;
        return va.localeCompare(vb, 'ja') * dir;
      }
      if (key === 'rank' || key === 'hensachi') {
        va = a.hensachi;
        vb = b.hensachi;
      } else if (key === 'jobScore') {
        va = a.jobScore;
        vb = b.jobScore;
      } else {
        va = a[key];
        vb = b[key];
      }
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });

    return data;
  }

  // --- テーブル行を生成 ---
  function createRow(u, rank) {
    var tr = document.createElement('tr');
    var typeBadge = u.type === 'national'
      ? '<span class="uni-type-badge national">国公立</span>'
      : '<span class="uni-type-badge private">私立</span>';

    var jobColor = getJobScoreColor(u.jobScore);
    var barWidth = u.jobScore + '%';

    tr.innerHTML =
      '<td><div class="' + getRankClass(rank) + '">' + rank + '</div></td>' +
      '<td><span class="uni-name">' + u.name + '</span>' + typeBadge + '</td>' +
      '<td><span class="hensachi-badge ' + getHensachiLevel(u.hensachi) + '">' + u.hensachi.toFixed(1) + '</span></td>' +
      '<td>' + getGroupBadge(u.group) + '</td>' +
      '<td>' + u.pref + '</td>' +
      '<td class="job-score-cell"><span class="job-score-val" style="color:' + jobColor + '">' + u.jobScore + '</span><div class="job-score-bar-bg"><div class="job-score-bar" style="width:' + barWidth + '; background:' + jobColor + '"></div></div></td>';

    return tr;
  }

  // --- テーブルレンダリング ---
  function render() {
    filteredData = filterData();
    filteredData = sortData(filteredData);

    // 順位を再付与（同偏差値は同順位）
    var ranks = [];
    var sorted = filteredData.slice().sort(function(a, b) { return b.hensachi - a.hensachi; });
    var rankMap = {};
    var prevHensachi = null;
    var prevRank = 0;
    for (var i = 0; i < sorted.length; i++) {
      if (sorted[i].hensachi !== prevHensachi) {
        prevRank = i + 1;
        prevHensachi = sorted[i].hensachi;
      }
      rankMap[sorted[i].name] = prevRank;
    }

    tbody.innerHTML = '';
    var showCount = Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length);

    if (filteredData.length === 0) {
      noResults.style.display = 'block';
      loadMoreWrap.style.display = 'none';
      resultCount.textContent = '0件';
      return;
    }
    noResults.style.display = 'none';

    for (var j = 0; j < showCount; j++) {
      var u = filteredData[j];
      var rank = rankMap[u.name] || (j + 1);
      tbody.appendChild(createRow(u, rank));
    }

    // カウント表示
    resultCount.textContent = filteredData.length + '件中 ' + showCount + '件表示';

    // もっと表示ボタン
    if (showCount >= filteredData.length) {
      loadMoreWrap.style.display = 'none';
    } else {
      loadMoreWrap.style.display = 'block';
      loadMoreBtn.textContent = 'もっと表示（残り' + (filteredData.length - showCount) + '件）';
    }

    // ソートヘッダー表示更新
    sortHeaders.forEach(function(th) {
      var key = th.getAttribute('data-sort');
      th.classList.remove('sort-active');
      var icon = th.querySelector('.sort-icon');
      if (key === currentSortKey) {
        th.classList.add('sort-active');
        icon.textContent = currentSortDir === 'asc' ? '\u25B2' : '\u25BC';
      } else {
        icon.textContent = '\u25B2\u25BC';
      }
    });
  }

  // --- イベントリスナー ---

  // タイプタブ
  typeTabs.forEach(function(btn) {
    btn.addEventListener('click', function() {
      typeTabs.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentType = btn.getAttribute('data-type');
      currentPage = 1;
      render();
    });
  });

  // 地域フィルター
  regionFilter.addEventListener('change', function() {
    currentRegion = this.value;
    currentPage = 1;
    render();
  });

  // 偏差値フィルター
  hensachiFilter.addEventListener('change', function() {
    currentHensachiRange = this.value;
    currentPage = 1;
    render();
  });

  // 検索ボックス（デバウンス付き）
  var searchTimer = null;
  searchBox.addEventListener('input', function() {
    clearTimeout(searchTimer);
    var self = this;
    searchTimer = setTimeout(function() {
      currentSearch = self.value.trim();
      currentPage = 1;
      render();
    }, 300);
  });

  // ソートヘッダー
  sortHeaders.forEach(function(th) {
    th.addEventListener('click', function() {
      var key = th.getAttribute('data-sort');
      if (currentSortKey === key) {
        currentSortDir = currentSortDir === 'asc' ? 'desc' : 'asc';
      } else {
        currentSortKey = key;
        currentSortDir = (key === 'name' || key === 'group' || key === 'region') ? 'asc' : 'desc';
      }
      currentPage = 1;
      render();
    });
  });

  // もっと表示ボタン
  loadMoreBtn.addEventListener('click', function() {
    currentPage++;
    render();
  });

  // ハンバーガーメニュー
  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.querySelector('.site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function() {
      siteNav.classList.toggle('open');
      navToggle.classList.toggle('open');
    });
  }

  // --- 初期レンダリング ---
  render();

})();
