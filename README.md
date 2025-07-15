# Gerador de Etiquetas de Preço

Uma aplicação web moderna e intuitiva para converter planilhas Excel em etiquetas de preço prontas para impressão. Ideal para comerciantes e lojistas que precisam gerar etiquetas de forma rápida e customizada.

## ✨ Funcionalidades

- **Upload de Excel**: Carregue arquivos `.xlsx` ou `.xls` de forma simples, com suporte para arrastar e soltar (drag and drop).
- **Geração Automática**: Gera automaticamente até 20 etiquetas por folha A4.
- **Pré-visualização ao Vivo**: Veja como suas etiquetas ficarão antes de salvar.
- **Customização Visual**:
  - **Cores do Preço**: Altere a cor do preço para vermelho, azul ou preto.
  - **Modo Promoção**: Destaque produtos em oferta com uma faixa lateral amarela vibrante.
- **Exportação para PDF**: Salve todas as páginas de etiquetas em um único arquivo PDF de alta qualidade, pronto para impressão.
- **Responsivo**: Funciona em desktops, tablets e celulares.
- **Interface Intuitiva**: Design limpo e fácil de usar.

## 🚀 Como Usar

1.  **Prepare sua Planilha**: Crie um arquivo Excel (`.xlsx` ou `.xls`) com os dados dos seus produtos.
2.  **Acesse a Aplicação**: Abra o site do Gerador de Etiquetas.
3.  **Carregue o Arquivo**: Clique na área indicada para selecionar sua planilha ou simplesmente arraste e solte o arquivo na página.
4.  **Customize suas Etiquetas**:
    - Escolha a cor desejada para o preço (vermelho, azul ou preto).
    - Ative o modo "Promoção" se quiser destacar algum item.
5.  **Salve em PDF**: Clique no botão **"Salvar como PDF"**. O download do arquivo começará automaticamente.

## 📋 Estrutura do Arquivo Excel

Para que a aplicação funcione corretamente, sua planilha precisa seguir uma estrutura simples:

- Os dados devem estar na **primeira aba** da planilha.
- A **primeira linha** deve ser o cabeçalho.
- As colunas obrigatórias são:
  - `descrição`: O nome do produto.
  - `preço`: O valor do produto (use vírgula ou ponto como separador decimal).
  - `unidade medida`: A unidade de venda (ex: `un`, `kg`, `L`, `m²`, etc.).

> **Nota**: O sistema é flexível e reconhece variações nos nomes dos cabeçalhos, como "Descricao", "Preco", ou "UNIDADE DE MEDIDA".

### Exemplo de Planilha:

| descrição             | preço | unidade medida |
| --------------------- | ----- | -------------- |
| Biscoito de Chocolate | 5,99  | un             |
| Queijo Minas          | 25,50 | kg             |
| Refrigerante 2L       | 8,00  | L              |

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS
- **Manipulação de Planilhas**: [SheetJS (xlsx)](https://sheetjs.com/)
- **Geração de PDF**: [jsPDF](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/)
- **Ícones**: SVG personalizados

---

&copy; 2024 Gerador de Etiquetas. Todos os direitos reservados.
