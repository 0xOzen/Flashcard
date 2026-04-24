import { GrammarSection, GrammarSource, GrammarTopic } from './types';

function topic(data: Omit<GrammarTopic, 'id'>): GrammarTopic {
  return {
    id: `grammar-${data.chapter}`,
    ...data,
  };
}

export const GRAMMAR_SOURCES: GrammarSource[] = [
  {
    id: 'lingolia-grammar',
    title: 'Deutsche Grammatik',
    url: 'https://deutsch.lingolia.com/de/grammatik',
    provider: 'Lingolia',
  },
  {
    id: 'lingolia-verben',
    title: 'Verben im Deutschen',
    url: 'https://deutsch.lingolia.com/de/grammatik/verben',
    provider: 'Lingolia',
  },
  {
    id: 'lingolia-zeiten',
    title: 'Deutsche Zeitformen',
    url: 'https://deutsch.lingolia.com/de/grammatik/zeitformen',
    provider: 'Lingolia',
  },
  {
    id: 'lingolia-modalverben',
    title: 'Modalverben',
    url: 'https://deutsch.lingolia.com/de/grammatik/verben/modalverben',
    provider: 'Lingolia',
  },
  {
    id: 'lingolia-trennbare',
    title: 'Trennbare und untrennbare Verben',
    url: 'https://deutsch.lingolia.com/de/grammatik/verben/trennbare',
    provider: 'Lingolia',
  },
  {
    id: 'lingolia-reflexive',
    title: 'Reflexive Verben',
    url: 'https://deutsch.lingolia.com/de/grammatik/verben/reflexive',
    provider: 'Lingolia',
  },
  {
    id: 'lingolia-passiv',
    title: 'Das Passiv',
    url: 'https://deutsch.lingolia.com/de/grammatik/verben/passiv',
    provider: 'Lingolia',
  },
  {
    id: 'lingolia-konjunktiv',
    title: 'Konjunktiv I und II',
    url: 'https://deutsch.lingolia.com/de/grammatik/verben/konjunktiv',
    provider: 'Lingolia',
  },
  {
    id: 'lingolia-cases',
    title: 'Verwendung der 4 deutschen Fälle',
    url: 'https://deutsch.lingolia.com/de/grammatik/deklination/nominativ',
    provider: 'Lingolia',
  },
  {
    id: 'lingolia-nomen',
    title: 'Deklination von Nomen und Artikeln',
    url: 'https://deutsch.lingolia.com/de/grammatik/nomen/deklination',
    provider: 'Lingolia',
  },
  {
    id: 'lingolia-pronomen',
    title: 'Pronomen',
    url: 'https://deutsch.lingolia.com/de/grammatik/pronomen',
    provider: 'Lingolia',
  },
  {
    id: 'lingolia-possessiv',
    title: 'Possessivpronomen und Possessivartikel',
    url: 'https://deutsch.lingolia.com/de/grammatik/pronomen/possessivpronomen',
    provider: 'Lingolia',
  },
  {
    id: 'lingolia-indefinit',
    title: 'Indefinitpronomen',
    url: 'https://deutsch.lingolia.com/de/grammatik/pronomen/indefinitpronomen',
    provider: 'Lingolia',
  },
  {
    id: 'lingolia-es',
    title: 'Verwendung von es',
    url: 'https://deutsch.lingolia.com/de/grammatik/pronomen/es',
    provider: 'Lingolia',
  },
  {
    id: 'lingolia-adjektive',
    title: 'Adjektive',
    url: 'https://deutsch.lingolia.com/de/grammatik/adjektive',
    provider: 'Lingolia',
  },
  {
    id: 'lingolia-adj-deklination',
    title: 'Adjektivdeklination',
    url: 'https://deutsch.lingolia.com/de/grammatik/adjektive/deklination',
    provider: 'Lingolia',
  },
  {
    id: 'lingolia-zahlen',
    title: 'Zahlen, Datum und Uhrzeit',
    url: 'https://deutsch.lingolia.com/de/wortschatz/zahlen-datum-uhrzeit',
    provider: 'Lingolia',
  },
  {
    id: 'lingolia-praepositionen',
    title: 'Präpositionen',
    url: 'https://deutsch.lingolia.com/de/grammatik/praepositionen',
    provider: 'Lingolia',
  },
  {
    id: 'lingolia-satzbau',
    title: 'Der Satzbau',
    url: 'https://deutsch.lingolia.com/de/grammatik/satzbau',
    provider: 'Lingolia',
  },
  {
    id: 'lingolia-negation',
    title: 'Verneinung mit nicht und kein',
    url: 'https://deutsch.lingolia.com/de/grammatik/satzbau/verneinung',
    provider: 'Lingolia',
  },
  {
    id: 'lingolia-nebensaetze',
    title: 'Nebensätze',
    url: 'https://deutsch.lingolia.com/de/grammatik/satzbau/nebensaetze',
    provider: 'Lingolia',
  },
  {
    id: 'lingolia-konjunktionalsaetze',
    title: 'Konjunktionalsätze',
    url: 'https://deutsch.lingolia.com/de/grammatik/satzbau/nebensaetze/konjunktionalsaetze',
    provider: 'Lingolia',
  },
  {
    id: 'lingolia-relativsaetze',
    title: 'Relativsätze',
    url: 'https://deutsch.lingolia.com/de/grammatik/satzbau/nebensaetze/relativsaetze',
    provider: 'Lingolia',
  },
  {
    id: 'lingolia-infinitivsaetze',
    title: 'Infinitivsätze',
    url: 'https://deutsch.lingolia.com/de/grammatik/satzbau/nebensaetze/infinitivsaetze',
    provider: 'Lingolia',
  },
  {
    id: 'lingolia-indirekte-fragen',
    title: 'Indirekte Fragen',
    url: 'https://deutsch.lingolia.com/de/grammatik/satzbau/nebensaetze/indirekte-fragen',
    provider: 'Lingolia',
  },
  {
    id: 'lingolia-stehen-liegen',
    title: 'stehen/liegen/sitzen und ihre Bewegungsverben',
    url: 'https://deutsch.lingolia.com/de/wortschatz/verwechselbar/stehen-liegen-sitzen',
    provider: 'Lingolia',
  },
  {
    id: 'grammis-wortbildung',
    title: 'Wortbildung',
    url: 'https://grammis.ids-mannheim.de/sgt/2244?termini=term',
    provider: 'IDS Grammis',
  },
  {
    id: 'grammis-derivation',
    title: 'Derivation',
    url: 'https://grammis.ids-mannheim.de/systematische-grammatik/631',
    provider: 'IDS Grammis',
  },
  {
    id: 'dg20-komposition',
    title: 'Die Komposition',
    url: 'https://deutschegrammatik20.de/wortbildung/die-komposition/',
    provider: 'Deutsche Grammatik 2.0',
  },
];

