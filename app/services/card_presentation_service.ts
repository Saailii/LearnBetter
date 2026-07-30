interface CardForPresentation {
  type: string
  front: string
  back: string
  repetitions: number
}

const CLOZE_PATTERN = /\{\{(.+?)\}\}/g
const CLOZE_DETECTION_PATTERN = /\{\{(.+?)\}\}/

export function presentReviewCard(card: CardForPresentation) {
  if (card.type === 'reversible' && card.repetitions % 2 === 1) {
    return { question: card.back, answer: card.front }
  }

  if (card.type === 'cloze' && CLOZE_DETECTION_PATTERN.test(card.front)) {
    const question = card.front.replace(CLOZE_PATTERN, '[…]')
    const completedText = card.front.replace(CLOZE_PATTERN, '$1')
    const answer = card.back ? `${completedText}\n${card.back}` : completedText
    return { question, answer }
  }

  return { question: card.front, answer: card.back }
}
