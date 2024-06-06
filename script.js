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
const ws = new WebSocket('wss://tutor-site-websocket.glitch.me');
ws.binaryType = "blob";
// Log socket opening and closing
ws.addEventListener("open", event => {
    console.log("Websocket connection opened");
});
ws.addEventListener("close", event => {
    console.log("Websocket connection closed");
});
ws.onmessage = function (message) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('msgCtn');
    msg = document.getElementById('messages');
    if (message.data instanceof Blob) {
        reader = new FileReader();
        reader.onload = () => {
            msgDiv.innerHTML = reader.result;
            document.getElementById('messages').insertBefore(msgDiv, msg.children[0]);
        };
        reader.readAsText(message.data);
    } else {
        console.log("Result2: " + message.data);
        msgDiv.innerHTML = message.data;
        document.getElementById('messages').insertBefore(msgDiv, msg.children[0]);
    }
}
const form = document.getElementById('msgForm');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    session = getCookie("session");
    if (isAuthorized)
    {
      const message = document.getElementById('inputBox').value;
	  if (message !== ""){
      fetch("https://tutor-site-social-service.glitch.me/v1/social/saveComment",
      {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: '{"name":"' + fullName + '", "text":"' + message +'"}'
      })
      ws.send("<p style='color:#3e5a70;padding-up:300px;font-size: 2rem;line-height: 0px;'>" 
              + fullName + "<p>" + message);
      document.getElementById('inputBox').value = ''}
	  else {
			alert("Невозможно отправить пустое сообщение!");
			return;
		}
    }
    else
      {
        alert("Необходима авторизация!");
        return;
      }
})

fetch("https://tutor-site-social-service.glitch.me/v1/social/getComments", {
     method: 'GET',
     headers: { 'Content-Type': 'application/json'}
 }).then(response => response.json()).then(json => {for (i = 19; i >= 0; i--)
    {
      const msgDiv = document.createElement('div');
      msgDiv.classList.add('msgCtn');
      msgDiv.innerHTML = "<p style='color:#3e5a70;padding-up:300px;font-size: 2rem;line-height: 0px;'>" 
        + json[i.toString()]["name"] + "<p>" + json[i.toString()]["text"]
      document.getElementById('messages').insertBefore(msgDiv, document.getElementById('messages').children[0]);
    }})
	
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
