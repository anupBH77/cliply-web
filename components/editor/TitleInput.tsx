import React, { useRef, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface TitleInputProps {
  title: string;
  onChange: (title: string) => void;
  readOnly?: boolean;
}

export default function TitleInput({ title, onChange, readOnly = false }: TitleInputProps) {
  return (
    <TextareaAutosize
      value={title}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Untitled"
      readOnly={readOnly}
      className="w-full min-h-[56px] resize-none text-4xl font-bold bg-transparent outline-none placeholder:text-gray-300 dark:placeholder:text-gray-700 text-gray-900 dark:text-gray-100 overflow-hidden"
    />
  );
}
