#!/usr/bin/env node
/**
 * Creates a production test-lead token on YOUR machine.
 *   node scripts/make-lead-test-token.mjs
 * - Keep the TOKEN in your password manager; pass it to scripts/verify-production.mjs as LEAD_TEST_TOKEN.
 * - Put only the HASH in Vercel → highland-cabinetry → Settings → Environment Variables → Production:
 *   LEAD_TEST_TOKEN_SHA256 = <hash>. The hash is not a secret; the token never needs to be stored on the server.
 */
import { createHash, randomBytes } from "node:crypto";
const token = randomBytes(24).toString("base64url");
console.log(`TOKEN (keep secret):            ${token}`);
console.log(`LEAD_TEST_TOKEN_SHA256 (Vercel): ${createHash("sha256").update(token).digest("hex")}`);
