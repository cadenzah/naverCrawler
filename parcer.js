const cheerio = require('cheerio');
const Iconv = require('iconv').Iconv;
const iconv = new Iconv('utf-8', 'utf-8//translit//ignore');

const parcer = (body) => {
  // 웹 페이지 요청 성공시 수행할 파싱 작업 callback
  const htmlDoc = iconv.convert(body).toString()
  const $ = cheerio.load(htmlDoc)
  const colArr = $('.type01 > li')
  const results10 = []
  // 내용 모두 완료한 뒤, 그 뒤에서 날짜만 붙임
  // [1]는 제목, [3]는 날짜
  for (let i = 0 ; i < colArr.length ; i++) { /* 항목 하나 파싱 */
    /* 제목 먼저 */
    const elements = colArr[i].children[1].children // <dl>의 하위 요소들
    const question = elements[1].children[3] // dl > dt > a ; 제목이 담긴 <a>만 주목
    if (question.type === 'tag' && question.name === 'span') continue // 파싱에 실패한 경우 결과를 무시
    const content = question.children // <a> 하위의 요소들
    // node.shift() // 너무 오래걸림; 요소 객체가 너무 커서 그런듯
    const result = content.map(text => {
      if (text.type === 'text' && text.data === '') return
      else if (text.type === 'tag' && text.name === 'strong') return text.children[0].data
      else return text.data.trim()
    }).join(' ').trim()

    /* 그 다음 날짜 추출 */
    const date = elements[3].children[0].data.trim()

    /* 제목과 날짜 합쳑서 반환 */
    results10.push({
      result, date
    })
  } /* 10개 항목 파싱 끝 */
  return results10
}
