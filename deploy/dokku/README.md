<!-- deploy/dokku/README.md -->

# Dokku Deployment

```bash
dokku apps:create watermelon
dokku postgres:create watermelon-db
dokku postgres:link watermelon-db watermelon
dokku config:set watermelon JWT_SECRET=$(openssl rand -hex 32)
dokku git:set watermelon deploy-branch main
git remote add dokku dokku@your.server:watermelon
git push dokku main
```
