import React from 'react';
import { enforceClientAccess } from '../../../lib/auth/enforceClientAccess';
import { AboutContent } from '../../about/AboutContent';

export const metadata = { title: "About | Client View" };

export default async function ClientAboutPage() {
  await enforceClientAccess('/client/about');
  return <AboutContent />;
}
