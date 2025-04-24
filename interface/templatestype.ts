export type TemplatesProps = {
      summary: string;
      skills: string;
      contactInfo: {
        email: string;
        mobile?: string;
        twitter?: string;
        linkedin?: string;
        name?:string;
      };
      experience: {
        title: string;
        organization: string; // instead of company
        startDate: string;
        description: string;
        endDate?: string;
        isCurrent?: boolean;
      }[];
      education: {
        school: string;
        degree: string;
        startDate: string;
        endDate?: string;
      }[];
      projects: {
        name: string;
        description: string;
        technologies?: string;
      }[];
    };
  