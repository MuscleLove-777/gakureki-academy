/* ============================================
   学歴アカデミー - データ定義
   ============================================ */

/**
 * 大学データ
 * - name: 大学名
 * - hensachi: 偏差値
 * - type: national / private
 * - region: 地域
 * - pref: 都道府県
 * - group: 所属する大学群キー
 * - salary: 平均年収（万円）
 * - jobScore: 就職力スコア（100点満点）
 * - field: 分野
 */
const UNIVERSITY_DATA = [
  // === 東京一工 ===
  { name: "東京大学", hensachi: 72.5, type: "national", region: "関東", pref: "東京", group: "tokyo-iko", salary: 810, jobScore: 98, field: "総合" },
  { name: "京都大学", hensachi: 70.0, type: "national", region: "近畿", pref: "京都", group: "tokyo-iko", salary: 780, jobScore: 96, field: "総合" },
  { name: "一橋大学", hensachi: 67.5, type: "national", region: "関東", pref: "東京", group: "tokyo-iko", salary: 800, jobScore: 97, field: "文系" },
  { name: "東京工業大学", hensachi: 67.5, type: "national", region: "関東", pref: "東京", group: "tokyo-iko", salary: 790, jobScore: 95, field: "理系" },

  // === 旧帝大（東大京大除く） ===
  { name: "大阪大学", hensachi: 65.0, type: "national", region: "近畿", pref: "大阪", group: "kyutei", salary: 720, jobScore: 90, field: "総合" },
  { name: "東北大学", hensachi: 62.5, type: "national", region: "東北", pref: "宮城", group: "kyutei", salary: 700, jobScore: 88, field: "総合" },
  { name: "名古屋大学", hensachi: 62.5, type: "national", region: "中部", pref: "愛知", group: "kyutei", salary: 710, jobScore: 88, field: "総合" },
  { name: "九州大学", hensachi: 60.0, type: "national", region: "九州", pref: "福岡", group: "kyutei", salary: 680, jobScore: 86, field: "総合" },
  { name: "北海道大学", hensachi: 60.0, type: "national", region: "北海道", pref: "北海道", group: "kyutei", salary: 670, jobScore: 85, field: "総合" },

  // === 早慶上理ICU ===
  { name: "慶應義塾大学", hensachi: 70.0, type: "private", region: "関東", pref: "東京", group: "soukeijouri", salary: 800, jobScore: 96, field: "総合" },
  { name: "早稲田大学", hensachi: 67.5, type: "private", region: "関東", pref: "東京", group: "soukeijouri", salary: 770, jobScore: 95, field: "総合" },
  { name: "上智大学", hensachi: 65.0, type: "private", region: "関東", pref: "東京", group: "soukeijouri", salary: 700, jobScore: 87, field: "総合" },
  { name: "東京理科大学", hensachi: 62.5, type: "private", region: "関東", pref: "東京", group: "soukeijouri", salary: 690, jobScore: 86, field: "理系" },
  { name: "国際基督教大学", hensachi: 65.0, type: "private", region: "関東", pref: "東京", group: "soukeijouri", salary: 680, jobScore: 85, field: "文系" },

  // === MARCH ===
  { name: "明治大学", hensachi: 62.5, type: "private", region: "関東", pref: "東京", group: "march", salary: 650, jobScore: 82, field: "総合" },
  { name: "青山学院大学", hensachi: 62.5, type: "private", region: "関東", pref: "東京", group: "march", salary: 640, jobScore: 80, field: "総合" },
  { name: "立教大学", hensachi: 62.5, type: "private", region: "関東", pref: "東京", group: "march", salary: 640, jobScore: 80, field: "総合" },
  { name: "中央大学", hensachi: 60.0, type: "private", region: "関東", pref: "東京", group: "march", salary: 630, jobScore: 79, field: "総合" },
  { name: "法政大学", hensachi: 60.0, type: "private", region: "関東", pref: "東京", group: "march", salary: 620, jobScore: 78, field: "総合" },

  // === 関関同立 ===
  { name: "同志社大学", hensachi: 62.5, type: "private", region: "近畿", pref: "京都", group: "kankan", salary: 640, jobScore: 81, field: "総合" },
  { name: "関西学院大学", hensachi: 60.0, type: "private", region: "近畿", pref: "兵庫", group: "kankan", salary: 620, jobScore: 78, field: "総合" },
  { name: "立命館大学", hensachi: 57.5, type: "private", region: "近畿", pref: "京都", group: "kankan", salary: 610, jobScore: 77, field: "総合" },
  { name: "関西大学", hensachi: 57.5, type: "private", region: "近畿", pref: "大阪", group: "kankan", salary: 600, jobScore: 76, field: "総合" },

  // === 成成明学獨國武 ===
  { name: "成蹊大学", hensachi: 55.0, type: "private", region: "関東", pref: "東京", group: "seisei", salary: 580, jobScore: 72, field: "総合" },
  { name: "成城大学", hensachi: 55.0, type: "private", region: "関東", pref: "東京", group: "seisei", salary: 570, jobScore: 71, field: "総合" },
  { name: "明治学院大学", hensachi: 55.0, type: "private", region: "関東", pref: "東京", group: "seisei", salary: 560, jobScore: 70, field: "総合" },
  { name: "獨協大学", hensachi: 52.5, type: "private", region: "関東", pref: "埼玉", group: "seisei", salary: 540, jobScore: 68, field: "文系" },
  { name: "國學院大學", hensachi: 55.0, type: "private", region: "関東", pref: "東京", group: "seisei", salary: 550, jobScore: 69, field: "文系" },
  { name: "武蔵大学", hensachi: 55.0, type: "private", region: "関東", pref: "東京", group: "seisei", salary: 550, jobScore: 69, field: "総合" },

  // === 日東駒専 ===
  { name: "日本大学", hensachi: 52.5, type: "private", region: "関東", pref: "東京", group: "nittokoma", salary: 540, jobScore: 67, field: "総合" },
  { name: "東洋大学", hensachi: 52.5, type: "private", region: "関東", pref: "東京", group: "nittokoma", salary: 530, jobScore: 66, field: "総合" },
  { name: "駒澤大学", hensachi: 52.5, type: "private", region: "関東", pref: "東京", group: "nittokoma", salary: 520, jobScore: 65, field: "総合" },
  { name: "専修大学", hensachi: 52.5, type: "private", region: "関東", pref: "東京", group: "nittokoma", salary: 510, jobScore: 64, field: "総合" },

  // === 産近甲龍 ===
  { name: "京都産業大学", hensachi: 50.0, type: "private", region: "近畿", pref: "京都", group: "sankin", salary: 510, jobScore: 64, field: "総合" },
  { name: "近畿大学", hensachi: 52.5, type: "private", region: "近畿", pref: "大阪", group: "sankin", salary: 530, jobScore: 66, field: "総合" },
  { name: "甲南大学", hensachi: 50.0, type: "private", region: "近畿", pref: "兵庫", group: "sankin", salary: 510, jobScore: 63, field: "総合" },
  { name: "龍谷大学", hensachi: 50.0, type: "private", region: "近畿", pref: "京都", group: "sankin", salary: 500, jobScore: 62, field: "総合" },

  // === 大東亜帝国 ===
  { name: "大東文化大学", hensachi: 45.0, type: "private", region: "関東", pref: "東京", group: "daitoua", salary: 460, jobScore: 55, field: "総合" },
  { name: "東海大学", hensachi: 47.5, type: "private", region: "関東", pref: "東京", group: "daitoua", salary: 480, jobScore: 58, field: "総合" },
  { name: "亜細亜大学", hensachi: 45.0, type: "private", region: "関東", pref: "東京", group: "daitoua", salary: 460, jobScore: 55, field: "総合" },
  { name: "帝京大学", hensachi: 45.0, type: "private", region: "関東", pref: "東京", group: "daitoua", salary: 470, jobScore: 56, field: "総合" },
  { name: "国士舘大学", hensachi: 45.0, type: "private", region: "関東", pref: "東京", group: "daitoua", salary: 460, jobScore: 55, field: "総合" },

  // === 有力国公立 ===
  { name: "神戸大学", hensachi: 62.5, type: "national", region: "近畿", pref: "兵庫", group: "kyutei", salary: 710, jobScore: 88, field: "総合" },
  { name: "筑波大学", hensachi: 62.5, type: "national", region: "関東", pref: "茨城", group: "kyutei", salary: 680, jobScore: 85, field: "総合" },
  { name: "横浜国立大学", hensachi: 60.0, type: "national", region: "関東", pref: "神奈川", group: "kyutei", salary: 680, jobScore: 84, field: "総合" },
  { name: "千葉大学", hensachi: 57.5, type: "national", region: "関東", pref: "千葉", group: "kyutei", salary: 640, jobScore: 80, field: "総合" },
  { name: "広島大学", hensachi: 57.5, type: "national", region: "中国", pref: "広島", group: "kyutei", salary: 620, jobScore: 78, field: "総合" },
  { name: "金沢大学", hensachi: 55.0, type: "national", region: "中部", pref: "石川", group: "kyutei", salary: 600, jobScore: 76, field: "総合" },
  { name: "岡山大学", hensachi: 55.0, type: "national", region: "中国", pref: "岡山", group: "kyutei", salary: 600, jobScore: 76, field: "総合" },
  { name: "熊本大学", hensachi: 55.0, type: "national", region: "九州", pref: "熊本", group: "kyutei", salary: 580, jobScore: 74, field: "総合" },
  { name: "新潟大学", hensachi: 52.5, type: "national", region: "中部", pref: "新潟", group: "kyutei", salary: 560, jobScore: 72, field: "総合" },
];

