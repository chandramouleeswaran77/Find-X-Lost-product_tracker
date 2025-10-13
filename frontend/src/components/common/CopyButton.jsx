import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const CopyButton = ({ text, children, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleCopy}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 ${
        copied
          ? 'bg-green-50 border-green-200 text-green-700'
          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
      } ${className}`}
    >
      {children}
      <span className="text-sm font-medium">
        {copied ? 'Copied!' : 'Copy'}
      </span>
    </motion.button>
  );
};

export default CopyButton;
