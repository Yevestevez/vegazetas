# Vegazetas API

The API is an Express service backed by MongoDB. It handles users, authentication, and recipe management.

## Run locally

Install [Node.js](https://nodejs.org/) and npm, and make sure MongoDB is available. From this directory, install dependencies:

```sh
npm install
```

Create a `.env` file:

```env
PORT=3000
MONGO_URL=mongodb://127.0.0.1:27017/vegazetas
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:5173
MAIL_FROM=noreply@example.com
```

Start the API:

```sh
npm start
```

Use `npm run watch` to restart the service when files change. The health check is available at `http://localhost:3000/health`. The frontend's `VITE_API_URL` must match the API URL.

Password recovery uses Ethereal for email previews outside production. In production, set `RESEND_API_KEY` and configure `MAIL_FROM` for Resend.

## Tests

Set `SPEC_MONGO_URL` in `.env` to a **dedicated test database** before running:

```sh
npm test
```

The tests clear user and recipe collections; never point `SPEC_MONGO_URL` at a database containing data you need to keep.

### Isolated local baseline on Windows

With Docker Desktop running, execute the following from the `api` directory.
It creates a disposable MongoDB container, binds it only to localhost on an
automatically assigned port, and overrides the test connection for this
PowerShell process. The container and its data are removed afterwards.

```powershell
$previous = @{}
foreach ($key in @('SPEC_MONGO_URL', 'NODE_ENV', 'JWT_SECRET')) {
    $previous[$key] = [Environment]::GetEnvironmentVariable($key, 'Process')
}
$container = $null
try {
    $container = docker run --detach --rm --publish '127.0.0.1::27017' mongo:8
    if ($LASTEXITCODE -ne 0 -or $container -notmatch '^[a-f0-9]{64}$') {
        throw 'Could not start the disposable MongoDB container'
    }

    $ready = $false
    for ($i = 0; $i -lt 30; $i++) {
        $ping = docker exec $container mongosh --quiet --eval 'db.adminCommand({ping:1}).ok' 2>$null
        if ($LASTEXITCODE -eq 0 -and $ping -eq '1') {
            $ready = $true
            break
        }
        Start-Sleep -Seconds 2
    }
    if (-not $ready) { throw 'Disposable MongoDB did not become ready' }

    $mapping = docker port $container 27017
    if ($LASTEXITCODE -ne 0 -or $mapping -notmatch '^127\.0\.0\.1:(\d+)$') {
        throw 'Unexpected MongoDB port mapping'
    }
    $env:SPEC_MONGO_URL = 'mongodb://127.0.0.1:' + $Matches[1] + '/vegazetas_disposable'
    $env:NODE_ENV = 'test'
    $env:JWT_SECRET = 'local-disposable-test-secret'
    npm test -- --ignore 'logic/passwordRecover.spec.js'
    if ($LASTEXITCODE -ne 0) { throw 'API tests failed' }
}
finally {
    foreach ($key in $previous.Keys) {
        [Environment]::SetEnvironmentVariable($key, $previous[$key], 'Process')
    }
    if ($container -match '^[a-f0-9]{64}$') {
        docker stop $container
        if ($LASTEXITCODE -ne 0) { Write-Error 'Could not stop the test container' }
    }
}
```

The password-recovery suite is excluded because it contacts Ethereal. This is
not the complete `npm test` suite; isolating email remains to be agreed. The
`mongo:8` tag can change over time, so record the actual MongoDB version when
comparing results.
