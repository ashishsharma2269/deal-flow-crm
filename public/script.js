const API = "/leads";

const form = document.getElementById("leadForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const lead = {
    clientName: document.getElementById("clientName").value,
    projectType: document.getElementById("projectType").value,
    source: document.getElementById("source").value,
    contact: document.getElementById("contact").value,
    notes: document.getElementById("notes").value,
    followUpDate: document.getElementById("followUpDate").value,
  };

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });

  form.reset();
  loadLeads();
});

async function loadLeads() {
  const res = await fetch(API);
  const leads = await res.json();

  document.querySelectorAll(".column").forEach(col => col.innerHTML = `<h2>${col.dataset.stage}</h2>`);

  const today = new Date().toISOString().split("T")[0];

  leads.forEach(lead => {
    const card = document.createElement("div");
    card.className = "card";

    if (lead.followUpDate) {
      if (lead.followUpDate < today) card.classList.add("overdue");
      else if (lead.followUpDate === today) card.classList.add("today");
    }

    card.innerHTML = `
      <strong>${lead.clientName}</strong><br/>
      ${lead.followUpDate || ""}
    `;

    card.onclick = async () => {
      const stages = ["New Inquiry", "Meeting Done", "Proposal Sent", "Negotiation", "Won", "Lost"];
      let idx = stages.indexOf(lead.stage);
      let nextStage = stages[(idx + 1) % stages.length];

      await fetch(`${API}/${lead.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: nextStage }),
      });

      loadLeads();
    };

    const column = document.querySelector(`[data-stage="${lead.stage}"]`);
    if (column) column.appendChild(card);
  });
}

loadLeads();