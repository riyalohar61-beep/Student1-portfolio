const defaultAssignments = [
  { id: 1, title: "Assignment 1", name: "Personal Blog Website", fileUrl: "", fileName: "" },
  { id: 2, title: "Assignment 2", name: "To-Do List Application", fileUrl: "", fileName: "" },
  { id: 3, title: "Assignment 3", name: "API Service Engine (Blog Router)", fileUrl: "", fileName: "" },
  { id: 4, title: "Assignment 4", name: "Weather/Media dashboard", fileUrl: "", fileName: "" },
  { id: 5, title: "Assignment 5", name: "MERN Customer Registry Engine", fileUrl: "", fileName: "" }
];

let assignmentsData = JSON.parse(localStorage.getItem("_student_assignments")) || defaultAssignments;
let activeAssignmentId = 1;

document.addEventListener("DOMContentLoaded", () => {
  initMainNavigation();
  initProjectTabs();
  renderAssignmentsSidebar();
  loadActiveAssignment();
  initDragDropzone();
});

function initMainNavigation() {
  document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-target");
      document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      document.querySelectorAll(".section-pane").forEach(pane => {
        pane.classList.remove("active");
        if (pane.id === target) pane.classList.add("active");
      });
    });
  });
}

function switchSection(sectionId) {
  const targetHeaderButton = document.querySelector(`.nav-btn[data-target="${sectionId}"]`);
  if (targetHeaderButton) targetHeaderButton.click();
}

function initProjectTabs() {
  document.querySelectorAll(".inner-tab").forEach(button => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab");
      document.querySelectorAll(".inner-tab").forEach(tab => tab.classList.remove("active"));
      button.classList.add("active");
      document.querySelectorAll(".tab-pane").forEach(pane => {
        pane.classList.remove("active");
        if (pane.id === targetTab) pane.classList.add("active");
      });
    });
  });
}

function previewLocalDiagram(input) {
  const box = document.getElementById("image-viewer-box");
  if (input.files && input.files[0] && box) {
    const reader = new FileReader();
    reader.onload = (e) => {
      box.innerHTML = `<img src="${e.target.result}" style="max-width:100%; max-height:220px; object-fit:contain; border-radius:8px;">`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function renderAssignmentsSidebar() {
  const container = document.getElementById("assignment-tabs-container");
  if (!container) return;
  container.innerHTML = "";
  assignmentsData.forEach(assignment => {
    const isEditingActive = assignment.id === activeAssignmentId;
    const button = document.createElement("button");
    button.className = `assignment-tab-link ${isEditingActive ? 'active' : ''}`;
    button.onclick = () => {
      activeAssignmentId = assignment.id;
      renderAssignmentsSidebar();
      loadActiveAssignment();
    };
    button.innerHTML = `
      <span class="tab-link-badge">${assignment.title}</span>
      <span class="tab-link-name">${assignment.name}</span>
    `;
    container.appendChild(button);
  });
}

function loadActiveAssignment() {
  const activeObj = assignmentsData.find(a => a.id === activeAssignmentId);
  if (!activeObj) return;
  document.getElementById("current-work-title").value = activeObj.title;
  document.getElementById("current-work-name").value = activeObj.name;
  updateFileAttachmentUI(activeObj);
}

function updateFileAttachmentUI(assignment) {
  const dropzone = document.getElementById("assignment-dropzone");
  const preview = document.getElementById("file-preview-card");
  const previewName = document.getElementById("preview-file-name");
  if (assignment.fileUrl) {
    dropzone.style.display = "none";
    preview.classList.remove("hidden");
    previewName.textContent = assignment.fileName;
  } else {
    dropzone.style.display = "flex";
    preview.classList.add("hidden");
  }
}

function syncActiveAssignmentTitle(input) {
  const activeObj = assignmentsData.find(a => a.id === activeAssignmentId);
  if (activeObj) {
    activeObj.title = input.value;
    localStorage.setItem("_student_assignments", JSON.stringify(assignmentsData));
    renderAssignmentsSidebar();
  }
}

function syncActiveAssignmentName(input) {
  const activeObj = assignmentsData.find(a => a.id === activeAssignmentId);
  if (activeObj) {
    activeObj.name = input.value;
    localStorage.setItem("_student_assignments", JSON.stringify(assignmentsData));
    renderAssignmentsSidebar();
  }
}

function initDragDropzone() {
  const dropzone = document.getElementById("assignment-dropzone");
  if (!dropzone) return;
  ["dragenter", "dragover", "dragleave", "drop"].forEach(name => {
    dropzone.addEventListener(name, (e) => { e.preventDefault(); e.stopPropagation(); }, false);
  });
  dropzone.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files[0];
    if (file) processAttachedFile(file);
  });
}

function triggerAssignmentFileSelector() {
  document.getElementById("assignment-raw-uploader").click();
}

function handleAssignmentFileSelect(input) {
  if (input.files && input.files[0]) processAttachedFile(input.files[0]);
}

function processAttachedFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const activeObj = assignmentsData.find(a => a.id === activeAssignmentId);
    if (activeObj) {
      activeObj.fileUrl = e.target.result;
      activeObj.fileName = file.name;
      localStorage.setItem("_student_assignments", JSON.stringify(assignmentsData));
      loadActiveAssignment();
    }
  };
  reader.readAsDataURL(file);
}

function clearAttachedAssignmentFile() {
  const activeObj = assignmentsData.find(a => a.id === activeAssignmentId);
  if (activeObj) {
    activeObj.fileUrl = "";
    activeObj.fileName = "";
    localStorage.setItem("_student_assignments", JSON.stringify(assignmentsData));
    loadActiveAssignment();
  }
}