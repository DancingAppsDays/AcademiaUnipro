// src/app/component/shared/postponement-policy/postponement-policy.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-postponement-policy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="policy-container" @fadeIn>
      <div class="policy-card">
        <div class="policy-header">
          <div class="policy-icon">
            <i class="bi bi-info-circle"></i>
          </div>
          <h3>Política de Aplazamiento de Cursos</h3>
        </div>
        
        <div class="policy-content">
          <p class="main-description">Para garantizar la calidad de nuestros cursos y una experiencia de aprendizaje óptima, aplicamos la siguiente política:</p>
          
          <div class="policy-points">
            <div class="policy-point">
              <div class="point-number">1</div>
              <div class="point-content">
                <strong>Mínimo requerido</strong>
                <p>Todos nuestros cursos requieren un mínimo de {{ minimumRequired }} participantes para realizarse en la fecha programada.</p>
              </div>
            </div>
            
            <div class="policy-point">
              <div class="point-number">2</div>
              <div class="point-content">
                <strong>Evaluación previa</strong>
                <p>{{ deadlineDays }} días antes de la fecha del curso, evaluamos el número de inscritos.</p>
              </div>
            </div>
            
            <div class="policy-point">
              <div class="point-number">3</div>
              <div class="point-content">
                <strong>Reprogramación</strong>
                <p>Si no se alcanza el mínimo requerido, el curso será reprogramado para la siguiente fecha disponible.</p>
              </div>
            </div>
            
            <div class="policy-point">
              <div class="point-number">4</div>
              <div class="point-content">
                <strong>Notificación</strong>
                <p>Los participantes inscritos serán notificados por email y teléfono sobre la reprogramación.</p>
              </div>
            </div>
            
            <div class="policy-point">
              <div class="point-number">5</div>
              <div class="point-content">
                <strong>Opciones para el cliente</strong>
                <p>Los participantes podrán elegir entre: aceptar la nueva fecha, transferir a otro curso, o solicitar un reembolso completo.</p>
              </div>
            </div>
          </div>
          
          <div class="policy-note">
            <p><strong>Nota importante:</strong> Esta política tiene como objetivo asegurar una experiencia de aprendizaje enriquecedora mediante una participación adecuada para dinámicas de grupo, preguntas y discusiones.</p>
          </div>
        </div>
        
        <div class="policy-footer" *ngIf="showContactInfo">
          <h4>¿Preguntas sobre esta política?</h4>
          <p>Contáctenos al (55) 1234-5678 o por email a info&#264;academia-uniprotec.com</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .policy-container {
      font-family: 'Montserrat', sans-serif;
      padding: 1rem 0;
    }
    
    .policy-card {
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .policy-header {
      background-color: #0066b3;
      color: white;
      padding: 1.5rem;
      display: flex;
      align-items: center;
    }
    
    .policy-icon {
      font-size: 2rem;
      margin-right: 1rem;
    }
    
    .policy-header h3 {
      margin: 0;
      font-weight: 700;
      font-size: 1.5rem;
    }
    
    .policy-content {
      padding: 1.5rem;
    }
    
    .main-description {
      font-size: 1.1rem;
      margin-bottom: 1.5rem;
      line-height: 1.6;
      color: #333;
    }
    
    .policy-points {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
      margin-bottom: 1.5rem;
    }
    
    .policy-point {
      display: flex;
      align-items: flex-start;
    }
    
    .point-number {
      background-color: #0066b3;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      margin-right: 1rem;
      flex-shrink: 0;
    }
    
    .point-content {
      strong {
        display: block;
        margin-bottom: 0.3rem;
        color: #0066b3;
        font-size: 1.1rem;
      }
      
      p {
        margin: 0;
        color: #333;
        line-height: 1.5;
      }
    }
    
    .policy-note {
      background-color: rgba(0, 102, 179, 0.1);
      padding: 1.2rem;
      border-radius: 8px;
      margin-top: 1.5rem;
      
      p {
        margin: 0;
        color: #333;
      }
    }
    
    .policy-footer {
      background-color: #f5f5f5;
      padding: 1.5rem;
      text-align: center;
      border-top: 1px solid #e0e0e0;
      
      h4 {
        margin: 0 0 0.5rem 0;
        color: #333;
        font-weight: 700;
        font-size: 1.1rem;
      }
      
      p {
        margin: 0;
        color: #666;
      }
    }
    
    @media (max-width: 767px) {
      .policy-header {
        flex-direction: column;
        text-align: center;
      }
      
      .policy-icon {
        margin-right: 0;
        margin-bottom: 1rem;
      }
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class PostponementPolicyComponent {
  @Input() minimumRequired: number = 6;
  @Input() deadlineDays: number = 2;
  @Input() showContactInfo: boolean = true;
}