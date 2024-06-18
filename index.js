document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const noteContent = document.getElementById("noteContent");
  const addNoteButton = document.getElementById("addNote");

  const makeNoteDraggable = (note) => {
    let offsetX, offsetY;

    note.addEventListener("mousedown", (e) => {
      // Check if the left mouse button (button === 0) is pressed
      // Without this, right click holds dragged too
      if (e.button !== 0) return;

      offsetX = e.clientX - note.getBoundingClientRect().left;
      offsetY = e.clientY - note.getBoundingClientRect().top;

      // const onMouseMove = (e) => {
      //   note.style.left = `${e.clientX - offsetX}px`;
      //   note.style.top = `${e.clientY - offsetY}px`;
      // };

      const onMouseMove = (e) => {
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        // Boundary checks
        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX + note.offsetWidth > board.offsetWidth)
          newX = board.offsetWidth - note.offSetWidth;
        if (newY + note.offsetHeight > board.offsetHeight)
          newY = board.offsetHeight - note.offsetHeight;

        note.style.left = `${newX}px`;
        note.style.top = `${newY}px`;
      };

      document.addEventListener("mousemove", onMouseMove);

      document.addEventListener(
        "mouseup",
        () => {
          document.removeEventListener("mousemove", onMouseMove);
          saveNotes();
        },
        { once: true }
      );
    });
  };

  const saveNotes = () => {
    const notes = document.querySelectorAll(".note");
    const notesData = Array.from(notes).map((note) => ({
      content: note.textContent,
      color: note.style.background,
      left: note.style.left,
      top: note.style.top,
    }));
    localStorage.setItem("notes", JSON.stringify(notesData));
  };

  const createStickyNoteFromData = (noteData) => {
    const note = document.createElement("div");
    note.className = "note";
    note.textContent = noteData.content;
    note.style.background = noteData.color;
    note.style.left = noteData.left;
    note.style.top = noteData.top;

    // Store initial positions as percentages
    const leftPercent = parseFloat(noteData.left) / board.offsetWidth;
    const topPercent = parseFloat(noteData.top) / board.offsetHeight;
    note.dataset.leftPercent = leftPercent;
    note.dataset.topPercent = topPercent;

    board.appendChild(note);

    // Adjust note height based on content
    note.style.height = `${note.scrollHeight}px`;

    // Reposition the note if it overflows the boards height
    if (parseFloat(noteData.top) + note.scrollHeight > board.offsetHeight) {
      note.style.top = `${board.offsetHeight} - ${note.scrollHeight}px`;
      note.dataset.topPercent =
        (board.offsetHeight - note.scrollHeight) / board.offsetHeight;
    }

    // Reposition the note if it overflows the board's width
    if (parseFloat(noteData.left) + note.offsetWidth > board.offsetWidth) {
      note.style.left = `${board.offsetWidth - note.offsetWidth}px`;
      note.dataset.leftPercent =
        (board.offsetWidth - note.offsetWidth) / board.offsetWidth;
    }

    makeNoteDraggable(note);

    // Right click to delete note
    note.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      note.remove();
      saveNotes();
    });
  };

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

    // Make the note draggable
    makeNoteDraggable(note);

    // Right-click to delete note
    note.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      note.remove();
      saveNotes();
    });

    saveNotes();
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

      // Ensure the note stays within the board's boundaries temporarily
      let adjustedLeft = newLeft;
      let adjustedTop = newTop;
      if (newLeft + note.offsetWidth > boardWidth) {
        adjustedLeft = boardWidth - note.offsetWidth;
      }
      if (newTop + note.scrollHeight > boardHeight) {
        adjustedTop = boardHeight - note.scrollHeight;
      }

      note.style.left = `${adjustedLeft}px`;
      note.style.top = `${adjustedTop}px`;
    });
  };

  // Adjust notes position on window resize
  window.addEventListener("resize", adjustNotesPosition);

  // Load notes from local storage
  const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
  savedNotes.forEach((noteData) => createStickyNoteFromData(noteData));

  addNoteButton.addEventListener("click", () => {
    const content = noteContent.value.trim();
    if (content) {
      createStickyNote(content);
      noteContent.value = "";
    }
  });

  noteContent.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      addNoteButton.click();
    }
  });
});
