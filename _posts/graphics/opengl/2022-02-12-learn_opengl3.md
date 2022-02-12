---
title: "[learn-opengl] Triangle"
date: 2022-02-12T10:16:36Z
category: ["graphics", "graphics-opengl"]
tags: [opengl]
---

# **Shader**

그래픽스 파이프라인의 두가지 부분

- 3D -> 2D

- 2D -> 화소픽셀

- 대부분 vertex shader, fagment shader만 사용.

- Geometry shader는 선택적으로 사용

- GPU에 기본 vertex/fragment shader 가 없음 => 스스로 작성해야함

## **그래픽 파이프라인의 입력 : 3D 좌표**

- 여러단계를 거침
- 각 단계는 전 단계의 결과를 입력으로.
- 모든 단계는 특성화됨
- 병렬로 실행됨
- 각 단계에서 GPU 위에 작은 프로그램들을 실행시킴
- 데이터를 빠르게 처리 (GPU의 수많은 작은 프로세싱 코어들)

- 이런 작은 프로그램들이 바로 shader

## **쉐이더**

- 존재하는 기본 쉐이더를 대체할 수 있음
- 설정가능한 쉐이더 : 파이프라인의 특정한 부분을 좀 더 세밀한 조작을 가능하게함.
- GPU 위에 실행 => CPU 시간을 절약
  => OpenGL Shading Language (GLSL)
  ![파란배경 == 작성한 쉐이더 사용 가능](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FGSrak%2FbtraiFTBWxM%2FWIvHK73EckPcugX4FfTcYK%2Fimg.png)

## **그래픽 파이프라인**

- 많은 일을 하는것을 위 그림에서 볼 수 있음.

- 각 부분들은 정점 데이터를 완전히 렌더링된 픽셀로 변환하는 데, 각자 하나의 특정 부분을 관리.

- 삼각형 렌더링 그래픽 파이프라인의 입력 : 삼각형을 구성할 수 있는 정점 데이터 : 3개의 3D좌표리스트

### **정점(vertex)**

- 3D 좌표에 대한 데이터의 집합

- 정점 속성(vertex attributes)를 사용하여 정점의 데이터 표현

- 이 속성은 모든 데이터를 포함할 수 있지만 대표적으로 3D 위치, 컬러값

- OpenGL이 이런 집합을 만들기 위해, 어떤 종류의 렌더링 유형인 것인지 알려줘야함

- 이러한 힌트들을 primitives 라고함: GL_POINTS, GL_TRIANGLES, GL_LINE_STRIP

### **vertex shader**

- 파이프 라인의 첫번째 부분

- 하나의 정점을 입력으로 받는 정점 쉐이더(vertex shader)

- vertex 쉐이더의 주 목적 1 : 3D 좌표를 다른 3D 좌표로 변환하는것

- vertex 쉐이더의 주 목적 2 : vertex 속성에 대한 기본적인 처리

### **primitive assembly 단계**

- primitive 를 구성 (primitive 도형의 모든 점들을 조립하는 vertex 쉐이더로부터)

- 입력 값 : 모든 정점들을 받는다. (GL_POINTS 같은 경우 하나의 정점)

- 결과 값 : geometry shader로 전달

### **geometry shader**

- 입력값 : 정점들의 집합

- 이 정점들의 집합은 primitive를 구성하고,

- 새로운 정점을 생성하여 새로운 primitive를 형성, 다른 도형으로 변환

- 위 그림에선 삼각형한개를 두개로 생성

- 결과 값 : rasterization stage로 전달

### **rasterization stage**

- 결과 primitive 를 최종 화면의 적절한 픽셀과 매핑

- 그 결과 fragment shader에서 사용할 fragment(조각)이 도출

- fragment shader를 실행하기 전 clipping을 수행

### **clipping**

- 성능을 증가시키기 위해 뷰 밖에 있는 모든 fragment들을 제거

- OpenGL 에서 fragment는 하나의 픽셀을 렌더링 하기 위해 필요한 모든 데이터

### **fragment shader**

- 목적: 픽셀의 최종 컬러를 계산하는것

