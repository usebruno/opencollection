export const parseSchema = (schema, path = [], visited = new Set()) => {
  if (!schema || typeof schema !== 'object') {
    return null;
  }

  const id = schema.$id || schema.$ref || path.join('.');
  
  if (visited.has(id)) {
    return { type: 'circular', ref: id, path };
  }
  
  visited.add(id);

  const node = {
    path,
    type: schema.type,
    title: schema.title,
    description: schema.description,
    required: schema.required || [],
    properties: {},
    items: null,
    oneOf: [],
    anyOf: [],
    allOf: [],
    enum: schema.enum,
    const: schema.const,
    default: schema.default,
    examples: schema.examples,
    format: schema.format,
    pattern: schema.pattern,
    minimum: schema.minimum,
    maximum: schema.maximum,
    minLength: schema.minLength,
    maxLength: schema.maxLength,
    minItems: schema.minItems,
    maxItems: schema.maxItems,
    uniqueItems: schema.uniqueItems,
    minProperties: schema.minProperties,
    maxProperties: schema.maxProperties,
    $ref: schema.$ref,
    $id: schema.$id,
    definitions: {},
    additionalProperties: schema.additionalProperties,
  };

  if (schema.properties) {
    for (const [key, value] of Object.entries(schema.properties)) {
      node.properties[key] = parseSchema(value, [...path, 'properties', key], visited);
    }
  }

  if (schema.items) {
    if (Array.isArray(schema.items)) {
      node.items = schema.items.map((item, index) => 
        parseSchema(item, [...path, 'items', index], visited)
      );
    } else {
      node.items = parseSchema(schema.items, [...path, 'items'], visited);
    }
  }

  if (schema.oneOf) {
    node.oneOf = schema.oneOf.map((item, index) => 
      parseSchema(item, [...path, 'oneOf', index], visited)
    );
  }

  if (schema.anyOf) {
    node.anyOf = schema.anyOf.map((item, index) => 
      parseSchema(item, [...path, 'anyOf', index], visited)
    );
  }

  if (schema.allOf) {
    node.allOf = schema.allOf.map((item, index) => 
      parseSchema(item, [...path, 'allOf', index], visited)
    );
  }

  if (schema.definitions) {
    for (const [key, value] of Object.entries(schema.definitions)) {
      node.definitions[key] = parseSchema(value, [...path, 'definitions', key], visited);
    }
  }

  visited.delete(id);
  return node;
};

export const resolveRef = (ref, schema, definitions = {}) => {
  if (!ref || !ref.startsWith('#')) return null;
  
  const parts = ref.split('/').slice(1);
  let current = schema;
  
  for (const part of parts) {
    if (part === 'definitions' && definitions) {
      current = definitions;
    } else if (current && typeof current === 'object') {
      current = current[part];
    } else {
      return null;
    }
  }
  
  return current;
};

export const getSchemaType = (schema) => {
  if (schema.type) return schema.type;
  if (schema.enum) return 'enum';
  if (schema.const !== undefined) return 'const';
  if (schema.oneOf) return 'oneOf';
  if (schema.anyOf) return 'anyOf';
  if (schema.allOf) return 'allOf';
  if (schema.$ref) return 'reference';
  if (schema.properties) return 'object';
  if (schema.items) return 'array';
  return 'any';
};

export const generateExample = (schema) => {
  const type = getSchemaType(schema);
  
  if (schema.examples && schema.examples.length > 0) {
    return schema.examples[0];
  }
  
  if (schema.default !== undefined) {
    return schema.default;
  }
  
  if (schema.enum) {
    return schema.enum[0];
  }
  
  if (schema.const !== undefined) {
    return schema.const;
  }
  
  switch (type) {
    case 'string':
      if (schema.format === 'date') return '2024-01-01';
      if (schema.format === 'date-time') return '2024-01-01T00:00:00Z';
      if (schema.format === 'email') return 'example@email.com';
      if (schema.format === 'uri') return 'https://example.com';
      if (schema.format === 'uuid') return '550e8400-e29b-41d4-a716-446655440000';
      if (schema.pattern) return `string matching ${schema.pattern}`;
      return 'string';
      
    case 'number':
    case 'integer':
      if (schema.minimum !== undefined) return schema.minimum;
      if (schema.maximum !== undefined) return schema.maximum;
      return type === 'integer' ? 0 : 0.0;
      
    case 'boolean':
      return true;
      
    case 'array':
      const itemExample = schema.items ? generateExample(schema.items) : 'item';
      return [itemExample];
      
    case 'object':
      const obj = {};
      if (schema.properties) {
        for (const [key, propSchema] of Object.entries(schema.properties)) {
          obj[key] = generateExample(propSchema);
        }
      }
      return obj;
      
    case 'null':
      return null;
      
    default:
      return 'any';
  }
};