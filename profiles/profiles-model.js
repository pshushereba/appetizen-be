const db = require("../data/db-config.js");

function findByUserId(id) {
  return db("profiles").where({ user_id: id }).first();
}

async function add(profile) {
  const [id] = await db("profiles").returning("id").insert(profile);

  return findByProfileId(id);
}

async function findByProfileId(id) {
  return await db("profiles").where({ id }).first();
}

async function updateProfile(id, changes) {
  await db("profiles").where({ id }).update(changes);

  const changedProfile = await findByProfileId(id);
  return changedProfile;
}

module.exports = {
  findByUserId,
  add,
  findByProfileId,
  updateProfile,
};
