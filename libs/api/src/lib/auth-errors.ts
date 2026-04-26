import type { AuthError } from '@supabase/supabase-js';

const INVALID_CREDENTIAL_CODES = new Set(['invalid_credentials']);
const EMAIL_EXISTS_CODES = new Set(['user_already_exists', 'email_exists']);

const normalizeText = (value?: string) => value?.trim().toLowerCase() ?? '';

export const mapAuthErrorToMessage = (error: AuthError | Error | null): string => {
  if (!error) {
    return '';
  }

  const authError = error as Partial<AuthError>;
  const errorCode = normalizeText(authError.code);
  const errorMessage = normalizeText(error.message);
  const errorName = normalizeText(error.name);

  if (
    INVALID_CREDENTIAL_CODES.has(errorCode) ||
    errorName === 'authinvalidcredentialserror' ||
    errorMessage.includes('invalid login credentials') ||
    errorMessage.includes('invalid credentials')
  ) {
    return 'Email hoặc mật khẩu chưa đúng.';
  }

  if (
    EMAIL_EXISTS_CODES.has(errorCode) ||
    errorMessage.includes('already registered') ||
    errorMessage.includes('already been registered')
  ) {
    return 'Email này đã được đăng ký.';
  }

  if (
    errorName === 'authretryablefetcherror' ||
    errorMessage.includes('failed to fetch') ||
    errorMessage.includes('network')
  ) {
    return 'Kết nối đang gián đoạn. Vui lòng thử lại.';
  }

  return 'Không thể xử lý yêu cầu lúc này. Vui lòng thử lại.';
};
