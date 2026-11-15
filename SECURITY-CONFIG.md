# 🔒 Configuración de Seguridad para Producción - Vegazetas

Este documento detalla las configuraciones de seguridad que deben implementarse antes de desplegar Vegazetas a producción.

## Variables de Entorno Requeridas

```bash
# Para desarrollo local (.env - está en .gitignore ✅)
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=dev-secret-change-in-production

# Para producción (guardar en AWS Secrets Manager, GitHub Secrets, o variables del servidor)
NODE_ENV=production
FRONTEND_URL=https://tudominio.com
JWT_SECRET=<generar-valor-aleatorio-de-32-caracteres>  # ← GENERAR NUEVO, NUNCA USAR EL DEV

# MongoDB
MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/vegazetas
SPEC_MONGO_URL=mongodb://localhost:27017/vegazetas-test

# Email (Resend o Nodemailer)
RESEND_API_KEY=<tu-clave-api-resend>
```

**IMPORTANTE**: 
- ✅ El `.env` local DEBE estar en `.gitignore` (lo está)
- ✅ El `.env` NO se sube a GitHub (correcto)
- ✅ JWT_SECRET en producción se genera NUEVAMENTE (no reutilizar dev)
- ✅ En producción, guardar en: AWS Secrets Manager, GitHub Secrets, o variables del servidor

## Generar JWT_SECRET Seguro

```bash
# En Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# O en bash:
openssl rand -hex 32
```

**NUNCA** uses valores como `dev-secret-change-in-production`. Genera un secreto único y aleatorio criptográficamente seguro.

## Implementaciones de Seguridad

### ✅ 1. Headers de Seguridad HTTP (Helmet)
Implementado en: `api/middlewares/securityHeaders.ts`

Headers que se aplican automáticamente:
- `X-Content-Type-Options: nosniff` - Previene MIME sniffing
- `X-Frame-Options: DENY` - Previene clickjacking
- `X-XSS-Protection: 1; mode=block` - Protección XSS
- `Strict-Transport-Security` - Fuerza HTTPS (31536000s = 1 año)
- `Content-Security-Policy` - Restricción de recursos

### ✅ 2. Rate Limiting en Autenticación
Implementado en: `api/middlewares/rateLimiter.ts`

**Límites aplicados:**
- **Login** (`POST /users/auth`): 5 intentos por 15 minutos por IP
- **Password Recovery** (`POST /users/password/recover`): 3 intentos por hora por email
- **Password Reset** (`POST /users/password/reset/:token`): 5 intentos por 10 minutos por IP

⚠️ Rate limiting se **desactiva en desarrollo** (cuando `NODE_ENV !== 'production'`)

### ✅ 3. CORS Seguro
Configurado en: `api/app.ts`

- Solo permite requests desde `FRONTEND_URL` (debe ser definida)
- Valida que `FRONTEND_URL` sea una URL válida
- Habilita `credentials: true` para cookies
- Limita métodos a: GET, POST, PATCH, DELETE, OPTIONS
- Headers permitidos: Content-Type, Authorization

**Cambio crítico**: Si `FRONTEND_URL` no está definida, la aplicación falla al iniciar (no usa CORS abierto por defecto).

### ✅ 4. Validación Segura de URLs de Imágenes
Implementado en: `com/schemas.ts` y `api/util/imageUrlValidator.ts`

**Protecciones:**
- Solo acepta URLs con protocolo `http://` o `https://`
- Bloquea URLs a localhost y 127.0.0.1
- Bloquea rangos IP privados:
  - `10.0.0.0/8`
  - `172.16.0.0/12`
  - `192.168.0.0/16`
  - `169.254.0.0/16` (link-local)
- Previene Server-Side Request Forgery (SSRF)

### ✅ 5. Payload Size Limit
Configurado en: `api/app.ts`

- Máximo de 10KB para JSON payloads
- Previene ataques de negación de servicio (DoS) por uploads masivos

### ✅ 6. Manejo Seguro de Errores
Implementado en: `api/middlewares/errorHandler.ts`

- En producción: mensajes genéricos ("An internal error occurred")
- En desarrollo: detalles del error (para debugging)
- No expone stack traces en production
- Logs a console en desarrollo para investigación

### ✅ 7. Validación de Entrada
Implementado en: `com/schemas.ts` usando Zod

**Validaciones:**
- Email: RFC-compliant regex
- Contraseña: mínimo 8, máximo 25 caracteres, debe contener letras y números
- URLs de imágenes: validación de dominio público
- IDs MongoDB: validación de 24 caracteres hexadecimales
- Todos los datos se validan en servidor (no confía en cliente)

## Checklist de Seguridad Antes de Producción

