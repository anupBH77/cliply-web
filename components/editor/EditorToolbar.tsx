import React, { useState } from "react";
import { Editor } from "@tiptap/react";
import {
  Bold, Italic, Underline, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Minus,
  Link, Image as ImageIcon, Undo, Redo
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface EditorToolbarProps {
  editor: Editor | null;
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) {
    return null;
  }

  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const handleLinkOpen = (open: boolean) => {
    setIsLinkOpen(open);
    if (open) {
      setLinkUrl(editor.getAttributes("link").href || "");
    }
  };

  const applyLink = () => {
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    }
    setIsLinkOpen(false);
  };

  const applyImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
    }
    setIsImageOpen(false);
    setImageUrl("");
  };

  const items = [
    { name: "bold", icon: Bold, command: () => editor.chain().focus().toggleBold().run(), isActive: () => editor.isActive("bold") },
    { name: "italic", icon: Italic, command: () => editor.chain().focus().toggleItalic().run(), isActive: () => editor.isActive("italic") },
    { name: "underline", icon: Underline, command: () => editor.chain().focus().toggleUnderline().run(), isActive: () => editor.isActive("underline") },
    { name: "strike", icon: Strikethrough, command: () => editor.chain().focus().toggleStrike().run(), isActive: () => editor.isActive("strike") },
    { type: "divider" },
    { name: "h1", icon: Heading1, command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: () => editor.isActive("heading", { level: 1 }) },
    { name: "h2", icon: Heading2, command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: () => editor.isActive("heading", { level: 2 }) },
    { name: "h3", icon: Heading3, command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: () => editor.isActive("heading", { level: 3 }) },
    { type: "divider" },
    { name: "bulletList", icon: List, command: () => editor.chain().focus().toggleBulletList().run(), isActive: () => editor.isActive("bulletList") },
    { name: "orderedList", icon: ListOrdered, command: () => editor.chain().focus().toggleOrderedList().run(), isActive: () => editor.isActive("orderedList") },
    { type: "divider" },
    { name: "quote", icon: Quote, command: () => editor.chain().focus().toggleBlockquote().run(), isActive: () => editor.isActive("blockquote") },
    { name: "codeBlock", icon: Code, command: () => editor.chain().focus().toggleCodeBlock().run(), isActive: () => editor.isActive("codeBlock") },
    { name: "horizontalRule", icon: Minus, command: () => editor.chain().focus().setHorizontalRule().run(), isActive: () => false },
    { type: "divider" },
    { name: "link", icon: Link, isActive: () => editor.isActive("link") },
    { name: "image", icon: ImageIcon, isActive: () => editor.isActive("image") },
    { type: "divider" },
    { name: "undo", icon: Undo, command: () => editor.chain().focus().undo().run(), isActive: () => false, disabled: () => !editor.can().undo() },
    { name: "redo", icon: Redo, command: () => editor.chain().focus().redo().run(), isActive: () => false, disabled: () => !editor.can().redo() },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-lg mb-4">
      {items.map((item, index) => {
        if (item.type === "divider") {
          return <div key={index} className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />;
        }

        const Icon = item.icon as any;
        const isActive = item.isActive ? item.isActive() : false;
        const isDisabled = item.disabled ? item.disabled() : false;

        const buttonProps = {
          disabled: isDisabled,
          title: item.name,
          className: cn(
            "p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
            isActive ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" : "text-gray-600 dark:text-gray-300",
            isDisabled ? "opacity-50 cursor-not-allowed hover:bg-transparent dark:hover:bg-transparent" : ""
          )
        };

        if (item.name === "link") {
          return (
            <Popover key={index} open={isLinkOpen} onOpenChange={handleLinkOpen}>
              <PopoverTrigger asChild>
                <button {...buttonProps}><Icon size={16} /></button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-3" align="start" sideOffset={8}>
                <div className="flex gap-2">
                  <input
                    autoFocus
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="Enter link URL..."
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") applyLink();
                    }}
                  />
                  <button
                    onClick={applyLink}
                    className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
                  >
                    Apply
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          );
        }

        if (item.name === "image") {
          return (
            <Popover key={index} open={isImageOpen} onOpenChange={setIsImageOpen}>
              <PopoverTrigger asChild>
                <button {...buttonProps}><Icon size={16} /></button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-3" align="start" sideOffset={8}>
                <div className="flex gap-2">
                  <input
                    autoFocus
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Enter image URL..."
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") applyImage();
                    }}
                  />
                  <button
                    onClick={applyImage}
                    className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
                  >
                    Add
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          );
        }

        return (
          <button
            key={index}
            onClick={item.command}
            {...buttonProps}
          >
            <Icon size={16} />
          </button>
        );
      })}
    </div>
  );
}
