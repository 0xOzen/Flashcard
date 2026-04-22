import { Flashcard, VocabList } from './types';

const rawVerbs = [
  "sein|olmak|sein,ist,war,gewesen,sei!,sein + Nom.", "haben|sahip olmak|haben,hat,hatte,gehabt,hab!,haben + Akk.", "werden|olmak (gelecek)|sein,wird,wurde,geworden,werde!,werden + Nom.", "können|yapabilmek|haben,kann,konnte,gekonnt,,-",
  "müssen|zorunda olmak|haben,muss,musste,gemusst,,-", "sagen|söylemek|haben,sagt,sagte,gesagt,sag!,sagen + Akk. / s. jmdm (Dat.)", "machen|yapmak|haben,macht,machte,gemacht,mach!,machen + Akk.", "geben|vermek|haben,gibt,gab,gegeben,gib!,geben jmdm (Dat.) + Akk.",
  "kommen|gelmek|sein,kommt,kam,gekommen", "sollen|gerekmek|haben,soll,sollte,gesollt", "wollen|istemek|haben,will,wollte,gewollt", "gehen|gitmek|sein,geht,ging,gegangen",
  "wissen|bilmek|haben,weiß,wusste,gewusst", "sehen|görmek|haben,sieht,sah,gesehen", "lassen|bırakmak / izin vermek|haben,lässt,ließ,gelassen", "stehen|durmak|haben,steht,stand,gestanden",
  "finden|bulmak|haben,findet,fand,gefunden", "bleiben|kalmak|sein,bleibt,blieb,geblieben", "liegen|yatmak / bulunmak|haben,liegt,lag,gelegen", "heißen|adlandırılmak|haben,heißt,hieß,geheißen",
  "denken|düşünmek|haben,denkt,dachte,gedacht", "nehmen|almak|haben,nimmt,nahm,genommen", "tun|yapmak|haben,tut,tat,getan", "dürfen|izinli olmak|haben,darf,durfte,gedurft",
  "glauben|inanmak|haben,glaubt,glaubte,geglaubt", "halten|tutmak|haben,hält,hielt,gehalten", "nennen|adlandırmak|haben,nennt,nannte,genannt", "mögen|hoşlanmak|haben,mag,mochte,gemocht",
  "zeigen|göstermek|haben,zeigt,zeigte,gezeigt", "führen|yönetmek / götürmek|haben,führt,führte,geführt", "sprechen|konuşmak|haben,spricht,sprach,gesprochen", "bringen|getirmek|haben,bringt,brachte,gebracht",
  "leben|yaşamak|haben,lebt,lebte,gelebt", "fahren|sürmek / gitmek|sein,fährt,fuhr,gefahren", "meinen|kastetmek / sanmak|haben,meint,meinte,gemeint", "fragen|sormak|haben,fragt,fragte,gefragt",
  "kennen|tanımak|haben,kennt,kannte,gekannt", "gelten|geçerli olmak|haben,gilt,galt,gegolten", "stellen|koymak (dikey)|haben,stellt,stellte,gestellt", "spielen|oynamak|haben,spielt,spielte,gespielt",
  "arbeiten|çalışmak|haben,arbeitet,arbeitete,gearbeitet", "brauchen|ihtiyacı olmak|haben,braucht,brauchte,gebraucht", "folgen|takip etmek|sein,folgt,folgte,gefolgt", "lernen|öğrenmek|haben,lernt,lernte,gelernt",
  "bestehen|var olmak / oluşmak|haben,besteht,bestand,bestanden", "verstehen|anlamak|haben,versteht,verstand,verstanden", "setzen|oturtmak|haben,setzt,setzte,gesetzt", "bekommen|almak / elde etmek|haben,bekommt,bekam,bekommen",
  "beginnen|başlamak|haben,beginnt,begann,begonnen", "erzählen|anlatmak|haben,erzählt,erzählte,erzählt", "versuchen|denemek|haben,versucht,versuchte,versucht", "schreiben|yazmak|haben,schreibt,schrieb,geschrieben",
  "laufen|koşmak|sein,läuft,lief,gelaufen", "erklären|açıklamak|haben,erklärt,erklärte,erklärt", "entsprechen|uygun olmak|haben,entspricht,entsprach,entsprochen", "sitzen|oturmak|haben,sitzt,saß,gesessen",
  "ziehen|çekmek|haben,zieht,zog,gezogen", "scheinen|görünmek / parlamak|haben,scheint,schien,geschienen", "fallen|düşmek|sein,fällt,fiel,gefallen", "gehören|ait olmak|haben,gehört,gehörte,gehört",
  "entstehen|meydana gelmek|sein,entsteht,entstand,entstanden", "erhalten|teslim almak / korumak|haben,erhält,erhielt,erhalten", "treffen|buluşmak|haben,trifft,traf,getroffen", "suchen|aramak|haben,sucht,suchte,gesucht",
  "legen|koymak (yatay)|haben,legt,legte,gelegt", "handeln|davranmak / ticaret yapmak|haben,handelt,handelte,gehandelt", "erreichen|ulaşmak|haben,erreicht,erreichte,erreicht", "tragen|taşımak / giymek|haben,trägt,trug,getragen",
  "schaffen|başarmak / yaratmak|haben,schafft,schuf,geschaffen", "lesen|okumak|haben,liest,las,gelesen", "verlieren|kaybetmek|haben,verliert,verlor,verloren", "darstellen|betimlemek|haben,stellt dar,stellte dar,dargestellt",
  "erkennen|tanımak / fark etmek|haben,erkennt,erkannte,erkannt", "entwickeln|geliştirmek|haben,entwickelt,entwickelte,entwickelt", "reden|konuşmak|haben,redet,redete,geredet", "aussehen|görünmek|haben,sieht aus,sah aus,ausgesehen",
  "erscheinen|belirmek|sein,erscheint,erschien,erschienen", "bilden|oluşturmak|haben,bildet,bildete,gebildet", "anfangen|başlamak|haben,fängt an,fing an,angefangen", "erwarten|beklemek|haben,erwartet,erwartete,erwartet",
  "wohnen|ikamet etmek|haben,wohnt,wohnte,gewohnt", "betreffen|ilgilendirmek|haben,betrifft,betraf,betroffen", "warten|beklemek|haben,wartet,wartete,gewartet", "vergehen|geçip gitmek|sein,vergeht,verging,vergangen",
  "helfen|yardım etmek|haben,hilft,half,geholfen", "gewinnen|kazanmak|haben,gewinnt,gewann,gewonnen", "schließen|kapatmak|haben,schließt,schloss,geschlossen", "fühlen|hissetmek|haben,fühlt,fühlte,gefühlt",
  "bieten|sunmak|haben,bietet,bot,geboten", "interessieren|ilgilenmek|haben,interessiert,interessierte,interessiert", "erinnern|hatırlamak|haben,erinnert,erinnerte,erinnert", "ergeben|sonuç vermek|haben,ergibt,ergab,ergeben",
  "anbieten|teklif etmek|haben,bietet an,bot an,angeboten", "studieren|öğrenim görmek|haben,studiert,studierte,studiert", "verbinden|bağlamak|haben,verbindet,verband,verbunden", "ansehen|bakmak / incelemek|haben,sieht an,sah an,angesehen",
  "fehlen|eksik olmak|haben,fehlt,fehlte,gefehlt", "bedeuten|anlamına gelmek|haben,bedeutet,bedeutete,bedeutet", "vergleichen|karşılaştırmak|haben,vergleicht,verglich,verglichen", "nutzen|kullanmak|haben,nutzt,nutzte,genutzt"
];

