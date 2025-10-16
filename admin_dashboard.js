<script>
if (localStorage.getItem("isAdmin") !== "true") {
  window.location.href = "main_login.html";
}

let commandos = JSON.parse(localStorage.getItem("commandos")) || [];
let editIndex = null;
let uploadedPhoto = "";

// Generate Commando ID
function generateId() {
  return "CMD" + Math.floor(Math.random() * 100000);
}

// Preview Photo
function previewPhoto(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      uploadedPhoto = e.target.result;
      document.getElementById("photoPreview").src = uploadedPhoto;
    };
    reader.readAsDataURL(file);
  }
}

// Add / Update Commando
function addOrUpdateCommando() {
  const id = document.getElementById("commandoId").value || generateId();
  const name = document.getElementById("name").value.trim();
  const rank = document.getElementById("rank").value.trim();
  const location = document.getElementById("location").value.trim();
  const mission = document.getElementById("mission").value.trim();

  if (!name || !rank || !location || !mission || !uploadedPhoto) {
    alert("⚠️ Please fill all fields and upload a photo!");
    return;
  }

  const commando = { id, name, rank, location, mission, photo: uploadedPhoto };

  if (editIndex === null) {
    commandos.push(commando);
    alert("✅ Commando added successfully!");
  } else {
    commandos[editIndex] = commando;
    alert("✏️ Commando updated!");
    editIndex = null;
    document.getElementById("addBtn").innerText = "Add";
    document.getElementById("cancelEditBtn").style.display = "none";
  }

  localStorage.setItem("commandos", JSON.stringify(commandos));
  renderCommandos(); // ✅ refresh immediately
  clearForm();
}

// Render all Commandos
function renderCommandos() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  if (commandos.length === 0) {
    list.innerHTML = "<p>No commandos added yet.</p>";
    return;
  }

  commandos.forEach((c, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${c.photo}" width="60" height="60" style="border-radius:50%;object-fit:cover;"> 
      <strong>${c.name}</strong> (${c.rank})<br>
      Location: ${c.location}<br>
      Mission: ${c.mission}<br>
      <button onclick="editCommando(${i})">✏️ Edit</button>
      <button onclick="deleteCommando(${i})">🗑️ Delete</button>
    `;
    list.appendChild(li);
  });
}

// Edit Commando
function editCommando(i) {
  const c = commandos[i];
  document.getElementById("commandoId").value = c.id;
  document.getElementById("name").value = c.name;
  document.getElementById("rank").value = c.rank;
  document.getElementById("location").value = c.location;
  document.getElementById("mission").value = c.mission;
  document.getElementById("photoPreview").src = c.photo;
  uploadedPhoto = c.photo;
  editIndex = i;
  document.getElementById("addBtn").innerText = "Update";
  document.getElementById("cancelEditBtn").style.display = "inline-block";
}

// Delete Commando
function deleteCommando(i) {
  if (!confirm("Delete this commando?")) return;
  commandos.splice(i, 1);
  localStorage.setItem("commandos", JSON.stringify(commandos));
  renderCommandos();
}

// Clear Form
function clearForm() {
  document.querySelectorAll("#name,#rank,#location,#mission,#commandoId").forEach(el => el.value = "");
  document.getElementById("photoUpload").value = "";
  document.getElementById("photoPreview").src = "";
  uploadedPhoto = "";
}

// Logout (common)
function logout() {
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("isUser");
  window.location.href = "logout_success.html";
}

// Initialize view
renderCommandos();
</script>
