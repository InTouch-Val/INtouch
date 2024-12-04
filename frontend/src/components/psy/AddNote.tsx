//@ts-nocheck
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EditorState } from "draft-js";
import { EditorToolbar } from "../../service/editors-toolbar";
import { API } from "../../service/axios";
import "../../css/note.css";
import Notifications from "../../stories/notifications/Notifications";

function AddNote() {
  const { id } = useParams();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );
  const [title, setTitle] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSaveNote = async () => {
    const noteContent = JSON.stringify(editorState); // Replace with actual conversion
    try {
      const response = await API.post("/notes/", {
        content: noteContent,
        title: title,
        client_id: id,
      });
      if (response.status === 201) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/clients"); // Redirect to the notes tab
        }, 2000);
      }
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  return (
    <div className="add-note-container">
      <h2>Add Note</h2>
      {isSuccess && (
        <Notifications
          status={"success"}
          messageText="Note created successfully!"
        />
      )}
      <input
        type="text"
        placeholder="Note Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="note-title-input"
      />
      <EditorToolbar
        editorState={editorState}
        setEditorState={setEditorState}
      />
      <button onClick={handleSaveNote} className="action-button">
        Save Note
      </button>
    </div>
  );
}

export { AddNote };
