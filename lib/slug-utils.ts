/**
 * Slug Utility Functions
 * Handles slug generation and validation for forms
 */

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export function isValidSlug(slug: string): boolean {
  // Slug should be 3-100 characters, alphanumeric with hyphens
  const slugRegex = /^[a-z0-9]([a-z0-9-]{1,98}[a-z0-9])?$/;
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 100;
}

export function normalizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^\w-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function isReservedSlug(slug: string): boolean {
  const reserved = [
    'api',
    'admin',
    'dashboard',
    'settings',
    'auth',
    'login',
    'signup',
    'logout',
    'forgot-password',
    'reset-password',
    'verify-email',
    'new',
    'edit',
    'delete',
    'preview',
    'public',
    'static',
    'images',
    'styles',
    'scripts',
    'fonts',
  ];
  return reserved.includes(slug.toLowerCase());
}

export function generateUniqueSlug(title: string, existingSlugs: string[] = []): string {
  let slug = generateSlug(title);
  let counter = 1;

  if (!slug) {
    slug = 'form';
  }

  let uniqueSlug = slug;
  while (existingSlugs.includes(uniqueSlug) || isReservedSlug(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}
