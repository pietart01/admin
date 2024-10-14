class ModalManager {
  constructor() {
    this.modals = {};
  }

  handleRouteModalTrigger(modalId, data) {
    return JSON.stringify({ modalId, data });
  }
}

const modalManager = new ModalManager();

module.exports = {
  modalManager
};
