exports.up = function (knex) {
  return knex.schema
    .createTable("users", (tbl) => {
      tbl.increments();
      tbl.string("username", 255).notNullable();
      tbl.string("password", 255).notNullable();
      tbl.string("name", 255).notNullable();
      tbl.string("email", 255).unique().notNullable();
    })
    .createTable("accounts", (tbl) => {
      tbl.increments();
      tbl.string("first_name", 255);
      tbl.string("last_name", 255);
      tbl.string("address", 255);
      tbl.string("address2", 255);
      tbl.string("city", 255);
      tbl.string("state", 255);
      tbl.string("zip", 255);
      tbl.string("subscribers", 255);
      tbl.string("videos", 255);
      tbl
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })
    .createTable("profiles", (tbl) => {
      tbl.increments();
      tbl.string("location", 255);
      tbl.string("bio", 255);
      tbl.integer("subscribers");
      tbl.string("website_url", 255);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("profiles")
    .dropTableIfExists("accounts")
    .dropTableIfExists("users");
};
