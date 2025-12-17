// ===========================
// Global Variables
// ===========================
let csvData = [];
let csvHeaders = [];
let logoData = null; // Store logo as base64 data URL

// ===========================
// DOM Elements
// ===========================
const uploadArea = document.getElementById('uploadArea');
const csvFileInput = document.getElementById('csvFileInput');
const browseBtn = document.getElementById('browseBtn');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const removeFileBtn = document.getElementById('removeFileBtn');

const previewSection = document.getElementById('previewSection');
const recordCount = document.getElementById('recordCount');
const tableHead = document.getElementById('tableHead');
const tableBody = document.getElementById('tableBody');

const configSection = document.getElementById('configSection');
const briefTitle = document.getElementById('briefTitle');
const briefDate = document.getElementById('briefDate');
const fieldSelector = document.getElementById('fieldSelector');
const categorySelector = document.getElementById('categorySelector');
const companyToggleBtn = document.getElementById('companyToggleBtn');
const companySelector = document.getElementById('companySelector');
const companyList = document.getElementById('companyList');
const selectAllCompaniesBtn = document.getElementById('selectAllCompaniesBtn');
const deselectAllCompaniesBtn = document.getElementById('deselectAllCompaniesBtn');
const logoUpload = document.getElementById('logoUpload');
const uploadLogoBtn = document.getElementById('uploadLogoBtn');
const logoFileName = document.getElementById('logoFileName');
const removeLogoBtn = document.getElementById('removeLogoBtn');
const generatePdfBtn = document.getElementById('generatePdfBtn');
const resetBtn = document.getElementById('resetBtn');

// ===========================
// Initialize
// ===========================
function init() {
    // Set current month as default
    const now = new Date();
    briefDate.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Load saved logo from localStorage
    loadSavedLogo();
    
    // Event listeners
    browseBtn.addEventListener('click', () => csvFileInput.click());
    csvFileInput.addEventListener('change', handleFileSelect);
    removeFileBtn.addEventListener('click', resetApp);
    companyToggleBtn.addEventListener('click', toggleCompanySelector);
    selectAllCompaniesBtn.addEventListener('click', selectAllCompanies);
    deselectAllCompaniesBtn.addEventListener('click', deselectAllCompanies);
    uploadLogoBtn.addEventListener('click', () => logoUpload.click());
    logoUpload.addEventListener('change', handleLogoUpload);
    removeLogoBtn.addEventListener('click', removeLogo);
    generatePdfBtn.addEventListener('click', generatePDF);
    resetBtn.addEventListener('click', resetApp);
    
    // Drag and drop
    uploadArea.addEventListener('click', () => csvFileInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
}

// ===========================
// File Upload Handlers
// ===========================
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].name.endsWith('.csv')) {
        processFile(files[0]);
    } else {
        alert('Please upload a valid CSV file');
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}

// ===========================
// Logo Upload Handlers
// ===========================
function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(event) {
            logoData = event.target.result;
            // Save to localStorage
            localStorage.setItem('pdfLogo', logoData);
            // Update UI
            logoFileName.textContent = file.name;
            removeLogoBtn.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please upload a valid image file');
    }
}

function removeLogo() {
    logoData = null;
    logoUpload.value = '';
    logoFileName.textContent = '';
    removeLogoBtn.classList.add('hidden');
    localStorage.removeItem('pdfLogo');
}

function loadSavedLogo() {
    const savedLogo = localStorage.getItem('pdfLogo');
    if (savedLogo) {
        logoData = savedLogo;
        logoFileName.textContent = 'Saved logo';
        removeLogoBtn.classList.remove('hidden');
    }
}

// ===========================
// CSV Processing
// ===========================
function processFile(file) {
    fileName.textContent = file.name;
    fileInfo.classList.remove('hidden');
    uploadArea.style.display = 'none';
    
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            csvData = results.data;
            csvHeaders = results.meta.fields;
            
            displayPreview();
            displayFieldSelector();
            displayCategorySelector();
            displayCompanySelector();
            
            previewSection.classList.remove('hidden');
            configSection.classList.remove('hidden');
        },
        error: function(error) {
            alert('Error parsing CSV: ' + error.message);
            resetApp();
        }
    });
}

function displayPreview() {
    // Update record count
    recordCount.textContent = `${csvData.length} ${csvData.length === 1 ? 'company' : 'companies'} loaded`;
    
    // Create table header
    tableHead.innerHTML = '';
    const headerRow = document.createElement('tr');
    csvHeaders.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);
    
    // Create table body (limit to first 3 rows for preview)
    tableBody.innerHTML = '';
    const previewRows = csvData.slice(0, 3);
    previewRows.forEach(row => {
        const tr = document.createElement('tr');
        csvHeaders.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header] || '';
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
    
    // Add "showing X of Y" message if more than 3 rows
    if (csvData.length > 3) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = csvHeaders.length;
        td.style.textAlign = 'center';
        td.style.fontStyle = 'italic';
        td.style.color = 'var(--text-light)';
        td.textContent = `Showing 3 of ${csvData.length} companies`;
        tr.appendChild(td);
        tableBody.appendChild(tr);
    }
}

