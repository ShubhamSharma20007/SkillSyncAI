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

  private mapArrayToHTML(
    title: string,
    items: { title: string; organization: string; startDate: string; endDate?: string; description: string; isCurrent: boolean }[]
  ): string {
    return `
      <h2>${title}</h2>
      <ul>
        ${items
        .map(
          (item) => `
          <li>
            <strong>${item.title}</strong> at ${item.organization} (${item.startDate} - ${item.isCurrent ? "Present" : item.endDate
            })<br/>
            ${item.description.replace(/\n/g, "<br/>")}
          </li>
        `
        )
        .join("")}
      </ul>
    `;
  }

  public firstTemplate() {
    const { contactInfo, summary, skills, experience, education, projects } = this.formValues;
    const html = `
      <h1>${contactInfo.name}</h1>
      <p><strong>Email:</strong> ${contactInfo.email}</p>
      <p><strong>Mobile:</strong> ${contactInfo.mobile}</p>
      <p><strong>LinkedIn:</strong> ${contactInfo.linkedin}</p>
      <h2>Summary</h2>
      <p>${summary}</p>
      <h2>Skills</h2>
      <p>${skills}</p>
        ${experience.length > 0 ? this.mapArrayToHTML("Experience", experience) : ""}
${education.length > 0 ? this.mapArrayToHTML("Education", education) : ""}
${projects.length > 0 ? this.mapArrayToHTML("Projects", projects) : ""}
    `;
    return turndownService.turndown(html);
  }

  public secondTemplate() {
    const { contactInfo, summary, skills, experience, education, projects } = this.formValues;
    const html = `
      <div style="display: flex; justify-content: space-between;">
        <div>
          <h1>${contactInfo.name}</h1>
          <p>${summary}</p>
        </div>
        <div>
          <p><strong>Email:</strong> ${contactInfo.email}</p>
          <p><strong>Mobile:</strong> ${contactInfo.mobile}</p>
          <p><strong>LinkedIn:</strong> ${contactInfo.linkedin}</p>
        </div>
      </div>
      <h2>Skills</h2>
      <p>${skills}</p>
     ${experience.length > 0 ? this.mapArrayToHTML("Experience", experience) : ""}
${education.length > 0 ? this.mapArrayToHTML("Education", education) : ""}
${projects.length > 0 ? this.mapArrayToHTML("Projects", projects) : ""}
    `;
    return turndownService.turndown(html);
  }

  public thirdTemplate() {
    const { contactInfo, summary, skills, experience, education, projects } = this.formValues;
    const html = `
      <header style="background-color: #e5f4ff; padding: 20px;">
        <h1>${contactInfo.name}</h1>
        <p>${summary}</p>
      </header>
      <section>
        <h2>📩 Contact</h2>
        <p>Email: ${contactInfo.email} | Mobile: ${contactInfo.mobile} | LinkedIn: ${contactInfo.linkedin}</p>
      </section>
      <section>
        <h2>🚀 Skills</h2>
        <p>${skills}</p>
      </section>
      <section>
        ${experience.length > 0 ? this.mapArrayToHTML("👔 Experience", experience) : ""}
        ${education.length > 0 ? this.mapArrayToHTML("🎓 Education", education) : ""}
        ${projects.length > 0 ? this.mapArrayToHTML("💡 Projects", projects) : ""}
      </section>
    `;
    return turndownService.turndown(html);
  }

  public fourthTemplate() {
    const { contactInfo, summary, skills, experience, education, projects } = this.formValues;
    const html = `
      <h1 style="color: navy;">${contactInfo.name}</h1>
      <p><em>${summary}</em></p>
      <h3>Contact</h3>
      <ul>
        <li>Email: ${contactInfo.email}</li>
        <li>Mobile: ${contactInfo.mobile}</li>
        <li>LinkedIn: ${contactInfo.linkedin}</li>
      </ul>
      <h3>Skills</h3>
      <p>${skills}</p>
  ${experience.length > 0 ? this.mapArrayToHTML("Experience", experience) : ""}
${education.length > 0 ? this.mapArrayToHTML("Education", education) : ""}
${projects.length > 0 ? this.mapArrayToHTML("Projects", projects) : ""}
    `;
    return turndownService.turndown(html);
  }
}