const rawAdjectives = [
  "neu|yeni|neuer|am neuesten|neu für + Akk", "alt|eski / yaşlı|älter|am ältesten|", "groß|büyük|größer|am größten|", "klein|küçük|kleiner|am kleinsten|", "gut|iyi|besser|am besten|gut für + Akk / in + Dat",
  "schlecht|kötü|schlechter|am schlechtesten|schlecht für + Akk", "hoch|yüksek|höher|am höchsten|", "tief|derin / alçak|tiefer|am tiefsten|", "lang|uzun|länger|am längsten|", "kurz|kısa|kürzer|am kürzesten|",
  "breit|geniş|breiter|am breitesten|", "schmal|dar|schmäler|am schmälsten|", "stark|güçlü|stärker|am stärksten|stark in + Dat", "schwach|zayıf|schwächer|am schwächsten|schwach in + Dat", "schnell|hızlı|schneller|am schnellsten|",
  "langsam|yavaş|langsamer|am langsamsten|", "hell|aydınlık|heller|am hellsten|", "dunkel|karanlık|dunkler|am dunkelsten|", "laut|gürültülü|lauter|am lautesten|", "leise|sessiz|leiser|am leisesten|",
  "hart|sert|härter|am härtesten|hart zu + Dat", "weich|yumuşak|weicher|am weichsten|", "warm|sıcak|wärmer|am wärmsten|", "kalt|soğuk|kälter|am kältesten|", "schön|güzel|schöner|am schönsten|schön für + Akk",
  "hässlich|çirkin|hässlicher|am hässlichsten|", "teuer|pahalı|teurer|am teuersten|teuer für + Akk", "billig|ucuz|billiger|am billigsten|", "reich|zengin|reicher|am reichsten|reich an + Dat (bir şey bakımından zengin)", "arm|fakir|ärmer|am ärmsten|arm an + Dat (bir şeyden yoksun)",
  "jung|genç|jünger|am jüngsten|", "richtig|doğru|richtiger|am richtigsten|", "falsch|yanlış|fälscher|am falschesten|", "einfach|basit|einfacher|am einfachsten|einfach für + Akk", "schwer|zor / ağır|schwerer|am schwersten|schwer für + Akk",
  "leicht|hafif / kolay|leichter|am leichtesten|leicht für + Akk", "früh|erken|früher|am frühesten|", "spät|geç|später|am spätesten|", "voll|dolu|voller|am vollsten|voll von / mit + Dat", "leer|boş|leerer|am leersten|",
  "sauber|temiz|sauberer|am saubersten|", "schmutzig|kirli|schmutziger|am schmutzigsten|", "gesund|sağlıklı|gesünder|am gesündesten|gesund für + Akk", "krank|hasta|kränker|am kränksten|", "wichtig|önemli|wichtiger|am wichtigsten|wichtig für + Akk",
  "glücklich|mutlu|glücklicher|am glücklichsten|glücklich über + Akk", "traurig|üzgün|trauriger|am traurigsten|traurig über + Akk", "müde|yorgun|müder|am müdesten|müde von + Dat", "offen|açık|offener|am offensten|offen für + Akk", "geschlossen|kapalı|geschlossener|am geschlossensten|"
];

const rawNouns = [
  "der Mann|adam", "die Frau|kadın", "das Kind|çocuk", "die Zeit|zaman", "das Jahr|yıl",
  "der Tag|gün", "das Land|ülke", "die Frage|soru", "das Haus|ev", "der Fall|durum / olay",
  "der Mensch|insan", "das Prozent|yüzde", "der Weg|yol", "das Leben|hayat", "das Ende|son",
  "das Problem|problem", "die Welt|dünya", "die Hand|el", "das Bild|resim", "der Teil|kısım",
  "die Woche|hafta", "das Wort|kelime", "die Million|milyon", "das Beispiel|örnek", "die Familie|aile",
  "der Grund|neden / zemin", "der Monat|ay", "die Mutter|anne", "der Vater|baba", "die Art|tür / çeşit",
  "das Buch|kitap", "der Markt|piyasa", "der Name|isim", "das Wasser|su", "das Auge|göz",
  "der Bereich|alan / bölge", "die Geschichte|hikaye / tarih", "die Gesellschaft|toplum", "der Kopf|baş", "die Idee|fikir",
  "das Geld|para", "die Entwicklung|gelişim", "das Auto|araba", "die Arbeit|iş", "der Staat|devlet",
  "das Recht|hak / hukuk", "die Stadt|şehir", "der Freund|arkadaş (erkek)", "die Freundin|arkadaş (kız)", "der Sinn|duyu / anlam",
  "das Mittel|araç / madem", "das Unternehmen|girişim / şirket", "die Seite|yan / sayfa", "der Ort|yer", "der Raum|oda / alan",
  "die Person|kişi", "die Form|biçim", "der Platz|yer / meydan", "die Zahl|sayı", "das System|sistem",
  "die Minute|dakika", "der Moment|an", "das Ziel|hedef", "die Regierung|hükümet", "der Grund|sebep",
  "das Thema|konu", "die Rolle|rol", "die Möglichkeit|olanak", "die Stunde|saat (süre)", "die Schule|okul",
  "der Abend|akşam", "das Ergebnis|sonuç", "die Aufgabe|görev", "der Wert|değer", "die Kraft|güç",
  "der Morgen|sabah", "die Eltern|ebeveynler", "die Klasse|sınıf", "der Student|üniversite öğrencisi (erkek)", "die Studentin|üniversite öğrencisi (kız)",
  "die Natur|doğa", "das Geschäft|mağaza / iş", "das Gespräch|sohbet", "die Regel|kural", "der Junge|erkek çocuk",
  "das Mädchen|kız çocuk", "der Herr|bay", "die Universität|üniversite", "der Tisch|masa", "das Bett|yatak",
  "der Stuhl|sandalye", "die Tür|kapı", "das Fenster|pencere", "die Straße|cadde", "der Weg|yol",
  "die Wohnung|daire", "der Fehler|hata", "die Angst|korku", "das Herz|kalp", "der Monat|ay"
];

