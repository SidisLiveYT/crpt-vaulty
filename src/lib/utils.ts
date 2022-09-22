import { createHash } from "crypto";

export function encode(
  text: string,
  hash: string = "sha256",
  digest: any = "base64",
  length: number = 32
) {
  return createHash(hash).update(text).digest(digest).substring(0, length);
}
