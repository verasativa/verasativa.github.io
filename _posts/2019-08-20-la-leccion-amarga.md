---
layout: post
title:  "La lección amarga"
date:   2019-08-20 16:45:11 -0400
tags: IA tranducciones
---
### Una traducción por Vera Sativa del original [The Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html){:target="_blank"} de Rich Sutton.

#### Original: 13 de marzo, 2019

La mayor lección que podemos observar tras 70 años de investigación en IA es que __los métodos generales que se apoyan en computación terminan siendo los más efectivos__, y por un gran margen. La razón principal de esto es la ley de Moore, o más bien su generalización, en la permanente y exponencial caída de los costos por unidad de computo.

<!--more-->

La mayor parte de la investigación en IA ha sido conducida como si la computación disponible para el _agente_ fuera constante (en cuyo caso apoyarse en _conocimiento humano_ sería uno de los únicos caminos para incrementar el desempeño) pero, en apenas un poco más de tiempo que el de una típica investigación, inevitablemente se dispondrá de mucha más capacidad de cómputo. Buscando una mejora que haga la diferencia en el corto plazo, los investigadores tratan de apoyarse en un _conocimiento humano_ del dominio, pero lo único que realmente importa en el largo plazo es apoyarse en el cómputo. En rigor, ambas opciones no deben  oponerse necesariamente, pero en la práctica tienden a hacerlo. El tiempo invertido en una, es tiempo no invertido en la otra. Al invertir en una u otra, se crean compromisos a nivel psicológico. Y el acercamiento de _conocimiento humano_ tiende a complicar los métodos en formas que los hacen menos aptos para tomar ventaja de los métodos generales que se apoyan en computación. Hay muchos ejemplos de investigadores de IA aprendiendo tardíamente esta lección amarga, y es instructivo revisar algunos de los más prominentes.

## Ajedrez

En ajedrez computacional, los métodos que vencieron al campeón mundial, Kasparov, en 1997, eran basados en una masiva _búsqueda profunda_. En el momento, esto fue observado con consternación por la mayor parte de los investigadores en ajedrez computacional, quienes habían perseguido métodos que se apoyaban en el entendimiento humano de la estructura especial del ajedrez. Cuando un acercamiento más simple, basado en _búsqueda_ con hardware y software especial, probó ser vastamente más efectivo, esos investigadores de ajedrez computacional basados en _conocimiento humano_ no fueron buenos perdedores. Ellos dijeron que la "fuerza bruta" de _búsqueda_ podría haber ganado esta ocasión, pero que no era una estrategia general y, en cualquier caso, no era como las personas juegan ajedrez. Esos investigadores querían métodos basados en aportes humanos para ganar, y se decepcionaron cuando no fue así.

![Karasparov v/s deep blue](/assets/img/posts/ajedrez.jpg)

## Go (juego tradicional chino)

Un patrón similar se observó en Go computacional 20 años después. Inicialmente se hicieron enormes esfuerzos en evitar la _búsqueda_, apoyándose en _conocimiento humano_ o en las características especiales del juego, pero todos esos esfuerzos probaron ser innecesarios o peores, cuando se aplicó con efectividad _búsqueda_ a gran escala. También fue importante el uso de _aprendizaje_ a través de jugar contra sí mismo, con el fin de aprender una función de valoración (como fue en muchos otros juegos, incluso ajedrez, a pesar de que el _aprendizaje_ no tuvo un gran rol en el programa de 1997 que venció al campeón mundial). El _aprendizaje_ mediante jugar contra sí mismo (y _aprendizaje_ en general) es como la _búsqueda_, en el sentido de que permite aplicar computación masiva. _Búsqueda_ y _aprendizaje_ son las dos categorías más importantes de técnicas para utilizar cantidades masivas de computación en investigación de IA. En Go computacional, como en ajedrez computacional, el esfuerzo inicial de los investigadores se enfocó en usar _entendimiento humano_ (así se necesitaba menos _búsqueda_), y solo mucho más tarde se logró considerable mayor éxito por el camino de abrazar la _búsqueda_ y _aprendizaje_.

![Alpha go](/assets/img/posts/alpha-go.png)

## Reconocimiento del habla / NLP

En reconocimiento del habla, hubo una competencia temprana, en 1970s, auspiciada por DARPA. Los participantes incluían una parrilla de métodos especiales que tomaban ventaja de _conocimiento humano_ –conocimiento de palabras, fonemas, tracto vocal humano, etc.–. Del otro lado había nuevos métodos más estadísticos en su naturaleza y realizaban muchos más cómputos, basados en modelo oculto de Márkov (HMMs). Nuevamente, los métodos estadísticos ganaron sobre los métodos basados en _conocimiento humano_. Esto llevó a un cambio mayor en todo el _ procesamiento del lenguaje natural_, donde gradualmente, durante décadas, las estadísticas y el cómputo llegaron a dominar el campo.

