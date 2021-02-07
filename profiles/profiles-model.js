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

async function subscribeToUser(username) {
  const user = db("users").where({ username }).first();
  console.log("user", user);
  const user_profile = db("profiles").where({ id: user.id }).first();
  console.log("user_profile", user_profile);

  const subscriber_count = { subscribers: user_profile.subscribers++ };
  await db("profiles").where({ id: user.id }).update(subscriber_count);

  const updatedProfile = await findByProfileId(user.id);
  return updatedProfile;
}

module.exports = {
  findByUserId,
  add,
  findByProfileId,
  updateProfile,
  subscribeToUser,
};
