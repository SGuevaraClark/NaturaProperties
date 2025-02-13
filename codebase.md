# .devcontainer/devcontainer.json

```json
// For format details, see https://aka.ms/devcontainer.json. For config options, see the
// README at: https://github.com/devcontainers/templates/tree/main/src/postgres
{
	"name": "Python 3 & PostgreSQL",
	"dockerComposeFile": "docker-compose.yml",
	"service": "app",
	"workspaceFolder": "/workspaces/${localWorkspaceFolderBasename}",
	"features": {
		"ghcr.io/devcontainers/features/github-cli:1": {
			"installDirectlyFromGitHubRelease": true,
			"version": "latest"
		},
		"ghcr.io/devcontainers/features/node:1": {
			"nodeGypDependencies": true,
			"version": "lts"
		}
	},

	// Features to add to the dev container. More info: https://containers.dev/features.
	// "features": {},

	// Use 'forwardPorts' to make a list of ports inside the container available locally.
	// This can be used to network with other containers or the host.
	"forwardPorts": [3000, 3001],

	"onCreateCommand": "(cp .env.example .env || echo \".env creation failed\"); (pipenv install || echo \"pipenv install failed\"); (bash database.sh || echo \"database.sh failed\");",
	// Use 'postCreateCommand' to run commands after the container is created.
	"postCreateCommand": "python docs/assets/greeting.py both > /workspaces/.codespaces/shared/first-run-notice.txt && npm install",

	// Uncomment to connect as root instead. More info: https://aka.ms/dev-containers-non-root.
	// "remoteUser": "root"
}

```

# .devcontainer/docker-compose.yml

```yml
version: '3.8'

services:
  app:
    build:
      context: ..
      dockerfile: .devcontainer/Dockerfile

    volumes:
      - ../..:/workspaces:cached

    # Overrides default command so things don't shut down after the process ends.
    command: sleep infinity

    # Runs app on the same network as the database container, allows "forwardPorts" in devcontainer.json function.
    network_mode: service:db

    # Use "forwardPorts" in **devcontainer.json** to forward an app port locally.
    # (Adding the "ports" property to this file will not forward from a Codespace.)

  db:
    image: postgres:latest
    restart: unless-stopped
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: gitpod
      POSTGRES_DB: example
      POSTGRES_PASSWORD: postgres

    # Add "forwardPorts": ["5432"] to **devcontainer.json** to forward PostgreSQL locally.
    # (Adding the "ports" property to this file will not forward from a Codespace.)

volumes:
  postgres-data:

```

# .devcontainer/Dockerfile

```
FROM mcr.microsoft.com/devcontainers/python:0-3.10

ENV PYTHONUNBUFFERED 1

# [Optional] If your requirements rarely change, uncomment this section to add them to the image.
# COPY requirements.txt /tmp/pip-tmp/
# RUN pip3 --disable-pip-version-check --no-cache-dir install -r /tmp/pip-tmp/requirements.txt \
#    && rm -rf /tmp/pip-tmp

#[Optional] Uncomment this section to install additional OS packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends postgresql-client




```

# .eslintrc

```
{
  "parser": "@babel/eslint-parser",
  "plugins": [
    "react"
  ],
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": [ "plugin:react/recommended"],
  "rules": {
    "strict":0,
    "no-unused-vars": 0,
    "no-console": 1,
    "no-mixed-spaces-and-tabs": 0,
    "no-debugger": 0, 
    "semi": ["error", "always"],
    "allowImportExportEverywhere": false,
    "indent": "off",
    "react/jsx-indent": "off",
    "react/jsx-indent-props": "off",
    "comma-dangle": [1, { //when to use the last comma
        "arrays": "never",
        "objects": "never",
        "imports": "never",
        "exports": "never",
        "functions": "ignore",
    }],
    "react/prop-types": [2]
  }
}

```

# .github/settings.yml

```yml
repository:
  has_wiki: false

# Labels: define labels for Issues and Pull Requests
labels:
  - name: "bug"
    color: c10000
  - name: ":nerd_face: 4geeks student"
    color: 7057ff
  - name: "enhancement"
    color: a2eeef
  - name: "first-timers-only"
    color: 69db89
  - name: "good first issue"
    color: 7057ff
  - name: "help wanted"
    color: 008672
  - name: ":star: P1"
    color: fbca04
  - name: ":star: P2"
    color: fbca04
  - name: ":memo: bc-writter"
    color: 98bde2
  - name: ":computer: bc-coder"
    color: 98bde2
  - name: ":beetle: bc-inspector"
    color: 98bde2

```

# .gitignore

```
# ignore all files starting with .
.*

# track this file .gitignore (i.e. do NOT ignore it)
!.gitignore
!.github
php_errorlog
.log

# do not ignore gitpod and render files
!.gitpod.Dockerfile
!.welcome
!.devcontainer
!.devcontainer/*
!Dockerfile.render
!.gitpod.yml
!render.yml
!.render-buildpacks.json

# track webpack configs (i.e. do NOT ignore it)
!composer.json
!webpack.config.js
!package.json
!webpack.production.js
!webpack.development.js

# track readme.md in the root (i.e. do NOT ignore it)
!README.md

# ignore OS generated files
ehthumbs.db
Thumbs.db

# ignore Editor files
*.sublime-project
*.sublime-workspace
*.komodoproject

# ignore log files and databases
*.log
*.sql
*.sqlite

# ignore compiled files
*.com
*.class
*.dll
*.exe
*.o
*.so

# ignore packaged files
*.7z
*.dmg
*.gz
*.iso
*.jar
*.rar
*.tar
*.zip

# ignore node/grunt dependency directories
node_modules/

# webpack output
dist/*
!public/
!public/*

# ignore the dist directory were our bundle files are going to be
!.gitkeep
!.htaccess
!.eslintrc
!.env.example
.now

# backend stuff
.venv
database.database
database.db
diagram.png
__pycache__/

```

# .gitpod.Dockerfile

```Dockerfile
FROM gitpod/workspace-postgres:latest

SHELL ["/bin/bash", "-c"]

RUN sudo apt-get update \
    && sudo apt-get update \
    && sudo apt-get install -y redis-server \
    && sudo apt-get clean \
    && sudo rm -rf /var/cache/apt/* /var/lib/apt/lists/* /tmp/*

# That Gitpod install pyenv for me? no, thanks
WORKDIR /home/gitpod/
RUN rm .pyenv -Rf
RUN rm .gp_pyenv.d -Rf
RUN curl https://pyenv.run | bash


RUN pyenv update && pyenv install 3.10.7 && pyenv global 3.10.7
RUN pip install pipenv yapf
RUN npm i heroku -g

# remove PIP_USER environment
USER gitpod
RUN if ! grep -q "export PIP_USER=no" "$HOME/.bashrc"; then printf '%s\n' "export PIP_USER=no" >> "$HOME/.bashrc"; fi
RUN echo "" >> $HOME/.bashrc
RUN echo "unset DATABASE_URL" >> $HOME/.bashrc
RUN echo "export DATABASE_URL" >> $HOME/.bashrc

```

# .gitpod.yml

```yml
image:
  file: .gitpod.Dockerfile
ports:
  - port: 3000
    onOpen: open-browser
    visibility: public
  - port: 3001
    onOpen: open-preview
    visibility: public
  - port: 5432
    onOpen: ignore
tasks:
  - init: >
      (cp .env.example .env || true) &&
      pipenv install &&
      psql -U gitpod -c 'CREATE DATABASE example;' &&
      psql -U gitpod -c 'CREATE EXTENSION unaccent;' -d example &&
      psql -c "ALTER USER gitpod PASSWORD 'postgres';" &&
      bash database.sh &&
      python docs/assets/greeting.py back
  - command: >
      npm install &&
      python docs/assets/greeting.py front
    openMode: split-right

vscode:
  extensions:
    - esbenp.prettier-vscode

```

# .vscode/settings.json

```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "workbench.editorAssociations": {   
        "*.md": "vscode.markdown.preview.editor"
    }
}

```

# 4geeks.ico

This is a binary file of the type: Binary

# database.sh

```sh
creating_migration () 
{
  pipenv run init
  pipenv run migrate
  pipenv run upgrade
}

migrate_upgrade () 
{
  pipenv run migrate
  pipenv run upgrade
}

dir=$(pwd)

if [ ! -d $dir/migrations ]
then
echo 'creating migration'
creating_migration
else
echo 'migrations already created'
echo 'updating migrations'
migrate_upgrade
fi

```

# Dockerfile.render

```render
FROM node:16

RUN apt update \
    && apt install software-properties-common \
    && add-apt-repository ppa:deadsnakes/ppa \
    && apt update \
    && apt install python3.10

WORKDIR /opt/app
COPY --from=build /opt/app/venv /venv

ENV PATH="/opt/app/venv/bin:$PATH"
ENV NODE_ENV=container
```

# docs/assets/db_config.gif

This is a binary file of the type: Image

# docs/assets/debugging_icon.png

This is a binary file of the type: Image

# docs/assets/debugging.gif

This is a binary file of the type: Image

# docs/assets/diagram.png

This is a binary file of the type: Image

# docs/assets/env_variables.gif

This is a binary file of the type: Image

# docs/assets/env-file.png

This is a binary file of the type: Image

# docs/assets/greeting.py

```py
import sys
def blue(_str):
    return f"\033[0;33m{_str}\033[0m"
environment = sys.argv.pop(1)
if environment == "back":
    print(f"""
    Hello 😁 ! This terminal will represent your 🐍  backend!
    
    1. Get inside the environment  {blue("$ pipenv shell")}
    2. Start the server by typing {blue("$ pipenv run start")}
    """)
if environment == "front":
    print(f"""
    This terminal is for 💻 front-end!
    
    1. Start webpack dev server {blue("$ npm run start")}
    """)

if environment == "both":
    print(f"""
    Welcome to the full-stack template at 4Geeks 😁.
    
    1. Start by running your 🐍 python backend using the command {blue("$ pipenv run start")}
    2. Open a new terminal to run your front-end with the following command {blue("$ npm run start")}

    Note: ⚠️ Please keep in mind you will always need two terminals, one for the front end, one for the back-end.
    🛟 You can find documentation here: https://start.4geeksacademy.com
    """)
```

