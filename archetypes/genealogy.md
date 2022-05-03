---
title: "{{ replace .TranslationBaseName "-" " " | title }}"
created: {{ dateFormat "2006-01-02" .Date }}
modified: {{ dateFormat "2006-01-02" .Date }}
draft: true
type: "post"
drupal_type: "panopoly_page"
---