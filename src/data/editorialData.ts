import { Article, ArticleAuthor, ArticleCategory, EditorialAuditLog } from '../types';

export const EDITORIAL_CATEGORIES: ArticleCategory[] = [
  { id: 'toate', name: 'Toate articolele', slug: 'toate', description: 'Toate publicațiile și ghidurile Centrul CodeBau' },
  { id: 'ghiduri-practice', name: 'Ghiduri practice', slug: 'ghiduri-practice', description: 'Instrucțiuni pas cu pas pentru lucrări de construcție și finisare' },
  { id: 'materiale-tehnologii', name: 'Materiale și tehnologii', slug: 'materiale-tehnologii', description: 'Comparații tehnice, fișe și ghiduri de selecție a materialelor' },
  { id: 'renovari-proiecte', name: 'Renovări și proiecte', slug: 'renovari-proiecte', description: 'Planificare, estimări de buget și liste de cumpărături pe camere' },
  { id: 'idei-inspiratie', name: 'Idei și inspirație', slug: 'idei-inspiratie', description: 'Design interior, exterior, tendințe și soluții estetice' },
  { id: 'pentru-mesteri', name: 'Pentru meșteri', slug: 'pentru-mesteri', description: 'Productivitate, scule profesionale, Meister Club și organizare șantier' },
  { id: 'pentru-companii', name: 'Pentru companii', slug: 'pentru-companii', description: 'Logistică B2B, devize, achiziții centralizate și documentații' },
  { id: 'noutati-codebau', name: 'Noutăți CodeBau', slug: 'noutati-codebau', description: 'Știri corporative, extindere rețea, servicii noi și programe locale' },
  { id: 'reguli-standarde', name: 'Reguli și standarde', slug: 'reguli-standarde', description: 'Normative tehnice, siguranța muncii și certificări de calitate' },
];

