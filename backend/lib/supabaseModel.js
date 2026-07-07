const path = require("path");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

let cachedClient = null;

const toSnakeCase = (value) =>
  String(value || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/\s+/g, "_")
    .toLowerCase();

const toCamelCase = (value) =>
  String(value || "")
    .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    .replace(/[-\s]+/g, "");

const isPlainObject = (value) => value && typeof value === "object" && !Array.isArray(value);

const serializeValue = (value) => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(serializeValue);
  }

  if (isPlainObject(value)) {
    return value;
  }

  return value;
};

const coerceDate = (value) => {
  if (!value) return value;
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed;
  }
  return value;
};

const getSupabaseClient = () => {
  if (cachedClient) {
    return cachedClient;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("SUPABASE_URL and a Supabase key are required");
  }

  cachedClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
};

const getDocumentValue = (document, key) => {
  if (!document) return undefined;
  return document[key] ?? document[toSnakeCase(key)] ?? document[toCamelCase(key)];
};

const sortDocuments = (documents, sortOptions = {}) => {
  if (!sortOptions || typeof sortOptions !== "object") {
    return documents;
  }

  const entries = Object.entries(sortOptions);
  if (!entries.length) {
    return documents;
  }

  const sorted = [...documents];

  sorted.sort((left, right) => {
    for (const [field, direction] of entries) {
      const leftValue = getDocumentValue(left, field);
      const rightValue = getDocumentValue(right, field);
      const leftDate = leftValue instanceof Date ? leftValue.getTime() : new Date(leftValue || 0).getTime();
      const rightDate = rightValue instanceof Date ? rightValue.getTime() : new Date(rightValue || 0).getTime();
      const isComparableDate = !Number.isNaN(leftDate) && !Number.isNaN(rightDate);
      const leftComparable = isComparableDate ? leftDate : String(leftValue ?? "");
      const rightComparable = isComparableDate ? rightDate : String(rightValue ?? "");
      if (leftComparable < rightComparable) {
        return direction === -1 ? -1 : 1;
      }
      if (leftComparable > rightComparable) {
        return direction === -1 ? 1 : -1;
      }
    }
    return 0;
  });

  return sorted;
};

const matchesFilter = (document, filter = {}) => {
  if (!filter || typeof filter !== "object" || Array.isArray(filter)) {
    return true;
  }

  const directMatches = Object.entries(filter).every(([key, value]) => {
    if (key === "$or") {
      return true;
    }

    const documentValue = getDocumentValue(document, key);

    if (value && typeof value === "object" && !Array.isArray(value) && "$in" in value) {
      return value.$in.includes(documentValue);
    }

    if (value && typeof value === "object" && !Array.isArray(value) && "$regex" in value) {
      const regex = new RegExp(value.$regex, value.$options || "i");
      return regex.test(String(documentValue ?? ""));
    }

    return documentValue === value;
  });

  if (Array.isArray(filter.$or) && filter.$or.length) {
    const orMatches = filter.$or.some((clause) => matchesFilter(document, clause));
    return orMatches || directMatches;
  }

  return directMatches;
};

