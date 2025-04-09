"use client";

import React, { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";

type CoverLetterPreviewProps = {
  content: string;
};

const CoverLetterPreview = ({ content }:CoverLetterPreviewProps) => {
  const { user } = useUser();
  const [coverLetterContent, setCoverLetterContent] = useState<string>("");

  useEffect(() => {

    if (content) {
      const formattedContent = content
        .replace(/\[Your Name\]/g, user?.fullName || '[Your Name]')
        .replace(/\[Your Email Address\]/g, user?.emailAddresses?.[0]?.emailAddress || '[Your Email Address]').replace(/\[Date\]/g,format(new Date().toISOString().split('T')[0],'dd/MM/yyyy')).replace(/\. /g, '.\n');
      
      setCoverLetterContent(formattedContent);

    }
  }, [content]);

  return (
    <div className="py-4">
      <MDEditor
        value={coverLetterContent}
        onChange={(value) => setCoverLetterContent(value || "")}
        preview="edit"
        height={700}
      />
    
    </div>
  );
};

export default CoverLetterPreview;
