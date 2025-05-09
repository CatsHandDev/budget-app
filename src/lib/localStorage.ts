import type { Challenge } from "../App"

const CHALLENGES_STORAGE_KEY = "okozukai-challenges"
const CURRENT_CHALLENGE_STORAGE_KEY = "okozukai-current-challenge"

// チャレンジ履歴の保存
export const saveChallengesToStorage = (challenges: Challenge[]): void => {
  try {
    // 日付オブジェクトをシリアライズするため、JSON文字列に変換
    const serializedChallenges = JSON.stringify(challenges)
    localStorage.setItem(CHALLENGES_STORAGE_KEY, serializedChallenges)
  } catch (error) {
    console.error("Failed to save challenges to local storage:", error)
  }
}

// チャレンジ履歴の読み込み
export const loadChallengesFromStorage = (): Challenge[] => {
  try {
    const serializedChallenges = localStorage.getItem(CHALLENGES_STORAGE_KEY)
    if (!serializedChallenges) return []

    // JSON文字列をパースしてデータを復元
    const challenges = JSON.parse(serializedChallenges) as Challenge[]

    // 日付をDate型に変換し直す
    return challenges.map(challenge => ({
      ...challenge,
      date: new Date(challenge.date),
      expenses: challenge.expenses.map(expense => ({
        ...expense,
        timestamp: new Date(expense.timestamp)
      }))
    }))
  } catch (error) {
    console.error("Failed to load challenges from local storage:", error)
    return []
  }
}

// 特定のチャレンジを削除する
export const deleteChallengeFromStorage = (challengeId: string): Challenge[] => {
  try {
    const challenges = loadChallengesFromStorage()
    const updatedChallenges = challenges.filter(challenge => challenge.id !== challengeId)
    saveChallengesToStorage(updatedChallenges)
    return updatedChallenges
  } catch (error) {
    console.error("Failed to delete challenge from local storage:", error)
    return loadChallengesFromStorage() // エラー時は現在の状態を返す
  }
}

// すべてのチャレンジ履歴を削除する
export const deleteAllChallengesFromStorage = (): void => {
  try {
    localStorage.removeItem(CHALLENGES_STORAGE_KEY)
  } catch (error) {
    console.error("Failed to delete all challenges from local storage:", error)
  }
}

// 現在進行中のチャレンジの保存
export const saveCurrentChallengeToStorage = (challenge: Challenge | null): void => {
  try {
    if (challenge === null) {
      localStorage.removeItem(CURRENT_CHALLENGE_STORAGE_KEY)
      return
    }

    const serializedChallenge = JSON.stringify(challenge)
    localStorage.setItem(CURRENT_CHALLENGE_STORAGE_KEY, serializedChallenge)
  } catch (error) {
    console.error("Failed to save current challenge to local storage:", error)
  }
}

// 現在進行中のチャレンジの読み込み
export const loadCurrentChallengeFromStorage = (): Challenge | null => {
  try {
    const serializedChallenge = localStorage.getItem(CURRENT_CHALLENGE_STORAGE_KEY)
    if (!serializedChallenge) return null

    const challenge = JSON.parse(serializedChallenge) as Challenge

    // 日付をDate型に変換し直す
    return {
      ...challenge,
      date: new Date(challenge.date),
      expenses: challenge.expenses.map(expense => ({
        ...expense,
        timestamp: new Date(expense.timestamp)
      }))
    }
  } catch (error) {
    console.error("Failed to load current challenge from local storage:", error)
    return null
  }
}

// ストレージをクリア（デバッグ用）
export const clearStorage = (): void => {
  try {
    localStorage.removeItem(CHALLENGES_STORAGE_KEY)
    localStorage.removeItem(CURRENT_CHALLENGE_STORAGE_KEY)
  } catch (error) {
    console.error("Failed to clear local storage:", error)
  }
}