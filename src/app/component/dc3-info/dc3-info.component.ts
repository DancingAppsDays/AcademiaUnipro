// src/app/component/dc3-info/dc3-info.component.ts
import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dc3-info',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dc3-info-container">
      <div class="container py-5">
        <!-- Header Section -->
        <div class="page-header text-center mb-5">
          <div class="header-badge">INFORMACIÓN OFICIAL</div>
          <h1 class="page-title">Condiciones de Emisión de Constancia DC-3</h1>
          <p class="page-subtitle">Formato STPS - Constancia de Competencias o Habilidades Laborales</p>
        </div>

        <!-- Legal Foundation -->
        <div class="info-section mb-5">
          <div class="section-header">
            <h2><span class="section-number">1.</span> Fundamento Legal</h2>
          </div>
          <div class="content-card">
            <p>La Constancia de Competencias o de Habilidades Laborales <strong>(DC-3)</strong> está regulada por el <strong>artículo 153-C de la Ley Federal del Trabajo</strong>, así como por el Acuerdo que establece los lineamientos generales para la capacitación y el adiestramiento en las empresas.</p>
          </div>
        </div>

        <!-- Who Can Issue -->
        <div class="info-section mb-5">
          <div class="section-header">
            <h2><span class="section-number">2.</span> ¿Quién puede emitir una DC-3?</h2>
          </div>
          <div class="content-card">
            <p class="intro-text"><strong>Solo pueden emitir una DC-3:</strong></p>
            
            <div class="option-card mb-3">
              <div class="option-letter">A)</div>
              <div class="option-content">
                <p>El <strong>patrón o representante legal</strong> del centro de trabajo al que pertenece el participante cuando el curso es impartido por un instructor o facilitador interno del centro de trabajo</p>
              </div>
            </div>

            <div class="option-card">
              <div class="option-letter">B)</div>
              <div class="option-content">
                <p>Un <strong>agente capacitador externo registrado ante la STPS</strong>, como en el caso de <strong>Uniprotec</strong> (Registro UNI121210694-0013)</p>
                <div class="note-box mt-3">
                  <i class="bi bi-info-circle"></i>
                  <p>Tanto el <strong>curso</strong> como el <strong>instructor</strong> deben estar registrados formalmente en los programas y plantilla del agente capacitador ante la STPS. En este caso Uniprotec tiene vigente sus programas registrados y su plantilla de instructores registrada</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Who Can Receive -->
        <div class="info-section mb-5">
          <div class="section-header">
            <h2><span class="section-number">3.</span> ¿A quién se le puede emitir una DC-3?</h2>
          </div>
          <div class="content-card">
            <p>La DC-3 <strong>solo puede emitirse a trabajadores subordinados</strong>, es decir, personas que tengan una <strong>relación formal de trabajo</strong> (patrón-empleado) dentro de un centro de trabajo.</p>
            
            <div class="warning-box mt-3">
              <i class="bi bi-exclamation-triangle"></i>
              <p><strong>Queda estrictamente prohibido</strong> emitir DC-3 al público en general sin relación laboral vigente.</p>
            </div>
          </div>
        </div>

        <!-- Required Data -->
        <div class="info-section mb-5">
          <div class="section-header">
            <h2><span class="section-number">4.</span> Datos indispensables para validar una DC-3</h2>
          </div>
          <div class="content-card">
            <p class="intro-text">Para que una DC-3 tenga <strong>validez oficial</strong>, debe contener forzosamente:</p>

            <!-- Worker Data -->
            <div class="data-section mb-4">
              <h3><i class="bi bi-person"></i> Datos del trabajador (participante):</h3>
              <ul class="data-list">
                <li>Nombre completo</li>
                <li>CURP</li>
                <li>Puesto en el centro de trabajo</li>
              </ul>
            </div>

            <!-- Workplace Data -->
            <div class="data-section mb-4">
              <h3><i class="bi bi-building"></i> Datos del centro de trabajo (Patrón del participante):</h3>
              <ul class="data-list">
                <li>Razón social del patrón (sea persona física o moral)</li>
                <li>RFC del patrón (sea persona física o moral)</li>
                <li>Nombre y firma del representante legal (o de la comisión mixta de capacitación, en caso de contar con ella)</li>
              </ul>
              <div class="note-box mt-3">
                <i class="bi bi-info-circle"></i>
                <p>En caso de patrón persona física, el mismo nombre se usa como razón social y como representante legal</p>
              </div>
            </div>

            <!-- Course Data -->
            <div class="data-section mb-4">
              <h3><i class="bi bi-book"></i> Datos del curso (Uniprotec):</h3>
              <ul class="data-list">
                <li>Nombre del curso</li>
                <li>Duración (en horas)</li>
                <li>Fechas de ejecución</li>
                <li>Área temática</li>
              </ul>
            </div>

            <!-- Trainer Data -->
            <div class="data-section">
              <h3><i class="bi bi-award"></i> Datos del capacitador (Uniprotec):</h3>
              <ul class="data-list">
                <li>Nombre del agente capacitador externo: Uniprotec SA de CV</li>
                <li>Número de registro: UNI121210694-0013</li>
                <li>Nombre y firma del instructor (debidamente registrado en la plantilla de Uniprotec)</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Warning Section -->
        <div class="warning-section mb-5">
          <div class="alert-header">
            <i class="bi bi-exclamation-triangle-fill"></i>
            <h2>Advertencia Importante</h2>
            <div class="alert-subtitle">¡No se deje engañar!</div>
          </div>
          <div class="alert-content">
            <p>Las DC-3 <strong>no pueden ser expedidas a personas sin relación laboral formal</strong>. Cualquier DC-3 que no sea expedida y que no contenga la información mencionada en los puntos anteriores no tendrá <strong>ninguna validez oficial.</strong></p>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="cta-section text-center">
          <h3>¿Tienes dudas sobre la emisión de tu DC-3?</h3>
          <p>Nuestro equipo está disponible para orientarte sobre el proceso de emisión de constancias</p>
          <div class="contact-buttons mt-4">
           <a href="https://wa.me/5214424596476" target="_blank" rel="noopener noreferrer" class="btn btn-success me-3">
             <i class="bi bi-whatsapp"></i> WhatsApp: 44 2459 6476
            </a>
           <a href="mailto:ventas@uniprotec.net" class="btn btn-outline-primary">
              <i class="bi bi-envelope"></i> Enviar email
            </a>
          </div>
        </div>

        <!-- Back to FAQ -->
          <div class="navigation-section text-center mt-5">
          <button (click)="goBack()" class="btn btn-secondary">
            <i class="bi bi-arrow-left"></i> Regresar
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dc3-info-container {
      font-family: 'Montserrat', sans-serif;
      background-color: #f8f9fa;
      min-height: 100vh;
    }

    .page-header {
      .header-badge {
        display: inline-block;
        background-color: #0066b3;
        color: white;
        padding: 0.5rem 1.5rem;
        border-radius: 2rem;
        font-weight: 700;
        margin-bottom: 1rem;
        text-transform: uppercase;
        font-size: 0.9rem;
      }

      .page-title {
        font-weight: 700;
        font-size: 2.5rem;
        color: #004c86;
        margin-bottom: 1rem;
        line-height: 1.2;

        @media (max-width: 767px) {
          font-size: 2rem;
        }
      }

      .page-subtitle {
        font-size: 1.2rem;
        color: #666;
        margin-bottom: 0;
      }
    }

    .info-section {
      .section-header {
        margin-bottom: 1.5rem;

        h2 {
          font-weight: 700;
          color: #0066b3;
          font-size: 1.8rem;
          display: flex;
          align-items: center;

          .section-number {
            background-color: #0066b3;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 1rem;
            font-size: 1.2rem;
          }
        }
      }

      .content-card {
        background-color: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        border-left: 4px solid #0066b3;

        .intro-text {
          font-weight: 600;
          color: #333;
          margin-bottom: 1.5rem;
        }

        p {
          line-height: 1.7;
          color: #555;
          margin-bottom: 1rem;
        }
      }
    }

    .option-card {
      display: flex;
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 1.5rem;
      border-left: 4px solid #ffba00;

      .option-letter {
        background-color: #ffba00;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        margin-right: 1rem;
        flex-shrink: 0;
      }

      .option-content {
        flex: 1;

        p {
          margin-bottom: 0;
          line-height: 1.6;
        }
      }
    }

    .note-box {
      background-color: #e3f2fd;
      border-left: 4px solid #2196f3;
      padding: 1rem;
      border-radius: 6px;
      display: flex;
      align-items: flex-start;

      i {
        color: #2196f3;
        margin-right: 0.5rem;
        margin-top: 0.2rem;
        font-size: 1.1rem;
      }

      p {
        margin-bottom: 0;
        color: #1565c0;
      }
    }

    .warning-box {
      background-color: #fff3cd;
      border-left: 4px solid #ff9800;
      padding: 1rem;
      border-radius: 6px;
      display: flex;
      align-items: flex-start;

      i {
        color: #ff9800;
        margin-right: 0.5rem;
        margin-top: 0.2rem;
        font-size: 1.1rem;
      }

      p {
        margin-bottom: 0;
        color: #e65100;
      }
    }

    .data-section {
      h3 {
        color: #0066b3;
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;

        i {
          margin-right: 0.5rem;
          color: #ffba00;
        }
      }

      .data-list {
        list-style: none;
        padding-left: 0;

        li {
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
          color: #555;
          border-bottom: 1px solid #f0f0f0;

          &:before {
            content: "✓";
            color: #28a745;
            font-weight: bold;
            position: absolute;
            left: 0;
          }

          &:last-child {
            border-bottom: none;
          }
        }
      }
    }

    .warning-section {
      background: linear-gradient(135deg, #dc3545, #c82333);
      border-radius: 12px;
      padding: 2rem;
      color: white;
      text-align: center;
      box-shadow: 0 8px 25px rgba(220, 53, 69, 0.3);

      .alert-header {
        margin-bottom: 1.5rem;

        i {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: #fff;
        }

        h2 {
          font-weight: 700;
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
        }

        .alert-subtitle {
          font-size: 1.2rem;
          font-weight: 600;
          opacity: 0.9;
        }
      }

      .alert-content {
        p {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 0;
        }
      }
    }

    .cta-section {
      background-color: white;
      border-radius: 12px;
      padding: 2.5rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

      h3 {
        color: #0066b3;
        font-weight: 700;
        margin-bottom: 1rem;
      }

      p {
        color: #666;
        font-size: 1.1rem;
        margin-bottom: 0;
      }

      .contact-buttons {
        .btn {
          padding: 0.75rem 2rem;
          font-weight: 600;
          border-radius: 25px;

          i {
            margin-right: 0.5rem;
          }
        }

        .btn-primary {
          background-color: #0066b3;
          border-color: #0066b3;

          &:hover {
            background-color: #004c86;
            border-color: #004c86;
          }
        }
      }
    }

    .navigation-section {
      .btn-secondary {
        background-color: #6c757d;
        border-color: #6c757d;
        padding: 0.75rem 2rem;
        border-radius: 25px;
        font-weight: 600;

        i {
          margin-right: 0.5rem;
        }

        &:hover {
          background-color: #5a6268;
          border-color: #545b62;
        }
      }
    }

    // Responsive adjustments
    @media (max-width: 767px) {
      .option-card {
        flex-direction: column;

        .option-letter {
          margin-right: 0;
          margin-bottom: 1rem;
          align-self: flex-start;
        }
      }

      .data-section h3 {
        font-size: 1.1rem;
      }

      .warning-section {
        padding: 1.5rem;

        .alert-header {
          i {
            font-size: 2.5rem;
          }

          h2 {
            font-size: 1.5rem;
          }
        }
      }

      .contact-buttons {
        .btn {
          display: block;
          margin-bottom: 1rem;
          width: 100%;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  `]
})
export class Dc3InfoComponent {
  fromUrl: string | null = null;

  constructor(private router: Router, private location: Location) {
    const nav = this.router.getCurrentNavigation();
    this.fromUrl = nav?.extras.state?.['from'] || null;
  }

  goBack() {
    if (this.fromUrl) {
      this.router.navigateByUrl(this.fromUrl);
    } else {
      //this.location.back();
    }
  }
}