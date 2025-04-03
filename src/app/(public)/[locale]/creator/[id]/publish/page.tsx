'use client';

import PublishContent from './_components/publish-content';
import { useExhibition } from '../../context/exhibition-provider';

export default function PublishPage() {
  const { exhibition } = useExhibition();
  
  return (
    <PublishContent exhibition={exhibition} />
  );
}