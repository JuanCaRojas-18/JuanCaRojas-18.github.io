// ==========================================
// CONFIGURACIÓN DE RED (Fase 2)
// Cambiar a la URL de Ngrok cuando hagan pruebas remotas
// ==========================================
const API_BASE_URL = 'http://172.20.10.8:8000'; 

/* ---- Tab switching ---- */
function switchTab(tab) {
  ['login','register'].forEach(t => {
    document.getElementById('tab-' + t).classList.toggle('active', t === tab);
    document.getElementById('tab-' + t).setAttribute('aria-selected', t === tab);
    document.getElementById('panel-' + t).classList.toggle('active', t === tab);
  });
  const hint = document.getElementById('switch-hint');
  if (tab === 'login') {
    hint.innerHTML = '¿No tienes cuenta? <a href="#" onclick="switchTab(\'register\');return false;" id="switch-link">Regístrate gratis</a>';
  } else {
    hint.innerHTML = '¿Ya tienes cuenta? <a href="#" onclick="switchTab(\'login\');return false;" id="switch-link">Inicia sesión</a>';
  }
  const card = document.getElementById('auth-card');
  card.style.animation = 'none';
  card.offsetHeight;
  card.style.animation = 'fadeSlideUp 0.38s cubic-bezier(0.22,1,0.36,1) both';
}

/* ---- Password visibility ---- */
function toggleEye(inputId, btn) {
  const el = document.getElementById(inputId);
  const isText = el.type === 'text';
  el.type = isText ? 'password' : 'text';
  btn.style.color = isText ? '' : 'var(--accent)';
}

/* ---- Password strength ---- */
function updateStrength(val) {
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const cls = score <= 1 ? 'level-1' : score === 2 ? 'level-2' : score === 3 ? 'level-3' : 'level-4';
  [1,2,3,4].forEach(i => {
    const bar = document.getElementById('pb' + i);
    bar.className = 'pw-bar' + (i <= score ? ' ' + cls : '');
  });
}

// ==========================================
// INTEGRACIÓN CON BACKEND: LOGIN
// ==========================================
async function handleLogin(e) {
  e.preventDefault();
  let ok = true;
  
  // Usamos lg-email porque así está en el HTML, pero representará el NIT
  const nitInput = document.getElementById('lg-email');
  const pwInput = document.getElementById('lg-pw');
  const btn = document.getElementById('lg-btn');

  clearErr('lg-email-grp'); clearErr('lg-pw-grp');
  
  // Validación básica de campos vacíos
  if (!nitInput.value.trim()) { setErr('lg-email-grp'); ok = false; }
  if (!pwInput.value) { setErr('lg-pw-grp'); ok = false; }

  if (ok) {
    // 1. Estado de carga en el botón
    const originalBtnText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div> Conectando...';

    try {
      // 2. Petición HTTP asíncrona al Backend
      const response = await fetch(`${API_BASE_URL}/login/empresa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nit: nitInput.value.trim(),
          password: pwInput.value
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Éxito visual
        btn.style.background = '#059669';
        btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Acceso concedido';
        
        
        setTimeout(() => {
          window.location.href = 'Intranet_Cliente/index.html'; 
        }, 1000);

      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Credenciales incorrectas');
      }

    } catch (error) {
      // 4. Captura de errores de red o credenciales inválidas
      console.error('Error de autenticación:', error);
      alert(`Error al iniciar sesión: ${error.message}. Verifica que el servidor de FastAPI esté encendido y las credenciales sean correctas.`);
      
      // Restaurar estado del botón
      btn.disabled = false;
      btn.style.background = 'var(--accent)';
      btn.innerHTML = originalBtnText;
      setErr('lg-email-grp'); 
      setErr('lg-pw-grp');
    }
  }
}

/* ---- Manejadores de interfaz adicionales ---- */
function setErr(grpId) { document.getElementById(grpId).classList.add('has-err'); }
function clearErr(grpId) { document.getElementById(grpId).classList.remove('has-err'); }

function socialAuth(provider) {
  alert('Integración con ' + provider + ' estará disponible próximamente.');
}

function forgotPw(e) {
  e.preventDefault();
  const val = document.getElementById('lg-email').value.trim();
  if (val) {
    alert('Se enviará un enlace de recuperación para el NIT/Correo: ' + val);
  } else {
    document.getElementById('lg-email').focus();
    alert('Ingresa tu NIT/Correo primero.');
  }
}

// Simulador de registro (Aún sin endpoint documentado)
function handleRegister(e) {
  e.preventDefault();
  alert("El endpoint de registro aún no está definido en la Guía de Integración.");
}