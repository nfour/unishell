# Unishell

- [Why](#why)
- [Examples](#examples)

## Why

Got tired of having to pick and choose which library to interact with the CLI. This attempts to unify it.

**Goals**:
- Be as terse and as close to a bash script as reasonable
- Normalize local and remote CLI interactions

**Usage examples**:
- Regular CLI interaction with a terser interface
- Deployment scripts for remote SSH targets


## Examples

```ts
import { Unishell } from 'unishell';

const unishell = new Unishell({ /* global options */ })

/** Produces a `ssh2` powered client */
const ssh = unishell.ssh({
  host: 'localhost',
  user: 'foo',
  identity: ''
});

/** Produces a local `execa` powered client */
const local = unishell.local({
  cwd: __dirname,
});

// Both `ssh` and `local` have identical interfaces!

void (async () => {
  await ssh.connect();

  //
  // Basic usage
  //


  const output = await ssh.exec('echo foo');
  // "foo"

  const { output, stdout, stderr, code, killed, cmd }  = await ssh.exec('echo foo').details();
  // { output: "foo", stdout: "foo", stderr: "", code: 0, killed: false, cmd: "echo foo" }

  await ssh.exec('echo foo').pipe(process);
  
  const stream = ssh.exec('echo foo').pipe(process);
  // ReadableStream & Promise

  await stream;

  /** A session is created, with each command operating in the same session */
  await ssh.shell(async (exec) => {
    const { stdout } = await exec('echo foo');
    // > { stdout: "foo", ... }

    const result = await exec.output('echo foo');
    // > "foo"

    //
    // Errors
    //

    const { stdout, stderr, exitCode, rejected } = await exec('notARealCommand').reject();
    // > { stdout: "", stderr: "command not found: notARealCommand", exitCode: 127, rejected: true, ... }

    // An error is not thrown, instead the stdout and stderr are combined to produce the `output`
    const result = await exec.output('notARealCommand');
    // > "command not found: notARealCommand"


    console.log(stdout); // "foo"
  });

  //
  // Basic usage - piping output
  // Below, .pipe(process) means your parent node process will see live output from each command executed
  //

  await ssh.shell(async (exec) => {
    await exec('echo foo');
  })
    .pipe(process)

  //
  // Basic usage - piping output
  // You can also pipe `exec` calls individually
  //

  await ssh.shell(async (exec) => {
    await exec('echo foo').pipe(process);
  })

  //
  // Interactive
  //

  const sessionStream = ssh.shell(async (exec) => {
    await exec('echo foo');

    // Will not exit until you input on the CLI, for example, `exit`
    // ...
    // or you can do this:

    await exec.exit();
  });

  process.pipe(sessionStream)
  sessionStream.pipe(process);

  await sessionStream; // Shell session is over

  //
  // Advanced usage
  //

  await ssh.shell(async (exec) => {
    const { stdout } = await exec('ls -lsah')
    await exec('ls -lsah').pipe(process)

    await exec.with('cd someDir', (execInDir) => {
      execInDir('ls -lsah')
    })
  }).pipe(process) 

  //
  // Run local commands in the same way
  //

  await local.shell(async (exec) => {
    await exec('ls -lsah')
  });

  //
  // Really advanced usage
  //

  /** This retrieves the `ssh2` client for you to do whatever you wish */
  const sshClient = ssh.client();
})();

```
