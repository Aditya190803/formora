/**
 * Enterprise Service
 * Manages SSO, custom domains, white-label branding, API keys
 */

import { SSOConfig, CustomDomain, WhiteLabelBranding, ApiKey } from '@/lib/types-extended';

export class EnterpriseService {
  /**
   * Create SSO config (SAML)
   */
  static createSAMLConfig(
    teamId: string,
    entityId: string,
    ssoUrl: string,
    certificate: string
  ): SSOConfig {
    return {
      id: `sso_${Date.now()}`,
      teamId,
      provider: 'saml',
      isActive: true,
      entityId,
      ssoUrl,
      certificate,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Create SSO config (OIDC)
   */
  static createOIDCConfig(
    teamId: string,
    clientId: string,
    clientSecret: string,
    discoveryUrl: string
  ): SSOConfig {
    return {
      id: `sso_${Date.now()}`,
      teamId,
      provider: 'oidc',
      isActive: true,
      clientId,
      clientSecret,
      discoveryUrl,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Create custom domain
   */
  static createCustomDomain(teamId: string, domain: string): CustomDomain {
    const verificationToken = this.generateVerificationToken();
    return {
      id: `domain_${Date.now()}`,
      teamId,
      domain,
      isVerified: false,
      verificationToken,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Verify custom domain
   */
  static async verifyCustomDomain(domain: string, verificationToken: string): Promise<boolean> {
    try {
      const response = await fetch(`https://${domain}/.well-known/formora-verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${verificationToken}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Generate verification token
   */
  private static generateVerificationToken(): string {
    return `formora_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create white-label branding
   */
  static createWhiteLabelBranding(teamId: string): WhiteLabelBranding {
    return {
      id: `branding_${Date.now()}`,
      teamId,
      primaryColor: '#3b82f6',
      secondaryColor: '#1e40af',
    };
  }

  /**
   * Generate API key
   */
  static generateApiKey(teamId: string, name: string): ApiKey {
    const key = this.generateRandomKey();
    return {
      id: `key_${Date.now()}`,
      teamId,
      name,
      key,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Generate random API key
   */
  private static generateRandomKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'sk_';
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }

  /**
   * Validate API key
   */
  static validateApiKey(key: string): boolean {
    // Check format
    if (!key.startsWith('sk_')) return false;
    // Check length (sk_ + 32 chars)
    if (key.length !== 35) return false;
    return true;
  }

  /**
   * Revoke API key
   */
  static revokeApiKey(keys: ApiKey[], keyId: string): ApiKey[] {
    return keys.filter(k => k.id !== keyId);
  }
}
