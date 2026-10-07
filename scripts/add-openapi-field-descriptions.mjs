#!/usr/bin/env node
/**
 * Add human-readable descriptions to OpenAPI parameters and schema properties.
 * Field copy is scoped per entity — see openapi-entity-fields.mjs.
 */
import fs from 'fs';
import {
  ENTITY_LABELS,
  entityFromApiPath,
  lookupEntityField,
  resolveEntity,
} from './openapi-entity-fields.mjs';

const targetPath = process.argv[2] || 'api-reference/openapi-v3.json';
const rewriteRequests = process.argv.includes('--rewrite-requests');
const spec = JSON.parse(fs.readFileSync(targetPath, 'utf8'));


const ENUM_HINTS = [
  {
    test: (vals) => vals.includes('week_day') && vals.includes('date'),
    text: 'Availability entry type: `week_day` for recurring hours or `date` for a specific day.',
  },
  {
    test: (vals) =>
      vals.includes('pending') && vals.includes('delivered') && vals.includes('failed'),
    text: 'Message delivery status.',
  },
  {
    test: (vals) => vals.includes('inbound') && vals.includes('outbound'),
    text: 'Message direction relative to your workspace.',
  },
  {
    test: (vals) =>
      vals.includes('campaign') && vals.includes('inbox') && vals.includes('api'),
    text: 'Where the message originated.',
  },
  {
    test: (vals) => vals.includes('image') && vals.includes('video') && vals.includes('document'),
    text: 'Attachment type discriminator.',
  },
  {
    test: (vals) => vals.includes('open') && vals.includes('closed'),
    text: 'Chat status.',
  },
  {
    test: (vals) => vals.includes('whatsapp') && vals.includes('instagram'),
    text: 'Messaging channel vendor.',
  },
  {
    test: (vals) => vals.includes('marketing') && vals.includes('utility'),
    text: 'WhatsApp template category.',
  },
  {
    test: (vals) => vals.includes('text') && vals.includes('media'),
    text: 'Reply preview content type.',
  },
  {
    test: (vals) => vals.includes('status_update'),
    text: 'History event type.',
  },
  {
    test: (vals) =>
      vals.includes('draft') && vals.includes('active') && vals.includes('paused'),
    text: 'Lifecycle status.',
  },
  {
    test: (vals) =>
      vals.includes('text') &&
      vals.includes('number') &&
      vals.includes('single_select'),
    text: 'Attribute value type.',
  },
  {
    test: (vals) => vals.includes('open') && vals.includes('closed') && vals.length <= 3,
    text: 'Whether the chat is open or closed.',
  },
  {
    test: (vals) =>
      vals.includes('seconds') && vals.includes('minutes') && vals.includes('hours'),
    text: 'Unit for the delay duration.',
  },
  {
    test: (vals) =>
      vals.includes('image') &&
      vals.includes('video') &&
      vals.includes('audio') &&
      vals.includes('document'),
    text: 'Uploaded file type.',
  },
];

function humanize(name) {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .trim()
    .toLowerCase();
}

function describeEnum(fieldName, enumValues, entity = 'common') {
  const vals = enumValues.filter((v) => v !== null && typeof v !== 'undefined');
  if (vals.length === 0) return null;
  for (const hint of ENUM_HINTS) {
    if (hint.text && hint.test(vals)) return hint.text;
  }
  const entityLabel = ENTITY_LABELS[entity] ?? humanize(entity);
  if (fieldName === 'status') return `${entityLabel} status.`;
  if (fieldName === 'type') {
    if (vals.length === 1) {
      const kind = String(vals[0]).replace(/_/g, ' ');
      return `${kind.charAt(0).toUpperCase() + kind.slice(1)} type.`;
    }
    return `${entityLabel} type.`;
  }
  if (fieldName === 'sender') return 'Who sent the message relative to your workspace.';
  if (fieldName === 'buttonType') return 'Interactive button type.';
  if (fieldName === 'vendor') return 'Messaging channel vendor.';
  if (fieldName === 'category') return 'WhatsApp template category.';
  if (fieldName === 'unit') return 'Unit for the duration.';
  return `${entityLabel} ${humanize(fieldName)}.`;
}

