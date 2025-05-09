"use client"

import { useState, ChangeEvent } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Slider from "@mui/material/Slider"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import { styled } from "@mui/material/styles"
import { Dices, Lock, Unlock, ArrowRight, ArrowLeft, Receipt } from "lucide-react"

// カスタムスライダーのスタイリング
const CustomSlider = styled(Slider)(({ theme }) => ({
  // 固定された下限のスタイル
  '&[data-min-locked="true"] .MuiSlider-thumb:first-of-type': {
    backgroundColor: theme.palette.grey[400],
    border: `2px solid ${theme.palette.primary.main}`,
  },
  // 固定された上限のスタイル
  '&[data-max-locked="true"] .MuiSlider-thumb:last-of-type': {
    backgroundColor: theme.palette.grey[400],
    border: `2px solid ${theme.palette.primary.main}`,
  },
}))

interface BudgetSettingPageProps {
  onCreateChallenge: (minBudget: number, maxBudget: number, actualBudget: number) => void
  hasActiveChallenge?: boolean
  onNavigateToExpenses?: () => void
}

export default function BudgetSettingPage({
  onCreateChallenge,
  hasActiveChallenge = false,
  onNavigateToExpenses
}: BudgetSettingPageProps) {
  const [maxBudget, setMaxBudget] = useState<number>(10000)
  const [minBudget, setMinBudget] = useState<number>(3000)
  const [actualBudget, setActualBudget] = useState<number | null>(null)
  const [isMinLocked, setIsMinLocked] = useState<boolean>(false)
  const [isMaxLocked, setIsMaxLocked] = useState<boolean>(false)

  // 表示用のフォーマット済み文字列の状態
  const [minBudgetInput, setMinBudgetInput] = useState<string>(minBudget.toLocaleString())
  const [maxBudgetInput, setMaxBudgetInput] = useState<string>(maxBudget.toLocaleString())

  const handleGenerateBudget = () => {
    // 上限と下限が同じ場合は、その値を予算とする
    if (minBudget === maxBudget) {
      setActualBudget(minBudget)
      return
    }

    // 上限と下限が異なる場合は、ランダムな予算を生成
    const randomBudget = Math.floor(Math.random() * (maxBudget - minBudget + 1)) + minBudget
    console.log("Generated random budget:", randomBudget)
    setActualBudget(randomBudget)
  }

  const handleStartChallenge = () => {
    if (actualBudget) {
      // 明示的にactualBudgetをログ出力
      console.log("Starting challenge with budget:", actualBudget)
      // 明示的にactualBudgetを渡す
      onCreateChallenge(minBudget, maxBudget, actualBudget)
    }
  }

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    const [newMin, newMax] = newValue as number[]

    // 固定されていない場合のみ値を更新
    if (!isMinLocked) {
      setMinBudget(newMin)
      setMinBudgetInput(newMin.toLocaleString())
    }

    if (!isMaxLocked) {
      setMaxBudget(newMax)
      setMaxBudgetInput(newMax.toLocaleString())
    }

    // 予算が既に生成されている場合、範囲変更時にリセット
    if (actualBudget !== null) {
      setActualBudget(null)
    }
  }

  // 下限入力フィールドの変更ハンドラ
  const handleMinBudgetChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isMinLocked) return;

    const inputValue = e.target.value.replace(/[¥,\s]/g, '');
    setMinBudgetInput(inputValue);

    const parsedValue = parseInt(inputValue);
    if (!isNaN(parsedValue) && parsedValue >= 100 && parsedValue <= 100000) {
      // 有効な値の場合のみ状態を更新
      setMinBudget(parsedValue);
      // 既に予算が生成されている場合はリセット
      if (actualBudget !== null) {
        setActualBudget(null);
      }
    }
  }

  // 上限入力フィールドの変更ハンドラ
  const handleMaxBudgetChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isMaxLocked) return;

    const inputValue = e.target.value.replace(/[¥,\s]/g, '');
    setMaxBudgetInput(inputValue);

    const parsedValue = parseInt(inputValue);
    if (!isNaN(parsedValue) && parsedValue >= 100 && parsedValue <= 100000) {
      // 有効な値の場合のみ状態を更新
      setMaxBudget(parsedValue);
      // 既に予算が生成されている場合はリセット
      if (actualBudget !== null) {
        setActualBudget(null);
      }
    }
  }

  // 入力フィールドのフォーカスが外れた時の処理
  const handleBlur = () => {
    // 不正な値が入力された場合、有効な値に戻す
    setMinBudgetInput(minBudget.toLocaleString());
    setMaxBudgetInput(maxBudget.toLocaleString());
  }

  // 下限を上限に合わせる
  const handleAlignMinToMax = () => {
    setMinBudget(maxBudget)
    setMinBudgetInput(maxBudget.toLocaleString())
    if (actualBudget !== null) {
      setActualBudget(null)
    }
  }

  // 上限を下限に合わせる
  const handleAlignMaxToMin = () => {
    setMaxBudget(minBudget)
    setMaxBudgetInput(minBudget.toLocaleString())
    if (actualBudget !== null) {
      setActualBudget(null)
    }
  }

  // スライダーの値を計算（固定されている場合は固定値を使用）
  const sliderValue = [
    isMinLocked ? minBudget : Math.min(minBudget, maxBudget),
    isMaxLocked ? maxBudget : Math.max(minBudget, maxBudget),
  ]

  // 進行中のチャレンジがある場合
  if (hasActiveChallenge) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mx: "auto", textAlign: "center" }}>
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
            チャレンジ進行中
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            現在進行中のチャレンジがあります
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            size="large"
            startIcon={<Receipt />}
            onClick={onNavigateToExpenses}
          >
            支出記録に進む
          </Button>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mx: "auto" }}>
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
          今日のおこづかい
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
          disabled={actualBudget === null}
        >
          チャレンジ開始
        </Button>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, pb: 0, borderRadius: 2 }}>
        <Typography variant="body1" gutterBottom align="center" sx={{ mb: 3 }}>
          予算を設定して、おこづかい内で1日を過ごしましょう！
        </Typography>

        <Box sx={{ px: 2, mt: 4, mb: 5 }}>
          <CustomSlider
            value={sliderValue}
            onChange={handleSliderChange}
            min={100}
            max={30000}
            step={100}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `¥${value.toLocaleString()}`}
            getAriaLabel={(index) => (index === 0 ? "予算下限" : "予算上限")}
            sx={{ flexGrow: 1 }}
            disabled={isMinLocked && isMaxLocked} // 両方固定されている場合は無効化
            data-min-locked={isMinLocked ? "true" : "false"}
            data-max-locked={isMaxLocked ? "true" : "false"}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Box>
              <Box sx={{ display: "flex", justifyContent: 'space-between', alignItems: "center", mb: 1 }}>
                <Tooltip title={isMinLocked ? "固定解除" : "固定"}>
                  <IconButton
                    size="small"
                    onClick={() => setIsMinLocked(!isMinLocked)}
                    color={isMinLocked ? "primary" : "default"}
                  >
                    {isMinLocked ? <Lock size={16} /> : <Unlock size={16} />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="上限に合わせる">
                  <IconButton size="small" onClick={handleAlignMinToMax}>
                    <ArrowRight size={16} />
                  </IconButton>
                </Tooltip>
              </Box>
              <TextField
                value={minBudgetInput}
                onChange={handleMinBudgetChange}
                onBlur={handleBlur}
                InputProps={{
                  startAdornment: "¥",
                  readOnly: isMinLocked,
                }}
                size="small"
                sx={{ width: 120 }}
              />
            </Box>
            <Box>
              <Box sx={{ display: "flex", justifyContent: 'space-between', alignItems: "center", mb: 1 }}>
                <Tooltip title="下限に合わせる">
                  <IconButton size="small" onClick={handleAlignMaxToMin}>
                    <ArrowLeft size={16} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={isMaxLocked ? "固定解除" : "固定"}>
                  <IconButton
                    size="small"
                    onClick={() => setIsMaxLocked(!isMaxLocked)}
                    color={isMaxLocked ? "primary" : "default"}
                  >
                    {isMaxLocked ? <Lock size={16} /> : <Unlock size={16} />}
                  </IconButton>
                </Tooltip>
              </Box>
              <TextField
                value={maxBudgetInput}
                onChange={handleMaxBudgetChange}
                onBlur={handleBlur}
                InputProps={{
                  startAdornment: "¥",
                  readOnly: isMaxLocked,
                }}
                size="small"
                sx={{ width: 120, ml: "auto" }}
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
          disabled={actualBudget !== null}
        >
          {minBudget === maxBudget ? "この金額で決定する" : "予算をランダムに決定する"}
        </Button>
      </Paper>
    </Box>
  )
}