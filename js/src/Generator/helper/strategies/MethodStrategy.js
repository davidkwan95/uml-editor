import Handler from '../Handler';

export default class MethodStrategy extends Handler {
  handleRequest(parser, mxCell, componentName) {
    if (componentName === 'method') {
      return parser.pushMethod(mxCell);
    }
    return this.next.handleRequest(parser, mxCell, componentName);
  }
}
