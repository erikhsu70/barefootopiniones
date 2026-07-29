const base = "/assets/images/models/";
const brandBase = "/assets/images/brands/";

function image(file, alt) {
  return { src: `${base}${file}`, alt };
}

function brandImage(file, alt) {
  return { src: `${brandBase}${file}`, alt };
}

function media(featured, gallery = []) {
  return { featured, gallery };
}

const altraLonePeak = image("altra__lone-peak-5.png", "Zapatillas Altra Lone Peak 5");
const beLenkaCity = image("be-lenka__city.png", "Zapatillas Be Lenka City");
const beLenkaElevate = image("be-lenka__elevate.png", "Zapatillas Be Lenka Elevate");
const beLenkaIcon = image("be-lenka__icon.png", "Zapatos Be Lenka Icon");
const beLenkaPrime = image("be-lenka__prime.png", "Zapatillas Be Lenka Prime");
const beLenkaNord = image("be-lenka__nord.png", "Botas Be Lenka Nord");
const beLenkaPolar = image("be-lenka__polar.png", "Botas Be Lenka Polar");
const beLenkaSierra = image("be-lenka__sierra.png", "Botas Be Lenka Sierra");
const beLenkaWinter = image("be-lenka__winter.png", "Botas Be Lenka Winter");
const beLenkaNevada = image("be-lenka__nevada.png", "Botas Be Lenka Nevada");
const beLenkaCharlotte = image("be-lenka__charlotte.png", "Botas altas Be Lenka Charlotte");
const beLenkaPolaris = image("be-lenka__polaris.png", "Botas de invierno Be Lenka Polaris");
const beLenkaRanger = image("be-lenka__ranger-2-0.png", "Botas Be Lenka Ranger 2.0");
const beLenkaEntice = image("be-lenka__entice.png", "Botines Be Lenka Entice");
const beLenkaWinter2 = image("be-lenka__winter-2-0.png", "Botas Be Lenka Winter 2.0");
const beLenkaOlympus = image("be-lenka__olympus.png", "Botas Be Lenka Olympus");
const beLenkaSnowfox = image("be-lenka__snowfox-kids.png", "Botas infantiles Be Lenka Snowfox 2.0");
const beLenkaJoy = image("be-lenka__joy.png", "Zapatillas infantiles Be Lenka Joy");
const beLenkaPlay = image("be-lenka__play.png", "Zapatillas infantiles Be Lenka Play");
const beLenkaPerk = image("be-lenka__perk.png", "Zapatos infantiles Be Lenka Perk");
const beLenkaJolly = image("be-lenka__jolly.png", "Zapatillas infantiles Be Lenka Jolly");
const beLenkaPanda = image("be-lenka__panda.png", "Botas infantiles Be Lenka Panda 2.0");
const beLenkaBrooklyn = image("be-lenka__brooklyn.png", "Zapatillas Be Lenka Brooklyn");
const beLenkaFlair = image("be-lenka__flair.webp", "Zapatillas Be Lenka Flair");
const beLenkaBellissima2022 = image("be-lenka__bellissima-2022.webp", "Bailarinas Be Lenka Bellissima de 2022");
const beLenkaSophie = image("be-lenka__sophie.png", "Bailarinas Be Lenka Sophie");
const beLenkaEazySand22 = image("be-lenka__eazy-sand-22.webp", "Zapatos sin cordones Be Lenka Eazy Sand 22");
const bearfootBruin = image("bearfoot__bruin.png", "Botas de trabajo Bearfoot Bruin");
const birchburyCarnforth = image("birchbury__carnforth.png", "Zapatos Birchbury Carnforth con puntera ancha");
const bobuxJodhpur = image("bobux__jodhpur-navy.webp", "Botas infantiles Bobux Jodhpur en azul marino");
const caretsVictoria = image("carets__victoria-wingtip.png", "Zapatos Carets Victoria Wingtip");
const feelgroundsOriginal = image("feelgrounds__original.png", "Zapatillas Feelgrounds Original");
const feelgroundsHighrise = image("feelgrounds__highrise.png", "Zapatillas altas Feelgrounds Highrise");
const feelgroundsDroptop = image("feelgrounds__droptop.png", "Zapatos sin cordones Feelgrounds Droptop");
const feelgroundsPatrol = image("feelgrounds__patrol.png", "Botas Feelgrounds Patrol");
const feelgroundsSeaside = image("feelgrounds__seaside.png", "Sandalias Feelgrounds Seaside");
const freetVibe = image("freet__vibe.png", "Zapatillas Freet Vibe");
const geaYrsa = image("gea-soles__yrsa.png", "Bailarinas Gea Soles Yrsa");
const groundiesBella = image("groundies__bella.png", "Bailarinas Groundies Bella");
const groundiesFelicia = image("groundies__felicia.png", "Bailarinas Groundies Felicia");
const groundiesLiverpool = image("groundies__liverpool-gx1.png", "Botas Groundies Liverpool GX1");
const groundiesPalermo = image("groundies__palermo.png", "Zapatos Groundies Palermo");
const groundiesPerformance = image("groundies__performance.png", "Zapatillas Groundies Performance");
const groundiesNova = image("groundies__nova.png", "Zapatillas Groundies Nova");
const groundiesAmsterdam = image("groundies__amsterdam.png", "Zapatos Groundies Amsterdam");
const groundiesOrlando = image("groundies__orlando.png", "Zapatillas Groundies Orlando");
const groundiesMelbourne = image("groundies__melbourne.png", "Zapatillas Groundies Melbourne");
const groundiesBrooklyn = image("groundies__brooklyn.png", "Zapatillas altas Groundies Brooklyn");
const groundiesLily = image("groundies__lily.png", "Bailarinas Groundies Lily");
const groundiesMilano = image("groundies__milano.png", "Zapatos Groundies Milano");
const groundiesFlorence = image("groundies__florence.png", "Sandalias Groundies Florence");
const groundiesVerona = image("groundies__verona.png", "Sandalias Groundies Verona");
const groundiesCadiz = image("groundies__cadiz.png", "Sandalias Groundies Cadiz");
const groundiesKos = image("groundies__kos.png", "Sandalias Groundies Kos");
const icarusAscent = image("icarus__ascent.png", "Zapatillas Icarus Ascent");
const lemsChelsea = image("lems__chelsea.png", "Botas Lems Chelsea");
const lemsChukka = image("lems__chukka.png", "Botas Lems Chukka");
const lemsPrimal = image("lems__primal-3.png", "Zapatillas Lems Primal 3");
const lisbethBoulder = image("lisbeth-joe__boulder.png", "Botas Lisbeth Joe Boulder");
const lisbethLondon = image("lisbeth-joe__london.png", "Mocasines Lisbeth Joe London");
const mukishoesChelsea = image("mukishoes__cork-chelsea.png", "Botas Mukishoes Cork Chelsea");
const mukishoesCloud = image("mukishoes__cloud.png", "Zapatillas Mukishoes Cloud");
const mukishoesIvy = image("mukishoes__ivy.png", "Zapatillas Mukishoes Ivy");
const mukishoesSaffron = image("mukishoes__saffron.png", "Zapatillas Mukishoes Saffron");
const mukishoesMossMini = image("mukishoes__moss-mini.png", "Zapatillas infantiles Mukishoes Moss Mini");
const mukishoesHope = image("mukishoes__hope.png", "Zapatillas Mukishoes Hope");
const mukishoesChallenge = image("mukishoes__challenge.png", "Zapatillas Mukishoes Challenge");
const oeshDream = image("oesh__dream-flats.png", "Bailarinas OESH Dream Flats");
const oeshTownie = image("oesh__townie-flats.png", "Zapatos planos OESH Townie");
const shammaTrailStars = image("shamma__trailstars-mini.png", "Sandalias Shamma TrailStars Mini");
const shapenIvy = image("shapen__ivy.webp", "Botines barefoot Shapen Ivy de cuero negro");
const shapenPoppy = image("shapen__poppy.webp", "Sandalias barefoot Shapen Poppy negras");
const shapenTulip = image("shapen__tulip-3-0.webp", "Bailarinas barefoot Shapen Tulip 3.0 negras");
const shapenFleur = image("shapen__fleur-2-0-oxford.webp", "Zapatos Oxford barefoot Shapen Fleur 2.0 negros");
const shapenDivine = image("shapen__divine.webp", "Botines barefoot Shapen Divine negros");
const shapenCozy = image("shapen__cozy.webp", "Botas barefoot Shapen Cozy 2.0 negras");
const shapenUrbaneer = image("shapen__urbaneer.webp", "Botas barefoot Shapen Urbaneer 2.0 en color caramelo");
const shapenFrosty = image("shapen__frosty.webp", "Botas de invierno barefoot Shapen Frosty en color oliva");
const softstarBallerine = image("softstar__ballerine.png", "Bailarinas Softstar Ballerine");
const softstarCamino = image("softstar__camino.png", "Sandalias Softstar Camino");
const softstarMerryJane = image("softstar__primal-merry-jane.png", "Zapatos Softstar Primal Merry Jane");
const softstarSawyer = image("softstar__sawyer.png", "Zapatos Softstar Sawyer");
const softstarVintage = image("softstar__vintage-tie.png", "Bailarinas Softstar Vintage Tie");
const softstarOxford = image("softstar__oxford.png", "Zapatos Softstar Oxford");
const softstarVintageView = image("softstar__vintage-tie-view.png", "Bailarinas Softstar Vintage Tie en color negro");
const softstarVintageView2 = image("softstar__vintage-tie-2.png", "Bailarinas Softstar Vintage Tie en color cuero");
const softstarVintageView3 = image("softstar__vintage-tie-3.png", "Bailarinas Softstar Vintage Tie con lazo");
const strongFeet = image("strong-feet-athletics__zapatilla-de-ciclismo-con-horma-anatomica.png", "Zapatillas de ciclismo Strong Feet Athletics Leviathan");
const tadeevoVelvet = image("tadeevo__velvet-ballet-pump.png", "Bailarinas de terciopelo Tadeevo Velvet Ballet Pump");
const tikkiMoon = image("tikki__moon-graffiti.png", "Zapatos infantiles Tikki Moon Graffiti");
const vivoAddis = image("vivobarefoot__addis.png", "Zapatos Vivobarefoot Addis");
const vivoFulham = image("vivobarefoot__fulham.png", "Botas Vivobarefoot Fulham");
const vivoGeoCourt = image("vivobarefoot__geo-court.png", "Zapatillas Vivobarefoot Geo Court");
const vivoGobi3 = image("vivobarefoot__gobi-iii.png", "Zapatos Vivobarefoot Gobi III");
const vivoGobiHi = image("vivobarefoot__gobi-hi-iv.png", "Botas Vivobarefoot Gobi Hi IV");
const vivoJing = image("vivobarefoot__jing-jing-ii.png", "Bailarinas Vivobarefoot Jing Jing II");
const vivoAbaba = image("vivobarefoot__ababa.png", "Sandalias infantiles Vivobarefoot Ababa");
const vivoMotus = image("vivobarefoot__motus-flex.png", "Zapatillas de entrenamiento Vivobarefoot Motus Flex");
const vivoOpanka = image("vivobarefoot__opanka.png", "Zapatos Vivobarefoot Opanka");
const vivoRa = image("vivobarefoot__ra-slip-on.png", "Zapatos Vivobarefoot Ra Slip On");
const vivoRyder = image("vivobarefoot__ryder.png", "Botas Vivobarefoot Ryder");
const vivoScott = image("vivobarefoot__scott.png", "Botas Vivobarefoot Scott");
const vivoTracker = image("vivobarefoot__tracker.png", "Botas de montaña Vivobarefoot Tracker");
const wildlingCrane = image("wildling__crane.png", "Zapatos Wildling Crane");
const wildlingPegasus = image("wildling__pegasus.png", "Zapatos Wildling Pegasus");
const wildlingRanidae = image("wildling__ranidae.png", "Botas de lluvia Wildling Ranidae");
const wildlingHoneybear = image("wildling__honeybear.png", "Zapatos de invierno Wildling Honeybear");
const wildlingNessie = image("wildling__nessie.png", "Zapatos de invierno Wildling Nessie");
const wildlingYew = image("wildling__yew.png", "Botas Wildling Yew");
const wildlingChestnut = image("wildling__chestnut-clean.webp", "Botas Wildling Chestnut");
const wildlingChokeberry = image("wildling__chokeberry.png", "Botas infantiles Wildling Chokeberry");
const wildlingPine = image("wildling__pine.png", "Zapatos infantiles Wildling Pine");
const wildlingSaiga = image("wildling__saiga.png", "Zapatos Wildling Saiga");
const wildlingManul = image("wildling__manul.png", "Zapatillas Wildling Manul");
const wildlingKul = image("wildling__kul.png", "Zapatos infantiles Wildling Kul");
const wildlingTanuki = image("wildling__tanuki-kokoro.png", "Zapatos Wildling Tanuki Kokoro");
const wildlingFeather = image("wildling__feather-forest.png", "Sandalias Wildling Feather Forest");
const wildlingTengri = image("wildling__tengri.png", "Zapatos Wildling Tengri");
const wildlingFlyingFox = image("wildling__flying-fox.png", "Botas Wildling Flying Fox");
const xero360 = image("xero__360.png", "Zapatillas de entrenamiento Xero 360");
const xeroPhoenix = image("xero__phoenix.png", "Bailarinas Xero Phoenix");
const xeroXcursion = image("xero__xcursion-fusion.png", "Botas de montaña Xero Xcursion Fusion");
const xeroZTrek = image("xero__z-trek.png", "Sandalias Xero Z-Trek");
const xeroPhoenixLeather = image("xero-shoes__phoenix-leather.png", "Bailarinas Xero Phoenix Leather");
const xeroPhoenixKnit = image("xero-shoes__phoenix-knit.png", "Bailarinas Xero Phoenix Knit");
const xeroAptos = image("xero-shoes__aptos.png", "Zapatos sin cordones Xero Aptos");
const xeroAlpine = image("xero-shoes__alpine.png", "Botas de invierno Xero Alpine");
const xeroGracie = image("xero-shoes__gracie.png", "Botas de lluvia Xero Gracie");
const xeroZelen = image("xero-shoes__zelen.png", "Zapatillas Xero Zelen");
const xeroKelso = image("xero-shoes__kelso.png", "Zapatillas Xero Kelso");
const xeroTerraFlex = image("xero-shoes__terraflex.png", "Zapatillas de montaña Xero TerraFlex II");
const xeroAquaCloud = image("xero-shoes__aqua-cloud.png", "Sandalias Xero Aqua Cloud");
const xeroAshland = image("xero-shoes__ashland.png", "Botas Xero Ashland");
const xeroForzaTrainer = image("xero-shoes__forza-trainer.png", "Zapatillas Xero Forza Trainer");
const xeroForzaRunner = image("xero-shoes__forza-runner.png", "Zapatillas Xero Forza Runner");
const xeroDenver = image("xero-shoes__denver-leather.png", "Botas Xero Denver Leather");
const xeroMesaTrail = image("xero-shoes__mesa-trail-ii.png", "Zapatillas Xero Mesa Trail II");
const xeroPrioSuede = image("xero-shoes__prio-suede.png", "Zapatillas Xero Prio Suede");
const xeroPrioAllDay = image("xero-shoes__prio-all-day-sr.webp", "Zapatillas de trabajo Xero Prio All-Day SR");
const xeroRidgewayMid = image("xero-shoes__ridgeway-mid-original.webp", "Botas Xero Ridgeway Mid originales");
const xeroDillon = image("xero-shoes__dillon.png", "Zapatillas Xero Dillon");
const xeroGlenn = image("xero-shoes__glenn.png", "Zapatos Xero Glenn");
const xeroSunrise = image("xero-shoes__sunrise.png", "Zapatos sin cordones Xero Sunrise");
const xeroPrioNeo = image("xero-shoes__prio-neo.png", "Zapatillas Xero Prio Neo");
const xeroBreckenridge = image("xero-shoes__breckenridge.png", "Botas Xero Breckenridge");
const xeroChelsea = image("xero-shoes__chelsea.png", "Botas Xero Ridgeway Chelsea");
const xeroDillonLeather = image("xero-shoes__dillon-leather.webp", "Zapatillas Xero Dillon Leather");
const xeroDillonYouth = image("xero-shoes__dillon-slip-on-youth.webp", "Zapatillas infantiles Xero Dillon Slip-On Youth");
const zeazooCheetah = image("zeazoo__cheetah.png", "Mocasines Zeazoo Cheetah");
const zeazooDingo = image("zeazoo__dingo.png", "Botas infantiles Zeazoo Dingo");
const anglesFashionBrand = brandImage("angles-fashion.webp", "Zapatillas de cuero Angles Fashion");
const baheBrand = brandImage("bahe.webp", "Zapatillas barefoot Bahe");
const barebaricsBrand = brandImage("barebarics.webp", "Zapatillas Barebarics");
const bohempiaBrand = brandImage("bohempia.webp", "Zapatillas de lona Bohempia");
const earthRunnersBrand = brandImage("earth-runners.webp", "Sandalias Earth Runners");
const littleLoveBugBrand = brandImage("little-love-bug.webp", "Zapatos infantiles Little Love Bug");
const paperkraneBrand = brandImage("paperkrane.webp", "Zapatillas PaperKrane");
const realfootBrand = brandImage("realfoot.webp", "Zapatillas Realfoot");
const saguaroBrand = brandImage("saguaro.webp", "Zapatillas barefoot Saguaro");
const tenLittleBrand = brandImage("ten-little.webp", "Zapatos infantiles Ten Little");
const tolosBrand = brandImage("tolos.webp", "Zapatillas Tolos");
const whitinBrand = brandImage("whitin.webp", "Zapatillas barefoot Whitin");
const zaqqBrand = brandImage("zaqq.webp", "Zapatillas de cuero ZAQQ");