# docs/assets/preview.png

This is a binary file of the type: Image

# docs/assets/reset_migrations.bash

```bash
rm -R -f ./migrations &&
pipenv run init &&
dropdb -h localhost -U gitpod example || true &&
createdb -h localhost -U gitpod example || true &&
psql -h localhost example -U gitpod -c 'CREATE EXTENSION unaccent;' || true &&
pipenv run migrate &&
pipenv run upgrade

```

# docs/assets/rigo-baby.jpg

This is a binary file of the type: Image

# docs/CHANGE_LOG.md

```md
# CHANGE LOG

Here we are tracking the previous and upcoming changes (roadmap), pull request this file or open an issue if you have any suggestions for the next version of the boilerplate.

## Roadmap v2.0

- [ ] Update documentation with more examples

### August 9th, 2019
- [x] Removed eralchemy from the Pipfile because its compatibility with Apply and PC computers its not clear. There is now way to create a database diagra.png anymore.
- [x] Added this changelog file to keep track of changes on the boilerplate.
- [x] Added documentation for [data validations](https://github.com/4GeeksAcademy/flask-rest-hello/blob/master/docs/DATA_VALIDATIONS.md)
- [x] Added documentation for [SQL Alchemy operations](https://github.com/4GeeksAcademy/flask-rest-hello/edit/master/docs/MYSQL.md).

### Sep 16th, 2019
- [x] Added debuging functionality

```

# docs/HELP.md

```md
You can find a comprehensive documentation about this boilerplate here:
https://start.4geeksacademy.com/starters/full-stack
```

# frontend/.gitignore

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

# frontend/eslint.config.js

```js
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]

```

# frontend/index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

# frontend/package.json

```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.19.0",
    "@types/react": "^19.0.8",
    "@types/react-dom": "^19.0.3",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.19.0",
    "eslint-plugin-react": "^7.37.4",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.18",
    "globals": "^15.14.0",
    "postcss": "^8.5.2",
    "tailwindcss": "^4.0.6",
    "vite": "^6.1.0"
  }
}

```

# frontend/postcss.config.js

```js
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default {
  plugins: [
    tailwindcss,
    autoprefixer
  ],
}
```

# frontend/public/vite.svg

This is a file of the type: SVG Image

# frontend/README.md

```md
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

```

# frontend/src/App.css

```css
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}

```

# frontend/src/App.jsx

```jsx
import './App.css'

function App() {
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4">
    {/* Main Card Container */}
    <div className="max-w-4xl w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 
                    transform hover:scale-105 transition-all duration-300">
      
      {/* Header with Animation */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r 
                       from-blue-600 to-purple-600 animate-pulse">
          Natura Properties
        </h1>
        <p className="mt-4 text-gray-600 text-xl">
          Your Dream Home Awaits
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Feature 1 */}
        <div className="group bg-blue-50 p-6 rounded-xl hover:bg-blue-100 transition-colors">
          <div className="h-12 w-12 bg-blue-500 rounded-lg mb-4 
                        group-hover:rotate-12 transition-transform">
          </div>
          <h3 className="font-bold text-blue-800">Modern Design</h3>
          <p className="text-blue-600">Stylish and contemporary spaces</p>
        </div>

        {/* Feature 2 */}
        <div className="group bg-purple-50 p-6 rounded-xl hover:bg-purple-100 transition-colors">
          <div className="h-12 w-12 bg-purple-500 rounded-lg mb-4 
                        group-hover:rotate-12 transition-transform">
          </div>
          <h3 className="font-bold text-purple-800">Prime Location</h3>
          <p className="text-purple-600">In the heart of the city</p>
        </div>

        {/* Feature 3 */}
        <div className="group bg-pink-50 p-6 rounded-xl hover:bg-pink-100 transition-colors">
          <div className="h-12 w-12 bg-pink-500 rounded-lg mb-4 
                        group-hover:rotate-12 transition-transform">
          </div>
          <h3 className="font-bold text-pink-800">Luxury Living</h3>
          <p className="text-pink-600">Premium amenities included</p>
        </div>
      </div>

      {/* Animated Button */}
      <div className="text-center mt-8">
        <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 
                         text-white rounded-full font-bold text-lg
                         hover:shadow-lg hover:-translate-y-1 
                         transition-all duration-300
                         animate-bounce">
          Explore Properties
        </button>
      </div>
    </div>
  </div>
)
}


export default App





```

# frontend/src/assets/react.svg

This is a file of the type: SVG Image

# frontend/src/index.css

```css
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}

```

# frontend/src/main.jsx

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```

# frontend/tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
```

# frontend/vite.config.js

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

```

# index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="icon" href="/NaturaLogoBG.png" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Natura Properties</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/front/main.jsx"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
  </body>
</html>
```

# learn.json

```json
{
    "title": {
      "en": "WebApp Template with React JS and Flask API",
      "es": "Plantilla de WebApp con React JS y Flask API"
    },
    "description": {
      "en": "Build web applications using React.js for the front end and python/flask for your backend API.",
      "es": "Construye aplicaciones web usando React.js para el front end y python/flask para tu API backend."
    },
    "slug": "react-flask-webapp-template",
    "difficulty": "intermediate",
    "duration": "4",
    "projectType": "template",
    "repository": "https://github.com/4geeksacademy/react-flask-hello",
    "preview": "https://github.com/4geeksacademy/react-flask-hello/preview.png",
    "video": "https://www.loom.com/share/f37c6838b3f1496c95111e515e83dd9b",
    "technologies": ["React.js", "Flask", "Python", "SQLAlchemy","vite"]
}

```

# migrations/alembic.ini

```ini
# A generic, single database configuration.

[alembic]
# template used to generate migration files
# file_template = %%(rev)s_%%(slug)s

# set to 'true' to run the environment during
# the 'revision' command, regardless of autogenerate
# revision_environment = false


# Logging configuration
[loggers]
keys = root,sqlalchemy,alembic,flask_migrate

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[logger_flask_migrate]
level = INFO
handlers =
qualname = flask_migrate

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S

```

# migrations/env.py

```py
import logging
from logging.config import fileConfig

from flask import current_app

from alembic import context

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
fileConfig(config.config_file_name)
logger = logging.getLogger('alembic.env')


def get_engine():
    try:
        # this works with Flask-SQLAlchemy<3 and Alchemical
        return current_app.extensions['migrate'].db.get_engine()
    except (TypeError, AttributeError):
        # this works with Flask-SQLAlchemy>=3
        return current_app.extensions['migrate'].db.engine


def get_engine_url():
    try:
        return get_engine().url.render_as_string(hide_password=False).replace(
            '%', '%%')
    except AttributeError:
        return str(get_engine().url).replace('%', '%%')


# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
config.set_main_option('sqlalchemy.url', get_engine_url())
target_db = current_app.extensions['migrate'].db

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def get_metadata():
    if hasattr(target_db, 'metadatas'):
        return target_db.metadatas[None]
    return target_db.metadata


def run_migrations_offline():
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url, target_metadata=get_metadata(), literal_binds=True
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """

    # this callback is used to prevent an auto-migration from being generated
    # when there are no changes to the schema
    # reference: http://alembic.zzzcomputing.com/en/latest/cookbook.html
    def process_revision_directives(context, revision, directives):
        if getattr(config.cmd_opts, 'autogenerate', False):
            script = directives[0]
            if script.upgrade_ops.is_empty():
                directives[:] = []
                logger.info('No changes in schema detected.')

    conf_args = current_app.extensions['migrate'].configure_args
    if conf_args.get("process_revision_directives") is None:
        conf_args["process_revision_directives"] = process_revision_directives

    connectable = get_engine()

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=get_metadata(),
            **conf_args
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

```

# migrations/README

```
Single-database configuration for Flask.

```

# migrations/script.py.mako

```mako
"""${message}

Revision ID: ${up_revision}
Revises: ${down_revision | comma,n}
Create Date: ${create_date}

"""
from alembic import op
import sqlalchemy as sa
${imports if imports else ""}

# revision identifiers, used by Alembic.
revision = ${repr(up_revision)}
down_revision = ${repr(down_revision)}
branch_labels = ${repr(branch_labels)}
depends_on = ${repr(depends_on)}


def upgrade():
    ${upgrades if upgrades else "pass"}


def downgrade():
    ${downgrades if downgrades else "pass"}

```

# migrations/versions/e16d9997f0f7_.py

```py
"""empty message

Revision ID: e16d9997f0f7
Revises: 
Create Date: 2025-02-11 19:12:43.374246

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e16d9997f0f7'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=80), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user')
    # ### end Alembic commands ###

```

# NaturaLogoBG.png

This is a binary file of the type: Image

# package.json

```json
{}

```

# Pipfile

```
[[source]]
name = "pypi"
url = "https://pypi.org/simple"
verify_ssl = true

[dev-packages]

[packages]
flask = "*"
sqlalchemy = "==1.4.46"
flask-sqlalchemy = "*"
flask-migrate = "*"
flask-swagger = "*"
psycopg2-binary = "*"
python-dotenv = "*"
flask-cors = "*"
gunicorn = "*"
cloudinary = "*"
flask-admin = "*"
typing-extensions = "*"
flask-jwt-extended = "==4.6.0"
wtforms = "==3.1.2"

[requires]
python_version = "3.10"

[scripts]
start="flask run -p 3001 -h 0.0.0.0"
init="flask db init"
migrate="flask db migrate"
local="heroku local"
upgrade="flask db upgrade"
downgrade="flask db downgrade"
insert-test-data="flask insert-test-data"
reset_db="bash ./docs/assets/reset_migrations.bash"
deploy="echo 'Please follow this 3 steps to deploy: https://github.com/4GeeksAcademy/flask-rest-hello/blob/master/README.md#deploy-your-website-to-heroku' "

```

# Pipfile.lock

