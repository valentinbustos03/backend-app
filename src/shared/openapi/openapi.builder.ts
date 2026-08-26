import { z } from 'zod';

export type JsonObject = Record<string, unknown>;
export type PathsObject = Record<string, JsonObject>;

const SCHEMA_PREFIX = '#/components/schemas/';
const RESPONSE_PREFIX = '#/components/responses/';

const requestRegistry = z.registry<{ id: string }>();
const responseRegistry = z.registry<{ id: string }>();

export function registerRequest<T extends z.ZodType>(id: string, schema: T): T {
  requestRegistry.add(schema, { id });
  return schema;
}

export function registerResponse<T extends z.ZodType>(id: string, schema: T): T {
  responseRegistry.add(schema, { id });
  return schema;
}

export function ref(id: string): JsonObject {
  return { $ref: `${SCHEMA_PREFIX}${id}` };
}

export function refResponse(id: string): JsonObject {
  return { $ref: `${RESPONSE_PREFIX}${id}` };
}

export function arrayOf(id: string): JsonObject {
  return { type: 'array', items: ref(id) };
}

export function nullableRef(id: string): JsonObject {
  return { anyOf: [ref(id), { type: 'null' }] };
}

export function envelope(data?: JsonObject): JsonObject {
  const properties: JsonObject = { message: { type: 'string' } };
  if (data !== undefined) {
    properties.data = data;
  }
  return { type: 'object', properties, required: ['message'] };
}

export function jsonSchemaResponse(
  description: string,
  schema: JsonObject
): JsonObject {
  return { description, content: { 'application/json': { schema } } };
}

export function dataResponse(
  description: string,
  data: JsonObject
): JsonObject {
  return jsonSchemaResponse(description, envelope(data));
}

export function messageResponse(description: string): JsonObject {
  return jsonSchemaResponse(description, envelope());
}

export function jsonBody(id: string, description: string): JsonObject {
  return {
    required: true,
    description,
    content: { 'application/json': { schema: ref(id) } },
  };
}

export function pathParam(
  name: string,
  description: string,
  schema: JsonObject
): JsonObject {
  return { name, in: 'path', required: true, description, schema };
}

export function idPathParam(name: string, description: string): JsonObject {
  return pathParam(name, description, { type: 'string', pattern: '^\\d+$' });
}

export function queryParam(
  name: string,
  description: string,
  schema: JsonObject
): JsonObject {
  return { name, in: 'query', required: false, description, schema };
}

const REDUNDANT_BOUNDS = new Set<number>([
  Number.MAX_SAFE_INTEGER,
  Number.MIN_SAFE_INTEGER,
]);

function prune(node: unknown): unknown {
  if (Array.isArray(node)) {
    return node.map(prune);
  }
  if (node === null || typeof node !== 'object') {
    return node;
  }
  const pruned: JsonObject = {};
  for (const [key, value] of Object.entries(node as JsonObject)) {
    if (key === '$id' || key === '$schema') {
      continue;
    }
    if (
      (key === 'maximum' || key === 'minimum') &&
      typeof value === 'number' &&
      REDUNDANT_BOUNDS.has(value)
    ) {
      continue;
    }
    pruned[key] = prune(value);
  }
  return pruned;
}

export function buildSchemaComponents(): JsonObject {
  const uri = (id: string) => `${SCHEMA_PREFIX}${id}`;
  const request = z.toJSONSchema(requestRegistry, {
    target: 'draft-2020-12',
    io: 'input',
    unrepresentable: 'any',
    uri,
  }).schemas;
  const response = z.toJSONSchema(responseRegistry, {
    target: 'draft-2020-12',
    io: 'output',
    unrepresentable: 'any',
    uri,
  }).schemas;
  return prune({ ...request, ...response }) as JsonObject;
}
