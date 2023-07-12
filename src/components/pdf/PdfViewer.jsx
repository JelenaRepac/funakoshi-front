import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import CompetitionDefinition from '../../model/CompetitionDefinition';
import CityDefinition from '../../model/CityDefinition';
import CompetitionService from '../../services/CompetitionService';
const PdfViewer = () => {
    const [file, setFile] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
  
    const handleFileChange = (e) => {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);
      setCurrentPage(1); // Reset current page when a new file is uploaded
    };
  
    const handleDocumentLoadSuccess = ({ numPages }) => {
      setNumPages(numPages);
    };
  
    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => prevPage - 2);
      };
    
      const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 2);
      };
     
    return (
      <div>
        
        <input type="file" accept=".pdf" onChange={handleFileChange} />
  
        {file && (
          <div>
            <Document
              file={file}
              onLoadSuccess={handleDocumentLoadSuccess}
              onLoadError={(error) => console.log('Error loading PDF:', error)}
            >
              <div style={{ display: 'flex' }}>
              <Page
                pageNumber={currentPage}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
              {currentPage + 1 <= numPages && (
                <Page
                  pageNumber={currentPage + 1}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              )}
            </div>
            </Document>
  
            <p>
              Page {currentPage} of {numPages}
            </p>
  
            <button>Save</button>
            <button onClick={handlePreviousPage} disabled={currentPage <= 1}>
              Previous Page
            </button>
            <button onClick={handleNextPage} disabled={currentPage >= numPages}>
              Next Page
            </button>
          </div>
        )}
      </div>
    );
  };
  
  export default PdfViewer;