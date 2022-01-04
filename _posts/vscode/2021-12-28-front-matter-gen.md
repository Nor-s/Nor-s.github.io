---
title: "[vscode] front matter gen"
date: 2021-12-28T16:50:53Z
category: vscode
tags: [vscode, 프로젝트]
---

## **# front matter gen**

---

깃허브 블로그에 포스팅하기위해서는 마크다운에 front matter를 작성해야한다.

그렇기 때문에 템플릿을 만들어주는 vscode 확장을 찾게되었고 [belikejekyll](https://github.com/Abdillah/vscode-belikejekyll)
이라는 확장프로그램을 찾았다.

이 확장프로그램은 날짜와 파일이름을 대치할 수 있게 해주지만, 폴더이름은 해주지 않았다.

나는 카테고리를 폴더명으로 하고 있기 때문에 폴더이름을 대치할 수 있게 코드를 수정하였고 아래 사진에서 볼 수있듯이 여러 템플릿을 사용할 수 있게 하였다.

![front matter gen](https://github.com/Nor-s/front-matter-gen/raw/HEAD/assets/template_test.gif "front-matter")

아래는 템플릿 예시이다.

```markdown
---
layout: post
title:
date: %yyyy%-%mm%-%dd%T%hh%:%ii%:%ss%Z
category: %dir0%
author: User
tags: [tag1, tag2]
summary: Summary of the article
---
```

또한 기본확장자를 지정할 수 있게 하여 마크다운 뿐만이 아니라 다른 곳에서도 사용가능하도록 설정을 추가하였다.
(ex. 알고리즘 문제 템플릿)

## **# 링크**

---

[front-matter-gen-marketplace](https://marketplace.visualstudio.com/items?itemName=Nor-s.front-matter-gen)

[front-matter-gen-git](https://github.com/Nor-s/front-matter-gen)

[vscode marketplace manage](https://marketplace.visualstudio.com/manage/publishers/)
