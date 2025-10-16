// 🔒 Redirect if not admin
if (localStorage.getItem("isAdmin") !== "true") {
  window.location.href = "main_login.html";
}

// 🧠 Load stored data
let commandos = JSON.parse(localStorage.getItem("commandos")) || [];
let weapons = JSON.parse(localStorage.getItem("weapons")) || [];
let duties = JSON.parse(localStorage.getItem("duties")) || [];
let schedule = localStorage.getItem("schedule") || "No schedule set yet.";
let feedback = JSON.parse(localStorage.getItem("recommendations")) || [];

// 🪖 Preview photo
function previewPhoto(event) {
  const preview = document.getElementById("photoPreview");
  preview.src = URL.createObjectURL(event.target.files[0]);
  preview.style.display = "block";
}

// 🆔 Generate unique ID
function generateID() {
  return "CMD-" + Math.floor(1000 + Math.random() * 9000);
}

// ➕ Add Commando
function addCommando() {
  const name = document.getElementById("commandoName").value.trim();
  const rank = document.getElementById("commandoRank").value.trim();
  const location = document.getElementById("commandoLocation").value.trim();
  const photoFile = document.getElementById("commandoPhoto").files[0];

  if (!name || !rank || !location || !photoFile) {
    alert("⚠️ Please fill all fields!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const id = generateID();
    const photo = e.target.result;
    commandos.push({ id, name, rank, location, photo });

    localStorage.setItem("commandos", JSON.stringify(commandos));
    renderCommandos();
    updateDutyDropdown();

    document.getElementById("commandoName").value = "";
    document.getElementById("commandoRank").value = "";
    document.getElementById("commandoLocation").value = "";
    document.getElementById("commandoPhoto").value = "";
    document.getElementById("photoPreview").style.display = "none";

    alert("✅ Commando added successfully!");
  };
  reader.readAsDataURL(photoFile);
}

// 🧾 Render Commandos
function renderCommandos() {
  const tbody = document.querySelector("#commandoTable tbody");
  tbody.innerHTML = "";
  commandos.forEach((c, i) => {
    const row = `
      <tr>
        <td><img src="${c.photo}" width="50" style="border-radius:50%"></td>
        <td>${c.id}</td>
        <td>${c.name}</td>
        <td>${c.rank}</td>
        <td>${c.location}</td>
        <td><button onclick="deleteCommando(${i})">🗑️ Delete</button></td>
      </tr>
    `;
    tbody.insertAdjacentHTML("beforeend", row);
  });
}

// ❌ Delete Commando
function deleteCommando(i) {
  if (!confirm("Are you sure you want to delete this commando?")) return;
  commandos.splice(i, 1);
  localStorage.setItem("commandos", JSON.stringify(commandos));
  renderCommandos();
  updateDutyDropdown();
}

// 🔫 Add Weapon
function addWeapon() {
  const name = document.getElementById("weaponName").value.trim();
  const count = document.getElementById("weaponCount").value.trim();
  if (!name || !count) return alert("⚠️ Fill all fields!");
  weapons.push({ name, count });
  localStorage.setItem("weapons", JSON.stringify(weapons));
  renderWeapons();
  document.getElementById("weaponName").value = "";
  document.getElementById("weaponCount").value = "";
}

// 🔫 Render Weapons
function renderWeapons() {
  const tbody = document.querySelector("#weaponTable tbody");
  tbody.innerHTML = "";
  weapons.forEach((w, i) => {
    tbody.insertAdjacentHTML(
      "beforeend",
      `<tr>
        <td>${w.name}</td>
        <td>${w.count}</td>
        <td><button onclick="deleteWeapon(${i})">🗑️ Delete</button></td>
      </tr>`
    );
  });
}

function deleteWeapon(i) {
  weapons.splice(i, 1);
  localStorage.setItem("weapons", JSON.stringify(weapons));
  renderWeapons();
}

// 🧭 Assign Duty
function assignDuty() {
  const commando = document.getElementById("dutyCommando").value;
  const location = document.getElementById("dutyLocation").value.trim();
  const date = document.getElementById("dutyDate").value;

  if (!commando || !location || !date) return alert("⚠️ Fill all fields!");
  duties.push({ commando, location, date });
  localStorage.setItem("duties", JSON.stringify(duties));
  renderDuties();
}

function renderDuties() {
  const tbody = document.querySelector("#dutyTable tbody");
  tbody.innerHTML = "";
  duties.forEach((d, i) => {
    tbody.insertAdjacentHTML(
      "beforeend",
      `<tr>
        <td>${d.commando}</td>
        <td>${d.location}</td>
        <td>${d.date}</td>
        <td><button onclick="deleteDuty(${i})">🗑️ Delete</button></td>
      </tr>`
    );
  });
}

function deleteDuty(i) {
  duties.splice(i, 1);
  localStorage.setItem("duties", JSON.stringify(duties));
  renderDuties();
}

function updateDutyDropdown() {
  const select = document.getElementById("dutyCommando");
  select.innerHTML = '<option value="">Select Commando</option>';
  commandos.forEach((c) => {
    const option = document.createElement("option");
    option.value = c.name;
    option.text = `${c.name} (${c.id})`;
    select.appendChild(option);
  });
}

// 📅 Schedule
function updateSchedule() {
  const text = document.getElementById("scheduleText").value.trim();
  if (!text) return alert("⚠️ Please enter a schedule!");
  schedule = text;
  localStorage.setItem("schedule", schedule);
  renderSchedule();
  alert("✅ Schedule updated successfully!");
}

function renderSchedule() {
  document.getElementById("currentSchedule").innerText = schedule;
}

// 💬 Feedback
function renderFeedback() {
  const list = document.getElementById("feedbackList");
  list.innerHTML = "";
  if (feedback.length === 0) {
    list.innerHTML = "<p>No feedback available.</p>";
  } else {
    feedback.forEach((f, i) => {
      list.insertAdjacentHTML("beforeend", `<li><b>${i + 1}.</b> ${f}</li>`);
    });
  }
}

// 🚪 Common Logout
function logout() {
  if (localStorage.getItem("isAdmin")) localStorage.removeItem("isAdmin");
  if (localStorage.getItem("isUser")) localStorage.removeItem("isUser");
  window.location.href = "logout_success.html";
}

// 🧩 Initialize
renderCommandos();
renderWeapons();
renderDuties();
renderSchedule();
renderFeedback();
updateDutyDropdown();
