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

const unishell = new Unishell({});

/** Produces a `ssh2` powered client */
const ssh = unishell.ssh({
  host: 'localhost',
  user: 'foo',
  identity: '',
});

/** Produces a local `execa` powered client */
const local = unishell.local({
  cwd: __dirname,
});

await ssh.connect();

const r1 = await ssh.exec('echo foo');

r1; // "foo"

const r2 = await ssh.exec('echo foo').details();

r2.output; // "foo"

await ssh.exec('echo foo').pipe({ stdout: process.stdout });

const r3 = ssh.exec('echo foo').pipe(process);

r3.on;

const r4 = await r3;

r4;

const r5 = await ssh.exec('notARealCommand');

r5; // "command not found: notARealCommand"

try {
  await ssh.exec('notARealCommand').reject().details();
} catch (r6) {
  r6;
  // { stdout: "", stderr: "command not found: notARealCommand", exitCode: 127, ... }
}

const r7 = await ssh.shell(async (exec) => {
  exec('').reject;
  exec('').details;
  exec('').pipe;
  exec('').then;
});

r7;

const r8 = await ssh.exec('echo foo').reject(); // doesnt actually reject, as `echo` wont error

r8; // "foo"

await ssh.shell(async (exec) => {
  await exec('echo foo');
})
  .pipe(process);

const sessionStream = ssh.shell(async (exec) => {
  await exec('echo foo');
  await exec('exit');
});

/** Piping the parent node CLI input into the ssh session's stdin */
process.stdin.pipe(sessionStream.stdin);

/** Piping the ssh session's stdout and stderr into the parent node process */
sessionStream.pipe(process);

await sessionStream; // Shell session is over

await local.connect();

/** Run commands locally */
await local.shell(async (exec) => {
  const r10 = await exec('ls -lsah').details();

  r10.cmd;
});

/** Access the `ssh2` Client to do advanced operations */
const ssh2 = ssh.client();

ssh2.forwardIn;
```
