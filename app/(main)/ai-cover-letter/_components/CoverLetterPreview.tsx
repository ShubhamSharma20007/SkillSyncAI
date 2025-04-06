"use client";

import React, { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";

type CoverLetterPreviewProps = {
  content: string;
};

const CoverLetterPreview = ({ content }:CoverLetterPreviewProps) => {
  const [coverLetterContent, setCoverLetterContent] = useState<string>("");

  useEffect(() => {
    if (content) {
      setCoverLetterContent(content.replace(/\. /g, '.\n'));
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
