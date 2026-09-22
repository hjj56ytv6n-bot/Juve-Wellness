const statusEl = document.getElementById("status");
const notesEl = document.getElementById("notes");
const countEl = document.getElementById("count");
const formEl = document.getElementById("note-form");
const submitEl = document.getElementById("submit");
const messageEl = document.getElementById("form-message");

function setStatus(text, kind) {
  statusEl.textContent = text;
  statusEl.className = "status status--" + kind;
}

function setMessage(text, kind) {
  messageEl.textContent = text;
  messageEl.className = kind ? "form-message form-message--" + kind : "form-message";
}

const config = window.SUPABASE_CONFIG;
const client =
  config && config.url && config.publishableKey
    ? window.supabase.createClient(config.url, config.publishableKey)
    : null;

if (!client) {
  setStatus("Supabase is not configured — check config.js", "err");
}

function formatTime(value) {
  const date = new Date(value);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function renderNotes(notes) {
  countEl.textContent = notes.length ? "(" + notes.length + ")" : "";
  if (!notes.length) {
    notesEl.innerHTML = '<li class="empty">No notes yet — be the first.</li>';
    return;
  }

  notesEl.replaceChildren(
    ...notes.map((note) => {
      const li = document.createElement("li");

      const meta = document.createElement("div");
      meta.className = "note-meta";

      const name = document.createElement("span");
      name.className = "note-name";
      name.textContent = note.name;

      const time = document.createElement("span");
      time.className = "note-time";
      time.textContent = formatTime(note.created_at);

      meta.append(name, time);

      const body = document.createElement("p");
      body.className = "note-body";
      body.textContent = note.note;

      li.append(meta, body);
      return li;
    })
  );
}

async function loadNotes() {
  if (!client) return;

  const { data, error } = await client
    .from("workshop_notes")
    .select("id, name, note, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    setStatus("Could not reach Supabase: " + error.message, "err");
    notesEl.innerHTML = '<li class="empty">Could not load notes.</li>';
    return;
  }

  setStatus("Connected to Supabase", "ok");
  renderNotes(data);
}

formEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!client) return;

  const name = document.getElementById("name").value.trim();
  const note = document.getElementById("note").value.trim();
  if (!name || !note) return;

  submitEl.disabled = true;
  setMessage("Saving…");

  const { error } = await client.from("workshop_notes").insert({ name, note });

  submitEl.disabled = false;

  if (error) {
    setMessage("Could not save: " + error.message, "err");
    return;
  }

  formEl.reset();
  setMessage("Saved.", "ok");
  await loadNotes();
});

loadNotes();
