#!/usr/bin/env node
const debounce = require('lodash.debounce');
const chokidar = require('chokidar');
const prog = require('caporal');
const fs = require('fs');
const { spawn } = require('child_process');
const chalk = require('chalk');


prog
    .version('0.0.1')
    .argument('[filename]', 'Name of a file to execute')
    .action(async ({ filename }) => {
        const name = filename || 'index.js';

        try {
            await fs.promises.access(name)
        } catch (err) {
            throw new Error(`The file '${name}' does not exists! `);
        }

        let proc;
        const startFile = debounce(() => {
            if (proc) {
                proc.kill();
            }
            console.log(chalk.yellow(`>>>>> The ${name} has been saved and restarted...`))
            proc = spawn('node', [name], {stdio: 'inherit'});
        }, 100);
        
        chokidar
            .watch('.')
            .on('add', startFile)
            .on('change', startFile)
            .on('unlink', startFile)
    });

prog.parse(process.argv);