```lock
{
    "_meta": {
        "hash": {
            "sha256": "4f0e9a772f04b621ff0313b7ecfa468af1526aa27df8bfcacac6955d499d352d"
        },
        "pipfile-spec": 6,
        "requires": {
            "python_version": "3.10"
        },
        "sources": [
            {
                "name": "pypi",
                "url": "https://pypi.org/simple",
                "verify_ssl": true
            }
        ]
    },
    "default": {
        "alembic": {
            "hashes": [
                "sha256:1acdd7a3a478e208b0503cd73614d5e4c6efafa4e73518bb60e4f2846a37b1c5",
                "sha256:496e888245a53adf1498fcab31713a469c65836f8de76e01399aa1c3e90dd213"
            ],
            "markers": "python_version >= '3.8'",
            "version": "==1.14.1"
        },
        "blinker": {
            "hashes": [
                "sha256:b4ce2265a7abece45e7cc896e98dbebe6cead56bcf805a3d23136d145f5445bf",
                "sha256:ba0efaa9080b619ff2f3459d1d500c57bddea4a6b424b60a91141db6fd2f08bc"
            ],
            "markers": "python_version >= '3.9'",
            "version": "==1.9.0"
        },
        "certifi": {
            "hashes": [
                "sha256:3d5da6925056f6f18f119200434a4780a94263f10d1c21d032a6f6b2baa20651",
                "sha256:ca78db4565a652026a4db2bcdf68f2fb589ea80d0be70e03929ed730746b84fe"
            ],
            "markers": "python_version >= '3.6'",
            "version": "==2025.1.31"
        },
        "click": {
            "hashes": [
                "sha256:63c132bbbed01578a06712a2d1f497bb62d9c1c0d329b7903a866228027263b2",
                "sha256:ed53c9d8990d83c2a27deae68e4ee337473f6330c040a31d4225c9574d16096a"
            ],
            "markers": "python_version >= '3.7'",
            "version": "==8.1.8"
        },
        "cloudinary": {
            "hashes": [
                "sha256:ba223705409b2aaddd5196c2184d65f50a83dffcba3b94f3727658ff6a0172a3",
                "sha256:e4191b470c5bae55542b64e0a78659af42971880294456dca480bc974fa9280a"
            ],
            "index": "pypi",
            "version": "==1.42.2"
        },
        "flask": {
            "hashes": [
                "sha256:5f873c5184c897c8d9d1b05df1e3d01b14910ce69607a117bd3277098a5836ac",
                "sha256:d667207822eb83f1c4b50949b1623c8fc8d51f2341d65f72e1a1815397551136"
            ],
            "index": "pypi",
            "version": "==3.1.0"
        },
        "flask-admin": {
            "hashes": [
                "sha256:24cae2af832b6a611a01d7dc35f42d266c1d6c75a426b869d8cb241b78233369",
                "sha256:fd8190f1ec3355913a22739c46ed3623f1d82b8112cde324c60a6fc9b21c9406"
            ],
            "index": "pypi",
            "version": "==1.6.1"
        },
        "flask-cors": {
            "hashes": [
                "sha256:5aadb4b950c4e93745034594d9f3ea6591f734bb3662e16e255ffbf5e89c88ef",
                "sha256:b9e307d082a9261c100d8fb0ba909eec6a228ed1b60a8315fd85f783d61910bc"
            ],
            "index": "pypi",
            "version": "==5.0.0"
        },
        "flask-jwt-extended": {
            "hashes": [
                "sha256:63a28fc9731bcc6c4b8815b6f954b5904caa534fc2ae9b93b1d3ef12930dca95",
                "sha256:9215d05a9413d3855764bcd67035e75819d23af2fafb6b55197eb5a3313fdfb2"
            ],
            "index": "pypi",
            "version": "==4.6.0"
        },
        "flask-migrate": {
            "hashes": [
                "sha256:1a336b06eb2c3ace005f5f2ded8641d534c18798d64061f6ff11f79e1434126d",
                "sha256:24d8051af161782e0743af1b04a152d007bad9772b2bca67b7ec1e8ceeb3910d"
            ],
            "index": "pypi",
            "version": "==4.1.0"
        },
        "flask-sqlalchemy": {
            "hashes": [
                "sha256:c5765e58ca145401b52106c0f46178569243c5da25556be2c231ecc60867c5b1",
                "sha256:cabb6600ddd819a9f859f36515bb1bd8e7dbf30206cc679d2b081dff9e383283"
            ],
            "index": "pypi",
            "version": "==3.0.5"
        },
        "flask-swagger": {
            "hashes": [
                "sha256:3caddb1311388eafc86f82f8e64ba386a5df6b84e5f16dfae19ca08173eba216",
                "sha256:b4085f5bc36df4c20b6548cd1413adc9cf35719b0f0695367cd542065145294d"
            ],
            "index": "pypi",
            "version": "==0.2.14"
        },
        "greenlet": {
            "hashes": [
                "sha256:0153404a4bb921f0ff1abeb5ce8a5131da56b953eda6e14b88dc6bbc04d2049e",
                "sha256:03a088b9de532cbfe2ba2034b2b85e82df37874681e8c470d6fb2f8c04d7e4b7",
                "sha256:04b013dc07c96f83134b1e99888e7a79979f1a247e2a9f59697fa14b5862ed01",
                "sha256:05175c27cb459dcfc05d026c4232f9de8913ed006d42713cb8a5137bd49375f1",
                "sha256:09fc016b73c94e98e29af67ab7b9a879c307c6731a2c9da0db5a7d9b7edd1159",
                "sha256:0bbae94a29c9e5c7e4a2b7f0aae5c17e8e90acbfd3bf6270eeba60c39fce3563",
                "sha256:0fde093fb93f35ca72a556cf72c92ea3ebfda3d79fc35bb19fbe685853869a83",
                "sha256:1443279c19fca463fc33e65ef2a935a5b09bb90f978beab37729e1c3c6c25fe9",
                "sha256:1776fd7f989fc6b8d8c8cb8da1f6b82c5814957264d1f6cf818d475ec2bf6395",
                "sha256:1d3755bcb2e02de341c55b4fca7a745a24a9e7212ac953f6b3a48d117d7257aa",
                "sha256:23f20bb60ae298d7d8656c6ec6db134bca379ecefadb0b19ce6f19d1f232a942",
                "sha256:275f72decf9932639c1c6dd1013a1bc266438eb32710016a1c742df5da6e60a1",
                "sha256:2846930c65b47d70b9d178e89c7e1a69c95c1f68ea5aa0a58646b7a96df12441",
                "sha256:3319aa75e0e0639bc15ff54ca327e8dc7a6fe404003496e3c6925cd3142e0e22",
                "sha256:346bed03fe47414091be4ad44786d1bd8bef0c3fcad6ed3dee074a032ab408a9",
                "sha256:36b89d13c49216cadb828db8dfa6ce86bbbc476a82d3a6c397f0efae0525bdd0",
                "sha256:37b9de5a96111fc15418819ab4c4432e4f3c2ede61e660b1e33971eba26ef9ba",
                "sha256:396979749bd95f018296af156201d6211240e7a23090f50a8d5d18c370084dc3",
                "sha256:3b2813dc3de8c1ee3f924e4d4227999285fd335d1bcc0d2be6dc3f1f6a318ec1",
                "sha256:411f015496fec93c1c8cd4e5238da364e1da7a124bcb293f085bf2860c32c6f6",
                "sha256:47da355d8687fd65240c364c90a31569a133b7b60de111c255ef5b606f2ae291",
                "sha256:48ca08c771c268a768087b408658e216133aecd835c0ded47ce955381105ba39",
                "sha256:4afe7ea89de619adc868e087b4d2359282058479d7cfb94970adf4b55284574d",
                "sha256:4ce3ac6cdb6adf7946475d7ef31777c26d94bccc377e070a7986bd2d5c515467",
                "sha256:4ead44c85f8ab905852d3de8d86f6f8baf77109f9da589cb4fa142bd3b57b475",
                "sha256:54558ea205654b50c438029505def3834e80f0869a70fb15b871c29b4575ddef",
                "sha256:5e06afd14cbaf9e00899fae69b24a32f2196c19de08fcb9f4779dd4f004e5e7c",
                "sha256:62ee94988d6b4722ce0028644418d93a52429e977d742ca2ccbe1c4f4a792511",
                "sha256:63e4844797b975b9af3a3fb8f7866ff08775f5426925e1e0bbcfe7932059a12c",
                "sha256:6510bf84a6b643dabba74d3049ead221257603a253d0a9873f55f6a59a65f822",
                "sha256:667a9706c970cb552ede35aee17339a18e8f2a87a51fba2ed39ceeeb1004798a",
                "sha256:6ef9ea3f137e5711f0dbe5f9263e8c009b7069d8a1acea822bd5e9dae0ae49c8",
                "sha256:7017b2be767b9d43cc31416aba48aab0d2309ee31b4dbf10a1d38fb7972bdf9d",
                "sha256:7124e16b4c55d417577c2077be379514321916d5790fa287c9ed6f23bd2ffd01",
                "sha256:73aaad12ac0ff500f62cebed98d8789198ea0e6f233421059fa68a5aa7220145",
                "sha256:77c386de38a60d1dfb8e55b8c1101d68c79dfdd25c7095d51fec2dd800892b80",
                "sha256:7876452af029456b3f3549b696bb36a06db7c90747740c5302f74a9e9fa14b13",
                "sha256:7939aa3ca7d2a1593596e7ac6d59391ff30281ef280d8632fa03d81f7c5f955e",
                "sha256:8320f64b777d00dd7ccdade271eaf0cad6636343293a25074cc5566160e4de7b",
                "sha256:85f3ff71e2e60bd4b4932a043fbbe0f499e263c628390b285cb599154a3b03b1",
                "sha256:8b8b36671f10ba80e159378df9c4f15c14098c4fd73a36b9ad715f057272fbef",
                "sha256:93147c513fac16385d1036b7e5b102c7fbbdb163d556b791f0f11eada7ba65dc",
                "sha256:935e943ec47c4afab8965954bf49bfa639c05d4ccf9ef6e924188f762145c0ff",
                "sha256:94b6150a85e1b33b40b1464a3f9988dcc5251d6ed06842abff82e42632fac120",
                "sha256:94ebba31df2aa506d7b14866fed00ac141a867e63143fe5bca82a8e503b36437",
                "sha256:95ffcf719966dd7c453f908e208e14cde192e09fde6c7186c8f1896ef778d8cd",
                "sha256:98884ecf2ffb7d7fe6bd517e8eb99d31ff7855a840fa6d0d63cd07c037f6a981",
                "sha256:99cfaa2110534e2cf3ba31a7abcac9d328d1d9f1b95beede58294a60348fba36",
                "sha256:9e8f8c9cb53cdac7ba9793c276acd90168f416b9ce36799b9b885790f8ad6c0a",
                "sha256:a0dfc6c143b519113354e780a50381508139b07d2177cb6ad6a08278ec655798",
                "sha256:b2795058c23988728eec1f36a4e5e4ebad22f8320c85f3587b539b9ac84128d7",
                "sha256:b42703b1cf69f2aa1df7d1030b9d77d3e584a70755674d60e710f0af570f3761",
                "sha256:b7cede291382a78f7bb5f04a529cb18e068dd29e0fb27376074b6d0317bf4dd0",
                "sha256:b8a678974d1f3aa55f6cc34dc480169d58f2e6d8958895d68845fa4ab566509e",
                "sha256:b8da394b34370874b4572676f36acabac172602abf054cbc4ac910219f3340af",
                "sha256:c3a701fe5a9695b238503ce5bbe8218e03c3bcccf7e204e455e7462d770268aa",
                "sha256:c4aab7f6381f38a4b42f269057aee279ab0fc7bf2e929e3d4abfae97b682a12c",
                "sha256:ca9d0ff5ad43e785350894d97e13633a66e2b50000e8a183a50a88d834752d42",
                "sha256:d0028e725ee18175c6e422797c407874da24381ce0690d6b9396c204c7f7276e",
                "sha256:d21e10da6ec19b457b82636209cbe2331ff4306b54d06fa04b7c138ba18c8a81",
                "sha256:d5e975ca70269d66d17dd995dafc06f1b06e8cb1ec1e9ed54c1d1e4a7c4cf26e",
                "sha256:da7a9bff22ce038e19bf62c4dd1ec8391062878710ded0a845bcf47cc0200617",
                "sha256:db32b5348615a04b82240cc67983cb315309e88d444a288934ee6ceaebcad6cc",
                "sha256:dcc62f31eae24de7f8dce72134c8651c58000d3b1868e01392baea7c32c247de",
                "sha256:dfc59d69fc48664bc693842bd57acfdd490acafda1ab52c7836e3fc75c90a111",
                "sha256:e347b3bfcf985a05e8c0b7d462ba6f15b1ee1c909e2dcad795e49e91b152c383",
                "sha256:e4d333e558953648ca09d64f13e6d8f0523fa705f51cae3f03b5983489958c70",
                "sha256:ed10eac5830befbdd0c32f83e8aa6288361597550ba669b04c48f0f9a2c843c6",
                "sha256:efc0f674aa41b92da8c49e0346318c6075d734994c3c4e4430b1c3f853e498e4",
                "sha256:f1695e76146579f8c06c1509c7ce4dfe0706f49c6831a817ac04eebb2fd02011",
                "sha256:f1d4aeb8891338e60d1ab6127af1fe45def5259def8094b9c7e34690c8858803",
                "sha256:f406b22b7c9a9b4f8aa9d2ab13d6ae0ac3e85c9a809bd590ad53fed2bf70dc79",
                "sha256:f6ff3b14f2df4c41660a7dec01045a045653998784bf8cfcb5a525bdffffbc8f"
            ],
            "markers": "python_version >= '3' and platform_machine == 'aarch64' or (platform_machine == 'ppc64le' or (platform_machine == 'x86_64' or (platform_machine == 'amd64' or (platform_machine == 'AMD64' or (platform_machine == 'win32' or platform_machine == 'WIN32')))))",
            "version": "==3.1.1"
        },
        "gunicorn": {
            "hashes": [
                "sha256:ec400d38950de4dfd418cff8328b2c8faed0edb0d517d3394e457c317908ca4d",
                "sha256:f014447a0101dc57e294f6c18ca6b40227a4c90e9bdb586042628030cba004ec"
            ],
            "index": "pypi",
            "version": "==23.0.0"
        },
        "itsdangerous": {
            "hashes": [
                "sha256:c6242fc49e35958c8b15141343aa660db5fc54d4f13a1db01a3f5891b98700ef",
                "sha256:e0050c0b7da1eea53ffaf149c0cfbb5c6e2e2b69c4bef22c81fa6eb73e5f6173"
            ],
            "markers": "python_version >= '3.8'",
            "version": "==2.2.0"
        },
        "jinja2": {
            "hashes": [
                "sha256:8fefff8dc3034e27bb80d67c671eb8a9bc424c0ef4c0826edbff304cceff43bb",
                "sha256:aba0f4dc9ed8013c424088f68a5c226f7d6097ed89b246d7749c2ec4175c6adb"
            ],
            "markers": "python_version >= '3.7'",
            "version": "==3.1.5"
        },
        "mako": {
            "hashes": [
                "sha256:95920acccb578427a9aa38e37a186b1e43156c87260d7ba18ca63aa4c7cbd3a1",
                "sha256:b5d65ff3462870feec922dbccf38f6efb44e5714d7b593a656be86663d8600ac"
            ],
            "markers": "python_version >= '3.8'",
            "version": "==1.3.9"
        },
        "markupsafe": {
            "hashes": [
                "sha256:0bff5e0ae4ef2e1ae4fdf2dfd5b76c75e5c2fa4132d05fc1b0dabcd20c7e28c4",
                "sha256:0f4ca02bea9a23221c0182836703cbf8930c5e9454bacce27e767509fa286a30",
                "sha256:1225beacc926f536dc82e45f8a4d68502949dc67eea90eab715dea3a21c1b5f0",
                "sha256:131a3c7689c85f5ad20f9f6fb1b866f402c445b220c19fe4308c0b147ccd2ad9",
                "sha256:15ab75ef81add55874e7ab7055e9c397312385bd9ced94920f2802310c930396",
                "sha256:1a9d3f5f0901fdec14d8d2f66ef7d035f2157240a433441719ac9a3fba440b13",
                "sha256:1c99d261bd2d5f6b59325c92c73df481e05e57f19837bdca8413b9eac4bd8028",
                "sha256:1e084f686b92e5b83186b07e8a17fc09e38fff551f3602b249881fec658d3eca",
                "sha256:2181e67807fc2fa785d0592dc2d6206c019b9502410671cc905d132a92866557",
                "sha256:2cb8438c3cbb25e220c2ab33bb226559e7afb3baec11c4f218ffa7308603c832",
                "sha256:3169b1eefae027567d1ce6ee7cae382c57fe26e82775f460f0b2778beaad66c0",
                "sha256:3809ede931876f5b2ec92eef964286840ed3540dadf803dd570c3b7e13141a3b",
                "sha256:38a9ef736c01fccdd6600705b09dc574584b89bea478200c5fbf112a6b0d5579",
                "sha256:3d79d162e7be8f996986c064d1c7c817f6df3a77fe3d6859f6f9e7be4b8c213a",
                "sha256:444dcda765c8a838eaae23112db52f1efaf750daddb2d9ca300bcae1039adc5c",
                "sha256:48032821bbdf20f5799ff537c7ac3d1fba0ba032cfc06194faffa8cda8b560ff",
                "sha256:4aa4e5faecf353ed117801a068ebab7b7e09ffb6e1d5e412dc852e0da018126c",
                "sha256:52305740fe773d09cffb16f8ed0427942901f00adedac82ec8b67752f58a1b22",
                "sha256:569511d3b58c8791ab4c2e1285575265991e6d8f8700c7be0e88f86cb0672094",
                "sha256:57cb5a3cf367aeb1d316576250f65edec5bb3be939e9247ae594b4bcbc317dfb",
                "sha256:5b02fb34468b6aaa40dfc198d813a641e3a63b98c2b05a16b9f80b7ec314185e",
                "sha256:6381026f158fdb7c72a168278597a5e3a5222e83ea18f543112b2662a9b699c5",
                "sha256:6af100e168aa82a50e186c82875a5893c5597a0c1ccdb0d8b40240b1f28b969a",
                "sha256:6c89876f41da747c8d3677a2b540fb32ef5715f97b66eeb0c6b66f5e3ef6f59d",
                "sha256:6e296a513ca3d94054c2c881cc913116e90fd030ad1c656b3869762b754f5f8a",
                "sha256:70a87b411535ccad5ef2f1df5136506a10775d267e197e4cf531ced10537bd6b",
                "sha256:7e94c425039cde14257288fd61dcfb01963e658efbc0ff54f5306b06054700f8",
                "sha256:846ade7b71e3536c4e56b386c2a47adf5741d2d8b94ec9dc3e92e5e1ee1e2225",
                "sha256:88416bd1e65dcea10bc7569faacb2c20ce071dd1f87539ca2ab364bf6231393c",
                "sha256:88b49a3b9ff31e19998750c38e030fc7bb937398b1f78cfa599aaef92d693144",
                "sha256:8c4e8c3ce11e1f92f6536ff07154f9d49677ebaaafc32db9db4620bc11ed480f",
                "sha256:8e06879fc22a25ca47312fbe7c8264eb0b662f6db27cb2d3bbbc74b1df4b9b87",
                "sha256:9025b4018f3a1314059769c7bf15441064b2207cb3f065e6ea1e7359cb46db9d",
                "sha256:93335ca3812df2f366e80509ae119189886b0f3c2b81325d39efdb84a1e2ae93",
                "sha256:9778bd8ab0a994ebf6f84c2b949e65736d5575320a17ae8984a77fab08db94cf",
                "sha256:9e2d922824181480953426608b81967de705c3cef4d1af983af849d7bd619158",
                "sha256:a123e330ef0853c6e822384873bef7507557d8e4a082961e1defa947aa59ba84",
                "sha256:a904af0a6162c73e3edcb969eeeb53a63ceeb5d8cf642fade7d39e7963a22ddb",
                "sha256:ad10d3ded218f1039f11a75f8091880239651b52e9bb592ca27de44eed242a48",
                "sha256:b424c77b206d63d500bcb69fa55ed8d0e6a3774056bdc4839fc9298a7edca171",
                "sha256:b5a6b3ada725cea8a5e634536b1b01c30bcdcd7f9c6fff4151548d5bf6b3a36c",
                "sha256:ba8062ed2cf21c07a9e295d5b8a2a5ce678b913b45fdf68c32d95d6c1291e0b6",
                "sha256:ba9527cdd4c926ed0760bc301f6728ef34d841f405abf9d4f959c478421e4efd",
                "sha256:bbcb445fa71794da8f178f0f6d66789a28d7319071af7a496d4d507ed566270d",
                "sha256:bcf3e58998965654fdaff38e58584d8937aa3096ab5354d493c77d1fdd66d7a1",
                "sha256:c0ef13eaeee5b615fb07c9a7dadb38eac06a0608b41570d8ade51c56539e509d",
                "sha256:cabc348d87e913db6ab4aa100f01b08f481097838bdddf7c7a84b7575b7309ca",
                "sha256:cdb82a876c47801bb54a690c5ae105a46b392ac6099881cdfb9f6e95e4014c6a",
                "sha256:cfad01eed2c2e0c01fd0ecd2ef42c492f7f93902e39a42fc9ee1692961443a29",
                "sha256:d16a81a06776313e817c951135cf7340a3e91e8c1ff2fac444cfd75fffa04afe",
                "sha256:d8213e09c917a951de9d09ecee036d5c7d36cb6cb7dbaece4c71a60d79fb9798",
                "sha256:e07c3764494e3776c602c1e78e298937c3315ccc9043ead7e685b7f2b8d47b3c",
                "sha256:e17c96c14e19278594aa4841ec148115f9c7615a47382ecb6b82bd8fea3ab0c8",
                "sha256:e444a31f8db13eb18ada366ab3cf45fd4b31e4db1236a4448f68778c1d1a5a2f",
                "sha256:e6a2a455bd412959b57a172ce6328d2dd1f01cb2135efda2e4576e8a23fa3b0f",
                "sha256:eaa0a10b7f72326f1372a713e73c3f739b524b3af41feb43e4921cb529f5929a",
                "sha256:eb7972a85c54febfb25b5c4b4f3af4dcc731994c7da0d8a0b4a6eb0640e1d178",
                "sha256:ee55d3edf80167e48ea11a923c7386f4669df67d7994554387f84e7d8b0a2bf0",
                "sha256:f3818cb119498c0678015754eba762e0d61e5b52d34c8b13d770f0719f7b1d79",
                "sha256:f8b3d067f2e40fe93e1ccdd6b2e1d16c43140e76f02fb1319a05cf2b79d99430",
                "sha256:fcabf5ff6eea076f859677f5f0b6b5c1a51e70a376b0579e0eadef8db48c6b50"
            ],
            "markers": "python_version >= '3.9'",
            "version": "==3.0.2"
        },
        "packaging": {
            "hashes": [
                "sha256:09abb1bccd265c01f4a3aa3f7a7db064b36514d2cba19a2f694fe6150451a759",
                "sha256:c228a6dc5e932d346bc5739379109d49e8853dd8223571c7c5b55260edc0b97f"
            ],
            "markers": "python_version >= '3.8'",
            "version": "==24.2"
        },
        "psycopg2-binary": {
            "hashes": [
                "sha256:04392983d0bb89a8717772a193cfaac58871321e3ec69514e1c4e0d4957b5aff",
                "sha256:056470c3dc57904bbf63d6f534988bafc4e970ffd50f6271fc4ee7daad9498a5",
                "sha256:0ea8e3d0ae83564f2fc554955d327fa081d065c8ca5cc6d2abb643e2c9c1200f",
                "sha256:155e69561d54d02b3c3209545fb08938e27889ff5a10c19de8d23eb5a41be8a5",
                "sha256:18c5ee682b9c6dd3696dad6e54cc7ff3a1a9020df6a5c0f861ef8bfd338c3ca0",
                "sha256:19721ac03892001ee8fdd11507e6a2e01f4e37014def96379411ca99d78aeb2c",
                "sha256:1a6784f0ce3fec4edc64e985865c17778514325074adf5ad8f80636cd029ef7c",
                "sha256:2286791ececda3a723d1910441c793be44625d86d1a4e79942751197f4d30341",
                "sha256:230eeae2d71594103cd5b93fd29d1ace6420d0b86f4778739cb1a5a32f607d1f",
                "sha256:245159e7ab20a71d989da00f280ca57da7641fa2cdcf71749c193cea540a74f7",
                "sha256:26540d4a9a4e2b096f1ff9cce51253d0504dca5a85872c7f7be23be5a53eb18d",
                "sha256:270934a475a0e4b6925b5f804e3809dd5f90f8613621d062848dd82f9cd62007",
                "sha256:27422aa5f11fbcd9b18da48373eb67081243662f9b46e6fd07c3eb46e4535142",
                "sha256:2ad26b467a405c798aaa1458ba09d7e2b6e5f96b1ce0ac15d82fd9f95dc38a92",
                "sha256:2b3d2491d4d78b6b14f76881905c7a8a8abcf974aad4a8a0b065273a0ed7a2cb",
                "sha256:2ce3e21dc3437b1d960521eca599d57408a695a0d3c26797ea0f72e834c7ffe5",
                "sha256:30e34c4e97964805f715206c7b789d54a78b70f3ff19fbe590104b71c45600e5",
                "sha256:3216ccf953b3f267691c90c6fe742e45d890d8272326b4a8b20850a03d05b7b8",
                "sha256:32581b3020c72d7a421009ee1c6bf4a131ef5f0a968fab2e2de0c9d2bb4577f1",
                "sha256:35958ec9e46432d9076286dda67942ed6d968b9c3a6a2fd62b48939d1d78bf68",
                "sha256:3abb691ff9e57d4a93355f60d4f4c1dd2d68326c968e7db17ea96df3c023ef73",
                "sha256:3c18f74eb4386bf35e92ab2354a12c17e5eb4d9798e4c0ad3a00783eae7cd9f1",
                "sha256:3c4745a90b78e51d9ba06e2088a2fe0c693ae19cc8cb051ccda44e8df8a6eb53",
                "sha256:3c4ded1a24b20021ebe677b7b08ad10bf09aac197d6943bfe6fec70ac4e4690d",
                "sha256:3e9c76f0ac6f92ecfc79516a8034a544926430f7b080ec5a0537bca389ee0906",
                "sha256:48b338f08d93e7be4ab2b5f1dbe69dc5e9ef07170fe1f86514422076d9c010d0",
                "sha256:4b3df0e6990aa98acda57d983942eff13d824135fe2250e6522edaa782a06de2",
                "sha256:512d29bb12608891e349af6a0cccedce51677725a921c07dba6342beaf576f9a",
                "sha256:5a507320c58903967ef7384355a4da7ff3f28132d679aeb23572753cbf2ec10b",
                "sha256:5c370b1e4975df846b0277b4deba86419ca77dbc25047f535b0bb03d1a544d44",
                "sha256:6b269105e59ac96aba877c1707c600ae55711d9dcd3fc4b5012e4af68e30c648",
                "sha256:6d4fa1079cab9018f4d0bd2db307beaa612b0d13ba73b5c6304b9fe2fb441ff7",
                "sha256:6dc08420625b5a20b53551c50deae6e231e6371194fa0651dbe0fb206452ae1f",
                "sha256:73aa0e31fa4bb82578f3a6c74a73c273367727de397a7a0f07bd83cbea696baa",
                "sha256:7559bce4b505762d737172556a4e6ea8a9998ecac1e39b5233465093e8cee697",
                "sha256:79625966e176dc97ddabc142351e0409e28acf4660b88d1cf6adb876d20c490d",
                "sha256:7a813c8bdbaaaab1f078014b9b0b13f5de757e2b5d9be6403639b298a04d218b",
                "sha256:7b2c956c028ea5de47ff3a8d6b3cc3330ab45cf0b7c3da35a2d6ff8420896526",
                "sha256:7f4152f8f76d2023aac16285576a9ecd2b11a9895373a1f10fd9db54b3ff06b4",
                "sha256:7f5d859928e635fa3ce3477704acee0f667b3a3d3e4bb109f2b18d4005f38287",
                "sha256:851485a42dbb0bdc1edcdabdb8557c09c9655dfa2ca0460ff210522e073e319e",
                "sha256:8608c078134f0b3cbd9f89b34bd60a943b23fd33cc5f065e8d5f840061bd0673",
                "sha256:880845dfe1f85d9d5f7c412efea7a08946a46894537e4e5d091732eb1d34d9a0",
                "sha256:8aabf1c1a04584c168984ac678a668094d831f152859d06e055288fa515e4d30",
                "sha256:8aecc5e80c63f7459a1a2ab2c64df952051df196294d9f739933a9f6687e86b3",
                "sha256:8cd9b4f2cfab88ed4a9106192de509464b75a906462fb846b936eabe45c2063e",
                "sha256:8de718c0e1c4b982a54b41779667242bc630b2197948405b7bd8ce16bcecac92",
                "sha256:9440fa522a79356aaa482aa4ba500b65f28e5d0e63b801abf6aa152a29bd842a",
                "sha256:b5f86c56eeb91dc3135b3fd8a95dc7ae14c538a2f3ad77a19645cf55bab1799c",
                "sha256:b73d6d7f0ccdad7bc43e6d34273f70d587ef62f824d7261c4ae9b8b1b6af90e8",
                "sha256:bb89f0a835bcfc1d42ccd5f41f04870c1b936d8507c6df12b7737febc40f0909",
                "sha256:c3cc28a6fd5a4a26224007712e79b81dbaee2ffb90ff406256158ec4d7b52b47",
                "sha256:ce5ab4bf46a211a8e924d307c1b1fcda82368586a19d0a24f8ae166f5c784864",
                "sha256:d00924255d7fc916ef66e4bf22f354a940c67179ad3fd7067d7a0a9c84d2fbfc",
                "sha256:d7cd730dfa7c36dbe8724426bf5612798734bff2d3c3857f36f2733f5bfc7c00",
                "sha256:e217ce4d37667df0bc1c397fdcd8de5e81018ef305aed9415c3b093faaeb10fb",
                "sha256:e3923c1d9870c49a2d44f795df0c889a22380d36ef92440ff618ec315757e539",
                "sha256:e5720a5d25e3b99cd0dc5c8a440570469ff82659bb09431c1439b92caf184d3b",
                "sha256:e8b58f0a96e7a1e341fc894f62c1177a7c83febebb5ff9123b579418fdc8a481",
                "sha256:e984839e75e0b60cfe75e351db53d6db750b00de45644c5d1f7ee5d1f34a1ce5",
                "sha256:eb09aa7f9cecb45027683bb55aebaaf45a0df8bf6de68801a6afdc7947bb09d4",
                "sha256:ec8a77f521a17506a24a5f626cb2aee7850f9b69a0afe704586f63a464f3cd64",
                "sha256:ecced182e935529727401b24d76634a357c71c9275b356efafd8a2a91ec07392",
                "sha256:ee0e8c683a7ff25d23b55b11161c2663d4b099770f6085ff0a20d4505778d6b4",
                "sha256:f0c2d907a1e102526dd2986df638343388b94c33860ff3bbe1384130828714b1",
                "sha256:f758ed67cab30b9a8d2833609513ce4d3bd027641673d4ebc9c067e4d208eec1",
                "sha256:f8157bed2f51db683f31306aa497311b560f2265998122abe1dce6428bd86567",
                "sha256:ffe8ed017e4ed70f68b7b371d84b7d4a790368db9203dfc2d222febd3a9c8863"
            ],
            "index": "pypi",
            "version": "==2.9.10"
        },
        "pyjwt": {
            "hashes": [
                "sha256:3cc5772eb20009233caf06e9d8a0577824723b44e6648ee0a2aedb6cf9381953",
                "sha256:dcdd193e30abefd5debf142f9adfcdd2b58004e644f25406ffaebd50bd98dacb"
            ],
            "markers": "python_version >= '3.9'",
            "version": "==2.10.1"
        },
        "python-dotenv": {
            "hashes": [
                "sha256:e324ee90a023d808f1959c46bcbc04446a10ced277783dc6ee09987c37ec10ca",
                "sha256:f7b63ef50f1b690dddf550d03497b66d609393b40b564ed0d674909a68ebf16a"
            ],
            "index": "pypi",
            "version": "==1.0.1"
        },
        "pyyaml": {
            "hashes": [
                "sha256:01179a4a8559ab5de078078f37e5c1a30d76bb88519906844fd7bdea1b7729ff",
                "sha256:0833f8694549e586547b576dcfaba4a6b55b9e96098b36cdc7ebefe667dfed48",
                "sha256:0a9a2848a5b7feac301353437eb7d5957887edbf81d56e903999a75a3d743086",
                "sha256:0b69e4ce7a131fe56b7e4d770c67429700908fc0752af059838b1cfb41960e4e",
                "sha256:0ffe8360bab4910ef1b9e87fb812d8bc0a308b0d0eef8c8f44e0254ab3b07133",
                "sha256:11d8f3dd2b9c1207dcaf2ee0bbbfd5991f571186ec9cc78427ba5bd32afae4b5",
                "sha256:17e311b6c678207928d649faa7cb0d7b4c26a0ba73d41e99c4fff6b6c3276484",
                "sha256:1e2120ef853f59c7419231f3bf4e7021f1b936f6ebd222406c3b60212205d2ee",
                "sha256:1f71ea527786de97d1a0cc0eacd1defc0985dcf6b3f17bb77dcfc8c34bec4dc5",
                "sha256:23502f431948090f597378482b4812b0caae32c22213aecf3b55325e049a6c68",
                "sha256:24471b829b3bf607e04e88d79542a9d48bb037c2267d7927a874e6c205ca7e9a",
                "sha256:29717114e51c84ddfba879543fb232a6ed60086602313ca38cce623c1d62cfbf",
                "sha256:2e99c6826ffa974fe6e27cdb5ed0021786b03fc98e5ee3c5bfe1fd5015f42b99",
                "sha256:39693e1f8320ae4f43943590b49779ffb98acb81f788220ea932a6b6c51004d8",
                "sha256:3ad2a3decf9aaba3d29c8f537ac4b243e36bef957511b4766cb0057d32b0be85",
                "sha256:3b1fdb9dc17f5a7677423d508ab4f243a726dea51fa5e70992e59a7411c89d19",
                "sha256:41e4e3953a79407c794916fa277a82531dd93aad34e29c2a514c2c0c5fe971cc",
                "sha256:43fa96a3ca0d6b1812e01ced1044a003533c47f6ee8aca31724f78e93ccc089a",
                "sha256:50187695423ffe49e2deacb8cd10510bc361faac997de9efef88badc3bb9e2d1",
                "sha256:5ac9328ec4831237bec75defaf839f7d4564be1e6b25ac710bd1a96321cc8317",
                "sha256:5d225db5a45f21e78dd9358e58a98702a0302f2659a3c6cd320564b75b86f47c",
                "sha256:6395c297d42274772abc367baaa79683958044e5d3835486c16da75d2a694631",
                "sha256:688ba32a1cffef67fd2e9398a2efebaea461578b0923624778664cc1c914db5d",
                "sha256:68ccc6023a3400877818152ad9a1033e3db8625d899c72eacb5a668902e4d652",
                "sha256:70b189594dbe54f75ab3a1acec5f1e3faa7e8cf2f1e08d9b561cb41b845f69d5",
                "sha256:797b4f722ffa07cc8d62053e4cff1486fa6dc094105d13fea7b1de7d8bf71c9e",
                "sha256:7c36280e6fb8385e520936c3cb3b8042851904eba0e58d277dca80a5cfed590b",
                "sha256:7e7401d0de89a9a855c839bc697c079a4af81cf878373abd7dc625847d25cbd8",
                "sha256:80bab7bfc629882493af4aa31a4cfa43a4c57c83813253626916b8c7ada83476",
                "sha256:82d09873e40955485746739bcb8b4586983670466c23382c19cffecbf1fd8706",
                "sha256:8388ee1976c416731879ac16da0aff3f63b286ffdd57cdeb95f3f2e085687563",
                "sha256:8824b5a04a04a047e72eea5cec3bc266db09e35de6bdfe34c9436ac5ee27d237",
                "sha256:8b9c7197f7cb2738065c481a0461e50ad02f18c78cd75775628afb4d7137fb3b",
                "sha256:9056c1ecd25795207ad294bcf39f2db3d845767be0ea6e6a34d856f006006083",
                "sha256:936d68689298c36b53b29f23c6dbb74de12b4ac12ca6cfe0e047bedceea56180",
                "sha256:9b22676e8097e9e22e36d6b7bda33190d0d400f345f23d4065d48f4ca7ae0425",
                "sha256:a4d3091415f010369ae4ed1fc6b79def9416358877534caf6a0fdd2146c87a3e",
                "sha256:a8786accb172bd8afb8be14490a16625cbc387036876ab6ba70912730faf8e1f",
                "sha256:a9f8c2e67970f13b16084e04f134610fd1d374bf477b17ec1599185cf611d725",
                "sha256:bc2fa7c6b47d6bc618dd7fb02ef6fdedb1090ec036abab80d4681424b84c1183",
                "sha256:c70c95198c015b85feafc136515252a261a84561b7b1d51e3384e0655ddf25ab",
                "sha256:cc1c1159b3d456576af7a3e4d1ba7e6924cb39de8f67111c735f6fc832082774",
                "sha256:ce826d6ef20b1bc864f0a68340c8b3287705cae2f8b4b1d932177dcc76721725",
                "sha256:d584d9ec91ad65861cc08d42e834324ef890a082e591037abe114850ff7bbc3e",
                "sha256:d7fded462629cfa4b685c5416b949ebad6cec74af5e2d42905d41e257e0869f5",
                "sha256:d84a1718ee396f54f3a086ea0a66d8e552b2ab2017ef8b420e92edbc841c352d",
                "sha256:d8e03406cac8513435335dbab54c0d385e4a49e4945d2909a581c83647ca0290",
                "sha256:e10ce637b18caea04431ce14fabcf5c64a1c61ec9c56b071a4b7ca131ca52d44",
                "sha256:ec031d5d2feb36d1d1a24380e4db6d43695f3748343d99434e6f5f9156aaa2ed",
                "sha256:ef6107725bd54b262d6dedcc2af448a266975032bc85ef0172c5f059da6325b4",
                "sha256:efdca5630322a10774e8e98e1af481aad470dd62c3170801852d752aa7a783ba",
                "sha256:f753120cb8181e736c57ef7636e83f31b9c0d1722c516f7e86cf15b7aa57ff12",
                "sha256:ff3824dc5261f50c9b0dfb3be22b4567a6f938ccce4587b38952d85fd9e9afe4"
            ],
            "markers": "python_version >= '3.8'",
            "version": "==6.0.2"
        },
        "six": {
            "hashes": [
                "sha256:4721f391ed90541fddacab5acf947aa0d3dc7d27b2e1e8eda2be8970586c3274",
                "sha256:ff70335d468e7eb6ec65b95b99d3a2836546063f63acc5171de367e834932a81"
            ],
            "markers": "python_version >= '2.7' and python_version not in '3.0, 3.1, 3.2, 3.3'",
            "version": "==1.17.0"
        },
        "sqlalchemy": {
            "hashes": [
                "sha256:07e48cbcdda6b8bc7a59d6728bd3f5f574ffe03f2c9fb384239f3789c2d95c2e",
                "sha256:18cafdb27834fa03569d29f571df7115812a0e59fd6a3a03ccb0d33678ec8420",
                "sha256:1b1e5e96e2789d89f023d080bee432e2fef64d95857969e70d3cadec80bd26f0",
                "sha256:315676344e3558f1f80d02535f410e80ea4e8fddba31ec78fe390eff5fb8f466",
                "sha256:31de1e2c45e67a5ec1ecca6ec26aefc299dd5151e355eb5199cd9516b57340be",
                "sha256:3d94682732d1a0def5672471ba42a29ff5e21bb0aae0afa00bb10796fc1e28dd",
                "sha256:3ec187acf85984263299a3f15c34a6c0671f83565d86d10f43ace49881a82718",
                "sha256:4847f4b1d822754e35707db913396a29d874ee77b9c3c3ef3f04d5a9a6209618",
                "sha256:4d112b0f3c1bc5ff70554a97344625ef621c1bfe02a73c5d97cac91f8cd7a41e",
                "sha256:51e1ba2884c6a2b8e19109dc08c71c49530006c1084156ecadfaadf5f9b8b053",
                "sha256:535377e9b10aff5a045e3d9ada8a62d02058b422c0504ebdcf07930599890eb0",
                "sha256:5dbf17ac9a61e7a3f1c7ca47237aac93cabd7f08ad92ac5b96d6f8dea4287fc1",
                "sha256:5f752676fc126edc1c4af0ec2e4d2adca48ddfae5de46bb40adbd3f903eb2120",
                "sha256:64cb0ad8a190bc22d2112001cfecdec45baffdf41871de777239da6a28ed74b6",
                "sha256:6913b8247d8a292ef8315162a51931e2b40ce91681f1b6f18f697045200c4a30",
                "sha256:69fac0a7054d86b997af12dc23f581cf0b25fb1c7d1fed43257dee3af32d3d6d",
                "sha256:7001f16a9a8e06488c3c7154827c48455d1c1507d7228d43e781afbc8ceccf6d",
                "sha256:7b81b1030c42b003fc10ddd17825571603117f848814a344d305262d370e7c34",
                "sha256:7f8267682eb41a0584cf66d8a697fef64b53281d01c93a503e1344197f2e01fe",
                "sha256:887865924c3d6e9a473dc82b70977395301533b3030d0f020c38fd9eba5419f2",
                "sha256:9167d4227b56591a4cc5524f1b79ccd7ea994f36e4c648ab42ca995d28ebbb96",
                "sha256:939f9a018d2ad04036746e15d119c0428b1e557470361aa798e6e7d7f5875be0",
                "sha256:955162ad1a931fe416eded6bb144ba891ccbf9b2e49dc7ded39274dd9c5affc5",
                "sha256:984ee13543a346324319a1fb72b698e521506f6f22dc37d7752a329e9cd00a32",
                "sha256:9883f5fae4fd8e3f875adc2add69f8b945625811689a6c65866a35ee9c0aea23",
                "sha256:a1ad90c97029cc3ab4ffd57443a20fac21d2ec3c89532b084b073b3feb5abff3",
                "sha256:a3714e5b33226131ac0da60d18995a102a17dddd42368b7bdd206737297823ad",
                "sha256:ae067ab639fa499f67ded52f5bc8e084f045d10b5ac7bb928ae4ca2b6c0429a5",
                "sha256:b33ffbdbbf5446cf36cd4cc530c9d9905d3c2fe56ed09e25c22c850cdb9fac92",
                "sha256:b6e4cb5c63f705c9d546a054c60d326cbde7421421e2d2565ce3e2eee4e1a01f",
                "sha256:b7f4b6aa6e87991ec7ce0e769689a977776db6704947e562102431474799a857",
                "sha256:c04144a24103135ea0315d459431ac196fe96f55d3213bfd6d39d0247775c854",
                "sha256:c522e496f9b9b70296a7675272ec21937ccfc15da664b74b9f58d98a641ce1b6",
                "sha256:c5a99282848b6cae0056b85da17392a26b2d39178394fc25700bcf967e06e97a",
                "sha256:c7a46639ba058d320c9f53a81db38119a74b8a7a1884df44d09fbe807d028aaf",
                "sha256:d4b1cc7835b39835c75cf7c20c926b42e97d074147c902a9ebb7cf2c840dc4e2",
                "sha256:d4d164df3d83d204c69f840da30b292ac7dc54285096c6171245b8d7807185aa",
                "sha256:d61e9ecc849d8d44d7f80894ecff4abe347136e9d926560b818f6243409f3c86",
                "sha256:d68e1762997bfebf9e5cf2a9fd0bcf9ca2fdd8136ce7b24bbd3bbfa4328f3e4a",
                "sha256:e3c1808008124850115a3f7e793a975cfa5c8a26ceeeb9ff9cbb4485cac556df",
                "sha256:f8cb80fe8d14307e4124f6fad64dfd87ab749c9d275f82b8b4ec84c84ecebdbe"
            ],
            "index": "pypi",
            "version": "==1.4.46"
        },
        "typing-extensions": {
            "hashes": [
                "sha256:04e5ca0351e0f3f85c6853954072df659d0d13fac324d0072316b67d7794700d",
                "sha256:1a7ead55c7e559dd4dee8856e3a88b41225abfe1ce8df57b7c13915fe121ffb8"
            ],
            "index": "pypi",
            "version": "==4.12.2"
        },
        "urllib3": {
            "hashes": [
                "sha256:1cee9ad369867bfdbbb48b7dd50374c0967a0bb7710050facf0dd6911440e3df",
                "sha256:f8c5449b3cf0861679ce7e0503c7b44b5ec981bec0d1d3795a07f1ba96f0204d"
            ],
            "markers": "python_version >= '3.9'",
            "version": "==2.3.0"
        },
        "werkzeug": {
            "hashes": [
                "sha256:54b78bf3716d19a65be4fceccc0d1d7b89e608834989dfae50ea87564639213e",
                "sha256:60723ce945c19328679790e3282cc758aa4a6040e4bb330f53d30fa546d44746"
            ],
            "markers": "python_version >= '3.9'",
            "version": "==3.1.3"
        },
        "wtforms": {
            "hashes": [
                "sha256:bf831c042829c8cdbad74c27575098d541d039b1faa74c771545ecac916f2c07",
                "sha256:f8d76180d7239c94c6322f7990ae1216dae3659b7aa1cee94b6318bdffb474b9"
            ],
            "index": "pypi",
            "version": "==3.1.2"
        }
    },
    "develop": {}
}

```

