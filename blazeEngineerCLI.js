#!/usr/bin/env node
/* blazeEngineerCLI.js */

import BlazeEngineer from 'blaze-engineer';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import util from 'node:util';

const rl  = readline.createInterface({ input, output });
const api = new BlazeEngineer();

const C = {
    reset : '\x1b[0m',
    bold  : '\x1b[1m',
    red   : '\x1b[31m',
    green : '\x1b[32m',
    cyan  : '\x1b[36m',
    yellow: '\x1b[33m',
};
const color = (txt, col) => `${C[col] || ''}${txt}${C.reset}`;

let authorized = false;

const unauthorizedMenu = [
    { label: 'Signup', action: signup },
    { label: 'Login',  action: login  },
];

const authorizedMenu = [
    { label: 'Add Key',            action: () => doWithFields(api.addKey, [
            ['name', 'Key nickname'],
            ['key',  'Private SSH key'],
        ]) },
    { label: 'Remove Key',         action: () => doWithFields(api.removeKey, [
            ['id', 'Key ID'],
        ]) },
    { label: 'List Keys',          action: () => api.listKeys() },

    { label: 'Add Repo',           action: () => doWithFields(api.addRepo, [
            ['name',   'Repo nickname'],
            ['sshURL', 'Repo SSH URL'],
            ['keyID',  'Key ID to use'],
        ]) },
    { label: 'Remove Repo',        action: () => doWithFields(api.removeRepo, [
            ['id', 'Repo ID'],
        ]) },
    { label: 'List Repos',         action: () => api.listRepos() },

    { label: 'Run Job',            action: () => doWithFields(
            (obj) => api.runJob(obj), [
                ['repoID', 'Repo ID'],
                ['branch', 'Branch'],
                ['task',   'Task'],
                ['webhook', 'Webhook (optional)', true],
            ]) },
    { label: 'Stop Job',           action: () => doWithFields(api.stopJob, [
            ['jobID', 'Job ID'],
        ]) },
    { label: 'Rerun Job',          action: () => doWithFields(api.rerunJob, [
            ['jobID', 'Job ID'],
        ]) },
    { label: 'View Job',           action: () => doWithFields(api.viewJob, [
            ['id', 'Job ID'],
        ]) },
    { label: 'List Jobs',          action: () => api.listJobs() },

    { label: 'View Credits',       action: () => api.viewCredits() },

    { label: 'Logout',             action: logout },
];

// Graceful shutdown on CTRL+C
process.on('SIGINT', () => {
    rl.close();
    console.log(color('\nGood-bye!', 'green'));
    process.exit(0);
});

/* ---------- Core loop ---------- */
(async function main () {
    console.clear();
    console.log(color('Blaze Engineer CLI', 'bold'));

    while (true) {
        const menu = authorized ? authorizedMenu : unauthorizedMenu;
        showMenu(menu);

        let choice;
        try {
            choice = await rl.question(color('> ', 'cyan'));
        } catch (err) {
            if (err && err.name === "AbortError") {
                rl.close();
                console.log(color('\nGood-bye!', 'green'));
                process.exit(0);
            }
            throw err;
        }

        if (choice.trim() === '0') break;

        const idx = Number(choice) - 1;
        if (idx < 0 || idx >= menu.length || Number.isNaN(idx)) {
            console.log(color('Invalid choice.\n', 'yellow'));
            continue;
        }

        try {
            const res = await menu[idx].action();
            await handleResponse(res);
        } catch (err) {
            if (err && err.name === "AbortError") {
                rl.close();
                console.log(color('\nGood-bye!', 'green'));
                process.exit(0);
            } else {
                console.log(color(`\nError: ${err.message}\n`, 'red'));
            }
        }
    }

    rl.close();
    console.log(color('Good-bye!', 'green'));
    process.exit(0);
})();

function showMenu (items) {
    const title = authorized ? 'Authorized Menu' : 'Unauthorized Menu';
    console.log('\n' + color(title, 'bold'));
    items.forEach((it, i) => {
        console.log(`${i + 1}) ${it.label}`);
    });
    console.log('0) Exit');
}

async function promptField (label, optional = false) {
    const ans = await rl.question(`${label}: `);
    if (!ans.trim()) {
        if (optional) return undefined;
        throw new Error('Cancelled');
    }
    return ans.trim();
}

async function doWithFields (fn, fieldDefs) {
    try {
        const inputs = {};
        for (const [key, label, optional] of fieldDefs) {
            const val = await promptField(label, optional);
            if (val === undefined && optional) continue;
            inputs[key] = val;
        }
        return await fn(inputs);
    } catch (e) {
        if (e.message === 'Cancelled') {
            console.log(color('Request cancelled.\n', 'yellow'));
            return null;
        }
        throw e;
    }
}

async function signup () {
    const email    = await promptField('Email');
    const password = await promptField('Password');
    const betaKey  = await promptField('One-time Beta Key');
    return api.signup(email, password, betaKey);
}

async function login () {
    const email    = await promptField('Email');
    const password = await promptField('Password');
    return api.login(email, password);
}

function logout () {
    api.token = null;
    authorized = false;
    console.clear();
    console.log(color('\nLogged out.\n', 'yellow'));
    return null;
}

async function handleResponse (res) {
    if (res === null) return;

    if (res && res.error) {
        console.log(color(`\nError: ${res.error}\n`, 'red'));

        if (['missing auth bearer token',
            'invalid auth bearer token'].includes(res.error)) {
            logout();
        }
        return;
    }

    // success
    console.log(
        color('\nResponse:\n', 'green') +
        util.inspect(res, { depth: null, colors: true }) +
        '\n'
    );

    if (!api.token && !authorized) {
        api.token = res.token;
        authorized = true;
        console.clear();
        console.log(color('Now authorized.\n', 'green'));
    }
}
