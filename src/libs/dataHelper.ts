export function isValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return key in object
}

// 若是片假名，統一轉成平假名
export function toHiragana(str: string): string {
  return str.replace(/[\u30a1-\u30f6]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60))
}

// 日文關鍵字正規化
export function normalizeJa(str: string): string {
  return toHiragana(str).toLowerCase()
}
