// src/app/component/course/course-faq/course-faq.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-course-faq',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="faq-section">
      <h2 class="section-title">Preguntas Frecuentes</h2>
      
      <div class="faq-accordion">
        <div class="faq-item" *ngFor="let item of faqItems; let i = index">
          <div 
            class="faq-question" 
            [class.active]="item.isOpen" 
            (click)="toggleFaq(i)"
          >
            <span>{{ item.question }}</span>
            <i class="bi" [ngClass]="item.isOpen ? 'bi-dash' : 'bi-plus'"></i>
          </div>
          <div 
            class="faq-answer" 
            [@expandCollapse]="item.isOpen ? 'expanded' : 'collapsed'"
          >
            <div class="answer-content" [innerHTML]="item.answer"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .faq-section {
      margin: 2rem 0;
      font-family: 'Montserrat', sans-serif;
    }
    
    .section-title {
      font-weight: 700;
      color: #0066b3;
      margin-bottom: 1.5rem;
      font-size: 1.8rem;
    }
    
    .faq-accordion {
      border-radius: 8px;
      overflow: hidden;
    }
    
    .faq-item {
      margin-bottom: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .faq-question {
      padding: 1.25rem;
      background-color: #f8f9fa;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 600;
      color: #333;
    }
    
    .faq-question:hover {
      background-color: #f0f0f0;
    }
    
    .faq-question.active {
      background-color: #0066b3;
      color: white;
    }
    
    .faq-question i {
      font-size: 1.25rem;
    }
    
    .faq-answer {
      background-color: white;
      overflow: hidden;
    }
    
    .answer-content {
      padding: 1.25rem;
      color: #555;
      line-height: 1.6;
    }
    
    .answer-content p {
      margin-bottom: 1rem;
    }
    
    .answer-content p:last-child {
      margin-bottom: 0;
    }
    
    .answer-content ul {
      padding-left: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .answer-content li {
      margin-bottom: 0.5rem;
    }
  `],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0',
        padding: '0',
        opacity: '0'
      })),
      state('expanded', style({
        height: '*',
        opacity: '1'
      })),
      transition('collapsed <=> expanded', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class CourseFaqComponent {
  @Input() courseType: string = 'general';
  
  faqItems = [
    {
      question: '¿Necesito conocimientos previos para tomar este curso?',
      answer: `<p>No se requieren conocimientos previos específicos para tomar este curso. Está diseñado para participantes con diferentes niveles de experiencia, desde principiantes hasta profesionales que desean actualizar sus conocimientos.</p>
      <p>Sin embargo, es recomendable tener familiaridad básica con entornos industriales y contar con experiencia laboral en el sector. Nuestros instructores adaptan el contenido según el nivel del grupo para asegurar que todos los participantes obtengan el máximo beneficio.</p>`,
      isOpen: false
    },
    {
      question: '¿Qué sucede si no puedo asistir a alguna sesión?',
      answer: `<p>Entendemos que pueden surgir imprevistos. En caso de no poder asistir a una sesión:</p>
      <ul>
        <li>Las grabaciones de las sesiones estarán disponibles en nuestra plataforma por 30 días después de finalizado el curso (aplica solo para cursos virtuales)</li>
        <li>Puede reprogramar su participación para la siguiente fecha disponible sin costo adicional (con aviso de al menos 48 horas)</li>
        <li>Para obtener la certificación, se requiere una asistencia mínima del 80% de las sesiones</li>
      </ul>
      <p>Recomendamos comunicarse con nuestro equipo de soporte lo antes posible en caso de no poder asistir.</p>`,
      isOpen: false
    },
    {
      question: '¿La certificación tiene validez oficial?',
      answer: `<p>Sí, todos nuestros cursos proporcionan certificaciones con validez oficial. Específicamente:</p>
      <ul>
        <li>Nuestros certificados cumplen con los requisitos de la Secretaría del Trabajo y Previsión Social (STPS)</li>
        <li>Son reconocidos por las autoridades regulatorias del sector industrial mexicano</li>
        <li>Están avalados por instructores certificados con registro ante la STPS (Formato DC-3)</li>
        <li>Son válidos para auditorías y verificaciones oficiales en su empresa</li>
      </ul>
      <p>Cada certificado incluye un código de verificación que permite confirmar su autenticidad en nuestra base de datos oficial.</p>`,
      isOpen: false
    },
    {
      question: '¿Cuáles son las formas de pago disponibles?',
      answer: `<p>Ofrecemos diversas opciones de pago para adaptarnos a sus necesidades:</p>
      <ul>
        <li>Tarjetas de crédito y débito (Visa, Mastercard, American Express)</li>
        <li>Transferencia bancaria</li>
        <li>Depósito en efectivo</li>
        <li>Pago en mensualidades con tarjetas participantes</li>
        <li>Facturación empresarial (para inscripciones corporativas)</li>
      </ul>
      <p>Para inscripciones corporativas o grupos de más de 3 personas, ofrecemos descuentos especiales y condiciones de pago flexibles. Contáctenos para más información.</p>`,
      isOpen: false
    },
    {
      question: '¿Qué incluye el material del curso?',
      answer: `<p>Al inscribirse en nuestros cursos, usted recibirá:</p>
      <ul>
        <li>Manual completo del participante en formato digital</li>
        <li>Presentaciones y materiales didácticos utilizados durante las sesiones</li>
        <li>Formatos y plantillas aplicables a su entorno laboral</li>
        <li>Referencias normativas actualizadas</li>
        <li>Acceso a nuestra biblioteca digital especializada por 3 meses</li>
        <li>Certificado oficial al completar satisfactoriamente el curso</li>
      </ul>
      <p>En cursos presenciales, también proporcionamos materiales impresos y refrigerios durante las sesiones.</p>`,
      isOpen: false
    },
    {
      question: '¿Ofrecen cursos personalizados para empresas?',
      answer: `<p>Sí, desarrollamos programas de capacitación a la medida para empresas según sus necesidades específicas:</p>
      <ul>
        <li>Adaptamos el contenido a los procesos y equipos de su organización</li>
        <li>Ofrecemos la opción de impartir los cursos en sus instalaciones</li>
        <li>Flexibilidad de horarios según la disponibilidad de su personal</li>
        <li>Evaluación y seguimiento personalizado de los participantes</li>
        <li>Consultoría adicional para implementación de lo aprendido</li>
      </ul>
      <p>Contáctenos para una evaluación gratuita de sus necesidades de capacitación y una propuesta personalizada.</p>`,
      isOpen: false
    }
  ];
  
  toggleFaq(index: number): void {
    this.faqItems[index].isOpen = !this.faqItems[index].isOpen;
  }
  
  ngOnInit(): void {
    // You could customize FAQ items based on course type if needed
    if (this.courseType === 'normativa') {
      // Add specific questions for regulatory courses
    } else if (this.courseType === 'seguridad') {
      // Add specific questions for safety courses
    }
  }
}