- advanced OpenGL effects 가 발생하는 단계

- 일반적으로 fragment shader는 3D scene에 대한 데이터를 가지고 있음

- 이 데이터를 가지고 최종 픽셀 컬러(광원, 그림자, 빛의 색 등)를 계산

### **alpha test and blending stage**

- 최종 결과물의 마지막 단계

- fragment의 해당 깊이(deepth and stencill) 값을 체크

- 최종 fragment가 다른 오브젝트보다 앞에 있는지 뒤에 있는지 체크

- 다른 오브젝트보다 뒤에 있는 fragment는 즉시 폐기.

- 이 단계에서 alpha값(오브젝트의 투명도)를 확인

- 그에 맞춰 다른 오브젝트와 blend

- fragment shader에서의 출력 색 과 최종 픽셀 컬러는 여러개의 삼각형을 렌더링할 때 완전히 다른 색이 될 수 있음

# **투상 파이프라인**

    모델좌표

    | ---- 모델행렬

    전역좌표

    | ---- 뷰 행렬

    시점좌표

    | ---- 투상 행렬 => 후면 제거

    절단좌표 (동차좌표계에서 절단)

    | ---- 원근분할

    정규화장치좌표(NDC)

    | ---- 뷰포트 변환 -> 정수화 glViewport

    화면좌표(뷰포트좌표)

    | ---- 래스터 변환 -> 은면제거 (깊이테이스) -> z값제거

    디스플레이

# **Vertex 입력**

## **OpenGL : 3D 라이브러리**

- 명시한 좌표는 3D 공간의 좌표

- 모든 3D 좌표가 (x, y, z) 에서 값이 -1.0 와 1.0 사이에 있어야 처리(normalized device coordinates 범위)

## **삼각형**

- 3개의 정점 명시

- normalized device coordinates 범위, float 배열 로

- z = 0.0 으로 설정, 2D처럼 보이도록 depth를 같게

```cpp
float vertices[] = {
    -0.5f, -0.5f, 0.0f,
     0.5f, -0.5f, 0.0f,
     0.0f,  0.5f, 0.0f
};
```

## **NDC(Normalized Device Corrdinates)**

- vertex coordinates 가 vertex shader에서 처리되고나면

- 정점들이 NDC 공간으로 변환

- 각 범위는 모두 -1.0 ~ 1.0

- 이 범위 밖의 점은 버려짐

[](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbzD0Ik%2FbtrajpXDIEW%2FXsbN1GpH9NYGvRNFHA5zP1%2Fimg.png)

- 뷰포트 변환을 통해 screen-space coordinates 로 변환
- screen-space coordinates 는 fragment로 변환되어 fragment shader의 입력값으로 전달

## **vertex shader**

- GPU에 정점 데이터를 저장할 공간의 메모리를 할당.

- OpenGL이 어떻게 메모리를 해석할 것인지 구성

- 데이터를 어떻게 그래픽 카드에 전달할 것인지에 대해 명시

- 작업 완료한 다음 정점들을 전달한 만큼 메모리에서 처리

## **VBO(vertex buffer objects)**

- 정점들을 처리하는 메모리를 관리

- 많은 양의 정점들을 GPU 메모리상에 저장할 수 있음

- 대량의 데이터를 한꺼번에 GPU로 전송

- CPU <-> GPU : 느리기 때문에 가능한 많이 보내야함

- 데이터가 그래픽 카드 메모리에 할당되면 vertex shader는 빠르게 정점들에 접근 가능

- OpenGL의 객체로, 이 버퍼도 고유한 ID를 가짐, 버퍼 ID를 생성할 수 있다.

`glGenBuffer(GLsizei size, GLuint* buffers)`

```cpp
unsigned int VBO;
glGenBuffers(1, &VBO);

GLuint vbos[5];
glGenBuffers(5, vbos);
```

## **OpenGL에는 많은 타입의 버퍼 객체가 있음**

- VBO 의 버퍼 타입은 GL_ARRAY_BUFFER

- 다른 버퍼 타입 또한 bind 할 수 있다.

