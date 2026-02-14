"use client";

import {
  useMutation,
  useMyPresence,
  useOthers,
  useStorage,
} from "@/lib/liveblocks.config";
import Editor, { OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useEffect, useRef, useState } from "react";

export function CodeEditor() {
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);

  // Storage
  const code = useStorage((root) => root.code);
  const updateCode = useMutation(({ storage }, newCode: string) => {
    storage.set("code", newCode);
  }, []);

  // Presence
  const [, updateMyPresence] = useMyPresence();
  const others = useOthers();

  const isRemoteUpdate = useRef(false);

  // Sync Code: Storage -> Editor
  useEffect(() => {
    if (editor && code !== undefined && code !== editor.getValue()) {
      isRemoteUpdate.current = true;
      const position = editor.getPosition();
      editor.setValue(code);
      if (position) editor.setPosition(position);
      isRemoteUpdate.current = false;
    }
  }, [code, editor]);

  // Sync Cursors: Others -> Editor Decorations
  useEffect(() => {
    if (!editor) return;

    // Convert others presence to decorations
    const decorations: monaco.editor.IModelDeltaDecoration[] = others
      .filter((user) => user.presence.cursor)
      .map((user) => {
        const cursor = user.presence.cursor!;
        return {
          id: user.connectionId.toString(),
          range: new monaco.Range(
            cursor.line,
            cursor.column,
            cursor.line,
            cursor.column,
          ),
          options: {
            className: `cursor-${user.connectionId}`, // We'll need dynamic styles for this
            stickiness:
              monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
            beforeContentClassName: "my-cursor-caret", // Custom CSS class for caret
            hoverMessage: { value: user.info?.name || "Anonymous" },
          },
        };
      });

    // We need to manage decorations. Monaco has createdDecorationsCollection in newer versions
    // or deltaDecorations in older. @monaco-editor/react types might vary.
    // Let's use old school deltaDecorations for simplicity if collection not available in types easily
    const decorationIds = editor.deltaDecorations([], decorations);

    return () => {
      editor.deltaDecorations(decorationIds, []);
    };
  }, [others, editor]);

  // Setup Styles for cursors (Dynamic CSS injection)
  useEffect(() => {
    const styleId = "cursor-styles";
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    const rules = others
      .map((user) => {
        const color = user.info?.color || "#ff0000";
        return `
            .monaco-editor .cursor-${user.connectionId} {
                border-left: 2px solid ${color};
            }
            .monaco-editor .cursor-${user.connectionId}::after {
                content: "${user.info?.name || "User"}";
                position: absolute;
                top: -1.2em;
                left: 0;
                background: ${color};
                color: #fff;
                font-size: 10px;
                padding: 1px 4px;
                border-radius: 4px;
                white-space: nowrap;
                pointer-events: none;
            }
        `;
      })
      .join("\n");

    styleElement.innerHTML = rules;
  }, [others]);

  const handleEditorDidMount: OnMount = (editor) => {
    setEditor(editor);

    // Initial sync
    if (code) {
      isRemoteUpdate.current = true;
      editor.setValue(code);
      isRemoteUpdate.current = false;
    }

    editor.onDidChangeCursorPosition((e) => {
      updateMyPresence({
        cursor: {
          line: e.position.lineNumber,
          column: e.position.column,
        },
      });
    });

    editor.onDidChangeModelContent(() => {
      if (isRemoteUpdate.current) return;
      updateCode(editor.getValue());
    });
  };

  return (
    <div className="h-full w-full overflow-hidden pt-4 bg-[#0a0a0f]">
      {/* Added padding top to avoid overlapping with header if needed, but flex layout handles it */}
      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue="// Loading..."
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "var(--font-mono)",
          padding: { top: 20 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
        }}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}
