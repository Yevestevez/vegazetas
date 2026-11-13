# Vegazetas API

The API is an Express service backed by MongoDB. It handles users, authentication, and recipe management.

## Run locally

Install [Node.js](https://nodejs.org/) 22.23.5 or later on the 22.x line,
24.22.3 or later on the 24.x line, or 26.13.1 or later on the 26.x line, and
npm. The project's `.node-version` selects 26.13.1. Keep the chosen LTS line
updated with its latest security patches, review its support status, and make
sure MongoDB is available. npm rejects unsupported engines during installation;
this does not enforce the runtime when starting the API.

On Windows with nvm-windows, after installing Node 26.13.1, the following
selects it only for the current PowerShell process without changing the
shared nvm symlink:

```powershell
$env:PATH = "$env:NVM_HOME\v26.13.1;$env:PATH"
node --version
```

First install the shared package dependencies from `com` with `npm ci`.
Then, from this directory, install dependencies:

```sh
npm install
```

Create a `.env` file:

```env
PORT=3000
NODE_ENV=development
MONGO_URL=mongodb://127.0.0.1:27017/vegazetas
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:5173
MAIL_FROM=noreply@example.com
```

The API uses Node's native environment-file loader. It reads `.env` from the
current working directory when present, without overriding variables already
set in the process. A missing file is allowed; other read errors are reported.
The same loader is used by the existing tests and manual scripts.

Start the API:

```sh
npm start
```

Use `npm run watch` to restart the service when files change. The health check is available at `http://localhost:3000/health`. The frontend's `VITE_API_URL` must match the API URL.

Set `NODE_ENV=development` to use Ethereal email previews for password recovery. In production, set `NODE_ENV=production`, `RESEND_API_KEY`, and `MAIL_FROM` for Resend.

The API is gradually adopting TypeScript. Node runs the type-strippable
TypeScript files directly; no separate compilation step is needed at startup.
Run `npm run typecheck` to check the migrated TypeScript modules. Existing
JavaScript and the shared `com` package remain in place and are not fully
type-checked. The `GET /users/name`, `GET /users/username`, `POST /users`,
`POST /users/auth` and `PATCH /users/favorites/:recipeId` modules are
TypeScript, including their handlers, use cases and repositories. The
remaining user routes stay in JavaScript for now.

The API uses Express 5. Its JSON middleware retains the previous empty-object
behavior for requests without a parsed body, so existing validation responses
remain unchanged. Other routes still need broader HTTP characterization.

The user-name and recipe-read endpoints return a generic `401` for invalid
credentials. This includes the three recipe lists; other protected endpoints
retain their previous behavior. The own-recipes list includes an `isFavorite`
boolean. Deploy the compatible frontend before this API and roll back the API
first; external clients with strict response schemas must accept the new field.

## Tests

The Vitest suites clear user and recipe collections. They require a dedicated,
disposable local database, even when reusing the container. Never use a
database containing data you need to keep. Tests validate that
`SPEC_MONGO_URL` uses `mongodb://127.0.0.1:<port>/vegazetas_disposable`
without credentials or query parameters; this check alone cannot prove that
the server is disposable.

`npm test` runs the logic suites, HTTP regressions and JSON compatibility
checks sequentially. `npm run test-favorite-security` runs only the favorites test.
`npm run test-coverage` covers the regular suite and produces text and HTML
reports; `npm run test-inspect` starts it with a debugger.

The recovery tests also exercise Nodemailer's in-memory transport and the
Resend SDK with a mocked HTTP response. They do not prove delivery by either
provider or contact external mail services.

### Reusable local test container on Windows

With Docker Desktop running, create the dedicated container once:

```powershell
docker run --detach --name vegazetas-test-mongodb `
    --label 'com.vegazetas.purpose=disposable-tests' `
    --publish '127.0.0.1::27017' mongo:8
```

From the `api` directory, use the following for each test run. It verifies the
container's label and image, starts it if needed, checks MongoDB readiness and
the localhost port mapping, and sets the test connection for this PowerShell
process. It leaves the container running for reuse.

```powershell
$previous = @{}
foreach ($key in @('SPEC_MONGO_URL', 'NODE_ENV', 'JWT_SECRET')) {
    $previous[$key] = [Environment]::GetEnvironmentVariable($key, 'Process')
}
try {
    $containers = @(docker inspect vegazetas-test-mongodb | ConvertFrom-Json)
    if ($LASTEXITCODE -ne 0 -or $containers.Count -ne 1) {
        throw 'Could not inspect the test container'
    }
    $container = $containers[0]
    if ($container.Config.Image -ne 'mongo:8' -or
        $container.Config.Labels.'com.vegazetas.purpose' -ne 'disposable-tests') {
        throw 'Unexpected test container'
    }
    if (-not $container.State.Running) {
        docker start $container.Id | Out-Null
        if ($LASTEXITCODE -ne 0) { throw 'Could not start the test container' }
    }

    $ready = $false
    for ($i = 0; $i -lt 30; $i++) {
        $ping = docker exec $container.Id mongosh --quiet --eval 'db.adminCommand({ping:1}).ok' 2>$null
        if ($LASTEXITCODE -eq 0 -and $ping -eq '1') {
            $ready = $true
            break
        }
        Start-Sleep -Seconds 2
    }
    if (-not $ready) { throw 'Disposable MongoDB did not become ready' }

    $mapping = @(docker port $container.Id 27017)
    if ($LASTEXITCODE -ne 0 -or $mapping.Count -ne 1 -or
        $mapping[0] -notmatch '^127\.0\.0\.1:(\d+)$') {
        throw 'Unexpected MongoDB port mapping'
    }
    $env:SPEC_MONGO_URL = 'mongodb://127.0.0.1:' + $Matches[1] + '/vegazetas_disposable'
    $env:NODE_ENV = 'test'
    $env:JWT_SECRET = 'local-disposable-test-secret'
    npm test
    if ($LASTEXITCODE -ne 0) { throw 'API tests failed' }
}
finally {
    foreach ($key in $previous.Keys) {
        [Environment]::SetEnvironmentVariable($key, $previous[$key], 'Process')
    }
}
```

The regular suite uses a simulated mail transporter and does not contact
Ethereal. The `mongo:8` tag can change over time, so record the actual MongoDB
version when comparing results. Reusing the container also reuses its data:
test suites may erase it, and interrupted tests may leave data behind. Stop it
with `docker stop vegazetas-test-mongodb` when not needed; the next run starts
it again.

The [frontend browser tests](../app/README.md#browser-tests) reuse this
container with a separate `vegazetas_e2e_disposable` database and an isolated
local API process. They must never be pointed at production or shared data.

To run the optional Ethereal integration test, replace the `npm test` line in
the preceding block with `npm run test-mail-integration`. This test contacts
Ethereal and requires internet access. It only accepts a local
`SPEC_MONGO_URL` ending in `/vegazetas_disposable`; use the dedicated
container above, not an existing local database. It creates a synthetic user
and deletes that user afterwards. It does not send mail through Resend.
