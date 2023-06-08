import chalk from 'chalk';
import execa from 'execa';
import fs from 'fs';
import gitignore from 'gitignore';
import Listr from 'listr';
import path from 'path';
import {projectInstall} from 'pkg-install';
import {promisify} from 'util';
import {execSync} from 'child_process';

const writeFile=promisify(fs.writeFile);
const writeGitignore=promisify(gitignore.writeFile);
const appVersion='v1.1.1'

async function copyTemplateFiles(options) {
  try{
    console.log('%s Starting create-base-app '+appVersion, chalk.green.bold('=>'));
    switch(options.template){
      case chalk.blue('Normal-ReactJS'):
          options.install = false
          return await execSync(`npx create-react-app ${options.projectname} --template typescript`);

      case chalk.green('Vite-ReactJS'):
          return await execSync(`npm create vite@latest ${options.projectname} -- --template react-ts`);

      case chalk.magenta('Vite-Vue'):
          return await execSync(`npm create vite@latest ${options.projectname} -- --template vue-ts`);

      case chalk.yellow('Vite-Svelte'):
          return await execSync(`npm create vite@latest ${options.projectname} -- --template svelte-ts`);

      case chalk.magenta('Express-DDD-Api'):
        return execSync(`git clone --branch develop https://github.com/xfxstudios/express-ddd-api.git ${options.projectname}`);
    }
  }catch(e){
    return e
  }

  // return new Promise((resolve, reject) => {
  //   console.log('%s Starting create-base-app '+appVersion, chalk.green.bold('=>'));

  //   const myHeaders=new Headers();
  //   myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  //   myHeaders.append("Authorization", "Basic RzRyQlhBY25NTHFIQzdheW1LOnMyNFR6cE5EWGZMblIyVlpwZ0dSdUdBV003dmQyakZS");

  //   var urlencoded=new URLSearchParams();
  //   urlencoded.append("grant_type", "client_credentials");

  //   var requestOptions={
  //     method: 'POST',
  //     headers: myHeaders,
  //     body: urlencoded,
  //     redirect: 'follow'
  //   };
  //   if(["Vite-ReactJS","Vite-Vue","Vite-Svelte"].includes(options.template)){


  //   }else{
  //     fetch("https://bitbucket.org/site/oauth2/access_token", requestOptions)
  //       .then(response => response.json())
  //       .then(async (result) => {
  
  //         switch(options.template) {
  //           case 'DDD-NodeJs-Express-Template':
  //             resolve(execSync(`git clone --branch develop https://x-token-auth:${result.access_token}@bitbucket.org/xfxstudios/backend-api-skeleton.git ${options.projectname}`));
  //           break
  
  //           case 'DDD-ReactJS-AntDesign-Template':
  //             resolve(execSync(`git clone --branch master https://xfxstudios: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@github.com/xfxstudios/nodejs-backend-boilerplate.git ${options.projectname}`));
  //           break
  
  //           default:
  //             resolve(await execSync(`git clone --branch develop https://x-token-auth:${result.access_token}@bitbucket.org/xfxstudios/backend-api-skeleton.git ${options.projectname}`));
  //         }
  //       })
  //       .catch(error => reject(error));
  //   }
  // })
}

async function goFolder(options) {
  const result=await execa('cd', ['./'+options.projectname]);
  if(result.failed) {
    return Promise.reject(new Error('Failed to enter in folder'));
  }
  return;
}

async function helpInfo() {
  console.log('%s @xfxstudios/create-template-app '+appVersion, chalk.blue.bold('=> !'));
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
