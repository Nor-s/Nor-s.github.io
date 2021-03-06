---
title: "[UE4] 애니메이션 시작하기"
date: 2022-03-23T12:58:52Z
category: [game, game-unreal4]
tags: [unreal4]
---

## **애니메이션 시작하기**

### 철학

- 다용도성 확보(versatile tools)
- 레이어화된 애니메이션 플로우
  - 다양한 애니메이션 레이어에서 벌어지는 일들을 쉽게 분리해서 레이어별로 반복 처리하고 폴리시할 수 있음.
- 재사용성

  - 애니메이션 속의 다양한 요소를 다른 캐릭과 애니메이션 등을 공유하는것

- ue1: 버텍스 애니메이션 기반
- ue2: 스켈레톤 추가, 소켓, 애니메이션 노티파이 등 요소 추가
- ue3: cloth 추가, matinee를 위한 시네마틱 에디터가 추가됨

### 개요

![](/img/UE4animation.png)

- 스켈레톤이 중심
  - 스켈레톤 메시 : 엔진 퀄리티 기능- LOD와 세트
  - 애니메이션 블루프린트
    - 이벤트 그래프: 애니메이션과 게임 플레이를 연결하는 역할을 한다.
    - 애니메이션 그래프: 게임플레이 변수를 기반으로한 애니메이션 플로가 됨.
  - 애니메이션 시퀀스 : 여러가지 툴로 변환한 후 애니메이션 블루프린트에 배치
  - 피지컬 에셋도 배치 가능
- 애니메이션 그래프 => 포즈 계산 => 스케렐탈 메시 실행

> 시퀀서 : 시네마틱 툴
> 시퀀스 : 실제 애니메이션

### 스켈레톤과 스켈레톤 메시

![](/img/skeletal.png)

- FBX 파일을 언리얼 엔진으로 임포트하면,
  - 동일한 FBX 파일 내에 완성된 애니메이션과 서로 다른 애니메이션 다수가 있을것임
  - 리깅 스켈레톤과 메시도 있음
  - 따라서 임포트하면 하나의 파일이 아닌 서로 다른 여러 파일이 갖춰짐 (이렇게 스켈레톤이 갖춰짐)
- 스켈레톤에는 스켈레탈 메시, 디스플레이되는 지오메트리와 다양한 애니메이션을 각각 서로 다른 파일에 갖추게 된다.

- 임포트하면, 피직스 에셋도 생성가능
  - 스켈레톤이 피직스 환경에 반응하는 방식을 정의한다.
- 스켈레톤 메시를 선택 => 뷰포트 => 본 => 스켈레톤 볼 수 있음.

  - 다수의 메시가 스켈레톤에 연결된것을 볼 수 있음.

- 스켈레톤

  - 가상 본, 소켓등을 연결 가능 (에디터에서 계층구조에 추가 가능)
  - 소켓(socket): 다른 본에 부모설정이 된 요소. 이 소켓의 트랜스폼은 애니메이션을 따른다.
    - 게임플레이에서 처리하려는 특정 요소를 스켈레톤에 붙일 수 있음.
    - 캐릭터가 뭔가 손으로 조종하게하고 싶다면, 손에 소켓을 생성하면됨

- 리타겟 매니저 시스템
  - 스켈레톤에 연결하는 애니메이션 블루프린트나 메시 등과 같은 모든 애셋을 다른 스켈레톤으로 할당 가능
  - tool bar => retarget manager
  - 서로 다른 스켈레톤에 그 애니메이션을 쓸 수 있다.
  - 보통 스켈레톤은 구조가 대체로 비슷, 소스로 사용하는 스켈레톤과 매우 유사함
- 스켈레톤 메시에는 폴리곤 정보만 저장하는 게 아니라 머티리얼 정보도 저장
  - LOD세팅도 가능 (regenerate LOD => 거리에 따른 각자 다른 메시)
  - 피직스 에셋 등을 사용 가능
  - Clothing 또한 스켈레톤 메시에 저장됨

### **애니메이션 시퀀스**

- 스켈레톤에 할당된 다양한 애니메이션
- 파일에서 임포트 가능
- 임포트되기만하면, 라이브 링크 플러그인과 다양한 DCC를 사용할 수 있다.
  - 런타임에 엔진에서 직접 사전 시각화할 수 있음.
- 시퀀스 다수가 동일한 스켈레톤에 할당됨.
  - 타임라인 => 재생 툴 => 애니메이션 앞뒤로 재생 가능
  - 다양한 에셋에서 시퀀스들을 한 데 결합할 수도 있음
- 다양한 메타데이타

  - Anim Curves: 루트모션을 제거하면, 애니메이션중 이동하는 거리 계산 가능(게임플레이에서 사용가능한 정보)
  - 애니메이션에 입력한 모든 메타데이터 => 이벤트 그래프에서 읽을 수 있다. => 게임플레이로 넘길 수 있다.
  - Anim Notifies: 특별한 이벤트 추가 가능 (칼을 휘두르면 타격 => 타격 판정 확인 => 게임플레이 블루프린터에서 노티파이를 보내 애니메이션의 정확한 위치에서 판정 내리기 가능)
  - Sync Markers: 애니메이션상에서 뭔가 발생할 시점을 알려준다.(마킹)
    - 예를들어 다른 애니메이션과 동기화(왼발, 오른발)

