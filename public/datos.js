let propiedades = {
  pic: document.getElementById("pic"),
  name: document.getElementById("name"),
  btt: document.getElementById("login"),
  off: document.getElementById("logout"),
  usuario: {},
  pushMensaje: document.getElementById("pushmensaje"),
  mensaje: document.getElementById("mensaje"),
  mensajes: document.getElementById("mensajes"),
  contenedorM: document.getElementById("mensajesContainer"),
  nickiname: document.getElementById("nickname"),
  scrollear: document.querySelectorAll("li"),
  escuchar: {
    escuche: false,
  },
};

let eventos = {
  login: function () {
    propiedades.btt.addEventListener("click", metodos.logGoogle);
  },
  deslogueo: function () {
    propiedades.off.addEventListener("click", metodos.Desloguear);
  },
  pushear: function () {
    propiedades.pushMensaje.addEventListener("click", metodos.Guardarmensaje);
  },
};

let metodos = {
  logGoogle: function () {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        propiedades.usuario = result;
        console.log(propiedades.usuario.additionalUserInfo.isNewUser);
        metodos.LookUser(propiedades.usuario);
      })
      .catch((error) => console.log(error.message));

    if (propiedades.usuario.email !== "") {
      propiedades.btt.style.display = "none";
      propiedades.off.style.display = "block";
    } else {
      propiedades.btt.style.display = "block";
      propiedades.off.style.display = "none";
    }
  },

  Desloguear: function () {
    firebase
      .auth()
      .signOut()
      .then(function () {})
      .catch(function (error) {
        console.log(error);
      });

    if (propiedades.usuario !== "") {
      propiedades.btt.style.display = "block";
      propiedades.off.style.display = "none";
      propiedades.name.innerHTML = "Deslogueado!";
      propiedades.pic.src = "https://hydra.bot/img/avatars/jpg/xavin.jpg";
      propiedades.contenedorM.style.display = "none";
      setTimeout(function () {
        location.reload();
      }, 2000);
    }
  },

  LookUser: function (datos) {
    if (propiedades.usuario.user !== "") {
      propiedades.btt.style.display = "none";
      propiedades.off.style.display = "block";
      propiedades.name.innerHTML = datos.user.displayName;
      propiedades.pic.src = datos.user.photoURL;
      propiedades.usuario.user.email;
      propiedades.contenedorM.style.display = "block";
      metodos.RecuperarMensajes();
    }
  },

  Logueadin: function () {
    document.addEventListener("DOMContentLoaded", () => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          propiedades.usuario.user = user;
          metodos.LookUser(propiedades.usuario);
        }
      });
    });
  },

  Guardarmensaje: function () {
    const records = {
      avatar: propiedades.usuario.user.photoURL,
      nickname: propiedades.usuario.user.displayName,
      txt: propiedades.mensaje.value,
    };

    var based = firebase.database();
    const dbRef = based.ref("mensajes");
    const newMsg = dbRef.push();
    newMsg.set(records);
    propiedades.mensaje.value = "";
  },

  RecuperarMensajes: function () {
    const db = firebase.database();
    const dbRef = db.ref("mensajes");
    dbRef.on("child_added", (snapshot) => {
      let item = document.createElement("li");
      console.log(snapshot.val());
      item.innerHTML =
        `<strong id="nickname">${snapshot.val().nickname}</strong>` +
        ":" +
        " " +
        snapshot.val().txt;
      propiedades.mensajes.appendChild(item);
    });
  },
};

metodos.Logueadin();
eventos.login();
eventos.deslogueo();
eventos.pushear();
eventos.pushInit();