function getSchemaEnum(schema) {
  if (!schema || typeof schema !== 'object') return null;
  if (Array.isArray(schema.enum)) return schema.enum;
  if (schema.type === 'string' && schema.enum) return schema.enum;
  const parts = [];
  if (schema.anyOf) {
    for (const part of schema.anyOf) {
      if (part?.enum) parts.push(...part.enum);
      else if (part?.type === 'string' && part.const) parts.push(part.const);
    }
  }
  if (schema.oneOf) {
    for (const part of schema.oneOf) {
      if (part?.properties?.type?.enum) parts.push(...part.properties.type.enum);
    }
  }
  return parts.length ? [...new Set(parts)] : null;
}

function entityFallbackDescription(entity, fieldName, schema) {
  const entityLabel = ENTITY_LABELS[entity] ?? humanize(entity);
  const enums = getSchemaEnum(schema);

  if (enums && (fieldName === 'type' || fieldName === 'status' || fieldName === 'sender')) {
    const hint = describeEnum(fieldName, enums, entity);
    if (hint) return hint;
  }

  if (fieldName === 'id') return `${entityLabel} id.`;
  if (fieldName.endsWith('Ids')) {
    return `${humanize(fieldName.slice(0, -3))} ids for this ${entityLabel.toLowerCase()}.`;
  }
  if (fieldName.endsWith('Id')) {
    return `${humanize(fieldName.slice(0, -2))} id for this ${entityLabel.toLowerCase()}.`;
  }
  if (fieldName.startsWith('is') && fieldName.length > 2) {
    return `Whether this ${entityLabel.toLowerCase()} ${humanize(fieldName.slice(2))}.`;
  }
  if (fieldName.startsWith('has') && fieldName.length > 3) {
    return `Whether this ${entityLabel.toLowerCase()} has ${humanize(fieldName.slice(3))}.`;
  }

  if (schema?.type === 'array') {
    return `${entityLabel} ${humanize(fieldName)} list.`;
  }
  if (schema?.type === 'object' || schema?.properties) {
    return `${entityLabel} ${humanize(fieldName)} object.`;
  }
  if (enums) return describeEnum(fieldName, enums, entity);
  if (schema?.type === 'boolean') {
    return `Whether this ${entityLabel.toLowerCase()} ${humanize(fieldName)}.`;
  }
  if (schema?.type === 'integer' || schema?.type === 'number') {
    return `${entityLabel} ${humanize(fieldName)}.`;
  }
  if (schema?.format === 'date-time') {
    return `ISO 8601 datetime for this ${entityLabel.toLowerCase()}.`;
  }
  if (schema?.format === 'uuid') {
    return `${entityLabel} ${humanize(fieldName)} (UUID).`;
  }

  return `${entityLabel} ${humanize(fieldName)}.`;
}

function describeField(fieldName, schema, context, parentProperty = null, path = []) {
  const contextual = contextualDescription(fieldName, parentProperty, schema, path, context);
  if (contextual) return contextual;

  const entity = resolveEntity(context, path, parentProperty);
  const scoped = lookupEntityField(entity, fieldName);
  if (scoped) {
    return scoped;
  }

  return entityFallbackDescription(entity, fieldName, schema);
}

function describePathParam(name, apiPath) {
  const entity = entityFromApiPath(apiPath);
  const scoped = lookupEntityField(entity, name);
  if (scoped) return scoped;
  return entityFallbackDescription(entity, name, { type: 'string' });
}

function describeArrayItem(parentProperty, schema, context, path) {
  const entity = resolveEntity(context, path, parentProperty);
  const itemField =
    parentProperty?.endsWith('Ids') ? parentProperty.slice(0, -3) + 'Id' : parentProperty;
  const scoped = lookupEntityField(entity, itemField);
  if (scoped) return scoped;
  if (parentProperty === 'rules') {
    return lookupEntityField('campaign', 'rules') ?? 'Recurrence rule string (for example RRULE).';
  }
  return entityFallbackDescription(entity, itemField ?? 'item', schema);
}

