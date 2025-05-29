// src/app/component/course-info-details/course-info-details.component.ts
// This component displays course learning objectives and target audience
// It can extract information from the course description or use default values
// For the course shown in your image, we'll use the extracted content
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../../core/models/course.model';

@Component({
  selector: 'app-course-info-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="course-info-details">
      <!-- Objetivos de Aprendizaje Section -->
      <div class="learning-objectives mt-4">
        <h3>Objetivos de Aprendizaje</h3>
        <div *ngIf="learningObjectives.length === 0" class="text-muted">
          <p><i>Cargando objetivos...</i></p>
        </div>
        <ul *ngIf="learningObjectives.length > 0">
          <li *ngFor="let objective of learningObjectives">{{ objective }}</li>
        </ul>
      </div>

      <!-- Dirigido a Section -->
      <div class="target-audience mt-4">
        <h3>¿A quién va dirigido?</h3>
        <div *ngIf="targetAudience.length === 0" class="text-muted">
          <p><i>Cargando información...</i></p>
        </div>
        <ul *ngIf="targetAudience.length > 0">
          <li *ngFor="let target of targetAudience">{{ target }}</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .course-info-details {
      font-family: 'Montserrat', sans-serif;
    }
    
    h3 {
      font-weight: 700;
      color: #0066b3;
      margin-bottom: 1rem;
      font-size: 1.3rem;
    }
    
    ul {
      padding-left: 1.2rem;
      margin-bottom: 1.5rem;
    }
    
    li {
      margin-bottom: 0.7rem;
      color: #333333;
      line-height: 1.5;
      position: relative;
    }
    
    li::before {
      content: "•";
      color: #0066b3;
      font-weight: bold;
      display: inline-block;
      width: 1em;
      margin-left: -1em;
    }
  `]
})
export class CourseInfoDetailsComponent implements OnInit {
  @Input() course!: Course;
  @Input() objectives?: string[];
  @Input() audience?: string[];
  
  learningObjectives: string[] = [];
  targetAudience: string[] = [];

  ngOnInit(): void {
    this.initializeData();
  }

  private initializeData(): void {
    // Log to check what we're working with
   // console.log('Initializing with course:', this.course?.title);
   // console.log('Objectives provided directly:', this.objectives);
    //console.log('Audience provided directly:', this.audience);
    
    // Set default values first
    this.setDefaultValues();
    
    // If course has description, try to extract content first
    if (this.course && this.course.description) {
      this.tryExtractFromDescription();
    }
    
    // If objectives are provided directly, use those (highest priority)
    if (this.objectives && this.objectives.length > 0) {
      this.learningObjectives = this.objectives;
    }

    // If audience is provided directly, use that (highest priority)
    if (this.audience && this.audience.length > 0) {
      this.targetAudience = this.audience;
    }
  }
  
  private setDefaultValues(): void {
    // Set default values based on course type if possible
    if (this.course?.isoStandards?.includes('NOM-027-STPS-2008') || 
        (this.course?.title && this.course.title.includes('NOM-027'))) {
      
      // Default values for NOM-027 courses
      this.learningObjectives = [
        'Comprender los principios y requisitos de la NOM-027-STPS-2008 relacionados con la seguridad en actividades de corte y soldadura.',
        'Identificar y evaluar riesgos asociados al corte y soldadura en el entorno laboral.',
        'Implementar sistemas de protección y dispositivos de seguridad adecuados para prevenir accidentes.',
        'Desarrollar y aplicar programas específicos de seguridad e higiene para las actividades de corte y soldadura.',
        'Fomentar una cultura de seguridad y cumplimiento normativo dentro de la organización.'
      ];
      
      this.targetAudience = [
        'Supervisores y jefes de área.',
        'Personal de mantenimiento y operación de maquinaria.',
        'Responsables de seguridad e higiene industrial.',
        'Integrantes de comisiones de seguridad y salud en el trabajo.',
        'Cualquier profesional involucrado en actividades de corte y soldadura en entornos industriales.'
      ];
    } else {
      // Generic default values for other courses
      this.learningObjectives = [
        'Comprender los fundamentos y normativas aplicables.',
        'Identificar y evaluar riesgos en el entorno de trabajo.',
        'Implementar medidas preventivas y de protección adecuadas.',
        'Desarrollar programas específicos de seguridad e higiene.',
        'Fomentar una cultura de seguridad y cumplimiento normativo.'
      ];
      
      this.targetAudience = [
        'Profesionales del área de seguridad industrial.',
        'Responsables de sistemas de gestión.',
        'Supervisores y jefes de área.',
        'Personal de operación y mantenimiento.',
        'Consultores y asesores en normatividad.'
      ];
    }
  }

  private tryExtractFromDescription(): void {
    // Enhanced implementation to handle various formats in the course description
    const description = this.course.description;
   // console.log('Full description:', description);
    
    // Look for Objetivos/Objectives section with various emojis and formats
    const objectivesRegex = /(🎯\s*Objetivos|Objetivos de Aprendizaje|Al finalizar este curso)[^]*?(?=👥|¿A quién va dirigido|\n\n|$)/i;
    const objectivesMatch = description.match(objectivesRegex);
    
    // Look for Target Audience section with various formats
    const audienceRegex = /(👥\s*¿A quién va dirigido\?|A quién va dirigido|Dirigido a)[^]*?(?=📌|Requisitos|\n\n|$)/i;
    const audienceMatch = description.match(audienceRegex);
    
    if (objectivesMatch && objectivesMatch[0]) {
      console.log('Found objectives section:', objectivesMatch[0]);
      const extractedObjectives = this.extractListItems(objectivesMatch[0]);
      if (extractedObjectives.length > 0) {
        this.learningObjectives = extractedObjectives;
      }
    }
    
    if (audienceMatch && audienceMatch[0]) {
      console.log('Found audience section:', audienceMatch[0]);
      const extractedAudience = this.extractListItems(audienceMatch[0]);
      if (extractedAudience.length > 0) {
        this.targetAudience = extractedAudience;
      }
    }
  }

  private extractListItems(text: string): string[] {
    console.log('about to extract list items from text:', text);
    const items: string[] = [];
    
    // Special case for the format in your console logs
    // This pattern specifically targets the format in your logs where items are on separate lines
    // without bullet points but starting with capital letters
    if (text.includes('Al finalizar este curso') || text.includes('¿A quién va dirigido?')) {
      // Remove headers and split by new lines
      const cleanedText = text
        .replace(/🎯\s*Objetivos de Aprendizaje/i, '')
        .replace(/Al finalizar este curso, los participantes serán capaces de:/i, '')
        .replace(/👥\s*¿A quién va dirigido\?/i, '')
        .replace(/📌\s*Requisitos para participar/i, '');
      
      // Split by new lines and process each line
      const lines = cleanedText.split('\n')
        .map(line => line.trim())
        .filter(line => 
          line.length > 10 && // Reasonably long line
          /^[A-Z]/.test(line) && // Starts with capital letter
          !line.includes('Objetivos') && // Not a header
          !line.includes('finalizar') && 
          !line.includes('quién') &&
          !line.includes('Requisitos')
        );
      
      // Add these items directly
      items.push(...lines);
      
      // If we found items with this method, return them
      if (items.length > 0) {
        console.log('Extracted items using special format logic:', items);
        return items;
      }
    }
    
    // 1. Try to extract lines that start with bullet points, emojis, or numbers
    const bulletPointRegex = /(?:^|\n)[\s]*(?:•|-|\*|👉|➡️|✅|\d+\.)\s*([^\n]+)/g;
    let match;
    while ((match = bulletPointRegex.exec(text)) !== null) {
      if (match[1] && match[1].trim().length > 0) {
        items.push(match[1].trim());
      }
    }
    
    // 2. If no items found with bullet points, try to extract plain lines
    if (items.length === 0) {
      // Split by newlines and filter out header lines, short lines, and empty lines
      const lines = text.split('\n')
        .map(line => line.trim())
        .filter(line => 
          line.length > 10 && 
          !line.includes('Objetivos') &&
          !line.includes('Aprendizaje') &&
          !line.includes('Al finalizar') &&
          !line.includes('dirigido') &&
          !line.includes('capaces de') &&
          !line.includes('Requisitos') &&
          line !== ''
        );
      
      lines.forEach(line => {
        // If the line has reasonable length and starts with a capital letter
        if (line.length > 15 && /^[A-Z]/.test(line)) {
          items.push(line);
        }
      });
    }
    
    // 3. If still no items, extract sentences from paragraphs
    if (items.length === 0) {
      // Split paragraphs by periods and filter
      const sentences = text.split('.')
        .map(sentence => sentence.trim())
        .filter(sentence => 
          sentence.length > 15 && 
          !sentence.includes('Objetivos') &&
          !sentence.includes('Aprendizaje') &&
          !sentence.includes('dirigido') &&
          !sentence.includes('Requisitos') &&
          sentence !== ''
        );
      
      sentences.forEach(sentence => {
        if (sentence.length > 0) {
          items.push(sentence + '.');
        }
      });
    }
    
    console.log('Extracted items:', items);
    return items;
  }
}