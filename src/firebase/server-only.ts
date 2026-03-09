import 'server-only';

// This file ensures firebase-admin is ONLY used on the server
// The 'server-only' package will throw an error if this is imported in client code

export { firestore } from './server';
export type { } from 'firebase-admin/firestore';
