// src/app/component/enhanced-instructor-display/enhanced-instructor-display.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnhancedInstructor } from '../../core/services/instructor.service';

@Component({
  selector: 'app-enhanced-instructor-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="enhanced-instructor-display" *ngIf="instructor">
      <!-- Instructor Header -->
      <div class="instructor-header">
        <div class="row align-items-center">
          <!-- Profile Image (hide if no photo available) -->
          <div class="col-md-3" *ngIf="showPhoto && instructor.photoUrl && !isDefaultPhoto">
            <div class="instructor-image">
              <img [src]="instructor.photoUrl" 
                   [alt]="instructor.name" 
                   class="img-fluid rounded-circle"
                   (error)="onImageError($event)">
            </div>
          </div>
          
          <!-- Instructor Info -->
          <div [class]="showPhoto && instructor.photoUrl && !isDefaultPhoto ? 'col-md-9' : 'col-12'">
            <div class="instructor-info">
              <h3 class="instructor-name">{{ instructor.name }}</h3>
              
              <div class="instructor-titles" *ngIf="instructor.title || instructor.subtitle">
                <div class="instructor-title" *ngIf="instructor.title">
                  {{ instructor.title }}
                </div>
                <div class="instructor-subtitle" *ngIf="instructor.subtitle">
                  {{ instructor.subtitle }}
                </div>
              </div>
              
              <!-- Specialties -->
              <div class="instructor-specialties" *ngIf="instructor.specialties && instructor.specialties.length > 0">
                <span class="specialty-badge" *ngFor="let specialty of instructor.specialties">
                  {{ specialty }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Professional Profile Section -->
      <div class="instructor-content">
        <div class="profile-section" *ngIf="instructor.professionalProfile || instructor.bio">
          <h4 class="section-title">
            <i class="bi bi-person-badge me-2"></i>
            Perfil Profesional
          </h4>
          <div class="profile-content">
            <p *ngFor="let paragraph of getParagraphs(instructor.professionalProfile || instructor.bio)">
              {{ paragraph }}
            </p>
          </div>
        </div>
        
        <!-- Experience Section -->
        <div class="experience-section" *ngIf="instructor.experience && instructor.experience.length > 0">
          <h4 class="section-title">
            <i class="bi bi-briefcase me-2"></i>
            Experiencia Destacada
          </h4>
          <ul class="experience-list">
            <li *ngFor="let exp of instructor.experience" class="experience-item">
              {{ exp }}
            </li>
          </ul>
        </div>
        
        <!-- Certifications Section -->
        <div class="certifications-section" *ngIf="instructor.certifications && instructor.certifications.length > 0">
          <h4 class="section-title">
            <i class="bi bi-award me-2"></i>
            Formación y Certificaciones
          </h4>
          <div class="certifications-grid">
            <div class="certification-item" *ngFor="let cert of instructor.certifications">
              <i class="bi bi-check-circle-fill me-2"></i>
              {{ cert }}
            </div>
          </div>
        </div>
        
        <!-- Areas of Expertise -->
        <div class="expertise-section" *ngIf="instructor.specialties && instructor.specialties.length > 0">
          <h4 class="section-title">
            <i class="bi bi-lightbulb me-2"></i>
            Áreas de Especialización
          </h4>
          <div class="expertise-tags">
            <span class="expertise-tag" *ngFor="let specialty of instructor.specialties">
              {{ specialty }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .enhanced-instructor-display {
      background-color: #f8f9fa;
      border-radius: 12px;
      padding: 2rem;
      margin: 1rem 0;
    }
    
    .instructor-header {
      margin-bottom: 2rem;
    }
    
    .instructor-image {
      text-align: center;
      
      img {
        width: 160px;
        height: 160px;
        object-fit: cover;
        border: 4px solid #ffffff;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }
    }
    
    .instructor-info {
      .instructor-name {
        font-weight: 700;
        font-size: 1.6rem;
        margin-bottom: 0.5rem;
        color: #0066b3;
      }
      
      .instructor-titles {
        margin-bottom: 1rem;
        
        .instructor-title {
          font-weight: 600;
          font-size: 1.1rem;
          color: #004c86;
          margin-bottom: 0.3rem;
        }
        
        .instructor-subtitle {
          font-style: italic;
          color: #666;
          font-size: 0.95rem;
        }
      }
      
      .instructor-specialties {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        
        .specialty-badge {
          background-color: #0066b3;
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }
      }
    }
    
    .instructor-content {
      .section-title {
        font-weight: 600;
        font-size: 1.2rem;
        color: #0066b3;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #e9ecef;
        
        i {
          color: #ffba00;
        }
      }
      
      .profile-section {
        margin-bottom: 2rem;
        
        .profile-content {
          p {
            color: #333;
            line-height: 1.7;
            margin-bottom: 1rem;
            text-align: justify;
          }
        }
      }
      
      .experience-section {
        margin-bottom: 2rem;
        
        .experience-list {
          list-style: none;
          padding: 0;
          
          .experience-item {
            background-color: white;
            padding: 0.8rem 1rem;
            margin-bottom: 0.5rem;
            border-radius: 8px;
            border-left: 4px solid #0066b3;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            
            &:before {
              content: "▶";
              color: #0066b3;
              margin-right: 0.5rem;
              font-weight: bold;
            }
          }
        }
      }
      
      .certifications-section {
        margin-bottom: 2rem;
        
        .certifications-grid {
          display: grid;
          gap: 0.5rem;
          
          .certification-item {
            background-color: white;
            padding: 0.6rem 1rem;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            display: flex;
            align-items: flex-start;
            
            i {
              color: #28a745;
              margin-top: 0.1rem;
              flex-shrink: 0;
            }
            
            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
              transition: all 0.3s ease;
            }
          }
        }
      }
      
      .expertise-section {
        .expertise-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          
          .expertise-tag {
            background: linear-gradient(135deg, #0066b3, #0095db);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 25px;
            font-weight: 500;
            font-size: 0.9rem;
            box-shadow: 0 3px 10px rgba(0, 102, 179, 0.3);
            
            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 5px 15px rgba(0, 102, 179, 0.4);
              transition: all 0.3s ease;
            }
          }
        }
      }
    }
    
    // Responsive adjustments
    @media (max-width: 767px) {
      .enhanced-instructor-display {
        padding: 1.5rem;
      }
      
      .instructor-image {
        margin-bottom: 1.5rem;
        
        img {
          width: 120px;
          height: 120px;
        }
      }
      
      .instructor-info {
        text-align: center;
        
        .instructor-name {
          font-size: 1.3rem;
        }
        
        .instructor-specialties {
          justify-content: center;
        }
      }
      
      .certifications-section .certifications-grid {
        grid-template-columns: 1fr;
      }
    }
    
    @media (min-width: 768px) {
      .certifications-section .certifications-grid {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      }
    }
  `]
})
export class EnhancedInstructorDisplayComponent implements OnInit {
  @Input() instructor: EnhancedInstructor | null = null;
  @Input() showPhoto: boolean = true;
  
  isDefaultPhoto = false;

  ngOnInit(): void {
    this.checkIfDefaultPhoto();
  }

  onImageError(event: any): void {
    // Hide image if it fails to load
    event.target.style.display = 'none';
    this.isDefaultPhoto = true;
  }

  private checkIfDefaultPhoto(): void {
    if (!this.instructor?.photoUrl) {
      this.isDefaultPhoto = true;
      return;
    }
    
    // Check if it's a default/placeholder image
    const defaultImages = [
      'default-instructor.png',
      'default.png',
      'placeholder.jpg',
      'instructor-placeholder'
    ];
    
    this.isDefaultPhoto = defaultImages.some(defaultImg => 
      this.instructor!.photoUrl.includes(defaultImg)
    );
  }

  getParagraphs(text: string): string[] {
    if (!text) return [];
    
    // Split by double newlines or single newlines, filter empty paragraphs
    return text.split(/\n\n|\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
  }
}