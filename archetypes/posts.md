---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
description: "Put your description here"
images: [ "{{ path.Dir .File.Path }}/images/post-image.jpg" ]
tags: ["[untagged]"]
toc: true
scrollToTop: true
---

![Featured post image](images/post-image.jpg)
