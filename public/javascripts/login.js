const submit = document.getElementById("submit-button");
const passIcon = document.getElementById("passIcon");
const usernamePasswordAlert = document.getElementById("usernamePasswordAlert");
const password = document.getElementById("password");

submit.addEventListener("click", () => {
  const formData = $("#loginForm").serializeArray();
  var data = {};
  data.username = formData[0].value;
  data.password = formData[1].value;
  var http = new XMLHttpRequest();
  http.open("POST", "/users/login", true);
  http.setRequestHeader("Content-Type", "application/json");
  http.onload = () => {
    var res = JSON.parse(http.responseText);
    if (http.status == "200" && http.readyState == 4) {
      window.location.href = res.redirectUrl;
    }
  };
  http.send(JSON.stringify(data));
});

passIcon.addEventListener("click", () => {
  if (passIcon.classList.contains("fa-eye")) {
    passIcon.classList.remove("fa-eye");
    passIcon.classList.add("fa-eye-slash");
    password.setAttribute("type", "password");
  } else {
    passIcon.classList.remove("fa-eye-slash");
    passIcon.classList.add("fa-eye");
    password.setAttribute("type", "text");
  }
});

usernamePasswordAlert.addEventListener("click", () => {
  usernamePasswordAlert.alert("close");
  usernamePasswordAlert.alert("dispose");
});
