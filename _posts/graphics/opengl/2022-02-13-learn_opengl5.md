---
title: "[learn-opengl] Textures"
date: 2022-02-13T19:0:58Z
category: ["graphics", "graphics-opengl"]
tags: [opengl]
---

# Textures

- 각 모델에는 더많은 vertex들이 필요, 각 vertex는 컬러 attributes이 필요 => 오버헤드

- 텍스처 : 2D, 1D, 3D image

- vertex를 추가하지 않아도 오브젝트가 매우 세밀하게 묘사된것처럼

- 텍스쳐는 많은 양의 데이터를 저장하여 shader에 보낼 수 있음.

## 삼각형에 매핑

- 각 vertex에 텍스처의 어느 부분이 해당하는지 알려주어야함.

- 각 vertex에는 샘플링할 texture coorfinate 가 있어야함

- fragment 보간을 통해 텍스처 좌표 를 보간

## 텍스처 좌표의 범위

- x와 y축상의 0~1

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fbp0ME0%2Fbtrat1Ic0Rr%2FuSQOaHVzcwN7oY5FSbnkt0%2Fimg.png)

- 텍스쳐 좌표를 사용하여 텍스쳐 컬러를 가져오는것을 sampling이라고 함.

- 좌측하단 vertex : (0, 0)

- 우측하단 vertex : (1, 0)

- 중앙상단 vertex : (0.5, 1.0)

- vertex shader에 3개의 텍스처 좌표를 전달

- fragment shader에 전달 => 모든 텍스처 좌표를 각 fragment에 보간

```cpp
float texCoords[] = {
    0.0f, 0.0f,  // lower-left corner
    1.0f, 0.0f,  // lower-right corner
    0.5f, 1.0f   // top-center corner
};
```

- OpenGL에게 sample 하는 방법을 알려줘야함

# Texture Wrapping

- 텍스처 좌표의 범위는 (0, 0) ~ (1, 1) 이다

- OpenGL의 기본 동작은 텍스처 이미지를 반복하는 것.

- 기본적으로 텍스처 좌표에 정수 부분을 무시.

- 아래와 같은 옵션을 사용할 수 있다.

  - `GL_REPEAT`: 텍스처의 기본 동작, 이미지를 반복

  - `GL_MIRRORED_REPEAT`: GL_REPEAT와 같지만 반복할때마다 이미지를 반대로 뒤집음

  - `GL_CLAMP_TO_EDGE`: 0과 1 사이의 좌표를 고정, 결과적으로 큰 좌표가 가장자리에 고정되어 가장자리의 패턴이 늘어남.

  - `GL_CLAMP_TO_BORDER`: 범위 밖의 좌표에 사용자가 지정한 테두리 색이 지정.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fl11D7%2Fbtrav8mLV5t%2FKhO8Xk3aUU2H8G9kcCPYb0%2Fimg.png)

= 기본 범위 밖의 좌표를 사용할 때 각 옵션을 통해 출력 형식 설정

= 각 옵션들은 glTexParameter\* 함수를 사용하여 좌표축별로 설정 가능

```cpp
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_MIRRORED_REPEAT);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_MIRRORED_REPEAT);
```

- 파라미터 1 : 텍스처 타겟을 지정, 2D = GL_TEXTURE_2D

- 파라미터 2 : 설정할 옵션과 어떤 축에 적용할 것인지 지정 (s, t, r == x, y , z)

  - WRAP 옵션을 s, t 에

- 파라미터 3 : wrapping 모드를 설정

  - GL_MIRRORED_REPEAT : 현재 활성화된 텍스처의 옵션을 설정

- `GL_CLAMP_TO_BORDER` 옵션인 경우 테두리 색 정해줘야함.

  - fv를 사용하는 glTexParameter 함수를 호출 => 파라미터로 `GL_TEXTURE_BORDER_COLOR` 옵션 설정해야됨

