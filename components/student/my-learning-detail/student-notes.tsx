"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Edit2, Plus } from "lucide-react";

interface StudentNote {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface StudentNotesProps {
  lessonId: string;
}

export function StudentNotes({ lessonId }: StudentNotesProps) {
  const [notes, setNotes] = useState<StudentNote[]>([]);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const storageKey = `lesson-notes-${lessonId}`;
    const savedNotes = localStorage.getItem(storageKey);
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error("Failed to load notes:", error);
      }
    }
  }, [lessonId]);

  const saveNotesToStorage = (updatedNotes: StudentNote[]) => {
    const storageKey = `lesson-notes-${lessonId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedNotes));
  };

  const addNote = () => {
    if (!newNoteContent.trim()) return;

    const newNote: StudentNote = {
      id: Date.now().toString(),
      content: newNoteContent,
      createdAt: new Date().toLocaleString("vi-VN"),
      updatedAt: new Date().toLocaleString("vi-VN"),
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
    setNewNoteContent("");
    setIsAdding(false);
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
  };

  const startEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  const saveEdit = (id: string) => {
    if (!editContent.trim()) return;

    const updatedNotes = notes.map((note) =>
      note.id === id
        ? {
            ...note,
            content: editContent,
            updatedAt: new Date().toLocaleString("vi-VN"),
          }
        : note
    );
    setNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
    setEditingId(null);
    setEditContent("");
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <div className="w-1 h-7 bg-gradient-to-b from-violet-600 to-purple-600 rounded-full"></div>
          Your Notes
        </h3>
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            size="sm"
            className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Note
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="mb-6 p-4 bg-gradient-to-br from-violet-50 via-white to-purple-50 border-2 border-violet-200 rounded-xl">
          <Textarea
            placeholder="Write your note here..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            className="mb-3 min-h-24 border-violet-200 focus:border-violet-500 focus:ring-violet-500"
          />
          <div className="flex gap-2">
            <Button
              onClick={addNote}
              size="sm"
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md"
            >
              Save Note
            </Button>
            <Button
              onClick={() => {
                setIsAdding(false);
                setNewNoteContent("");
              }}
              variant="outline"
              size="sm"
              className="border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {notes.length === 0 ? (
        <p className="text-gray-500 text-center py-8 italic">
          No notes yet. Start adding your personal notes!
        </p>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-violet-300 hover:shadow-md transition-all duration-300"
            >
              {editingId === note.id ? (
                <div className="space-y-3">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-20 border-violet-200 focus:border-violet-500 focus:ring-violet-500"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => saveEdit(note.id)}
                      size="sm"
                      className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditingId(null)}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-800 mb-3 whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Updated: {note.updatedAt}
                    </p>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => startEdit(note.id, note.content)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-600 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => deleteNote(note.id)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