# Procfile

```
release: pipenv run upgrade
web: gunicorn wsgi --chdir ./src/

```

# pycodestyle.cfg

```cfg
[pycodestyle]
ignore = E501, E302
```

# README.es.md

```md
# Plantilla de WebApp con React JS y Flask API

Construye aplicaciones web usando React.js para el front end y python/flask para tu API backend.

- La documentación se puede encontrar aquí: https://start.4geeksacademy.com/starters/react-flask
- Aquí hay un video sobre [cómo usar esta plantilla](https://www.loom.com/share/f37c6838b3f1496c95111e515e83dd9b)
- Integrado con Pipenv para la gestión de paquetes.
- Despliegue rápido a heroku [en solo unos pocos pasos aquí](https://start.4geeksacademy.com/backend/deploy-heroku-posgres).
- Uso del archivo .env.
- Integración de SQLAlchemy para la abstracción de bases de datos.

### 1) Instalación:

> Si usas Github Codespaces (recomendado) o Gitpod, esta plantilla ya vendrá con Python, Node y la base de datos Posgres instalados. Si estás trabajando localmente, asegúrate de instalar Python 3.10, Node.

Se recomienda instalar el backend primero, asegúrate de tener Python 3.8, Pipenv y un motor de base de datos (se recomienda Posgres).

1. Instala los paquetes de python: `$ pipenv install`
2. Crea un archivo .env basado en el .env.example: `$ cp .env.example .env`
3. Instala tu motor de base de datos y crea tu base de datos, dependiendo de tu base de datos, debes crear una variable DATABASE_URL con uno de los valores posibles, asegúrate de reemplazar los valores con la información de tu base de datos:

| Motor     | DATABASE_URL                                        |
| --------- | --------------------------------------------------- |
| SQLite    | sqlite:////test.db                                  |
| MySQL     | mysql://username:password@localhost:port/example    |
| Postgres  | postgres://username:password@localhost:5432/example |

4. Migra las migraciones: `$ pipenv run migrate` (omite si no has hecho cambios en los modelos en `./src/api/models.py`)
5. Ejecuta las migraciones: `$ pipenv run upgrade`
6. Ejecuta la aplicación: `$ pipenv run start`

> Nota: Los usuarios de Codespaces pueden conectarse a psql escribiendo: `psql -h localhost -U gitpod example`

### Deshacer una migración

También puedes deshacer una migración ejecutando

\`\`\`sh
$ pipenv run downgrade
\`\`\`

### Población de la tabla de usuarios en el backend

Para insertar usuarios de prueba en la base de datos, ejecuta el siguiente comando:

\`\`\`sh
$ flask insert-test-users 5
\`\`\`

Y verás el siguiente mensaje:

\`\`\`
    Creating test users
    test_user1@test.com created.
    test_user2@test.com created.
    test_user3@test.com created.
    test_user4@test.com created.
    test_user5@test.com created.
    Users created successfully!
\`\`\`

### **Nota importante para la base de datos y los datos dentro de ella**

Cada entorno de Github Codespace tendrá **su propia base de datos**, por lo que si estás trabajando con más personas, cada uno tendrá una base de datos diferente y diferentes registros dentro de ella. Estos datos **se perderán**, así que no pases demasiado tiempo creando registros manualmente para pruebas, en su lugar, puedes automatizar la adición de registros a tu base de datos editando el archivo \`\`\`commands.py\`\`\` dentro de la carpeta \`\`\`/src/api\`\`\`. Edita la línea 32 de la función \`\`\`insert_test_data\`\`\` para insertar los datos según tu modelo (usa la función \`\`\`insert_test_users\`\`\` anterior como ejemplo). Luego, todo lo que necesitas hacer es ejecutar \`\`\`pipenv run insert-test-data\`\`\`.

### Instalación manual del Front-End:

-   Asegúrate de estar usando la versión 14+ de node y de que ya hayas instalado y ejecutado correctamente el backend.

1. Instala los paquetes: `$ npm install`
2. ¡Empieza a codificar! inicia el servidor de desarrollo de webpack `$ npm run start`

## ¡Publica tu sitio web!

Esta plantilla está 100% lista para desplegarse con Render.com y Heroku en cuestión de minutos. Por favor, lee la [documentación oficial al respecto](https://start.4geeksacademy.com/deploy).

### Contribuyentes

Esta plantilla fue construida como parte del [Coding Bootcamp](https://4geeksacademy.com/us/coding-bootcamp) de 4Geeks Academy por [Alejandro Sanchez](https://twitter.com/alesanchezr) y muchos otros contribuyentes. Descubre más sobre nuestro [Curso de Desarrollador Full Stack](https://4geeksacademy.com/us/coding-bootcamps/part-time-full-stack-developer) y [Bootcamp de Ciencia de Datos](https://4geeksacademy.com/us/coding-bootcamps/datascience-machine-learning).

Puedes encontrar otras plantillas y recursos como este en la [página de github de la escuela](https://github.com/4geeksacademy/).

```

