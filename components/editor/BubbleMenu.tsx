import React from "react";
import { Editor } from "@tiptap/react";
import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react/menus";
import { Bold, Italic, Underline, Strikethrough, Code, Link, Highlighter } from "lucide-react";
import { cn } from "@/lib/utils";

interface BubbleMenuProps {
  editor: Editor;
}

export default function BubbleMenu({ editor }: BubbleMenuProps) {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) return;

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const items = [
    {
      name: "bold",
      isActive: () => editor.isActive("bold"),
      command: () => editor.chain().focus().toggleBold().run(),
      icon: Bold,
    },
    {
      name: "italic",
      isActive: () => editor.isActive("italic"),
      command: () => editor.chain().focus().toggleItalic().run(),
      icon: Italic,
    },
    {
      name: "underline",
      isActive: () => editor.isActive("underline"),
      command: () => editor.chain().focus().toggleUnderline().run(),
      icon: Underline,
    },
    {
      name: "strike",
      isActive: () => editor.isActive("strike"),
      command: () => editor.chain().focus().toggleStrike().run(),
      icon: Strikethrough,
    },
    {
      name: "highlight",
      isActive: () => editor.isActive("highlight"),
      command: () => editor.chain().focus().toggleHighlight().run(),
      icon: Highlighter,
    },
    {
      name: "code",
      isActive: () => editor.isActive("code"),
      command: () => editor.chain().focus().toggleCode().run(),
      icon: Code,
    },
    {
      name: "link",
      isActive: () => editor.isActive("link"),
      command: setLink,
      icon: Link,
    },
  ];

  return (
    <TiptapBubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100, placement: 'top' }}
      className="flex bg-gray-900 text-white rounded-lg shadow-xl overflow-hidden p-1 border border-gray-800"
    >
      {items.map((item, index) => (
        <button
          key={index}
          onClick={item.command}
          className={cn(
            "p-2 flex items-center justify-center rounded-md hover:bg-gray-800 transition-colors",
            item.isActive() ? "text-purple-400 bg-gray-800" : "text-gray-300"
          )}
          title={item.name}
        >
          <item.icon size={16} />
        </button>
      ))}
    </TiptapBubbleMenu>
  );
}
