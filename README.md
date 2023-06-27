# Tech Stack
- Backend Framework: Nest.js
- Database: MySQL
- ORM: TypeORM
- Authentication: JSON Web Tokens (JWT), Google OAuth
- Deployment: Docker, Docker-compose ,Google Cloud Compute Engine, Nginx

# Summary
- 웹 북마크 CRUD
- Google OAuth, Passport
- Docker, Dokcer-Compose,Nginx Deploy

# Issue
- [클라이언트에서 서버 초기 연결문제, http](https://choiblog.tistory.com/157)
- [Subdomain 이슈](https://choiblog.tistory.com/155)
- [웹,서버간 쿠키 저장 이슈](https://choiblog.tistory.com/154)
- [도커 컴포즈로 서버 구축 삽질기](https://choiblog.tistory.com/150)
- [도메인 연결](https://choiblog.tistory.com/148)
- [도커 띄우기](https://choiblog.tistory.com/147)
- [호스팅 삽질](https://choiblog.tistory.com/146)
- [Nest.js 코드 리팩토링](https://choiblog.tistory.com/156) <br/>
...

# Installation

```bash
$ git clone https://github.com/bjc1102/clipplanet-server.git
$ yarn install
```

# Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode & Deploy
$ yarn build
$ yarn start:prod

# or 

$ docker-compose up
```

# 파일 구조

```
.
├── Dockerfile
├── README.md
├── docker-compose.yml
├── nest-cli.json
├── nginx
│   ├── Dockerfile
│   └── nginx.conf
├── package.json
├── src
│   ├── app.module.ts
│   ├── auth
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── static
│   │   │   └── cookie-option.ts
│   │   └── utils
│   │       ├── GoogleStrategy.ts
│   │       ├── Guards.ts
│   │       ├── RTokenStrategy.ts
│   │       └── TokenStrategy.ts
│   ├── database
│   │   ├── Site.entity.ts
│   │   ├── User.entity.ts
│   │   └── index.ts
│   ├── main.ts
│   ├── site
│   │   ├── dto
│   │   │   └── ClipRequestBody.dto.ts
│   │   ├── site.controller.ts
│   │   ├── site.module.ts
│   │   └── site.service.ts
│   ├── types
│   │   ├── jwt.interface.ts
│   │   ├── open-graph.ts
│   │   └── user.interface.ts
│   ├── user
│   │   ├── user.module.ts
│   │   └── user.service.ts
│   └── utils
│       ├── getExpires.ts
│       ├── replaceUndefined.ts
│       └── user.decorator.ts
├── tsconfig.json
└── yarn.lock
```
