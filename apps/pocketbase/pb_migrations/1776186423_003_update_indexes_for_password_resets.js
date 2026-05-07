/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("password_resets");
  collection.indexes.push("CREATE UNIQUE INDEX idx_password_resets_token ON password_resets (token)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("password_resets");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_password_resets_token"));
  return app.save(collection);
})