// ============================================
// 学歴フィルター診断ツール ロジック
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('hensachiSlider');
  const numberInput = document.getElementById('hensachiNumber');
  const display = document.getElementById('hensachiDisplay');
  const diagnosisBtn = document.getElementById('diagnosisBtn');

  // スライダー ⇔ 数値入力を同期
  slider.addEventListener('input', () => {
    const val = parseFloat(slider.value).toFixed(1);
    numberInput.value = val;
    display.textContent = val;
    updateDisplayColor(parseFloat(val));
  });

  numberInput.addEventListener('input', () => {
    let val = parseFloat(numberInput.value);
    if (isNaN(val)) return;
    val = Math.max(35, Math.min(80, val));
    slider.value = val;
    display.textContent = val.toFixed(1);
    updateDisplayColor(val);
  });

  // 初期色設定
  updateDisplayColor(55.0);

  // 診断ボタン
  diagnosisBtn.addEventListener('click', runDiagnosis);
});

// ===== 偏差値に応じたディスプレイ色変更 =====
function updateDisplayColor(val) {
  const display = document.getElementById('hensachiDisplay');
  if (val >= 67.5) {
    display.style.color = '#276749';
  } else if (val >= 60.0) {
    display.style.color = '#2b6cb0';
  } else if (val >= 55.0) {
    display.style.color = '#975a16';
  } else if (val >= 50.0) {
    display.style.color = '#c05621';
  } else if (val >= 40.0) {
    display.style.color = '#c53030';
  } else {
    display.style.color = '#718096';
  }
}

// ===== 診断実行 =====
function runDiagnosis() {
  const val = parseFloat(document.getElementById('hensachiSlider').value);

  // DIAGNOSIS_MAP から該当レベルを検索
  const result = DIAGNOSIS_MAP.find(d => val >= d.min && val <= d.max);

  if (!result) {
    alert('有効な偏差値を入力してください。');
    return;
  }

  renderDiagnosisResults(val, result);
}

// ===== レベルクラス判定 =====
function getLevelClass(val) {
  if (val >= 67.5) return 'level-high';
  if (val >= 60.0) return 'level-mid-high';
  if (val >= 55.0) return 'level-mid';
  if (val >= 50.0) return 'level-mid-low';
  if (val >= 40.0) return 'level-low';
  return 'level-bottom';
}

// ===== 業界カードの色クラス =====
function getCardColor(index, total) {
  const colors = ['card-green', 'card-blue', 'card-yellow', 'card-orange', 'card-red', 'card-gray'];
  return colors[index % colors.length];
}

// ===== 業界カード色をフィルター強度に基づいて決定 =====
function getIndustryCardColor(industry) {
  const filterEntry = FILTER_DATA.find(f => {
    const cleanF = f.industry.replace(/（.*?）/g, '');
    const cleanI = industry.replace(/（.*?）/g, '');
    return cleanF === cleanI || cleanI.includes(cleanF) || cleanF.includes(cleanI);
  });

  if (!filterEntry) return 'card-gray';

  switch (filterEntry.level) {
    case 5: return 'card-red';
    case 4: return 'card-orange';
    case 3: return 'card-yellow';
    case 2: return 'card-blue';
    case 1: return 'card-green';
    default: return 'card-gray';
  }
}

// ===== 結果描画 =====
function renderDiagnosisResults(hensachi, result) {
  const resultsSection = document.getElementById('diagnosisResults');
  const levelCard = document.getElementById('levelCard');
  const resultHensachi = document.getElementById('resultHensachi');
  const resultLabel = document.getElementById('resultLabel');
  const resultComment = document.getElementById('resultComment');
  const industryCards = document.getElementById('industryCards');
  const adviceText = document.getElementById('adviceText');

  // レベルカード
  const levelClass = getLevelClass(hensachi);
  levelCard.className = `level-card ${levelClass}`;
  resultHensachi.textContent = hensachi.toFixed(1);
  resultLabel.textContent = result.label;
  resultComment.textContent = result.comment;

  // 業界カード
  industryCards.innerHTML = '';
  result.industries.forEach(ind => {
    const card = document.createElement('div');
    card.className = `industry-card ${getIndustryCardColor(ind)}`;
    card.textContent = ind;
    industryCards.appendChild(card);
  });

  // アドバイス
  adviceText.textContent = generateAdvice(hensachi, result);

  // 結果表示
  resultsSection.classList.add('visible');
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== アドバイス生成 =====
function generateAdvice(hensachi, result) {
  if (hensachi >= 67.5) {
    return '最上位レベルの学歴フィルターをクリアしています。外資コンサル・外資金融を含むほぼ全ての業界を狙えます。ただし、学歴だけに頼らず、インターン経験やリーダーシップ経験もしっかりアピールしましょう。特に外資系はケース面接対策が必須です。';
  } else if (hensachi >= 60.0) {
    return '多くの大手企業の学歴フィルターを通過できるレベルです。商社・マスコミは一部制限がありますが、メーカー・金融・ITなど幅広い業界にチャレンジ可能です。OB/OG訪問やインターンシップへの積極参加で、さらに道を広げましょう。';
  } else if (hensachi >= 55.0) {
    return '大手企業も業界を選べば十分に狙えるレベルです。特にIT業界やベンチャー企業ではスキル重視の傾向が強く、学歴以外の武器が活きます。TOEICやプログラミングなどの資格・スキルを磨き、早期からのインターン参加で差別化を図りましょう。';
  } else if (hensachi >= 50.0) {
    return '大手企業の学歴フィルターに引っかかるケースも増えてきます。しかし、公務員試験やIT系スキルを活かした就活では十分に戦えます。資格取得（簿記・TOEIC・基本情報技術者など）や長期インターンなど、実力を証明できる実績を作ることが重要です。';
  } else if (hensachi >= 40.0) {
    return '大手企業の書類選考では厳しい場面もありますが、決して諦める必要はありません。IT業界はスキル次第でどこまでも上を目指せます。公務員は筆記試験がメインなので学歴関係なく挑戦可能です。プログラミングスクールや専門スキルの習得、中小優良企業への就職など、多様なキャリアパスを検討しましょう。';
  } else {
    return '学歴に頼らないキャリア構築が重要です。プログラミング・Web制作・動画編集などのスキルを身につければ、フリーランスや起業という選択肢もあります。公務員試験は学歴不問なので有力な選択肢です。また、中小企業には人柄重視の優良企業が数多くあります。自分の強みを見極め、学歴以外の武器で勝負しましょう。';
  }
}