function branchTypeName(schema) {
  const t = schema?.properties?.type?.enum?.[0];
  if (typeof t === 'string') return t;
  return null;
}

function describeCompositeBranch(schema, path) {
  if (!schema?.properties) return null;
  const keys = Object.keys(schema.properties).sort();
  const keySig = keys.join(',');
  const typeName = branchTypeName(schema);

  const bySig = {
    chatId: 'Target an existing chat by `chatId`.',
    'channelId,contactId': 'Target a contact on a specific channel.',
    'channelId,phoneNumber': 'Target a phone number on a specific channel.',
    'channelId,email': 'Target an email address on a specific channel.',
    'channelId,handleId': 'Target a contact handle on a specific channel.',
    'channelId,messageContent,name,type,vendorDetails':
      'Send a channel message template with vendor-specific content.',
    'addresses,birthday,emails,id,name,org,phones,type,urls':
      'Shared contact card attachment.',
    'id,payload,text,type': 'Quick-reply attachment.',
    'id,rows,title,type': 'List section attachment for interactive messages.',
    'buttonType,data,id,payload,text,type': 'Interactive button attachment.',
  };
  if (bySig[keySig]) return bySig[keySig];

  if (keySig === 'fileId,type' && typeName) {
    const label = typeName.charAt(0).toUpperCase() + typeName.slice(1);
    return `${label} attachment (requires \`fileId\` from [Upload file](/api-reference/openapi-v3.json%20POST%20/files)).`;
  }
  if (keySig === 'fileId,id,type' && typeName) {
    const label = typeName.charAt(0).toUpperCase() + typeName.slice(1);
    return `${label} attachment with optional client \`id\`.`;
  }
  if (keySig === 'fileId,id,isVoice,type' && typeName === 'audio') {
    return 'Audio attachment; set `isVoice` for a voice note.';
  }
  if (keySig.startsWith('buttonType,text,type') && typeName === 'button') {
    if (keys.includes('url')) return 'URL button attachment.';
    if (keys.includes('phoneNumber')) return 'Phone number button attachment.';
    return 'Quick-reply button attachment.';
  }

  if (path.some((p) => p === 'value' || p === 'attributes')) {
    return 'Attribute value for this type.';
  }

  return `Request shape: ${keys.map((k) => `\`${k}\``).join(', ')}.`;
}

function describeMapValue(parentProperty, schema, context, path) {
  const entity = resolveEntity(context, path, parentProperty);
  const keyField =
    parentProperty === 'variables'
      ? 'variables'
      : parentProperty === 'metadata'
        ? 'metadata'
        : parentProperty === 'attributes'
          ? 'attributes'
          : parentProperty;
  const scoped = lookupEntityField(entity, keyField);
  if (scoped && parentProperty === 'variables') {
    return `${scoped} (keyed by variable name).`;
  }
  if (scoped && parentProperty === 'metadata') {
    return `${scoped} (keyed by metadata key).`;
  }
  if (scoped && parentProperty === 'attributes') {
    return 'Attribute value for the given attribute id or slug.';
  }
  const label = ENTITY_LABELS[entity] ?? humanize(entity);
  if (schema?.type === 'string') {
    return `String value for a \`${parentProperty}\` entry on this ${label.toLowerCase()}.`;
  }
  return `Value for a \`${parentProperty}\` entry on this ${label.toLowerCase()}.`;
}

function syncAllParameterSchemaDescriptions(openapi) {
  for (const [apiPath, pathItem] of Object.entries(openapi.paths || {})) {
    if (!pathItem || typeof pathItem !== 'object') continue;
    for (const op of Object.values(pathItem)) {
      if (!op?.parameters) continue;
      for (const param of op.parameters) {
        if (!param?.name) continue;
        const desc = describePathParam(param.name, apiPath);
        param.description = desc;
        if (!param.schema) param.schema = { type: 'string' };
        param.schema.description = desc;
      }
    }
  }
}