function displayFieldSelector() {
    fieldSelector.innerHTML = '';
    csvHeaders.forEach(header => {
        const div = document.createElement('div');
        div.className = 'field-checkbox';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `field_${header}`;
        checkbox.value = header;
        checkbox.checked = true; // All fields selected by default
        
        const label = document.createElement('label');
        label.htmlFor = `field_${header}`;
        label.textContent = header;
        
        div.appendChild(checkbox);
        div.appendChild(label);
        fieldSelector.appendChild(div);
    });
}

function displayCategorySelector() {
    categorySelector.innerHTML = '';
    
    // Check if Category field exists
    if (!csvHeaders.includes('Category')) {
        categorySelector.innerHTML = '<p style="color: var(--text-light); font-style: italic;">No Category field found in CSV</p>';
        return;
    }
    
    // Get unique categories
    const categories = [...new Set(csvData.map(row => row.Category).filter(cat => cat))].sort();
    
    if (categories.length === 0) {
        categorySelector.innerHTML = '<p style="color: var(--text-light); font-style: italic;">No categories found</p>';
        return;
    }
    
    categories.forEach(category => {
        const div = document.createElement('div');
        div.className = 'field-checkbox';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `category_${category}`;
        checkbox.value = category;
        checkbox.checked = true; // All categories selected by default
        
        const label = document.createElement('label');
        label.htmlFor = `category_${category}`;
        label.textContent = category;
        
        div.appendChild(checkbox);
        div.appendChild(label);
        categorySelector.appendChild(div);
    });
}

function displayCompanySelector() {
    companyList.innerHTML = '';
    
    if (csvData.length === 0) {
        return;
    }
    
    // Get the first field as the company name field
    const nameField = csvHeaders[0];
    
    // Create checkbox for each company
    csvData.forEach((company, index) => {
        const companyName = company[nameField] || `Company ${index + 1}`;
        
        const div = document.createElement('div');
        div.className = 'field-checkbox';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `company_${index}`;
        checkbox.value = index;
        checkbox.checked = true; // All companies selected by default
        checkbox.classList.add('company-checkbox');
        
        const label = document.createElement('label');
        label.htmlFor = `company_${index}`;
        label.textContent = companyName;
        
        div.appendChild(checkbox);
        div.appendChild(label);
        companyList.appendChild(div);
    });
}

// ===========================
// Company Selector Controls
// ===========================
function toggleCompanySelector() {
    companySelector.classList.toggle('hidden');
    companyToggleBtn.classList.toggle('expanded');
}

function selectAllCompanies() {
    const checkboxes = companyList.querySelectorAll('.company-checkbox');
    checkboxes.forEach(cb => cb.checked = true);
}

function deselectAllCompanies() {
    const checkboxes = companyList.querySelectorAll('.company-checkbox');
    checkboxes.forEach(cb => cb.checked = false);
}

