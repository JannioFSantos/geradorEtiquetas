
import React, { useCallback, useState } from 'react';
import type { PriceTagData } from '../types';
import { UploadIcon } from './icons/UploadIcon';
import { ExcelIcon } from './icons/ExcelIcon';

declare const XLSX: any;

interface FileUploadProps {
  onFileProcessed: (data: PriceTagData[], fileName: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  isLoading: boolean;
  error: string | null;
}

const normalizeHeader = (header: string): string => {
  return header
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]/gi, ""); // remove special chars and spaces
};

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed, setLoading, setError, isLoading, error }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File | null) => {
    if (!file) return;

    if (!file.type.includes('spreadsheetml') && !file.name.endsWith('.xls') && !file.name.endsWith('.xlsx')) {
        setError("Tipo de arquivo inválido. Por favor, selecione um arquivo Excel (.xlsx, .xls).");
        return;
    }

    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        if (!e.target || !e.target.result) {
          throw new Error("Não foi possível ler o arquivo.");
        }
        const workbook = XLSX.read(e.target.result, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
            throw new Error("A planilha está vazia ou corrompida.");
        }
        const worksheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (json.length === 0) {
            throw new Error("Nenhum dado encontrado na primeira aba da planilha.");
        }

        const headerMap: { [key: string]: string } = {};
        const headers = Object.keys(json[0]);
        headers.forEach(h => {
          const normalized = normalizeHeader(h);
          if (normalized.includes('descricao')) headerMap.descricao = h;
          if (normalized.includes('preco')) headerMap.preco = h;
          if (normalized.includes('unidademedida')) headerMap.unidadeMedida = h;
        });

        if (!headerMap.descricao || !headerMap.preco || !headerMap.unidadeMedida) {
          throw new Error("Cabeçalhos não encontrados. Verifique se a planilha contém as colunas 'descrição', 'preço' e 'unidade medida'.");
        }

        const parsedData: PriceTagData[] = json.map((row, index) => {
          const priceStr = String(row[headerMap.preco] || '0').replace(',', '.');
          const price = parseFloat(priceStr);

          if (isNaN(price)) {
            console.warn(`Preço inválido na linha ${index + 2}: '${row[headerMap.preco]}'. Usando 0.`);
          }

          return {
            id: index,
            descricao: String(row[headerMap.descricao] || 'Sem descrição'),
            preco: isNaN(price) ? 0 : price,
            unidadeMedida: String(row[headerMap.unidadeMedida] || 'un'),
          };
        });
        
        onFileProcessed(parsedData, file.name);

      } catch (err: any) {
        setError(err.message || 'Ocorreu um erro ao processar o arquivo.');
        setLoading(false);
      }
    };

    reader.onerror = () => {
        setError('Falha ao ler o arquivo.');
        setLoading(false);
    }

    reader.readAsArrayBuffer(file);
  }, [onFileProcessed, setLoading, setError]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg flex flex-col lg:flex-row items-center gap-8">
      <div className="flex-1 w-full">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          onChange={(e) => handleFile(e.target.files ? e.target.files[0] : null)}
          disabled={isLoading}
        />
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ease-in-out
            ${isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'}`}
        >
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer w-full">
            <UploadIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-center text-lg font-semibold text-gray-700 dark:text-gray-300">
              <span className="text-primary-600 dark:text-primary-400">Clique aqui</span> ou arraste e solte o arquivo
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Arquivos .xlsx ou .xls</p>
            {isLoading && (
              <div className="mt-4 flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
                <span className="text-gray-600 dark:text-gray-300">Processando...</span>
              </div>
            )}
            {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 p-2 rounded">{error}</p>}
          </label>
        </div>
      </div>
      <div className="flex-1 w-full lg:max-w-md p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><ExcelIcon className="w-6 h-6 text-green-600" /> Instruções</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Para um resultado perfeito, sua planilha deve seguir este formato:</p>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>O arquivo deve ser do tipo Excel (.xlsx ou .xls).</li>
            <li>Use a primeira aba da planilha para os dados dos produtos.</li>
            <li>A primeira linha deve conter os cabeçalhos das colunas.</li>
            <li>As colunas obrigatórias são:
                <ul className="list-disc list-inside pl-5 mt-2 space-y-1">
                    <li><span className="font-semibold text-gray-700 dark:text-gray-200">descrição</span>: Nome ou descrição do produto.</li>
                    <li><span className="font-semibold text-gray-700 dark:text-gray-200">preço</span>: Valor numérico do produto.</li>
                    <li><span className="font-semibold text-gray-700 dark:text-gray-200">unidade medida</span>: Ex: kg, un, L, etc.</li>
                </ul>
            </li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
