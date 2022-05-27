---
letter_id: "{{letter_id}}"
title: "{{ replace .TranslationBaseName "-" " " | title }}"
ititle: "{{ replace .TranslationBaseName "-" " " | ititle }}"
ltr_date: "{{ descriptive date string }}"
draft: true
type: "letter"
created: {{ dateFormat "2006-01-02" .Date }}
modified: {{ dateFormat "2006-01-02" .Date }}
url: "/letter/{{id}}"
senders:
- id: {{woman_id | person_id}}
  name: {{name}}
  type: {{type}}
receivers:
- id: {{woman_id}}
  name: {{name}}
  type: {{type}}
---
