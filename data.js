'use strict';
/* Winterkern – programmagegevens (oefeningen, sessies, schema, test) */
const LIB = [
 // ---- Core
 {c:"C01",g:"Core",n:"Dead bug",en:"dead bug exercise",why:"Romp stil houden terwijl armen en benen bewegen, net als bij het trappen.",cue:["Onderrug licht tegen de mat gedrukt","Uitademen terwijl je tegengestelde arm en been traag (3 s) uitstrekt"],fout:"Holle rug, te snel bewegen",mak:"Hiel tikt op de grond",moe:"Dumbbell in de handen of band boven het hoofd (trekken)"},
 {c:"C02",g:"Core",n:"Bird dog",en:"bird dog exercise",why:"Rugstrekkers en anti-rotatie met heel weinig belasting op de rug.",cue:["Rug als een tafelblad","Arm en tegengesteld been lang maken, niet hoog; 2 s vasthouden"],fout:"Heup draait open",mak:"Enkel het been bewegen",moe:"Elleboog naar knie onder het lichaam, band rond de voet"},
 {c:"C03",g:"Core",n:"Plank op onderarmen",en:"forearm plank",why:"Basis anti-extensie: je romp blijft stabiel als je laag op het stuur ligt.",cue:["Bilspieren aanspannen, ribben naar het bekken","Rechte lijn van hoofd tot hiel"],fout:"Doorhangende heupen of billen in de lucht",mak:"Op de knieën",moe:"Ellebogen verder voor de schouders (lange plank)"},
 {c:"C04",g:"Core",n:"Zijplank",en:"side plank",why:"Houdt je bekken horizontaal in het zadel en bij het sprinten.",cue:["Elleboog recht onder de schouder","Heupen hoog en licht naar voor"],fout:"Heup zakt, borst draait naar de grond",mak:"Op de onderste knie",moe:"Bovenste been heffen"},
 {c:"C05",g:"Core",n:"Pallof press",en:"pallof press band",why:"Anti-rotatie: kracht van de benen gaat in de pedalen, niet in een draaiende romp.",cue:["Band op borsthoogte, zijwaarts staan","Recht vooruit drukken, 3 s vasthouden, heupen en schouders blijven recht"],fout:"Meedraaien naar het anker",mak:"Dichter bij het anker staan",moe:"Verder weg, of met gestrekte armen zijwaarts wegstappen"},
 {c:"C06",g:"Core",n:"Hollow hold",en:"hollow body hold",why:"Spanning door de hele voorkant, handig bij sprints uit het zadel.",cue:["Onderrug tegen de grond","Schouderbladen los, armen langs de oren"],fout:"Onderrug komt los",mak:"Knieën gebogen, armen naar de voeten",moe:"Armen en benen lager"},
 {c:"C07",g:"Core",n:"Plank shoulder taps",en:"plank shoulder taps",why:"Anti-rotatie op de handen, bouwt ook schoudersterkte voor MTB.",cue:["Voeten breed","Heupen stil, geen schommelen"],fout:"Bekken zwiert mee",mak:"Op de knieën of voeten breder",moe:"Voeten smaller en trager tikken"},
 {c:"C08",g:"Core",n:"Copenhagen plank (kort)",en:"copenhagen plank short lever",why:"Adductoren en zijkant romp: voorkomt liesklachten bij sprinten en MTB.",cue:["Knie van het bovenste been op een bank of stoel","Heup hoog, onderste been hangt los"],fout:"Heup zakt door",mak:"Onderste voet licht op de grond",moe:"Voet in plaats van knie op de bank (alleen zonder liesklachten)"},
 {c:"C09",g:"Core",n:"Bear plank",en:"bear plank hold",why:"Romp en schouders samen, laag op de rug.",cue:["Handen onder schouders, knieën onder heupen","Knieën 3 cm van de grond"],fout:"Billen omhoog",mak:"Kortere houdtijd",moe:"Eén hand of voet optillen"},
 {c:"C10",g:"Core",n:"Renegade row",en:"renegade row dumbbell",why:"Anti-rotatie plus roeien: romp en rug in één oefening.",cue:["Plank op de dumbbells, voeten breed","Heupen blijven recht naar de grond gericht"],fout:"Heup draait open bij het roeien",mak:"Op de knieën",moe:"Voeten smaller, opdrukken tussen elke herhaling"},
 {c:"C11",g:"Core",n:"Suitcase carry / mars",en:"suitcase carry",why:"Anti-zijwaartse buiging en grip, zoals een fiets dragen of stuurwerk op MTB.",cue:["Eén dumbbell aan één kant","Schouders horizontaal, niet wegleunen"],fout:"Wegleunen van het gewicht",mak:"Lichter gewicht",moe:"Ter plaatse marcheren met hoge knie"},
 {c:"C12",g:"Core",n:"Body saw met handdoek",en:"body saw exercise",why:"Sterke anti-extensie met lange hefboom.",cue:["Plank op onderarmen, voeten op een handdoek op een gladde vloer","Lichaam 10–20 cm naar achter en terug schuiven"],fout:"Rug zakt hol bij naar achter schuiven",mak:"Kleine afstand",moe:"Grotere afstand, trager"},
 {c:"C13",g:"Core",n:"Chop halfgeknield",en:"half kneeling band chop",why:"Gecontroleerde rotatie van hoog naar laag.",cue:["Band hoog verankerd, op één knie","Diagonaal naar de tegenovergestelde heup, romp blijft stil"],fout:"Vanuit de rug trekken, heupen draaien",mak:"Lichtere band",moe:"Staand in lunge-stand"},
 {c:"C14",g:"Core",n:"Lift halfgeknield",en:"half kneeling band lift",why:"Rotatie van laag naar hoog, rug blijft neutraal.",cue:["Band laag verankerd","Diagonaal omhoog over het lichaam, bil van het achterste been aangespannen"],fout:"Achteroverleunen",mak:"Lichtere band",moe:"Smalle knielstand (voeten op een lijn)"},
 {c:"C15",g:"Core",n:"Zijplank met doorsteek",en:"side plank thread the needle",why:"Zijplank met rotatie: stabiliteit in beweging.",cue:["Volle zijplank","Vrije arm onder het lichaam door en weer open"],fout:"Heup zakt bij het doorsteken",mak:"Op de knie",moe:"Lichte dumbbell in de vrije hand"},
 // ---- Heupen
 {c:"H01",g:"Heupen",n:"Bilbrug",en:"glute bridge",why:"Bilspieren activeren die op de fiets vaak 'slapen'.",cue:["Hielen dicht bij de billen","Omhoog tot rechte lijn knie–schouder, niet hol"],fout:"Hol trekken in de onderrug",mak:"Kleiner bereik",moe:"Miniband boven de knie, 3 s boven vasthouden"},
 {c:"H02",g:"Heupen",n:"Eenbenige bilbrug",en:"single leg glute bridge",why:"Elke kant apart sterk, bekken stabiel.",cue:["Bekken blijft horizontaal","Duw door de hiel"],fout:"Bekken kantelt naar één kant",mak:"Andere voet licht steunen",moe:"Schouders op een bank"},
 {c:"H03",g:"Heupen",n:"Clamshell",en:"clamshell exercise band",why:"Kleine bilspier: houdt de knie in lijn op de pedaal.",cue:["Zijlig, knieën gebogen, voeten samen","Bovenste knie openen zonder het bekken te laten rollen"],fout:"Bekken rolt naar achter",mak:"Zonder band",moe:"Zwaardere miniband"},
 {c:"H04",g:"Heupen",n:"Zijwaarts stappen met band",en:"lateral band walk",why:"Heupstabiliteit, maakt de benen nauwelijks moe.",cue:["Band boven de knieën, licht door de knieën","Knieën duwen naar buiten, korte stappen"],fout:"Knieën vallen naar binnen",mak:"Band boven de knie",moe:"Band rond de enkels"},
 {c:"H05",g:"Heupen",n:"Hip thrust met dumbbell",en:"dumbbell hip thrust couch",why:"Sterke bilspieren voor kracht onderaan de pedaalslag.",cue:["Schouderbladen tegen de zetel, handdoek onder de dumbbell","2 s boven vasthouden, kin licht ingetrokken"],fout:"Overstrekken in de onderrug",mak:"Zonder gewicht",moe:"Eenbenig"},
 {c:"H06",g:"Heupen",n:"Eenbenige RDL",en:"single leg romanian deadlift",why:"Heupscharnier en balans; beschermt de onderrug.",cue:["Rug neutraal, heup scharniert","Heupen blijven recht naar de grond gericht"],fout:"Rug rondt, heup draait open",mak:"Teen van het achterste been licht op de grond",moe:"Dumbbell in de tegenovergestelde hand"},
 {c:"H07",g:"Heupen",n:"Zijlig been heffen",en:"side lying hip abduction",why:"Middelste bilspier, zonder belasting op de benen.",cue:["Bovenste been iets naar achter","Teen licht naar beneden, traag"],fout:"Been naar voor, heup rolt",mak:"Kleiner bereik",moe:"Miniband rond de enkels"},
 // ---- Rug & bovenlichaam
 {c:"R01",g:"Rug & bovenlijf",n:"Y-T-W op de buik",en:"prone YTW exercise",why:"Bovenrug en schouderbladen tegen de gebogen fietshouding.",cue:["Voorhoofd op een handdoek, duimen omhoog","Schouderbladen naar achter en onder"],fout:"Schouders naar de oren",mak:"Kleiner bereik",moe:"Flesje water of 0,5–1 kg in de hand"},
 {c:"R02",g:"Rug & bovenlijf",n:"Roeien met band",en:"resistance band row",why:"Rugspieren en houding.",cue:["Borst omhoog, ellebogen langs het lichaam naar achter","2 s vasthouden"],fout:"Achteroverleunen om te trekken",mak:"Lichtere band",moe:"Zwaardere band of eenarmig"},
 {c:"R03",g:"Rug & bovenlijf",n:"Band pull-apart",en:"band pull apart",why:"Opwarming voor schouders en bovenrug.",cue:["Armen gestrekt op schouderhoogte","Band uit elkaar tot de borst"],fout:"Holle rug",mak:"Band breder vastnemen",moe:"Band smaller vastnemen"},
 {c:"R04",g:"Rug & bovenlijf",n:"Opdrukken",en:"push up proper form",why:"Duwkracht en romp; nodig voor sturen op MTB en gravel.",cue:["Lichaam als een plank","Ellebogen ±45° van het lichaam"],fout:"Heupen hangen door",mak:"Op de knieën of handen op een bank",moe:"3 s naar beneden, of voeten hoger"},
 {c:"R05",g:"Rug & bovenlijf",n:"Eenarmig roeien",en:"one arm dumbbell row",why:"Sterke rug met steun, dus veilig voor de onderrug.",cue:["Hand en knie op een stoel, rug vlak","Elleboog naar de heupzak"],fout:"Romp draait mee",mak:"Lichter gewicht",moe:"3 s laten zakken"},
 {c:"R06",g:"Rug & bovenlijf",n:"Prone swimmers",en:"prone swimmers exercise",why:"Rugstrekkers en schouders, uithouding.",cue:["Op de buik, borst net los","Armen van voor naar achter langs de zij"],fout:"Hoofd ver omhoog",mak:"Borst op de grond",moe:"Benen ook licht los"},
 {c:"R07",g:"Rug & bovenlijf",n:"Floor press",en:"dumbbell floor press",why:"Duwkracht zonder schouderstress.",cue:["Op de rug, ellebogen tikken op de grond","Romp aangespannen"],fout:"Ellebogen recht opzij",mak:"Lichter gewicht",moe:"Eenarmig (extra romp)"},
 {c:"R08",g:"Rug & bovenlijf",n:"Face pull met band",en:"band face pull",why:"Achterkant schouders, tegen voorovergezakte schouders.",cue:["Band op hoofdhoogte","Naar het voorhoofd trekken, ellebogen hoog"],fout:"Uit de onderrug trekken",mak:"Lichtere band",moe:"2 s vasthouden"},
 // ---- Stabiliteit
 {c:"S01",g:"Stabiliteit",n:"Eenbenig staan",en:"single leg balance",why:"Voet-, knie- en heupcontrole; fijnmotoriek voor MTB.",cue:["Lichte knieplooi, knie boven de tweede teen","Bekken horizontaal"],fout:"Heup zakt aan de vrije kant",mak:"Vingertop tegen de muur",moe:"Ogen dicht, op een opgerolde handdoek, hoofd draaien"},
 {c:"S02",g:"Stabiliteit",n:"Ster-reiken",en:"star excursion balance",why:"Dynamische balans en kniecontrole.",cue:["Op één been, andere voet tikt voor, zij en achter","Zo ver als je de knie stabiel houdt"],fout:"Knie valt naar binnen",mak:"Minder ver reiken",moe:"Lichte dumbbell in de hand"},
 {c:"S03",g:"Stabiliteit",n:"90/90-ademhaling",en:"90 90 breathing",why:"Diepe buikspieren en herstel; zet het zenuwstelsel in rust.",cue:["Op de rug, voeten op een stoel","4 s in door de neus, 6 s volledig uit"],fout:"Schouders gaan omhoog bij inademen",mak:"Kortere uitademing",moe:"Ballon opblazen bij uitademen"},
 {c:"S04",g:"Stabiliteit",n:"Pallof-houd geknield",en:"tall kneeling pallof hold",why:"Anti-rotatie zonder hulp van de benen.",cue:["Rechtop op beide knieën","Band gestrekt voor de borst, 20–30 s houden"],fout:"Meedraaien of achteroverleunen",mak:"Lichtere band",moe:"Armen boven het hoofd strekken"},
 {c:"S05",g:"Stabiliteit",n:"Bear crawl",en:"bear crawl",why:"Coördinatie en romp in beweging.",cue:["Knieën net boven de grond","Rug vlak (denk: glas water op je rug)"],fout:"Billen hoog",mak:"Ter plaatse handen/voeten tikken",moe:"Achteruit en zijwaarts"},
 // ---- Mobiliteit
 {c:"M01",g:"Mobiliteit",n:"Kat-koe",en:"cat cow stretch",why:"Wervelkolom losmaken na lang zitten op de fiets.",cue:["Wervel per wervel bollen en hol maken","Rustig ademen"],fout:"Te snel",mak:"Kleiner bereik",moe:"Met 2 s pauze in elke stand"},
 {c:"M02",g:"Mobiliteit",n:"Open book",en:"open book stretch",why:"Draaimobiliteit van de bovenrug.",cue:["Zijlig, knieën 90°","Bovenste arm opent als een boek, blik volgt de hand"],fout:"Knieën gaan uit elkaar",mak:"Kussen onder het hoofd",moe:"2 s pauze en uitademen bij het openen"},
 {c:"M03",g:"Mobiliteit",n:"Thread the needle",en:"thread the needle stretch",why:"Bovenrug en schouder.",cue:["Op handen en knieën","Arm onder het lichaam door, schouder naar de grond"],fout:"Heupen schuiven opzij",mak:"Kleiner bereik",moe:"Arm daarna naar het plafond openen"},
 {c:"M04",g:"Mobiliteit",n:"World's greatest stretch",en:"worlds greatest stretch",why:"Heupbuiger, hamstring en bovenrug in één beweging.",cue:["Grote uitvalspas, hand naast de voet","Elleboog naar de enkel, dan arm naar het plafond"],fout:"Achterste knie gebogen",mak:"Achterste knie op de grond",moe:"Daarna voorste been strekken"},
 {c:"M05",g:"Mobiliteit",n:"Heupbuigerstretch",en:"half kneeling hip flexor stretch",why:"Heupbuigers staan op de fiets constant kort.",cue:["Op één knie, bil van het achterste been aanspannen","Bekken naar achter kantelen, dan pas licht naar voor"],fout:"Hol in de rug in plaats van stretch in de heup",mak:"Kussen onder de knie",moe:"Couch stretch: achterste voet tegen de zetel"},
 {c:"M06",g:"Mobiliteit",n:"90/90-heupwissel",en:"90 90 hip switch",why:"Rotatie in beide heupen.",cue:["Zit met beide knieën 90°","Knieën samen naar de andere kant laten vallen"],fout:"Met de handen te veel steunen",mak:"Handen achter je steunen",moe:"Zonder handen, rechtop"},
 {c:"M07",g:"Mobiliteit",n:"Hamstringstretch met handdoek",en:"supine hamstring stretch towel",why:"Lange hamstrings geven ruimte voor een lage houding.",cue:["Op de rug, handdoek rond de voet","Been gestrekt omhoog tot je rek voelt, onderrug op de grond"],fout:"Onderrug komt los, knie buigt",mak:"Knie licht gebogen",moe:"Teen naar je toe trekken"},
 {c:"M08",g:"Mobiliteit",n:"Kindhouding zijwaarts",en:"child pose lat stretch",why:"Brede rugspier en onderrug ontspannen.",cue:["Billen naar de hielen","Handen naar één kant laten wandelen"],fout:"Schouders opgetrokken",mak:"Knieën breder",moe:"Langer ademen naar de rekkende kant"},
 {c:"M09",g:"Mobiliteit",n:"Figuur-4 / duif",en:"figure four stretch",why:"Bilspier en piriformis los.",cue:["Enkel op de andere knie","Rug lang, rustig dieper"],fout:"Rug rondt",mak:"Op de rug liggend (figuur-4)",moe:"Duifhouding op de mat"},
 {c:"M10",g:"Mobiliteit",n:"Bovenrug over foamroller",en:"thoracic extension foam roller",why:"Opent de bovenrug na uren gebogen zitten.",cue:["Roller onder de schouderbladen, handen achter het hoofd","Achterover over de roller, niet op de onderrug"],fout:"Rollen op de onderrug",mak:"Kleiner bereik",moe:"Armen gestrekt boven het hoofd"},
 {c:"M11",g:"Mobiliteit",n:"Neerwaartse hond met kuitwissel",en:"downward dog pedal",why:"Kuiten, hamstrings en schouders.",cue:["Heupen hoog, rug lang","Om de beurt een hiel naar de grond"],fout:"Ronde rug",mak:"Knieën gebogen",moe:"Een been in de lucht"},
 {c:"M12",g:"Mobiliteit",n:"Borststretch in deur",en:"doorway pec stretch",why:"Opent de borst tegen voorovergezakte schouders.",cue:["Onderarm tegen de deurstijl, elleboog op schouderhoogte","Stap licht door"],fout:"Schouder schuift naar voor",mak:"Elleboog lager",moe:"Elleboog hoger (andere vezels)"},
 // ---- Losrollen
 {c:"F01",g:"Losrollen",n:"Quadriceps rollen",en:"foam roll quads",why:"Voorkant dij voelt minder strak na de gym.",cue:["Traag, 2–3 cm per seconde","Gevoelige plek 20 s vasthouden"],fout:"Snel heen en weer rollen",mak:"Meer gewicht op de handen",moe:"Benen gekruist (één been)"},
 {c:"F02",g:"Losrollen",n:"Bilspieren met tennisbal",en:"tennis ball glute release",why:"Bilspier en piriformis los.",cue:["Zit op de bal, enkel op de andere knie","Rustig zoeken, 20–30 s per plek"],fout:"Op de zenuw blijven drukken (tinteling = verplaatsen)",mak:"Foamroller in plaats van bal",moe:"Bal tegen de muur, staand"},
 {c:"F03",g:"Losrollen",n:"Bovenrug rollen",en:"foam roll upper back",why:"Bovenrug los voor betere houding.",cue:["Armen gekruist voor de borst","Billen laag, rollen van schouderblad tot midden rug"],fout:"Op de onderrug rollen",mak:"Billen op de grond",moe:"Iets draaien naar elke kant"},
 {c:"F04",g:"Losrollen",n:"Kuiten rollen",en:"foam roll calves",why:"Kuiten werken veel in sprint en klim.",cue:["Voet naar binnen en buiten draaien","Traag"],fout:"Te snel",mak:"Beide benen samen",moe:"Benen gekruist"},
 {c:"F05",g:"Losrollen",n:"Hamstrings rollen",en:"foam roll hamstrings",why:"Achterkant dij los.",cue:["Roller onder de dij","Traag van knie tot bil"],fout:"Op de knieholte rollen",mak:"Beide benen samen",moe:"Eén been, voet draaien"},
 {c:"F06",g:"Losrollen",n:"Voetzool met tennisbal",en:"tennis ball foot massage",why:"Voet los na de stugge fietsschoen.",cue:["Staand, gewicht naar wens","Hiel tot tenen"],fout:"Te hard drukken",mak:"Zittend",moe:"Langer op een gevoelige plek"},
 {c:"F07",g:"Losrollen",n:"Borst met tennisbal",en:"tennis ball pec release",why:"Voorkant schouder los.",cue:["Bal tussen borst en muur, net onder het sleutelbeen","Arm traag op en neer bewegen"],fout:"Op het bot drukken",mak:"Minder druk",moe:"Arm boven het hoofd bewegen"},
 // ---- Power
 {c:"P01",g:"Power",n:"Explosieve band-chop",en:"band rotational chop explosive",why:"Snelle rotatiekracht voor sprints en bochten in crits.",cue:["Snel diagonaal trekken vanuit heup en romp samen","3 s gecontroleerd terug"],fout:"Enkel met de armen",mak:"Lichtere band, trager",moe:"Staand en met een draai van de achterste voet"},
 {c:"P02",g:"Power",n:"Mountain climbers",en:"mountain climbers",why:"Snelle knieën met een stabiele romp, net als een sprint.",cue:["Handen onder de schouders","Heupen laag en stil"],fout:"Billen omhoog",mak:"Trager, voet tikt",moe:"Sneller of voeten op een handdoek"},
 {c:"P03",g:"Power",n:"Hand-release opdrukken",en:"hand release push up",why:"Explosieve duwkracht voor MTB.",cue:["Volledig op de grond, handen los","Explosief omhoog als één plank"],fout:"Heupen komen later dan de borst",mak:"Op de knieën",moe:"Handenklap bovenaan"},
 {c:"P04",g:"Power",n:"Halo met dumbbell",en:"dumbbell halo",why:"Schoudermobiliteit en romp onder wisselende last.",cue:["Dumbbell rond het hoofd, dicht bij het hoofd","Romp en ribben stil"],fout:"Hol in de rug",mak:"Halfgeknield, licht gewicht",moe:"Op één knie of op één been"}
];
const LIBMAP = Object.fromEntries(LIB.map(e=>[e.c,e]));

