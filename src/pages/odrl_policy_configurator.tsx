import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Copy, Download, Upload, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';

const ODRLPolicyConfigurator = () => {
  const [policy, setPolicy] = useState({
    '@context': ['http://www.w3.org/ns/odrl.jsonld'],
    '@type': 'Agreement',
    uid: '',
    profile: '',
    assigner: '',
    assignee: '',
    target: '',
    permission: [],
    prohibition: [],
    obligation: []
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [validationErrors, setValidationErrors] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [savedPolicies, setSavedPolicies] = useState([]);

  // ODRL 2.2 predefined values
  const policyTypes = ['Agreement', 'Offer', 'Set'];
  const actions = [
    'use', 'modify', 'distribute', 'reproduce', 'display', 'execute', 'print',
    'play', 'present', 'read', 'sell', 'give', 'lend', 'move', 'duplicate',
    'delete', 'install', 'uninstall', 'extract', 'derive', 'index', 'annotate',
    'aggregate', 'anonymize', 'archive', 'attribute', 'compensate', 'concurrent',
    'ensure', 'include', 'inform', 'nextPolicy', 'obtainConsent', 'reviewPolicy',
    'textToSpeech', 'translate', 'watermark'
  ];

  const operators = [
    'eq', 'neq', 'lt', 'lteq', 'gt', 'gteq', 'isA', 'hasPart', 'isPartOf',
    'isAllOf', 'isAnyOf', 'isNoneOf'
  ];

  const leftOperands = [
    'dateTime', 'delayPeriod', 'deliveryChannel', 'elapsedTime', 'event',
    'industry', 'language', 'media', 'meteredTime', 'payAmount', 'percentage',
    'product', 'purpose', 'recipient', 'relativePosition', 'relativeSize',
    'relativeSpatial', 'relativeTime', 'resolution', 'spatial', 'systemDevice',
    'timeInterval', 'unitOfCount', 'version', 'virtualLocation'
  ];

  // Validation function
  const validatePolicy = () => {
    const errors = [];
    
    if (!policy.uid) errors.push('Policy UID is required');
    if (policy['@type'] === 'Agreement' && (!policy.assigner || !policy.assignee)) {
      errors.push('Agreement policies require both assigner and assignee');
    }
    if (policy['@type'] === 'Offer' && !policy.assigner) {
      errors.push('Offer policies require an assigner');
    }
    if (!policy.target) errors.push('Target is required');
    if (policy.permission.length === 0 && policy.prohibition.length === 0 && policy.obligation.length === 0) {
      errors.push('At least one permission, prohibition, or obligation is required');
    }

    // Validate rules
    [...policy.permission, ...policy.prohibition, ...policy.obligation].forEach((rule, index) => {
      if (!rule.action) errors.push(`Rule ${index + 1}: Action is required`);
      
      rule.constraint?.forEach((constraint, cIndex) => {
        if (!constraint.leftOperand) errors.push(`Rule ${index + 1}, Constraint ${cIndex + 1}: Left operand is required`);
        if (!constraint.operator) errors.push(`Rule ${index + 1}, Constraint ${cIndex + 1}: Operator is required`);
        if (!constraint.rightOperand) errors.push(`Rule ${index + 1}, Constraint ${cIndex + 1}: Right operand is required`);
      });
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Add rule functions
  const addRule = (ruleType) => {
    const newRule = {
      action: '',
      constraint: [],
      duty: ruleType === 'permission' ? [] : undefined
    };
    
    setPolicy(prev => ({
      ...prev,
      [ruleType]: [...prev[ruleType], newRule]
    }));
  };

  const removeRule = (ruleType, index) => {
    setPolicy(prev => ({
      ...prev,
      [ruleType]: prev[ruleType].filter((_, i) => i !== index)
    }));
  };

  const updateRule = (ruleType, index, field, value) => {
    setPolicy(prev => ({
      ...prev,
      [ruleType]: prev[ruleType].map((rule, i) => 
        i === index ? { ...rule, [field]: value } : rule
      )
    }));
  };

  // Constraint management
  const addConstraint = (ruleType, ruleIndex) => {
    const newConstraint = { leftOperand: '', operator: 'eq', rightOperand: '' };
    
    setPolicy(prev => ({
      ...prev,
      [ruleType]: prev[ruleType].map((rule, i) => 
        i === ruleIndex ? {
          ...rule,
          constraint: [...(rule.constraint || []), newConstraint]
        } : rule
      )
    }));
  };

  const updateConstraint = (ruleType, ruleIndex, constraintIndex, field, value) => {
    setPolicy(prev => ({
      ...prev,
      [ruleType]: prev[ruleType].map((rule, rIndex) => 
        rIndex === ruleIndex ? {
          ...rule,
          constraint: rule.constraint.map((constraint, cIndex) =>
            cIndex === constraintIndex ? { ...constraint, [field]: value } : constraint
          )
        } : rule
      )
    }));
  };

  const removeConstraint = (ruleType, ruleIndex, constraintIndex) => {
    setPolicy(prev => ({
      ...prev,
      [ruleType]: prev[ruleType].map((rule, rIndex) => 
        rIndex === ruleIndex ? {
          ...rule,
          constraint: rule.constraint.filter((_, cIndex) => cIndex !== constraintIndex)
        } : rule
      )
    }));
  };

  // File operations
  const exportPolicy = () => {
    const cleanPolicy = JSON.parse(JSON.stringify(policy));
    
    // Remove empty arrays and undefined values
    Object.keys(cleanPolicy).forEach(key => {
      if (Array.isArray(cleanPolicy[key]) && cleanPolicy[key].length === 0) {
        delete cleanPolicy[key];
      }
    });

    const blob = new Blob([JSON.stringify(cleanPolicy, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `odrl-policy-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const savePolicy = () => {
    if (validatePolicy()) {
      const savedPolicy = {
        id: Date.now(),
        name: policy.uid || `Policy-${Date.now()}`,
        policy: { ...policy },
        createdAt: new Date().toISOString()
      };
      setSavedPolicies(prev => [...prev, savedPolicy]);
    }
  };

  const loadPolicy = (savedPolicy) => {
    setPolicy(savedPolicy.policy);
  };

  // Component for rendering rules
  const RuleEditor = ({ ruleType, rules, title, color }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${color}`}>{title}</h3>
        <button
          onClick={() => addRule(ruleType)}
          className={`flex items-center gap-2 px-3 py-1 rounded-lg ${color.replace('text-', 'bg-').replace('-600', '-100')} ${color} hover:opacity-80 transition-all`}
        >
          <Plus size={16} />
          Add {title.slice(0, -1)}
        </button>
      </div>
      
      {rules.map((rule, ruleIndex) => (
        <div key={ruleIndex} className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Rule {ruleIndex + 1}</span>
            <button
              onClick={() => removeRule(ruleType, ruleIndex)}
              className="text-red-500 hover:bg-red-50 p-1 rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Action</label>
              <select
                value={rule.action}
                onChange={(e) => updateRule(ruleType, ruleIndex, 'action', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select action...</option>
                {actions.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Target (optional)</label>
              <input
                type="text"
                value={rule.target || ''}
                onChange={(e) => updateRule(ruleType, ruleIndex, 'target', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Specific target for this rule"
              />
            </div>
          </div>

          {/* Constraints */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Constraints</label>
              <button
                onClick={() => addConstraint(ruleType, ruleIndex)}
                className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-sm flex items-center gap-1"
              >
                <Plus size={14} />
                Add Constraint
              </button>
            </div>
            
            {(rule.constraint || []).map((constraint, constraintIndex) => (
              <div key={constraintIndex} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 p-3 bg-white rounded border">
                <select
                  value={constraint.leftOperand}
                  onChange={(e) => updateConstraint(ruleType, ruleIndex, constraintIndex, 'leftOperand', e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="">Left Operand</option>
                  {leftOperands.map(operand => (
                    <option key={operand} value={operand}>{operand}</option>
                  ))}
                </select>
                
                <select
                  value={constraint.operator}
                  onChange={(e) => updateConstraint(ruleType, ruleIndex, constraintIndex, 'operator', e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {operators.map(operator => (
                    <option key={operator} value={operator}>{operator}</option>
                  ))}
                </select>
                
                <input
                  type="text"
                  value={constraint.rightOperand}
                  onChange={(e) => updateConstraint(ruleType, ruleIndex, constraintIndex, 'rightOperand', e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                  placeholder="Right operand"
                />
                
                <button
                  onClick={() => removeConstraint(ruleType, ruleIndex, constraintIndex)}
                  className="text-red-500 hover:bg-red-50 p-1 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ODRL Policy Configurator</h1>
        <p className="text-gray-600">Create and manage ODRL 2.2 compliant policies for data rights management</p>
      </div>

      {/* Validation Status */}
      {validationErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="text-red-500" size={20} />
            <h3 className="font-semibold text-red-800">Validation Errors</h3>
          </div>
          <ul className="list-disc list-inside text-red-700 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
        <button
          onClick={() => validatePolicy()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Check size={16} />
          Validate
        </button>
        
        <button
          onClick={savePolicy}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Copy size={16} />
          Save Policy
        </button>
        
        <button
          onClick={exportPolicy}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Download size={16} />
          Export JSON
        </button>
        
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
          {showPreview ? 'Hide' : 'Show'} JSON
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Configuration */}
        <div className="lg:col-span-3">
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'basic', label: 'Basic Info' },
              { id: 'parties', label: 'Parties' },
              { id: 'permissions', label: 'Permissions' },
              { id: 'prohibitions', label: 'Prohibitions' },
              { id: 'obligations', label: 'Obligations' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Policy Type *</label>
                    <select
                      value={policy['@type']}
                      onChange={(e) => setPolicy(prev => ({ ...prev, '@type': e.target.value }))}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {policyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Policy UID *</label>
                    <input
                      type="text"
                      value={policy.uid}
                      onChange={(e) => setPolicy(prev => ({ ...prev, uid: e.target.value }))}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="http://example.com/policy/001"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Profile</label>
                    <input
                      type="text"
                      value={policy.profile}
                      onChange={(e) => setPolicy(prev => ({ ...prev, profile: e.target.value }))}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="http://example.com/profile"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Target *</label>
                    <input
                      type="text"
                      value={policy.target}
                      onChange={(e) => setPolicy(prev => ({ ...prev, target: e.target.value }))}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="http://example.com/asset"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'parties' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Policy Parties</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Assigner {policy['@type'] !== 'Set' && '*'}
                    </label>
                    <input
                      type="text"
                      value={policy.assigner}
                      onChange={(e) => setPolicy(prev => ({ ...prev, assigner: e.target.value }))}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="http://example.com/party/assigner"
                      disabled={policy['@type'] === 'Set'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Assignee {policy['@type'] === 'Agreement' && '*'}
                    </label>
                    <input
                      type="text"
                      value={policy.assignee}
                      onChange={(e) => setPolicy(prev => ({ ...prev, assignee: e.target.value }))}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="http://example.com/party/assignee"
                      disabled={policy['@type'] === 'Set'}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'permissions' && (
              <RuleEditor
                ruleType="permission"
                rules={policy.permission}
                title="Permissions"
                color="text-green-600"
              />
            )}

            {activeTab === 'prohibitions' && (
              <RuleEditor
                ruleType="prohibition"
                rules={policy.prohibition}
                title="Prohibitions"
                color="text-red-600"
              />
            )}

            {activeTab === 'obligations' && (
              <RuleEditor
                ruleType="obligation"
                rules={policy.obligation}
                title="Obligations"
                color="text-orange-600"
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Saved Policies */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Saved Policies</h3>
            {savedPolicies.length === 0 ? (
              <p className="text-gray-500 text-sm">No saved policies yet</p>
            ) : (
              <div className="space-y-2">
                {savedPolicies.slice(-5).map(saved => (
                  <div key={saved.id} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div>
                      <div className="font-medium text-sm">{saved.name}</div>
                      <div className="text-xs text-gray-500">{new Date(saved.createdAt).toLocaleDateString()}</div>
                    </div>
                    <button
                      onClick={() => loadPolicy(saved)}
                      className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                    >
                      <Upload size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3">Policy Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Permissions:</span>
                <span className="font-medium">{policy.permission.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Prohibitions:</span>
                <span className="font-medium">{policy.prohibition.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Obligations:</span>
                <span className="font-medium">{policy.obligation.length}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Total Rules:</span>
                <span>{policy.permission.length + policy.prohibition.length + policy.obligation.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* JSON Preview */}
      {showPreview && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">JSON Preview</h3>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(policy, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ODRLPolicyConfigurator;