- 새롭게 생성된 버퍼를 glBindBuffer 함수를 사용하여 GL_ARRAY_BUFFER로 바인딩 할 수 있음

```cpp
glBindBuffer(GL_ARRAY_BUFFER, VBO);
```

- 이후부터 호출되는 GL_ARRAY_BUFFER를 타겟으로하는 모든 버퍼는 현재 바인딩 된 버퍼(VBO)를 사용하게됨

## **glBufferData 함수**

- 미리 정의된 정점 데이터를 버퍼의 메모리에 복사

```cpp
glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
```

- 사용자가 정의한 데이터를 현재 바인딩된 버퍼에 복사.

- 첫번째 파라미터 : 데이터를 집어넣을 버퍼의 유형(현재 바인딩된 vbo)

- 두번째 파라미터 : 버퍼에 저장할 데이터의 크기 (바이트 단위. size of)

- 세번째 파라미터 : 보낼 실제 데이터

- 네번째 파라미터 : 그래픽 카드가 주어진 데이터를 관리하는 방법

  1. GL_STATIC_DRAW: 데이터가 거의 변하지 않음 (현재 예제에선 적절)

  2. GL_DYNAMIC_DRAW: 데이터가 자주 변경됩니다.

  3. GL_STREAM_DRAW: 데이터가 그려질때마다 변경됩니다.

  2, 3 번일 경우, 그래픽 카드가 빠르게 쓸 수 있는 메모리에 데이터를 저장

- 정점데이터를 메모리에 저장 완료 : 이 메모리는 VBO가 관리, vertex/fragment shader가 처리

# **Vertex shader**

- 프로그래밍 할 수 있는 shader 중 하나

- GLSL 를 통해 vertex shader를 작성, 컴파일, 응용프로그램에서 사용

- 아래는 기초적인 vertex shader 코드이다.

```cpp
#version 330 core
layout (location = 0) in vec3 aPos;

void main()
{
    gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);
}
```

- glsl는 c 와 유사함.

## **#version 330 core**

- 처음으로 버전 선언, OpenGL3.3 이상 부터, glsl 버전과 OpenGL과 맞아야함.

  (ex, 4.2 == 420)

- core profile 기능 사용 명시

## **in vec3 aPos;**

- in 키워드 : 모든 입력 정점 속성을 선언

- 현재는 위치 데이터만 사용, 오직 하나의 정점 속성만 필요

- vector 타입 은 1~4개의 실수, 각 정점은 3차원이기 때문에 vec3 타입 생성

## **layout (location = 0)**

- 입력 변수의 location을 설정

## **vector**

- glsl의 벡터는 최대 크기가 4

- vec.x, vec.y, vec.z , vec.w 로 접근

- w : perspective division : 원근 분할 : 동차 좌표계에서 사용

## **gl_Position**

- 출력값 설정하기위해 미리 선언된(predefined) gl_Position 변수에 위치 데이터를 할당

- vec4 타입이므로 형변환, w 값을 1.0으로 설정

> 현재 shader는 가장 간단한것: 입력데이터에 대해 처리 x, 간단히 출력값으로 전달, 먼저 입력데이터를 OpenGL의 표시할 수 있는 영역 내에 있는 좌표로 변환해야함

# **Compiling a shader**

- 세이더 소스코드를 const char 로 저장.

```cpp
const char *vertexShaderSource = "#version 330 core\n"
    "layout (location = 0) in vec3 aPos;\n"
    "void main()\n"
    "{\n"
    "   gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);\n"
    "}\0";
```

## **glCreateShader**

- OpenGL이 shader를 사용하려면, 런타임시에 소스코드를 동적으로 컴파일해야함

- ID를 참조하여 shader 객체를 생성해야함.

- 그러기 위해선 unsigned int 타입으로 세이더를 저장해야하고,

- glCreateShader함수로 생성해야함. (에러시 0리턴)

```cpp
unsigned int vertexShader;
vertexShader = glCreateShader(GL_VERTEX_SHADER);
```

- glCreateShader함수의 파라미터로 shader의 유형 입력 : `GL_VERTEX_SHADER`

## **glShaderSource**

```cpp
glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
glCompileShader(vertexShader);
```

