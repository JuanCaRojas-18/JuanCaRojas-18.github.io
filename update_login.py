import re

html_replacement = """      <div class="auth-panel" id="panel-register">
        <div class="auth-form-hd">
          <h2 class="auth-form-title">Registra tu <em>empresa</em></h2>
          <p class="auth-form-sub">Completa los datos de tu empresa y administrador.</p>
        </div>

        <form class="auth-form" id="reg-form" onsubmit="handleRegister(event)" novalidate>

          <!-- Razón Social y NIT -->
          <div class="form-group" id="rg-co-grp">
            <label class="form-label" for="rg-co">Razón Social</label>
            <div class="form-field">
              <span class="field-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </span>
              <input type="text" id="rg-co" class="form-input" placeholder="Comercializadora S.A.S." autocomplete="organization" required />
            </div>
          </div>
          
          <div class="form-group" id="rg-nit-grp">
            <label class="form-label" for="rg-nit">NIT de la empresa</label>
            <div class="form-field">
              <input type="text" id="rg-nit" class="form-input no-icon" placeholder="900123456" inputmode="numeric" required />
            </div>
            <span class="field-err">NIT requerido.</span>
          </div>

          <!-- Nombres y Apellidos -->
          <div class="form-row">
            <div class="form-group" id="rg-fn-grp">
              <label class="form-label" for="rg-fn">Nombres del Admin</label>
              <div class="form-field">
                <input type="text" id="rg-fn" class="form-input no-icon" placeholder="Juan" autocomplete="given-name" required />
              </div>
              <span class="field-err">Requerido.</span>
            </div>
            <div class="form-group" id="rg-ln-grp">
              <label class="form-label" for="rg-ln">Apellidos</label>
              <div class="form-field">
                <input type="text" id="rg-ln" class="form-input no-icon" placeholder="Rodríguez" autocomplete="family-name" required />
              </div>
              <span class="field-err">Requerido.</span>
            </div>
          </div>

          <!-- Email -->
          <div class="form-group" id="rg-em-grp">
            <label class="form-label" for="rg-em">Correo de la empresa</label>
            <div class="form-field">
              <span class="field-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </span>
              <input type="email" id="rg-em" class="form-input" placeholder="contacto@empresa.com" autocomplete="email" required />
            </div>
            <span class="field-err">Correo inválido.</span>
          </div>

          <!-- Password -->
          <div class="form-group" id="rg-pw-grp">
            <label class="form-label" for="rg-pw">Contraseña</label>
            <div class="form-field">
              <span class="field-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input type="password" id="rg-pw" class="form-input has-eye" placeholder="Mínimo 8 caracteres" autocomplete="new-password" oninput="updateStrength(this.value)" required />
              <button type="button" class="eye-btn" onclick="toggleEye('rg-pw',this)" aria-label="Ver contraseña">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <div class="pw-strength-bars" id="pw-bars">
              <div class="pw-bar" id="pb1"></div>
              <div class="pw-bar" id="pb2"></div>
              <div class="pw-bar" id="pb3"></div>
              <div class="pw-bar" id="pb4"></div>
            </div>
            <span class="field-err">Mínimo 8 caracteres.</span>
          </div>

          <!-- Terms -->
          <label class="form-check">
            <input type="checkbox" id="rg-terms" required />
            <span class="form-check-lbl">Acepto los <a href="#">términos de uso</a> y <a href="#">política de privacidad</a></span>
          </label>

          <button type="submit" class="btn-submit" id="rg-btn">
            Registrar Empresa
          </button>

        </form>

        <p class="auth-note">¿Ya tienes cuenta? <a href="#" onclick="switchTab('login');return false;">Inicia sesión</a></p>

        <div class="auth-security">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span class="auth-security-text">Cifrado SSL · Datos protegidos</span>
        </div>
      </div>
"""

with open("login.html", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the panel-register div
pattern = re.compile(r'      <div class="auth-panel" id="panel-register">.*?(?=    </div><!-- /auth-card -->)', re.DOTALL)
new_content = pattern.sub(html_replacement, content)

with open("login.html", "w", encoding="utf-8") as f:
    f.write(new_content)

print("login.html updated successfully!")
