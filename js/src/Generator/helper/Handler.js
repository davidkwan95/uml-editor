/** Abstract class for handler */

var Handler = function() {
  this.next = {
    handleRequest: function(request) { console.log('All strategies exhausted') }
  }
}
Handler.prototype.setNext = function(next) {
  this.next = next;
  return next;
}
Handler.prototype.handleRequest = function(request) {}

module.exports = Handler;
