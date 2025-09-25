// src/components/AddPage.jsx
import React, { useState, useEffect } from 'react';

const AddPackage = ({
  title = "Add Package",
  onSubmit = () => {},
  onCancel = () => {},
  initialData = {},
  loading = false,
  features = [
    { key: 'productCategories', label: 'Product and Categories', defaultChecked: true },
    { key: 'purchaseSale', label: 'Purchase and Sale', defaultChecked: true },
    { key: 'saleReturn', label: 'Sale Return', defaultChecked: false },
    { key: 'purchaseReturn', label: 'Purchase Return', defaultChecked: false },
    { key: 'expense', label: 'Expense', defaultChecked: false },
    { key: 'income', label: 'Income', defaultChecked: false },
    { key: 'stockTransfer', label: 'Stock Transfer', defaultChecked: false },
    { key: 'quotation', label: 'Quotation', defaultChecked: false },
    { key: 'productDelivery', label: 'Product Delivery', defaultChecked: false }
  ],
  showTrialOption = true,
  className = ""
}) => {
  const [formData, setFormData] = useState({
    name: '',
    monthlyFee: '',
    yearlyFee: '',
    isFree: false,
    isFreeTrial: true,
    warehouses: 0,
    products: 0,
    invoices: 0,
    userAccounts: 0,
    employees: 0,
    selectedFeatures: features.reduce((acc, feature) => {
      acc[feature.key] = feature.defaultChecked;
      return acc;
    }, {})
  });

  // ✅ Use useEffect to sync local state with the initialData prop
  useEffect(() => {
    // Check if initialData is not empty
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        name: initialData.name || '',
        monthlyFee: initialData.monthlyFee || '',
        yearlyFee: initialData.yearlyFee || '',
        isFree: initialData.isFree || false,
        isFreeTrial: initialData.isFreeTrial || true,
        warehouses: initialData.warehouses || 0,
        products: initialData.products || 0,
        invoices: initialData.invoices || 0,
        userAccounts: initialData.userAccounts || 0,
        employees: initialData.employees || 0,
        // Map features from the API to the local state
        selectedFeatures: features.reduce((acc, feature) => {
          acc[feature.key] = initialData.features?.includes(feature.key) || false;
          return acc;
        }, {})
      });
    }
  }, [initialData, features]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeatureChange = (featureKey, checked) => {
    setFormData(prev => ({
      ...prev,
      selectedFeatures: {
        ...prev.selectedFeatures,
        [featureKey]: checked
      }
    }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.name || !formData.monthlyFee || !formData.yearlyFee) {
      alert('Please fill in all required fields');
      return;
    }
    
    // ✅ Prepare data for API submission
    const dataToSubmit = {
      ...formData,
      features: Object.keys(formData.selectedFeatures).filter(key => formData.selectedFeatures[key]),
    };
    
    onSubmit(dataToSubmit);
  };

  const NumberInput = ({ label, field, placeholder = "0" }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 whitespace-nowrap">
        {label}
      </label>
      <input
        type="number"
        min="0"
        value={formData[field]}
        onChange={(e) => handleInputChange(field, parseInt(e.target.value) || 0)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <p className="text-xs text-gray-500">0 = Infinity</p>
    </div>
  );

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-sm text-gray-500 mt-2">
          The field labels marked with <span className="text-red-500">*</span> are required input fields.
        </p>
      </div>

      {/* Form */}
      <div className="p-6 space-y-6">
        {/* Package Name and Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter package name"
            />
          </div>

          {/* Monthly Fee */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Monthly Fee <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={formData.monthlyFee}
              onChange={(e) => handleInputChange('monthlyFee', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          {/* Yearly Fee */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Yearly Fee <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={formData.yearlyFee}
              onChange={(e) => handleInputChange('yearlyFee', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Package Type */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFree}
              onChange={(e) => handleInputChange('isFree', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Free</span>
          </label>

          {showTrialOption && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFreeTrial}
                onChange={(e) => handleInputChange('isFreeTrial', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Free Trial</span>
            </label>
          )}
        </div>

        {/* Limits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <NumberInput label="Number of Warehouses" field="warehouses" />
          <NumberInput label="Number of Products" field="products" />
          <NumberInput label="Number of Invoices" field="invoices" />
          <NumberInput label="Number of User Account" field="userAccounts" />
          <NumberInput label="Number of Employees" field="employees" />
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <label key={feature.key} className="flex items-center gap-3 cursor-pointer whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={formData.selectedFeatures[feature.key] || false}
                  onChange={(e) => handleFeatureChange(feature.key, e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{feature.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Package"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPackage;