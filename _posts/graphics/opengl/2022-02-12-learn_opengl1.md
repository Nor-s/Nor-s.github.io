---
title: "[learn-opengl] Introduction: OpenGL"
date: 2022-02-12T5:20:38Z
category: ["graphics", "graphics-opengl"]
tags: [opengl]
---

## 1. OpenGL

immediate mode (fixed function pipeline)

- 예전에 쓰였던 방식

- 대부분 기능이 내부에 숨겨져있음, 내부에서 작동확인 어려움

- 그대신 사용하기 쉽고 이해하기 쉬움

- 그러나 비효율적

- OpenGL 3.2 이후 core-profile mode

core-profile mode

- 최신 기술(modern practices)을 사용하도록 유도 (deprecated functions 사용시 정지)

- 따라서 배우기 어려움.

- 하지만 매우 유연하고 효율적

- 내부에서의 동작을 확인하기 쉬워짐

OpenGL 3.3버전 을 배우는 이유 :

    이후버전은 기능이 추가되거나 함수가 더 효율적으로 바뀐것.

## 2. Extensions

- 그래픽 카드 회사에서 렌더링을 위해 새로운 기술을 개발하거나 최적화 작업을 한것을

  사용가능하거나 안하게 할 수 있음.

  (하드웨어에 맞게 주어진 기능을 활성화하는 Functional Mode 이야기인거 같음)

```cpp
if(GL_ARB_extension_name)
{
    // Do cool new and modern stuff supported by hardware
}
else
{
    // Extension not supported: do it the old way
}
```

## 3. State Machine

OpenGL은 커다란 상태 머신

(상태변수 설정하는 역할, 하드웨어가 불가능함)

상태 변수 == context

상태, 옵션을 설정하고 버퍼를 조작한다음

current context(현 상태)를 변경해야함

(상태 = 점의 크기, 색, 길이 등등)

(현상태는 변경하기전 까지 계속 유지)

## 4. Objects

core 는 C 라이브러리,

추상화를 고려하여 개발된 OpenGL

추상화중 하나인

객체는 상태를 나타내는 옵션들의 모음

1. 객체를 생성하고, 레퍼런스를 id 로 저장 (실제 데이터는 scenes 뒤에 저장)

2. 객체를 id를 이용하여, context의 대상 위치에 바인딩

3. 옵션을 설정

4. 바인딩 해제 -> id가 참조하는객체에 옵션은 저장됨, context의 대상 위치는 복원됨)

> 여러 객체를 정의하고 옵션을 설정할 수 있음, 특정 모델을 그리려 할때마다 해당 옵션을 다시 설정하지 않아도 저장된 옵션이 설정됨, 해당 객체를 바인딩만 하면됨.

```cpp
struct object_name {
    float  option1;
    int    option2;
    char[] name;
};

// The State of OpenGL
struct OpenGL_Context {
  	...
  	object_name* object_Window_Target;
  	...
};

// create object
unsigned int objectId = 0;
glGenObject(1, &objectId);
// bind/assign object to context
glBindObject(GL_WINDOW_TARGET, objectId);
// set options of object currently bound to GL_WINDOW_TARGET
glSetObjectOption(GL_WINDOW_TARGET, GL_OPTION_WINDOW_WIDTH,  800);
glSetObjectOption(GL_WINDOW_TARGET, GL_OPTION_WINDOW_HEIGHT, 600);
// set context target back to default
glBindObject(GL_WINDOW_TARGET, 0);
```

## link

[LearnOpenGL - Introduction](https://learnopengl.com/Introduction)

[LearnOpenGL - OpenGL](https://learnopengl.com/Getting-started/OpenGL)
