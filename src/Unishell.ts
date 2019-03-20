import { IUnishellClient, IUnishellSshClient } from './types';

export class Unishell {
  constructor (config: any) {
    // ...
  }

  ssh (config: any): IUnishellSshClient { return {} as any; }
  local (config: any): IUnishellClient { return {} as any; }
}
