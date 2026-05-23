export type Subdivision = {
  id: string;
  name: string;
  lat: number;
  lon: number;
};

export type Prefecture = {
  id: string;
  name: string;
  subdivisions: Subdivision[];
};

export type Area = {
  id: string;
  name: string;
  prefectures: Prefecture[];
};

export const AREAS: Area[] = [
  {
    id: "hokkaido",
    name: "北海道",
    prefectures: [
      {
        id: "hokkaido",
        name: "北海道",
        subdivisions: [
          { id: "hokkaido-soya", name: "宗谷地方", lat: 45.4154, lon: 141.6731 },
          { id: "hokkaido-kamikawa", name: "上川・留萌地方", lat: 43.7706, lon: 142.365 },
          { id: "hokkaido-abashiri", name: "網走・北見・紋別地方", lat: 44.0207, lon: 144.2734 },
          { id: "hokkaido-ishikari", name: "石狩・空知・後志地方", lat: 43.0642, lon: 141.3469 },
          { id: "hokkaido-iburi", name: "胆振・日高地方", lat: 42.3153, lon: 140.9737 },
          { id: "hokkaido-oshima", name: "渡島・檜山地方", lat: 41.7687, lon: 140.7288 },
          { id: "hokkaido-tokachi", name: "十勝地方", lat: 42.9237, lon: 143.1962 },
          { id: "hokkaido-kushiro", name: "釧路・根室地方", lat: 42.985, lon: 144.3819 },
        ],
      },
    ],
  },
  {
    id: "tohoku",
    name: "東北",
    prefectures: [
      { id: "aomori", name: "青森県", subdivisions: [
        { id: "aomori-tsugaru", name: "津軽", lat: 40.8244, lon: 140.74 },
        { id: "aomori-shimokita", name: "下北", lat: 41.2884, lon: 141.2169 },
        { id: "aomori-sanpachi", name: "三八上北", lat: 40.5126, lon: 141.4884 },
      ]},
      { id: "iwate", name: "岩手県", subdivisions: [
        { id: "iwate-inland", name: "内陸", lat: 39.7036, lon: 141.1527 },
        { id: "iwate-coast-north", name: "沿岸北部", lat: 39.6418, lon: 141.9568 },
        { id: "iwate-coast-south", name: "沿岸南部", lat: 39.0822, lon: 141.7080 },
      ]},
      { id: "miyagi", name: "宮城県", subdivisions: [
        { id: "miyagi-east", name: "東部", lat: 38.2682, lon: 140.8694 },
        { id: "miyagi-west", name: "西部", lat: 38.5904, lon: 140.5747 },
      ]},
      { id: "akita", name: "秋田県", subdivisions: [
        { id: "akita-coast-north", name: "沿岸北部", lat: 40.2125, lon: 140.0273 },
        { id: "akita-coast-south", name: "沿岸南部", lat: 39.7186, lon: 140.1024 },
        { id: "akita-inland-north", name: "内陸北部", lat: 40.2155, lon: 140.7869 },
        { id: "akita-inland-south", name: "内陸南部", lat: 39.3094, lon: 140.5666 },
      ]},
      { id: "yamagata", name: "山形県", subdivisions: [
        { id: "yamagata-village", name: "村山", lat: 38.2404, lon: 140.3633 },
        { id: "yamagata-shonai", name: "庄内", lat: 38.7332, lon: 139.8266 },
        { id: "yamagata-okitama", name: "置賜", lat: 37.9156, lon: 140.1163 },
        { id: "yamagata-mogami", name: "最上", lat: 38.7596, lon: 140.3133 },
      ]},
      { id: "fukushima", name: "福島県", subdivisions: [
        { id: "fukushima-nakadori", name: "中通り", lat: 37.7503, lon: 140.4676 },
        { id: "fukushima-hamadori", name: "浜通り", lat: 37.1404, lon: 140.9889 },
        { id: "fukushima-aizu", name: "会津", lat: 37.4949, lon: 139.9298 },
      ]},
    ],
  },
  {
    id: "kanto",
    name: "関東",
    prefectures: [
      { id: "ibaraki", name: "茨城県", subdivisions: [
        { id: "ibaraki-north", name: "北部", lat: 36.7397, lon: 140.4467 },
        { id: "ibaraki-south", name: "南部", lat: 36.3418, lon: 140.4468 },
      ]},
      { id: "tochigi", name: "栃木県", subdivisions: [
        { id: "tochigi-south", name: "南部", lat: 36.5658, lon: 139.8836 },
        { id: "tochigi-north", name: "北部", lat: 36.9095, lon: 139.79 },
      ]},
      { id: "gunma", name: "群馬県", subdivisions: [
        { id: "gunma-south", name: "南部", lat: 36.3911, lon: 139.0608 },
        { id: "gunma-north", name: "北部", lat: 36.7833, lon: 138.85 },
      ]},
      { id: "saitama", name: "埼玉県", subdivisions: [
        { id: "saitama-north", name: "北部", lat: 36.1473, lon: 139.3884 },
        { id: "saitama-south", name: "南部", lat: 35.8569, lon: 139.6489 },
        { id: "saitama-chichibu", name: "秩父地方", lat: 35.9919, lon: 139.0844 },
      ]},
      { id: "chiba", name: "千葉県", subdivisions: [
        { id: "chiba-north", name: "北西部", lat: 35.6047, lon: 140.1233 },
        { id: "chiba-northeast", name: "北東部", lat: 35.7106, lon: 140.4666 },
        { id: "chiba-south", name: "南部", lat: 35.0928, lon: 139.8682 },
      ]},
      { id: "tokyo", name: "東京都", subdivisions: [
        { id: "tokyo-23-east", name: "23区東部", lat: 35.7100, lon: 139.8000 },
        { id: "tokyo-23-west", name: "23区西部", lat: 35.6895, lon: 139.6917 },
        { id: "tokyo-tama-north", name: "多摩北部", lat: 35.7300, lon: 139.4900 },
        { id: "tokyo-tama-south", name: "多摩南部", lat: 35.6300, lon: 139.4400 },
        { id: "tokyo-tama-west", name: "多摩西部", lat: 35.7900, lon: 139.2400 },
        { id: "tokyo-izu-north", name: "伊豆諸島北部", lat: 34.7, lon: 139.4 },
        { id: "tokyo-izu-south", name: "伊豆諸島南部", lat: 33.1, lon: 139.78 },
        { id: "tokyo-ogasawara", name: "小笠原諸島", lat: 27.0944, lon: 142.1919 },
      ]},
      { id: "kanagawa", name: "神奈川県", subdivisions: [
        { id: "kanagawa-east", name: "東部", lat: 35.4478, lon: 139.6425 },
        { id: "kanagawa-west", name: "西部", lat: 35.2647, lon: 139.1535 },
      ]},
    ],
  },
  {
    id: "chubu",
    name: "中部",
    prefectures: [
      { id: "niigata", name: "新潟県", subdivisions: [
        { id: "niigata-lower", name: "下越", lat: 37.9026, lon: 139.0234 },
        { id: "niigata-middle", name: "中越", lat: 37.4461, lon: 138.851 },
        { id: "niigata-upper", name: "上越", lat: 37.1473, lon: 138.2362 },
        { id: "niigata-sado", name: "佐渡", lat: 38.0186, lon: 138.3686 },
      ]},
      { id: "toyama", name: "富山県", subdivisions: [
        { id: "toyama-east", name: "東部", lat: 36.7, lon: 137.36 },
        { id: "toyama-west", name: "西部", lat: 36.72, lon: 136.97 },
      ]},
      { id: "ishikawa", name: "石川県", subdivisions: [
        { id: "ishikawa-kaga", name: "加賀", lat: 36.5613, lon: 136.6562 },
        { id: "ishikawa-noto", name: "能登", lat: 37.3886, lon: 137.2367 },
      ]},
      { id: "fukui", name: "福井県", subdivisions: [
        { id: "fukui-rei-north", name: "嶺北", lat: 36.0652, lon: 136.2216 },
        { id: "fukui-rei-south", name: "嶺南", lat: 35.6451, lon: 135.9474 },
      ]},
      { id: "yamanashi", name: "山梨県", subdivisions: [
        { id: "yamanashi-central", name: "中・西部", lat: 35.6635, lon: 138.5685 },
        { id: "yamanashi-east", name: "東部・富士五湖", lat: 35.4945, lon: 138.8158 },
      ]},
      { id: "nagano", name: "長野県", subdivisions: [
        { id: "nagano-north", name: "北部", lat: 36.6485, lon: 138.1949 },
        { id: "nagano-central", name: "中部", lat: 36.2381, lon: 137.972 },
        { id: "nagano-south", name: "南部", lat: 35.5145, lon: 137.8208 },
      ]},
      { id: "gifu", name: "岐阜県", subdivisions: [
        { id: "gifu-mino", name: "美濃地方", lat: 35.3911, lon: 136.7223 },
        { id: "gifu-hida", name: "飛騨地方", lat: 36.1429, lon: 137.2542 },
      ]},
      { id: "shizuoka", name: "静岡県", subdivisions: [
        { id: "shizuoka-central", name: "中部", lat: 34.9769, lon: 138.3831 },
        { id: "shizuoka-izu", name: "伊豆", lat: 34.9684, lon: 138.9468 },
        { id: "shizuoka-east", name: "東部", lat: 35.0989, lon: 138.8633 },
        { id: "shizuoka-west", name: "西部", lat: 34.7108, lon: 137.7261 },
      ]},
      { id: "aichi", name: "愛知県", subdivisions: [
        { id: "aichi-west", name: "西部", lat: 35.1815, lon: 136.9066 },
        { id: "aichi-east", name: "東部", lat: 34.7693, lon: 137.3914 },
      ]},
    ],
  },
  {
    id: "kinki",
    name: "近畿",
    prefectures: [
      { id: "mie", name: "三重県", subdivisions: [
        { id: "mie-north", name: "北中部", lat: 34.7303, lon: 136.5086 },
        { id: "mie-south", name: "南部", lat: 33.7359, lon: 136.0094 },
      ]},
      { id: "shiga", name: "滋賀県", subdivisions: [
        { id: "shiga-south", name: "南部", lat: 35.0045, lon: 135.8686 },
        { id: "shiga-north", name: "北部", lat: 35.3623, lon: 136.2541 },
      ]},
      { id: "kyoto", name: "京都府", subdivisions: [
        { id: "kyoto-south", name: "南部", lat: 35.0116, lon: 135.7681 },
        { id: "kyoto-north", name: "北部", lat: 35.5396, lon: 135.1955 },
      ]},
      { id: "osaka", name: "大阪府", subdivisions: [
        { id: "osaka-north", name: "北部", lat: 34.7500, lon: 135.5000 },
        { id: "osaka-south", name: "南部", lat: 34.4500, lon: 135.5500 },
      ]},
      { id: "hyogo", name: "兵庫県", subdivisions: [
        { id: "hyogo-south-east", name: "南部", lat: 34.6913, lon: 135.1830 },
        { id: "hyogo-north", name: "北部", lat: 35.5417, lon: 134.8195 },
      ]},
      { id: "nara", name: "奈良県", subdivisions: [
        { id: "nara-north", name: "北部", lat: 34.6851, lon: 135.8048 },
        { id: "nara-south", name: "南部", lat: 34.1828, lon: 135.8716 },
      ]},
      { id: "wakayama", name: "和歌山県", subdivisions: [
        { id: "wakayama-north", name: "北部", lat: 34.2261, lon: 135.1675 },
        { id: "wakayama-south", name: "南部", lat: 33.6781, lon: 135.5172 },
      ]},
    ],
  },
  {
    id: "chugoku",
    name: "中国",
    prefectures: [
      { id: "tottori", name: "鳥取県", subdivisions: [
        { id: "tottori-east", name: "東部", lat: 35.5039, lon: 134.2381 },
        { id: "tottori-west", name: "中・西部", lat: 35.4286, lon: 133.3306 },
      ]},
      { id: "shimane", name: "島根県", subdivisions: [
        { id: "shimane-east", name: "東部", lat: 35.4723, lon: 133.0505 },
        { id: "shimane-west", name: "西部", lat: 34.6757, lon: 131.8421 },
        { id: "shimane-oki", name: "隠岐", lat: 36.1924, lon: 133.3289 },
      ]},
      { id: "okayama", name: "岡山県", subdivisions: [
        { id: "okayama-south", name: "南部", lat: 34.6618, lon: 133.9344 },
        { id: "okayama-north", name: "北部", lat: 35.0667, lon: 133.9167 },
      ]},
      { id: "hiroshima", name: "広島県", subdivisions: [
        { id: "hiroshima-south", name: "南部", lat: 34.3853, lon: 132.4553 },
        { id: "hiroshima-north", name: "北部", lat: 34.8048, lon: 132.9 },
      ]},
      { id: "yamaguchi", name: "山口県", subdivisions: [
        { id: "yamaguchi-west", name: "西部", lat: 34.0658, lon: 131.0089 },
        { id: "yamaguchi-central", name: "中部", lat: 34.1858, lon: 131.4714 },
        { id: "yamaguchi-east", name: "東部", lat: 34.1668, lon: 132.2196 },
        { id: "yamaguchi-north", name: "北部", lat: 34.4083, lon: 131.2469 },
      ]},
    ],
  },
  {
    id: "shikoku",
    name: "四国",
    prefectures: [
      { id: "tokushima", name: "徳島県", subdivisions: [
        { id: "tokushima-north", name: "北部", lat: 34.0658, lon: 134.5594 },
        { id: "tokushima-south", name: "南部", lat: 33.5538, lon: 134.1888 },
      ]},
      { id: "kagawa", name: "香川県", subdivisions: [
        { id: "kagawa-east", name: "東部", lat: 34.3401, lon: 134.0434 },
        { id: "kagawa-west", name: "西部", lat: 34.2843, lon: 133.7900 },
      ]},
      { id: "ehime", name: "愛媛県", subdivisions: [
        { id: "ehime-central", name: "中予", lat: 33.8416, lon: 132.7657 },
        { id: "ehime-east", name: "東予", lat: 33.9617, lon: 133.5475 },
        { id: "ehime-south", name: "南予", lat: 33.222, lon: 132.5604 },
      ]},
      { id: "kochi", name: "高知県", subdivisions: [
        { id: "kochi-central", name: "中部", lat: 33.5597, lon: 133.5311 },
        { id: "kochi-east", name: "東部", lat: 33.5413, lon: 134.0167 },
        { id: "kochi-west", name: "西部", lat: 33.3667, lon: 133.0067 },
      ]},
    ],
  },
  {
    id: "kyushu",
    name: "九州・沖縄",
    prefectures: [
      { id: "fukuoka", name: "福岡県", subdivisions: [
        { id: "fukuoka-fukuoka", name: "福岡地方", lat: 33.6064, lon: 130.4181 },
        { id: "fukuoka-kitakyushu", name: "北九州地方", lat: 33.8835, lon: 130.8752 },
        { id: "fukuoka-chikuho", name: "筑豊地方", lat: 33.6444, lon: 130.6967 },
        { id: "fukuoka-chikugo", name: "筑後地方", lat: 33.3196, lon: 130.5081 },
      ]},
      { id: "saga", name: "佐賀県", subdivisions: [
        { id: "saga-south", name: "南部", lat: 33.2494, lon: 130.2989 },
        { id: "saga-north", name: "北部", lat: 33.4419, lon: 129.9692 },
      ]},
      { id: "nagasaki", name: "長崎県", subdivisions: [
        { id: "nagasaki-main", name: "南部", lat: 32.7503, lon: 129.8779 },
        { id: "nagasaki-north", name: "北部", lat: 33.1601, lon: 129.7224 },
        { id: "nagasaki-iki", name: "壱岐・対馬", lat: 34.2014, lon: 129.2891 },
        { id: "nagasaki-goto", name: "五島", lat: 32.6957, lon: 128.8403 },
      ]},
      { id: "kumamoto", name: "熊本県", subdivisions: [
        { id: "kumamoto-kumamoto", name: "熊本地方", lat: 32.8031, lon: 130.7079 },
        { id: "kumamoto-aso", name: "阿蘇地方", lat: 32.9514, lon: 131.0794 },
        { id: "kumamoto-amakusa", name: "天草・芦北地方", lat: 32.4576, lon: 130.1929 },
        { id: "kumamoto-kuma", name: "球磨地方", lat: 32.2098, lon: 130.7626 },
      ]},
      { id: "oita", name: "大分県", subdivisions: [
        { id: "oita-central", name: "中部", lat: 33.2382, lon: 131.6126 },
        { id: "oita-north", name: "北部", lat: 33.5631, lon: 131.3739 },
        { id: "oita-west", name: "西部", lat: 33.3225, lon: 130.9404 },
        { id: "oita-south", name: "南部", lat: 32.9594, lon: 131.8997 },
      ]},
      { id: "miyazaki", name: "宮崎県", subdivisions: [
        { id: "miyazaki-south", name: "南部平野部", lat: 31.9111, lon: 131.4239 },
        { id: "miyazaki-north", name: "北部平野部", lat: 32.5824, lon: 131.6648 },
        { id: "miyazaki-south-mt", name: "南部山沿い", lat: 31.7256, lon: 131.0656 },
        { id: "miyazaki-north-mt", name: "北部山沿い", lat: 32.6997, lon: 131.3508 },
      ]},
      { id: "kagoshima", name: "鹿児島県", subdivisions: [
        { id: "kagoshima-satsuma", name: "薩摩地方", lat: 31.5602, lon: 130.5581 },
        { id: "kagoshima-osumi", name: "大隅地方", lat: 31.378, lon: 130.8519 },
        { id: "kagoshima-tanegashima", name: "種子島・屋久島", lat: 30.3819, lon: 130.6597 },
        { id: "kagoshima-amami", name: "奄美地方", lat: 28.3776, lon: 129.4938 },
      ]},
      { id: "okinawa", name: "沖縄県", subdivisions: [
        { id: "okinawa-main", name: "本島中南部", lat: 26.2124, lon: 127.6809 },
        { id: "okinawa-north", name: "本島北部", lat: 26.6948, lon: 128.0181 },
        { id: "okinawa-kume", name: "久米島", lat: 26.3433, lon: 126.8056 },
        { id: "okinawa-daito", name: "大東島地方", lat: 25.8281, lon: 131.2333 },
        { id: "okinawa-miyako", name: "宮古島地方", lat: 24.8054, lon: 125.2811 },
        { id: "okinawa-yaeyama", name: "八重山地方", lat: 24.3406, lon: 124.1556 },
      ]},
    ],
  },
];

export type SubdivisionWithPref = Subdivision & { prefName: string; prefId: string };

export const ALL_SUBDIVISIONS: SubdivisionWithPref[] = AREAS.flatMap((a) =>
  a.prefectures.flatMap((p) =>
    p.subdivisions.map((s) => ({ ...s, prefName: p.name, prefId: p.id }))
  )
);

export function findSubdivision(id: string): SubdivisionWithPref | undefined {
  return ALL_SUBDIVISIONS.find((s) => s.id === id);
}

export function findArea(id: string): Area | undefined {
  return AREAS.find((a) => a.id === id);
}

export function findPrefecture(prefId: string): Prefecture | undefined {
  for (const a of AREAS) {
    const p = a.prefectures.find((pp) => pp.id === prefId);
    if (p) return p;
  }
  return undefined;
}
