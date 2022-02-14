---
title: "[learn-opengl] Creating a window"
date: 2022-02-12T6:9:15Z
category: ["graphics", "graphics-opengl"]
tags: [opengl]
---

# **1. window 생성**

## **헤더 파일**

```cp성
#include <iostream>
#include <glad/glad.h>
#include <GLFW/glfw3.h>
```

## **GLFW 초기화, 설정**

메인 함수에서

glfwInit 로 GLFW 초기화

glfwWindowHint로 GLFW설정 : GLFW\_ 접두어의 옵션들

GLFW_CONTEXT_VERSION_MINOR

GLFW_CONTEXT_VERSION_MAJOR 을 3으로 설정한것은 opengl3.3 을 다루고있기 때문

> 적절한 OpenGL 버전이 아닐시 GLFW 실행되지않음

glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

> 명시적으로 core-profile을 사용

> glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);
> => Mac OS

```cpp
int main()
{
    glfwInit();
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    //glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);

    return 0;
}
```

## **윈도우 객체 생성**

```cpp
GLFWwindow* window = glfwCreateWindow(800, 600, "LearnOpenGL", NULL, NULL);
if (window == NULL)
{
    std::cout << "Failed to create GLFW window" << std::endl;
    glfwTerminate();
    return -1;
}
glfwMakeContextCurrent(window);
```

이 객체는 모든 window 데이터를 유지, GLFW의 다른 함수에서 사용하는 데이터이다.

### `glfwCreateWindow(width , height , name, monitor, share)`

    monitor : 풀스크린모드 or 윈도우모드(NULL)

    share : 자원을 다른 창과 공유하는지

### `glfwMakeContextCurrent(window)`

    glfw에게 현재 window context를 current thread에 main context로 삼음

## **GLAD**

```cpp
   if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
    {
        std::cout << "Failed to initialize GLAD" << std::endl;
        return -1;
    }
```

OpenGL의 function pointer 들을 관리하는 GLAD를 초기화

OpenGL 함수들을 호출하기 전에 초기화 해야함

OS 마다 다른 OpenGL함수 포인터의 주소를 로드하기 위해 GLAD 함수를 거침.

GLFW는 OS에 따라 the correct function 을 정의하는 주소를 제공해줌.

## **Viewport**

```cpp
 glViewport(0, 0, 800, 600);
```

렌더링을 하기전

OPENGL에게 렌더링 윈도우 사이즈를 알려줘야함.

(x, y, width, height)

(왼쪽 모서리 좌표, 렌더링 윈도우의 너비와 높이를 픽셀로 설정)

> 뷰포트와 (가시부피)투상면의 종횡비가 일치해야함. (왜곡 방지)

> 창의 크기 조절할때마다 뷰포트도 조정

```cpp
    void framebuffer_size_callback(GLFWwindow * window, int width, int height);
    void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
    glViewport(0, 0, width, height);
}
```

resize 콜백함수를 등록해야함.

> 창의 크기가 변경될 때마다 GLFW는 이 함수를 호출, 뷰포트 리사이즈

```cpp
    glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
```

창을 처음 표시할때도 호출됨.

창크기 조절할때도 호출됨.

> 레티나 디스플레이는 width와 height의 값이 원래 입력값보다 훨씬 높아짐

## **Ready your Engine**

```cpp
while(!glfwWindowShouldClose(window))
{
    glfwSwapBuffers(window);
    glfwPollEvents();
}
```

프로그램이 명시적으로 중지하라는 메시지를 받기전까지 계속해서 이미지들을 그리고

입력들을 처리하도록해야함

> `render loop `라는 while 루프를 만들어야함.

> GLFW에게 그만하라고 할때까지 계속 실행됨.

### close 함수

- 각 루프가 시작될 때마다 GLFW가 종료하도록 지시받았는지 확인함

### swapBuffers 함수

- 컬러버퍼(GLFW 창 안의 각 픽셀들에 대한 컬러값을 가지고 있는 큰 버퍼)를 교체

- 반복중에 이미지를 그리고 화면에 출력하는 기능을 함.

### PollEvent 함수

- 이벤트가 발생했는지 확인, 윈도우 상태 업데이트, 콜백함수 호출

```
더블버퍼
=> single 버퍼의 문제점 (이미지 플리커링) goth
=> front : 최종 출력이미지를 담음
=> back : 모든 렌더링 명령이 그려지는 버퍼
=> 모든 렌더링 명령이 완료되면 swap => 즉시표시
```

## **종료**

```cpp
glfwTerminate();
return 0;
```

할당된 모든 자원들을 정리, 삭제

# **2. input**

```cpp
void processInput(GLFWwindow *window)
{
    if(glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
        glfwSetWindowShouldClose(window, true);
}
```

```cpp
    while (!glfwWindowShouldClose(window))
    {
        processInput(window);

        glfwSwapBuffers(window);
        glfwPollEvents();
    }
```

glfwGetKey 함수를 사용하여 키보드 키와 함께 윈도우의 입력을 받을 수 있음.

(눌러져 있는지 여부를 리턴)

=> 함수를 만들어 체계적으로 코드를 구성할 수 있음

render loop

=> 모든 프레임에서 특정 키가 눌러져 있음을 확인 할 수 있다.

# **3. Rendering**

```cpp
// render loop
while(!glfwWindowShouldClose(window))
{
    // input
    processInput(window);

    // rendering commands here
    ...

    // check and call events and swap the buffers
    glfwPollEvents();
    glfwSwapBuffers(window);
}
```

모든 렌더링 명령을 렌더링 루프 안에 넣어야한다.

ex)

glClear (상태 사용, state-using)=

=> GL_COLOR_BUFFER_BIT, GL_DEPTH_BUFFER_BIT, GL_STENCIL_BUFFER_BIT

=> 버퍼를 초기화

glClearColor (상태 설정, state-setting)

=> 초기화할 색 샐정

```cpp
glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
glClear(GL_COLOR_BUFFER_BIT);
```

# **전체 코드**

```cpp
#include <iostream>
#include <glad/glad.h>
#include <GLFW/glfw3.h>

void framebuffer_size_callback(GLFWwindow* window, int width, int height);
void processInput(GLFWwindow *window);

int main()
{
    glfwInit();
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    GLFWwindow* window = glfwCreateWindow(800, 600, "LearnOpenGL", NULL, NULL);
    if (window == NULL)
    {
        std::cout << "Failed to create GLFW window" << std::endl;
        glfwTerminate();
        return -1;
    }
    glfwMakeContextCurrent(window);

    if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
    {
        std::cout << "Failed to initialize GLAD" << std::endl;
        return -1;
    }
    glViewport(0, 0, 800, 600);
    glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);

    while (!glfwWindowShouldClose(window))
    {
        processInput(window);

        glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);
        glfwSwapBuffers(window);
        glfwPollEvents();
    }

    glfwTerminate();
    return 0;
}
void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
    glViewport(0, 0, width, height);
}
void processInput(GLFWwindow *window)
{
    if(glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
        glfwSetWindowShouldClose(window, true);
}
```

# **출처**

[LearnOpenGL - Hello Window](https://learnopengl.com/Getting-started/Hello-Window)

[LearnOpenGL - Hello Triangle](https://learnopengl.com/Getting-started/Hello-Triangle)
