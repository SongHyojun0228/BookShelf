# 📓 BookShelf — 프로젝트 전체 명세서

---

## 1. 프로젝트 개요

**프로젝트명:** BookShelf — 나만의 도서 우주

**한 줄 설명:** Google Books API로 도서를 검색하고, 내 서재에 담고, 리뷰를 쓰고, 다른 사람의 서재를 탐색하는 풀스택 도서 플랫폼

**기술 스택:** React + TypeScript + Apollo Client + CSS (Frontend) / Supabase Auth + PostgreSQL + Storage + GraphQL (Backend) / Google Books API (외부)

**목적:** Supabase, GraphQL, React, TypeScript를 전부 다룰 줄 안다는 걸 포트폴리오로 증명

---

## 2. 파일/폴더 구조

```
src/
├── components/
│   ├── common/          # Button, Modal, SearchBar, StarRating, Badge,
│   │                      Avatar, Loader, EmptyState, Tabs, FilterChip,
│   │                      ProgressBar, InfiniteScroll, Input
│   ├── book/            # BookCard, BookCover, BookListItem, BookMeta
│   ├── review/          # ReviewCard, ReviewForm, ReviewList
│   ├── shelf/           # ShelfCard, ShelfStatusSelect, TagFilter
│   ├── layout/          # Sidebar, TopBar, AppLayout, ProtectedRoute
│   ├── community/       # FeedItem, UserCard, FollowButton
│   └── stats/           # MonthlyChart, GenrePieChart, GoalProgress, ReadingStreak
├── pages/
│   ├── auth/            # LoginPage, SignupPage
│   ├── home/            # HomePage
│   ├── search/          # SearchPage
│   ├── book-detail/     # BookDetailPage
│   ├── my-shelf/        # MyShelfPage
│   ├── stats/           # StatsPage
│   ├── community/       # CommunityPage
│   └── profile/         # ProfilePage, ProfileEditPage
├── hooks/               # useAuth, useBooks, useShelf, useReviews,
│                          useFollow, useLike, useStats, useTags,
│                          useDebounce, useInfiniteScroll
├── graphql/
│   ├── queries/         # bookQueries, shelfQueries, reviewQueries,
│   │                      userQueries, statsQueries, communityQueries
│   ├── mutations/       # shelfMutations, reviewMutations, followMutations,
│   │                      likeMutations, profileMutations, tagMutations
│   ├── subscriptions/   # feedSubscriptions
│   └── fragments/       # bookFragments, reviewFragments, userFragments
├── types/               # book, review, shelf, user, tag, feed, stats
├── utils/               # formatDate, parseBookData, calculateStats,
│                          uploadImage, truncateText
├── constants/           # routes, shelfStatus, genres, queryKeys
├── lib/                 # supabase.ts, apolloClient.ts
└── styles/              # globals.css
```

---

## 3. 코딩 컨벤션

### 파일명

- 폴더: `kebab-case` → `my-shelf`, `book-detail`
- 컴포넌트: `PascalCase.tsx` → `BookCard.tsx`, `ReviewModal.tsx`
- 훅: `useCamelCase.ts` → `useBooks.ts`, `useAuth.ts`
- 유틸: `camelCase.ts` → `formatDate.ts`
- 타입: `camelCase.types.ts` → `book.types.ts`
- GraphQL: `camelCase.ts` → `bookQueries.ts`, `shelfMutations.ts`

### 변수/함수

- 변수: `camelCase` → `bookList`, `currentUser`, `isLoading`
- 함수: `camelCase` + 동사 시작 → `fetchBooks()`, `handleSubmit()`
- Boolean: `is/has/should` 접두어 → `isLoggedIn`, `hasReview`
- 상수: `UPPER_SNAKE_CASE` → `MAX_RATING`, `API_BASE_URL`

### 타입

- 타입/인터페이스: `PascalCase` 접두어 없음 → `Book`, `Review`, `ShelfItem`
- Props: `컴포넌트명 + Props` → `BookCardProps`, `ReviewFormProps`
- Enum: `PascalCase` + 멤버도 `PascalCase` → `ShelfStatus.Reading`

### React

- 이벤트 핸들러 내부: `handle + 동작` → `handleClick`
- 이벤트 핸들러 Props: `on + 동작` → `onClick`
- 컴포넌트 하나당 파일 하나, 200줄 넘으면 분리

### Git

- 브랜치: `feature/기능명`, `fix/버그명` → `feature/auth`, `fix/shelf-status-bug`
- 커밋: `feat: 도서 검색 페이지 구현` / `fix:` / `style:` / `refactor:` / `docs:`
- PR: 기능 단위, 제목에 기능 명시

### 기타

