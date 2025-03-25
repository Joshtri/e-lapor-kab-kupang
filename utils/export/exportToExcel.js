import ExcelJS from 'exceljs';

export async function exportToExcel({ data, columns, filename }) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data');

  worksheet.columns = columns;

  data.forEach((item) => {
    worksheet.addRow(item);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  // ✅ Native browser download (tanpa file-saver)
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${filename}.xlsx`;
  anchor.click();
  window.URL.revokeObjectURL(url);
}
