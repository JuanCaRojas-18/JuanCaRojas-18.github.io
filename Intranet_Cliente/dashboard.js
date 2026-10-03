/**
 * BillZen Admin Dashboard — dashboard.js
 * Maneja: autenticación empresa + admin, y CRUD completo de inventario
 * Base URL: http://localhost:8000
 */

const API = 'http://0.0.0.0:8000';

// ─── Estado global ───────────────────────────────────────────────
const state = {
  empresaNit: '',
  empresaToken: null,      // token o datos de sesión retornados por /login/empresa
  adminToken: null,        // token retornado por /login/admin (si existe)
  productos: [],           // catálogo cargado
  filteredProductos: [],
  editingProductoId: null, // para acciones de modal (precio / ingreso / delete)
};

// ─── Helpers de UI ───────────────────────────────────────────────

/** Muestra / oculta un modal */
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

/** Cierra modales al hacer clic en botones data-close */
document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.close));
});

/** Toast notifications */
function showToast(msg, type = 'success') {
  const icons = {
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4AE8A4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    warn:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  };
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<div class="toast-icon-wrap">${icons[type]}</div><div class="toast-text">${msg}</div>`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3800);
}

/** Formatea precio COP */
function formatCOP(val) {
  const n = parseFloat(val);
  if (isNaN(n)) return '—';
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return '$' + (n / 1_000).toFixed(1) + 'K';
  return '$' + n.toFixed(0);
}

/** Pill de stock según cantidad */
function stockPill(stock) {
  if (stock === 0)  return `<span class="stock-pill out">&#9679; Sin stock</span>`;
  if (stock < 10)   return `<span class="stock-pill low">&#9651; ${stock}</span>`;
  return `<span class="stock-pill ok">&#9679; ${stock}</span>`;
}

/** Botón con loading */
function setLoading(btn, yes) {
  if (yes) {
    btn.disabled = true;
    btn.classList.add('loading');
  } else {
    btn.disabled = false;
    btn.classList.remove('loading');
  }
}

/** Mostrar error en auth screen */
function showAuthError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.add('visible');
}
function clearAuthError(id) {
  const el = document.getElementById(id);
  el.textContent = '';
  el.classList.remove('visible');
}

/** Mostrar error en modal */
function showModalError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.add('visible');
}
function clearModalError(id) {
  const el = document.getElementById(id);
  if (el) { el.textContent = ''; el.classList.remove('visible'); }
}