const mapRowToDocument = (row, fieldMap = {}, instanceMethodMap = {}, model) => {
  const mapped = {};
  Object.entries(row || {}).forEach(([key, value]) => {
    const normalizedKey = toCamelCase(key);
    const mappedKey = Object.keys(fieldMap).find((candidate) => fieldMap[candidate] === key) || normalizedKey;
    if (key === "id") {
      mapped._id = value;
      mapped.id = value;
      return;
    }

    if (value && typeof value === "object" && !Array.isArray(value)) {
      if (typeof value.toObject === "function") {
        mapped[mappedKey] = value.toObject();
      } else {
        mapped[mappedKey] = value;
      }
    } else {
      mapped[mappedKey] = value;
    }
  });

  if (mapped._id === undefined && mapped.id !== undefined) {
    mapped._id = mapped.id;
  }

  Object.keys(mapped).forEach((key) => {
    if (key === "createdAt" || key === "updatedAt" || key === "lastLogin") {
      mapped[key] = coerceDate(mapped[key]);
    }
  });

  if (mapped.createdAt === undefined && mapped.created_at) {
    mapped.createdAt = coerceDate(mapped.created_at);
  }

  if (mapped.updatedAt === undefined && mapped.updated_at) {
    mapped.updatedAt = coerceDate(mapped.updated_at);
  }

  if (mapped.lastLogin === undefined && mapped.last_login) {
    mapped.lastLogin = coerceDate(mapped.last_login);
  }

  if (mapped.isActive === undefined && mapped.is_active !== undefined) {
    mapped.isActive = mapped.is_active;
  }

  if (mapped.isFeatured === undefined && mapped.is_featured !== undefined) {
    mapped.isFeatured = mapped.is_featured;
  }

  if (mapped.isPopular === undefined && mapped.is_popular !== undefined) {
    mapped.isPopular = mapped.is_popular;
  }

  if (mapped.isRead === undefined && mapped.is_read !== undefined) {
    mapped.isRead = mapped.is_read;
  }

  if (mapped.selectedPlan === undefined && mapped.selected_plan !== undefined) {
    mapped.selectedPlan = mapped.selected_plan;
  }

  if (mapped.companyName === undefined && mapped.company_name !== undefined) {
    mapped.companyName = mapped.company_name;
  }

  if (mapped.shortDescription === undefined && mapped.short_description !== undefined) {
    mapped.shortDescription = mapped.short_description;
  }

  if (mapped.buttonText === undefined && mapped.button_text !== undefined) {
    mapped.buttonText = mapped.button_text;
  }

  if (mapped.billingType === undefined && mapped.billing_type !== undefined) {
    mapped.billingType = mapped.billing_type;
  }

  if (mapped.fullName === undefined && mapped.full_name !== undefined) {
    mapped.fullName = mapped.full_name;
  }

  if (mapped.projectType === undefined && mapped.project_type !== undefined) {
    mapped.projectType = mapped.project_type;
  }

  if (mapped.businessInfo === undefined && mapped.business_info !== undefined) {
    mapped.businessInfo = mapped.business_info;
  }

  if (mapped.heroSection === undefined && mapped.hero_section !== undefined) {
    mapped.heroSection = mapped.hero_section;
  }

  Object.assign(mapped, instanceMethodMap);

  mapped.toObject = () => ({ ...mapped });

  mapped.save = async () => {
    const payload = serializeDocument(mapped, fieldMap);
    const { data, error } = await getSupabaseClient()
      .from(model.table)
      .update(payload)
      .eq(model.primaryKey, mapped._id || mapped.id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return mapRowToDocument(data, fieldMap, instanceMethodMap, model);
  };

  return mapped;
};

const serializeDocument = (document = {}, fieldMap = {}) => {
  const payload = {};
  Object.entries(document || {}).forEach(([key, value]) => {
    if (["_id", "id", "save", "toObject", "comparePassword"].includes(key)) {
      return;
    }

    const mappedKey = fieldMap[key] || toSnakeCase(key);
    payload[mappedKey] = serializeValue(value);
  });

  return payload;
};

const createQuery = ({ model, filter = {}, options = {}, single = false }) => {
  let sortOptions = options.sort || null;
  let skipValue = options.skip || 0;
  let limitValue = options.limit || null;
  let maybeSelect = null;

  const execute = async () => {
    const { data, error } = await getSupabaseClient().from(model.table).select("*");
    if (error) {
      const message = error.message || "Supabase query failed";
      const wrapped = new Error(message);
      wrapped.code = error.code;
      wrapped.details = error.details;
      wrapped.hint = error.hint;
      throw wrapped;
    }

    const documents = (data || []).map((row) => mapRowToDocument(row, model.fieldMap, model.instanceMethodMap, model));
    let results = documents.filter((document) => matchesFilter(document, filter));

    if (sortOptions) {
      results = sortDocuments(results, sortOptions);
    }

    if (skipValue) {
      results = results.slice(skipValue);
    }

    if (limitValue !== null) {
      results = results.slice(0, limitValue);
    }

    if (single) {
      return results[0] || null;
    }

    return results;
  };

  const query = {
    sort(nextSort) {
      sortOptions = nextSort;
      return query;
    },
    skip(nextSkip) {
      skipValue = Number(nextSkip) || 0;
      return query;
    },
    limit(nextLimit) {
      limitValue = Number(nextLimit) || null;
      return query;
    },
    select() {
      maybeSelect = arguments[0];
      return query;
    },
    then(resolve, reject) {
      return execute().then(resolve, reject);
    },
    catch(reject) {
      return execute().catch(reject);
    },
    exec() {
      return execute();
    },
  };

  return query;
};

const createSupabaseModel = ({
  table,
  fieldMap = {},
  primaryKey = "id",
  defaultValues = {},
  instanceMethodMap = {},
}) => {
  const model = {
    table,
    fieldMap,
    primaryKey,
    instanceMethodMap,
    async create(document = {}) {
      const payload = {
        ...defaultValues,
        ...serializeDocument(document, fieldMap),
      };

      const { data, error } = await getSupabaseClient().from(table).insert(payload).select("*").single();
      if (error) {
        const message = error.message || "Supabase insert failed";
        const wrapped = new Error(message);
        wrapped.code = error.code;
        wrapped.details = error.details;
        wrapped.hint = error.hint;
        throw wrapped;
      }

      return mapRowToDocument(data, fieldMap, instanceMethodMap, model);
    },
    find(filter = {}) {
      return createQuery({ model, filter });
    },
    findOne(filter = {}) {
      return createQuery({ model, filter, single: true });
    },
    async findById(id) {
      const { data, error } = await getSupabaseClient().from(table).select("*").eq(primaryKey, id).single();
      if (error) {
        if (error.code === "PGRST116") {
          return null;
        }
        const message = error.message || "Supabase lookup failed";
        const wrapped = new Error(message);
        wrapped.code = error.code;
        wrapped.details = error.details;
        wrapped.hint = error.hint;
        throw wrapped;
      }
      return mapRowToDocument(data, fieldMap, instanceMethodMap, model);
    },
    async findByIdAndUpdate(id, updates = {}, options = {}) {
      const payload = serializeDocument(updates, fieldMap);
      const { data, error } = await getSupabaseClient()
        .from(table)
        .update(payload)
        .eq(primaryKey, id)
        .select("*")
        .single();
      if (error) {
        if (error.code === "PGRST116") {
          return null;
        }
        const message = error.message || "Supabase update failed";
        const wrapped = new Error(message);
        wrapped.code = error.code;
        wrapped.details = error.details;
        wrapped.hint = error.hint;
        throw wrapped;
      }

      if (options.new === false) {
        return mapRowToDocument(data, fieldMap, instanceMethodMap, model);
      }

      return mapRowToDocument(data, fieldMap, instanceMethodMap, model);
    },
    async findByIdAndDelete(id) {
      const existing = await model.findById(id);
      if (!existing) {
        return null;
      }

      const { error } = await getSupabaseClient().from(table).delete().eq(primaryKey, id);
      if (error) {
        const message = error.message || "Supabase delete failed";
        const wrapped = new Error(message);
        wrapped.code = error.code;
        wrapped.details = error.details;
        wrapped.hint = error.hint;
        throw wrapped;
      }
      return existing;
    },
    async countDocuments(filter = {}) {
      const documents = await model.find(filter).exec();
      return documents.length;
    },
    async deleteMany(filter = {}) {
      const documents = await model.find(filter).exec();
      const ids = documents.map((document) => document._id || document.id);
      if (!ids.length) {
        return { deletedCount: 0 };
      }
      const { error } = await getSupabaseClient().from(table).delete().in(primaryKey, ids);
      if (error) {
        const message = error.message || "Supabase deleteMany failed";
        const wrapped = new Error(message);
        wrapped.code = error.code;
        wrapped.details = error.details;
        wrapped.hint = error.hint;
        throw wrapped;
      }
      return { deletedCount: ids.length };
    },
    async insertMany(documents = []) {
      const payload = documents.map((document) => serializeDocument(document, fieldMap));
      const { data, error } = await getSupabaseClient().from(table).insert(payload).select("*");
      if (error) {
        const message = error.message || "Supabase insertMany failed";
        const wrapped = new Error(message);
        wrapped.code = error.code;
        wrapped.details = error.details;
        wrapped.hint = error.hint;
        throw wrapped;
      }
      return (data || []).map((row) => mapRowToDocument(row, fieldMap, instanceMethodMap, model));
    },
    async updateOne(filter = {}, updates = {}) {
      const documents = await model.find(filter).exec();
      if (!documents.length) {
        return { matchedCount: 0, modifiedCount: 0 };
      }
      const document = documents[0];
      const payload = serializeDocument({ ...document, ...updates }, fieldMap);
      const { data, error } = await getSupabaseClient()
        .from(table)
        .update(payload)
        .eq(primaryKey, document._id || document.id)
        .select("*")
        .single();
      if (error) {
        const message = error.message || "Supabase updateOne failed";
        const wrapped = new Error(message);
        wrapped.code = error.code;
        wrapped.details = error.details;
        wrapped.hint = error.hint;
        throw wrapped;
      }
      return { matchedCount: 1, modifiedCount: 1, data: mapRowToDocument(data, fieldMap, instanceMethodMap, model) };
    },
  };

  return model;
};

module.exports = { createSupabaseModel, getSupabaseClient };