module.exports = {
  "altra-lone-peak-review-minimalist-trail-running-shoes": media(altraLonePeak),
  "angles-fashion-review-barefoot-shoes": media(anglesFashionBrand),
  "bahe-barefoot-running-walking-shoes-grounding": media(baheBrand),
  "barebarics-review-best-chunky-barefoot-sneakers": media(barebaricsBrand),
  "be-lenka-barefoot-winter-boots-review-polar-nord-sierra-winter": media(beLenkaNord, [beLenkaSierra, beLenkaPolar, beLenkaWinter]),
  "be-lenka-barefoot-boots-review-winter-2023-collection": media(beLenkaNevada, [beLenkaCharlotte, beLenkaPolaris, beLenkaRanger, beLenkaEntice, beLenkaWinter2, beLenkaOlympus, beLenkaSnowfox]),
  "be-lenka-barefoot-kids-review": media(beLenkaJolly, [beLenkaPlay, beLenkaPerk, beLenkaJoy, beLenkaPanda, beLenkaSnowfox]),
  "be-lenka-barefoot-review-2022": media(beLenkaBrooklyn, [beLenkaFlair, beLenkaEntice, beLenkaBellissima2022, beLenkaSophie, beLenkaEazySand22]),
  "be-lenka-city-review-casual-barefoot-sneakers": media(beLenkaCity),
  "be-lenka-elevate-barefoot-sneakers-review": media(beLenkaElevate),
  "belenka-icon-review": media(beLenkaIcon),
  "belenka-barefoot-prime-review": media(beLenkaPrime),
  "belenka-winter-boots-review": media(beLenkaWinter),
  "bearfoot-bruin-review-barefoot-work-boots-that-are-actually-functional": media(bearfootBruin),
  "birchbury-carnforth-wide-toe-box-shoes": media(birchburyCarnforth),
  "bobux-kids-boots-review": media(bobuxJodhpur),
  "bohempia-review-time-to-throw-away-your-converse-vans": media(bohempiaBrand),
  "carets-victoria-wingtip-minimalist-womens-brogue": media(caretsVictoria),
  "earth-runners-barefoot-sandals-review": media(earthRunnersBrand),
  "feelgrounds-barefoot-sneakers-review-complete-guide": media(feelgroundsOriginal, [feelgroundsHighrise, feelgroundsDroptop, feelgroundsPatrol, feelgroundsSeaside]),
  "feelgrounds-droptop-review": media(feelgroundsDroptop),
  "feelgrounds-highrise-review": media(feelgroundsHighrise),
  "feelgrounds-original-review": media(feelgroundsOriginal),
  "feelgrounds-patrol-review-vegan-barefoot-winter-boots": media(feelgroundsPatrol),
  "freet-vibe-review-free-feet-good-vibes": media(freetVibe),
  "gea-soles-yrsa-flat-review": media(geaYrsa),
  "groundies-bella-review": media(groundiesBella),
  "groundies-felicia-review-classic-flats-made-with-feet-in-mind": media(groundiesFelicia),
  "groundies-liverprool-gx1-boots-a-mini-review": media(groundiesLiverpool),
  "groundies-palermo-review-mens-barefoot-dress-shoe": media(groundiesPalermo),
  "groundies-performance-review-retro-barefoot-sneakers": media(groundiesPerformance),
  "groundies-spring-2023-beautiful-barefoot-shoes-two-widths": media(groundiesNova, [groundiesAmsterdam, groundiesOrlando, groundiesMelbourne, groundiesBrooklyn, groundiesLily, groundiesMilano, groundiesFlorence, groundiesVerona, groundiesCadiz, groundiesKos]),
  "icarus-ascent-review-a-barefoot-shoe-that-transitions-with-you": media(icarusAscent),
  "lems-chelsea-boots-like-blundstones-but-better": media(lemsChelsea),
  "lems-shoes-chukka-review": media(lemsChukka),
  "the-lems-primal-3-an-all-purpose-wide-sneaker": media(lemsPrimal),
  "lisbeth-joe-boulder-boot-a-mini-review": media(lisbethBoulder),
  "lisbeth-joe-london-review-barefoot-loafers": media(lisbethLondon),
  "little-love-bug-review": media(littleLoveBugBrand),
  "mukishoes-cork-chelsea-review": media(mukishoesChelsea),
  "mukishoes-spring-2022-review-cloud-ivy-saffron-mini-moss": media(mukishoesCloud, [mukishoesIvy, mukishoesSaffron, mukishoesMossMini]),
  "mukishoes-review-fresh-colors-for-spring-2023": media(mukishoesHope, [mukishoesChallenge]),
  "oesh-dream-flats-review": media(oeshDream),
  "oesh-townie-flats-review": media(oeshTownie),
  "paperkrane-barefoot-shoes-with-spunk": media(paperkraneBrand),
  "realfoot-review-my-toes-have-never-been-more-free": media(realfootBrand),
  "saguaro-barefoot-shoes-review-affordable-sneakers-whole-family": media(saguaroBrand),
  "shamma-trail-stars-mini-review": media(shammaTrailStars),
  "new-shapen-barefoot-boots-for-fall-2023": media(shapenDivine, [shapenIvy, shapenCozy, shapenUrbaneer, shapenFrosty]),
  "shapen-review-barefoot-dress-shoes-women": media(shapenIvy, [shapenPoppy, shapenTulip, shapenFleur]),
  "softstar-ballerine-review": media(softstarBallerine),
  "softstar-camino-comfort-sandals-for-the-barefoot-shoe-wearer": media(softstarCamino),
  "softstar-shoes-review-primal-merry-jane": media(softstarMerryJane),
  "softstar-shoes-sawyer-review": media(softstarSawyer),
  "softstar-vintage-tie-barefoot-flats-anya": media(softstarVintage, [softstarVintageView, softstarVintageView2, softstarVintageView3]),
  "new-softstar-shoes-oxfords-dressy-minimalist-shoes-two-widths": media(softstarOxford),
  "cycling-shoes-but-foot-shaped-strong-feet-athletics-review": media(strongFeet),
  "tadeevo-velvet-ballet-pump-review-barefoot-dress-shoe": media(tadeevoVelvet),
  "ten-little-kids-review": media(tenLittleBrand),
  "tikki-shoes-moon-graffiti-review": media(tikkiMoon),
  "tolos-review-newest-barefoot-shoe-brand": media(tolosBrand),
  "vivobarefoot-addis-review": media(vivoAddis),
  "vivobarefoot-fulham-2019-version": media(vivoFulham),
  "vivobarefoot-fulham-review-barefoot-chelsea-boot": media(vivoFulham),
  "vivobarefoot-geo-court-review": media(vivoGeoCourt),
  "vivobarefoot-gobi-hi-top-iii-review": media(vivoGobiHi),
  "vivobarefoot-gobi-iii-review": media(vivoGobi3),
  "vivobarefoot-jing-jing-review": media(vivoJing),
  "vivobarefoot-kids-ababa-sandals-review": media(vivoAbaba),
  "vivobarefoot-motus-flex-review": media(vivoMotus),
  "vivobarefoot-opanka-review-barefoot-slip-on": media(vivoOpanka),
  "vivobarefoot-ra-slip-on-review": media(vivoRa),
  "vivobarefoot-ryder-review": media(vivoRyder),
  "vivobarefoot-scott-review": media(vivoScott),
  "vivobarefoot-tracker-review-barefoot-hiking-boots": media(vivoTracker),
  "wildling-crane-review": media(wildlingCrane),
  "wildling-pegasus-review": media(wildlingPegasus),
  "wildling-ranidae-the-best-wide-rain-boot-around": media(wildlingRanidae),
  "wildling-shoes-winter-review-honeybear-nessie": media(wildlingHoneybear, [wildlingNessie]),
  "wildling-shoes-fall-2022-collection-review": media(wildlingYew, [wildlingChestnut, wildlingChokeberry, wildlingPine]),
  "wildling-shoes-spring-summer-2022-review": media(wildlingSaiga, [wildlingManul, wildlingKul, wildlingTanuki, wildlingFeather, wildlingTengri, wildlingFlyingFox]),
  "whitin-barefoot-sneakers-review": media(whitinBrand),
  "whitin-the-best-cheap-barefoot-shoes": media(whitinBrand),
  "xero-360-review-barefoot-cross-training-shoe": media(xero360),
  "xero-barefoot-shoes-review": media(xeroPhoenix, [xeroPhoenixLeather, xeroPhoenixKnit, xeroAptos, xeroAlpine]),
  "xero-shoes-spring-2022-review": media(xeroGracie, [xeroPrioAllDay, xeroZelen, xeroKelso, xeroTerraFlex, xeroAquaCloud, xeroAshland]),
  "xero-shoes-winter-2022-all-new-models-reviewed-here": media(xeroForzaTrainer, [xeroForzaRunner, xeroDenver, xeroMesaTrail, xeroPrioSuede]),
  "xero-shoes-spring-2023-review-hiking-casual-dressy": media(xeroRidgewayMid, [xeroDillon, xeroGlenn, xeroSunrise, xeroPrioNeo]),
  "xero-shoes-fall-2024-review": media(xeroDillonLeather, [xeroBreckenridge, xeroChelsea, xeroDillonYouth]),
  "xero-shoes-phoenix-review-barefoot-ballet-flat": media(xeroPhoenix),
  "xero-xcursion-review-waterproof-barefoot-hiking-boot": media(xeroXcursion),
  "xero-z-treks-review": media(xeroZTrek),
  "zeazoo-kids-cheetah-review-barefoot-boat-shoes": media(zeazooCheetah),
  "zeazookids-brand-review": media(zeazooDingo),
  "zaqq-barefoot-brand-review": media(zaqqBrand)
};
