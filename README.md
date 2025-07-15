# Blaze Engineer CLI

A Command-Line Interface for interacting with [Blaze Engineer](https://blaze.engineer), your AI-powered code engineering platform.
Manage SSH keys, repos, jobs, tokens, master files, and more — all from your terminal.

---

## Features

- **Signup / Login** to Blaze Engineer
- **Manage SSH Keys** (add, list, remove)
- **Manage Repositories** (add, list, remove)
- **Run, Stop, Rerun, and View Jobs**
- **View Usage Credits**
- **Manage Tokens** (add, remove, view, list)
- **Manage Master Files** (edit, view, list)
- All via a fast, interactive terminal UI

---

## Installation

Install globally using [npm](https://www.npmjs.com/):

```sh
npm install -g blaze-engineer-cli
```

This will make the CLI available anywhere as `npx blaze-engineer-cli`.

---

## Usage

Simply run:

```sh
npx blaze-engineer-cli
```

You’ll see a menu. Use numbers to select an action.

---

### Main CLI Flow

#### 1. **Signup or Login**

* If not authorized, you’ll be prompted to **Signup** (needs an invite/beta key) or **Login**.
* After signing up or logging in, the CLI will switch to the authorized menu.

#### 2. **Authorized Menu**

Once logged in, you can:

* Add/List/Remove **SSH Keys**
* Add/List/Remove **Repositories**
* Run/Stop/Rerun/View **Jobs** for your code
* View your **Credits**
* Add/Remove/View/List **Tokens**
* Edit/View/List **Master Files**
* **Logout**

#### 3. **Exiting**

Type `0` at any menu to exit, or hit `Ctrl+C` at any time.

---

## Example

```
$ npx blaze-engineer-cli

Blaze Engineer CLI

Unauthorized Menu
1) Signup
2) Login
0) Exit
> 1
Email: your@email.com
Password: ********
One-time Beta Key: <provided-key>

Now authorized.

Authorized Menu
1) Add Key
2) Remove Key
3) List Keys
4) Add Repo
5) Remove Repo
6) List Repos
7) Run Job
8) Stop Job
9) Rerun Job
10) View Job
11) List Jobs
12) View Credits
13) Add Token
14) Remove Token
15) View Token
16) List Tokens
17) Edit Master File
18) View Master File
19) List Master Files
0) Exit
> 15
Token ID: <token-id>
{VIEW TOKEN RESPONSE}
> 16
{LIST TOKENS RESPONSE}
```

---

## Configuration

* The CLI uses the [blaze-engineer](https://www.npmjs.com/package/blaze-engineer) NodeJS library as its API client.
* No local configuration is required.
* All secrets are stored in memory during your session.

---

## Security

* **Never share your private SSH key**. Only paste your key for your own secure usage.
* On logout, tokens are cleared from memory.

---

## Troubleshooting

* If you encounter any errors, they will be printed in red in the console.
* If you get logged out unexpectedly, you may need to log in again.
* For any authentication errors, check your credentials and Beta Key.

---

## License

UNLICENSED

---

## Links

- [API Homepage](https://blaze.engineer)
- [Getting Started Guide](https://blaze.engineer/gettingStarted)
- [API Documentation](https://blaze.engineer/apiDocs)
- [Blaze Engineer JS Client on NPM](https://www.npmjs.com/package/blaze-engineer)
- [Blaze Engineer JS Client on GitHub](https://github.com/shanelarson/blaze-engineer)
