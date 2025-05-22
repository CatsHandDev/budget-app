"use client"

import type React from "react"

import { useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Divider from "@mui/material/Divider"
import LinearProgress from "@mui/material/LinearProgress"
import { Plus, CheckCircle } from "lucide-react"
import type { Challenge } from "../App"

interface ExpenseTrackingPageProps {
  challenge: Challenge | null
  onAddExpense: (amount: number, description: string) => void
  onUpdateExpense: (id: string, amount: number, description: string) => void
  onDeleteExpense: (id: string) => void
  onCompleteChallenge: () => void
}

export default function ExpenseTrackingPage({
  challenge,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  onCompleteChallenge,
}: ExpenseTrackingPageProps) {
  const [amount, setAmount] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState<string>("")
  const [editDescription, setEditDescription] = useState<string>("")

  if (!challenge) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <Typography variant="h6">まずは予算設定タブで予算を設定してください</Typography>
      </Box>
    )
  }

  const totalSpent = challenge.expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remaining = challenge.actualBudget - totalSpent
  const percentSpent = (totalSpent / challenge.actualBudget) * 100

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const expenseAmount = Number.parseFloat(amount)
    if (!isNaN(expenseAmount) && expenseAmount > 0 && description.trim()) {
      onAddExpense(expenseAmount, description.trim())
      setAmount("")
      setDescription("")
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: 'calc(100vh - 56px)',
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          今日の予算: ¥{challenge.actualBudget.toLocaleString()}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2">使用額: ¥{totalSpent.toLocaleString()}</Typography>
            <Typography variant="body2">残額: ¥{remaining.toLocaleString()}</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(percentSpent, 100)}
            color={percentSpent > 100 ? "error" : "primary"}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="金額"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              InputProps={{
                startAdornment: "¥",
              }}
              fullWidth
              required
            />
            <TextField
              label="内容"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              required
            />
            <Button type="submit" variant="contained" color="primary" startIcon={<Plus />} fullWidth>
              支出を追加
            </Button>
          </Box>
        </form>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6">支出履歴</Typography>
          <Button variant="outlined" color="success" startIcon={<CheckCircle />} onClick={onCompleteChallenge}>
            完了
          </Button>
        </Box>

        {challenge.expenses.length === 0 ? (
          <Typography variant="body2" sx={{ textAlign: "center", py: 2 }}>
            まだ支出がありません
          </Typography>
        ) : (
          <List sx={{ width: "100%" }}>
            {challenge.expenses.map((expense, index) => (
              <Box key={expense.id}>
                {index > 0 && <Divider component="li" />}
                <ListItem>
                  {editingId === expense.id ? (
                    <Box sx={{ width: "100%" }}>
                      <TextField
                        label="金額"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        type="number"
                        fullWidth
                        sx={{ mb: 1 }}
                      />
                      <TextField
                        label="内容"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        fullWidth
                        sx={{ mb: 1 }}
                      />
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            const updatedAmount = Number.parseFloat(editAmount)
                            if (!isNaN(updatedAmount) && editDescription.trim()) {
                              onUpdateExpense(expense.id, updatedAmount, editDescription.trim())
                              setEditingId(null)
                            }
                          }}
                        >
                          保存
                        </Button>
                        <Button variant="outlined" onClick={() => setEditingId(null)}>キャンセル</Button>
                      </Box>
                    </Box>
                  ) : (
                    <>
                      <ListItemText
                        primary={expense.description}
                        secondary={new Date(expense.timestamp).toLocaleTimeString("ja-JP", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      />
                      <Typography variant="body1" sx={{ fontWeight: "bold", mr: 2 }}>
                        ¥{expense.amount.toLocaleString()}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          setEditingId(expense.id)
                          setEditAmount(expense.amount.toString())
                          setEditDescription(expense.description)
                        }}
                      >
                        編集
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => onDeleteExpense(expense.id)}
                        sx={{ ml: 1 }}
                      >
                        削除
                      </Button>
                    </>
                  )}
                </ListItem>
              </Box>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  )
}
