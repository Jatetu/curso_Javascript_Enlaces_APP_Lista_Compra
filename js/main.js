// 1º VARIABLES
const articulo = document.getElementById("articulo");
const cantidad = document.querySelector("#cantidad"); //permite direccionar por lo que sea
const prioridad = document.querySelector("#prioridad");
const agregar = document.querySelector("#agregar");
const limpiar = document.querySelector("#reset");
const formulario = document.querySelector("#formulario");
let listado = [];
const listaCompra = document.querySelector("#listacompra");

//2º FUNCIONES
const comprobarInput = () => {
  // console.log(`Input: ${articulo.value} - ${articulo.value.length}`);
  if (articulo.value.length === 0) {
    agregar.disabled = true;
  } else {
    agregar.disabled = false;
  }
};

const barraProgreso = list => {
  let contador = 0;
  for (let k = 0; k < list.length; k++) {
    if (list[k].estado === true) contador++;
  }
  let progreso = (contador / list.length) * 100;

  return progreso;
};

const cambiaColorBarra = miraBarra => {
  let colorBarra;
  if (miraBarra === 100) colorBarra = "bg-success";
  else if (miraBarra >= 50 && miraBarra < 100) colorBarra = "bg-info";
  else colorBarra = "bg-warning";

  return colorBarra;
};

const crearLista = (art, cant, prior) => {
  //como elemento es un objeto, entre llaves
  let elemento = {
    articulo: art,
    cantidad: cant,
    liClase: "alert alert-warning",
    estado: false,
    prioridad: prior,
    id: Math.random()
      .toString()
      .substring(2, 9)
  };
  listado.push(elemento); //para agregar el elemento al listado
  console.log(listado);
};

const mostrarLista = () => {
  listaCompra.innerHTML = "";
  //comprobar cuántos elementos en la lista para pintarlos
  if (listado.length === 0) {
    // el html ese es para llamar al plug-in que colorea entre comillas
    listaCompra.innerHTML = /*html*/ `<div class="alert alert-danger">  
    <i class="material-icons align-middle">
        list
        </i>  La lista está vacía.</div>`;
  } else {
    //pintar barra progreso
    listaCompra.innerHTML =
      /*html*/

      `<div class="progress mt-2 mb-4">
    <div class="progress-bar ${cambiaColorBarra(
      barraProgreso(listado)
    )}"  role="progressbar"  aria-valuenow="${barraProgreso(listado)}"
    aria-valuemin="0" aria-valuemax="100" style="width:${barraProgreso(
      listado
    )}%">
    ${Math.round(barraProgreso(listado))}%
    </div>  
    </div>`;

    //pintar lista
    for (let i = 0; i < listado.length; i++) {
      listaCompra.innerHTML +=
        /*html*/
        `<div class="${listado[i].liClase}" id="${listado[i].id}"> 
          <ul class="list-group ">
            <li class="list-group-item" > <i class="material-icons align-middle">list</i> 
               <b>  ${
                 listado[i].articulo
               } </b>-  <span class="badge badge-primary"> ${
          listado[i].cantidad
        }</span> 
          <span style="padding: 1px;  color: blue; border-radius: 10%">
            ${listado[i].prioridad}
          </span>
       
        <span id="identificador" style="display: none">${listado[i].id}</span>

        <i class="material-icons align-middle float-right" style="font-size:1.4em; cursor:pointer">delete</i>
        <i class="material-icons align-middle float-right mr-3" style="font-size:1.4em; cursor:pointer">done_outline</i>
            </li>
           
          </ul>

        </div>`;
    }
  }
};

const guardarActualizar = () => {
  //guardar lista en localStorage
  localStorage.setItem("listaStorage", JSON.stringify(listado)); // transformamos array lista en string con JSON.stringify

  cambiaColorBarra(barraProgreso(listado));

  mostrarLista();
};

//(e) es e de evento - al haber un único parámetro, le ha quitado el paréntesis
const agregarArticulo = e => {
  e.preventDefault(); //para que no refresque toda la página
  crearLista(articulo.value, cantidad.value, prioridad.value);
  guardarActualizar();
  formulario.value = "";
  comprobarInput();
};

const eliminarElemento = identificador => {
  let posicion;

  for (let j = 0; j < listado.length; j++) {
    if (listado[j].id === identificador) {
      posicion = j;
    }
  }
  listado.splice(posicion, 1); //quitar de la lista el elemento de posición j
  guardarActualizar();
};

const cambiarEstado = identificador => {
  let posicionCambiar;

  for (let j = 0; j < listado.length; j++) {
    if (listado[j].id === identificador) {
      posicionCambiar = j;
    }
  }
  if (listado[posicionCambiar].estado === false) {
    listado[posicionCambiar].estado = true;
    listado[posicionCambiar].liClase = "alert alert-success";
  } else {
    listado[posicionCambiar].estado = false;
    listado[posicionCambiar].liClase = "alert alert-warning";
  }

  guardarActualizar();
};

const actuar = e => {
  //console.log(e);
  if (e.target.innerHTML.trim() === "delete") {
    console.log(e.path[1].children[4].innerHTML);
    eliminarElemento(e.path[1].children[4].innerHTML);
  }

  if (e.target.innerHTML.trim() === "done_outline") {
    console.log(e.target.id);
    console.log(e.path[1].children[4].innerHTML);
    cambiarEstado(e.path[1].children[4].innerHTML);
  }
};

const inicializar = () => {
  comprobarInput();
  if (localStorage.getItem("listaStorage") !== null) {
    listado = JSON.parse(localStorage.getItem("listaStorage"));
  }
  mostrarLista();
};

const limpiarLista = e => {
  localStorage.clear();
};

//3º EVENTOS

//evento de inicialización
document.addEventListener("DOMContentLoaded", inicializar);

//evento cuanto se pulse tecla
articulo.addEventListener("keyup", comprobarInput); //evento key - lo que sea con una tecla

//evento cuando se pulse botón Añadir
agregar.addEventListener("click", agregarArticulo);

//evento cuando se pulse botón Limpiar
limpiar.addEventListener("click", limpiarLista);

//evento cuando se pulsa en algún artículo de la lista (zona verde)
listaCompra.addEventListener("click", actuar);
