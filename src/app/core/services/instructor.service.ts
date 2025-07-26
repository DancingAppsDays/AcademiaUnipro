// src/app/core/services/instructor.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface EnhancedInstructor {
  _id: string;
  name: string;
  title?: string;
  subtitle?: string;
  photoUrl: string;
  bio: string;
  specialties: string[];
  professionalProfile?: string;
  certifications?: string[];
  experience?: string[];
  rawText?: string; // Store original formatted text
  categories: string[]; // Which course categories this instructor teaches
}

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  // Enhanced instructor database with formatted content
  private instructorDatabase: { [key: string]: EnhancedInstructor } = {
    'ricardo-vazquez': {
      _id: 'instr-ricardo-1',
      name: 'Ing. Ricardo Geciel Vázquez Medina',
      title: 'Especialista en Seguridad Industrial y Aplicación de Normas STPS',
      subtitle: 'Instructor Certificado por CONOCER EC0217 | Líder en formación para entornos de alto riesgo',
      photoUrl: 'assets/images/instructors/ricardo-vazquez.jpg',
      bio: `El Ing. Ricardo Geciel es un instructor con más de 10 años de experiencia en seguridad industrial, higiene ocupacional y normativas STPS. Certificado bajo el estándar EC0217 de CONOCER, actualmente forma parte del equipo de instructores acreditados de UNIPROTEC, capacitando a líderes, técnicos y operadores en empresas de clase mundial.

Ha sido coordinador de seguridad en el proyecto Paint Shop de General Motors México, liderando estrategias de prevención de riesgos, formación de líderes de seguridad, auditorías e implementación de AMEF. Su estilo de enseñanza se basa en experiencias reales de campo, metodologías gamificadas y un enfoque directo y práctico.`,
      specialties: ['Seguridad Industrial', 'Normativa STPS', 'Higiene Ocupacional', 'Prevención de Riesgos'],
      professionalProfile: `El Ing. Ricardo Geciel es un instructor con más de 10 años de experiencia en seguridad industrial, higiene ocupacional y normativas STPS. Certificado bajo el estándar EC0217 de CONOCER, actualmente forma parte del equipo de instructores acreditados de UNIPROTEC, capacitando a líderes, técnicos y operadores en empresas de clase mundial.

Ha sido coordinador de seguridad en el proyecto Paint Shop de General Motors México, liderando estrategias de prevención de riesgos, formación de líderes de seguridad, auditorías e implementación de AMEF. Su estilo de enseñanza se basa en experiencias reales de campo, metodologías gamificadas y un enfoque directo y práctico.`,
      certifications: [
        'Ingeniero Industrial',
        'Técnico en Seguridad e Higiene Industrial – UPAV Plantel Silao',
        'Certificación EC0217 – Impartición de cursos presenciales grupales (CONOCER)',
        'Certificación EC0391 – Verificación de condiciones de Seguridad e Higiene (2024)',
        'Diplomado OSHA – Safety Solutions, Arizona, EE.UU. (2017)',
        'Diplomado en Seguridad e Higiene Industrial y Salud Ocupacional – UNAM (120 hrs.)',
        'Diplomado ISO 9001:2015, 14001:2015, 45001:2018 – CAPINSER (2024)',
        'Curso en Metodologías Gamificadas para la Enseñanza – Grupo E2 (2020)',
        'Curso de Equipos Móviles (montacargas, grúas, polipastos, etc.) – ILACI (2022)',
        'Diplomado Líder de Seguridad Industrial – Group M+W / Proyecto BDF NIVEA (2021)',
        'Occupational Health & Safety Specialist – AIFYC Texas, 100 hrs. (2024)',
        'Diplomado Nivel 3 – Seguridad, Salud, Medio Ambiente y Calidad (2024)'
      ],
      experience: [
        'Coordinador de seguridad en proyecto Paint Shop de General Motors México',
        'Instructor acreditado de UNIPROTEC',
        'Líder en estrategias de prevención de riesgos',
        'Especialista en formación de líderes de seguridad',
        'Auditor e implementador de AMEF'
      ],
      categories: ['Normativas Clave', 'Seguridad Especializada'],
      rawText: `**Ing. Ricardo Geciel Vázquez Medina**...`
    },

    'miroslava-jimenez': {
      _id: 'instr-miroslava-1',
      name: 'Miroslava Jiménez Martínez',
      title: 'Instructora Certificada en Seguridad e Higiene Industrial',
      subtitle: 'Coordinadora de Seguridad e Higiene | Especialista en Gestión Ambiental y Mejora Continua',
      photoUrl: 'assets/images/instructors/miroslava-jimenez.jpg',
      bio: `Miroslava Jiménez es una profesional con sólida formación en Ingeniería Ambiental y una trayectoria destacada en Seguridad, Higiene y Sustentabilidad Industrial. Cuenta con certificación oficial EC0217 del CONOCER como instructora profesional, avalando su capacidad para impartir capacitación de forma efectiva y estructurada.

Ha liderado procesos de mejora continua, seguridad y gestión ambiental en empresas como Red Hialina, ENCORP, Hitchiner y ERMO, especializándose en el diseño y aplicación de programas de seguridad laboral, manejo de residuos, ergonomía y cumplimiento normativo.`,
      specialties: ['Seguridad e Higiene Industrial', 'Gestión Ambiental', 'Mejora Continua', 'Ergonomía', 'Manejo de Residuos'],
      professionalProfile: `Miroslava Jiménez es una profesional con sólida formación en Ingeniería Ambiental y una trayectoria destacada en Seguridad, Higiene y Sustentabilidad Industrial. Ha liderado procesos de mejora continua, seguridad y gestión ambiental en empresas como Red Hialina, ENCORP, Hitchiner y ERMO.`,
      certifications: [
        'Ingeniería Ambiental - Universidad Autónoma de San Luis Potosí',
        'Certificación EC0217.01 - Estándar de Competencia CONOCER',
        'Diplomado en Seguridad e Higiene Industrial (2018)',
        'Diplomado Lean Manufacturing (2018-2019)',
        'Curso Ley Federal de Responsabilidad Ambiental (2017)',
        'Curso NMX-AA-171-SCFI-2014: Desempeño Ambiental en Hospitalidad',
        'Formación en Evaluación de Impacto Ambiental',
        'Formación en Riesgo Industrial, Química Verde y Sistemas de Gestión de Calidad'
      ],
      experience: [
        'Coordinadora de Seguridad e Higiene en Red Hialina',
        'Especialista en gestión ambiental en ENCORP',
        'Líder de mejora continua en Hitchiner',
        'Coordinadora de seguridad en ERMO'
      ],
      categories: ['Seguridad Especializada', 'Protección y Prevención']
    },

    'jessica-balderrama': {
      _id: 'instr-jessica-1',
      name: 'Ing. Jessica Arizbeth Balderrama Durán',
      title: 'Especialista en Seguridad, Salud y Medio Ambiente en la Industria Automotriz y de Construcción',
      subtitle: 'Instructora Certificada CONOCER EC0217 | Líder en coordinación de seguridad con más de 10 años de experiencia en campo',
      photoUrl: 'assets/images/instructors/jessica-balderrama.jpg',
      bio: `La Ing. Jessica Balderrama cuenta con una sólida trayectoria profesional en el sector industrial, automotriz y de construcción, con especialización en seguridad, salud ocupacional y medio ambiente (SSMA). A lo largo de más de una década ha liderado y supervisado proyectos de alto impacto para empresas como BMW, Toyota, L'Oréal y Nissan, coordinando equipos multidisciplinarios y aplicando estrictamente las NOM-STPS.

Actualmente forma parte del equipo de instructores acreditados de UNIPROTEC, donde imparte capacitaciones prácticas y actualizadas, integrando su experiencia operativa en múltiples plantas con un enfoque humano, técnico y normativo.`,
      specialties: ['Seguridad Industrial', 'Salud Ocupacional', 'Medio Ambiente', 'Industria Automotriz', 'Gestión SSMA'],
      professionalProfile: `La Ing. Jessica Balderrama cuenta con una sólida trayectoria profesional en el sector industrial, automotriz y de construcción, con especialización en seguridad, salud ocupacional y medio ambiente (SSMA). Ha liderado proyectos para BMW, Toyota, L'Oréal y Nissan.`,
      certifications: [
        'Ingeniería (área no especificada)',
        'Certificación CONOCER EC0217 – Impartición de cursos de formación presencial grupal',
        'Gestión de riesgos y trabajos con permisos especiales',
        'Seguridad ambiental y control de residuos',
        'Coordinación de brigadas y supervisión normativa',
        'Evaluación de condiciones de trabajo en obra y planta'
      ],
      experience: [
        'Coordinadora SSMA en Electrificaciones Integrales SELEC (Qro.)',
        'Coordinadora de Seguridad y Medio Ambiente en CONSTRUPLAN (Qro. y SLP)',
        'Coordinadora SSMA en FRANCISCO MARTÍNEZ SILVA / L\'Oréal SLP',
        'Supervisora en BMW Plant 30.10 (SLP) - PODERCON, PRODYNAMICS, BIDISA, PRO S.O.S.',
        'Supervisora de seguridad en TOYOTA TMMGT (Gto.)',
        'Coordinadora de seguridad en Centro de Distribución Industrial / Nissan Aguascalientes',
        'Gestión de permisos en Nuvoil / Veracruz',
        'Consultora y capacitadora industrial en CSIyC / Veracruz'
      ],
      categories: ['Seguridad Especializada', 'Normativas Clave']
    },

    'joram-morales': {
      _id: 'instr-joram-1',
      name: 'Ing. Joram Morales Cabrera',
      title: 'Especialista en Seguridad Industrial y Brigadas de Emergencia',
      subtitle: 'Instructor Certificado por CONOCER EC0217 | Experto en ambientes de alto riesgo',
      photoUrl: 'assets/images/instructors/joram-morales.jpg',
      bio: `El Ing. Joram Morales es un profesional con sólida experiencia en seguridad industrial, salud ocupacional y respuesta ante emergencias, tanto en campo como en formación de talento técnico. Cuenta con certificación oficial EC0217 de CONOCER, además de una trayectoria destacada como supervisor de seguridad en industrias automotrices de alto nivel como BMW, Hutchinson y DURR México.

Actualmente forma parte del equipo de instructores acreditados de UNIPROTEC, donde imparte cursos prácticos y actualizados en temas de NOM-STPS, brigadas de emergencia, medio ambiente y ergonomía industrial, integrando métodos gamificados y recursos de aprendizaje virtual.`,
      specialties: ['Seguridad Industrial', 'Respuesta a Emergencias', 'Normativa STPS', 'Formación de Brigadas'],
      professionalProfile: `El Ing. Joram Morales es un profesional con sólida experiencia en seguridad industrial, salud ocupacional y respuesta ante emergencias, tanto en campo como en formación de talento técnico. Cuenta con certificación oficial EC0217 de CONOCER, además de una trayectoria destacada como supervisor de seguridad en industrias automotrices de alto nivel como BMW, Hutchinson y DURR México.

Actualmente forma parte del equipo de instructores acreditados de UNIPROTEC, donde imparte cursos prácticos y actualizados en temas de NOM-STPS, brigadas de emergencia, medio ambiente y ergonomía industrial, integrando métodos gamificados y recursos de aprendizaje virtual.`,
      categories: ['Protección y Prevención', 'Seguridad Especializada'],
      certifications: [
        'Certificación EC0217 de CONOCER',
        'Supervisor de Seguridad Industrial',
        'Especialista en Brigadas de Emergencia'
      ],
      experience: [
        'Supervisor de seguridad en BMW',
        'Supervisor de seguridad en Hutchinson',
        'Supervisor de seguridad en DURR México',
        'Instructor acreditado de UNIPROTEC'
      ]
    },


    // 1. Ing. Héctor Oliver Marín Cárdenas
    'hector-marin': {
      _id: 'instr-hector-1',
      name: 'Ing. Héctor Oliver Marín Cárdenas',
      title: 'Especialista en Sistemas de Gestión, Seguridad Industrial y Medio Ambiente',
      subtitle: 'Instructor Certificado por CONOCER EC0217 | Consultor en migración de normas ISO',
      photoUrl: 'assets/images/instructors/hector-marin.jpg',
      bio: `El Ing. Héctor Oliver Marín es un consultor y formador altamente experimentado en la implementación de sistemas de gestión de calidad, medio ambiente y seguridad industrial bajo estándares internacionales. Su trayectoria abarca sectores como el automotriz y metalmecánico, donde ha liderado proyectos de alto impacto, incluyendo migraciones normativas, auditorías internas y arranques de planta en México, Alemania y Honduras.

Como instructor certificado por CONOCER (EC0217), actualmente colabora con UNIPROTEC impartiendo cursos de formación en ISO 9001, ISO 14001, auditorías LPA y Kamishibai, seguridad laboral, y cumplimiento normativo ante la STPS.`,
      specialties: ['Sistemas de Gestión ISO', 'Auditorías de Seguridad', 'Cumplimiento STPS', 'Gestión de Riesgos'],
      professionalProfile: `El Ing. Héctor Oliver Marín es un consultor y formador altamente experimentado en la implementación de sistemas de gestión de calidad, medio ambiente y seguridad industrial bajo estándares internacionales. Su trayectoria abarca sectores como el automotriz y metalmecánico, donde ha liderado proyectos de alto impacto.`,
      certifications: [
        'Ingeniero Industrial con especialidad en Sistemas de Gestión, Seguridad, Higiene y Control Ambiental (IPN)',
        'Certificación EC0217 de CONOCER',
        'Registro STPS: UNI121210694-0013'
      ],
      experience: [
        'Consultor en migración de ISO 9001:2008 a ISO 9001:2015',
        'Consultor en migración de ISO 14001:2004 a ISO 14001:2015',
        'Implementación de auditorías LPA\'s y Kamishibai',
        'Disminución del 80% de accidentes implementando programas SHE en sector automotriz',
        'Reducción de la prima de riesgo del IMSS durante 3 años consecutivos',
        'Arranque del departamento de Seguridad con cumplimiento del 93% ante STPS',
        'Arranque de planta con alineación a estándares internacionales en Alemania, México y Honduras'
      ],
      categories: ['Normativas Clave', 'Desarrollo Profesional']
    },

    // 2. Ing. Víctor Hugo España García
    'victor-espana': {
      _id: 'instr-victor-1',
      name: 'Ing. Víctor Hugo España García',
      title: 'Especialista en Seguridad Industrial, Higiene y Medio Ambiente',
      subtitle: 'Instructor certificado por CONOCER EC0217 | No. Reg. STPS: UNI121210694-0013',
      photoUrl: 'assets/images/instructors/victor-espana.jpg',
      bio: `El Ing. Víctor Hugo España es un profesional con amplia experiencia en seguridad industrial, higiene y medio ambiente, dedicado a la impartición de cursos, coordinación y gerencia en sectores industriales diversos como manufactura, metalmecánica y petrolero. Su carrera incluye roles clave en empresas nacionales e internacionales, así como formación continua en normativas y prevención de riesgos laborales.

Actualmente, colabora como instructor certificado por CONOCER impartiendo cursos en temas de NOM STPS, seguridad ocupacional, higiene y medio ambiente en UNIPROTEC.`,
      specialties: ['Seguridad Industrial', 'Higiene y Protección Ambiental', 'Normatividad NOM STPS', 'Coordinación EHS'],
      professionalProfile: `El Ing. Víctor Hugo España es un profesional con amplia experiencia en seguridad industrial, higiene y medio ambiente, dedicado a la impartición de cursos, coordinación y gerencia en sectores industriales diversos como manufactura, metalmecánica y petrolero.`,
      certifications: [
        'Ingeniería Industrial con especialidad en Seguridad e Higiene, UPIICSA (IPN), Titulación 1997',
        'Técnico en Máquinas Herramientas, CECyT No. 9 (IPN), 1987 – 1990',
        'Certificación EC0217 de CONOCER',
        'Auditor Líder ISO 14000:2008',
        'Safety Specialist por la Universidad de Texas en Arlington (en proceso)',
        'Certificación en Seguridad de Planta (Protección contra el Bioterrorismo)',
        'Registro STPS: UNI121210694-0013'
      ],
      experience: [
        'Instructor acreditado en UNIPROTEC (2023 – Actual)',
        'Coordinador de EHS en RIEKE DE MÉXICO MANUFACTURING S. de R.L. de C.V. (2019)',
        'Gerente de EHS en ITW POLYMEX S. de R.L. de C.V. (2018 – 2019)',
        'Coordinador de Seguridad e Higiene y Medio Ambiente en CERTUS AUTOMOTIVE S. de R.L. de C.V. (2018)',
        'Coordinador de Seguridad Industrial, Salud Ocupacional, Medio Ambiente y Patrimonial en PRINTPACK PACKAGING DE MÉXICO S.A. de C.V. (2009 – 2017)',
        'Coordinador de Seguridad e Higiene en MISSION HILLS S.A. DE C.V. (Grupo Colgate Palmolive) (2000 – 2009)',
        'Inspector de Seguridad e Higiene y Protección Civil en COAST TIMÓN S.A. DE C.V. (2000)',
        'Ingeniero de Seguridad en COTEMAR S.A. DE C.V. (1998 – 2000)',
        'Jefe de Seguridad Industrial en INDUSTRIAS SOLA BASIC S.A. DE C.V. (1996 – 1998)',
        'Técnico de Seguridad e Higiene en PROCTER & GAMBLE DE MÉXICO, S.A. DE C.V. (1990 – 1992)'
      ],
      categories: ['Normativas Clave', 'Seguridad Especializada']
    },

    // 3. Ing. José Juan Abrego Nicolás
    'jose-abrego': {
      _id: 'instr-jose-1',
      name: 'Ing. José Juan Abrego Nicolás',
      title: 'Especialista en Seguridad Industrial, Higiene y Medio Ambiente',
      subtitle: 'Instructor certificado por CONOCER EC0217 | Instructor Registrado STPS No. Reg. STPS: UNI121210694-0013',
      photoUrl: 'assets/images/instructors/jose-abrego.jpg',
      bio: `El Ing. José Juan Abrego Nicolás es un profesional con amplia experiencia en la enseñanza y coordinación de cursos relacionados con seguridad, higiene, salud ocupacional y medio ambiente. Su trayectoria incluye la formación técnica en diversas normativas NOM, así como roles docentes y coordinativos en instituciones educativas y corporativos.

Actualmente colabora como instructor certificado en UNIPROTEC, impartiendo cursos especializados para la prevención y cumplimiento normativo en seguridad y ambiente laboral.`,
      specialties: ['Seguridad Industrial', 'Normativas NOM', 'Ergonomía', 'Salud Ocupacional'],
      professionalProfile: `El Ing. José Juan Abrego Nicolás es un profesional con amplia experiencia en la enseñanza y coordinación de cursos relacionados con seguridad, higiene, salud ocupacional y medio ambiente. Su trayectoria incluye la formación técnica en diversas normativas NOM, así como roles docentes y coordinativos.`,
      certifications: [
        'Ingeniería Industrial, Instituto Tecnológico de San Juan del Río (2000 – 2005)',
        'Técnico en Computación, CBTis #145 (1997 – 2000)',
        'Certificación EC0217 de CONOCER (Octubre 2016)',
        'Instructor Registrado STPS'
      ],
      experience: [
        'Instructor en UNIPROTEC S.A. de C.V., impartiendo cursos en seguridad e higiene, ambiental y ocupacional (2015 – Actual)',
        'Coordinador Corporativo de Recursos Humanos en Big Bola Casinos (Agosto 2013 – Enero 2015)',
        'Tutor de educación a distancia en EPAD ITQ, Unidad San Joaquín (Agosto 2012 – Junio 2013)',
        'Profesor docente en CONALEP San José Iturbide, Guanajuato (Enero 2012 – Julio 2012)',
        'Profesor de asignatura en Universidad Tecnológica de San Juan del Río (Enero 2008 – Mayo 2012)'
      ],
      categories: ['Normativas Clave', 'Desarrollo Profesional']
    },

    // 4. Lic. Luz Rosa Julieta Mares Vázquez
    'luz-mares': {
      _id: 'instr-luz-1',
      name: 'Lic. Luz Rosa Julieta Mares Vázquez',
      title: 'Especialista en Desarrollo Humano y Psicología Organizacional',
      subtitle: 'Instructor certificado por CONOCER EC0217 | No. Reg. STPS: UNI121210694-0013',
      photoUrl: 'assets/images/instructors/luz-mares.jpg',
      bio: `La Lic. Luz Rosa Julieta Mares Vázquez es una instructora y consultora especializada en desarrollo humano y formación de capital humano, con amplia experiencia en capacitación presencial, liderazgo gerencial y gestión comercial. Su trayectoria incluye roles directivos y consultoría independiente, con énfasis en la creación de equipos de trabajo efectivos y el desarrollo de habilidades para el logro de resultados.

Actualmente colabora como instructora certificada en UNIPROTEC y dirige su propia empresa en diagnóstico térmico.`,
      specialties: ['Desarrollo Humano', 'Liderazgo Gerencial', 'Formación de Capital Humano', 'Trabajo en Equipo'],
      professionalProfile: `La Lic. Luz Rosa Julieta Mares Vázquez es una instructora y consultora especializada en desarrollo humano y formación de capital humano, con amplia experiencia en capacitación presencial, liderazgo gerencial y gestión comercial.`,
      certifications: [
        'Licenciatura en Psicología',
        'Certificación EC0217 de CONOCER',
        'Registro STPS: UNI121210694-0013'
      ],
      experience: [
        'Instructor certificado en UNIPROTEC S.A. de C.V. (Actual)',
        'Socio Director en Check Diagnóstico Térmico, Jalisco (2018 – 2023)',
        'Capacitadora independiente en desarrollo humano y formación de equipos (2015 – 2020)',
        'Subdirectora Comercial y Administrativa en Praxishogar, Desarrolladora de Vivienda, La Paz, Baja California Sur (2007 – 2014)',
        'Auditora en IMSS, Tepatitlán de Morelos, Jalisco (2004 – 2007)'
      ],
      categories: ['Desarrollo Profesional', 'Protección y Prevención']
    },

    'default': {
      _id: 'instr-default-1',
      name: 'Instructor UNIPROTEC',
      title: 'Especialista en Seguridad Industrial',
      subtitle: 'Instructor Certificado',
      photoUrl: 'assets/images/instructors/default-instructor.png',
      bio: 'Instructor especializado con amplia experiencia en seguridad industrial y capacitación empresarial.',
      specialties: ['Seguridad Industrial', 'Capacitación Empresarial'],
      professionalProfile: 'Instructor especializado con amplia experiencia en seguridad industrial y capacitación empresarial.',
      categories: ['Desarrollo Profesional'],
      certifications: [],
      experience: []
    }
  };

  // Course category to instructor mapping
  private courseInstructorMapping: { [courseId: string]: string } = {
    // Map specific course IDs to instructor keys
    '67fabd7aed988286dbb4d26f': 'ricardo-vazquez', //maquinarioa curso
    '68016ba6dacd51ff0543002b': 'joram-morales', // manejo de sustnacias peligrosas
    '67fabd7ded988286dbb4d271': 'joram-morales', // sustancias globalmente armonizado                  

    '68016b9bdacd51ff05430029': 'miroslava-jimenez', // bloqueo loto
    '68016bb4dacd51ff0543002d': 'jessica-balderrama', // residuos peligrosos
    '67fabd76ed988286dbb4d26d': 'ricardo-vazquez', // corte y soldadura nom027
    '68016b3bdacd51ff05430027': 'jessica-balderrama', // instalaciones electricas
    '68016bc2dacd51ff0543002f': 'ricardo-vazquez', // espacios confinados nom033
    '68016bccdacd51ff05430031': 'jessica-balderrama', // ruido nom011
    '68016bdadacd51ff05430033': 'jessica-balderrama', // proteccion personal nom017
    '68016be4dacd51ff05430035': 'miroslava-jimenez', // comision seguridad nom019 
    '68016becdacd51ff05430037': 'miroslava-jimenez', // iluminacion nom025
    '68016bf5dacd51ff05430039': 'miroslava-jimenez', // señalizacion nom026
    '681ad82a71d574b4001eeeb6': 'joram-morales', // riesgo psicosocial nom035
    '68016bfcdacd51ff0543003b': 'joram-morales', // formacion instructores
    '68016c07dacd51ff0543003d': 'joram-morales', // formacion supervisores

    '6883b9261fd8363fa0faeff0': 'ricardo-vazquez', // curso de seguridad industrialnom30
    // Add more mappings as needed
  };

  // Category-based fallback mapping
  private categoryInstructorMapping: { [category: string]: string } = {
    'Normativas Clave': 'ricardo-vazquez',
    'Seguridad Especializada': 'jessica-balderrama',
    'Protección y Prevención': 'miroslava-jimenez',
    'Desarrollo Profesional': 'joram-morales',
  };

  private courseDateInstructorOverrides: { [courseDateId: string]: string } = {
    // Example overrides - add specific courseDate IDs here when needed
    // 'coursedate-xyz-123': 'jessica-balderrama',
    // 'coursedate-abc-456': 'ricardo-vazquez',
  };

  constructor() { }


  getInstructorForCourseDate(
    courseId: string,
    category?: string,
    courseDateId?: string
  ): Observable<EnhancedInstructor> {
    let instructorKey: string | undefined;

    // 1. First check for courseDate-specific override (highest priority)
    if (courseDateId && this.courseDateInstructorOverrides[courseDateId]) {
      instructorKey = this.courseDateInstructorOverrides[courseDateId];
      console.log(`Using courseDate override for ${courseDateId}: ${instructorKey}`);
    }

    // 2. Fallback to course-specific mapping
    if (!instructorKey && this.courseInstructorMapping[courseId]) {
      instructorKey = this.courseInstructorMapping[courseId];
      console.log(`Using course mapping for ${courseId}: ${instructorKey}`);
    }

    // 3. Fallback to category mapping
    if (!instructorKey && category && this.categoryInstructorMapping[category]) {
      instructorKey = this.categoryInstructorMapping[category];
      console.log(`Using category mapping for ${category}: ${instructorKey}`);
    }

    // 4. Final fallback to default
    if (!instructorKey) {
      instructorKey = 'default';
      console.log(`Using default instructor`);
    }

    const instructor = this.instructorDatabase[instructorKey] || this.instructorDatabase['default'];
    return of(instructor);
  }

  setCourseDateInstructorOverride(courseDateId: string, instructorKey: string): void {
    if (this.instructorDatabase[instructorKey]) {
      this.courseDateInstructorOverrides[courseDateId] = instructorKey;
      console.log(`Set courseDate override: ${courseDateId} -> ${instructorKey}`);
    } else {
      console.warn(`Invalid instructor key: ${instructorKey}`);
    }
  }

  /**
   * Remove a courseDate-specific instructor override
   * @param courseDateId CourseDate ID
   */
  removeCourseDateInstructorOverride(courseDateId: string): void {
    if (this.courseDateInstructorOverrides[courseDateId]) {
      delete this.courseDateInstructorOverrides[courseDateId];
      console.log(`Removed courseDate override for: ${courseDateId}`);
    }
  }

  /**
   * Get all courseDate overrides (for debugging/admin purposes)
   * @returns Object with all courseDate overrides
   */
  getAllCourseDateOverrides(): { [courseDateId: string]: string } {
    return { ...this.courseDateInstructorOverrides };
  }

  /**
   * Get instructor for a specific course
   * @param courseId Course ID
   * @param category Course category (fallback)
   * @returns Observable of EnhancedInstructor
   */
  getInstructorForCourse(courseId: string, category?: string): Observable<EnhancedInstructor> {
    // First try direct course mapping
    let instructorKey = this.courseInstructorMapping[courseId];

    // If no direct mapping, use category mapping
    if (!instructorKey && category) {
      instructorKey = this.categoryInstructorMapping[category];
    }

    // Fallback to default
    if (!instructorKey) {
      instructorKey = 'default';
    }

    const instructor = this.instructorDatabase[instructorKey] || this.instructorDatabase['default'];
    return of(instructor);
  }

  /**
   * Get instructor by category (legacy method)
   * @param category Course category
   * @returns Observable of EnhancedInstructor
   */
  getMockInstructorByCategory(category: string): Observable<EnhancedInstructor> {
    const instructorKey = this.categoryInstructorMapping[category] || 'default';
    const instructor = this.instructorDatabase[instructorKey];
    return of(instructor);
  }

  /**
   * Get instructor by key
   * @param key Instructor key
   * @returns Observable of EnhancedInstructor
   */
  getInstructorByKey(key: string): Observable<EnhancedInstructor> {
    const instructor = this.instructorDatabase[key] || this.instructorDatabase['default'];
    return of(instructor);
  }

  /**
   * Get all available instructors
   * @returns Observable array of EnhancedInstructor objects
   */
  getAllInstructors(): Observable<EnhancedInstructor[]> {
    return of(Object.values(this.instructorDatabase));
  }

  /**
   * Parse formatted instructor text (utility method for adding new instructors)
   * @param rawText Formatted instructor text
   * @returns Parsed instructor data
   */
  parseInstructorText(rawText: string): Partial<EnhancedInstructor> {
    const lines = rawText.split('\n').filter(line => line.trim());

    let name = '';
    let title = '';
    let subtitle = '';
    let bio = '';
    const certifications: string[] = [];
    let inCertifications = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Extract name (first bold line)
      if (line.startsWith('**') && !name && !line.includes('🧩') && !line.includes('📚')) {
        name = line.replace(/\*\*/g, '').trim();
        continue;
      }

      // Extract title/subtitle
      if (line.startsWith('**') && name && !title && !line.includes('🧩') && !line.includes('📚')) {
        const titleText = line.replace(/\*\*/g, '').trim();
        if (titleText.includes('|')) {
          const parts = titleText.split('|');
          title = parts[0].trim();
          subtitle = parts[1].trim();
        } else {
          title = titleText;
        }
        continue;
      }

      // Start of certifications section
      if (line.includes('📚') || line.toLowerCase().includes('certificaciones')) {
        inCertifications = true;
        continue;
      }

      // Certification items
      if (inCertifications && line.startsWith('*')) {
        certifications.push(line.replace(/^\*\s*/, '').replace(/\*\*/g, '').trim());
        continue;
      }

      // Bio content (before certifications)
      if (!inCertifications && !line.includes('🧩') && !line.startsWith('**') && line.length > 10) {
        bio += (bio ? '\n\n' : '') + line;
      }
    }

    return {
      name,
      title,
      subtitle,
      bio: bio.trim(),
      certifications,
      rawText
    };
  }

  /**
   * Add or update instructor in the database
   * @param key Instructor key
   * @param instructorData Instructor data
   */
  addInstructor(key: string, instructorData: EnhancedInstructor): void {
    this.instructorDatabase[key] = instructorData;
  }

  /**
   * Map course to instructor
   * @param courseId Course ID
   * @param instructorKey Instructor key
   */
  mapCourseToInstructor(courseId: string, instructorKey: string): void {
    this.courseInstructorMapping[courseId] = instructorKey;
  }
}