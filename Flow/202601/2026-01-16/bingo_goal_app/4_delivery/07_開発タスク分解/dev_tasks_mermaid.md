# 開発タスク依存関係図

## ストーリー依存関係

```mermaid
flowchart TD
    subgraph 基盤
        FND001[FND001: プロジェクト初期設定]
    end

    subgraph EP001[EP001: ビンゴボード管理]
        ST001[ST001: ボード作成]
        ST002[ST002: ボード一覧]
        ST003[ST003: 年度切替]
        ST004[ST004: ボード削除]
    end

    subgraph EP002[EP002: 目標管理]
        ST005[ST005: 目標入力]
        ST006[ST006: 達成マーク]
        ST007[ST007: 進捗表示]
    end

    subgraph EP003[EP003: 達成演出]
        ST008[ST008: ビンゴ演出]
        ST009[ST009: 複数ビンゴ]
    end

    subgraph EP004[EP004: データ永続化]
        ST010[ST010: 自動保存]
    end

    FND001 --> ST001
    ST001 --> ST005
    ST001 --> ST010
    ST005 --> ST006
    ST006 --> ST007
    ST006 --> ST008
    ST008 --> ST009
    ST001 --> ST002
    ST002 --> ST003
    ST002 --> ST004
```

## フェーズ別実装順序

```mermaid
gantt
    title MVP実装フェーズ
    dateFormat  YYYY-MM-DD
    section Phase1 基盤
    技術選定・初期設定    :p1, 2026-01-16, 1d
    デザイントークン      :p2, after p1, 1d
    共通コンポーネント    :p3, after p2, 1d

    section Phase2 コア機能
    ボード型定義・状態管理 :p4, after p3, 1d
    BingoGrid実装         :p5, after p4, 1d
    目標入力モーダル       :p6, after p5, 1d
    自動保存実装          :p7, after p5, 1d

    section Phase3 達成機能
    達成トグル            :p8, after p6, 1d
    進捗表示              :p9, after p8, 1d

    section Phase4 演出
    ビンゴ判定ロジック     :p10, after p9, 1d
    達成アニメーション     :p11, after p10, 2d

    section Phase5 管理機能
    ボード一覧            :p12, after p11, 1d
    年度切替・削除        :p13, after p12, 1d
```

## タスク詳細依存関係

```mermaid
flowchart LR
    subgraph FND001[基盤タスク]
        T1[T1: 技術選定]
        T2[T2: ディレクトリ構成]
        T3[T3: デザイントークン]
        T4[T4: 共通コンポーネント]
        T1 --> T2 --> T3 --> T4
    end

    subgraph ST001[ST001: ボード作成]
        S1T1[T1: 型定義]
        S1T2[T2: 状態管理]
        S1T3[T3: Grid UI]
        S1T4[T4: 作成フロー]
        S1T1 --> S1T2
        S1T1 --> S1T3
        S1T2 --> S1T4
        S1T3 --> S1T4
    end

    subgraph ST005[ST005: 目標入力]
        S5T1[T1: Modal UI]
        S5T2[T2: タップ処理]
        S5T3[T3: 保存処理]
        S5T1 --> S5T2 --> S5T3
    end

    subgraph ST006[ST006: 達成マーク]
        S6T1[T1: トグル機能]
        S6T2[T2: スタイリング]
        S6T1 --> S6T2
    end

    subgraph ST008[ST008: ビンゴ演出]
        S8T1[T1: 判定ロジック]
        S8T2[T2: ラインハイライト]
        S8T3[T3: 祝福オーバーレイ]
        S8T1 --> S8T2
        S8T1 --> S8T3
    end

    T4 --> S1T1
    T4 --> S1T3
    T4 --> S5T1
    S1T2 --> S5T3
    S5T3 --> S6T1
    S6T1 --> S8T1
```

## クリティカルパス

```mermaid
flowchart LR
    classDef critical fill:#ff6b6b,stroke:#333,color:#fff
    classDef normal fill:#4ecdc4,stroke:#333

    A[FND001: 基盤]:::critical --> B[ST001: ボード作成]:::critical
    B --> C[ST005: 目標入力]:::critical
    C --> D[ST006: 達成マーク]:::critical
    D --> E[ST008: ビンゴ演出]:::critical

    B --> F[ST010: 自動保存]:::normal
    D --> G[ST007: 進捗表示]:::normal
    E --> H[ST009: 複数ビンゴ]:::normal
    B --> I[ST002: 一覧]:::normal
    I --> J[ST003: 年度切替]:::normal
    I --> K[ST004: 削除]:::normal
```

## Epic別タスク構成

| Epic | Stories | Tasks | 推定時間 |
|------|---------|-------|---------|
| 基盤 | 1 | 4 | 5h |
| EP001: ビンゴボード管理 | 4 | 10 | 7.5h |
| EP002: 目標管理 | 3 | 7 | 5h |
| EP003: 達成演出 | 2 | 5 | 6h |
| EP004: データ永続化 | 1 | 3 | 2h |
| 合計 | 11 | 29 | 25.5h |
