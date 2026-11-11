# Vegazetas app

The Vegazetas frontend is a React single-page app built with Vite. It lets users manage recipes, including their ingredients, steps, images, and publication status.

## Run locally

Install [Node.js](https://nodejs.org/) 22.23.5 or later on the 22.x line,
24.22.3 or later on the 24.x line, or 26.13.1 or later on the 26.x line, and
npm. The project's `.node-version` selects 26.13.1. Keep the chosen LTS line
updated with its latest security patches and review its support status. npm
rejects unsupported engines during installation; this does not enforce the
runtime when starting the app.

On Windows with nvm-windows, after installing Node 26.13.1, the following
selects it only for the current PowerShell process without changing the
shared nvm symlink:

```powershell
$env:PATH = "$env:NVM_HOME\v26.13.1;$env:PATH"
node --version
```

Then from this directory:

```sh
npm install
```

Create an `.env.local` file and point the app to the API:

```env
VITE_API_URL=http://localhost:3000
```

Use the same URL and port configured for the API, then start the app:

```sh
npm run dev
```

Vite serves the app at `http://localhost:5173` by default. The API and its MongoDB database must also be running.
The build retains the previous browser targets: Chrome 87, Edge 88, Firefox 78
and Safari 14. These targets do not by themselves guarantee support for every
application feature or browser.

## Scripts

- `npm run dev` — start the development server (`npm start` is an alias).
- `npm run build` — create a production build in `dist/`.
- `npm run preview` — preview the production build locally.
- `npm run lint` — run ESLint.
- `npm run test:e2e` — run the local Playwright browser tests.

## Browser tests

The Playwright tests cover registration, sign-in/sign-out and invalid
credentials with Chromium in headless mode. Install dependencies in both
`api` and `app`, then download the browser from the `app` directory:

```powershell
npx playwright install --only-shell chromium
```

With Docker Desktop running, create the dedicated test container once using
the [API test instructions](../api/README.md#reusable-local-test-container-on-windows).
Then run the following from the `app` directory. It verifies the container,
starts it if needed and derives its local port:

```powershell
$previous = [Environment]::GetEnvironmentVariable('E2E_MONGO_URL', 'Process')
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
    if (-not $ready) { throw 'Test MongoDB did not become ready' }

    $mapping = @(docker port $container.Id 27017)
    if ($LASTEXITCODE -ne 0 -or $mapping.Count -ne 1 -or
        $mapping[0] -notmatch '^127\.0\.0\.1:(\d+)$') {
        throw 'Unexpected MongoDB port mapping'
    }
    $env:E2E_MONGO_URL = 'mongodb://127.0.0.1:' + $Matches[1] + '/vegazetas_e2e_disposable'
    npm run test:e2e
    if ($LASTEXITCODE -ne 0) { throw 'Browser tests failed' }
}
finally {
    [Environment]::SetEnvironmentVariable('E2E_MONGO_URL', $previous, 'Process')
}
```

Playwright starts and stops its own API and frontend on localhost ports
`32123` and `4173`; it refuses to reuse existing servers. It uses
`vegazetas_e2e_disposable`, separate from the API suite's
`vegazetas_disposable`, and deletes each synthetic test user afterwards.
Interrupted runs may leave test data behind. Never use a database containing
data you need to keep: validating the URI alone cannot prove it is disposable.
Requests from the browser to external origins are blocked in these tests.

The `test-results/` directory is generated and cleared by Playwright on each
run; it is ignored by Git. To use headed Chromium, install the full browser
with `npx playwright install chromium` first.