// ─── Headers con token ────────────────────────────────────────────
function authHeaders() {
  const h = { 'Content-Type': 'application/json' };
  const token = state.adminToken || state.empresaToken;
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

// ═══════════════════════════════════════════════════════════════════
// 1. AUTENTICACIÓN
// ═══════════════════════════════════════════════════════════════════

// ── 1.1 Login Empresa ────────────────────────────────────────────
document.getElementById('btn-empresa-login').addEventListener('click', loginEmpresa);
document.getElementById('empresa-pass').addEventListener('keydown', e => { if (e.key === 'Enter') loginEmpresa(); });
document.getElementById('empresa-nit').addEventListener('keydown', e => { if (e.key === 'Enter') loginEmpresa(); });

async function loginEmpresa() {
  clearAuthError('empresa-error');
  const nit      = document.getElementById('empresa-nit').value.trim();
  const password = document.getElementById('empresa-pass').value;
  if (!nit || !password) {
    showAuthError('empresa-error', 'Por favor completa todos los campos.');
    return;
  }

  const btn = document.getElementById('btn-empresa-login');
  setLoading(btn, true);

  try {
    const res = await fetch(`${API}/login/empresa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nit, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      showAuthError('empresa-error', data.detail || data.mensaje || `Error ${res.status}: credenciales inválidas.`);
      return;
    }

    // Guardar datos de empresa
    state.empresaNit   = nit;
    state.empresaToken = data.token || data.access_token || null;

    // Pasar a pantalla de admin
    document.getElementById('screen-empresa').classList.add('hidden');
    document.getElementById('screen-admin').classList.remove('hidden');
    document.getElementById('admin-empresa-label').textContent = data.nombre_empresa || `NIT ${nit}`;

  } catch (err) {
    showAuthError('empresa-error', 'No se pudo conectar con el servidor. Verifica que la API esté activa.');
  } finally {
    setLoading(btn, false);
  }
}

// ── 1.2 Volver desde admin ────────────────────────────────────────
document.getElementById('btn-back-empresa').addEventListener('click', () => {
  document.getElementById('screen-admin').classList.add('hidden');
  document.getElementById('screen-empresa').classList.remove('hidden');
  clearAuthError('admin-error');
});

// ── 1.3 Login Admin ───────────────────────────────────────────────
document.getElementById('btn-admin-login').addEventListener('click', loginAdmin);
document.getElementById('admin-pass').addEventListener('keydown', e => { if (e.key === 'Enter') loginAdmin(); });
document.getElementById('admin-user').addEventListener('keydown', e => { if (e.key === 'Enter') loginAdmin(); });

async function loginAdmin() {
  clearAuthError('admin-error');
  const usuario  = document.getElementById('admin-user').value.trim();
  const password = document.getElementById('admin-pass').value;
  if (!usuario || !password) {
    showAuthError('admin-error', 'Por favor completa todos los campos.');
    return;
  }

  const btn = document.getElementById('btn-admin-login');
  setLoading(btn, true);

  try {
    const res = await fetch(`${API}/login/admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      showAuthError('admin-error', data.detail || data.mensaje || `Error ${res.status}: credenciales inválidas.`);
      return;
    }

    // Guardar token de admin
    state.adminToken = data.token || data.access_token || null;

    // Actualizar UI del sidebar
    const initiales = usuario.substring(0, 2).toUpperCase();
    document.getElementById('sidebar-avatar').textContent   = initiales;
    document.getElementById('sidebar-username').textContent = usuario;
    document.getElementById('topbar-nit').textContent       = `NIT ${state.empresaNit}`;

    // Ocultar pantallas de auth y mostrar dashboard
    document.getElementById('screen-admin').classList.add('hidden');
    document.getElementById('dashboard').classList.add('visible');

    // Cargar catálogo
    cargarProductos();

  } catch (err) {
    showAuthError('admin-error', 'No se pudo conectar con el servidor. Verifica que la API esté activa.');
  } finally {
    setLoading(btn, false);
  }
}

// ── 1.4 Logout ────────────────────────────────────────────────────
document.getElementById('btn-logout').addEventListener('click', () => {
  state.empresaNit   = '';
  state.empresaToken = null;
  state.adminToken   = null;
  state.productos    = [];

  document.getElementById('dashboard').classList.remove('visible');
  document.getElementById('screen-admin').classList.add('hidden');
  document.getElementById('screen-empresa').classList.remove('hidden');

  // Limpiar campos
  document.getElementById('empresa-nit').value  = '';
  document.getElementById('empresa-pass').value = '';
  document.getElementById('admin-user').value   = '';
  document.getElementById('admin-pass').value   = '';

  showToast('Sesión cerrada correctamente.', 'warn');
});

// ═══════════════════════════════════════════════════════════════════
// 2. INVENTARIO
// ═══════════════════════════════════════════════════════════════════

// ── 2.1 GET /productos/ — Cargar catálogo ─────────────────────────
async function cargarProductos() {
  renderLoadingRows();
  try {
    const res  = await fetch(`${API}/productos/`, { headers: authHeaders() });
    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();
    state.productos = Array.isArray(data) ? data : [];
    filtrarYRenderizar();
    actualizarKPIs();
  } catch (err) {
    document.getElementById('products-tbody').innerHTML = `
      <tr><td colspan="7">
        <div class="empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#5c6585" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <p>Error al cargar productos. <strong style="color:var(--accent);cursor:pointer;" onclick="cargarProductos()">Reintentar</strong></p>
        </div>
      </td></tr>`;
    showToast(`Error al cargar catálogo: ${err.message}`, 'error');
  }
}

function renderLoadingRows() {
  const tbody = document.getElementById('products-tbody');
  tbody.innerHTML = Array.from({ length: 5 }).map(() => `
    <tr>
      ${Array.from({ length: 7 }).map(() => `<td><div class="skeleton" style="width:${60+Math.random()*40}%;"></div></td>`).join('')}
    </tr>`).join('');
}

function filtrarYRenderizar() {
  const q = document.getElementById('search-input').value.toLowerCase();
  state.filteredProductos = q
    ? state.productos.filter(p =>
        (p.descripcion || '').toLowerCase().includes(q) ||
        (p.codigo_barras || '').toLowerCase().includes(q) ||
        (p.categoria || '').toLowerCase().includes(q)
      )
    : [...state.productos];
  renderTabla();
}

function renderTabla() {
  const tbody = document.getElementById('products-tbody');
  const lista = state.filteredProductos;

  document.getElementById('table-count-label').textContent =
    `${lista.length} producto${lista.length !== 1 ? 's' : ''} encontrado${lista.length !== 1 ? 's' : ''}`;

  if (!lista.length) {
    tbody.innerHTML = `
      <tr><td colspan="7">
        <div class="empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#5c6585" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          <p>No se encontraron productos. <strong style="color:var(--accent);cursor:pointer;" onclick="document.getElementById('btn-nuevo-producto').click()">Crear el primero</strong></p>
        </div>
      </td></tr>`;
    return;
  }

  tbody.innerHTML = lista.map(p => `
    <tr>
      <td class="td-mono">#${p.id_producto}</td>
      <td class="td-mono">${p.codigo_barras || '—'}</td>
      <td><strong>${p.descripcion || '—'}</strong></td>
      <td><strong>${formatCOP(p.precio)}</strong></td>
      <td>${stockPill(p.stock ?? 0)}</td>
      <td><span class="cat-pill">${p.categoria || '—'}</span></td>
      <td>
        <div class="row-actions">
          <button class="icon-btn warn" title="Actualizar precio" onclick="abrirModalPrecio(${p.id_producto})">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </button>
          <button class="icon-btn" title="Ingresar mercancía" onclick="abrirModalIngreso(${p.id_producto})" style="--accent:#3b82f6">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          </button>
          <button class="icon-btn danger" title="Eliminar producto" onclick="abrirConfirmDelete(${p.id_producto})">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      </td>
    </tr>`).join('');
}

function actualizarKPIs() {
  const ps = state.productos;
  document.getElementById('kpi-total').textContent  = ps.length;
  const totalStock = ps.reduce((s, p) => s + (p.stock ?? 0), 0);
  document.getElementById('kpi-stock').textContent  = totalStock.toLocaleString('es-CO');
  const lowStock   = ps.filter(p => (p.stock ?? 0) < 10).length;
  document.getElementById('kpi-low').textContent    = lowStock;
  const valor      = ps.reduce((s, p) => s + ((p.precio ?? 0) * (p.stock ?? 0)), 0);
  document.getElementById('kpi-valor').textContent  = formatCOP(valor);
}

// Búsqueda en tiempo real
document.getElementById('search-input').addEventListener('input', filtrarYRenderizar);

// Recargar
document.getElementById('btn-refresh').addEventListener('click', cargarProductos);
document.getElementById('btn-refresh-top').addEventListener('click', cargarProductos);

// ── 2.2 POST /productos/ — Crear producto ─────────────────────────
document.getElementById('btn-nuevo-producto').addEventListener('click', () => {
  clearModalError('modal-producto-error');
  document.getElementById('modal-producto-title').textContent = 'Nuevo Producto';
  document.getElementById('input-barras').value    = '';
  document.getElementById('input-desc').value      = '';
  document.getElementById('input-precio').value    = '';
  document.getElementById('input-stock').value     = '';
  document.getElementById('input-categoria').value = '';
  openModal('modal-producto');
});

document.getElementById('btn-guardar-producto').addEventListener('click', async () => {
  clearModalError('modal-producto-error');
  const codigo_barras = document.getElementById('input-barras').value.trim();
  const descripcion   = document.getElementById('input-desc').value.trim();
  const precio        = parseFloat(document.getElementById('input-precio').value);
  const stock         = parseInt(document.getElementById('input-stock').value, 10);
  const id_categoria  = parseInt(document.getElementById('input-categoria').value, 10);

  if (!codigo_barras || !descripcion || isNaN(precio) || isNaN(stock) || isNaN(id_categoria)) {
    showModalError('modal-producto-error', 'Completa todos los campos correctamente.');
    return;
  }

  const btn = document.getElementById('btn-guardar-producto');
  setLoading(btn, true);

  try {
    const res = await fetch(`${API}/productos/`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ codigo_barras, descripcion, precio, stock, id_categoria }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      showModalError('modal-producto-error', data.detail || data.mensaje || `Error ${res.status}`);
      return;
    }
    closeModal('modal-producto');
    showToast(`Producto "${descripcion}" creado exitosamente.`, 'success');
    cargarProductos();
  } catch (err) {
    showModalError('modal-producto-error', 'Error de conexión con el servidor.');
  } finally {
    setLoading(btn, false);
  }
});