# README.md

```md
# WebApp boilerplate with React JS and Flask API

Build web applications using React.js for the front end and python/flask for your backend API.

- Documentation can be found here: https://start.4geeksacademy.com/starters/react-flask
- Here is a video on [how to use this template](https://www.loom.com/share/f37c6838b3f1496c95111e515e83dd9b)
- Integrated with Pipenv for package managing.
- Fast deployment to heroku [in just a few steps here](https://start.4geeksacademy.com/backend/deploy-heroku-posgres).
- Use of .env file.
- SQLAlchemy integration for database abstraction.

### 1) Installation:

> If you use Github Codespaces (recommended) or Gitpod this template will already come with Python, Node and the Posgres Database installed. If you are working locally make sure to install Python 3.10, Node 

It is recomended to install the backend first, make sure you have Python 3.8, Pipenv and a database engine (Posgress recomended)

1. Install the python packages: `$ pipenv install`
2. Create a .env file based on the .env.example: `$ cp .env.example .env`
3. Install your database engine and create your database, depending on your database you have to create a DATABASE_URL variable with one of the possible values, make sure you replace the valudes with your database information:

| Engine    | DATABASE_URL                                        |
| --------- | --------------------------------------------------- |
| SQLite    | sqlite:////test.db                                  |
| MySQL     | mysql://username:password@localhost:port/example    |
| Postgress | postgres://username:password@localhost:5432/example |

4. Migrate the migrations: `$ pipenv run migrate` (skip if you have not made changes to the models on the `./src/api/models.py`)
5. Run the migrations: `$ pipenv run upgrade`
6. Run the application: `$ pipenv run start`

> Note: Codespaces users can connect to psql by typing: `psql -h localhost -U gitpod example`

### Undo a migration

You are also able to undo a migration by running

\`\`\`sh
$ pipenv run downgrade
\`\`\`

### Backend Populate Table Users

To insert test users in the database execute the following command:

\`\`\`sh
$ flask insert-test-users 5
\`\`\`

And you will see the following message:

\`\`\`
  Creating test users
  test_user1@test.com created.
  test_user2@test.com created.
  test_user3@test.com created.
  test_user4@test.com created.
  test_user5@test.com created.
  Users created successfully!
\`\`\`

### **Important note for the database and the data inside it**

Every Github codespace environment will have **its own database**, so if you're working with more people eveyone will have a different database and different records inside it. This data **will be lost**, so don't spend too much time manually creating records for testing, instead, you can automate adding records to your database by editing \`\`\`commands.py\`\`\` file inside \`\`\`/src/api\`\`\` folder. Edit line 32 function \`\`\`insert_test_data\`\`\` to insert the data according to your model (use the function \`\`\`insert_test_users\`\`\` above as an example). Then, all you need to do is run \`\`\`pipenv run insert-test-data\`\`\`.

### Front-End Manual Installation:

-   Make sure you are using node version 14+ and that you have already successfully installed and runned the backend.

1. Install the packages: `$ npm install`
2. Start coding! start the webpack dev server `$ npm run start`

## Publish your website!

This boilerplate it's 100% read to deploy with Render.com and Heroku in a matter of minutes. Please read the [official documentation about it](https://start.4geeksacademy.com/deploy).

### Contributors

This template was built as part of the 4Geeks Academy [Coding Bootcamp](https://4geeksacademy.com/us/coding-bootcamp) by [Alejandro Sanchez](https://twitter.com/alesanchezr) and many other contributors. Find out more about our [Full Stack Developer Course](https://4geeksacademy.com/us/coding-bootcamps/part-time-full-stack-developer), and [Data Science Bootcamp](https://4geeksacademy.com/us/coding-bootcamps/datascience-machine-learning).

You can find other templates and resources like this at the [school github page](https://github.com/4geeksacademy/).

```

