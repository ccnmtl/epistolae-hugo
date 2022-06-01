---
people_id: ""
title: "{{ replace .TranslationBaseName "-" " " | title }}"
ititle: 
draft: true
type: "people"
created: {{ dateFormat "2006-01-02" .Date }}
modified: {{ dateFormat "2006-01-02" .Date }}
url: ""
sent:
- id: {{letter_id}}
  name: "{{name}}"
received:
- id: {{letter_id}}
  name: {{name}}
---
