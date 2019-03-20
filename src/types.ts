export interface IUnishellClient {
  shell: IUnishellShell;
  connect (): any;
  exec (): any;
}

export interface IUnishellShell {
  (exec: IExec): Promise<any>;
  pipe (): any;
}

export interface IExec {
  (cmd: string): Promise<any>;
  reject (): any;
  pipe (): any;

}

export interface IExecResult {
  /** Whether the command was exited non-0 */
  killed: boolean;

  /** Combined stdout and stderr */
  output: string;
  stdout: string;
  stderr: string;

  /** Invoking command */
  cmd: string;

  /** Exit code */
  code: number;
}
