import Handler from '../Handler';

export default class ClassOrInterfaceStrategy extends Handler {
  handleRequest(parser, mxCell, componentName) {
    if (componentName === 'class' || componentName === 'interface') {
      return parser.generateAndPushClassOrInterfaceElement(mxCell, componentName);
    }
    return this.next.handleRequest(parser, mxCell, componentName);
  }
}
