const form = document.getElementById("form");

form.addEventListener("submit", formSubmit);

function formSubmit(e) {
  var isvalid = $("#form").valid();
  if (isvalid) {
  e.preventDefault()

  const formData = new FormData(form);
  formData.delete("reppassword")
  fetch("https://tutor-site-users-service.glitch.me/v1/users/addUser",
  {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(Object.fromEntries(formData.entries()))
  })
    .then(response => {if (response.status==200) {alert("Успешно!");window.location.href = "/auth.html"} else alert("Не удалось зарегистрироваться")})
    .catch(error => alert("Произошла ошибка"))
}}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

const lform = document.getElementById("login_form");

lform.addEventListener("submit", formSubmitLogin);

function formSubmitLogin(e) {
  e.preventDefault()

  const formData = new FormData(lform);
  fetch("https://tutor-site-users-service.glitch.me/v1/users/authorize",
  {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(Object.fromEntries(formData.entries()))
  })
  .then(response => {if (response.status==200) 
                    {alert("Успешно!");
                    response.text().then(text => {setCookie("session", text, 30);});
                    window.location.href = "/";
                    }
                    else alert("Не удалось войти")})
  .catch(error => console.log(error))
}

jQuery.validator.addMethod("isName", function(value, element) {
    return this.optional(element) || ((/^[а-я]+$/.test(value.substring(1))) && (/^[А-Я]+$/.test(value[0])));
}, "Поле дожно быть заполнено только буквами на русском языке и иметь большую букву только в начале.");

$(function(){
  $('#form').validate({
    rules: {
      name: {
        required: true,
        minlength: 2,
        isName: true
      },
      lastname: {
        required: true,
        minlength: 2,
        isName: true
      },
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 8,
        maxlength: 20
      },
      reppassword: {
        required: true,
        minlength: 8,
        maxlength: 20,
        equalTo: '#password'
      }
    },
    messages: {
      name: {
        required: "Поле 'Имя' обязательно к заполнению",
        minlength: "Введите не менее 2-х символов в поле 'Имя'"
      },
      lastname: {
        required: "Поле 'Фамилия' обязательно к заполнению",
        minlength: "Введите не менее 2-х символов в поле 'Фамилия'"
      },
      email: {
        required: "Поле 'Email' обязательно к заполнению",
        email: "Необходим формат адреса email"	
      },
      password: {
        required: "Поле 'Пароль' обязательно к заполнению",
        minlength: "Введите не менее 8-ти символов в поле 'Пароль'",
        maxlength: "Введите не более 20-ти символов в поле 'Пароль'"
      },
      reppassword: {
        required: "Введите пароль повторно",
        minlength: "Введите не менее 8-ти символов в поле",
        maxlength: "Введите не более 20-ти символов в поле",
        equalTo: "Пароли не совпадают"
      }
    }
  });
});

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