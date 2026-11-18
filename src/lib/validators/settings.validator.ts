import { isValidPhone } from "../order";

export function validateSettingsInput(input: { storeName: string; whatsappNumber: string }): string | null {
  if (!input.storeName.trim()) {
    return "El nombre de la tienda es obligatorio.";
  }
  if (input.whatsappNumber && !isValidPhone(input.whatsappNumber)) {
    return "El número de WhatsApp necesita al menos 8 dígitos, con código de país (ej. 5493812345678).";
  }
  return null;
}

export function validateAdminPassword(password: string): string | null {
  if (password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }
  return null;
}
