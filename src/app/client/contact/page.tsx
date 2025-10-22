import React from 'react';
import { enforceClientAccess } from '../../../lib/auth/enforceClientAccess';
import { ContactContent } from '../../contact/ContactContent';

export const metadata = { title: "Contact | Client View" };

export default async function ClientContactPage() {
  await enforceClientAccess('/client/contact');
  return <ContactContent />;
}