const mapVerbs = (): Flashcard[] => rawVerbs.map((item, i) => {
  const [term, tr, conjugations] = item.split('|');
  const verbForms = conjugations ? (() => {
    const [aux, pres, pret, part, imp, pattern] = conjugations.split(',');
    return {
      auxiliary: aux || '',
      present: pres || '',
      preterite: pret || '',
      participle: part || '',
      imperative: imp || '',
      usagePattern: pattern || ''
    };
  })() : undefined;
  
  return { 
    id: `verb_${i}`, 
    term, 
    translationTr: tr, 
    wordType: 'verb', 
    level: 'A1-A2',
    verbForms 
  };
});

const rawPhrasesA1 = [
  "Hallo / Guten Tag!|Merhaba / İyi günler!|Guten Tag, wie kann ich helfen?|Hallo! / Hi! / Tag!",
  "Wie geht's?|Nasılsın?|Wie geht es dir/Ihnen?|Was geht? / Alles fit?",
  "Danke, gut.|Teşekkürler, iyiyim.|Danke, mir geht es gut.|Gut, und selbst?",
  "Auf Wiedersehen.|Görüşmek üzere / Hoşça kal.|Auf Wiedersehen, bis bald.|Tschüss! / Ciao! / Bye!",
  "Bis später!|Sonra görüşürüz!|Wir sehen uns später.|Bis dann! / Man sieht sich!",
  "Bis bald!|Yakında görüşürüz!|Wir sehen uns bald wieder.|Bis demnächst!",
  "Schönen Tag noch!|İyi günler dilerim!|Ich wünsche Ihnen einen schönen Tag.|Schönen Tag noch!",
  "Gute Nacht!|İyi geceler!|Ich wünsche dir eine gute Nacht.|Nachti! / Schlaf gut!",
  "Ja, bitte.|Evet, lütfen.|Ja, sehr gerne.|Klar! / Gerne!",
  "Nein, danke.|Hayır, teşekkürler.|Nein, vielen Dank für das Angebot.|Nö, danke.",
  "Entschuldigung.|Afedersiniz / Özür dilerim.|Entschuldigen Sie bitte.|Tschuldigung! / Sorry!",
  "Es tut mir leid.|Özür dilerim / Üzgünüm.|Es tut mir wirklich leid.|Sorry! / Tut mir echt leid.",
  "Macht nichts.|Sorun değil / Önemli değil.|Das macht gar nichts.|Schon gut! / Alles gut.",
  "Kein Problem.|Problem değil.|Das ist kein Problem.|Kein Ding! / Passt schon.",
  "Ich spreche nicht gut Deutsch.|İyi Almanca konuşamıyorum.|Mein Deutsch ist leider noch nicht so gut.|Ich spreche kaum Deutsch.",
  "Können Sie das wiederholen?|Bunu tekrar edebilir misiniz?|Würden Sie das bitte wiederholen?|Nochmal bitte! / Was hast du gesagt?",
  "Bitte sprechen Sie langsamer.|Lütfen daha yavaş konuşun.|Könnten Sie bitte etwas langsamer sprechen?|Bisschen langsamer, bitte.",
  "Was bedeutet das?|Bu ne anlama geliyor?|Können Sie mir erklären, was das bedeutet?|Was heißt'n das?",
  "Ich verstehe nicht.|Anlamıyorum.|Ich kann Ihnen leider nicht folgen.|Ich check das nicht.",
  "Ich weiß nicht.|Bilmiyorum.|Das ist mir leider nicht bekannt.|Weiß nicht. / Kein Plan.",
  "Keine Ahnung.|Hiçbir fikrim yok.|Dazu habe ich keine Informationen.|Null Ahnung.",
  "Wie heißen Sie?|Adınız nedir?|Könnten Sie mir Ihren Namen sagen?|Wie heißt du?",
  "Ich heiße...|Benim adım...|Mein Name ist...|Ich bin der/die...",
  "Woher kommen Sie?|Nereden geliyorsunuz / Nerelisiniz?|Aus welchem Land kommen Sie?|Wo kommst du her?",
  "Ich komme aus...|Ben ...'dan geliyorum.|Mein Heimatland ist...|Ich komm aus...",
  "Wo wohnen Sie?|Nerede yaşıyorsunuz?|An welcher Adresse wohnen Sie?|Wo wohnst du?",
  "Ich wohne in...|Ben ...'da yaşıyorum.|Mein aktueller Wohnort ist...|Ich wohn' in...",
  "Wie alt bist du?|Kaç yaşındasın?|Können Sie mir Ihr Alter verraten?|Wie alt bist'n du?",
  "Sprechen Sie Englisch?|İngilizce biliyor musunuz?|Beherrschen Sie die englische Sprache?|Sprichst du Englisch?",
  "Ein bisschen.|Biraz.|Nur ein wenig.|Ein bisschen halt.",
  "Ich hätte gern...|İsterdim... (Sipariş verirken)|Ich möchte bitte...|Ich nehm'...",
  "Was kostet das?|Bu ne kadar / Fiyatı nedir?|Wie viel muss ich dafür bezahlen?|Was macht das?",
  "Die Rechnung, bitte.|Hesap lütfen.|Ich möchte bitte bezahlen.|Zahlen, bitte!",
  "Stimmt so.|Üstü kalsın (Bahşiş bırakırken).|Das Restgeld können Sie behalten.|Passt schon.",
  "Guten Appetit!|Afiyet olsun!|Lassen Sie es sich schmecken.|Mahlzeit!",
  "Prost!|Şerefe!|Auf Ihr Wohl!|Prost! / Zum Wohl!",
  "Wo ist die Toilette?|Tuvalet nerede?|Können Sie mir den Weg zur Toilette zeigen?|Wo ist's Klo?",
  "Ich brauche Hilfe.|Yardıma ihtiyacım var.|Könnten Sie mir bitte helfen?|Hilf mir mal kurz.",
  "Sicher! / Natürlich!|Tabii ki! / Elbette!|Selbstverständlich.|Logisch! / Klar doch!",
  "Vielleicht.|Belki.|Das ist gut möglich.|Mal schauen. / Kann sein.",
  "Ich bin hungrig.|Açım.|Ich verspüre Hunger.|Ich hab Kohldampf.",
  "Ich habe Durst.|Susamıştım.|Ich verspüre Durst.|Ich hab voll Durst.",
  "Mir ist kalt.|Üşüyorum.|Ich empfinde Kälte.|Ich friere.",
  "Mir ist warm/heiß.|Sıcakladım.|Ich empfinde Wärme.|Mir ist heiß.",
  "Herzlichen Glückwunsch!|Tebrikler!|Ich gratuliere Ihnen herzlich.|Glückwunsch! / Gratuliere!",
  "Viel Glück!|İyi şanslar!|Ich wünsche Ihnen viel Erfolg.|Viel Glück!",
  "Gute Reise!|İyi yolculuklar!|Ich wünsche eine angenehme Reise.|Gute Fahrt!",
  "Gesundheit!|Çok yaşa! (Biri hapşırınca)|Ich wünsche Ihnen Gesundheit.|Gesundheit!",
  "Gott sei Dank!|Çok şükür!|Ein Glück!|Puh, zum Glück!",
  "Viel Spaß!|İyi eğlenceler!|Ich wünsche dir/euch viel Spaß!|Viel Spaß!"
];

