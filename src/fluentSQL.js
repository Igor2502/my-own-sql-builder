export default class FluentSQLBuilder {
  #database = []
  #limit = 0
  #select = []
  #where = []
  #orderBy = ''
  #from = ''

  constructor({ database }) {
    this.#database = database
  }

  static for(database) {
    return new FluentSQLBuilder({ database })
  }

  limit(max) {
    this.#limit = max

    return this
  }

  select(props) {
    this.#select = props

    return this
  }

  where(query) {
    const [[prop, selectedValue]] = Object.entries(query)
    const whereFilter = selectedValue instanceof RegExp
      ? selectedValue
      : new RegExp(selectedValue)

    this.#where.push({ prop, filter: whereFilter})

    return this
  }

  orderBy(field) {
    this.#orderBy = field

    return this
  }

  from(table) {
    this.#from = table

    return this
  }

  #performLimit(results) {
    return this.#limit && results.length === this.#limit
  }

  #performWhere(item) {
    for (const { prop, filter } of this.#where) {
      if (!filter.test(item[prop])) return false
    }

    return true
  }

  #performSelect(item) {
    const currentItem = {}
    const entries = Object.entries(item)
    for (const [key, value] of entries) {
      if (this.#select.length && !this.#select.includes(key)) continue
      currentItem[key] = value
    }

    return currentItem
  }

  #performOrderBy(results) {
    if (!this.#orderBy) return results

    return results.sort((prev, next) => {
      switch (typeof prev[this.#orderBy]) {
        case 'string':
          return prev[this.#orderBy].localeCompare(next[this.#orderBy])
        case 'object':
          if (prev[this.#orderBy] instanceof Date) {
            return prev[this.#orderBy] < next[this.#orderBy] ? -1 : 1
          }
        default:
          1;
      }
    })
  }

  #performFrom() {
    return this.#from !== ''
      ? this.#database[this.#from]
      : this.#database
  }

  build() {
    const results = []
    for (const item of this.#performFrom()) {
      if (!this.#performWhere(item)) continue

      const currentItem = this.#performSelect(item)
      results.push(currentItem)

      if (this.#performLimit(results)) break
    }

    const finalResult = this.#performOrderBy(results)
    return finalResult
  }
}