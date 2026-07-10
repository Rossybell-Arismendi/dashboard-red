// Datos de dispositivos
const dispositivos = [
  { nombre: 'Router Principal', ip: '192.168.1.1', latencia: 2 },
  { nombre: 'Switch Core', ip: '192.168.1.2', latencia: 5 },
  { nombre: 'Servidor Web', ip: '192.168.1.10', latencia: 8 },
  { nombre: 'Servidor DNS', ip: '192.168.1.11', latencia: 3 },
  { nombre: 'Access Point 1', ip: '192.168.1.20', latencia: 12 },
  { nombre: 'Access Point 2', ip: '192.168.1.21', latencia: 15 },
  { nombre: 'Cámara IP 1', ip: '192.168.1.30', latencia: 20 },
  { nombre: 'Impresora Red', ip: '192.168.1.40', latencia: 25 },
];

// Datos iniciales del gráfico (últimos 10 segundos)
const etiquetas = ['10s', '9s', '8s', '7s', '6s', '5s', '4s', '3s', '2s', '1s'];
const datosEntrada = [45, 62, 38, 71, 55, 83, 49, 67, 72, 58];
const datosSalida = [23, 35, 19, 42, 31, 55, 28, 39, 45, 33];

// Crear gráfico
const ctx = document.getElementById('grafico').getContext('2d');
const grafico = new Chart(ctx, {
  type: 'line',
  data: {
    labels: etiquetas,
    datasets: [
      {
        label: 'Entrada (Mbps)',
        data: datosEntrada,
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0,212,255,0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#00d4ff',
      },
      {
        label: 'Salida (Mbps)',
        data: datosSalida,
        borderColor: '#00ff88',
        backgroundColor: 'rgba(0,255,136,0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#00ff88',
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: 'rgba(255,255,255,0.7)', font: { size: 12 } }
      }
    },
    scales: {
      x: {
        ticks: { color: 'rgba(255,255,255,0.5)' },
        grid: { color: 'rgba(255,255,255,0.05)' }
      },
      y: {
        ticks: { color: 'rgba(255,255,255,0.5)' },
        grid: { color: 'rgba(255,255,255,0.05)' },
        beginAtZero: true
      }
    }
  }
});

// Función para número aleatorio en rango
function aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Renderizar tabla de dispositivos
function renderizarTabla() {
  const tbody = document.getElementById('tabla-dispositivos');
  tbody.innerHTML = '';
  let online = 0;
  let totalLatencia = 0;

  dispositivos.forEach(d => {
    const estaOnline = Math.random() > 0.15;
    const latenciaActual = estaOnline ? aleatorio(d.latencia - 2, d.latencia + 10) : 0;
    if (estaOnline) { online++; totalLatencia += latenciaActual; }

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${d.nombre}</td>
      <td style="font-family: monospace; color: rgba(255,255,255,0.5)">${d.ip}</td>
      <td>${estaOnline ? latenciaActual + ' ms' : '—'}</td>
      <td><span class="${estaOnline ? 'estado-online' : 'estado-offline'}">
        ${estaOnline ? '● Online' : '● Offline'}
      </span></td>
    `;
    tbody.appendChild(fila);
  });

  // Actualizar tarjetas
  const trafico = aleatorio(40, 90);
  document.getElementById('stat-online').textContent = online + '/' + dispositivos.length;
  document.getElementById('stat-trafico').textContent = trafico + ' Mbps';
  document.getElementById('stat-latencia').textContent = online > 0 ? Math.floor(totalLatencia / online) + ' ms' : '—';

  return trafico;
}

// Actualizar gráfico en tiempo real
function actualizarGrafico(trafico) {
  grafico.data.labels.shift();
  grafico.data.labels.push('ahora');
  grafico.data.datasets[0].data.shift();
  grafico.data.datasets[0].data.push(trafico);
  grafico.data.datasets[1].data.shift();
  grafico.data.datasets[1].data.push(aleatorio(20, 50));
  grafico.update();
}

// Actualización inicial
let trafico = renderizarTabla();
actualizarGrafico(trafico);

// Actualizar cada 3 segundos
setInterval(() => {
  trafico = renderizarTabla();
  actualizarGrafico(trafico);
}, 3000);