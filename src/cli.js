import arg from 'arg';
import inquirer from 'inquirer';
import {createProject} from './main';
import chalk from 'chalk';
const base=require('../package.json')

console.log(base.version)



function parseArgumentsIntoOptions(rawArgs) {
  const args=arg(
    {
      '--yes': Boolean,
      '--install': Boolean,
      '--projectname': String,
      '--help': Boolean,
      '-p': '--projectname',
      '-y': '--yes',
      '-i': '--install',
      '-h': '--help',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args['--yes']||false,
    git: args['--git'],
    install: args['--install']||false,
    help: args['--help'],
  };
}

async function promptForMissingOptions(options) {
  const defaultTemplate='Vite-ReactJS';
  if(options.skipPrompts) {
    return {
      ...options,
      template: options.template||defaultTemplate,
    };
  }

  const questions=[];

  if(!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Please choose which project template to use',
      choices: [
        chalk.magenta('Express-DDD-Api'),
        chalk.blue('Normal-ReactJS'),
        chalk.green('Vite-ReactJS'),
        chalk.magenta('Vite-Vue'),
        chalk.yellow('Vite-Svelte'),
        chalk.blue('NextJS-App'),
      ],
      default: defaultTemplate,
    });
  }

  if(!options.install) {
    questions.push({
      type: 'confirm',
      name: 'install',
      message: 'Install dependencies on Creation?'
    });
  }

  const actualDate=new Date();

  if(!options.projectname) {
    questions.push({
      type: 'prompt',
      name: 'projectname',
      message: 'Do you want to enter the name of the project?',
      default: `base-app-template-${actualDate.getMilliseconds()}`,
    });
  }

  const answers=await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template||answers.template,
    install: options.install||answers.install,
    projectname: options.projectname||answers.projectname,
  };
}

export async function cli(args) {
  console.log(chalk.yellow("*************************************************"))
  console.log(chalk.yellow(`*******[ Create Base App v${base.version} ]********`))
  console.log(chalk.yellow("*************************************************\n"))
  let options=parseArgumentsIntoOptions(args);
  options=await promptForMissingOptions(options);
  await createProject(options);
}

// ...
