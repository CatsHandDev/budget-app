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

  // デバッグ用
  useEffect(() => {
    if (currentChallenge) {
      console.log("Current Challenge Updated:", currentChallenge)
    }
  }, [currentChallenge])

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          maxWidth: "100%",
          // pb: 7,
          display: "flex",
          flexDirection: "column",
          overflow: 'hidden',
        }}
      >
        <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
          {value === 0 && <BudgetSettingPage onCreateChallenge={handleCreateChallenge} />}
          {value === 1 && currentChallenge && (
            <ExpenseTrackingPage
              challenge={currentChallenge}
              onAddExpense={handleAddExpense}
              onCompleteChallenge={handleCompleteChallenge}
            />
          )}
          {value === 2 && <ChallengeHistoryPage challenges={challenges} />}
        </Box>
        <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(_, newValue) => {
              setValue(newValue)
            }}
          >
            <BottomNavigationAction label="予算設定" icon={<Calculator />} />
            <BottomNavigationAction label="支出記録" icon={<Receipt />} />
            <BottomNavigationAction label="履歴" icon={<History />} />
          </BottomNavigation>
        </Paper>
      </Box>
    </ThemeProvider>
  )
}
