---
title: "[learn-opengl] Coordinate Systems"
date: 2022-02-14T16:44:55Z
category: ["graphics", "graphics-opengl"]
tags: [opengl]
published: false
---

# **Coordinate Systems**

---

- OpenGL은 각 정점 쉐이더가 실행된 후에 NDC로 표현된 정점을 기대한다.
  - 즉, 모든 좌표는 -1.0에서 1.0 사이어야한다.
  - 이 범위를 벗어나는 좌표는 보이지 않는다.
- NDC 좌표를 rasterizer에 제공 => 화면에서 2D 좌표/픽셀로 변환한다.

- 좌표를 NDC로 변환한 후 화면좌표로 변환하는 작업: 여러 좌표 시스템으로 변환하는 단계별 방식

  - 이유: 각 단계별로 수행하는 연산/계산이 특정 좌표계에서 더 쉽고 명백

- 아래와 같은 5가지 좌표계가 있다.

  - Local space (or Object space)
  - World space
  - View space (or Eye space)
  - Clip space
  - Screen space

- 위 좌표계를 거치면서 vertex가 변형되어 fragment가 된다.

## **The global picture**

---

- 여러 변환 행렬 사용: 한 공간의 좌표 => 다음 좌표 공간으로

- 정점 좌표 => 로컬 좌표 => 월드 좌표 => 뷰 좌표 => 클립 좌표 => 화면 좌표

- 다음 이미지는 프로세스를 표시, 각 변환이 수행하는 작업을 보여준다.