const rawPhrasesA2 = [
  "Meiner Meinung nach...|Bence... / Benim fikrime göre...|Ich bin der Meinung, dass... / Aus meiner Sicht...|Ich denk mal...",
  "Ich drücke dir die Daumen!|Sana şans diliyorum!|Viel Erfolg! / Alles Gute!|Du packst das! / Du schaffst das schon!",
  "Das ist mir Wurst.|Benim için fark etmez.|Das ist mir völlig egal.|Mir doch egal! / Juckt mich nicht! / Ist mir schnuppe.",
  "Ich verstehe nur Bahnhof.|Hiçbir şey anlamıyorum.|Ich verstehe gar nichts.|Hä? / Was meinst du? / Kein Plan.",
  "Da stimme ich zu.|Buna katılıyorum.|Ich bin ganz deiner Meinung.|Genau! / Stimmt absolut! / Auf jeden Fall!",
  "Lass uns...|Hadi ... yapalım|Wir könnten... / Wie wäre es, wenn...?|Komm schon! / Gehen wir! / Lass mal...",
  "Das kommt darauf an.|Duruma göre değişir.|Es hängt davon ab. / Das ist unterschiedlich.|Je nachdem! / Mal schauen.",
  "Ich habe die Nase voll.|Bıktım. / Gına geldi.|Es reicht mir jetzt.|Mir reicht's! / Ich hab die Schnauze voll.",
  "Das geht dich nichts an.|Bu seni ilgilendirmez.|Das betrifft dich nicht.|Geht dich gar nix an! / Halt dich da raus.",
  "Mach dir keine Sorgen.|Endişelenme / Dert etme.|Sorge dich nicht.|Mach dir keinen Kopf. / Alles im grünen Bereich.",
  "Kopf hoch!|Başını dik tut! / Üzülme!|Seien Sie nicht traurig.|Wird schon wieder! / Kopf hoch!",
  "Das klingt gut.|Kulağa hoş geliyor.|Das hört sich interessant an.|Hört sich gut an.",
  "Ich bin der gleichen Meinung.|Aynı fikirdeyim.|Das sehe ich genauso.|Seh ich auch so.",
  "Ich bin anderer Meinung.|Farklı düşünüyorum (katılmıyorum).|Da muss ich Ihnen widersprechen.|Seh ich gar nicht so.",
  "Das ist nicht dein Ernst!|Ciddi olamazsın!|Das meinen Sie hoffentlich nicht ernst!|Dein Ernst jetzt?! / Machst du Witze?!",
  "Was ist los?|Ne var ne yok? / Ne oldu?|Was ist hier passiert?|Was geht ab? / Was ist passiert?",
  "Eile mit Weile.|Acele etme, yavaş yavaş.|Gehen Sie es ruhig an.|Immer mit der Ruhe.",
  "Ich freue mich darauf.|Bunu dört gözle bekliyorum.|Ich erwarte das mit Freude.|Ich freu mich schon mega.",
  "Wie war dein Wochenende?|Hafta sonun nasıldı?|Wie haben Sie das Wochenende verbracht?|Was hast du am WE gemacht?",
  "Haben Sie Zeit?|Zamanınız var mı?|Verfügen Sie über freie Zeit?|Hast du Zeit? / Hast du kurz?",
  "Das tut mir weh.|Bu canımı acıtıyor / Beni üzüyor.|Das schmerzt mich sehr.|Das tut weh. / Das verletzt mich.",
  "Es ist mir kalt/warm.|Üşüyorum / Sıcaklıyorum.|Ich empfinde Kälte/Wärme.|Mir ist kalt/heiß.",
  "Das kostet ein Vermögen.|Bu bir servet değerinde (Çok pahalı).|Das ist äußerst kostspielig.|Viel zu teuer! / Sau teuer.",
  "Ich bin hundemüde.|Köpek gibi yorgunum (Çok yorgunum).|Ich bin völlig erschöpft.|Ich bin so was von platt.",
  "Lass mich in Ruhe!|Beni rahat bırak!|Bitte stören Sie mich nicht weiter.|Nerv mich nicht! / Lass mich!",
  "Das ist mir egal.|Benim için fark etmez.|Darauf lege ich keinen Wert.|Ist mir völlig egal.",
  "Schade!|Yazık!|Das bedaure ich sehr.|Echt schade!",
  "Ach so!|Ha anladım! / Öyle mi!|Jetzt verstehe ich den Zusammenhang.|Ach, so ist das!",
  "Bist du verrückt?|Çıldırdın mı?|Haben Sie den Verstand verloren?|Spinnst du? / Bist du irre?",
  "Das macht Sinn.|Bu mantıklı.|Das ist logisch nachvollziehbar.|Macht voll Sinn.",
  "Mir geht's den Umständen entsprechend.|Kötünün iyisi (duruma göre iyiyim).|Unter diesen Bedingungen geht es mir akzeptabel.|Muss ja, ne.",
  "Ich habe es eilig.|Acelem var.|Ich stehe unter Zeitdruck.|Ich muss los! / Hab keine Zeit.",
  "Das ist ein Kinderspiel.|Çocuk oyuncağı (Çok kolay).|Das ist eine sehr einfache Aufgabe.|Total easy! / Babyleicht.",
  "Pass auf!|Dikkat et!|Bitte seien Sie vorsichtig.|Achtung! / Aufpassen!",
  "Was halten Sie davon?|Bu konuda ne düşünüyorsunuz?|Wie ist Ihre Meinung dazu?|Was hältst du davon?",
  "Ich kümmere mich darum.|Ben hallederim (ilgilenirim).|Ich werde diese Aufgabe übernehmen.|Mach ich! / Kümmere mich drum.",
  "Das steht fest.|Bu kesin / Belli.|Das ist eine beschlossene Sache.|Sicher ist sicher. / Ist fix.",
  "So ein Pech!|Ne şanssızlık!|Welch ein Unglück!|So ein Mist! / Echt blöd gelaufen.",
  "Es regnet in Strömen.|Bardaktan boşanırcasına yağıyor.|Es gibt starke Niederschläge.|Es schüttet wie aus Eimern.",
  "Darauf kannst du Gift nehmen.|Buna adın gibi emin olabilirsin.|Darauf können Sie sich verlassen.|Vertrau mir blind.",
  "Das wundert mich nicht.|Buna şaşırmadım.|Das überrascht mich in keiner Weise.|War ja klar. / Wen wundert's?",
  "Wie lange dauert das?|Ne kadar sürer?|Wie viel Zeit nimmt das in Anspruch?|Wie lange noch?",
  "Aus den Augen, aus dem Sinn.|Gözden ırak olan gönülden de ırak olur.|Wer abwesend ist, wird vergessen.|Wenn man's nicht sieht, vergisst man's.",
  "Morgen ist auch noch ein Tag.|Yarın da bir gün (Bugünlük yeter).|Man kann Dinge auf morgen verschieben.|Stress dich nicht.",
  "Übung macht den Meister.|Pratik mükemmelleştirir (İşleyen demir ışıldar).|Durch viel Training erlangt man Fähigkeiten.|Viel üben hilft viel.",
  "Ich habe meinen Schlüssel vergessen.|Anahtarımı unuttum.|Ich habe meinen Schlüssel liegengelassen.|Hab mein Schlüssel nicht dabei.",
  "Wir sind gleich da.|Neredeyse geldik.|Wir erreichen in Kürze unser Ziel.|Gleich da.",
  "Hast du Hunger?|Aç mısın?|Besteht bei Ihnen Appetit?|Hast du Kohldampf?",
  "Mir ist schlecht.|Midem bulanıyor / Kötü hissediyorum.|Mir ist unwohl.|Mir ist kotzübel.",
  "Das ist meine Schuld.|Bu benim hatam.|Die Verantwortung dafür trage ich.|Sorry, mein Fehler."
];

