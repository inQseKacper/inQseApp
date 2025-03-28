import React from "react";
import "../styles/Note.css"

function Apartment({ apartment, onDelete }) {
    return (
        <div className="note-container">
            <p className="note-title">{apartment.apartment}</p>
            {/* <p className="note-content">{note.content}</p>
            <p className="note-date">{formattedDate}</p>
            <button className="delete-button" onClick={() => onDelete(note.id)}>
                Delete
            </button> */}
        </div>
    );
}

export default Apartment;