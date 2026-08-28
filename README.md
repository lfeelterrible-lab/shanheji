# 山河记 · GeoCard China

一个离线优先的中国地理单卡学习 App，使用 Expo Router、React Native、TypeScript、Zustand 与本地持久化构建。

## 启动

```bash
npm install
npx expo start
```

Web 预览：

```bash
npx expo start --web
```

GitHub Pages 构建会读取 `EXPO_BASE_URL`，并把静态产物放到 `dist/client`。仓库工作流会自动发布到 `/shanheji/`。

## 目录说明

- `app/`：四个主 Tab、学习流程与知识卡详情路由
- `components/`：单卡答题、地图定位、知识卡、因果链等 UI
- `data/china-geography.json`：可直接替换或追加的原创地理卡片数据
- `lib/scheduler.ts`：间隔复习调度
- `lib/storage.ts` / `lib/storage.native.ts` / `lib/storage.web.ts`：本地持久化适配层（Native 使用 SQLite，Web 使用浏览器离线存储）
- `store/useStudyStore.ts`：学习进度、会话、统计与主题状态

当前 Demo 包含 44 张覆盖中国位置、地形、气候、河流、农业、人口、工业交通与区域地理的卡片。
