// Common Logout Function (used in both dashboards)
function logout() {
  if (localStorage.getItem("isAdmin")) {
    localStorage.removeItem("isAdmin");
  }
  if (localStorage.getItem("isUser")) {
    localStorage.removeItem("isUser");
  }
  window.location.href = "logout_success.html";
}
