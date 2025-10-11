import React from "react";
import { CloudDownload } from "lucide-react";

const CloudIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <CloudDownload
      className={className || "mx-auto h-12 w-auto text-primary"}
      strokeWidth={1.5}
    />
  );
};

export default CloudIcon;
