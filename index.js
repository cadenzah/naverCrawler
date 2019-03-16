const cheerio = require('cheerio');
const request = require('request');
const Iconv = require('iconv').Iconv;
const iconv = new Iconv('utf-8', 'utf-8//translit//ignore');

const keyword = encodeURI('현대무용') // 필요 검색 키워드로 변경
let page = 1
let url = `https://search.naver.com/search.naver?where=kin&kin_display=10&qt=&title=0&&answer=0&grade=0&choice=0&sec=0&nso=so%3Ar%2Ca%3Aall%2Cp%3Aall&query=${keyword}&c_id=&c_name=&sm=tab_pge&kin_start=${page}`

request({ url, encoding: null}, (error, response, body) => {
  const htmlDoc = iconv.convert(body).toString()
  const totalResults = []
  const $ = cheerio.load(htmlDoc)
  const colArr = $('.type01 > li')
  // 내용 모두 완료한 뒤, 그 뒤에서 날짜만 붙임
  // [1]는 제목, [3]는 날짜
  for (let i = 0 ; i < colArr.length ; i++) {
    // console.log(colArr[i].children[1].children) // <dl> 하위 요소

    /* 항목 하나 파싱 */
    /* 제목 먼저 */
    // console.log(colArr[i])
    const elements = colArr[i].children[1].children // <dl>의 하위 요소들
    const question = elements[1].children[3] // dl > dt > a ; 제목이 담긴 <a>만 주목
    const content = question.children

    // node.shift() // 너무 오래걸림; 요소 객체가 너무 커서 그런듯
    const result = content.map(text => {
      if (text.type === 'text' && text.data === '') return
      else if (text.type === 'tag' && text.name === 'strong') return text.children[0].data
      else return text.data.trim()
    }).join(' ').trim()

    /* 그 다음 날짜 추출 */

    totalResults.push(result)
    /* 항목 하나 파싱 끝 */
  } // 10개 항목 파싱 끝
  console.log(totalResults)
})

// 원본 출처: https://victorydntmd.tistory.com/94 [victolee]
// 일북 가공: https://github.com/cadenzah
