/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n73nrb9ord13dy2")

  collection.name = "Submissions"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n73nrb9ord13dy2")

  collection.name = "Submissios"

  return dao.saveCollection(collection)
})
