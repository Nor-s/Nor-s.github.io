---
title: "[그래프] 벨만-포드 최단 경로 알고리즘"
date: 2022-03-21T19:45:4Z
category: algorithm
tags: [algorithm]
---

# **Bellman-Ford**

- 다익스트라같이 단일 시작점 최단 경로 알고리즘

  - 하지만 다익스트라는 `음수` 간선이 있는 경우 잘 동작하지 않음

- 벨만포드: 음수 사이클 여부 파악 가능, 음수 간선이 있어도 최단 경로 찾기 가능
  - 시작점에서 각 정점까지 가는 최단 거리의 상한을 적당히 예측한 뒤 예측값과 실제 최단 거리 사이의 오차를 반복적으로 줄여가는 방식으로 동작.
  - 각 정점까지의 최단 거리의 상한을 담은 배열 `upper[]`를 유지해야함

## **동작과정**

- 초기

  - 그래프 구조에 대해 무지한 상태
  - 시작점 s: `upper[s] = 0`
  - 나머지: `upper[x] = inf`

    > 벨만-포드 알고리즘은 이 `upper`값을 실제 최단 거리에 더 가깝게 갱신하기 위해 최단 거리의 특성을 이용한다.

    > 최단거리 특성: `dist[v] <= dist[u] + w(u,v)` 이 식이 시작점에서 u와 v 까지의 최단거리는 항상 이 식을 만족한다.

    > 이 특성을 이용하면, `upper`의 값을 최단거리에 가깝게 갱신 가능

- 완화(relax)

  - `upper[u] + w(u, v) < upper[v]`
    - u까지 가는 최단 거리는 항상 `upper[u]` 또는 더 짧다.
    - 이 때 `w(u, v)`를 붙인 경로의 길이는 결국 `upper[u] + w(u,v)`가 상한이된다.
    - 따라서 이를 만족하면 `upper[v]` 를 `upper[u] + w(u, v)`로 갱신해도 된다.

- 반복
  - 완화과정을 모든 간선에 대해 반복적으로 실행
  - 성공시 upper는 감소, 결국 최단 거리에 가까워짐

## **종료 조건과 정당성 증명**

- s 에서 어떤 정점 u 까지의 최단 경로가 다음과 같다

```txt
s / - a - b - c - u
s - a / - b - c - u
s - a - b / - c - u
s - a - b - c / - u
s - a - b - c - u
```

- 최단 경로가 보장된 정점은 `/` 왼쪽 부분

- 처음 upper[s] = 0

- 완화1: 모든 간선완화, (s, a) 또한 완화됨

  - `upper[a] <= upper[s] + w(s, a)` 수식이 이후로 항상 성립하게됨
  - 즉, upper[s] 는 0 이므로 `upper[a]<= w(s,a)`
  - 여기서 w(s,a)는 항상 최단거리 (s-a-b-c-u 가 최단경로라는 가정에 의해)
  - 따라서 a에 대한 최단 거리를 찾음

- 완화2: `upper[b]` 가 최단이 됨.

  - `s-a` 가 최단이고 거기에 (a,b) 간선이 붙어서 업데이트됨

- 완화4: 결국 `upper[u] = dist[u]`까지 업데이트됨

- 완화n: 완화 작업 n 번하면 n개 이하의 간선을 사용하는 최단 경로들을 전부 찾을 수 있다. - 최단 경로는 최대 |V| 개의 정점을 갖기 때문에 최대 |V|-1 개의 간선을 가질 수 있다. - 따라서 모든 간선에 대해 완화 과정은 전체 `|V|-1`번이면 충분
  > **음수 사이클이 없는 그래프에서 최단 경로가 한 정점을 두 번 지나는 일은 없다**

## **음수 사이클 판정**

- |V|번 완화하면됨.
  - 사이클이 있으면, 그 사이클에서 완화가 이루어져 업데이트된다.

## **코드**

- 모든 간선 검사는 중첩 반복문
  - 가장 밖의 for문: |V|번 수행됨
  - 안의 두 for문은 모든 간선을 순회하므로 O(|E|)
  - 결국 전체 시간 복잡도는 O(|V||E|)

```cpp
int V;

vector<pair<int, int> > adj[MAX_V];

vector<int> bellmanFord(int src)
{
    vector<int> upper(V, INF);
    upper[src] = 0;
    bool updated;

    for(int iter = 0; iter < V; ++iter)
    {
        updated = false;
        for(int here = 0; here < V; ++here)

            for(int i = 0; i < adj[here].size(); i++)
            {
                int there = adj[here][i].first;
                int cost = adj[here][i].second;
                if(upper[there] > upper[here] + cost)
                {
                    upper[there] = upper[here] + cost;
                    updated = true;
                }
            }
        if(!updated) break;
    }
    if(updated) upper.clear();
    return upper;
}
```

## **실제 경로 계산**

- 알고리즘 수행과정에서 각 정점을 마지막으로 완화시킨 간선들을 모와 스패닝 트리를 만든다.
  - 각 정점을 마지막으로 완화 시킨 간선들은 항상 최단 경로 위에 있음
  - 각 정점에서부터 루트까지 거슬러 올라가면 최단 경로가 됨
