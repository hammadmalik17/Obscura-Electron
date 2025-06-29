// // Vault Management Module
// class VaultManager {
//     constructor() {
//         this.entries = [];
//         this.filteredEntries = [];
//         this.currentFilter = { type: 'all', category: 'all', search: '' };
        
//         this.initializeEventListeners();
//         this.setupSampleData(); // For demo purposes
//     }
    
//     initializeEventListeners() {
//         // Search functionality
//         const searchInput = document.getElementById('search-input');
//         if (searchInput) {
//             searchInput.addEventListener('input', (e) => {
//                 this.currentFilter.search = e.target.value.toLowerCase();
//                 this.filterAndDisplayEntries();
//             });
//         }
        
//         // Filter functionality
//         const typeFilter = document.getElementById('type-filter');
//         if (typeFilter) {
//             typeFilter.addEventListener('change', (e) => {
//                 this.currentFilter.type = e.target.value;
//                 this.filterAndDisplayEntries();
//             });
//         }
        
//         const categoryFilter = document.getElementById('category-filter');
//         if (categoryFilter) {
//             categoryFilter.addEventListener('change', (e) => {
//                 this.currentFilter.category = e.target.value;
//                 this.filterAndDisplayEntries();
//             });
//         }
        
//         // Add entry buttons
//         const addButtons = document.querySelectorAll('.add-btn');
//         addButtons.forEach(btn => {
//             btn.addEventListener('click', (e) => {
//                 const entryType = e.target.getAttribute('data-type');
//                 this.showAddEntryModal(entryType);
//             });
//         });
//     }
    
//     setupSampleData() {
//         // Sample data for demonstration
//         this.entries = [
//             {
//                 id: '1',
//                 name: 'OpenAI GPT-4 API',
//                 type: 'api_key',
//                 category: 'OpenAI',
//                 data: {
//                     key: 'sk-proj-demo1234567890abcdefghijklmnopqrstuvwxyz'
//                 },
//                 description: 'Main GPT-4 API key for development',
//                 created: '2024-01-15 10:30',
//                 lastUsed: '2025-01-15 14:22',
//                 usageCount: 15
//             },
//             {
//                 id: '2',
//                 name: 'SBI Bank Login',
//                 type: 'bank_details',
//                 category: 'SBI Bank',
//                 data: {
//                     bankName: 'State Bank of India',
//                     accountNumber: '1234567890123456',
//                     ifscCode: 'SBIN0001234',
//                     username: 'hammad_malik',
//                     loginPassword: 'SecureBank123!',
//                     transactionPassword: 'TXN456',
//                     profilePassword: 'Profile789',
//                     upiPin: '1234',
//                     mobile: '9876543210'
//                 },
//                 description: 'Primary SBI account for salary',
//                 created: '2024-02-01 09:15',
//                 lastUsed: 'Never',
//                 usageCount: 0
//             },
//             {
//                 id: '3',
//                 name: 'GitHub Personal Token',
//                 type: 'api_key',
//                 category: 'GitHub',
//                 data: {
//                     key: 'ghp_demotoken1234567890abcdefghijklmnop'
//                 },
//                 description: 'Personal access token for repositories',
//                 created: '2024-03-10 11:20',
//                 lastUsed: '2025-01-10 16:45',
//                 usageCount: 8
//             },
//             {
//                 id: '4',
//                 name: 'HDFC Debit Card',
//                 type: 'debit_card',
//                 category: 'HDFC Bank',
//                 data: {
//                     bank: 'HDFC Bank',
//                     number: '4532123456789012',
//                     expMonth: '12',
//                     expYear: '2027',
//                     pin: '9876',
//                     holderName: 'Hammad Malik'
//                 },
//                 description: 'Primary debit card for daily expenses',
//                 created: '2024-04-05 14:00',
//                 lastUsed: '2025-01-14 10:30',
//                 usageCount: 25
//             }
//         ];
        
//         this.filterAndDisplayEntries();
//     }
    
//     async loadEntries() {
//         // In a real implementation, this would load from the Python backend
//         console.log('Loading entries from vault...');
        
//         try {
//             // For now, use sample data
//             this.filterAndDisplayEntries();
//             this.updateStats();
            
//         } catch (error) {
//             console.error('Failed to load entries:', error);
//             this.showToast('Failed to load vault entries', 'error');
//         }
//     }
    
//     filterAndDisplayEntries() {
//         const { type, category, search } = this.currentFilter;
        
//         this.filteredEntries = this.entries.filter(entry => {
//             // Type filter
//             if (type !== 'all' && entry.type !== type) {
//                 return false;
//             }
            
//             // Category filter  
//             if (category !== 'all' && entry.category !== category) {
//                 return false;
//             }
            
//             // Search filter
//             if (search && !entry.name.toLowerCase().includes(search) && 
//                 !entry.description.toLowerCase().includes(search)) {
//                 return false;
//             }
            
//             return true;
//         });
        
//         this.displayEntries();
//         this.updateStats();
//     }
    
//     displayEntries() {
//         const container = document.getElementById('entries-container');
//         if (!container) return;
        
//         container.innerHTML = '';
        
//         if (this.filteredEntries.length === 0) {
//             this.showEmptyState(container);
//             return;
//         }
        
//         this.filteredEntries.forEach(entry => {
//             const entryCard = this.createEntryCard(entry);
//             container.appendChild(entryCard);
//         });
//     }
    
//     createEntryCard(entry) {
//         const card = document.createElement('div');
//         card.className = 'entry-card';
//         card.setAttribute('data-entry-id', entry.id);
        
//         const typeIcons = {
//             'api_key': '🔑',
//             'password': '🔒',
//             'credit_card': '💳',
//             'debit_card': '💰',
//             'bank_details': '🏦',
//             'secure_note': '📝'
//         };
        
