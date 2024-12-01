import { type ClassValue, clsx } from "clsx";
import { useEffect, useState } from "react";
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

export function isValidUrl(url: string): boolean {
  const urlPattern =
    /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
  return urlPattern.test(url);
}

export function hexToRgba(hex: string, alpha = 1) {
  // Remove o # caso exista
  const cleanHex = hex.replace("#", "");
  // Divide a cor em componentes R, G, B
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Retorna no formato RGBA
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(secs).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

export const convertToSeconds = (hh: number, mm: number, ss: number) => {
  return hh * 3600 + mm * 60 + ss;
};

export const createUniqueIdGenerator = (min = 1, max = 1000000) => {
  const usedIds = new Set();

  const generateUniqueId = () => {
    if (usedIds.size >= max - min + 1) {
      throw new Error("Todos os IDs possíveis já foram gerados.");
    }

    let newId;
    do {
      newId = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (usedIds.has(newId));

    usedIds.add(newId);
    return newId;
  };

  return generateUniqueId;
};