![](https://learnopengl.com/img/getting-started/coordinate_systems.png)

    1. **로컬 좌표**: 객체의 로컬 원점을 기준으로 한 좌표(객체가 시작하는 좌표)
    2. **월드 좌표**: 월드의 원점에 상대적으로 배치된 다른 많은 객체가 있음.
    3. **뷰 좌표**: 월드 좌표를 카메라 또는 뷰어의 시점에서 볼 때와 같은 방식
    4. **클립 좌표**: 좌표가 뷰 공간에 있으면 좌표를 클립하기 위해 좌표를 투영하려고한다
        - -1.0~1.0 범위로 처리, 어떤 정점이 화면에 나타날지 결정 (원근분할 => 정규화장치좌표)
    5. 화면 좌표 : 클립좌표 => glViewport(뷰포트변환) => 화면 좌표 => rasterizer => fragment

- 정점을 다른 공간으로 변형시키는 이유: 일부 작업이 특정 좌표계에서 더 이해하기 쉽거나 사용하기 쉬움.
  - ex. 로컬 공간에서 객체를 수정하는게 월드보다 더 쉬움
  - ex. 다른 객체의 위치와 관련해 객체에 대한 특정 계산을 하는 것은 월드 공간이 더 적합

## **Spaces**

### **Local space**

- 객체가 시작되는 곳.
  - ex. 모델링 소프트웨어(Blender)에서 큐브를 만들었다고 가정, 큐브가 최종적으로 다른 위치에 있더라도 큐브의 원점은 (0, 0, 0)
- 대부분 모델의 초기 위치는 (0, 0, 0)
  - 따라서 모델의 모든 정점은 로컬 공간에 있다.

### **World space**

- 모든 객체를 응용 프로그램에서 직접 가져오면, 월드 원점인 (0,0,0)을 기준으로 내부에 어딘가에 위치해있을 것이다.

- 월드 공간의 좌표: 게임 세계와 관련된 모든 정점 좌표

  - 이 좌표 공간은 객체가 변형된 방식으로 모든 자오에 흩어진 형태로 배치
  - 객체 좌표는 로컬에서 월드로 변환된다. (`Model Matrix`)

- `Model Matrix`: 객체를 변환, 크기 조절, 회전 => 객체가 속한 위치/방향으로 세계에 배치하는 변환 행렬

### **View space**

- 뷰 공간: OpenGL의 카메라(카메라 공간 또는 시각 공간)
  - 월드 좌표를 사용자 시점 앞에 있는 좌표로 변환한 결과
  - 카메라의 관점에서 본 공간
  - 일반적으로 translate, rotation을 결합, 특정 아이템이 카메라의 전면으로 변환되도록함.
  - 결합된 변환은 world 좌표를 뷰 공간으로 변환하는 `View Matrix`내에 저장됨.

### **Clip space**

- 각 정점 쉐이더가 끝나면, OpenGL은 좌표가 특정 범위 내에 있고, 이 범위를 벗어나는 모든 좌표는 절단된다.

- 절단된 좌표는 폐기되고, 나머지 좌표는 화면에 표시되는 `fragment`가 되어 화면에 보임.

- 눈에 보이는 모든 좌표들이 `-1.0`와 `1.0`범위 안으로 지정하는 것은 직관적이지 않음

  - 그러므로 로컬 => 월드 => NDC로 변환하는것

- `projection matrix`: 정점 좌표를 뷰에서 clip-space로 변환하기 위해 좌표의 범위를 지정하는 행렬

  - ex. 각 축에 대해 `-1000에서 1000까지`를 범위로 지정 => 이 행렬은 이 범위 내의 좌표들을 `NDC(-1.0, 1.0)`으로 변환
  - 지정된 범위 밖에 있는 좌표들은 폐기된다.
    > primitive의 일부가 외부에 있을 경우, OpenGL은 클리핑 범위 내에 맞게 하나 이상의 삼각형으로 삼각형을 재구성한다.

- 투영 행렬이 생성하는 viewing box (frustum), 이 내부의 정점들은 화면에 보이게됨.

- `투영(Projection)`: 2D 뷰 공간 좌표로 쉽게 매핑할 수 있는 NDC로 변환하는 전체 프로세스
- `원근 분할(perspective division)`: 절단 좌표로 변환된 후에 수행하는 마지막 작업

  - 위치 벡터의 x, y, z 를 벡터의 w로 나눔.
  - 4D 절단 좌표 =변환=> 3D NDC
  - `vertex shader`의 실행 마지막에 자동으로 수행

- 결과 좌표들 => 화면 좌표에 매핑(뷰포트 변환에 의해) => rasterizer => fragment로 변환

- projection 행렬: view => clip
  - 두개의 다른 형식: 정사영(orthographic) projection 행렬, 원근(perspective)projection 행렬

## **Projections**

---

[projectionmatrix](http://www.songho.ca/opengl/gl_projectionmatrix.html)

### **Orthographic projection**

- 직교 투영 행렬: 정육면체 절두체, 외부의 정점이 폐기되는 절단 공간을 정의
  - 가시 좌표를 정의: 절두체의 width, height, near, far를 정의

![](https://learnopengl.com/img/getting-started/orthographic_frustum.png)

- ortho 절두체 내부의 모든 좌표들을 NDC로 매핑한다.

  - 각 벡터의 w요소를 건드리지 않기 때문
    - `w`가 1.0이라면, 원근분할은 좌표를 수정하지 않기 때문,

- `glm::ortho` 함수 사용

```cpp
glm::ortho(0.0f, 800.0f, 0.0f, 600.0f, 0.1f, 100.0f);
```

    - 파라미터 1, 2: 절두체의 왼, 오
    - 파라미터 3, 4: 절두체의 밑, 위
    - 파라미터 5, 6: near, far 평면 사이의 거리

- 지정된 projection 행렬은 `x`, `y`, `z`범위 값을 가진 모든 좌표들을 NDC로 변환한다.

- ortho projection 행렬은 좌표들을 화면의 2D 평면에 똑바로 매핑.
  - 실제로 똑바로 투영하는 것은 비현실적인 결과를 생성
  - 원근감 고려 x 때문

### **Perspective projection**

- 원근감(perspective): 멀리있는 객체는 작어짐.

![](https://learnopengl.com/img/getting-started/perspective.png)

- 원근법 때문에 선이 멀어짐 == 선이 서로 만남

- `perspective matrix` 사용하여 이를 수행

  - 주어진 절도체를 절단된 공간에 매핑
  - vertex 좌표의 `w`값을 조작.
  - 시점으로부터 vertex 좌표가 멀어지면, `w`값 증가.
  - 좌표들이 절단 좌표로 변환되고 나면, `-w`에서 `w`까지의 범위를 가짐.
  - 최종적으로 -1 과 1 사이의 범위에 있어야하므로 원근 분할 즉, `w`로 나눠야한다.

  $out = \begin{pmatrix} x /w \\ y / w \\ z / w \end{pmatrix}$

- 그 계산 다음, 좌표들은 NDC에 있게 된다.

![](https://learnopengl.com/img/getting-started/perspective_frustum.png)

- GLM에서 다음 함수를 사용하여 생성할 수 있다,
  - 이 함수는 가시 공간을 정의하는 커다란 절두체를 만든다.
  - 절두체 외부의 정점은 폐기된다.
  - 절두체는 균일하지 않은 상자 모양이다.

```cpp
glm::mat4 proj = glm::perspective(glm::radians(45.0f), (float)width/(float)height, 0.1f, 100.0f);
```

    - 파라미터 1: fov(field of view):  뷰 공간의 크기를 설정함
        - 현실적인 시점: 일반적인 45도
        - 둠-스타일: 더 높은 값
    - 파라미터 2: 뷰 포트의 너비를 높이로 나눈 값으로 설정, 화면의 비율 설정(종횡비)
    - 파라미터 3: near, far 거리 설정
        - 일반적으로 0.1f, 100.0f로 설정

        > near 값을 너무 높게(10.0f 같이) 설정 될 때마다 OpenGL은 카메라에 가까운 모든 좌표 (0.0f, 10.0f)를 잘라내어 비디오 게임에서 익숙한 시각적 결과를 제공한다.

### **정리**

- ortho: vertex의 각 요소들은 그대로 clip space에 매핑된다.
  - 복잡한 perspective division을 하긴 하지만, w 요소가 조작되지 않는다.(1로 유지)
  - 멀리 떨어진 오브젝트들이 작게 보이지 않음.
  - 2D렌더링 or 구조적이거나 공학 응용프로그램에서 사용됨
  - 또는 각축에 대해 정밀하게 그릴 때 사용

![](https://learnopengl.com/img/getting-started/perspective_orthographic.png)

## **Putting it all together**

- 앞서 언급한 각 단계에 대한 변환 행렬 Model, View, Projection 행렬을 만들고 계산하면 다음과 같이 절단 좌표로 변환된다.

$Vclip=Mprojection⋅Mview⋅Mmodel⋅Vlocal$

- 결과로 나오는 정점은 `gl_Position`에 할당되어야하며, OpenGL은 원근감 분할 및 자르기를 자동으로 수행한다.

> 정점 쉐이더의 출력은 좌표계가 절단 좌표계, OpenGL은 클립 공간 좌표를 투시-분할해 NDC로 변환한다.

> 뷰포트 변환: OpenGL은 glViewPort의 매개변수를 사용해 NDC를 화면 좌표의 한 지점에 해당하는 화면 좌표에 매핑한다.

## **Going 3D**

- 위의 내용은 전부 3D좌표를 2D 좌표로 변환하는 방법임.

- 이제 3D 드로잉을 할 수 있다.

- 먼저 모델 행렬을 만들어야한다.
  - 모델 행렬은 모든 오브젝트의 정점을 글로벌 월드 공간으로 변환하기위해 적용하고자 하는 translation, scaling, rotations로 구성된다.

```cpp
glm::mat4 model = glm::mat4(1.0f);
model = glm::rotate(model, glm::radians(-55.0f), glm::vec3(1.0f, 0.0f, 0.0f));
```

- 정점 좌표에 위 모델 행렬을 곱해 정점 좌표를 world좌표로 변환할 수 있다.

- 다음으로 뷰 행렬을 보자
  - 물체가 원점(0,0,0)에 있을 때 장면에서 약간 후방으로 이동하는것을 생각해보자
  - 카메라가 뒤로 이동 == 전체 장면을 앞으로 이동
  - 이것이 뷰 행렬이 하는것.
  - 전체 장면을 반전시켜 카메라를 움직이기 원하는 위치로 이동시킴
  - OpenGL은 right-handed시스템 == z축의 양의 방향으로 이동해야한다.
  - 장면을 음의 z축 방향으로 변환하면 된다. (뒤로 움직이고 있다는 느낌을 줌)

> Right-handed system: 기본적으로 양의 x축은 오른쪽으로, 양의 y축은 위로, 양의 z축은 뒤로 향하는것

> 화면은 3축의 중심. 양의 z축은 화면을 통해 사용자쪽으로 향하게된다, 축은 아래와 같이 그려짐

![](https://learnopengl.com/img/getting-started/coordinate_systems_right_handed.png)

> z축이 뒤바뀐것은 left-handed system, 일반적으로 DirectX에서 사용, 정규화된 장치 좌표에서 OpenGL은 실제로 left-handed system을 사용한다.

- 현재 뷰행렬은 다음과 같다.

```cpp
glm::mat4 view = glm::mat4(1.0f);
// note that we're translating the scene in the reverse direction of where we want to move
view = glm::translate(view, glm::vec3(0.0f, 0.0f, -3.0f));
```

- 마지막으로 projection 행렬

```cpp
glm::mat4 projection;
projection = glm::perspective(glm::radians(45.0f), 800.0f / 600.0f, 0.1f, 100.0f);
```

- 이제 변환행렬은 다 만들었고, 이를 쉐이더에 전달해야한다.

- 먼저 변환행렬을 정점 쉐이더에 유니폼으로 선언, 정점 좌표를 곱한다.

```cpp
#version 330 core
layout (location = 0) in vec3 aPos;
...
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main()
{
    // note that we read the multiplication from right to left
    gl_Position = projection * view * model * vec4(aPos, 1.0);
    ...
}
```

- 이제 행렬을 쉐이더에 보내야한다.

```cpp
int modelLoc = glGetUniformLocation(ourShader.ID, "model");
glUniformMatrix4fv(modelLoc, 1, GL_FALSE, glm::value_ptr(model));
... // same for View Matrix and Projection Matrix
```

- mvp행렬을 통해 변환되므로, 최종 객체는 다음과 같다.
  - 뒤쪽 바닥으로 기울어짐
  - 우리한테 조금 멀어짐
  - 원근법으로 표시

## **More 3D**

- 이제 2D 평면을 3D 큐브로 확장해보자

  - 큐브렌더링 == 총 36개의 [꼭짓점](https://learnopengl.com/code_viewer.php?code=getting-started/cube_vertices)

- 큐브가 시간이 지남에 따라 회전하도록하자

```cpp
model = glm::rotate(model, (float)glfwGetTime() * glm::radians(50.0f), glm::vec3(0.5f, 1.0f, 0.0f));

```

- 이제 `glDrawArrays`함수로 큐브를 그려보자.

```cpp
glDrawArrays(GL_TRIANGLES, 0, 36);

```

[영상 주소](https://learnopengl.com/video/getting-started/coordinate_system_no_depth.mp4)

- 위의 영상은 큐브같지 않다.
  - 큐브의 일부 측면이 큐브의 다른 측면 위에 그려지고 있음.
  - 삼각형 단위로 그리기 때문에 발생하는 현상
  - 다른 픽셀이 이미 그려져 있음에도 불구하고 위에 픽셀을 그리는것
- 깊이 정보를 담는 z-buffer를 활용해서 OpenGL이 픽셀 위에 그릴 것인지 안 그릴것인지 결정하게 할 수 있다.
  - depth-testing

## **Z-buffer**

- OpenGL은 모든 깊이 정보를 깊이 버퍼라고하는 z버퍼에 저장한다.

  - GLFW는 이와 같은 버퍼를 자동으로 생성한다.(출력 이미지의 컬러를 저장하는 컬러버퍼처럼)
  - 깊이는 각 fragment(fragment의 z값으로)안에 저장됨.
  - fragment가 출력되길 원할때마다 OpenGL은 해당 깊이값과 z 버퍼를 비교함
  - 그 후 현재 fragment가 다른 fragment 뒤에 있으면 폐기되고, 그렇지 않으면 덮어쓴다.
  - 이 과정을 `깊이 테스트`라 하고, OpenGL에 의해 자동으로 수행됨

- 하지만 OpenGL이 실제 이를 수행하려면 사용할 것이라는 것을 알려줘야한다.

- `glEnable`함수를 사용하여 활성화할 수 있다.
  - 이 함수는 특정 기능을 활성화/비활성화할 수 있다.

```cpp
glEnable(GL_DEPTH_TEST);
```

- 깊이 버퍼를 사용하고 있기 때문에, 이 버퍼도 정리해줘야한다.(그렇지 않으면 이전 프레임 정보가 그대로 남아 있음)

```cpp
glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
```

[전체 소스코드](https://learnopengl.com/code_viewer_gh.php?code=src/1.getting_started/6.2.coordinate_systems_depth/coordinate_systems_depth.cpp)

## **More cubes!**

- 10개의 정육면체를 출력해보자
  - 똑같이 생겼지만, 위치와 회전도 다름.
  - 레이아웃은 이미 정의됨 => 버퍼나 attribute배열들을 수정할 필요가 없다.
  - 수정해야하는것은 `model`행렬

```cpp
glm::vec3 cubePositions[] = {
    glm::vec3( 0.0f,  0.0f,  0.0f),
    glm::vec3( 2.0f,  5.0f, -15.0f),
    glm::vec3(-1.5f, -2.2f, -2.5f),
    glm::vec3(-3.8f, -2.0f, -12.3f),
    glm::vec3( 2.4f, -0.4f, -3.5f),
    glm::vec3(-1.7f,  3.0f, -7.5f),
    glm::vec3( 1.3f, -2.0f, -2.5f),
    glm::vec3( 1.5f,  2.0f, -2.5f),
    glm::vec3( 1.5f,  0.2f, -1.5f),
    glm::vec3(-1.3f,  1.0f, -1.5f)
};
```

- 이제 게임루프 안에서 `glDrawArrays`함수를 여러번 호출하면, 렌더링할 때마다 다른 model 행렬을 vertex shader에게 보낼것이다.

```cpp

glBindVertexArray(VAO);
for(unsigned int i = 0; i < 10; i++)
{
    glm::mat4 model = glm::mat4(1.0f);
    model = glm::translate(model, cubePositions[i]);
    float angle = 20.0f * i;
    model = glm::rotate(model, glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));
    ourShader.setMat4("model", model);

    glDrawArrays(GL_TRIANGLES, 0, 36);
}
```

- 이 코드는 각 새로운 정육면체가 렌더링될 때마다 model행렬을 수정하고, 이것을 총 10번 반복한다.
  - 그러므로 10개의 정육면체가 그려진다.

[전체코드2](https://learnopengl.com/code_viewer_gh.php?code=src/1.getting_started/6.3.coordinate_systems_multiple/coordinate_systems_multiple.cpp)

## **출처**

---

[Coordinate-Systems](https://learnopengl.com/Getting-started/Coordinate-Systems)

[near](https://community.khronos.org/t/interesting-why-glortho-can-use-nagtive-near-argument/73538)
