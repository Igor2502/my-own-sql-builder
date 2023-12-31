import { expect, describe, test } from '@jest/globals'
import FluentSQLBuilder from '../src/fluentSQL'

const data = [
  {
    id: 0,
    name: 'igorgomes',
    category: 'developer',
    created_at: new Date('2023-02-11')
  },
  {
    id: 1,
    name: 'mariazinha',
    category: 'developer',
    created_at: new Date('2022-10-04')
  },
  {
    id: 2,
    name: 'joaozin',
    category: 'manager',
    created_at: new Date('2023-07-17')
  },
]

describe('Test Suite for FluentSQL Builder', () => {
  test('#for should return a FluentSQLBuilder instance', () => {
    const result = FluentSQLBuilder.for(data)
    const expected = new FluentSQLBuilder({ database: data })
    expect(result).toStrictEqual(expected)
  })
  test('#build should return the empty object instance', () => {
    const result = FluentSQLBuilder.for(data).build()
    const expected = data
    expect(result).toStrictEqual(expected)
  })

  test('#limit given a collection it should limit results', () => {
    const result = FluentSQLBuilder.for(data).limit(1).build()
    const expected = [data[0]]
    
    expect(result).toStrictEqual(expected)
  })
  test('#where given a collection it should filter data', () => {
    const result = FluentSQLBuilder.for(data).where({ category : /^dev/ }).build()
    const expected = data.filter(({ category }) => category.slice(0,3) === 'dev')

    expect(result).toStrictEqual(expected)
  })
  test('#select given a collection it should return only especific fields', () => {
    const result = FluentSQLBuilder.for(data).select(['name','category']).build()
    const expected = data.map(({ name, category}) => ({ name, category }))

    expect(result).toStrictEqual(expected)
  })
  test('#orderBy given a collection it should order results by string field', () => {
    const result = FluentSQLBuilder.for(data).orderBy('name').build()
    const expected = [
      {
        id: 0,
        name: 'igorgomes',
        category: 'developer',
        created_at: new Date('2023-02-11')
      },
      {
        id: 2,
        name: 'joaozin',
        category: 'manager',
        created_at: new Date('2023-07-17')
      },
      {
        id: 1,
        name: 'mariazinha',
        category: 'developer',
        created_at: new Date('2022-10-04')
      },
    ]

    expect(result).toStrictEqual(expected)
  })
  test('#orderBy given a collection it should order results by date field', () => {
    const result = FluentSQLBuilder.for(data).orderBy('created_at').build()
    const expected = [
      {
        id: 1,
        name: 'mariazinha',
        category: 'developer',
        created_at: new Date('2022-10-04')
      },
      {
        id: 0,
        name: 'igorgomes',
        category: 'developer',
        created_at: new Date('2023-02-11')
      },
      {
        id: 2,
        name: 'joaozin',
        category: 'manager',
        created_at: new Date('2023-07-17')
      },
    ]

    expect(result).toStrictEqual(expected)
  })
  test('#orderBy given a collection it should order results by number field', () => {
    const result = FluentSQLBuilder.for(data).orderBy('id').build()
    const expected = [
      {
        id: 0,
        name: 'igorgomes',
        category: 'developer',
        created_at: new Date('2023-02-11')
      },
      {
        id: 1,
        name: 'mariazinha',
        category: 'developer',
        created_at: new Date('2022-10-04')
      },
      {
        id: 2,
        name: 'joaozin',
        category: 'manager',
        created_at: new Date('2023-07-17')
      },
    ]

    expect(result).toStrictEqual(expected)
  })
  test('#from given a collection it should return only selected table', () => {
    const base = {
      rows: data
    }
    const result = FluentSQLBuilder.for(base).from('rows').build()
    expect(result).toStrictEqual(data)
  })

  test('pipeline', () => {
    const result = FluentSQLBuilder.for(data)
      .select(['name', 'category'])
      .where({ category: 'developer' })
      .where({ name: /z/ })
      .limit(1)
      .orderBy('name')
      .build()

    const expected = data.filter(({ id }) => id === 1).map(({ name, category }) => ({name, category}))
    expect(result).toStrictEqual(expected)
  })
})