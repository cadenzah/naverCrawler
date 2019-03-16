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
  const colArr = $('.question')
    for (let i = 0 ; i < colArr.length ; i++) {
      /* 항목 하나 파싱 */
      const elements = colArr[i].children // 일단 맨 처음 1개로만
      const question = elements[3] // 제목이 담긴 <a>만 주목
      const content = question.children

      // node.shift() // 너무 오래걸림; 요소 객체가 너무 커서 그런듯
      const result = content.map(text => {
        if (text.type === 'text' && text.data === '') return
        else if (text.type === 'tag' && text.name === 'strong') return text.children[0].data
        else return text.data.trim()
      }).join(' ').trim()
      totalResults.push(result)
      /* 항목 하나 파싱 끝 */
    } // 10개 항목 파싱 끝
  console.log(totalResults)
})

// 원본 출처: https://victorydntmd.tistory.com/94 [victolee]
// 일북 가공: https://github.com/cadenzah