const rawPhrasesB1 = [
  "Es fällt mir schwer...|Bana zor geliyor...|Ich habe Schwierigkeiten damit...|Ich tu mich schwer damit...",
  "Soweit ich weiß...|Bildiğim kadarıyla...|Nach meinem Kenntnisstand...|Soweit ich mitgekriegt hab...",
  "Das lässt sich nicht leugnen.|Bu inkar edilemez.|Das ist eine unbestreitbare Tatsache.|Da kann man nix machen. / Ist halt so.",
  "Im Großen und Ganzen...|Genel olarak... / Büyük çapta baktığımızda...|Zusammenfassend kann man sagen...|Alles in allem...",
  "Davon halte ich nichts.|Buna katılmıyorum / Onu desteklemiyorum.|Ich bin von dieser Idee nicht überzeugt.|Das ist doch Quatsch! / Find ich blöd.",
  "Es ist höchste Zeit.|Tam zamanı. / Vakit geldi de geçiyor.|Wir müssen das jetzt dringend erledigen.|Wird auch langsam Zeit!",
  "Das A und O|En önemli şey / İşin temeli|Das Wichtigste / Die Hauptsache|Das absolut Wichtigste.",
  "Auf keinen Fall!|Asla! / Hiçbir şekilde!|Unter gar keinen Umständen.|Niemals! / Vergiss es!",
  "Das liegt auf der Hand.|Bu çok açık / Göz önünde.|Das ist doch völlig offensichtlich.|Ist doch logisch! / Klarer Fall.",
  "Mir liegt viel daran.|Buna çok önem veriyorum.|Das ist mir persönlich sehr wichtig.|Das bedeutet mir megaviel.",
  "Ich stehe unter Druck.|Baskı altındayım (Stresliyim).|Ich verspüre einen hohen Leistungsdruck.|Ich hab voll Stress.",
  "Ins Leere laufen.|Boşa gitmek / Sonuçsuz kalmak.|Keine Ergebnisse erzielen.|Hat gar nichts gebracht.",
  "Jemandem die Daumen drücken.|Birine şans dilemek (başarısı için).|Jemandem viel Erfolg wünschen.|Viel Glück wünsch ich dir.",
  "Von heute auf morgen.|Bugünden yarına (Çok aniden).|Innerhalb kürzester Zeit.|Ganz plötzlich.",
  "Ein Auge zudrücken.|Görmezden gelmek.|Etwas nachsichtig ignorieren.|Lass es noch mal durchgehen.",
  "Aus der Haut fahren.|Çileden çıkmak (Çok öfkelenmek).|Die Beherrschung verlieren.|Total ausrasten.",
  "Den Kopf in den Sand stecken.|Kafasını kuma gömmek (Gerçeklerden kaçmak).|Probleme ignorieren.|Sich verstecken bringt nix.",
  "Wir müssen eine Lösung finden.|Bir çözüm bulmalıyız.|Es ist erforderlich, eine Lösung zu erarbeiten.|Wir müssen was machen.",
  "Daran habe ich nicht gedacht.|Bunu düşünmemiştim.|Diesen Aspekt habe ich nicht berücksichtigt.|Da hab ich gar nicht dran gedacht.",
  "So ein Zufall!|Ne tesadüf!|Das ist ein bemerkenswertes Zusammentreffen.|Was für ein Zufall!",
  "Mir reicht's!|Yeter be! / Gına geldi!|Es ist für mich nun genug.|Das war's für mich.",
  "Das kommt gar nicht in Frage!|Bu söz konusu bile olamaz!|Das ist absolut ausgeschlossen.|Auf gar keinen Fall!",
  "Das bringt mich auf die Palme.|Bu beni deli ediyor.|Das macht mich äußerst wütend.|Das macht mich so aggressiv.",
  "Wer A sagt, muss auch B sagen.|Bir işe başlayan sonunu da getirmelidir.|Wer eine Sache anfängt, muss die Konsequenzen tragen.|Mitgegangen, mitgefangen.",
  "Jemandem auf die Nerven gehen.|Birinin sinirlerini bozmak.|Jemanden lästig belästigen.|Du nervst tierisch.",
  "Auf eigene Faust.|Kendi başına / Kendi inisiyatifiyle.|Ohne fremde Hilfe.|Hab ich selber gemacht.",
  "Es dreht sich alles um...|Her şey ... etrafında dönüyor (Tek konu bu).|Das zentrale Thema ist...|Hauptsache es geht um...",
  "Auf dem Laufenden bleiben.|Güncel kalmak (Haberdar olmak).|Sich über Neuigkeiten informieren.|Bleib mal auf dem aktuellsten Stand.",
  "Es sei denn, dass...|...olmadığı sürece / ...haricinde.|Unter der Ausnahme, dass...|Außer wenn...",
  "Ich bedaure, dass...|...olduğuna üzülüyorum (pişmanım).|Es tut mir leid, dass...|Finde ich nicht gut, dass...",
  "Es hat keinen Zweck.|Bunun bir anlamı / faydası yok.|Es ist sinnlos.|Bringt doch eh nichts.",
  "Es ist ratsam, zu...|...yapmak tavsiye edilir (akıllıca olur).|Es wird empfohlen zu...|Besser wäre es, wenn...",
  "Ich habe mich geirrt.|Yanılmışım.|Ich habe einen Fehler gemacht.|Da war ich wohl falsch.",
  "Die Hoffnung stirbt zuletzt.|Umut en son ölür.|Man sollte niemals aufgeben.|Vielleicht klappt's ja doch noch.",
  "Ich lege großen Wert darauf.|Buna büyük önem veriyorum.|Das hat für mich hohe Priorität.|Ist mir mega wichtig.",
  "Auf der Hand liegen.|Açık ve net olmak.|Klar erkennbar sein.|Ist doch ganz offensichtlich.",
  "Im Vorfeld.|Önceden / Başlangıçta.|Im Voraus.|Schon vorher.",
  "Erste Hilfe leisten.|İlk yardım yapmak.|Medizinische Erstversorgung durchführen.|Direkt helfen.",
  "Unter vier Augen.|Baş başa / Yalnızca ikimiz arasında.|In einem vertraulichen Gespräch.|Mal unter uns gesagt.",
  "Übertreiben Sie nicht!|Abartmayın!|Bitte mindern Sie Ihre Darstellung.|Mach mal halblang!",
  "Das Wort ergreifen.|Söz almak.|Anfangen zu sprechen.|Ich sag jetzt auch mal was.",
  "Sich in acht nehmen.|Dikkatli olmak / Sakınmak.|Vorsichtig sein.|Pass bloß auf.",
  "Etwas im Griff haben.|Bir şeyi kontrol altında tutmak.|Etwas kontrollieren können.|Ich hab das unter Kontrolle.",
  "Darauf kommt es an.|Önemli olan da bu / Buna bağlı.|Das ist das Entscheidende.|Da hängt alles dran.",
  "Den Kürzeren ziehen.|Kaybeden taraf olmak / Zararlı çıkmak.|Einen Nachteil davontragen.|Pech gehabt.",
  "Mit der Tür ins Haus fallen.|Paldır küldür konuya girmek.|Direkt zum Thema kommen, ohne Einleitung.|Gleich zur Sache kommen.",
  "Sich aus dem Staub machen.|Sıvışmak / Tüyüp gitmek.|Heimlich verschwinden.|Sich schnell verpissen.",
  "Schweigen ist Gold.|Sükut altındır.|Manchmal ist es besser, nichts zu sagen.|Einfach mal die Klappe halten.",
  "Der Schein trügt.|Görünüş aldatıcıdır.|Etwas sieht besser aus, als es ist.|Sieht nur so aus.",
  "Um den heißen Brei herumreden.|Lafı dolandırmak (Sadede gelmemek).|Ein Thema nicht direkt ansprechen.|Komm zum Punkt!"
];