```cpp
float borderColor[] = { 1.0f, 1.0f, 0.0f, 1.0f };
glTexParameterfv(GL_TEXTURE_2D, GL_TEXTURE_BORDER_COLOR, borderColor);
```

# Texture Filtering

- 좌표는 해상도에 의존하지 않음.

- 하지만 실수 값이 될 수 있음

- OpenGL은 텍스처 좌표를 매핑할 텍스쳐 픽셀 (텍셀(texel)) 을 찾아야함

- 매우 큰 물체에 낮은 해상도의 텍스처가 있는 경우 특히 중요.

- 이를 위한게 texture filtering 옵션

- GL_NEAREST, GL_LINEAR

## GL_NEAREST

- nearest neighbor filtering

- 기본적인 필터링 방법

- 텍셀의 중심이 텍스처 좌표에 가장 가까운 텍셀을 선택

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fn9ghl%2FbtraoBRxmD1%2Fk3cchmi4KcsKJXYOQKT0t1%2Fimg.png)

## GL_LINEAR

- bilinear filtering

- 텍스처 좌표의 이웃한 텍셀에서 보간된 값을 가져와 텍셀 사이의 색상의 근사치를 가져온다.

- 텍셀의 중심까지의 거리가 가까울수록 그 색이 더 강함
  ![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcZRz2j%2FbtrawAXOBkn%2FvoxkUCQExLqeaG2QYdyXQ1%2Fimg.png)
  ![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FmzrE0%2FbtraoC3YnfY%2FZxfLcq2k8mYoNn1MyZH8ik%2Fimg.png)

- 큰 오브젝트에 해상도가 낮은 텍스처를 사용할 때 (텍스처 스케일 업, 텍셀들이 눈에 띔)

- Nearest 는 blocked pattern 명확히 볼 수 있음 (8-bit look)

- Linear 은 smoother pattern 로 개별 픽셀들이 덜 보임.

## 확대(magnifying), 축소(minifying) 작업에 대해 설정

- 축소 : nearest

- 확대 : linear

- glTexParameter\* 함수를 통해 필터링 방법을 지정해야함.

```cpp
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
```

# Mipmaps

- 수천개의 오브젝트가 있는 넓은 공간에 각각에 텍스처가 첨부될 경우

- 오브젝트가 멀리 떨어진것 : 몇개의 fragment만 생성,

  - 텍스쳐의 대부분을 차지하는 fragment를 위한 텍스처 색상을 선택

- 고해상도 텍스처에서 해당 fragment의 올바른 색상 값을 가져오는데 어려움을 겪는다.

- **작은 물체에 고해상도 텍스처를 사용하여 메모리 낭비, 물체에 결함이 보일 수 있음**

## mipmaps

- 텍스처의 집합, 순차적으로 이전 텍스처보다 2배씩 작아지는 텍스처들

- 특정 거리 임계값을 넘으면 적합한 mipmap 텍스처를 사용하게됨

- 작은 해상도의 텍스처는 사용자 눈에 잘띄지않음

- 성능 향상에 도움 (적은 캐시 메모리의 사용)

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdKHBB9%2FbtrapGx3HDH%2Fr3MLdeQ7lPXlsKZO0Ypk31%2Fimg.png)

- 수작업 : cumbersome (성가신)

- OpenGL 은 `glGenerateMipmaps` 함수를 통해 mipmaps을 생성

- 렌더링 중 mipmap을 전환할때 OpenGL은 mipmap레이어 사이에, 가장자리가 선명하게 나타날 수 있는 결함이 생길 수 있음

- nearest, linear 필터링을 사용하여 mipmap 레벨 사이를 필터링 할 수 있음.

- mipmap레벨 사이의 필터링 방법을 지정하기 위해 필터링 방법을 4가지 옵션중 하나로 대체가능

## glTexParameteri 사용

1. GL_NEAREST_MIPMAP_NEAREST

   - nearest neighbor 보간법으로 mipmap을 필터링하고, 텍스처 샘플링도 nearest neghbor 보간법을 사용