- 그리고 소스코드를 객체에 첨부, shader를 컴파일
- glShaderSource 함수는 shader 소스를 객체에 바인딩함.

  - 첫번째 파라미터(shader): shader 객체

  - 두번째 파라미터(count): 소스코드가 몇개의 문자열인지 (string array의 크기)

  - 세번째 파라미터(string): vertex shader의 실제 코드

  - 네번째 파라미터(length): an array of string lengths

## **glCompileShader 함수**

- 컴파일이 성공적으로 완료됬는지, 어떤 오류가 발생했는지 아래 함수들을 사용하면 알 수 있음

- getShaderiv : 컴파일의 성공 유무

- getGetShaderInfoLog : 에러메시지 확인,

```cpp
int  success;
char infoLog[512];
glGetShaderiv(vertexShader, GL_COMPILE_STATUS, &success);

if(!success)
{
    glGetShaderInfoLog(vertexShader, 512, NULL, infoLog);
    std::cout << "ERROR::SHADER::VERTEX::COMPILATION_FAILED\n" << infoLog << std::endl;
}
```

# **Fragment shader**

- 삼각형을 렌더링하기위해 생성해야할 쉐이더

- 픽셀의 출력 컬러값을 계산하는 것에 관한 쉐이더.

- 컬러값 = RGBA 의 리스트

- 각 값들의 범위 0.0 ~ 1.0

- 주어진 3개의 색으로 1600만개 이상의 색을 만들 수 있음.

```cpp
#version 330 core
out vec4 FragColor;

void main()
{
    FragColor = vec4(1.0f, 0.5f, 0.2f, 1.0f);
}
```

- 오직 하나의 출력 변수

- 크기가 4인 벡터

- 최종 컬러를 정의

## **out 키워드**

- 출력값 선언

## **compile**

- 컴파일은 vertex와 비슷. GL_FRAGMENT_SHADER로 설정하면됨

```cpp
unsigned int fragmentShader;
fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
glShaderSource(fragmentShader, 1, &fragmentShaderSource, NULL);
glCompileShader(fragmentShader);
```

# **Shader Program**

- 여러 shader를 결합한 마지막 연결된 버전

- 컴파일된 shader들을 shader program 객체로 연결(link)

- 객체를 렌더링할때 이 shader program을 활성화 하면됨.

- 활성화된 shader program 안의 shader 들은 렌더링 명령이 호출될 때 사용됨

- 입력정점 데이터을 GPU한테 보내고, 어떻게 처리해야하는지 vertex 와 fragment 를 통해 명령해야함.

## **연결**

- 한 세이더의 출력값을 다음 세이더의 입력값으로 연결

- 출력과 입력이 일치하지 않으면 linking error 발생

## **Program 객체 생성**

```cpp
unsigned int shaderProgram;
shaderProgram = glCreateProgram();
```

- glCreateProgram 함수 : program을 생성, 생성된 객체의 ID를 리턴

- glAttachShader 함수 : shader를 program 객체에 붙임.

- glLinkProgram 사용하여 연결

```cpp
glAttachShader(shaderProgram, vertexShader);
glAttachShader(shaderProgram, fragmentShader);
glLinkProgram(shaderProgram);
```

## **연결여부확인**

```cpp
glGetProgramiv(shaderProgram, GL_LINK_STATUS, &success);
if(!success) {
    glGetProgramInfoLog(shaderProgram, 512, NULL, infoLog);
    ...
}
```

## **link 결과**

- 결과는 glUseProgram 함수를 호출하여 활성화할 수 있는 program 객체이다.

```cpp
glUseProgram(shaderProgram);
```

glUseProgram 함수를 호출한 이후의 모든 shader와 렌더링 명령은

이 객체를 통해 내부의 세이더들을 사용하게됨

shader들을 program객체로 연결하고나면, shader 객체들을 제거해야함

```cpp
glDeleteShader(vertexShader);
glDeleteShader(fragmentShader);
```

# **Linking Vertex Attributes**

- OpenGL은 메모리 상의 정점 데이터를 어떻게 해석해야하는지 아직 모름

