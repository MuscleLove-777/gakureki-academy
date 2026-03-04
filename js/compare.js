// ============================================
// 大学群比較ツール ロジック
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  populateSelectors();
  document.getElementById('compareBtn').addEventListener('click', runComparison);
});

// ===== ドロップダウンにオプションを追加 =====
function populateSelectors() {
  const selectA = document.getElementById('groupA');
  const selectB = document.getElementById('groupB');

  Object.entries(GROUPS).forEach(([key, group]) => {
    const optA = document.createElement('option');
    optA.value = key;
    optA.textContent = group.name;

    const optB = document.createElement('option');
    optB.value = key;
    optB.textContent = group.name;

    selectA.appendChild(optA);
    selectB.appendChild(optB);
  });
}

// ===== 大学群のデータを集計 =====
function getGroupStats(groupKey) {
  const group = GROUPS[groupKey];
  const universities = UNIVERSITY_DATA.filter(u => u.group === groupKey);

  if (universities.length === 0) return null;

  const avgHensachi = universities.reduce((sum, u) => sum + u.hensachi, 0) / universities.length;
  const avgJobScore = universities.reduce((sum, u) => sum + u.jobScore, 0) / universities.length;
  const avgSalary = universities.reduce((sum, u) => sum + u.salary, 0) / universities.length;

  return {
    key: groupKey,
    name: group.name,
    fullName: group.fullName,
    hensachiRange: group.hensachiRange,
    color: group.color,
    filterLevel: group.filterLevel,
    description: group.description,
    avgHensachi: Math.round(avgHensachi * 10) / 10,
    avgJobScore: Math.round(avgJobScore * 10) / 10,
    avgSalary: Math.round(avgSalary),
    universities: universities.map(u => u.name),
  };
}

// ===== フィルターレベルのバッジクラス =====
function getFilterBadgeClass(level) {
  if (level.includes('最上位')) return 'top';
  if (level.includes('上位')) return 'upper';
  if (level.includes('中位') && level.includes('下位')) return 'mid-lower';
  if (level.includes('中位')) return 'mid';
  return 'lower';
}

// ===== 比較実行 =====
function runComparison() {
  const keyA = document.getElementById('groupA').value;
  const keyB = document.getElementById('groupB').value;

  if (!keyA || !keyB) {
    alert('両方の大学群を選択してください。');
    return;
  }
  if (keyA === keyB) {
    alert('異なる大学群を選択してください。');
    return;
  }

  const statsA = getGroupStats(keyA);
  const statsB = getGroupStats(keyB);

  if (!statsA || !statsB) {
    alert('データが見つかりませんでした。');
    return;
  }

  renderResults(statsA, statsB);
}

// ===== 結果描画 =====
function renderResults(a, b) {
  const resultsSection = document.getElementById('compareResults');
  const resultsTitle = document.getElementById('resultsTitle');
  const columnA = document.getElementById('columnA');
  const columnB = document.getElementById('columnB');

  resultsTitle.textContent = `${a.name} vs ${b.name}`;

  columnA.innerHTML = buildColumn(a, b, 'A');
  columnB.innerHTML = buildColumn(b, a, 'B');

  resultsSection.classList.add('visible');
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== カラム HTML 生成 =====
function buildColumn(main, opponent, side) {
  const metrics = [
    { label: '偏差値平均', key: 'avgHensachi', max: 80, unit: '', suffix: '' },
    { label: '就職力平均', key: 'avgJobScore', max: 100, unit: '', suffix: ' / 100' },
    { label: '平均年収', key: 'avgSalary', max: 900, unit: '万円', suffix: '万円' },
  ];

  let html = `
    <div class="column-header">
      <h3 style="color: ${main.color}">${main.name}</h3>
      <span class="group-range">偏差値帯: ${main.hensachiRange}</span>
    </div>
  `;

  metrics.forEach(m => {
    const val = main[m.key];
    const oppVal = opponent[m.key];
    const pct = Math.min((val / m.max) * 100, 100);

    let statusClass = 'tie';
    if (val > oppVal) statusClass = 'winner';
    else if (val < oppVal) statusClass = 'loser';

    html += `
      <div class="stat-row ${statusClass}">
        <span class="stat-label">${m.label}</span>
        <div class="stat-value-wrap">
          <div class="stat-bar-bg">
            <div class="stat-bar" style="width: ${pct}%"></div>
          </div>
          <span class="stat-number">${val}${m.suffix}</span>
        </div>
      </div>
    `;
  });

  // フィルターレベル
  const badgeClass = getFilterBadgeClass(main.filterLevel);
  html += `
    <div class="stat-row">
      <span class="stat-label">学歴フィルター</span>
      <div class="stat-value-wrap" style="justify-content: flex-end;">
        <span class="filter-badge ${badgeClass}">${main.filterLevel}</span>
      </div>
    </div>
  `;

  // 所属大学一覧
  html += `
    <div class="univ-list-section">
      <h4>所属大学一覧</h4>
      <div>
        ${main.universities.map(u => `<span class="univ-tag">${u}</span>`).join('')}
      </div>
    </div>
  `;

  return html;
}