export const GRAMMAR_SECTIONS: GrammarSection[] = [
  {
    id: 'verben',
    title: 'Verben',
    titleTr: 'Fiiller',
    color: '#2f7d4a',
    accentClassName: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    summary: 'Zamanlar, modal yapılar, çatı ve fiil yerleşimi için temel omurga.',
    sourceIds: [
      'lingolia-verben',
      'lingolia-zeiten',
      'lingolia-modalverben',
      'lingolia-trennbare',
      'lingolia-reflexive',
      'lingolia-passiv',
      'lingolia-konjunktiv',
      'lingolia-stehen-liegen',
    ],
  },
  {
    id: 'nomen-artikel-pronomen',
    title: 'Nomen, Artikel, Pronomen',
    titleTr: 'İsimler, Artikeller ve Zamirler',
    color: '#4e6f67',
    accentClassName: 'border-teal-200 bg-teal-50 text-teal-700',
    summary: 'Cinsiyet, çoğul, hâl ve gönderim ilişkilerini oturtan bölüm.',
    sourceIds: [
      'lingolia-cases',
      'lingolia-nomen',
      'lingolia-pronomen',
      'lingolia-possessiv',
      'lingolia-indefinit',
      'lingolia-es',
    ],
  },
  {
    id: 'adjektive-adverbien',
    title: 'Adjektive und Adverbien',
    titleTr: 'Sıfatlar ve Zarflar',
    color: '#7c3a44',
    accentClassName: 'border-rose-200 bg-rose-50 text-rose-700',
    summary: 'Niteliği, karşılaştırmayı ve zaman-sıklık gibi bilgileri netleştirir.',
    sourceIds: [
      'lingolia-adjektive',
      'lingolia-adj-deklination',
      'lingolia-zahlen',
    ],
  },
  {
    id: 'praepositionen',
    title: 'Präpositionen',
    titleTr: 'Edatlar',
    color: '#6a4c93',
    accentClassName: 'border-violet-200 bg-violet-50 text-violet-700',
    summary: 'Kasus seçimini ve yer-zaman ilişkisini belirleyen kısa ama kritik kelimeler.',
    sourceIds: ['lingolia-praepositionen', 'lingolia-cases', 'lingolia-stehen-liegen'],
  },
  {
    id: 'wortbildung',
    title: 'Wortbildung',
    titleTr: 'Kelime Türetme',
    color: '#2274a5',
    accentClassName: 'border-sky-200 bg-sky-50 text-sky-700',
    summary: 'Yeni kelimeyi kök, ek ve birleşim mantığıyla çözmeyi öğretir.',
    sourceIds: ['grammis-wortbildung', 'grammis-derivation', 'dg20-komposition'],
  },
  {
    id: 'einfache-saetze',
    title: 'Einfache Sätze, Negation',
    titleTr: 'Basit Cümleler ve Olumsuzluk',
    color: '#d17b0f',
    accentClassName: 'border-amber-200 bg-amber-50 text-amber-700',
    summary: 'Soru kurma, cümle omurgası, Satzklammer ve nicht/kein düzeni.',
    sourceIds: ['lingolia-satzbau', 'lingolia-negation'],
  },
  {
    id: 'zusammengesetzte-saetze',
    title: 'Zusammengesetzte Sätze',
    titleTr: 'Birleşik Cümleler',
    color: '#8f3b76',
    accentClassName: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700',
    summary: 'Bağlaçlar, yan cümleler, ilgi cümleleri ve dolaylı sorular.',
    sourceIds: [
      'lingolia-satzbau',
      'lingolia-nebensaetze',
      'lingolia-konjunktionalsaetze',
      'lingolia-relativsaetze',
      'lingolia-infinitivsaetze',
      'lingolia-indirekte-fragen',
    ],
  },
];

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  topic({
    chapter: 1,
    sectionId: 'verben',
    title: 'Verben und Personalpronomen',
    titleTr: 'Fiiller ve kişi zamirleri',
    levels: ['A1'],
    summary: 'Almancada fiil çekimi özneye göre değişir. Bu yüzden her yeni fiili kişi zamirleriyle birlikte düşünmek, doğru cümle kurmanın ilk adımıdır.',
    pattern: 'ich/wir -e/-en, du -st, er/sie/es -t, ihr -t, sie/Sie -en',
    highlights: [
      'Özne çoğu zaman cümlede açıkça görünür ve fiil ona göre çekimlenir.',
      'Kişi zamirleri: ich, du, er, sie, es, wir, ihr, sie/Sie.',
      'Düzenli fiillerde kök genelde sabit kalır, son ekler kişi bilgisi taşır.',
    ],
    examples: [
      { de: 'Ich wohne in Berlin, und wir lernen zusammen.', tr: 'Ben Berlin’de oturuyorum ve biz birlikte öğreniyoruz.' },
    ],
    pitfalls: [
      'Türkçedeki gibi özneyi her zaman düşürme alışkanlığı Almancada hataya yol açabilir.',
      'sie ve Sie aynı yazılsa da biri onlar, diğeri resmî siz anlamındadır.',
    ],
  }),
  topic({
    chapter: 2,
    sectionId: 'verben',
    title: 'Verben mit Vokalwechsel im Präsens',
    titleTr: 'Şimdiki zamanda kök ünlüsü değişen fiiller',
    levels: ['A1'],
    summary: 'Bazı güçlü fiiller Präsens çekiminde özellikle du ve er/sie/es formlarında kök seslisini değiştirir. Bu değişim anlamı değil, doğru çekimi belirler.',
    pattern: 'fahren -> du fährst, er fährt | lesen -> du liest, er liest',
    highlights: [
      'En yaygın değişimler a -> ä, e -> i ve e -> ie biçimindedir.',
      'Değişim çoğunlukla sadece du ile er/sie/es çekimlerinde görülür.',
      'wir ve sie/Sie formlarında genelde infinitiv kökü korunur.',
    ],
    examples: [
      { de: 'Er fährt heute mit dem Bus, aber wir fahren mit dem Zug.', tr: 'O bugün otobüsle gidiyor ama biz trenle gidiyoruz.' },
    ],
    pitfalls: [
      'Fiilin yazımını her kişi için aynı bırakmak sık görülen bir A1 hatasıdır.',
      'Sesli değişimi olan fiiller de yine normal kişi sonlarını alır.',
    ],
  }),
  topic({
    chapter: 3,
    sectionId: 'verben',
    title: 'Trennbare und nicht trennbare Verben',
    titleTr: 'Ayrılabilen ve ayrılamayan fiiller',
    levels: ['A1'],
    summary: 'Önekli fiillerde anlam kadar söz dizimi de değişir. Ayrılabilen fiillerde önek ana cümlede sona gider; ayrılamayanlarda fiil blok hâlinde kalır.',
    pattern: 'Ich stehe um 7 Uhr auf. | Ich verstehe die Frage nicht.',
    highlights: [
      'ab-, an-, auf-, aus-, mit-, nach-, vor-, zu- gibi birçok önek ayrılabilirdir.',
      'be-, emp-, ent-, er-, ge-, miss-, ver-, zer- önekleri genelde ayrılmaz.',
      'Perfektte ayrılabilen fiillerin ge- eki önek ile fiil arasına girer: aufgestanden.',
    ],
    examples: [
      { de: 'Der Zug kommt spät an, aber ich verstehe den Plan trotzdem.', tr: 'Tren geç varıyor ama ben planı yine de anlıyorum.' },
    ],
    pitfalls: [
      'Ana cümlede ayrılabilen öneki fiilin yanında bırakmak yanlıştır.',
      'Aynı önek bazen iki farklı fiilde farklı davranabilir: umfahren / umfährt.',
    ],
  }),
  topic({
    chapter: 4,
    sectionId: 'verben',
    title: 'Die Verben sein und haben',
    titleTr: 'sein ve haben fiilleri',
    levels: ['A1'],
    summary: 'sein ve haben hem bağımsız anlam taşıyan temel fiillerdir hem de birleşik zamanların kurulmasında yardımcı fiil olarak görev yapar.',
    pattern: 'Ich bin müde. | Ich habe ein Buch. | Ich habe gelesen. | Ich bin gekommen.',
    highlights: [
      'sein durum, kimlik, meslek ve yer bildirmede çok kullanılır.',
      'haben sahiplik, yaş ve bazı sabit kalıplarda temel fiildir.',
      'Perfekt kurarken hangi yardımcı fiilin seçileceği ayrıca öğrenilmelidir.',
    ],
    examples: [
      { de: 'Wir sind heute zu Hause und haben viel Zeit.', tr: 'Bugün evdeyiz ve çok vaktimiz var.' },
    ],
    pitfalls: [
      'Yaş belirtirken Almancada sein değil haben kullanılır: Ich habe 20 Jahre.',
      'Her Perfekt cümlesini otomatik olarak haben ile kurmak doğru değildir.',
    ],
  }),
  topic({
    chapter: 5,
    sectionId: 'verben',
    title: 'Modalverben 1',
    titleTr: 'Modal fiiller 1',
    levels: ['A1'],
    summary: 'Modalverben, ana fiilin anlamını niyet, zorunluluk, izin veya yetenek açısından değiştirir. A1 seviyesinde özellikle Präsens kullanımı temel yapı olarak oturmalıdır.',
    pattern: 'Subjekt + Modalverb + ... + Infinitiv',
    highlights: [
      'Temel modal fiiller: können, müssen, wollen, sollen, dürfen, mögen.',
      'Modal fiil çekimlenir, asıl fiil yalın infinitiv olarak sona gider.',
      'Günlük konuşmada yetenek, izin ve zorunluluk anlatımında çok sık kullanılır.',
    ],
    examples: [
      { de: 'Ich kann heute nicht kommen, aber ich muss morgen arbeiten.', tr: 'Bugün gelemem ama yarın çalışmak zorundayım.' },
    ],
    pitfalls: [
      'İkinci fiili çekimlemek yerine infinitiv bırakmak gerekir.',
      'mögen ve möchten işlev olarak yakın olsa da aynı yapı değildir.',
    ],
  }),
  topic({
    chapter: 6,
    sectionId: 'verben',
    title: 'Modalverben 2',
    titleTr: 'Modal fiiller 2',
    levels: ['A1', 'A2'],
    summary: 'Bu bölüm modal fiillerin daha ince anlam farklarını ve bağlama göre nasıl yumuşak ya da resmî ton oluşturduğunu gösterir.',
    pattern: 'dürfen = izin | sollen = başkasının beklentisi | möchten = kibar istek',
    highlights: [
      'dürfen izin, yasak ve kurallarla ilgilidir.',
      'sollen tavsiye, görev veya başkasından gelen beklenti verir.',
      'möchten özellikle sipariş ve ricada en doğal yapılardan biridir.',
    ],
    examples: [
      { de: 'Darf ich hier sitzen, oder soll ich dort warten?', tr: 'Burada oturabilir miyim, yoksa orada mı beklemeliyim?' },
    ],
    pitfalls: [
      'müssen ile sollen karıştırıldığında cümlenin sorumluluk kaynağı değişir.',
      'Modal fiilsiz kibar istekler daha sert duyulabilir.',
    ],
  }),
  topic({
    chapter: 7,
    sectionId: 'verben',
    title: 'Imperativ',
    titleTr: 'Emir kipi',
    levels: ['A1'],
    summary: 'Imperativ, doğrudan rica, talimat veya uyarı vermek için kullanılır. Almancada du, ihr, Sie ve wir için ayrı biçimler vardır.',
    pattern: 'Komm! | Kommt! | Kommen Sie! | Gehen wir!',
    highlights: [
      'du formunda zamir genelde kullanılmaz ve kök bazen sadeleşir.',
      'ihr formu çoğu zaman Präsens ihr biçimiyle aynıdır ama ihr zamiri düşer.',
      'Sie formunda fiil infinitiv kalır ve ardından Sie gelir.',
    ],
    examples: [
      { de: 'Bitte machen Sie das Fenster zu und kommen Sie herein.', tr: 'Lütfen pencereyi kapatın ve içeri buyurun.' },
    ],
    pitfalls: [
      'Resmî konuşmada du-Imperativ kullanmak kaba olabilir.',
      'Ayrılabilen fiillerde önek Imperativde de görünür: Steh bitte auf.',
    ],
  }),
  topic({
    chapter: 8,
    sectionId: 'verben',
    title: 'Partizip Perfekt und Perfekt mit haben',
    titleTr: 'Partizip II ve haben ile Perfekt',
    levels: ['A1', 'A2'],
    summary: 'Perfekt, konuşma dilinde geçmiş anlatımın ana zamanıdır. Birçok fiil haben + Partizip II ile kurulur.',
    pattern: 'haben + Partizip II',
    highlights: [
      'Düzenli fiillerde Partizip II çoğunlukla ge- ... -t biçimindedir: gemacht.',
      'Geçişli fiiller ve birçok eylem fiili Perfektte haben alır.',
      'Konuşmada tamamlanmış geçmiş olayları anlatırken çok yaygındır.',
    ],
    examples: [
      { de: 'Er hat gestern seine Freundin angerufen und lange gesprochen.', tr: 'O dün kız arkadaşını aradı ve uzun süre konuştu.' },
    ],
    pitfalls: [
      'Perfektte cümle sonuna Partizip II gelir; ana fiili ortada bırakmak yanlış olur.',
      'Ön eki ayrılmayan ya da -ieren ile biten fiillerde ge- kullanılmaz.',
    ],
  }),
  topic({
    chapter: 9,
    sectionId: 'verben',
    title: 'Perfekt mit sein, Plusquamperfekt',
    titleTr: 'sein ile Perfekt ve Plusquamperfekt',
    levels: ['A1', 'A2'],
    summary: 'Hareket veya durum değişimi bildiren birçok fiil Perfektte sein alır. Plusquamperfekt ise geçmişin daha da öncesini anlatır.',
    pattern: 'sein + Partizip II | hatte/war + Partizip II',
    highlights: [
      'gehen, kommen, werden, einschlafen gibi fiiller çoğunlukla sein ile kurulur.',
      'Plusquamperfekt, geçmişteki başka bir olaya göre daha önce gerçekleşen eylemi verir.',
      'Anlatıda zaman sırası kurmak için Perfekt, Präteritum ve Plusquamperfekt birlikte kullanılabilir.',
    ],
    examples: [
      { de: 'Ich bin früh gegangen, weil ich schon viel gearbeitet hatte.', tr: 'Erken ayrıldım çünkü zaten çok çalışmıştım.' },
    ],
    pitfalls: [
      'Her hareket fiili otomatik olarak sein almaz; nesne alan bazı kullanımlar haben isteyebilir.',
      'Plusquamperfekt, tek başına değil genellikle başka bir geçmiş referansla anlam kazanır.',
    ],
  }),
  topic({
    chapter: 10,
    sectionId: 'verben',
    title: 'Präteritum',
    titleTr: 'Präteritum',
    levels: ['A1', 'A2', 'B1'],
    summary: 'Präteritum yazı dilinde ve hikâye anlatımında önemli geçmiş zamandır. Günlük konuşmada ise en çok sein, haben ve modal fiillerle duyulur.',
    pattern: 'ich machte | ich ging | ich war | ich hatte',
    highlights: [
      'Yazılı anlatıda olay dizisini akıcı şekilde vermek için kullanılır.',
      'Düzenli fiillerde -te eki, güçlü fiillerde kök değişimi görülür.',
      'sein, haben ve modalverben konuşma dilinde de çok yaygın şekilde Präteritum kullanır.',
    ],
    examples: [
      { de: 'Er musste zum Arzt, und danach rief er mich an.', tr: 'Doktora gitmek zorundaydı ve sonra beni aradı.' },
    ],
    pitfalls: [
      'Her konuşma geçmişini Präteritumla kurmak doğal olmayabilir; çoğu durumda Perfekt tercih edilir.',
      'Güçlü fiillerin Präteritum biçimleri ezber gerektirir.',
    ],
  }),
  topic({
    chapter: 11,
    sectionId: 'verben',
    title: 'Zukunft und Futur I',
    titleTr: 'Gelecek ve Futur I',
    levels: ['A1', 'A2', 'B1'],
    summary: 'Almancada gelecek çoğu zaman Präsens ile ifade edilir. Futur I ise özellikle planı vurgulamak, tahmin yapmak veya zamanı açıklaştırmak için kullanılır.',
    pattern: 'werden + Infinitiv',
    highlights: [
      'Takvim, saat veya bağlam belliyse Präsens tek başına gelecek anlamı taşıyabilir.',
      'Futur I resmî anlatıda ve tahmin cümlelerinde daha sık görünür.',
      'werden yardımcı fiili çekimlenir, ana fiil infinitiv olarak sona gider.',
    ],
    examples: [
      { de: 'Morgen komme ich zu dir, und wir werden viel Spaß haben.', tr: 'Yarın sana geliyorum ve çok eğleneceğiz.' },
    ],
    pitfalls: [
      'Her gelecek cümlesinde Futur I zorunlu değildir.',
      'werden fiilinin hem gelecek, hem değişim, hem de pasif kurma işlevi olduğunu unutma.',
    ],
  }),
  topic({
    chapter: 12,
    sectionId: 'verben',
    title: 'Passiv',
    titleTr: 'Edilgen çatı',
    levels: ['B1'],
    summary: 'Passiv, işi yapan kişiden çok yapılan eylemi öne çıkarmak için kullanılır. Özellikle süreç anlatımında werden + Partizip II temel yapıdır.',
    pattern: 'Subjekt + werden + Partizip II',
    highlights: [
      'Vorgangspassiv eylemin oluş sürecini vurgular: Das Haus wird gebaut.',
      'Eylemi yapan gerekirse von + Dativ ile eklenebilir.',
      'Birçok pasif cümle aktif cümledeki Akkusativ nesneden türetilir.',
    ],
    examples: [
      { de: 'Mein E-Bike wird gerade gebaut.', tr: 'E-bikem şu anda yapılıyor.' },
    ],
    pitfalls: [
      'Pasif kurarken yardımcı olarak sein değil çoğu durumda werden kullanılır.',
      'Her fiille normal pasif kurulamaz; özellikle nesnesiz fiillerde dikkat gerekir.',
    ],
  }),
  topic({
    chapter: 13,
    sectionId: 'verben',
    title: 'Konjunktiv II',
    titleTr: 'Dilek-olasılık kipi',
    levels: ['A2'],
    summary: 'Konjunktiv II, gerçek dışı durum, kibar rica, tavsiye ve hayal anlatımında kullanılır. Günlük dilde würde yapısı çok yaygındır.',
    pattern: 'ich wäre / hätte / könnte / würde + Infinitiv',
    highlights: [
      'Kibar isteklerde modal fiillerin Konjunktiv II biçimleri çok doğaldır: könnte, würde.',
      'Gerçek dışı şart cümlelerinde wenn ile sık kullanılır.',
      'sein ve haben fiillerinin özel biçimleri sık ezberlenir: wäre, hätte.',
    ],
    examples: [
      { de: 'Ich würde gern zum Mars fliegen, wenn das möglich wäre.', tr: 'Mümkün olsaydı Mars’a uçmak isterdim.' },
    ],
    pitfalls: [
      'würde + Infinitiv her fiilde mümkün olsa da hätte/wäre gibi yerleşik biçimler daha doğaldır.',
      'Konjunktiv II ile Futur I işlevini karıştırma.',
    ],
  }),
  topic({
    chapter: 14,
    sectionId: 'verben',
    title: 'Verben und Kasus: Nominativ, Akkusativ, Dativ',
    titleTr: 'Fiiller ve hâller: Nominativ, Akkusativ, Dativ',
    levels: ['A1'],
    summary: 'Fiilin hangi tamamlayıcıyı istediği, artikeli ve zamiri doğrudan etkiler. Bu yüzden fiili her zaman aldığı kasus ile öğrenmek gerekir.',
    pattern: 'jemanden sehen | jemandem helfen | jemandem etwas schenken',
    highlights: [
      'Nominativ özneyi, Akkusativ çoğu zaman doğrudan nesneyi, Dativ ise dolaylı nesneyi gösterir.',
      'Bazı fiiller sadece Dativ ister: helfen, danken, gefallen.',
      'Bazı fiiller hem Dativ hem Akkusativ alır: geben, schicken, zeigen, schenken.',
    ],
    examples: [
      { de: 'Iris schenkt ihrem Freund gerne Blumen.', tr: 'Iris arkadaşına memnuniyetle çiçek veriyor.' },
    ],
    pitfalls: [
      'Türkçedeki ek mantığını bire bir aktarmak yerine fiil kalıbını ezberlemek gerekir.',
      'Kişi zamirlerinde Kasus değişimi daha görünürdür: ich -> mich / mir.',
    ],
  }),
  topic({
    chapter: 15,
    sectionId: 'verben',
    title: 'Reflexive und reziproke Verben',
    titleTr: 'Dönüşlü ve karşılıklı fiiller',
    levels: ['A2'],
    summary: 'Reflexive fiillerde özne eylemi kendine yöneltir; reziproke kullanımlarda ise kişiler eylemi birbirlerine yapar.',
    pattern: 'sich freuen | sich beeilen | sich treffen',
    highlights: [
      'Reflexivpronomen kişiye göre değişir: mich, dich, sich, uns, euch, sich.',
      'Bazı fiiller her zaman reflexivdir, bazıları bağlama göre reflexiv olur.',
      'Reziprok anlam çoğu zaman çoğul öznelerle ortaya çıkar: Wir treffen uns.',
    ],
    examples: [
      { de: 'Jens hat sich sehr über die Blumen gefreut.', tr: 'Jens çiçeklere çok sevindi.' },
    ],
    pitfalls: [
      'sich zamirini düşürmek, fiilin anlamını tamamen bozabilir.',
      'Akkusativ ve Dativ reflexiv kullanımını fiile göre ayırmak gerekir.',
    ],
  }),
  topic({
    chapter: 16,
    sectionId: 'verben',
    title: 'liegen - legen, stellen - stehen, setzen - sitzen, hängen - hängen',
    titleTr: 'Durum ve hareket fiilleri',
    levels: ['A2'],
    summary: 'Bu fiil çiftleri bir nesnenin nerede durduğunu ya da nereye yerleştirildiğini ayırır. Yer bildirimi çoğu zaman Dativ, yön bildirimi ise Akkusativ ile gelir.',
    pattern: 'Das Buch liegt auf dem Tisch. | Ich lege das Buch auf den Tisch.',
    highlights: [
      'stehen/liegen/sitzen bir konumu, stellen/legen/setzen ise o konuma yerleştirmeyi anlatır.',
      'hängen hem durum hem hareket anlamında kullanılabilir; bağlam önemlidir.',
      'Yer sorusu Wo? ise çoğu zaman Dativ, yön sorusu Wohin? ise Akkusativ gelir.',
    ],
    examples: [
      { de: 'Er hat die Blumen in eine Vase gestellt, und jetzt stehen sie auf dem Tisch.', tr: 'Çiçekleri vazoya koydu ve şimdi masanın üstünde duruyorlar.' },
    ],
    pitfalls: [
      'Nesne taşınmıyorsa hareket fiili değil durum fiili seçilmelidir.',
      'Bazı özel nesnelerde doğal kullanım ezbere dayanır: Teller stehen auf dem Tisch.',
    ],
  }),
  topic({
    chapter: 17,
    sectionId: 'verben',
    title: 'Besondere Verben',
    titleTr: 'Özel fiil yapıları',
    levels: ['A1', 'A2', 'B1'],
    summary: 'Bazı yaygın fiiller standart çekimin ötesinde kalıplaşmış yapılar kurar. Bu bölüm özellikle lassen gibi iş yaptırma ve hizmet alma kalıplarına odaklanır.',
    pattern: 'lassen + Akkusativ + Infinitiv',
    highlights: [
      'lassen, bir işi yaptırmayı ya da bir hizmet almayı anlatır: Ich lasse mir die Haare schneiden.',
      'Bazı fiiller başka bir fiille birlikte kalıplaşmış anlam üretir ve tek tek çevrilmemelidir.',
      'Günlük Almancada bu yapılar çok doğaldır ve daha ileri seviyeye geçişte hız kazandırır.',
    ],
    examples: [
      { de: 'Nächste Woche lasse ich mir die Haare schneiden.', tr: 'Gelecek hafta saçımı kestireceğim.' },
    ],
    pitfalls: [
      'lassen yapısında işi yapan özne değil, başkasıdır; çeviriyi buna göre kurmak gerekir.',
      'Kalıpları kelime kelime çevirmek çoğu zaman yanlış tona götürür.',
    ],
  }),
  topic({
    chapter: 18,
    sectionId: 'nomen-artikel-pronomen',
    title: 'Nomen: Pluralformen',
    titleTr: 'İsimlerde çoğul yapıları',
    levels: ['A1'],
    summary: 'Almancada çoğul tek bir kuralla kurulmaz. Bu yüzden her ismi artikeliyle ve mümkünse çoğuluyla birlikte öğrenmek en güvenli yöntemdir.',
    pattern: '-e, -er, -en/-n, -s, null plural + bazen Umlaut',
    highlights: [
      'Çoğul ekleri kelimenin sonuna ve kökenine göre değişir.',
      'Birçok tek heceli isim çoğulda umlaut alabilir: Buch -> Bücher.',
      'Bazı isimlerde hiç ek değişmez, sadece artikel die olur.',
    ],
    examples: [
      { de: 'Bitte stell die Gläser und Getränke auf die Tische.', tr: 'Lütfen bardakları ve içecekleri masalara koy.' },
    ],
    pitfalls: [
      'Çoğul artikeli her zaman die olsa da isim sonu ezber gerektirir.',
      'Dativ pluralde çoğu zaman ek olarak -n gelir: mit den Kindern.',
    ],
  }),
  topic({
    chapter: 19,
    sectionId: 'nomen-artikel-pronomen',
    title: 'Deklination: Nomen und Personalpronomen',
    titleTr: 'İsim ve kişi zamiri çekimi',
    levels: ['A1', 'A2'],
    summary: 'Kasus değiştikçe artikeller ve özellikle kişi zamirleri biçim değiştirir. Kimin ne yaptığı ve kime ne yapıldığı bu değişimle netleşir.',
    pattern: 'ich -> mich -> mir | der Nachbar -> den Nachbarn -> dem Nachbarn',
    highlights: [
      'Kişi zamirleri kasus değişiminde isimlerden daha belirgin biçim değiştirir.',
      'Bazı eril isimler n-Deklination alır: der Nachbar, den Nachbarn, dem Nachbarn.',
      'Cümlede fiil, preposition ve anlam ilişkisi hangi hâlin gerektiğini belirler.',
    ],
    examples: [
      { de: 'Lisa kann ihren Nachbarn nicht leiden, aber er hilft ihr trotzdem.', tr: 'Lisa komşusunu sevmez ama o yine de ona yardım eder.' },
    ],
    pitfalls: [
      'Özneyi Akkusativ veya Dativ biçiminde kullanmak cümleyi bozar.',
      'n-Deklination alan isimler çoğul gibi görünse de tekil olabilir.',
    ],
  }),
  topic({
    chapter: 20,
    sectionId: 'nomen-artikel-pronomen',
    title: 'Nomen und Artikel: bestimmt - unbestimmt',
    titleTr: 'Belirli ve belirsiz artikel',
    levels: ['A1'],
    summary: 'Bir şeyi ilk kez tanıtırken çoğu zaman unbestimmter Artikel, daha sonra artık bilinen bir şeyden söz ederken bestimmter Artikel kullanılır.',
    pattern: 'ein Baum -> der Baum',
    highlights: [
      'ein/eine yeni ya da genel bir nesneyi tanıtır.',
      'der/die/das daha önce bilinen, tanımlı veya bağlamda net nesneyi gösterir.',
      'Metin içinde bilgi akışını takip etmek için artikel seçimi çok önemlidir.',
    ],
    examples: [
      { de: 'Im Garten steht ein Baum. Der Baum ist 100 Jahre alt.', tr: 'Bahçede bir ağaç var. Ağaç 100 yaşında.' },
    ],
    pitfalls: [
      'Türkçede artikel olmadığı için Almancada bunları atlamak sık hataya yol açar.',
      'Belirli artikel yalnızca tanıdık nesne değil, tekil ve eşsiz nesnelerde de kullanılır.',
    ],
  }),
  topic({
    chapter: 21,
    sectionId: 'nomen-artikel-pronomen',
    title: 'Possessivartikel und -pronomen und kein als Pronomen',
    titleTr: 'İyelik belirteçleri, iyelik zamirleri ve kein',
    levels: ['A1', 'A2'],
    summary: 'Possessivartikel ismin önünde gelir, possessivpronomen ise ismi tamamen değiştirir. kein de bazen artikel gibi, bazen zamir gibi çalışır.',
    pattern: 'mein Nachbar | meiner | kein Nachbar | keiner',
    highlights: [
      'mein, dein, sein, ihr, unser, euer gibi kökler sahiplik belirtir.',
      'Artikel kullanımında isim gelir; pronomen kullanımında isim düşer.',
      'kein, belirsiz artikelin olumsuzu gibi davranır ve deklinasyon alır.',
    ],
    examples: [
      { de: 'Dein Nachbar ist sehr nett, aber meiner leider nicht.', tr: 'Senin komşun çok kibar ama benimki maalesef değil.' },
    ],
    pitfalls: [
      'mein ile meiner kullanımını karıştırma: biri isimle, diğeri isimsiz gelir.',
      'kein kalıbının artikel mi yoksa pronomen mi olduğunu bağlam belirler.',
    ],
  }),
  topic({
    chapter: 22,
    sectionId: 'nomen-artikel-pronomen',
    title: 'Weitere Artikelwörter und Pronomen: dies..., welch..., jed..., alle',
    titleTr: 'Diğer artikel kelimeleri ve zamirler',
    levels: ['A1', 'A2', 'B1'],
    summary: 'Bu grup, seçim yapma, işaret etme ve genelleme gibi işlevler için kullanılır. Kelimenin isimle mi yoksa isimsiz mi kullanıldığına dikkat etmek gerekir.',
    pattern: 'dieser Kaffee | jeder Kaffee | welche? | alle',
    highlights: [
      'dies- yakın ya da işaret edilen nesneyi öne çıkarır.',
      'welch- soru veya seçim kurar; jed- dağıtıcı tek tek anlam verir.',
      'alle çoğul grupları topluca ifade eder ve bağlama göre artikel veya pronomen olabilir.',
    ],
    examples: [
      { de: 'Magst du diesen Kaffee? Mir schmeckt jeder Kaffee.', tr: 'Bu kahveyi seviyor musun? Bana her kahve güzel geliyor.' },
    ],
    pitfalls: [
      'jeder çoğu zaman tekil kullanılır; alle ise çoğul bir bakış verir.',
      'dies- ve der/die/das arasında ton farkı vardır: işaret vurgusu güçlenir.',
    ],
  }),
  topic({
    chapter: 23,
    sectionId: 'nomen-artikel-pronomen',
    title: 'Indefinitpronomen',
    titleTr: 'Belirsiz zamirler',
    levels: ['A1', 'A2', 'B1'],
    summary: 'Indefinitpronomen, kişi ya da şeyi tam olarak belirtmeden konuşmayı sağlar. Özellikle günlük dilde bir şeyi genel bırakmak için çok kullanılır.',
    pattern: 'jemand, niemand, etwas, nichts, man, alle, einige',
    highlights: [
      'jemand/niemand kişiler için, etwas/nichts şeyler için kullanılır.',
      'man, genel özne verir ve Türkçedeki insanlar/biri gibi düşünülebilir.',
      'Bazı belirsiz zamirler deklinasyon alır; bazıları sabit kalır.',
    ],
    examples: [
      { de: 'Kann mir jemand helfen? Ich verstehe hier etwas nicht.', tr: 'Bana biri yardım edebilir mi? Burada bir şeyi anlamıyorum.' },
    ],
    pitfalls: [
      'man zamirini der Mann ile karıştırma.',
      'niemand/jemand çekimlendiğinde son ek alabilir: jemandem, niemanden.',
    ],
  }),
  topic({
    chapter: 24,
    sectionId: 'nomen-artikel-pronomen',
    title: 'Ausdrücke mit es',
    titleTr: 'es ile kullanılan yapılar',
    levels: ['B1'],
    summary: 'es sadece nötr bir ismi temsil etmez; hava durumu, zaman, resmî özne ve vurgu alanı doldurma gibi birçok görev üstlenir.',
    pattern: 'Es regnet. | Es freut mich, dass... | Es gibt...',
    highlights: [
      'Hava ve doğa olaylarında es zorunlu özne olabilir.',
      'es gibt kalıbı var/yok anlamı taşır ve kalıp olarak öğrenilmelidir.',
      'Bazı cümlelerde anlam ağırlığı sonra gelir, es sadece yapıyı başlatır.',
    ],
    examples: [
      { de: 'Es freut mich, wenn es mal wieder regnet.', tr: 'Bazen yeniden yağmur yağdığında hoşuma gidiyor.' },
    ],
    pitfalls: [
      'es her zaman çevrilebilir bir kelime değildir; bazen yalnızca yapısal görev taşır.',
      'Almancada özne alanını boş bırakmamak için kullanılan es, Türkçeye çoğu zaman çevrilmez.',
    ],
  }),
  topic({
    chapter: 25,
    sectionId: 'adjektive-adverbien',
    title: 'Adjektive: Deklination',
    titleTr: 'Sıfat çekimi',
    levels: ['A2', 'B1'],
    summary: 'İsmin önüne gelen sıfatlar, artikelde eksik kalan bilgiye göre son ek alır. Bu yüzden artikel türü ve kasus birlikte düşünülmelidir.',
    pattern: 'der schöne Kuchen | ein schöner Kuchen | schöner Kuchen',
    highlights: [
      'Belirli artikelden sonra çoğu biçimde -e / -en öne çıkar.',
      'Belirsiz artikelde bazı cinsiyet bilgileri sıfata yüklenir: ein schöner Kuchen.',
      'Artikelsiz kullanımda sıfat, kasus ve cinsiyet bilgisini daha açık taşır.',
    ],
    examples: [
      { de: 'Mick hat einen schönen Kuchen gebacken.', tr: 'Mick güzel bir pasta pişirdi.' },
    ],
    pitfalls: [
      'Sıfat sonunu sadece kelimeye bakarak değil, artikel + kasus birlikteliğiyle seçmek gerekir.',
      'Prädikativ kullanımda sıfat çekim almaz: Der Kuchen ist schön.',
    ],
  }),
  topic({
    chapter: 26,
    sectionId: 'adjektive-adverbien',
    title: 'Vergleiche und Steigerung',
    titleTr: 'Karşılaştırma ve derecelendirme',
    levels: ['A2'],
    summary: 'Sıfat ve bazı zarflar pozitif, komparatif ve süperlativ biçimleriyle karşılaştırma yapar. Karşılaştırmada als ve wie ayrımı kritiktir.',
    pattern: 'so ... wie | -er + als | am ...-sten',
    highlights: [
      'Eşitlik karşılaştırmasında so ... wie kullanılır.',
      'Farklılık karşılaştırmasında Komparativ + als kurulur.',
      'Superlativ, cümle içinde am besten gibi ya da artikelle en güzel türünde kullanılabilir.',
    ],
    examples: [
      { de: 'Nina macht bessere Nachspeisen als Ole.', tr: 'Nina, Ole’den daha iyi tatlılar yapıyor.' },
    ],
    pitfalls: [
      'als ile wie yer değiştirdiğinde anlam bozulur.',
      'gut -> besser -> am besten gibi düzensiz biçimler ayrıca ezberlenmelidir.',
    ],
  }),
  topic({
    chapter: 27,
    sectionId: 'adjektive-adverbien',
    title: 'Grund- und Ordnungszahlen',
    titleTr: 'Asıl sayılar ve sıra sayıları',
    levels: ['A1'],
    summary: 'Temel sayı adları miktar belirtir, sıra sayıları ise sıralama verir. Tarih, kat numarası ve listeleme gibi alanlarda çok sık kullanılır.',
    pattern: 'vier Katzen | im siebten Stock',
    highlights: [
      'Grundzahlen miktar söyler: eins, zwei, drei...',
      'Ordnungszahlen sıra verir ve çoğu zaman sıfat gibi çekimlenir: der erste, am dritten.',
      'Tarih ve kat numaralarında sıra sayıları yaygın biçimde kullanılır.',
    ],
    examples: [
      { de: 'Piet hat vier Katzen und wohnt im siebten Stock.', tr: 'Piet’in dört kedisi var ve yedinci katta oturuyor.' },
    ],
    pitfalls: [
      'Sıra sayıları çoğu zaman artikel ve durum bilgisine göre son ek alır.',
      'eins, ein, eine kullanımları bağlama göre farklılaşır.',
    ],
  }),
  topic({
    chapter: 28,
    sectionId: 'adjektive-adverbien',
    title: 'Uhrzeit und Datum',
    titleTr: 'Saat ve tarih',
    levels: ['A1'],
    summary: 'Saat söyleme ve tarih yazma Almancada hem günlük hem resmî kullanımla iki farklı ritimde ilerler. Preposition seçimi de önemlidir.',
    pattern: 'um 11:45 Uhr | am 3. Mai | im Frühling',
    highlights: [
      'Günlük dilde Viertel vor/nach, halb gibi kalıplar çok yaygındır.',
      'Resmî kullanımda 24 saat sistemi sık görülür.',
      'Tarihte gün sıra sayısı gibi okunur ve çoğu zaman am ile kullanılır.',
    ],
    examples: [
      { de: 'Es ist Viertel vor zwölf, also 11 Uhr 45.', tr: 'Saat on ikiye çeyrek var, yani 11.45.' },
    ],
    pitfalls: [
      'halb zwölf ifadesi 11.30 demektir; Türkçedeki mantıktan farklıdır.',
      'Zaman prepositionları karışabilir: um saat, am gün/tarih, im ay/mevsim.',
    ],
  }),
  topic({
    chapter: 29,
    sectionId: 'adjektive-adverbien',
    title: 'Adverbien',
    titleTr: 'Zarflar',
    levels: ['A1', 'A2', 'B1'],
    summary: 'Zarflar eylemin zamanını, yerini, sıklığını ve nasıl gerçekleştiğini açıklar. Sıfatlardan farklı olarak isim çekimine uymazlar.',
    pattern: 'heute, dort, gern, oft, besonders, vielleicht',
    highlights: [
      'Temporal, lokal, modal ve kausal adverbler temel alt gruplardır.',
      'Sıfat bazı bağlamlarda zarf gibi kullanılabilir: Er fährt schnell.',
      'Cümle içinde vurguya göre yeri değişebilir ama anlam tonunu etkiler.',
    ],
    examples: [
      { de: 'Rhea lernt besonders gern abends, häufig bis Mitternacht.', tr: 'Rhea özellikle akşamları, sık sık gece yarısına kadar çalışmayı seviyor.' },
    ],
    pitfalls: [
      'Sıfat ile zarfı biçimden değil işlevden ayırmak gerekir.',
      'nicht ile birlikte kullanıldığında olumsuzluğun kapsadığı alan değişebilir.',
    ],
  }),
  topic({
    chapter: 30,
    sectionId: 'praepositionen',
    title: 'Präpositionen und Kasus',
    titleTr: 'Edatlar ve hâller',
    levels: ['A2'],
    summary: 'Her Almanca preposition belirli bir kasus ister ya da bağlama göre değiştirir. Bu yüzden preposition kelime gibi değil, kalıp gibi öğrenilmelidir.',
    pattern: 'mit + Dativ | für + Akkusativ | wegen + Genitiv',
    highlights: [
      'Bazı prepositionlar sabit olarak Dativ, bazıları Akkusativ, bazıları Genitiv ister.',
      'Kasus, artikeli ve zamiri doğrudan değiştirir.',
      'Yanlış kasus seçimi, doğru kelime dağarcığı olsa bile cümleyi yapay gösterir.',
    ],
    examples: [
      { de: 'Sigi fährt von zu Hause bis zur Arbeit mit dem Fahrrad.', tr: 'Sigi evden işe kadar bisikletle gidiyor.' },
    ],
    pitfalls: [
      'Türkçeden bire bir çeviriyle edat seçmek çoğu zaman yanlış olur.',
      'Preposition ile fiilin istediği kasus bazen birlikte düşünülmelidir.',
    ],
  }),
  topic({
    chapter: 31,
    sectionId: 'praepositionen',
    title: 'Präpositionen und Zeit',
    titleTr: 'Zaman bildiren edatlar',
    levels: ['A1', 'A2'],
    summary: 'Saat, gün, ay, mevsim ve başlangıç noktası gibi zaman bilgileri farklı prepositionlarla kurulur. Doğru zaman edatı doğal konuşmanın anahtarlarından biridir.',
    pattern: 'um, am, im, seit, ab, von ... bis',
    highlights: [
      'um saatleri, am gün ve tarihleri, im ay ve mevsimleri işaret eder.',
      'seit başlangıçtan beri süren zamanı, ab ise başlangıç anından sonrasını verir.',
      'von ... bis aralığı kurar ve planlama dilinde çok kullanılır.',
    ],
    examples: [
      { de: 'Im Frühling sitze ich am Nachmittag auf dem Balkon.', tr: 'İlkbaharda öğleden sonra balkonda otururum.' },
    ],
    pitfalls: [
      'am Montag ile im Montag gibi karışık kullanımlar hatalıdır.',
      'seit çoğu zaman şimdiki zamanla birlikte kullanılır: Ich wohne seit 2020 hier.',
    ],
  }),
  topic({
    chapter: 32,
    sectionId: 'praepositionen',
    title: 'Wechselpräpositionen',
    titleTr: 'Yön değiştiren edatlar',
    levels: ['A2', 'B1'],
    summary: 'Wechselpräpositionen yer mi yön mü anlatıldığına göre Dativ ya da Akkusativ alır. En pratik soru tekniği Wo? ve Wohin? ayrımıdır.',
    pattern: 'Wo? + Dativ | Wohin? + Akkusativ',
    highlights: [
      'an, auf, hinter, in, neben, über, unter, vor, zwischen bu grubun merkezindedir.',
      'Konum anlatırken Dativ, hareket yönü anlatırken Akkusativ kullanılır.',
      'Aynı fiil bağlama göre iki farklı kasus alabilir.',
    ],
    examples: [
      { de: 'Dein Fahrrad steht vor dem Haus. Stell es hinter das Haus.', tr: 'Bisikletin evin önünde duruyor. Onu evin arkasına koy.' },
    ],
    pitfalls: [
      'Sadece fiile bakarak karar vermek yetmez; anlamda hareket var mı yok mu bakılmalıdır.',
      'in dem Haus ve in das Haus farkı yön/konum ayrımı yapar.',
    ],
  }),
  topic({
    chapter: 33,
    sectionId: 'praepositionen',
    title: 'Präpositionaladverbien',
    titleTr: 'Edat zarfları',
    levels: ['B1'],
    summary: 'Präpositionaladverbien, bir preposition ile da-/wo- birleşimi sayesinde önceki cümleye bağ kurar. Özellikle soyut şeylerden söz ederken çok kullanılır.',
    pattern: 'darauf, daran, damit, darüber | worauf, womit',
    highlights: [
      'Şeyler ve durumlar için genelde da(r)- + Präposition kullanılır.',
      'Soru kurarken wo(r)- + Präposition biçimi tercih edilir.',
      'İnsanlar için çoğu zaman preposition + pronomen kullanımı daha doğaldır.',
    ],
    examples: [
      { de: 'Theo träumt davon, einmal im Lotto zu gewinnen.', tr: 'Theo bir gün lotoyu kazanmayı hayal ediyor.' },
    ],
    pitfalls: [
      'Ünlüyle başlayan prepositionlarda araya -r- girer: darauf, worüber.',
      'Kişiler için daran yerine an ihn/sie kullanmak çoğu durumda daha doğrudur.',
    ],
  }),
  topic({
    chapter: 34,
    sectionId: 'wortbildung',
    title: 'Komposita',
    titleTr: 'Bileşik kelimeler',
    levels: ['A1', 'A2', 'B1'],
    summary: 'Almancada yeni isim üretmenin en güçlü yollarından biri kompozisyondur. Birleşik kelimenin son unsuru türü, artikeli ve çoğulu belirler.',
    pattern: 'Bestimmungswort + Grundwort',
    highlights: [
      'Kafa unsur sondadır: der Weltklasseleichtathlet örneğinde artikel son unsurla belirlenir.',
      'Anlam çoğu zaman soldan sağa daralarak okunur.',
      'Bazı birleşimlerde -s-, -n-, -es- gibi bağlayıcı unsurlar görülür.',
    ],
    examples: [
      { de: 'Uri ist ein Weltklasseleichtathlet.', tr: 'Uri dünya klasmanında bir hafif atletizm sporcusudur.' },
    ],
    pitfalls: [
      'Uzun birleşik kelimeleri tek parça ezberlemek yerine son unsuru bularak çözmek daha etkilidir.',
      'Birleşik isimlerde büyük harf kuralı korunur: Nomen olan bütün sonuç kelimeler büyük yazılır.',
    ],
  }),
  topic({
    chapter: 35,
    sectionId: 'wortbildung',
    title: 'Wortbildung: neue Wörter ableiten',
    titleTr: 'Kelime türetme ve yeni sözcük oluşturma',
    levels: ['A1', 'A2', 'B1'],
    summary: 'Derivation, kök kelimeye önek veya sonek ekleyerek yeni anlam ya da yeni kelime türü üretir. Bu mantık kelime hazinesini hızla büyütür.',
    pattern: 'impfen -> die Impfung -> der Impfstoff',
    highlights: [
      'Nomen, fiil ve sıfat arasında aile ilişkileri kurmak mümkündür.',
      'Önekler anlamı yönlendirir; sonekler çoğu zaman kelime türünü değiştirir.',
      'Aynı kökten birçok akademik ve gündelik kelime türeyebilir.',
    ],
    examples: [
      { de: 'Das Impfen dauert viel zu lang, aber der Impfstoff ist gut.', tr: 'Aşılama çok uzun sürüyor ama aşı maddesi iyi.' },
    ],
    pitfalls: [
      'Her ek her köke aynı şekilde bağlanmaz; yerleşik kullanım önemlidir.',
      'Benzer görünen önekler anlamı ciddi şekilde değiştirebilir.',
    ],
  }),
  topic({
    chapter: 36,
    sectionId: 'einfache-saetze',
    title: 'W-Fragen und Antworten',
    titleTr: 'Soru kelimeleriyle sorular ve cevaplar',
    levels: ['A1'],
    summary: 'W-Fragen, belirli bilgi istemek için kullanılır. Soru kelimesi cümleyi başlatır, çekimli fiil hemen ardından gelir.',
    pattern: 'Wo / Wann / Warum / Wie / Wer / Was + Verb + Subjekt ...?',
    highlights: [
      'Soru kelimesi eksik bilgiyi işaret eder: kişi, yer, zaman, neden, yöntem.',
      'Ana soru cümlesinde fiil ikinci pozisyondadır.',
      'Cevap genellikle sorulan parçayı doğrudan tamamlar.',
    ],
    examples: [
      { de: 'Wohin ist Vera gegangen? Zum Einkaufen.', tr: 'Vera nereye gitti? Alışverişe.' },
    ],
    pitfalls: [
      'Wohin ve wo farkı yön ile konum farkıdır.',
      'Cevap verirken gereksiz uzun cümle yerine doğal kısa cevap da kullanılabilir.',
    ],
  }),
  topic({
    chapter: 37,
    sectionId: 'einfache-saetze',
    title: 'Ja/Nein-Fragen und Antworten',
    titleTr: 'Evet-hayır soruları ve cevaplar',
    levels: ['A1'],
    summary: 'Karar sorularında çekimli fiil cümlenin başına gelir. Cevap verirken ja, nein ve özellikle olumsuz cümlelere karşı doch önemli rol oynar.',
    pattern: 'Verb + Subjekt + ...?',
    highlights: [
      'Bu soru tipinde soru kelimesi yoktur; fiil ilk sıraya geçer.',
      'Olumlu cevap ja, olumsuz cevap nein ile verilir.',
      'Olumsuz bir varsayımı düzeltmek için doch kullanılır.',
    ],
    examples: [
      { de: 'Kauft sie auch Obst? Ich glaube, ja.', tr: 'O da meyve alıyor mu? Sanırım evet.' },
    ],
    pitfalls: [
      'Olumsuz sorulara kısa cevap verirken doch unutulursa anlam tersine dönebilir.',
      'Soru cümlesinde fiili ikinci sırada bırakmak, yapıyı W-Frage ile karıştırmaktır.',
    ],
  }),
  topic({
    chapter: 38,
    sectionId: 'einfache-saetze',
    title: 'Sätze mit Ergänzungen',
    titleTr: 'Tamamlayıcılı cümleler',
    levels: ['A1', 'A2', 'B1'],
    summary: 'Bir cümle sadece özne ve fiilden ibaret olmayabilir; nesneler ve zorunlu tamamlayıcılar anlamı tamamlar. Fiilin hangi Ergänzungları istediği cümleyi belirler.',
    pattern: 'Subjekt + Verb + Objekt/Ergänzung',
    highlights: [
      'Bazı fiiller nesnesiz kullanılabilir, bazıları belirli bir nesne ister.',
      'Yer, yön, kişi veya nesne tamamlayıcıları fiilin anlamını tamamlar.',
      'Eksik tamamlayıcı, cümleyi ya yanlış ya da eksik bırakabilir.',
    ],
    examples: [
      { de: 'An Ostern fahren wir mit dem Zug nach Venedig.', tr: 'Paskalya’da trenle Venedik’e gidiyoruz.' },
    ],
    pitfalls: [
      'Her ek bilgi cümlenin zorunlu parçası değildir; bazıları sadece Angabe niteliğindedir.',
      'Fiilin istediği kasus yanlış seçilirse Ergänzung doğru kurulmaz.',
    ],
  }),
  topic({
    chapter: 39,
    sectionId: 'einfache-saetze',
    title: 'Die Satzklammer',
    titleTr: 'Cümle çerçevesi',
    levels: ['A1', 'A2', 'B1'],
    summary: 'Almanca ana cümlede çekimli fiil ikinci pozisyonda dururken, fiilin diğer parçaları cümlenin sonuna gider. Bu yapı Satzklammer olarak anılır.',
    pattern: 'Verbteil 1 ... Mittelfeld ... Verbteil 2',
    highlights: [
      'Modal fiil, Perfekt, Futur ve ayrılabilen fiiller cümle çerçevesini açıkça gösterir.',
      'Ortadaki alan, nesne ve zarf bilgilerini taşır.',
      'Okuma sırasında önce fiilin ilk parçasını, sonra cümle sonunu takip etmek çok faydalıdır.',
    ],
    examples: [
      { de: 'Kannst du bitte noch zwei Kilo Möhren mitbringen?', tr: 'Lütfen iki kilo daha havuç getirebilir misin?' },
    ],
    pitfalls: [
      'Türkçe söz dizimini koruyup ikinci fiil parçasını ortaya koymak doğal değildir.',
      'Uzun cümlelerde fiilin son parçasını kaçırmak anlamı yanlış kurdurabilir.',
    ],
  }),
  topic({
    chapter: 40,
    sectionId: 'einfache-saetze',
    title: 'Sätze mit Angaben',
    titleTr: 'Ek bilgiler içeren cümleler',
    levels: ['B1'],
    summary: 'Angaben; zaman, neden, yer, tarz gibi ek bilgiler verir. Bunların sırası sabit değildir ama Almancada belirli bir doğal akış vardır.',
    pattern: 'TeKaMoLo: Temporal - Kausal - Modal - Lokal',
    highlights: [
      'Angaben zorunlu nesne değildir; cümlenin bağlamını genişletir.',
      'Doğal sıra çoğu zaman önce zaman, sonra neden, biçim ve yer bilgisidir.',
      'Vurgu yapmak istenen öğe ilk pozisyona alınabilir, fiil yine ikinci kalır.',
    ],
    examples: [
      { de: 'Werner will im Mai allein mit dem Auto nach Wien fahren.', tr: 'Werner mayısta Viyana’ya tek başına arabayla gitmek istiyor.' },
    ],
    pitfalls: [
      'Her zaman tek bir doğru sıra yoktur; vurguya göre değişebilir.',
      'İlk pozisyona Angabe geldiğinde özne ve fiilin yerini unutmamak gerekir.',
    ],
  }),
  topic({
    chapter: 41,
    sectionId: 'einfache-saetze',
    title: 'Negation',
    titleTr: 'Olumsuzluk',
    levels: ['A1', 'A2', 'B1'],
    summary: 'Almancada olumsuzluk çoğunlukla nicht veya kein ile kurulur. Hangisinin seçileceği, neyin olumsuzlandığına bağlıdır.',
    pattern: 'nicht + Verb/öğe | kein + Nomen',
    highlights: [
      'kein, belirsiz artikelin yokluğunu ya da isim yokluğunu anlatır.',
      'nicht, fiil, sıfat, zarf, belirli isim ve tüm cümleyi olumsuzlayabilir.',
      'nicht çoğu zaman olumsuzlanan öğeden hemen önce ya da fiil cümle sonundaysa ona yakın durur.',
    ],
    examples: [
      { de: 'Ich spiele kein Tennis und Fußball mag ich auch nicht.', tr: 'Tenis oynamıyorum ve futbolu da sevmiyorum.' },
    ],
    pitfalls: [
      'kein ile nicht yer değiştirirse anlam odağı değişir.',
      'Olumsuzluğu Türkçedeki gibi sadece fiile eklemek Almancada yeterli değildir.',
    ],
  }),
  topic({
    chapter: 42,
    sectionId: 'zusammengesetzte-saetze',
    title: 'Hauptsätze verbinden',
    titleTr: 'Ana cümleleri bağlamak',
    levels: ['A1'],
    summary: 'İki bağımsız ana cümle koordinierende Konjunktionen ile bağlanabilir. Bu bağlaçlar ana cümle söz dizimini korur.',
    pattern: 'und, aber, oder, denn, sondern',
    highlights: [
      'Bağlanan her iki bölüm de tek başına cümle olabilir.',
      'und ve oder nötr bağ kurar; aber karşıtlık getirir.',
      'denn sebep verir ama yan cümle kurmaz; sondern ise düzeltme yapar.',
    ],
    examples: [
      { de: 'Ich liebe Xenia, und Yuri mag ich auch.', tr: 'Xenia’yı seviyorum ve Yuri’den de hoşlanıyorum.' },
    ],
    pitfalls: [
      'denn ile weil aynı anlam alanına yakın olsa da söz dizimleri farklıdır.',
      'sondern kullanımı öncesinde genelde bir olumsuzluk beklentisi vardır.',
    ],
  }),
  topic({
    chapter: 43,
    sectionId: 'zusammengesetzte-saetze',
    title: 'Zweiteilige Satzverbindungen',
    titleTr: 'İkili bağlaç yapıları',
    levels: ['B1'],
    summary: 'Bazı anlamlar çift parçalı bağlaçlarla daha dengeli kurulur. Bu yapılar iki seçeneği, iki yönü ya da iki öğeyi paralel şekilde bağlar.',
    pattern: 'entweder ... oder | nicht nur ... sondern auch | zwar ... aber',
    highlights: [
      'Her iki parça da kendi cümle öğesiyle dengeli kullanılmalıdır.',
      'Anlam ilişkisi seçim, ekleme, dengeleme veya karşıtlık olabilir.',
      'Bu yapılar yazılı anlatımda daha kontrollü ve net görünür.',
    ],
    examples: [
      { de: 'Wir essen weder Käse, noch trinken wir Milch.', tr: 'Ne peynir yiyoruz ne de süt içiyoruz.' },
    ],
    pitfalls: [
      'İki parçalı bağlacın bir yarısını unutmak cümleyi eksik bırakır.',
      'zwar ... aber yapısında ilk kısım beklenti, ikinci kısım dengeleme kurar.',
    ],
  }),
  topic({
    chapter: 44,
    sectionId: 'zusammengesetzte-saetze',
    title: 'Haupt- und Nebensatz verbinden',
    titleTr: 'Ana cümle ile yan cümleyi bağlamak',
    levels: ['A2', 'B1'],
    summary: 'Nebensatz, tek başına tam bağımsız olmayan ve ana cümleye bağlı çalışan yapıdır. En temel kural, çekimli fiilin yan cümlede sona gitmesidir.',
    pattern: 'Hauptsatz, weil/dass/obwohl ... Verb.',
    highlights: [
      'Yan cümleler çoğu zaman virgülle ayrılır.',
      'Bağlaç seçimi neden, sonuç, içerik, şart veya karşıtlık ilişkisini belirler.',
      'Yan cümle başta gelirse ana cümlede fiil hemen gelir.',
    ],
    examples: [
      { de: 'Wir wissen, dass ihr Veganer seid.', tr: 'Sizin vegan olduğunuzu biliyoruz.' },
    ],
    pitfalls: [
      'Yan cümlede fiili ikinci sırada bırakmak en tipik hatalardandır.',
      'Başta gelen yan cümleden sonra ana cümlede özne değil fiil gelir.',
    ],
  }),
  topic({
    chapter: 45,
    sectionId: 'zusammengesetzte-saetze',
    title: 'Nebensätze: Zeit',
    titleTr: 'Zaman yan cümleleri',
    levels: ['A2', 'B1'],
    summary: 'Temporalsätze, iki eylem arasındaki zaman ilişkisini kurar. önce, sonra, sırasında ya da ne zaman sorularını cevaplar.',
    pattern: 'als, wenn, bevor, nachdem, während, seitdem',
    highlights: [
      'als geçmişte tek seferlik olaylar için; wenn tekrar eden ya da genel durumlar için kullanılır.',
      'bevor ve nachdem olay sırasını açık biçimde kurar.',
      'während eşzamanlılık ya da karşıt bağlam verebilir.',
    ],
    examples: [
      { de: 'Nachdem Arlette das Zertifikat bekommen hatte, machte sie den B2-Kurs.', tr: 'Arlette sertifikayı aldıktan sonra B2 kursunu yaptı.' },
    ],
    pitfalls: [
      'als ile wenn karışıklığı zaman çizgisini bozar.',
      'nachdem cümlelerinde zaman sırasını doğru kurmak için zaman seçimine dikkat etmek gerekir.',
    ],
  }),
  topic({
    chapter: 46,
    sectionId: 'zusammengesetzte-saetze',
    title: 'Nebensätze mit wenn: Bedingung, Zeit, Wiederholung',
    titleTr: 'wenn ile şart, zaman ve tekrar',
    levels: ['A2', 'B1'],
    summary: 'wenn çok yönlü bir bağlaçtır. Şart, gelecekteki olasılık ya da tekrar eden durumları bağlama göre ifade edebilir.',
    pattern: 'Wenn + Nebensatz, dann + Hauptsatz',
    highlights: [
      'Gerçekleşmesi mümkün şartlarda çok sık kullanılır.',
      'Gelecekteki bir olay için zaman yan cümlesi kurabilir.',
      'Tekrarlanan alışkanlıkları ya da genel durumları anlatabilir.',
    ],
    examples: [
      { de: 'Wenn ihr fertig seid, dann räumt bitte das Zimmer auf.', tr: 'İşiniz bitince lütfen odayı toplayın.' },
    ],
    pitfalls: [
      'Tek seferlik geçmiş olaylarda çoğu zaman wenn yerine als gerekir.',
      'Ana cümlede dann zorunlu değildir ama anlamı netleştirir.',
    ],
  }),
  topic({
    chapter: 47,
    sectionId: 'zusammengesetzte-saetze',
    title: 'Nebensätze: Grund, Ziel und Folge',
    titleTr: 'Neden, amaç ve sonuç yan cümleleri',
    levels: ['A2', 'B1'],
    summary: 'Bu grup yan cümleler, bir eylemin neden yapıldığını, hangi amaçla yapıldığını ya da ne sonuç doğurduğunu açıklar.',
    pattern: 'weil/da | damit | um ... zu | so ..., dass / sodass',
    highlights: [
      'Grund için weil veya da kullanılır.',
      'Aynı özne varsa amaç çoğu zaman um ... zu ile daha kısa kurulur.',
      'Sonuç ilişkisi için sodass ya da so ... dass yapıları öne çıkar.',
    ],
    examples: [
      { de: 'Ich gehe viel spazieren, um gesund zu bleiben.', tr: 'Sağlıklı kalmak için çok yürüyüş yapıyorum.' },
    ],
    pitfalls: [
      'damit ve um ... zu arasında özne birliği farkı vardır.',
      'weil ile deshalb aynı alanı paylaşsa da biri yan cümle, diğeri ana cümle zarfıdır.',
    ],
  }),
  topic({
    chapter: 48,
    sectionId: 'zusammengesetzte-saetze',
    title: 'Nebensätze: Gegensatz, Vergleich, Folge',
    titleTr: 'Karşıtlık, karşılaştırma ve sonuç yan cümleleri',
    levels: ['A2'],
    summary: 'Daha ince anlam ilişkileri kurmak için karşıtlık, benzerlik ve ölçü ilişkisi taşıyan yan cümleler kullanılır. Bu yapılar metni daha doğal ve analitik yapar.',
    pattern: 'obwohl | während | als/wie | je ... desto',
    highlights: [
      'obwohl beklentiye rağmen gerçekleşen durumu gösterir.',
      'als ve wie karşılaştırma kalıplarında farklı işlevler taşır.',
      'je ... desto kalıbı iki değişken arasındaki orantıyı anlatır.',
    ],
    examples: [
      { de: 'Obwohl Birsen gut Deutsch spricht, fiel sie durch den Test.', tr: 'Birsen iyi Almanca konuşmasına rağmen sınavı geçemedi.' },
    ],
    pitfalls: [
      'obwohl ile aber aynı anda gereksiz kullanıldığında cümle ağırlaşabilir.',
      'Karşılaştırma yapılarında als/wie karışıklığı çok yaygındır.',
    ],
  }),
  topic({
    chapter: 49,
    sectionId: 'zusammengesetzte-saetze',
    title: 'Relativsätze 1: der, das, die',
    titleTr: 'İlgi cümleleri 1',
    levels: ['B1'],
    summary: 'Relativsätze bir ismi daha ayrıntılı tanımlar. İlgi zamirinin cinsiyeti ve sayısı önündeki isimden, hâli ise yan cümledeki görevinden gelir.',
    pattern: 'Der Mann, den Celia liebt, ...',
    highlights: [
      'Relativpronomen çoğu zaman der, die, das serisinin çekimli biçimleridir.',
      'Yan cümlede fiil sona gider ve cümle virgülle ayrılır.',
      'Bu yapı iki kısa cümleyi tek, daha akıcı bir cümlede birleştirir.',
    ],
    examples: [
      { de: 'Der Mann, den Celia liebt, ist wunderschön.', tr: 'Celia’nın sevdiği adam çok yakışıklı.' },
    ],
    pitfalls: [
      'Relativpronomenin kasusunu ana cümle değil, relativsatz içindeki görev belirler.',
      'Kimin kimi sevdiğini anlamak için zamirin hâline dikkat etmek gerekir.',
    ],
  }),
  topic({
    chapter: 50,
    sectionId: 'zusammengesetzte-saetze',
    title: 'Relativsätze 2: was, wo, Präpositionen',
    titleTr: 'İlgi cümleleri 2',
    levels: ['B1'],
    summary: 'Bazı antecedentlerle der/die/das yerine was ya da wo kullanılır; ayrıca preposition da ilgi zamiriyle birlikte gelebilir.',
    pattern: 'alles, was ... | der Ort, wo ... | das Haus, in dem ...',
    highlights: [
      'alles, nichts, etwas, das gibi nötr ve toplu referanslardan sonra sıkça was gelir.',
      'Yer bildiren isimlerde konuşma dilinde wo duyulsa da yazı dilinde preposition + dem/der daha nettir.',
      'Preposition, relativpronomenin önünde kalır: in dem, mit dem, auf den.',
    ],
    examples: [
      { de: 'Drina lebt in einem Ort, wo es nicht einmal Internet gibt.', tr: 'Drina, internetin bile olmadığı bir yerde yaşıyor.' },
    ],
    pitfalls: [
      'Resmî ve yazılı dilde yer cümlelerinde sadece wo kullanmak her zaman en iyi seçenek değildir.',
      'Prepositionlı relativsatzlarda artikeli düşürmek yanlıştır.',
    ],
  }),
  topic({
    chapter: 51,
    sectionId: 'zusammengesetzte-saetze',
    title: 'Infinitivsätze',
    titleTr: 'Mastar yan cümleleri',
    levels: ['B1'],
    summary: 'Infinitivsatz, özellikle aynı öznenin iki eylemini daha ekonomik anlatmak için kullanılır. zu parçacığı bu yapının merkezindedir.',
    pattern: 'zu + Infinitiv | um ... zu | ohne ... zu | statt ... zu',
    highlights: [
      'Aynı özne varsa um ... zu çok sık kullanılır ve amaç bildirir.',
      'Birçok fiil ve ifade arkasından zu + Infinitiv ister: versuchen, planen, hoffen.',
      'zu, fiille birlik oluşturur ve cümle sonunda yer alır.',
    ],
    examples: [
      { de: 'Ich hoffe, meine Freundin Ella bald wiederzusehen.', tr: 'Arkadaşım Ella’yı yakında yeniden görmeyi umuyorum.' },
    ],
    pitfalls: [
      'Özneler farklıysa çoğu durumda infinitivsatz yerine damit gibi bir yan cümle gerekir.',
      'Ayrılabilen fiillerde zu önek ile kök arasına girer: aufzustehen.',
    ],
  }),
  topic({
    chapter: 52,
    sectionId: 'zusammengesetzte-saetze',
    title: 'Indirekte Fragen',
    titleTr: 'Dolaylı sorular',
    levels: ['B1'],
    summary: 'Dolaylı sorular başka bir cümlenin içine gömülü soru yapılarıdır. Bu nedenle söz dizimi doğrudan sorudan farklıdır ve fiil sona gider.',
    pattern: 'Ich weiß nicht, wann ... | Kannst du mir sagen, ob ...?',
    highlights: [
      'Soru kelimesi varsa aynen korunur; yoksa ob kullanılır.',
      'Dolaylı soru yan cümle olduğu için çekimli fiil sonda yer alır.',
      'Noktalama çoğu zaman soru işareti değil nokta ile biter; ancak üst cümle gerçek bir soruysa soru işareti gelebilir.',
    ],
    examples: [
      { de: 'Weißt du eigentlich, wann du geimpft wirst?', tr: 'Aslında ne zaman aşı olacağını biliyor musun?' },
    ],
    pitfalls: [
      'Doğrudan soru söz dizimini aynen korumak yaygın bir hatadır.',
      'Ja/Nein tipi dolaylı sorularda dass değil ob kullanılır.',
    ],
  }),
];

export function getGrammarSection(sectionId: GrammarSection['id']): GrammarSection | undefined {
  return GRAMMAR_SECTIONS.find((section) => section.id === sectionId);
}

export function getGrammarTopicsBySection(sectionId: GrammarSection['id']): GrammarTopic[] {
  return GRAMMAR_TOPICS.filter((topicItem) => topicItem.sectionId === sectionId);
}

export function getGrammarSources(sourceIds: string[]): GrammarSource[] {
  return sourceIds
    .map((sourceId) => GRAMMAR_SOURCES.find((source) => source.id === sourceId))
    .filter((source): source is GrammarSource => Boolean(source));
}
