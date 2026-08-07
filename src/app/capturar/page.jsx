'use client';

import { useEffect, useState } from 'react';
import TreeCapture from '@/components/TreeCapture';

export default function CapturarPage() {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [captureComplete, setCaptureComplete] = useState(false);

  useEffect(() => {
    fetch('/api/trees')
      .then(r => r.json())
      .then(data => {
        setTrees(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading trees:', err);
        setLoading(false);
      });
  }, []);

  const handleCaptureComplete = (result) => {
    console.log('Capture complete:', result);
    setCaptureComplete(true);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', color: 'var(--t3)' 
      }}>
        Cargando arboles...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <TreeCapture 
        trees={trees} 
        onCaptureComplete={handleCaptureComplete} 
      />
    </div>
  );
}