/* Sessions: items = [code, dose, extra] */
const BLOCKS = [
 {k:"b1",t:"Blok 1 · Controle",wk:"Week 1–4",d:"Traag tempo, lange houdtijden, perfecte vorm. Je bouwt verder op de 30-dagen-challenge: de basis wordt uithouding onder controle."},
 {k:"b2",t:"Blok 2 · Kracht",wk:"Week 5–8",d:"Zwaardere varianten, dumbbells en band. Minder herhalingen, meer weerstand. Rust 45 s tussen de oefeningen."},
 {k:"b3",t:"Blok 3 · Power & race",wk:"Week 9–12",d:"Snel uit, gecontroleerd terug. Rotatie, explosieve bewegingen en timerformaat. Week 12 is licht: je wordt raceklaar, niet moe."}
];
const S = [
 {id:"A1",b:"b1",t:"Romp & rug: controle",type:"A",min:30,rpe:"5–6",
  wu:[["M01","10"],["C02","6/zijde"],["H01","12"],["R03","15"]],
  main:{lab:"Circuit · 3 rondes",rest:"30 s tussen oefeningen, 1 min tussen rondes",items:[
   ["C01","8/zijde","tempo 3 s uit"],["C04","25 s/zijde","op de knie mag"],["H02","8/zijde",""],["R02","12","2 s vasthouden"],["C05","8/zijde","3 s vasthouden"],["R01","5× Y-T-W",""]]},
  cd:[["M05","30 s/zijde"],["M08","45 s"]],
  note:"Week 1: 2 rondes (na de basistest). Week 3: 3 rondes en houdtijden +5 s."},
 {id:"A2",b:"b1",t:"Romp & bovenlijf: houding",type:"A",min:30,rpe:"5–6",
  wu:[["M02","6/zijde"],["C02","6/zijde"],["H03","12/zijde"]],
  main:{lab:"Circuit · 3 rondes",rest:"30 s tussen oefeningen, 1 min tussen rondes",items:[
   ["C03","30 s",""],["H07","12/zijde","traag"],["C09","20 s",""],["R04","8–10","op de knieën mag"],["C14","8/zijde",""],["C11","30 s/zijde","stappen of ter plaatse"],["H06","6/zijde","zonder gewicht, traag"]]},
  cd:[["M07","30 s/zijde"],["M09","30 s/zijde"]],
  note:"Week 4 (deload): eerst de test, daarna 2 rondes."},
 {id:"B1",b:"b1",t:"Losrollen & heupen",type:"B",min:30,rpe:"2–3",
  wu:[["F01","60 s/been"],["F02","60 s/zijde"],["F03","60 s"],["F04","60 s/been"]],wuLab:"Losrollen · 10 min",
  main:{lab:"Mobiliteit · 10 min",rest:"rustig doorademen",items:[
   ["M04","5/zijde",""],["M05","45 s/zijde",""],["M07","45 s/zijde",""],["M02","8/zijde",""]]},
  cd:[["S03","2× 5 ademhalingen"],["S01","2× 30 s/been"],["C02","6/zijde traag"]],cdLab:"Stabiliteit · 8 min",
  note:"Doel: je voelt je achteraf frisser dan ervoor."},
 {id:"B2",b:"b1",t:"Bovenrug & achterketen",type:"B",min:30,rpe:"2–3",
  wu:[["F05","60 s/been"],["F06","60 s/voet"],["F07","45 s/zijde"],["F02","60 s/zijde"]],wuLab:"Losrollen · 9 min",
  main:{lab:"Mobiliteit · 12 min",rest:"rustig doorademen",items:[
   ["M06","8/zijde",""],["M10","8",""],["M12","45 s/zijde",""],["M11","60 s",""],["M09","45 s/zijde",""]]},
  cd:[["S02","2× 3 tikken/been"],["C01","6/zijde traag"],["S03","5 ademhalingen"]],cdLab:"Stabiliteit · 8 min",
  note:""},

 {id:"A3",b:"b2",t:"Kracht: rug & heup",type:"A",min:30,rpe:"6–7",
  wu:[["M01","10"],["C02","6/zijde"],["H01","12","miniband"],["R03","15"]],
  main:{lab:"Circuit · 3 rondes",rest:"45 s tussen oefeningen, 1 min tussen rondes",items:[
   ["C01","8/zijde","met dumbbell of band"],["C04","30 s/zijde","bovenste been heffen"],["H05","10","2 s boven"],["R05","10/zijde",""],["C13","8/zijde",""],["C08","15–20 s/zijde","korte versie"],["R06","8",""]]},
  cd:[["M05","30 s/zijde"],["M08","45 s"]],
  note:"Week 7: kies bij 2 oefeningen de moeilijkere versie (zie bibliotheek)."},
 {id:"A4",b:"b2",t:"Kracht: anti-rotatie & duwen",type:"A",min:30,rpe:"6–7",
  wu:[["M02","6/zijde"],["H04","10 stappen/zijde"],["C09","20 s"]],
  main:{lab:"Circuit · 3 rondes",rest:"45 s tussen oefeningen, 1 min tussen rondes",items:[
   ["C12","8",""],["C10","6/zijde",""],["H06","8/zijde","lichte dumbbell"],["C15","8/zijde",""],["R07","10",""],["C11","40 s/zijde","zwaarder dan blok 1"],["C06","20–30 s",""]]},
  cd:[["M07","30 s/zijde"],["M12","30 s/zijde"]],
  note:"Week 8 (deload): eerst de test, daarna 2 rondes."},
 {id:"B3",b:"b2",t:"Herstel & balans plus",type:"B",min:30,rpe:"2–3",
  wu:[["F01","60 s/been"],["F02","60 s/zijde"],["F03","60 s"],["F05","60 s/been"]],wuLab:"Losrollen · 10 min",
  main:{lab:"Mobiliteit · 10 min",rest:"rustig doorademen",items:[
   ["M04","5/zijde",""],["M06","8/zijde",""],["M05","45 s/zijde","couch stretch als het lukt"],["M03","6/zijde",""]]},
  cd:[["S01","2× 30 s/been","ogen dicht"],["S04","2× 20 s/zijde"],["S03","5 ademhalingen"]],cdLab:"Stabiliteit · 8 min",
  note:""},
 {id:"B4",b:"b2",t:"Schouders & heupen open",type:"B",min:30,rpe:"2–3",
  wu:[["F04","60 s/been"],["F06","60 s/voet"],["F07","45 s/zijde"],["F03","60 s"]],wuLab:"Losrollen · 9 min",
  main:{lab:"Mobiliteit · 12 min",rest:"rustig doorademen",items:[
   ["M10","8",""],["M02","8/zijde",""],["M11","60 s",""],["M09","45 s/zijde","duif als het lukt"],["M12","45 s/zijde",""]]},
  cd:[["S02","2× 3 tikken/been"],["S05","2× 20 s","ter plaatse of 2 m heen en terug"],["S03","5 ademhalingen"]],cdLab:"Stabiliteit · 8 min",
  note:""},

 {id:"A5",b:"b3",t:"Power: snel & stabiel",type:"A",min:30,rpe:"6–7",
  wu:[["M04","4/zijde"],["C02","6/zijde"],["H04","10 stappen/zijde"],["R08","12"]],
  main:{lab:"Circuit · 3 rondes",rest:"45 s tussen oefeningen, 1 min tussen rondes",items:[
   ["P01","6/zijde","snel uit, 3 s terug"],["C07","10/zijde",""],["P03","6–8",""],["H02","8/zijde","explosief omhoog"],["C05","6/zijde","met wegstappen"],["P04","6/richting",""],["S02","4/been","met lichte dumbbell"]]},
  cd:[["M05","30 s/zijde"],["M07","30 s/zijde"]],
  note:"Elke herhaling snel en scherp. Wordt het traag of slordig, stop dan de set."},
 {id:"A6",b:"b3",t:"Racecircuit op timer",type:"A",min:30,rpe:"7",
  wu:[["M01","10"],["M04","4/zijde"],["C09","20 s"],["R03","15"]],
  main:{lab:"Timer 40/20 · 3 rondes",rest:"40 s werk / 20 s wissel, 1 min tussen rondes",items:[
   ["P02","40 s",""],["C04","40 s","links"],["C04","40 s","rechts"],["P01","40 s","links/rechts wisselen"],["C10","40 s",""],["C01","40 s","vlot maar gecontroleerd"],["S05","40 s",""]]},
  cd:[["M08","45 s"],["M09","30 s/zijde"]],
  note:"Week 11: timer naar 45/15. Week 12: eerst de test, daarna 2 rondes 30/30."},
 {id:"B5",b:"b3",t:"Racebalans",type:"B",min:30,rpe:"2–3",
  wu:[["F01","60 s/been"],["F02","60 s/zijde"],["F04","60 s/been"],["F03","60 s"]],wuLab:"Losrollen · 10 min",
  main:{lab:"Mobiliteit · 10 min",rest:"rustig doorademen",items:[
   ["M04","5/zijde",""],["M05","45 s/zijde",""],["M06","8/zijde",""],["M12","30 s/zijde",""]]},
  cd:[["S01","3× 30 s/been","ogen dicht op handdoek, hoofd draaien"],["S02","2× 3 tikken/been"],["S03","5 ademhalingen"]],cdLab:"Stabiliteit · 8 min",
  note:""},
 {id:"B6",b:"b3",t:"Mobiliteitsflow op timer",type:"B",min:30,rpe:"2–3",
  wu:[["F03","60 s"],["F02","60 s/zijde"],["F05","60 s/been"]],wuLab:"Losrollen · 7 min",
  main:{lab:"Timer 45/15 · 2 rondes",rest:"45 s per oefening, 15 s wisselen",items:[
   ["M01","45 s",""],["M04","45 s","links/rechts wisselen"],["M06","45 s",""],["M11","45 s",""],["M02","45 s","links"],["M02","45 s","rechts"],["M09","45 s","links"],["M09","45 s","rechts"],["M08","45 s",""]]},
  cd:[["S03","2× 5 ademhalingen"],["S01","30 s/been"]],cdLab:"Afsluiten · 4 min",
  note:"Ideaal als licht programma de dag voor een wedstrijd vanaf het voorjaar."}
];
const SMAP = Object.fromEntries(S.map(s=>[s.id,s]));

