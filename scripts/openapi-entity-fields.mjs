/** Field descriptions scoped per API resource — only `common` is shared across entities. */

export const ENTITY_LABELS = {
  common: 'Request',
  attribute: 'Attribute',
  automation: 'Automation',
  campaign: 'Campaign',
  channel: 'Channel',
  chat: 'Chat',
  contact: 'Contact',
  journey: 'Journey',
  label: 'Label',
  messageTemplate: 'Message template',
  message: 'Message',
  apiWebhook: 'API webhook',
  file: 'File',
  team: 'Team',
  user: 'User',
  workspace: 'Workspace',
};

const ts = {
  createdAt: 'ISO 8601 datetime when the resource was created.',
  updatedAt: 'ISO 8601 datetime when the resource was last updated.',
};

export const ENTITY_FIELDS = {
  common: {
    pagination:
      'Page through results. Defaults to page 0 and limit 10 when omitted. See [Pagination](/api-reference/v3/pagination).',
    page: 'Zero-based page index. Defaults to 0 when omitted.',
    limit: 'Rows per page. Defaults to 10 when omitted. Maximum 100.',
    total: 'Total number of matching rows.',
    totalCount: 'Total count for the current query.',
  },

  workspace: {
    ...ts,
    name: 'Workspace display name.',
    timezone: 'Workspace IANA timezone identifier.',
    availability: 'Workspace availability windows.',
    date: 'Calendar date (`YYYY-MM-DD`) for date-specific availability.',
    weekDay: 'Weekday for recurring availability.',
    intervals: 'Time intervals within the availability window.',
    from: 'Interval start time (`HH:mm`).',
    to: 'Interval end time (`HH:mm`).',
  },

  user: {
    ...ts,
    id: 'User id.',
    userId: 'User id.',
    email: 'User email address.',
    firstName: 'User first name.',
    lastName: 'User last name.',
    fullName: 'User full name.',
    roles: 'Roles assigned to the user in this workspace.',
    profilePicture: 'User profile image URL.',
  },

  team: {
    ...ts,
    id: 'Team id.',
    teamId: 'Team id.',
    name: 'Team name.',
    users: 'Users who belong to this team.',
    icon: 'Optional icon for the team.',
    query:
      'Structured filter expression. See [Query syntax](/api-reference/v3/query) for expression functions. Filterable fields: `id`, `createdAt`, `updatedAt`, `name`, `icon`.',
    sortBy:
      'Sort expression. See [Sort By syntax](/api-reference/v3/sort-by) for expression functions. Sortable fields: `id`, `createdAt`, `updatedAt`, `name`, `icon`.',
    search: 'Free-text search by `name`. See [Search](/api-reference/v3/search).',
  },

  file: {
    ...ts,
    id: 'File id.',
    fileId: 'File id.',
    type: 'Uploaded file type.',
    file: 'Binary file to upload.',
    name: 'Original file name.',
    contentType: 'MIME type of the uploaded file.',
    size: 'File size in bytes.',
    url: 'Download URL for the file.',
    publicUrl: 'Stable public URL for the file.',
    status: 'File processing status.',
    events: 'Lifecycle events recorded for the file.',
  },

  apiWebhook: {
    ...ts,
    id: 'API webhook id.',
    webhookId: 'API webhook id.',
    url: 'HTTPS URL that receives webhook POST requests.',
    events: 'Event types to deliver to this webhook.',
    scopes: 'Optional scopes that limit which resources trigger events.',
    ids: 'Ids included in a webhook scope entry.',
    status: 'Webhook status.',
    query:
      'Structured filter expression. See [Query syntax](/api-reference/v3/query) for expression functions. Filterable fields: `id`, `createdAt`, `updatedAt`, `status`, `url`, `events`.',
    sortBy:
      'Sort expression. See [Sort By syntax](/api-reference/v3/sort-by) for expression functions. Sortable fields: `id`, `createdAt`, `updatedAt`, `status`, `url`, `events`.',
    search: 'Free-text search by `url`. See [Search](/api-reference/v3/search).',
  },

  attribute: {
    ...ts,
    id: 'Attribute id.',
    attributeId: 'Attribute id.',
    name: 'Internal attribute name (slug).',
    type: 'The type of the attribute value.',
    displayName: 'The friendly name of the attribute.',
    description: 'The description of the attribute.',
    visibility: 'Where this attribute appears in Heyy.',
    inbox: 'Whether the attribute is shown in the inbox contact card.',
    contacts: 'Whether the attribute is shown on the contacts page.',
    create: 'Whether the attribute can be set when creating a contact.',
    details: 'Type-specific configuration (for example select options).',
    options: 'Select options for single- or multi-select attributes.',
    color: 'Option color for select attributes.',
    value: 'Option value stored on contacts.',
    icon: 'Optional icon for the attribute.',
    query:
      'Structured filter expression. See [Query syntax](/api-reference/v3/query) for expression functions. Filterable fields: `id`, `createdAt`, `updatedAt`, `name`, `type`, `displayName`, `description`, `visibility`, `details`.',
    sortBy:
      'Sort expression. See [Sort By syntax](/api-reference/v3/sort-by) for expression functions. Sortable fields: `id`, `createdAt`, `updatedAt`, `name`, `type`, `displayName`, `description`, `visibility`, `details`.',
    search: 'Free-text search by `name`. See [Search](/api-reference/v3/search).',
  },

  automation: {
    ...ts,
    id: 'Automation id.',
    automationId: 'Automation id.',
    name: 'Automation name.',
    status: 'Automation lifecycle status.',
    triggerAutomations: 'Input variables passed into the automation run.',
    variables: 'Variable values for the automation trigger payload.',
    query:
      'Structured filter expression. See [Query syntax](/api-reference/v3/query) for expression functions. Filterable fields: `id`, `createdAt`, `updatedAt`, `name`, `status`, `activeVersionId`, `activeVersionTriggerType`, `activeVersionTriggerParametersChannelId`, `latestVersionTriggerType`, `latestVersionTriggerParametersChannelId`, `latestVersionId`.',
    sortBy:
      'Sort expression. See [Sort By syntax](/api-reference/v3/sort-by) for expression functions. Sortable fields: `id`, `createdAt`, `updatedAt`, `name`, `status`, `activeVersionId`, `activeVersionTriggerType`, `activeVersionTriggerParametersChannelId`, `latestVersionTriggerType`, `latestVersionTriggerParametersChannelId`, `latestVersionId`.',
    search: 'Free-text search by `name`. See [Search](/api-reference/v3/search).',
  },

  campaign: {
    ...ts,
    id: 'Campaign id.',
    campaignId: 'Campaign id.',
    name: 'Campaign name.',
    automationId: 'Automation that sends this campaign.',
    recurrence: 'Recurrence settings for scheduled campaigns.',
    rules: 'Recurrence rule strings (for example RRULE).',
    scheduledAt: 'When the campaign is scheduled to run (ISO 8601), or null.',
    variables: 'Variable values passed into the campaign automation.',
    groupId: 'Campaign group id.',
    audienceType: 'How the campaign audience is defined.',
    audienceQuery: 'Filter query that defines the campaign audience.',
    totalRecipients: 'Number of contacts in the campaign audience.',
    latestExecutionId: 'Id of the most recent campaign run.',
    latestExecution: 'Summary of the most recent campaign run.',
    status: 'Campaign execution status.',
    totalCount: 'Total recipients in the execution.',
    contactIds: 'Contact ids to add or remove from the campaign audience.',
    latestExecutionStatus: 'Status of the most recent campaign run.',
    query:
      'Structured filter expression. See [Query syntax](/api-reference/v3/query) for expression functions. Filterable fields: `id`, `createdAt`, `updatedAt`, `name`, `automationId`, `groupId`, `scheduledAt`, `recurrence`, `latestExecutionId`, `latestExecutionStatus`.',
    sortBy:
      'Sort expression. See [Sort By syntax](/api-reference/v3/sort-by) for expression functions. Sortable fields: `id`, `createdAt`, `updatedAt`, `name`, `automationId`, `groupId`, `scheduledAt`, `recurrence`, `latestExecutionId`, `latestExecutionStatus`.',
    search: 'Free-text search by `name`. See [Search](/api-reference/v3/search).',
  },

  channel: {
    ...ts,
    id: 'Channel id.',
    channelId: 'Channel id.',
    name: 'Channel display name.',
    vendor: 'Messaging channel vendor.',
    vendorDetails: 'Vendor-specific channel configuration and profile.',
    allowInbound: 'Whether inbound messages are accepted on this channel.',
    wabaId: 'WhatsApp Business Account id.',
    phoneNumberId: 'WhatsApp phone number id.',
    igId: 'Instagram account id.',
    username: 'Instagram username.',
    accountSid: 'Twilio account SID (SMS).',
    widgetId: 'Web chat widget id.',
    isVerified: 'Whether the channel asset is verified with the vendor.',
    dailyLimit: 'Vendor-reported daily messaging limit.',
    qualityRating: 'WhatsApp quality rating.',
    profile: 'Public profile information from the vendor.',
    about: 'Profile about text.',
    vertical: 'Business vertical category.',
    websites: 'Profile website URLs.',
    security: 'Widget security settings.',
    allowedDomains: 'Domains allowed to embed the web chat widget.',
    secretKeys: 'Secret keys for widget authentication.',
    hiddenPaths: 'URL path patterns where the widget is hidden.',
    messagePlaceholder: 'Placeholder text in the widget composer.',
    initialMessages: 'Greeting messages shown when the widget opens.',
    suggestedMessages: 'Quick-reply suggestions in the widget.',
    removePoweredBy: 'Whether to hide Heyy branding on the widget.',
    style: 'Widget style configuration.',
    theme: 'Widget color theme.',
    primaryColor: 'Primary brand color (hex).',
    align: 'Widget alignment on the page.',
    direction: 'Layout direction.',
    positionX: 'Horizontal position offset.',
    positionY: 'Vertical position offset.',
    query:
      'Structured filter expression. See [Query syntax](/api-reference/v3/query) for expression functions. Filterable fields: `id`, `createdAt`, `updatedAt`, `name`, `type`, `status`, `vendor`, `vendorId`.',
    sortBy:
      'Sort expression. See [Sort By syntax](/api-reference/v3/sort-by) for expression functions. Sortable fields: `id`, `createdAt`, `updatedAt`, `name`, `type`, `status`, `vendor`, `vendorId`.',
    search: 'Free-text search by `name`. See [Search](/api-reference/v3/search).',
  },

  chat: {
    ...ts,
    id: 'Chat id.',
    chatId: 'Chat id.',
    channelId: 'Channel this chat belongs to.',
    contactId: 'Contact this chat belongs to.',
    status: 'Whether the chat is open or closed.',
    isSensitive: 'Whether the chat is marked sensitive.',
    isUnread: 'Whether the chat has unread messages.',
    openUntil:
      'ISO 8601 datetime until which the conversation window stays open.',
    unreadCount: 'Number of unread messages in the chat.',
    latestMessage: 'Preview of the most recent message.',
    assignedUserId: 'User assigned to the chat, or null.',
    assignedTeamId: 'Team assigned to the chat, or null.',
    assignment: 'Assignment target for the chat.',
    handleId: 'Contact handle id for this chat.',
    handleValue: 'Handle value (for example phone number or username).',
    latestMessageTimestamp: 'ISO 8601 datetime of the latest message in the chat.',
    contactFirstName: 'Contact first name on the chat.',
    contactLastName: 'Contact last name on the chat.',
    contactIsSubscribed: 'Whether the contact on the chat is subscribed.',
    contactLabels: 'Labels on the contact for this chat.',
    contactPhoneNumber: 'Contact phone number on the chat.',
    contactEmail: 'Contact email on the chat.',
    query:
      "Structured filter expression. See [Query syntax](/api-reference/v3/query) for expression functions. Filterable fields: `id`, `createdAt`, `updatedAt`, `handleId`, `contactId`, `status`, `isUnread`, `unreadCount`, `assignedUserId`, `assignedTeamId`, `latestMessage`, `channelId`, `latestMessageTimestamp`, `contactFirstName`, `contactLastName`, `contactIsSubscribed`, `contactLabels`, `contactPhoneNumber`, `contactEmail`, `handleValue`, `isSensitive`. Filter custom contact attributes with `getBy('attributes', 'name', 'your_attribute_name')` or `getBy('attributes', 'id', 'attribute-id')`.",
    sortBy:
      "Sort expression. See [Sort By syntax](/api-reference/v3/sort-by) for expression functions. Sortable fields: `id`, `createdAt`, `updatedAt`, `handleId`, `contactId`, `status`, `isUnread`, `unreadCount`, `assignedUserId`, `assignedTeamId`, `latestMessage`, `channelId`, `latestMessageTimestamp`, `contactFirstName`, `contactLastName`, `contactIsSubscribed`, `contactLabels`, `contactPhoneNumber`, `contactEmail`, `handleValue`, `isSensitive`. Sort custom contact attributes with `getBy('attributes', 'name', 'your_attribute_name')` or `getBy('attributes', 'id', 'attribute-id')`.",
    search:
      'Free-text search by contact full name (`firstName` and `lastName` combined with a space), phone number, or email. See [Search](/api-reference/v3/search).',
  },

  contact: {
    ...ts,
    id: 'Contact id.',
    contactId: 'Contact id.',
    contactIds: 'Contact ids.',
    firstName: 'Contact first name.',
    lastName: 'Contact last name.',
    fullName: 'Contact full display name.',
    displayName: 'Display name shown in the product.',
    email: 'Contact email address.',
    phoneNumber: 'Contact phone number.',
    isSubscribed:
      'Whether the contact may receive outbound marketing and campaigns.',
    isPrimary: 'Whether this handle is the contact primary handle.',
    hasChats: 'Whether matching contacts have at least one chat.',
    metadata: 'Custom key-value metadata on the contact.',
    attributes: 'Custom attribute values keyed by attribute id or slug.',
    attribute: 'Embedded attribute definition when upserting values.',
    handles: 'Contact handles across channels.',
    handleId: 'Contact handle id.',
    labels: 'Label ids attached to the contact.',
    labelId: 'Label id.',
    deletedIds: 'Contact ids successfully deleted.',
    notFoundIds: 'Contact ids that were not found.',
    extra: 'Additional vendor-specific metadata on a handle.',
    vendorId: 'Vendor identifier for a handle.',
    notes: 'Notes stored on the contact.',
    groups: 'Contact groups.',
    query:
      "Structured filter expression. See [Query syntax](/api-reference/v3/query) for expression functions. Filterable fields: `id`, `createdAt`, `updatedAt`, `firstName`, `lastName`, `isSubscribed`, `labels`, `notes`, `groups`, `phoneNumber`, `email`. Filter custom contact attributes with `getBy('attributes', 'name', 'your_attribute_name')` or `getBy('attributes', 'id', 'attribute-id')`.",
    sortBy:
      "Sort expression. See [Sort By syntax](/api-reference/v3/sort-by) for expression functions. Sortable fields: `id`, `createdAt`, `updatedAt`, `firstName`, `lastName`, `isSubscribed`, `labels`, `notes`, `groups`, `phoneNumber`, `email`. Sort custom contact attributes with `getBy('attributes', 'name', 'your_attribute_name')` or `getBy('attributes', 'id', 'attribute-id')`.",
    search:
      'Free-text search by full name (`firstName` and `lastName` combined with a space), phone number, or email. See [Search](/api-reference/v3/search).',
  },

  journey: {
    ...ts,
    id: 'Journey id.',
    journeyId: 'Journey id.',
    name: 'Journey name.',
    status: 'Journey status.',
    steps: 'Steps in the journey.',
    schedule: 'Scheduled enrollment configuration.',
    datetime: 'Scheduled datetime (ISO 8601).',
    delay: 'Delay before the next step.',
    unit: 'Unit for the delay duration.',
    timeWindows: 'Allowed send windows for a journey step.',
    subscribedAt:
      'ISO 8601 datetime when the contact subscribed to the journey.',
    lastCompletedIndex: 'Last completed step index for the contact.',
    exitRoute: 'Journey exit route identifier.',
    contactIds: 'Contact ids to subscribe or unsubscribe.',
    query:
      'Structured filter expression. See [Query syntax](/api-reference/v3/query) for expression functions. Filterable fields: `id`, `createdAt`, `updatedAt`, `name`, `type`, `status`.',
    sortBy:
      'Sort expression. See [Sort By syntax](/api-reference/v3/sort-by) for expression functions. Sortable fields: `id`, `createdAt`, `updatedAt`, `name`, `type`, `status`.',
    search: 'Free-text search by `name`. See [Search](/api-reference/v3/search).',
  },

  label: {
    ...ts,
    id: 'Label id.',
    labelId: 'Label id.',
    name: 'Label name.',
    color: 'Hex color for the label.',
    query:
      'Structured filter expression. See [Query syntax](/api-reference/v3/query) for expression functions. Filterable fields: `id`, `createdAt`, `updatedAt`, `name`.',
    sortBy:
      'Sort expression. See [Sort By syntax](/api-reference/v3/sort-by) for expression functions. Sortable fields: `id`, `createdAt`, `updatedAt`, `name`.',
    search: 'Free-text search by `name`. See [Search](/api-reference/v3/search).',
  },

  messageTemplate: {
    ...ts,
    id: 'Message template id.',
    messageTemplateId: 'Message template id.',
    name: 'Template name.',
    category: 'WhatsApp template category.',
    language: 'BCP 47 language code.',
    status: 'Template approval status.',
    header: 'Template header component.',
    footer: 'Template footer component.',
    body: 'Template body text.',
    messageContent: 'Structured template content for the vendor.',
    vendorDetails: 'Vendor-specific template fields.',
    addSecurityRecommendation:
      'Whether WhatsApp should add a security recommendation to authentication templates.',
    codeExpirationMinutes: 'Minutes until an authentication code expires.',
    copyCodeButtonText:
      'Label for the copy-code button on authentication templates.',
    otpType: 'OTP delivery type for authentication templates.',
    autofillButtonText:
      'Label for the autofill button on authentication templates.',
    zeroTapTermsAccepted:
      'Whether zero-tap terms were accepted for authentication templates.',
    supportedApps: 'Android apps supported for zero-tap authentication.',
    packageName: 'Android package name for zero-tap authentication.',
    signatureHash: 'App signature hash for zero-tap authentication.',
    variables: 'Template variable default values keyed by name.',
    vendorDetailsName: 'Template name on the vendor (for example WhatsApp template name).',
    query:
      'Structured filter expression. See [Query syntax](/api-reference/v3/query) for expression functions. Filterable fields: `id`, `createdAt`, `updatedAt`, `name`, `vendorId`, `status`, `channelId`, `type`, `vendorDetailsName`.',
    sortBy:
      'Sort expression. See [Sort By syntax](/api-reference/v3/sort-by) for expression functions. Sortable fields: `id`, `createdAt`, `updatedAt`, `name`, `vendorId`, `status`, `channelId`, `type`, `vendorDetailsName`.',
    search: 'Free-text search by `name`. See [Search](/api-reference/v3/search).',
  },

  message: {
    chat: 'Identifies the conversation to send to (by chat id or channel + contact/handle).',
    chatId: 'Existing chat id to send the message to.',
    channelId: 'Channel to open or use for the conversation.',
    contactId: 'Contact to message on the given channel.',
    phoneNumber: 'Phone number to message on the given channel.',
    email: 'Email address to message on the given channel.',
    handleId: 'Contact handle to message on the given channel.',
    body: 'Plain text body of the message.',
    attachments: 'Media or interactive attachments to send with the message.',
    scheduledAt: 'Schedule the message for a future time (ISO 8601).',
    replyToMessageId: 'Message id to reply to.',
    messageTemplate: 'Message template to send.',
    fileId:
      'File id from [Upload file](/api-reference/openapi-v3.json%20POST%20/files).',
    type: 'Attachment or content type discriminator.',
    isVoice: 'Whether the audio attachment is a voice note.',
    text: 'Text content.',
    title: 'Title text.',
    header: 'Header text.',
    footer: 'Footer text.',
    payload: 'Opaque payload (for example button response data).',
    buttonType: 'Interactive button type.',
    rows: 'List section rows for interactive messages.',
    catalogId: 'WhatsApp product catalog id.',
    productRetailerId: 'Product retailer id within the catalog.',
    latitude: 'Latitude for a location attachment.',
    longitude: 'Longitude for a location attachment.',
    mediaId: 'Vendor media id.',
    mediaUrl: 'Vendor media URL.',
    mediaType: 'Media type for referrals or attachments.',
    urlExtension: 'Dynamic URL suffix for button templates.',
    itemPrice: 'Line item price.',
    currency: 'ISO 4217 currency code.',
    quantity: 'Quantity ordered.',
    productItems: 'Product line items in an order message.',
    order: 'Order attachment payload.',
    address: 'Postal or street address.',
    street: 'Street line.',
    city: 'City.',
    state: 'State or region.',
    zip: 'Postal or ZIP code.',
    country: 'Country name.',
    countryCode: 'ISO country calling code.',
    birthday: 'Birthday (`YYYY-MM-DD`).',
    emails: 'Email addresses on a shared contact card.',
    formattedName: 'Formatted name on a shared contact card.',
    middleName: 'Middle name.',
    suffix: 'Name suffix.',
    prefix: 'Name prefix.',
    org: 'Organization block on a shared contact card.',
    company: 'Company name.',
    department: 'Department name.',
    phones: 'Phone numbers on a shared contact card.',
    urls: 'URLs on a shared contact card.',
    addresses: 'Addresses on a shared contact card.',
    toolCallId: 'AI tool call id.',
    toolName: 'AI tool name.',
    input: 'Tool call input payload.',
    output: 'Tool call output payload.',
    source: 'Referral or content source identifier.',
    sourceUrl: 'Referral source URL.',
    sourceType: 'Referral source type.',
    sourceId: 'Referral source id.',
    headline: 'Referral headline text.',
    imageUrl: 'Referral image URL.',
    videoUrl: 'Referral video URL.',
    thumbnailUrl: 'Referral thumbnail URL.',
    ctwaClid: 'Click-to-WhatsApp ad click id.',
    externalId: 'External reference id from the vendor.',
    sender: 'Who sent the message relative to your workspace.',
    content: 'Message content.',
    contentType: 'MIME or attachment content type.',
    url: 'URL.',
    pgId: 'Payment or billing reference id (when present).',
    commentId: 'Social comment id (Instagram/Facebook).',
  },
};

