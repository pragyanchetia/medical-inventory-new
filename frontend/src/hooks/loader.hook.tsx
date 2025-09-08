'use client'
import { useState, useEffect } from 'react';

const useLoading = () => {
    const duration = 300;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  
  return isLoading;
};

export default useLoading;
