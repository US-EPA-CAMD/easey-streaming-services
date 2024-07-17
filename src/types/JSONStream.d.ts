declare module 'JSONStream' {
  import { Transform } from 'stream';

  namespace JSONStream {
    function stringify(): Transform;
    function parse(path: string): Transform;
  }

  export = JSONStream;
}