function stripRequestDescriptions(obj, path = []) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => stripRequestDescriptions(item, [...path, i]));
    return;
  }
  const inRequest =
    path.includes('requestBody') ||
    (typeof path[path.length - 1] === 'number' && path[path.length - 2] === 'parameters');
  if (inRequest && Object.prototype.hasOwnProperty.call(obj, 'description')) {
    delete obj.description;
  }
  for (const [k, v] of Object.entries(obj)) {
    stripRequestDescriptions(v, [...path, k]);
  }
}

let added = 0;
let skipped = 0;

function isResponseContext(path) {
  const idx = path.indexOf('responses');
  if (idx < 0) return false;
  if (path[0] === 'paths') return true;
  if (path[0] === 'components' && path[1] === 'responses') return true;
  return false;
}

function isResponseObjectNode(path) {
  const code = path[path.length - 1];
  const parent = path[path.length - 2];
  if (parent === 'responses' && typeof code === 'string' && /^\d{3}$/.test(code)) {
    return true;
  }
  return path[0] === 'components' && path[1] === 'responses' && path.length === 3;
}

function stripResponseDescriptions(obj, path = []) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => stripResponseDescriptions(item, [...path, i]));
    return;
  }
  if (
    isResponseContext(path) &&
    !isResponseObjectNode(path) &&
    Object.prototype.hasOwnProperty.call(obj, 'description')
  ) {
    delete obj.description;
  }
  for (const [k, v] of Object.entries(obj)) {
    stripResponseDescriptions(v, [...path, k]);
  }
}

const COMPONENT_ERROR_DESCRIPTIONS = {
  ApiError400: 'Bad request.',
  ApiError401: 'Unauthorized.',
  ApiError402: 'Payment required.',
  ApiError403: 'Forbidden.',
  ApiError404: 'Not found.',
  ApiError429: 'Too many requests.',
  ApiError500: 'Internal server error.',
};

function ensureResponseDescriptions(openapi) {
  for (const [name, resp] of Object.entries(openapi.components?.responses ?? {})) {
    if (!resp || typeof resp !== 'object') continue;
    if (!resp.description) {
      resp.description = COMPONENT_ERROR_DESCRIPTIONS[name] ?? 'Error.';
    }
  }

  for (const pathItem of Object.values(openapi.paths ?? {})) {
    if (!pathItem || typeof pathItem !== 'object') continue;
    for (const op of Object.values(pathItem)) {
      if (!op?.responses) continue;
      for (const [code, resp] of Object.entries(op.responses)) {
        if (!resp || typeof resp !== 'object') continue;
        if (resp.$ref && Object.keys(resp).length === 1) continue;
        if (!resp.description) {
          resp.description = code.startsWith('2') ? 'OK' : 'Error.';
        }
      }
    }
  }
}

