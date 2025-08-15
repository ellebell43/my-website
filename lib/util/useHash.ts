'use client'
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export const useHash = () => {
  const params = useParams()
  const [hash, setHash] = useState("");

  useEffect(() => {
    if (typeof window !== undefined) setHash(window.location.hash);
    const onHashChange = () => {
      if (typeof window !== undefined) setHash(window.location.hash);
    };
    if (typeof window !== undefined) window.addEventListener('hashchange', onHashChange);
    return () => { if (typeof window !== undefined) window.removeEventListener('hashchange', onHashChange); }
  }, [params]);
  return hash;
};