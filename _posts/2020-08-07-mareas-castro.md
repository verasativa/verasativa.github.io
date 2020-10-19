---
layout: post
title:  "Haciendo ingeniería inversa a las mareas de Castro, Chiloé"
date:   2020-08-07 12:11 -0400+
image: "/assets/img/posts/mareas-castro.png"
tags: Fourier señales
---
## Introducción
A causa de la importancia de la transformación de Lorentz para la relatividad especial, arrastraba un interés general en las transformaciones matemáticas hace unos meses. Pero siendo mi orientación de aprendizaje extremadamente practica, sentía que necesitaba un ejercicio practico, para aprender algo valioso.

## La historia mareas
La predicción de las mareas es un problema que los humanos enfrentamos desde la pre-historia. En 1609 Johannes Kepler sugirió acertadamente que las mareas eran producto de la fuerza de gravedad lunar, en 1619 Galileo Galilei, en respuesta, especuló erradamente que eran producto de la rotación de la tierra al rededor del sol.
 
En 1776 Pierre-Simon Laplace formula un set de ecuaciones en derivadas parciales, describiendo las mareas como un flujo barotrópico laminar de 2 dimensiones. Aun así, la predicción siguió siendo problemática, hasta que, en 1860 William Thomson le aplicó análisis de fourrier a las mediciones empíricas del nivel del mar, realizando un análisis de armónicos al movimiento de las mareas.

![Fourier transform of tides measured at Ft. Pulaski in 2012. From wikipedia: Theory of tides](/assets/img/posts/tides_fourier_transform.png) 


## Mi realidad de las mareas
Viviendo a pocos metros del mar, las mareas me han obsesionado los últimos meses. He pasado horas observando la vida que vive en su movimiento; picorocos filtrando agua para extraer alimento, ciempiés marinos ovando, todo tipo de aves alimentándose de los anteriores y sus pares, y las ocasionales orilleras humanas que recolectan mariscos.

En la marea la vida florece.

Hay astrónomos que hablan del sistema bi-planetario, pues nuestra luna es inusualmente grande para un planeta como la tierra. Y como, tal vez, esta relación única su la hermana luna, le dio a nuestra madre tierra las mareas. Y en estas, se desarrolló la vida.  

![La marea mi vecina](/assets/img/posts/marea.jpg)

## El trabajo
Desde esa localidad, historia, cosmología y espiritualidad, le hinqué el diente a las matemáticas con ganas.
### El origen de los datos
En Chile, el [shoa](shoa.cl/php/mareas.php) (equivalente al noaa de estados unidos), desde Valparaíso, entrega predicciones de mareas para una docena de puertos del país.
Esas predicciones están literalmente copiadas/pegadas en un excel, que cargaremos en python.
### Procesado
Después de ordenar los datos, sus columnas y revisarlos que fueran coherentes (siempre siempre siempre hay que revisar). Hice una transformación de fourier sobre estos, y extraje sus puntos de frecuencia.

Encontré los elementos constituyentes de la predicción, lo que fue un ingeniería inversa de hecho sobre el proceso del shoa, revelando los "acorta caminos" que toman.

Si quieres seguir el proceso completo por ti misme, dejé [disponible el notebook en un gist](https://gist.github.com/verasativa/c7be95ab77652c7806ba3aedd749ee98) 

![Transformación de Fourier a mareas de Castro, Chiloé](/assets/img/posts/fourrier-mareas-castro.png)

__Podemos ver los componentes:__

 - M2: Principal lunar semidiurnal
 - S2: Principal solar semidiurnal
 - N2: Larger lunar elliptic semidiurnal
 - K1: Lunar diurnal
 - O1: Lunar diurnal

## Conclusiones
Parece ser que el shoa, no utiliza los componentes de periodo corto para el calculo de las mareas de Castro. Sería interesante tener acceso a los datos de medición históricos, y probar la efectividad de un modelado con estos componentes, pues teóricamente, siendo componentes de aguas bajas debieran impactar particularmente por la condicion de mar interior del archipiélago de Chiloé.

## Actualización Octubre:
Después de hacer el trabajo de naturalista del siglo XVIII, pasando horas observando el mar tanto en las horas que el shoa predice la marea más alta y como las baja. Y hasta haber puesto mi propia marca.

![Playa en marea baja con una vara marcando la marea baja](/assets/img/posts/marea-marca.jpg)

y he encontrado **hasta 1 hora de diferencia** con las predicciones del shoa.

El siguiente paso es realizar mediciones propias, estoy estudiando alternativas de sensores que me permitan registrar la marea 24/7. 
