document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const noteContent = document.getElementById("noteContent");
  const addNoteButton = document.getElementById("addNote");

  addNoteButton.addEventListener("click", () => {
    const content = noteContent.value.trim();
    if (content) {
      createStickyNote(content);
      noteContent.value = "";
    }
  });

  const createStickyNote = (content) => {
    const colors = ["#ffcc99", "#99ccff", "#ffff99", "#cc99ff", "#99ff99"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const note = document.createElement("div");
    note.className = "note";
    note.textContent = content;
    note.style.background = randomColor;

    const boardWidth = board.offsetWidth - 150;
    const boardHeight = board.offsetHeight - 150;
    const randomX = Math.random() * boardWidth;
    const randomY = Math.random() * boardHeight;
    note.style.left = `${randomX}px`;
    note.style.top = `${randomY}px`;

    board.appendChild(note);

    // Adjust note height based on content
    note.style.height = `${note.scrollHeight}px`;

    // Reposition the note if it overflows the boards height
    if (randomY + note.scrollHeight > board.offsetHeight) {
      note.style.top = `${board.offsetHeight - note.scrollHeight}px`;
    }

    note.addEventListener("click", () => {
      note.remove();
    });
  };
});
