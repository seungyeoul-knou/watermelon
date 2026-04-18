---
name: wm-help
description: Watermelon help skill. Shows a formatted list of all available wm-* commands with descriptions and usage examples. Use when the user says "/wm-help", "wm help", "what wm commands are there", or asks about Watermelon commands.
user_invocable: true
---

# Watermelon Help

Detect the user's language and output the matching section below **exactly as formatted** (render as readable text, not a code block).

**Language detection — check in this order, use the first signal found:**

1. **Conversation language**: the language the user wrote the current message in
2. **System locale**: run `echo $LANG` or `locale` in shell — use the language portion (e.g. `ko` from `ko_KR.UTF-8`, `en` from `en_US.UTF-8`)
3. **OS language**: check `defaults read -g AppleLanguages 2>/dev/null` (macOS) or `/etc/locale.conf` (Linux)
4. **Fallback**: English

Map detected language to output:

- `ko` / `ko_KR` → **Korean** section
- Anything else → **English** section

---

## Korean output

## Watermelon 명령어 도움말

### 실행

| 명령어                           | 설명                                                | 사용 예시                               |
| -------------------------------- | --------------------------------------------------- | --------------------------------------- |
| `/wm-start`                      | 워크플로 선택 후 즉시 실행. 미완료 태스크 복구 포함 | `/wm-start`                             |
| `/wm-start <이름>`               | 이름으로 워크플로 매칭 후 바로 실행                 | `/wm-start 시장조사`                    |
| `/wm-start <ID>`                 | 워크플로 ID로 바로 실행 (숫자)                      | `/wm-start 42`                          |
| `/wm-start #<태스크ID>`          | 특정 태스크 직접 재개                               | `/wm-start #108`                        |
| `/wm-start <이름> :: <프롬프트>` | 워크플로 지정 + 초기 컨텍스트 전달                  | `/wm-start 코드리뷰 :: PR #77 리뷰해줘` |
| `/wm-next`                       | 실행 중인 태스크를 찾아 현재 스텝부터 재개          | `/wm-next`                              |
| `/wm-approve`                    | 대기 중인 HITL 승인 처리                            | `/wm-approve`                           |
| `/wm-rewind`                     | 이전 스텝으로 되돌리기                              | `/wm-rewind`                            |

### 설계 / 관리

| 명령어            | 설명                                              | 사용 예시                                         |
| ----------------- | ------------------------------------------------- | ------------------------------------------------- |
| `/wm-design`      | 자연어 목표로 새 워크플로 설계 및 등록            | `/wm-design 경쟁사 분석 워크플로 만들어줘`        |
| `/wm-import`      | GitHub / 로컬 스킬 / URL을 분석해 워크플로로 변환 | `/wm-import yamadashy/repomix`                    |
|                   |                                                   | `/wm-import wm-design`                            |
|                   |                                                   | `/wm-import https://example.com/runbook`          |
|                   |                                                   | `/wm-import` (대화형 — 텍스트·JSON 붙여넣기 포함) |
| `/wm-improve`     | 기존 워크플로 분석 후 개선 버전 생성              | `/wm-improve 시장조사`                            |
| `/wm-version`     | 버전 목록 조회, 활성화/비활성화, 버전 비교        | `/wm-version`                                     |
| `/wm-instruction` | 에이전트 인스트럭션 템플릿 생성·수정·삭제         | `/wm-instruction`                                 |
| `/wm-credential`  | 외부 서비스 API 키 등록·수정·삭제                 | `/wm-credential`                                  |

### 조회 / 공유

| 명령어       | 설명                               | 사용 예시                       |
| ------------ | ---------------------------------- | ------------------------------- |
| `/wm-status` | 실행 중·완료된 태스크 현황 조회    | `/wm-status`                    |
| `/wm-report` | 태스크 결과 구조화 리포트 생성     | `/wm-report`                    |
| `/wm-share`  | 워크플로·폴더를 그룹에 공유        | `/wm-share 시장조사 → 마케팅팀` |
| `/wm-scan`   | 로컬 저장소 보안·컴플라이언스 스캔 | `/wm-scan`                      |

---

**팁:**

- `/wm-start`는 `/wm-run`의 상위 호환입니다 — 두 명령어 모두 동작합니다.
- 태스크 재개가 필요하면 `/wm-start` (인자 없음) 또는 `/wm-start #<태스크ID>`를 사용하세요.
- 도움말은 언제든 `/wm-help`로 다시 볼 수 있습니다.

---

## English output

## Watermelon Command Reference

### Execution

| Command                        | Description                                            | Example                                  |
| ------------------------------ | ------------------------------------------------------ | ---------------------------------------- |
| `/wm-start`                    | Pick a workflow and run it. Recovers incomplete tasks. | `/wm-start`                              |
| `/wm-start <name>`             | Match workflow by name and run immediately             | `/wm-start market-research`              |
| `/wm-start <ID>`               | Run workflow by numeric ID                             | `/wm-start 42`                           |
| `/wm-start #<taskID>`          | Resume a specific task directly                        | `/wm-start #108`                         |
| `/wm-start <name> :: <prompt>` | Specify workflow + pass initial context                | `/wm-start code-review :: review PR #77` |
| `/wm-next`                     | Find the active task and resume from the current step  | `/wm-next`                               |
| `/wm-approve`                  | Process a pending HITL approval                        | `/wm-approve`                            |
| `/wm-rewind`                   | Roll back to the previous step                         | `/wm-rewind`                             |

### Design / Management

| Command           | Description                                                         | Example                                               |
| ----------------- | ------------------------------------------------------------------- | ----------------------------------------------------- |
| `/wm-design`      | Design and register a new workflow from a natural language goal     | `/wm-design build a competitor analysis workflow`     |
| `/wm-import`      | Analyze a GitHub repo / local skill / URL and convert to a workflow | `/wm-import yamadashy/repomix`                        |
|                   |                                                                     | `/wm-import wm-design`                                |
|                   |                                                                     | `/wm-import https://example.com/runbook`              |
|                   |                                                                     | `/wm-import` (interactive — includes text/JSON paste) |
| `/wm-improve`     | Analyze an existing workflow and generate an improved version       | `/wm-improve market-research`                         |
| `/wm-version`     | List versions, activate/deactivate, compare versions                | `/wm-version`                                         |
| `/wm-instruction` | Create, edit, or delete agent instruction templates                 | `/wm-instruction`                                     |
| `/wm-credential`  | Register, edit, or delete external service API keys                 | `/wm-credential`                                      |

### Monitoring / Sharing

| Command      | Description                                        | Example                                      |
| ------------ | -------------------------------------------------- | -------------------------------------------- |
| `/wm-status` | View running and completed task status             | `/wm-status`                                 |
| `/wm-report` | Generate a structured report from task results     | `/wm-report`                                 |
| `/wm-share`  | Share a workflow or folder with a group            | `/wm-share market-research → marketing-team` |
| `/wm-scan`   | Run a security and compliance scan on a local repo | `/wm-scan`                                   |

---

**Tips:**

- `/wm-start` is a superset of `/wm-run` — both commands work.
- To resume a task, use `/wm-start` (no args) or `/wm-start #<taskID>`.
- Run `/wm-help` anytime to see this reference again.
