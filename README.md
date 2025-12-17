# Portfolio Brief Generator

A simple, modern web application that transforms CSV files containing company data into professionally formatted PDF briefs.

## 🎯 Features

- **📤 CSV Upload**: Drag-and-drop or browse to upload company data
- **👁️ Data Preview**: Review your data before generating the PDF
- **⚙️ Customizable Output**: Select which fields to include in the PDF
- **📄 Professional PDFs**: Generate clean, formatted PDF documents
- **🎨 Modern UI**: Beautiful, responsive design that works on all devices
- **🔒 Privacy**: All processing happens in your browser - no data sent to servers

## 🚀 Quick Start

### Option 1: Open Directly
Simply open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge)

### Option 2: Local Server (Recommended for Development)
```bash
# Using Python 3
python3 -m http.server 8000

# OR using Node.js
npx serve

# Then visit: http://localhost:8000
```

## 📋 How to Use

1. **Prepare Your CSV**
   - Create a CSV file with company information
   - First row should contain column headers
   - Example columns: Company Name, Industry, Location, Revenue, Description, etc.

2. **Upload CSV**
   - Drag and drop your CSV file onto the upload area
   - OR click "Browse Files" to select from your computer

3. **Preview Data**
   - Review the first 10 companies to ensure data loaded correctly
   - See the total count of companies loaded

4. **Configure PDF**
   - Set a custom title for your brief (optional)
   - Select a date (defaults to today)
   - Choose which fields to include in the PDF (all selected by default)

5. **Generate PDF**
   - Click "Generate PDF"
   - Your browser will download the formatted PDF file
   - File will be named based on your title and date

## 📊 CSV Format Example

```csv
Company Name,Industry,Location,Revenue,Stage,Description
Acme Corp,Software,San Francisco,5M,Series A,AI-powered analytics platform
TechStart Inc,SaaS,New York,2M,Seed,Cloud collaboration tools
DataFlow,Data,Austin,10M,Series B,Real-time data processing
```

## 🎨 PDF Output

The generated PDF includes:
- Custom title and date
- Summary of total companies
- Each company displayed in a clean, organized format
- Selected fields only (hide sensitive/unnecessary data)
- Page numbers and headers
- Professional styling and layout

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic structure
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: No framework dependencies
- **PapaParse**: CSV parsing library (CDN)
- **jsPDF**: PDF generation library (CDN)

### File Structure
```
portfolio-brief-generator/
├── index.html      # Main HTML file
├── styles.css      # All styling
├── script.js       # CSV parsing and PDF generation logic
├── README.md       # This file
└── sample.csv      # Example CSV file
```

### Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Any modern browser with ES6+ support

## 🔐 Privacy & Security

- **100% Client-Side**: All processing happens in your browser
- **No Server**: No data is uploaded or transmitted
- **No Tracking**: No analytics or tracking scripts
- **Offline Capable**: Works without internet after initial load (except CDN libraries)

## 💡 Use Cases

- **Venture Capital**: Generate portfolio company summaries
- **Investment Banking**: Create deal pipeline briefs
- **Business Development**: Organize prospect lists
- **Sales Teams**: Format customer/lead data
- **Consulting**: Present client portfolios
- **Any scenario**: where you need to convert CSV data to formatted PDFs

## 🚧 Future Enhancements

Potential features to add:
- [ ] Save/load field selection preferences
- [ ] Multiple PDF templates/themes
- [ ] Add logo/branding to PDFs
- [ ] Filter and sort companies before export
- [ ] Export to other formats (Excel, Word)
- [ ] Batch processing of multiple CSVs
- [ ] Custom field ordering in PDF
- [ ] Add charts/graphs to PDFs

## 📝 Notes

- Maximum file size depends on browser memory (typically handles 1000+ rows easily)
- For very large datasets (10,000+ rows), PDF generation may take a few seconds
- Ensure your CSV is UTF-8 encoded for special characters

## 🤝 Contributing

This is a simple standalone web app. Feel free to modify and customize to your needs!

---

**Portfolio Brief Generator** - Simple, fast, and professional CSV to PDF conversion