- 애니메이션 시퀀스가 출처인 에셋도 있음

- 애니메이션 목록에는 블렌드 스페이스와 몽타주가 있음
  - montages: 다양한 애니메이션 시퀀스를 서로 그룹화하거나 합침.
    - 애니메이션 큐 (사운드 웨이브의 사운드 큐같은것): 기본적으로 일정 유형의 다양한 에셋 여러개를 한 그룹으로 합침.
    - 몽타주는 게임플레이 중에 쉽게 플레이 가능.
    - 보통 캐릭터의 입력에 따른 반응으로 재생됨(구체적인 반응을 재생하고자할 때)
    - 플로 대신 몽타주로 재생
  - blend spaces: 애니메이션 합침 (변수 값에 따라,ex. 달리는 캐릭의 각도 변경)
  - pose asset: 애니메이션 쉽게 만들기 가능
    - Create Asset -> Create PoseAsset -> 애니메이션 속 프레임의 포즈를 포착해 별개의 신규 에셋에 저장한다. => 다양한 포즈로 서로 블렌딩해서 새 애니메이션 만들기 용이
    - 게임플레이 변수로 제어가능
    - 게임 플레이에서 그 타이밍등을 제어가능

### 애니메이션 그래프

- 시퀀스를 재생가능

- 애니메이션 외적인 변수들을 처리 가능

  - 그래서 게임플레에서 이벤트 그래프로 피드롤 보냄.
  - 이런 변수들을 모두 모아, 자신만의 변수로 변화시킨 다음, 그 정보를 활용해서 애니메이션 그래프 속의 애니메이션 플로를 제어한다.

- 다양한 정보로 다양한 애니메이션 플로를 재생하게됨.

- 플로에는 다양한 노드들이 있음.
  - 주요노드는 상태 머신
  - 애니메이션의 플로를 설정해야한다면 상태머신만으로는 부족하지만 주요 툴은 아님
    - 하이엔드 애니메이션 플로에서 굉장히 강력하긴 함.

### flow control

- 애니메이션 그래프에는 Flow Control 노드가 있음

- Slots

  - 플로가 들어오는곳
  - 슬롯에서 뭔가 시작하면, 슬롯에 넣은걸로 플로를 오버라이드
  - 반응과 관련된 모든걸 저장하는데 슬롯을 사용할 수 있음.
    - 예. 플레이어 공격 => 공격의 몽타주를 해당 슬롯에 저장 => 플로에서 재생되는 모든 애니메이션을 읽은 후 그 애니메이션을 출력

- Blend and Additive

  - 본 간의 보간, 온갖 다양한 변수들로 수행할 수 있다.
  - Additive: 두 애니메이션을 한 데 섞는게 아니라 애니메이션 하나를 다른 애니메이션 위에 배치하는 것.(공격을 당하면서, 스켈레톤의 흉부가 밀쳐저 뒤로 밀려나는 애니메이션이 있다면, 그 애니메이션을 가장 우선적으로 재생함. 앞서 일어난 일에 따른 결과로 추가 가능)

- Pose Caching
  - 플로의 현재 위치를 저장해서, 나중에 얻어내는것
  - 공격과 달리기 애니메이션을 블렌딩

### Procedural Animations

- Physics Assets

  - 캡슐을 통해
  - 그래프 => 캡슐의 연결된 형태를 살펴볼 수 있다.
  - (constraint) 바디간에 어떤 변화가 생기는지 정의해줌
  - 시뮬레이트 => 물리환경에서의 반응 방식을 볼 수 있다.

- Rigid Body Node, Anim Dynamics, IK Nodes
  - 이 노드들이 있다면, 피지컬 비헤이비어를 현재 실행중인 애니메이션과 블렌딩 가능
  - 그러면 다시 한 번 애니메이션 플로를 수정하게 됨.
  - 리지드 바디가 피직스 에셋에 연결된 셈
  - 피지컬 애니메이션 profiles => 모든 컨스트레인트를 정의함
  - AnimDynamics : 리지드 바디 구성을 사용하지 않고 본 별로 그 작업을 할 수 있다.
  - IK 용도: 캐릭터는 지면을 기준으로 양수인 위치에 양발을 두어야함 => 양발을 적절한곳에 위치해야함
    - 아무 곳에도 종속되지 않은 위치가 애니메이션 내내 사용되는것.

### 애니메이션 레이어

- 애니메이션 플로를 제어하는 소소한 방법들을 만들 수 있다.
  - 게임플레이 입력이나 변수에 따라 레이어간 교체 가능
  - 현업도 가능 => 두 명의 애니메이터가 동일한 애니메프션 그래프 사용하여 협업가능
  - 한 명이 레이어 하나 작업 => 다른 한명은 다른 레이어

### control rig

