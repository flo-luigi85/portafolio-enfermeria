console.log("El archivo JS está conectado correctamente");

const btnMenu = document.getElementById('menu-btn');
const menuNavegacion = document.getElementById('menu');

if (btnMenu && menuNavegacion) {
  btnMenu.addEventListener('click', () => {
    menuNavegacion.classList.toggle('hidden');
  });
}

// --- Modal Lightbox para imágenes (.img-ampliable) ---
const modalImagen = document.getElementById('modal-imagen');
const imagenModalSrc = document.getElementById('imagen-modal-src');
const cerrarModal = document.getElementById('cerrar-modal');

if (modalImagen && imagenModalSrc) {
  document.addEventListener('click', (e) => {
    const img = e.target.closest('.img-ampliable');
    if (img) {
      imagenModalSrc.src = img.src;
      imagenModalSrc.alt = img.alt || 'Vista ampliada';
      modalImagen.classList.remove('hidden');
    }
  });

  if (cerrarModal) {
    cerrarModal.addEventListener('click', () => {
      modalImagen.classList.add('hidden');
    });
  }

  modalImagen.addEventListener('click', (e) => {
    if (e.target === modalImagen) {
      modalImagen.classList.add('hidden');
    }
  });
}

// --- Carrito flotante ---
const carritoFlotante = document.getElementById('carrito-flotante');
const contadorCarrito = document.getElementById('contador-carrito');
const btnEnviarWhatsapp = document.getElementById('btn-enviar-whatsapp');
const carrito = [];

function agregarAlCarrito(nombre, cantidad) {
  const existente = carrito.find((item) => item.nombre === nombre);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({ nombre, cantidad });
  }

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  if (contadorCarrito) contadorCarrito.textContent = `${totalItems} producto(s)`;
  if (carritoFlotante) carritoFlotante.classList.remove('hidden');
}

document.addEventListener('click', (e) => {
  const btnAgregar = e.target.closest('.agregar-carrito');
  if (!btnAgregar) return;

  const nombre = btnAgregar.dataset.nombre || 'Producto';
  const contenedorAcciones = btnAgregar.parentElement;
  const inputCantidad = contenedorAcciones ? contenedorAcciones.querySelector('.cantidad-input') : null;
  const cantidad = Math.max(1, parseInt(inputCantidad?.value, 10) || 1);

  agregarAlCarrito(nombre, cantidad);
});

if (btnEnviarWhatsapp) {
  btnEnviarWhatsapp.addEventListener('click', () => {
    if (carrito.length === 0) return;
    const detalle = carrito.map((item) => `- ${item.nombre} (x${item.cantidad})`).join('\n');
    const mensaje = encodeURIComponent(`Hola! Quisiera consultar por el siguiente pedido:\n${detalle}`);
    window.open(`https://wa.me/?text=${mensaje}`, '_blank');
  });
}

// --- Consumo de Fake Store API ---
const API_URL = 'https://fakestoreapi.com/products?limit=8';

async function cargarProductosApi() {
  const contenedor = document.getElementById('catalogo-api');
  const estadoApi = document.getElementById('estado-api');
  if (!contenedor) return;

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

    const productos = await res.json();
    if (estadoApi) estadoApi.remove();

    const fragmento = document.createDocumentFragment();
    productos.forEach((producto) => {
      fragmento.appendChild(crearTarjetaApi(producto));
    });

    contenedor.innerHTML = '';
    contenedor.appendChild(fragmento);
  } catch (error) {
    console.error('Error al consumir Fake Store API:', error);
    if (estadoApi) {
      estadoApi.textContent = 'No se pudieron cargar los productos de la API.';
      estadoApi.classList.replace('text-slate-500', 'text-red-600');
    }
  }
}

function crearTarjetaApi(producto) {
  const card = document.createElement('div');
  card.className =
    'bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between relative group';

  const badge = document.createElement('span');
  badge.className = 'badge-disponible';
  badge.textContent = `$${Number(producto.price).toFixed(2)}`;

  const body = document.createElement('div');

  const imgBox = document.createElement('div');
  imgBox.className =
    'h-48 w-full overflow-hidden rounded-xl mb-4 bg-white flex items-center justify-center p-2 cursor-zoom-in relative';

  const img = document.createElement('img');
  img.src = producto.image;
  img.alt = producto.title;
  img.loading = 'lazy';
  img.className =
    'h-full w-full object-contain img-ampliable transition duration-300 group-hover:scale-105';
  imgBox.appendChild(img);

  const titulo = document.createElement('h3');
  titulo.className = 'text-sm font-bold text-slate-800 text-center mb-1 line-clamp-2';
  titulo.textContent = producto.title;

  const desc = document.createElement('p');
  desc.className = 'text-slate-500 text-xs text-center mb-4 line-clamp-2 min-h-[32px]';
  desc.textContent = producto.description;

  body.append(imgBox, titulo, desc);

  const footer = document.createElement('div');
  footer.className = 'flex items-center gap-2 pt-2 border-t border-slate-100';

  const inputCantidad = document.createElement('input');
  inputCantidad.type = 'number';
  inputCantidad.min = '1';
  inputCantidad.value = '1';
  inputCantidad.className =
    'cantidad-input w-12 text-center border border-slate-300 rounded-xl py-2 text-sm font-bold text-slate-700 focus:outline-indigo-500';

  const btnAgregar = document.createElement('button');
  btnAgregar.type = 'button';
  btnAgregar.className = 'btn-agregar agregar-carrito';
  btnAgregar.dataset.nombre = producto.title;
  btnAgregar.textContent = '🛒 Agregar';

  footer.append(inputCantidad, btnAgregar);
  card.append(badge, body, footer);

  return card;
}

document.addEventListener('DOMContentLoaded', cargarProductosApi);

