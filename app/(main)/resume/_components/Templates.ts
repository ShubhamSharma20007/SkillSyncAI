import { TemplatesProps } from "@/interface/templatestype";
import TurndownService from "turndown";

type contactInfoProps = {
  email: string;
  mobile?: string;
  twitter?: string;
  linkedin?: string;
  name?: string;
};

const turndownService = new TurndownService();

export class Templates {
  formValues: any;

  constructor(formValues: TemplatesProps) {
    this.formValues = formValues;
  }


  private mapExperienceToHTML(
    items: { title: string; organization: string; startDate: string; endDate?: string; description: string; isCurrent: boolean }[]
  ): string {
    return items
      .map(
        (item) => `
        <div class="experience-item">
          <div class="experience-header">
            <strong>${item.title}</strong> at ${item.organization}
          </div>
          <div class="date-range">${item.startDate} - ${item.isCurrent ? "Present" : item.endDate}</div>
          <div class="description">${item.description.replace(/\n/g, "<br/>")}</div>
        </div>
      `
      )
      .join("");
  }

  private mapEducationToHTML(
    items: { title: string; organization: string; startDate: string; endDate?: string; description: string; isCurrent: boolean }[]
  ): string {
    return items
      .map(
        (item) => `
        <div class="education-item">
          <div class="education-header">
            <strong>${item.title}</strong> - ${item.organization}
          </div>
          <div class="date-range">${item.startDate} - ${item.isCurrent ? "Present" : item.endDate}</div>
          <div class="description">${item.description.replace(/\n/g, "<br/>")}</div>
        </div>
      `
      )
      .join("");
  }

  private mapProjectsToHTML(
    items: { title: string; organization: string; startDate: string; endDate?: string; description: string; isCurrent: boolean }[]
  ): string {
    return items
      .map(
        (item) => `
        <div class="project-item">
          <div class="project-header">
            <strong>${item.title}</strong> - ${item.organization}
          </div>
          <div class="date-range">${item.startDate} - ${item.isCurrent ? "Present" : item.endDate}</div>
          <div class="description">${item.description.replace(/\n/g, "<br/>")}</div>
        </div>
      `
      )
      .join("");
  }


  public firstTemplate() {
    const { contactInfo, summary, skills, experience, education, projects } = this.formValues;
    const html = `
      <div class="resume-template-1">
        <header>
          <h1>${contactInfo.name}</h1>
          <div class="contact-info">
            <span>${contactInfo.email}</span> | 
            <span>${contactInfo.mobile || ""}</span> | 
            <span>${contactInfo.linkedin || ""}</span>
          </div>
        </header>
        
        <section class="summary-section">
          <h2>Professional Summary</h2>
          <div class="divider"></div>
          <p>${summary}</p>
        </section>
        
        <section class="skills-section">
          <h2>Skills</h2>
          <div class="divider"></div>
          <p>${skills}</p>
        </section>
        
        ${experience && experience.length > 0 ? `
        <section class="experience-section">
          <h2>Professional Experience</h2>
          <div class="divider"></div>
          ${this.mapExperienceToHTML(experience)}
        </section>
        ` : ""}
        
        ${education && education.length > 0 ? `
        <section class="education-section">
          <h2>Education</h2>
          <div class="divider"></div>
          ${this.mapEducationToHTML(education)}
        </section>
        ` : ""}
        
        ${projects && projects.length > 0 ? `
        <section class="projects-section">
          <h2>Projects</h2>
          <div class="divider"></div>
          ${this.mapProjectsToHTML(projects)}
        </section>
        ` : ""}
      </div>
    `;
    return turndownService.turndown(html);
  }

  // Template 2: Modern Two-Column (Header with two columns beneath)
  public secondTemplate() {
    const { contactInfo, summary, skills, experience, education, projects } = this.formValues;
    const html = `
      <div class="resume-template-2">
        <header class="header-section">
          <h1>${contactInfo.name}</h1>
          <p class="headline-summary">${summary}</p>
          <div class="contact-bar">
            <span><strong>Email:</strong> ${contactInfo.email}</span> • 
            <span><strong>Phone:</strong> ${contactInfo.mobile || ""}</span> • 
            <span><strong>LinkedIn:</strong> ${contactInfo.linkedin || ""}</span>
          </div>
        </header>
        
        <div class="main-content">
          <div class="left-column">
            <section class="skills-section">
              <h2>Core Competencies</h2>
              <p>${skills}</p>
            </section>
            
            ${education && education.length > 0 ? `
            <section class="education-section">
              <h2>Education</h2>
              ${this.mapEducationToHTML(education)}
            </section>
            ` : ""}
          </div>
          
          <div class="right-column">
            ${experience && experience.length > 0 ? `
            <section class="experience-section">
              <h2>Professional Experience</h2>
              ${this.mapExperienceToHTML(experience)}
            </section>
            ` : ""}
            
            ${projects && projects.length > 0 ? `
            <section class="projects-section">
              <h2>Notable Projects</h2>
              ${this.mapProjectsToHTML(projects)}
            </section>
            ` : ""}
          </div>
        </div>
      </div>
    `;
    return turndownService.turndown(html);
  }