- 정점데이터를 vertex shader의 속성들과 어떻게 연결해야하는지 모름

- OpenGL한테 알려줘야함

## **vertex**

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fd0yxIx%2FbtraivR413v%2F1hP3GqxkOVtmhggP1TFIY0%2Fimg.png)

- vertex shader 는 원하는 모든 입력들을 정점 속성의 형식으로 지정할 수 있도록해줌.

- 유연성이 좋은 반면, 입력 데이터의 어느 부분이 vertex shader의 어떠한 정점 속성과 맞는지 직접 지정해야함

- 삼각형의 3점 : float vertices[3]

  1. position data 는 32-비트(4 바이트)의 floating point values.

  2. 각 position 은 3가지값으로 구성됨

  3. 각 3개 값의 집합들은 tightly packed array임.(연속적, 공백이 없음)

  4. 데이터의 첫 번재 값은 버퍼의 시작지점에 있음.

## **glVertexAttribPointer함수**

```cpp
glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);
glEnableVertexAttribArray(0);
```

- 위의 정보들과 함께 OpenGL에게 vertex 데이터(vertex 속성)를 어떻게 해석해야하는지를 알려줄 수 있다.

- 파라미터 1 : vertex attribute, vertex shader code 에서 layout (location = 0) 코드를 사용하여 속성위치 지정, vertex 속성의 위치(location)을 0으로 설정하고, 데이터를 vertex 속성에 전달

- 파라미터 2 : vertex 속성의 크기를 지정, 이 vertex 속성은 vec3 타입, 따라서 3개의 값

- 파라미터 3 : 데이터의 타입, (glsl에서 vec\* 은 실수형)

- 파라미터 4 : 데이터를 정규화할 것인지?, TRUE일 때 int, byte type 이면 => 값을 0(signed : -1) ~ 1 범위의 float 값으로 변환.

- 파라미터 5 : stride, 연속적인 vertex 속성의 크기를 알려줘야함. xyz 로 3개의 float 뒤에 다음 속성이 있음을 알려줌. 만약 값들이 빽빽하게 저장되어있으면 0으로 지정.

- 파라미터 6 : void\* 타입, 형변환이 필요. 이는 버퍼에서 데이터가 시작하는 위치의 offset, 시작부분에 있으면 0으로지정

> 각 vertex 속성은 VBO에 의해 관리되는 메모리로부터 데이터를 받는다. 데이터를 받을 VBO (여러 VBO를 가질 수 있음)는 glVertexAttribPointer 함수를 호출할때 GL_ARRAY_BUFFER에 현재 바인딩된 VBO로 결정됨, glVertexAttribPointer 함수가 호출하기전에 미리 정의된 VBO가 바인딩되어있으므로 vertex 속성 0 이 해당하는 vertex 데이터와 연결된다.

## **glEnableVertexAttribArray** **함수**

- vertex 속성 location을 전달하고 호출, vertex 속성을 사용할 수 있도록함

- vertex 속성의 default : disabled

## **draw**

- vertex buffer 객체를 사용하여 vertex 데이터를 초기화, vertex shader 와 fragment shader 설정

- OpenGL에게 vertex 데이터가 vertex shader의 vertex 속성에 연결하면 모든 설정이 끝난다.

```cpp
// 0. copy our vertices array in a buffer for OpenGL to use
glBindBuffer(GL_ARRAY_BUFFER, VBO);
glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

// 1. then set the vertex attributes pointers
glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);
glEnableVertexAttribArray(0);

// 2. use our shader program when we want to render an object
glUseProgram(shaderProgram);

// 3. now draw the object
someOpenGLFunctionThatDrawsOurTriangle();
```

- 객체를 그려야할 때마다 이 과정을 반복해야함

- 굉장히 번거로운 과정이기 때문에 이 객체를 바인딩하여 상태를 저장하는게 VAO

# **Vertex** **Array** **Object**

## **VAO** **(Vertex Array Object)**

- vbo와 같이 바인딩될 수 있으며, vertex 속성 호출은 VAO에 저장됨.

