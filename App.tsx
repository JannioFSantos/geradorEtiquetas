
import React, { useState, useCallback } from 'react';
import { PriceTagData } from './types';
import FileUpload from './components/FileUpload';
import PrintPreview from './components/PrintPreview';
import { TagIcon } from './components/icons/TagIcon';

declare const html2canvas: any;
declare global {
    interface Window {
        jspdf: any;
    }
}

const PrintStyles = () => (
  <style>
    {`
      @media print {
        body, html {
          background-color: #fff !important;
        }
        body * {
          visibility: hidden;
        }
        .print-area, .print-area * {
          visibility: visible;
        }
        .print-area {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .a4-page {
          margin: 0;
          border: none;
          border-radius: 0;
          width: 100%;
          min-height: initial;
          box-shadow: none;
          background: white;
          page-break-after: always;
          color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
      }
      @page {
        size: A4;
        margin: 10mm;
      }
    `}
  </style>
);

const App: React.FC = () => {
  const [tagsData, setTagsData] = useState<PriceTagData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSavingPdf, setIsSavingPdf] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [priceColor, setPriceColor] = useState('red');
  const [isPromotion, setIsPromotion] = useState(false);


  const handleFileProcessed = useCallback((data: PriceTagData[], name: string) => {
    setTagsData(data);
    setFileName(name);
    setError(null);
    setIsLoading(false);
  }, []);

  const handleReset = () => {
    setTagsData([]);
    setFileName(null);
    setError(null);
    setIsLoading(false);
    setPriceColor('red');
    setIsPromotion(false);
  };
  
  const handleSaveAsPdf = async () => {
    setIsSavingPdf(true);
    setError(null);
    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });

        const pageElements = document.querySelectorAll<HTMLElement>('.a4-page');
        
        for (let i = 0; i < pageElements.length; i++) {
            const page = pageElements[i];
            const canvas = await html2canvas(page, {
                scale: 2.5, // Higher scale for better quality
                useCORS: true,
                backgroundColor: '#ffffff',
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.98);
            const pdfWidth = 210; // A4 width in mm
            const pdfHeight = 297; // A4 height in mm

            if (i > 0) {
                pdf.addPage();
            }
            
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        }
        
        pdf.save(`etiquetas-${fileName?.split('.')[0] || 'precos'}.pdf`);

    } catch (e) {
        console.error("Error saving PDF:", e);
        setError("Ocorreu um erro ao salvar o PDF. Tente novamente.");
    } finally {
        setIsSavingPdf(false);
    }
  };

  const ColorOption: React.FC<{color: string, name: string}> = ({ color, name }) => (
    <button
        onClick={() => setPriceColor(name)}
        aria-label={`Mudar cor para ${name}`}
        className={`w-7 h-7 rounded-full transition-transform transform hover:scale-110 ${color} ${priceColor === name ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-current' : ''}`}
    />
  );

  return (
    <>
      <PrintStyles />
      <div className="min-h-screen flex flex-col font-sans text-gray-800 dark:text-gray-200">
        <header className="bg-white dark:bg-gray-800 shadow-md print:hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <TagIcon className="h-8 w-8 text-primary-500" />
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Gerador de Etiquetas de Preço</h1>
              </div>
              {tagsData.length > 0 && (
                 <div className="flex items-center space-x-2">
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Carregar Novo Arquivo
                    </button>
                    <button
                      onClick={handleSaveAsPdf}
                      disabled={isSavingPdf}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                    >
                      {isSavingPdf ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Salvando...</span>
                        </>
                      ) : (
                        'Salvar como PDF'
                      )}
                    </button>
                  </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
          {tagsData.length === 0 ? (
            <FileUpload 
              onFileProcessed={handleFileProcessed} 
              setLoading={setIsLoading} 
              setError={setError}
              isLoading={isLoading}
              error={error}
            />
          ) : (
            <div>
                <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow print:hidden">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                        <div>
                            <h2 className="text-lg font-semibold">Pré-visualização e Opções</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Arquivo: <span className="font-medium text-primary-600 dark:text-primary-400">{fileName}</span> - {tagsData.length} etiqueta(s) gerada(s).</p>
                        </div>
                        <div className="flex items-center space-x-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cor do Preço</h3>
                                <div className="flex items-center space-x-3">
                                   <ColorOption color="bg-red-600 text-red-500" name="red" />
                                   <ColorOption color="bg-blue-600 text-blue-500" name="blue" />
                                   <ColorOption color="bg-gray-800 text-gray-700" name="black" />
                                </div>
                            </div>
                             <div>
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Destaque</h3>
                                <button
                                    onClick={() => setIsPromotion(!isPromotion)}
                                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${isPromotion ? 'bg-yellow-400 text-yellow-900 font-bold' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                                >
                                    {isPromotion ? 'Promoção Ativa' : 'Ativar Promoção'}
                                </button>
                            </div>
                        </div>
                    </div>
                     {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 p-2 rounded">{error}</p>}
                </div>
                <div className="print-area">
                    <PrintPreview tags={tagsData} priceColor={priceColor} isPromotion={isPromotion}/>
                </div>
            </div>
          )}
        </main>

        <footer className="text-center p-4 text-sm text-gray-500 dark:text-gray-400 print:hidden">
          <p>&copy; {new Date().getFullYear()} Gerador de Etiquetas. Todos os direitos reservados.</p>
        </footer>
      </div>
    </>
  );
};

export default App;
