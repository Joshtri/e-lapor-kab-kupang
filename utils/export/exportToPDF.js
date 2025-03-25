import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToPDF = (data, columns, fileName = 'data.pdf') => {
  const doc = new jsPDF();

  autoTable(doc, {
    head: [columns],
    body: data.map((item) => columns.map((col) => item[col])),
  });

  doc.save(fileName);
};
