import React, { createContext, useContext, useState, useEffect } from 'react';
import { getBranchesApi } from '../services/api';

const BranchContext = createContext();

export const BranchProvider = ({ children }) => {
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const { data } = await getBranchesApi();
      setBranches(data);
      if (data && data.length > 0 && !selectedBranchId) {
        setSelectedBranchId(data[0]._id);
      }
    } catch (error) {
      console.error('Failed to load gym branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedBranch = branches.find((b) => b._id === selectedBranchId) || branches[0] || null;

  return (
    <BranchContext.Provider value={{ branches, selectedBranchId, setSelectedBranchId, selectedBranch, fetchBranches, loading }}>
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => useContext(BranchContext);