// ===========================
// PDF Generation
// ===========================
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Get selected fields
    const selectedFields = Array.from(fieldSelector.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    if (selectedFields.length === 0) {
        alert('Please select at least one field to include in the PDF');
        return;
    }
    
    // Get selected categories
    const selectedCategories = Array.from(categorySelector.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    // Get selected company indices
    const selectedCompanyIndices = Array.from(companyList.querySelectorAll('.company-checkbox:checked'))
        .map(cb => parseInt(cb.value));
    
    const title = briefTitle.value || 'Portfolio Company Brief';
    const monthValue = briefDate.value; // Format: YYYY-MM
    
    // Format month as "Month Year" (e.g., "December 2025")
    let formattedDate;
    if (monthValue) {
        const [year, month] = monthValue.split('-');
        const dateObj = new Date(year, parseInt(month) - 1);
        formattedDate = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    } else {
        const now = new Date();
        formattedDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }
    
    // Filter companies by selected companies (if specific companies are selected)
    let filteredData = csvData;
    if (selectedCompanyIndices.length > 0 && selectedCompanyIndices.length < csvData.length) {
        // Only filter if not all companies are selected
        filteredData = csvData.filter((company, index) => selectedCompanyIndices.includes(index));
    }
    
    // Further filter by selected categories
    if (csvHeaders.includes('Category') && selectedCategories.length > 0) {
        filteredData = filteredData.filter(company => selectedCategories.includes(company.Category));
    }
    
    // Group companies by category and sort alphabetically within each category
    const companiesByCategory = {};
    if (csvHeaders.includes('Category')) {
        selectedCategories.forEach(category => {
            companiesByCategory[category] = filteredData
                .filter(company => company.Category === category)
                .sort((a, b) => {
                    const nameA = (a[selectedFields[0]] || '').toLowerCase();
                    const nameB = (b[selectedFields[0]] || '').toLowerCase();
                    return nameA.localeCompare(nameB);
                });
        });
    } else {
        // If no category field, create a single group with all data sorted alphabetically
        companiesByCategory['All Companies'] = filteredData.sort((a, b) => {
            const nameA = (a[selectedFields[0]] || '').toLowerCase();
            const nameB = (b[selectedFields[0]] || '').toLowerCase();
            return nameA.localeCompare(nameB);
        });
    }
    
    // PDF styling
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = margin;
    let isFirstPage = true;
    
    // Add logo to top right if available
    if (logoData) {
        const logoWidth = 30;
        const logoHeight = 15;
        const logoX = pageWidth - margin - logoWidth;
        const logoY = margin - 5;
        doc.addImage(logoData, 'PNG', logoX, logoY, logoWidth, logoHeight);
    }
    
    // Title
    doc.setFontSize(24);
    doc.setTextColor(79, 70, 229); // Primary color
    doc.text(title, margin, yPosition);
    yPosition += 10;
    
    // Date
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128); // Text light
    doc.text(formattedDate, margin, yPosition);
    yPosition += 5;
    
    // Divider line
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;
    
    // Process each category
    Object.keys(companiesByCategory).forEach((category, catIndex) => {
        const companies = companiesByCategory[category];
        
        if (companies.length === 0) return;
        
        // Category header (skip if only one category named "All Companies")
        if (!(Object.keys(companiesByCategory).length === 1 && category === 'All Companies')) {
            // Add page break for new category (except first one)
            if (catIndex > 0) {
                doc.addPage();
                yPosition = margin;
                isFirstPage = false;
            } else if (yPosition > pageHeight - 40) {
                // Check if we need a new page for category header (for first category only)
                doc.addPage();
                yPosition = margin;
                isFirstPage = false;
            }
            
            doc.setFontSize(16);
            doc.setTextColor(79, 70, 229);
            doc.text(category, margin, yPosition);
    yPosition += 10;
        }
    
        // Process each company in the category
        companies.forEach((company, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 60) {
            doc.addPage();
            yPosition = margin;
                isFirstPage = false;
        }
        
            // Company name (bold, black)
        doc.setFontSize(14);
            doc.setTextColor(0, 0, 0); // Black
            doc.setFont(undefined, 'bold');
            doc.text(`${company[selectedFields[0]] || 'Company'}`, margin, yPosition);
        yPosition += 8;
        
        // Company details
        doc.setFontSize(10);
        doc.setTextColor(31, 41, 55);
            doc.setFont(undefined, 'normal');
        
        selectedFields.forEach((field, fieldIndex) => {
            if (fieldIndex === 0) return; // Skip first field (used as title)
            
            const value = company[field] || 'N/A';
            
            // Check if we need a new page
            if (yPosition > pageHeight - 40) {
                doc.addPage();
                yPosition = margin;
                    isFirstPage = false;
                }
                
                // Check if field is likely a website URL
                const isWebsite = field.toLowerCase().includes('website') || 
                                  field.toLowerCase().includes('url') ||
                                  String(value).match(/^https?:\/\//);
                
                if (isWebsite && value && value !== 'N/A') {
                    // Make website a clickable link with underline
                    doc.setTextColor(0, 0, 255); // Blue for links
                    doc.textWithLink(String(value), margin + 5, yPosition, { url: String(value) });
                    
                    // Add underline manually
                    const textWidth = doc.getTextWidth(String(value));
                    doc.setDrawColor(0, 0, 255);
                    doc.line(margin + 5, yPosition + 0.5, margin + 5 + textWidth, yPosition + 0.5);
                    
                    doc.setTextColor(31, 41, 55); // Reset color
                    yPosition += 7;
                } else {
                    // Regular text field - just show the value without label
                    const textLines = doc.splitTextToSize(String(value), pageWidth - margin * 2 - 10);
                    doc.text(textLines, margin + 5, yPosition);
            yPosition += (textLines.length * 5) + 2;
                }
        });
        
        // Divider between companies
        yPosition += 3;
        doc.setDrawColor(229, 231, 235);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;
        });
        
        // Add extra space between categories
        yPosition += 5;
    });
    
    // Footer on last page
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(156, 163, 175);
        doc.text(
            `Page ${i} of ${totalPages} | ${title}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
        );
    }
    
    // Save PDF
    const filename = `${title.replace(/\s+/g, '_')}_${monthValue || 'current'}.pdf`;
    doc.save(filename);
    
    // Calculate total companies included
    const totalCompanies = Object.values(companiesByCategory).reduce((sum, companies) => sum + companies.length, 0);
    
    // Show success message
    alert(`PDF generated successfully!\n\nFile: ${filename}\nCompanies: ${totalCompanies}\nFields: ${selectedFields.length}`);
}

// ===========================
// Reset/Clear
// ===========================
function resetApp() {
    csvData = [];
    csvHeaders = [];
    csvFileInput.value = '';
    
    uploadArea.style.display = 'block';
    fileInfo.classList.add('hidden');
    previewSection.classList.add('hidden');
    configSection.classList.add('hidden');
    
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';
    fieldSelector.innerHTML = '';
    categorySelector.innerHTML = '';
    companyList.innerHTML = '';
    companySelector.classList.add('hidden');
    companyToggleBtn.classList.remove('expanded');
    
    briefTitle.value = 'Portfolio Company Brief';
    const now = new Date();
    briefDate.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// ===========================
// Initialize on load
// ===========================
document.addEventListener('DOMContentLoaded', init);
