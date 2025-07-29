document.querySelectorAll('.item-card').forEach(card => {
  const minus = card.querySelector('.minus');
  const plus = card.querySelector('.plus');
  const input = card.querySelector('input[type="number"]');

  minus.addEventListener('click', () => {
    let val = parseInt(input.value, 10) || 0;
    if (val > 0) input.value = val - 1;
    else input.value = 0;
  });

  plus.addEventListener('click', () => {
    let val = parseInt(input.value, 10) || 0;
    if (val < 999) input.value = val + 1;
    else input.value = 999;
  });

  input.addEventListener('input', () => {
    let val = parseInt(input.value, 10);
    if (isNaN(val) || val < 0) input.value = 0;
    else if (val > 999) input.value = 999;
  });
});

const orderForm = document.getElementById('orderForm');
const mensajeEnviado = document.getElementById('mensajeEnviado');
const resumenPedido = document.getElementById('resumenPedido');
const listaResumen = document.getElementById('listaResumen');
const confirmarPedido = document.getElementById('confirmarPedido');
const editarPedido = document.getElementById('editarPedido');

orderForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const pedido = [];
  let total = 0;

  document.querySelectorAll('.item-card').forEach(card => {
    const nombre = card.dataset.name;
    const cantidad = parseInt(card.querySelector('input[type="number"]').value, 10) || 0;
    if (cantidad > 0) {
      pedido.push({ nombre, cantidad });
      total += cantidad;  // Puedes añadir precios por producto si lo deseas
    }
  });

  if (pedido.length === 0) {
    alert('Por favor, selecciona al menos un producto.');
    return;
  }

  // Mostrar el resumen del pedido
  listaResumen.innerHTML = '';  // Limpiar lista anterior
  pedido.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.nombre}: ${item.cantidad} unidad(es)`;
    listaResumen.appendChild(li);
  });

  // Mostrar total (opcional, puedes agregar precios reales para el cálculo)
  const liTotal = document.createElement('li');
  liTotal.textContent = `Total: ${total} unidad(es)`;
  listaResumen.appendChild(liTotal);

  // Ocultar el formulario y mostrar el resumen
  orderForm.classList.add('hidden');
  resumenPedido.classList.remove('hidden');

  // Confirmar el pedido
  confirmarPedido.addEventListener('click', () => {
    let mensaje = `¡Hola! Quiero hacer un pedido:\n\n`;
    pedido.forEach(p => mensaje += `• ${p.nombre}: ${p.cantidad} unidad(es)\n`);

    const phone = '59161351203';
    const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappURL, '_blank');

    // Si tienes un Google Apps Script, reemplaza la URL aquí
    fetch('TU_URL_DE_GOOGLE_APPS_SCRIPT', {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pedido: pedido.map(p => `${p.nombre}: ${p.cantidad}`).join(', ')
      })
    });

    // Reseteamos el formulario y mostramos el mensaje
    orderForm.reset();
    document.querySelectorAll('.item-card input[type="number"]').forEach(input => input.value = 0);
    resumenPedido.classList.add('hidden');
    mensajeEnviado.classList.remove('hidden');
  });

  // Permitir editar el pedido
  editarPedido.addEventListener('click', () => {
    resumenPedido.classList.add('hidden');
    orderForm.classList.remove('hidden');
  });
});

mensajeEnviado.addEventListener('click', () => {
  mensajeEnviado.classList.add('hidden');
  orderForm.classList.remove('hidden');
});