// ── 2.3 PUT /productos/{id}/precio — Actualizar precio ────────────
function abrirModalPrecio(id) {
  const producto = state.productos.find(p => p.id_producto === id);
  if (!producto) return;
  state.editingProductoId = id;
  clearModalError('modal-precio-error');
  document.getElementById('modal-precio-desc').textContent =
    `${producto.descripcion} — precio actual: ${formatCOP(producto.precio)}`;
  document.getElementById('input-nuevo-precio').value = '';
  openModal('modal-precio');
}

document.getElementById('btn-guardar-precio').addEventListener('click', async () => {
  clearModalError('modal-precio-error');
  const precio = parseFloat(document.getElementById('input-nuevo-precio').value);
  if (isNaN(precio) || precio < 0) {
    showModalError('modal-precio-error', 'Ingresa un precio válido.');
    return;
  }

  const btn = document.getElementById('btn-guardar-precio');
  setLoading(btn, true);

  try {
    const res = await fetch(`${API}/productos/${state.editingProductoId}/precio`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ precio }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      showModalError('modal-precio-error', data.detail || data.mensaje || `Error ${res.status}`);
      return;
    }
    closeModal('modal-precio');
    showToast('Precio actualizado correctamente.', 'success');
    cargarProductos();
  } catch (err) {
    showModalError('modal-precio-error', 'Error de conexión con el servidor.');
  } finally {
    setLoading(btn, false);
  }
});

