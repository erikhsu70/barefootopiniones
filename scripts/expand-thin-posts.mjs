import fs from "node:fs";
import path from "node:path";

const MIN_WORDS = 1250;
const MARKER = "<!-- editorial-expansion:v1 -->";
const FOLLOW_UP_MARKER = "<!-- editorial-expansion:v2 -->";
const roots = ["src/posts", "src/imported/posts"];
const ignoredPattern = /(black-friday|cyber-monday|discount|coupon|sales)/i;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).flatMap((name) => {
    const file = path.join(dir, name);
    const stat = fs.statSync(file);
    if (stat.isDirectory()) return walk(file);
    if (!name.endsWith(".md")) return [];
    if (ignoredPattern.test(file)) return [];
    return [file];
  });
}

function parseMarkdown(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  return {
    frontmatter: match ? match[1] : "",
    body: match ? raw.slice(match[0].length) : raw,
    prefix: match ? match[0] : ""
  };
}

function metaValue(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*["']?(.+?)["']?\\s*$`, "m"));
  return match ? match[1].replace(/^['"]|['"]$/g, "") : "";
}

function wordCount(text) {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/\[[^\]]+\]\([^)]+\)/g, " ")
    .replace(/[#*_`>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function contextFor(title, permalink, file) {
  const text = `${title} ${permalink} ${file}`.toLowerCase();
  if (/kid|niñ|child|baby|toddler|school|youth/.test(text)) return "kids";
  if (/boot|bota|winter|hiking|senderismo|rain|waterproof/.test(text)) return "boots";
  if (/sandal|sandalia|huarache/.test(text)) return "sandals";
  if (/sneaker|zapatilla|court|gym|running|athletic|sport/.test(text)) return "sneakers";
  if (/dress|ballet|flat|mary|loafer|oxford|formal|style|fashion|wear-this|estilo/.test(text)) return "style";
  if (/review|revisión|reseña|brand|marca/.test(text)) return "review";
  if (/why|benefit|transition|exercise|walk|foot|resources|guide|care|fit|type/.test(text)) return "guide";
  if (/giveaway|event|survey|sorteo|evento|try-on|about-me/.test(text)) return "evergreen";
  return "general";
}

function intro(title, context) {
  const base = {
    kids: `Este tema merece un poco mas de contexto porque con calzado infantil no basta con que el zapato sea mono. En "${title}" conviene mirar crecimiento, autonomia, durabilidad y espacio real para los dedos.`,
    boots: `Para valorar bien "${title}" no me quedo solo con la foto bonita. En botas y calzado de exterior importan mucho el ajuste, la flexibilidad, el agarre y como se comportan despues de varias horas de uso.`,
    sandals: `En sandalias barefoot, el detalle pequeno cambia mucho la experiencia. En "${title}" merece la pena hablar de sujecion, tiras, forma de la planta y de si realmente sirven para caminar sin ir agarrando el zapato con los dedos.`,
    sneakers: `Las zapatillas barefoot pueden parecer sencillas, pero no todas funcionan igual. En "${title}" hay que separar estilo, ajuste, flexibilidad y uso real para no comprar solo por la primera impresion.`,
    style: `Cuando hablamos de estilo barefoot, el reto no es solo encontrar algo bonito. En "${title}" tambien importa que el zapato encaje con ropa normal y que no parezca una decision ortopedica disfrazada.`,
    review: `Para que "${title}" sea util, prefiero mirarlo como lo miraria alguien antes de comprar: ajuste, materiales, tipo de pie, sensacion al caminar y posibles puntos debiles.`,
    guide: `Esta guia necesita una lectura practica. "${title}" no va solo de teoria barefoot, sino de como tomar mejores decisiones con tus pies, tus zapatos y tu rutina diaria.`,
    evergreen: `Este contenido se mantiene como referencia dentro del archivo de Barefoot Opiniones. Aunque el contexto original pueda venir de una noticia, evento o publicacion puntual, aqui lo enfoco de forma evergreen para que te ayude a decidir mejor.`,
    general: `Para que "${title}" sea mas util, lo importante es convertir la idea principal en criterios practicos: que mirar, para quien tiene sentido y que errores evitar.`
  };
  return base[context] || base.general;
}

const blocks = {
  fit: (title) => `## Como miro el ajuste antes de recomendarlo

Antes de valorar ${title}, siempre pienso en tres zonas: dedos, empeine y talon. La puntera tiene que dejar que los dedos descansen sin montarse unos encima de otros. El empeine no deberia obligarte a apretar cordones como si estuvieras cerrando una maleta. Y el talon tiene que quedar estable, sin rozar ni salirse a cada paso.

Un zapato barefoot no tiene que sentirse suelto. Tiene que sentirse libre, que no es lo mismo. Si el pie baila dentro, vas a compensar con los dedos o con la forma de caminar. Si aprieta, por muy flexible que sea la suela, deja de ser una opcion amable para el pie.

Mi truco favorito es probarlo al final del dia, cuando el pie esta un poco mas expandido. Si ahi sigue comodo, hay muchas mas probabilidades de que funcione en la vida real.`,

  criteria: () => `## Criterios que uso para separar una buena opcion de una regular

No todo lo que se vende como barefoot merece el mismo entusiasmo. Yo miro si la suela es plana, si se flexiona sin pelearse contigo, si la puntera respeta la forma del pie y si el material acompana el movimiento. Tambien miro el peso, porque un zapato muy pesado puede sentirse torpe aunque tenga buena forma.

Despues viene la parte practica: disponibilidad, tallas, cambios, facilidad para limpiar y si el modelo combina con la ropa que ya tienes. Un zapato perfecto sobre el papel sirve de poco si al final se queda en el armario porque no sabes con que ponertelo.

Para mi, una buena compra barefoot es la que usas mucho sin pensar demasiado. Si necesitas justificarla cada mañana, probablemente no era tan buena compra.`,

  footTypes: () => `## Para que tipo de pie puede funcionar mejor

La anchura es solo una parte de la historia. Dos personas pueden tener la misma talla y necesitar zapatos muy distintos. Hay pies anchos en la zona de los dedos, pies estrechos de talon, pies con mucho volumen, pies planos, empeines altos y dedos especialmente largos.

Si tienes pie ancho, mira la plantilla desde arriba y no te fies solo de la palabra "wide". Si tienes bajo volumen, busca buen ajuste con cordones o velcros. Si tu empeine es alto, evita modelos con lengueta corta o materiales rigidos. Y si estas entre tallas, prioriza que los dedos tengan espacio delante sin que el talon pierda estabilidad.

La mejor senal es simple: puedes mover los dedos, el pie no se desplaza dentro y no tienes que "domar" el zapato durante semanas.`,

  mistakes: () => `## Errores que intentaria evitar

El primer error es comprar una talla mas grande para ganar anchura. A veces funciona, pero muchas veces solo consigues un zapato largo, inestable y con el punto de flexion donde no toca. El segundo error es quedarse con un modelo que roza desde el primer dia pensando que cedera mucho. Algunos materiales ceden, si, pero no hacen milagros.

Tambien evitaria elegir solo por estetica. Lo bonito importa, claro que importa, pero en calzado barefoot la forma manda. Si la puntera es estrecha, si la suela es rigida o si el talon te obliga a caminar raro, no compensa.

Y el ultimo error: cambiar todo tu armario de golpe. Mejor probar un par, usarlo de verdad y aprender que necesita tu pie antes de comprar tres mas.`,

  transition: () => `## Si estas en transicion al barefoot

Si vienes de calzado convencional, no hace falta pasar de cero a cien. Tus pies, gemelos y tobillos pueden necesitar tiempo para adaptarse a una suela mas plana y flexible. Empieza con paseos cortos, alterna con zapatos que ya toleras y observa como responde el cuerpo.

La transicion no deberia sentirse como una penitencia. Puede haber trabajo muscular nuevo, pero no dolor persistente. Si notas molestias fuertes, baja ritmo, revisa talla y considera introducir ejercicios suaves de pies. A veces el problema no es el barefoot en si, sino un cambio demasiado brusco.

Me gusta pensar en el barefoot como una conversacion con el cuerpo: das un paso, escuchas, ajustas y sigues.`,

  style: () => `## Como lo integraria en un armario normal

Para que un zapato barefoot funcione en el dia a dia, tiene que encajar con tu ropa real. No con una vida imaginaria de Pinterest. Si usas vaqueros, mira como queda con vaqueros. Si usas vestidos, pruebalo con largos y siluetas distintas. Si vas mucho de negro, no compres un color dificil solo porque estaba de moda.

Las proporciones ayudan mucho. Los pantalones rectos, anchos o ligeramente cropped suelen equilibrar mejor la puntera amplia. Los pitillos muy ajustados, en cambio, pueden hacer que cualquier zapato parezca mas grande.

Mi regla: si el zapato ya tiene presencia, simplifica el resto. Si el look es basico, puedes permitirte un color o textura mas especial.`,

  use: () => `## Uso real: donde tiene sentido y donde no

No todos los zapatos barefoot sirven para todo. Algunos son maravillosos para ciudad pero pobres para lluvia. Otros tienen agarre suficiente para caminar mucho, pero no son lo mas elegante. Y algunos son comodisimos, aunque no los elegiria para un viaje si tardan mucho en secarse o se manchan con mirarlos.

Por eso me gusta pensar en escenarios concretos: caminar al trabajo, hacer recados, viajar, salir a cenar, llevar ninos al parque, caminar por adoquines o pasar muchas horas de pie. Cuando imaginas el uso real, la decision se vuelve mucho mas clara.

Un buen zapato no tiene que ganar en todas las categorias. Tiene que ser honesto en la categoria para la que lo compras.`,

  compare: () => `## Comparado con calzado convencional

La diferencia mas grande no siempre se nota en la primera foto. Se nota al final del dia. En un zapato convencional, el pie suele adaptarse al zapato: dedos juntos, talon elevado, suela rigida y poca informacion del suelo. En una opcion barefoot bien elegida, el zapato se adapta mas al pie.

Eso puede cambiar la postura, la forma de caminar y la sensacion de cansancio. No es magia, ni significa que todo problema desaparezca, pero si elimina varias interferencias habituales.

La pregunta que me hago es: este zapato permite que el pie haga de pie, o le esta pidiendo que se comporte como otra cosa?`,

  final: (title) => `## Mi lectura final

Si tuviera que resumir ${title}, diria que lo importante es no quedarse en la etiqueta barefoot. Hay que mirar forma, ajuste, uso y coherencia con tu vida. Un zapato puede ser saludable en teoria y no servirte a ti. Y otro puede parecer sencillo, pero convertirse en el par que mas usas.

Mi consejo es elegir con calma, medir el pie, revisar la politica de cambios y pensar en tres looks o situaciones donde lo usarias. Si no se te ocurren, espera. Si encaja de forma natural, probablemente vas por buen camino.

Barefoot no deberia sentirse como renunciar al estilo. Deberia sentirse como dejar de negociar con zapatos que nunca tuvieron en cuenta la forma de tus pies.`
};

function followUpExpansion(title, context) {
  const base = [
    `## Como convertir esta recomendacion en una compra acertada

Antes de decidir, conviene separar lo que llama la atencion en una foto de lo que realmente vas a notar caminando. En barefoot, una horma bonita no sirve de mucho si aprieta los dedos, si el talon baila o si la suela te obliga a cambiar la pisada de golpe. Mi forma de filtrar ${title} es sencilla: primero miro si respeta la forma del pie, despues si tiene sentido para mi rutina y, por ultimo, si encaja con la ropa que ya uso. Ese orden evita compras impulsivas y ayuda a elegir pares que no acaban olvidados en el armario.

Tambien merece la pena probar cada modelo en casa durante varios minutos, no solo de pie delante del espejo. Camina, sube escaleras, agachate, ponte de puntillas y comprueba si el upper acompana el movimiento. Si notas presion constante en el dedo gordo, si el borde roza el tobillo o si el pie se va hacia delante, no lo ignores pensando que se arreglara solo. Algunos materiales ceden, pero una mala forma de base rara vez se convierte en comoda con el tiempo.`,

    `## Detalles que suelo revisar dos veces

Un detalle importante es la plantilla. Muchas marcas anaden una plantilla gruesa para que el zapato parezca mas amable al principio, pero eso puede cambiar el volumen interior y hacer que el ajuste sea menos barefoot. Si tienes el empeine alto, prueba el calzado con y sin plantilla para ver cual de las dos configuraciones te da mejor sensacion. Si tienes el pie fino, revisa que puedas ajustar cordones, velcros o correas sin deformar el zapato.

La flexibilidad tambien debe tener sentido. No busco que todo se doble como una zapatilla de ballet, especialmente en botas o calzado de invierno, pero si que permita que el pie trabaje de forma natural. Una suela demasiado rigida puede ser util en terrenos concretos, aunque para diario normalmente prefiero algo que no bloquee la flexion del antepie. En cambio, una suela extremadamente fina puede cansar si vienes de calzado convencional y pasas muchas horas sobre asfalto.`,

    `## Para quien tiene mas sentido

Este tipo de articulo tiene mas valor cuando lo usas como punto de partida, no como una receta cerrada. Si tu prioridad es vestir mejor sin renunciar a espacio para los dedos, fijate en colores faciles, siluetas limpias y materiales que envejezcan bien. Si buscas caminar mas, prioriza agarre, peso y ajuste. Si estas comprando para ninos, deja margen real de crecimiento, pero sin convertir el zapato en una barca que les haga tropezar.

La mejor compra suele ser la que encaja con tu vida concreta. No es lo mismo necesitar un par para oficina, para viajar, para colegio, para lluvia o para entrenar suave. Cuando una recomendacion parece buena en general pero no responde a tu escenario, es mejor seguir mirando. En barefoot hay suficientes opciones como para no conformarse con un zapato que solo cumple una parte de la lista.`,

    `## Mi criterio final

Para mi, un buen par barefoot tiene que desaparecer durante el dia. No deberia obligarte a pensar en el roce, en el dedo pequeno, en si combina o en si la suela se siente rara a cada paso. Cuando el ajuste es correcto, el calzado acompana sin robar protagonismo. Por eso prefiero recomendar menos modelos pero mejor escogidos, explicar sus limites y dejar claro en que casos los descartaria.

Si dudas entre dos tallas, dos anchos o dos estilos, normalmente gana el que puedas usar mas dias seguidos. El calzado barefoot funciona mejor cuando se integra en la rutina, no cuando queda reservado para ocasiones muy concretas. Esa es la diferencia entre una compra curiosa y una compra que realmente cambia la relacion con tus pies.`
  ];

  if (context === "kids") {
    base[2] = `## Para pies infantiles

En calzado infantil miro tres cosas antes que el diseno: espacio delante, sujecion y facilidad para ponerlo. Un zapato infantil barefoot no deberia comprimir los dedos, pero tampoco debe quedar tan grande que el nino compense agarrando con los dedos o arrastrando el pie. Lo ideal es que pueda correr, saltar y cambiar de direccion sin que el zapato se desplace.

Tambien recomiendo revisar el ajuste cada pocas semanas, porque los ninos pueden crecer de golpe y no siempre avisan de que algo les aprieta. Si el upper marca los dedos, si aparecen rozaduras o si empiezan a quitarse el calzado en cuanto pueden, suele haber una pista clara. Mejor comprobarlo pronto que esperar a que el zapato se quede pequeno del todo.`;
  }

  return `\n${FOLLOW_UP_MARKER}\n\n${base.join("\n\n")}`;
}

function blockOrder(context) {
  const common = ["fit", "criteria", "footTypes", "mistakes", "transition", "use", "compare", "final"];
  if (context === "style") return ["style", "fit", "criteria", "footTypes", "mistakes", "use", "final"];
  if (context === "sneakers") return ["style", "fit", "criteria", "footTypes", "transition", "mistakes", "final"];
  if (context === "kids") return ["fit", "criteria", "footTypes", "use", "mistakes", "final"];
  if (context === "guide") return ["criteria", "footTypes", "transition", "mistakes", "use", "final"];
  if (context === "evergreen") return ["criteria", "use", "mistakes", "compare", "final"];
  return common;
}

let changed = 0;
const files = roots.flatMap(walk);

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");

  const parsed = parseMarkdown(raw);
  const title = metaValue(parsed.frontmatter, "title") || path.basename(file, ".md");
  const permalink = metaValue(parsed.frontmatter, "permalink");
  let words = wordCount(parsed.body);
  if (words >= MIN_WORDS) continue;

  const context = contextFor(title, permalink, file);

  if (raw.includes(MARKER)) {
    if (raw.includes(FOLLOW_UP_MARKER)) continue;
    fs.writeFileSync(file, `${raw.trimEnd()}\n\n${followUpExpansion(title, context)}\n`);
    changed += 1;
    continue;
  }

  const selected = blockOrder(context);
  const additions = [`\n${MARKER}\n\n${intro(title, context)}\n`];

  for (const key of selected) {
    const fn = blocks[key];
    if (!fn) continue;
    additions.push(fn(title));
    words = wordCount(`${parsed.body}\n${additions.join("\n\n")}`);
    if (words >= MIN_WORDS) break;
  }

  fs.writeFileSync(file, `${raw.trimEnd()}\n\n${additions.join("\n\n")}\n`);
  changed += 1;
}

console.log(`Expanded ${changed} posts below ${MIN_WORDS} words.`);
