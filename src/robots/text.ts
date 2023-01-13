import wiki from 'wikijs'
import { Content } from "../models";

export async function robot(content: Content) {
  await fetchContentFromWikipedia(content)
  sanitizeContent(content)
  breakContentIntoSentences(content)

  async function fetchContentFromWikipedia(content: Content) {
    const page = await wiki().page(content.searchTerm)
    const summary = await page.summary()
    content.sourceContentOriginal = summary
  }

  function sanitizeContent(content: Content) {
    const withoutDatesInParenthesis = removeDatesInParenthesis(
      content.sourceContentOriginal
    )

    content.sourceContentSanitized = withoutDatesInParenthesis
  }

  function removeDatesInParenthesis(text: string) {
    return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
  }

  function breakContentIntoSentences(content: Content) {
    content.sentences = []
    
    const sentences = content.sourceContentSanitized
      .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
      .split("|")
    
    sentences.forEach(sentence => {
      content.sentences.push({
        text: sentence,
        keywords: [],
        images: []
      })
    })
  }

}