import { useState, useRef, useEffect, useCallback } from "react";
import type { CanvasNote } from "./types";

interface StickyNoteProps {
  note: CanvasNote;
  currentScreen: string;
  onUpdate: (id: string, text: string) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onSetScope: (id: string, scope: "permanent" | "screen", currentScreen?: string) => void;
}

const StickyNote = ({
  note,
  currentScreen,
  onUpdate,
  onRemove,
  onMove,
  onSetScope,
}: StickyNoteProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);

  // Auto-focus textarea when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [isEditing]);

  // Auto-edit new empty notes
  useEffect(() => {
    if (note.text === "") {
      setIsEditing(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).tagName === "TEXTAREA") return;
      if ((e.target as HTMLElement).closest("[data-scope-toggle]")) return;
      e.preventDefault();
      setIsDragging(true);
      dragOffset.current = {
        x: e.clientX - note.x,
        y: e.clientY - note.y,
      };
    },
    [note.x, note.y]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = Math.max(0, e.clientX - dragOffset.current.x);
      const newY = Math.max(0, e.clientY - dragOffset.current.y);
      onMove(note.id, newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, note.id, onMove]);

  const handleScopeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (note.scope === "permanent") {
      onSetScope(note.id, "screen", currentScreen);
    } else {
      onSetScope(note.id, "permanent");
    }
  };

  const scopeLabel =
    note.scope === "screen" ? note.screen ?? "screen" : "All";

  const isScreenScoped = note.scope === "screen";

  return (
    <div
      ref={noteRef}
      className="canvas-note"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "absolute",
        left: note.x,
        top: note.y,
        width: 200,
        minHeight: 120,
        zIndex: 9998,
        display: "flex",
        flexDirection: "column",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: isDragging
          ? "0 8px 24px rgba(0,0,0,0.18)"
          : "0 2px 8px rgba(0,0,0,0.10)",
        transition: isDragging ? "none" : "box-shadow 0.2s ease",
        cursor: isDragging ? "grabbing" : "default",
        userSelect: "none",
      }}
    >
      {/* Drag handle / header */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          height: 28,
          backgroundColor: isScreenScoped ? "#A3D5F5" : "#F5E6A3",
          cursor: isDragging ? "grabbing" : "grab",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 6px 0 10px",
          flexShrink: 0,
          gap: 4,
        }}
      >
        {/* Drag indicator */}
        <div
          style={{
            width: 20,
            height: 4,
            borderRadius: 2,
            backgroundColor: "rgba(0,0,0,0.15)",
            flexShrink: 0,
          }}
        />

        {/* Scope toggle badge */}
        <button
          data-scope-toggle
          onClick={handleScopeToggle}
          title={
            isScreenScoped
              ? "Pinned to this screen - click for all screens"
              : "Visible on all screens - click to pin to current screen"
          }
          style={{
            background: isScreenScoped
              ? "rgba(0,0,0,0.12)"
              : "rgba(0,0,0,0.08)",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            padding: "2px 6px",
            fontSize: 10,
            fontWeight: 500,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            color: "rgba(0,0,0,0.55)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 100,
            lineHeight: "16px",
            flexShrink: 1,
          }}
        >
          {scopeLabel}
        </button>

        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(note.id);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 2,
            lineHeight: 1,
            fontSize: 14,
            color: "rgba(0,0,0,0.35)",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.15s ease",
            pointerEvents: isHovered ? "auto" : "none",
            flexShrink: 0,
          }}
          aria-label="Delete note"
        >
          ✕
        </button>
      </div>

      {/* Note body */}
      <div
        onDoubleClick={() => setIsEditing(true)}
        style={{
          flex: 1,
          backgroundColor: isScreenScoped ? "#E1F0FA" : "#FFF9C4",
          padding: 10,
          minHeight: 92,
        }}
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={note.text}
            onChange={(e) => onUpdate(note.id, e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsEditing(false);
              }
            }}
            placeholder="Type a note..."
            style={{
              width: "100%",
              height: "100%",
              minHeight: 72,
              border: "none",
              outline: "none",
              resize: "vertical",
              backgroundColor: "transparent",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: 13,
              lineHeight: 1.45,
              color: "#333",
            }}
          />
        ) : (
          <div
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: 13,
              lineHeight: 1.45,
              color: note.text ? "#333" : "#999",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              cursor: "text",
              minHeight: 72,
            }}
          >
            {note.text || "Double-click to edit"}
          </div>
        )}
      </div>
    </div>
  );
};

interface CanvasNotesProps {
  notes: CanvasNote[];
  currentScreen: string;
  onUpdate: (id: string, text: string) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onSetScope: (id: string, scope: "permanent" | "screen", currentScreen?: string) => void;
}

/**
 * Renders draggable sticky notes on the desktop canvas area.
 * Filters notes based on scope: permanent notes always show,
 * screen-scoped notes only show when their pinned screen is active.
 */
export const CanvasNotes = ({
  notes,
  currentScreen,
  onUpdate,
  onRemove,
  onMove,
  onSetScope,
}: CanvasNotesProps) => {
  const visibleNotes = notes.filter(
    (n) => n.scope === "permanent" || n.screen === currentScreen
  );

  if (visibleNotes.length === 0) return null;

  return (
    <div
      className="canvas-notes-layer"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9998,
      }}
    >
      {visibleNotes.map((note) => (
        <div
          key={note.id}
          className="canvas-note-wrapper"
          style={{ pointerEvents: "auto" }}
        >
          <StickyNote
            note={note}
            currentScreen={currentScreen}
            onUpdate={onUpdate}
            onRemove={onRemove}
            onMove={onMove}
            onSetScope={onSetScope}
          />
        </div>
      ))}
    </div>
  );
};
