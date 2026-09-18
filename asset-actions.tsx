"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";

/** Approve locks an asset for push. Revise sends it back with a note kept in local taste memory. */
export function AssetActions({ assetKey, label }: { assetKey: string; label: string }) {
  const { state, setApproved, sendBack, showToast } = useStore();
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");

  const approved = Boolean(state.approvals[assetKey]);

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <StatusBadge assetKey={assetKey} />
        <Button
          variant="ghost"
          size="sm"
          className="h-auto rounded-full px-3 py-1.5"
          onClick={() => setNoteOpen((v) => !v)}
        >
          Revise
        </Button>
        <Button
          variant={approved ? "outline" : "default"}
          size="sm"
          className="h-auto rounded-full px-4 py-1.5"
          onClick={() => {
            setApproved(assetKey, !approved);
            setNoteOpen(false);
            showToast(approved ? `${label} approval removed.` : `${label} approved.`);
          }}
        >
          {approved ? "Approved" : "Approve"}
        </Button>
      </div>

      {noteOpen ? (
        <form
          className="flex w-full max-w-sm items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!note.trim()) return;
            sendBack(assetKey, label, note.trim());
            showToast(`${label} sent back for revision.`);
            setNote("");
            setNoteOpen(false);
          }}
        >
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What needs to change?"
            aria-label={`Revision note for ${label}`}
            className="h-9 flex-1"
            autoFocus
          />
          <Button type="submit" size="sm" className="h-9 rounded-lg px-3" disabled={!note.trim()}>
            Send back
          </Button>
        </form>
      ) : null}

      {state.revisions[assetKey] ? (
        <p className="max-w-sm text-right text-xs leading-5 text-muted-foreground">
          {state.revisions[assetKey]}
        </p>
      ) : null}
    </div>
  );
}