- 들여쓰기: 2칸 (space)
- 세미콜론: 없음
- 따옴표: 작은따옴표 `'`
- import 순서: 외부 라이브러리 → 내부 모듈 → 타입 → 스타일 (빈 줄 구분)
- `any` 금지 — 모르겠으면 `unknown` 쓰고 나중에 타입 좁히기

---

## 4. 페이지별 기능 상세

### /login, /signup — 인증

- 이메일 + 비밀번호 회원가입/로그인
- Google 소셜 로그인
- 비로그인 시 서재/리뷰/커뮤니티 접근 차단 (ProtectedRoute)

### / — 홈

- 이번 달 독서 목표 프로그레스바
- 베스트셀러 목록 (Google Books API 인기 도서)
- 팔로잉 유저들의 최신 리뷰 피드
- 빠른 액션 버튼 (이어 읽기, 새 책 찾기)

### /search — 도서 검색

- 검색바 (제목/저자/ISBN)
- 카테고리 필터 칩 (전체, 소설, 자기계발, 과학, 역사, 에세이)
- 검색 결과 리스트 (표지, 제목, 저자, 출판 정보, 평점)
- 각 결과에 "서재에 담기" / "상세 보기" 버튼
- 무한스크롤 페이지네이션

### /book/:id — 도서 상세

- 도서 정보 (표지, 제목, 저자, 출판사, 출간일, ISBN, 카테고리, 줄거리)
- "읽을 책에 담기" / "리뷰 쓰기" / "좋아요" 버튼
- 해당 도서의 리뷰 목록 (최신순/좋아요순 정렬)
- 각 리뷰에 좋아요 + 작성일 표시

### /my/shelf — 내 서재