# render_build.sh

```sh
#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build

pipenv install

pipenv run upgrade

```

# render.yaml

```yaml
# This file was generated by Render's heroku-import Heroku CLI plugin
# https://www.npmjs.com/package/@renderinc/heroku-import
# Schema documented at https://render.com/docs/yaml-spec
services:
    - type: web # valid values: https://render.com/docs/yaml-spec#type
      region: ohio
      name: sample-service-name
      env: python # valid values: https://render.com/docs/yaml-spec#environment
      buildCommand: "./render_build.sh"
      startCommand: "gunicorn wsgi --chdir ./src/"
      plan: free # optional; defaults to starter
      numInstances: 1
      envVars:
          - key: BASENAME # Imported from Heroku app
            value: /
          - key: FLASK_APP # Imported from Heroku app
            value: src/app.py
          - key: FLASK_DEBUG # Imported from Heroku app
            value: 0
          - key: FLASK_APP_KEY # Imported from Heroku app
            value: "any key works"
          - key: PYTHON_VERSION
            value: 3.10.6
          - key: DATABASE_URL # Render PostgreSQL database
            fromDatabase:
                name: postgresql-trapezoidal-42170
                property: connectionString

databases: # Render PostgreSQL database
    - name: postgresql-trapezoidal-42170
      region: ohio
      ipAllowList: [] # only allow internal connections
      plan: free # optional; defaults to starter

```

