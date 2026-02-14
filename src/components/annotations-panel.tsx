"use client";

import { useMutation, useSelf, useStorage } from "@/lib/liveblocks.config";
import { type Annotation, type UserMeta } from "@/types";
import { useState } from "react";

export function AnnotationsPanel() {
  const annotations = useStorage((root) => root.annotations);
  const user = useSelf();

  const [newLine, setNewLine] = useState("");
  const [newComment, setNewComment] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const addAnnotation = useMutation(
    ({ storage }, { line, text }: { line: number; text: string }) => {
      storage.get("annotations").push({
        id: Date.now().toString(),
        line,
        text,
        userId: user?.connectionId ?? 0,
        userInfo:
          user?.info ??
          ({
            name: "Anonymous",
            color: "#808080",
            picture: "",
          } as UserMeta["info"]),
        createdAt: Date.now(),
      });
    },
    [user],
  );

  const removeAnnotation = useMutation(({ storage }, index: number) => {
    storage.get("annotations").delete(index);
  }, []);

  const handleAdd = () => {
    if (!newLine || !newComment) return;
    addAnnotation({ line: parseInt(newLine), text: newComment });
    setNewLine("");
    setNewComment("");
    setIsAdding(false);
  };

  if (!annotations)
    return <div className="p-4 text-gray-500">Loading annotations...</div>;

  return (
    <div className="flex flex-col gap-4">
      {/* Simple Add Form for now - ideally triggered from Editor */}
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-2 px-4 rounded-lg border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          + Add Annotation
        </button>
      ) : (
        <div className="bg-white/5 p-3 rounded-lg space-y-3 border border-purple-500/30">
          <input
            type="number"
            placeholder="Line number"
            value={newLine}
            onChange={(e) => setNewLine(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <textarea
            placeholder="Your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500 min-h-[60px]"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-1.5 rounded"
            >
              Add
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-1.5 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {annotations.map((ann: Annotation, index: number) => (
          <div
            key={ann.id}
            className="bg-white/5 border border-white/5 rounded-lg p-3 hover:border-white/10 transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="bg-purple-500/20 text-purple-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-purple-500/30">
                  L{ann.line}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {ann.userInfo?.name}
                </span>
              </div>
              {ann.userId === user?.connectionId && (
                <button
                  onClick={() => removeAnnotation(index)}
                  className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">{ann.text}</p>
            <div className="mt-2 text-[10px] text-gray-600 text-right">
              {new Date(ann.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
