export interface MongoDocument {
  _id: string;
  [key: string]: any;
}

export const INITIAL_MONGO_DATA: Record<string, MongoDocument[]> = {
  terapeutas: [
    {
      _id: "terap_001",
      nombre: "Lic. Andrés Valencia Peña",
      titulo: "Psicólogo Clínico & Terapeuta Familiar, M.Sc.",
      colegiado: "Colegiado Nº 14.892",
      calificacion: 4.95,
      totalResenas: 148,
      verificado: true,
      atencionInmediata: true,
      enfoques: ["TCC", "Mindfulness", "Terapia Sistémica"],
      modalidadOnline: "Consulta Online (Meet Seguro Encriptado)",
      modalidadPresencial: "Presencial: Calle 93 #14-20, Bogotá / CDMX",
      precioIndividualUSD: 60,
      precioIndividualCOP: 240000,
      precioParejaUSD: 85,
      precioParejaCOP: 340000,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4hxORhwVPbeIqvikH2gdPiEHhxH7lLKb0k4AR8QsQH-TxeKxXFZ20cJ3q_kWUd2HEGLwoPY18Ep1it4dEtgOCfjB9_L0pYFanWMnks2lOnJ00dI_EnloB3zL_8b86Zj6eZymOIK7Xe45_jJsQ9-fxy0fhX15C37SoiRZ3J1rIM6Uf7FzGE69fmvcqdckCPX57wJixDPezX74__am0uSkP1oAIKUyAJ5L5Jksoy4aCc5q_JEpuqlPQ",
      fotoConsultorio: "https://lh3.googleusercontent.com/aida-public/AB6AXuDy1_M2DfxN5wcXmA_EGn5Xe1cL33QIJP1dHPzrXzzGgEI9Gv6452ZywLFKDBzNfpmAm0DzcHkf2VQ27IJWBzLK1UN_1Iiwy5W5mULoTyw1i5bh9hvWa0vSLDtV3IoZEzQ5wB-tPDw_BWbbXDd1Cq0tTyG6ttitI-RYVE52yjy0a_-gYaZq5gXbaJ_7BYcSvyf3UOlQAiuOzYNNiB-1xm81F585GLLgiAnM7OfPiG3ZLjxsfpCHpQEx",
      fotoTelepsicologia: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9YFkcnCfIQn1k7AZ4j0aPm5pVqoPi2HXKGieTKiLH7BLB7XO3GGy7gRBEyjpWcIXLwww93IwIXHTB7oKjpgwYw7ldmGgcld4eaaQw87QUVDW_TLOMuhAsvBkZf3ovko3yUdIyn-zn03JAtNZ_VFbGOG9ahohzQ-LPnUjIoe5DGk7FUO-Fuv_GEmJlFmKqPjWPkgCYhrkvA_idR1sLZ7vBO_rTjscnw9QwTpIF3A_Q-4d6cnFLSxh9",
      bio: "Hola, soy Andrés. Mi propósito como terapeuta es ofrecerte un espacio de absoluta confidencialidad, calidez humana y rigor clínico donde podamos deconstruir juntos aquellas dinámicas, pensamientos automáticos y cargas emocionales que hoy limitan tu bienestar. Cuento con más de 11 años de experiencia acompañando a adultos y parejas en el abordaje integral de crisis de ansiedad, desregulación del estado de ánimo, duelo migratorio y patrones de vinculación disfuncionales."
    },
    {
      _id: "terap_002",
      nombre: "Dra. Marcela Restrepo",
      titulo: "Especialista en Psicoterapia Cognitivo-Conductual",
      colegiado: "Reg. Sanitario N° 84920-CL",
      calificacion: 4.98,
      totalResenas: 112,
      verificado: true,
      atencionInmediata: false,
      enfoques: ["TCC", "Regulación Emocional", "Ansiedad y Fobias"],
      modalidadOnline: "En Línea (Sala Segura Encriptada)",
      modalidadPresencial: "Consultorio 302 (Presencial)",
      precioIndividualUSD: 55,
      precioIndividualCOP: 220000,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1GNpbkxtgRO1KhXv32vjXeQ8dI7rLeMLjLVQ2NKBMmFfp-ztYGHp69qLkO1EZiTSNcdR5whj4e7mUCbs8hJVnamNLKSefj2bFh0xvW5nd7MLDZgv-H7IZGQq5q-YCAkgOGMJ3gHQM6VHrHsU6Il2HPOG-MUmrh1ibRJznEI5hKJvmYagshjR4cV06c8aVUsF54v3PONpzK8pO_kTEK1gUnX8SDNu87J9S6fBwPJXQzkCps1XBWxxS",
      fotoChat: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUXQXkzyYstLCQL_Xb2n7668oRHnrBQTuvLWUWqkdMIgDskRyp7vppwDbGc3AHNn1OL4iMuci26VQ6nyygUjVekLNj3OjNPxs8_B_n71GsDcj9jIxfmF4keQFdFqF_FOxDBygRZSKniY4oQJkhs44cEaw4oh2-HtWc9_3Gmocn5yVOJkxBbly4vfMUS1Sjbelz2lAPJPODug8uDufF2h6fZKoBKIHNdktu_uBDhPE5axI_RhXnzR7a",
      bio: "Especialista clínica dedicada a la salud mental, acompañando a pacientes en el manejo adaptativo de la ansiedad, el estrés crónico y los episodios de pánico."
    },
    {
      _id: "terap_003",
      nombre: "Dra. Sofía Mendoza",
      titulo: "Psicóloga Clínica & Directora Médica",
      colegiado: "Colegiado Nº 19.401",
      calificacion: 4.96,
      totalResenas: 204,
      verificado: true,
      atencionInmediata: true,
      enfoques: ["TCC", "Neuropsicología", "Trauma EMDR"],
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuABKe4Lk09MqNmwgcQMYEKviIXh1Pa-I_J9-4XEHeefbH-K2QbzG8NWE68D2x6YURpqEEVX4-OtZWmv3vN0Lkqkt7rS8hHftIXE13fDl_emjsEk5OjRxiq434Fp852uYV8rRn3zjPJGwPzPvAV1scTyDYzfbUWLAznkZZIgcr7ywj7WwLGw68nGSQMLUKd4X59LZX6SZCg-oL--hD-sTX49uB44qvVaSrjAPFyBVh9q77t6S3LmdY",
      bio: "Directora del centro terapéutico Psico_Gestión, especializada en protocolos de intervención basados en evidencia."
    }
  ],

  citas: [
    {
      _id: "cita_001",
      pacienteId: "pac_001",
      pacienteNombre: "Camila Morales",
      pacienteAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMtUxbh5Jfc1_BQ4YTh2-EGYyje97zOcwV2n6DBex5dk9PEpXbf-5FF6WQzCWxL69MOI9RgtoSgNG9Oa_muo4yXtaHGKMTGgk4dN90KxpZQP3ootF0j4XNT9I_pALAIMUMBW_skVDZmiCGUF5vj3QJluNthNnvnWgJEgXWZhL8ET37a8TXmg9lBGC8vtGoUr0uuk5Klfc7PwzvIGh7sh9ioh-Yz2wjnoC3YWwsnY_wZyDrtzIq7M3l",
      terapeutaId: "terap_003",
      terapeutaNombre: "Dra. Sofía Mendoza",
      fecha: "2024-10-22",
      diaSemana: "Mar",
      horaInicio: "09:00",
      horaFin: "10:00",
      motivo: "Sesión 4: Manejo de Ansiedad",
      modalidad: "virtual",
      canal: "Google Meet",
      estado: "confirmada",
      montoUSD: 60,
      pagado: true,
      notas: "Trabajo de reestructuración cognitiva ante pensamientos catastrofistas en el entorno laboral. Tarea: autorregistro de emociones."
    },
    {
      _id: "cita_002",
      pacienteId: "pac_002",
      pacienteNombre: "Mateo Gómez",
      terapeutaId: "terap_003",
      terapeutaNombre: "Dra. Sofía Mendoza",
      fecha: "2024-10-22",
      diaSemana: "Mar",
      horaInicio: "10:30",
      horaFin: "11:30",
      motivo: "Primera Consulta",
      modalidad: "presencial",
      canal: "Consultorio 302",
      estado: "presencial",
      montoUSD: 60,
      pagado: true,
      notas: "Evaluación diagnóstica inicial y establecimiento de rapport terapéutico."
    },
    {
      _id: "cita_003",
      pacienteId: "pac_003",
      pacienteNombre: "Jorge Velasco",
      terapeutaId: "terap_003",
      terapeutaNombre: "Dra. Sofía Mendoza",
      fecha: "2024-10-23",
      diaSemana: "Mié",
      horaInicio: "10:00",
      horaFin: "11:00",
      motivo: "Seguimiento Emocional",
      modalidad: "virtual",
      canal: "Google Meet",
      estado: "pendiente_pago",
      montoUSD: 60,
      pagado: false,
      notas: "Pendiente link de pago por PayU."
    },
    {
      _id: "cita_004",
      pacienteId: "pac_004",
      pacienteNombre: "Lucía Fernández",
      terapeutaId: "terap_003",
      terapeutaNombre: "Dra. Sofía Mendoza",
      fecha: "2024-10-22",
      diaSemana: "Mar",
      horaInicio: "15:00",
      horaFin: "16:00",
      motivo: "Terapia de Pareja (Virtual)",
      modalidad: "virtual",
      canal: "Google Meet",
      estado: "recordatorio_enviado",
      montoUSD: 85,
      pagado: true,
      notas: "WhatsApp confirmado automáticamente por bot terapéutico."
    },
    {
      _id: "cita_005",
      pacienteId: "bloqueo",
      pacienteNombre: "Almuerzo / Espacio Terapéutico",
      terapeutaId: "terap_003",
      terapeutaNombre: "Dra. Sofía Mendoza",
      fecha: "2024-10-22",
      diaSemana: "Mar",
      horaInicio: "13:00",
      horaFin: "14:00",
      motivo: "Bloqueo Reservado / Autocuidado",
      modalidad: "bloqueo",
      canal: "Pausa",
      estado: "bloqueado",
      montoUSD: 0,
      pagado: true,
      notas: "Tiempo no asignable a pacientes."
    },
    {
      _id: "cita_006",
      pacienteId: "pac_001",
      pacienteNombre: "Camila Morales",
      terapeutaId: "terap_002",
      terapeutaNombre: "Dra. Marcela Restrepo",
      fecha: "2024-10-24",
      diaSemana: "Jue",
      horaInicio: "16:00",
      horaFin: "17:00",
      motivo: "Técnicas de Regulación Neuroafectiva",
      modalidad: "virtual",
      canal: "Sala Segura Encriptada",
      estado: "confirmada",
      montoUSD: 55,
      pagado: true,
      proximoDestacado: true,
      notas: "Enfocarse en disparadores de ansiedad situacional y ejercicios de respiración 4-7-8."
    },
    {
      _id: "cita_007",
      pacienteId: "pac_001",
      pacienteNombre: "Camila Morales",
      terapeutaId: "terap_002",
      terapeutaNombre: "Dra. Marcela Restrepo",
      fecha: "2024-11-02",
      diaSemana: "Sáb",
      horaInicio: "16:00",
      horaFin: "17:00",
      motivo: "Técnicas de Reestructuración Cognitiva y Desescalada",
      modalidad: "virtual",
      canal: "Google Meet",
      estado: "confirmada",
      montoUSD: 55,
      pagado: true,
      notas: "Revisar registro semanal ABC de pensamientos automáticos."
    },
    {
      _id: "cita_008",
      pacienteId: "pac_001",
      pacienteNombre: "Camila Morales",
      terapeutaId: "terap_002",
      terapeutaNombre: "Dra. Marcela Restrepo",
      fecha: "2024-11-16",
      diaSemana: "Sáb",
      horaInicio: "16:00",
      horaFin: "17:00",
      motivo: "Evaluación de Bitácora Semanal y Autocuidado",
      modalidad: "presencial",
      canal: "Consultorio 302 (Presencial)",
      estado: "confirmada",
      montoUSD: 55,
      pagado: true,
      notas: "Sesión presencial de balance mensual."
    },
    {
      _id: "cita_009",
      pacienteId: "pac_001",
      pacienteNombre: "Camila Morales",
      terapeutaId: "terap_002",
      terapeutaNombre: "Dra. Marcela Restrepo",
      fecha: "2024-10-10",
      diaSemana: "Jue",
      horaInicio: "16:00",
      horaFin: "17:00",
      motivo: "Sesión Individual #12",
      modalidad: "virtual",
      canal: "Google Meet",
      estado: "completada",
      montoUSD: 55,
      pagado: true,
      notas: "Camila presentó significativos avances en la identificación temprana de somatizaciones por sobrecarga laboral. Se establecieron micro-pausas y técnica de anclaje de 5 sentidos."
    }
  ],

  resenas: [
    {
      _id: "res_001",
      terapeutaId: "terap_001",
      autor: "Sofía R.",
      iniciales: "SR",
      subtitulo: "Paciente en Terapia Individual • 8 meses de proceso",
      calificacion: 5,
      fecha: "Hace 2 semanas",
      comentario: "Andrés me ayudó a atravesar una de las crisis de pánico más complejas que he vivido. Su trato es profundamente compasivo pero sin perder la orientación pragmática; cada semana salía con ejercicios claros para identificar distorsiones cognitivas. Hoy puedo gestionar situaciones de estrés laboral sin desbordarme emocionalmente. Infinitamente agradecida.",
      tags: ["#ManejoDeAnsiedad", "#Empatía", "Consulta Virtual Verificada"]
    },
    {
      _id: "res_002",
      terapeutaId: "terap_001",
      autor: "Carlos M.",
      iniciales: "CM",
      subtitulo: "Terapia de Pareja • 14 sesiones",
      calificacion: 5,
      fecha: "Hace 1 mes",
      comentario: "Asistimos a terapia presencial en su consultorio en Bogotá con mi esposa. La neutralidad y agudeza analítica de Andrés evitaron que cayéramos en acusaciones estériles y nos guiaron hacia un diálogo reconstructivo y respetuoso. El espacio físico es sumamente acogedor y transmite muchísima paz.",
      tags: ["#TerapiaDePareja", "#Claridad", "Presencial Bogotá"]
    },
    {
      _id: "res_003",
      terapeutaId: "terap_001",
      autor: "Elena V.",
      iniciales: "EV",
      subtitulo: "Terapia Individual Online (desde Madrid)",
      calificacion: 5,
      fecha: "Hace 2 meses",
      comentario: "Excelente profesional. Destaco especialmente su puntualidad irreprochable y el seguimiento que realiza entre sesiones. Me dio técnicas de respiración consciente que cambiaron radicalmente mi higiene de sueño y mi rumiación nocturna. 100% recomendado.",
      tags: ["#Puntualidad", "#Mindfulness", "Consulta Virtual Verificada"]
    }
  ],

  flujos_recordatorios: [
    {
      _id: "flujo_001",
      titulo: "Flujo 1: Anticipación Terapéutica",
      tiempo: "48h antes",
      tipo: "email",
      icono: "mail",
      colorTag: "secondary",
      activo: true,
      descripcion: "Correo con guía previa, indicaciones de encuadre y confirmación.",
      plantilla: "Estimado/a {nombre_paciente}, recordamos tu sesión de psicoterapia programada para el {fecha_cita} con {nombre_terapeuta}. Adjuntamos las pautas para tu espacio de calma reflexivo. Por favor confirma tu asistencia con el botón inferior.",
      incluyeBoton: "Confirmar Cita"
    },
    {
      _id: "flujo_002",
      titulo: "Flujo 2: Confirmación Directa WhatsApp",
      tiempo: "24h antes",
      tipo: "whatsapp",
      icono: "chat",
      colorTag: "primary",
      activo: true,
      destacado: true,
      descripcion: "Mensaje directo enriquecido con respuestas interactivas de un toque.",
      plantilla: "Hola {nombre_paciente} 🌿, te recordamos tu espacio terapéutico de mañana {fecha_cita}. Queremos asegurarnos de que cuentas con este momento para ti.",
      botones: ["[ Sí, Asistiré ]", "[ Reprogramar ]"],
      tasaRespuesta: "96% tasa de respuesta"
    },
    {
      _id: "flujo_003",
      titulo: "Flujo 3: Acceso Inmediato a Sala",
      tiempo: "1h antes",
      tipo: "sms",
      icono: "sms",
      colorTag: "tertiary",
      activo: true,
      descripcion: "SMS prioritario con sala virtual cifrada de tele-consulta.",
      plantilla: "Psico_Gestión: {nombre_paciente}, tu sesión inicia en 60 min. Conéctate seguro en: {enlace_sesion}",
      cifrado: "HIPAA Compliant"
    }
  ],

  monitor_envios: [
    {
      _id: "mon_001",
      pacienteNombre: "Mateo Valenzuela",
      iniciales: "MV",
      tipoTerapia: "Terapia Cognitivo-Conductual",
      citaProgramada: "Mañana, 16:30 hrs",
      modalidadTexto: "Tele-consulta HD",
      canal: "WhatsApp (24h)",
      canalTipo: "whatsapp",
      estadoEnvio: "Confirmado por Paciente",
      estadoColor: "green",
      ultimaInteraccion: "Hace 12 min (WhatsApp)"
    },
    {
      _id: "mon_002",
      pacienteNombre: "Camila Restrepo",
      iniciales: "CR",
      tipoTerapia: "Sesión de Pareja",
      citaProgramada: "Viernes 25, 10:00 hrs",
      modalidadTexto: "Presencial - Cons. 302",
      canal: "Email (48h)",
      canalTipo: "email",
      estadoEnvio: "Leído",
      estadoColor: "blue",
      ultimaInteraccion: "Hace 1 hora (Apertura)"
    },
    {
      _id: "mon_003",
      pacienteNombre: "Julián Arteaga",
      iniciales: "JA",
      tipoTerapia: "Evaluación Psicométrica",
      citaProgramada: "Hoy, 18:00 hrs",
      modalidadTexto: "Tele-consulta HD",
      canal: "SMS (1h)",
      canalTipo: "sms",
      estadoEnvio: "Entregado",
      estadoColor: "amber",
      ultimaInteraccion: "Hace 35 min (SMS Gate)"
    },
    {
      _id: "mon_004",
      pacienteNombre: "Lucía Godoy",
      iniciales: "LG",
      tipoTerapia: "Psicoterapia Individual",
      citaProgramada: "Sábado 26, 09:15 hrs",
      modalidadTexto: "Presencial - Cons. 302",
      canal: "WhatsApp (24h)",
      canalTipo: "whatsapp",
      estadoEnvio: "Confirmado por Paciente",
      estadoColor: "green",
      ultimaInteraccion: "Ayer, 19:14 hrs"
    }
  ],

  diario_emocional: [
    { _id: "emo_001", fecha: "2024-10-18", dia: "Vie", nivel: 3, estado: "Neutro", emoji: "😐" },
    { _id: "emo_002", fecha: "2024-10-19", dia: "Sáb", nivel: 4, estado: "Calma", emoji: "🌱" },
    { _id: "emo_003", fecha: "2024-10-20", dia: "Dom", nivel: 4, estado: "Calma", emoji: "🌱" },
    { _id: "emo_004", fecha: "2024-10-21", dia: "Lun", nivel: 2, estado: "Baja", emoji: "😔" },
    { _id: "emo_005", fecha: "2024-10-22", dia: "Mar", nivel: 4, estado: "Calma", emoji: "🌱" },
    { _id: "emo_006", fecha: "2024-10-23", dia: "Mié", nivel: 4, estado: "Calma", emoji: "🌱" },
    { _id: "emo_007", fecha: "2024-10-24", dia: "Hoy", nivel: 4, estado: "Calma", emoji: "🌱" }
  ],

  chat_mensajes: [
    {
      _id: "msg_001",
      remitente: "terapeuta",
      nombre: "Dra. Marcela Restrepo",
      texto: "Hola Camila, recuerda revisar el registro de activación somática antes de nuestra sesión del jueves.",
      fecha: "Ayer 18:24",
      leido: true
    }
  ],

  plantillas_clinicas: [
    {
      _id: "plan_001",
      titulo: "Anamnesis Inicial y Motivo de Consulta",
      codigo: "DSM-5 / CIE-11",
      contenido: "1. Motivo manifiesto de consulta\n2. Antecedentes psicopatológicos personales y familiares\n3. Examen del estado mental actual (afecto, curso del pensamiento, orientación)\n4. Hipótesis diagnóstica tentativa y metas terapéuticas compartidas."
    },
    {
      _id: "plan_002",
      titulo: "Protocolo de Registro Cognitivo TCC (Modelo Beck)",
      codigo: "TCC-01",
      contenido: "1. Situación activadora / Desencadenante ambiental\n2. Pensamiento automático negativo o creencia intermedia\n3. Emoción experimentada e intensidad (0-100%)\n4. Respuesta adaptativa racional y reevaluación afectiva."
    },
    {
      _id: "plan_003",
      titulo: "Escala de Ansiedad y Evaluación Somática",
      codigo: "GAD-7 / BAI",
      contenido: "Evaluación de hiperventilación, tensión muscular, rumiación anticipatoria e interferencia en áreas socio-laborales. Registro de conductas de seguridad y de evitación."
    }
  ]
};