El reciente auge del _aprendizaje profundo_ en reconocimiento del habla es el paso más reciente en esta tendencia estable. Los métodos de _aprendizaje profundo_ se apoyan aún menos en _conocimiento humano_, y utilizan aún más cómputo. Aprendiendo en gigantes data sets de entrenamiento, producen sistemas de reconocimiento de habla vastamente superiores.

Como en los juegos, __los investigadores intentaron permanentemente, hacer que sus sistemas funcionaran de la manera en que ellos creían que su propia mente funcionaba. Trataron de colocar conocimiento en sus sistemas, pero al final se probó contraproductivo y una colosal pérdida del tiempo de los investigadores__, cuando, a través de la ley de Moore, una cantidad masiva de cómputo estuvo disponible y se encontraron formas de explotarla.

## Visión computacional

En visión computacional ha habido un patrón similar. Los métodos tempranos concebían la visión como búsqueda de _bordes_, o _cilindros generalizados_, o en términos de _características relevantes SIFT_. Pero hoy todo eso está desechado. Las redes neuronales de _aprendizaje profundo_ contemporáneas usan apenas las nociones de _convolución_ y ciertos tipos de _invarianzas_, y se desempeñan mucho mejor.

## Interiorizar la lección amarga

Esta es una gran lección. Una que nosotros como disciplina, en la medida que seguimos cometiendo los mismos errores, aun no interiorizamos. Para observar esto, y para resistir con efectividad, primero debemos entender el atractivo de estos errores. 

Tenemos que aprender la lección amarga de que __construir desde “como pensamos que pensamos”, a la larga no funciona.__ La lección amarga se basa en observaciones históricas de __1) Los investigadores en IA usualmente han intentado colocar conocimiento en sus _agentes___, __2) esto siempre ayuda en el corto plazo, y es personalmente satisfactorio para quien investiga, pero 3) en el largo plazo se estanca e incluso inhibe avances mayores__, y __4) los grandes saltos se abren paso eventualmente desde un acercamiento basado en escalar el cómputo con _búsqueda_ y _aprendizaje_.__ El eventual logro es tomado con amargura, y a menudo no es asimilado completamente, por haber sido un triunfo contra el acercamiento antropocéntrico preferido.

## Conclusiones

El primer punto que debemos aprender de la lección amarga es el gran poder de los métodos de propósito general, particularmente de aquellos capaces de escalar con más cómputo incluso cuando el cómputo disponible llega a ser muy grande. Los dos métodos que parecen escalar arbitrariamente de esta forma son: la _búsqueda_ y el _aprendizaje_.

El segundo punto general por aprender de la lección amarga es que los contenidos reales de las mentes son tremenda e irremediablemente complejos; debemos dejar de intentar encontrar formas simplificadas de modelar los contenidos de nuestras mentes, como formas simplificadas de pensar el espacio, los objetos, múltiples agentes o simetrías. Todos estas cuestiones son parte del mundo exterior, el que es arbitrario e intrínsecamente complejo. Y debido a que su complejidad no tiene fin, no tiene sentido intentar escribirlos en nuestros _agentes_, en cambio deberíamos construir exclusivamente meta-métodos que buscan y capturan esa complejidad arbitraria. Es fundamental para estos que puedan encontrar buenas aproximaciones, pero la búsqueda de estas aproximaciones debe ser por nuestros métodos, no por nosotros. Queremos _agentes_ de IA que puedan descubrir como nosotros podemos hacerlo, no que contengan lo que hemos descubierto. Construir desde nuestros descubrimientos solo nos hace más difícil entender cómo se pueden construir procesos de descubrimiento.

## Comentarios de la traductora

Este artículo me hizo tanto sentido que lo traduje. Creo que vale la pena que sea pensado fuera de la academia.

Los inversionistas tecnológicos competentes deberían ser capaces de entender esta reflexión en general, e invertir “apostando” a la generalización de la ley Moore. Debería parecerles atractivo en la medida que estén buscando grandes crecimientos a largo plazo.

Para los roles gerenciales me parece más complejo. Por su naturaleza, estos cargos tienden a poner incentivos en el corto plazo. Diseñar y establecer indicadores en esta dirección será clave para CTOs/CAIOs/Gerentes de tecnología. Indicadores puros de potencial de escalabilidad se pueden crear, por ejemplo, desde las curvas de fit entre el dataset de entrenamiento y el de testeo. Pero será necesario también combinar estos indicadores “puros” de escalabilidad con otros de efectividad y costos.

Ambos roles deberán también buscar estrategias que les permitan escalar sus datos de entrenamiento al paso de la ley de Moore. Esta tarea no es menor, y requerirá no solo recursos, en el sentido del continuo crecimiento del departamento que realice esta tarea en la empresa, sino que también innovación organizacional y logística que permita, por ejemplo, implementar selección automática de etiquetado manual, ya sea a tiempo real (human in the loop) o en una cola (semi-supervised learning), con una fuerza de trabajo remota y segmentada según el nivel necesario de comprensión cultural/local (chilenos marcando símbolos de transito nacionales, hispano-parlantes marcando textos generales, y de cualquier país que se conduzca por la derecha marcando las líneas del tránsito), etc.