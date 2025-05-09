"use client"

import type React from "react"

import { useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Divider from "@mui/material/Divider"
import Chip from "@mui/material/Chip"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { ChevronDown, Trash2, AlertTriangle } from "lucide-react"
import type { Challenge } from "../App"

interface ChallengeHistoryPageProps {
  challenges: Challenge[]
  onDeleteChallenge?: (challengeId: string) => void
  onDeleteAllChallenges?: () => void
}

export default function ChallengeHistoryPage({
  challenges,
  onDeleteChallenge,
  onDeleteAllChallenges
}: ChallengeHistoryPageProps) {
  const [expanded, setExpanded] = useState<string | false>(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false)
  const [challengeToDelete, setChallengeToDelete] = useState<string | null>(null)

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  const handleDeleteClick = (challengeId: string, event: React.MouseEvent) => {
    event.stopPropagation() // アコーディオンの開閉を防止
    setChallengeToDelete(challengeId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (challengeToDelete && onDeleteChallenge) {
      onDeleteChallenge(challengeToDelete)
    }
    setDeleteDialogOpen(false)
    setChallengeToDelete(null)
  }

  const handleDeleteAllClick = () => {
    setDeleteAllDialogOpen(true)
  }

  const handleDeleteAllConfirm = () => {
    if (onDeleteAllChallenges) {
      onDeleteAllChallenges()
    }
    setDeleteAllDialogOpen(false)
  }

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false)
    setChallengeToDelete(null)

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }

  if (challenges.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <Typography variant="h6">チャレンジ履歴がありません</Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: 'calc(100vh - 56px)',
        display: "flex",
        flexDirection: "column",
        gap: 3 }}
      >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 1 }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
          チャレンジ履歴
        </Typography>
        <Button
          startIcon={<Trash2 size={18} />}
          color="error"
          onClick={handleDeleteAllClick}
          size="small"
          variant="outlined"
        >
          すべて削除
        </Button>
      </Box>

      {challenges.map((challenge) => {
        const totalSpent = challenge.expenses.reduce((sum, expense) => sum + expense.amount, 0)
        const remaining = challenge.actualBudget - totalSpent
        const isOverBudget = remaining < 0

        return (
          <Accordion
            key={challenge.id}
            expanded={expanded === challenge.id}
            onChange={handleChange(challenge.id)}
            sx={{ borderRadius: 2, overflow: "hidden" }}
          >
            <AccordionSummary
              expandIcon={<ChevronDown />}
              sx={{ px: 3 }}
              aria-label={`チャレンジ ${new Date(challenge.date).toLocaleDateString("ja-JP")}`}
            >
              <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <Typography variant="subtitle1">{new Date(challenge.date).toLocaleDateString("ja-JP")}</Typography>
                  <Chip
                    label={isOverBudget ? "予算超過" : "予算内"}
                    color={isOverBudget ? "error" : "success"}
                    size="small"
                  />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <Typography variant="body2">予算: ¥{challenge.actualBudget.toLocaleString()}</Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: isOverBudget ? "error.main" : "success.main" }}
                  >
                    残額: ¥{remaining.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, py: 0 }}>
              <List sx={{ width: "100%" }}>
                {challenge.expenses.map((expense, index) => (
                  <Box key={expense.id}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem>
                      <ListItemText
                        primary={expense.description}
                        secondary={new Date(expense.timestamp).toLocaleTimeString("ja-JP", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      />
                      <Typography variant="body1">¥{expense.amount.toLocaleString()}</Typography>
                    </ListItem>
                  </Box>
                ))}
              </List>
            </AccordionDetails>
            <Box sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              p: 1,
              bgcolor: 'background.paper',
              borderTop: '1px solid',
              borderColor: 'divider'
            }}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(challenge.id, e);
                }}
                aria-label="削除"
                color="error"
              >
                <Trash2 size={16} />
              </IconButton>
            </Box>
          </Accordion>
        )
      })}

      {/* 個別削除の確認ダイアログ */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        keepMounted={false}
      >
        <DialogTitle id="delete-dialog-title">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AlertTriangle color="error" size={20} />
            チャレンジの削除
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            このチャレンジ履歴を削除してもよろしいですか？この操作は元に戻せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            キャンセル
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            削除する
          </Button>
        </DialogActions>
      </Dialog>

      {/* 全件削除の確認ダイアログ */}
      <Dialog
        open={deleteAllDialogOpen}
        onClose={() => setDeleteAllDialogOpen(false)}
        aria-labelledby="delete-all-dialog-title"
        aria-describedby="delete-all-dialog-description"
      >
        <DialogTitle id="delete-all-dialog-title">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AlertTriangle color="error" size={20} />
            すべてのチャレンジを削除
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-all-dialog-description">
            すべてのチャレンジ履歴を削除してもよろしいですか？この操作は元に戻せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAllDialogOpen(false)} color="primary">
            キャンセル
          </Button>
          <Button onClick={handleDeleteAllConfirm} color="error" variant="contained">
            すべて削除する
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}