//         const typeNames = {
//             'api_key': 'API Key',
//             'password': 'Password',
//             'credit_card': 'Credit Card',
//             'debit_card': 'Debit Card',
//             'bank_details': 'Bank Details',
//             'secure_note': 'Secure Note'
//         };
        
//         const maskedData = this.getMaskedData(entry);
        
//         card.innerHTML = `
//             <div class="entry-header">
//                 <div class="entry-type">
//                     ${typeIcons[entry.type]} ${typeNames[entry.type]}
//                 </div>
//                 <div class="entry-category" style="color: ${this.getCategoryColor(entry.category)}">
//                     📁 ${entry.category}
//                 </div>
//             </div>
            
//             <div class="entry-name">${entry.name}</div>
            
//             <div class="entry-info">
//                 🔐 ${maskedData}
//             </div>
            
//             <div class="entry-actions">
//                 <button class="action-btn copy" onclick="window.vaultManager.copyEntry('${entry.id}')" title="Copy to clipboard">
//                     📋
//                 </button>
//                 <button class="action-btn edit" onclick="window.vaultManager.editEntry('${entry.id}')" title="Edit entry">
//                     ✏️
//                 </button>
//                 <button class="action-btn delete" onclick="window.vaultManager.deleteEntry('${entry.id}')" title="Delete entry">
//                     🗑️
//                 </button>
//             </div>
            
//             <div class="entry-meta">
//                 <span>Created: ${entry.created}</span>
//                 <span>Last used: ${entry.lastUsed}</span>
//             </div>
            
//             ${entry.description ? `<div class="entry-description">${entry.description}</div>` : ''}
//         `;
        
//         return card;
//     }
    
//     getMaskedData(entry) {
//         const { type, data } = entry;
        
//         switch (type) {
//             case 'api_key':
//                 const key = data.key || '';
//                 return key.length > 12 ? `${key.substring(0, 8)}...${key.substring(key.length - 4)}` : '●'.repeat(key.length);
                
//             case 'password':
//                 return `${data.username || 'user'}@${data.website || 'website'}`;
                
//             case 'credit_card':
//             case 'debit_card':
//                 const number = data.number || '';
//                 return number.length >= 4 ? `****-****-****-${number.substring(number.length - 4)}` : '****-****-****-****';
                
//             case 'bank_details':
//                 const account = data.accountNumber || '';
//                 return `${data.bankName || 'Bank'}: ****${account.substring(account.length - 4)}`;
                
//             case 'secure_note':
//                 return 'Encrypted Note Content';
                
//             default:
//                 return 'Encrypted Data';
//         }
//     }
    
//     getCategoryColor(category) {
//         const colors = {
//             'OpenAI': '#10a37f',
//             'Google': '#4285f4',
//             'GitHub': '#24292e',
//             'SBI Bank': '#1976d2',
//             'HDFC Bank': '#e53935',
//             'ICICI Bank': '#ff5722',
//             'Axis Bank': '#9c27b0',
//             'Banking': '#2e7d32',
//             'Personal': '#d32f2f',
//             'Work': '#7b1fa2'
//         };
//         return colors[category] || '#6b7280';
//     }
    
//     showEmptyState(container) {
//         container.innerHTML = `
//             <div class="loading-state">
//                 <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
//                 <h3>No entries found</h3>
//                 <p>Try adjusting your search or add a new entry</p>
//             </div>
//         `;
//     }
    
//     async copyEntry(entryId) {
//         const entry = this.entries.find(e => e.id === entryId);
//         if (!entry) return;
        
//         try {
//             const dataToCopy = this.getDataToCopy(entry);
            
//             // Use the Clipboard API
//             await navigator.clipboard.writeText(dataToCopy);
            
//             // Update last used
//             entry.lastUsed = new Date().toLocaleString();
//             entry.usageCount++;
            
//             this.showToast(`${entry.type.replace('_', ' ')} copied to clipboard! 📋`, 'success');
//             this.displayEntries(); // Refresh to show updated last used
            
//             // Auto-clear clipboard after 30 seconds
//             setTimeout(async () => {
//                 try {
//                     await navigator.clipboard.writeText('');
//                     this.showToast('Clipboard cleared for security 🗑️', 'info');
//                 } catch (error) {
//                     console.log('Could not clear clipboard:', error);
//                 }
//             }, 30000);
            
//         } catch (error) {
//             console.error('Failed to copy to clipboard:', error);
//             this.showToast('Failed to copy to clipboard', 'error');
//         }
//     }
    
//     getDataToCopy(entry) {
//         const { type, data } = entry;
        
//         switch (type) {
//             case 'api_key':
//                 return data.key;
//             case 'password':
//                 return data.password;
//             case 'debit_card':
//                 return data.pin;
//             case 'credit_card':
//                 return data.number;
//             case 'bank_details':
//                 return data.loginPassword;
//             case 'secure_note':
//                 return data.content;
//             default:
//                 return JSON.stringify(data);
//         }
//     }
    
//     editEntry(entryId) {
//         const entry = this.entries.find(e => e.id === entryId);
//         if (!entry) return;
        
//         this.showAddEntryModal(entry.type, entry);
//     }
    
//     deleteEntry(entryId) {
//         const entry = this.entries.find(e => e.id === entryId);
//         if (!entry) return;
        
//         if (confirm(`Are you sure you want to permanently delete "${entry.name}"?\n\nThis action cannot be undone.`)) {
//             this.entries = this.entries.filter(e => e.id !== entryId);
//             this.filterAndDisplayEntries();
//             this.showToast(`${entry.name} deleted securely 🔥`, 'success');
//         }
//     }
    
//     showAddEntryModal(entryType, existingEntry = null) {
//         const modal = document.getElementById('add-entry-modal');
//         const modalTitle = document.getElementById('modal-title');
//         const modalBody = modal.querySelector('.modal-body');
        
//         if (!modal || !modalTitle || !modalBody) return;
        
