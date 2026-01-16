# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

bingo_goal_app - 年度別目標ビンゴ管理Webアプリ。AIPMフレームワークに基づく個人開発プロジェクト。

現在のフェーズ: 計画・設計（Sense → Focus → Discovery完了、実装待機中）

## Directory Structure

- **Flow/**: 作業中ドキュメント（タイムスタンプ付き: YYYYMM/YYYY-MM-DD/）
  - 1_sense/: マーケット調査
  - 2_focus/: 戦略定義（Lean Canvas, OKR, 市場規模）
  - 3_discovery/: 設計（ペルソナ, 課題定義, ストーリーマップ, UIワイヤーフレーム）
- **Stock/**: 完成ドキュメントのアーカイブ
- **.claude/settings.local.json**: プロジェクト固有のClaude権限設定

## AIPM Workflow

このプロジェクトはAIPM（AI-driven Product Management）スキルを使用:

1. `/aipm-1-initialize` - プロジェクト初期化
2. `/aipm-2-research` - 市場調査・競合分析
3. `/aipm-3-strategy` - 戦略策定（Lean Canvas, OKR）
4. `/aipm-4-design` - 設計（ペルソナ, ストーリーマップ, UI）
5. `/aipm-5-development` - 実装・テスト

## Technical Decisions (Planned)

- Platform: Web（レスポンシブ、モバイルファースト）
- Framework: SvelteKit or Next.js（未決定）
- Design tokens: Primary #4F46E5, Success #10B981, Incomplete #E5E7EB, Bingo line #FBBF24