2. GL_LINEAR_MIPMAP_NEAREST:

   - nearest neighbor 보간법으로 mipmap을 필터링, 텍스처 샘플링은 linear 보간법을 사용

3. GL_NEAREST_MIPMAP_LINEAR:

   - linear 보간법으로 mipmap을 필터링, 텍스처 샘플링은 nearest neighbor 보간법을 사용

4. GL_LINEAR_MIPMAP_LINEAR:
   - linear 보간법으로 mipmap을 필터링, 텍스처 샘플링도 linear 보간법을 사용

```cpp
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
```

> <font color=red>**주의**</font> : mipmap 필터링 옵션중 하나를 확대 필터로 설정하는것=> mipmap은 축소될때 주로 사용, 확대인 경우 효과 없음=> GL_INVALID_ENUM 오류코드

# Loading and creating textures

- 응용프로그램에 텍스처를 로드

- 텍스처 이미지는 수십가지 파일 형식으로 저장될 수 잇음

- 각 형식은 고유한 구조와 데이터 순서로 되어있음

  - 해결책1: 파일 형식을 선택(png), 이미지 형식을 큰 바이트 배열로 변환하는 이미지 로더 작성

  - 해결책2: 더 많은 파일 형식을 지원해야하는것 => 이미지로더를 형식에 맞게 작성 => stb_image.h 라이브러리 이용

## [stb_image.h](https://github.com/nothings/stb/blob/master/stb_image.h)

= cpp에 아래 코드 추가.

```cpp
#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"
```

- STB_IMAGE_IMPLEMENTATION : 전처리기(preprocessor) 는 헤더 파일을 관련된 정의 소스코드만 포함하도록함.

```cpp
int width, height, nrChannels;
unsigned char *data = stbi_load("container.jpg", &width, &height, &nrChannels, 0);
// stbi_load(filename_, &tex_width_, &tex_height_, &tex_channels_, STBI_rgb_alpha);  이미지 포맷을 기본적으로 rgba로 읽는 코드
```

- 텍스처를 생성하기 위해서, width 와 height 정보가 필요함.

## Generating a texture

- 이전 객체들과 마찬가지로 ID로 참조

## glGenTextures 함수

- 파라미터 1: 생성할 객체의 크기

- 파라미터 2: ID 배열

```cpp
unsigned int texture;
glGenTextures(1, &texture);
```

## glBindTexture 함수

- 텍스처를 바인딩, 그 후 명령이 현재 바인딩된 텍스처를 대상으로 설정

```cpp
glBindTexture(GL_TEXTURE_2D, texture);
```

## glTexImage2D

- 이전에 로드된 이미지 데이터를 사용하여, 텍스처를 생성할 수 있음

- 한번 호출하면 현재 바인딩된 객체가 첨부된 이미지를 가지게됨

- mipmap을 사용하고 싶으면 `glGenerateMipmap` => 현재 바인딩된 텍스처에 대해 자동 생성

```cpp
glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, data);
glGenerateMipmap(GL_TEXTURE_2D);
```

- 파라미터 1 : 텍스처 타겟을 지정(GL_TEXTURE_2D로 바인딩 된 객체에 텍스처 생성하겠다는 것)

  - GL_TEXTURE_1D, GL_TEXTURE_3D 로 바인딩된 객체에는 아무런 영향을 끼치지 않음

- 파라미터 2 : mipmap 레벨을 수동으로 지정 (수작업으로 mipmap 만들었을 경우)

- 파라미터 3 : 텍스처가 어떤 포멧을 가져야하는지, 다룰 이미지는 RGB 값만 가지므로 GL_RGB

- 파라미터 4~5 : 텍스처의 너비와 높이를 설정

- 파라미터 6 : 항상 0 의 값이 되어야함. (legacy stuff)

- 파라미터 7~8 : 원본 이미지의 포맷과 데이터 타입 지정, RGB값이 있는 이미지를 로드, chars(bytes)로 저장한것

- 파라미터 9 : 실제 이미지의 데이터

