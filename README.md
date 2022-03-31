# Chattin-app

Node.js로 만든 채팅 앱입니다.

## 개요

웹 플랫폼이란 단순히 웹을 꾸미고 javascript로 기능을 넣는 것이 전부가 아니라 생각했습니다.
클라이언트의 영역에서 할 수 없는 일. 그 일을 경험하는 것이 제가 원하는 웹 소설 플랫폼에 한 발자국 다가가는 일이라 생각했습니다.
때문에 Node.js는 필수불가결이라 생각했고 그 중에서도 채팅 웹을 만들게 되었습니다.

## 기능

|로그인|채팅 목록|
|---|---|
|![ch1](https://user-images.githubusercontent.com/89452058/160983077-a58a6a1e-17fd-41fb-9a37-3a31eb3d0958.png)|![ch2](https://user-images.githubusercontent.com/89452058/160983124-624c25f4-fa14-4c9f-bd44-b950d7d1f5f5.png)|

|채팅|실시간|
|---|---|
|![ch3](https://user-images.githubusercontent.com/89452058/160986143-a4903b22-e8f1-40c0-9fee-4c4e027eb136.png)|![ezgif com-gif-maker (2)](https://user-images.githubusercontent.com/89452058/160986164-2fd49146-8c52-43e2-a734-1ffab6ebc6b2.gif)|

## 사용기술 및 달성한 목표

채팅 웹에서 가장 중요한 부분은 실시간 통신이라 생각했습니다. 때문에 통신에 대한 부분은 socket.io를 이용했습니다.
하지만 socket.in으로 방을 생선한다 한들, 각각의 방에 고유한 번호를 부여하지 않으면 통신의 개인 채팅방의 독립성을 확보하지 못할 것이라 생각했습니다.

저는 이런 문제점을 자신의 고유한 식별자 번호인 session으로 해결했습니다. 
이를 위해선 mysql-session이 필요로 했고 마침 채팅 목록 또한 mysql로 관리했었기에 express-mysql-session은 저에게 적절한 라이브러리였습니다.

또다른 문제점은 mysql에서 꺼내온 정보를 어떻게 화면에 출력할까였습니다.
채팅 목록을 mysql에 꺼내온 정보 그대로 출력할까 생각도 했었지만 좀 더 깔끔하게 출력하길 원했고, 이를 ejs를 이용해 해결했습니다.
