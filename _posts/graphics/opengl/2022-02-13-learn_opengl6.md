---
title: "[learn-opengl] Transformations"
date: 2022-02-13T22:9:26Z
category: ["graphics", "graphics-opengl"]
tags: [opengl]
---

벡터, 내적, 외적, 행렬은 생략

# **그래픽스 변환**

1. 강체 변환(rigifbody transformation)

   - 이동변환 + 회전변환

   - 모습은 불변

2. 유사변환(similarity transformation)

   - 강체변환 + 균등크기조절변환 + 반사변환

   - 물체사이의 각이 유지

   - 물체내부 정점간의 거리가 일정한 비율로 유지

3. 어파인 변환(affine transformation)

   - 유사변환 + 차등 크기조절 + 전단 : 물체의 타입이 유지, 변환행렬의 마지막 행이 (0, 0, 0, 1)

4. 원근 변환(perspective transformation)

   - 평행선이 만남, 소실점에서 만남, 마지막행이 (0, 0, 0, 1) 이 아님

5. 선형 변환(linear transformation)

   - 어파인 + 원근 : 선형조합으로 표시되는 변환

6. 비선형변환

# **Scaling matrix**

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FqkpmD%2Fbtrax8Opxrr%2FW78jQNRY7WKBwEDzphKWZ0%2Fimg.png)

- 비균일 스케일, 차등 크기조절(non-uniform)의 예시인 위 사진은 x축으로 0.5, y축으로 2 스케일링한것

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbF9f41%2FbtrazMxAw2f%2FojwJEK6ZwCoPhKtsFmyCo0%2Fimg.png)

- 균일 스케일, 균등 크기조절(uniform) 은 모든 축이 동일한 스케일링

- 스케일 변환 행렬은 단위 행렬에 각 대각 요소가 대응하는 벡터 요소와 곱해진 것과 같다.

# **Translation**

- 벡터를 이동하는 행렬

  - 단위 벡터에 이동할만큼 맨 끝 열에 추가

  - 동차좌표계의 장점이 돋보임

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FnS29z%2FbtraqRz9eoD%2FF0xBZ18U8FUTd8X4i4XCqk%2Fimg.png)

# **Rotation**

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FDCNSZ%2Fbtrd15VN7SF%2FGN1CURGuzh3gtPLsWG6Gu0%2Fimg.png)

https://www.youtube.com/watch?v=gxUcgc88tD4&list=PL8327DO66nu9qYVKLDmdLW_84-yE4auCR&index=12

```cpp
Most rotation functions require an angle in radians, but luckily degrees are easily converted to radians:
angle in degrees = angle in radians * (180 / PI)
angle in radians = angle in degrees * (PI / 180)
Where PI equals (rounded) 3.14159265359.
```

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FUyZdu%2Fbtrasurcr5G%2FKfXQ3TuvMxSwPkxXcO6v7k%2Fimg.png)

3d 공간에서의 회전은 각 그리고 회전축을 사용한다.

- 주어진 회전축에 대해 회전시키는것

- 삼각법을 사용하여 주어진 각에 대해 벡터를 회전하여 새로운 벡터로 변환하는것

- sin , cos 의 조합 (싸코 공식)

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FnXXgV%2FbtrazMRSTF9%2FAfWxFhJ6R8QXMEccXuEGkK%2Fimg.png)

- 회전행렬을 사용하면 위치 벡터를 세가지 축 중 하나에 대해 변환시킬 수 있다.

  - 여러 회전을 조합할 수 있음 (하지만 Gimbal lock 문제가 일어날 수 있음)

  - 회전 행렬을 조합하는 것 대신 임의의 단위 축을 중심으로 즉시 회전하는것이 더 바람직함

  - 밑은 회전축이 (Rx, Ry, Rz) 일 경우의 회전행렬(완벽히 gimbal lack을 예방하지 못함)

  - 완전히 안전한것은 사원수(quaternions)를 사용하여 회전하는것

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2F6aP5J%2Fbtrao7wMJMT%2FY4c9abDYjc5UCzklrZKTY1%2Fimg.png)

# **Combining** **Matrices**

- 여러 변환 행렬을 조합해서 사용할 수 있다는것은 행렬의 장점중 하나이다.