const PATH_ROOT_TO_ENTITY = {
  workspace: 'workspace',
  users: 'user',
  teams: 'team',
  files: 'file',
  api_webhooks: 'apiWebhook',
  attributes: 'attribute',
  automations: 'automation',
  campaigns: 'campaign',
  channels: 'channel',
  chats: 'chat',
  contacts: 'contact',
  journeys: 'journey',
  labels: 'label',
  message_templates: 'messageTemplate',
  messages: 'message',
};

/** Nested object keys in request schemas → entity for child properties. */
const NESTED_PROPERTY_ENTITY = {
  attribute: 'attribute',
  latestExecution: 'campaign',
  vendorDetails: 'channel',
  visibility: 'attribute',
  details: 'attribute',
  messageContent: 'messageTemplate',
  profile: 'channel',
  recurrence: 'campaign',
  security: 'channel',
  style: 'channel',
};

export function entityFromApiPath(apiPath) {
  if (!apiPath) return 'common';
  const root = apiPath.split('/').filter(Boolean)[0];
  return PATH_ROOT_TO_ENTITY[root] ?? 'common';
}

export function resolveEntity(context, path, parentProperty) {
  const apiEntity = entityFromApiPath(context.path);

  if (parentProperty && NESTED_PROPERTY_ENTITY[parentProperty]) {
    return NESTED_PROPERTY_ENTITY[parentProperty];
  }

  for (let i = path.length - 1; i >= 0; i--) {
    const key = path[i];
    if (key === 'properties' && typeof path[i + 1] === 'string') {
      const prop = path[i + 1];
      if (NESTED_PROPERTY_ENTITY[prop]) return NESTED_PROPERTY_ENTITY[prop];
    }
  }

  if (context.path?.startsWith('/messages/')) return 'message';

  return apiEntity;
}

export function lookupEntityField(entity, fieldName) {
  const scoped = ENTITY_FIELDS[entity]?.[fieldName];
  if (scoped !== undefined) return scoped;
  if (entity !== 'common') {
    const shared = ENTITY_FIELDS.common[fieldName];
    if (shared !== undefined) return shared;
  }
  return null;
}
