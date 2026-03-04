// ============================================
// 就職・キャリアページ ロジック
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  renderFilterTable();
  renderMatrix();
});

// ===== 業界別フィルター強度テーブル =====
function renderFilterTable() {
  const tbody = document.getElementById('filterTableBody');
  if (!tbody) return;

  // レベル降順でソート
  const sorted = [...FILTER_DATA].sort((a, b) => b.level - a.level);

  sorted.forEach(item => {
    const tr = document.createElement('tr');

    // 業界名
    const tdIndustry = document.createElement('td');
    tdIndustry.className = 'industry-name';
    tdIndustry.textContent = item.industry;

    // フィルター強度バー
    const tdStrength = document.createElement('td');
    const strengthWrap = document.createElement('div');
    strengthWrap.className = `strength-bar-wrap level-${item.level}`;

    const strengthBar = document.createElement('div');
    strengthBar.className = 'strength-bar';

    for (let i = 1; i <= 5; i++) {
      const pip = document.createElement('div');
      pip.className = `strength-pip ${i <= item.level ? 'active' : 'inactive'}`;
      if (i <= item.level) {
        pip.textContent = '\u{1F6E1}';
      }
      strengthBar.appendChild(pip);
    }

    const label = document.createElement('span');
    label.className = 'strength-label';
    const levelLabels = { 5: '\u6700\u5F37', 4: '\u5F37\u3044', 3: '\u666E\u901A', 2: '\u5F31\u3081', 1: '\u5F31\u3044' };
    label.textContent = levelLabels[item.level];

    strengthWrap.appendChild(strengthBar);
    strengthWrap.appendChild(label);
    tdStrength.appendChild(strengthWrap);

    // ボーダーライン
    const tdBorder = document.createElement('td');
    tdBorder.className = 'border-text';
    tdBorder.textContent = item.border;

    // 代表企業
    const tdExamples = document.createElement('td');
    tdExamples.className = 'examples-text';
    tdExamples.textContent = item.examples;

    // 備考
    const tdNote = document.createElement('td');
    tdNote.className = 'note-text';
    tdNote.textContent = item.note;

    tr.appendChild(tdIndustry);
    tr.appendChild(tdStrength);
    tr.appendChild(tdBorder);
    tr.appendChild(tdExamples);
    tr.appendChild(tdNote);
    tbody.appendChild(tr);
  });
}

// ===== 偏差値帯別マトリクス =====
function renderMatrix() {
  const thead = document.getElementById('matrixHead');
  const tbody = document.getElementById('matrixBody');
  if (!thead || !tbody) return;

  // 偏差値帯（横軸）
  const hensachiBands = [
    { label: '67.5+', min: 67.5, max: 100 },
    { label: '60.0\u301C67.4', min: 60.0, max: 67.4 },
    { label: '55.0\u301C59.9', min: 55.0, max: 59.9 },
    { label: '50.0\u301C54.9', min: 50.0, max: 54.9 },
    { label: '45.0\u301C49.9', min: 45.0, max: 49.9 },
    { label: '\u301C44.9', min: 0, max: 44.9 },
  ];

  // 業界一覧（縦軸） - FILTER_DATA から取得
  const industries = FILTER_DATA.map(f => f.industry);

  // DIAGNOSIS_MAP で各偏差値帯に含まれる業界を解析
  // 各業界 x 偏差値帯の判定
  function getStatus(industry, band) {
    // DIAGNOSIS_MAP から該当の偏差値帯を探す
    const diag = DIAGNOSIS_MAP.find(d => d.min >= band.min && d.min <= band.max) ||
                 DIAGNOSIS_MAP.find(d => band.min >= d.min && band.min <= d.max);

    if (!diag) return 'hard';

    // 完全一致
    const exact = diag.industries.some(ind =>
      ind === industry || industry.includes(ind) || ind.includes(industry)
    );
    if (exact) return 'high';

    // 「（一部）」付きチェック
    const partial = diag.industries.some(ind =>
      ind.includes(industry) || industry.includes(ind.replace(/（.*）/, ''))
    );
    if (partial) return 'maybe';

    return 'hard';
  }

  // もう少し正確な判定ロジック
  function getMatrixValue(industry, bandMin, bandMax) {
    for (const diag of DIAGNOSIS_MAP) {
      if (diag.min <= bandMax && diag.max >= bandMin) {
        // この偏差値帯にマッチするDIAGNOSIS_MAPエントリ
        const found = diag.industries.find(ind => {
          const cleanInd = ind.replace(/（.*?）/g, '');
          const cleanIndustry = industry.replace(/（.*?）/g, '');
          return cleanInd === cleanIndustry || cleanIndustry.includes(cleanInd) || cleanInd.includes(cleanIndustry);
        });
        if (found) {
          if (found.includes('（一部）')) return 'maybe';
          return 'high';
        }
      }
    }
    return 'hard';
  }

  // ヘッダー生成
  const headerRow = document.createElement('tr');
  const thCorner = document.createElement('th');
  thCorner.textContent = '\u696D\u754C \\ \u504F\u5DEE\u5024\u5E2F';
  headerRow.appendChild(thCorner);

  hensachiBands.forEach(band => {
    const th = document.createElement('th');
    th.textContent = band.label;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // ボディ生成
  industries.forEach(industry => {
    const tr = document.createElement('tr');
    const tdName = document.createElement('td');
    tdName.textContent = industry;
    tr.appendChild(tdName);

    hensachiBands.forEach(band => {
      const td = document.createElement('td');
      const status = getMatrixValue(industry, band.min, band.max);

      if (status === 'high') {
        td.textContent = '\u25CB';
        td.className = 'matrix-cell-high';
        td.title = '\u9AD8\u3044\u53EF\u80FD\u6027';
      } else if (status === 'maybe') {
        td.textContent = '\u25B3';
        td.className = 'matrix-cell-maybe';
        td.title = '\u53EF\u80FD\u6027\u3042\u308A';
      } else {
        td.textContent = '\u00D7';
        td.className = 'matrix-cell-hard';
        td.title = '\u96E3\u3057\u3044';
      }

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}
