const monedaSelect = document.querySelector('#moneda');
const criptomonedasSelect = document.querySelector('#criptomonedas');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

document.addEventListener('DOMContentLoaded', () => {
    consultarCiptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    monedaSelect.addEventListener('change', leerValor);
    criptomonedasSelect.addEventListener('change', leerValor);
});

const obtenerCriptomonedas = criptomonedas => new Promise(resolve =>{
    resolve(criptomonedas);
})

async function consultarCiptomonedas(){
 const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
 
//  fetch(url)
//     .then(respuesta => respuesta.json())
//     .then(resultado => obtenerCriptomonedas(resultado.Data))
//     .then(criptomonedas => selectCroptomeonedas(criptomonedas));

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await obtenerCriptomonedas(resultado.Data);
        selectCroptomeonedas(criptomonedas);
    } catch (error) {
        console.error(error);
    }
}

function selectCroptomeonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
    e.preventDefault();
    const {moneda, criptomoneda} = objBusqueda;

    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta("todos los campos son obligatorios");

        return;
    }

    consultarAPI();
}

async function consultarAPI() {
    const {moneda, criptomoneda} = objBusqueda;
    url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    mostrarSpinner();
    // fetch(url)
    //     .then(respuesta => respuesta.json())
    //     .then(cotizacion => {
    //         mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
    //     });
    try {
        const respuesta = await fetch(url);
        const cotizacion = await respuesta.json();
        mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
    } catch (error) {
        console.error(error);
    }
}

function mostrarCotizacionHTML(cotizacion) {
    resultado.innerHTML = '';
    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Precio más alto del día: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Precio más bajo del día: <span>${LOWDAY}</span>`;

    const cambio = document.createElement('p');
    cambio.innerHTML = `<p>Porcentaje de cambio en las últimas 24 horas: <span>${CHANGEPCT24HOUR} %</span>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `<p>Actualizado por última vez: <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(cambio);
    resultado.appendChild(ultimaActualizacion);
}

function mostrarAlerta(msg) {
    const existeAlerta = document.querySelector('.alerta');
    if (!existeAlerta) {
        const alerta = document.createElement('p');
        alerta.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'border-red-400', 'text-red-700', 'bg-red-100', 'alerta', 'error');

        alerta.innerHTML = `
        <strong class="font-bold">Error!!</strong>
        <span class="block">${msg}</span>
    `;

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function mostrarSpinner() {
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML = 
    `   <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;
    resultado.appendChild(spinner);
}