# DevOps/SRE 학습 로드맵

## 목차
1. [학습 전략](#학습-전략)
2. [핵심 개념 설명](#핵심-개념-설명)
3. [환경 세팅 (M2 맥북)](#환경-세팅-m2-맥북)
4. [3개월 병행 플랜](#3개월-병행-플랜)
5. [학습 자료](#학습-자료)
6. [적성 판단 기준](#적성-판단-기준)

---

## 학습 전략

### ✅ 추천: 지금 당장 병행
- **독서기록장 프로젝트 = DevOps 실습 재료**
- 개발하면서 자연스럽게 DevOps 배우기
- 평일: React/Next/NestJS 개발
- 주말: DevOps 한 단계씩 (3-4시간)

### ❌ 비추천: 완성 후 시작
- 3-5개월 후 동기 떨어짐
- 배포할 앱 없이 DevOps 배우면 추상적
- 시간 낭비 가능성 높음

---

## 핵심 개념 설명

### 1. Docker
**"컨테이너: 앱을 포장하는 표준 상자"**

#### 왜 필요한가?
- "내 컴퓨터에선 되는데요?" 문제 해결
- 개발/테스트/운영 환경 통일
- Node.js, MongoDB 버전 충돌 방지

#### 핵심 개념
```bash
# 이미지 (Image): 앱의 설계도
docker build -t my-app .

# 컨테이너 (Container): 실행 중인 앱
docker run -p 3000:3000 my-app

# 레지스트리: 이미지 저장소 (Docker Hub)
docker push myuser/my-app
```

#### 실제 예시
```dockerfile
# Dockerfile
FROM node:18-alpine          # Node.js 환경
WORKDIR /app                 # 작업 디렉토리
COPY package*.json ./        # 의존성 파일 복사
RUN npm install              # 설치
COPY . .                     # 소스 코드 복사
EXPOSE 3000                  # 포트 열기
CMD ["npm", "start"]         # 실행 명령
```

**비유:** Docker = 앱을 배송하는 컨테이너 (어디서든 똑같이 작동)

---

### 2. Docker Compose
**"여러 컨테이너를 한 번에 관리"**

#### 왜 필요한가?
- 프론트엔드 + 백엔드 + DB를 따로 실행하기 귀찮음
- 한 명령으로 전체 스택 실행/종료
- 개발 환경 공유 쉬움

#### 핵심 개념
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:           # React 앱
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
  
  backend:            # NestJS 앱
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - DB_URL=mongodb://mongo:27017/bookdb
    depends_on:
      - mongo
  
  mongo:              # MongoDB
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

#### 사용법
```bash
# 전체 스택 실행
docker-compose up

# 백그라운드 실행
docker-compose up -d

# 종료
docker-compose down

# 로그 확인
docker-compose logs -f backend
```

**비유:** Docker Compose = 오케스트라 지휘자 (여러 악기를 동시에 연주)

---

### 3. Kubernetes (K8s)
**"수백 개의 컨테이너를 자동으로 관리"**

#### 왜 필요한가?
- 서버 100대에 컨테이너 배포 자동화
- 컨테이너 죽으면 자동 재시작
- 트래픽 많으면 자동 확장 (Auto Scaling)
- 로드 밸런싱 자동

#### 핵심 개념
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: book-app
spec:
  replicas: 3              # 3개 복제본 실행
  selector:
    matchLabels:
      app: book-app
  template:
    metadata:
      labels:
        app: book-app
    spec:
      containers:
      - name: book-app
        image: myuser/book-app:latest
        ports:
        - containerPort: 3000
---
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: book-app-service
spec:
  type: LoadBalancer
  selector:
    app: book-app
  ports:
  - port: 80
    targetPort: 3000
```

#### 주요 개념
- **Pod**: 가장 작은 배포 단위 (1개 이상 컨테이너)
- **Deployment**: Pod를 관리 (복제, 업데이트)
- **Service**: Pod에 접근하는 방법 (로드 밸런서)
- **ConfigMap/Secret**: 설정/비밀 정보 관리

**비유:** K8s = 자동화된 데이터센터 관리자

---

### 4. AWS (Amazon Web Services)
**"클라우드: 남의 컴퓨터 빌려쓰기"**

#### 왜 필요한가?
- 내 컴퓨터는 24시간 켤 수 없음
- 서버 고장나면? 트래픽 폭증하면?
- AWS가 알아서 처리

#### DevOps에서 주로 쓰는 서비스

**EC2 (Elastic Compute Cloud)**
```bash
# 가상 서버 (컴퓨터 한 대)
- 용도: 앱 배포, Docker 실행
- 비유: 클라우드에 있는 컴퓨터 한 대 빌리기
- 가격: 프리티어 1년 무료 (t2.micro)
```

**RDS (Relational Database Service)**
```bash
# 관리형 데이터베이스
- 용도: PostgreSQL, MySQL 자동 관리
- 장점: 백업, 복구, 업데이트 자동
- 비유: DB 전담 관리자 고용
```

**S3 (Simple Storage Service)**
```bash
# 파일 저장소
- 용도: 이미지, 동영상, 백업 저장
- 특징: 무제한 용량, 저렴함
- 비유: 구글 드라이브 같은 거
```

**ECS/EKS**
```bash
# 컨테이너 실행 서비스
- ECS: AWS의 컨테이너 관리 (쉬움)
- EKS: AWS의 Kubernetes (강력함)
```

**CloudWatch**
```bash
# 모니터링 서비스
- 로그 수집, 메트릭 확인
- 알람 설정 (CPU 90% 넘으면 알림)
```

#### 실습 예시
```bash
# EC2에 Docker 앱 배포
1. EC2 인스턴스 생성 (Ubuntu)
2. SSH 접속
3. Docker 설치
4. docker run -p 80:3000 myapp
5. 브라우저에서 공인 IP 접속
```

**비유:** AWS = 렌탈 데이터센터

---

### 5. CI/CD (Continuous Integration / Continuous Deployment)
**"코드 푸시하면 자동으로 배포까지"**

#### 왜 필요한가?
- 수동 배포는 실수 많고 느림
- 개발자는 코딩만, 배포는 자동화
- 테스트 자동 실행 → 버그 조기 발견

#### 흐름
```
개발자가 Git Push
    ↓
GitHub Actions 감지
    ↓
자동 테스트 실행 (npm test)
    ↓
테스트 통과?
    ↓
Docker 이미지 빌드
    ↓
Docker Hub에 푸시
    ↓
EC2 서버가 새 이미지 다운로드
    ↓
기존 컨테이너 종료 → 새 컨테이너 시작
    ↓
배포 완료! 🎉
```

#### GitHub Actions 예시
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: 테스트 실행
      run: |
        npm install
        npm test
    
    - name: Docker 이미지 빌드
      run: |
        docker build -t myuser/book-app:latest .
    
    - name: Docker Hub 푸시
      run: |
        echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
        docker push myuser/book-app:latest
    
    - name: EC2 배포
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.EC2_HOST }}
        username: ubuntu
        key: ${{ secrets.EC2_KEY }}
        script: |
          docker pull myuser/book-app:latest
          docker stop book-app || true
          docker rm book-app || true
          docker run -d --name book-app -p 80:3000 myuser/book-app:latest
```

#### 주요 도구
- **GitHub Actions**: GitHub 내장 (무료, 쉬움)
- **GitLab CI**: GitLab 내장
- **Jenkins**: 오픈소스, 강력하지만 복잡
- **CircleCI**: 유료, 빠름

**비유:** CI/CD = 자동 배송 시스템 (주문하면 자동으로 배달)

---

## 환경 세팅 (M2 맥북)

### 1. Docker Desktop 설치 (5분)

```bash
# Homebrew로 설치 (추천)
brew install --cask docker

# 또는 공식 사이트 다운로드
# https://www.docker.com/products/docker-desktop/
```

**설치 확인:**
```bash
docker --version
# Docker version 24.0.6, build ...

docker-compose --version
# Docker Compose version v2.23.0
```

**M2 맥북 주의사항:**
- ✅ Docker Desktop은 Apple Silicon 네이티브 지원
- ✅ 대부분의 이미지도 ARM64 지원
- ⚠️ 일부 오래된 이미지는 Rosetta로 실행 (느림)

---

### 2. AWS CLI 설치 (선택, 나중에)

```bash
# AWS CLI 설치
brew install awscli

# 설치 확인
aws --version

# 설정 (AWS 계정 필요)
aws configure
```

---

### 3. kubectl 설치 (선택, K8s 배울 때)

```bash
# kubectl 설치
brew install kubectl

# minikube 설치 (로컬 K8s 클러스터)
brew install minikube

# 설치 확인
kubectl version --client
minikube version
```

---

## 3개월 병행 플랜

### Week 1-2: Docker 기초
**목표:** React 앱을 Docker로 실행

**실습 (주말 4시간):**
1. Docker Desktop 설치
2. Dockerfile 작성
3. `docker build`, `docker run` 명령 실습
4. 독서앱을 Docker로 실행

**학습 자료:**
- Docker 공식 Get Started: https://docs.docker.com/get-started/
- 생활코딩 Docker (한글): https://www.youtube.com/watch?v=Ps8HDIAyPD0

**결과물:**
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

### Week 3-4: docker-compose
**목표:** 여러 컨테이너를 한 번에 관리

**실습 (주말 3시간):**
1. docker-compose.yml 작성
2. Frontend + Backend + DB 동시 실행
3. 환경변수로 설정 관리

**결과물:**
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
  
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - MONGO_URL=mongodb://mongo:27017/bookdb
    depends_on:
      - mongo
  
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

---

### Month 2: AWS EC2 배포
**목표:** 독서앱을 실제 인터넷에 올리기

**실습 (주말 4시간 × 3주 = 12시간):**

**Week 5: EC2 기초**
```bash
1. AWS 계정 생성 (프리티어)
2. EC2 인스턴스 생성 (Ubuntu t2.micro)
3. SSH 접속
4. Docker 설치
5. 독서앱 실행 (docker run)
```

**Week 6: 도메인 + HTTPS**
```bash
1. Nginx 리버스 프록시 설정
2. 도메인 연결 (Route 53 또는 외부)
3. Let's Encrypt SSL 인증서
4. HTTPS로 접속
```

**Week 7: 모니터링**
```bash
1. CloudWatch 로그 설정
2. CPU/메모리 사용량 확인
3. 알람 설정 (80% 넘으면 이메일)
```

**학습 자료:**
- AWS Skill Builder (무료): https://skillbuilder.aws/
- "AWS로 시작하는 인프라 구축의 정석" (책, 한글)

---

### Month 3: CI/CD 자동화
**목표:** Git Push → 자동 배포

**실습 (주말 4시간 × 3주 = 12시간):**

**Week 8-9: GitHub Actions**
```yaml
# .github/workflows/deploy.yml 작성
1. 코드 푸시 감지
2. 테스트 자동 실행
3. Docker 이미지 빌드
4. Docker Hub 푸시
```

**Week 10: EC2 자동 배포**
```bash
1. GitHub Actions에서 EC2 SSH 접속
2. 새 이미지 다운로드
3. 컨테이너 재시작
4. 배포 완료 알림 (Slack)
```

**결과물:**
- Git Push만 하면 자동으로 배포되는 시스템
- 포트폴리오에 올릴 수 있는 수준

**학습 자료:**
- GitHub Actions 공식 문서: https://docs.github.com/en/actions
- "처음 배우는 GitHub Actions" (책, 한글)

---

### Month 4-5: Kubernetes (선택)
**목표:** K8s 기초 이해

**실습 (주말 4시간 × 6주 = 24시간):**

```bash
# 로컬 K8s 클러스터
1. minikube start
2. kubectl 기본 명령
3. 독서앱 Deployment 작성
4. Service로 외부 노출
5. ConfigMap으로 설정 관리
6. 스케일링 테스트 (replicas: 3)
```

**학습 자료:**
- Kubernetes 공식 튜토리얼: https://kubernetes.io/docs/tutorials/
- "쿠버네티스 입문" (책, 한글)
- Udemy "Kubernetes for Absolute Beginners" (할인 시 1만원대)

## 💡 번외편: 무과금(0원) 로컬 인프라 심화코스 (추천!)

EC2나 클라우드 서버 비용이 부담스럽다면, 현업 데브옵스 스킬을 맥북(로컬) 안에서 **100% 무료**로 마스터할 수 있는 아래 실습 코스들을 강력히 추천합니다! (현재 단계에서 바로 해보기 좋은 순서대로 정렬했습니다.)

### 1️⃣ 로컬 무과금 자동배포 CD (Watchtower)
**목표:** 깃허브 액션이 이미지를 구우면, 내 맥북 컨테이너가 알아서 최신 버전으로 자동 재시작되게 만들기
- `docker-compose.yml`에 Watchtower라는 컨테이너만 한 줄 추가하면 끝납니다.
- 서버에 접속해서 수동으로 `docker pull`, `docker restart`를 치는 귀찮음에서 영원히 해방되는 '마일스톤'입니다. 마치 클라우드 서버에 배포 파이프라인(CD)을 구축한 것과 동일한 경험을 얻습니다.

### 2️⃣ 로그 중앙 집중화 시스템 (Grafana Loki + Promtail)
**목표:** 여기저기 흩어진 모든 도커 컨테이너의 에러 로그를 한 곳(Grafana)에서 쉽게 검색하기
- 현재 완성된 인프라: **Metrics** (CPU, 메모리 숫자 모니터링: Prometheus)
- 추가할 인프라: **Logging** (텍스트 에러 모니터링: Loki)
- 현업 SRE(사이트 신뢰성 엔지니어)들의 주요 무기인 'Observability(관측성)'를 완벽하게 이해하고 로컬에서 마스터하는 과정입니다.

### 3️⃣ 인프라 코드화 기초 (Terraform + Docker Provider)
**목표:** 인프라 설계 분야의 글로벌 1위 언어(Terraform)를 돈 안 들이고 맥북에서 맛보기
- AWS에 돈을 내는 대신, 테라폼의 타겟을 '내 로컬 도커'로 맞춥니다.
- 지루한 명령어 대신 `.tf` 파일(코드) 몇 줄만 작성해서 명령하면 도커 컨테이너와 네트워크가 자동으로 생겨나고 폭파됩니다. 코드로 인프라를 다루는 IaC(Infrastructure as Code)의 짜릿함을 가장 쉽게 배웁니다.

### 4️⃣ 쿠버네티스 로컬 클러스터 (Minikube / k3d)
**목표:** 인프라 생태계의 끝판왕이자 현업의 절대적 표준 경험하기
- `docker-compose`로 이해한 단일 컴퓨터 컨테이너 구조를 미니쿠브(Minikube)라는 가상 오케스트레이션에 올립니다.
- Deployment, Service, ConfigMap, Ingress 등 낯선 개념들을 내 앱을 변환해 보며 익히면, 사실상 서버 100대짜리 데이터센터 관리자가 될 기본기를 닦는 것입니다.

---

## 학습 자료

### 무료 자료 (이것만으로 충분)

**Docker**
- 공식 문서 Get Started: https://docs.docker.com/get-started/
- 생활코딩 Docker: https://www.youtube.com/watch?v=Ps8HDIAyPD0

**Kubernetes**
- 공식 튜토리얼: https://kubernetes.io/docs/tutorials/
- Kubernetes Bootcamp: https://kubernetesbootcamp.github.io/kubernetes-bootcamp/

**AWS**
- AWS Skill Builder: https://skillbuilder.aws/
- 44BITS 블로그 (한글): https://www.44bits.io/

**CI/CD**
- GitHub Actions 문서: https://docs.github.com/en/actions
- GitLab CI Tutorial: https://docs.gitlab.com/ee/ci/

**Linux**
- Linux Journey: https://linuxjourney.com/
- 생활코딩 Linux: https://opentutorials.org/course/2598

---

### 유료 자료 (선택)

**책 (한글)**
- "Docker/Kubernetes 실전 가이드" (위키북스)
- "AWS로 시작하는 인프라 구축의 정석" (위키북스)
- "Terraform Up & Running" (한빛미디어)

**강의 (할인 시 1-2만원)**
- Udemy "Docker Mastery" (Stephen Grider)
- Udemy "Kubernetes for Absolute Beginners" (Mumshad Mannambeth)

**자격증 (선택)**
- AWS Certified Solutions Architect - Associate (5만원)
- CKA (Certified Kubernetes Administrator) (30만원)

---

### 커뮤니티

**슬랙/디스코드**
- 44BITS 슬랙
- AUSG (AWS User Group)
- GDG (Google Developer Group)

**밋업**
- DevOps Korea
- Kubernetes Korea
- AWS User Group Korea

---

## 적성 판단 기준

### ✅ DevOps 계속하면 좋은 신호 (3개월 후)

- Docker 쓰니까 개발 편하네?
- CI/CD 만들었더니 뿌듯함
- 서버 띄우고 모니터링하는 거 재밌음
- "이거 자동화할 수 있을 거 같은데?" 생각 자주
- AWS 콘솔 만지는 게 흥미로움

---

### ❌ 빠르게 포기해야 하는 신호

- Docker 너무 귀찮음 (그냥 `npm start`가 나음)
- 서버 에러 나면 스트레스
- "이거 왜 배워야 함?" 의문
- 개발이 훨씬 재밌음
- 코드 짜는 게 더 좋음

---

### 🤔 애매한 경우

**"유용하긴 한데 재미는 없음"**
→ DevOps보다는 **개발자로서 Docker 활용**하는 쪽 추천
→ 프론트엔드/백엔드 개발자 + Docker 스킬 = 경쟁력

**"재밌는데 온콜이 부담"**
→ **Platform Engineer** 고려
→ 사내 개발자용 도구 만드는 역할 (온콜 적음)

---

## 시작하기: 첫 주말 미션 (4시간)

### Step 1: Docker 설치 (10분)
```bash
brew install --cask docker
docker --version
```

### Step 2: 독서앱 Dockerfile 작성 (20분)
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Step 3: Docker 빌드 & 실행 (10분)
```bash
# 이미지 빌드
docker build -t book-app .

# 컨테이너 실행
docker run -p 3000:3000 book-app

# 브라우저에서 localhost:3000 확인
```

### Step 4: docker-compose 만들기 (30분)
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
```

```bash
# 실행
docker-compose up

# 코드 수정해보기 (자동 새로고침 확인)

# 종료
docker-compose down
```

### Step 5: 성공 확인 ✅
- [ ] localhost:3000 접속됨
- [ ] 코드 수정하면 자동 새로고침됨
- [ ] `docker-compose up` 한 번에 실행됨

**축하합니다! 당신은 이제 Docker를 쓰는 개발자입니다.** 🎉

---

## 다음 단계

**Week 2:**
- docker-compose.yml 개선 (환경변수 분리)
- .dockerignore 작성 (node_modules 제외)

**Week 3-4:**
- NextJS 추가하면서 docker-compose에 service 추가
- NestJS + MongoDB도 docker-compose로 통합

**Month 2:**
- AWS 프리티어 계정 만들기
- EC2에 독서앱 배포

**Month 3:**
- GitHub Actions로 자동 배포 구축

---

## 추가 팁

### M2 맥북 최적화
```bash
# ARM 이미지 사용 (빠름)
FROM node:18-alpine  # ✅ ARM 지원
FROM mongo:latest    # ✅ ARM 지원

# x86 이미지 피하기 (느림)
FROM some-old-image  # ❌ ARM 미지원 → Rosetta로 실행
```

### Docker 디스크 정리
```bash
# 안 쓰는 컨테이너/이미지 정리
docker system prune -a

# 볼륨까지 정리 (주의: 데이터 삭제됨)
docker system prune -a --volumes
```

### AWS 비용 절약
```bash
# 프리티어 범위
- EC2 t2.micro: 월 750시간 (1개 인스턴스 24시간 가능)
- RDS t2.micro: 월 750시간
- S3: 5GB 저장
- 데이터 전송: 15GB

# 주의
- 인스턴스 중지해도 EBS(디스크)는 과금
- Elastic IP 미사용 시 과금
- 비용 알람 꼭 설정!
```

---

## 결론

### 핵심 정리

1. **지금 바로 병행하세요**
   - 독서앱 = DevOps 실습 재료
   - 주말만 써서 3개월에 완성

2. **Docker부터 시작**
   - 이번 주말 4시간이면 충분
   - 나머지는 자연스럽게 따라옴

3. **3개월 후 판단**
   - 재밌으면 → 본격 DevOps 이직 준비
   - 별로면 → 개발자 + Docker 스킬

4. **M2 맥북은 완벽 지원**
   - Docker, K8s 모두 ARM 네이티브
   - 오히려 유리함

### 첫 번째 미션
**이번 주말에 Docker 설치 + React 앱 컨테이너화**

막히면 에러 메시지 복사해서 질문하세요.

시작합시다! 🚀

---

## 참고 자료

### 공식 문서
- Docker: https://docs.docker.com/
- Kubernetes: https://kubernetes.io/docs/
- AWS: https://docs.aws.amazon.com/
- GitHub Actions: https://docs.github.com/en/actions

### 한글 블로그
- 44BITS: https://www.44bits.io/
- 생활코딩: https://opentutorials.org/
- AWS 한국 블로그: https://aws.amazon.com/ko/blogs/korea/

### 유튜브
- 생활코딩
- 노마드 코더
- 드림코딩
- TechWorld with Nana (영어)

---

**마지막 조언:**

"완벽히 배우려고 하지 마세요. 일단 만들면서 배우세요."

Docker 문서 다 읽고 시작하려면 평생 못 합니다.
지금 당장 Dockerfile 하나 만들고, 에러 나면 구글링하세요.

그게 제일 빠릅니다. 🚀