const GRID = [
 [1,"b1","B1","A1 + test","Basistest, 2 rondes",false],
 [2,"b1","B2","A2","",false],
 [3,"b1","B1","A1","3 rondes, +5 s houden",false],
 [4,"b1","B2","A2 + test","Deload · 2 rondes",true],
 [5,"b2","B3","A3","",false],
 [6,"b2","B4","A4","",false],
 [7,"b2","B3","A3","2 oefeningen moeilijker",false],
 [8,"b2","B4","A4 + test","Deload · 2 rondes",true],
 [9,"b3","B5","A5","",false],
 [10,"b3","B6","A6","Timer 40/20",false],
 [11,"b3","B5","A6","Timer 45/15",false],
 [12,"b3","B6","A6 + test","Raceklaar · 2 rondes 30/30",true]
];
const BL={b1:"Controle",b2:"Kracht",b3:"Power"};

const TEST = [
 ["T1","Eenbenig staan, ogen dicht (S01)","Handen op de heupen, lichte knieplooi","Voet raakt de grond of je grijpt (max 60 s)","s per been"],
 ["T2","Vingertoppen–vloer","Staand, benen gestrekt, traag voorover","Laagste punt 2 s vast","cm (+ voorbij de tenen, − erboven)"],
 ["T3","Eenbenige bilbrug (H02)","Tempo 1 s op / 1 s neer","Bekken kantelt of je verliest de vorm (max 30)","herhalingen per been"],
 ["T4","Plank op onderarmen (C03)","Zoals in de bibliotheek","Heupen zakken of gaan omhoog (max 3:00)","tijd"],
 ["T5","Zijplank (C04)","Op de voeten, eerst links","Heup zakt (max 2:00)","tijd per zijde"]
];