//         const action = existingEntry ? 'Edit' : 'Add';
//         const typeName = entryType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        
//         modalTitle.textContent = `${action} ${typeName}`;
        
//         // Create form based on entry type
//         modalBody.innerHTML = this.createEntryForm(entryType, existingEntry);
        
//         // Show modal
//         modal.classList.add('active');
        
//         // Setup modal event listeners
//         this.setupModalEventListeners(modal, entryType, existingEntry);
//     }
    
//     createEntryForm(entryType, existingEntry) {
//         const data = existingEntry?.data || {};
        
//         let formHTML = `
//             <form id="entry-form">
//                 <div class="form-group">
//                     <label class="form-label">🏷️ Name</label>
//                     <input type="text" name="name" class="form-input" placeholder="Enter ${entryType.replace('_', ' ')} name" value="${existingEntry?.name || ''}" required>
//                 </div>
                
//                 <div class="form-group">
//                     <label class="form-label">📁 Category</label>
//                     <select name="category" class="form-select">
//                         <option value="OpenAI" ${existingEntry?.category === 'OpenAI' ? 'selected' : ''}>OpenAI</option>
//                         <option value="Google" ${existingEntry?.category === 'Google' ? 'selected' : ''}>Google</option>
//                         <option value="GitHub" ${existingEntry?.category === 'GitHub' ? 'selected' : ''}>GitHub</option>
//                         <option value="SBI Bank" ${existingEntry?.category === 'SBI Bank' ? 'selected' : ''}>SBI Bank</option>
//                         <option value="HDFC Bank" ${existingEntry?.category === 'HDFC Bank' ? 'selected' : ''}>HDFC Bank</option>
//                         <option value="ICICI Bank" ${existingEntry?.category === 'ICICI Bank' ? 'selected' : ''}>ICICI Bank</option>
//                         <option value="Banking" ${existingEntry?.category === 'Banking' ? 'selected' : ''}>Banking</option>
//                         <option value="Personal" ${existingEntry?.category === 'Personal' ? 'selected' : ''}>Personal</option>
//                         <option value="Work" ${existingEntry?.category === 'Work' ? 'selected' : ''}>Work</option>
//                         <option value="Other" ${existingEntry?.category === 'Other' ? 'selected' : ''}>Other</option>
//                     </select>
//                 </div>
//         `;
        
//         // Add type-specific fields
//         switch (entryType) {
//             case 'api_key':
//                 formHTML += `
//                     <div class="form-group">
//                         <label class="form-label">🔑 API Key</label>
//                         <input type="password" name="key" class="form-input" placeholder="Enter API key" value="${data.key || ''}" required>
//                     </div>
//                 `;
//                 break;
                
//             case 'password':
//                 formHTML += `
//                     <div class="form-group">
//                         <label class="form-label">🌐 Website/Service</label>
//                         <input type="text" name="website" class="form-input" placeholder="https://example.com" value="${data.website || ''}">
//                     </div>
//                     <div class="form-group">
//                         <label class="form-label">👤 Username</label>
//                         <input type="text" name="username" class="form-input" placeholder="Username" value="${data.username || ''}">
//                     </div>
//                     <div class="form-group">
//                         <label class="form-label">🔒 Password</label>
//                         <input type="password" name="password" class="form-input" placeholder="Password" value="${data.password || ''}" required>
//                     </div>
//                 `;
//                 break;
                
//             case 'debit_card':
//                 formHTML += `
//                     <div class="form-group">
//                         <label class="form-label">🏦 Bank Name</label>
//                         <input type="text" name="bank" class="form-input" placeholder="e.g., State Bank of India" value="${data.bank || ''}">
//                     </div>
//                     <div class="form-group">
//                         <label class="form-label">💰 Card Number</label>
//                         <input type="password" name="number" class="form-input" placeholder="1234 5678 9012 3456" value="${data.number || ''}" required>
//                     </div>
//                     <div class="form-row">
//                         <div class="form-group">
//                             <label class="form-label">📅 Expiry Month</label>
//                             <select name="expMonth" class="form-select">
//                                 ${Array.from({length: 12}, (_, i) => {
//                                     const month = (i + 1).toString().padStart(2, '0');
//                                     return `<option value="${month}" ${data.expMonth === month ? 'selected' : ''}>${month}</option>`;
//                                 }).join('')}
//                             </select>
//                         </div>
//                         <div class="form-group">
//                             <label class="form-label">📅 Expiry Year</label>
//                             <select name="expYear" class="form-select">
//                                 ${Array.from({length: 15}, (_, i) => {
//                                     const year = (new Date().getFullYear() + i).toString();
//                                     return `<option value="${year}" ${data.expYear === year ? 'selected' : ''}>${year}</option>`;
//                                 }).join('')}
//                             </select>
//                         </div>
//                     </div>
//                     <div class="form-group">
//                         <label class="form-label">🔢 PIN</label>
//                         <input type="password" name="pin" class="form-input" placeholder="4-digit PIN" value="${data.pin || ''}" required>
//                     </div>
//                     <div class="form-group">
//                         <label class="form-label">🏪 Cardholder Name</label>
//                         <input type="text" name="holderName" class="form-input" placeholder="Name as on card" value="${data.holderName || ''}">
//                     </div>
//                 `;
//                 break;
                
//             case 'bank_details':
//                 formHTML += `
//                     <div class="form-group">
//                         <label class="form-label">🏦 Bank Name</label>
//                         <input type="text" name="bankName" class="form-input" placeholder="e.g., State Bank of India" value="${data.bankName || ''}" required>
//                     </div>
//                     <div class="form-group">
//                         <label class="form-label">🔢 Account Number</label>
//                         <input type="password" name="accountNumber" class="form-input" placeholder="Account Number" value="${data.accountNumber || ''}" required>
//                     </div>
//                     <div class="form-group">
//                         <label class="form-label">🏧 IFSC Code</label>
//                         <input type="text" name="ifscCode" class="form-input" placeholder="e.g., SBIN0001234" value="${data.ifscCode || ''}">
//                     </div>
//                     <div class="form-group">
//                         <label class="form-label">👤 Username/Customer ID</label>
//                         <input type="text" name="username" class="form-input" placeholder="Net Banking Username" value="${data.username || ''}">
//                     </div>
//                     <div class="form-group">
//                         <label class="form-label">🔒 Login Password</label>
//                         <input type="password" name="loginPassword" class="form-input" placeholder="Net Banking Password" value="${data.loginPassword || ''}">
//                     </div>
//                     <div class="form-group">
//                         <label class="form-label">📱 Transaction Password/MPIN</label>
//                         <input type="password" name="transactionPassword" class="form-input" placeholder="Transaction Password" value="${data.transactionPassword || ''}">
//                     </div>
//                     <div class="form-group">
//                         <label class="form-label">🔐 Profile Password</label>
//                         <input type="password" name="profilePassword" class="form-input" placeholder="SBI Profile Password, etc." value="${data.profilePassword || ''}">
//                     </div>
//                     <div class="form-row">
//                         <div class="form-group">
//                             <label class="form-label">🆔 UPI PIN</label>
//                             <input type="password" name="upiPin" class="form-input" placeholder="4-6 digit UPI PIN" value="${data.upiPin || ''}">
//                         </div>
//                         <div class="form-group">
//                             <label class="form-label">📞 Mobile</label>
//                             <input type="text" name="mobile" class="form-input" placeholder="Registered mobile" value="${data.mobile || ''}">
//                         </div>
//                     </div>
//                 `;
//                 break;
                
//             case 'secure_note':
//                 formHTML += `
//                     <div class="form-group">
//                         <label class="form-label">📝 Secure Content</label>
//                         <textarea name="content" class="form-textarea" placeholder="Enter your secure note content" required>${data.content || ''}</textarea>
//                     </div>
//                 `;
//                 break;
//         }
        
//         formHTML += `
//             <div class="form-group">
//                 <label class="form-label">📝 Description (Optional)</label>
//                 <textarea name="description" class="form-textarea" placeholder="Additional notes about this entry">${existingEntry?.description || ''}</textarea>
//             </div>
//         </form>
//         `;
        
//         return formHTML;
//     }
    
//     setupModalEventListeners(modal, entryType, existingEntry) {
//         const closeBtn = modal.querySelector('.modal-close');
//         const cancelBtn = modal.querySelector('#cancel-btn');
//         const saveBtn = modal.querySelector('#save-btn');
//         const form = modal.querySelector('#entry-form');
        
//         // Close modal events
//         const closeModal = () => {
//             modal.classList.remove('active');
//         };
        
//         closeBtn?.addEventListener('click', closeModal);
//         cancelBtn?.addEventListener('click', closeModal);
        
//         // Click outside to close
//         modal.addEventListener('click', (e) => {
//             if (e.target === modal) {
//                 closeModal();
//             }
//         });
        
//         // Form submission
//         const handleSubmit = (e) => {
//             e.preventDefault();
//             this.saveEntry(entryType, existingEntry, closeModal);
//         };
        
//         form?.addEventListener('submit', handleSubmit);
//         saveBtn?.addEventListener('click', handleSubmit);
//     }
    
//     saveEntry(entryType, existingEntry, closeModal) {
//         const form = document.getElementById('entry-form');
//         if (!form) return;
        
//         const formData = new FormData(form);
//         const entryData = {};
        
//         // Get form data
//         for (let [key, value] of formData.entries()) {
//             entryData[key] = value.trim();
//         }
        
//         // Validate required fields
//         if (!entryData.name) {
//             this.showToast('Name is required!', 'error');
//             return;
//         }
        
//         // Create entry object
//         const entry = {
//             id: existingEntry?.id || Date.now().toString(),
//             name: entryData.name,
//             type: entryType,
//             category: entryData.category || 'Other',
//             description: entryData.description || '',
//             created: existingEntry?.created || new Date().toLocaleString(),
//             lastUsed: existingEntry?.lastUsed || 'Never',
//             usageCount: existingEntry?.usageCount || 0,
//             data: this.extractEntryData(entryType, entryData)
//         };
        
//         // Save entry
//         if (existingEntry) {
//             // Update existing entry
//             const index = this.entries.findIndex(e => e.id === existingEntry.id);
//             if (index !== -1) {
//                 this.entries[index] = entry;
//                 this.showToast(`${entry.name} updated successfully! 🔐`, 'success');
//             }
//         } else {
//             // Add new entry
//             this.entries.push(entry);
//             this.showToast(`${entry.name} added successfully! 🔐`, 'success');
//         }
        
//         // Refresh display and close modal
//         this.filterAndDisplayEntries();
//         closeModal();
//     }
    
//     extractEntryData(entryType, formData) {
//         const data = {};
        
//         switch (entryType) {
//             case 'api_key':
//                 data.key = formData.key;
//                 break;
                
//             case 'password':
//                 data.website = formData.website;
//                 data.username = formData.username;
//                 data.password = formData.password;
//                 break;
                
//             case 'debit_card':
//                 data.bank = formData.bank;
//                 data.number = formData.number;
//                 data.expMonth = formData.expMonth;
//                 data.expYear = formData.expYear;
//                 data.pin = formData.pin;
//                 data.holderName = formData.holderName;
//                 break;
                
//             case 'bank_details':
//                 data.bankName = formData.bankName;
//                 data.accountNumber = formData.accountNumber;
//                 data.ifscCode = formData.ifscCode;
//                 data.username = formData.username;
//                 data.loginPassword = formData.loginPassword;
//                 data.transactionPassword = formData.transactionPassword;
//                 data.profilePassword = formData.profilePassword;
//                 data.upiPin = formData.upiPin;
//                 data.mobile = formData.mobile;
//                 break;
                