const rawPhrasesB2 = [
  "Ich gehe davon aus, dass...|Şundan yola çıkıyorum/varsayıyorum ki...|Ich nehme an, dass...|Geh mal davon aus, dass...",
  "Es steht außer Frage.|Şüphesizdir. / Kesin.|Das ist unbestreitbar zweifellos.|Ist absolut sicher.",
  "Ich stehe auf dem Standpunkt, dass...|Şu görüşteyim ki...|Ich vertrete die Ansicht, dass...|Für mich ist klar, dass...",
  "Ich weise darauf hin, dass...|Şuna dikkatinizi çekerim ki... / Belirtmek isterim ki...|Ich möchte betonen, dass...|Muss man auf jeden Fall bedenken...",
  "Das hat zur Folge, dass...|Bunun sonucu şudur...|Daraus resultiert, dass...|Deswegen passiert dann...",
  "Das A und O|En önemli şey / İşin temeli|Das Wichtigste / Die Hauptsache|Das absolut Wichtigste.",
  "Ich bin der festen Überzeugung, dass...|Şuna kesinlikle inanıyorum ki...|Ich bin vollkommen sicher, dass...|Bin mir hundertpro sicher...",
  "In Bezug auf...|...ile ilgili olarak / ...aştısından|Bezüglich... / Hinsichtlich...|Was ... angeht...",
  "Ich ziehe in Betracht, dass...|Şunu göz önünde bulunduruyorum ki...|Ich berücksichtige, dass...|Muss man mit einplanen...",
  "Ein weiterer Aspekt ist...|Bir diğer husus da...|Ein zusätzlicher Punkt ist...|Noch 'ne Sache...",
  "Das ist darauf zurückzuführen, dass...|Bunun sebebi şudur...|Das liegt daran, dass...|Das kommt daher, dass...",
  "Aus meiner Sicht...|Benim bakış açıma göre...|Meiner Meinung nach...|So wie ich das sehe...",
  "Es macht Sinn, zu...|...yapmak mantıklı.|Es ist sinnvoll zu...|Macht voll Sinn...",
  "Dem kann ich nur zustimmen.|Buna sadece katılabilirim. (Tamamen katılıyorum.)|Ich stimme dem voll und ganz zu.|Dito! / 100 Prozent!",
  "Das steht im Widerspruch zu...|Bu, ...ile çelişiyor.|Das widerspricht...|Das beißt sich voll mit...",
  "Unter diesen Umständen...|Bu şartlar altında...|Angesichts dieser Situation...|So wie's jetzt aussieht...",
  "Es liegt auf der Hand, dass...|Şu çok açıktır ki...|Es ist offensichtlich, dass...|Ist doch sonnenklar...",
  "Ich zweifle daran, dass...|...olduğundan şüpheliyim.|Ich bezweifle, dass...|Glaub ich kaum...",
  "Im Gegensatz zu...|...in aksine / ...in tersine|Im Unterschied zu...|Ganz anders als...",
  "Darüber hinaus...|Bunun yanı sıra / Üstelik...|Zudem... / Außerdem...|Und oben drauf...",
  "Es lässt sich nicht leugnen, dass...|Şu inkar edilemez ki...|Es ist unbestreitbar, dass...|Gibt nix dran zu rütteln...",
  "Dabei spielt ... eine wesentliche Rolle.|Bu bağlamda ... önemli bir rol oynar.|... ist in diesem Zusammenhang wichtig.|... ist mega wichtig dabei.",
  "Ich bin gespaltener Meinung.|İki arada bir deredeyim. / Kararsızım.|Ich bin unentschlossen.|Einerseits so, andererseits so...",
  "Es bedarf keiner weiteren Erklärung.|Daha fazla açıklamaya gerek yok.|Das erklärt sich von selbst.|Erklärt sich von alleine.",
  "Einen Kompromiss schließen|Uzlaşmaya varmak|Sich auf einen Mittelweg einigen|Sich in der Mitte treffen",
  "Das bringt mich auf den Gedanken...|Bu beni şu düşünceye sevk ediyor...|Das lässt mich vermuten...|Da fällt mir gerade ein...",
  "Ich weigere mich zu glauben, dass...|...olduğuna inanmayı reddediyorum.|Ich will nicht glauben, dass...|Kommt für mich nicht in Frage...",
  "Letzten Endes...|Neticede / Sonuç olarak...|Schließlich / Am Ende...|Im Endeffekt...",
  "Ein entscheidender Faktor ist...|Belirleyici bir faktör şudur...|Ein ausschlaggebender Punkt ist...|Das Wichtigste ist eigentlich...",
  "Auf der einen Seite..., auf der anderen Seite...|Bir yandan..., diğer yandan...|Einerseits..., andererseits...|Einerseits, ... aber andererseits...",
  "Es hat sich herausgestellt, dass...|Şu ortaya çıktı ki...|Es ist deutlich geworden, dass...|Hat sich halt so ergeben...",
  "Ich lege großen Wert auf...|...a çok önem veriyorum.|... ist mir sehr wichtig.|Da leg ich mega Wert drauf.",
  "Soweit es mich betrifft...|Beni ilgilendirdiği kadarıyla...|Was mich angeht...|Also für mich...",
  "Es mangelt an...|...eksikliği var.|Es fehlt an...|Da fehlt's an allen Ecken und Enden...",
  "Im Grunde genommen...|Aslında / Temel olarak...|Eigentlich...|Im Prinzip...",
  "Es ist nicht auszuschließen, dass...|...ihtimali göz ardı edilemez.|Man kann nicht ausschließen, dass...|Könnte schon sein, dass...",
  "Das ist mir schleierhaft.|Bu bana çok kapalı/anlaşılmaz geliyor.|Das ist mir völlig unklar.|Null Peilung, warum das so ist.",
  "Einen großen Bogen um etwas machen|Bir şeyden uzak durmak|Etwas meiden|Da mach ich 'nen großen Bogen drum.",
  "Sich auf eigene Gefahr auf etwas einlassen|Riski göze alarak bir şeye kalkışmak|Ein Risiko eingehen|Auf eigene Gefahr halt.",
  "Das Eis brechen|Buzları kırmak|Die erste Annäherung schaffen|Mal so das Eis brechen.",
  "Zwei Fliegen mit einer Klappe schlagen|Bir taşla iki kuş vurmak|Zwei Ziele gleichzeitig erreichen|Zwei Sachen auf einmal erledigt.",
  "Den Faden verlieren|İpin ucunu kaçırmak|Den Gedanken verlieren|Was wollte ich grad sagen? Faden verloren.",
  "Auf den Punkt bringen|Sadede gelmek / Özetlemek|Zusammenfassen|Kurzer Sinn: ...",
  "Den Ball flach halten|Sakin olmak / Abartmamak|Ruhig bleiben|Bleib mal auf dem Teppich.",
  "Ein Tropfen auf den heißen Stein|Okyanusta bir damla (çok yetersiz)|Etwas völlig Unzureichendes|Bringt eh kaum was.",
  "Den Nagel auf den Kopf treffen|Tam üstüne basmak(tam olarak haklı olmak)|Etwas genau richtig erfassen|Bingo! Voll getroffen.",
  "Über den Tellerrand schauen|At gözlüğünü çıkarmak / Geniş düşünmek|Neue Perspektiven einnehmen|Mal bisschen weiter denken.",
  "Es steht in den Sternen.|Henüz belli değil. (Yıldızlarda yazılı)|Das ist noch völlig ungewiss.|Kein Mensch weiß, was wird.",
  "Das Haar in der Suppe suchen|Kusur aramak|Immer nur das Negative sehen|Immer was zu meckern haben.",
  "Ins kalte Wasser springen|Bilmediği bir işe atılmak / Zorlukla yüzleşmek|Eine neue, schwierige Aufgabe übernehmen|Einfach mal machen, ohne Plan."
];