# requirements.txt

```txt
-i https://pypi.org/simple
alembic==1.5.4; python_version >= '2.7' and python_version not in '3.0, 3.1, 3.2, 3.3, 3.4, 3.5'
certifi==2020.12.5
click==7.1.2; python_version >= '2.7' and python_version not in '3.0, 3.1, 3.2, 3.3, 3.4'
cloudinary==1.24.0
flask==1.1.2
flask-admin==1.5.7
flask-cors==3.0.10
flask-migrate==2.6.0
flask-sqlalchemy==2.4.4
flask-swagger==0.2.14
gunicorn==20.0.4
itsdangerous==1.1.0; python_version >= '2.7' and python_version not in '3.0, 3.1, 3.2, 3.3'
jinja2==2.11.3; python_version >= '2.7' and python_version not in '3.0, 3.1, 3.2, 3.3, 3.4'
mako==1.1.4; python_version >= '2.7' and python_version not in '3.0, 3.1, 3.2, 3.3'
markupsafe==1.1.1; python_version >= '2.7' and python_version not in '3.0, 3.1, 3.2, 3.3'
psycopg2-binary==2.8.6
python-dateutil==2.8.1; python_version >= '2.7' and python_version not in '3.0, 3.1, 3.2, 3.3'
python-dotenv==0.15.0
python-editor==1.0.4
pyyaml==5.4.1; python_version >= '2.7' and python_version not in '3.0, 3.1, 3.2, 3.3, 3.4, 3.5'
six==1.15.0; python_version >= '2.7' and python_version not in '3.0, 3.1, 3.2, 3.3'
sqlalchemy==1.3.23
urllib3==1.26.3; python_version >= '2.7' and python_version not in '3.0, 3.1, 3.2, 3.3, 3.4' and python_version < '4'
werkzeug==1.0.1; python_version >= '2.7' and python_version not in '3.0, 3.1, 3.2, 3.3, 3.4'
wtforms==2.3.3

```

