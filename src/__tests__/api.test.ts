import { Unishell } from '../Unishell';

// tslint:disable: no-unused-expression

test('Unishell API can be accessed as the interfaces define it', async () => {

  const unishell = new Unishell({});

  const ssh = unishell.ssh({
    host: 'localhost',
    user: 'foo',
    identity: '',
  });

  const local = unishell.local({
    cwd: __dirname,
  });

  await ssh.connect();

  const r1 = await ssh.exec('echo foo');

  r1;

  const r2 = await ssh.exec('echo foo').details();

  r2.output;

  await ssh.exec('echo foo').pipe({ stdout: process.stdout });

  const r3 = ssh.exec('echo foo').pipe(process);

  r3.on;

  const r4 = await r3;

  r4;

  const r5 = await ssh.exec('echo foo').reject();

  r5.trim;

  const r6 = await ssh.exec('echo foo').reject().details();

  r6.output;

  const r7 = await ssh.shell(async (exec) => {
    exec('').reject;
    exec('').details;
    exec('').pipe;
    exec('').then;
  });

  r7;

  await ssh.shell(async (exec) => {
    await exec('echo foo');
  })
    .pipe(process);

  const sessionStream = ssh.shell(async (exec) => {
    await exec('echo foo');
    await exec('exit');
  });

  process.stdin.pipe(sessionStream.stdin);
  sessionStream.pipe(process);

  await sessionStream; // Shell session is over

  await local.shell(async (exec) => {
    const r10 = await exec('ls -lsah').details();

    r10.cmd;
  });

  const ssh2 = ssh.client();

  ssh2.forwardIn;
});