- 스켈레톤 제어
- 엔진 내에서 리깅을 만들 수 있다.
- 스켈레톤 계층 구조의 다양한 부위에 따라 비헤이비어를 만들어줄 수 있다.
  - 현재 둔부 위치에 따라 양 발 제어

### 최종 포즈

- 노드 그래프의 결과가 나온것

- Animation Sharing Manager

  - 다양한 스켈레톤 간에 공유 가능
  - 동일한 스켈레톤과 동일한 스켈레탈 메시를 사용하는 서로 다른 케릭터들 그 중 하나의 포즈를 모두에게 공유 가능
  - CPU는 수 많은 스켈레톤에 공유된 포즈들만 처리하면된다.
  - 캐릭터 군집 표현

- 시퀀스 레코더
  - 애니메이션에 일어나는 일을 녹화할 수 있다.
  - 창 => 시네마틱 => 시퀀스 레코더
  - 플레이어가 수행한 모든 행동이 기록됨.
  - 시뮬레이션 가능(몇몇 박스를 두고, 피직스 시뮬레이션에 필요한 물리적 영향 계산하고, 런타임에 실제 시뮬하지않고 녹화한것만 보여주면됨)

### 퍼포먼스

- Animation Sharing Manager
- Animation Budget Allocator
  - 각 애니메이션에 사용할 시간의 예산을 설정할 수 있다.
  - 애니메이션 블루프린터에서는 티킹의 양을 줄여주고 애니메이션을 공유하며 피지컬 비헤이비어를 잘라내는 식으로 예산을 유지함
- Animation Tick
  - 티깅되는 애니메이션 수를 줄임
- LOD
  - 본의 양 또한 줄임. (손에서 본이 없어짐.)
- Fast path
  - 블프 노드가 순수하게 C++ 로 컴파일 된 것 처럼 쓰임.
- Multi Threaded Update
  - 스레드 다수가 대기 상태라면, 시간 많이 아낌
  - 그냥 단일 스레드와 같은 방식으로 실행

## 조언

### AnimBP Retargeting

- 애니메이션 시퀀스뿐만 아니라 애니메이션 블루프린트도 리타깃 가능
- 베이직 블프 => 게임속 케릭터 모두 사용하게 가능 => 모두가 비헤이비어를 글로벌 비헤이비어를 공유해야함
  - 모두가 같은동작
- 리타깃할 수 있는 모든 것에 복붙하는 것보다 처음부터 잘 설계

### Layering

- 상태 머신 단순한게 좋음
- 스테이트의 모든것은 일반 플로에 추가가능
- 스테이트머신 중첩 가능 (디버깅 쉬워짐)

- 플로의 시작점에 애니메이션의 큰 줄기를 만들고 차차 디테일을 추가하는 게 훨씬 쉬운 작업방식

### Flow control

- 오버라이드가 필요한 반응 애니메이션등을 주로 슬롯에 저장하는 건 좋지 않다.
  - 게임플레이에 따른 반응만 저장하는게 좋다.(공격 애니메이션)
- 캐시 사용
  - 비용이 딱히 크지 않음

### Ticking and Performance

- 캐릭터나 특정 액터에서 업데이트 비율 최적화를 활성화할 수 있다.

- 즉, 애니메이션 캐릭터로부터 멀리 떨어질 수록 티킹도 점점 적어짐

- Optimization => Enable update rate optimizations

- 캐릭터의 비율에 따른 색상별 디스플레이도 가능

- 티킹을 줄이는것은 Anim Budgeter 가 알아서 작업 해줌

### Physics Behavior

- 그냥 괜찮은 피직스 에셋 구성이니 필요한 비헤이비어는 최소한으로 줄임.

- 바디가 피직스에 반응하지 않도록 설정 가능
  - kinematic으로 유형 변경
  - simulated == 피직스에 반응
- 피직스 프로파일
  - 프로파일 다수를 두고 런타임 중에는 변경 가능
  - 피지컬 비헤이비어 유형을 하나 사용하다가 갑자기 다른 프로파일로 변경해 그대로 갈 수 있다.

### Animation Sharing Manager

- 무작위 애니메이션을 끼워넣어서 티가 덜나도록 만들기 가능
- 공유 애니메이션 위에는 반응 애니메이션을 추가할 수 있음
  - 군중속의 캐릭터를 친다면, 반응하게
- 피직스 또한 추가가능
- 모두 데이터에 따라 관리됨 (프로퍼티에 의해 설정됨)

### 문제

- 두 애니메이션 길이가 서로 다르지만 함께 블렌딩해야 합니다. 애니메이션 기능 중 애니메이션을 동기화하여 원활한 트랜지션을 가능하게 하는 것은 무엇인가요?
  - 싱크 그룹 및 싱크 마커

## **출처**

[ue4: 애니메이션](https://learn.unrealengine.com/course/3587639/module/7004706?moduletoken=UHxxnDLPW8S4kCNp7jHFnQJK~NNwqYF4amw4fWolfkKHDwPMNyIyu5XbdXAnM6uv&LPId=0)