## 이미지의 메모리 반환(텍스처와 mipmap들을 생성한 후)

```cpp
stbi_image_free(data);
```

## 전체적인 과정

```cpp
unsigned int texture;
glGenTextures(1, &texture);
glBindTexture(GL_TEXTURE_2D, texture);

// set the texture wrapping/filtering options (on the currently bound texture object)
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

// load and generate the texture
int width, height, nrChannels;
unsigned char *data = stbi_load("container.jpg", &width, &height, &nrChannels, 0);
if (data)
{
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, data);
    glGenerateMipmap(GL_TEXTURE_2D);
}
else
{
    std::cout << "Failed to load texture" << std::endl;
}

stbi_image_free(data);
```

## Applying textures

- OpenGL에게 텍스처를 샘플하는 방법을 알려주어야하므로, 텍스처 좌표를 vertex 데이터에 추가해야함

```cpp
float vertices[] = {
    // positions          // colors           // texture coords
     0.5f,  0.5f, 0.0f,   1.0f, 0.0f, 0.0f,   1.0f, 1.0f,   // top right
     0.5f, -0.5f, 0.0f,   0.0f, 1.0f, 0.0f,   1.0f, 0.0f,   // bottom right
    -0.5f, -0.5f, 0.0f,   0.0f, 0.0f, 1.0f,   0.0f, 0.0f,   // bottom left
    -0.5f,  0.5f, 0.0f,   1.0f, 1.0f, 0.0f,   0.0f, 1.0f    // top left
};
```

- vertex attribute를 추가했기 때문에, OpenGL에게 새로운 vertex 포맷을 다시 알려주어야함.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FBPPao%2Fbtrao7W0chC%2FmKmvs6dy0moECEvf8ksBGK%2Fimg.png)

## 텍스쳐 좌표 : stride = 8, offset = 6

```cpp
glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 8 * sizeof(float), (void*)(6 * sizeof(float)));
glEnableVertexAttribArray(2);
```

## vertex shader 에 텍스처 좌표값 추가

```glsl
#version 330 core
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aColor;
layout (location = 2) in vec2 aTexCoord;

out vec3 ourColor;
out vec2 TexCoord;

void main()
{
    gl_Position = vec4(aPos, 1.0);
    ourColor = aColor;
    TexCoord = aTexCoord;
}
```

## fragment shader 에 sample 넘겨줌

- fragment shader 는 텍스처 객체에 접근해야함.

- sampler 텍스처 객체 타입 사용 : sampler1D, sampler2D, sampler3D

- 텍스처를 집어넣을 uniform sampler2D를 선언 : fragment shader에 전달 할 수 있음

```glsl
#version 330 core
out vec4 FragColor;

in vec3 ourColor;
in vec2 TexCoord;

uniform sampler2D ourTexture;

void main()
{
    FragColor = texture(ourTexture, TexCoord);
}
```

### texture 함수

- 앞서 설정했던 텍스처 파라미터를 사용하여 해당 컬러값을 샘플링

- 출력은 보간된 텍스처 좌표에서 필터링된 텍스처의 컬러값임.

- 파라미터 1 : 텍스처 sampler

- 파라미터 2 : 텍스처 좌표

## glDrawElements

- 호출하기 전에 텍스처를 바인딩, 텍스처를 fragment shader의 sampler로 자동으로 할당하게 된다.

```cpp
glBindTexture(GL_TEXTURE_2D, texture);
glBindVertexArray(VAO);
glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
```

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FNzIfC%2FbtrapsGiyh2%2FLpQghMKuH5ZMjVgv55VHjk%2Fimg.png)

- 최종 텍스처 컬러와 vertex 컬러를 혼합할 수 있음

```glsl
FragColor = texture(ourTexture, TexCoord) * vec4(ourColor, 1.0);
```

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FEWWOX%2FbtranhseNZp%2FsmkKLdEYYqoZQZF95aufhK%2Fimg.png)

# Texture Units

