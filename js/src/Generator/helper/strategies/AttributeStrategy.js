import Handler from '../Handler';

export default class AttributeStrategy extends Handler {
  handleRequest(parser, mxCell, componentName) {
    if (componentName === 'attribute') {
      return parser.pushAttribute(mxCell);
    }
    return this.next.handleRequest(parser, mxCell, componentName);
  }
}
