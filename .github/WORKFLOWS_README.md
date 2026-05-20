# CI/CD Workflows for ToSeguroApp

Files added:

- `.github/workflows/ci.yml` — CI pipeline that runs install/build/test/lint for `apps/api` and `apps/web` on PRs and pushes.
- `.github/workflows/cd-dockerhub.yml` — CD pipeline that builds Docker images for `apps/api` and `apps/web`, pushes them to DockerHub and optionally deploys via SSH.

Required repository secrets (set in GitHub > Settings > Secrets & variables > Actions):

- `DOCKERHUB_USERNAME` — DockerHub user that will own the pushed images.
- `DOCKERHUB_TOKEN` — DockerHub access token (recommended) or password.
- `SSH_PRIVATE_KEY` — (optional) Private key for the target server to run `docker-compose`.
- `SERVER_HOST` — (optional) Hostname or IP of the deploy server.
- `SERVER_USER` — (optional) Username for SSH on the deploy server.
- `SERVER_PORT` — (optional) SSH port (default 22).

## Recommendations and next steps

- Ensure `apps/api/Dockerfile` and `apps/web/Dockerfile` exist and correctly build your services. The CD workflow relies on these files.
- Add a `docker-compose.yml` on the target server at `/srv/toseguro` (or change the path in the workflow) to pull & run the images.
- If you prefer GitHub Packages instead of DockerHub, update the `docker/login-action` and image tags accordingly.
- For safer rollout, consider adding a health-check step after `docker-compose up` to verify the services are healthy.
- Limit deploy permissions to protected branches and use branch protection rules for `main`.

If you want, I can now:

- Create simple `Dockerfile` stubs for `apps/api` and `apps/web` if they are missing.
- Add a small `scripts/` folder with helper deploy scripts.
- Add workflow caching for `node_modules` to speed up CI.
