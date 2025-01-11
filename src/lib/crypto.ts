import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.SECRET_KEY ?? ""

// Function to encrypt and convert to a shorter hex format
export const encrypt = (text: string): string => {
  // Encrypt the text using AES encryption
  const encrypted = CryptoJS.AES.encrypt(text, SECRET_KEY).toString();

  // Convert the base64-encoded encrypted string to a shorter hex format
  const hex = CryptoJS.enc.Hex.stringify(CryptoJS.enc.Base64.parse(encrypted));

  // Use a shorter substring of the hex (e.g., first 16 characters)
  return hex
};

// Function to decrypt from the shorter hex format
export const decrypt = (hex: string): string => {
  // Pad the hex string if necessary (to ensure it's a valid length)
  const paddedHex = hex.padEnd(24, "0"); // Adjust padding length as needed

  // Convert the hex string back to the base64-encoded encrypted string
  const base64 = CryptoJS.enc.Hex.parse(paddedHex).toString(CryptoJS.enc.Base64);

  // Decrypt the encrypted string using AES decryption
  const decrypted = CryptoJS.AES.decrypt(base64, SECRET_KEY).toString(CryptoJS.enc.Utf8);

  return decrypted;
};