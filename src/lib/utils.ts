import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomNumber() {
  // Gera um número de dígitos aleatório entre 3 e 6
  const digitCount = Math.floor(Math.random() * 4) + 3;

  // Calcula o menor e maior número com o número de dígitos determinado
  const min = Math.pow(10, digitCount - 1);
  const max = Math.pow(10, digitCount) - 1;

  // Gera um número aleatório entre o mínimo e o máximo
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  return randomNumber;
}
