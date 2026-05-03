import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const dockerCandidates = [
  process.env.DOCKER_BIN,
  'docker',
  'C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe',
  'C:\\ProgramData\\DockerDesktop\\version-bin\\docker.exe',
].filter(Boolean);

function exists(command) {
  return fs.existsSync(command);
}

function findDocker() {
  const explicitDocker = dockerCandidates.find((candidate) => candidate !== 'docker' && exists(candidate));

  if (explicitDocker) return explicitDocker;

  const commandLookup = spawnSync('where.exe', ['docker'], {
    encoding: 'utf8',
  });

  if (commandLookup.status === 0) {
    return commandLookup.stdout.split(/\r?\n/).find(Boolean) || 'docker';
  }

  return null;
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: command === 'docker',
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${path.basename(command)} ${args.join(' ')} exited with ${code}`));
    });

    child.on('error', reject);
  });
}

const docker = findDocker();
const command = process.argv[2] || 'check';

if (!docker) {
  console.error('Docker no esta instalado o no fue encontrado.');
  console.error('Instala/abre Docker Desktop, o define DOCKER_BIN con la ruta de docker.exe.');
  console.error('Ejemplo: $env:DOCKER_BIN="C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe"');
  process.exit(1);
}

try {
  if (command === 'check') {
    await run(docker, ['version']);
  } else if (command === 'up') {
    await run(docker, ['compose', 'up', '-d']);
  } else if (command === 'down') {
    await run(docker, ['compose', 'down']);
  } else if (command === 'reset') {
    await run(docker, ['compose', 'down', '-v']);
    await run(docker, ['compose', 'up', '-d']);
  } else if (command === 'ps') {
    await run(docker, ['ps']);
  } else {
    console.error(`Comando no soportado: ${command}`);
    process.exit(1);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
