// src/app/core/services/instructor.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Instructor } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  
  // Mock instructor data
  private mockInstructors: { [key: string]: Instructor } = {
    'default': {
      _id: 'instr-1',
      name: 'Ing. Joram Morales Cabrera',
      photoUrl: 'assets/images/instructors/prof2.jpg',
      bio: `Especialista en Seguridad Industrial, Brigadas de Emergencia y Gestión de Proyectos. Instructor Certificado por CONOCER EC0217 | Experto en ambientes de alto riesgo y formación didáctica aplicada.
      
El Ing. Joram Morales es un profesional con sólida experiencia en seguridad industrial, salud ocupacional y respuesta ante emergencias, tanto en campo como en formación de talento técnico. Cuenta con certificación oficial EC0217 de CONOCER, además de una trayectoria destacada como supervisor de seguridad en industrias automotrices de alto nivel como BMW, Hutchinson y DURR México.
      
Actualmente forma parte del equipo de instructores acreditados de UNIPROTEC, donde imparte cursos prácticos y actualizados en temas de NOM-STPS, brigadas de emergencia, medio ambiente y ergonomía industrial, integrando métodos gamificados y recursos de aprendizaje virtual.`,
      specialties: ['Seguridad Industrial', 'Respuesta a Emergencias', 'Normativa STPS', 'Formación de Brigadas']
    },
    'normativas': {
      _id: 'instr-2',
      name: 'Ing. Roberto Vázquez Hernández',
      photoUrl: 'assets/images/instructors/prof2.jpg',
      bio: `Especialista en Normatividad STPS y Sistemas de Gestión de Seguridad | Auditor certificado ISO 45001 | Consultor en cumplimiento normativo industrial.
      
El Ing. Vázquez cuenta con más de 15 años de experiencia en implementación y auditoría de sistemas de gestión de seguridad y salud en el trabajo. Ha colaborado con empresas de diversos sectores para asegurar el cumplimiento de normativas federales e internacionales.
      
Su enfoque práctico y orientado a resultados ha permitido a sus alumnos implementar exitosamente programas de seguridad que no solo cumplen con la normatividad, sino que reducen significativamente la incidencia de accidentes laborales.`,
      specialties: ['Normatividad STPS', 'ISO 45001', 'Sistemas de Gestión SST', 'Auditorías de Cumplimiento']
    },
    'brigadas': {
      _id: 'instr-3',
      name: 'TUM Laura Sánchez Méndez',
      photoUrl: 'assets/images/instructors/prof1.jpg',
      bio: `Técnico en Urgencias Médicas | Especialista en Formación de Brigadas | Instructora certificada en PHTLS y BLS | Experta en simulacros de emergencia.
      
La TUM Laura Sánchez combina su experiencia práctica como paramédico con su pasión por la formación de brigadistas, habiendo capacitado a más de 5,000 personas en los últimos 8 años.
      
Su metodología única integra casos prácticos basados en escenarios reales, permitiendo a los participantes desarrollar habilidades críticas para la respuesta a emergencias bajo presión. Ha coordinado programas de brigadas para empresas multinacionales y plantas industriales de alto riesgo.`,
      specialties: ['Primeros Auxilios', 'Brigadas de Emergencia', 'Evacuación', 'Rescate Industrial']
    },
    'seguridad': {
      _id: 'instr-4',
      name: 'Ing. Carlos Mendoza Fuentes',
      photoUrl: 'assets/images/instructors/prof2.jpg',
      bio: `Ingeniero en Seguridad Industrial | Especialista en Análisis de Riesgos | Experto en Espacios Confinados y Trabajos en Altura | Certificado en Protección Contra Caídas.
      
El Ing. Mendoza ha desarrollado su carrera profesional en la industria petrolera y petroquímica, donde ha implementado programas de seguridad para operaciones de alto riesgo.
      
Su enfoque en la prevención basada en el comportamiento y el análisis sistemático de riesgos ha sido fundamental para elevar los estándares de seguridad en múltiples organizaciones. Cuenta con certificaciones internacionales en trabajos especializados de alto riesgo.`,
      specialties: ['Espacios Confinados', 'Trabajos en Altura', 'Análisis de Riesgos', 'Bloqueo LOTO']
    }
  };

  constructor() { }

  /**
   * Get a mock instructor based on course category
   * @param category Course category
   * @returns Observable of Instructor object
   */
  getMockInstructorByCategory(category: string): Observable<Instructor> {
    // Map category to instructor type
    const categoryMap: { [key: string]: string } = {
      'Normativas Clave': 'normativas',
      'Seguridad Especializada': 'seguridad',
      'Protección y Prevención': 'brigadas',
      'Desarrollo Profesional': 'default'
    };
    
    const instructorKey = categoryMap[category] || 'default';
    return of(this.mockInstructors[instructorKey]);
  }

  /**
   * Get a mock instructor by ID
   * @param id Instructor ID
   * @returns Observable of Instructor object
   */
  getMockInstructorById(id: string): Observable<Instructor> {
    // Find an instructor by ID or return default
    const instructor = Object.values(this.mockInstructors).find(i => i._id === id);
    return of(instructor || this.mockInstructors['default']);
  }

  /**
   * Get all available mock instructors
   * @returns Observable array of all Instructor objects
   */
  getAllMockInstructors(): Observable<Instructor[]> {
    return of(Object.values(this.mockInstructors));
  }
}