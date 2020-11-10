const db = require("../data/db-config.js");

async function add(account) {
  const [id] = await db("accounts").returning("id").insert(account);

  return findByAccountId(id);
}

async function findByUserId(id) {
  return await db("accounts").where({ user_id: id }).first();
}

async function findByAccountId(id) {
  return await db("accounts").where({ id }).first();
}

async function updateAccount(id, changes) {
  await db("accounts").where({ id }).update(changes);

  const changedAccount = await findByAccountId(id);
  return changedAccount;
}

module.exports = {
  add,
  findByUserId,
  findByAccountId,
  updateAccount,
};
