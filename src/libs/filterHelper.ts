import { Word } from '@/interfaces/Words'
import { Article } from '@/interfaces/Articles'
import { normalizeJa } from '@/libs/dataHelper'

export function generalFilterWords(
  words: Word[],
  keyword: string,
  options: string[],
  cateId: number,
  tagsArray: number[],
  tagsOperator: string,
  choiceArray: string[],
  choiceOperator: string
) {
  let currentFilteredWords = [] as Word[]

  currentFilteredWords = [...words]

  const normalizedKeyword = normalizeJa(keyword)

  // 1. 搜尋篩選 - 關鍵字
  if (keyword && options && options.length > 0) {
    currentFilteredWords = Object.entries(currentFilteredWords)
      .filter(([, word]) => {
        return options.some((option) => {
          const optionValue = word[option as keyof Word]
          if (typeof optionValue === 'string' || optionValue === null) {
            return optionValue && normalizeJa(optionValue).includes(normalizedKeyword)
          }
          return false
        })
      })
      .map(([key, value]) => ({
        key,
        ...value
      }))
  } else {
    currentFilteredWords = Object.entries(currentFilteredWords).map(([key, value]) => ({
      key,
      ...value
    }))
  }

  // 2. Category ID 篩選，接續上一個篩選結果
  if (cateId !== 0) {
    currentFilteredWords = currentFilteredWords.filter((word) => {
      return word.cate_id === cateId
    })
  }

  // 3. Tags 篩選，接續上一個篩選結果
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
            tagsArray.every((tag) => word.words_tags.values.some((t) => t.ts_id === tag))
          )
        })
      } else {
        // length > 1
        currentFilteredWords = currentFilteredWords.filter((word) => {
          return (
            word.words_tags.values &&
            word.words_tags.values.length >= tagsArray.length &&
            tagsArray.every((tag) => word.words_tags.values.some((t) => t.ts_id === tag))
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
  // 4. ws_is_important ws_is_common 篩選，接續上一個篩選結果
  if (choiceOperator === 'none') {
    // NONE
    return currentFilteredWords.filter((word) => {
      return word.ws_is_important === false && word.ws_is_common === false
    })
  } else if (choiceArray && choiceArray.length > 0) {
    // AND
    if (choiceOperator && choiceOperator === 'and' && choiceArray.length >= 1) {
      return currentFilteredWords.filter((word) => {
        if (choiceArray.includes('ws_is_important') && choiceArray.includes('ws_is_common')) {
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
        if (choiceArray.includes('ws_is_important') && choiceArray.includes('ws_is_common')) {
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
  cateId: number,
  tagsArray: number[],
  tagsOperator: string
) {
  let currentFiltered = []
  // 1. 關鍵字
  if (keyword && options && options.length > 0) {
    currentFiltered = Object.entries(articles)
      .filter(([, article]) => {
        return options.some((option) => {
          const optionValue = article[option as keyof Article]
          if (typeof optionValue === 'string' || optionValue === null) {
            return optionValue && optionValue.includes(keyword)
          }
          return false
        })
      })
      .map(([key, value]) => ({
        key,
        ...value
      }))
  } else {
    currentFiltered = Object.entries(articles).map(([key, value]) => ({
      key,
      ...value
    }))
  }

  // 2. Category ID 篩選，接續上一個篩選結果
  if (cateId !== 0) {
    currentFiltered = currentFiltered.filter((article) => {
      return article.cate_id === cateId
    })
  }

  // 3. Tags 篩選，接續上一個篩選結果
  if (tagsOperator === 'none') {
    // NONE
    currentFiltered = currentFiltered.filter((article) => {
      return !article.articles_tags.values || article.articles_tags.values.length === 0
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
            tagsArray.every((tag) => article.articles_tags.values.some((t) => t.ts_id === tag))
          )
        })
      } else {
        // length > 1
        currentFiltered = currentFiltered.filter((article) => {
          return (
            article.articles_tags.values &&
            article.articles_tags.values.length >= tagsArray.length &&
            tagsArray.every((tag) => article.articles_tags.values.some((t) => t.ts_id === tag))
          )
        })
      }
    } else {
      // OR
      currentFiltered = currentFiltered.filter((article) => {
        return (
          article.articles_tags.values &&
          article.articles_tags.values.some((tag) => tagsArray.includes(tag.ts_id))
        )
      })
    }
  }
  return currentFiltered
}