export const EDITORIAL_AUTHORS: ArticleAuthor[] = [
  {
    id: 'author-1',
    name: 'Echipa CodeBau',
    role: 'Redacția Tehnică CodeBau',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
    biography: 'Echipa editorială CodeBau reunește ingineri constructori, consultanți de vânzări și specialiști în materiale de finisaj din sudul Moldovei.',
    verified: true,
    company: 'CodeBau Moldova'
  },
  {
    id: 'author-2',
    name: 'Ing. Mihai Sandu',
    role: 'Consultant Calitate & Tehnologii',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    biography: 'Peste 15 ani de experiență în inginerie civilă și consultanță tehnică pentru adezivi, tencuieli și sisteme de termoizolație.',
    verified: true,
    company: 'CodeBau Tehnic'
  },
  {
    id: 'author-3',
    name: 'Specialist Ceresit Henkel',
    role: 'Expert Tehnologic Partener',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    biography: 'Inginer tehnolog reprezentant al diviziei Ceresit Henkel Moldova, specializat în soluții de placare ceramică și hidroizolații.',
    verified: true,
    company: 'Ceresit Henkel'
  },
  {
    id: 'author-4',
    name: 'Meșter Valeriu Cociu',
    role: 'Meșter Verificat CodeBau Master',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    biography: 'Placator profesionist din mun. Cahul, membru al rețelei Meister Club cu peste 200 de proiecte rezidențiale și comerciale finalizate.',
    verified: true,
    company: 'Cociu Finisaje SRL'
  },
  {
    id: 'author-5',
    name: 'Elena Rusu',
    role: 'Administrator Editorial & SEO',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    biography: 'Responsabilă de gestionarea conținutului tehnic, verificarea surselor și optimizarea canalelor de informare ale Centrului CodeBau.',
    verified: true,
    company: 'CodeBau Media'
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    slug: 'cum-alegi-adezivul-potrivit-pentru-gresie-si-faianata',
    title: 'Cum alegi adezivul potrivit pentru gresie și faianță',
    subtitle: 'Ghid tehnic complet pentru clasele C1, C2TE și S1 în condiții de șantier',
    excerpt: 'Află ce înseamnă clasele adezivilor, când ai nevoie de flexibilitate superioară și cum calculezi cantitatea exactă de saci necesară pentru suprafața ta.',
    content: `## De ce este crucială alegerea adezivului potrivit?

Placarea ceramică este o investiție pe termen lung. Un adeziv nepotrivit ales doar după criteriul celui mai mic preț poate duce la fisurarea plăcilor, desprinderea gresiei la îngheț sau la infiltrații de apă sub placaj.

În raionale din sudul Moldovei (Cahul, Cantemir, Taraclia, Vulcănești), unde variațiile termice variază de la -20°C iarna la peste +38°C vara, elasticitatea adezivului joacă un rol determinant.

---

### Clasificarea europeană a adezivilor (Standard EN 12004)

Codurile înscrise pe sacii de adeziv au o semnificație tehnică precisă:

* **C1**: Adeziv cimentos normal (aderență ≥ 0.5 N/mm²). Recomandat pentru plăci ceramice mici și medii la interior pe suporturi minerale rigide.
* **C2**: Adeziv cimentos îmbunătățit (aderență ≥ 1.0 N/mm²). Obligatoriu pentru gresie porțelanată, spații umede și exterior.
* **T**: Rezistență la alunecare pe verticală (Thixotropic). Placa nu alunecă de pe perete la montaj.
* **E**: Timp deschis extins (Extended open time - până la 30 min). Îți permite să aplici adezivul pe o suprafață mai mare fără să prindă crustă uscată.
* **S1**: Deformabilitate / Flexibilitate (deformare transversală între 2.5 mm și 5 mm). Absorbe tensiunile structurale fără fisurare.

---

### Matricea de decizie pentru alegerea adezivului

| Tip suport & Locație | Tip placă ceramică | Clasa minimă recomandată | Produs Recomandat |
| :--- | :--- | :--- | :--- |
| **Pardoseală interior (Hol, Bucătărie)** | Gresie ceramică standard (până la 40x40cm) | **C1T** | Ceresit CM 11 Plus |
| **Baie / Bucătărie umedă** | Gresie porțelanată (60x60cm) | **C2TE** | Ceresit CM 16 |
| **Încălzire în pardoseală** | Gresie porțelanată / Piatră | **C2TE S1** | Ceresit CM 17 |
| **Fațade exterioare & Terase** | Porțelanată / Piatră mare | **C2TE S1** | Ceresit CM 17 Flex |

---

### Pași practici pentru preparare și aplicare

1. **Pregătirea suportului**: Curăță praful și aplică amorsă Ceresit CT 17 cu minim 4 ore înainte.
2. **Amestecarea**: Adaugă 6.0 – 6.5 litri de apă curată la un sac de 25kg CM 17. Amestecă la turație mică (500 rot/min) și lasă 5 minute de maturare.
3. **Pieptănarea dublă (Butter-Floating)**: La plăci mai mari de 40x40cm, aplică adeziv atât pe perete/podea, cât și pe spatele plăcii pentru o acoperire de 100%.

---

> **Sfatul Meșterului Valeriu (Master CodeBau)**: „Nu economisi la adeziv pe suprafețele cu încălzire în pardoseală. Un adeziv rigid C1 se va macina sub placă în 2-3 sezoane reci.”`,
    categoryId: 'materiale-tehnologii',
    tags: ['gresie', 'adezivi', 'ceresit', 'renovare baie', 'calculatoare'],
    authorId: 'author-2',
    reviewerId: 'author-3',
    heroImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'published',
    contentStatus: 'technically_verified',
    featured: true,
    publishedAt: '2026-07-20',
    updatedAt: '2026-07-25',
    readingTime: '6 min',
    relatedProductIds: ['prod-1', 'prod-cm11', 'prod-3', 'prod-4'],
    relatedSolutionIds: ['sol-montare-gresie', 'sol-renovare-baie'],
    relatedCalculatorId: 'calculator',
    seoTitle: 'Cum alegi adezivul potrivit pentru gresie - Ghid Tehnic CodeBau',
    seoDescription: 'Află ce înseamnă clasele C1T, C2TE, S1 și cum calculezi necesarul de adeziv Ceresit pentru plăcile tale ceramice.',
    canonicalUrl: 'https://codebau.md/ghiduri/cum-alegi-adezivul-potrivit-pentru-gresie-si-faianata',
    language: 'ro',
    isTestData: true,
    createdBy: 'author-2',
    updatedBy: 'author-5'
  },
  {
    id: 'art-2',
    slug: 'hidroizolarea-corecta-a-baii-inainte-de-placare',
    title: 'Hidroizolarea corectă a băii înainte de placare',
    subtitle: 'Protecția definitivă împotriva infiltrațiilor de apă în pereți și la vecini',
    excerpt: 'Descoperă pașii esențiali pentru aplicarea membranei hidroizolante lichide și a benzilor de etanșare la colțuri pentru prevenirea infiltrațiilor.',
    content: `## Apa — inamicul invizibil din spatele plăcilor ceramice

Chitul de rosturi și plăcile de gresie nu sunt 100% impermeabile. În timp, apa din cabina de duș sau de lângă cadă pătrunde prin micro-fisuri în suportul de beton sau gips-carton.

---

### Zonele critice care necesită hidroizolație obligatorie

1. **Pardoseala integrala a băii**: Se aplică hidroizolație cu ridicare pe perete de minim 15-20 cm.
2. **Zona dușului**: Perete pe o înălțime de minim 2.0 metri și lățime de 1.0 metru peste zona stropită.
3. **Colțurile dintre perete și podea**: Necesită bandă de etanșare elastică înglobată în primul strat de hidroizolație.

---

### Etape tehnologice de executare

* **Stratul 1 de amorsă**: Se aplică amorsă acrilică pentru uniformizarea absorbției.
* **Bandă de etanșare în colțuri**: Se fixează banda hidroizolantă flexibilă în colțurile interioare.
* **Primul strat de hidroizolație lichidă**: Se aplică cu trafaletul sau pensula cu mișcări verticale.
* **Al doilea strat de hidroizolație**: Se aplică după uscare (cca. 4-6 ore) cu mișcări orizontale (încrucișat).`,
    categoryId: 'ghiduri-practice',
    tags: ['renovare baie', 'hidroizolatie', 'mapelastic', 'gresie'],
    authorId: 'author-3',
    reviewerId: 'author-2',
    heroImage: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1200&auto=format&fit=crop&q=80',
    status: 'published',
    contentStatus: 'technically_verified',
    featured: false,
    publishedAt: '2026-07-18',
    updatedAt: '2026-07-22',
    readingTime: '5 min',
    relatedProductIds: ['prod-2', 'prod-1', 'prod-3'],
    relatedSolutionIds: ['sol-renovare-baie'],
    relatedCalculatorId: 'calculator',
    seoTitle: 'Hidroizolarea corectă a băii pas cu pas - Ghid CodeBau',
    seoDescription: 'Cum hidroizolezi corect spatiile umede folosind membrană lichidă și benzi elastice de colț.',
    canonicalUrl: 'https://codebau.md/ghiduri/hidroizolarea-corecta-a-baii-inainte-de-placare',
    language: 'ro',
    isTestData: true,
    createdBy: 'author-3',
    updatedBy: 'author-5'
  },
  {
    id: 'art-3',
    slug: 'cum-calculezi-cantitatea-de-vopsea-pentru-o-incapere',
    title: 'Cum calculezi cantitatea de vopsea pentru o încăpere',
    subtitle: 'Evită risipa și opririle neplanificate din timpul zugrăvitului',
    excerpt: 'Ghid pas cu pas pentru măsurarea pereților, scăparea golurilor de uși și ferestre și calcularea puterii de acoperire în 2 straturi.',
    content: `## Formula simplă de calcul pentru vopseaua lavabilă

Formula matematică utilizată de inginerii CodeBau:

$$\\text{Suprafață Pereți} = 2 \\times (\\text{Lungime} + \\text{Lățime}) \\times \\text{Înălțime} - \\text{Suprafață Uși/Ferestre}$$

---

### Exemplu practic: Cameră de 4m x 3m cu înălțime de 2.6m

* Perimetru = $2 \\times (4 + 3) = 14\\text{m}$
* Suprafață brută pereți = $14 \\times 2.6 = 36.4\\text{m}^2$
* Minus ușă (2m²) și fereastră (2.4m²) = $36.4 - 4.4 = 32.0\\text{m}^2$
* Suprafață tavan = $4 \\times 3 = 12.0\\text{m}^2$
* **Total de zugrăvit** = $44.0\\text{m}^2$

În 2 straturi cu vopsea cu consum de 0.12 L/m² per strat, ai nevoie de: $44 \\times 0.12 \\times 2 = 10.56\\text{ litri}$. Un găleată de 10L plus 1L rezervă este ideală.`,
    categoryId: 'renovari-proiecte',
    tags: ['vopsele', 'zugravire', 'calculatoare', 'renovare'],
    authorId: 'author-1',
    heroImage: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1200&auto=format&fit=crop&q=80',
    status: 'published',
    contentStatus: 'technically_verified',
    featured: false,
    publishedAt: '2026-07-15',
    updatedAt: '2026-07-15',
    readingTime: '4 min',
    relatedProductIds: ['prod-vopsea-1', 'prod-grund-vopsea'],
    relatedCalculatorId: 'calculator',
    seoTitle: 'Calcul cantitate vopsea lavabilă - Formula CodeBau',
    seoDescription: 'Află cum măsori suprafața pereților și câți litri de vopsea ai nevoie pentru zugrăvit.',
    language: 'ro',
    isTestData: true,
    createdBy: 'author-1',
    updatedBy: 'author-1'
  },
  {
    id: 'art-4',
    slug: 'termoizolarea-fatadei-in-conditiile-din-sudul-moldovei',
    title: 'Termoizolarea fațadei în condițiile din sudul Moldovei',
    subtitle: 'Alegerea între polistiren EPS80 și vată bazaltică pentru clima din Cahul și Taraclia',
    excerpt: 'Polistiren expansibil EPS80 vs vată minerală bazaltică: ce grosime este recomandată pentru clima caldă din Cahul și Taraclia.',
    content: `## Particularitățile climatice din sudul Moldovei

Regiunea de sud se caracterizează prin veri fierbinți cu insolație puternică și ierni cu vânturi uscate. Termoizolația nu doar menține căldura iarna, ci oprește supraîncălzirea casei vara.

### Grosimi recomandate:
* **Polistiren EPS80 Grafiat**: Grosime minimă 10 cm (recomandat 12-15 cm).
* **Vată bazaltică fațadă**: Grosime minimă 10 cm, densitate min. 135 kg/m³.`,
    categoryId: 'materiale-tehnologii',
    tags: ['termoizolatie', 'fatada', 'polistiren', 'vata minerala'],
    authorId: 'author-2',
    heroImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80',
    status: 'published',
    contentStatus: 'technically_verified',
    featured: false,
    publishedAt: '2026-07-12',
    updatedAt: '2026-07-12',
    readingTime: '7 min',
    relatedProductIds: ['prod-eps80', 'prod-adeziv-polistiren'],
    relatedSolutionIds: ['sol-termoizolatie'],
    relatedCalculatorId: 'calculator',
    seoTitle: 'Termoizolare fațadă sudul Moldovei - Recomandări CodeBau',
    seoDescription: 'Ghid practic de alegere a grosimii și tipului de termoizolație pentru eficiență energetică maximă.',
    language: 'ro',
    isTestData: true,
    createdBy: 'author-2',
    updatedBy: 'author-2'
  },
  {
    id: 'art-5',
    slug: 'cele-mai-frecvente-greseli-la-montarea-gresiei',
    title: 'Cele mai frecvente greșeli la montarea gresiei',
    subtitle: 'Cum eviți golurile de aer sub plăci și desprinderea în timp',
    excerpt: 'Aplicarea "mamă-tată" fără pieptănare, lipsa rosturilor de dilatație și neutilizarea nivelatoarelor cu pană — cum le eviți simplu.',
    content: `## TOP 5 greșeli periculoase pe șantier

1. **Montajul fără rosturi ("lipit de lipit")**: Ceramica se dilată la schimbările de temperatură. Lipsa rostului duce la spargerea plăcilor.
2. **Aplicarea adezivului în "turte"**: Creează goluri de aer sub placă. La primul obiect greu scăpat, placa se va fisura.
3. **Nivelarea pe adeziv gros**: Adezivul subțire nu este conceput pentru egalizări de peste 10mm.`,
    categoryId: 'ghiduri-practice',
    tags: ['gresie', 'greseala montaj', 'nivelatoare', 'adeziv'],
    authorId: 'author-4',
    heroImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&auto=format&fit=crop&q=80',
    status: 'published',
    contentStatus: 'technically_verified',
    featured: false,
    publishedAt: '2026-07-10',
    updatedAt: '2026-07-10',
    readingTime: '5 min',
    relatedProductIds: ['prod-1', 'prod-spacers'],
    relatedSolutionIds: ['sol-montare-gresie'],
    seoTitle: 'Greșeli frecvente la montarea gresiei - Sfatul Meșterului',
    seoDescription: 'Află cum eviți cele mai costisitoare greșeli la placările ceramice.',
    language: 'ro',
    isTestData: true,
    createdBy: 'author-4',
    updatedBy: 'author-4'
  },
  {
    id: 'art-6',
    slug: 'lista-materialelor-necesare-pentru-renovarea-unei-bai',
    title: 'Lista materialelor necesare pentru renovarea unei băi',
    subtitle: 'Ghidul complet de cumpărături pentru o baie modernă și rezistentă',
    excerpt: 'De la glet și amorsă până la hidroizolație, adezivi flexibili, rosturi și accoserii de protecție — lista de verificare pentru cumpărături.',
    content: `## Check-list cumpărături baie CodeBau

* **Etapa 1 - Pregătire**: Amorsă acrilică CT 17, tencuială hidrofobă.
* **Etapa 2 - Hidroizolație**: Membrană lichidă, bandă de colț flexibilă, manșete pentru țevi.
* **Etapa 3 - Placare**: Adeziv flexibil C2TE S1, gresie/faianță, nivelatoare cu pană.
* **Etapa 4 - Finisare**: Chit de rosturi impermeabil, silicon sanitar anti-mucegai.`,
    categoryId: 'renovari-proiecte',
    tags: ['baie', 'lista cumparaturi', 'renovare', 'pachet complet'],
    authorId: 'author-1',
    heroImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop&q=80',
    status: 'published',
    contentStatus: 'technically_verified',
    featured: false,
    publishedAt: '2026-07-08',
    updatedAt: '2026-07-08',
    readingTime: '4 min',
    relatedProductIds: ['prod-1', 'prod-2', 'prod-3', 'prod-4'],
    relatedSolutionIds: ['sol-renovare-baie'],
    seoTitle: 'Lista de materiale renovare baie - Ghid CodeBau',
    seoDescription: 'Lista completă de produse și cantități necesare pentru o baie de vis.',
    language: 'ro',
    isTestData: true,
    createdBy: 'author-1',
    updatedBy: 'author-1'
  },
  {
    id: 'art-7',
    slug: 'cum-isi-organizeaza-un-mester-comenzile-si-santierele',
    title: 'Cum își organizează un meșter comenzile și șantierele',
    subtitle: 'Eficientizarea timpului și cumpărăturilor cu acces 24/7 la lockere',
    excerpt: 'Planificarea stocurilor, utilizarea contului CodeBau Meister pentru comenzi rapide cu ridicare din locker 24/7 și fidelizarea clienților.',
    content: `## Productivitate pe șantier pentru meșteri profesioniști

Timpul pierdut în cozi la magazin înseamnă bani pierduți. Cu noul program CodeBau Meister Club:

1. Comanzi de pe telefon seara până la ora 21:00.
2. Ridici comanda dimineața la ora 07:00 din Lockerul 24/7 de la CodeBau Cahul sau Cantemir.
3. Mergi direct la șantier fără timpi morți.`,
    categoryId: 'pentru-mesteri',
    tags: ['pentru mesteri', 'meister club', 'lockere 24/7', 'organizare'],
    authorId: 'author-4',
    heroImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80',
    status: 'published',
    contentStatus: 'technically_verified',
    featured: false,
    publishedAt: '2026-07-05',
    updatedAt: '2026-07-05',
    readingTime: '5 min',
    seoTitle: 'Organizare șantier pentru meșteri - Ghid Meister CodeBau',
    seoDescription: 'Sfaturi practice pentru mesterii din sudul Moldovei.',
    language: 'ro',
    isTestData: true,
    createdBy: 'author-4',
    updatedBy: 'author-4'
  },
  {
    id: 'art-8',
    slug: 'achizitiile-centralizate-pentru-companiile-de-constructii',
    title: 'Achizițiile centralizate pentru companiile de construcții',
    subtitle: 'Managementul devizelor și livrărilor B2B la șantier',
    excerpt: 'Optimizați costurile logistice pe șantierele din Cahul, Cantemir și Taraclia prin contracte cadru B2B și facturare consolidată.',
    content: `## Soluții de aprovizionare pentru dezvoltatori și antreprenori

CodeBau B2B Corporate oferă acces la prețuri negociate de volum, manager dedicat de cont și livrare cu descărcare manipulat direct pe șantier.`,
    categoryId: 'pentru-companii',
    tags: ['b2b', 'companii', 'achizitii', 'livrare santier'],
    authorId: 'author-2',
    heroImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=1200&auto=format&fit=crop&q=80',
    status: 'published',
    contentStatus: 'technically_verified',
    featured: false,
    publishedAt: '2026-07-02',
    updatedAt: '2026-07-02',
    readingTime: '6 min',
    seoTitle: 'Achiziții B2B Construcții - Centrul CodeBau',
    seoDescription: 'Servicii corporative pentru firme de construcții în sudul Moldovei.',
    language: 'ro',
    isTestData: true,
    createdBy: 'author-2',
    updatedBy: 'author-2'
  },
  {
    id: 'art-9',
    slug: 'codebau-deschide-un-nou-punct-de-ridicare',
    title: 'CodeBau deschide un nou punct de ridicare automatizat 24/7',
    subtitle: 'Extindere rețea în raionul Taraclia pentru clienți și meșteri',
    excerpt: 'Punctul nou de ridicare Locker 24/7 din raionul Taraclia oferă acces permanent la materialele comandate online fără timp de așteptare.',
    content: `## Ridicare 24/7 disponibilă acum și în Taraclia

Ne extindem infrastructura logistică în sudul Moldovei. Noul locker securizat din Taraclia permite preluarea sacilor de adeziv, vopselei și sculelor la orice oră din zi sau noapte prin cod PIN unic primit pe SMS.`,
    categoryId: 'noutati-codebau',
    tags: ['noutati codebau', 'taraclia', 'lockere 24/7', 'extindere'],
    authorId: 'author-5',
    heroImage: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&auto=format&fit=crop&q=80',
    status: 'published',
    contentStatus: 'technically_verified',
    featured: false,
    publishedAt: '2026-07-01',
    updatedAt: '2026-07-01',
    readingTime: '3 min',
    seoTitle: 'Locker 24/7 Taraclia - Noutăți CodeBau',
    seoDescription: 'Noul punct automatizat de ridicare a comenzilor în Taraclia.',
    language: 'ro',
    isTestData: true,
    createdBy: 'author-5',
    updatedBy: 'author-5'
  }
];

export const INITIAL_EDITORIAL_AUDIT_LOGS: EditorialAuditLog[] = [
  {
    id: 'audit-1',
    articleId: 'art-1',
    articleTitle: 'Cum alegi adezivul potrivit pentru gresie și faianță',
    userId: 'user_admin',
    userRole: 'Administrator Editorial',
    action: 'published',
    details: 'Aprobat și publicat în Centrul CodeBau',
    timestamp: '2026-07-20T10:30:00Z'
  },
  {
    id: 'audit-2',
    articleId: 'art-2',
    articleTitle: 'Hidroizolarea corectă a băii înainte de placare',
    userId: 'user_tech',
    userRole: 'Specialist Tehnic',
    action: 'status_changed',
    details: 'Verificat din punct de vedere normativ și tehnic',
    timestamp: '2026-07-18T14:15:00Z'
  }
];
