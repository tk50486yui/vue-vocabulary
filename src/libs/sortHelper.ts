import { Word } from '@/interfaces/Words'
export function sortedWords(words: Word[], sortBy: string[]) {
  return words.slice().sort((a: Word, b: Word) => {
    if (sortBy[0] === 'ws_forget_count' && sortBy.length === 2) {
      if (sortBy[1] === 'asc') {
        const forgetA = a.ws_forget_count !== undefined ? a.ws_forget_count : 0
        const forgetB = b.ws_forget_count !== undefined ? b.ws_forget_count : 0
        return forgetA - forgetB
      } else {
        const forgetA = a.ws_forget_count !== undefined ? a.ws_forget_count : 0
        const forgetB = b.ws_forget_count !== undefined ? b.ws_forget_count : 0
        return forgetB - forgetA
      }
    } else if (sortBy[0] === 'created_at' && sortBy.length === 2) {
      const dateA = new Date(a.created_at)
      const dateB = new Date(b.created_at)
      if (sortBy[1] === 'asc') {
        return dateA.getTime() - dateB.getTime()
      } else {
        return dateB.getTime() - dateA.getTime()
      }
    } else if (sortBy[0] === 'words_tags_length' && sortBy.length === 2) {
      const tagsLengthA = a.words_tags.array.length
      const tagsLengthB = b.words_tags.array.length
      if (sortBy[1] === 'asc') {
        return tagsLengthA - tagsLengthB
      } else {
        return tagsLengthB - tagsLengthA
      }
    }
    return 0
  })
}
