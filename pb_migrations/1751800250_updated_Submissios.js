/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n73nrb9ord13dy2")

  // remove
  collection.schema.removeField("sow4ms8i")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n73nrb9ord13dy2")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "sow4ms8i",
    "name": "Created_at",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
})
