import chalk from 'chalk';
import execa from 'execa';
import Listr from 'listr';
import {projectInstall} from 'pkg-install';
import {execSync} from 'child_process';
const base=require('../package.json')

async function copyTemplateFiles(options) {
  try{
    console.log(`%s Starting create-base-app ${base.version}`, chalk.green.bold('=>'));
    switch(options.template){
      case chalk.blue('Normal-ReactJS'):
          options.install = false
        await execSync(`npm i -g create-react-app`);
        return await execSync(`npx create-react-app ${options.projectname} --template typescript`);

      case chalk.green('Vite-ReactJS'):
          return await execSync(`npm create vite@latest ${options.projectname} -- --template react-ts`);

      case chalk.magenta('Vite-Vue'):
          return await execSync(`npm create vite@latest ${options.projectname} -- --template vue-ts`);

      case chalk.yellow('Vite-Svelte'):
          return await execSync(`npm create vite@latest ${options.projectname} -- --template svelte-ts`);

      case chalk.blue('NextJS-App'):
        await execSync(`npm i -g create-next-app`);
        return await execSync(`npx create-next-app ${options.projectname} --use-npm`);

      case chalk.green('ReactNative-App'):
        await execSync(`npm install -g create-react-native-app`);
        return await execSync(`npx react-native init ${options.projectname} --template react-native-template-typescript`);

      case chalk.magenta('Express-DDD-Api'):
        return execSync(`git clone --depth 1 --branch latest https://github.com/xfxstudios/express-ddd-api.git ${options.projectname}`);

      case chalk.blue('Express-Serverless-Api'):
        return execSync(`git clone --depth 1 --branch master https://github.com/xfxstudios/express-serverless-api-base.git ${options.projectname}`);
    }
  }catch(e){
    return e
  }

}

async function goFolder(options) {
  const result=await execa('cd', ['./'+options.projectname]);
  if(result.failed) {
    return Promise.reject(new Error('Failed to enter in folder'));
  }
  return;
}

async function helpInfo() {
  console.log(`%s @xfxstudios/create-template-app ${base.version}`, chalk.blue.bold('=> !'));
  console.log('');
  console.log('%s Automathic install all dependencies in template', chalk.yellow.bold('=> --install'));
  console.log('%s Git initiate into template', chalk.yellow.bold('=> --git'));
  console.log('%s Skip all prompts', chalk.yellow.bold('=> --yes'));
  console.log('');
  console.log('%s Carlos Quintero', chalk.yellow.bold('=> Author'));
  console.log('%s info.fxstudios@gmail.com', chalk.yellow.bold('=> Email'));
  console.log('%s @xfxstudios', chalk.yellow.bold('=> Github'));

}

export async function createProject(options) {
  if(options.help) {
    helpInfo();
    process.exit(0);
  }
  options={
    ...options,
    targetDirectory: options.projectname||process.cwd(),
    email: 'info.fxstudios@gmail.com',
    name: 'Carlos Quintero',
  };

  const tasks=new Listr(
    [
      {
        title: 'Creating Project',
        task: () => copyTemplateFiles(options),
      },
      {
        title: 'Install dependencies',
        task: () => projectInstall({cwd: options.targetDirectory, }),
        skip: () => !options.install
            ? 'Send --install flag to automatically install dependencies'
            :undefined,
      }
    ],
    {
      exitOnError: false,
    }
  );

  await tasks.run();
  console.log('%s Project ready', chalk.green.bold('DONE'));
  return true;
}