- `glUniform` 함수를 사용하지 않음에도 `sampler2D` 변수가 uniform 인지 `glUniform1i함수`를 사용하여 실제 텍스처 sampler에 위치 값을 할당하여 fragment shader에서 동시에 여러 텍스처들을 설정할 수 있음

- 이 텍스처 위치는 texture unit이라고 불림

- 기본 텍스처 유닛은 0

- 이는 기본으로 활성화된 텍스처 유닛이므로, 앞에서는 할당할 필요가 없었음.

- **모든 그래픽 드라이버가 기본 텍스처 유닛을 할당하는 것이 아님.**

- 텍스처 유닛의 주 목적 : shader에서 하나 이상의 텍스처를 사용할 수 있도록.

- sampler 에 텍스처 유닛을 할당함으로, 해당 텍스처 유닛을 활성화하기만 하면

  - 여러 텍스처들을 동시에 바인딩 가능

## glActiveTexture 함수

```cpp
glActiveTexture(GL_TEXTURE0); // activate the texture unit first before binding texture
glBindTexture(GL_TEXTURE_2D, texture);
```

- 바인딩하기전 텍스처 유닛을 전달하여 활성화

- 활성화한 후에 호출되는 bind 함수는 현재 활성화된 텍스처 유닛에 바인딩.

- OpenGL은 최소 16개의 텍스처 유닛을 가지고 있음

- GL_TEXTURE0에서부터 GL_TEXTURE15 순서대로 선언되어 있음

= GL_TEXTURE8 == GL_TEXTURE0 + 8

## fragment shader 수정

### mix 함수

```glsl
#version 330 core
...

uniform sampler2D texture1;
uniform sampler2D texture2;

void main()
{
    FragColor = mix(texture(texture1, TexCoord), texture(texture2, TexCoord), 0.2);
}
```

- 두개의 텍스처를 혼합

- 파라미터 3 : 0.0 -> 첫번째 텍스처 , 1.0 -> 두번째 텍스처 , 0.2 -> 첫번째 80% 두번째20%

### 다른 텍스처를 로드하고 생성

- RGBA를 사용하여 alpha 채널을 포함하고 있는 이미지임을 명시

```cpp
unsigned char *data = stbi_load("awesomeface.png", &width, &height, &nrChannels, 0);
if (data)
{
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGBA, GL_UNSIGNED_BYTE, data);
    glGenerateMipmap(GL_TEXTURE_2D);
}
```

- 두개의 텍스처를 해당 텍스처 유닛에 모두 바인딩해야함.

```cpp
glActiveTexture(GL_TEXTURE0);
glBindTexture(GL_TEXTURE_2D, texture1);
glActiveTexture(GL_TEXTURE1);
glBindTexture(GL_TEXTURE_2D, texture2);

glBindVertexArray(VAO);
glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
```

- 각 sampler를 설정함으로써 OpenGL에게 각 sampler가 속하는 텍스처 유닛이 어떤것인지 알려줘야한다.

```cpp
ourShader.use(); // don't forget to activate the shader before setting uniforms!
glUniform1i(glGetUniformLocation(ourShader.ID, "texture1"), 0); // set it manually
ourShader.setInt("texture2", 1); // or with shader class

while(...)
{
    [...]
}
```

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FrDV4r%2Fbtrat2An1Dd%2FNlfFx5ttksuwuu7A7mzMd1%2Fimg.png)

- OpenGL은 Y축의 0.0좌표를 이미지의 아래쪽으로 인식

- 하지만 대부분의 이미지는 0.0좌표를 Y축의 맨 위를 가리킴.

  - 이미지를 로드하기전 다음 코드를 추가하면 뒤집을 수 있음.

```cpp
stbi_set_flip_vertically_on_load(true);
```

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fcy7GTB%2FbtrasucRE9d%2FUaJB98GtttcZ9CEKP4Gwj0%2Fimg.png)

# link

[learn-opengl Textures](https://learnopengl.com/Getting-started/Textures)
