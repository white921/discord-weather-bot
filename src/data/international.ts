// Major international cities/regions for the bot's "海外" flow.
// Coordinates are approximate (city center or region representative point).

export type IntlCity = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  tz: string;
};

export type IntlCountry = {
  id: string;
  name: string;
  cities: IntlCity[];
};

export type IntlContinent = {
  id: string;
  name: string;
  countries: IntlCountry[];
};

export const INTL_CONTINENTS: IntlContinent[] = [
  {
    id: "asia",
    name: "アジア",
    countries: [
      { id: "cn", name: "中国", cities: [
        { id: "intl-cn-beijing", name: "北京", lat: 39.9042, lon: 116.4074, tz: "Asia/Shanghai" },
        { id: "intl-cn-shanghai", name: "上海", lat: 31.2304, lon: 121.4737, tz: "Asia/Shanghai" },
        { id: "intl-cn-guangzhou", name: "広州", lat: 23.1291, lon: 113.2644, tz: "Asia/Shanghai" },
        { id: "intl-cn-shenzhen", name: "深圳", lat: 22.5431, lon: 114.0579, tz: "Asia/Shanghai" },
        { id: "intl-cn-chengdu", name: "成都", lat: 30.5728, lon: 104.0668, tz: "Asia/Shanghai" },
        { id: "intl-cn-hk", name: "香港", lat: 22.3193, lon: 114.1694, tz: "Asia/Hong_Kong" },
        { id: "intl-cn-east", name: "東部", lat: 31.0, lon: 121.0, tz: "Asia/Shanghai" },
        { id: "intl-cn-west", name: "西部", lat: 36.0, lon: 95.0, tz: "Asia/Shanghai" },
        { id: "intl-cn-north", name: "北部", lat: 42.0, lon: 120.0, tz: "Asia/Shanghai" },
        { id: "intl-cn-south", name: "南部", lat: 23.0, lon: 113.0, tz: "Asia/Shanghai" },
      ]},
      { id: "kr", name: "韓国", cities: [
        { id: "intl-kr-seoul", name: "ソウル", lat: 37.5665, lon: 126.978, tz: "Asia/Seoul" },
        { id: "intl-kr-busan", name: "釜山", lat: 35.1796, lon: 129.0756, tz: "Asia/Seoul" },
        { id: "intl-kr-jeju", name: "済州", lat: 33.4996, lon: 126.5312, tz: "Asia/Seoul" },
      ]},
      { id: "tw", name: "台湾", cities: [
        { id: "intl-tw-taipei", name: "台北", lat: 25.033, lon: 121.5654, tz: "Asia/Taipei" },
        { id: "intl-tw-kaohsiung", name: "高雄", lat: 22.6273, lon: 120.3014, tz: "Asia/Taipei" },
      ]},
      { id: "sg", name: "シンガポール", cities: [
        { id: "intl-sg-sg", name: "シンガポール", lat: 1.3521, lon: 103.8198, tz: "Asia/Singapore" },
      ]},
      { id: "th", name: "タイ", cities: [
        { id: "intl-th-bangkok", name: "バンコク", lat: 13.7563, lon: 100.5018, tz: "Asia/Bangkok" },
        { id: "intl-th-chiangmai", name: "チェンマイ", lat: 18.7883, lon: 98.9853, tz: "Asia/Bangkok" },
        { id: "intl-th-phuket", name: "プーケット", lat: 7.8804, lon: 98.3923, tz: "Asia/Bangkok" },
      ]},
      { id: "vn", name: "ベトナム", cities: [
        { id: "intl-vn-hanoi", name: "ハノイ", lat: 21.0285, lon: 105.8542, tz: "Asia/Ho_Chi_Minh" },
        { id: "intl-vn-hcmc", name: "ホーチミン", lat: 10.8231, lon: 106.6297, tz: "Asia/Ho_Chi_Minh" },
        { id: "intl-vn-danang", name: "ダナン", lat: 16.0544, lon: 108.2022, tz: "Asia/Ho_Chi_Minh" },
      ]},
      { id: "ph", name: "フィリピン", cities: [
        { id: "intl-ph-manila", name: "マニラ", lat: 14.5995, lon: 120.9842, tz: "Asia/Manila" },
        { id: "intl-ph-cebu", name: "セブ", lat: 10.3157, lon: 123.8854, tz: "Asia/Manila" },
      ]},
      { id: "id", name: "インドネシア", cities: [
        { id: "intl-id-jakarta", name: "ジャカルタ", lat: -6.2088, lon: 106.8456, tz: "Asia/Jakarta" },
        { id: "intl-id-bali", name: "バリ", lat: -8.4095, lon: 115.1889, tz: "Asia/Makassar" },
      ]},
      { id: "my", name: "マレーシア", cities: [
        { id: "intl-my-kl", name: "クアラルンプール", lat: 3.139, lon: 101.6869, tz: "Asia/Kuala_Lumpur" },
      ]},
      { id: "in", name: "インド", cities: [
        { id: "intl-in-delhi", name: "デリー", lat: 28.6139, lon: 77.209, tz: "Asia/Kolkata" },
        { id: "intl-in-mumbai", name: "ムンバイ", lat: 19.076, lon: 72.8777, tz: "Asia/Kolkata" },
        { id: "intl-in-bangalore", name: "バンガロール", lat: 12.9716, lon: 77.5946, tz: "Asia/Kolkata" },
      ]},
    ],
  },
  {
    id: "middle-east",
    name: "中東",
    countries: [
      { id: "ae", name: "UAE", cities: [
        { id: "intl-ae-dubai", name: "ドバイ", lat: 25.2048, lon: 55.2708, tz: "Asia/Dubai" },
        { id: "intl-ae-abudhabi", name: "アブダビ", lat: 24.4539, lon: 54.3773, tz: "Asia/Dubai" },
      ]},
      { id: "sa", name: "サウジアラビア", cities: [
        { id: "intl-sa-riyadh", name: "リヤド", lat: 24.7136, lon: 46.6753, tz: "Asia/Riyadh" },
      ]},
      { id: "tr", name: "トルコ", cities: [
        { id: "intl-tr-istanbul", name: "イスタンブール", lat: 41.0082, lon: 28.9784, tz: "Europe/Istanbul" },
        { id: "intl-tr-ankara", name: "アンカラ", lat: 39.9334, lon: 32.8597, tz: "Europe/Istanbul" },
      ]},
      { id: "il", name: "イスラエル", cities: [
        { id: "intl-il-telaviv", name: "テルアビブ", lat: 32.0853, lon: 34.7818, tz: "Asia/Jerusalem" },
      ]},
    ],
  },
  {
    id: "europe",
    name: "ヨーロッパ",
    countries: [
      { id: "uk", name: "イギリス", cities: [
        { id: "intl-uk-london", name: "ロンドン", lat: 51.5074, lon: -0.1278, tz: "Europe/London" },
        { id: "intl-uk-manchester", name: "マンチェスター", lat: 53.4808, lon: -2.2426, tz: "Europe/London" },
        { id: "intl-uk-edinburgh", name: "エディンバラ", lat: 55.9533, lon: -3.1883, tz: "Europe/London" },
      ]},
      { id: "fr", name: "フランス", cities: [
        { id: "intl-fr-paris", name: "パリ", lat: 48.8566, lon: 2.3522, tz: "Europe/Paris" },
        { id: "intl-fr-lyon", name: "リヨン", lat: 45.764, lon: 4.8357, tz: "Europe/Paris" },
        { id: "intl-fr-marseille", name: "マルセイユ", lat: 43.2965, lon: 5.3698, tz: "Europe/Paris" },
        { id: "intl-fr-nice", name: "ニース", lat: 43.7102, lon: 7.262, tz: "Europe/Paris" },
      ]},
      { id: "de", name: "ドイツ", cities: [
        { id: "intl-de-berlin", name: "ベルリン", lat: 52.52, lon: 13.405, tz: "Europe/Berlin" },
        { id: "intl-de-munich", name: "ミュンヘン", lat: 48.1351, lon: 11.582, tz: "Europe/Berlin" },
        { id: "intl-de-frankfurt", name: "フランクフルト", lat: 50.1109, lon: 8.6821, tz: "Europe/Berlin" },
        { id: "intl-de-hamburg", name: "ハンブルク", lat: 53.5511, lon: 9.9937, tz: "Europe/Berlin" },
      ]},
      { id: "it", name: "イタリア", cities: [
        { id: "intl-it-rome", name: "ローマ", lat: 41.9028, lon: 12.4964, tz: "Europe/Rome" },
        { id: "intl-it-milan", name: "ミラノ", lat: 45.4642, lon: 9.19, tz: "Europe/Rome" },
        { id: "intl-it-venice", name: "ベネチア", lat: 45.4408, lon: 12.3155, tz: "Europe/Rome" },
        { id: "intl-it-naples", name: "ナポリ", lat: 40.8518, lon: 14.2681, tz: "Europe/Rome" },
        { id: "intl-it-florence", name: "フィレンツェ", lat: 43.7696, lon: 11.2558, tz: "Europe/Rome" },
      ]},
      { id: "es", name: "スペイン", cities: [
        { id: "intl-es-madrid", name: "マドリード", lat: 40.4168, lon: -3.7038, tz: "Europe/Madrid" },
        { id: "intl-es-barcelona", name: "バルセロナ", lat: 41.3851, lon: 2.1734, tz: "Europe/Madrid" },
        { id: "intl-es-sevilla", name: "セビリア", lat: 37.3891, lon: -5.9845, tz: "Europe/Madrid" },
      ]},
      { id: "nl", name: "オランダ", cities: [
        { id: "intl-nl-amsterdam", name: "アムステルダム", lat: 52.3676, lon: 4.9041, tz: "Europe/Amsterdam" },
      ]},
      { id: "ch", name: "スイス", cities: [
        { id: "intl-ch-zurich", name: "チューリッヒ", lat: 47.3769, lon: 8.5417, tz: "Europe/Zurich" },
        { id: "intl-ch-geneva", name: "ジュネーブ", lat: 46.2044, lon: 6.1432, tz: "Europe/Zurich" },
      ]},
      { id: "at", name: "オーストリア", cities: [
        { id: "intl-at-vienna", name: "ウィーン", lat: 48.2082, lon: 16.3738, tz: "Europe/Vienna" },
      ]},
      { id: "be", name: "ベルギー", cities: [
        { id: "intl-be-brussels", name: "ブリュッセル", lat: 50.8503, lon: 4.3517, tz: "Europe/Brussels" },
      ]},
      { id: "se", name: "スウェーデン", cities: [
        { id: "intl-se-stockholm", name: "ストックホルム", lat: 59.3293, lon: 18.0686, tz: "Europe/Stockholm" },
      ]},
      { id: "no", name: "ノルウェー", cities: [
        { id: "intl-no-oslo", name: "オスロ", lat: 59.9139, lon: 10.7522, tz: "Europe/Oslo" },
      ]},
      { id: "fi", name: "フィンランド", cities: [
        { id: "intl-fi-helsinki", name: "ヘルシンキ", lat: 60.1699, lon: 24.9384, tz: "Europe/Helsinki" },
      ]},
      { id: "ru", name: "ロシア", cities: [
        { id: "intl-ru-moscow", name: "モスクワ", lat: 55.7558, lon: 37.6173, tz: "Europe/Moscow" },
        { id: "intl-ru-spb", name: "サンクトペテルブルク", lat: 59.9311, lon: 30.3609, tz: "Europe/Moscow" },
        { id: "intl-ru-east", name: "東部", lat: 62.0, lon: 130.0, tz: "Asia/Yakutsk" },
        { id: "intl-ru-west", name: "西部", lat: 56.0, lon: 38.0, tz: "Europe/Moscow" },
        { id: "intl-ru-north", name: "北部", lat: 67.0, lon: 80.0, tz: "Asia/Yekaterinburg" },
        { id: "intl-ru-south", name: "南部", lat: 45.0, lon: 40.0, tz: "Europe/Moscow" },
      ]},
    ],
  },
  {
    id: "north-america",
    name: "北米",
    countries: [
      { id: "us", name: "アメリカ", cities: [
        { id: "intl-us-ny", name: "ニューヨーク", lat: 40.7128, lon: -74.006, tz: "America/New_York" },
        { id: "intl-us-la", name: "ロサンゼルス", lat: 34.0522, lon: -118.2437, tz: "America/Los_Angeles" },
        { id: "intl-us-chicago", name: "シカゴ", lat: 41.8781, lon: -87.6298, tz: "America/Chicago" },
        { id: "intl-us-houston", name: "ヒューストン", lat: 29.7604, lon: -95.3698, tz: "America/Chicago" },
        { id: "intl-us-miami", name: "マイアミ", lat: 25.7617, lon: -80.1918, tz: "America/New_York" },
        { id: "intl-us-sf", name: "サンフランシスコ", lat: 37.7749, lon: -122.4194, tz: "America/Los_Angeles" },
        { id: "intl-us-seattle", name: "シアトル", lat: 47.6062, lon: -122.3321, tz: "America/Los_Angeles" },
        { id: "intl-us-vegas", name: "ラスベガス", lat: 36.1699, lon: -115.1398, tz: "America/Los_Angeles" },
        { id: "intl-us-east", name: "東部", lat: 39.0, lon: -77.0, tz: "America/New_York" },
        { id: "intl-us-west", name: "西部", lat: 37.0, lon: -122.0, tz: "America/Los_Angeles" },
        { id: "intl-us-north", name: "北部", lat: 47.0, lon: -100.0, tz: "America/Chicago" },
        { id: "intl-us-south", name: "南部", lat: 30.0, lon: -90.0, tz: "America/Chicago" },
      ]},
      { id: "ca", name: "カナダ", cities: [
        { id: "intl-ca-toronto", name: "トロント", lat: 43.6532, lon: -79.3832, tz: "America/Toronto" },
        { id: "intl-ca-vancouver", name: "バンクーバー", lat: 49.2827, lon: -123.1207, tz: "America/Vancouver" },
        { id: "intl-ca-montreal", name: "モントリオール", lat: 45.5017, lon: -73.5673, tz: "America/Toronto" },
        { id: "intl-ca-east", name: "東部", lat: 45.0, lon: -73.0, tz: "America/Toronto" },
        { id: "intl-ca-west", name: "西部", lat: 49.0, lon: -123.0, tz: "America/Vancouver" },
      ]},
      { id: "mx", name: "メキシコ", cities: [
        { id: "intl-mx-mexico", name: "メキシコシティ", lat: 19.4326, lon: -99.1332, tz: "America/Mexico_City" },
        { id: "intl-mx-cancun", name: "カンクン", lat: 21.1619, lon: -86.8515, tz: "America/Cancun" },
      ]},
    ],
  },
  {
    id: "south-america",
    name: "南米",
    countries: [
      { id: "br", name: "ブラジル", cities: [
        { id: "intl-br-saopaulo", name: "サンパウロ", lat: -23.5505, lon: -46.6333, tz: "America/Sao_Paulo" },
        { id: "intl-br-rio", name: "リオデジャネイロ", lat: -22.9068, lon: -43.1729, tz: "America/Sao_Paulo" },
        { id: "intl-br-brasilia", name: "ブラジリア", lat: -15.8267, lon: -47.9218, tz: "America/Sao_Paulo" },
        { id: "intl-br-east", name: "東部", lat: -8.0, lon: -35.0, tz: "America/Sao_Paulo" },
        { id: "intl-br-west", name: "西部", lat: -10.0, lon: -65.0, tz: "America/Manaus" },
        { id: "intl-br-north", name: "北部", lat: 0.0, lon: -60.0, tz: "America/Manaus" },
        { id: "intl-br-south", name: "南部", lat: -27.0, lon: -50.0, tz: "America/Sao_Paulo" },
      ]},
      { id: "ar", name: "アルゼンチン", cities: [
        { id: "intl-ar-buenosaires", name: "ブエノスアイレス", lat: -34.6037, lon: -58.3816, tz: "America/Argentina/Buenos_Aires" },
      ]},
      { id: "cl", name: "チリ", cities: [
        { id: "intl-cl-santiago", name: "サンティアゴ", lat: -33.4489, lon: -70.6693, tz: "America/Santiago" },
      ]},
      { id: "pe", name: "ペルー", cities: [
        { id: "intl-pe-lima", name: "リマ", lat: -12.0464, lon: -77.0428, tz: "America/Lima" },
      ]},
    ],
  },
  {
    id: "oceania",
    name: "オセアニア",
    countries: [
      { id: "au", name: "オーストラリア", cities: [
        { id: "intl-au-sydney", name: "シドニー", lat: -33.8688, lon: 151.2093, tz: "Australia/Sydney" },
        { id: "intl-au-melbourne", name: "メルボルン", lat: -37.8136, lon: 144.9631, tz: "Australia/Melbourne" },
        { id: "intl-au-brisbane", name: "ブリスベン", lat: -27.4698, lon: 153.0251, tz: "Australia/Brisbane" },
        { id: "intl-au-perth", name: "パース", lat: -31.9505, lon: 115.8605, tz: "Australia/Perth" },
        { id: "intl-au-goldcoast", name: "ゴールドコースト", lat: -28.0167, lon: 153.4, tz: "Australia/Brisbane" },
        { id: "intl-au-east", name: "東部", lat: -33.0, lon: 151.0, tz: "Australia/Sydney" },
        { id: "intl-au-west", name: "西部", lat: -31.0, lon: 115.0, tz: "Australia/Perth" },
        { id: "intl-au-north", name: "北部", lat: -12.0, lon: 132.0, tz: "Australia/Darwin" },
        { id: "intl-au-south", name: "南部", lat: -34.0, lon: 138.0, tz: "Australia/Adelaide" },
      ]},
      { id: "nz", name: "ニュージーランド", cities: [
        { id: "intl-nz-auckland", name: "オークランド", lat: -36.8485, lon: 174.7633, tz: "Pacific/Auckland" },
        { id: "intl-nz-wellington", name: "ウェリントン", lat: -41.2865, lon: 174.7762, tz: "Pacific/Auckland" },
        { id: "intl-nz-christchurch", name: "クライストチャーチ", lat: -43.5321, lon: 172.6362, tz: "Pacific/Auckland" },
      ]},
    ],
  },
  {
    id: "africa",
    name: "アフリカ",
    countries: [
      { id: "za", name: "南アフリカ", cities: [
        { id: "intl-za-capetown", name: "ケープタウン", lat: -33.9249, lon: 18.4241, tz: "Africa/Johannesburg" },
        { id: "intl-za-joburg", name: "ヨハネスブルグ", lat: -26.2041, lon: 28.0473, tz: "Africa/Johannesburg" },
      ]},
      { id: "eg", name: "エジプト", cities: [
        { id: "intl-eg-cairo", name: "カイロ", lat: 30.0444, lon: 31.2357, tz: "Africa/Cairo" },
      ]},
      { id: "ma", name: "モロッコ", cities: [
        { id: "intl-ma-casablanca", name: "カサブランカ", lat: 33.5731, lon: -7.5898, tz: "Africa/Casablanca" },
        { id: "intl-ma-marrakech", name: "マラケシュ", lat: 31.6295, lon: -7.9811, tz: "Africa/Casablanca" },
      ]},
      { id: "ke", name: "ケニア", cities: [
        { id: "intl-ke-nairobi", name: "ナイロビ", lat: -1.2921, lon: 36.8219, tz: "Africa/Nairobi" },
      ]},
    ],
  },
];

export function findContinent(id: string): IntlContinent | undefined {
  return INTL_CONTINENTS.find((c) => c.id === id);
}

export function findCountry(id: string): { continent: IntlContinent; country: IntlCountry } | undefined {
  for (const c of INTL_CONTINENTS) {
    const country = c.countries.find((cc) => cc.id === id);
    if (country) return { continent: c, country };
  }
  return undefined;
}

export function findIntlCity(id: string): { country: IntlCountry; city: IntlCity } | undefined {
  for (const c of INTL_CONTINENTS) {
    for (const country of c.countries) {
      const city = country.cities.find((cc) => cc.id === id);
      if (city) return { country, city };
    }
  }
  return undefined;
}

export const ALL_INTL_CITIES = INTL_CONTINENTS.flatMap((c) =>
  c.countries.flatMap((country) =>
    country.cities.map((city) => ({
      ...city,
      countryName: country.name,
      countryId: country.id,
    }))
  )
);
