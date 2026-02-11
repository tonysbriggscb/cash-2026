import { useState, useCallback, useEffect, useRef } from "react";
import type { CanvasNote } from "./types";

const NOTE_WIDTH = 200;
const NOTE_HEIGHT = 120;
const NOTE_GAP = 16;

function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

/**
 * Finds a position for a new note that doesn't overlap existing ones.
 * Stacks notes vertically (top to bottom), wrapping to the next column
 * when the viewport bottom is reached.
 */
function findOpenPosition(existing: CanvasNote[]): { x: number; y: number } {
  const startX = 40;
  const startY = 100;
  const stepX = NOTE_WIDTH + NOTE_GAP;
  const stepY = NOTE_HEIGHT + NOTE_GAP;
  const maxY = typeof window !== "undefined" ? window.innerHeight - NOTE_HEIGHT - 20 : 700;

  const overlaps = (x: number, y: number) =>
    existing.some(
      (n) =>
        Math.abs(n.x - x) < NOTE_WIDTH + NOTE_GAP / 2 &&
        Math.abs(n.y - y) < NOTE_HEIGHT + NOTE_GAP / 2
    );

  let x = startX;
  let y = startY;

  for (let attempts = 0; attempts < 50; attempts++) {
    if (!overlaps(x, y)) return { x, y };
    y += stepY;
    if (y > maxY) {
      y = startY;
      x += stepX;
    }
  }

  const last = existing[existing.length - 1];
  if (last) {
    return { x: last.x, y: last.y + 24 };
  }
  return { x: startX, y: startY };
}

function encodeNotes(notes: CanvasNote[]): string {
  return btoa(JSON.stringify(notes));
}

function decodeNotes(encoded: string): CanvasNote[] {
  try {
    const parsed = JSON.parse(atob(encoded));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (n: unknown) =>
          typeof n === "object" &&
          n !== null &&
          typeof (n as CanvasNote).id === "string" &&
          typeof (n as CanvasNote).text === "string" &&
          typeof (n as CanvasNote).x === "number" &&
          typeof (n as CanvasNote).y === "number"
      )
      .map((n: Record<string, unknown>): CanvasNote => ({
        id: n.id as string,
        text: n.text as string,
        x: n.x as number,
        y: n.y as number,
        // Backward compat: old notes without scope default to permanent
        scope: n.scope === "screen" ? "screen" : "permanent",
        screen: typeof n.screen === "string" ? n.screen : undefined,
      }));
  } catch {
    return [];
  }
}

function readNotesFromUrl(): CanvasNote[] {
  if (typeof window === "undefined") return [];
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("notes");
  if (!encoded) return [];
  return decodeNotes(encoded);
}

function writeNotesToUrl(notes: CanvasNote[]) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (notes.length === 0) {
    url.searchParams.delete("notes");
  } else {
    url.searchParams.set("notes", encodeNotes(notes));
  }
  window.history.replaceState({}, "", url.toString());
}

/**
 * Hook for managing canvas notes with URL persistence.
 * Notes are encoded as base64 JSON in the ?notes= URL parameter.
 */
export function useCanvasNotes() {
  const [notes, setNotes] = useState<CanvasNote[]>(() => readNotesFromUrl());
  const isInitialMount = useRef(true);

  // Sync notes to URL whenever they change (skip the initial mount to avoid a redundant write)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    writeNotesToUrl(notes);
  }, [notes]);

  const addNote = useCallback((currentScreen?: string) => {
    let noteId = "";
    setNotes((prev) => {
      const { x, y } = findOpenPosition(prev);
      const newNote: CanvasNote = {
        id: generateId(),
        text: "",
        x,
        y,
        scope: "permanent",
        screen: currentScreen,
      };
      noteId = newNote.id;
      return [...prev, newNote];
    });
    return noteId;
  }, []);

  const updateNote = useCallback((id: string, text: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, text } : n))
    );
  }, []);

  const removeNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const moveNote = useCallback((id: string, x: number, y: number) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, x, y } : n))
    );
  }, []);

  const setScopeForNote = useCallback(
    (id: string, scope: "permanent" | "screen", currentScreen?: string) => {
      setNotes((prev) =>
        prev.map((n) => {
          if (n.id !== id) return n;
          if (scope === "screen") {
            return { ...n, scope: "screen", screen: currentScreen };
          }
          return { ...n, scope: "permanent", screen: undefined };
        })
      );
    },
    []
  );

  return { notes, addNote, updateNote, removeNote, moveNote, setScopeForNote };
}
