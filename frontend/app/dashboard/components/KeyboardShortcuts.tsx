"use client";

import { useEffect } from "react";
import { useWorkspace } from "../context/WorkspaceContext";

export default function KeyboardShortcuts() {
  const { viewMode, setViewMode, goBack, setShowRightPanel, showRightPanel, setSelectedTab } = useWorkspace();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      // Cmd/Ctrl + K - Quick search (focus search bar)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"][placeholder="Search..."]') as HTMLInputElement;
        searchInput?.focus();
        return;
      }

      // Cmd/Ctrl + D / A - Go to Applications
      if ((e.metaKey || e.ctrlKey) && (e.key === "d" || e.key === "a")) {
        e.preventDefault();
        setViewMode("applications");
        return;
      }

      // Cmd/Ctrl + P - Go to Applications (Pipeline)
      if ((e.metaKey || e.ctrlKey) && e.key === "p" && !e.shiftKey) {
        e.preventDefault();
        setViewMode("applications");
        return;
      }

      // Cmd/Ctrl + C - Go to chats
      if ((e.metaKey || e.ctrlKey) && e.key === "c" && !e.shiftKey) {
        e.preventDefault();
        setViewMode("chats");
        return;
      }

      // Escape - Go back / Close panels
      if (e.key === "Escape") {
        e.preventDefault();
        if (showRightPanel) {
          setShowRightPanel(false);
        } else {
          goBack();
        }
        return;
      }

      // Cmd/Ctrl + / - Show shortcuts help
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        alert(
          "Keyboard Shortcuts:\n\n" +
          "⌘K - Focus search\n" +
          "⌘A / ⌘D - Go to Applications\n" +
          "⌘C - Go to Chats\n" +
          "Esc - Go back / Close panels\n" +
          "⌘/ - Show this help"
        );
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, setViewMode, goBack, setShowRightPanel, showRightPanel, setSelectedTab]);

  return null; // This component doesn't render anything
}

