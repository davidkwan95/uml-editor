import Handler from '../Handler';

export default class GeneralizationStrategy extends Handler {
  handleRequest(parser, mxCell, componentName) {
    if (componentName === 'generalization') {
      return parser.pushGeneralization(mxCell);
    }
    return this.next.handleRequest(parser, mxCell, componentName);
  }
}
