const formContainer = document.getElementById("formContainer");

function showForm() {
  formContainer.classList.toggle("hidden");
}

function addLead() {
  const name = document.getElementById("name").value;
  const project = document.getElementById("project").value;
  const source = document.getElementById("source").value;
  const contact = document.getElementById("contact").value;
  const followup = document.getElementById("followup").value;
  const notes = document.getElementById("notes").value;

  if (!name) {
    alert("Client name required");
    return;
  }

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <strong>${name}</strong><br/>
    <small>${project}</small><br/>
    <small>${source}</small><br/>
    <small>${followup}</small>
  `;

  document.getElementById("New Inquiry").appendChild(card);

  // Clear form
  document.getElementById("name").value = "";
  document.getElementById("project").value = "";
  document.getElementById("source").value = "";
  document.getElementById("contact").value = "";
  document.getElementById("followup").value = "";
  document.getElementById("notes").value = "";
}