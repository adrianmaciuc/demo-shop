"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/wishlists",
      handler: "wishlist.find",
      config: {
        auth: { type: "jwt" },
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/wishlists",
      handler: "wishlist.create",
      config: {
        auth: { type: "jwt" },
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "DELETE",
      path: "/wishlists/:id",
      handler: "wishlist.delete",
      config: {
        auth: { type: "jwt" },
        policies: [],
        middlewares: [],
      },
    },
  ],
};
