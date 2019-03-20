import { ReadStream, WriteStream } from 'fs';
import { Client as SshClient } from 'ssh2';
import { Stream } from 'stream';

export interface IUnishellClient {
  shell: IUnishellShellSession;
  exec: IExec;
  connect (): Promise<void>;
}

export interface IUnishellSshClient extends IUnishellClient {
  client (): SshClient;
}

/** All calls to the provided `exec` are executed within the session */
export type IUnishellShellSession = (
  cb: (exec: IExec) => Promise<any>,
) => (
  { pipe: IFluidPipe } & IProcessIo & Promise<void>
);

export interface IExecOptions {}
export type IExec = (cmd: string, options?: Partial<IExecOptions>) => IExecFluidReturn;

export interface IExecFluidReturn extends Promise<string> {
  pipe: IFluidPipe;
  details (): Promise<IExecResult>;
  reject (): IExecFluidReturn;
}

export type IFluidPipe = (io: Partial<IProcessIo>) => Promise<void> & Stream;

export interface IProcessIo {
  stdout: NodeJS.WriteStream;
  stderr: NodeJS.WriteStream;
  stdin: NodeJS.ReadStream;
}

export interface IExecResult {
  /** Whether the command was exited non-0 */
  readonly rejected: boolean;

  /** Combined stdout and stderr */
  readonly output: string;
  readonly stdout: string;
  readonly stderr: string;

  /** Invoking command */
  readonly cmd: string;

  /** Exit code */
  readonly code: number;
}

export interface IExecResultRejection extends IExecResult {
  /** Identical to `output` */
  message: string;
}
