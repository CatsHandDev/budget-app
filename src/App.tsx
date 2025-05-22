"use client"

import { useState, useEffect } from "react"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import Box from "@mui/material/Box"
import BottomNavigation from "@mui/material/BottomNavigation"
import BottomNavigationAction from "@mui/material/BottomNavigationAction"
import Paper from "@mui/material/Paper"
import { Calculator, History, Receipt } from "lucide-react"
import { theme } from "./lib/theme"
import BudgetSettingPage from "./components/budgetSettingPage"
import ExpenseTrackingPage from "./components/expenseTrackingPage"
import ChallengeHistoryPage from "./components/challengeHistoryPage"
import {
  saveChallengesToStorage,
  loadChallengesFromStorage,
  saveCurrentChallengeToStorage,
  loadCurrentChallengeFromStorage
} from "./lib/localStorage"

export type Expense = {
  id: string
  amount: number
  description: string
  timestamp: Date
}

export type Challenge = {
  id: string
  minBudget: number
  maxBudget: number
  actualBudget: number
  date: Date
  expenses: Expense[]
  completed: boolean
}

export default function Home() {
  const [value, setValue] = useState(0)
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 初回レンダリング時にローカルストレージからデータを読み込む
  useEffect(() => {
    const loadStoredData = () => {
      const storedChallenges = loadChallengesFromStorage()
      const storedCurrentChallenge = loadCurrentChallengeFromStorage()

      setChallenges(storedChallenges)
      setCurrentChallenge(storedCurrentChallenge)

      // もし進行中のチャレンジがあれば、支出記録タブに移動
      if (storedCurrentChallenge) {
        setValue(1)
      }

      setIsLoading(false)
    }

    loadStoredData()
  }, [])

  // チャレンジリストが変更されたらローカルストレージに保存
  useEffect(() => {
    if (!isLoading) {
      saveChallengesToStorage(challenges)
    }
  }, [challenges, isLoading])

  // 現在のチャレンジが変更されたらローカルストレージに保存
  useEffect(() => {
    if (!isLoading) {
      saveCurrentChallengeToStorage(currentChallenge)

      // デバッグ用
      if (currentChallenge) {
        console.log("Current Challenge Updated:", currentChallenge)
      }
    }
  }, [currentChallenge, isLoading])

  const handleCreateChallenge = (minBudget: number, maxBudget: number, actualBudget: number) => {
    console.log("Creating challenge with:", { minBudget, maxBudget, actualBudget })

    // 直接オブジェクトを作成して状態を更新
    setCurrentChallenge({
      id: Date.now().toString(),
      minBudget,
      maxBudget,
      actualBudget,
      date: new Date(),
      expenses: [],
      completed: false,
    })

    // タブを切り替える前に少し遅延を入れる
    setTimeout(() => {
      setValue(1) // Switch to expense tracking page
    }, 100)
  }

  const handleAddExpense = (amount: number, description: string) => {
    if (!currentChallenge) return

    const newExpense: Expense = {
      id: Date.now().toString(),
      amount,
      description,
      timestamp: new Date(),
    }

    setCurrentChallenge((prev) => {
      if (!prev) return null
      return {
        ...prev,
        expenses: [...prev.expenses, newExpense],
      }
    })
  }

  const handleCompleteChallenge = () => {
    if (!currentChallenge) return

    setChallenges((prev) => [
      {
        ...currentChallenge,
        completed: true,
      },
      ...prev,
    ])

    setCurrentChallenge(null)
    setValue(0) // Return to budget setting page
  }

  // 1件削除処理
  const handleDeleteChallenge = (id: string) => {
    const updated = challenges.filter(c => c.id !== id)
    setChallenges(updated)
    setChallenges(updated)
  }

  // 全件削除処理
  const handleDeleteAllChallenges = () => {
    setChallenges([])
    setChallenges([])
  }

  // 支出の編集
  const handleUpdateExpense = (id: string, amount: number, description: string) => {
    if (!currentChallenge) return

    setCurrentChallenge(prev => {
      if (!prev) return null

      const updatedExpenses = prev.expenses.map(expense =>
        expense.id === id ? { ...expense, amount, description } : expense
      )

      return {
        ...prev,
        expenses: updatedExpenses,
      }
    })
  }

  // 支出の削除
  const handleDeleteExpense = (id: string) => {
    if (!currentChallenge) return

    setCurrentChallenge(prev => {
      if (!prev) return null

      const filteredExpenses = prev.expenses.filter(expense => expense.id !== id)

      return {
        ...prev,
        expenses: filteredExpenses,
      }
    })
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: 'hidden',
        }}
      >
        <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
          {value === 0 && (
            <BudgetSettingPage
              onCreateChallenge={handleCreateChallenge}
              hasActiveChallenge={currentChallenge !== null}
              onNavigateToExpenses={() => setValue(1)}
            />
          )}
          {value === 1 && currentChallenge && (
            <ExpenseTrackingPage
              challenge={currentChallenge}
              onAddExpense={handleAddExpense}
              onUpdateExpense={handleUpdateExpense}
              onDeleteExpense={handleDeleteExpense}
              onCompleteChallenge={handleCompleteChallenge}
            />
          )}
          {value === 2 &&
            <ChallengeHistoryPage
              challenges={challenges}
              onDeleteChallenge={handleDeleteChallenge}
              onDeleteAllChallenges={handleDeleteAllChallenges}
            />
          }
        </Box>
        <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(_, newValue) => {
              // 進行中のチャレンジがある場合、予算設定タブをクリックすると支出記録タブに移動
              if (newValue === 0 && currentChallenge) {
                setValue(1)
              } else {
                setValue(newValue)
              }
            }}
          >
            <BottomNavigationAction label="予算設定" icon={<Calculator />} />
            <BottomNavigationAction label="支出記録" icon={<Receipt />} disabled={!currentChallenge} />
            <BottomNavigationAction label="履歴" icon={<History />} />
          </BottomNavigation>
        </Paper>
      </Box>
    </ThemeProvider>
  )
}