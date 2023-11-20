import { Word } from '@/interfaces/Words.ts'
import { Article } from '@/interfaces/Articles.ts'

export function generalFilterWords(
  words: Word[],
  keyword: string,
  options: string[],
  tagsArray: number[],
  tagsOperator: string,
  choiceArray: string[],
  choiceOperator: string
) {
  let currentFilteredWords = []
  // 第一次搜尋篩選 (關鍵字及類別共用)
  if (keyword && options && options.length > 0) {
    currentFilteredWords = Object.keys(words)
      .filter((key) => {
        const word = words[key]
        return options.some(
          (option) => word[option] && word[option].includes(keyword)
        )
      })
      .map((key) => ({
        key,
        ...words[key]
      }))
  } else {
    currentFilteredWords = Object.keys(words).map((key) => ({
      key,
      ...words[key]
    }))
  }

  // 第二次用 tags 篩選 接續第一個篩選結果
  if (tagsOperator === 'none') {
    // NONE
    currentFilteredWords = currentFilteredWords.filter((word) => {
      return !word.words_tags.values || word.words_tags.values.length === 0
    })
  } else if (tagsArray && tagsArray.length > 0) {
    // AND
    if (tagsOperator && tagsOperator === 'and' && tagsArray.length >= 1) {
      // length = 1
      if (tagsArray.length === 1) {
        currentFilteredWords = currentFilteredWords.filter((word) => {
          return (
            word.words_tags.values &&
            word.words_tags.values.length === tagsArray.length &&
            tagsArray.every((tag) =>
              word.words_tags.values.some((t) => t.ts_id === tag)
            )
          )
        })
      } else {
        // length > 1
        currentFilteredWords = currentFilteredWords.filter((word) => {
          return (
            word.words_tags.values &&
            word.words_tags.values.length >= tagsArray.length &&
            tagsArray.every((tag) =>
              word.words_tags.values.some((t) => t.ts_id === tag)
            )
          )
        })
      }
    } else {
      // OR
      currentFilteredWords = currentFilteredWords.filter((word) => {
        return (
          word.words_tags.values &&
          word.words_tags.values.some((tag) => tagsArray.includes(tag.ts_id))
        )
      })
    }
  }
  // 第三次用 ws_is_important ws_is_common 篩選 接續第二個篩選結果 OR AND NONE
  if (choiceOperator === 'none') {
    // NONE
    return currentFilteredWords.filter((word) => {
      return word.ws_is_important === false && word.ws_is_common === false
    })
  } else if (choiceArray && choiceArray.length > 0) {
    // AND
    if (choiceOperator && choiceOperator === 'and' && choiceArray.length >= 1) {
      return currentFilteredWords.filter((word) => {
        if (
          choiceArray.includes('ws_is_important') &&
          choiceArray.includes('ws_is_common')
        ) {
          return word.ws_is_important === true && word.ws_is_common === true
        } else if (choiceArray.includes('ws_is_important')) {
          return word.ws_is_important === true && word.ws_is_common === false
        } else if (choiceArray.includes('ws_is_common')) {
          return word.ws_is_important === false && word.ws_is_common === true
        } else {
          return currentFilteredWords
        }
      })
    } else {
      // OR
      return currentFilteredWords.filter((word) => {
        if (
          choiceArray.includes('ws_is_important') &&
          choiceArray.includes('ws_is_common')
        ) {
          return word.ws_is_important === true || word.ws_is_common === true
        } else if (choiceArray.includes('ws_is_important')) {
          return word.ws_is_important === true
        } else if (choiceArray.includes('ws_is_common')) {
          return word.ws_is_common === true
        } else {
          return currentFilteredWords
        }
      })
    }
  } else {
    return currentFilteredWords
  }
}

export function generalFilterArticles(
  articles: Article[],
  keyword: string,
  options: string[],
  tagsArray: number[],
  tagsOperator: string
) {
  let currentFiltered = []
  // 第一次 關鍵字
  if (keyword && options && options.length > 0) {
    currentFiltered = Object.keys(articles)
      .filter((key: string) => {
        const article = articles[key]
        return options.some(
          (option) => article[option] && article[option].includes(keyword)
        )
      })
      .map((key) => ({
        key,
        ...articles[key]
      }))
  } else {
    currentFiltered = Object.keys(articles).map((key) => ({
      key,
      ...articles[key]
    }))
  }
  // 第二次用 tags 篩選 接續第一個篩選結果
  if (tagsOperator === 'none') {
    // NONE
    currentFiltered = currentFiltered.filter((article) => {
      return (
        !article.articles_tags.values ||
        article.articles_tags.values.length === 0
      )
    })
  } else if (tagsArray && tagsArray.length > 0) {
    // AND
    if (tagsOperator && tagsOperator === 'and' && tagsArray.length >= 1) {
      // length = 1
      if (tagsArray.length === 1) {
        currentFiltered = currentFiltered.filter((article) => {
          return (
            article.articles_tags.values &&
            article.articles_tags.values.length === tagsArray.length &&
            tagsArray.every((tag) =>
              article.articles_tags.values.some((t) => t.ts_id === tag)
            )
          )
        })
      } else {
        // length > 1
        currentFiltered = currentFiltered.filter((article) => {
          return (
            article.articles_tags.values &&
            article.articles_tags.values.length >= tagsArray.length &&
            tagsArray.every((tag) =>
              article.articles_tags.values.some((t) => t.ts_id === tag)
            )
          )
        })
      }
    } else {
      // OR
      currentFiltered = currentFiltered.filter((article) => {
        return (
          article.articles_tags.values &&
          article.articles_tags.values.some((tag) =>
            tagsArray.includes(tag.ts_id)
          )
        )
      })
    }
  }
  return currentFiltered
}