//             case 'secure_note':
//                 data.content = formData.content;
//                 break;
//         }
        
//         return data;
//     }
    
//     updateStats() {
//         const entryCountElement = document.getElementById('entry-count');
//         if (entryCountElement) {
//             const total = this.entries.length;
//             const filtered = this.filteredEntries.length;
            
//             if (total === filtered) {
//                 entryCountElement.textContent = `${total} encrypted entries`;
//             } else {
//                 entryCountElement.textContent = `${filtered} of ${total} entries`;
//             }
//         }
//     }
    
//     clearData() {
//         this.entries = [];
//         this.filteredEntries = [];
//         this.displayEntries();
//         this.updateStats();
//     }
    
//     showToast(message, type = 'info') {
//         if (window.authManager) {
//             window.authManager.showToast(message, type);
//         }
//     }
// }

// // Initialize vault manager when DOM is loaded
// document.addEventListener('DOMContentLoaded', () => {
//     window.vaultManager = new VaultManager();
// });


// Vault Management Module with Real Python Backend Integration
class VaultManager {
    constructor() {
        this.entries = [];
        this.filteredEntries = [];
        this.currentFilter = { type: 'all', category: 'all', search: '' };
        this.isElectron = typeof require !== 'undefined';
        
        this.initializeEventListeners();
        
        if (!this.isElectron) {
            console.log('⚠️ Not in Electron environment, loading demo data');
            this.setupSampleData();
        }
    }
    
    initializeEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilter.search = e.target.value.toLowerCase();
                this.filterAndDisplayEntries();
            });
        }
        
        // Filter functionality
        const typeFilter = document.getElementById('type-filter');
        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                this.currentFilter.type = e.target.value;
                this.filterAndDisplayEntries();
            });
        }
        
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilter.category = e.target.value;
                this.filterAndDisplayEntries();
            });
        }
        
        // Add entry buttons
        const addButtons = document.querySelectorAll('.add-btn');
        addButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const entryType = e.target.getAttribute('data-type');
                this.showAddEntryModal(entryType);
            });
        });
    }
    
    async loadEntries() {
        console.log('📂 Loading vault entries...');
        
        try {
            if (this.isElectron) {
                const { ipcRenderer } = require('electron');
                const result = await ipcRenderer.invoke('vault-list-entries');
                
                if (result.success) {
                    this.entries = result.data || [];
                    console.log(`✅ Loaded ${this.entries.length} entries from vault`);
                } else {
                    throw new Error(result.error || 'Failed to load entries');
                }
            } else {
                // Fallback to demo data
                this.setupSampleData();
                return;
            }
            
            this.filterAndDisplayEntries();
            this.updateStats();
            
        } catch (error) {
            console.error('❌ Failed to load entries:', error);
            this.showToast('Failed to load vault entries: ' + error.message, 'error');
            
            // Show empty state
            this.entries = [];
            this.filterAndDisplayEntries();
        }
    }
    
    setupSampleData() {
        // Sample data for demonstration when not in Electron
        this.entries = [
            {
                id: '1',
                name: 'OpenAI GPT-4 API',
                type: 'api_key',
                category: 'OpenAI',
                data: {
                    key: 'sk-proj-demo1234567890abcdefghijklmnopqrstuvwxyz'
                },
                description: 'Main GPT-4 API key for development',
                created: '2024-01-15 10:30',
                lastUsed: '2025-01-15 14:22',
                usageCount: 15
            },
            {
                id: '2',
                name: 'SBI Bank Login',
                type: 'bank_details',
                category: 'SBI Bank',
                data: {
                    bankName: 'State Bank of India',
                    accountNumber: '1234567890123456',
                    ifscCode: 'SBIN0001234',
                    username: 'hammad_malik',
                    loginPassword: 'SecureBank123!',
                    transactionPassword: 'TXN456',
                    profilePassword: 'Profile789',
                    upiPin: '1234',
                    mobile: '9876543210'
                },
                description: 'Primary SBI account for salary',
                created: '2024-02-01 09:15',
                lastUsed: 'Never',
                usageCount: 0
            }
        ];
        
        this.filterAndDisplayEntries();
        this.updateStats();
    }
    
    filterAndDisplayEntries() {
        const { type, category, search } = this.currentFilter;
        
        this.filteredEntries = this.entries.filter(entry => {
            // Type filter
            if (type !== 'all' && entry.type !== type) {
                return false;
            }
            
            // Category filter  
            if (category !== 'all' && entry.category !== category) {
                return false;
            }
            
            // Search filter
            if (search && !entry.name.toLowerCase().includes(search) && 
                !entry.description.toLowerCase().includes(search)) {
                return false;
            }
            
            return true;
        });
        
        this.displayEntries();
        this.updateStats();
    }
    
    displayEntries() {
        const container = document.getElementById('entries-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (this.filteredEntries.length === 0) {
            this.showEmptyState(container);
            return;
        }
        
        this.filteredEntries.forEach(entry => {
            const entryCard = this.createEntryCard(entry);
            container.appendChild(entryCard);
        });
    }
    
    createEntryCard(entry) {
        const card = document.createElement('div');
        card.className = 'entry-card';
        card.setAttribute('data-entry-id', entry.id);
        
        const typeIcons = {
            'api_key': '🔑',
            'password': '🔒',
            'credit_card': '💳',
            'debit_card': '💰',
            'bank_details': '🏦',
            'secure_note': '📝'
        };
        
        const typeNames = {
            'api_key': 'API Key',
            'password': 'Password',
            'credit_card': 'Credit Card',
            'debit_card': 'Debit Card',
            'bank_details': 'Bank Details',
            'secure_note': 'Secure Note'
        };
        
        const maskedData = this.getMaskedData(entry);
        
        card.innerHTML = `
            <div class="entry-header">
                <div class="entry-type">
                    ${typeIcons[entry.type]} ${typeNames[entry.type]}
                </div>
                <div class="entry-category" style="color: ${this.getCategoryColor(entry.category)}">
                    📁 ${entry.category}
                </div>
            </div>
            
            <div class="entry-name">${entry.name}</div>
            
            <div class="entry-info">
                🔐 ${maskedData}
            </div>
            
            <div class="entry-actions">
                <button class="action-btn copy" onclick="window.vaultManager.copyEntry('${entry.id}')" title="Copy to clipboard">
                    📋
                </button>
                <button class="action-btn edit" onclick="window.vaultManager.editEntry('${entry.id}')" title="Edit entry">
                    ✏️
                </button>
                <button class="action-btn delete" onclick="window.vaultManager.deleteEntry('${entry.id}')" title="Delete entry">
                    🗑️
                </button>
            </div>
            
            <div class="entry-meta">
                <span>Created: ${entry.created}</span>
                <span>Last used: ${entry.lastUsed}</span>
            </div>
            
            ${entry.description ? `<div class="entry-description">${entry.description}</div>` : ''}
        `;
        
        return card;
    }
    
    getMaskedData(entry) {
        const { type, data } = entry;
        
        switch (type) {
            case 'api_key':
                const key = data.key || '';
                return key.length > 12 ? `${key.substring(0, 8)}...${key.substring(key.length - 4)}` : '●'.repeat(key.length);
                
            case 'password':
                return `${data.username || 'user'}@${data.website || 'website'}`;
                
            case 'credit_card':
            case 'debit_card':
                const number = data.number || '';
                return number.length >= 4 ? `****-****-****-${number.substring(number.length - 4)}` : '****-****-****-****';
                
            case 'bank_details':
                const account = data.accountNumber || '';
                return `${data.bankName || 'Bank'}: ****${account.substring(account.length - 4)}`;
                
            case 'secure_note':
                return 'Encrypted Note Content';
                
            default:
                return 'Encrypted Data';
        }
    }
    
    getCategoryColor(category) {
        const colors = {
            'OpenAI': '#10a37f',
            'Google': '#4285f4',
            'GitHub': '#24292e',
            'SBI Bank': '#1976d2',
            'HDFC Bank': '#e53935',
            'ICICI Bank': '#ff5722',
            'Axis Bank': '#9c27b0',
            'Banking': '#2e7d32',
            'Personal': '#d32f2f',
            'Work': '#7b1fa2'
        };
        return colors[category] || '#6b7280';
    }
    
    showEmptyState(container) {
        container.innerHTML = `
            <div class="loading-state">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                <h3>No entries found</h3>
                <p>Try adjusting your search or add a new entry</p>
            </div>
        `;
    }
    
    async copyEntry(entryId) {
        const entry = this.entries.find(e => e.id === entryId);
        if (!entry) return;
        
        try {
            let dataToCopy;
            
            if (this.isElectron) {
                // Get real decrypted data from Python backend
                const { ipcRenderer } = require('electron');
                const result = await ipcRenderer.invoke('vault-get-entry', entryId);
                
                if (result.success) {
                    dataToCopy = result.data;
                } else {
                    throw new Error(result.error || 'Failed to decrypt entry');
                }
            } else {
                // Fallback for demo mode
                dataToCopy = this.getDataToCopy(entry);
            }
            
            // Use the Clipboard API
            await navigator.clipboard.writeText(dataToCopy);
            
            // Update last used (in memory for demo, real update in Electron)
            entry.lastUsed = new Date().toLocaleString();
            entry.usageCount++;
            
            this.showToast(`🔓 ${entry.type.replace('_', ' ')} decrypted and copied! 📋`, 'success');
            this.displayEntries(); // Refresh to show updated last used
            
            // Auto-clear clipboard after 30 seconds for security
            setTimeout(async () => {
                try {
                    await navigator.clipboard.writeText('');
                    this.showToast('🧹 Clipboard cleared for security', 'info');
                } catch (error) {
                    console.log('Could not clear clipboard:', error);
                }
            }, 30000);
            
        } catch (error) {
            console.error('❌ Failed to copy entry:', error);
            this.showToast('Failed to decrypt and copy: ' + error.message, 'error');
        }
    }
    
    getDataToCopy(entry) {
        const { type, data } = entry;
        
        switch (type) {
            case 'api_key':
                return data.key;
            case 'password':
                return data.password;
            case 'debit_card':
                return data.pin;
            case 'credit_card':
                return data.number;
            case 'bank_details':
                return data.loginPassword;
            case 'secure_note':
                return data.content;
            default:
                return JSON.stringify(data);
        }
    }
    
    editEntry(entryId) {
        const entry = this.entries.find(e => e.id === entryId);
        if (!entry) return;
        
        this.showAddEntryModal(entry.type, entry);
    }
    
    async deleteEntry(entryId) {
        const entry = this.entries.find(e => e.id === entryId);
        if (!entry) return;
        
        if (confirm(`🗑️ Are you sure you want to permanently delete "${entry.name}"?\n\nThis will securely wipe the encrypted data and cannot be undone.`)) {
            try {
                if (this.isElectron) {
                    const { ipcRenderer } = require('electron');
                    const result = await ipcRenderer.invoke('vault-delete-entry', entryId);
                    
                    if (!result.success) {
                        throw new Error(result.error || 'Failed to delete entry');
                    }
                }
                
                // Remove from local array
                this.entries = this.entries.filter(e => e.id !== entryId);
                this.filterAndDisplayEntries();
                this.showToast(`🔥 ${entry.name} securely deleted and wiped!`, 'success');
                
            } catch (error) {
                console.error('❌ Failed to delete entry:', error);
                this.showToast('Failed to delete entry: ' + error.message, 'error');
            }
        }
    }
    
    showAddEntryModal(entryType, existingEntry = null) {
        const modal = document.getElementById('add-entry-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = modal?.querySelector('.modal-body');
        
        if (!modal || !modalTitle || !modalBody) {
            // Create modal if it doesn't exist
            this.createModal();
            return this.showAddEntryModal(entryType, existingEntry);
        }
        
        const action = existingEntry ? 'Edit' : 'Add';
        const typeName = entryType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        modalTitle.textContent = `${action} ${typeName}`;
        
        // Create form based on entry type
        modalBody.innerHTML = this.createEntryForm(entryType, existingEntry);
        
        // Show modal
        modal.classList.add('active');
        
        // Setup modal event listeners
        this.setupModalEventListeners(modal, entryType, existingEntry);
    }
    
    createModal() {
        const modal = document.createElement('div');
        modal.id = 'add-entry-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="modal-title">Add New Entry</h3>
                    <button class="modal-close">&times;</button>
                </div>
                
                <div class="modal-body">
                    <!-- Form will be inserted here -->
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancel-btn">Cancel</button>
                    <button type="submit" form="entry-form" class="btn btn-primary" id="save-btn">
                        🔐 Encrypt & Save
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    createEntryForm(entryType, existingEntry) {
        const data = existingEntry?.data || {};
        
        let formHTML = `
            <form id="entry-form">
                <div class="form-group">
                    <label class="form-label">🏷️ Name</label>
                    <input type="text" name="name" class="form-input" placeholder="Enter ${entryType.replace('_', ' ')} name" value="${existingEntry?.name || ''}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">📁 Category</label>
                    <select name="category" class="form-select">
                        <option value="OpenAI" ${existingEntry?.category === 'OpenAI' ? 'selected' : ''}>OpenAI</option>
                        <option value="Google" ${existingEntry?.category === 'Google' ? 'selected' : ''}>Google</option>
                        <option value="GitHub" ${existingEntry?.category === 'GitHub' ? 'selected' : ''}>GitHub</option>
                        <option value="SBI Bank" ${existingEntry?.category === 'SBI Bank' ? 'selected' : ''}>SBI Bank</option>
                        <option value="HDFC Bank" ${existingEntry?.category === 'HDFC Bank' ? 'selected' : ''}>HDFC Bank</option>
                        <option value="ICICI Bank" ${existingEntry?.category === 'ICICI Bank' ? 'selected' : ''}>ICICI Bank</option>
                        <option value="Banking" ${existingEntry?.category === 'Banking' ? 'selected' : ''}>Banking</option>
                        <option value="Personal" ${existingEntry?.category === 'Personal' ? 'selected' : ''}>Personal</option>
                        <option value="Work" ${existingEntry?.category === 'Work' ? 'selected' : ''}>Work</option>
                        <option value="Other" ${existingEntry?.category === 'Other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
        `;
        
        // Add type-specific fields
        switch (entryType) {
            case 'api_key':
                formHTML += `
                    <div class="form-group">
                        <label class="form-label">🔑 API Key</label>
                        <input type="password" name="key" class="form-input" placeholder="Enter API key" value="${data.key || ''}" required>
                    </div>
                `;
                break;
                
            case 'password':
                formHTML += `
                    <div class="form-group">
                        <label class="form-label">🌐 Website/Service</label>
                        <input type="text" name="website" class="form-input" placeholder="https://example.com" value="${data.website || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">👤 Username</label>
                        <input type="text" name="username" class="form-input" placeholder="Username" value="${data.username || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">🔒 Password</label>
                        <input type="password" name="password" class="form-input" placeholder="Password" value="${data.password || ''}" required>
                    </div>
                `;
                break;
                
            case 'bank_details':
                formHTML += `
                    <div class="form-group">
                        <label class="form-label">🏦 Bank Name</label>
                        <input type="text" name="bankName" class="form-input" placeholder="e.g., State Bank of India" value="${data.bankName || ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">🔢 Account Number</label>
                        <input type="password" name="accountNumber" class="form-input" placeholder="Account Number" value="${data.accountNumber || ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">🏧 IFSC Code</label>
                        <input type="text" name="ifscCode" class="form-input" placeholder="e.g., SBIN0001234" value="${data.ifscCode || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">👤 Username</label>
                        <input type="text" name="username" class="form-input" placeholder="Net Banking Username" value="${data.username || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">🔒 Login Password</label>
                        <input type="password" name="loginPassword" class="form-input" placeholder="Net Banking Password" value="${data.loginPassword || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">📱 Transaction Password/MPIN</label>
                        <input type="password" name="transactionPassword" class="form-input" placeholder="Transaction Password" value="${data.transactionPassword || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">🔐 Profile Password</label>
                        <input type="password" name="profilePassword" class="form-input" placeholder="SBI Profile Password, etc." value="${data.profilePassword || ''}">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">🆔 UPI PIN</label>
                            <input type="password" name="upiPin" class="form-input" placeholder="4-6 digit UPI PIN" value="${data.upiPin || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">📞 Mobile</label>
                            <input type="text" name="mobile" class="form-input" placeholder="Registered mobile" value="${data.mobile || ''}">
                        </div>
                    </div>
                `;
                break;
                
            case 'debit_card':
                formHTML += `
                    <div class="form-group">
                        <label class="form-label">🏦 Bank Name</label>
                        <input type="text" name="bank" class="form-input" placeholder="e.g., State Bank of India" value="${data.bank || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">💰 Card Number</label>
                        <input type="password" name="number" class="form-input" placeholder="1234 5678 9012 3456" value="${data.number || ''}" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">📅 Expiry Month</label>
                            <select name="expMonth" class="form-select">
                                ${Array.from({length: 12}, (_, i) => {
                                    const month = (i + 1).toString().padStart(2, '0');
                                    return `<option value="${month}" ${data.expMonth === month ? 'selected' : ''}>${month}</option>`;
                                }).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">📅 Expiry Year</label>
                            <select name="expYear" class="form-select">
                                ${Array.from({length: 15}, (_, i) => {
                                    const year = (new Date().getFullYear() + i).toString();
                                    return `<option value="${year}" ${data.expYear === year ? 'selected' : ''}>${year}</option>`;
                                }).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">🔢 PIN</label>
                        <input type="password" name="pin" class="form-input" placeholder="4-digit PIN" value="${data.pin || ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">🏪 Cardholder Name</label>
                        <input type="text" name="holderName" class="form-input" placeholder="Name as on card" value="${data.holderName || ''}">
                    </div>
                `;
                break;
                
            case 'secure_note':
                formHTML += `
                    <div class="form-group">
                        <label class="form-label">📝 Secure Content</label>
                        <textarea name="content" class="form-textarea" placeholder="Enter your secure note content" required>${data.content || ''}</textarea>
                    </div>
                `;
                break;
        }
        
        formHTML += `
            <div class="form-group">
                <label class="form-label">📝 Description (Optional)</label>
                <textarea name="description" class="form-textarea" placeholder="Additional notes about this entry">${existingEntry?.description || ''}</textarea>
            </div>
        </form>
        `;
        
        return formHTML;
    }
    
    setupModalEventListeners(modal, entryType, existingEntry) {
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('#cancel-btn');
        const saveBtn = modal.querySelector('#save-btn');
        const form = modal.querySelector('#entry-form');
        
        // Close modal events
        const closeModal = () => {
            modal.classList.remove('active');
        };
        
        closeBtn?.addEventListener('click', closeModal);
        cancelBtn?.addEventListener('click', closeModal);
        
        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Form submission
        const handleSubmit = (e) => {
            e.preventDefault();
            this.saveEntry(entryType, existingEntry, closeModal);
        };
        
        form?.addEventListener('submit', handleSubmit);
        saveBtn?.addEventListener('click', handleSubmit);
    }
    
    async saveEntry(entryType, existingEntry, closeModal) {
        const form = document.getElementById('entry-form');
        if (!form) return;
        
        const formData = new FormData(form);
        const entryData = {};
        
        // Get form data
        for (let [key, value] of formData.entries()) {
            entryData[key] = value.trim();
        }
        
        // Validate required fields
        if (!entryData.name) {
            this.showToast('Name is required!', 'error');
            return;
        }
        
        // Create entry object
        const entry = {
            id: existingEntry?.id || Date.now().toString(),
            name: entryData.name,
            type: entryType,
            category: entryData.category || 'Other',
            description: entryData.description || '',
            created: existingEntry?.created || new Date().toLocaleString(),
            lastUsed: existingEntry?.lastUsed || 'Never',
            usageCount: existingEntry?.usageCount || 0,
            data: this.extractEntryData(entryType, entryData)
        };
        
        try {
            if (this.isElectron) {
                const { ipcRenderer } = require('electron');
                let result;
                
                if (existingEntry) {
                    // Update existing entry
                    result = await ipcRenderer.invoke('vault-update-entry', existingEntry.id, entry);
                } else {
                    // Add new entry
                    result = await ipcRenderer.invoke('vault-add-entry', entry);
                }
                
                if (!result.success) {
                    throw new Error(result.error || 'Failed to save entry');
                }
                
                // Update entry with returned data if available
                if (result.data && result.data.id) {
                    entry.id = result.data.id;
                }
            }
            
            // Update local array
            if (existingEntry) {
                const index = this.entries.findIndex(e => e.id === existingEntry.id);
                if (index !== -1) {
                    this.entries[index] = entry;
                    this.showToast(`🔐 ${entry.name} updated and re-encrypted!`, 'success');
                }
            } else {
                this.entries.push(entry);
                this.showToast(`🔐 ${entry.name} encrypted and stored securely!`, 'success');
            }
            
            // Refresh display and close modal
            this.filterAndDisplayEntries();
            closeModal();
            
        } catch (error) {
            console.error('❌ Failed to save entry:', error);
            this.showToast('Failed to save entry: ' + error.message, 'error');
        }
    }
    
    extractEntryData(entryType, formData) {
        const data = {};
        
        switch (entryType) {
            case 'api_key':
                data.key = formData.key;
                break;
                
            case 'password':
                data.website = formData.website;
                data.username = formData.username;
                data.password = formData.password;
                break;
                
            case 'debit_card':
                data.bank = formData.bank;
                data.number = formData.number;
                data.expMonth = formData.expMonth;
                data.expYear = formData.expYear;
                data.pin = formData.pin;
                data.holderName = formData.holderName;
                break;
                
            case 'bank_details':
                data.bankName = formData.bankName;
                data.accountNumber = formData.accountNumber;
                data.ifscCode = formData.ifscCode;
                data.username = formData.username;
                data.loginPassword = formData.loginPassword;
                data.transactionPassword = formData.transactionPassword;
                data.profilePassword = formData.profilePassword;
                data.upiPin = formData.upiPin;
                data.mobile = formData.mobile;
                break;
                
            case 'secure_note':
                data.content = formData.content;
                break;
        }
        
        return data;
    }
    
    updateStats() {
        const entryCountElement = document.getElementById('entry-count');
        if (entryCountElement) {
            const total = this.entries.length;
            const filtered = this.filteredEntries.length;
            
            if (total === filtered) {
                entryCountElement.textContent = `${total} encrypted entries`;
            } else {
                entryCountElement.textContent = `${filtered} of ${total} entries`;
            }
        }
    }
    
    clearData() {
        this.entries = [];
        this.filteredEntries = [];
        this.displayEntries();
        this.updateStats();
        console.log('🧹 Vault data cleared from memory');
    }
    
    showToast(message, type = 'info') {
        if (window.authManager) {
            window.authManager.showToast(message, type);
        }
    }
}

// Initialize vault manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.vaultManager = new VaultManager();
});