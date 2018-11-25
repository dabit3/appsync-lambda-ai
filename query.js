const translate = `query getTranslatedSentence($sentence: String!, $code: String!) {
  getTranslatedSentence(sentence: $sentence, code: $code) {
    sentence
    translatedText
  }
}`

export default translate