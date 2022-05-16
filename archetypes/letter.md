---
title: "{{ replace .TranslationBaseName "-" " " | title }}"
ititle: "{{ replace .TranslationBaseName "-" " " | ititle }}"
created: {{ dateFormat "2006-01-02" .Date }}
modified: {{ dateFormat "2006-01-02" .Date }}
draft: true
type: "post"
section: "letters"
url: "/letter/{{id}}"
senders:
- id: {{sender_id}}
  name: {{name}}
receivers:
- id: {{sender_id}}
  name: {{name}}
---
