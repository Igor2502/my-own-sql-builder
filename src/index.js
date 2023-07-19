import data from './../database/data.json' assert { type: "json" }
import FluentSQLBuilder from './fluentSQL.js'

const result = FluentSQLBuilder.for(data)
  .select(['name', 'height', 'hair_color', 'skin_color', 'eye_color', 'birth_year', 'gender', 'planet'])
  .from('peoples')
  .where({ name: /.*Skywalker.*/ })
  .orderBy('name')
  .limit(2)
  .build()

console.table(result)