  public thirdTemplate() {
    const { contactInfo, summary, skills, experience, education, projects } = this.formValues;
    const html = `
      <div class="resume-template-3">
        <div class="sidebar">
          <div class="profile-section">
            <h1>${contactInfo.name}</h1>
          </div>
          
          <div class="contact-section">
            <h3>Contact Information</h3>
            <ul>
              <li>📧 ${contactInfo.email}</li>
              <li>📱 ${contactInfo.mobile || ""}</li>
              <li>🔗 ${contactInfo.linkedin || ""}</li>
            </ul>
          </div>
          
          <div class="skills-section">
            <h3>Skills & Expertise</h3>
            <p>${skills}</p>
          </div>
        </div>
        
        <div class="main-content">
          <section class="summary-section">
            <h2>About Me</h2>
            <p>${summary}</p>
          </section>
          
          ${experience && experience.length > 0 ? `
          <section class="experience-section">
            <h2>Professional Journey</h2>
            ${this.mapExperienceToHTML(experience)}
          </section>
          ` : ""}
          
          ${education && education.length > 0 ? `
          <section class="education-section">
            <h2>Academic Background</h2>
            ${this.mapEducationToHTML(education)}
          </section>
          ` : ""}
          
          ${projects && projects.length > 0 ? `
          <section class="projects-section">
            <h2>Significant Projects</h2>
            ${this.mapProjectsToHTML(projects)}
          </section>
          ` : ""}
        </div>
      </div>
    `;
    return turndownService.turndown(html);
  }


  public fourthTemplate() {
    const { contactInfo, summary, skills, experience, education, projects } = this.formValues;
    const html = `
      <div class="resume-template-4">
        <header>
          <div class="name-title">
            <h1>${contactInfo.name}</h1>
          </div>
          <div class="contact-grid">
            <div>${contactInfo.email}</div>
            <div>${contactInfo.mobile || ""}</div>
            <div>${contactInfo.linkedin || ""}</div>
          </div>
        </header>
        
        <section class="executive-summary">
          <h2>Executive Profile</h2>
          <p>${summary}</p>
        </section>
        
        <section class="expertise-section">
          <h2>Areas of Expertise</h2>
          <div class="skills-container">
            <p>${skills}</p>
          </div>
        </section>
        
        ${experience && experience.length > 0 ? `
        <section class="career-section">
          <h2>Career Achievements</h2>
          ${this.mapExperienceToHTML(experience)}
        </section>
        ` : ""}
        
        <div class="bottom-sections">
          ${education && education.length > 0 ? `
          <section class="education-section">
            <h2>Education</h2>
            ${this.mapEducationToHTML(education)}
          </section>
          ` : ""}
          
          ${projects && projects.length > 0 ? `
          <section class="projects-section">
            <h2>Key Projects</h2>
            ${this.mapProjectsToHTML(projects)}
          </section>
          ` : ""}
        </div>
      </div>
    `;
    return turndownService.turndown(html);
  }


  public fifthTemplate() {
    const { contactInfo, summary, skills, experience, education, projects } = this.formValues;
    const html = `
      <div class="resume-template-5">
        <header class="creative-header">
          <div class="name-container">
            <h1>${contactInfo.name}</h1>
          </div>
          <div class="tagline">
            <p>${summary}</p>
          </div>
          <div class="contact-strip">
            ${contactInfo.email} • ${contactInfo.mobile || ""} • ${contactInfo.linkedin || ""}
          </div>
        </header>
        
        <div class="main-body">
          <section class="skills-showcase">
            <h2>Technical Proficiencies</h2>
            <div class="skills-content">
              <p>${skills}</p>
            </div>
          </section>
          
          ${experience && experience.length > 0 ? `
          <section class="experience-timeline">
            <h2>Professional Timeline</h2>
            ${this.mapExperienceToHTML(experience)}
          </section>
          ` : ""}
          
          <div class="bottom-grid">
            ${education && education.length > 0 ? `
            <section class="education-block">
              <h2>Educational Foundation</h2>
              ${this.mapEducationToHTML(education)}
            </section>
            ` : ""}
            
            ${projects && projects.length > 0 ? `
            <section class="projects-gallery">
              <h2>Project Portfolio</h2>
              ${this.mapProjectsToHTML(projects)}
            </section>
            ` : ""}
          </div>
        </div>
      </div>
    `;
    return turndownService.turndown(html);
  }
}