// ── 2.4 PUT /productos/{id}/ingreso — Ingresar mercancía ──────────
function abrirModalIngreso(id) {
  const producto = state.productos.find(p => p.id_producto === id);
  if (!producto) return;
  state.editingProductoId = id;
  clearModalError('modal-ingreso-error');
  document.getElementById('modal-ingreso-desc').textContent =
    `${producto.descripcion} — stock actual: ${producto.stock ?? 0} unidades`;
  document.getElementById('input-cantidad-ingreso').value = '';
  openModal('modal-ingreso');
}

document.getElementById('btn-confirmar-ingreso').addEventListener('click', async () => {
  clearModalError('modal-ingreso-error');
  const cantidad_ingreso = parseInt(document.getElementById('input-cantidad-ingreso').value, 10);
  if (isNaN(cantidad_ingreso) || cantidad_ingreso < 1) {
    showModalError('modal-ingreso-error', 'Ingresa una cantidad válida (mínimo 1).');
    return;
  }

  const btn = document.getElementById('btn-confirmar-ingreso');
  setLoading(btn, true);

  try {
    const res = await fetch(`${API}/productos/${state.editingProductoId}/ingreso`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ cantidad_ingreso }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      showModalError('modal-ingreso-error', data.detail || data.mensaje || `Error ${res.status}`);
      return;
    }
    closeModal('modal-ingreso');
    showToast(`Ingreso de ${cantidad_ingreso} unidades registrado.`, 'success');
    cargarProductos();
  } catch (err) {
    showModalError('modal-ingreso-error', 'Error de conexión con el servidor.');
  } finally {
    setLoading(btn, false);
  }
});

// ── 2.5 DELETE /productos/{id} — Eliminar producto ────────────────
function abrirConfirmDelete(id) {
  const producto = state.productos.find(p => p.id_producto === id);
  if (!producto) return;
  state.editingProductoId = id;
  document.getElementById('confirm-delete-msg').textContent =
    `¿Estás seguro de que deseas eliminar "${producto.descripcion}"? Esta acción no se puede deshacer.`;
  openModal('modal-confirm-delete');
}

document.getElementById('btn-confirm-delete').addEventListener('click', async () => {
  const btn = document.getElementById('btn-confirm-delete');
  setLoading(btn, true);

  try {
    const res = await fetch(`${API}/productos/${state.editingProductoId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      closeModal('modal-confirm-delete');
      showToast(data.detail || data.mensaje || `Error ${res.status} al eliminar.`, 'error');
      return;
    }
    closeModal('modal-confirm-delete');
    showToast(data.mensaje || 'Producto eliminado exitosamente.', 'success');
    cargarProductos();
  } catch (err) {
    closeModal('modal-confirm-delete');
    showToast('Error de conexión con el servidor.', 'error');
  } finally {
    setLoading(btn, false);
  }
});

// ─── Cerrar modales con Escape ────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
  }
});

// ─── Cerrar modal al clic en backdrop ─────────────────────────────
document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) backdrop.classList.remove('open');
  });
});
