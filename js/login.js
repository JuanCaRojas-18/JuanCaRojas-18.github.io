/* ---- Tab switching ---- */
function switchTab(tab) {
  ['login','register'].forEach(t => {
    document.getElementById('tab-' + t).classList.toggle('active', t === tab);
    document.getElementById('tab-' + t).setAttribute('aria-selected', t === tab);
    document.getElementById('panel-' + t).classList.toggle('active', t === tab);
  });
  // Update top hint
  const hint = document.getElementById('switch-hint');
  const link = document.getElementById('switch-link');
  if (tab === 'login') {
    hint.innerHTML = '¿No tienes cuenta? <a href="#" onclick="switchTab(\'register\');return false;" id="switch-link">Regístrate gratis</a>';
  } else {
    hint.innerHTML = '¿Ya tienes cuenta? <a href="#" onclick="switchTab(\'login\');return false;" id="switch-link">Inicia sesión</a>';
  }
  // Re-trigger animation
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

/* ---- Login submit ---- */
function handleLogin(e) {
  e.preventDefault();
  let ok = true;
  const email = document.getElementById('lg-email');
  const pw = document.getElementById('lg-pw');

  clearErr('lg-email-grp'); clearErr('lg-pw-grp');
  if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) { setErr('lg-email-grp'); ok = false; }
  if (!pw.value) { setErr('lg-pw-grp'); ok = false; }

  if (ok) {
    const btn = document.getElementById('lg-btn');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div> Verificando...';
    setTimeout(() => {
      btn.style.background = '#059669';
      btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Acceso concedido';
    }, 1600);
  }
}

/* ---- Register submit ---- */
function handleRegister(e) {
  e.preventDefault();
  let ok = true;
  const fn = document.getElementById('rg-fn');
  const ln = document.getElementById('rg-ln');
  const em = document.getElementById('rg-em');
  const pw = document.getElementById('rg-pw');
  const terms = document.getElementById('rg-terms');

  ['rg-fn-grp','rg-ln-grp','rg-em-grp','rg-pw-grp'].forEach(clearErr);
  if (!fn.value.trim()) { setErr('rg-fn-grp'); ok = false; }
  if (!ln.value.trim()) { setErr('rg-ln-grp'); ok = false; }
  if (!em.value || !/\S+@\S+\.\S+/.test(em.value)) { setErr('rg-em-grp'); ok = false; }
  if (!pw.value || pw.value.length < 8) { setErr('rg-pw-grp'); ok = false; }
  if (!terms.checked) { alert('Debes aceptar los términos de uso para continuar.'); ok = false; }

  if (ok) {
    const btn = document.getElementById('rg-btn');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div> Creando cuenta...';
    setTimeout(() => {
      btn.style.background = '#059669';
      btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> ¡Cuenta creada!';
    }, 1900);
  }
}

function setErr(grpId) { document.getElementById(grpId).classList.add('has-err'); }
function clearErr(grpId) { document.getElementById(grpId).classList.remove('has-err'); }

/* ---- Social auth ---- */
function socialAuth(provider) {
  alert('Integración con ' + provider + ' estará disponible próximamente.');
}

/* ---- Forgot password ---- */
function forgotPw(e) {
  e.preventDefault();
  const val = document.getElementById('lg-email').value.trim();
  if (val && /\S+@\S+\.\S+/.test(val)) {
    alert('Se enviará un enlace de recuperación a: ' + val);
  } else {
    document.getElementById('lg-email').focus();
    alert('Ingresa tu correo electrónico primero.');
  }
}