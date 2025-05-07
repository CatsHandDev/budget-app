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
import { ChevronDown } from "lucide-react"
import type { Challenge } from "../App"

interface ChallengeHistoryPageProps {
  challenges: Challenge[]
}

export default function ChallengeHistoryPage({ challenges }: ChallengeHistoryPageProps) {
  const [expanded, setExpanded] = useState<string | false>(false)

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  if (challenges.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <Typography variant="h6">チャレンジ履歴がありません</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
        チャレンジ履歴
      </Typography>

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
            <AccordionSummary expandIcon={<ChevronDown />} sx={{ px: 3 }}>
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
          </Accordion>
        )
      })}
    </Box>
  )
}
