import { type SchemaTypeDefinition } from 'sanity'
import { propertyType } from './property'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [propertyType],
}
