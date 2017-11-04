/** Abstract class for handler */

export default class Handler {
  constructor() {
    this.next = {
      handleRequest: () => {
        console.log('All strategies exhausted');
      }
    };
  }

  setNext(next) {
    this.next = next;
    return next;
  }

  handleRequest() {
    throw new Error('Method not implemented', this);
  }
}
