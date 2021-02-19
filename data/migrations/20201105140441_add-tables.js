exports.up = function (knex) {
  return knex.schema
    .createTable("users", (tbl) => {
      tbl.increments();
      tbl.string("username", 255).notNullable();
      tbl.string("password", 255).notNullable();
      tbl.string("first_name", 255).notNullable();
      tbl.string("last_name", 255).notNullable();
      tbl.string("email", 255).unique().notNullable();
      tbl.string("avatar_img", 255);
      tbl.string("address", 255);
      tbl.string("address2", 255);
      tbl.string("city", 255);
      tbl.string("state", 255);
      tbl.string("zip", 255);
      tbl.string("videos", 255);
      tbl.string("role", 10).notNullable();
      tbl.string("location", 255);
      tbl.string("bio", 255);
      tbl.integer("subscribers");
      tbl.string("website_url", 255);
      tbl.string("header_img", 255);
      tbl.string("reset_password_token", 255);
      tbl.bigInteger("reset_password_expires");
    })
    .createTable("subscribers", (tbl) => {
      tbl.increments();
      tbl
        .integer("creator_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");

      tbl
        .integer("subscriber_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("subscribers")
    .dropTableIfExists("users");
};