### Alto 🟠 (Implementado - Verificar en Prod)
- [ ] Headers HTTP de seguridad activos (Helmet)
- [ ] Rate limiting activo en endpoints de autenticación
- [ ] CORS configurado solo para `FRONTEND_URL`
- [ ] Validación de URLs SSRF implementada
- [ ] Errores NO exponen detalles en producción

### Crítico 🔴 (Configuración Operacional)
- [ ] Generar JWT_SECRET nuevo: `openssl rand -hex 32`
- [ ] Guardar JWT_SECRET en AWS Secrets Manager / GitHub Secrets / Variables del servidor
- [ ] Definir `FRONTEND_URL` correctamente
- [ ] Configurar `NODE_ENV=production`
- [ ] Configurar `MONGO_URL` a base de datos de producción

### Alto 🟠
- [ ] Habilitar HTTPS en el servidor/proxy (TLS/SSL certificate)
- [ ] Configurar backups automáticos de MongoDB
- [ ] Configurar logging centralizado (Sentry, LogRocket, etc.)
- [ ] Revisar y configurar RESEND_API_KEY para emails
- [ ] Implementar monitoreo de errores y alertas

### Medio 🟡
- [ ] Implementar rate limiting en endpoints de lectura si es necesario
- [ ] Agregar token refresh (tokens cortos + refresh tokens)
- [ ] Implementar blacklist de tokens para logout efectivo
- [ ] Revisar política de privacidad y términos de servicio
- [ ] Implementar CSRF protection si el frontend lo necesita
- [ ] Agregar header `X-Request-ID` para debugging distribuido

### Bajo 🟢
- [ ] Revisar logs de seguridad regularmente
- [ ] Ejecutar `npm audit` mensualmente
- [ ] Actualizar dependencias (npm update)
- [ ] Documentar procedimiento de rotación de JWT_SECRET
- [ ] Configurar alertas de seguridad en GitHub

## Pruebas de Seguridad

### Test de Rate Limiting
```bash
# Simular 6 intentos de login en menos de 15 minutos
for i in {1..6}; do
  curl -X POST http://localhost:3000/users/auth \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"TestPass123"}'
  echo "\nIntento $i"
  sleep 1
done
# Esperado: 6to intento recibe 429 Too Many Requests
```

### Test de CORS
```bash
# Desde un dominio no permitido (debería fallar)
curl -X GET http://localhost:3000/health \
  -H "Origin: http://evil.com"

# Esperado: Header CORS no presentes si origin no coincide con FRONTEND_URL
```

### Test de URL Validation
```bash
# Intentar cargar imagen desde localhost (debería fallar)
curl -X POST http://localhost:3000/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test",
    "image": "http://localhost:3000/malicious.jpg"
  }'
# Esperado: 400 Bad Request con mensaje de URL inválida
```

### Test de Headers de Seguridad
```bash
curl -I http://localhost:3000/health

# Esperado: Verificar presencia de headers
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# Strict-Transport-Security: max-age=31536000
# X-XSS-Protection: 1; mode=block
```

## Rotación de Secretos

### JWT_SECRET
Si el `JWT_SECRET` actual se ve comprometido:

1. Generar nuevo secreto: `openssl rand -hex 32`
2. Actualizar en variables de entorno
3. Notificar a todos los usuarios (forzar logout y nuevo login)
4. Considerar expiración inmediata de todos los tokens existentes

### Database Credentials
Si MongoDB credentials se ven comprometidos:

1. Cambiar credenciales en MongoDB Atlas/hosting
2. Revisar logs de conexión para acceso no autorizado
3. Auditar cambios realizados
4. Restaurar desde backup si es necesario
5. Actualizar `MONGO_URL` en producción

## Monitoreo Continuo

### Logs a Revisar
- Intentos fallidos de autenticación (bruteforce detection)
- Errores 5XX (posibles ataques)
- Accesos a URLs no existentes (path traversal attempts)
- Cambios en datos sensibles (crear usuario admin, cambios en recetas)

### Métricas a Monitorear
- Tasa de errores 4XX/5XX
- Tiempo de respuesta (degradación = posible ataque)
- Uso de CPU/memoria
- Conexiones activas a MongoDB
- Errores de validación de JWT

## Referencias de Seguridad

- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Checklist](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/security-checklist/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## Contacto de Seguridad

Para reportar vulnerabilidades de seguridad:
- **NO** abrir issues públicas en GitHub
- Contactar a: [security@vegazetas.com]
- Incluir: descripción del problema, pasos para reproducir, impacto potencial

---

**Última actualización**: 2026-11-15
**Versión de referencia**: v2.0.0