- vertex 속성 포인터를 구성할 때 오직 한 번 호출하기만 하면 되고 오브젝트를 그려야 할 때마다 해당 VAO를 바인딩하면 된다는 장점을 가짐.

- 서로 다른 vertex 데이터와 속성들을 다른 VAO를 바인딩함으로써 손쉽게 교체할 수 있음

- 설정한 모든 상태가 VAO 내부에 저장됨.

## **Core** **OpenGL**

- 정점 입력과 관련하여 VAO를 사용하도록 요구.

- VAO를 바인딩하는데에 실패한다면 OpenGL은 어떤것이든 그리기를 거부할 수 도있음.

## **Vertex array object는 다음 항목을 저장함**

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FLEZOA%2Fbtrai8oYkPg%2FtMTX2jM8SNdDPYQvk7Dexk%2Fimg.png)

1. glEnableVertexAttribArray 함수나 glDisableVertexAttribArray 함수의 호출

2. glVertexAttribPointer 함수를 통한 Vertex 속성의 구성

3. glVertexAttribPointer 함수를 통해 vertex 속성과 연결된 Vertex buffer objects(VBOs)

## **생성**

VAO를 생성하는 과정 == VBO와 비슷한 과정

```cpp
unsigned int VAO;
glGenVertexArrays(1, &VAO);
```

## **glBindVertexArray**

- VAO를 바인딩

- 그 후 부터 해당 VBO와 속성 포인터를 바인딩하여 구성하고

- VAO를 나중에 사용하기 위해 언바인딩해야함.

- 오브젝트를 그리려면 간단히 원하는 세팅과 함께 VAO를 바인딩하면됨.

```cpp
// ..:: Initialization code (done once (unless your object frequently changes)) :: ..

// 1. bind Vertex Array Object
glBindVertexArray(VAO);

// 2. copy our vertices array in a buffer for OpenGL to use
glBindBuffer(GL_ARRAY_BUFFER, VBO);
glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

// 3. then set our vertex attributes pointers
glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);
glEnableVertexAttribArray(0);


[...]

// ..:: Drawing code (in render loop) :: ..
// 4. draw the object
glUseProgram(shaderProgram);
glBindVertexArray(VAO);
someOpenGLFunctionThatDrawsOurTriangle();
```

## **VAO**

- vertex 속성 구성을 저장

- 처음에 VAO(and thus the required VBO, attribute pointers)를 생성하고 설정

- 그리고 그것들을 나중에 사용하기위해 저장

- 오브젝트들 중에 하나를 그리고싶으면, 해당 VAO를 가지고와 바인딩

- 오브젝트를 그린 후 VAO를 언바인딩해야한다. (VAO와 VBO를 언바인딩)

```cpp
    unsigned int VBO, VAO;
    glGenVertexArrays(1, &VAO);
    glGenBuffers(1, &VBO);
    // bind the Vertex Array Object first, then bind and set vertex buffer(s), and then configure vertex attributes(s).
    glBindVertexArray(VAO);

    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);
    glEnableVertexAttribArray(0);

    // note that this is allowed, the call to glVertexAttribPointer registered VBO as the vertex attribute's bound vertex buffer object so afterwards we can safely unbind
    glBindBuffer(GL_ARRAY_BUFFER, 0);

    // You can unbind the VAO afterwards so other VAO calls won't accidentally modify this VAO, but this rarely happens. Modifying other
    // VAOs requires a call to glBindVertexArray anyways so we generally don't unbind VAOs (nor VBOs) when it's not directly necessary.
    glBindVertexArray(0);
```

# **삼각형** **그리기**

- OpenGL은 glDrawArrays 함수를 제공해줌.

- 현재 활성화된 shader, 이전에 정의된 vertex 속성구성, VBO의 vertex 데이터(VAO를 통해 간접적으로 바인딩된)들을 사용하여 primitives 를 그린다.

```cpp
glUseProgram(shaderProgram);
glBindVertexArray(VAO);
glDrawArrays(GL_TRIANGLES, 0, 3);
```

## **glDrawArrays** **함수**

- 파라미터 1 : primitive 타입 : GL_TRIANGLES

