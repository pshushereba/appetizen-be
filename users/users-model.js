const db = require("../data/db-config.js");

function findById(id) {
  return db("users").where({ id }).first();
}

function findByUsername(username) {
  return db("users").where({ username }).first();
}

function searchByUsername(username) {
  return db("users").where("username", "like", `%${username}%`);
}

function findBy(filter) {
  return db("users").where(filter);
}

async function add(user) {
  const [id] = await db("users").returning("id").insert(user);

  return findById(id);
}

async function updateUser(id, changes) {
  await db("users").where({ id }).update(changes);

  const changedUser = await findById(id);
  return changedUser;
}

async function updateResetPasswordToken(id, changes) {
  console.log("passed in params", id, changes);
  await db("users").where({ id }).update({
    reset_password_token: changes.reset_password_token,
    reset_password_expires: changes.reset_password_expires,
  });

  const userRecordWithToken = await findById(id);
  console.log(userRecordWithToken);
  return userRecordWithToken;
}

async function updateUserAvatar(id, photo) {
  console.log("in updateUserAvatar", id, photo);
  return db("users")
    .where({ id })
    .update("avatar_img", photo, ["id", "avatar_img"]);
}

async function deleteUser(id) {
  const deleted = await db("users").where({ id }).del();

  return deleted;
}

async function getAllUsers() {
  return await db("users").select();
}

function countSubscribers(id) {
  result = db("subscribers").count("creator_id").where({ creator_id: id });
  return result;
}

async function subscribeToUser(creator_id, subscriber_id) {
  const connection = {
    creator_id: creator_id,
    subscriber_id: subscriber_id,
  };
  // Will need to prevent subscribing multiple times.
  await db("subscribers").insert(connection);

  return countSubscribers(creator_id);
}

module.exports = {
  findById,
  findBy,
  findByUsername,
  searchByUsername,
  add,
  updateUser,
  deleteUser,
  updateUserAvatar,
  subscribeToUser,
  countSubscribers,
  getAllUsers,
  updateResetPasswordToken,
};