function annotate(obj, path = [], context = {}, parentProperty = null) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => annotate(item, [...path, i], context, parentProperty));
    return;
  }

  if (path[0] === 'paths' && typeof path[1] === 'string' && typeof path[2] === 'string') {
    const method = path[2];
    if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
      context = {
        ...context,
        path: path[1],
        method,
        summary: obj.summary,
      };
      if (!obj.description && obj.summary) {
        obj.description = `${obj.summary}.`;
        added++;
      }
    }
  }

  if (typeof path[path.length - 1] === 'number' && path[path.length - 2] === 'parameters') {
    if (obj.name && obj.in && context.path) {
      const desc = describePathParam(obj.name, context.path);
      if (!obj.description || rewriteRequests || obj.description !== desc) {
        obj.description = desc;
        added++;
      }
      if (obj.schema && typeof obj.schema === 'object') {
        if (!obj.schema.description || rewriteRequests || obj.schema.description !== desc) {
          obj.schema.description = desc;
          added++;
        }
      }
    }
  }

  const inRequestBody = path.includes('requestBody');

  if (inRequestBody && path[path.length - 1] === 'items' && parentProperty) {
    const isSchema =
      obj.type || obj.anyOf || obj.allOf || obj.oneOf || obj.enum || obj.$ref || obj.items;
    if (isSchema && (!obj.description || rewriteRequests)) {
      obj.description = describeArrayItem(parentProperty, obj, context, path);
      added++;
    }
  }

  if (
    inRequestBody &&
    typeof path[path.length - 1] === 'number' &&
    (path[path.length - 2] === 'anyOf' || path[path.length - 2] === 'oneOf') &&
    obj.type === 'object' &&
    obj.properties
  ) {
    if (!obj.description || rewriteRequests) {
      obj.description = describeCompositeBranch(obj, path);
      added++;
    }
  }

  if (inRequestBody && path[path.length - 1] === 'additionalProperties' && parentProperty) {
    const isSchema =
      obj.type || obj.anyOf || obj.allOf || obj.oneOf || obj.enum || obj.$ref || obj.items;
    if (isSchema && (!obj.description || rewriteRequests)) {
      obj.description = describeMapValue(parentProperty, obj, context, path);
      added++;
    }
  }

  if (
    !isResponseContext(path) &&
    path.length >= 2 &&
    path[path.length - 2] === 'properties' &&
    typeof path[path.length - 1] === 'string'
  ) {
    const fieldName = path[path.length - 1];
    const isSchema =
      obj.type || obj.anyOf || obj.allOf || obj.oneOf || obj.enum || obj.$ref || obj.items;
    if (isSchema && (!obj.description || rewriteRequests)) {
      const next = describeField(fieldName, obj, context, parentProperty, path);
      if (!obj.description || obj.description !== next) {
        obj.description = next;
        added++;
      } else {
        skipped++;
      }
    } else if (isSchema && obj.description) {
      skipped++;
    }
  }

  const isPropertiesMap = path[path.length - 1] === 'properties';
  for (const [k, v] of Object.entries(obj)) {
    if (k === 'description' && typeof v === 'string') continue;
    annotate(v, [...path, k], context, isPropertiesMap ? k : parentProperty);
  }
}

function isUnderVisibility(path, fieldName) {
  if (!['inbox', 'contacts', 'create'].includes(fieldName)) return false;
  const i = path.lastIndexOf('visibility');
  return i >= 0 && path[i + 1] === 'properties';
}

function contextualDescription(fieldName, parentField, schema, path = [], context = {}) {
  if (isUnderVisibility(path, fieldName)) {
    return lookupEntityField('attribute', fieldName);
  }

  const inChatTarget =
    path.includes('chat') &&
    (path.includes('anyOf') || path[path.indexOf('chat') + 1] === 'properties');
  if (inChatTarget || parentField === 'chat') {
    const fromMessage = lookupEntityField('message', fieldName);
    if (fromMessage) return fromMessage;
  }

  const detailsIdx = path.lastIndexOf('details');
  if (detailsIdx >= 0 && path[detailsIdx + 1] === 'properties' && fieldName === 'options') {
    return lookupEntityField('attribute', 'options');
  }

  if (parentField === 'details' && fieldName === 'value') {
    return lookupEntityField('attribute', 'value');
  }

  if (
    fieldName === 'description' &&
    (schema?.type === 'string' ||
      (Array.isArray(schema?.type) && schema.type.includes('string')))
  ) {
    const entity = resolveEntity(context, path, parentField);
    return lookupEntityField(entity, 'description') ?? lookupEntityField('attribute', 'description');
  }
  return null;
}

if (rewriteRequests) {
  stripRequestDescriptions(spec);
}

annotate(spec);
syncAllParameterSchemaDescriptions(spec);
stripResponseDescriptions(spec);
ensureResponseDescriptions(spec);

fs.writeFileSync(targetPath, JSON.stringify(spec, null, 2) + '\n');
console.log('Descriptions added or filled:', added);
console.log('Properties already documented (skipped):', skipped);
