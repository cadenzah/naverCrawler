module.exports = (array) => {
  const excel = require('excel4node');
  const workbook = new excel.Workbook();

  const worksheet = workbook.addWorksheet('Sheet 1');
  const style = workbook.createStyle({
    font: {
      bold: true,
      color: '#000000',
      size: 12
    },
    fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: 'f6d55c'
    }
  });

  worksheet.cell(1,1).string('날짜').style(style);
  worksheet.cell(1,2).string('지식IN 질문글 제목').style(style);
  array.forEach((content, index) => {
    worksheet.cell(2+index, 1).string(content.date)
    worksheet.cell(2+index, 2).string(content.result)
  })

  workbook.write('result.xlsx'); // 엑셀 파일 이름
}
