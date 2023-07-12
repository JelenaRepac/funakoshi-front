
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.entry';
import '../css/PdfReader.css';
import CompetitionDefinition from '../model/CompetitionDefinition';
import CityDefinition from '../model/CityDefinition';
import CompetitionService from '../services/CompetitionService';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const PdfReader = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFile(file);
    setPageNumber(1); // Reset page number to 1 when a new file is uploaded
  };

  const goToPreviousPage = () => {
    setPageNumber((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prevPage) => Math.min(prevPage + 1, numPages));
  };


  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      {file && (
        <>
          <p>Number of Pages: {numPages}</p>
          <div>
            <button onClick={goToPreviousPage} disabled={pageNumber === 1}>
              Previous Page
            </button>
            <button onClick={goToNextPage} disabled={pageNumber === numPages}>
              Next Page
            </button>
          </div>
          <div className="document-wrapper">
            <Document file={file}>
              <Page pageNumber={pageNumber} />
            </Document>
            
          </div>
          
        </>
      )}
    </div>
  );
};

export default PdfReader;

// const PdfReader = () => {
//     const [numPages, setNumPages] = useState(null);
//     const [pageNumber, setPageNumber] = useState(1);
//     const [file, setFile] = useState(null);
  
//     const handleFileUpload = (event) => {
//       const file = event.target.files[0];
//       setFile(file);
//       setPageNumber(1);
//     };
  
//     const onLoadSuccess = ({ numPages }) => {
//       setNumPages(numPages);
//     };
  
//     return (
//       <div>
//         <input type="file" onChange={handleFileUpload} />
//         {file && (
//           <>
//             <p>Number of Pages: {numPages}</p>
//             <Document file={file} onLoadSuccess={onLoadSuccess}>
//               {Array.from(new Array(numPages), (el, index) => (
//                 <Page key={`page_${index + 1}`} pageNumber={index + 1} />
//               ))}
//             </Document>
//           </>
//         )}
//       </div>
//     );
  
//   };
  
//   export default PdfReader;
  