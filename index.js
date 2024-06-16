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
    let randomX = Math.random() * boardWidth;
    let randomY = Math.random() * boardHeight;

    // Adjust note position if it overflows the board's boundaries
    if (randomX + 150 > board.offsetWidth) {
      randomX = board.offsetWidth - 150;
    }
    if (randomY + 150 > board.offsetHeight) {
      randomY = board.offsetHeight - 150;
    }

    note.style.left = `${randomX}px`;
    note.style.top = `${randomY}px`;

    // Store initial positions as percentages
    note.dataset.leftPercent = randomX / board.offsetWidth;
    note.dataset.topPercent = randomY / board.offsetHeight;

    board.appendChild(note);

    // Adjust note height based on content
    note.style.height = `${note.scrollHeight}px`;

    // Reposition the note if it overflows the board's height
    if (randomY + note.scrollHeight > board.offsetHeight) {
      note.style.top = `${board.offsetHeight - note.scrollHeight}px`;
      note.dataset.topPercent =
        (board.offsetHeight - note.scrollHeight) / board.offsetHeight;
    }

    // Reposition the note if it overflows the board's width
    if (randomX + note.offsetWidth > board.offsetWidth) {
      note.style.left = `${board.offsetWidth - note.offsetWidth}px`;
      note.dataset.leftPercent =
        (board.offsetWidth - note.offsetWidth) / board.offsetWidth;
    }

    note.addEventListener("click", () => {
      note.remove();
    });
  };

  const adjustNotesPosition = () => {
    const notes = document.querySelectorAll(".note");
    const boardWidth = board.offsetWidth;
    const boardHeight = board.offsetHeight;

    notes.forEach((note) => {
      const leftPercent = parseFloat(note.dataset.leftPercent);
      const topPercent = parseFloat(note.dataset.topPercent);

      let newLeft = leftPercent * boardWidth;
      let newTop = topPercent * boardHeight;

      // Ensure the note stays within the board's boundaries
      if (newLeft + note.offsetWidth > boardWidth) {
        newLeft = boardWidth - note.offsetWidth;
      }
      if (newTop + note.scrollHeight > boardHeight) {
        newTop = boardHeight - note.scrollHeight;
      }

      note.style.left = `${newLeft}px`;
      note.style.top = `${newTop}px`;

      // Update the dataset to reflect the new position
      note.dataset.leftPercent = newLeft / boardWidth;
      note.dataset.topPercent = newTop / boardHeight;
    });
  };

  window.addEventListener("resize", adjustNotesPosition);
});