- 곱의 교환법칙이 성립하지 않으므로 곱하는 순서를 정하는것이 중요하다.

- 가장 오른쪽에 있는 행렬이 벡터와 처음 곱해짐.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FFRxMm%2FbtraBUonD80%2Fz60vjvzo4MiWdnHbY59EP1%2Fimg.png)
![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbJjH5I%2FbtrasUpndDo%2FlX8qUK1hFXFkp6pwSx4tvK%2Fimg.png)

# GLM 사용

```cpp
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>
```

- 0.9.9 버전 부터 초기화된 기본행렬이 단위행렬이 아니고 0으로 초기화됨

- 다음 함수를 사용하여 단위행렬로 초기화해야함.

```cpp
glm::mat4 mat = glm::mat4(1.0f)
```

## **translate**

- 동차좌표계를 사용하고 있다는것을 주의해야한다.

- (1, 1, 0) 만큼 이동시키는 예

```cpp
glm::vec4 vec(1.0f, 0.0f, 0.0f, 1.0f);
glm::mat4 trans;
trans = glm::translate(trans, glm::vec3(1.0f, 1.0f, 0.0f));
vec = trans * vec;
std::cout << vec.x << vec.y << vec.z << std::endl;
```

## **rotate, scale**

```cpp
glm::mat4 trans = glm::mat4(1.0f);
trans = glm::rotate(trans, glm::radians(90.0f), glm::vec3(0.0, 0.0, 1.0));
trans = glm::scale(trans, glm::vec3(0.5, 0.5, 0.5));
```

- `rotate = (0.0, 0.0, 1.0)`: z축을 기준으로 회전 (x, y평면이기 때문)

  - 중심으로 돌리기 위한 축은 반드시 단위벡터여야함. 정규화 필수.

- `scale = (0.5, 0.5, 0.5)`: 균등 크기조절, 2배 작개

  - GLM 함수에 행렬을 전달하기 때문에, 서로곱한 결과로 모든 변환이 조합된 행렬이 리턴

## **shader에서 변환행렬 가져오기**

```glsl
#version 330 core
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec2 aTexCoord;

out vec2 TexCoord;

uniform mat4 transform;

void main()
{
    gl_Position = transform * vec4(aPos, 1.0f);
    TexCoord = vec2(aTexCoord.x, aTexCoord.y);
}
```

- glsl mat4 타입으로 uniform으로 선언한다음, 각 연산에 vertex pos에 곱해줌

- 스칼라-행렬 곱, 행렬-벡터 곱, 행렬-행렬 곱 같은 연산 지원해줌

## **uniform 설정**

```cpp
unsigned int transformLoc = glGetUniformLocation(ourShader.ID, "transform");
glUniformMatrix4fv(transformLoc, 1, GL_FALSE, glm::value_ptr(trans));
```

### **glUniformMatrix4fv**

- 파라미터 1 : location

- 파라미터 2 : 행렬의 개수

- 파라미터 3 : column-major ordering : GLM의 기본행렬 레이아웃인 내부행렬 레이아웃을 사용,

  - 행과 열을 바꿀 필요가 없음, false로 지정

- 파라미터 4 : 실제 행렬 데이터, value_ptr함수를 사용하여 행렬을 변환해서 타입을 맞춤.

```cpp
reinterpret_cast<float*>(&trans) == glm::value_ptr(trans) == &trans[0][0]
```

> reinterpret_cast: 모든 포인터 타입간의 형변환을 허용.(static_cast는 오직 상속관계의 포인터 끼리만, 컴파일 시간에 캐스팅 완료), 이전 값에 대한 바이너리를 유지(타입에 따라 출력되는 값이 다를 수 있음, 값만 달라질 뿐)

### 제자리 회전, 이동

```cpp
glm::mat4 trans;
trans = glm::translate(trans, glm::vec3(0.5f, -0.5f, 0.0f));
trans = glm::rotate(trans, (float)glfwGetTime(), glm::vec3(0.0f, 0.0f, 1.0f));
```

- 실제 변환순서는 거꾸로 읽어야한다. (정점을 기준으로 제일먼저 곱해져 변환이 행해지는것은 rotate)

# **출처**

[Transformations](https://learnopengl.com/Getting-started/Transformations)
