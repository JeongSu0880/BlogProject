import { compare, hash } from 'bcryptjs';
import { z } from 'zod';

export type ValidError = {
  error: Record<string, string | undefined>;
  data: Record<string, string | undefined | null>;
};

export const validate = <T extends z.ZodObject>(
  zobj: T,
  formData: FormData,
) => {
  const data = Object.fromEntries(formData.entries()) as ValidError['data'];
  for (const k of Object.keys(data)) {
    if (k.startsWith('$')) delete data[k];
  }
  const validator = zobj.safeParse(data);
  if (!validator.success) {
    const verr = z.treeifyError(validator.error).properties || {};
    const validError: ValidError = { error: {}, data };
    for (const [k, v] of Object.entries(verr)) {
      validError.error[k] = v?.errors[0];
    }
    return [validError] as const;
  }

  return [undefined, validator.data] as const;
};

export const validateAsync = async <T extends z.ZodObject>(
  zobj: T,
  formData: FormData,
) => {
  const data = Object.fromEntries(formData.entries()) as ValidError['data'];
  for (const k of Object.keys(data)) {
    if (k.startsWith('$')) delete data[k];
  }
  const validator = await zobj.safeParseAsync(data);
  if (!validator.success) {
    const verr = z.treeifyError(validator.error).properties || {};
    const validError: ValidError = { error: {}, data };
    for (const [k, v] of Object.entries(verr)) {
      validError.error[k] = v?.errors[0];
    }
    return [validError] as const;
  }

  return [undefined, validator.data] as const;
};

export const encryptPassword = async (plainPasswd: string) =>
  hash(plainPasswd, 10);

export const comparePassword = async (
  plainPasswd: string,
  encPassword: string,
) => compare(plainPasswd, encPassword);
