"use strict";

module.exports = ({ strapi }) => ({
  async sync(userId, shoes) {
    const existingItems = await strapi.entityService.findMany(
      "api::wishlist.wishlist",
      {
        filters: { userId: String(userId) },
      },
    );

    const existingShoeIds = new Set(existingItems.map((item) => item.shoe));

    const newItems = shoes.filter((shoe) => !existingShoeIds.has(shoe.id));

    for (const shoe of newItems) {
      await strapi.entityService.create("api::wishlist.wishlist", {
        data: {
          userId: String(userId),
          shoe: shoe.id,
          shoeName: shoe.name,
          shoeImage: shoe.images[0],
          shoePrice: shoe.price,
          addedAt: new Date(),
        },
      });
    }

    return strapi.entityService.findMany("api::wishlist.wishlist", {
      filters: { userId: String(userId) },
      sort: { addedAt: "desc" },
    });
  },
});