const rawPhrasesC1 = [
  "Ich vertrete die Auffassung, dass...|Şu görüşü savunuyorum ki...|Ich bin der Meinung, dass...|Für mich steht fest...",
  "Es liegt auf der Hand, dass...|Açıkça ortadadır ki...|Es ist offensichtlich, dass...|Ist doch logisch...",
  "Dem ist hinzuzufügen, dass...|Buna eklenmelidir ki...|Man muss ergänzen, dass...|Was man noch sagen muss...",
  "In Anbetracht der Tatsache, dass...|Şu gerçek göz önüne alındığında...|Wenn man bedenkt, dass...|Da man ja weiß, dass...",
  "Es ist unumstritten, dass...|Tartışılmaz bir gerçektir ki...|Es steht außer Frage, dass...|Da gibt's keine Diskussion...",
  "Einen wesentlichen Beitrag leisten zu...|...ya önemli bir katkı sağlamak|Stark beitragen zu...|Viel bringen für...",
  "Auswirkungen haben auf...|...üzerinde etki/sonuç doğurmak|Beeinflussen...|Reinspielen bei...",
  "Nicht zu vernachlässigen ist...|İhmal edilmemesi gereken şey şudur...|Wichtig ist auch...|Darf man nicht vergessen...",
  "Es lässt sich darauf schließen, dass...|Şu sonuca varılabilir ki...|Das bedeutet wahrscheinlich, dass...|Sieht ganz danach aus, als ob...",
  "Einerseits..., andererseits jedoch...|Bir yandan..., ancak diğer yandan...|Auf der einen Seite..., auf der anderen aber...|Klar herrscht das, aber dann auch wieder...",
  "Es ist von immenser Bedeutung, dass...|...olması son derece önemlidir.|Das ist extrem wichtig...|Das ist absolut entscheidend...",
  "Sich einer Sache bewusst sein|Bir şeyin bilincinde olmak|Etwas genau wissen|Sich im Klaren darüber sein",
  "Maßnahmen ergreifen|Önlem/Tedbir almak|Handeln / Etwas tun|Was machen wegen...",
  "Im Vordergrund stehen|Ön planda olmak|Am wichtigsten sein|Das Wichtigste an der Sache sein",
  "Rücksicht nehmen auf...|...yı dikkate almak / saygı göstermek|Beachten...|Dran denken...",
  "Einhergehen mit...|...ile birlikte gelmek / eşlik etmek|Zusammenfallen mit...|Geht Hand in Hand mit...",
  "Den Grundstein legen für...|...için temel oluşturmak/atmak|Die Basis schaffen für...|Sorgen für den Start von...",
  "Erschwerend kommt hinzu, dass...|Durumu zorlaştıran bir diğer şey ise...|Ein weiteres Problem ist...|Das Schlimmste ist noch...",
  "Auf Widerstand stoßen|Direnişle/Tepkiyle karşılaşmak|Abgelehnt werden|Gegen eine Wand reden",
  "Die Konsequenzen tragen|Sonuçlarına katlanmak|Die Folgen übernehmen|Dafür geradestehen",
  "Es ist geprägt von...|...ile şekillenmiştir / karakterize edilir.|Es ist bestimmt durch...|Voller ... sein",
  "Ein hohes Maß an... erfordern|Yüksek düzeyde ... gerektirmek|Viel ... brauchen|Ohne viel ... geht das nicht",
  "Sich in einer Zwickmühle befinden|İkilemde kalmak / Aşağı tükürsen sakal...|Eine schwierige Entscheidung haben|In einer blöden Lage sein",
  "Übereinstimmen mit...|...ile uyuşmak / aynı fikirde olmak|Gleicher Meinung sein wie...|Auf einer Wellenlänge sein mit...",
  "Einen Schlussstrich ziehen|Kesip atmak / Bir konuyu ebediyen kapatmak|Etwas endgültig beenden|Einen Haken dran machen",
  "Aus der Luft gegriffen sein|Asılsız/tamamen uydurma olmak|Nicht der Wahrheit entsprechen|Völlig frei erfunden sein",
  "Das Handtuch werfen|Havlu atmak / Pes etmek|Aufgeben|Aufstecken / Kapitulieren",
  "Den Teufel an die Wand malen|En kötüsünü düşünmek / Felaket tellallığı yapmak|Das Schlimmste befürchten|Panik machen",
  "Sich kein Bein ausreißen|Kendini fazla yormamak (ironik)|Sich nicht besonders anstrengen|Sich nicht überarbeiten",
  "Öl ins Feuer gießen|Ateşe körükle gitmek|Einen Konflikt verschlimmern|Die Sache noch schlimmer machen",
  "Auf dem Holzweg sein|Yanlış yolda olmak / Yanılmak|Sich völlig irren|Sich total täuschen",
  "Wie ein Lauffeuer|Orman yangını gibi (hızla yayılmak)|Sehr schnell|Wie verrückt",
  "Ins Fettnäpfchen treten|Pot kırmak / Çam devirmek|Sich ungeschickt verhalten|Einen Fehler machen",
  "Etwas durch die Blume sagen|Bir şeyi üstü kapalı / imalı söylemek|Etwas indirekt ausdrücken|Durch die Hintertür sagen",
  "Eine harte Nuss zu knacken|Kırılması zor ceviz / Zor bir sorun|Ein schwieriges Problem|Ein echtes Problem",
  "Das ist Schnee von gestern|O eskidendi / Geçti gitti (Eski kar)|Das ist längst vergangen|Das ist Geschichte",
  "Mit allen Wassern gewaschen sein|Kaşarlaşmış olmak / Her numarayı bilmek|Sehr erfahren und raffiniert sein|Nicht auf den Kopf gefallen sein",
  "Haare auf den Zähnen haben|Dobra / Sert dilli / Çetin ceviz olmak|Streitsüchtig sein|Nicht leicht zu ertragen",
  "Jemandem auf den Schlips treten|Birini gücendirmek / Damarına basmak|Jemanden beleidigen|Jemanden kränken",
  "Sich etwas aus den Fingern saugen|Kafadan atmak / Uydurmak|Sich etwas ausdenken|Einfach was erfinden",
  "Den Spieß umdrehen|Durumu tersine çevirmek / Kendi lehine çevirmek|Die Rollen tauschen|Die Sache drehen",
  "Auf Herz und Nieren prüfen|Enine boyuna / Titizlikle incelemek|Sehr genau untersuchen|Genau unter die Lupe nehmen",
  "Das Schwarze Schaf sein|Kara koyun olmak (aileyi utandıran/farklı olan)|Der Außenseiter sein|Der Außenseiter",
  "Unter eine Decke stecken|Ortaklaşa hareket etmek / İşbirliği yapmak (gizlice)|Gegen andere zusammenarbeiten|Klüngeln",
  "Kein Blatt vor den Mund nehmen|Sözünü sakınmamak / Dolaysız konuşmak|Offen und ehrlich reden|Direkt raus damit",
  "Im Dunkeln tappen|Karanlıkta el yordamıyla aramak (Hiçbir şey bilmemek)|Nichts Genaues wissen|Keine Ahnung haben",
  "Das Ruder herumreißen|Dümeni kırmak (Kötü bir gidişatı düzeltmek)|Eine Entwicklung positiv verändern|Die Kurve kriegen",
  "Jemandem ein Dorn im Auge sein|Birinin gözüne batan diken olmak (rahatsızlık vermek)|Jemanden stören|Jemandem auf die Nerven gehen",
  "Sich ins eigene Fleisch schneiden|Kendi kuyusunu kazmak / Kendi zararına iş yapmak|Sich selbst schaden|Sich selbst ins Bein schießen",
  "Etwas auf die leichte Schulter nehmen|Bir şeyi hafife almak|Etwas nicht ernst genug nehmen|Das nicht eng sehen"
];

