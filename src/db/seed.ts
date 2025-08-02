import { reset, seed } from 'drizzle-seed'
import { db, sql } from './connection'
import { schema } from './schema/index'

async function runSeed() {
  await reset(db, schema)

  const refinedData = await seed(db, schema).refine((funcs) => {
    return {
      produtores: {
        count: 5,
        columns: {
          name: funcs.firstName(),
          cpfOuCnpj: funcs.valuesFromArray({ values: ['12435243677'] }),
          createdAt: funcs.date({ maxDate: new Date() }),
        },
      },
    }
  })

  await sql.end()
}

runSeed().catch((err) => {
  console.error('Erro ao rodar a seed:', err)
})