- 파라미터 2 : vertex 배열의 시작 인덱스

- 파라미터 3 : 몇개의 vertex를 그리는지

[전체 코드](https://learnopengl.com/code_viewer_gh.php?code=src/1.getting_started/2.1.hello_triangle/hello_triangle.cpp)

# **Element** **Buffer** **Objects(abbreviated to EBO)**

- 정점들을 렌더링할 때 생각해야하는 것

## **사각형**

- 2개의 삼각형을 사용하여 사각형을 그릴 수 있음 (OpenGL 면의 최소단위는 삼각형)

- 다음과 같은 정점들로 생성할 수 있음

```cpp
float vertices[] = {
    // first triangle
     0.5f,  0.5f, 0.0f,  // top right
     0.5f, -0.5f, 0.0f,  // bottom right
    -0.5f,  0.5f, 0.0f,  // top left
    // second triangle
     0.5f, -0.5f, 0.0f,  // bottom right
    -0.5f, -0.5f, 0.0f,  // bottom left
    -0.5f,  0.5f, 0.0f   // top left
};
```

### **EBO가** **필요한** **이유**

- 정점을 명시하는데 중복되는것이 생김 (bottom right and top Left)

- 오버헤드가 50% 발생

- 4개의 정점만 저장하는 대신, 그리는 순서를 지정해야함

## **EBO**

- VBO 와 같은 버퍼

- 어떠한 정점들을 그려야할 지 결정할 수 있는 인덱스들을 저장

- indexed drawing이라고 불리는 문제 해결방법임.

```cpp
float vertices[] = {
     0.5f,  0.5f, 0.0f,  // top right
     0.5f, -0.5f, 0.0f,  // bottom right
    -0.5f, -0.5f, 0.0f,  // bottom left
    -0.5f,  0.5f, 0.0f   // top left
};
unsigned int indices[] = {  // note that we start from 0!
    0, 1, 3,   // first triangle
    1, 2, 3    // second triangle
};
```

- EBO 버퍼를 생성해야함

```cpp
unsigned int EBO;
glGenBuffers(1, &EBO);
```

- VBO와 유사하게 glBufferData 사용하여 데이터 복사 : bind 와 unbind 사이에 설정해줘야함.

- 버퍼 타입 주의 : GL_ELEMENT_ARRAY_BUFFER

```cpp
glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);
```

- GL_ELEMENT_ARRAY_BUFFER를 타겟으로 지정하고, 바인딩하여 glDrawElements 함수를 사용하여 그림을 그림.

```cpp
glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
```

- 파라미터 2 : 최종적으로 6개의 정점을 그려야하기때문에 6

- 파라미터 3 : 인덱스의 타입

- 파라마터 4 : offset

## **glDrawElements**

- GL_ELEMENT_ARRAY_BUFFER 를 타겟으로 현재 바인딩 된 EBO로 부터 인덱스를 가져옴

- 해당 EBO를 렌더링 할 때마다 바인딩해야한다는것을 의미

## **VAO**

![ebo](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FkVOwD%2FbtraiE9isq4%2FAaTXfPBqujtCVasiSg4wa1%2Fimg.png)

- VAO 는 하지만 EBO 또한 저장함.

- VAO가 바인딩 되어있는 동안 EBO가 바인딩되면 VAO버퍼객체로 저장됨

- VAO가 바인딩하면 자동으로 내부에 있는 EBO도 바인딩

- 타겟이 GL_ELEMENT_ARRAY_BUFFER 일 때의 glBindBuffer 함수호출 또한 저장,

> 언바인드 호출 또한 저장하기때문에 EBO 보다 VAO를 먼저 언바인드해야한다

## **Wireframe** **mode**

- glPolygonMode(GL_FRONT_AND_BACK, GL_LINE)

- primitive 를 어떻게 그릴것인지

- 파라미터 1 : 후면과 전면 중 적용할것 선택

- 파라미터 2 : GL_LINE = 선으로 그리기 , GL_FILL = 채워서 그리기

# **link**

[LearnOpenGL - Hello Triangle](https://learnopengl.com/Getting-started/Hello-Triangle)
