const thisForm = document.getElementById('myForm');
  thisForm.addEventListener('submit', async function (e) {
    alert('Спасибо за отзыв!');
    e.preventDefault();
    const formData = new FormData(thisForm).entries()
    const response = await fetch('https://tutor-site-feedback-service.glitch.me/v1/feedback/postFeedback', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(Object.fromEntries(formData))
    });
});

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;

}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

session = getCookie("session");
var isAuthorized = false;
var fullName = "";

if (!(session === null))
  if (!(session.length === 0))
{
  response = fetch("https://tutor-site-users-service.glitch.me/v1/users/getUser", {
           method: 'GET',
           headers: { 'Content-Type': 'application/json', 'Authorization': session }
       }).then(response => response.json()).then(json => { 
      document.getElementById("welcome").textContent="Добро пожаловать, " + json["firstname"] +
      " " + json["lastname"];document.getElementById("login").textContent="Выйти";
      document.getElementById("login").href='javascript:{eraseCookie("session");window.location.reload()}';
      isAuthorized = true;fullName = json["firstname"] + " " + json["lastname"];  });
}

document.cookie = 'User-Agent=tutor-site; path=/';

const navbar = document.querySelector(".navbar");
navbar.querySelector(".toggle").addEventListener("click", () => {
  navbar.classList.toggle("collapsed");
});
window.addEventListener("scroll", e => {
  let windowY = window.pageYOffset;
  let navbarHeight = document.querySelector(".navbar").offsetHeight;
  if (windowY > navbarHeight) navbar.classList.add("sticky");
  else navbar.classList.remove("sticky");
});