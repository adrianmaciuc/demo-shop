"use strict";

module.exports = ({ strapi }) => ({
  async generateOrderNumber() {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  async updateStatus(orderId, statusData) {
    return strapi.entityService.update("api::order.order", orderId, statusData);
  },
});
