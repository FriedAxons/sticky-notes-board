document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const noteContent = document.getElementById("noteContent");
  const addNoteButton = document.getElementById("addNote");

  const isMobileDevice =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  const makeNoteDraggable = (note) => {
    let offsetX, offsetY;

    const startDragging = (initialX, initialY) => {
      const initialLeft = parseFloat(note.style.left);
      const initialTop = parseFloat(note.style.top);

      const onMouseMove = (moveEvent) => {
        const newX = initialLeft + moveEvent.clientX - initialX;
        const newY = initialTop + moveEvent.clientY - initialY;

        // Boundary checks
        if (newX < 0) {
          note.style.left = `0px`;
        } else if (newX + note.offsetWidth > board.offsetWidth) {
          note.style.left = `${board.offsetWidth - note.offsetWidth}px`;
        } else {
          note.style.left = `${newX}px`;
        }

        if (newY < 0) {
          note.style.top = `0px`;
        } else if (newY + note.offsetHeight > board.offsetHeight) {
          note.style.top = `${board.offsetHeight - note.offsetHeight}px`;
        } else {
          note.style.top = `${newY}px`;
        }
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        saveNotes();
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    note.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return; // Check if left mouse button is pressed

      offsetX = e.clientX - note.getBoundingClientRect().left;
      offsetY = e.clientY - note.getBoundingClientRect().top;
      startDragging(e.clientX, e.clientY);
    });

    if (isMobileDevice) {
      note.addEventListener("touchstart", (e) => {
        const touch = e.touches[0];
        offsetX = touch.clientX - note.getBoundingClientRect().left;
        offsetY = touch.clientY - note.getBoundingClientRect().top;
        startDragging(touch.clientX, touch.clientY);
      });
    }
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

    // Ensure note stays within board's boundaries
    if (parseFloat(noteData.top) + note.scrollHeight > board.offsetHeight) {
      note.style.top = `${board.offsetHeight - note.scrollHeight}px`;
      note.dataset.topPercent =
        (board.offsetHeight - note.scrollHeight) / board.offsetHeight;
    }

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
    const colors = [
      "#ffcc99",
      "#99ccff",
      "#ffff99",
      "#cc99ff",
      "#99ff99",
      "#ff9999",
      "#ff99cc",
    ];
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

    // Ensure note stays within board's boundaries
    if (randomY + note.scrollHeight > board.offsetHeight) {
      note.style.top = `${board.offsetHeight - note.scrollHeight}px`;
      note.dataset.topPercent =
        (board.offsetHeight - note.scrollHeight) / board.offsetHeight;
    }

    if (randomX + note.offsetWidth > board.offsetWidth) {
      note.style.left = `${board.offsetWidth - note.offsetWidth}px`;
      note.dataset.leftPercent =
        (board.offsetWidth - note.offsetWidth) / board.offsetWidth;
    }

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

      // Ensure the note stays within the board's boundaries
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

  if (isMobileDevice) {
    let touchStartTime = 0;
    board.addEventListener(
      "touchend",
      (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - touchStartTime;
        if (tapLength < 500 && tapLength > 0) {
          const touch = e.changedTouches[0];
          const clickedElement = document.elementFromPoint(
            touch.clientX,
            touch.clientY
          );
          if (clickedElement.classList.contains("note")) {
            clickedElement.remove();
            saveNotes();
          }
        }
        touchStartTime = currentTime;
      },
      false
    );
  }
});
