"use client"

import { useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Slider from "@mui/material/Slider"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import { Dices } from "lucide-react"

interface BudgetSettingPageProps {
  onCreateChallenge: (minBudget: number, maxBudget: number, actualBudget: number) => void
}

export default function BudgetSettingPage({ onCreateChallenge }: BudgetSettingPageProps) {
  const [maxBudget, setMaxBudget] = useState<number>(5000)
  const [minBudget, setMinBudget] = useState<number>(1000)
  const [actualBudget, setActualBudget] = useState<number | null>(null)

  const handleGenerateBudget = () => {
    // Generate a random budget between min and max budget
    const randomBudget = Math.floor(Math.random() * (maxBudget - minBudget + 1)) + minBudget
    setActualBudget(randomBudget)
  }

  const handleStartChallenge = () => {
    if (actualBudget) {
      onCreateChallenge(minBudget, maxBudget, actualBudget)
    }
  }

  return (
    <Box
      sx={{
      width: '100%',
      height: '100vh',
      maxWidth: "100%",
      display: "flex",
      flexDirection: "column",
      gap: 3,
      mx: "auto" }}
    >
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        {/* <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
          予算チャレンジ
        </Typography>
        <Typography variant="body1" gutterBottom align="center" sx={{ mb: 3 }}>
          上限を設定して、ランダムな予算内で1日を過ごしましょう！
        </Typography> */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            marginBottom: 3,
            borderRadius: 2,
            textAlign: "center",
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            color: "white",
          }}
        >
          <Typography variant="h6" gutterBottom>
            今日の予算
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: "bold" }}>
            ¥{actualBudget && actualBudget.toLocaleString()}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            size="large"
            onClick={handleStartChallenge}
            sx={{ mt: 2 }}
          >
            チャレンジ開始
          </Button>
        </Paper>

        <Typography variant="h6" gutterBottom>
          予算範囲を設定
        </Typography>
        <Box sx={{ px: 2, mt: 4, mb: 5 }}>
          <Slider
            value={[minBudget, maxBudget]}
            onChange={(_, newValue) => {
              const [newMin, newMax] = newValue as number[]
              setMinBudget(newMin)
              setMaxBudget(newMax)
            }}
            min={500}
            max={10000}
            step={100}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `¥${value.toLocaleString()}`}
            getAriaLabel={(index) => (index === 0 ? "予算下限" : "予算上限")}
            sx={{ flexGrow: 1 }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                下限
              </Typography>
              <TextField
                value={minBudget}
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value)
                  if (!isNaN(value) && value >= 500 && value <= maxBudget) {
                    setMinBudget(value)
                  }
                }}
                type="number"
                size="small"
                InputProps={{
                  startAdornment: "¥",
                  inputProps: { min: 500, max: maxBudget },
                }}
                sx={{ width: 120 }}
              />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                上限
              </Typography>
              <TextField
                value={maxBudget}
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value)
                  if (!isNaN(value) && value >= minBudget && value <= 10000) {
                    setMaxBudget(value)
                  }
                }}
                type="number"
                size="small"
                InputProps={{
                  startAdornment: "¥",
                  inputProps: { min: minBudget, max: 10000 },
                }}
                sx={{ width: 120 }}
              />
            </Box>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          startIcon={<Dices />}
          onClick={handleGenerateBudget}
          sx={{ mb: 3 }}
        >
          予算を決定する
        </Button>

        {/* {actualBudget && (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              textAlign: "center",
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              color: "white",
            }}
          >
            <Typography variant="h6" gutterBottom>
              今日の予算
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: "bold" }}>
              ¥{actualBudget.toLocaleString()}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              size="large"
              onClick={handleStartChallenge}
              sx={{ mt: 2 }}
            >
              チャレンジ開始
            </Button>
          </Paper>
        )} */}
      </Paper>
    </Box>
  )
}
