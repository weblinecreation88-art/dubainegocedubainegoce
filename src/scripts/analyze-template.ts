// src/scripts/analyze-template.ts
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

const analyzeTemplate = () => {
    const templatePath = path.join(process.cwd(), 'src/scripts/templates/tiktok_template.xlsx');
    const outputPath = path.join(process.cwd(), 'template-analysis.txt');

    if (!fs.existsSync(templatePath)) {
        console.error('Template file not found at:', templatePath);
        return;
    }

    const workbook = XLSX.readFile(templatePath);
    let output = '';

    output += `Sheet Names: ${workbook.SheetNames.join(', ')}\n\n`;

    workbook.SheetNames.forEach(sheetName => {
        output += `--- Sheet: ${sheetName} ---\n`;
        const worksheet = workbook.Sheets[sheetName];
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:Z20');

        for (let r = 0; r <= Math.min(range.e.r, 10); r++) {
            const row = [];
            for (let c = 0; c <= Math.min(range.e.c, 30); c++) {
                const cell = worksheet[XLSX.utils.encode_cell({ r, c })];
                row.push(cell ? String(cell.v).replace(/\n/g, ' ') : '');
            }
            output += `Row ${r}: ${row.join(' | ')}\n`;
        }
        output += '\n';
    });

    fs.writeFileSync(outputPath, output);
    console.log(`Analysis saved to: ${outputPath}`);
};

analyzeTemplate();