const mapAdjectives = (): Flashcard[] => rawAdjectives.map((item, i) => {
  const [term, tr, comp, sup, use] = item.split('|');
  const adjectiveForms = comp || sup || use ? {
    comparative: comp || '',
    superlative: sup || '',
    usage: use || ''
  } : undefined;
  
  return { 
    id: `adj_${i}`, 
    term, 
    translationTr: tr, 
    wordType: 'adjective', 
    level: 'A1-A2',
    adjectiveForms
  };
});

const mapNouns = (): Flashcard[] => rawNouns.map((item, i) => {
  const [germanPart, turkishPart] = item.split('|');
  const [art, word] = germanPart.split(' ');
  return { id: `noun_${i}`, term: word, translationTr: turkishPart, article: art, wordType: 'noun', level: 'A1-A2' };
});

const mapPhrases = (rawArr: string[], levelStr: string, listPrefix: string): Flashcard[] => rawArr.map((item, i) => {
  const [term, tr, redemittel, alltagssprache] = item.split('|');
  const phraseForms = redemittel || alltagssprache ? {
    redemittel: redemittel || '',
    alltagssprache: alltagssprache || '',
  } : undefined;
  
  return { 
    id: `${listPrefix}_${i}`, 
    term, 
    translationTr: tr, 
    wordType: 'phrase', 
    level: levelStr,
    phraseForms
  };
});

export const LIST_VERBS: VocabList = {
  id: 'verbs-100',
  title: '100 Temel Fiil',
  isDefault: true,
  words: mapVerbs()
};

export const LIST_ADJS: VocabList = {
  id: 'adjs-50',
  title: '50 Temel Sıfat',
  isDefault: true,
  words: mapAdjectives()
};

export const LIST_NOUNS: VocabList = {
  id: 'nouns-100',
  title: '100 Temel İsim',
  isDefault: true,
  words: mapNouns()
};

export const LIST_PHRASES_A1: VocabList = {
  id: 'phrases-a1',
  title: 'A1 Günlük İfadeler (Redemittel)',
  isDefault: true,
  words: mapPhrases(rawPhrasesA1, 'A1', 'phrase_a1')
};

export const LIST_PHRASES_A2: VocabList = {
  id: 'phrases-a2',
  title: 'A2 Günlük İfadeler (Redemittel)',
  isDefault: true,
  words: mapPhrases(rawPhrasesA2, 'A2', 'phrase_a2')
};

export const LIST_PHRASES_B1: VocabList = {
  id: 'phrases-b1',
  title: 'B1 Günlük İfadeler (Redemittel)',
  isDefault: true,
  words: mapPhrases(rawPhrasesB1, 'B1', 'phrase_b1')
};

export const LIST_PHRASES_B2: VocabList = {
  id: 'phrases-b2',
  title: 'B2 Günlük İfadeler (Redemittel)',
  isDefault: true,
  words: mapPhrases(rawPhrasesB2, 'B2', 'phrase_b2')
};

export const LIST_PHRASES_C1: VocabList = {
  id: 'phrases-c1',
  title: 'C1 Günlük İfadeler (Redemittel)',
  isDefault: true,
  words: mapPhrases(rawPhrasesC1, 'C1', 'phrase_c1')
};
