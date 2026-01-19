"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/orders",
      handler: "order.find",
      config: {
        auth: { type: "jwt" },
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/orders/:id",
      handler: "order.findOne",
      config: {
        auth: { type: "jwt" },
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/orders",
      handler: "order.create",
      config: {
        auth: { type: "jwt" },
        policies: [],
        middlewares: [],
      },
    },
  ],
};
