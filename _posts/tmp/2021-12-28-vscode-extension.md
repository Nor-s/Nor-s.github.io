---
title: "[vscode] 확장프로그램 제작"
date: 2021-12-28T17:6:24Z
category: vscode
tags: [vscode]
published: false
---

## vscode 확장프로그램 시작하기

[vscode-your-first-extension](https://code.visualstudio.com/api/get-started/your-first-extension)

```shell
yo code
# ? What type of extension do you want to create? New Extension (TypeScript)
# ? What's the name of your extension? HelloWorld
### Press <Enter> to choose default for all options below ###

# ? What's the identifier of your extension? helloworld
# ? What's the description of your extension? LEAVE BLANK
# ? Initialize a git repository? Yes
# ? Bundle the source code with webpack? No
# ? Which package manager to use? npm

# ? Do you want to open the new folder with Visual Studio Code? Open with `code`
```

## activity bar 추가

[extension code for contributing to the activity bar](https://code.visualstudio.com/updates/v1_23#_contributions-to-the-activity-bar)

```json
"contributes": {
        "viewsContainers": {
            "activitybar": [
                {
                    "id": "package-explorer",
                    "title": "Package Explorer",
                    "icon": "resources/package-explorer.svg"
                }
            ]
        },
        "views": {
            "package-explorer": [
                {
                    "id": "package-dependencies",
                    "name": "Dependencies"
                },
                {
                    "id": "package-outline",
                    "name": "Outline"
                }
            ]
        }
}
```

## child process

- 다른 프로세스 실행하여, 값을 얻어온다
- list, 

## publish 하기

[vscode-publish](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

```shell
npm install -g vsce
cd myExtension
vsce package
# myExtension.vsix generated
vsce publish
# <publisherID>.myExtension published to VS Code Marketplace
```

## 마켓플레이스에서 확인

[Visual Studio Marketplace publisher management page] (https://marketplace.visualstudio.com/manage)
