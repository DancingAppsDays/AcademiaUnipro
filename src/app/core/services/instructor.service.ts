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
    // Add more mappings as needed
  };

  // Category-based fallback mapping
  private categoryInstructorMapping: { [category: string]: string } = {
    'Normativas Clave': 'ricardo-vazquez',
    'Seguridad Especializada': 'jessica-balderrama', 
    'Protección y Prevención': 'miroslava-jimenez',
    'Desarrollo Profesional': 'joram-morales',
  };

  constructor() { }

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