"use client";

import { useState, useEffect } from "react";

interface EditableLabelProps {
  value: string;
  serverId: number;
  onSaveAction: (serverId: number, newLabel: string) => Promise<boolean>;
}

export default function EditableLabel({
  value,
  serverId,
  onSaveAction,
}: EditableLabelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  // Update the edit value when the prop value changes
  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value);
  };

  const handleSave = async () => {
    if (editValue.trim() === value || !editValue.trim()) {
      handleCancel();
      return;
    }

    console.log("EditableLabel: Starting save...", {
      serverId,
      oldValue: value,
      newValue: editValue.trim(),
    });

    setIsSaving(true);
    try {
      const success = await onSaveAction(serverId, editValue.trim());
      console.log("EditableLabel: Save result:", success);

      if (success) {
        setIsEditing(false);
        console.log("EditableLabel: Exited edit mode successfully");
        // The parent component will update the value prop, which will trigger useEffect
      } else {
        console.log("EditableLabel: Save failed, staying in edit mode");
      }
    } catch (error) {
      console.error("Failed to save label:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="editable-label-container">
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          autoFocus
          disabled={isSaving}
          className="editable-label-input"
          maxLength={64}
        />
        <div className="editable-label-actions">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-save-small"
            title="Save (Enter)"
          >
            {isSaving ? "..." : "✓"}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="btn-cancel-small"
            title="Cancel (Escape)"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="editable-label" onClick={handleEdit} title="Click to edit">
      <span className="editable-label-text">{value}</span>
      <span className="editable-label-icon">✏️</span>
    </div>
  );
}