- 탭 3개: 읽는 중 / 읽을 책 / 읽은 책
- 서재 내 검색바
- 태그 필터 (#자기계발, #소설 등)
- 각 카드: 표지 + 제목 + 저자 + 상태 뱃지 + 진행률 + 태그
- 상태 변경 (읽을 → 읽는 중 → 읽은)
- 리뷰 쓰기 버튼
- 하단 간단 통계 요약 (이번 달 독서량, 평균 완독 기간, 최다 장르, 연간 달성률)

### /my/stats — 독서 통계

- 연간 목표 프로그레스바 (24권 중 N권)
- 이번 달 완독 수 + 지난 달 대비
- 독서 스트릭 (연속 독서일)
- 월별 독서량 바 차트 (Recharts)
- 장르 비율 파이 차트
- 최근 완독 도서 리스트 (완독 소요일 + 별점)

### /community — 커뮤니티

- 탭: 팔로잉 피드 / 인기 리뷰 / 추천 유저
- 피드 아이템: 유저 아바타 + 액션 (서재 담기, 리뷰 작성, 완독 등) + 상세 + 시간 + 좋아요
- 우측 사이드: 추천 유저 목록 (팔로우 버튼) + 인기 도서 랭킹

### /user/:id — 유저 프로필

- 프로필 헤더: 아바타 + 닉네임 + 소개 + 읽은 책/리뷰/팔로워/팔로잉 수
- 팔로우 / 메시지 버튼
- 탭: 서재 / 리뷰 / 좋아요
- 서재 미리보기 (책 카드 + 상태 뱃지)
- 최근 리뷰 목록

### /profile/edit — 프로필 수정

- 아바타 이미지 업로드
- 닉네임, 소개글 수정
- 연간 독서 목표 설정

---

## 5. DB 스키마

| 테이블 | 주요 컬럼 | 설명 |
| --- | --- | --- |
| profiles | id, username, avatar_url, bio, created_at | Auth와 1:1 연결. 공개 프로필 정보 |
| books | id, google_books_id, title, author, cover_url, isbn, category, description, page_count | Google Books에서 가져온 도서 정보 캐싱 |
| shelves | id, user_id, book_id, status (want/reading/done), rating, current_page, started_at, finished_at | 사용자별 서재. status로 읽을/읽는/읽은 구분 |
| reviews | id, user_id, book_id, rating, content, image_url, created_at | 별점 + 텍스트 리뷰. 이미지 첨부 가능 |
| tags | id, name | 사용자 정의 태그 (예: 자기계발, SF) |
| shelf_tags | shelf_id, tag_id | 서재 ↔ 태그 다대다 관계 |
| follows | follower_id, following_id, created_at | 사용자 간 팔로우 관계 |
| likes | id, user_id, review_id, created_at | 리뷰 좋아요 |

### RLS (Row Level Security) 정책

- profiles: 모든 사용자 읽기 가능 / 본인만 수정
- shelves: 본인 + 팔로워만 읽기 / 본인만 CRUD
- reviews: 모두 읽기 가능 / 본인만 작성·수정·삭제
- follows: 본인만 팔로우/언팔로우
- likes: 본인만 좋아요/취소

---

## 6. GraphQL API 명세

### Queries

```graphql
# 도서 검색 (Google Books API 래핑)
searchBooks(query: String!, filter: String, page: Int): BookConnection

# 도서 상세 (Google Books ID로 조회)
book(googleBooksId: String!): Book

# 베스트셀러 목록
bestSellers(category: String): [Book]

# 내 서재 조회
myShelf(status: ShelfStatus, tag: String, search: String): [ShelfItem]

# 특정 유저 서재 조회
userShelf(userId: ID!, status: ShelfStatus): [ShelfItem]

# 도서별 리뷰 목록
bookReviews(bookId: ID!, sort: ReviewSort, page: Int): ReviewConnection

# 유저별 리뷰 목록
userReviews(userId: ID!): [Review]

# 유저 프로필
user(userId: ID!): User

# 내 프로필
me: User

# 팔로워/팔로잉 목록
followers(userId: ID!): [User]
following(userId: ID!): [User]

# 커뮤니티 피드 (팔로잉 유저 활동)
communityFeed(page: Int): FeedConnection

# 인기 리뷰
popularReviews(page: Int): ReviewConnection

# 추천 유저
suggestedUsers: [User]

# 독서 통계
myStats(year: Int): Stats

# 태그 목록
myTags: [Tag]
```

### Mutations

```graphql
# ── 서재 ──
addToShelf(googleBooksId: String!, status: ShelfStatus!): ShelfItem
updateShelfStatus(shelfId: ID!, status: ShelfStatus!): ShelfItem
updateShelfProgress(shelfId: ID!, currentPage: Int!): ShelfItem
removeFromShelf(shelfId: ID!): Boolean

# ── 리뷰 ──
createReview(bookId: ID!, rating: Int!, content: String!, imageFile: Upload): Review
updateReview(reviewId: ID!, rating: Int, content: String, imageFile: Upload): Review
deleteReview(reviewId: ID!): Boolean

# ── 좋아요 ──
toggleLike(reviewId: ID!): LikeResult

# ── 팔로우 ──
toggleFollow(userId: ID!): FollowResult

# ── 태그 ──
addTagToShelf(shelfId: ID!, tagName: String!): ShelfItem
removeTagFromShelf(shelfId: ID!, tagId: ID!): ShelfItem

# ── 프로필 ──
updateProfile(username: String, bio: String, avatarFile: Upload): User
updateGoal(year: Int!, target: Int!): Stats
```

### Subscriptions

```graphql
# 팔로잉 유저 새 활동 실시간
onNewFeedItem: FeedItem
```

### Types

```graphql
type Book {
  id: ID!
  googleBooksId: String!
  title: String!
  author: String!
  coverUrl: String
  isbn: String
  category: String
  description: String
  pageCount: Int
  publishedDate: String
  publisher: String
  averageRating: Float
  reviewCount: Int
}

type ShelfItem {
  id: ID!
  book: Book!
  status: ShelfStatus!
  rating: Int
  currentPage: Int
  startedAt: DateTime
  finishedAt: DateTime
  tags: [Tag]
  createdAt: DateTime!
}

enum ShelfStatus {
  WANT
  READING
  DONE
}

type Review {
  id: ID!
  user: User!
  book: Book!
  rating: Int!
  content: String!
  imageUrl: String
  likeCount: Int!
  isLikedByMe: Boolean!
  createdAt: DateTime!
}

type User {
  id: ID!
  username: String!
  avatarUrl: String
  bio: String
  bookCount: Int!
  reviewCount: Int!
  followerCount: Int!
  followingCount: Int!
  isFollowedByMe: Boolean
}

type Tag {
  id: ID!
  name: String!
}

type FeedItem {
  id: ID!
  user: User!
  action: FeedAction!
  book: Book
  review: Review
  createdAt: DateTime!
}

enum FeedAction {
  ADDED_TO_SHELF
  FINISHED_BOOK
  WROTE_REVIEW
  RATED_BOOK
}

type Stats {
  year: Int!
  goalTarget: Int!
  goalCurrent: Int!
  monthlyBooks: [MonthlyCount]
  genreDistribution: [GenreCount]
  currentStreak: Int!
  longestStreak: Int!
  averageDaysToFinish: Float
  recentlyFinished: [ShelfItem]
}

type MonthlyCount {
  month: Int!
  count: Int!
}

type GenreCount {
  genre: String!
  count: Int!
  percentage: Float!
}

type BookConnection {
  items: [Book]
  totalCount: Int!
  hasNextPage: Boolean!
}

type ReviewConnection {
  items: [Review]
  totalCount: Int!
  hasNextPage: Boolean!
}

type FeedConnection {
  items: [FeedItem]
  hasNextPage: Boolean!
}

type LikeResult {
  liked: Boolean!
  likeCount: Int!
}

type FollowResult {
  followed: Boolean!
  followerCount: Int!
}

enum ReviewSort {
  LATEST
  POPULAR
}
```