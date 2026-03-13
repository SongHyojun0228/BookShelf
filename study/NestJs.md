***[ 🏛️ 1. 현재 구조 vs NestJS 도입 후 구조 ]***

- 지금 상태 (BaaS 방식):
React (프론트엔드) ↔ Supabase (데이터베이스 + API)
React에서 직접 Supabase 라이브러리를 통해 데이터를 읽고 씁니다. 중간에 서버가 없습니다. (쉽고 빠르지만, 복잡한 로직을 구현하거나 보안을 관리하기 까다로울 수 있습니다.)

- NestJS 도입 후 상태 (3Tier 방식):
React (프론트엔드) ↔ NestJS (백엔드 서버) ↔ Supabase (또는 일반 PostgreSQL DB)
React는 데이터베이스에 직접 접근하지 못하고, 오직 NestJS에게 "내 서재 목록 좀 줘" 라고 HTTP 요청(API 호출)만 합니다.
NestJS가 중간에서 요청을 검사하고, 복잡한 비즈니스 로직(예: 권한 체크 등)을 처리한 뒤 대신 데이터베이스에서 데이터를 꺼내와 React에게 돌려줍니다.

***[ 💻 2. 폴더 구조는 어떻게 해야 할까? ]***
NestJS는 프론트엔드(React)와는 완전히 분리된 별도의 프로그램(서버)입니다. 따라서 보통 폴더를 두 개로 나누어 관리합니다.

최상위 폴더/
├── bookshelf-frontend/  (👈 지금 개발 중이신 React + Vite 프로젝트)
└── bookshelf-backend/   (👈 여기에 새롭게 NestJS 프로젝트를 만듭니다!)

***[ 🚀 3. NestJS 도입 가이드 (맛보기 순서) ]***
나중에 실제로 도입하실 때 거치게 될 대략적인 순서입니다!

- 1단계: NestJS 프로젝트 생성하기 터미널을 열고 프론트엔드 폴더 밖으로 나가서, NestJS 생성 명령어를 칩니다.
npx @nestjs/cli new bookshelf-backend

- 2단계: Prisma ORM 세팅 (가장 많이 쓰는 조합) 
아까 "Prisma 써야 해?" 라고 물어보셨었죠? NestJS 서버가 데이터베이스와 소통할 때 SQL 쿼리문을 직접 짜지 않고 자바스크립트 코드로 쉽게 조작하게 해주는 아주 찰떡궁합인 도구가 바로 Prisma입니다. NestJS 프로젝트 안에서 Prisma를 세팅하고, 우리가 Supabase에서 만든 DB 주소를 연결해 줍니다.

- 3단계: API 컨트롤러(Controller) 만들기 NestJS 안에서 books.controller.ts 같은 파일을 만듭니다.
// 백엔드 (NestJS)
@Controller('books')
export class BooksController {
  @Get('my-shelf') // GET /books/my-shelf 로 요청이 오면
  getMyBooks() {
    return this.prisma.myLibrary.findMany(); // DB에서 책 찾아서 리턴해라!
  }
}

- 4단계: React에서 호출하기 방향 전환 
이제 Searchpage.tsx 나 Myshelf.tsx 에서 데이터를 가져올 때, 프론트엔드 코드에서 supabase.from('books') 대신, 우리가 만든 NestJS 서버(예: localhost:3000)로 API 요청을 보냅니다.
// 프론트엔드 (React)
const response = await fetch('http://localhost:3000/books/my-shelf');
const myBooks = await response.json();