/**
 * 大学群定義
 * - key: グループ識別子
 * - name: グループ名
 * - fullName: 正式名称・含まれる大学
 * - hensachiRange: 偏差値帯
 * - color: テーマカラー
 * - description: グループの説明
 * - filterLevel: 学歴フィルターでの位置付け
 */
const GROUPS = {
  "tokyo-iko": {
    name: "東京一工",
    fullName: "東京大学・京都大学・一橋大学・東京工業大学",
    hensachiRange: "67.5~72.5",
    color: "#c53030",
    description: "日本の最高峰。全業界から最優先で採用される。",
    filterLevel: "最上位",
  },
  "kyutei": {
    name: "旧帝大・有力国公立",
    fullName: "北海道大学・東北大学・名古屋大学・大阪大学・九州大学 他",
    hensachiRange: "52.5~65.0",
    color: "#b7791f",
    description: "地方の雄。地元企業では圧倒的なブランド力。",
    filterLevel: "上位",
  },
  "soukeijouri": {
    name: "早慶上理ICU",
    fullName: "早稲田大学・慶應義塾大学・上智大学・東京理科大学・ICU",
    hensachiRange: "62.5~70.0",
    color: "#9b2c2c",
    description: "私学の最高峰。特に慶應はOBネットワークが強力。",
    filterLevel: "上位",
  },
  "march": {
    name: "MARCH",
    fullName: "明治大学・青山学院大学・立教大学・中央大学・法政大学",
    hensachiRange: "60.0~62.5",
    color: "#2b6cb0",
    description: "私大の中核。学歴フィルターの実質的なボーダーライン。",
    filterLevel: "中位",
  },
  "kankan": {
    name: "関関同立",
    fullName: "関西学院大学・関西大学・同志社大学・立命館大学",
    hensachiRange: "57.5~62.5",
    color: "#2c7a7b",
    description: "関西私大の雄。関西圏ではMARCHと同等の評価。",
    filterLevel: "中位",
  },
  "seisei": {
    name: "成成明学獨國武",
    fullName: "成蹊大学・成城大学・明治学院大学・獨協大学・國學院大學・武蔵大学",
    hensachiRange: "52.5~55.0",
    color: "#6b46c1",
    description: "MARCHと日東駒専の中間に位置する大学群。",
    filterLevel: "中位~下位",
  },
  "nittokoma": {
    name: "日東駒専",
    fullName: "日本大学・東洋大学・駒澤大学・専修大学",
    hensachiRange: "52.5",
    color: "#38a169",
    description: "中堅私大の代表格。資格取得や実務経験で差別化が鍵。",
    filterLevel: "下位",
  },
  "sankin": {
    name: "産近甲龍",
    fullName: "京都産業大学・近畿大学・甲南大学・龍谷大学",
    hensachiRange: "50.0~52.5",
    color: "#dd6b20",
    description: "関西の中堅私大。近畿大学は志願者数日本一の勢い。",
    filterLevel: "下位",
  },
  "daitoua": {
    name: "大東亜帝国",
    fullName: "大東文化大学・東海大学・亜細亜大学・帝京大学・国士舘大学",
    hensachiRange: "45.0~47.5",
    color: "#718096",
    description: "スポーツ・資格・経験で十分挽回可能。",
    filterLevel: "下位",
  },
};
