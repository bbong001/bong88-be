import { v4 as uuidv4 } from 'uuid';

export function generateReferenceID(): string {
  const uuid = uuidv4();
  return uuid.replace(/-/g, '').slice(0, 20);
}
