import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const CreditRiskAnalyzer = () => {
  const [formData, setFormData] = useState({
    income: '',
    creditScore: '',
    employmentYears: '',
    debtToIncome: '',
    loanAmount: '',
    loanTerm: '36',
    loanPurpose: 'personal'
  });

  const [riskScore, setRiskScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const score = calculateRiskScore(formData);
      setRiskScore(score);
      setIsLoading(false);
    }, 1500);
  };

  const calculateRiskScore = (data) => {
    const creditScore = Math.max(0, parseInt(data.creditScore)); // Ensure non-negative
    const dti = Math.max(0, parseFloat(data.debtToIncome)); // Ensure non-negative
    const employmentYears = Math.max(0, parseInt(data.employmentYears)); // Ensure non-negative
    const loanAmount = Math.max(0, parseInt(data.loanAmount)); // Ensure non-negative

    const creditScoreWeight = (creditScore / 850) * 40;
    const dtiWeight = Math.max(0, (1 - dti / 100)) * 25;
    const employmentWeight = (Math.min(employmentYears, 10) / 10) * 20;
    const loanAmountWeight = Math.max(0, (1 - loanAmount / 100000)) * 15;

    return Math.round(Math.max(0, creditScoreWeight + dtiWeight + employmentWeight + loanAmountWeight));
};

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100 items-center justify-center">
        {/* Navbar */}
        <nav className="bg-blue-900 text-white shadow-lg w-full">
          <div className="container mx-auto px-4 py-3 flex justify-center">
            <div className="flex space-x-6 items-center">
              <span className="font-bold text-xl mr-8 p-2">Credit Risk Analyzer</span>
              <div className="flex gap-2 space-x-4 p-2">
                <Link to="/dashboard" className="hover:text-blue-200 ">Dashboard</Link>
                <Link to="/reports" className="hover:text-blue-200 ">Reports</Link>
                <Link to="/settings" className="hover:text-blue-200 ">Settings</Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow flex items-center m-6 justify-center w-full">
          <div className="w-full max-w-md">
            <div className="bg-white shadow-2xl rounded-xl p-8 text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Credit Risk Assessment</h1>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Credit Score</label>
                  <input 
                    type="number" 
                    name="creditScore" 
                    value={formData.creditScore} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Enter Credit Score (e.g., 720)" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Loan Amount</label>
                  <input 
                    type="number" 
                    name="loanAmount" 
                    value={formData.loanAmount} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Enter Loan Amount" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Debt to Income Ratio (%)</label>
                  <input 
                    type="number" 
                    name="debtToIncome" 
                    value={formData.debtToIncome} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Enter Debt to Income Ratio" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Employment Years</label>
                  <input 
                    type="number" 
                    name="employmentYears" 
                    value={formData.employmentYears} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Years of Employment" 
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  {isLoading ? 'Analyzing Risk...' : 'Calculate Risk Score'}
                </button>
              </form>

              {riskScore !== null && (
                <div className="mt-6 p-4 bg-blue-50 rounded-md">
                  <h2 className="text-xl font-bold text-gray-800">Risk Score</h2>
                  <p className={`text-3xl font-bold ${
                    riskScore > 70 ? 'text-green-600' : 
                    riskScore > 40 ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {riskScore}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {riskScore > 70 ? 'Low Risk' : 
                     riskScore > 40 ? 'Medium Risk' : 
                     'High Risk'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </Router>

  );
};

export default CreditRiskAnalyzer;