# src/api/__init__.py

```py

```

# src/api/admin.py

```py
  
import os
from flask_admin import Admin
from .models import db, User
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))
```

# src/api/commands.py

```py

import click
from api.models import db, User

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
def setup_commands(app):
    
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users") # name of our command
    @click.argument("count") # argument of out command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        pass
```

# src/api/models.py

```py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }
```

# src/api/routes.py

```py
"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

```

# src/api/utils.py

```py
from flask import jsonify, url_for

class APIException(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

def has_no_empty_params(rule):
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)

def generate_sitemap(app):
    links = ['/admin/']
    for rule in app.url_map.iter_rules():
        # Filter out rules we can't navigate to in a browser
        # and rules that require parameters
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            if "/admin/" not in url:
                links.append(url)

    links_html = "".join(["<li><a href='" + y + "'>" + y + "</a></li>" for y in links])
    return """
        <div style="text-align: center;">
        <img style="max-height: 80px" src='https://storage.googleapis.com/breathecode/boilerplates/rigo-baby.jpeg' />
        <h1>Rigo welcomes you to your API!!</h1>
        <p>API HOST: <script>document.write('<input style="padding: 5px; width: 300px" type="text" value="'+window.location.href+'" />');</script></p>
        <p>Start working on your project by following the <a href="https://start.4geeksacademy.com/starters/full-stack" target="_blank">Quick Start</a></p>
        <p>Remember to specify a real endpoint path like: </p>
        <ul style="text-align: left;">"""+links_html+"</ul></div>"

```

# src/app.py

```py
"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)

```

# src/wsgi.py

```py
# This file was created to run the application on heroku using gunicorn.
# Read more about it here: https://devcenter.heroku.com/articles/python-gunicorn

from app import app as application

if __name__ == "__main__":
    application.run()

```

