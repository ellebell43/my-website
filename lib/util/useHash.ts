// useHash.js
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export const useHash = () => {
  const params = useParams()
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [params]);
  return hash;
};