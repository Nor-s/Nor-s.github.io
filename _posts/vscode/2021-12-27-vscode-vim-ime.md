---
title: "[vscode] vim 노말모드 영문키 자동 변환"
date: 2021-12-27T17:1:24Z
category: vscode
tags: [vscode]
---

---

vim을 사용하다보면 노말모드에서 한영키가 거슬리는 일이 많이 일어난다.

vscode vim 의 `vim.autoSwitchInputMethod` 을 세팅하면 이런 불편함을 어느정도 해결할 수 있다.

이 포스트는 윈도우 기준으로 작성했지만, MacOS도 적용 가능하다.

---

## **# im-select 설치**

[im-select](https://github.com/daipeihust/im-select#installation)

위에서 `im-select.exe`를 다운받는다.

---

## **# vscode-vim 설정**

- vscode 세팅에 다음과 같이 defaultIM에 윈도우 영문 입력기 코드인 `1033`과 im-select 경로를 입력해주면 끝.

```json
    "vim.autoSwitchInputMethod.enable": true,
    "vim.autoSwitchInputMethod.defaultIM": "1033",
    "vim.autoSwitchInputMethod.obtainIMCmd": "D:\\Study\\im-select.exe",
    "vim.autoSwitchInputMethod.switchIMCmd": "D:\\Study\\im-select.exe {im}",
```

---

## **# 주의점**

- 다른 모드에서 노말 모드로 변경 시에만 적용이된다. 즉, 다른 창에서 에디터로 들어오면 한영키는 그대로.
- 따로 설정하지 않았다면, 영문 입력기 사용 중 한영키를 누르지 말것.(alt + shift시 변경가능)
- 당연히 영문 입력기가 설치되어 있어야한다.
- vscode vim에 한글과 관련한 버그가 있다.

---

## **# 공식문서**

[vim input method](https://github.com/VSCodeVim/Vim#:~:text=camelCase%20word%20segment.-,Input%20Method,-Disable%20input%20method)
