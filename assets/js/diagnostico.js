/* Diagnóstico inicial Ley 21.719 · formulario previo.
   Runs entirely in the browser: no network calls, no storage, no cookies.
   Answers live in memory only, exactly as screen 0 promises the visitor.

   Question text is the copy in formulario-contenido.md; that document is the
   source of truth. Option values are stable slugs and end up in the embedded
   JSON, so renaming one changes the shape of every summary already sent. */

(function () {
  'use strict';

  var VERSION = '1.0';
  var CORREO = 'hola@verasativa.com';
  var FUENTE = 'https://github.com/verasativa/verasativa.github.io/blob/master/assets/js/diagnostico.js';

  /* ---------------------------------------------------------------- data -- */

  var BLOQUES = [
    {
      id: 'A',
      titulo: 'La empresa',
      ensena: 'La ley aplica a cualquier organización que trate datos de personas, sin importar el tamaño. Pero el tamaño y a quién le vendes cambian qué tan urgente es y quién te lo va a exigir primero.',
      preguntas: [
        {
          id: 'rubro', tipo: 'single',
          texto: '¿En qué rubro está tu empresa?',
          opciones: [
            { v: 'comercio', t: 'Comercio o retail' },
            { v: 'salud', t: 'Salud (clínica, consulta, laboratorio, farmacia)' },
            { v: 'servicios_profesionales', t: 'Servicios profesionales (contabilidad, legal, consultoría)' },
            { v: 'educacion', t: 'Educación' },
            { v: 'manufactura', t: 'Manufactura, agro o acuicultura' },
            { v: 'software', t: 'Software o tecnología' },
            { v: 'finanzas', t: 'Finanzas, seguros o cobranza' },
            { v: 'transporte', t: 'Transporte o logística' },
            { v: 'turismo', t: 'Turismo, hotelería o gastronomía' },
            { v: 'otro', t: 'Otro', otro: 'rubro_otro' }
          ]
        },
        {
          id: 'personas', tipo: 'single',
          texto: '¿Cuántas personas trabajan en la empresa, contando contratados y externos habituales?',
          opciones: [
            { v: 'menos_5', t: 'Menos de 5' },
            { v: '5_20', t: 'Entre 5 y 20' },
            { v: '21_50', t: 'Entre 21 y 50' },
            { v: '51_200', t: 'Entre 51 y 200' },
            { v: 'mas_200', t: 'Más de 200' }
          ]
        },
        {
          id: 'facturacion', tipo: 'single',
          texto: '¿Cuánto factura al año, aproximadamente?',
          ayuda: 'Es solo para dimensionar. No se pide ningún número exacto.',
          opciones: [
            { v: 'menos_100m', t: 'Menos de 100 millones de pesos' },
            { v: '100_1000m', t: 'Entre 100 y 1.000 millones' },
            { v: '1000_10000m', t: 'Entre 1.000 y 10.000 millones' },
            { v: 'mas_10000m', t: 'Más de 10.000 millones' },
            { v: 'no_dice', t: 'Prefiero no decir' }
          ]
        },
        {
          id: 'clientes_grandes', tipo: 'multi',
          texto: '¿Le vendes a alguno de estos?',
          opciones: [
            { v: 'empresas_grandes', t: 'Empresas grandes (más de 200 personas)' },
            { v: 'estado', t: 'Al Estado o a municipios' },
            { v: 'ninguno', t: 'A ninguno de los dos', excl: true },
            { v: 'no_se', t: 'No sé', excl: true }
          ]
        },
        {
          id: 'acreditar', tipo: 'single',
          texto: '¿Alguno te ha pedido acreditar cómo manejas los datos personales, en un contrato, licitación o cuestionario?',
          si: function (r) {
            return incluye(r.clientes_grandes, 'empresas_grandes') ||
                   incluye(r.clientes_grandes, 'estado');
          },
          opciones: [
            { v: 'si', t: 'Sí, ya me lo pidieron' },
            { v: 'todavia_no', t: 'Todavía no' },
            { v: 'no_se', t: 'No sé' }
          ],
          revela: {
            si: function (v) { return v === 'si'; },
            texto: 'Eso va a ser cada vez más común. Las empresas grandes tienen que responder por sus proveedores, así que te van a trasladar la exigencia antes de que la agencia fiscalizadora exista.'
          }
        }
      ]
    },
    {
      id: 'B',
      titulo: 'Qué datos entran',
      ensena: 'Dato personal es cualquier cosa que permita identificar a una persona, desde el RUT hasta la patente del auto. La ley no distingue si lo guardas en un sistema caro o en un cuaderno. Lo que sí distingue es de quién son y qué tan delicados son.',
      preguntas: [
        {
          id: 'titulares', tipo: 'multi',
          texto: '¿De quiénes guardas datos?',
          opciones: [
            { v: 'clientes_personas', t: 'Clientes que son personas' },
            { v: 'contactos_empresas', t: 'Personas de contacto en empresas clientes' },
            { v: 'trabajadores', t: 'Trabajadores actuales y antiguos' },
            { v: 'postulantes', t: 'Postulantes a trabajos' },
            { v: 'proveedores', t: 'Proveedores que son personas o sus contactos' },
            { v: 'pacientes_alumnos', t: 'Pacientes, alumnos o beneficiarios' },
            { v: 'visitantes', t: 'Visitantes o público general' },
            { v: 'otros', t: 'Otros', otro: 'titulares_otros' }
          ]
        },
        {
          id: 'vias', tipo: 'multi',
          texto: '¿Por qué vías te llegan esos datos?',
          opciones: [
            { v: 'formulario_web', t: 'Formulario en la web o en una app' },
            { v: 'whatsapp_correo', t: 'WhatsApp o correo' },
            { v: 'presencial_papel', t: 'Presencial o en papel' },
            { v: 'camaras', t: 'Cámaras' },
            { v: 'sistema_cliente', t: 'Un sistema de un cliente o socio' },
            { v: 'listas_compradas', t: 'Listas o bases compradas a terceros' },
            { v: 'redes_sociales', t: 'Redes sociales' }
          ],
          revela: {
            si: function (v) { return incluye(v, 'listas_compradas'); },
            texto: 'Comprar una lista no transfiere el permiso para usarla. Es uno de los puntos donde la ley nueva cambia más respecto a lo que se hacía antes.'
          }
        },
        {
          id: 'especiales', tipo: 'multi',
          texto: '¿Alguno de estos casos se da en tu empresa?',
          opciones: [
            { v: 'salud', t: 'Licencias médicas, exámenes o cualquier información de salud' },
            { v: 'biometrico', t: 'Huella o rostro para marcar asistencia o abrir puertas' },
            { v: 'menores', t: 'Datos de menores de edad' },
            { v: 'financiero', t: 'Situación financiera, deudas o morosidad' },
            { v: 'categoria_especial', t: 'Afiliación sindical, religión, origen étnico u orientación sexual' },
            { v: 'geolocalizacion', t: 'Ubicación por GPS de personas o vehículos' },
            { v: 'imagen', t: 'Cámaras de vigilancia que graban personas' },
            { v: 'ninguno', t: 'Ninguno', excl: true }
          ],
          revela: {
            si: function (v) { return sensibles(v).length > 0; },
            texto: 'Todo lo que marcaste la ley lo trata como dato sensible o de categoría especial. Con esos datos las obligaciones suben, el consentimiento tiene que ser explícito y una filtración se sanciona más fuerte. Las licencias médicas son el caso más común y el que más empresas pasan por alto.'
          }
        },
        {
          id: 'automatizadas', tipo: 'single',
          texto: '¿Hay alguna decisión sobre personas que se tome automáticamente con esos datos, sin que alguien la revise?',
          opciones: [
            { v: 'si', t: 'Sí (por ejemplo, aprobar un crédito, dar una cotización, clasificar clientes o postulantes)' },
            { v: 'no', t: 'No, siempre revisa alguien' },
            { v: 'no_se', t: 'No sé' }
          ],
          revela: {
            si: function (v) { return v === 'si'; },
            texto: 'La ley le da a la persona el derecho a saber cómo funciona esa decisión y a pedir que la revise un humano. Esto casi nadie lo tiene documentado.'
          }
        }
      ]
    },
    {
      id: 'C',
      titulo: 'Dónde viven',
      ensena: 'El registro de tratamientos que pide la ley es, en el fondo, un mapa de dónde están los datos y quién los ve. No hace falta que sepas el nombre técnico de cada cosa, solo cómo funciona el negocio en la práctica.',
      preguntas: [
        {
          id: 'base_clientes', tipo: 'single',
          texto: '¿Tienes un sistema donde guardas información de clientes, pacientes o usuarios, aparte de la planilla de sueldos?',
          opciones: [
            { v: 'sistema_propio', t: 'Sí, un sistema propio o hecho a medida' },
            { v: 'sistema_contratado', t: 'Sí, un sistema contratado (ERP, CRM, tienda online, agenda)' },
            { v: 'planillas_correos', t: 'Solo planillas y correos' },
            { v: 'no', t: 'No' }
          ]
        },
        {
          id: 'sistemas', tipo: 'multi',
          texto: '¿Dónde viven los datos de personas hoy? Marca todo lo que aplique.',
          opciones: [
            { v: 'erp', t: 'ERP o sistema de gestión' },
            { v: 'crm', t: 'CRM o sistema de ventas' },
            { v: 'pos', t: 'Punto de venta o caja' },
            { v: 'rrhh', t: 'Software de remuneraciones o RRHH' },
            { v: 'ficha_clinica', t: 'Ficha clínica o sistema de pacientes' },
            { v: 'tienda_online', t: 'Tienda online' },
            { v: 'planillas', t: 'Planillas (Excel, Google Sheets)' },
            { v: 'whatsapp_correo', t: 'WhatsApp o correo' },
            { v: 'papel', t: 'Papel' },
            { v: 'otro', t: 'Otro' }
          ],
          libre: {
            id: 'sistemas_nombres',
            label: 'Si sabes los nombres de los sistemas (por ejemplo Defontana, Buk, Shopify, Bsale), anótalos acá. Solo los nombres, nada de contenidos ni contraseñas.'
          }
        },
        {
          id: 'alojamiento', tipo: 'multi',
          texto: '¿Dónde están alojados esos sistemas?',
          opciones: [
            { v: 'local', t: 'En computadores o servidores de la empresa' },
            { v: 'proveedor_chileno', t: 'En un proveedor chileno' },
            { v: 'nube_extranjera', t: 'En la nube de un proveedor extranjero (Google, Microsoft, Amazon, o el fabricante del software)' },
            { v: 'no_se', t: 'No sé', excl: true }
          ],
          revela: {
            si: function (v) { return incluye(v, 'nube_extranjera'); },
            texto: 'Que un dato de un cliente chileno viva en un servidor extranjero es normal y no está prohibido, pero cuenta como transferencia internacional y hay que poder explicar bajo qué condiciones se hace.'
          }
        },
        {
          id: 'borrado', tipo: 'single',
          texto: '¿Existe alguna regla sobre cuánto tiempo se guardan los datos?',
          opciones: [
            { v: 'nunca', t: 'Nunca borramos nada' },
            { v: 'regla_cumple', t: 'Sí, hay una regla y se cumple' },
            { v: 'regla_no_cumple', t: 'Sí, hay una regla pero no se cumple' },
            { v: 'no_se', t: 'No sé' }
          ],
          revela: {
            si: function (v) { return v === 'nunca'; },
            texto: 'La ley exige definir un plazo o una condición para borrar cada tipo de dato. Es de las obligaciones más simples de enunciar y más difíciles de cumplir, porque los sistemas rara vez están hechos para borrar.'
          }
        }
      ]
    },
    {
      id: 'D',
      titulo: 'Quién accede',
      ensena: 'Cada persona o empresa que puede ver esos datos es una puerta. La ley te pide saber cuántas puertas tienes y, para las externas, tener un contrato que diga qué pueden y qué no pueden hacer.',
      preguntas: [
        {
          id: 'personas_acceso', tipo: 'single',
          texto: '¿Cuántas personas dentro de la empresa pueden ver o modificar datos de clientes, pacientes o trabajadores?',
          opciones: [
            { v: '1_3', t: '1 a 3' },
            { v: '4_10', t: '4 a 10' },
            { v: '11_30', t: '11 a 30' },
            { v: 'mas_30', t: 'Más de 30' },
            { v: 'no_se', t: 'No sé' }
          ]
        },
        {
          id: 'externos', tipo: 'multi',
          texto: '¿Qué proveedores externos tienen acceso a esos datos?',
          opciones: [
            { v: 'contador', t: 'Contador o estudio contable' },
            { v: 'marketing', t: 'Agencia de marketing o community manager' },
            { v: 'soporte_ti', t: 'Soporte de sistemas o informático externo' },
            { v: 'call_center', t: 'Call center o servicio de atención' },
            { v: 'logistica', t: 'Empresa de despacho o logística' },
            { v: 'ninguno', t: 'Ninguno', excl: true },
            { v: 'no_se', t: 'No sé', excl: true }
          ],
          revela: {
            si: function (v) { return externosReales(v).length > 0; },
            texto: 'Cada uno de ellos es lo que la ley llama un encargado del tratamiento, y necesita un contrato escrito que lo diga. El contador es el caso que más se olvida, y ve la planilla de sueldos completa.'
          }
        },
        {
          id: 'fuera_chile', tipo: 'single',
          texto: '¿Alguno de esos proveedores, o alguna persona de tu equipo, trabaja desde fuera de Chile?',
          opciones: [
            { v: 'si', t: 'Sí' },
            { v: 'no', t: 'No' },
            { v: 'no_se', t: 'No sé' }
          ]
        }
      ]
    },
    {
      id: 'E',
      titulo: 'Qué existe hoy',
      ensena: 'Esto no es un examen. Casi ninguna empresa mediana tiene todo esto, y saber qué falta es justamente el punto de partida.',
      preguntas: [
        {
          id: 'politica', tipo: 'single',
          texto: '¿Tienes una política de privacidad publicada?',
          opciones: [
            { v: 'si_propia', t: 'Sí, hecha para la empresa' },
            { v: 'si_vieja', t: 'Sí, pero es vieja o copiada de otra parte' },
            { v: 'no', t: 'No' },
            { v: 'no_se', t: 'No sé' }
          ]
        },
        {
          id: 'clausulas', tipo: 'multi',
          texto: '¿Tus contratos dicen algo sobre datos personales?',
          opciones: [
            { v: 'trabajo', t: 'Sí, los contratos de trabajo' },
            { v: 'proveedores', t: 'Sí, los contratos con proveedores' },
            { v: 'clientes', t: 'Sí, los contratos con clientes' },
            { v: 'ninguno', t: 'Ninguno', excl: true },
            { v: 'no_se', t: 'No sé', excl: true }
          ]
        },
        {
          id: 'responsable', tipo: 'single',
          texto: '¿Hay alguien a cargo del tema en la empresa?',
          opciones: [
            { v: 'formal', t: 'Sí, formalmente designado' },
            { v: 'informal', t: 'Sí, pero informalmente (alguien que "se preocupa")' },
            { v: 'nadie', t: 'Nadie' }
          ],
          revela: {
            si: function (v) { return v === 'informal' || v === 'nadie'; },
            texto: 'En una empresa mediana el dueño puede asumir ese rol. Lo que importa es que exista y que la gente sepa a quién avisarle si algo pasa.'
          }
        },
        {
          id: 'incidentes', tipo: 'multi',
          texto: '¿Ha pasado algo de esto?',
          opciones: [
            { v: 'filtracion', t: 'Una filtración o acceso indebido a datos' },
            { v: 'perdida', t: 'Pérdida de datos (computador robado, disco muerto, ransomware)' },
            { v: 'reclamo', t: 'Un reclamo de una persona por el uso de sus datos' },
            { v: 'nunca', t: 'Nunca, que yo sepa', excl: true },
            { v: 'no_se', t: 'No sé', excl: true }
          ],
          revela: {
            si: function (v) { return incluye(v, 'filtracion') || incluye(v, 'perdida'); },
            texto: 'Con la ley nueva, una filtración hay que informarla a la agencia y a los afectados. Tener un procedimiento para eso es parte de lo que se revisa.'
          }
        }
      ]
    },
    {
      id: 'F',
      titulo: 'Cierre',
      ensena: 'Con lo que ya respondiste tengo el mapa. Esta última parte define de qué hablamos en los 30 minutos.',
      preguntas: [
        {
          id: 'preocupacion', tipo: 'text',
          texto: 'Después de responder todo esto, ¿qué es lo que más te preocupa?',
          ayuda: 'Dos o tres líneas bastan. Puede ser algo concreto (un cliente que pidió algo, un sistema que nadie entiende) o una duda general.'
        },
        {
          id: 'cuando', tipo: 'single',
          texto: '¿Cuándo te gustaría partir con el diagnóstico?',
          opcional: true,
          opciones: [
            { v: 'asap', t: 'Lo antes posible' },
            { v: '1_3_meses', t: 'En uno a tres meses' },
            { v: 'solo_entender', t: 'Por ahora solo quiero entender el tema' }
          ]
        }
      ]
    }
  ];

  /* Legal label for each special category, used in the summary. */
  var ETIQUETA_LEGAL = {
    salud: 'salud',
    biometrico: 'biométrico',
    menores: 'datos de niños, niñas y adolescentes',
    financiero: 'situación socioeconómica',
    categoria_especial: 'categoría especial (sindical, religiosa, étnica u orientación sexual)',
    geolocalizacion: 'geolocalización',
    imagen: 'imagen'
  };

  /* ------------------------------------------------------------- helpers -- */

  function incluye(valor, v) {
    return Array.isArray(valor) && valor.indexOf(v) !== -1;
  }

  function sensibles(valor) {
    return (valor || []).filter(function (v) { return v !== 'ninguno'; });
  }

  function externosReales(valor) {
    return (valor || []).filter(function (v) { return v !== 'ninguno' && v !== 'no_se'; });
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function etiquetaDe(pregunta, v) {
    var op = (pregunta.opciones || []).filter(function (o) { return o.v === v; })[0];
    return op ? op.t : v;
  }

  /* Lowercases an option label so it can be folded into a sentence, without
     touching acronyms or brand names: "WhatsApp o correo" and "ERP o sistema
     de gestión" keep their casing, "Clientes que son personas" loses it. */
  function minus(t) {
    var palabras = String(t).split(' ');
    // Trailing punctuation must not hide a plain word: "Pacientes," counts.
    if (/^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+[,;:]?$/.test(palabras[0])) {
      palabras[0] = palabras[0].toLowerCase();
    }
    return palabras.join(' ');
  }

  /* Human-readable list: "a, b y c". Items that already contain "y" or "o"
     are separated with semicolons so the last connector stays readable. */
  function lista(items) {
    if (!items.length) { return ''; }
    if (items.length === 1) { return items[0]; }
    var sep = items.some(function (i) { return /\s(y|o)\s/.test(i); }) ? '; ' : ', ';
    var conector = sep === '; ' ? '; y ' : ' y ';
    return items.slice(0, -1).join(sep) + conector + items[items.length - 1];
  }

  function preguntas() {
    return BLOQUES.reduce(function (acc, b) { return acc.concat(b.preguntas); }, []);
  }

  function preguntaPorId(id) {
    return preguntas().filter(function (p) { return p.id === id; })[0];
  }

  /* Answered questions only: a question hidden by its `si` condition is not
     answered, and any stale value it left behind is ignored everywhere. */
  function visible(p, r) { return !p.si || p.si(r); }

  function etiquetasDe(id, r) {
    var p = preguntaPorId(id);
    var v = r[id];
    if (!p || !visible(p, r) || v == null) { return []; }
    var vals = Array.isArray(v) ? v : [v];
    return vals.map(function (x) {
      // An "Otro" option speaks through its free text, not through the word
      // "Otro": listing both reads as two separate answers.
      var op = (p.opciones || []).filter(function (o) { return o.v === x; })[0];
      if (op && op.otro && r[op.otro]) { return r[op.otro]; }
      return etiquetaDe(p, x);
    });
  }

  function hoy() {
    var d = new Date();
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + mm + '-' + dd;
  }

  /* --------------------------------------------------------------- state -- */

  var respuestas = {};
  var pantalla = 'intro';   // 'intro' | 0..5 (block index) | 'resumen'
  var faltantes = [];
  var app;

  /* ---------------------------------------------------------- form logic -- */

  /* No pasa el filtro si es chica Y no tiene base de clientes. Todo lo demás
     pasa: un consultorio de 4 personas con ficha clínica pasa. */
  function pasaFiltro(r) {
    var chica = r.personas === 'menos_5' || r.facturacion === 'menos_100m';
    var sinBase = r.base_clientes === 'planillas_correos' || r.base_clientes === 'no';
    return !(chica && sinBase);
  }

  function contarNoSe(r) {
    return preguntas().filter(function (p) {
      if (!visible(p, r)) { return false; }
      var v = r[p.id];
      return Array.isArray(v) ? incluye(v, 'no_se') : v === 'no_se';
    }).length;
  }

  /* Internal effort estimate. Never shown to the visitor; it only travels in
     the embedded JSON so the scope of the engagement can be sized. */
  function esfuerzo(r) {
    var pts = 0;
    pts += Math.min(6, (r.sistemas || []).length);
    pts += Math.min(5, sensibles(r.especiales).length);
    pts += Math.min(4, externosReales(r.externos).length);
    pts += ({ '1_3': 0, '4_10': 1, '11_30': 2, mas_30: 3, no_se: 2 })[r.personas_acceso] || 0;
    if (r.automatizadas === 'si') { pts += 2; }
    if (incluye(r.alojamiento, 'nube_extranjera') || r.fuera_chile === 'si') { pts += 2; }

    var noSe = contarNoSe(r);
    pts += Math.floor(noSe / 3);

    var etiqueta = pts <= 7 ? 'cómodo'
      : pts <= 14 ? 'apretado'
      : 'probablemente no cabe en dos semanas, o hay que acotar alcance';

    return { puntos: pts, etiqueta: etiqueta, no_se: noSe };
  }

  function datos(r) {
    var d = { version_formulario: VERSION, fecha: hoy(), filtro: pasaFiltro(r) ? 'pasa' : 'no_pasa' };
    preguntas().forEach(function (p) {
      if (!visible(p, r)) { return; }
      if (r[p.id] != null) { d[p.id] = r[p.id]; }
      (p.opciones || []).forEach(function (o) {
        var marcada = Array.isArray(r[p.id]) ? incluye(r[p.id], o.v) : r[p.id] === o.v;
        if (o.otro && marcada && r[o.otro]) { d[o.otro] = r[o.otro]; }
      });
      if (p.libre && r[p.libre.id]) { d[p.libre.id] = r[p.libre.id]; }
    });
    d.esfuerzo = esfuerzo(r);
    return d;
  }

  /* ------------------------------------------------------------- summary -- */

  /* Returns a list of sections; the same structure feeds the screen, the
     downloadable HTML and the plain-text copy, so the three never drift. */
  function resumen(r) {
    var secciones = [];
    var push = function (s) { secciones.push(s); };

    if (r.acreditar === 'si' && visible(preguntaPorId('acreditar'), r)) {
      push({ tipo: 'destacado', texto: 'Ya te están pidiendo acreditar cumplimiento. Eso hace que esto sea un tema comercial antes que legal.' });
    }

    // 2 · qué datos manejas
    var empresa = 'Empresa del rubro ' + rubroTexto(r) + '.';
    var tamano = etiquetasDe('personas', r)[0];
    if (tamano) { empresa += ' ' + tamano + ' personas trabajando.'; }
    var parrafos = [empresa];

    var tit = etiquetasDe('titulares', r).map(minus);
    if (tit.length) { parrafos.push('Manejas datos de ' + lista(tit) + '.'); }

    var vias = etiquetasDe('vias', r).map(minus);
    if (vias.length) { parrafos.push('Te llegan por ' + lista(vias) + '.'); }
    push({ tipo: 'seccion', titulo: 'Qué datos manejas', parrafos: parrafos });

    // 3 · sensibles
    var esp = sensibles(r.especiales);
    if (esp.length) {
      push({
        tipo: 'seccion',
        titulo: 'Datos sensibles o de categoría especial',
        parrafos: ['La ley trata estos datos con obligaciones más altas que el resto:'],
        items: esp.map(function (v) {
          var t = etiquetaDe(preguntaPorId('especiales'), v);
          var legal = ETIQUETA_LEGAL[v];
          return t.toLowerCase() === legal.toLowerCase() ? t + '.' : t + ' — ' + legal + '.';
        })
      });
    } else {
      push({
        tipo: 'seccion',
        titulo: 'Datos sensibles o de categoría especial',
        parrafos: ['Según lo que marcaste, no hay datos sensibles ni de categoría especial. Vale la pena revisarlo de nuevo si alguna vez guardaste una licencia médica.']
      });
    }

    // 4 · dónde viven
    var sis = etiquetasDe('sistemas', r);
    var donde = [];
    if (sis.length) {
      donde.push('Los datos viven en ' + sis.length + (sis.length === 1 ? ' lugar: ' : ' lugares: ') +
                 lista(sis.map(minus)) + '.');
    }
    if (r.sistemas_nombres) { donde.push('Sistemas nombrados: ' + r.sistemas_nombres); }
    var aloj = etiquetasDe('alojamiento', r).map(minus);
    if (aloj.length) { donde.push('Alojados así: ' + lista(aloj) + '.'); }
    if (r.borrado === 'no_se') {
      donde.push('No está claro si hay una regla sobre cuánto tiempo se guardan los datos.');
    } else {
      var bor = etiquetasDe('borrado', r)[0];
      if (bor) { donde.push('Regla de borrado: ' + minus(bor) + '.'); }
    }
    push({ tipo: 'seccion', titulo: 'Dónde viven', parrafos: donde });

    // 5 · quién accede
    var acc = [];
    var pa = etiquetasDe('personas_acceso', r)[0];
    if (pa) {
      acc.push(pa === 'No sé'
        ? 'No está claro cuántas personas de la empresa pueden ver o modificar esos datos.'
        : 'Dentro de la empresa, ' + minus(pa) + ' personas pueden ver o modificar esos datos.');
    }
    var ext = externosReales(r.externos);
    if (ext.length) {
      acc.push('Proveedores externos con acceso: ' +
               lista(ext.map(function (v) { return minus(etiquetaDe(preguntaPorId('externos'), v)); })) +
               (ext.length > 1 ? '. Cada uno es un encargado del tratamiento.'
                               : '. Es un encargado del tratamiento.'));
    } else if (incluye(r.externos, 'ninguno')) {
      acc.push('Ningún proveedor externo tiene acceso a esos datos.');
    } else if (incluye(r.externos, 'no_se')) {
      acc.push('No está claro qué proveedores externos tienen acceso.');
    }
    if (r.fuera_chile === 'si') { acc.push('Hay proveedores o personas del equipo trabajando desde fuera de Chile.'); }
    if (r.fuera_chile === 'no_se') { acc.push('No está claro si alguien accede desde fuera de Chile.'); }
    push({ tipo: 'seccion', titulo: 'Quién accede', parrafos: acc });

    // 6 · obligaciones
    var obl = [
      'Registro de tratamientos: el mapa de qué datos usas, para qué, dónde viven y quién accede.',
      'Política de privacidad que describa de verdad lo que hace la empresa.',
      'Plazo o condición de borrado definido para cada tipo de dato.'
    ];
    if (esp.length) { obl.push('Consentimiento explícito, o alguna otra base legal expresa, para los datos sensibles que marcaste.'); }
    if (r.automatizadas === 'si') { obl.push('Información sobre decisiones automatizadas y derecho a que las revise una persona.'); }
    if (incluye(r.alojamiento, 'nube_extranjera') || r.fuera_chile === 'si') {
      obl.push('Transferencia internacional: poder explicar bajo qué condiciones los datos salen de Chile.');
    }
    if (ext.length) { obl.push('Contrato escrito con cada encargado del tratamiento (los proveedores externos de arriba).'); }
    if (incluye(r.incidentes, 'filtracion') || incluye(r.incidentes, 'perdida')) {
      obl.push('Procedimiento de notificación de incidentes a la agencia y a las personas afectadas.');
    }
    push({ tipo: 'seccion', titulo: 'Obligaciones que asoman', items: obl });

    // 7 · lo que ya tienes
    var ya = [];
    if (r.politica === 'si_propia') { ya.push('Tienes una política de privacidad hecha para la empresa.'); }
    if (r.politica === 'si_vieja') { ya.push('Tienes una política de privacidad publicada, aunque sea vieja o copiada: es un punto de partida.'); }
    var cl = (r.clausulas || []).filter(function (v) { return v !== 'ninguno' && v !== 'no_se'; });
    if (cl.length) {
      ya.push('Tus contratos ya dicen algo sobre datos personales: ' +
              lista(cl.map(function (v) { return etiquetaDe(preguntaPorId('clausulas'), v).replace(/^Sí, los /, ''); })) + '.');
    }
    if (r.responsable === 'formal') { ya.push('Hay alguien formalmente designado a cargo del tema.'); }
    if (r.responsable === 'informal') { ya.push('Hay alguien que se preocupa del tema, aunque no esté designado formalmente.'); }
    if (ya.length) { push({ tipo: 'seccion', titulo: 'Lo que ya tienes', items: ya }); }

    // 8 · preocupación
    if (r.preocupacion) {
      push({ tipo: 'seccion', titulo: 'Lo que más te preocupa', cita: r.preocupacion });
    }

    if (!pasaFiltro(r)) {
      push({
        tipo: 'nota',
        texto: 'Por lo que respondiste, probablemente todavía no necesitas un diagnóstico como este. Con tu tamaño y sin una base de datos de clientes, lo que te conviene revisar por tu cuenta es tener una política de privacidad simple, un acuerdo de confidencialidad con quien te lleve la contabilidad y no guardar datos que no uses. Si más adelante creces o un cliente grande te pide acreditar cumplimiento, ahí conversamos.'
      });
    }

    return secciones;
  }

  function rubroTexto(r) {
    return minus(etiquetasDe('rubro', r)[0] || 'sin especificar');
  }

  function resumenHTML(secciones) {
    return secciones.map(function (s) {
      if (s.tipo === 'destacado') { return '<p class="destacado">' + esc(s.texto) + '</p>'; }
      if (s.tipo === 'nota') { return '<div class="nota-filtro"><p>' + esc(s.texto) + '</p></div>'; }
      var h = '<h2>' + esc(s.titulo) + '</h2>';
      (s.parrafos || []).forEach(function (p) { h += '<p>' + esc(p) + '</p>'; });
      if (s.items && s.items.length) {
        h += '<ul>' + s.items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>';
      }
      if (s.cita) { h += '<p class="cita">' + esc(s.cita) + '</p>'; }
      return h;
    }).join('\n');
  }

  function resumenTexto(secciones) {
    var out = [];
    secciones.forEach(function (s) {
      if (s.tipo === 'destacado') { out.push(s.texto, ''); return; }
      if (s.tipo === 'nota') { out.push('---', s.texto, ''); return; }
      out.push(s.titulo.toUpperCase());
      (s.parrafos || []).forEach(function (p) { out.push(p); });
      (s.items || []).forEach(function (i) { out.push('- ' + i); });
      if (s.cita) { out.push(s.cita); }
      out.push('');
    });
    return out.join('\n');
  }

  function jsonTexto(r) {
    return JSON.stringify(datos(r), null, 2);
  }

  function textoCompleto(r) {
    return 'Diagnóstico inicial Ley 21.719 — formulario previo\n' +
      'Fecha: ' + hoy() + '\n\n' +
      resumenTexto(resumen(r)) +
      '\n--- datos del formulario (JSON) ---\n' +
      jsonTexto(r) +
      '\n--- fin ---\n';
  }

  /* ------------------------------------------------------------ download -- */

  /* Standalone copy of the summary: styles inlined, answers embedded as JSON
     so the file is readable by a person and parseable by a machine. */
  function archivoHTML(r) {
    var cuerpo = resumenHTML(resumen(r));
    var json = jsonTexto(r).replace(/<\//g, '<\\/');
    return '<!DOCTYPE html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n' +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
      '<title>Diagnóstico inicial Ley 21.719 — resumen</title>\n<style>\n' +
      'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;' +
      'color:#1a1a1a;line-height:1.55;max-width:42rem;margin:2.5rem auto;padding:0 1.1rem;}\n' +
      'h1{color:#1f4e5f;font-size:1.6rem;margin:0 0 .3rem;}\n' +
      'h2{color:#1f4e5f;font-size:1.15rem;margin:1.8rem 0 .5rem;}\n' +
      '.fecha{color:#5c6b70;font-size:.9rem;margin:0 0 1.5rem;}\n' +
      '.destacado{border-left:3px solid #1f4e5f;background:#f4f6f6;padding:.9rem 1rem;font-weight:700;}\n' +
      '.cita{border-left:3px solid #b8c4c8;padding:.2rem 0 .2rem 1rem;white-space:pre-wrap;}\n' +
      '.nota-filtro{border:1px solid #b8c4c8;background:#f4f6f6;padding:1rem;margin-top:1.6rem;}\n' +
      'ul{padding-left:1.2rem;}li{margin-bottom:.35rem;}\n' +
      'footer{margin-top:2.5rem;border-top:1px solid #b8c4c8;padding-top:.8rem;color:#5c6b70;font-size:.85rem;}\n' +
      '</style>\n</head>\n<body>\n' +
      '<h1>Diagnóstico inicial Ley 21.719</h1>\n' +
      '<p class="fecha">Resumen del formulario previo · ' + hoy() + '</p>\n' +
      cuerpo + '\n' +
      '<footer>Generado en el navegador desde verasativa.com/diagnostico. ' +
      'Las respuestas van abajo en formato JSON, dentro del código de esta página.</footer>\n' +
      '<script type="application/json" id="respuestas">\n' + json + '\n<\/script>\n' +
      '</body>\n</html>\n';
  }

  function descargar(nombre, contenido, tipo) {
    var blob = new Blob([contenido], { type: tipo + ';charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  /* --------------------------------------------------------------- views -- */

  function vistaIntro() {
    return '<a class="brand" href="/">Vera Sativa</a>' +
      '<div class="card">' +
      '<h1>Diagnóstico inicial Ley 21.719, formulario previo</h1>' +
      '<p>Esto corre entero en tu navegador. No hay servidor detrás, no se guarda nada y no me llega nada hasta que tú decidas mandármelo. Si cierras la pestaña sin descargar el resumen, se pierde.</p>' +
      '<p class="pie">No tienes por qué creerme: el código de este formulario es público y ' +
      '<a href="' + FUENTE + '" target="_blank" rel="noopener">lo puedes leer entero</a>.</p>' +
      '<p>Son 20 preguntas, casi todas de marcar. Toma unos 10 minutos. Lo ideal es que lo responda el dueño o quien dirige la empresa, no el área de sistemas, porque las preguntas son sobre cómo funciona el negocio y no sobre tecnología.</p>' +
      '<p>Al final vas a tener un resumen de qué datos personales maneja tu empresa y qué obligaciones asoman. Te va a servir aunque no sigamos conversando.</p>' +
      '<div class="nav"><button class="btn" data-accion="empezar">Empezar</button></div>' +
      '</div>';
  }

  function vistaBloque(i) {
    var b = BLOQUES[i];
    var pasos = BLOQUES.map(function (_, n) {
      return '<div class="progress-step' + (n <= i ? ' done' : '') + '"></div>';
    }).join('');

    var html = '<a class="brand" href="/">Vera Sativa</a>' +
      '<div class="progress">' +
      '<p class="progress-label">Bloque ' + b.id + ' · ' + esc(b.titulo) + ' (' + (i + 1) + ' de ' + BLOQUES.length + ')</p>' +
      '<div class="progress-track">' + pasos + '</div></div>' +
      '<div class="card">' +
      '<div class="ensena"><p>' + esc(b.ensena) + '</p></div>' +
      '<form id="bloque" novalidate>';

    b.preguntas.forEach(function (p) {
      if (!visible(p, respuestas)) { return; }
      html += vistaPregunta(p);
    });

    html += '</form>' +
      '<div class="nav">' +
      (i > 0 ? '<button class="btn secundario" data-accion="atras">Atrás</button>' : '') +
      '<button class="btn" data-accion="siguiente">' + (i === BLOQUES.length - 1 ? 'Ver mi resumen' : 'Continuar') + '</button>' +
      '</div>' +
      (faltantes.length ? '<p class="aviso-falta" role="alert">Faltan respuestas más arriba. Si no sabes, marca «No sé» cuando esté disponible.</p>' : '') +
      '</div>';
    return html;
  }

  function vistaPregunta(p) {
    var falta = faltantes.indexOf(p.id) !== -1;
    var h = '<fieldset class="pregunta' + (falta ? ' falta' : '') + '" data-pregunta="' + p.id + '">' +
      '<legend>' + esc(p.texto) + (p.opcional ? ' <span class="ayuda">(opcional)</span>' : '') + '</legend>';
    if (p.ayuda) { h += '<p class="ayuda">' + esc(p.ayuda) + '</p>'; }

    if (p.tipo === 'text') {
      h += '<div class="libre"><textarea data-id="' + p.id + '">' + esc(respuestas[p.id] || '') + '</textarea></div>';
    } else {
      var tipo = p.tipo === 'multi' ? 'checkbox' : 'radio';
      h += '<div class="opciones">';
      p.opciones.forEach(function (o) {
        var marcada = p.tipo === 'multi' ? incluye(respuestas[p.id], o.v) : respuestas[p.id] === o.v;
        h += '<label class="opcion' + (marcada ? ' marcada' : '') + '">' +
          '<input type="' + tipo + '" name="' + p.id + '" value="' + o.v + '"' +
          ' data-id="' + p.id + '"' + (o.excl ? ' data-excl="1"' : '') + (marcada ? ' checked' : '') + '>' +
          '<span>' + esc(o.t) + '</span></label>';
        if (o.otro && marcada) {
          h += '<div class="otro-input"><input type="text" data-id="' + o.otro + '" ' +
               'placeholder="¿Cuál?" value="' + esc(respuestas[o.otro] || '') + '"></div>';
        }
      });
      h += '</div>';
    }

    if (p.libre) {
      h += '<div class="libre"><label for="libre_' + p.libre.id + '">' + esc(p.libre.label) + '</label>' +
        '<input type="text" id="libre_' + p.libre.id + '" data-id="' + p.libre.id + '" value="' +
        esc(respuestas[p.libre.id] || '') + '"></div>';
    }

    if (p.revela && p.revela.si(respuestas[p.id])) {
      h += '<div class="revela" role="status"><p>' + esc(p.revela.texto) + '</p></div>';
    }

    h += '</fieldset>';
    return h;
  }

  function vistaResumen() {
    return '<a class="brand no-print" href="/">Vera Sativa</a>' +
      '<div class="card resumen">' +
      '<h1>Tu resumen</h1>' +
      '<p class="no-print">Esto es lo que declaraste, ordenado según lo que pide la ley. ' +
      '<strong>Hasta este momento nada ha salido de tu computador.</strong> ' +
      'Si cierras la pestaña sin descargar, se pierde.</p>' +
      resumenHTML(resumen(respuestas)) +
      '<div class="acciones no-print">' +
      '<button class="btn" data-accion="descargar">Descargar resumen (HTML)</button>' +
      '<button class="btn secundario" data-accion="pdf">Guardar como PDF</button>' +
      '<button class="btn secundario" data-accion="copiar">Copiar al portapapeles</button>' +
      '<button class="btn secundario" data-accion="correo">Enviar por correo</button>' +
      '</div>' +
      '<p class="copiado no-print" id="aviso-copia" hidden></p>' +
      '<p class="pie no-print"><strong>Ninguno de estos botones manda nada por su cuenta.</strong> El envío lo haces tú, y ' +
      '<a href="' + FUENTE + '" target="_blank" rel="noopener">el código está a la vista</a>.</p>' +
      '<p class="pie no-print">Si tu programa de correo abre el mensaje vacío o cortado, usa «Copiar al portapapeles» y pega el texto en un correo a ' +
      '<a href="mailto:' + CORREO + '">' + CORREO + '</a>.</p>' +
      '<div class="nav no-print"><button class="btn secundario" data-accion="atras-resumen">Volver a las respuestas</button></div>' +
      '</div>';
  }

  /* --------------------------------------------------------------- render -- */

  function render(scroll) {
    var html;
    if (pantalla === 'intro') { html = vistaIntro(); }
    else if (pantalla === 'resumen') { html = vistaResumen(); }
    else { html = vistaBloque(pantalla); }
    app.innerHTML = html;
    if (scroll !== false) { window.scrollTo(0, 0); }
  }

  /* Re-render the current block in place: reveals appear, conditional
     questions show up and "Otro" text fields open without losing focus
     position beyond the clicked control. */
  function refrescarBloque() {
    if (typeof pantalla !== 'number') { return; }
    var y = window.scrollY;
    var activo = document.activeElement;
    var marca = activo && activo.getAttribute && activo.getAttribute('data-id')
      ? { id: activo.getAttribute('data-id'), valor: activo.value }
      : null;
    render(false);
    window.scrollTo(0, y);
    // Without this the keyboard user loses their place on every keystroke:
    // re-rendering throws away the node that had focus.
    if (marca) {
      var vuelta = app.querySelector('[data-id="' + marca.id + '"][value="' +
                                     String(marca.valor).replace(/"/g, '\\"') + '"]');
      if (vuelta) { vuelta.focus({ preventScroll: true }); }
    }
  }

  function guardarEntrada(el) {
    var id = el.getAttribute('data-id');
    if (!id) { return; }

    if (el.type === 'checkbox') {
      var p = preguntaPorId(id);
      var actual = respuestas[id] || [];
      var esExcl = el.getAttribute('data-excl') === '1';
      if (el.checked) {
        actual = esExcl ? [el.value] : actual.filter(function (v) {
          var o = p.opciones.filter(function (x) { return x.v === v; })[0];
          return !(o && o.excl);
        }).concat([el.value]);
      } else {
        actual = actual.filter(function (v) { return v !== el.value; });
      }
      respuestas[id] = actual;
      refrescarBloque();
      return;
    }

    if (el.type === 'radio') {
      respuestas[id] = el.value;
      refrescarBloque();
      return;
    }

    respuestas[id] = el.value.trim();
  }

  function validar(i) {
    faltantes = BLOQUES[i].preguntas.filter(function (p) {
      if (p.opcional || !visible(p, respuestas)) { return false; }
      var v = respuestas[p.id];
      if (p.tipo === 'multi') { return !v || !v.length; }
      return !v;
    }).map(function (p) { return p.id; });
    return faltantes.length === 0;
  }

  /* -------------------------------------------------------------- actions -- */

  function avisar(texto) {
    var el = document.getElementById('aviso-copia');
    if (!el) { return; }
    el.textContent = texto;
    el.hidden = false;
  }

  var ACCIONES = {
    empezar: function () { pantalla = 0; render(); },
    atras: function () {
      faltantes = [];
      pantalla = Math.max(0, pantalla - 1);
      render();
    },
    siguiente: function () {
      if (!validar(pantalla)) {
        render();
        var primera = app.querySelector('.pregunta.falta');
        if (primera) { primera.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        return;
      }
      faltantes = [];
      pantalla = pantalla === BLOQUES.length - 1 ? 'resumen' : pantalla + 1;
      render();
    },
    'atras-resumen': function () { pantalla = BLOQUES.length - 1; render(); },
    descargar: function () {
      descargar('diagnostico-21719-resumen-' + hoy() + '.html', archivoHTML(respuestas), 'text/html');
    },
    pdf: function () { window.print(); },
    copiar: function () {
      var texto = textoCompleto(respuestas);
      var ok = function () { avisar('Copiado. Pégalo donde quieras.'); };
      var falla = function () { avisar('El navegador no dejó copiar. Usa «Descargar resumen».'); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto).then(ok, falla);
      } else {
        var ta = document.createElement('textarea');
        ta.value = texto;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy') ? ok() : falla(); } catch (e) { falla(); }
        document.body.removeChild(ta);
      }
    },
    correo: function () {
      var asunto = 'Formulario previo · diagnóstico Ley 21.719';
      var href = 'mailto:' + CORREO +
        '?subject=' + encodeURIComponent(asunto) +
        '&body=' + encodeURIComponent(textoCompleto(respuestas));
      window.location.href = href;
      avisar('Se abrió tu programa de correo. Revisa que el resumen haya quedado completo antes de enviar.');
    }
  };

  /* ---------------------------------------------------------------- init -- */

  function init() {
    app = document.getElementById('app');

    // Screen changes are deferred to the next tick. Swapping the DOM while the
    // mouse or touch sequence is still running lets the release land on
    // whatever the new screen put under the pointer, marking an option the
    // visitor never chose.
    var DIFERIDAS = ['empezar', 'siguiente', 'atras', 'atras-resumen'];

    app.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-accion]');
      if (!btn) { return; }
      e.preventDefault();
      var accion = btn.getAttribute('data-accion');
      if (DIFERIDAS.indexOf(accion) !== -1) {
        setTimeout(ACCIONES[accion], 0);
      } else {
        ACCIONES[accion]();
      }
    });

    app.addEventListener('change', function (e) {
      if (e.target.matches('input, textarea')) { guardarEntrada(e.target); }
    });

    // Free text is saved as it is typed: no submit event ever fires.
    app.addEventListener('input', function (e) {
      if (e.target.matches('input[type="text"], textarea')) { guardarEntrada(e.target); }
    });

    app.addEventListener('submit', function (e) { e.preventDefault(); });

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
